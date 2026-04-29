import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality } from "@google/genai";
import { GEMINI_API_KEY } from '../lib/firebase';

const VoiceControl = ({ 
  onNavigate, 
  onToggleTheme, 
  onOpenChat,
  onOpenCmd,
  isPermissionGranted
}) => {
  const [status, setStatus] = useState('offline'); // offline, connecting, listening, speaking
  const [isActive, setIsActive] = useState(false);
  const isAutoWelcomeStarted = useRef(false);

  // Sync status to ref to avoid stale closures in audio processing
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (isPermissionGranted && !isActive && !isAutoWelcomeStarted.current) {
      const handleFirstInteraction = () => {
        if (!isAutoWelcomeStarted.current) {
          isAutoWelcomeStarted.current = true;
          setIsActive(true);
          startSession('welcome');
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
        }
      };
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [isPermissionGranted, isActive]);

  // Audio Refs
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);
  const outputContextRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const isWorkletLoadedRef = useRef(false);
  
  // Gemini Refs
  const sessionRef = useRef(null);

  // Initialize Audio Contexts
  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = outputContextRef.current.currentTime;
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    if (outputContextRef.current.state === 'suspended') {
      await outputContextRef.current.resume();
    }
  };

  const playAudio = async (base64String) => {
    const ctx = outputContextRef.current;
    if (!ctx) return;

    try {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const dataInt16 = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(dataInt16.length);
      for (let i = 0; i < dataInt16.length; i++) {
        float32Data[i] = dataInt16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
      
      setStatus('speaking');
      source.onended = () => {
        if (ctx.currentTime >= nextStartTimeRef.current - 0.1) {
          setStatus('listening');
        }
      };
    } catch (err) {
      console.error('CIPHER Playback Error:', err);
    }
  };

  const setupAudioInput = async (session) => {
    if (!streamRef.current) return;
    
    const ctx = audioContextRef.current;
    
    if (!isWorkletLoadedRef.current) {
      const workletCode = `
        class PCMProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) {
              const float32Data = input[0];
              this.port.postMessage(float32Data);
            }
            return true;
          }
        }
        registerProcessor('pcm-processor', PCMProcessor);
      `;

      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await ctx.audioWorklet.addModule(workletUrl);
      isWorkletLoadedRef.current = true;
    }
    
    sourceRef.current = ctx.createMediaStreamSource(streamRef.current);
    processorRef.current = new AudioWorkletNode(ctx, 'pcm-processor');
    
    processorRef.current.port.onmessage = (e) => {
      // Aggressive check: must be listening and session must exist
      if (statusRef.current === 'listening' && sessionRef.current) {
        const inputData = e.data;
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        }
        
        const b64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));

        try {
          sessionRef.current.sendRealtimeInput({
            audio: { data: b64, mimeType: 'audio/pcm;rate=16000' }
          });
        } catch (err) {
          // Quietly catch any remaining racing socket errors
        }
      }
    };

    sourceRef.current.connect(processorRef.current);
    processorRef.current.connect(ctx.destination);
  };

  const cleanupResources = useCallback(() => {
    // Immediate signal to stop all processing
    statusRef.current = 'offline';
    setStatus('offline');

    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.port.onmessage = null; // Kill the listener first
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
  }, []);

  const startSession = async (mode = 'interactive') => {
    setStatus('connecting');
    try {
      await initAudio();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      const session = await ai.live.connect({
        model: "gemini-2.0-flash-exp",
        callbacks: {
          onopen: async () => {
            console.log('CIPHER Uplink: Protocol Synchronized');
            setTimeout(async () => {
              if (sessionRef.current) {
                await setupAudioInput(sessionRef.current);
                setStatus('listening');
              }
            }, 10);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) await playAudio(base64Audio);

            const functionCall = message.serverContent?.modelTurn?.parts?.[0]?.functionCall;
            if (functionCall) handleToolCall(functionCall, session);

            if (message.serverContent?.interrupted) console.log('CIPHER Interrupted');
          },
          onclose: (e) => {
            console.log('CIPHER Uplink Closed:', e);
            cleanupResources();
            setIsActive(false);
          },
          onerror: (err) => {
            console.error('CIPHER Uplink Error:', err);
            setStatus('error');
            setTimeout(() => {
               if (statusRef.current === 'error') setIsActive(false);
            }, 4000);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction: `You are CIPHER OS, the high-tech AI interface for Tivora Motors. You are sleek, professional, and efficient. 
          You can control the interface using tools.
          Site Structure:
          - Home: Featured luxury vehicles and brand highlights.
          - Inventory: The full list of available vehicles.
          - About: Our mission and legacy.
          - Contact: Get in touch.
          - Dashboard: User profile and saved vehicles.
          - Cart: The checkout area for vehicle reservations.
          
          Navigation Logic:
          - If the user says 'showroom', 'cars', or 'stock', navigate to 'inventory'.
          - If they say 'profile' or 'account', navigate to 'dashboard'.
          - If they want to see their saved cars or purchases, navigate to 'cart'.
          
          Behavior:
          - Be concise.
          - Use futuristic, automotive terminology.
          ${mode === 'welcome' ? 'Initial link established. Greet the user with "CIPHER OS online. Ready for command." and invite exploration.' : ''}`,
          tools: [{
            functionDeclarations: [
              {
                name: "navigate",
                description: "Navigate to different sections of the website",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    section: { type: "STRING", enum: ["home", "inventory", "about", "contact", "dashboard", "cart"] }
                  },
                  required: ["section"]
                }
              },
              {
                name: "toggle_theme",
                description: "Toggle between light and dark mode"
              },
              {
                name: "open_assistant",
                description: "Open the text-based AI chat assistant"
              }
            ]
          }]
        },
      });

      sessionRef.current = session;
    } catch (err) {
      console.error('CIPHER Session Initiation Failed:', err);
      setStatus('error');
    }
  };

  const handleToolCall = (call, session) => {
    const { name, args, callId } = call;
    let result = { success: true };

    console.log('CIPHER Tool Call:', name, args);

    switch (name) {
      case 'navigate':
        if (args.section) onNavigate(args.section);
        break;
      case 'toggle_theme':
        onToggleTheme();
        break;
      case 'open_assistant':
        onOpenChat();
        break;
      default:
        result = { error: 'Unknown protocol command' };
    }

    session.sendToolResponse({
      functionResponses: [{
        name,
        response: { result },
        id: callId
      }]
    });
  };

  const stopSession = () => {
    cleanupResources();
    setIsActive(false);
  };

  const toggleVoice = () => {
    if (isActive) {
      stopSession();
      setIsActive(false);
    } else {
      isAutoWelcomeStarted.current = true; // Prevent auto-welcome from triggering if manually started
      setIsActive(true);
      startSession();
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#030303]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] min-w-[250px] pointer-events-auto ring-1 ring-white/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1.5 h-6 items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={status === 'speaking' || status === 'listening' ? {
                      height: [4, 24, 8, 18, 4],
                      backgroundColor: status === 'speaking' ? '#ffffff' : '#10b981'
                    } : { height: 4, backgroundColor: '#333333' }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-1 rounded-full"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] leading-none mb-1">
                  Cipher OS
                </p>
                <p className="text-[14px] font-black text-white uppercase tracking-tighter leading-none italic">
                  {status === 'connecting' ? 'Establishing...' : 
                   status === 'listening' ? 'Secure Link' : 
                   status === 'speaking' ? 'Transmitting' : 
                   status === 'error' ? 'Uplink Error' : 'Standby'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-white/80">
                  {status === 'connecting' ? 'Neural handshake in progress' :
                   status === 'listening' ? 'Awaiting voice command' :
                   status === 'speaking' ? 'Data stream active' : 
                   status === 'error' ? 'Protocol failed. Restarting...' : 'Link offline'}
                </p>
                <div className={`w-2 h-2 rounded-full ${
                  status === 'listening' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                  status === 'error' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-white/10'
                }`} />
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Model: Kore-v2.5</span>
                <span className="flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full animate-pulse ${status === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {status === 'error' ? 'Offline' : 'Live'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering window-level auto-welcome
          toggleVoice();
        }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.95 }}
        className={`pointer-events-auto p-4 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border ring-1 ${
          isActive 
            ? status === 'error' ? 'bg-red-500/20 border-red-500 text-red-500 ring-red-500/20' : 'bg-white border-white text-black ring-white/20' 
            : 'bg-black/80 backdrop-blur-md border-white/10 text-white ring-white/5'
        }`}
      >
        {status === 'connecting' || status === 'error' ? (
          <Loader2 className={`animate-spin ${status === 'error' ? 'text-red-500' : ''}`} size={24} />
        ) : isActive ? (
          status === 'speaking' ? <Volume2 size={24} /> : <Mic size={24} />
        ) : (
          <MicOff size={24} className="opacity-50" />
        )}
      </motion.button>
    </div>
  );
};

export default VoiceControl;

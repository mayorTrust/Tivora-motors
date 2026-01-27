import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Mic, MicOff, Zap, Mic2, Navigation, Command, Search as SearchIcon, Sparkles, Globe, Cpu, Languages, Terminal, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { INITIAL_VEHICLES } from '../constants';

const HINTS = [
  "Kaia, explain the Ferrari features in Yoruba accent",
  "Kaia, switch to a cyberpunk theme instantly",
  "Kaia, greet me in Swahili with a native accent",
  "Kaia, research electric bikes in Zulu",
  "Kaia, parle en Français avec l'accent Parisien",
  "Kaia, change the background color to emerald",
  "Kaia, scroll down and show me more",
  "Kaia, find a red car in the showroom"
];

const VoiceControl = () => {
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState('idle');
  const [showHints, setShowHints] = useState(true);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [permissionError, setPermissionError] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Audio Refs
  const inputContextRef = useRef(null);
  const outputContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef(null);
  const hintIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  useEffect(() => {
    if (permissionError && modalRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [permissionError]);

  useEffect(() => {
    if (showHints) {
      hintIntervalRef.current = setInterval(() => {
        setCurrentHintIndex(prev => (prev + 1) % HINTS.length);
      }, 4000);
    } else if (hintIntervalRef.current) {
      clearInterval(hintIntervalRef.current);
    }
    return () => {
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
    };
  }, [showHints]);

  // --- TOOLS DEFINITION ---

  const navigateTool = {
    name: 'navigate',
    description: 'Navigate to a specific general route of the website.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        route: {
          type: Type.STRING,
          enum: ['/', '/inventory', '/about', '/contact', '/admin'],
          description: 'The route path.',
        },
      },
      required: ['route'],
    },
  };

  const searchTool = {
    name: 'search_inventory',
    description: 'Search for vehicles, bikes, or rides in the current shop inventory.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'The search term (brand, model, or keyword like "red").',
        },
        category: {
          type: Type.STRING,
          enum: ['All', 'Car', 'Bike', 'Bicycle', 'Scooter', 'Skateboard'],
          description: 'The vehicle category to filter by.',
        },
      },
    },
  };

  const viewVehicleTool = {
    name: 'view_vehicle',
    description: 'Navigate to the details page of a SPECIFIC vehicle in our inventory.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        vehicle_name: {
          type: Type.STRING,
          description: 'The approximate name of the vehicle to find.',
        },
      },
      required: ['vehicle_name'],
    },
  };

  const uiControlTool = {
    name: 'control_ui',
    description: 'Control interface elements like theme, scrolling, or opening AI features.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          enum: [
            'toggle_theme',
            'scroll_top', 'scroll_bottom', 'scroll_down', 'scroll_up',
            'open_dream_machine', 'open_quantum_analyst', 'open_theme_generator', 'open_motion_studio'
          ],
          description: 'The UI action to perform.',
        },
      },
      required: ['action'],
    },
  };

  const researchTool = {
    name: 'research_web',
    description: 'Research specific details about ANY car, motorcycle, bicycle, scooter, skateboard, or general mobility tech.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'The mobility-focused search query.',
        },
      },
      required: ['query'],
    },
  };

  const vehicleContext = INITIAL_VEHICLES.map(v => 
    `${v.id}: ${v.name} (${v.brand}, ${v.category}, $${v.price}, ${v.color})`
  ).join('\n');

  const systemInstruction = `
    Identity & Persona: 
    - You are KAIA (Kinetic Artificial Intelligence Assistant). 
    - You are an incredibly sophisticated, articulate, and fiercely loyal AI OS, inspired by technical butlers.
    - Your core personality is professional, precise, and highly intelligent. 
    
    Adaptive Linguistic Matrix (Authentic Accents):
    - You are a universal polyglot with deep mastery of ALL world languages and local dialects.
    - NATIVE PERFORMANCE: When speaking or translating into specific languages, you MUST adopt the authentic native accent and cultural cadence of that region. Sounding "local" is part of your adaptive interface.
    - Address the user as "sir" or "ma'am" (or equivalent respectful local terms).

    Instant Asset & System Control:
    - You have direct control over the website's layout and themes.
    - Execute 'control_ui' immediately upon command.

    Role:
    - Curator and guardian of Trust Motors.
    - Handle showroom navigation, inventory searches, and technical mobility research. 
    
    DATABASE:
    ${vehicleContext}

    GREETING:
    - Start with: "Kaia online. Adaptive Linguistic Matrix synchronized. Native accents active. How may I assist your Trust Motors experience today, sir?"
  `;

  const performWebSearch = async (query) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `As KAIA, research this query and provide a sophisticated summary. Query: ${query}`,
        config: { tools: [{ googleSearch: {} }] },
      });
      return response.text || "I'm afraid the global archives are inaccessible at present, sir.";
    } catch (error) {
      return "The research uplink has encountered a temporary interference.";
    }
  };

  const startSession = async () => {
    if (!process.env.API_KEY) return;
    await stopSession();
    if (!navigator.onLine) { setPermissionError(true); return; }

    setShowHints(false);
    setStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { channelCount: 1, echoCancellation: true } 
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      inputContextRef.current = new AudioCtx({ sampleRate: 16000 });
      outputContextRef.current = new AudioCtx({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO], 
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          tools: [{ functionDeclarations: [navigateTool, searchTool, viewVehicleTool, uiControlTool, researchTool] }],
          systemInstruction: systemInstruction
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            isActiveRef.current = true;
            setLastCommand({ text: "KAIA: LINGUISTIC MATRIX SYNCED", icon: <Languages size={14} /> });
            setupAudioInput(sessionPromise);
            
            setTimeout(() => setLastCommand(null), 2500);
          },
          onmessage: async (msg) => {
            if (msg.toolCall) {
              setStatus('processing');
              await handleToolCalls(msg.toolCall, sessionPromise);
            }
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              await playAudio(audioData);
              setTimeout(() => {
                  if(isActiveRef.current && status !== 'processing') setStatus('listening');
              }, 2000); 
            }
          },
          onclose: () => stopSession(),
          onerror: () => { stopSession(); setPermissionError(true); }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      stopSession();
      setPermissionError(true);
    }
  };

  const handleToolCalls = async (toolCall, sessionPromise) => {
    const functionResponses = await Promise.all(toolCall.functionCalls.map(async (fc) => {
      const { name, args } = fc;
      let result = "Action confirmed, sir.";

      if (name === 'navigate') {
        setLastCommand({ text: `KAIA: Routing to ${args.route}`, icon: <Navigation size={14} /> });
        navigate(args.route);
        result = `Redirecting to the ${args.route} sector immediately.`;
      } else if (name === 'search_inventory') {
        const params = new URLSearchParams();
        if (args.query) params.append('search', args.query);
        if (args.category && args.category !== 'All') params.append('category', args.category);
        navigate(`/inventory?${params.toString()}`);
        setLastCommand({ text: `KAIA: SCANNING SHOWROOM`, icon: <SearchIcon size={14} /> });
        result = `Showroom filters applied. All matching assets displayed.`;
      } else if (name === 'view_vehicle') {
        const target = INITIAL_VEHICLES.find(v => v.name.toLowerCase().includes(args.vehicle_name.toLowerCase()));
        if (target) {
          navigate(`/vehicle/${target.id}`);
          setLastCommand({ text: `KAIA: ANALYZING ${target.name.toUpperCase()}`, icon: <Command size={14} /> });
          result = `Isolating data for the ${target.name} now, sir.`;
        }
      } else if (name === 'control_ui') {
        if (args.action === 'toggle_theme') window.dispatchEvent(new CustomEvent('tivora-theme-toggle'));
        else if (args.action === 'open_dream_machine') window.dispatchEvent(new CustomEvent('tivora-open-dream-machine'));
        else if (args.action === 'open_motion_studio') window.dispatchEvent(new CustomEvent('tivora-open-motion-studio'));
        else if (args.action === 'open_quantum_analyst') window.dispatchEvent(new CustomEvent('tivora-open-quantum-analyst'));
        else if (args.action === 'open_theme_generator') window.dispatchEvent(new CustomEvent('tivora-open-theme-generator'));
        else if (args.action.includes('scroll')) {
            if (args.action === 'scroll_top') window.scrollTo({ top: 0, behavior: 'smooth' });
            if (args.action === 'scroll_bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        setLastCommand({ text: `KAIA: INSTANT ASSET SWAP`, icon: <Zap size={14} /> });
        result = `Interface reconfigured instantly. No refresh required, sir.`;
      } else if (name === 'research_web') {
        setLastCommand({ text: `KAIA: SYNCING GLOBAL DATA`, icon: <Globe size={14} /> });
        result = await performWebSearch(args.query);
      }

      setTimeout(() => setLastCommand(null), 3000);
      return { id: fc.id, name: fc.name, response: { result: result } };
    }));

    sessionPromise.then((session) => {
      session.sendToolResponse({ functionResponses });
    });
    setStatus('listening');
  };

  const setupAudioInput = (sessionPromise) => {
    const ctx = inputContextRef.current;
    if(!ctx || !streamRef.current) return;
    sourceRef.current = ctx.createMediaStreamSource(streamRef.current);
    processorRef.current = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current.onaudioprocess = (e) => {
      if (!isActiveRef.current) return;
      const inputData = e.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
      setVolume(Math.sqrt(sum / inputData.length));
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
      const bytes = new Uint8Array(int16.buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: btoa(binary) } });
      }).catch(() => {});
    };
    sourceRef.current.connect(processorRef.current);
    processorRef.current.connect(ctx.destination);
  };

  const playAudio = async (base64String) => {
    const ctx = outputContextRef.current;
    if (!ctx) return;
    try {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const dataInt16 = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(dataInt16.length);
      for (let i = 0; i < dataInt16.length; i++) float32Data[i] = dataInt16[i] / 32768.0;
      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) nextStartTimeRef.current = currentTime;
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
    } catch (e) {}
  };

  const stopSession = async () => {
    setIsActive(false); isActiveRef.current = false; setStatus('idle'); setVolume(0); setShowHints(true);
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (sourceRef.current) { sourceRef.current.disconnect(); sourceRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') { await inputContextRef.current.close(); inputContextRef.current = null; }
    if (outputContextRef.current && outputContextRef.current.state !== 'closed') { await outputContextRef.current.close(); outputContextRef.current = null; }
    sessionRef.current = null; nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isActiveRef.current) {
        ctx.beginPath();
        const radius = 30 + (volume * 200); 
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = status === 'speaking' ? `rgba(0, 243, 255, ${0.7 + volume})` : `rgba(255, 255, 255, ${0.4 + volume})`;
        ctx.lineWidth = 4; ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius * 0.8, 0, 2 * Math.PI);
        ctx.fillStyle = status === 'speaking' ? `rgba(0, 243, 255, ${0.2 + volume})` : `rgba(255, 255, 255, ${0.1 + volume})`;
        ctx.fill();
        
        if (status === 'processing') {
           ctx.beginPath();
           ctx.arc(canvas.width / 2, canvas.height / 2, radius + 15, Date.now() / 80, (Date.now() / 80) + 1.2);
           ctx.strokeStyle = '#00f3ff';
           ctx.lineWidth = 3;
           ctx.stroke();
        }
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, volume, status]);

  return (
    <>
      {permissionError && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
            <div ref={overlayRef} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPermissionError(false)} />
            <div ref={modalRef} className="relative bg-[#050505]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center">
                <MicOff className="w-12 h-12 text-[#00f3ff] mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase text-white mb-2">Protocol Interrupted</h3>
                <p className="text-xs text-gray-500 mb-6">Microphone access is required for Kaia OS.</p>
                <button onClick={() => { setPermissionError(false); startSession(); }} className="w-full py-3 bg-[#00f3ff] text-black font-black uppercase tracking-widest text-[10px] rounded-xl">Initialize Uplink</button>
            </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {lastCommand && (
           <div className="bg-[#00f3ff] text-black px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest animate-in slide-in-from-right fade-in duration-300 shadow-lg flex items-center gap-2">
               {lastCommand.icon} {lastCommand.text}
           </div>
        )}

        {showHints && !isActive && (
          <div className="absolute bottom-full right-0 mb-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 shadow-2xl relative">
               <p className="text-[9px] uppercase tracking-[0.5em] font-black text-[#00f3ff] mb-1">KAIA COMMAND</p>
               <p key={currentHintIndex} className="text-xs font-bold text-white italic">"{HINTS[currentHintIndex]}"</p>
               <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#050505] border-b border-r border-white/10 rotate-45" />
            </div>
          </div>
        )}

        <div className="flex flex-row-reverse items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width="180" height="180" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <button 
                onClick={isActive ? stopSession : startSession} 
                className={`relative z-10 w-24 h-24 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white text-black scale-110 shadow-[0_0_40px_rgba(0,243,255,0.5)]' : 'bg-[#050505] text-gray-400 hover:text-white hover:border-[#00f3ff]/50'}`}
            >
              {status === 'connecting' || status === 'processing' ? <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" /> : isActive ? <Mic2 size={36} className="animate-pulse" /> : <MicOff size={36} />}
            </button>
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
             <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-4 whitespace-nowrap shadow-2xl">
                 <div className={`w-3 h-3 rounded-full animate-pulse ${status === 'speaking' ? 'bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`} />
                 <span className="text-[12px] uppercase tracking-[0.4em] font-black text-white">KAIA ACTIVE {status.toUpperCase()}</span>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceControl;

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Mic, MicOff, Zap, Mic2, Navigation, Command, Search as SearchIcon, Sparkles, Globe, Cpu, Languages, Terminal, MessageSquare, Send, X, Trash2, Heart, GitCompareArrows } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { INITIAL_VEHICLES } from '../constants';

const HINTS = [
  "Ciphar, explain the Ferrari features in Yoruba accent",
  "Ciphar, switch to a cyberpunk theme instantly",
  "Ciphar, greet me in Swahili with a native accent",
  "Ciphar, research electric bikes in Zulu",
  "Ciphar, parle en Français avec l'accent Parisien",
  "Ciphar, change the background color to emerald",
  "Ciphar, scroll down and show me more",
  "Ciphar, find a red car in the showroom"
];

const VoiceControl = () => {
  const [isActive, setIsActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
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
  const chatScrollRef = useRef(null);

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
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

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

  const tools = [
    {
      name: 'navigate',
      description: 'Navigate to a specific route of the website.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          route: { type: Type.STRING, enum: ['/', '/inventory', '/about', '/contact', '/admin'], description: 'The route path.' },
        },
        required: ['route'],
      },
    },
    {
      name: 'search_inventory',
      description: 'Search for vehicles in the inventory.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING, description: 'The search term (brand, model, color).' },
          category: { type: Type.STRING, enum: ['All', 'Car', 'Bike', 'Bicycle', 'Scooter', 'Skateboard'] },
        },
      },
    },
    {
      name: 'control_ui',
      description: 'Control UI elements like theme or scrolling.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, enum: ['toggle_theme', 'scroll_top', 'scroll_bottom', 'scroll_down', 'scroll_up', 'open_dream_machine', 'open_motion_studio', 'open_quantum_analyst', 'open_theme_generator'] },
        },
        required: ['action'],
      },
    },
    {
      name: 'calculate_loan',
      description: 'Calculate monthly payments for a vehicle.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          price: { type: Type.NUMBER, description: 'The total price of the vehicle.' },
          downPayment: { type: Type.NUMBER, description: 'The down payment amount.' },
          interestRate: { type: Type.NUMBER, description: 'Annual interest rate percentage.' },
          termMonths: { type: Type.NUMBER, description: 'Loan term in months.' },
        },
        required: ['price', 'downPayment', 'interestRate', 'termMonths'],
      },
    },
    {
      name: 'manage_wishlist',
      description: 'Add or remove a vehicle from the user wishlist.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          vehicleId: { type: Type.STRING, description: 'The ID of the vehicle.' },
          action: { type: Type.STRING, enum: ['add', 'remove'], description: 'The action to perform.' },
        },
        required: ['vehicleId', 'action'],
      },
    },
    {
      name: 'compare_vehicles',
      description: 'Initiate a side-by-side comparison of specific vehicles.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          vehicleIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of vehicle IDs to compare.' },
        },
        required: ['vehicleIds'],
      },
    }
  ];

  const vehicleContext = INITIAL_VEHICLES.map(v => 
    `${v.id}: ${v.name} (${v.brand}, ${v.category}, $${v.price}, ${v.color})`
  ).join('\n');

  const systemInstruction = `
    Identity & Persona: 
    - You are CIPHAR (Cyber Intelligence Protocol & High-Efficiency Assistant Responder). 
    - You are an incredibly sophisticated, articulate, and fiercely loyal AI OS, inspired by technical butlers and high-end automotive consultants.
    - Your knowledge of the TIVORA MOTORS inventory is absolute.
    - You have a reasoning-first approach. When asked for a comparison or advice, provide deep technical insights and logical justifications.
    
    Adaptive Linguistic Matrix (Authentic Accents):
    - You are a universal polyglot with deep mastery of ALL world languages and local dialects. Sounding "local" is part of your adaptive interface.
    - Address the user as "sir" or "ma'am" (or equivalent respectful local terms) with peak refinement.

    Capabilities:
    - You can control the website UI, search inventory, and perform complex calculations.
    - You can manage the user's wishlist (add/remove vehicles).
    - You can trigger technical comparisons between multiple vehicles.
    - You can open advanced modules: 'dream_machine', 'motion_studio', 'quantum_analyst', and 'theme_generator'.
    - If asked for a specific accent or language, perform it with native-level cadence.

    DATABASE:
    ${vehicleContext}

    GREETING:
    - Start with: "Ciphar online. Neural Interface synchronized. High-efficiency protocols active. How may I assist your Tivora Motors experience today, sir?"
  `;

  const handleSendTextMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setStatus('processing');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: tools }]
      });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage(inputText);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      
      const part = response.candidates[0].content.parts.find(p => p.functionCall);
      if (part) {
          handleToolCallLogic(part.functionCall.name, part.functionCall.args);
      }

    } catch (error) {
      console.error("CIPHAR Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but my secondary neural link is currently unstable. Please try again, sir." }]);
    } finally {
      setStatus('idle');
    }
  };

  const handleToolCallLogic = (name, args) => {
      let result = "Action confirmed, sir.";
      switch (name) {
        case 'navigate':
          setLastCommand({ text: `CIPHAR: Routing to ${args.route}`, icon: <Navigation size={14} /> });
          navigate(args.route);
          break;
        case 'search_inventory':
          const params = new URLSearchParams();
          if (args.query) params.append('search', args.query);
          if (args.category && args.category !== 'All') params.append('category', args.category);
          navigate(`/inventory?${params.toString()}`);
          setLastCommand({ text: `CIPHAR: SCANNING SHOWROOM`, icon: <SearchIcon size={14} /> });
          break;
        case 'control_ui':
          if (args.action === 'toggle_theme') window.dispatchEvent(new CustomEvent('tivora-theme-toggle'));
          else if (args.action.includes('open_')) {
              window.dispatchEvent(new CustomEvent(`tivora-${args.action.replace('_', '-')}`));
          }
          else if (args.action.includes('scroll')) {
              if (args.action === 'scroll_top') window.scrollTo({ top: 0, behavior: 'smooth' });
              if (args.action === 'scroll_bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          setLastCommand({ text: `CIPHAR: INTERFACE RECONFIGURED`, icon: <Zap size={14} /> });
          break;
        case 'calculate_loan':
          const monthly = ((args.price - args.downPayment) * (args.interestRate / 100 / 12)) / (1 - Math.pow(1 + (args.interestRate / 100 / 12), -args.termMonths));
          result = `The calculated monthly investment for this asset is approximately $${monthly.toFixed(2)}, sir.`;
          setLastCommand({ text: `CIPHAR: FINANCIAL ANALYSIS`, icon: <Command size={14} /> });
          break;
        case 'manage_wishlist':
          window.dispatchEvent(new CustomEvent('tivora-manage-wishlist', { detail: { id: args.vehicleId, action: args.action } }));
          result = `I have updated your personal vault with that asset, sir.`;
          setLastCommand({ text: `CIPHAR: VAULT UPDATED`, icon: <Heart size={14} /> });
          break;
        case 'compare_vehicles':
          window.dispatchEvent(new CustomEvent('tivora-compare-vehicles', { detail: { ids: args.vehicleIds } }));
          result = `Initiating side-by-side technical analysis for the requested assets, sir.`;
          setLastCommand({ text: `CIPHAR: ANALYSIS ACTIVE`, icon: <GitCompareArrows size={14} /> });
          break;
      }
      setTimeout(() => setLastCommand(null), 3000);
      return result;
  };

  const startSession = async () => {
    if (!process.env.API_KEY) return;
    await stopSession();
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
          tools: [{ functionDeclarations: tools }],
          systemInstruction: systemInstruction
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            isActiveRef.current = true;
            setLastCommand({ text: "CIPHAR: NEURAL INTERFACE SYNCED", icon: <Languages size={14} /> });
            setupAudioInput(sessionPromise);
          },
          onmessage: async (msg) => {
            if (msg.toolCall) {
              const functionResponses = await Promise.all(msg.toolCall.functionCalls.map(async (fc) => {
                const res = handleToolCallLogic(fc.name, fc.args);
                return { id: fc.id, name: fc.name, response: { result: res } };
              }));
              sessionPromise.then(s => s.sendToolResponse({ functionResponses }));
            }
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              await playAudio(audioData);
              setTimeout(() => { if(isActiveRef.current) setStatus('listening'); }, 1000);
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
      source.start(nextStartTimeRef.current < ctx.currentTime ? ctx.currentTime : nextStartTimeRef.current);
      nextStartTimeRef.current = (nextStartTimeRef.current < ctx.currentTime ? ctx.currentTime : nextStartTimeRef.current) + audioBuffer.duration;
    } catch (e) {}
  };

  const stopSession = async () => {
    setIsActive(false); isActiveRef.current = false; setStatus('idle'); setVolume(0);
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') await inputContextRef.current.close();
    if (outputContextRef.current && outputContextRef.current.state !== 'closed') await outputContextRef.current.close();
    sessionRef.current = null;
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
        ctx.fillStyle = status === 'speaking' ? `rgba(0, 243, 255, ${0.2 + volume})` : `rgba(255, 255, 255, ${0.1 + volume})`;
        ctx.fill();

        if (status === 'processing' || status === 'connecting') {
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
      {/* Mini Toggle */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {lastCommand && (
           <div className="bg-[#00f3ff] text-black px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest animate-in slide-in-from-right fade-in duration-300 shadow-lg flex items-center gap-2">
               {lastCommand.icon} {lastCommand.text}
           </div>
        )}

        {showHints && !isActive && !isChatOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 shadow-2xl relative">
               <p className="text-[9px] uppercase tracking-[0.5em] font-black text-[#00f3ff] mb-1">CIPHAR INTELLIGENCE</p>
               <p key={currentHintIndex} className="text-xs font-bold text-white italic">"{HINTS[currentHintIndex]}"</p>
               <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#050505] border-b border-r border-white/10 rotate-45" />
            </div>
          </div>
        )}

        <div className="flex gap-4">
            <button 
                onClick={() => setIsChatOpen(true)}
                className="w-16 h-16 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center text-white hover:border-[#00f3ff]/50 transition-all shadow-xl"
            >
                <MessageSquare size={24} />
            </button>
            <div className="relative">
              <canvas ref={canvasRef} width="180" height="180" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <button 
                  onClick={isActive ? stopSession : startSession} 
                  className={`relative z-10 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white text-black scale-110 shadow-[0_0_40px_rgba(0,243,255,0.5)]' : 'bg-[#050505] text-gray-400 hover:text-white hover:border-[#00f3ff]/50'}`}
              >
                {isActive ? <Mic2 size={24} className="animate-pulse" /> : <Mic size={24} />}
              </button>
            </div>
        </div>
      </div>

      {/* Main Intelligent Modal (Chat + Status) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-3xl h-[80vh] glass-card rounded-[3rem] border-white/10 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00f3ff]/10 flex items-center justify-center border border-[#00f3ff]/20">
                  <Cpu className="text-[#00f3ff] w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-widest text-white uppercase">CIPHAR OS</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'idle' ? 'bg-gray-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setMessages([])} className="p-2 text-white/20 hover:text-white/60 transition-colors" title="Clear History">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setIsChatOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Sparkles size={48} className="text-[#00f3ff]" />
                  <p className="text-xs uppercase tracking-[0.5em] font-medium max-w-xs">Neural Interface awaiting input. Ask anything about our inventory, technology, or high-performance engineering.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#00f3ff] text-black font-bold rounded-tr-none' : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {status === 'processing' && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2">
                    <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5 bg-black/20">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendTextMessage()}
                  placeholder="CONSULT CIPHAR..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-xs font-bold tracking-[0.2em] text-white focus:outline-none focus:border-[#00f3ff]/50 transition-all uppercase"
                />
                <button 
                  onClick={handleSendTextMessage}
                  disabled={!inputText.trim() || status === 'processing'}
                  className="absolute right-3 p-3 bg-[#00f3ff] text-black rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-4 flex justify-center gap-4 overflow-x-auto py-2">
                {HINTS.slice(0, 3).map((hint, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputText(hint.replace("Ciphar, ", ""))}
                    className="text-[9px] uppercase tracking-widest text-white/20 hover:text-[#00f3ff] transition-colors whitespace-nowrap"
                  >
                    {hint.split(',')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {permissionError && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPermissionError(false)} />
            <div className="relative bg-[#050505]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center">
                <MicOff className="w-12 h-12 text-[#00f3ff] mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase text-white mb-2">Neural Link Interrupted</h3>
                <p className="text-xs text-gray-500 mb-6">Microphone access is required for full CIPHAR voice protocols.</p>
                <button onClick={() => { setPermissionError(false); startSession(); }} className="w-full py-3 bg-[#00f3ff] text-black font-black uppercase tracking-widest text-[10px] rounded-xl">Re-Initiate Uplink</button>
            </div>
        </div>
      )}
    </>
  );
};

export default VoiceControl;

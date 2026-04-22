import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, MicOff, Zap, Mic2, Navigation, Command, Search as SearchIcon, Sparkles, Globe, Cpu, Languages, Terminal, MessageSquare, Send, X, Trash2, Heart, GitCompareArrows } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const HINTS = [
  "Ciphar, search for red cars in the vault",
  "Ciphar, what is the best luxury bike available?",
  "Ciphar, route me to the showroom",
  "Ciphar, add the Porsche to my personal vault",
  "Ciphar, calculate a 5-year loan for the Ferrari",
  "Ciphar, initiate a side-by-side technical analysis",
  "Ciphar, scroll down to see more assets",
  "Ciphar, explain the specs in a sophisticated tone"
];

const VoiceControl = ({ vehicles = [] }) => {
  const [isActive, setIsActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle');
  const [lastCommand, setLastCommand] = useState(null);

  const navigate = useNavigate();
  const chatScrollRef = useRef(null);
  
  // Speech API Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('listening');
        setIsActive(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        stopSession();
      };

      recognition.onend = () => {
        setIsActive(false);
        if (status === 'listening') setStatus('idle');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [status]);

  const speak = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.9;
    
    // Find a nice voice if available
    const voices = synthRef.current.getVoices();
    const refinedVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
    if (refinedVoice) utterance.voice = refinedVoice;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    synthRef.current.speak(utterance);
  };

  const vehicleContext = vehicles.length > 0 
    ? vehicles.map(v => `${v.id}: ${v.name} (${v.brand}, ${v.category}, $${v.price})`).join('\n')
    : "The inventory vault is currently empty.";

  const systemInstruction = `
    Identity & Persona: 
    - You are CIPHER (Cyber Intelligence Protocol & High-Efficiency Assistant Responder). 
    - You are incredibly sophisticated, articulate, and fiercely loyal AI OS.
    - Your knowledge of the TIVORA MOTORS inventory is absolute.
    - Address the user as "sir" or "ma'am" with peak refinement.
    - Keep responses concise for voice delivery.

    DATABASE:
    ${vehicleContext}

    COMMANDS:
    - If user asks to search/find, respond and then include [SEARCH:query] in your text.
    - If user asks to navigate, include [NAVIGATE:route] in your text. Routes: /, /inventory, /about, /contact, /admin, /dashboard, /cart.
    - If user asks to add to wishlist/favorites, include [WISHLIST:id:add].
    - If user asks to compare, include [COMPARE:id1,id2].
  `;

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setStatus('processing');

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDXR-6wyPIbWK7A_iGQt6t2Juy2PJ8b3s4");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `${systemInstruction}\n\nUser: ${text}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      // Process custom tags
      processAITags(responseText);
      
      // Strip tags for speaking
      const speechText = responseText.replace(/\[.*?\]/g, '').trim();
      
      setMessages(prev => [...prev, { role: 'assistant', content: speechText }]);
      speak(speechText);

    } catch (error) {
      console.error("CIPHER OS Error:", error);
      const errorMsg = "Interface uplink unstable, sir. Please retry.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      if (status !== 'speaking') setStatus('idle');
    }
  };

  const processAITags = (text) => {
    const navMatch = text.match(/\[NAVIGATE:(.*?)\]/);
    if (navMatch) {
      const route = navMatch[1].trim();
      setLastCommand({ text: `ROUTING TO ${route.toUpperCase()}`, icon: <Navigation size={14} /> });
      navigate(route);
    }

    const searchMatch = text.match(/\[SEARCH:(.*?)\]/);
    if (searchMatch) {
      const query = searchMatch[1].trim();
      setLastCommand({ text: `SCANNING FOR ${query.toUpperCase()}`, icon: <SearchIcon size={14} /> });
      navigate(`/inventory?search=${encodeURIComponent(query)}`);
    }

    const wishlistMatch = text.match(/\[WISHLIST:(.*?):(.*?)\]/);
    if (wishlistMatch) {
       const id = wishlistMatch[1].trim();
       const action = wishlistMatch[2].trim();
       window.dispatchEvent(new CustomEvent('tivora-manage-wishlist', { detail: { id, action } }));
       setLastCommand({ text: `VAULT UPDATED`, icon: <Heart size={14} /> });
    }

    const compareMatch = text.match(/\[COMPARE:(.*?)\]/);
    if (compareMatch) {
       const ids = compareMatch[1].split(',').map(id => id.trim());
       window.dispatchEvent(new CustomEvent('tivora-compare-vehicles', { detail: { ids } }));
       setLastCommand({ text: `ANALYSIS ACTIVE`, icon: <GitCompareArrows size={14} /> });
    }

    setTimeout(() => setLastCommand(null), 3000);
  };

  const startSession = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 100);
      }
    } else {
      alert("Voice recognition not supported in this browser.");
    }
  };

  const stopSession = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsActive(false);
    setStatus('idle');
  };

  return (
    <>
      <div className="fixed bottom-8 right-28 z-50 flex flex-col items-end gap-4">
        {lastCommand && (
           <div className="bg-[#00f2ff] text-black px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-right fade-in duration-300 shadow-xl flex items-center gap-3 border border-white/10">
               {lastCommand.icon} {lastCommand.text}
           </div>
        )}

        <div className="flex gap-4">
            <button 
                onClick={() => setIsChatOpen(true)}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#00f2ff]/50 transition-all shadow-2xl backdrop-blur-xl group"
                title="CIPHER Chat"
            >
                <MessageSquare size={24} className="group-hover:text-[#00f2ff] transition-colors" />
            </button>
            <button 
                onClick={isActive ? stopSession : startSession} 
                className={`relative z-10 w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#00f2ff] text-black scale-110 shadow-[0_0_40px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:border-[#00f2ff]/50 backdrop-blur-xl'}`}
                title="CIPHER Voice"
            >
              {isActive ? <Mic2 size={24} className="animate-pulse" /> : <Mic size={24} />}
            </button>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="relative w-full max-w-4xl h-[85vh] glass-card rounded-[3rem] border border-white/5 overflow-hidden flex flex-col bg-background/50">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-3xl bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20">
                  <Cpu className="text-[#00f2ff] w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">CIPHER <span className="text-[#00f2ff]">OS</span></h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-gray-700' : 'bg-[#00f2ff] animate-ping'}`} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30">{status} Protocol</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar pr-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                  <Sparkles size={64} className="text-[#00f2ff]" />
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black max-w-sm leading-relaxed text-white">Neural interface established. Initiate query sequence for inventory or technical specifications.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                  <div className={`max-w-[80%] p-8 rounded-[2.5rem] text-xs font-medium leading-relaxed ${msg.role === 'user' ? 'bg-[#00f2ff] text-black shadow-2xl rounded-tr-none' : 'bg-white/5 text-white/70 border border-white/5 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {status === 'processing' && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5 flex gap-2">
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-white/5 bg-white/[0.01]">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                  placeholder="CONSULT CIPHER MATRIX..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xs font-black tracking-[0.2em] text-white focus:outline-none focus:border-[#00f2ff]/50 transition-all uppercase placeholder:text-white/5"
                />
                <button 
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || status === 'processing'}
                  className="absolute right-4 p-4 bg-[#00f2ff] text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceControl;

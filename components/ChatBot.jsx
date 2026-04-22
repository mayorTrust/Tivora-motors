import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Activity } from 'lucide-react';
import gsap from 'gsap';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDXR-6wyPIbWK7A_iGQt6t2Juy2PJ8b3s4");

const ChatBot = ({ vehicles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'CIPHER OS Online. Accessing Tivora intelligence matrix. How can I assist your operation today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatRef.current, 
        { opacity: 0, scale: 0.9, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const context = `You are 'CIPHER', the elite AI operating system for Tivora Motors. 
      You have real-time access to the inventory: ${JSON.stringify(vehicles.map(v => ({ name: v.name, brand: v.brand, price: v.price, category: v.category, location: v.location })))}.
      Provide precise, data-driven insights with a sleek, professional, and slightly futuristic tone. 
      Keep responses concise. Use text only. If the inventory is empty, acknowledge it professionally.`;

      const prompt = `${context}\n\nUser: ${input}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Intelligence uplink interrupted. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div 
          ref={chatRef}
          className="glass-card w-96 h-[500px] rounded-3xl flex flex-col shadow-2xl border border-white/10 overflow-hidden bg-background/95"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center border border-[#00f2ff]/20">
                <Activity className="w-5 h-5 text-[#00f2ff]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white tracking-tighter italic">CIPHER <span className="text-[#00f2ff]">OS</span></h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#00f2ff] animate-ping" />
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Secure Link Established</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#00f2ff] text-black rounded-tr-none shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                    : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                  <Loader2 className="w-4 h-4 text-[#00f2ff] animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-white/5 bg-white/[0.02]">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Initialize query..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-xs focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#00f2ff] text-black rounded-lg disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#00f2ff] text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:scale-105 transition-all group border border-white/10"
          title="CIPHER OS"
        >
          <Activity className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;

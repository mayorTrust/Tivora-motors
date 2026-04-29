import React, { useState, useRef, useEffect } from 'react';
import { X, Send, CreditCard, ShieldCheck, Lock, ArrowRight, Loader2, Zap } from 'lucide-react';
import gsap from 'gsap';

const PaymentAssistant = ({ isOpen, onClose, vehicleName, price }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Neural secure link established for ${vehicleName}. How would you like to structure your acquisition of this asset?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Mock AI response for payment/financing
    setTimeout(() => {
      let response = "I'm processing your request through our financial matrix. We offer bespoke financing with rates as low as 3.9% for elite operatives.";
      if (input.toLowerCase().includes('loan') || input.toLowerCase().includes('finance')) {
        response = `For the ${vehicleName} valuation of $${price.toLocaleString()}, we can structure a 60-month protocol with a 20% down payment. Would you like to proceed with credit verification?`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl h-[70vh] glass-card rounded-[3rem] border border-white/10 overflow-hidden flex flex-col bg-[#050505] shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Acquisition <span className="text-accent">Protocol</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Secure Financial Interface</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] text-xs font-medium leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-accent text-black font-bold rounded-tr-none shadow-lg shadow-accent/20' 
                : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5">
                  <Loader2 size={20} className="text-accent animate-spin" />
               </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-10 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
              <ShieldCheck size={12} className="text-green-500" /> End-to-End Encrypted
           </div>
           <div className="w-1 h-1 rounded-full bg-white/10" />
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
              <CreditCard size={12} className="text-accent" /> PCI Compliant Matrix
           </div>
        </div>

        {/* Input */}
        <div className="p-10 border-t border-white/5 bg-black/40">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="STRUCTURE YOUR ACQUISITION..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-xs font-black tracking-[0.2em] text-white focus:outline-none focus:border-accent/50 transition-all uppercase placeholder:text-white/5"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 p-3 bg-accent text-black rounded-full hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAssistant;

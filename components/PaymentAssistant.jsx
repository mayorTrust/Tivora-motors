
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  CreditCard, 
  Bitcoin, 
  Gift, 
  Wallet, 
  Banknote, 
  X, 
  Send, 
  ShieldCheck, 
  Loader2,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';

const PAYMENT_METHODS = [
  { id: 'bank', name: 'Bank Transfer', icon: <Banknote size={16} /> },
  { id: 'card', name: 'Debit/Credit Card', icon: <CreditCard size={16} /> },
  { id: 'gift', name: 'Gift Cards', icon: <Gift size={16} /> },
  { id: 'crypto', name: 'Cryptocurrency', icon: <Bitcoin size={16} /> },
  { id: 'wallet', name: 'Mobile Wallet', icon: <Wallet size={16} /> },
];

const PaymentAssistant = ({ vehicleName, price, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  const systemInstruction = `
    You are a secure payment assistant for TIVORA_RIDES. 
    Your role is to help users choose, set up, and complete payments for the vehicle: ${vehicleName || 'a luxury vehicle'} priced at $${price?.toLocaleString() || 'market value'}. 
    
    Supported methods:
    - Bank transfer
    - Debit/Credit card
    - Gift cards (Amazon, Apple, Google Play, Steam, etc.)
    - Cryptocurrency (Bitcoin, USDT, Ethereum, etc.)
    - Mobile money and digital wallets
    
    RULES:
    1. Clearly ask the user which payment method they prefer.
    2. Explain the steps for the selected method in a simple, friendly way.
    3. NEVER request or store sensitive information such as full card numbers, CVV codes, private keys, or passwords.
    4. If a payment method is unavailable, politely suggest an alternative.
    5. Confirm payment intent before proceeding.
    6. Provide a clear confirmation message after successful payment setup guidance.
    7. Maintain a professional, trustworthy, and user-friendly tone.
    8. If the user is unsure, recommend the fastest and safest available payment option (usually Bank Transfer or Card).
    9. Keep responses concise and formatted for a chat interface.
  `;

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { 
          role: 'assistant', 
          content: `Welcome to the secure checkout for the **${vehicleName}**. I am your payment assistant. How would you like to handle the investment today? We support Bank Transfers, Cards, Crypto, and even high-value Gift Cards.` 
        } 
      ]);
      
      if (containerRef.current) {
        gsap.fromTo(containerRef.current, 
          { y: 100, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }
        );
      }
    }
  }, [isOpen, vehicleName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return; 
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const assistantContent = response.text || "I apologize, but my connection is unstable. Please choose a payment method from the list.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a security protocol error. Please try again or contact support." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
      
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl h-[80vh] bg-background/90 glass-card rounded-[2.5rem] border-accent/20 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground">Secure <span className="text-accent">Assistant</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Verified Payment Node</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-foreground/5 rounded-full text-foreground/40 hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${ 
                msg.role === 'assistant' 
                ? 'bg-foreground/5 text-foreground/80 border border-foreground/5 rounded-tl-none font-medium' 
                : 'bg-accent text-background font-bold rounded-tr-none shadow-lg shadow-accent/20'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-foreground/5 p-5 rounded-3xl rounded-tl-none border border-foreground/5">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Options */}
        <div className="px-6 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSend(`I prefer ${method.name}`)}
                className="flex items-center gap-2 bg-foreground/5 border border-foreground/10 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-accent hover:border-accent/50 transition-all whitespace-nowrap"
              >
                {method.icon}
                {method.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2 bg-foreground/[0.02]">
          <div className="relative group">
            <input
              type="text"
              placeholder="Type your payment preference..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              className="w-full bg-background border border-foreground/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:border-accent/50 text-sm font-medium text-foreground transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-accent text-background rounded-xl flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-accent/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">End-to-End Encrypted Advisory Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAssistant;

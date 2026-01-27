
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuit, Search, Loader2, X, ExternalLink, Activity } from 'lucide-react';
import gsap from 'gsap';

const QuantumAnalyst = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('tivora-open-quantum-analyst', handleOpen);
    return () => window.removeEventListener('tivora-open-quantum-analyst', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const analyze = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(null);
    setSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are 'Tivora Intelligence', a futuristic vehicle market analyst. Provide concise, data-driven insights about cars, prices, and trends. Keep tone sleek and professional."
        },
      });
      
      setResponse(result.text);
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setSources(chunks.filter((c) => c.web).map((c) => ({ title: c.web.title, uri: c.web.uri })));
      }
    } catch (err) {
      setResponse("Intelligence system connection severed. Please retry uplink.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-48 right-8 z-[900] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent transition-all hover:scale-110 shadow-lg shadow-accent/5"
        title="Quantum Intel"
      >
        <Activity className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div ref={containerRef} className="fixed inset-x-4 bottom-24 md:inset-auto md:right-24 md:bottom-24 z-[1100] md:w-[450px] glass-card p-6 rounded-[2.5rem] border-accent/20 shadow-2xl flex flex-col max-h-[70vh] backdrop-blur-3xl bg-background/90">
          <div className="flex justify-between items-center mb-6 border-b border-foreground/10 pb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] italic flex items-center gap-2 text-accent">
              <BrainCircuit className="w-4 h-4" /> Quantum Intelligence
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar pr-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/50 animate-pulse">Scanning Global Data...</span>
              </div>
            ) : response ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="text-sm text-foreground/80 leading-relaxed bg-foreground/5 p-4 rounded-2xl border border-foreground/5 font-mono text-xs">
                  {response}
                </div>
                {sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sources.slice(0, 3).map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-1.5 bg-foreground/5 border border-foreground/10 px-3 py-1.5 rounded-full text-[9px] font-bold text-foreground/60 hover:text-accent hover:border-accent/50 transition-all">
                        <ExternalLink className="w-2 h-2" /> {s.title.substring(0, 15)}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 mx-auto flex items-center justify-center">
                  <Activity className="w-8 h-8 text-accent/50" />
                </div>
                <p className="text-[11px] text-foreground/50 uppercase tracking-widest leading-relaxed">
                  Awaiting Input. <br/>Query market trends, specs, or historical data.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Ex: 2024 Porsche GT3 Market Value..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              className="flex-1 bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-accent text-foreground placeholder:text-foreground/30 font-mono"
            />
            <button 
              onClick={analyze} 
              disabled={isLoading} 
              className="bg-accent text-background p-4 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuantumAnalyst;


import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Wand2, Image as ImageIcon, Loader2, X, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const DreamMachine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('tivora-open-dream-machine', handleOpen);
    return () => window.removeEventListener('tivora-open-dream-machine', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
    }
  }, [isOpen]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
      // Using gemini-2.5-flash-image for generation (via generateContent per SDK guidelines for this model)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { 
          parts: [{ 
            text: `Professional automotive design sketch and rendering of: ${prompt}. Futuristic, sleek, neon lighting, 8k resolution, cinematic composition.` 
          }] 
        },
        // We do not set responseMimeType for image generation models like this usually, 
        // relying on the model to return image parts.
      });

      // Iterate through parts to find the image
      if (response.candidates?.[0]?.content?.parts) {
         for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
               setGeneratedImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
               break;
            }
         }
      } else {
         throw new Error("No image generated");
      }

    } catch (err) {
      console.error(err);
      alert("Visual synthesis failed. The neural link is unstable.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-64 right-8 z-[900] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent transition-all hover:scale-110 shadow-lg shadow-accent/5"
        title="Dream Machine"
      >
        <Wand2 className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div ref={containerRef} className="fixed inset-x-4 top-24 md:inset-auto md:right-24 md:top-32 z-[1100] md:w-[400px] glass-card p-6 rounded-[2.5rem] border-accent/20 shadow-2xl backdrop-blur-3xl bg-background/90">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] italic flex items-center gap-2 text-accent">
               <Sparkles className="w-3 h-3" /> Dream Machine
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors">
               <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10 relative group">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm">
                  <div className="relative">
                     <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse" />
                     <Loader2 className="w-8 h-8 animate-spin text-accent relative z-10" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/70 animate-pulse">Materializing...</span>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                   <img src={generatedImage} alt="Vision" className="w-full h-full object-cover animate-in fade-in duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-[10px] text-white font-mono uppercase truncate">{prompt}</p>
                   </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 text-foreground">
                   <ImageIcon className="w-12 h-12 mb-2" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Visualizer Standby</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-2">Prompt Input</label>
              <textarea
                placeholder="Describe your ultimate machine (e.g., A matte black hypercar in a neon city)..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-accent resize-none text-foreground placeholder:text-foreground/30 font-mono h-24"
              />
              <button 
                 onClick={generate} 
                 disabled={isGenerating} 
                 className="w-full bg-accent text-background font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {isGenerating ? 'Synthesizing...' : 'Generate Vision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DreamMachine;

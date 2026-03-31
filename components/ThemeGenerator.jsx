
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Palette, Sparkles, Loader2, X, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

const ThemeGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('tivora-open-theme-generator', handleOpen);
    return () => window.removeEventListener('tivora-open-theme-generator', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
         { x: 50, opacity: 0 }, 
         { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  const generateTheme = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a UI theme color palette for a car dealership webapp based on the following mood: "${prompt}". 
                   The background should be appropriate for the mood (dark or light). 
                   Text should contrast well. Accent should be vibrant.
                   Return ONLY JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bg_rgb: { type: Type.STRING, description: 'RGB values for background, e.g., "10, 10, 20"' },
              text_rgb: { type: Type.STRING, description: 'RGB values for text, e.g., "240, 240, 255"' },
              accent_hex: { type: Type.STRING, description: 'Hex code for accent color, e.g., "#00ffcc"' }
            },
            required: ['bg_rgb', 'text_rgb', 'accent_hex']
          }
        }
      });
      
      const data = JSON.parse(response.text);
      
      // Animate the transition
      const root = document.documentElement;
      gsap.to(root, {
         '--bg-rgb': data.bg_rgb,
         '--text-rgb': data.text_rgb,
         '--accent-hex': data.accent_hex,
         duration: 1.5,
         ease: "power2.inOut",
         onUpdate: () => {
             // Force repaint for variables if needed, though CSS variables usually update automatically
             root.style.setProperty('--bg-rgb', data.bg_rgb);
             root.style.setProperty('--text-rgb', data.text_rgb);
             root.style.setProperty('--accent-hex', data.accent_hex);
         }
      });

      setIsOpen(false);
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert("Reality distortion field failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetTheme = () => {
     const root = document.documentElement;
     root.style.removeProperty('--bg-rgb');
     root.style.removeProperty('--text-rgb');
     root.style.removeProperty('--accent-hex');
     // Re-trigger the logic in Navbar to set default or localStorage theme
     // For now, just removing the inline styles reverts to CSS class defaults
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-[900] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent transition-all hover:scale-110 shadow-lg shadow-accent/5"
        title="Reality Warper"
      >
        <Palette className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div ref={containerRef} className="fixed bottom-32 right-24 z-[1100] w-80 glass-card p-6 rounded-[2rem] border-accent/20 shadow-2xl backdrop-blur-3xl bg-background/90">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 italic text-accent">
              <Sparkles className="w-3 h-3" /> Reality Warper
            </h3>
            <div className="flex gap-2">
                <button onClick={resetTheme} className="text-foreground/30 hover:text-foreground transition-colors" title="Reset Default">
                    <RefreshCw className="w-3 h-3" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>
          </div>
          
          <p className="text-[10px] text-foreground/50 uppercase tracking-widest mb-4 leading-relaxed font-mono">
             Inject a new mood into the interface matrix.
          </p>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="e.g., Cyberpunk Forest, Marshmallow Daydream..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateTheme()}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent text-foreground font-mono"
            />
            <button
              onClick={generateTheme}
              disabled={isGenerating}
              className="w-full bg-foreground text-background font-black py-3 rounded-xl uppercase tracking-widest text-[9px] hover:bg-accent hover:text-background transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isGenerating ? <><Loader2 className="w-3 h-3 animate-spin" /> Warping...</> : 'Distort Reality'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeGenerator;

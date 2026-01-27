import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Film, Video, Loader2, X, Sparkles, Upload, Play, Key, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

const MotionStudio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('tivora-open-motion-studio', handleOpen);
    return () => window.removeEventListener('tivora-open-motion-studio', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
        checkApiKey();
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
        }
    }
  }, [isOpen]);

  const checkApiKey = async () => {
      // Cast window to any to avoid conflict with global AIStudio type
      const aistudio = window.aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
          const hasKey = await aistudio.hasSelectedApiKey();
          setNeedsApiKey(!hasKey);
      }
  };

  const handleSelectKey = async () => {
      // Cast window to any to avoid conflict with global AIStudio type
      const aistudio = window.aistudio;
      if (aistudio && aistudio.openSelectKey) {
          try {
              await aistudio.openSelectKey();
              // Assume success after dialog interaction to mitigate race condition
              setNeedsApiKey(false);
          } catch (e) {
              console.error("Key selection failed", e);
          }
      }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          alert("Image too large. Please use an image under 5MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generate = async () => {
    if (!prompt.trim() && !image) return;
    setIsGenerating(true);
    setGeneratedVideo(null);
    setStatus('Initializing Motion Engine...');

    try {
        // Just-in-time Key Check
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let operation;
        
        if (image) {
            // Image + Text to Video
            const base64Data = image.split(',')[1];
            const mimeType = image.split(',')[0].split(':')[1].split(';')[0];
            
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || "Cinematic pan, highly detailed, photorealistic 4k, promotional video.",
                image: {
                    imageBytes: base64Data,
                    mimeType: mimeType
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });
        } else {
            // Text to Video
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });
        }

        setStatus('Rendering Frames (approx. 1-2 mins)...');
        
        // Polling
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
            setStatus((prev) => prev === 'Rendering Frames...' ? 'Polishing Pixels...' : 'Rendering Frames...');
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const videoBlob = await videoRes.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideo(videoUrl);
        } else {
            throw new Error("Generation completed but no video URI found.");
        }

    } catch (err) {
        console.error(err);
        if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("403") || err.message.includes("404"))) {
            setNeedsApiKey(true);
            setStatus("Authorization failed.");
        } else {
            alert(`Motion synthesis failed: ${err.message || "Unknown error"}`);
        }
    } finally {
        setIsGenerating(false);
        setStatus('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-80 right-8 z-[900] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent transition-all hover:scale-110 shadow-lg shadow-accent/5"
        title="Motion Studio"
      >
        <Film className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div ref={containerRef} className="fixed inset-x-4 top-20 md:inset-auto md:right-24 md:top-24 z-[1100] md:w-[450px] glass-card p-6 rounded-[2.5rem] border-accent/20 shadow-2xl backdrop-blur-3xl bg-background/90 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-background/95 backdrop-blur-md pb-4 z-10 border-b border-foreground/5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] italic flex items-center gap-2 text-accent">
               <Video className="w-3 h-3" /> Motion Studio
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors">
               <X className="w-4 h-4" />
            </button>
          </div>
          
          {needsApiKey ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
                 <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                     <Key className="w-8 h-8" />
                 </div>
                 <div className="space-y-2">
                     <h4 className="font-bold text-foreground">Activation Required</h4>
                     <p className="text-xs text-foreground/60 max-w-xs mx-auto leading-relaxed">
                         To generate 720p/1080p promotional videos using the Veo model, a paid API key from a billing-enabled project is required.
                     </p>
                 </div>
                 <button 
                     onClick={handleSelectKey}
                     className="bg-accent text-background font-black py-3 px-8 rounded-xl uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center gap-2"
                 >
                     Select API Key <Key className="w-3 h-3" />
                 </button>
                 <a 
                     href="https://ai.google.dev/gemini-api/docs/billing" 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-[9px] text-foreground/40 underline hover:text-accent"
                 >
                     View Billing Documentation
                 </a>
             </div>
          ) : (
             <div className="space-y-6">
                {/* Video Preview Area */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10 relative group">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm z-20">
                      <div className="relative">
                         <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse" />
                         <Loader2 className="w-8 h-8 animate-spin text-accent relative z-10" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/70 animate-pulse">{status}</span>
                    </div>
                  ) : generatedVideo ? (
                    <div className="relative w-full h-full bg-black">
                       <video 
                           src={generatedVideo} 
                           controls 
                           autoPlay 
                           loop 
                           className="w-full h-full object-contain" 
                       />
                       <a 
                          href={generatedVideo} 
                          download="tivora-promo.mp4"
                          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-accent hover:text-black transition-colors"
                          title="Download"
                       >
                           <Upload className="w-4 h-4 rotate-180" />
                       </a>
                    </div>
                  ) : image ? (
                    <div className="relative w-full h-full">
                       <img src={image} alt="Reference" className="w-full h-full object-cover opacity-60" />
                       <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-accent/20">
                               <Sparkles className="w-4 h-4 text-accent" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Image Reference Loaded</span>
                           </div>
                       </div>
                       <button 
                           onClick={clearImage}
                           className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                       >
                           <X className="w-3 h-3" />
                       </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 text-foreground">
                       <Film className="w-12 h-12 mb-2" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Preview Output</span>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                      <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-2">Reference Image (Optional)</label>
                      </div>
                      <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-12 bg-foreground/5 border border-dashed border-foreground/20 rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:bg-foreground/10 hover:border-accent/50 transition-all group"
                      >
                          <Upload className="w-4 h-4 text-foreground/40 group-hover:text-accent" />
                          <span className="text-xs text-foreground/40 group-hover:text-foreground font-mono">
                              {image ? 'Change Image' : 'Upload Vehicle Photo'}
                          </span>
                      </div>
                      <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                      />
                  </div>

                  {/* Prompt */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-2">Director's Prompt</label>
                    <textarea
                      placeholder={image ? "Describe how to animate this vehicle (e.g., 'Pan around the car, neon city background, rain effects')..." : "Describe the video (e.g., 'A futuristic red motorcycle speeding through a cyber tunnel')..."}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-accent resize-none text-foreground placeholder:text-foreground/30 font-mono h-24"
                    />
                  </div>

                  <button 
                     onClick={generate} 
                     disabled={isGenerating || (!prompt && !image)} 
                     className="w-full bg-accent text-background font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isGenerating ? 'Synthesizing...' : 'Generate Video'}
                  </button>
                  
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/10">
                      <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[9px] text-blue-200/80 leading-relaxed">
                          Powered by <strong>Veo</strong>. Generation may take 1-2 minutes. Ensure your selected Google Cloud project has billing enabled.
                      </p>
                  </div>
                </div>
             </div>
          )}
        </div>
      )}
    </>
  );
};

export default MotionStudio;

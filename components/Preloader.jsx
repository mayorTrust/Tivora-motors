
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Simulate loading sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit Animation
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: onComplete
          });
        }
      }
    });

    // Animate the counter
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.round(counter.val));
      }
    });

    // Optional text glitch/scramble effect could go here
    
    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[10001] bg-[#050505] flex flex-col justify-between p-8 sm:p-12 text-white"
    >
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
          System Initialization
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#00f3ff]">
          v2.5.0-RC
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-9xl sm:text-[12rem] font-black font-mono tracking-tighter leading-none mb-4">
          {progress}%
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between mb-2 font-mono text-xs uppercase tracking-widest text-gray-500">
          <span ref={textRef}>{progress < 100 ? "Loading Assets..." : "System Ready"}</span>
          <span>{progress < 100 ? "Standby" : "Connected"}</span>
        </div>
        <div className="w-full h-px bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00f3ff]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;

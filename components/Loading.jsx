import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { animate, createDrawable, stagger, steps } from 'animejs';
import LogoSVG from './LogoSVG';

export const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const textRef = useRef(null);
  const flareRef = useRef(null);

  useEffect(() => {
    const paths = document.querySelectorAll('.wire');
    
    // Initial State Setup - Using Cyan
    gsap.set(containerRef.current, { backgroundColor: '#050505' });
    gsap.set(paths, { stroke: '#00f2ff', strokeWidth: 2, fill: 'transparent', opacity: 0 });
    gsap.set(textRef.current, { opacity: 0, y: 20, filter: 'blur(10px)' });
    gsap.set(flareRef.current, { scale: 0, opacity: 0 });

    // Master GSAP Timeline for cinematic coordination
    const masterTl = gsap.timeline({
      onComplete: () => {
        // Smooth transition to website
        const exitTl = gsap.timeline({
          onComplete: onComplete
        });

        exitTl.to(logoWrapperRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          ease: "power4.in"
        })
        .to(containerRef.current, {
          backgroundColor: 'transparent',
          duration: 1,
          ease: "power2.inOut"
        }, "-=0.4")
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.6");
      }
    });

    // PHASE 1: Wireframe Draw (using Anime.js v4) - Now Cyan
    const drawables = createDrawable('.wire', 0, 0); 

    const drawAnimation = animate(drawables, {
      draw: '0 1', 
      duration: 2000,
      delay: stagger(20, {from: 'center'}),
      ease: 'expo.out', 
      onBegin: () => {
        // High-energy flicker/glitch overlay during draw
        gsap.to(paths, { 
            opacity: () => Math.random() * 0.5 + 0.5, 
            duration: 0.1, 
            repeat: 20, 
            yoyo: true 
        });
      }
    });

    // PHASE 2: Neon Pulsing (Cyan Bloom)
    masterTl.to(paths, {
        opacity: 1,
        strokeWidth: 3,
        filter: 'drop-shadow(0 0 15px #00f2ff) drop-shadow(0 0 30px #00f2ff)',
        duration: 0.5,
        delay: 2.2 
    })
    .to(paths, {
        stroke: '#ffffff', 
        filter: 'drop-shadow(0 0 25px #00f2ff) drop-shadow(0 0 50px #00f2ff)',
        duration: 0.8,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut"
    })

    // PHASE 3: Solidification & Branding
    .to(flareRef.current, {
        scale: 4,
        opacity: 0.6,
        duration: 1,
        ease: "expo.out"
    }, "-=0.5")
    .to(paths, {
        stroke: '#ffffff',
        fill: 'rgba(0,242,255,0.05)',
        filter: 'drop-shadow(0 0 5px #ffffff)',
        duration: 1,
        ease: "power2.out"
    }, "-=0.5")
    .to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: "expo.out"
    }, "-=0.8")
    .to(flareRef.current, {
        opacity: 0,
        duration: 1.5
    }, "-=1")
    
    // Final hold before transition
    .to({}, { duration: 1 });

    return () => {
      masterTl.kill();
      if (drawAnimation && drawAnimation.stop) {
        drawAnimation.stop();
      }
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
    >
      {/* Background Lens Flare / Reveal */}
      <div 
        ref={flareRef}
        className="absolute w-64 h-64 rounded-full lens-flare pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Section - Wrappers removed to isolate logo */}
        <LogoSVG 
          ref={logoWrapperRef} 
          className="w-64 h-64 md:w-80 md:h-80 mb-12" 
        />

        {/* Branding Section */}
        <div ref={textRef} className="text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-[0.8em] text-white uppercase mb-4 glitch-text">
            TIVORA
          </h1>
          <div className="flex items-center justify-center gap-6 text-[#00f2ff] text-[12px] tracking-[0.5em] uppercase font-bold opacity-80">
            <span className="w-12 h-[1px] bg-[#00f2ff]/30" />
            Motorsports Dynamics
            <span className="w-12 h-[1px] bg-[#00f2ff]/30" />
          </div>
        </div>
      </div>

      {/* System Status HUD */}
      <div className="absolute top-10 left-10 text-[10px] text-[#00f2ff]/20 font-mono tracking-widest uppercase pointer-events-none hidden md:block">
        [SYS_STATUS]: BOOT_SEQUENCE_INIT<br/>
        [LINK]: ESTABLISHED_CYAN_LINE
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-white/10 border-t-[#00f2ff] rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden h-[450px]">
      <div className="skeleton h-[220px] w-full bg-white/5"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="skeleton h-6 w-1/2 rounded-md bg-white/5"></div>
          <div className="skeleton h-6 w-1/4 rounded-md bg-white/5"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="skeleton h-12 rounded-lg bg-white/5"></div>
          <div className="skeleton h-12 rounded-lg bg-white/5"></div>
          <div className="skeleton h-12 rounded-lg bg-white/5"></div>
        </div>
        <div className="skeleton h-4 w-full rounded-md bg-white/5"></div>
        <div className="skeleton h-4 w-2/3 rounded-md bg-white/5"></div>
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <div className="skeleton h-6 w-32 rounded mb-8 bg-white/5"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="skeleton aspect-video rounded-3xl bg-white/5"></div>
          <div className="flex gap-4 overflow-hidden">
            <div className="skeleton w-24 aspect-square rounded-xl bg-white/5"></div>
            <div className="skeleton w-24 aspect-square rounded-xl bg-white/5"></div>
            <div className="skeleton w-24 aspect-square rounded-xl bg-white/5"></div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <div className="skeleton h-4 w-20 rounded mb-4 bg-white/5"></div>
            <div className="skeleton h-12 w-3/4 rounded mb-4 bg-white/5"></div>
            <div className="skeleton h-8 w-1/3 rounded bg-white/5"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="skeleton h-20 rounded-2xl bg-white/5"></div>
            <div className="skeleton h-20 rounded-2xl bg-white/5"></div>
            <div className="skeleton h-20 rounded-2xl bg-white/5"></div>
            <div className="skeleton h-20 rounded-2xl bg-white/5"></div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-4 w-full rounded bg-white/5"></div>
            <div className="skeleton h-4 w-full rounded bg-white/5"></div>
            <div className="skeleton h-4 w-2/3 rounded bg-white/5"></div>
          </div>
          <div className="flex gap-4">
            <div className="skeleton h-16 flex-1 rounded-2xl bg-white/5"></div>
            <div className="skeleton h-16 flex-1 rounded-2xl bg-white/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

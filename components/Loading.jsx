import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LogoSVG from './LogoSVG';

export const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    gsap.set(contentRef.current, { opacity: 0, scale: 0.9 });

    tl.to(contentRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5
    })
    .to(contentRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.8,
      ease: "power3.in",
      delay: 1
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      <div ref={contentRef} className="flex flex-col items-center">
        <LogoSVG className="w-48 h-48 mb-8" />
        <h1 className="text-4xl font-black tracking-[0.6em] text-white uppercase italic">
          TIVORA
        </h1>
        <div className="mt-4 w-12 h-[1px] bg-[#00f2ff]" />
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
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 min-h-screen">
      <div className="skeleton h-6 w-32 rounded mb-8 bg-white/5"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton aspect-video rounded-3xl bg-white/5"></div>
        <div className="space-y-8">
          <div className="skeleton h-12 w-3/4 rounded bg-white/5"></div>
          <div className="skeleton h-20 w-full rounded bg-white/5"></div>
          <div className="skeleton h-32 w-full rounded bg-white/5"></div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LogoSVG from './LogoSVG';

export const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playCount = useRef(0);
  const [videoSrc, setVideoSrc] = React.useState('');

  useEffect(() => {
    // Quality selection logic
    const getAutoQuality = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isDesktop = window.innerWidth >= 1024;
      
      if (connection) {
        if (connection.saveData) return 'low';
        const type = connection.effectiveType;
        if (type === '4g') return isDesktop ? 'high' : 'mid';
        return 'low';
      }
      return isDesktop ? 'high' : 'mid';
    };

    const quality = getAutoQuality();
    setVideoSrc(`/intros/logovid-${quality}.mp4`);

    // Entrance Animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleVideoEnded = () => {
    // Cinematic Exit: Blur and Zoom into the screen
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.5,
      filter: "blur(20px)",
      duration: 1.2,
      ease: "power4.inOut",
      onComplete: onComplete
    });
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover mix-blend-screen opacity-0 animate-[preloader-fade-in_1.5s_ease-out_forwards]"
          />
        )}

        <div className="absolute bottom-20 flex flex-col items-center z-20">
          <h1 className="text-2xl font-black tracking-[1em] text-white/40 uppercase italic animate-pulse">
            TIVORA <span className="text-accent">OS</span>
          </h1>
          <div className="mt-4 w-12 h-[1px] bg-[#00f2ff]/30" />
        </div>
      </div>
      
      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 w-full animate-scan opacity-20" />
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

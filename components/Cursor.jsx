import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Hide cursor on touch devices or if simplified logic suggests touch
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Center elements initially (off-screen or center to avoid jump)
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    gsap.set(follower, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.15; // Increased slightly for responsiveness

    // Using quickSetter for better performance
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");
    const xFollowSet = gsap.quickSetter(follower, "x", "px");
    const yFollowSet = gsap.quickSetter(follower, "y", "px");

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Immediate update for the small dot
      xSet(mouse.x);
      ySet(mouse.y);
    };

    // Animation Loop
    const loop = () => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      
      xFollowSet(pos.x);
      yFollowSet(pos.y);
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(loop);

    // Interaction handlers
    const onHover = () => {
      gsap.to(cursor, { scale: 0, duration: 0.1, overwrite: true });
      gsap.to(follower, { 
        scale: 3, 
        backgroundColor: "rgba(0, 243, 255, 0.1)", 
        borderColor: "transparent",
        mixBlendMode: 'difference',
        duration: 0.3,
        overwrite: true
      });
    };

    const onUnhover = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1, overwrite: true });
      gsap.to(follower, { 
        scale: 1, 
        backgroundColor: "transparent", 
        borderColor: "#00f3ff",
        mixBlendMode: 'normal',
        duration: 0.3,
        overwrite: true
      });
    };

    const onMouseDown = () => {
      gsap.to(follower, { scale: 0.8, duration: 0.1, overwrite: true });
    };

    const onMouseUp = () => {
      gsap.to(follower, { scale: 3, duration: 0.1, overwrite: true }); // Return to hover state size if still hovering
    };

    // Robust listener attachment
    const addListeners = () => {
      const links = document.querySelectorAll('a, button, .magnetic-target, input, textarea, select');
      links.forEach(link => {
        link.removeEventListener('mouseenter', onHover);
        link.removeEventListener('mouseleave', onUnhover);
        link.removeEventListener('mousedown', onMouseDown);
        link.removeEventListener('mouseup', onMouseUp);

        link.addEventListener('mouseenter', onHover);
        link.addEventListener('mouseleave', onUnhover);
        link.addEventListener('mousedown', onMouseDown);
        link.addEventListener('mouseup', onMouseUp);
      });
    };

    addListeners();

    // Observe DOM changes to attach listeners to new elements
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(loop);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#00f3ff] rounded-full pointer-events-none z-[99999] hidden md:block"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-[#00f3ff] rounded-full pointer-events-none z-[99998] transition-opacity duration-300 hidden md:block"
      />
    </>
  );
};

export default Cursor;
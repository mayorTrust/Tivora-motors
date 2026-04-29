import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X } from 'lucide-react';

const AudioPermissionModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-black border border-white/10 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] max-w-lg w-full relative overflow-hidden ring-1 ring-white/20"
          >
            {/* Abstract Background Element */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl" />
            
            <div className="absolute top-0 right-0 p-6">
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-theme-accent/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-theme-accent relative">
                  <Mic size={40} className="drop-shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.5)]" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  Initialize <span className="text-theme-accent">Cipher OS</span>
                </h2>
                <p className="text-white/50 leading-relaxed font-medium">
                  Unlock the full potential of Tivora Motors with voice-native AI commands. Navigate the showroom and control the environment with zero latency.
                </p>
              </div>

              <div className="w-full space-y-4 pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-theme-accent hover:text-white transition-all shadow-xl active:scale-[0.98] ring-1 ring-white/10"
                >
                  Establish Secure Link
                </button>
                <div className="flex items-center justify-center gap-2 opacity-30">
                  <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white font-mono">
                    System Ready • Biometric Verification Not Required
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AudioPermissionModal;

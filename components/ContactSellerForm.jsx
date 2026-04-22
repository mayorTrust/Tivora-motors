import React, { useState } from 'react';
import { X, Send, User, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

const ContactSellerForm = ({ isOpen, onClose, vehicleName }) => {
  const [status, setStatus] = useState('form');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
  };

  const handleClose = () => {
    setStatus('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
      
      <div className="relative w-full max-w-xl glass-card rounded-[2.5rem] border-white/10 overflow-hidden bg-[#050505] shadow-2xl">
        {status === 'form' ? (
          <>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Direct <span className="text-accent">Inquiry</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Uplink regarding {vehicleName}</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Identity</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input required type="text" placeholder="FULL NAME" className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-accent/50 transition-all" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Network Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-accent/50 transition-all" />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Intelligence Request</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-gray-700" />
                  <textarea rows={4} placeholder="INQUIRE ABOUT SPECS, PRICING, OR AVAILABILITY..." className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-accent/50 transition-all resize-none"></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-white text-black font-black py-5 rounded-2xl transition-all shadow-lg shadow-accent/20 uppercase tracking-[0.2em] text-xs"
              >
                Transmit Query
              </button>
            </form>
          </>
        ) : (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-accent/30">
               <Send size={40} className="text-black" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">Transmission Sent</h3>
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-relaxed">Your inquiry has been synchronized with our sales matrix. Expect an uplink within 24 hours.</p>
            </div>
            <button onClick={handleClose} className="bg-white/5 border border-white/10 text-white font-black py-4 px-10 rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px]">
              Close Signal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSellerForm;

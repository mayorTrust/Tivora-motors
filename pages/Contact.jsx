import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Globe, Shield } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/50">Global Communications Uplink</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-8 uppercase leading-none text-white">
          Establish <span className="text-accent">Contact</span>
        </h1>
        <p className="text-foreground/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-tight">
          Initiate a secure session with our elite acquisition specialists and technical advisors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Phone className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="flex gap-6">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                   <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Direct Line</p>
                  <p className="text-xl font-bold text-white tracking-tight">+1 (555) TIVORA-8</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                   <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Data Uplink</p>
                  <p className="text-xl font-bold text-white tracking-tight">ops@tivoramotors.com</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                   <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Sector Origin</p>
                  <p className="text-xl font-bold text-white tracking-tight">Beverly Hills, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-[#00f2ff]/5 border-l-4 border-l-accent">
             <Shield className="text-accent mb-6 w-10 h-10" />
             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Encrypted Channel</h3>
             <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-relaxed">All communications are synchronized through our secure neural matrix ensuring absolute client confidentiality.</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-10 sm:p-12 rounded-[3rem] border-white/5 bg-white/[0.01]">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 px-1">Subject Identity</label>
                  <input type="text" placeholder="YOUR FULL NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all uppercase placeholder:text-white/5" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 px-1">Network Node</label>
                  <input type="email" placeholder="YOUR EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all uppercase placeholder:text-white/5" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 px-1">Inquiry Protocol</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all uppercase appearance-none">
                  <option className="bg-black">Asset Acquisition</option>
                  <option className="bg-black">Bespoke Search Request</option>
                  <option className="bg-black">Fleet Consignment</option>
                  <option className="bg-black">Technical Support</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 px-1">Detailed Transmission</label>
                <textarea rows={6} placeholder="INITIATE MESSAGE DATA..." className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all uppercase resize-none placeholder:text-white/5"></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-white hover:text-black text-black font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs shadow-xl shadow-accent/10"
              >
                <Send size={18} /> Transmit Query Sequence
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

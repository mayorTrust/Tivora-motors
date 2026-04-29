import React from 'react';
import { Target, Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-accent" />
            <span className="text-accent font-black uppercase tracking-[0.3em] text-xs">Our Genesis</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-10 uppercase leading-none text-white">
            Architects of <br/><span className="text-accent">Motion</span>
          </h1>
          <p className="text-foreground/40 text-lg leading-relaxed mb-8 font-medium">
            Tivora Motors represents the pinnacle of high-performance vehicle curation. What began as a boutique acquisition firm has evolved into a global matrix for elite automotive enthusiasts.
          </p>
          <p className="text-foreground/40 text-lg leading-relaxed font-medium">
            We specialize in cross-referencing rare assets, ensuring every vehicle in our vault meets an uncompromising protocol of engineering excellence and digital provenance.
          </p>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-full border-2 border-dashed border-accent/20 absolute -inset-6 animate-[spin_30s_linear_infinite]" />
          <div className="aspect-square rounded-full border border-white/5 absolute -inset-12" />
          <img
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800"
            alt="Operational Headquarters"
            className="rounded-[4rem] relative z-10 w-full aspect-square object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000 shadow-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {[
          { icon: <Target className="w-10 h-10" />, title: 'Mission', desc: 'To deploy high-performance mobility solutions that redefine adventure.' },
          { icon: <ShieldCheck className="w-10 h-10" />, title: 'Protocol', desc: 'Rigorous multi-point synchronization exceeding industry standards.' },
          { icon: <Users className="w-10 h-10" />, title: 'Network', desc: 'A hub for global enthusiasts, specialists, and collectors.' },
          { icon: <Award className="w-10 h-10" />, title: 'Certified', desc: 'Top-tier recognition in the exotic and performance mobility sector.' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-10 rounded-[3rem] group hover:bg-accent/5 transition-all border-white/5">
            <div className="mb-8 group-hover:scale-110 transition-transform text-accent">{item.icon}</div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">{item.title}</h3>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 sm:p-24 rounded-[4rem] text-center overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-4xl md:text-6xl font-black mb-10 uppercase italic tracking-tighter text-white">Join the <span className="text-accent">Operation</span></h2>
        <p className="text-foreground/40 max-w-2xl mx-auto mb-12 text-lg font-medium">We are consistently seeking high-tier operatives: master mechanics, acquisition consultants, and technical advisors who live within the performance matrix.</p>
        <button className="bg-white text-black font-black px-12 py-6 rounded-3xl hover:bg-accent transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-accent/5 flex items-center justify-center gap-3 mx-auto">
          View Open Nodes <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default About;

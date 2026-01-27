

import React from 'react';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-[#00f3ff] font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-black italic mb-8">DRIVING <span className="text-[#00f3ff]">EXCELLENCE</span> SINCE 2008</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              TIVORARIDES started with a simple vision: to bridge the gap between dream vehicles and high-performance reality. What began as a small boutique car lot has grown into a multi-category dealership serving enthusiasts nationwide.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              We specialize in curating the finest selection of cars, bikes, and alternative personal transportation, ensuring that every vehicle meets our uncompromising standards of safety and excitement. Tivora - Ride your way.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full border-2 border-dashed border-[#00f3ff]/30 absolute -inset-4 animate-[spin_20s_linear_infinite]" />
            <img
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800"
              alt="Our office"
              className="rounded-3xl relative z-10 w-full aspect-square object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          {[
            { icon: <Target className="w-10 h-10 text-[#00f3ff]" />, title: 'Mission', desc: 'To deliver high-performance mobility solutions that inspire adventure and freedom.' },
            { icon: <ShieldCheck className="w-10 h-10 text-[#00f3ff]" />, title: 'Quality', desc: 'A rigorous multi-point inspection process that exceeds industry standards.' },
            { icon: <Users className="w-10 h-10 text-[#00f3ff]" />, title: 'Community', desc: 'We aren\'t just a dealership; we are a hub for enthusiasts and hobbyists.' },
            { icon: <Award className="w-10 h-10 text-[#00f3ff]" />, title: 'Certified', desc: 'Recognized as one of the top specialized dealerships for exotic and performance models.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-8 rounded-3xl group hover:bg-[#00f3ff]/5 transition-colors">
              <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-12 rounded-[3rem] text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f3ff]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-3xl md:text-5xl font-black mb-8">WANT TO JOIN OUR TEAM?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">We are always looking for passionate mechanics, sales consultants, and marketing experts who live and breathe high-performance vehicles.</p>
          <button className="bg-white text-black font-black px-10 py-4 rounded-full hover:bg-[#00f3ff] hover:text-black transition-all uppercase tracking-widest text-sm">
            View Careers
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

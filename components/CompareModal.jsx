import React from 'react';
import { X, Check, ArrowRight, Gauge, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareModal = ({ isOpen, onClose, vehicles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl glass-card rounded-[3rem] border border-white/10 overflow-hidden flex flex-col bg-background/50 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
              <Zap size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Side-by-Side <span className="text-accent">Analysis</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Cross-Referencing Fleet Specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-x-auto p-8 custom-scrollbar">
          <div className="flex min-w-max gap-8 h-full">
            {vehicles.map((v) => (
              <div key={v.id} className="w-80 flex flex-col group">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5 bg-black/40">
                  <img src={v.images?.[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-accent text-black text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {v.category}
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{v.name}</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{v.brand}</p>
                    <p className="text-2xl font-black text-accent mt-3 tracking-tighter">${v.price.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Performance Heart</p>
                        <p className="text-xs font-bold text-white/80">{v.engine}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Usage State</p>
                        <p className="text-xs font-bold text-white/80 flex items-center gap-2">
                           <Gauge size={12} className="text-accent" /> {v.mileage.toLocaleString()} miles
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Deployment Zone</p>
                        <p className="text-xs font-bold text-white/80 flex items-center gap-2">
                           <MapPin size={12} className="text-accent" /> {v.location}
                        </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={`/vehicle/${v.id}`}
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/5 text-white hover:bg-accent hover:text-black transition-all font-black text-[10px] uppercase tracking-widest border border-white/10 hover:border-accent"
                    >
                      Inspect Detailed Specs <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;


import React from 'react';
import { X, GitCompareArrows, Trash2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const CompareBar = ({ selectedVehicles, onRemove, onClear, onCompare }) => {
  const barRef = React.useRef(null);

  React.useEffect(() => {
    if (selectedVehicles.length > 0) {
      gsap.to(barRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(barRef.current, { y: 100, opacity: 0, duration: 0.5, ease: "power3.in" });
    }
  }, [selectedVehicles.length]);

  if (selectedVehicles.length === 0) return <div ref={barRef} className="fixed bottom-0 left-0 right-0 translate-y-full opacity-0 pointer-events-none" />;

  return (
    <div 
      ref={barRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-4xl glass-card rounded-[2.5rem] p-4 shadow-2xl border-accent/20 flex items-center gap-6 backdrop-blur-3xl bg-background/80"
    >
      <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
        {selectedVehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            className="flex-shrink-0 group relative w-16 h-16 rounded-2xl overflow-hidden border border-foreground/10 hover:border-accent/50 transition-all"
          >
            <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
            <button 
              onClick={() => onRemove(vehicle.id)}
              className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {selectedVehicles.length < 4 && (
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl border-2 border-dashed border-foreground/10 flex items-center justify-center text-foreground/20">
            <GitCompareArrows className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-l border-foreground/10 pl-6">
        <div className="hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Comparison Slot</p>
          <p className="text-sm font-black text-foreground italic">{selectedVehicles.length} of 4 <span className="text-accent">Selected</span></p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onClear}
            className="p-4 rounded-2xl bg-foreground/5 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
            title="Clear All"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onCompare}
            disabled={selectedVehicles.length < 2}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
              selectedVehicles.length >= 2 
                ? 'bg-accent text-background shadow-accent/20 hover:scale-105 active:scale-95' 
                : 'bg-foreground/5 text-foreground/20 cursor-not-allowed'
            }`}
          >
            Compare <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;

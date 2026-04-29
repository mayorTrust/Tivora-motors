import React from 'react';
import { X, GitCompareArrows, Trash2 } from 'lucide-react';

const CompareBar = ({ selectedVehicles, onRemove, onClear, onCompare }) => {
  if (selectedVehicles.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1500] p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-5xl mx-auto glass-card rounded-[2.5rem] border-white/10 p-4 shadow-2xl bg-background/80 backdrop-blur-2xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-2">
          {selectedVehicles.map(vehicle => (
            <div key={vehicle.id} className="flex-shrink-0 relative group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                <img src={vehicle.images?.[0]} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={() => onRemove(vehicle.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          
          {selectedVehicles.length < 4 && (
            <div className="w-16 h-16 rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-white/20">
               <GitCompareArrows size={20} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
                <p className="text-white font-black italic uppercase tracking-tighter text-sm">Compare Matrix</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{selectedVehicles.length} of 4 Assets Selected</p>
            </div>
            
            <div className="h-10 w-px bg-white/5 hidden md:block" />

            <button
                onClick={onClear}
                className="p-4 text-gray-500 hover:text-red-400 transition-colors"
                title="Clear All"
            >
                <Trash2 size={18} />
            </button>

            <button
                onClick={onCompare}
                disabled={selectedVehicles.length < 2}
                className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                    selectedVehicles.length >= 2 
                    ? 'bg-accent text-black shadow-lg shadow-accent/20 hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                }`}
            >
                Initiate Analysis
            </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;

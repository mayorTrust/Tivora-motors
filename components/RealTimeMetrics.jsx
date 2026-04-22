import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const RealTimeMetrics = ({ vehicleId }) => {
  const [viewers, setViewers] = useState(0);
  const [demand, setDemand] = useState('Stable');

  useEffect(() => {
    // Simulate real-time viewer count based on vehicle ID
    const baseViewers = Math.floor(Math.random() * 5) + 2;
    setViewers(baseViewers);

    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = Math.max(1, prev + change);
        if (newVal > 8) setDemand('High');
        else if (newVal > 4) setDemand('Rising');
        else setDemand('Stable');
        return newVal;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [vehicleId]);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
        <div className="relative">
          <Eye className="w-4 h-4 text-[#00f2ff]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Live Viewers</span>
          <span className="text-sm font-bold text-white">{viewers} active</span>
        </div>
      </div>

      <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Market Demand</span>
          <span className="text-sm font-bold text-green-400">{demand}</span>
        </div>
      </div>

      <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
        <ShieldCheck className="w-4 h-4 text-[#00f2ff]/60" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Verification</span>
          <span className="text-sm font-bold text-white/80">Certified</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;

import React, { useState, useEffect } from 'react';
import { Zap, Shield, Star, Award } from 'lucide-react';

const ActivityTicker = () => {
  const [activities, setActivities] = useState([
    "Elite Membership provisioned for operative_77",
    "Ferrari Roma Spider inquiry received from Beverly Hills",
    "Showroom collection updated: MV Agusta Superveloce added",
    "Market valuation for Porsche 911 GT3 RS increased by 2.4%",
    "Biometric authentication protocol updated for all sectors",
    "New inventory asset authorized: Canyon Aeroad CFR",
    "Global fleet tracking synchronized across 12 zones"
  ]);

  return (
    <div className="bg-black/80 border-y border-white/5 py-4 overflow-hidden relative group">
      <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:pause">
        {[...activities, ...activities].map((text, i) => (
          <div key={i} className="flex items-center gap-4">
            <Zap className="w-3 h-3 text-[#00f2ff]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
              {text}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ActivityTicker;

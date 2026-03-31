
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star, Shield, Zap, Award, Globe } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import CompareBar from '../components/CompareBar';
import CompareModal from '../components/CompareModal';
import { useWishlist } from '../hooks/useWishlist';

const Home = ({ featuredVehicles }) => {
  const { wishlist: globalWishlist, toggleWishlist } = useWishlist();

  // State for compare feature
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // CIPHER Event Listeners
  React.useEffect(() => {
    const handleVoiceWishlist = (e) => {
      const { id, action } = e.detail;
      const alreadyIn = globalWishlist.includes(id);
      if ((action === 'add' && !alreadyIn) || (action === 'remove' && alreadyIn)) {
        toggleWishlist(id);
      }
    };
    
    const handleVoiceCompare = (e) => {
      const { ids } = e.detail;
      setCompareList(ids);
      setShowCompareModal(true);
    };

    window.addEventListener('tivora-manage-wishlist', handleVoiceWishlist);
    window.addEventListener('tivora-compare-vehicles', handleVoiceCompare);
    
    return () => {
      window.removeEventListener('tivora-manage-wishlist', handleVoiceWishlist);
      window.removeEventListener('tivora-compare-vehicles', handleVoiceCompare);
    };
  }, [globalWishlist, toggleWishlist]);

  const handleCompare = (vehicleId) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      }
      if (prev.length >= 4) {
        alert("Maximum 4 vehicles can be compared at once.");
        return prev;
      }
      return [...prev, vehicleId];
    });
  };

  const selectedToCompare = useMemo(() => {
    // We need all vehicles to filter from, but here we only have featured.
    // However, comparison usually happens within the same context.
    // In a real app, we might need the full inventory here or just filter from featured.
    return featuredVehicles.filter(v => compareList.includes(v.id));
  }, [featuredVehicles, compareList]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105 animate-[pulse_10s_infinite_alternate]">
          <img
            src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover opacity-60 brightness-75 transition-all duration-1000"
            alt="Hero background - Red Ferrari"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative z-10 w-full max-w-[90rem] px-4 sm:px-12 lg:px-24">
          <div className="max-w-4xl mt-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/80">PREMIUM AUTO SPECIALIST</span>
            </div>
            <h1 className="text-4xl sm:text-7xl lg:text-9xl font-black italic tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-left duration-700 uppercase text-foreground">
              TIVORA <span className="text-accent block drop-shadow-2xl">MOTORS.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/60 mb-10 max-w-lg leading-relaxed animate-in fade-in slide-in-from-left duration-1000">
              High-performance engineering meets world-class curation at TIVORA MOTORS. Find the machine that moves you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Link
                to="/inventory"
                className="bg-accent hover:bg-foreground hover:text-background text-background px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-accent/20"
              >
                Enter Showroom <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-md transition-all"
              >
                The Legacy
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce opacity-20 text-foreground">
          <span className="text-[9px] uppercase tracking-[0.4em] font-black">Scroll</span>
          <div className="w-px h-16 bg-foreground" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background border-y border-foreground/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Exotics Delivered', value: '1.2K+' },
              { label: 'Specialists', value: '30' },
              { label: 'Awards Won', value: '12' },
              { label: 'Reputation', value: '99%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group border-r border-foreground/5 last:border-none">
                <div className="text-4xl md:text-6xl font-black text-foreground mb-2 group-hover:text-accent transition-colors duration-500 tabular-nums">{stat.value}</div>
                <div className="text-foreground/50 uppercase tracking-[0.2em] text-[9px] font-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-accent font-black uppercase tracking-[0.4em] text-[9px] mb-4 block">Curated Selection</span>
            <h2 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter leading-none italic uppercase">THE <span className="text-accent">PRIME</span> VAULT</h2>
          </div>
          <Link
            to="/inventory"
            className="group flex items-center gap-3 text-foreground/50 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]"
          >
            Showroom Full View <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform bg-foreground/5 rounded-full p-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredVehicles.slice(0, 4).map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onCompare={handleCompare}
              isCompared={compareList.includes(vehicle.id)}
            />
          ))}
        </div>
      </section>

      {/* THE BLUEPRINT - CIPHER INTEGRATION MENTION */}
      <section className="py-24 sm:py-40 relative bg-grid overflow-hidden border-t border-foreground/5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] sm:text-[25rem] font-black text-outline uppercase select-none opacity-20 whitespace-nowrap">
          STANDARDS
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Philosophy</span>
              <h2 className="text-5xl sm:text-7xl font-black mb-8 tracking-tighter italic uppercase leading-[0.9] text-foreground">THE <br/><span className="text-accent">BLUEPRINT.</span></h2>
              <p className="text-foreground/60 text-lg mb-10 leading-relaxed">We don't just sell vehicles. We engineer confidence through a proprietary verification process that ensures every machine leaving our showroom is in its peak performance state.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-4 glass-card rounded-2xl group hover:bg-accent/5 transition-all cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground uppercase text-sm mb-1">UNCOMPROMISED VETTING</h4>
                    <p className="text-xs text-foreground/50">Every bolt, every pixel, every line of code inspected.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 glass-card rounded-2xl group hover:bg-accent/5 transition-all cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground uppercase text-sm mb-1">CIPHER ASSISTANCE</h4>
                    <p className="text-xs text-foreground/50">Our Cyber Intelligence Protocol manages your showroom experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {/* Feature Cards Grid */}
              <div className="space-y-6 lg:mt-12">
                <div className="glass-card p-10 rounded-[3rem] neon-glow transition-all duration-500 border-l-4 border-l-accent">
                  <Star className="w-10 h-10 text-accent mb-6" />
                  <h3 className="text-2xl font-black mb-4 uppercase italic text-foreground">VVIP <br/>CONCIERGE</h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">Direct 24/7 access to our master mechanics and lifestyle advisors. We manage your fleet so you can focus on the drive.</p>
                </div>
                <div className="glass-card p-10 rounded-[3rem] neon-glow transition-all duration-500 bg-foreground/[0.03]">
                  <Award className="w-10 h-10 text-foreground/30 mb-6" />
                  <h3 className="text-2xl font-black mb-4 uppercase italic text-foreground">CERTIFIED <br/>HISTORY</h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">Full transparent digital provenance and maintenance records for every vehicle in our collection.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass-card p-10 rounded-[3rem] neon-glow transition-all duration-500 bg-foreground/[0.03]">
                  <Zap className="w-10 h-10 text-accent mb-6" />
                  <h3 className="text-2xl font-black mb-4 uppercase italic text-foreground">INSTANT <br/>APPRAISAL</h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">Leverage our AI-driven market data to get the absolute top-tier value for your trade-ins and consignments.</p>
                </div>
                <div className="bg-accent p-10 rounded-[3rem] shadow-2xl shadow-accent/30 transform hover:-rotate-2 transition-transform cursor-pointer">
                  <h3 className="text-3xl font-black text-background mb-6 uppercase italic leading-none">JOIN THE <br/>COLLECTORS <br/>CIRCLE.</h3>
                  <p className="text-background/80 text-sm mb-8">Exclusive access to off-market inventory and private racing events across Europe and the US.</p>
                  <ArrowRight className="w-10 h-10 text-background" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 sm:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <h2 className="text-4xl sm:text-6xl font-black italic mb-6 uppercase tracking-tighter text-foreground">Stay <span className="text-accent">Synchronized</span></h2>
          <p className="text-foreground/50 max-w-xl mx-auto mb-10 text-lg font-medium">Be the first to know about new showroom arrivals and private auction drops.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              className="bg-foreground/5 border border-foreground/10 rounded-full px-8 py-4 flex-grow focus:outline-none focus:border-accent text-xs font-black uppercase tracking-widest text-foreground"
            />
            <button className="bg-foreground text-background font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all whitespace-nowrap">
              Secure Invite
            </button>
          </div>
        </div>
      </section>

      <CompareBar 
        selectedVehicles={selectedToCompare} 
        onRemove={handleCompare} 
        onClear={() => setCompareList([])}
        onCompare={() => setShowCompareModal(true)}
      />

      <CompareModal 
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        vehicles={selectedToCompare}
      />
    </div>
  );
};

export default Home;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Gauge, CheckCircle, MessageCircle, CreditCard, Share2 } from 'lucide-react';
import { SkeletonDetails } from '../components/Loading';
import PaymentAssistant from '../components/PaymentAssistant';

const VehicleDetails = ({ vehicles }) => {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    // Simulate loading details
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <SkeletonDetails />;
  }

  if (!vehicle) {
    return (
      <div className="pt-40 text-center h-screen">
        <h2 className="text-3xl font-black mb-6 italic text-foreground">ENTITY NOT FOUND</h2>
        <Link to="/inventory" className="text-accent font-bold hover:underline tracking-widest uppercase text-xs">Return to Collection</Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi TIVORA_RIDES, I'm inquiring regarding ${vehicle.name} (${vehicle.year}) listed for $${vehicle.price.toLocaleString()}.`);
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10">
        <Link to="/inventory" className="flex items-center gap-3 text-foreground/50 hover:text-foreground transition-all group font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform bg-foreground/5 rounded-full p-1" /> Collection Overview
        </Link>
        <button className="p-3 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-all text-foreground/60">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-foreground/10 bg-black/50 group">
            <img
              src={vehicle.images[activeImage]}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {vehicle.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-28 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-accent scale-95 shadow-lg shadow-accent/20' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent text-background text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                {vehicle.category}
              </span>
              <div className="w-1 h-1 rounded-full bg-foreground/30" />
              <span className="text-foreground/50 font-black text-[9px] uppercase tracking-[0.2em]">{vehicle.condition} CONDITION</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic mb-4 tracking-tighter leading-none text-foreground">{vehicle.name}</h1>
            <div className="text-4xl font-black text-accent tracking-tighter">${vehicle.price.toLocaleString()}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Calendar className="w-5 h-5" />, label: 'Model Year', val: vehicle.year },
              { icon: <Gauge className="w-5 h-5" />, label: 'Mileage', val: `${vehicle.mileage.toLocaleString()} mi` },
              { icon: <MapPin className="w-5 h-5" />, label: 'Location', val: vehicle.location.split(',')[0] },
              { icon: <CheckCircle className="w-5 h-5" />, label: 'Manufacturer', val: vehicle.brand },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 rounded-3xl flex flex-col items-center text-center group hover:bg-foreground/[0.08] transition-all">
                <div className="text-foreground/60 mb-3 group-hover:text-accent transition-colors">{stat.icon}</div>
                <span className="text-[9px] text-foreground/60 font-black uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="font-bold text-sm text-foreground/90">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Narrative</h3>
            <p className="text-foreground/60 leading-relaxed text-lg">
              {vehicle.description}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Core Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Power Unit', val: vehicle.engine },
                { label: 'Transmission', val: vehicle.transmission },
                { label: 'Exterior Finish', val: vehicle.color },
                { label: 'Availability', val: 'Immediate', accent: true },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between p-4 bg-foreground/5 rounded-2xl border border-foreground/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 self-center">{spec.label}</span>
                  <span className={`font-bold text-sm ${spec.accent ? 'text-green-500' : 'text-foreground/80'}`}>{spec.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-8">
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex-[1.2] bg-accent hover:brightness-110 text-background font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-accent/20 uppercase tracking-widest text-xs"
            >
              <CreditCard className="w-5 h-5" /> Secure Checkout
            </button>
            <button 
              onClick={handleWhatsApp}
              className="flex-1 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs shadow-xl"
            >
              <MessageCircle className="w-5 h-5" /> Inquire Price
            </button>
          </div>
        </div>
      </div>

      <PaymentAssistant 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        vehicleName={vehicle.name} 
        price={vehicle.price} 
      />
    </div>
  );
};

export default VehicleDetails;

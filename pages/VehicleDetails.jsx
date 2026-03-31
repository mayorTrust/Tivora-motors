import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Gauge, CheckCircle, MessageCircle, CreditCard, Share2, Heart } from 'lucide-react';
import { SkeletonDetails } from '../components/Loading';
import PaymentAssistant from '../components/PaymentAssistant';
import FullSpecsTable from '../components/FullSpecsTable';
import VehicleCard from '../components/VehicleCard'; // Import VehicleCard
import ContactSellerForm from '../components/ContactSellerForm'; // New Import
import BookTestDriveForm from '../components/BookTestDriveForm'; // New Import
import LoanCalculator from '../components/LoanCalculator'; // New Import
import CompareBar from '../components/CompareBar';
import CompareModal from '../components/CompareModal';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';

const VehicleDetails = ({ vehicles }) => {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isContactSellerOpen, setIsContactSellerOpen] = useState(false); // New State
  const [isBookTestDriveOpen, setIsBookTestDriveOpen] = useState(false); // New State
  
  // State for compare feature
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    // Reset comparisons and scroll to top when vehicle changes
    setCompareList([]);
    window.scrollTo(0, 0);
    // Simulate loading details
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  // CIPHER Event Listeners
  useEffect(() => {
    const handleVoiceWishlist = (e) => {
      const { id: vid, action } = e.detail;
      const alreadyIn = isInWishlist(vid);
      if ((action === 'add' && !alreadyIn) || (action === 'remove' && alreadyIn)) {
        toggleWishlist(vid);
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
  }, [isInWishlist, toggleWishlist]);

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

  const isSaved = isInWishlist(vehicle.id);

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please log in to save to wishlist.');
      return;
    }
    toggleWishlist(vehicle.id);
  };

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
    return vehicles.filter(v => compareList.includes(v.id));
  }, [vehicles, compareList]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi TIVORA_RIDES, I'm inquiring regarding ${vehicle.name} (${vehicle.year}) listed for $${vehicle.price.toLocaleString()}.`);
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  const similarVehicles = vehicles.filter(
    (v) =>
      v.id !== vehicle.id &&
      (v.brand === vehicle.brand || v.category === vehicle.category)
  ).slice(0, 3); // Get up to 3 similar vehicles

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10">
        <Link to="/inventory" className="flex items-center gap-3 text-foreground/50 hover:text-foreground transition-all group font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform bg-foreground/5 rounded-full p-1" /> Collection Overview
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-all ${isSaved ? 'bg-accent text-background' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-background' : ''}`} />
          </button>
          <button className="p-3 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-all text-foreground/60">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
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

          <FullSpecsTable vehicle={vehicle} />

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
              onClick={() => setIsBookTestDriveOpen(true)} // Open BookTestDriveForm
              className="flex-[1.2] bg-accent hover:brightness-110 text-background font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-accent/20 uppercase tracking-widest text-xs"
            >
              <Calendar className="w-5 h-5" /> Book Test Drive
            </button>
            <button 
              onClick={() => setIsContactSellerOpen(true)} // Open ContactSellerForm
              className="flex-1 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs shadow-xl"
            >
              <MessageCircle className="w-5 h-5" /> Contact Seller
            </button>
            {/* Keeping Secure Checkout for now, can be replaced later if needed */}
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex-1 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs shadow-xl"
            >
              <CreditCard className="w-5 h-5" /> Secure Checkout
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
      <ContactSellerForm 
        isOpen={isContactSellerOpen} 
        onClose={() => setIsContactSellerOpen(false)} 
        vehicleName={vehicle.name} 
      />
      <BookTestDriveForm 
        isOpen={isBookTestDriveOpen} 
        onClose={() => setIsBookTestDriveOpen(false)} 
        vehicleName={vehicle.name} 
      />

      {similarVehicles.length > 0 && (
        <div className="mt-20">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-10 uppercase leading-none text-foreground text-center">
            <span className="text-accent">Similar</span> Rides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarVehicles.map((similarVehicle) => (
              <VehicleCard 
                key={similarVehicle.id} 
                vehicle={similarVehicle} 
                onCompare={handleCompare}
                isCompared={compareList.includes(similarVehicle.id)}
              />
            ))}
          </div>
        </div>
      )}

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

export default VehicleDetails;

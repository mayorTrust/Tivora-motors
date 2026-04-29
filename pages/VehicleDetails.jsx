import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Gauge, CheckCircle, MessageCircle, CreditCard, Share2, Heart, ShoppingCart } from 'lucide-react';
import { SkeletonDetails } from '../components/Loading';
import PaymentAssistant from '../components/PaymentAssistant';
import FullSpecsTable from '../components/FullSpecsTable';
import VehicleCard from '../components/VehicleCard';
import ContactSellerForm from '../components/ContactSellerForm';
import BookTestDriveForm from '../components/BookTestDriveForm';
import LoanCalculator from '../components/LoanCalculator';
import CompareBar from '../components/CompareBar';
import CompareModal from '../components/CompareModal';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import RealTimeMetrics from '../components/RealTimeMetrics';

const VehicleDetails = ({ vehicles }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isContactSellerOpen, setIsContactSellerOpen] = useState(false);
  const [isBookTestDriveOpen, setIsBookTestDriveOpen] = useState(false);
  
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const vehicle = useMemo(() => vehicles.find((v) => v.id === id), [vehicles, id]);
  
  const selectedToCompare = useMemo(() => {
    return vehicles.filter(v => compareList.includes(v.id));
  }, [vehicles, compareList]);

  const similarVehicles = useMemo(() => {
    if (!vehicle) return [];
    return vehicles.filter(
      (v) =>
        v.id !== vehicle.id &&
        (v.brand === vehicle.brand || v.category === vehicle.category)
    ).slice(0, 3);
  }, [vehicles, vehicle]);

  useEffect(() => {
    setCompareList([]);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

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
      <div className="pt-40 text-center h-screen bg-background">
        <h2 className="text-3xl font-black mb-6 italic text-foreground tracking-tighter uppercase">ENTITY NOT FOUND</h2>
        <Link to="/inventory" className="text-accent font-black hover:underline tracking-widest uppercase text-xs">Return to Collection</Link>
      </div>
    );
  }

  const images = vehicle.images || [];
  const isSaved = isInWishlist(vehicle.id);

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please log in to save to favorites.');
      return;
    }
    toggleWishlist(vehicle.id);
  };

  const handleCompare = (vehicleId) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(vid => vid !== vehicleId);
      }
      if (prev.length >= 4) {
        alert("Maximum 4 vehicles can be compared at once.");
        return prev;
      }
      return [...prev, vehicleId];
    });
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10">
        <Link to="/inventory" className="flex items-center gap-3 text-foreground/50 hover:text-foreground transition-all group font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform bg-foreground/5 rounded-full p-1" /> Collection Overview
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-all ${isSaved ? 'bg-accent text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
            title={isSaved ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
          </button>
          <button className="p-3 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-all text-foreground/60">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-foreground/10 bg-black/50 group shadow-2xl">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/20 italic font-medium uppercase tracking-widest text-xs bg-white/5">
                No Preview Available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, idx) => (
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
          )}
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                {vehicle.category}
              </span>
              <div className="w-1 h-1 rounded-full bg-foreground/30" />
              <span className="text-foreground/50 font-black text-[9px] uppercase tracking-[0.2em]">{vehicle.condition} CONDITION</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic mb-4 tracking-tighter leading-none text-foreground uppercase">{vehicle.name}</h1>
            <div className="text-4xl font-black text-accent tracking-tighter">${vehicle.price.toLocaleString()}</div>
          </div>

          <RealTimeMetrics vehicleId={vehicle.id} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Calendar className="w-5 h-5" />, label: 'Model Year', val: vehicle.year },
              { icon: <Gauge className="w-5 h-5" />, label: 'Mileage', val: `${vehicle.mileage.toLocaleString()} mi` },
              { icon: <MapPin className="w-5 h-5" />, label: 'Location', val: vehicle.location?.split(',')[0] || 'Unknown' },
              { icon: <CheckCircle className="w-5 h-5" />, label: 'Manufacturer', val: vehicle.brand },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-stat rounded-3xl flex flex-col items-center text-center group hover:bg-foreground/[0.08] transition-all border-white/5">
                <div className="text-foreground/60 mb-3 group-hover:text-accent transition-colors">{stat.icon}</div>
                <span className="text-[9px] text-foreground/60 font-black uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="font-bold text-sm text-foreground/90">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Narrative</h3>
            <p className="text-foreground/60 leading-relaxed text-lg font-medium">
              {vehicle.description || "Detailed intelligence report pending for this asset."}
            </p>
          </div>

          <FullSpecsTable vehicle={vehicle} />

          <div className="flex flex-col sm:flex-row gap-5 pt-8">
            <button
              onClick={() => addToCart(vehicle)}
              className="flex-1 bg-accent hover:brightness-110 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-accent/20 uppercase tracking-widest text-xs"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={() => setIsBookTestDriveOpen(true)}
              className="flex-1 bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl uppercase tracking-widest text-xs"
            >
              <Calendar className="w-5 h-5" /> Book Test Drive
            </button>
          </div>
          <button 
              onClick={() => setIsContactSellerOpen(true)}
              className="w-full bg-foreground/5 border border-white/10 hover:bg-foreground/10 text-foreground font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs shadow-xl"
            >
              <MessageCircle className="w-5 h-5" /> Contact Seller
            </button>
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
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-12 uppercase leading-none text-foreground text-center">
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, MapPin, Calendar, Gauge, Heart, GitCompareArrows, ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const InfoPill = ({ icon: Icon, value, text }) => (
  <div className="flex flex-col items-center p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/5">
    {Icon && <Icon className="w-3 h-3 text-foreground/50 mb-1.5" />}
    <span className={`text-[10px] font-bold text-foreground/50 uppercase tracking-widest truncate w-full text-center ${!Icon && 'font-black text-accent'}`}>
      {value || text}
    </span>
  </div>
);

const VehicleCard = ({ vehicle, onCompare, isCompared }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isSaved = isInWishlist(vehicle.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to save to favorites.');
      return;
    }
    toggleWishlist(vehicle.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(vehicle);
  };

  return (
    <div className="group glass-card rounded-[2rem] overflow-hidden hover:border-accent/30 transition-all duration-700 hover:-translate-y-3 flex flex-col h-full bg-background/50 border-white/5">
      <div className="relative aspect-[16/11] overflow-hidden bg-foreground/5">
        {!imageLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={vehicle.images?.[0]}
          alt={vehicle.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-accent text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/50">
            {vehicle.category}
          </span>
          {vehicle.featured && (
            <span className="bg-white text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/50">
              PRIME
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
                onClick={handleWishlistClick}
                className={`p-3 bg-background/60 backdrop-blur-sm rounded-full transition-all ${isSaved ? 'text-black bg-accent' : 'text-foreground/70 hover:text-black hover:bg-accent'}`}
                title={isSaved ? "Remove from Favorites" : "Add to Favorites"}
            >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompare(vehicle.id);
              }}
              className={`p-3 bg-background/60 backdrop-blur-sm rounded-full transition-all ${isCompared ? 'text-black bg-accent' : 'text-foreground/70 hover:bg-accent hover:text-black'}`}
              title="Compare"
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-background/60 backdrop-blur-sm rounded-full text-foreground/70 hover:bg-accent hover:text-black transition-all"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="bg-accent text-black font-black py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-[10px]"
          >
            <Eye className="w-4 h-4" />
            Inspect Details
          </Link>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6 gap-4">
          <h3 className="text-xl font-black text-white group-hover:text-accent transition-colors leading-tight italic uppercase tracking-tighter truncate">
            {vehicle.name}
          </h3>
          <span className="text-lg font-black text-accent whitespace-nowrap tracking-tighter">
            ${vehicle.price?.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <InfoPill icon={Calendar} value={vehicle.year} />
          <InfoPill icon={Gauge} value={`${Math.floor((vehicle.mileage || 0) / 1000)}k mi`} />
          <InfoPill icon={MapPin} value={vehicle.location?.split(',')[0] || 'N/A'} />
          <InfoPill text={vehicle.condition} />
        </div>

        <p className="text-foreground/40 text-[11px] leading-relaxed line-clamp-2 mb-6 font-medium">
          {vehicle.description || "Intelligence profile data currently restricted."}
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;

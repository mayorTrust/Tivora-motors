
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, MapPin, Calendar, Gauge } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group glass-card rounded-[2rem] overflow-hidden hover:border-accent/30 transition-all duration-700 hover:-translate-y-3 flex flex-col h-full bg-background/50">
      <div className="relative aspect-[16/11] overflow-hidden bg-foreground/5">
        {!imageLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-accent text-background text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/50">
            {vehicle.category}
          </span>
          {vehicle.featured && (
            <span className="bg-foreground text-background text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/50">
              PRIME
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="bg-foreground text-background font-black py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-accent hover:text-background transition-all shadow-2xl uppercase tracking-widest text-[10px]"
          >
            <Eye className="w-4 h-4" />
            Inspect Details
          </Link>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6 gap-4">
          <h3 className="text-xl font-black text-foreground group-hover:text-accent transition-colors leading-tight italic uppercase tracking-tighter truncate">
            {vehicle.name}
          </h3>
          <span className="text-lg font-black text-accent whitespace-nowrap tracking-tighter">
            ${vehicle.price.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/5">
            <Calendar className="w-3 h-3 text-foreground/50 mb-1.5" />
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{vehicle.year}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/5">
            <Gauge className="w-3 h-3 text-foreground/50 mb-1.5" />
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest truncate w-full text-center">
              {Math.floor(vehicle.mileage / 1000)}k mi
            </span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/5">
            <MapPin className="w-3 h-3 text-foreground/50 mb-1.5" />
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest truncate w-full text-center">
              {vehicle.location.split(',')[0]}
            </span>
          </div>
        </div>

        <p className="text-foreground/60 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
          {vehicle.description}
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;

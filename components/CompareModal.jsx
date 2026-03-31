
import React from 'react';
import { X, GitCompareArrows, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareModal = ({ vehicles, isOpen, onClose }) => {
  if (!isOpen) return null;

  const specs = [
    { label: 'Manufacturer', key: 'brand' },
    { label: 'Year', key: 'year' },
    { label: 'Price', key: 'price', format: (val) => `$${val.toLocaleString()}` },
    { label: 'Mileage', key: 'mileage', format: (val) => `${val.toLocaleString()} mi` },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Condition', key: 'condition' },
    { label: 'Drivetrain', key: 'drivetrain' },
    { label: 'Exterior Color', key: 'color' },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-3xl" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl glass-card rounded-[3rem] overflow-hidden border-accent/20 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-8 border-b border-foreground/10 bg-background/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <GitCompareArrows className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                  Side-By-Side <span className="text-accent">Analysis</span>
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Technical Performance Comparison</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-foreground transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="min-w-[800px] p-8">
            <table className="w-full text-left border-separate border-spacing-x-4 border-spacing-y-0">
              <thead>
                <tr>
                  <th className="w-48 sticky left-0 bg-background/0 z-10 py-6"></th>
                  {vehicles.map((vehicle) => (
                    <th key={vehicle.id} className="min-w-[200px] py-6 align-top">
                      <div className="space-y-4">
                        <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10 group">
                          <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <h3 className="font-black italic uppercase tracking-tighter text-lg leading-tight text-foreground truncate">{vehicle.name}</h3>
                          <p className="text-accent font-black text-xl tracking-tighter mt-1">${vehicle.price.toLocaleString()}</p>
                        </div>
                        <Link 
                          to={`/vehicle/${vehicle.id}`}
                          onClick={onClose}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/5 text-foreground hover:bg-accent hover:text-background transition-all font-black text-[10px] uppercase tracking-widest border border-foreground/10 hover:border-accent"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, index) => (
                  <tr key={spec.key} className="group">
                    <td className="sticky left-0 bg-background/0 z-10 py-5 pr-8 border-b border-foreground/5">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-accent transition-colors">
                        {spec.label}
                      </span>
                    </td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle.id} className="py-5 border-b border-foreground/5">
                        <span className="text-sm font-bold text-foreground">
                          {spec.format ? spec.format(vehicle[spec.key]) : vehicle[spec.key]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 border-t border-foreground/10 bg-foreground/[0.02]">
           <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                 <Check className="w-4 h-4 text-accent" /> Expert Inspected
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                 <Check className="w-4 h-4 text-accent" /> Performance Validated
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                 <Check className="w-4 h-4 text-accent" /> Verified Documents
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;

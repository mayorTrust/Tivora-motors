
import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Category } from '../constants';
import VehicleCard from '../components/VehicleCard';
import { SkeletonCard } from '../components/Loading';

const Inventory = ({ vehicles }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params on mount or param change
  useEffect(() => {
    const query = searchParams.get('search');
    const cat = searchParams.get('category');
    
    if (query) setSearchTerm(query);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', ...Object.values(Category)];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           v.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      const matchesPrice = v.price <= priceRange;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [vehicles, searchTerm, selectedCategory, priceRange]);

  const updateCategory = (cat) => {
    setSelectedCategory(cat);
    // Update URL to reflect state change (optional, but good for shareability)
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
    
    if (showFilters) setShowFilters(false);
  };

  const updateSearch = (term) => {
    setSearchTerm(term);
    if (term) searchParams.set('search', term);
    else searchParams.delete('search');
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-1 bg-accent" />
          <span className="text-accent font-black uppercase tracking-[0.3em] text-xs">Exquisite Range</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase leading-none text-foreground">
          THE <span className="text-accent">VAULT</span>
        </h1>
        <p className="text-foreground/60 text-lg max-w-xl">Our current collection of high-performance vehicles, inspected and ready for their next journey.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className={`lg:w-72 space-y-8 ${showFilters ? 'fixed inset-0 z-[60] bg-background p-8 overflow-y-auto' : 'hidden lg:block'}`}>
          <div className="lg:glass-card lg:p-8 lg:rounded-[2.5rem] lg:sticky lg:top-28 border-foreground/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl uppercase italic italic tracking-tighter text-foreground">Refine <span className="text-accent">Search</span></h3>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="p-2 bg-foreground/5 rounded-full text-foreground"><X /></button>
              )}
            </div>
            
            <div className="mb-10">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 mb-6 block">Classification</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateCategory(cat)}
                    className={`w-full text-left px-5 py-3 rounded-xl text-sm transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-accent text-background font-black translate-x-1 shadow-lg shadow-accent/20'
                        : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <div className="w-1 h-1 bg-background rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 block">Max Budget</label>
                <span className="text-foreground font-black text-lg">${priceRange >= 1000000 ? '1M+' : priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-accent bg-foreground/5 rounded-full cursor-pointer h-1 appearance-none"
              />
              <div className="flex justify-between text-[10px] text-foreground/50 font-black mt-4 uppercase tracking-widest">
                <span>$0</span>
                <span>Unlimited</span>
              </div>
            </div>
            
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-12 bg-accent text-background font-black py-4 rounded-xl uppercase tracking-widest text-xs"
              >
                Apply Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/50 w-5 h-5 transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Search manufacturer or model..."
                value={searchTerm}
                onChange={(e) => updateSearch(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-accent/50 focus:bg-foreground/[0.08] transition-all text-sm font-medium text-foreground"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-3 bg-foreground/5 border border-foreground/10 rounded-2xl py-5 px-8 font-black uppercase tracking-widest text-xs text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter Results
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-foreground/[0.02] rounded-[3rem] border border-dashed border-foreground/10">
              <div className="mb-6 flex justify-center">
                <Search className="w-12 h-12 text-foreground/30" />
              </div>
              <p className="text-foreground/50 italic font-medium mb-6">No matches found in the current inventory.</p>
              <button
                onClick={() => {
                  updateSearch('');
                  updateCategory('All');
                  setPriceRange(1000000);
                }}
                className="px-8 py-3 bg-foreground/5 rounded-full text-foreground text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;

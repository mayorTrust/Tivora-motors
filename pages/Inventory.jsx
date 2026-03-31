
import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Category } from '../constants';
import VehicleCard from '../components/VehicleCard';
import { SkeletonCard } from '../components/Loading';
import CompareBar from '../components/CompareBar';
import CompareModal from '../components/CompareModal';
import { useWishlist } from '../hooks/useWishlist';

const FilterSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 mb-3 block">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full bg-foreground/5 border border-transparent rounded-lg py-3 px-4 focus:outline-none focus:border-accent/50 focus:bg-foreground/[0.08] transition-all text-sm font-medium text-foreground appearance-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-12 h-12 rounded-full transition-all text-sm font-black uppercase ${
            currentPage === number 
              ? 'bg-accent text-background shadow-lg shadow-accent/30' 
              : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground'
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

const Inventory = ({ vehicles }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // New filter states
  const [filters, setFilters] = useState({
    brand: 'All',
    year: 'All',
    transmission: 'All',
    condition: 'All',
  });

  const [sortBy, setSortBy] = useState('newest');

  // State for compare feature
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Memoize derived filter options
  const uniqueBrands = useMemo(() => ['All', ...new Set(vehicles.map(v => v.brand))], [vehicles]);
  const uniqueYears = useMemo(() => ['All', ...new Set(vehicles.map(v => v.year.toString()))].sort((a, b) => b - a), [vehicles]);
  const uniqueTransmissions = useMemo(() => ['All', ...new Set(vehicles.map(v => v.transmission))], [vehicles]);
  const conditions = ['All', 'New', 'Used'];

  const { wishlist: globalWishlist, toggleWishlist } = useWishlist();

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

  // CIPHER Event Listeners
  useEffect(() => {
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

  const categories = ['All', ...Object.values(Category)];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page on filter change
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

  const filteredVehicles = useMemo(() => {
    let items = vehicles.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           v.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      const matchesPrice = v.price <= priceRange;
      const matchesBrand = filters.brand === 'All' || v.brand === filters.brand;
      const matchesYear = filters.year === 'All' || v.year.toString() === filters.year;
      const matchesTransmission = filters.transmission === 'All' || v.transmission === filters.transmission;
      const matchesCondition = filters.condition === 'All' || v.condition === filters.condition;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesYear && matchesTransmission && matchesCondition;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'mileage_asc':
        items.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'newest':
      default:
        items.sort((a, b) => b.year - a.year);
        break;
    }

    return items;
  }, [vehicles, searchTerm, selectedCategory, priceRange, filters, sortBy]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredVehicles.length / itemsPerPage);
  }, [filteredVehicles]);

  const updateCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reset to first page
    // Update URL to reflect state change (optional, but good for shareability)
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
    
    if (showFilters) setShowFilters(false);
  };

  const updateSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page
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

            <div className="space-y-8">
              {/* Brand Filter */}
              <FilterSelect label="Brand" value={filters.brand} options={uniqueBrands} onChange={(e) => handleFilterChange('brand', e.target.value)} />

              {/* Year Filter */}
              <FilterSelect label="Year" value={filters.year} options={uniqueYears} onChange={(e) => handleFilterChange('year', e.target.value)} />

              {/* Transmission Filter */}
              <FilterSelect label="Transmission" value={filters.transmission} options={uniqueTransmissions} onChange={(e) => handleFilterChange('transmission', e.target.value)} />

              {/* Condition Filter */}
              <FilterSelect label="Condition" value={filters.condition} options={conditions} onChange={(e) => handleFilterChange('condition', e.target.value)} />
              
              {/* Price Range Slider */}
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
          <div className="flex flex-col sm:flex-row gap-4 mb-12 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/50 w-5 h-5 transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Search manufacturer or model..."
                value={searchTerm}
                onChange={(e) => updateSearch(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-accent/50 focus:bg-foreground/[0.08] transition-all text-sm font-medium text-foreground"
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-foreground/5 border border-foreground/10 rounded-2xl py-5 px-8 font-black uppercase tracking-widest text-xs text-foreground"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-full text-center sm:text-left bg-foreground/5 border border-foreground/5 rounded-2xl py-5 pl-6 pr-12 focus:outline-none focus:border-accent/50 focus:bg-foreground/[0.08] transition-all text-sm font-medium text-foreground appearance-none"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price_asc">Price: Low-High</option>
                  <option value="price_desc">Price: High-Low</option>
                  <option value="mileage_asc">Mileage: Low-High</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(itemsPerPage)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginatedVehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle}
                    onCompare={handleCompare}
                    isCompared={compareList.includes(vehicle.id)}
                  />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
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
                  setFilters({
                    brand: 'All',
                    year: 'All',
                    transmission: 'All',
                    condition: 'All',
                  });
                  setSortBy('newest');
                }}
                className="px-8 py-3 bg-foreground/5 rounded-full text-foreground text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

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

export default Inventory;

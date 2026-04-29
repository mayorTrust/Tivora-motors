import React from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Heart, GitCompareArrows, ArrowRight, Trash2 } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';

const UserDashboard = ({ vehicles = [] }) => {
  const { user, logout } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const savedVehicles = vehicles.filter(v => wishlist.includes(v.id));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
         <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6">
            <Shield className="w-10 h-10" />
         </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Access <span className="text-accent">Denied</span></h2>
        <p className="text-foreground/50 mb-8 font-medium">Authentication required to access the secure vault.</p>
        <Link to="/login" className="bg-accent text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
           Return to Login
        </Link>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'Operator';

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-accent" />
            <span className="text-accent font-black uppercase tracking-[0.3em] text-xs">Command Center</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase leading-none text-foreground">
            {displayName.split(' ')[0]}<span className="text-accent">'S</span> VAULT
          </h1>
          <p className="text-foreground/60 text-lg max-w-xl">Manage your personalized collection and account settings.</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all w-full md:w-auto justify-center"
        >
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-accent/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <User className="w-32 h-32" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">Operator Profile</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/50">
                   <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Identifier</p>
                  <p className="font-bold text-foreground">{displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/50">
                   <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Uplink Address</p>
                  <p className="font-bold text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-accent/10">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">System Stats</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
                   <p className="text-2xl font-black text-foreground">{savedVehicles.length}</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Saved Assets</p>
                </div>
                <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
                   <p className="text-2xl font-black text-foreground">Active</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Status</p>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-3">
                  <Heart className="w-6 h-6 text-accent fill-accent" /> Saved <span className="text-accent">Assets</span>
               </h3>
               <div className="flex items-center gap-6">
                 {savedVehicles.length > 0 && (
                   <button 
                     onClick={() => { if(confirm("Purge all saved assets?")) clearWishlist(); }}
                     className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2"
                   >
                     <Trash2 className="w-3 h-3" /> Clear Matrix
                   </button>
                 )}
                 {savedVehicles.length > 0 && (
                   <Link to="/inventory" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors flex items-center gap-2">
                      Browse More <ArrowRight className="w-3 h-3" />
                   </Link>
                 )}
               </div>
            </div>

            {savedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedVehicles.map(vehicle => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onCompare={() => {}} // Could integrate comparison here too
                    isCompared={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-foreground/[0.02] rounded-[3rem] border border-dashed border-foreground/10">
                <Heart className="w-12 h-12 text-foreground/10 mx-auto mb-6" />
                <p className="text-foreground/50 italic font-medium mb-6">Your collection is currently empty.</p>
                <Link
                  to="/inventory"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-foreground/5 rounded-full text-foreground text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
                >
                  Explore Inventory
                </Link>
              </div>
            )}
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-3">
                  <GitCompareArrows className="w-6 h-6 text-accent" /> Comparison <span className="text-accent">History</span>
               </h3>
             </div>
             <div className="glass-card p-12 rounded-[3rem] border-dashed border-foreground/10 text-center">
                <p className="text-foreground/40 text-xs font-medium uppercase tracking-[0.2em]">Data logs pending. Start comparing in the inventory.</p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

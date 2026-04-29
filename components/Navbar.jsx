import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, Sun, Moon, LogIn, UserPlus, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCart } from '../hooks/useCart.jsx';

const Navbar = ({ Logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Showroom', path: '/inventory' },
    { name: 'Our Legacy', path: '/about' },
    { name: 'Intel', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.email === 'admin@tivoramotors.com';

  return (
    <nav className={`fixed w-full z-[1000] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass-card rounded-[2rem] px-6 py-4 flex items-center justify-between transition-all duration-500 border-white/5 ${isScrolled ? 'bg-background/80 backdrop-blur-2xl' : 'bg-transparent'}`}>
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="text-xl font-black italic tracking-tighter leading-none group-hover:text-accent transition-colors uppercase text-white">TIVORA</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">Motors Matrix</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${isActive(link.path) ? 'text-accent' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'group-hover:w-full'}`} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 bg-white/5 rounded-2xl hover:bg-accent hover:text-black transition-all group">
               <ShoppingCart size={18} className="text-gray-400 group-hover:text-black" />
               {totalItems > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                    {totalItems}
                 </span>
               )}
            </Link>

            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className={`p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all ${isActive('/admin') ? 'text-accent' : 'text-gray-400'}`} title="Mission Control">
                      <LayoutDashboard size={18} />
                    </Link>
                  )}
                  <Link to="/dashboard" className={`p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all ${isActive('/dashboard') ? 'text-accent' : 'text-gray-400'}`} title="Vault Access">
                    <Settings size={18} />
                  </Link>
                  <button onClick={logout} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all" title="Terminate Session">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                   <Link to="/login" className="bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Sign In</Link>
                   <Link to="/signup" className="bg-accent text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20">Authorize</Link>
                </div>
              )}
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full p-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="glass-card rounded-[2.5rem] p-8 border-white/10 shadow-2xl bg-background/95 backdrop-blur-3xl">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-black italic uppercase tracking-tighter transition-all ${isActive(link.path) ? 'text-accent' : 'text-white/40'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              {user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="bg-white/5 text-white p-6 rounded-3xl flex flex-col items-center gap-3">
                     <Settings size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Vault</span>
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="bg-red-500/10 text-red-500 p-6 rounded-3xl flex flex-col items-center gap-3">
                     <LogOut size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="bg-white/5 text-white py-5 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-xs">Access Portal</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-accent text-black py-5 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-xs">New Identity</Link>
                </div>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
               <p className="text-[8px] font-black text-foreground/50 uppercase tracking-[0.4em] mb-4">Connection Line</p>
               <p className="text-2xl font-black text-foreground">+1 (555) TIVORA-8</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

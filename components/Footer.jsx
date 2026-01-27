
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-foreground/5 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Logo & Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                 <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-full h-full text-foreground group-hover:text-accent transition-colors duration-500 relative z-10"
                >
                  <path d="M6 3h12l4 6-10 13L2 9z" />
                  <path d="M10 22L8 9l5.5-6" />
                  <path d="M14 22l2-13-5.5-6" />
                </svg>
              </div>
              <div className="text-2xl font-black tracking-widest text-foreground uppercase font-display ml-1">
                TRUST<span className="text-accent">_MOTORS</span>
              </div>
            </Link>
            <p className="text-foreground/50 leading-relaxed font-medium">
              Curating the world's most exceptional automotive art. Trust Motors - Drive your legacy.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 flex items-center justify-center bg-foreground/5 rounded-2xl hover:bg-accent transition-all duration-500 hover:-translate-y-2 border border-foreground/5 group">
                  <Icon className="w-5 h-5 text-foreground/60 group-hover:text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-10">THE ARCHIVE</h4>
            <ul className="space-y-4">
              {['Home', 'Inventory', 'About Us', 'Contact', 'Admin'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Admin' ? '/admin' : `/${link.toLowerCase().replace(' ', '')}`} className="text-foreground/60 hover:text-foreground transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 group">
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-10">SHOWROOM</h4>
            <ul className="space-y-4">
              {['Exotic Cars', 'Superbikes', 'Limited Cycles', 'Performance Scooters'].map((link) => (
                <li key={link}>
                  <Link to="/inventory" className="text-foreground/60 hover:text-foreground transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 group">
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="glass-card p-8 rounded-[2rem] border-foreground/10">
            <h4 className="text-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-8">CONNECTION</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-foreground/60 font-black text-[11px] tracking-widest group-hover:text-foreground transition-colors">+1 (555) TRUST-88</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-foreground/60 font-black text-[11px] tracking-widest group-hover:text-foreground transition-colors">sales@trustmotors.com</span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-foreground/60 font-black text-[11px] tracking-widest group-hover:text-foreground transition-colors leading-tight">123 Speed Way, <br/>Miami, FL 33101</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} TRUST MOTORS &bull; ALL SYSTEMS OPERATIONAL
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-foreground/40 hover:text-foreground text-[9px] font-black uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-foreground/40 hover:text-foreground text-[9px] font-black uppercase tracking-widest transition-colors">Terms</a>
            <a href="#" className="text-foreground/40 hover:text-foreground text-[9px] font-black uppercase tracking-widest transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

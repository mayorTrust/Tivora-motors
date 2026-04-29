import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Col */}
          <div className="space-y-8">
            <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
               <Logo className="w-16 h-16" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
              The ultimate high-performance vehicle matrix. Curating the world's most exceptional automotive and mobility assets since 2008.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-accent transition-all duration-500 hover:-translate-y-2 border border-white/5 group">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 px-1">Navigation Matrix</h4>
            <ul className="space-y-4">
              {[
                { name: 'Showroom Vault', path: '/inventory' },
                { name: 'Our Legacy', path: '/about' },
                { name: 'Operational Intel', path: '/contact' },
                { name: 'Mission Control', path: '/admin' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-accent transition-all flex items-center gap-3 group text-xs font-bold uppercase tracking-widest">
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 px-1">Specialized Protocols</h4>
            <ul className="space-y-4">
              {[
                'Asset Bespoke Search',
                'Global Logistics',
                'Valuation Analysis',
                'Elite Membership'
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-accent transition-all flex items-center gap-3 group text-xs font-bold uppercase tracking-widest">
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 px-1">Uplink Terminals</h4>
            <div className="space-y-6">
              <div className="flex gap-5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all border border-white/5">
                   <Phone className="w-4 h-4" />
                </div>
                <div className="self-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Direct Line</p>
                   <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">+1 (555) TIVORA-8</p>
                </div>
              </div>
              <div className="flex gap-5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all border border-white/5">
                   <Mail className="w-4 h-4" />
                </div>
                <div className="self-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Data Link</p>
                   <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">ops@tivoramotors.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
            © 2026 TIVORA MOTORS / NEURAL NETWORK IMPLEMENTATION
          </p>
          <div className="flex items-center gap-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
             <a href="#" className="hover:text-white transition-colors">Privacy Protocal</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             <div className="flex items-center gap-2 text-accent">
                <ShieldCheck size={14} />
                <span>Encrypted Matrix</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

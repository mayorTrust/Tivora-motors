
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('trust_motors_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('trust_motors_theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('trust_motors_theme');
    
    if (savedTheme === 'light') {
      setIsDark(false);
      document.body.classList.add('light-mode');
    } else {
      setIsDark(true);
      document.body.classList.remove('light-mode');
    }

    const handleVoiceToggle = () => toggleTheme();
    window.addEventListener('tivora-theme-toggle', handleVoiceToggle);

    return () => {
        window.removeEventListener('tivora-theme-toggle', handleVoiceToggle);
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-[100] bg-background/80 backdrop-blur-xl border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
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
              
              <div className="text-xl font-black tracking-widest text-foreground uppercase font-display ml-1">
                TRUST<span className="text-accent">_MOTORS</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-foreground/60 hover:text-foreground'
                  } px-1 py-2 rounded-md text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'group-hover:w-full'}`} />
                </Link>
              ))}
              <div className="h-6 w-px bg-foreground/10" />
              
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground/60 hover:text-accent transition-colors rounded-full hover:bg-foreground/5"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link
                to="/admin"
                className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                title="Admin Dashboard"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/60 hover:text-accent transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-foreground/60 hover:text-foreground bg-foreground/5 focus:outline-none transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-foreground/5 animate-in slide-in-from-top duration-500 h-screen overflow-hidden flex flex-col justify-center px-8">
          <div className="space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-foreground/60'
                } block text-5xl font-black uppercase italic tracking-tighter transition-all`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-foreground/5 my-8" />
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-xl text-foreground/60 font-black uppercase tracking-widest hover:text-foreground"
            >
              System Dashboard
            </Link>
          </div>
          
          <div className="mt-20">
             <p className="text-[10px] font-black text-foreground/50 uppercase tracking-[0.4em] mb-4">Connection Line</p>
             <p className="text-2xl font-black text-foreground">+1 (555) TRUST-88</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

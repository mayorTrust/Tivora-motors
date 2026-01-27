
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetails from './pages/VehicleDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import VoiceControl from './components/VoiceControl';
import ThemeGenerator from './components/ThemeGenerator';
import QuantumAnalyst from './components/QuantumAnalyst';
import DreamMachine from './components/DreamMachine';
import MotionStudio from './components/MotionStudio';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import { INITIAL_VEHICLES } from './constants';

gsap.registerPlugin(ScrollTrigger);

// Wrapper for page transitions
const PageTransition = ({ children }) => {
  const elementRef = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    if (elementRef.current) {
        // Simple but effective fade/slide up transition
        gsap.fromTo(elementRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
        // Reset scroll position
        window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <div ref={elementRef}>{children}</div>;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('tivora_rides_inventory');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch (e) {
      console.error("Failed to parse inventory from localStorage", e);
      return INITIAL_VEHICLES;
    }
  });

  useEffect(() => {
    localStorage.setItem('tivora_rides_inventory', JSON.stringify(vehicles));
  }, [vehicles]);

  const handleAddVehicle = (newVehicle) => setVehicles([...vehicles, newVehicle]);
  const handleUpdateVehicle = (updatedVehicle) => setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  const handleDeleteVehicle = (id) => {
    if (confirm('Delete this listing?')) setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <>
      <div className="grain-overlay" />
      <Cursor />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <div className="min-h-screen flex flex-col bg-grid">
          <Navbar />
          <main className="flex-grow">
            <PageTransition>
                <Routes>
                <Route path="/" element={<Home featuredVehicles={vehicles.filter(v => v.featured)} />} />
                <Route path="/inventory" element={<Inventory vehicles={vehicles} />} />
                <Route path="/vehicle/:id" element={<VehicleDetails vehicles={vehicles} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin vehicles={vehicles} onAdd={handleAddVehicle} onUpdate={handleUpdateVehicle} onDelete={handleDeleteVehicle} />} />
                </Routes>
            </PageTransition>
          </main>
          
          {/* AI Features Suite */}
          <VoiceControl />
          <ThemeGenerator />
          <DreamMachine />
          <MotionStudio />
          <QuantumAnalyst />
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;

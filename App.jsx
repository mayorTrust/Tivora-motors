import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './lib/firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetails from './pages/VehicleDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import UserDashboard from './pages/UserDashboard'; 
import VoiceControl from './components/VoiceControl';
import AudioPermissionModal from './components/AudioPermissionModal';
import ChatBot from './components/ChatBot';
import ActivityTicker from './components/ActivityTicker';
import Logo from './components/Logo.jsx';
import Cursor from './components/Cursor';
import { LoadingScreen } from './components/Loading.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { CartProvider } from './hooks/useCart.jsx';
import Cart from './pages/Cart';

gsap.registerPlugin(ScrollTrigger);

// Wrapper for page transitions
const PageTransition = ({ children }) => {
  const elementRef = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    if (elementRef.current) {
        gsap.fromTo(elementRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
        window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <div ref={elementRef}>{children}</div>;
};

// Protected Admin Route
const AdminRoute = ({ vehicles, onAdd, onUpdate, onDelete }) => {
  const { user, loading } = useAuth();
  const navigate = useLocation();

  if (loading) return null;
  if (!user || user.email !== 'admin@tivoramotors.com') {
    return (
      <div className="pt-40 text-center min-h-screen bg-background flex flex-col items-center">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-6">Access <span className="text-accent">Restricted</span></h2>
        <p className="text-gray-500 font-medium mb-8">Unauthorized personnel detected. System lockdown engaged.</p>
        <Link to="/" className="bg-accent text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Return to Sector 0</Link>
      </div>
    );
  }

  return <Admin vehicles={vehicles} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to Firestore
    const unsubscribe = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const vehicleData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setVehicles(vehicleData);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleAddVehicle = async (newVehicle) => {
    try {
      await addDoc(collection(db, 'vehicles'), newVehicle);
    } catch (e) {
      console.error("Error adding vehicle: ", e);
    }
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const vehicleRef = doc(db, 'vehicles', updatedVehicle.id);
      const { id, ...data } = updatedVehicle;
      await updateDoc(vehicleRef, data);
    } catch (e) {
      console.error("Error updating vehicle: ", e);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (confirm('Delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
      } catch (e) {
        console.error("Error deleting vehicle: ", e);
      }
    }
  };

  const handleLoadingComplete = React.useCallback(() => {
    setLoading(false);
    setTimeout(() => {
      setShowPermissionModal(true);
    }, 500);
  }, []);

  const toggleTheme = React.useCallback(() => {
    document.body.classList.toggle('light-mode');
  }, []);

  const handleCmdNavigate = React.useCallback((section) => {
    switch(section) {
      case 'home': navigate('/'); break;
      case 'work': navigate('/inventory'); break;
      case 'about': navigate('/about'); break;
      case 'contact': navigate('/contact'); break;
      case 'resume': navigate('/dashboard'); break;
      case 'archive': navigate('/inventory'); break;
      default: navigate('/');
    }
  }, [navigate]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleOpenChat = React.useCallback(() => setIsChatOpen(true), []);
  const handleOpenCmd = React.useCallback(() => setIsCmdOpen(true), []);

  return (
    <>
      <div className="grain-overlay" />
      <Cursor />
      
      {loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <div className="opacity-100 transition-opacity duration-1000">
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col bg-grid">
                <Navbar Logo={Logo} />
                <main className="flex-grow">
                  <PageTransition>
                      <Routes>
                        <Route path="/" element={<Home featuredVehicles={vehicles.filter(v => v.featured)} />} />
                        <Route path="/inventory" element={<Inventory vehicles={vehicles} />} />
                        <Route path="/vehicle/:id" element={<VehicleDetails vehicles={vehicles} />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<AdminRoute vehicles={vehicles} onAdd={handleAddVehicle} onUpdate={handleUpdateVehicle} onDelete={handleDeleteVehicle} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<UserDashboard vehicles={vehicles} />} />
                        <Route path="/cart" element={<Cart />} />
                      </Routes>
                  </PageTransition>
                  </main>          
                  <VoiceControl 
                    onNavigate={handleCmdNavigate} 
                    onToggleTheme={toggleTheme}
                    onOpenChat={handleOpenChat}
                    onOpenCmd={handleOpenCmd}
                    isPermissionGranted={isPermissionGranted}
                  />
                  <AudioPermissionModal 
                    isOpen={showPermissionModal} 
                    onClose={() => {
                      setShowPermissionModal(false);
                      setIsPermissionGranted(true);
                    }} 
                  />
                  <ChatBot vehicles={vehicles} isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
                  <ActivityTicker />

                {!isAuthPage && <Footer />}
              </div>
            </CartProvider>
          </AuthProvider>
        </div>
      )}
    </>
  );
};

export default App;

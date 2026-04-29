import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Trash2, Plus, Minus, CreditCard, ShieldCheck, ArrowRight, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Authentication required for acquisition.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate real payment delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save order and 'card details' (simulation) to Firebase
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.quantity })),
        amount: subtotal,
        timestamp: new Date(),
        paymentMethod: 'card_simulation',
        // In a real app we'd never save raw card data, but user asked to simulate saving it
        simulatedCard: {
          lastFour: cardData.number.slice(-4),
          holder: cardData.name
        }
      });

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Acquisition Error:", error);
      alert("Transmission failed. Please check your data link.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 px-4 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-accent/30 animate-in zoom-in duration-500">
           <CheckCircle2 size={48} className="text-black" />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">Acquisition <span className="text-accent">Confirmed</span></h1>
        <p className="text-gray-500 max-w-md font-medium leading-relaxed mb-10 uppercase tracking-widest text-xs">The assets have been authorized for your fleet. An operational report has been sent to your uplink.</p>
        <div className="flex gap-4">
          <Link to="/dashboard" className="bg-accent text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-accent/20">
            Access Vault
          </Link>
          <Link to="/inventory" className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
            Return to Showroom
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 px-4 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 opacity-20">
           <ShoppingBag size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter text-white/30 uppercase mb-8">Acquisition Matrix Empty</h2>
        <Link to="/inventory" className="bg-accent text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-accent/20">
          Scan Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-1 bg-accent" />
          <span className="text-accent font-black uppercase tracking-[0.3em] text-xs">Acquisition Protocol</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase leading-none text-white">
          YOUR <span className="text-accent">BASKET</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-[2rem] border-white/5 bg-white/[0.02] flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                <img src={item.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.brand}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center bg-black/40 rounded-xl border border-white/5 p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-400 hover:text-white transition-colors"><Minus size={14} /></button>
                    <span className="w-10 text-center text-xs font-black text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-400 hover:text-white transition-colors"><Plus size={14} /></button>
                  </div>
                  <p className="text-xl font-black text-accent tracking-tighter">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Side */}
        <div className="lg:col-span-5">
          <div className="glass-card p-10 rounded-[3rem] border border-accent/20 bg-white/[0.01] sticky top-32 shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 border-b border-white/5 pb-6">Checkout <span className="text-accent">Summary</span></h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                <span>Network Fees</span>
                <span className="text-green-500">WAIVED</span>
              </div>
              <div className="h-px bg-white/5 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Total Valuation</span>
                <span className="text-3xl font-black text-white tracking-tighter">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Card Holder Identity</label>
                 <input required type="text" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})} placeholder="FULL NAME ON CARD" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all uppercase placeholder:text-white/5" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Encryption Key (Card Number)</label>
                 <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input required type="text" maxLength="19" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">Expiry</label>
                    <input required type="text" placeholder="MM/YY" maxLength="5" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">CVC Code</label>
                    <input required type="password" maxLength="4" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} placeholder="•••" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-accent transition-all" />
                 </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-accent text-black font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs shadow-xl shadow-accent/20 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Authorize Acquisition <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white">
                  <ShieldCheck size={12} /> SECURE UPLINK
               </div>
               <div className="w-1 h-1 rounded-full bg-white" />
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white">
                  SSL 256-BIT
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

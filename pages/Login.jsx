import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import gsap from 'gsap';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, Chrome, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { opacity: 0, scale: 0.95, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials.');
        gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.1, repeat: 5, yoyo: true });
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden px-4 bg-background">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-radial-gradient opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-radial-gradient opacity-10 blur-3xl pointer-events-none" />

      <div 
        ref={formRef}
        className="glass-card p-10 rounded-[3rem] w-full max-w-md relative z-10 border border-white/5 shadow-2xl bg-white/[0.02]"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-[#00f2ff]" />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">Access Portal</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Secure Gateway Implementation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 px-1" htmlFor="email">Identity</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00f2ff] transition-colors" />
              <input
                type="email"
                id="email"
                placeholder="operative@tivora.com"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00f2ff]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/5 font-medium text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 px-1" htmlFor="password">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00f2ff] transition-colors" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00f2ff]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/5 font-medium text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest py-4 px-5 rounded-2xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00f2ff] hover:bg-white text-black font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(0,242,255,0.2)] uppercase tracking-widest text-xs"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initialize Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]">
            <span className="bg-[#050505] px-4 text-gray-600">Verification Hub</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 mb-10 uppercase tracking-widest text-[10px]"
        >
          <Chrome className="w-5 h-5 text-[#00f2ff]" />
          Biometric Uplink
        </button>

        <p className="text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
          New Operative?{' '}
          <Link to="/signup" className="text-[#00f2ff] hover:text-white transition-colors">Authorize ID</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

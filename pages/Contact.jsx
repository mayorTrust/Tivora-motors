
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! Our team will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-[#00f3ff] font-bold uppercase tracking-widest text-sm mb-4 block">Contact Us</span>
          <h1 className="text-5xl md:text-7xl font-black italic">GET IN <span className="text-[#00f3ff]">TOUCH</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Side */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#00f3ff]/10 rounded-2xl text-[#00f3ff]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Phone</h4>
                  <p className="text-xl font-bold">+1 (555) TIVORA-88</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#00f3ff]/10 rounded-2xl text-[#00f3ff]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Email</h4>
                  <p className="text-xl font-bold">sales@tivorarides.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#00f3ff]/10 rounded-2xl text-[#00f3ff]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Office</h4>
                  <p className="text-xl font-bold">123 Speed Way, Miami, FL 33101</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#25D366] text-white font-bold py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20">
              <MessageCircle className="w-6 h-6" /> Quick Chat on WhatsApp
            </button>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-[2rem] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#00f3ff] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#00f3ff] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#00f3ff] transition-colors"
                    placeholder="+1 (000) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#00f3ff] transition-colors appearance-none"
                  >
                    <option className="bg-[#111]">General Inquiry</option>
                    <option className="bg-[#111]">Vehicle Appraisal</option>
                    <option className="bg-[#111]">Financing Options</option>
                    <option className="bg-[#111]">Service Appointment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Your Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#00f3ff] transition-colors resize-none"
                  placeholder="Tell us about the vehicle you're interested in..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00f3ff] hover:bg-white hover:text-black text-black font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest"
              >
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 h-[400px]">
          {/* Mock Map iframe - In a real app use Google Maps SDK */}
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925925016!2d-80.29949821868453!3d25.782390733066467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a392760fd7%3A0xedc9330017c4da79!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1714578121644!5m2!1sen!2sus"
            className="w-full h-full border-none"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;

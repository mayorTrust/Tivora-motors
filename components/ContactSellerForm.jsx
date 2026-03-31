import React, { useState } from 'react';
import { X } from 'lucide-react';

const ContactSellerForm = ({ isOpen, onClose, vehicleName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact Seller Form Submitted:', { name, email, message, vehicleName });
    setSubmitted(true);
    // In a real application, you'd send this data to a backend
  };

  const handleClose = () => {
    onClose();
    // Reset form after closing
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 300); // Give time for close animation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full relative border border-foreground/10 animate-in zoom-in-90 duration-300">
        <button onClick={handleClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        {submitted ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-accent mb-4">Thank You!</h3>
            <p className="text-foreground/70 mb-6">Your message about the <span className="font-semibold">{vehicleName}</span> has been sent to the seller.</p>
            <button onClick={handleClose} className="bg-accent hover:brightness-110 text-background font-bold py-2 px-6 rounded-md">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-accent">Contact Seller</h2>
            <p className="text-foreground/70 mb-6">Inquire about the <span className="font-semibold">{vehicleName}</span>.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-1">Your Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-1">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`I'm interested in the ${vehicleName} and would like to know more...`}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:brightness-110 text-background font-bold py-3 rounded-md transition-all"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactSellerForm;

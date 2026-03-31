
import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('tivora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tivora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (vehicleId) => {
    setWishlist(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const isInWishlist = (vehicleId) => wishlist.includes(vehicleId);

  const clearWishlist = () => setWishlist([]);

  return { wishlist, toggleWishlist, isInWishlist, clearWishlist };
};

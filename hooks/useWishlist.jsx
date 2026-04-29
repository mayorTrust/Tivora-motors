import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Load from Firestore if logged in, otherwise localStorage
  useEffect(() => {
    if (!user) {
      try {
        const saved = localStorage.getItem('tivora_wishlist');
        setWishlist(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setWishlist([]);
      }
      return;
    }

    // Real-time sync with Firestore for logged in user
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setWishlist(docSnap.data().wishlist || []);
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWishlist = async (vehicleId) => {
    const newWishlist = wishlist.includes(vehicleId) 
      ? wishlist.filter(id => id !== vehicleId)
      : [...wishlist, vehicleId];

    setWishlist(newWishlist);

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { wishlist: newWishlist }, { merge: true });
    } else {
      localStorage.setItem('tivora_wishlist', JSON.stringify(newWishlist));
    }
  };

  const isInWishlist = (vehicleId) => wishlist.includes(vehicleId);

  const clearWishlist = async () => {
    setWishlist([]);
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { wishlist: [] }, { merge: true });
    } else {
      localStorage.setItem('tivora_wishlist', JSON.stringify([]));
    }
  };

  return { wishlist, toggleWishlist, isInWishlist, clearWishlist };
};

import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { INITIAL_VEHICLES } from '../constants';

export const seedDatabase = async () => {
  const vehiclesCol = collection(db, 'vehicles');
  const snapshot = await getDocs(vehiclesCol);
  
  if (snapshot.empty) {
    console.log("Seeding database with initial vehicles...");
    for (const vehicle of INITIAL_VEHICLES) {
      await addDoc(vehiclesCol, vehicle);
    }
    console.log("Seeding complete.");
  }
};

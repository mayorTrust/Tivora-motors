import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXR-6wyPIbWK7A_iGQt6t2Juy2PJ8b3s4",
  authDomain: "tivora-motors.firebaseapp.com",
  projectId: "tivora-motors",
  storageBucket: "tivora-motors.firebasestorage.app",
  messagingSenderId: "138810932746",
  appId: "1:138810932746:web:e3dbbca340e55bb6a9e9f3",
  measurementId: "G-BXJQ7SH1YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

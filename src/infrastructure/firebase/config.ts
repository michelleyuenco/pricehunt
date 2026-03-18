import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAq5XST6Ur_ZNJ9VwAE6et1OkUTOCoGFgg",
  authDomain: "gaak-gaa.firebaseapp.com",
  projectId: "gaak-gaa",
  storageBucket: "gaak-gaa.firebasestorage.app",
  messagingSenderId: "879291051334",
  appId: "1:879291051334:web:48ecc802399ddc52c24947",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

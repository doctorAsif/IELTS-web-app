import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
// Please replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyC4uEAGZQdH7kB6xn1l14yjZqmbk-phMjQ",
  authDomain: "ielts-traning-app.firebaseapp.com",
  projectId: "ielts-traning-app",
  storageBucket: "ielts-traning-app.firebasestorage.app",
  messagingSenderId: "222311015336",
  appId: "1:222311015336:web:5b3de75300e81620c9f39d",
  measurementId: "G-WHK51SXGMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

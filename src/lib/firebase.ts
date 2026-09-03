import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
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

// Initialize Cloud Firestore with offline persistence enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const storage = getStorage(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

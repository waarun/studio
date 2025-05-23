
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for placeholder or missing critical values
if (
  !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY" ||
  !firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID" ||
  !firebaseConfig.authDomain || firebaseConfig.authDomain === "YOUR_AUTH_DOMAIN"
) {
  const errorMessage = "CRITICAL FIREBASE CONFIG ERROR: Firebase apiKey, projectId, or authDomain is missing or still a placeholder (e.g., 'YOUR_API_KEY'). Please update your .env file with actual credentials from your Firebase project console. Server actions relying on Firebase will fail until this is corrected.";
  console.error(errorMessage);
  // This error will occur when this module is imported by a server action,
  // leading to a server-side failure if config is incorrect.
  throw new Error(errorMessage);
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

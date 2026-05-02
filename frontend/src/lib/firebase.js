import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDWTlzilMjrsZimMRsEdXOzmOcs78Zxi1U",
  authDomain: "abcd-4f3cd.firebaseapp.com",
  projectId: "abcd-4f3cd",
  storageBucket: "abcd-4f3cd.firebasestorage.app",
  messagingSenderId: "975243851817",
  appId: "1:975243851817:web:4201606ed50a5f0db80438",
  measurementId: "G-VCG76F4RMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only runs on client side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes ? analytics = getAnalytics(app) : null);
}

export { app, analytics };

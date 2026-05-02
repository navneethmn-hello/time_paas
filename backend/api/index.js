require('dotenv').config();

const { initializeApp } = require('firebase/app');
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWTlzilMjrsZimMRsEdXOzmOcs78Zxi1U",
  authDomain: "abcd-4f3cd.firebaseapp.com",
  projectId: "abcd-4f3cd",
  storageBucket: "abcd-4f3cd.firebasestorage.app",
  messagingSenderId: "975243851817",
  appId: "1:975243851817:web:4201606ed50a5f0db80438",
  measurementId: "G-VCG76F4RMB"
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API bootstrap error:', error);
    return res.status(500).json({ message: 'Server failed to start.' });
  }
};

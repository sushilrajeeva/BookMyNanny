import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes/index";
import "./index.css";
import "./App.css"
import { BrowserRouter } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDc97uKvteL8V3KLFgH6PkKM-7m8LhxN34",
//   authDomain: "bookmynanny-e879b.firebaseapp.com",
//   projectId: "bookmynanny-e879b",
//   storageBucket: "bookmynanny-e879b.appspot.com",
//   messagingSenderId: "1077833080815",
//   appId: "1:1077833080815:web:49bc0157f975763d86201a",
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);

export default db;

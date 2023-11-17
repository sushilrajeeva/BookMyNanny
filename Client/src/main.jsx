import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
//import fbconfig from './firebase/FirebaseConfig';
//import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// const app = initializeApp(fbconfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc97uKvteL8V3KLFgH6PkKM-7m8LhxN34",
  authDomain: "bookmynanny-e879b.firebaseapp.com",
  projectId: "bookmynanny-e879b",
  storageBucket: "bookmynanny-e879b.appspot.com",
  messagingSenderId: "1077833080815",
  appId: "1:1077833080815:web:49bc0157f975763d86201a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add a new document in collection "cities"
await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA",
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default db;

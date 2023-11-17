import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
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
  apiKey: "AIzaSyBKSPP32EYNW-pHl1ttsk2Dm3H7tadqFaI",
  authDomain: "bookmynanny-30fb2.firebaseapp.com",
  projectId: "bookmynanny-30fb2",
  storageBucket: "bookmynanny-30fb2.appspot.com",
  messagingSenderId: "1015093807568",
  appId: "1:1015093807568:web:055109065af5d33acbd1d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Add a new document in collection "cities"
await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA"
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default db;

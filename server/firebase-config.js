// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

export default db;

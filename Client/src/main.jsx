import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import {BrowserRouter} from 'react-router-dom';

import fbconfig from './firebase/FirebaseConfig';
import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
const app = initializeApp(fbconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
export const db = getFirestore(app);
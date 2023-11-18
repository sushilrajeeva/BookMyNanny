import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../main.jsx";
import { v4 as uid } from "uuid";

const createParentListing = async (data) => {
  console.log("data", data);
  try {
    const listingDocRef = doc(db, "Listings", uid());
    await setDoc(listingDocRef, data);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user document");
  }
};

export { createParentListing };

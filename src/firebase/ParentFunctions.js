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

const getAllListings = async () => {
  try {
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    listingsSnapshot.forEach((doc) => {
      const listData = doc.data();
      allListings.push(listData);
    });

    return allListings;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Error getting all users");
  }
};

export { createParentListing, getAllListings };

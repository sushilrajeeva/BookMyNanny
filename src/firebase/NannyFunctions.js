// All necessary firebase imports
import db from "../main.jsx";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

const getAllListings = async () => {
  try {
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      allListings.push(listingData);
    });

    return allListings;
  } catch (error) {
    console.log(error);
    console.error("Error getting all Listings for this nanny!!:", error);
    throw new Error("Error getting all users");
  }
};

const nannyInterested = async (listingId, nannyId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listingSnapshot = await getDoc(listingDocRef);

    if (!listingSnapshot.exists()) {
      console.error("Listing not found");
      return false;
    }

    const listingData = listingSnapshot.data();

    if (listingData.interestedNannies.includes(nannyId)) {
      console.log("Nanny already in the interested list");
      return false;
    }

    await updateDoc(listingDocRef, {
      interestedNannies: arrayUnion(nannyId),
    });

    return true;
  } catch (error) {
    console.error("Error updating listing with nanny interest:", error);
    return false;
  }
};

export { getAllListings, nannyInterested };

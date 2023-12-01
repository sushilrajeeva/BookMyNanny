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

    // modifying to get only those listings that are active (where parent hasn't selected a nanny yet)
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (listingData.selectedNannyID == "") {
        allListings.push(listingData);
      }
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

const withdrawNannyInterest = async (listingId, nannyId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listingSnapshot = await getDoc(listingDocRef);

    if (!listingSnapshot.exists()) {
      console.error("Listing not found");
      return false;
    }

    const listingData = listingSnapshot.data();

    // Checking if the nanny is already in the interestedNannies array
    // if it exist then i will return false
    if (!listingData.interestedNannies.includes(nannyId)) {
      console.log("Nanny not in the interested list");
      return false;
    }

    // Removing nannyId from the interestedNannies array
    const updatedNannies = listingData.interestedNannies.filter(
      (id) => id !== nannyId
    );

    // Update the document with the new array
    await updateDoc(listingDocRef, {
      interestedNannies: updatedNannies,
    });

    return true;
  } catch (error) {
    console.error("Error updating listing with nanny interest:", error);
    return false;
  }
};

// Methods for Active Jobs

// This method will give all the listings in the listings collection firestore whose selectedNannyID matches the current loggedin Nanny's nannyID
const getActiveJobs = async (nannyID) => {
  try {
    console.log("Get active jobs firestore method called");
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const activeJobs = [];

    // modifying to get only those listings where the the listing's selectedNannyID matches the given nannyID and the status is pending
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        listingData.selectedNannyID == nannyID &&
        listingData.status == "pending"
      ) {
        activeJobs.push(listingData);
      }
    });
    console.log("Active jobs : ", activeJobs);
    return activeJobs;
  } catch (error) {
    console.log(error);
    console.error("Error getting all Listings for this nanny!!:", error);
    throw new Error("Error getting all users");
  }
};

export {
  getAllListings,
  nannyInterested,
  withdrawNannyInterest,
  getActiveJobs,
};

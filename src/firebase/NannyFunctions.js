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
  runTransaction,
} from "firebase/firestore";

const getAllListings = async () => {
  try {
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    // modifying to get only those listings that are active (where parent hasn't selected a nanny yet)
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        // condition to only push listing if the listing has no selectedNannyID and the status of the listing is pending
        listingData.selectedNannyID == "" &&
        listingData.status == "pending"
      ) {
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

async function getNannyById(id) {
  try {
    const nannyDocRef = doc(db, "Nanny", id);
    const docSnapshot = await getDoc(nannyDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // console.log("GETTING DATA FROM PARENT", data);
      return data;
    } else {
      throw new Error("No nanny exists");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error getting user document");
  }
}

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
    console.error(
      "Error getting all Active Job Listings for this nanny!!:",
      error
    );
    throw new Error("Error getting all users");
  }
};

const updateNannyData = async (id, imageURL) => {
  const nannyDocRef = doc(db, "Nanny", id);

  try {
    await runTransaction(db, async (transaction) => {
      const nannyDoc = await transaction.get(nannyDocRef);
      console.log("NannyDoc", nannyDoc);
      if (!nannyDoc.exists()) {
        throw new Error("Document does not exist!");
      }
      console.log(id, imageURL);
      transaction.update(nannyDocRef, { image: imageURL });
      return imageURL;
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error updating parent data");
  }
};

const getPastJobs = async (nannyID) => {
  try {
    console.log("Get Past jobs firestore method called");
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const pastJobs = [];

    // modifying to get only those listings where the the listing's selectedNannyID matches the given nannyID and the status is completed
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        listingData.selectedNannyID == nannyID &&
        listingData.status == "completed"
      ) {
        pastJobs.push(listingData);
      }
    });
    console.log("Past jobs : ", pastJobs);
    return pastJobs;
  } catch (error) {
    console.log(error);
    console.error(
      "Error getting all Past Job Listings for this nanny!!:",
      error
    );
    throw new Error("Error getting all users");
  }
};

export {
  getAllListings,
  nannyInterested,
  withdrawNannyInterest,
  getActiveJobs,
  getPastJobs,
  getNannyById,
  updateNannyData,
};

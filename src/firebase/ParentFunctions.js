import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../main.jsx";
import { v4 as uid } from "uuid";

const createParentListing = async (data) => {
  console.log("data", data);
  let uuid = uid();
  try {
    data._id = uuid;
    const listingDocRef = doc(db, "Listings", uuid);
    await setDoc(listingDocRef, data);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user document");
  }
};

async function getParentById(id) {
  try {
    const parentDocRef = doc(db, "Parent", id);
    const docSnapshot = await getDoc(parentDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // console.log("GETTING DATA FROM PARENT", data);
      return data;
    } else {
      throw new Error("No parent exists");
    }
  } catch (error) {
    throw new Error("Error getting user document");
  }
}

const updateParentData = async (id, obj) => {
  const parentDocRef = doc(db, "Parent", id);

  try {
    await runTransaction(db, async (transaction) => {
      const parentDoc = await transaction.get(parentDocRef);
      console.log("ParentDoc", parentDoc);
      if (!parentDoc.exists()) {
        throw new Error("Document does not exist!");
      }
      transaction.update(parentDocRef, obj);
      return obj.image;
    });
  } catch (e) {
    throw new Error("Error updating parent data");
  }
};

const getAllListings = async (parentID) => {
  try {
    const listingsCollection = collection(db, "Listings");
    const q = query(listingsCollection, where("parentID", "==", parentID));
    const listingsSnapshot = await getDocs(q);

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

// Methods for Active Listings of the given parent

// This method will give all the listings in the listings collection firestore whose parentID matches the current loggedin Nanny's nannyID
const getActiveListings = async (parentID) => {
  try {
    console.log("Get active jobs firestore method called");
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const activeListings = [];

    // modifying to get only those listings where the the listing's parentID matches the given parentID and the status is pending
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (listingData.parentID == parentID && listingData.status == "pending") {
        activeListings.push(listingData);
      }
    });
    console.log("Active Listings : ", activeListings);
    return activeListings;
  } catch (error) {
    console.log(error);
    console.error(
      "Error getting all Active Listings Listings for this Parent!!:",
      error
    );
    throw new Error("Error getting all users");
  }
};

const getWalletBalance = async (parentID) => {
  try {
    const parent = await getParentById(parentID);
    return parent.wallet;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Error getting all users");
  }
};

const updateListing = async (listingId, updatedData) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    console.log(updatedData);
    await updateDoc(listingDocRef, updatedData);
  } catch (error) {
    console.error("Error updating parent listing:", error);
    throw new Error("Error updating parent listing");
  }
};

const addSelectedNanny = async (listingId, nannyID) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);

    // Get the current data of the listing
    const listingDoc = await getDoc(listingDocRef);
    if (!listingDoc.exists()) {
      throw new Error("Listing document does not exist!");
    }

    const currentData = listingDoc.data();

    // Check if the nannyID is not already the selectedNannyID
    if (currentData.selectedNannyID !== nannyID) {
      // Update the listing document with the new selectedNannyID
      await updateDoc(listingDocRef, { selectedNannyID: nannyID });
    }
  } catch (error) {
    console.error("Error adding selected nanny:", error);
    throw new Error("Error adding selected nanny");
  }
};

const jobCompleteVerification = async (listingId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listing = await getDoc(listingDocRef);

    if (listing) {
      const { status, hoursWorked, hourlyRate } = listing.data();
      if (status === "completed") {
        const payableAmount = hoursWorked * hourlyRate;
        return payableAmount;
      } else {
        throw "Job is not completed.";
      }
    } else {
      throw "Listing does not exist.";
    }
  } catch (error) {
    console.error("Error verifying job:", error);
    return null;
  }
};

const jobClose = async (listingId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listing = await getDoc(listingDocRef);

    if (listing) {
      const { progressBar } = listing.data();
      if (progressBar === 0) {
        await updateDoc(listingDocRef, { progressBar: 100 });
      } else {
        throw "Job is already completed.";
      }
    } else {
      throw "Listing does not exist.";
    }
  } catch (error) {
    console.error("Error verifying job:", error);
    return null;
  }
};

const jobDecline = async (listingId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listing = await getDoc(listingDocRef);

    if (listing) {
      await updateDoc(listingDocRef, { status: "pending" });
    } else {
      throw "Listing does not exist.";
    }
  } catch (error) {
    console.error("Error verifying job:", error);
    return null;
  }
};

const getPastParentJobs = async (parentID) => {
  try {
    console.log("Get Past jobs firestore method called");
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const pastJobs = [];

    // modifying to get only those listings where the the listing's selectedNannyID matches the given nannyID and the status is completed
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        listingData.parentID == parentID &&
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
  createParentListing,
  getAllListings,
  getParentById,
  updateParentData,
  updateListing,
  addSelectedNanny,
  getWalletBalance,
  jobCompleteVerification,
  jobClose,
  jobDecline,
  getPastParentJobs,
  getActiveListings,
};

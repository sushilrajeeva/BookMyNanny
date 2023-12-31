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

const getAllcurrentListings = async () => {
  try {
    function formatFirestoreTimestamp(timestamp) {
      // Checking if timestamp is a Firestore Timestamp object
      // did this because some posted dates are just strings and some are firestore timestamp functions
      // so implemented the below logic to counter the error while rendering
      if (timestamp && typeof timestamp.toDate === "function") {
        const date = timestamp.toDate();
        return date.toLocaleDateString();
      } else if (timestamp) {
        return timestamp;
      }
      return "";
    }

    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    // modifying to get only those listings that are active (where parent hasn't selected a nanny yet)
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();

      const listingStartDate = new Date(
        formatFirestoreTimestamp(listingData.jobStartDate)
      );

      // Remove the time part from the date for comparison
      listingStartDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const listingAddress =
        listingData.street +
        " " +
        listingData.city +
        " " +
        listingData.state +
        " " +
        listingData.country;

      listingData.listingAddress = listingAddress;

      if (
        // condition to only push listing if the listing has no selectedNannyID and the status of the listing is pending
        !listingData.selectedNannyID &&
        listingData.status == "pending" &&
        listingStartDate >= today
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

    if (listingData.selectedNannyID === nannyId)
      await updateDoc(listingDocRef, {
        selectedNannyID: "",
      });

    // Checking if the nanny is already in the interestedNannies array
    // if it exist then i will return false
    if (!listingData.interestedNannies.includes(nannyId)) {
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
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const activeJobs = [];

    // modifying to get only those listings where the the listing's selectedNannyID matches the given nannyID and the status is pending
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        (listingData.selectedNannyID == nannyID &&
          listingData.status == "pending") ||
        (listingData.selectedNannyID == nannyID &&
          listingData.status === "completed" &&
          listingData.progressBar === 0)
      ) {
        activeJobs.push(listingData);
      }
    });
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

const updateNannyData = async (id, obj) => {
  const nannyDocRef = doc(db, "Nanny", id);

  try {
    await runTransaction(db, async (transaction) => {
      const nannyDoc = await transaction.get(nannyDocRef);
      if (!nannyDoc.exists()) {
        throw new Error("Document does not exist!");
      }

      transaction.update(nannyDocRef, obj);
      return obj.image;
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error updating nanny data");
  }
};

const getPastJobs = async (nannyID) => {
  try {
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const pastJobs = [];

    // modifying to get only those listings where the the listing's selectedNannyID matches the given nannyID and the status is completed
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
        listingData.selectedNannyID == nannyID &&
        listingData.status == "completed" &&
        listingData.progressBar === 100
      ) {
        pastJobs.push(listingData);
      }
    });
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

const onJobComplete = async (listingId, hoursWorked, nannyId) => {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listing = await getDoc(listingDocRef);

    if (listing) {
      const currentStatus = listing.data().status;
      if (currentStatus && currentStatus === "pending") {
        if (listing.data().selectedNannyID === nannyId) {
          // If the current status is "pending", update the status to "completed"
          await updateDoc(listingDocRef, { status: "completed", hoursWorked });
        } else {
          throw "You are not the approved nanny for this job";
        }
      } else {
        throw "Job is not in pending status.";
      }
    } else {
      throw `Listing: ${listingId} does not exist.`;
    }
  } catch (error) {
    console.error("Error updating listing:", error);
  }
};

const getVerifiedCount = async () => {
  try {
    const nannyCollection = collection(db, "Nanny");
    const listingsSnapshot = await getDocs(nannyCollection);
    const nannyList = listingsSnapshot.docs.map((doc) => doc.data());
    return nannyList.filter((nanny) => nanny.verified === true).length;
  } catch (error) {
    console.log(error);
    console.error("Error getting all Listings for this nanny!!:", error);
    throw new Error("Error getting all users");
  }
};

// Function to get the count of non-verified entries
const getNonVerifiedCount = async () => {
  try {
    const nannyCollection = collection(db, "Nanny");
    const listingsSnapshot = await getDocs(nannyCollection);
    const nannyList = listingsSnapshot.docs.map((doc) => doc.data());
    return nannyList.filter((nanny) => nanny.verified === false).length;
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
  getPastJobs,
  getNannyById,
  updateNannyData,
  onJobComplete,
  getVerifiedCount,
  getNonVerifiedCount,
  getAllcurrentListings,
};

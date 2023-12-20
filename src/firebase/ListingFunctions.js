import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../main.jsx";
import { v4 as uid } from "uuid";
import { getNannyById } from "./NannyFunctions.js";

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

const getListingById = async (id) => {
  try {
    const listingDocRef = doc(db, "Listings", id);
    const docSnapshot = await getDoc(listingDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // console.log("GETTING DATA FROM PARENT", data);
      return data;
    } else {
      throw new Error("No Listing exists");
    }
  } catch (error) {
    throw new Error("Error getting Listing document");
  }
};

const getAllListings = async () => {
  try {
    const listingsCollection = collection(db, "Listings");
    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    // modifying to get only those listings that are active (where parent hasn't selected a nanny yet)
    listingsSnapshot.forEach((doc) => {
      const listingData = doc.data();
      if (
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

const deleteListing = async (listingID) => {
  try {
    await deleteDoc(doc(db, "Listings", listingID));
  } catch (error) {
    console.error("Error deleting listing.", error);
    throw new Error("Error deleting listing.");
  }
};

const getInterestedNannies = async (listingID) => {
  try {
    const interestedNanny = [];
    const listData = await getListingById(listingID);
    const interestedNannies = listData.interestedNannies;
    for (const nannyID of interestedNannies) {
      const nannyData = await getNannyById(nannyID);
      interestedNanny.push(nannyData);
    }
    return interestedNanny;
  } catch (error) {
    console.error("Error getting interested nannies.", error);
    throw new Error("Error getting interested nannies");
  }
};

const approveNanny = async (listingID, nannyID) => {
  const listingDocRef = doc(db, "Listings", listingID);
  await updateDoc(listingDocRef, {
    selectedNannyID: nannyID,
  });
};

const unapproveNanny = async (listingID, nannyID) => {
  const listingDocRef = doc(db, "Listings", listingID);

  // Retrieve the current data to check if selectedNannyID matches the provided nannyID
  const listingSnapshot = await getDoc(listingDocRef);
  const currentSelectedNannyID = listingSnapshot.data().selectedNannyID;

  // Check if the current selectedNannyID matches the provided nannyID
  if (currentSelectedNannyID === nannyID) {
    // Use deleteField to remove the selectedNannyID field
    await updateDoc(listingDocRef, {
      selectedNannyID: "",
    });
  }
};

export {
  getAllListings,
  getListingById,
  getInterestedNannies,
  approveNanny,
  unapproveNanny,
  deleteListing,
};

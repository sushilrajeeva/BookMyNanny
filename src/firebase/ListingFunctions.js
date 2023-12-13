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

  const applyToListing = async () => {};
};

export { getAllListings, getListingById };

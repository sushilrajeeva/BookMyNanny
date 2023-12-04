import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
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

export { createParentListing, getAllListings, getParentById, updateParentData };

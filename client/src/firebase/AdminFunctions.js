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

const getVerifiedNannies = async () => {
  try {
    console.log("Get Verified Nannies firestore method called");
    const NanniesCollection = collection(db, "Nanny");
    const NanniesSnapshot = await getDocs(NanniesCollection);

    const verifed = [];

    NanniesSnapshot.forEach((doc) => {
      const VerifiedData = doc.data();
      if (VerifiedData.verified == true) {
        verifed.push(VerifiedData);
      }
    });
    console.log("Verified Nannies : ", verifed);
    return verifed;
  } catch (error) {
    console.log(error);
    console.error("Error getting verified nannies", error);
    throw new Error("Error getting nannies");
  }
};

const getPendingVerifications = async () => {
  try {
    console.log(
      "Get the list of nannies with pending verifications firestore method called"
    );
    const NanniesCollection = collection(db, "Nanny");
    const NanniesSnapshot = await getDocs(NanniesCollection);

    const ToBeVerifed = [];

    NanniesSnapshot.forEach((doc) => {
      const VerifiedData = doc.data();
      if (VerifiedData.verified == false) {
        ToBeVerifed.push(VerifiedData);
      }
    });
    console.log("Nannies to be verified : ", ToBeVerifed);
    return ToBeVerifed;
  } catch (error) {
    console.log(error);
    console.error("Error getting nannies to be verified", error);
    throw new Error("Error getting nannies");
  }
};

const VerifyNanny = async (nannyId) => {
  try {
    const NannyDocRef = doc(db, "Nanny", nannyId);
    const NannySnapshot = await getDoc(NannyDocRef);

    if (!NannySnapshot.exists()) {
      console.error("Nanny not found");
      return false;
    }

    const NannyData = NannySnapshot.data();

    if (NannyData.verified == true) {
      console.log("Nanny already verified");
      return false;
    }

    await updateDoc(NannyDocRef, {
      verified: true,
    });

    return true;
  } catch (error) {
    console.error("Error verifying nanny:", error);
    return false;
  }
};

// async function getAdminById(id) {
//   try {
//     const parentDocRef = doc(db, "Admin", id);
//     const docSnapshot = await getDoc(parentDocRef);

//     if (docSnapshot.exists()) {
//       const data = docSnapshot.data();
//       // console.log("GETTING DATA FROM PARENT", data);
//       return data;
//     } else {
//       throw new Error("No parent exists");
//     }
//   } catch (error) {
//     throw new Error("Error getting user document");
//   }
// };

export { getVerifiedNannies, getPendingVerifications, VerifyNanny };

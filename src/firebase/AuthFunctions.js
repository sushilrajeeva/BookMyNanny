import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import db from "../main.jsx";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, { displayName: displayName });
  const uid = auth.currentUser.uid;
  return uid;
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn() {
  let auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, socialProvider);
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}

async function createNannyDocument(uid, data) {
  console.log("from createUserDoc", uid);
  console.log("data", data);
  data._id = uid;
  try {
    const nannyDocRef = doc(db, "Nanny", uid);
    await setDoc(nannyDocRef, data);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user document");
  }
}

async function getNannyDocs() {
  try {
    const nannyCollectionRef = collection(db, "Nanny");
    const data = await getDocs(nannyCollectionRef);
    console.log("GETTING DATA FROM NANNY", data);
  } catch (error) {
    alert(error);
  }
}

const createUserDocument = async (uid, data) => {
  try {
    const userDocRef = doc(db, "Users", uid); // "users" is the collection name
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user document");
  }
};

const createParentDocument = async (uid, data) => {
  console.log("from createUserDoc", uid);
  console.log("data", data);
  data._id = uid;
  try {
    const userDocRef = doc(db, "Parent", uid);
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user document");
  }
};

const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, "Users");
    const usersSnapshot = await getDocs(usersCollection);

    const allUsers = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      allUsers.push(userData);
    });

    return allUsers;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Error getting all users");
  }
};

const getUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, "Users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.role;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user role:", error);
    throw new Error("Error getting user role");
  }
};

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
  createUserDocument,
  createNannyDocument,
  createParentDocument,
  getNannyDocs,
  getAllUsers,
  getUserRole,
};

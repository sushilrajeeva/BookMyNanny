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

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
  createUserDocument,
  createNannyDocument,
  getNannyDocs,
};

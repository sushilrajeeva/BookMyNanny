import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../main.jsx";
import { v4 as uid } from "uuid";
const sendMessage = async (data) => {
  console.log("message data", data);
  try {
    const messageRef = doc(db, "messages", uid());
    await setDoc(messageRef, data);
  } catch (error) {
    console.error("Error creating ,message document:", error);
  }
};
const getMessageById = async (id) => {
  const messageRef = doc(db, "messages", id);
  try {
    const message = await getDoc(messageRef);
    return message;
  } catch (error) {
    console.error("Error getting message document:", error);
  }
};

const deleteAllMessagesByJobId = async (jobId) => {
  try {
    const messageCollection = collection(db, "messages");
    const q = query(messageCollection, where("jobId", "==", jobId));
    const querySnapshot = await getDocs(q);

    console.log("Number of messages to delete:", querySnapshot.size);

    const deletePromises = Array.from(querySnapshot.docs).map(async (doc) => {
      console.log("Deleting message:", doc.id);
      await deleteDoc(doc.ref);
    });

    await Promise.all(deletePromises);

    console.log("Messages for job", jobId, "deleted successfully!");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};

export { sendMessage, getMessageById, deleteAllMessagesByJobId };

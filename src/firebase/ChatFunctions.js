import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
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
const deleteAllMessgaesByJobId = async (jobId) => {
  //once job is done or the listing expires this function is used to auto delete all messages in the chat
  const messageRef = doc(db, "messages");
  const queryMessageAndDelete = query(messageRef, where("jobId", "==", jobId));
  try {
    await deleteDoc(queryMessageAndDelete);
  } catch (error) {
    console.error("Error delete message document:", error);
  }
};
export { sendMessage, getMessageById, deleteAllMessgaesByJobId };

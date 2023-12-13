import React, { useState, useEffect ,useContext} from "react";
import  db  from "../main.jsx"
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc
} from "firebase/firestore";

const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const auth  = useContext(AuthContext);
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("jobId", "==", room),
      orderBy("createdAt")
    );
    const unsubcribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });
    return () => unsubcribe();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage === "") return;
    await addDoc(messagesRef, {
text: newMessage,
createdAt: serverTimestamp(),
user: auth.currentUser.displayName,
userID: auth.currentUser.uid,
jobId: room
});
setNewMessage("");
};
return (
<div className="chat-app">
<div className="header">
  <h1>Chatroom for JobID: {room}</h1>
</div>
<div className="messages">
  {messages.map((message) => (
    <div key={message.id} className="message">
      <span className="user">{message.user}:</span> {message.text}
    </div>
  ))}
</div>
<form onSubmit={handleSubmit} className="new-message-form">
  <input
    type="text"
    value={newMessage}
    onChange={(event) => setNewMessage(event.target.value)}
    className="new-message-input"
    placeholder="Type your message here..."
  />
  <button type="submit" className="send-button">
    Send
  </button>
</form>
</div>
);
};
export default Chat;
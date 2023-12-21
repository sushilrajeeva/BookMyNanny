import React, { useState, useEffect, useContext, useRef } from "react";
import db from "../main.jsx";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";


import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomLoading from "./EssentialComponents/CustomLoading.jsx";

// For developing this Chat UI I referred shadcn ui for the design ref -> https://ui.shadcn.com/themes
// shadcn ui didn't implement the code but they just provided a reference
// and the code and design i referred from tailwind css -> https://tailwindcomponents.com/component/chat

const Chat = ({ room, chatUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const messagesRef = collection(db, "messages");

  // For setting message loading
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);



  // This is my useEffect for fetching messages
  useEffect(() => {
    setIsMessagesLoading(true); // Start loading before fetching messages
  
    const queryMessages = query(
      messagesRef,
      where("jobId", "==", room),
      orderBy("createdAt")
    );
  
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
  
      setIsMessagesLoading(false); // Stop loading after messages are fetched
    });
  
    return () => unsubscribe();
  }, [room]);
  

  // Implementing Scroll to the bottom every time messages changes
  // Referred Tailwind css implementation of chat -> https://tailwindcomponents.com/component/chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: currentUser.displayName,
      userID: currentUser.uid,
      jobId: room
    });
    setNewMessage("");
  };

  if(!currentUser){
    return <CustomLoading/>
  }

  if (isMessagesLoading) {
    return <CustomLoading />;
  }
  

  console.log("chatteeeeeer", chatUser);
  return (
    <div className="flex flex-col w-full h-full "> {/* CSS is a mess !!! tried a lot of combinations to get it right ... */}
      

      <div className="flex items-center p-4">
        <Avatar>
          <AvatarImage src={chatUser.image} alt={`${chatUser.firstName} ${chatUser.lastName}`} />
          <AvatarFallback>{chatUser.firstName[0]}{chatUser.lastName[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <div className="font-bold">{chatUser.firstName} {chatUser.lastName}</div>
          <div className="text-sm text-gray-500">{chatUser.emailAddress}</div>
        </div>
      </div>
      
      <div className="flex flex-col h-full overflow-y-auto space-y-4 p-3 flex-grow "> 
        {/* Message display */}
        <div className="overflow-y-auto space-y-4 p-3 flex-grow">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userID === currentUser.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`break-words p-2 rounded-lg shadow max-w-[80%] ${
                  message.userID === currentUser.uid // for these color codes I used iMessage colors (got color code values from https://tailwindcss.com/docs/customizing-colors)
                    ? "bg-sky-500 text-white" // Messages from current user
                    : "bg-gray-200 text-gray-800" // Messages from other users
                }`}
              >
                <span>{message.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Message input */}
        <div className="p-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder="Type your message here..."
              className="flex-grow rounded-md border-gray-300 shadow-sm"
            />
            {/* I referred tailwind toolkit for the send icon */}
            {/* citation -> https://www.tailwindtoolbox.com/icons */}
              <Button  type="submit" className="bg-sky-500 text-white" >
                <span>Send</span>
                <svg className="ml-2 h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                  <path stroke="none" d="M0 0h24v24H0z"/>  
                  <line x1="10" y1="14" x2="21" y2="3" />  
                  <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
                </svg>
              </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

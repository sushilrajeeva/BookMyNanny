import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function DashBoard() {
  const { currentUser, userRole } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div>
      <h2>this is the Dashoard</h2>
    </div>
  );
}

export default DashBoard;

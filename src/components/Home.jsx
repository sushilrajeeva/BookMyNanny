import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import DashBoard from "./Dashboard";

function Home() {
  const { currentUser, userRole } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div>
      {/* <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected
        Home page The user role is :{userRole}
      </h2> */}
      <DashBoard />
    </div>
  );
}

export default Home;

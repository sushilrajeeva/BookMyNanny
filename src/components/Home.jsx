import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import ParentDashboard from "./Dashboard/ParentDashboard";
import NannyDashboard from "./Dashboard/NannyDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";

// import Dashboard from "./Dashboard";

function Home() {
  const { currentUser, userRole } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div>
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected
        Home page The user role is :{userRole}
      </h2>

      <div>
        {userRole === "nanny" ? (
          <NannyDashboard />
        ) : userRole === "parent" ? (
          <ParentDashboard />
        ) : userRole === "admin" ? (
          <AdminDashboard />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Home;

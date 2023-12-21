import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import ParentDashboard from "./Dashboard/ParentDashboard";
import NannyDashboard from "./Dashboard/NannyDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import CustomLoading from "./EssentialComponents/CustomLoading";

// import Dashboard from "./Dashboard";

function Dashboard() {
  const { currentUser, userRole } = useContext(AuthContext);
  return (
    <div className="mt-16">
      <div>
        {userRole === "nanny" ? (
          <NannyDashboard />
        ) : userRole === "parent" ? (
          <ParentDashboard />
        ) : userRole === "admin" ? (
          <AdminDashboard />
        ) : (
          <CustomLoading />
        )}
      </div>
    </div>
  );
}

export default Dashboard;

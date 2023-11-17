import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { errorAlert } from "store/alert";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ requiredRole }) => {
  const { currentUser, userRole } = useContext(AuthContext);
  requiredRole = requiredRole ? userRole : undefined;

  if (!currentUser) {
    // errorAlert("You must be logged in before accessing this route");
    return <Navigate to="/signin" replace={true} />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // errorAlert(
    //   `You must be logged in as a ${requiredRole} accessing this route`
    // );
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

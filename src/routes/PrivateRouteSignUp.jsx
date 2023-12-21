import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRouteSignUp = () => {
  const { currentUser } = useContext(AuthContext);
  //console.log('Private Route Comp current user', currentUser);
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return currentUser ? <Navigate to="/" replace={true} />: <Outlet />  ;
};

export default PrivateRouteSignUp;

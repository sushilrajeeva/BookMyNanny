import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

const NavigationNonAuth = () => {
    return (
       // <div className="fixed top-0 h-14 left-0 w-full bg-opacity-75 backdrop-filter backdrop-blur-lg z-50 border-b">
      <nav className="flex items-center space-x-4 lg:space-x-6 pt-4">
        <div className="flex space-x-4 lg:space-x-6">
        <NavLink
          to="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </NavLink>
        <NavLink
          to="/signup"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Sign-up
        </NavLink>
        <NavLink
          to="/signin"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Sign-In
        </NavLink>
        </div>
      </nav>
     // </div>
    );
  };

  export default NavigationNonAuth;
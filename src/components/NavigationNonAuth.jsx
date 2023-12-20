import React from "react";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const NavigationNonAuth = () => {
  return (
    <nav className="flex items-center justify-between bg-transparent">
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
      <div className="p-2">
        <ModeToggle /> {/* Padding to match the avatar in NavigationAuth */}
      </div>
    </nav>
  );
};

export default NavigationNonAuth;

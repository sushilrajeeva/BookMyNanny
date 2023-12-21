import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import SignOutButton from "./SignOut";
import { doSignOut } from "../firebase/AuthFunctions";
import "../App.css";
import { getNannyById } from "@/firebase/NannyFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getParentById } from "@/firebase/ParentFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ModeToggle } from "./mode-toggle";
const NavigationAuth = () => {
  const { currentUser, userRole } = useContext(AuthContext);
  const [userView, setUserView] = useState(null);
  // Wrote a custom function to get initials from displayName
  const getInitials = (name) => {
    if (name) {
      const parts = name.split(" ");
      const initials =
        parts.length > 1
          ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
          : parts[0].charAt(0);
      return initials.toUpperCase();
    }
  };
  useEffect(() => {
    async function fetchData() {
      let userDetails;
      if (userRole) {
        if (userRole.toLowerCase() === "nanny") {
          userDetails = await getNannyById(currentUser.uid);
        } else if (userRole.toLowerCase() === "parent") {
          userDetails = await getParentById(currentUser.uid);
        } else {
          userDetails = {
            _id: currentUser.uid,
            emailAddress: "booknanny7@gmail.com",
            image: "",
            firstName: "Admin",
            lastName: "",
          };
        }

        const userDoc = {
          _id: userDetails._id,
          emailAddress: userDetails.emailAddress,
          image: userDetails.image,
          displayName: userDetails.firstName + " " + userDetails.lastName,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
        };

        setUserView(userDoc);
      }
    }

    fetchData();
  }, [userRole, currentUser.uid]);

  return (
    // <div className="fixed top-0 h-14 left-0 w-full bg-opacity-75 backdrop-filter backdrop-blur-lg z-50 border-b">
    <nav className="flex items-center justify-between bg-transparent">
      <div className="flex space-x-4 lg:space-x-6">
        <NavLink
          to="/home"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Dashboard
        </NavLink>
      </div>

      <div className="ml-auto">
        <ModeToggle /> {/* Add ModeToggle here */}
      </div>
      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={userView?.image} alt={userView?.displayName} />
              <AvatarFallback>
                {getInitials(userView?.displayName)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto p-2" align="end">
            <div className="font-normal p-3">
              <p className="text font-medium">{userView?.displayName}</p>
              <p className="text-xs text-muted-foreground">
                {userView?.emailAddress}
              </p>
              <p className="text-xs text-muted-foreground">
                {" "}
                Role : {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </p>
            </div>

            <DropdownMenuSeparator />
            {(userRole === "parent" || userRole === "nanny") && (
              <DropdownMenuItem asChild>
                <NavLink className="px-4" to="/profile">
                  Profile
                </NavLink>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <NavLink className="px-4" to="/account">
                Change Password
              </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button
                onClick={doSignOut}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
    //   </div>
  );
};
export default NavigationAuth;

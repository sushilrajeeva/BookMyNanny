import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import SignOutButton from "./SignOut";
import {doSignOut} from '../firebase/AuthFunctions';
import "../App.css";
import { getNannyById } from "@/firebase/NannyFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getParentById } from "@/firebase/ParentFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NavigationAuth from "./NavigationAuth";
import NavigationNonAuth from "./NavigationNonAuth";
import { ModeToggle } from "./mode-toggle";

// For this navbar Development I referred the shadcn ui navbar design 
// citation : https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/dashboard/components/user-nav.tsx
// Also referred various tailwind css articles on making ui designs related to navbar


const Navigation = () => {
  const { currentUser , userRole} = useContext(AuthContext);
  return (
    <div>
        <FixedNavbar>
          <div className="px-4 lg:px-8 ">{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
        </FixedNavbar>
        
    </div>
  );
};

// This is to make the navbar fixed
const FixedNavbar = ({ children }) => {
  return (
    <div className="fixed top-0 h-14 left-0 w-full bg-opacity-75 backdrop-filter backdrop-blur-lg z-50 border-b">
      {children}
    </div>
    
  );
};

// Wrote a custom function to get initials from displayName
// const getInitials = (name) => {
//   const parts = name.split(' ');
//   const initials = parts.length > 1
//     ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
//     : parts[0].charAt(0);
//   return initials.toUpperCase();
// };


// const NavigationAuth = () => {
//   // const { userView, userRole } = useContext(AuthContext);

//   const [userView, setUserView] = useState(null);

// useEffect(() => {
//   async function fetchData() {
//     let userDetails;

//     if (role.toLowerCase() === 'nanny') {
//       userDetails = await getNannyById(user.uid);
//     } else if (role.toLowerCase() === 'parent') {
//       userDetails = await getParentById(user.uid);
//     } else {
//       userDetails = {
//         _id: user.uid,
//         emailAddress: "booknanny7@gmail.com",
//         image: "",
//         firstName: "Admin",
//         lastName: ""
//       };
//     }

//     const userDoc = {
//       _id: userDetails._id,
//       emailAddress: userDetails.emailAddress,
//       image: userDetails.image,
//       displayName: userDetails.firstName + " " + userDetails.lastName,
//       firstName: userDetails.firstName,
//       lastName: userDetails.lastName
//     };

//     setUserView(userDoc);
//   }

//   fetchData();
// }, [role, user.uid]);
    
    
  
//   return (
//     <nav className="flex items-center justify-between bg-transparent">
//       <div className="flex space-x-4 lg:space-x-6">
       
//         <NavLink
//           to="/home"
//           className="text-sm font-medium transition-colors hover:text-primary"
//         >
//           Home
//         </NavLink>
//         <NavLink
//           to="/dashboard"
//           className="text-sm font-medium transition-colors hover:text-primary"
//         >
//           Dashboard
//         </NavLink>
//       </div>

//       <div className="ml-auto">
//       <ModeToggle /> {/* Add ModeToggle here */}
//       </div>
//       <div className="p-2">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Avatar>
//               <AvatarImage src={userView?.image} alt={userView?.displayName} />
//               <AvatarFallback>{getInitials(userView?.displayName)}</AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-auto p-2" align="end">
//             <div className="font-normal p-3">
//               <p className="text font-medium">{userView?.displayName}</p>
//               <p className="text-xs text-muted-foreground">{userView?.emailAddress}</p>
//               <p className="text-xs text-muted-foreground"> Role : {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}</p>
//             </div>
            
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <NavLink className="px-4" to="/profile">Profile</NavLink>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <NavLink className="px-4" to="/account">Change Password</NavLink>
//             </DropdownMenuItem>
            
//             <DropdownMenuItem asChild>
//               <span onClick={doSignOut} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign Out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </nav>
//   );
// };


// const NavigationNonAuth = () => {
//   return (
//     <nav className="flex items-center space-x-4 lg:space-x-6 pt-4">
//       <div className="flex space-x-4 lg:space-x-6">
//       <NavLink
//         to="/"
//         className="text-sm font-medium transition-colors hover:text-primary"
//       >
//         Home
//       </NavLink>
//       <NavLink
//         to="/signup"
//         className="text-sm font-medium transition-colors hover:text-primary"
//       >
//         Sign-up
//       </NavLink>
//       <NavLink
//         to="/signin"
//         className="text-sm font-medium transition-colors hover:text-primary"
//       >
//         Sign-In
//       </NavLink>
//       </div>
//     </nav>
//   );
// };

export default Navigation;


import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "../firebase/AuthFunctions";
import CustomLoading from "@/components/EssentialComponents/CustomLoading";
import { getNannyById } from "@/firebase/NannyFunctions";
import { getParentById } from "@/firebase/ParentFunctions";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // const [userView, setUserView] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const myListener = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      console.log('onAuthStateChanged', user);
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role);
          console.log(user);
          // const userDetails = role.toLowerCase() === 'nanny' ? await getNannyById(user.uid) : (role.toLowerCase() === 'parent' ? await getParentById(user.uid) : {_id: user.uid, emailAddress: "booknanny7@gmail.com", image: "", firstName: "Admin", lastName: ""})
          // const userDoc = {
          //   _id: userDetails._id,
          //   emailAddress: userDetails.emailAddress,
          //   image: userDetails.image,
          //   displayName: userDetails.firstName + " " + userDetails.lastName,
          //   firstName: userDetails.firstName,
          //   lastName: userDetails.lastName
          // };
          // setUserView(userDoc);
        } catch (error) {
          console.error("Error getting user role or details:", error);
          
        }
      }
      setLoadingUser(false);
    });

    return () => {
      if (myListener) myListener();
    };
  }, [auth]);

  if (loadingUser) {
    return <CustomLoading />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
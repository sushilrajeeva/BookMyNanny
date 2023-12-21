import React from "react";
import "../App.css";
import { Route, Routes as AppRoutes } from "react-router-dom";
import Account from "../components/Account";
import Home from "../components/Dashboard";
import Landing from "../components/Landing";
import Navigation from "../components/Navigation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Profile from "../components/Profile";
import ListingFullDetails from '../components/ListingFullDetails'
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import PrivateRoute from "../routes/PrivateRoute";
import PaymentSuccess from "../components/EssentialComponents/PaymentSuccess"
import PaymentFailure from "../components/EssentialComponents/PaymentFailure"
import ShowProfile from "@/components/Profile/ShowProfile";
import ProfileFullView from "@/components/Profile/ProfileFullView";
import  Error404Page  from "@/components/EssentialComponents/Error404Page";
import SignOutButton from "@/components/SignOut";
import Dashboard from "../components/Dashboard"
import { ThemeProvider } from "@/components/theme-provider";
import PrivateRouteSignUp from "./PrivateRouteSignUp";
function Routes() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <AlertProvider>
          <div className="App">
            <header >
              <Navigation />
            </header>
            <AppRoutes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<PrivateRoute />}>
                <Route path="/home" element={<Landing />} />
              </Route>
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/account" element={<PrivateRoute />}>
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/listing/:id" element={<PrivateRoute />}>
                <Route path="/listing/:id" element={<ListingFullDetails />} />
              </Route>
              <Route path="/profile-details/:id" element={<ProfileFullView/>}/>
              <Route path="/signin"  element={<PrivateRouteSignUp />}>
                <Route path="/signin" element={<SignIn />} />
              </Route>
              <Route path="/signup"  element={<PrivateRouteSignUp />}>
                <Route path="/signup" element={<SignUp />} />
              </Route>
              <Route path="/signout" element={<SignOutButton />} />
              <Route path="/*" element={<Error404Page />}></Route>
            </AppRoutes>
          </div>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Routes;

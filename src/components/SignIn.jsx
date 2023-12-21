import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/AuthFunctions";

// Importing Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomLoading from "./EssentialComponents/CustomLoading.jsx";
import { AlertContext } from "../context/AlertContext";

function SignIn() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await doSignInWithEmailAndPassword(email.value, password.value);

      setTimeout(() => {
        setLoading(false); // Set loading state back to false
        navigate("/home");
      }, 500);
    } catch (error) {
      showAlert("error", "Either the username or password is incorrect!");
      // alert("Either the username or password is incorrect!");
      setLoading(false);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    if (email) {
      setLoading(true);
      doPasswordReset(email)
        .then(() => {
          // alert("Password reset email was sent");
          showAlert("success", "Password reset email was sent");
        })
        .catch((error) => {
          // alert(error);
          showAlert("success", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // alert(
      //   "Please enter an email address below before you click the forgot password link"
      // );
      showAlert(
        "error",
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-[200px]">
      <CardHeader>
        <CardTitle>Log-In</CardTitle>
        <CardDescription>Enter your credentials to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5 text-left">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col space-y-1.5 text-left">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button type="submit" className="w-full">
              Log in
            </Button>
            <Button
              variant="secondary"
              onClick={passwordReset}
              className="w-full"
            >
              Forgot Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignIn;

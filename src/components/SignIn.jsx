import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/AuthFunctions';

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

function SignIn() {
  const { currentUser } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert('Please enter an email address below before you click the forgot password link');
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Log-In</CardTitle>
        <CardDescription>Enter your credentials to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5 text-left">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="Email" required autoFocus />
            </div>
            <div className="flex flex-col space-y-1.5 text-left">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Password" required autoComplete="off" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button type="submit" className="w-full">
              Log in
            </Button>
            <Button variant="secondary" onClick={passwordReset} className="w-full">
              Forgot Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignIn;

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { doSignOut } from "../../firebase/AuthFunctions";

function NotVerified() {
  const handleLogout = () => {
    // Call the doSignOut function here
    doSignOut();
  };

  return (
    <div className="flex items-center justify-center"> 
      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Verification Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            You are not verified. Please wait for admin approval.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>

  );
}

export default NotVerified;

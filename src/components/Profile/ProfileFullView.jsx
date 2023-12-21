import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserRole } from "@/firebase/AuthFunctions";
import { getNannyById } from "@/firebase/NannyFunctions";
import { getParentById } from "@/firebase/ParentFunctions";
import CustomLoading from "../EssentialComponents/CustomLoading";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"



function ProfileFullView() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let role = await getUserRole(id);

        // Determining whether the user is a nanny or parent based on the provided ID
        if (role === "nanny") {
          const nannyData = await getNannyById(id);
          setUserData(nannyData);
        } else if (role === "parent") {
          const parentData = await getParentById(id);
          setUserData(parentData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <CustomLoading />;

  if (!userData) return <div>User not found.</div>;

  return (
    <div className="mt-16 flex justify-center">
      <Card className="w-[550px] shadow-lg">
        <CardHeader>
          <img
            src={userData.image}
            alt="User"
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <CardContent>
          <CardTitle>{userData.role === "nanny" ? "Nanny" : "Parent"} Profile</CardTitle>
          <div className="space-y-2">
            <CardDescription>Email: {userData.emailAddress}</CardDescription>
            <CardDescription>Phone: {userData.phoneNumber}</CardDescription>
            {userData.role === "nanny" && (
              <>
                <CardDescription>Experience: {userData.experience} years</CardDescription>
                <CardDescription>Bio: {userData.bio}</CardDescription>
              </>
            )}
            {userData.role === "parent" && (
              <CardDescription>Child's Name: {userData.firstName}</CardDescription>
            )}
            <CardDescription>DOB: {userData.dob}</CardDescription>
          </div>
        </CardContent>
        {/* <div className="p-4">
          <Button className="w-full">Contact</Button>
        </div> */}
      </Card>
    </div>
  );
}

export default ProfileFullView;

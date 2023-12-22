import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserRole } from "@/firebase/AuthFunctions";
import { getNannyById } from "@/firebase/NannyFunctions";
import { getParentById } from "@/firebase/ParentFunctions";
import CustomLoading from "../EssentialComponents/CustomLoading";
import Error404Page from "../EssentialComponents/Error404Page";
import { Skeleton } from "@/components/ui/skeleton"


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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // This function will give me the first letter of firstName and lastName of the userData
  const getUserInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

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
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Reffered shadcn ui to create this skeleton
  // Created my custom design for loader that mimics the way my card will look like
  // I created the card structure with shadcn ui card and then added skeleton inside it 
  if (loading){
    return (
      <div className="mt-16 flex justify-center">
        <Card className="w-[550px] shadow-lg">
          <CardHeader>
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-48 mb-2" /> 
            <div className="space-y-2">
              <Skeleton className="h-4 w-64" /> 
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-64" /> 
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  if (error) return <Error404Page />;

  if (!userData) return <div>User not found.</div>;

  return (
    <div className="mt-16 flex justify-center">
      <Card className="w-[550px] shadow-lg">
        <CardHeader>
          {userData.image ? (
              <img
                src={userData.image}
                alt={`${userData.firstName} ${userData.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center bg-gray-200 rounded-full">
                <span className="text-4xl font-semibold">
                  {getUserInitials(userData.firstName, userData.lastName)}
                </span>
              </div>
            )}
        </CardHeader>
        <CardContent>
          <CardTitle>{userData.role === "nanny" ? "Nanny" : "Parent"} Profile</CardTitle>
          <div className="space-y-2">
            <CardDescription>Email: {userData.emailAddress}</CardDescription>
            <CardDescription>Phone: {userData.phoneNumber}</CardDescription>
            {userData.role === "nanny" && (
              <>
                <CardDescription>Nanny's Name: {userData.firstName}</CardDescription>
                <CardDescription>Experience: {userData.experience} years</CardDescription>
                <CardDescription>Bio: {userData.bio}</CardDescription>
              </>
            )}
            {userData.role === "parent" && (
              <CardDescription>Parent's Name: {userData.firstName}</CardDescription>
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

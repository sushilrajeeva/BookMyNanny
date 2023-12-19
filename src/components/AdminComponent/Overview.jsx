import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getVerifiedCount,
  getNonVerifiedCount,
} from "../../firebase/NannyFunctions";
import { getParentCount } from "@/firebase/ParentFunctions";

import { Link } from "react-router-dom";

import verifiedNannies from "./VerifiedNannies";
import PendingVerifications from "./PendingVerifications";

import CustomLoading from "../EssentialComponents/CustomLoading";

import { Skeleton } from "@/components/ui/skeleton"


// Creating a two way binding with changeTab
function Overview({ changeTab }) {
  const [verified, setVerified] = useState(null);
  const [unVerified, setUnVerified] = useState(null);
  const [parentTotal, setParentTotal] = useState(null);

  // Adding a loader

  const [isLoading, setIsLoading] = useState(true)


  const handleCardClick = (cardValue) => {
    changeTab(cardValue);
  };

  // Reference: https://ui.shadcn.com/docs/components/skeleton

  const SkeletonCard = () => (
    <div className="p-4 border shadow rounded-md">
      <Skeleton className="h-6 w-3/4 mb-4" /> 
      <Skeleton className="h-12 w-full" />
    </div>
  );

  useEffect(() => {
    const fetchVerifies = async () => {
      try {
        setIsLoading(true)
        const verifiedCount = await getVerifiedCount();
        const unVerifiedCount = await getNonVerifiedCount();
        const parentCount = await getParentCount();
        setVerified(verifiedCount);
        setUnVerified(unVerifiedCount);
        setParentTotal(parentCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }finally{
        setIsLoading(false)
      }
    };
    fetchVerifies();
  }, []);

  if(isLoading){
    return (
      <div>
        <div className="p-4">Overview</div>
        <div className="grid gap-4 md:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4">Overview</div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card onClick={() => handleCardClick("VerifiedNannies")}>
          <CardHeader>
            <CardTitle>Verified Nannies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{verified}</p>
          </CardContent>
        </Card>
        <Card onClick={() => handleCardClick("PendingVerifications")}>
          <CardHeader>
            <CardTitle>Unverified Nannies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{unVerified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Nannies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{verified + unVerified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Parents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{parentTotal}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Overview;

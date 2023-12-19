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

function Overview() {
  const [verified, setVerified] = useState(null);
  const [unVerified, setUnVerified] = useState(null);
  const [parentTotal, setParentTotal] = useState(null);

  useEffect(() => {
    const fetchVerifies = async () => {
      try {
        const verifiedCount = await getVerifiedCount();
        const unVerifiedCount = await getNonVerifiedCount();
        const parentCount = await getParentCount();
        setVerified(verifiedCount);
        setUnVerified(unVerifiedCount);
        setParentTotal(parentCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchVerifies();
  }, []);

  return (
    <div>
      <div>Overview</div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Unverified Nannies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{unVerified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verified Nannies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{verified}</p>
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

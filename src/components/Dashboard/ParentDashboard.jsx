import React, { useState } from "react";
import ActiveListings from "../ParentComponent/ActiveListings";
import PastListings from "../ParentComponent/PastListings";
import MyListing from "../ParentComponent/MyListing";
import CreateListingParent from "../ParentComponent/CreateListingParent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParentDashboard = ({ userRole }) => {
  const [tabValue, setTabValue] = useState("MyListing");

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Parent Dashboard</h2>
      </div>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="justify-left mb-4">
          <TabsTrigger value="CreateListingParent">Create Listing</TabsTrigger>
          <TabsTrigger value="MyListing">My Listing</TabsTrigger>
          <TabsTrigger value="ActiveListings">Active Listings</TabsTrigger>
          <TabsTrigger value="PastListings">Past Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="CreateListingParent">
          <CreateListingParent />
        </TabsContent>
        <TabsContent value="MyListing">
          <MyListing />
        </TabsContent>
        <TabsContent value="ActiveListings">
          <ActiveListings />
        </TabsContent>
        <TabsContent value="PastListings">
          <PastListings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;

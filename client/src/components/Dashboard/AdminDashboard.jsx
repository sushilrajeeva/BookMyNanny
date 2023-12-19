import React, { useState } from "react";
import VerifiedNannies from "../AdminComponent/VerifiedNannies";
import PendingVerifications from "../AdminComponent/PendingVerifications";
import Overview from "../AdminComponent/Overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = ({ userRole }) => {
  const [tabValue, setTabValue] = useState("Overview");

  // For dashboard design i referred -> https://ui.shadcn.com/examples/dashboard
  // and https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/dashboard/page.tsx

  // referece for two way binding: https://handsontable.com/blog/understanding-data-binding-in-react#:~:text=Two%2Dway%20data%20binding%20allows,is%20achieved%20using%20controlled%20components.

  // Creating a two way binding for setting the tabs value
  // Function to change the tab value
  const changeTab = (newTabValue) => {
    setTabValue(newTabValue);
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-bold  mb-6">Admin Dashboard</h2>
      <Tabs value={tabValue} onValueChange={setTabValue} >
        <TabsList className="justify-left mb-4">
          <TabsTrigger value="Overview" className="text-current">Overview</TabsTrigger>
          <TabsTrigger value="VerifiedNannies" className="text-current">Verified Nannies</TabsTrigger>
          <TabsTrigger value="PendingVerifications" className="text-current">Pending Verifications</TabsTrigger>
        </TabsList>
        <TabsContent value="Overview">
          <Overview changeTab={changeTab} />
        </TabsContent>
        <TabsContent value="VerifiedNannies">
          <VerifiedNannies />
        </TabsContent>
        <TabsContent value="PendingVerifications">
          <PendingVerifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

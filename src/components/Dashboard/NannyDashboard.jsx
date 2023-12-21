import React, { useEffect, useState, useContext } from "react";
import ActiveJobs from "../NannyComponent/ActiveJobs";
import PastJobs from "../NannyComponent/PastJobs";
import JobListings from "../NannyComponent/JobListings";
import CustomLoading from "../EssentialComponents/CustomLoading";

import { getNannyById } from "@/firebase/NannyFunctions";
import { AuthContext } from "../../context/AuthContext";
import NotVerified from "../NannyComponent/NotVerified";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";





// Converting this to shadcn ui
const NannyDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState("JobListings");
  const [nannyData, setNannyData] = useState(null);
  const [isLoading, setLoading] = useState(true)

  


  // this function is to change my tab value
  // will be using this function for two way binding using prop drilling
  // const changeTab = (tabName) => {
  //   console.log("tab name", tabName);
  //   setTabValue(tabName);
  // };



  

  useEffect(() => {
    const fetchNanny = async () => {
      try {
        setLoading(true)
        const nannyDetails = await getNannyById(currentUser.uid);
        setNannyData(nannyDetails);
      } catch (error) {
        console.error("Error fetching nanny:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchNanny();
  }, [currentUser]);

  if(isLoading){
    return (
      <div>
        <CustomLoading/>
      </div>
    )
  }

  if (nannyData.verified !== true) {
    return <div className="p-6"><NotVerified /></div>; // Not verified state
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">Nanny Dashboard</h2>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="justify-left mb-4">
          <TabsTrigger value="JobListings" className="text-current">Job Listings</TabsTrigger>
          <TabsTrigger value="ActiveJobs" className="text-current">Active Jobs</TabsTrigger>
          <TabsTrigger value="PastJobs" className="text-current">Past Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="JobListings">
          <JobListings />
        </TabsContent>
        <TabsContent value="ActiveJobs">
          <ActiveJobs />
        </TabsContent>
        <TabsContent value="PastJobs">
          <PastJobs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NannyDashboard;

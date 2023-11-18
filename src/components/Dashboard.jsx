import React, { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CreateListing from "./CreateListing";
import MyListing from "./MyListing";
import ActiveListings from "./ActiveListings";
import PastListings from "./PastListings";
import JobListings from "./JobListings";
import "../App.css";

const Dashboard = ({ userRole }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Container maxWidth="lg" className="dashboard">
      <Paper elevation={3} className="navigation">
        <Box>
          {userRole === "parent" && (
            <>
              <Button onClick={() => renderComponent("CreateListing")}>
                Create Listing
              </Button>
              <Button onClick={() => renderComponent("MyListing")}>
                My Listing
              </Button>
              <Button onClick={() => renderComponent("ActiveListings")}>
                Active Listings
              </Button>
              <Button onClick={() => renderComponent("PastListings")}>
                Past Listings
              </Button>
            </>
          )}
          {userRole === "nanny" && (
            <>
              <Button onClick={() => renderComponent("JobListings")}>
                Job Listings
              </Button>
              <Button onClick={() => renderComponent("ActiveJobs")}>
                Active Jobs
              </Button>
              <Button onClick={() => renderComponent("PastJobs")}>
                Past Jobs
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Paper elevation={3} className="component-container">
        {activeComponent === "CreateListing" && <CreateListing />}
        {activeComponent === "MyListing" && <MyListing />}
        {activeComponent === "ActiveListings" && <ActiveListings />}
        {activeComponent === "PastListings" && <PastListings />}
        {activeComponent === "JobListings" && <JobListings />}
        {activeComponent === "ActiveJobs" && <ActiveListings />}
        {activeComponent === "PastJobs" && <PastListings />}
      </Paper>
    </Container>
  );
};

export default Dashboard;

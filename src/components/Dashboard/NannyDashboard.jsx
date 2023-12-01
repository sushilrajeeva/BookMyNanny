import React, { useState } from "react";
import ActiveJobs from "../NannyComponent/ActiveJobs"
import PastJobs from "../NannyComponent/PastJobs";
import JobListings from "../NannyComponent/JobListings";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const NannyDashboard = ({ userRole }) => {
  const [activeComponent, setActiveComponent] = useState("JobListings");

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Container maxWidth="lg" className="dashboard">
      <Paper elevation={3} className="navigation">
        <Box>
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
        </Box>
      </Paper>

      <Paper elevation={3} className="component-container">
        {activeComponent === "ActiveJobs" && <ActiveJobs />}
        {activeComponent === "PastJobs" && <PastJobs />}
        {activeComponent === "JobListings" && <JobListings />}
      </Paper>
    </Container>
  );
};

export default NannyDashboard;

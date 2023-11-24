import React, { useState } from "react";
import ActiveListings from "../ActiveListings";
import PastListings from "../PastListings";
import JobListings from "../JobListings";
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
            <Button onClick={() => renderComponent("ActiveListings")}>
              Active Jobs
            </Button>
            <Button onClick={() => renderComponent("PastListings")}>
              Past Jobs
            </Button>
          </>
        </Box>
      </Paper>

      <Paper elevation={3} className="component-container">
        {activeComponent === "ActiveListings" && <ActiveListings />}
        {activeComponent === "PastListings" && <PastListings />}
        {activeComponent === "JobListings" && <JobListings />}
      </Paper>
    </Container>
  );
};

export default NannyDashboard;

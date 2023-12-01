import React, { useState } from "react";
import VerifiedNannies from "../AdminComponent/VerifiedNannies";
import PendingVerifications from "../AdminComponent/PendingVerifications";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const AdminDashboard = ({ userRole }) => {
  const [activeComponent, setActiveComponent] = useState("PendingVerifications");

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Container maxWidth="lg" className="dashboard">
      <Paper elevation={3} className="navigation">
        <Box>
          <>
            <Button onClick={() => renderComponent("VerifiedNannies")}>
              Verified Nannies
            </Button>
            <Button onClick={() => renderComponent("PendingVerifications")}>
              Pending Verifications
            </Button>
          </>
        </Box>
      </Paper>

      <Paper elevation={3} className="component-container">
        {activeComponent === "VerifiedNannies" && <VerifiedNannies />}
        {activeComponent === "PendingVerifications" && <PendingVerifications />}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;

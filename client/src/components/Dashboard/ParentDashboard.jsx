import React, { useState } from "react";
import ActiveListings from "../ParentComponent/ActiveListings";
import PastListings from "../ParentComponent/PastListings";
import MyListing from "../ParentComponent/MyListing";
import CreateListingParent from "../ParentComponent/CreateListingParent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Wallet from "../EssentialComponents/Wallet"

const ParentDashboard = ({ userRole }) => {
  const [activeComponent, setActiveComponent] = useState("MyListing");

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Container maxWidth="lg" className="dashboard">
      <Paper elevation={3} className="navigation">
        <Box>
          <>
            <Button onClick={() => renderComponent("CreateListingParent")}>
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
            {/* <Button onClick={() => renderComponent("Wallet")}>
              Wallet
            </Button> */}
          </>
        </Box>
      </Paper>

      <Paper elevation={3} className="component-container">
        {activeComponent === "CreateListingParent" && <CreateListingParent />}
        {activeComponent === "ActiveListings" && <ActiveListings />}
        {activeComponent === "PastListings" && <PastListings />}
        {activeComponent === "MyListing" && <MyListing />}
        {/* {activeComponent === "Wallet" && <Wallet />} */}
      </Paper>
    </Container>
  );
};

export default ParentDashboard;

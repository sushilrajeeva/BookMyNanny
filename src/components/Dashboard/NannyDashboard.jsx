import React, { useEffect, useState, useContext } from "react";
import ActiveJobs from "../NannyComponent/ActiveJobs";
import PastJobs from "../NannyComponent/PastJobs";
import JobListings from "../NannyComponent/JobListings";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { getNannyById } from "@/firebase/NannyFunctions";
import { AuthContext } from "../../context/AuthContext";
import NotVerified from "../NannyComponent/NotVerified";

const NannyDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeComponent, setActiveComponent] = useState("JobListings");
  const [nannyData, setNannyData] = useState(null);

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    const fetchNanny = async () => {
      try {
        const nannyDetails = await getNannyById(currentUser.uid);
        setNannyData(nannyDetails);
      } catch (error) {
        console.error("Error fetching nanny:", error);
      }
    };

    fetchNanny();
  }, [currentUser]);

  return (
    <Container maxWidth="lg" className="dashboard">
      {nannyData !== null ? ( // Check if nannyData is not null
        nannyData.verified === true ? (
          <>
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
          </>
        ) : (
          <Paper elevation={3} className="not-verified">
            <Box>
              <NotVerified />
            </Box>
          </Paper>
        )
      ) : (
        <div>Loading</div>
      )}
    </Container>
  );
};

export default NannyDashboard;

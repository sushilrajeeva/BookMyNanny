import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { Card, CardActions, CardContent, Button, Typography } from "@mui/material";
import Chat from "./Chat";
import InterestedNanny from "./ParentComponent/InterestedNanny"; // Import the InterestedNanny component
import { getListingById } from "@/firebase/ListingFunctions";
import { AuthContext } from "@/context/AuthContext";

function ListingFullDetails(props) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { currentUser, userRole } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="card">
      <Typography>User role is {userRole}</Typography>
      {listing && (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Listing title: {listing.listingName}
            </Typography>
            <Typography variant="body2" component="div">
              Listing Description: {listing.description}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
              Listing Job Start Date: {listing.jobStartDate}
            </Typography>
            <Typography variant="body2">
              Total Payable Hours: {listing.payableHours}
            </Typography>
            <Typography variant="body2">
              Hourly Wage: ${listing.hourlyRate}
            </Typography>
            <Typography variant="body2">
              Address: {`${listing.street}, ${listing.city}, ${listing.state}, ${listing.country} - ${listing.pincode}`}
            </Typography>
          </CardContent>
          <CardActions>
          {userRole === 'nanny' && (
            <Button size="small">Apply</Button>
          )}
          </CardActions>
        </Card>
      )}
      
      {listing && (currentUser.uid === listing.parentID) ? ( 
        <div className="card">
      <InterestedNanny id={id} listing={listing}/>
      </div>):<></>}
      
      <div className="card">
        {listing && (currentUser.uid === listing.selectedNannyID || currentUser.uid === listing.parentID) ? ( 
            <Chat room={id} />    
        ) : (
          <Typography>
            Chat is available only for the selected nanny and the owner of the listing
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ListingFullDetails;

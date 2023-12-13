import React,{useContext,useEffect,useState} from "react";
import { NavLink, useParams } from "react-router-dom";
import "../App.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chat from './Chat'

function ListingFullDetails(props) {
    const listingId = useParams(id);
    const listing = getListingById(listingId)
  return (
    <div className="card">
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Listing title: {listing.listingName}
        </Typography>
        <Typography variant="h5" component="div">
          Listing Description: {listing.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Listing Job Date: {listing.jobDate}
        </Typography>
        <Typography variant="body2">
          Total Payable Hours: {listing.totalPayableHours}
        </Typography>
        <Typography variant="body2">
          Hourly Wage: {listing.hourlyRate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Apply</Button>
      </CardActions>
    </Card>
    <div className="chat-card">
        <Chat room={listingId} />
    </div>
    </div>
  );
}
export default ListingFullDetails;
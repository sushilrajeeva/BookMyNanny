import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { Typography } from "@mui/material";
import Chat from "./Chat";
import InterestedNanny from "./ParentComponent/InterestedNanny"; // Import the InterestedNanny component
import { getListingById } from "@/firebase/ListingFunctions";
import { AuthContext } from "@/context/AuthContext";
import JobCompletion from "./JobCompletion";
import PaymentDetails from "./PaymentDetails";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getParentById } from "@/firebase/ParentFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function ListingFullDetails(props) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { currentUser, userRole } = useContext(AuthContext);
  const [parentDP, setParentDP] = useState('');

  // Writing logic for checking if show chat dialogue box is enabled or not
  // I referred shadcn ui dialogue component -> https://ui.shadcn.com/docs/components/dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // This funciton just toggles the chat on or not
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListingById(id);
        console.log("Data -> ", data.parentID);
        const parentDoc = await getParentById(data.parentID)
        console.log(parentDoc.image);
        setParentDP(parentDoc)

        // if(currentUser == "nanny"){
        //   const nannyDoc = await getNannyById();
          
        // }
        // const nannyDP = await getNannyById()
        setListing(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
        <div className="card-container">
        {listing && (
          <Card className="w-[550px] mx-auto shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={parentDP.image} />
                    <AvatarFallback>{parentDP.firstName} {parentDP.lastName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium leading-none">{parentDP.firstName}</p>
                  </div>
                </div>
              <CardTitle>Listing Details</CardTitle>
              <CardDescription>User role is {userRole}</CardDescription>
            </CardHeader>
            <CardContent className="left-aligned-content">
              <CardDescription><strong>Listing Title:</strong> {listing.listingName}</CardDescription>
              <CardDescription><strong>Listing Description:</strong> {listing.description}</CardDescription>
              <CardDescription><strong>Job Start Date:</strong> {listing.jobStartDate}</CardDescription>
              <CardDescription><strong>Payable Hours:</strong> {listing.payableHours}</CardDescription>
              <CardDescription><strong>Hourly Rate:</strong> ${listing.hourlyRate}</CardDescription>
              <CardDescription>
                <strong>Address:</strong> {`${listing.street}, ${listing.city}, ${listing.state}, ${listing.country} - ${listing.pincode}`}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              {userRole === 'nanny' && (
                <Button  variant="outline" className="flex-1 mr-2">Apply</Button>
              )}
              <Button  className="flex-1" onClick={toggleDialog}>Show Chat</Button>
            </CardFooter>
          </Card>
        )}
        
        {listing && (currentUser.uid === listing.parentID) && (listing.progressBar === 0) ? ( 
          <div className="card">
        <InterestedNanny id={id} listing={listing}/>
        </div>):<></>}
        
        {/* <div className="card">
          {listing && (currentUser.uid === listing.selectedNannyID || currentUser.uid === listing.parentID) ? ( 
              <Chat room={id} />    
          ) : (
            <Typography>
              Chat is available only for the selected nanny and the owner of the listing
            </Typography>
          )}
        </div> */}
        {listing && (currentUser.uid === listing.selectedNannyID)?<JobCompletion listing={listing}/>:<></>}
        {listing && (currentUser.uid === listing.parentID) && listing.status==='completed' ?<PaymentDetails listing={listing}/>:<></>}
        
      </div>
      <div >
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {listing && (currentUser.uid === listing.selectedNannyID || currentUser.uid === listing.parentID) ? ( 
            <Chat room={id} />
            ) : (
              <Typography>
                Chat is available only for the selected nanny and the owner of the listing
              </Typography>
            )}
        </DialogContent>
        </Dialog>
      </div>
    </div>
    
  );
}

export default ListingFullDetails;

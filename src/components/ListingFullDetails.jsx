import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css";
import { Typography } from "@mui/material";
import Chat from "./Chat";
import {
  withdrawNannyInterest,
  nannyInterested,
} from "../firebase/NannyFunctions";
import InterestedNanny from "./ParentComponent/InterestedNanny";
import { getListingById } from "@/firebase/ListingFunctions";
import { AuthContext } from "@/context/AuthContext";
import JobCompletion from "./JobCompletion";
import PaymentDetails from "./PaymentDetails";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getParentById } from "@/firebase/ParentFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNannyById } from "@/firebase/NannyFunctions";
import CustomLoading from "./EssentialComponents/CustomLoading";
import Error404Page from "./EssentialComponents/Error404Page";

import { useNavigate, useLocation } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { ChevronLeft } from "lucide-react";

function ListingFullDetails(props) {
  const { id } = useParams();
  const [updateCounter, setUpdateCounter] = useState(0);
  const [listing, setListing] = useState(null);
  const { currentUser, userRole } = useContext(AuthContext);
  const [parentDP, setParentDP] = useState("");
  const [isInterested, setIsInterested] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [chatUserDoc, setChatUserDoc] = useState(null);
  // to keep track of data loading in useEffect
  const [isLoading, setIsLoading] = useState(true);

  // Writing logic for checking if show chat dialogue box is enabled or not
  // I referred shadcn ui dialogue component -> https://ui.shadcn.com/docs/components/dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Adding state of show interest button dialouge box
  const [isInterestedDialogOpen, setIsInterestedDialogOpen] = useState(false);

  // This funciton just toggles the chat on or not
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  // This funciton just toggles the show intrested nannies
  const toggleInterestedDialog = () =>
    setIsInterestedDialogOpen(!isInterestedDialogOpen);

  const navigateBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // using this loader to ensure the component loads after data is set in state
        setIsLoading(true);
        const data = await getListingById(id);
        const parentDoc = await getParentById(data.parentID);
        setListing(data);
        setParentDP(parentDoc);
        setIsInterested(data.interestedNannies.includes(currentUser.uid));

        if (userRole) {
          if (userRole.toLowerCase() === "parent" && data.selectedNannyID) {
            const nannyDoc = await getNannyById(data.selectedNannyID);
            setChatUserDoc(nannyDoc);
          } else if (userRole.toLowerCase() === "nanny") {
            setChatUserDoc(parentDoc);
          }
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser.uid, userRole, updateCounter]);

  const handleUpdate = () => {
    setUpdateCounter((prevCounter) => prevCounter + 1);
  };

  const handleNannyInterest = async (listingId) => {
    const success = await nannyInterested(listingId, currentUser.uid);
    if (success) {
      setIsInterested(true);
    }
  };

  const handleNannyWithdraw = async (listingId) => {
    const success = await withdrawNannyInterest(listingId, currentUser.uid);
    if (success) {
      setIsInterested(false);
    }
    handleUpdate();
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  // if (!userRole) {
  //   return <CustomLoading />;
  // }

  // if (!listing) {
  //   return <CustomLoading />;
  // }
  if (error) {
    return <Error404Page />;
  }

  return (
    <div className="mt-16">
      {/* <div className="flex items-start gap-4 mb-4 pl-8">
        <Button 
          variant="outline"
          size="icon"
          onClick={navigateBack} 
          aria-label="Go back"
          className="self-start" // Align the button to the top
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium self-center">Back to Dashboard</span>
      </div> */}
      <div className="card-container">
        {listing && (
          <Card className="w-[550px] mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                Listing Details
              </CardTitle>
              <div className="flex items-center space-x-4 space-y-4">
                <Avatar>
                  <AvatarImage src={parentDP.image} />
                  <AvatarFallback>
                    {parentDP.firstName[0]} {parentDP.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <div className="font-bold text-lg leading-none">
                    <Link
                      to={`/profile-details/${parentDP._id}`}
                      className="underline"
                    >
                      {parentDP.firstName} {parentDP.lastName}
                    </Link>
                  </div>

                  <div className="text-sm text-gray-500">
                    {parentDP.emailAddress}
                  </div>
                </div>
              </div>
              {/* <CardDescription>User role is {userRole}</CardDescription> */}
            </CardHeader>
            <CardContent className="left-aligned-content">
              <CardDescription>
                <strong>Listing Title:</strong> {listing.listingName}
              </CardDescription>
              <CardDescription>
                <strong>Listing Description:</strong> {listing.description}
              </CardDescription>
              <CardDescription>
                <strong>Job Start Date:</strong> {listing.jobStartDate}
              </CardDescription>
              <CardDescription>
                <strong>Job End Date:</strong> {listing.jobEndDate}
              </CardDescription>
              <CardDescription>
                <strong>Payable Hours:</strong> {listing.payableHours}
              </CardDescription>
              <CardDescription>
                <strong>Hourly Rate:</strong> ${listing.hourlyRate}
              </CardDescription>
              <CardDescription>
                <strong>Address:</strong>{" "}
                {`${listing.street}, ${listing.city}, ${listing.state}, ${listing.country} - ${listing.pincode}`}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              {userRole === "parent" && (
                <Button
                  variant="outline"
                  className="flex-1 mr-2"
                  onClick={toggleInterestedDialog}
                >
                  View Interested Nannies
                </Button>
              )}

              {userRole === "nanny" && !isInterested ? (
                <Button
                  variant="outline"
                  className="flex-1 mr-2"
                  onClick={() => handleNannyInterest(listing._id)}
                >
                  Apply
                </Button>
              ) : userRole === "nanny" && isInterested ? (
                <Button
                  variant="destructive"
                  className="flex-1 mr-2"
                  onClick={() => handleNannyWithdraw(listing._id)}
                  disabled={listing.status === "completed"}
                >
                  Withdraw
                </Button>
              ) : null}
              <Button className="flex-1" onClick={toggleDialog}>
                Show Chat
              </Button>
            </CardFooter>
            {listing && currentUser.uid === listing.selectedNannyID ? (
              <JobCompletion
                listing={listing}
                onUpdatedListing={handleUpdate}
              />
            ) : (
              <></>
            )}
            {listing &&
            currentUser.uid === listing.parentID &&
            listing.status === "completed" ? (
              <PaymentDetails
                listing={listing}
                onUpdatedListing={handleUpdate}
              />
            ) : (
              <></>
            )}
          </Card>
        )}
      </div>

      <div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          className="max-w-lg mx-auto"
        >
          {listing &&
          (currentUser.uid === listing.selectedNannyID ||
            currentUser.uid === listing.parentID) &&
          listing.selectedNannyID ? (
            <div>
              <DialogContent
                style={{ height: "90%" }}
                className="flex flex-col w-full"
              >
                <Chat room={id} chatUser={chatUserDoc} />
              </DialogContent>
            </div>
          ) : (
            <div>
              <DialogContent>
                <Typography>
                  {currentUser.uid === parentDP._id ? (
                    <span>No user has been approved</span>
                  ) : (
                    <span>
                      Chat is available only for the selected nanny and the
                      owner of the listing
                    </span>
                  )}
                </Typography>
              </DialogContent>
            </div>
          )}
        </Dialog>

        <Dialog
          open={isInterestedDialogOpen}
          onOpenChange={setIsInterestedDialogOpen}
          className="max-w-lg mx-auto"
        >
          {listing &&
          currentUser.uid === listing.parentID &&
          listing.progressBar === 0 &&
          listing.interestedNannies.length !== 0 ? (
            <div>
              <DialogContent
                className="flex flex-col w-full h-[700px] overflow-y-auto"
                style={{ maxWidth: "600px" }}
              >
                <InterestedNanny id={id} onUpdatedListing={handleUpdate} />
              </DialogContent>
            </div>
          ) : listing &&
            currentUser.uid === listing.parentID &&
            listing.progressBar === 100 &&
            listing.interestedNannies.length !== 0 ? (
            <div>
              <DialogContent>
                <Typography>This job is completed!</Typography>
              </DialogContent>
            </div>
          ) : (
            <div>
              <DialogContent>
                <Typography>
                  No nannies have shown interest in this listing yet!
                </Typography>
              </DialogContent>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
}

export default ListingFullDetails;

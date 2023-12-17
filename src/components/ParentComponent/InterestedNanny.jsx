import React, { useState, useContext, useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import {
  getInterestedNannies,
  approveNanny,
  unapproveNanny,
  getListingById,
} from "@/firebase/ListingFunctions";
import { Link } from "react-router-dom";
import { deleteAllMessagesByJobId } from "@/firebase/ChatFunctions";
function InterestedNanny({ id }) {
  const [nannyData, setNannyData] = useState([]);
  const [selectedNanny, setSelectedNanny] = useState(null);
  const [approvedNanny, setApprovedNanny] = useState(null);
  const [listingData, setListingData] = useState(null);
  const [isUnapproveConfirmationOpen, setIsUnapproveConfirmationOpen] =
    useState(false);

  const fetchApprovedNanny = async () => {
    try {
      const listing = await getListingById(id);
      setListingData(listing);
      console.log(
        "Listing inside fetch approved nanny",
        listing.selectedNannyID
      );
      if (listing.selectedNannyID && listing.selectedNannyID !== "") {
        setApprovedNanny(listing.selectedNannyID);
      } else {
        setApprovedNanny(null);
      }
    } catch (error) {
      console.error("Error fetching Approved nanny:", error);
    }
  };

  const handleApproveNanny = async (nannyID) => {
    await approveNanny(id, nannyID);
    fetchNannies();
    fetchApprovedNanny();
  };

  const handleUnapproveNanny = async () => {
    await unapproveNanny(id, selectedNanny._id);
    //once a nanny is unapproved messages in chatroom will be deleted
    await deleteAllMessagesByJobId(id);
    fetchNannies();
    setIsUnapproveConfirmationOpen(false);
    fetchApprovedNanny();
  };

  const fetchNannies = async () => {
    try {
      const nannyListings = await getInterestedNannies(id);
      setNannyData(nannyListings);
    } catch (error) {
      console.error("Error fetching Nannies:", error);
    }
  };

  useEffect(() => {
    fetchNannies();
    fetchApprovedNanny();
  }, [id]);

  const openUnapproveConfirmation = (nanny) => {
    setSelectedNanny(nanny);
    setIsUnapproveConfirmationOpen(true);
  };

  return (
    <div>
      <Typography variant="h6">Interested Nannies</Typography>
      <ul>
        {nannyData.map((nanny) => (
          <li key={nanny._id}>
            <Card>
              <CardContent>
                <img src={nanny.image} alt={`${nanny.displayName}'s profile`} />
                <Link to={`/profile-details/${nanny._id}`}>
                  <Typography variant="h3">{nanny.displayName}</Typography>
                </Link>
                <Typography>Email: {nanny.emailAddress}</Typography>
                <Typography>Phone Number: {nanny.phoneNumber}</Typography>
                <Button
                  onClick={() => handleApproveNanny(nanny._id)}
                  disabled={approvedNanny !== null}
                >
                  Approve Nanny
                </Button>
                <Button
                  onClick={() => openUnapproveConfirmation(nanny)}
                  disabled={
                    nanny._id !== approvedNanny ||
                    listingData.status === "completed"
                  }
                >
                  Unapprove Nanny
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {isUnapproveConfirmationOpen && (
        <div>
          <Typography variant="p">
            Are you sure you want to unapprove the nanny?
          </Typography>
          <Button onClick={handleUnapproveNanny}>Yes</Button>
          <Button onClick={() => setIsUnapproveConfirmationOpen(false)}>
            No
          </Button>
        </div>
      )}
    </div>
  );
}

export default InterestedNanny;

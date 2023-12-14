import React, { useState, useContext, useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { getInterestedNannies, approveNanny, unapproveNanny } from "@/firebase/ListingFunctions";
import { Link } from "react-router-dom";

function InterestedNanny({ id }) {
  const [nannyData, setNannyData] = useState([]);
  const [selectedNanny, setSelectedNanny] = useState(null);
  const [isUnapproveConfirmationOpen, setIsUnapproveConfirmationOpen] = useState(false);

  const handleApproveNanny = async (nannyID) => {
    // Call the function to approve the nanny here
    await approveNanny(id, nannyID);
    // Refetch the interested nannies after approval
    fetchNannies();
  };

  const handleUnapproveNanny = async () => {
    // Call the function to unapprove the nanny here
    await unapproveNanny(id, selectedNanny._id);
    // Refetch the interested nannies after unapproval
    fetchNannies();
    // Close the confirmation popup
    setIsUnapproveConfirmationOpen(false);
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
  }, [id]);

  const openUnapproveConfirmation = (nanny) => {
    setSelectedNanny(nanny);
    setIsUnapproveConfirmationOpen(true);
  };

  console.log('stateData',nannyData)

  return (
    <div>
      <Typography variant="h6">Interested Nannies</Typography>
      <ul>
        {nannyData.map((nanny) => (
          <li key={nanny._id}>
            <Card>
              <CardContent>
                <img src={nanny.image} alt={`${nanny.displayName}'s profile`} />
                <Link to={`/profile-details/${nanny._id}`}><Typography variant="h3">{nanny.displayName}</Typography></Link>
                <Typography>Email: {nanny.emailAddress}</Typography>
                <Typography>Phone Number: {nanny.phoneNumber}</Typography>
                <Button onClick={() => handleApproveNanny(nanny._id)}>Approve Nanny</Button>
                <Button onClick={() => openUnapproveConfirmation(nanny)}>Unapprove Nanny</Button>
              </CardContent>
            </Card>
            {/* {nanny.isApproved && (
              // Conditionally render the Chat component if nanny is approved
              <div>
                <Typography>Chat with {nanny.displayName}</Typography>
                <Chat room={id} />
              </div>
            )} */}
          </li>
        ))}
      </ul>

      {isUnapproveConfirmationOpen && (
        <div>
          <Typography variant="p">Are you sure you want to unapprove the nanny?</Typography>
          <Button onClick={handleUnapproveNanny}>Yes</Button>
          <Button onClick={() => setIsUnapproveConfirmationOpen(false)}>No</Button>
        </div>
      )}
    </div>
  );
}

export default InterestedNanny;
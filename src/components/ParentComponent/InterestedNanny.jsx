import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button"
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

  // for css implementation i referred - > https://v1.tailwindcss.com/components/cards
  return (
    <div className="space-y-4">
      <div className="text-xl font-bold mb-2">Interested Nannies</div>
        <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
          <ul className="list-none p-0 m-0">
          {nannyData.map((nanny) => (
            <li key={nanny._id} className="mb-4">
              <div className="max-w-sm w-full lg:max-w-full lg:flex border border-gray-400 bg-white rounded-lg overflow-hidden">
                <div 
                  className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                  style={{ backgroundImage: `url(${nanny.image})` }}
                  title={`${nanny.displayName}'s profile`}
                />
                <div className="p-4 flex flex-col justify-between leading-normal">
                  <div>
                    <div className="text-gray-900 font-bold text-xl mb-2">{nanny.displayName}</div>
                    <p className="text-gray-700 text-base">Email: {nanny.emailAddress}</p>
                    <p className="text-gray-700 text-base">Phone Number: {nanny.phoneNumber}</p>
                  </div>
                  <div className="flex items-center mt-4">
                    <Link to={`/profile-details/${nanny._id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                      View Profile
                    </Link>
                    <Button
                      onClick={() => handleApproveNanny(nanny._id)}
                      disabled={approvedNanny !== null}
                      className={`mr-2 ${approvedNanny !== null ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-black text-white"}`}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => openUnapproveConfirmation(nanny)}
                      disabled={nanny._id !== approvedNanny || listingData.status === "completed" }
                      className = {`ml-2`}
                    >
                      Unapprove
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          </ul>
        </div>

      {isUnapproveConfirmationOpen && (
        <div className="p-4 border border-gray-400 bg-white rounded-lg">
          <div className="text-gray-700 text-base mb-4">
            Are you sure you want to unapprove the nanny?
          </div>
          <Button  onClick={handleUnapproveNanny}>Yes</Button>
          <Button variant="secondary" onClick={() => setIsUnapproveConfirmationOpen(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
}

export default InterestedNanny;

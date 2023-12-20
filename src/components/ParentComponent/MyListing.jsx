// MyListing.js
import React, { useState, useContext, useEffect } from "react";
import { getAllListings, updateListing } from "../../firebase/ParentFunctions"; // Assuming there is an updateListing function
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { deleteListing } from "@/firebase/ListingFunctions";
import ViewListing from "./ViewListing";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import CustomLoading from "../EssentialComponents/CustomLoading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function MyListing() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch all listings when the component mounts
    const fetchListings = async () => {
      try {
        // Check if there is a logged-in user with the parent role
        if (currentUser && userRole === "parent" && currentUser.uid) {
          const parentListings = await getAllListings(currentUser.uid);
          setListings(parentListings);
          console.log(parentListings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoadingListings(false);
        setIsDelete(false);
      }
    };

    fetchListings();
  }, [isDelete]);

  const handleDeleteListingClick = (listingId) => {
    deleteListing(listingId);
    setIsDelete(true);
    setOpen(false);
  };

  const handleSvgClick = () => {
    // Open the modal or perform any other action
    setOpen(true);
  };

  if (loadingListings) {
    return (
      <div>
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap pt-8 pb-8">
      <div className="flex flex-wrap justify-center gap-9 w-full">
        {listings.map((listing, index) => (
          <Link
            to={`/listing/${listing._id}`}
            key={index}
            onClick={(e) => e.preventDefault()}
          >
            <Card className="w-[500px]  hover:shadow-lg transition duration-300 ease-in-out rounded-lg p-4">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <div>{listing.listingName}</div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={handleSvgClick}
                      >
                        <svg
                          className="h-6 w-6 text-red-500"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <line x1="4" y1="7" x2="20" y2="7" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                      </div>
                    </AlertDialogTrigger>
                    {open && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogDescription>
                            Are you sure you want to delete the listing?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteListingClick(listing._id);
                              }}
                              type="submit"
                            >
                              Delete
                            </Button>
                          </AlertDialogAction>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                </CardTitle>

                <CardDescription>
                  <strong>Posted Date:</strong> {listing.postedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Description:</strong> {listing.description}
                </p>
                <p>
                  <strong>Hourly Rate:</strong> {listing.hourlyRate}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyListing;

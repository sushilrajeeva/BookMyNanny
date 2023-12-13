// MyListing.js
import React, { useState, useContext, useEffect } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getInterestedNannies } from "@/firebase/ListingFunctions";

function InterestedNanny({ id }) {
  const [nannyData, setNannyData] = useState([]);

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const nannyListings = await getInterestedNannies(id);
        console.log("NANNNYYY", nannyListings);
        setNannyData(nannyListings);
      } catch (error) {
        console.error("Error fetching Nannies:", error);
      }
    };

    fetchNannies();
  }, [id]);

  return (
    <div>
      <h2>Interested Nannies</h2>
      <ul>
        {console.log("NannyDate", nannyData)}
        {nannyData.map((nanny) => (
          <li key={nanny._id}>
            <div>
              <img src={nanny.image} alt={`${nanny.displayName}'s profile`} />
            </div>
            <div>
              <h3>{nanny.displayName}</h3>
              <p>Email: {nanny.emailAddress}</p>
              <p>Phone Number: {nanny.phoneNumber}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterestedNanny;

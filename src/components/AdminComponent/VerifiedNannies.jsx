import React, { useEffect, useState } from 'react';
import { getVerifiedNannies } from '../../firebase/AdminFunctions';

function verifiedNannies() {
  const [nannies, setNannies] = useState([]);

  useEffect(() => {
    // Fetch all nannies when the component mounts
    const fetchNannies = async () => {
      try {
        const verifiedNannies = await getVerifiedNannies();
        setNannies(verifiedNannies);
        console.log(verifiedNannies)
      } catch (error) {
        console.error('Error fetching Nannies:', error);
      }
    };

    fetchNannies();
  }, []);

  return (
    <div>
      <h1>Verified Nannies</h1>
      <ul>
        {nannies.map((nanny) => (
          <li key={nanny._id}>
            <p>{nanny.firstName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default verifiedNannies;

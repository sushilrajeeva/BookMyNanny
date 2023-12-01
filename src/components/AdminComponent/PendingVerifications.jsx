import React, { useEffect, useState } from 'react';
import {getPendingVerifications, VerifyNanny } from '../../firebase/AdminFunctions';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



function PendingVerifications() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const pendingVerifications = await getPendingVerifications();
        if(pendingVerifications.length == 0){
            console.log("No pending Nannies to verify")
        }
        setPending(pendingVerifications);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchPendingVerifications();
  }, []);

  const handleVerifyNanny = async (nannyId) => {
    try {
      await VerifyNanny(nannyId);

      const updatedPendingVerifications = await getPendingVerifications();
      if(updatedPendingVerifications.length == 0){
        console.log("No pending Nannies to verify")
      }
      setPending(updatedPendingVerifications);
    } catch (error) {
      console.error('Error verifying nanny:', error);
    }
  };

  return (
    <div>
      <h1>Pending Verifications</h1>
      <ul>
        {pending.map((nanny) => (
          <li key={nanny._id}>
            <p>NAME: {nanny.firstName}</p>
            <p>SSN: {nanny.ssn}</p>
            <div >
              <Button 
                onClick={() => handleVerifyNanny(nanny._id)}
                style={{ padding: '10px 15px', borderRadius: '5px', flex: '1', marginRight: '5px' }}
              >
                Verify Nanny
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingVerifications;

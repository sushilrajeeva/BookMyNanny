import React, { useEffect, useState } from 'react';
import {getPendingVerifications, VerifyNanny } from '../../firebase/AdminFunctions';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DataTable from '../ListingTable/data-table';



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


  // Define the columns for the DataTable
  const columns = [
    {
      accessorKey: 'firstName',
      header: 'Name',
    },
    {
      accessorKey: 'ssn',
      header: 'SSN',
    },
    {
      id: 'action',
      header: 'Action',
      cell: (info) => (
        <Button
          onClick={() => handleVerifyNanny(info.row.original._id)}
        >
          Verify Nanny
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Pending Verifications</h1>
      <DataTable columns={columns} data={pending} />
    </div>
  );
}

export default PendingVerifications;

import React, { useState, useEffect, useContext } from 'react';
import { getAllListings, nannyInterested, withdrawNannyInterest, getActiveJobs } from "../../firebase/NannyFunctions";
import { Button } from "@/components/ui/button"

// Importing the Listing Table Component 
import { columns } from "../ListingTable/columns"
import  DataTable  from "../ListingTable/data-table"
 

import { AuthContext } from "../../context/AuthContext";

const ActiveJobs = () => {
    const [activeJobs, setActiveJobs] = useState([]);
    const { currentUser, userRole } = useContext(AuthContext);

    // some css 
    // const tableStyle = {
    //     width: '100%',
    //     borderCollapse: 'collapse',
    // };

    // const thTdStyle = {
    //     border: '1px solid black',
    //     padding: '8px',
    //     textAlign: 'left',
    // };

    // const columns = React.useMemo(() => [
    //     {
    //         accessorKey: 'listingName',
    //         header: 'Listing Name',
    //     },
    //     {
    //         accessorKey: 'location',
    //         header: 'Location',
    //         cell: (info) => `${info.row.original.street}, ${info.row.original.city}, ${info.row.original.state}, ${info.row.original.country} - ${info.row.original.pincode}`,
    //     },
    //     {
    //         accessorKey: 'hourlyRate',
    //         header: 'Hourly Rate',
    //     },
    //     {
    //         accessorKey: 'jobStartDate',
    //         header: 'Start Date',
    //     },
    //     {
    //         accessorKey: 'jobEndDate',
    //         header: 'End Date',
    //     },
    //     {
    //         id: 'action',
    //         header: 'Action',
    //         cell: (info) => <Button onClick={() => console.log('View job', info.row.original._id)}>View Job</Button>,
    //     },
    // ], []);

    useEffect(() => {
        const fetchActiveJobs = async () => {
            try {
                const jobs = await getActiveJobs(currentUser.uid);
                setActiveJobs(jobs);
            } catch (error) {
                console.error('Error fetching active jobs:', error);
            }
        };

        fetchActiveJobs();
    }, [currentUser.uid]); // Dependency array includes nannyID, so this effect runs when nannyID changes

    return (
        <div>
            <h2>Active Jobs</h2>
            <DataTable columns={columns} data={activeJobs} />
        </div>
    );
};

export default ActiveJobs;





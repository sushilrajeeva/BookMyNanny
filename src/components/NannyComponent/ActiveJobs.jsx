import React, { useState, useEffect, useContext } from 'react';
import { getAllListings, nannyInterested, withdrawNannyInterest, getActiveJobs } from "../../firebase/NannyFunctions";
import { Button } from "@/components/ui/button"
 

import { AuthContext } from "../../context/AuthContext";

const ActiveJobs = () => {
    const [activeJobs, setActiveJobs] = useState([]);
    const { currentUser, userRole } = useContext(AuthContext);

    // some css 
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const thTdStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    };

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
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thTdStyle}>Listing Name</th>
                        <th style={thTdStyle}>Location</th>
                        <th style={thTdStyle}>Hourly Rate</th>
                        <th style={thTdStyle}>Start Date</th>
                        <th style={thTdStyle}>End Date</th>
                        <th style={thTdStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {activeJobs.map(job => (
                        <tr key={job._id}>
                            <td style={thTdStyle}>{job.listingName}</td>
                            <td style={thTdStyle}>{`${job.street}, ${job.city}, ${job.state}, ${job.country} - ${job.pincode}`}</td>
                            <td style={thTdStyle}>{job.hourlyRate}</td>
                            <td style={thTdStyle}>{job.jobStartDate}</td>
                            <td style={thTdStyle}>{job.jobEndDate}</td>
                            <td style={thTdStyle}>
                                <Button onClick={() => console.log('View job', job._id)}>View Job</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActiveJobs;





"use client";

//import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const columns = [
  {
    accessorKey: "listingName",
    header: "Listing Name",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: (info) => `${info.row.original.street}, ${info.row.original.city}, ${info.row.original.state}, ${info.row.original.country} - ${info.row.original.pincode}`,
  },
  {
    accessorKey: "hourlyRate",
    header: "Hourly Rate",
  },
  {
    accessorKey: "jobStartDate",
    header: "Start Date",
  },
  {
    accessorKey: "jobEndDate",
    header: "End Date",
  },
  {
    id: 'action',
    header: "Action",
    cell: (info) => <Button onClick={() => console.log('View job', info.row.original._id)}>View Job</Button>,
  },
];

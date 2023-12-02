// For this entire component i took direct reference from shadcn data-table
// Reference - https://ui.shadcn.com/docs/components/data-table

"use client";


import { ArrowUpDown } from "lucide-react";

// Custom header component for sortable columns
function DataTableColumnHeader({ column, title }) {
  const isSortedDesc = column.getIsSorted() === 'desc';
  const isSortedAsc = column.getIsSorted() === 'asc';

  return (
    <div onClick={() => column.toggleSorting()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {title}
      <ArrowUpDown className={isSortedDesc ? "ml-2" : isSortedAsc ? "rotate-180 ml-2" : "ml-2"} />
    </div>
  );
}

export const columns = [
  {
    accessorKey: "listingName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Listing Name" />,
  },
  {
    id: "location",
    header: "Location",
    cell: (info) => `${info.row.original.street}, ${info.row.original.city}, ${info.row.original.state}, ${info.row.original.country} - ${info.row.original.pincode}`,
    enableSorting: false, // doing this to disable sorting as i don't want sorting on location
  },
  {
    accessorKey: "hourlyRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hourly Rate" />,
    cell: (info) => {
      const amount = parseFloat(info.row.original.hourlyRate);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    }
  },
  {
    accessorKey: "jobStartDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
  },
  {
    accessorKey: "jobEndDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
  },
  {
    id: 'action',
    header: "Action",
    cell: (info) => <div onClick={() => console.log('View job', info.row.original._id)} style={{ cursor: 'pointer' }}>View Job</div>,
    enableSorting: false, // doing this to disable sorting as i don't want sorting on button actions
  },
];

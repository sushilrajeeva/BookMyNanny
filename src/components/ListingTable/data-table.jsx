// For this entire component i took direct reference from shadcn data-table
// Reference - https://ui.shadcn.com/docs/components/data-table


import React, { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';



const DataTable = ({ columns, data }) => {
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    
    function isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
      }
      
      function isDate(value) {
        return /^(\d{4})-(\d{2})-(\d{2})$/.test(value);
      }
      
    const table = useReactTable({
        data,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      });

    // Button styles
    const buttonStyles = "px-3 py-1 text-sm font-medium text-white rounded hover:bg-blue-600";
    const disabledButtonStyles = "px-3 py-1 text-sm text-gray-400 bg-gray-200 rounded cursor-not-allowed";

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                const cellValue = cell.getValue();
                const alignStyle = isNumeric(cellValue) || isDate(cellValue)
                  ? { textAlign: 'right' }
                  : { textAlign: 'left' };

                return (
                  <TableCell key={cell.id} style={alignStyle}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            
            {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={table.getState().pagination.pageIndex === 0}
            className={table.getState().pagination.pageIndex === 0 ? disabledButtonStyles : buttonStyles + " bg-blue-500"}
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={!table.getCanPreviousPage() ? disabledButtonStyles : buttonStyles + " bg-blue-500"}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={!table.getCanNextPage() ? disabledButtonStyles : buttonStyles + " bg-blue-500"}
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1}
            className={table.getState().pagination.pageIndex === table.getPageCount() - 1 ? disabledButtonStyles : buttonStyles + " bg-blue-500"}
          >
            Last
          </button>
        </div>
      </div>

        </div>
    );
};

export default DataTable;

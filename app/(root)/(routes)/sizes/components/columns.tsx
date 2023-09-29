"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import CellAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumns = {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
};

export const columns: ColumnDef<SizeColumns>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.createdAt, "MMM dd yyyy HH:mm:ss")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({row})=> <CellAction data={row.original} />

  },
];

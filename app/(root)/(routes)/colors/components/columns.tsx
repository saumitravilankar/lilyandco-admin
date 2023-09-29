"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import CellAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumns = {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
};

export const columns: ColumnDef<ColorColumns>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.value}
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: row.original.value }}
        ></div>
      </div>
    ),
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

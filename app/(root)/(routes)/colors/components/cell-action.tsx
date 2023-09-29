"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmDelete from "@/components/modal/confirm-delete";

import { ColorColumns } from "./columns";

interface CellActionProps {
  data: ColorColumns;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Color Id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/colors/${data.id}`);
      toast.success("Color Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {open && (
        <ConfirmDelete
          entity="color"
          setOpen={setOpen}
          onDelete={onDelete}
          onClose={() => setOpen(false)}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => onCopy(data.id)}
          >
            <Copy className="w-4 h-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => router.push(`/colors/${data.id}`)}
          >
            <Edit className="w-4 h-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;

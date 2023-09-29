"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import ConfirmDelete from "@/components/modal/confirm-delete";

interface SizeFormProps {
  initialData: Size | null;
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Size must be at least 2 characters.",
  }),
  value: z.string().min(1, {
    message: "Size value must be at least 2 characters.",
  }),
});

export const ColorForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update size" : "Create size";
  const description = initialData ? "Edit a size." : "Add a new size";
  const toastMessage = initialData ? "Size updated." : "Size created.";
  const button = initialData ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/sizes`, data);
      }
      router.refresh();
      router.push(`/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/sizes/${initialData?.id}`);
      router.refresh();
      router.push(`/sizes`);
      toast.success("Size Deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <ConfirmDelete
          entity="size"
          setOpen={setOpen}
          onDelete={onDelete}
          onClose={() => setOpen(false)}
        />
      )}
      <div className="mt-10 flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <div>
            <Button
              disabled={loading}
              onClick={() => setOpen(true)}
              variant={"destructive"}
              size={"icon"}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 my-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size Name</FormLabel>
                    <FormControl>
                      <Input placeholder={initialData?.name} {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of size you want to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size Code</FormLabel>
                    <FormControl>
                      <Input placeholder={initialData?.name} {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the code of size you want to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {button}
          </Button>
        </form>
      </Form>
    </>
  );
};

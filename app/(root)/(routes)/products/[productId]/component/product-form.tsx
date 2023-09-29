"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Color, Image, Product, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  availableSizes: Size[];
  availableColors: Color[];
  currentSizes: string[] | undefined;
  currentColors: string[] | undefined;
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(1, {
    message: "Please enter a valid Price.",
  }),
  images: z.object({ url: z.string() }).array().min(1, {
    message: "Please attach atleast 1 Image",
  }),
  sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  colors: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  availableSizes,
  availableColors,
  currentColors,
  currentSizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const button = initialData ? "Save Changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        sizes: currentSizes || [],
        colors: currentColors || [],
      }
    : {
        name: "",
        images: [],
        price: 0,
        sizes: [],
        colors: [],
      };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/products`, data);
      }
      router.refresh();
      router.push(`/products`);
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
      await axios.delete(`/api/products/${initialData?.id}`);
      router.refresh();
      router.push(`/products`);
      toast.success("Product Deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
          <div className="space-y-6">
            {/* Image Form Field */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name Form Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={initialData?.name}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the product you want to add.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Price Form Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Form Field */}
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {availableSizes.map((size) => (
                <FormField
                  key={size.id}
                  control={form.control}
                  name="sizes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={size.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            disabled={loading}
                            checked={field.value?.includes(size.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, size.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== size.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {size.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>

            {/* Colors Form Field */}
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {availableColors.map((color) => (
                <FormField
                  key={color.id}
                  control={form.control}
                  name="colors"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={color.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            disabled={loading}
                            checked={field.value?.includes(color.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, color.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== color.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {color.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          </div>
          <Button disabled={loading} type="submit">
            {button}
          </Button>
        </form>
      </Form>
    </>
  );
};

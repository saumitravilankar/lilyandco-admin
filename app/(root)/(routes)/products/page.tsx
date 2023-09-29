import { Plus } from "lucide-react";
import Link from "next/link";

import prismadb from "@/lib/prismadb";

import Container from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import APIList from "@/components/ui/api-list";

const ProductsPage = async () => {
  const products = await prismadb.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const productsWithNumber = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div>
      <Container>
        <div className="flex flex-col">
          <div className="flex items-center w-full justify-between mt-10">
            <Heading
              title={`Products (${products.length})`}
              description="Manage your products"
            />
            <Button size="sm">
              <Link className="flex items-center gap-2" href={"/products/new"}>
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add new</span>
              </Link>
            </Button>
          </div>
          <Separator className="my-10" />
          <div>
            <DataTable columns={columns} data={productsWithNumber} />
          </div>
        </div>
        <Separator className="my-10" />
        <Heading title={`API Calls`} description="API Calls for Products" />
        <Separator className="my-5" />
        <APIList entityName="products" entityId="productId" />
      </Container>
    </div>
  );
};

export default ProductsPage;

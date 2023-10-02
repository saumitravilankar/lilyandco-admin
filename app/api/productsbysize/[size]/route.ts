// pages/api/products/by-size.js

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { size: string } }
) {
  try {
    console.log("Size parameter:", params.size);

    if (!params.size) {
      return new NextResponse("Size parameter is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        sizes: {
          some: {
            value: params.size,
          },
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCTS_BY_SIZE_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

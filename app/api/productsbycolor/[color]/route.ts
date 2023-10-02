// pages/api/products/by-size.js

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { color: string } }
) {
  try {
    console.log("Size parameter:", params.color);

    if (!params.color) {
      return new NextResponse("Color parameter is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        colors: {
          some: {
            name: params.color,
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

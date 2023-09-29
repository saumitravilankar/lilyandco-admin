import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
    });

    const sizeIds = product?.sizes.map((size) => size.id);
    const colorIds = product?.colors.map((color) => color.id);

    const extractedIds = {
      sizeIds,
      colorIds,
    };

    return NextResponse.json(extractedIds);
  } catch (error) {
    console.log("PRODUCT_GET", error);
    return new NextResponse("Internal erro", { status: 500 });
  }
}

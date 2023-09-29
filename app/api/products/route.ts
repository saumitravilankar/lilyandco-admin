import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, images, sizes, colors } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!sizes || !sizes.length) {
      return new NextResponse("Sizes are required", { status: 400 });
    }

    if (!colors || !colors.length) {
      return new NextResponse("Colors are required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        sizes: {
          connect: sizes.map((size: string) => ({ id: size })),
        },
        colors: {
          connect: colors.map((color: string) => ({ id: color })),
        },
      },
      include: {
        colors: true,
        sizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCTS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const products = await prismadb.product.findMany({
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
    console.log("PRODUCT_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

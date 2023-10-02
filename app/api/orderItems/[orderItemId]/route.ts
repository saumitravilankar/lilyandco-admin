import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderItemId: string } }
) {
  try {
    if (!params.orderItemId) {
      return new NextResponse("Order Item Id is required", { status: 400 });
    }

    const orderItem = await prismadb.orderItem.findUnique({
      where: {
        id: params.orderItemId,
      },
      include: {
        product: true,
        order: true,
      },
    });

    return NextResponse.json(orderItem);
  } catch (error) {
    console.log("ORDERITEM_GET", error);
    return new NextResponse("Internal erro", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderItemId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderItemId) {
      return new NextResponse("Order Item Id is required", { status: 400 });
    }

    const orderItem = await prismadb.orderItem.delete({
      where: {
        id: params.orderItemId,
      },
    });

    return NextResponse.json(orderItem);
  } catch (error) {
    console.log("ORDERITEM_DELETE", error);
    return new NextResponse("Internal erro", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // const { userId } = auth();

    const body = await req.json();

    const { productId, quantity, price, orderId } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthenticated", { status: 403 });
    // }

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    if (!quantity) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!orderId) {
      return new NextResponse("Order Id is required", { status: 400 });
    }

    const orderItem = await prismadb.orderItem.create({
      data: {
        productId,
        price,
        quantity,
        orderId,
      },
      include: {
        product: true,
        order: true,
      },
    });

    return NextResponse.json(orderItem);
  } catch (error) {
    console.log("ORDERITEM_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

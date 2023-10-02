import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    // const { userId } = auth();

    const body = await req.json();

    const { productId, quantity, price } = body;

    // let order = await prismadb.order.findFirst({
    //   where: {
    //     user_Id: user_Id,
    //     isPaid: false,
    //   },
    // });

    // if (!order) {
    //   order = await prismadb.order.create({
    //     data: {
    //       user_Id,
    //       total_quantity: 0,
    //       total_price: 0,
    //     },
    //   });
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

    const orderItem = await prismadb.orderItem.create({
      data: {
        productId,
        price,
        quantity,
        // orderId: order.id,
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

export async function GET(req: Request) {
  try {
    const orderItems = await prismadb.orderItem.findMany({
      include: {
        product: true,
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orderItems);
  } catch (error) {
    console.log("ORDERITEM_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

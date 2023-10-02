import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    // const { userId } = auth();

    const body = await req.json();

    const {
      isPaid,
      phone,
      address,
      user_Id,
      total_quantity,
      total_price,
      payment_id,
      orderItems,
    } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthenticated", { status: 403 });
    // }

    if (!user_Id) {
      return new NextResponse("User not Authenticated", { status: 400 });
    }

    if (!total_quantity) {
      return new NextResponse("Total Quantity is required", { status: 400 });
    }

    if (!total_price) {
      return new NextResponse("Total Price is required", { status: 400 });
    }

    if (!orderItems || !orderItems.length) {
      return new NextResponse("Minimum One product is required", {
        status: 400,
      });
    }

    const order = await prismadb.order.create({
      data: {
        user_Id,
        total_quantity,
        total_price,
        orderItems: {
          connect: orderItems.map((orderItem: string) => ({ id: orderItem })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("ORDERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const orders = await prismadb.order.findMany({
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log("ORDER_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

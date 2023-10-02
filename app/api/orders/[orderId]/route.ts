import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order Id is required", { status: 400 });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("ORDER_GET", error);
    return new NextResponse("Internal erro", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderId) {
      return new NextResponse("Order Id is required", { status: 400 });
    }

    const order = await prismadb.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("ORDER_DELETE", error);
    return new NextResponse("Internal erro", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
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
    if (!isPaid) {
      return new NextResponse("Payment Status Required", { status: 400 });
    }
    if (!phone) {
      return new NextResponse("Phone number is required", { status: 400 });
    }
    if (!address) {
      return new NextResponse("Address is Required", { status: 400 });
    }
    if (!payment_id) {
      return new NextResponse("Payment_ID is required", { status: 400 });
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

    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        user_Id,
        total_quantity,
        total_price,
        orderItems: {
          connect: orderItems.map((orderItem: string) => ({ id: orderItem })),
        },
        isPaid,
        phone,
        address,
        payment_id,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("ORDERS_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

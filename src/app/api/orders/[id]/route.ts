import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Order } from "@/models/Order";
import { isValidObjectId } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Fetch Order
    // We use .lean() for performance since we just need to read the data
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 3. Return Data
    return NextResponse.json({
      success: true,
      data: order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
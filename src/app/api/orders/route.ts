import { NextResponse } from "next/server";
import { createOrder } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createOrder(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/api";

export async function GET() {
  try {
    const list = await getCategories();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

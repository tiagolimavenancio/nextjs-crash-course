import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON data format." }, { status: 400 });
    }

    const createEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createEvent },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event creation failed", error: e instanceof Error ? e.message : "Unknown" },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e: any) {
      return NextResponse.json({ message: "Invalid JSON data format." }, { status: 400 });
    }

    const file = formData.get("image") as File;

    if (!file) return NextResponse.json({ message: "Image is required" }, { status: 400 });

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: "events" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

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

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 });
  }
}

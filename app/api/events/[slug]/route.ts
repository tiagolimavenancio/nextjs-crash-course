import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, IEvent } from "@/database";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Extract and validate slug parameter
    const { slug } = params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Valid slug parameter is required" },
        { status: 400 }
      );
    }

    // Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Return successful response
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error("Error fetching event by slug:", error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching the event",
      },
      { status: 500 }
    );
  }
}

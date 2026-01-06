/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Booking } from "@/database";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();
    await Booking.create({ eventId, slug, email });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e };
  }
};

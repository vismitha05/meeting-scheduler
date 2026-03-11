import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { sendMeetingConfirmedEmail } from "@/lib/email";

const DB_DIR = join(process.cwd(), "db");
const BOOKINGS_PATH = join(DB_DIR, "bookings.json");

interface BookingCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  timezone: string; // e.g. "UTC+05:30 ..."
}

function randomLetters(len: number) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += letters[Math.floor(Math.random() * letters.length)];
  }
  return out;
}

function generateMeetLink() {
  const code = `${randomLetters(3)}-${randomLetters(4)}-${randomLetters(3)}`;
  return `https://meet.google.com/${code}`;
}

function getBaseUrl(req: NextRequest) {
  const env = process.env.APP_BASE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingCreatePayload;

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.date ||
      !body.time ||
      !body.timezone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await mkdir(DB_DIR, { recursive: true });

    let existing: unknown[] = [];
    try {
      const file = await readFile(BOOKINGS_PATH, "utf8");
      existing = JSON.parse(file) as unknown[];
    } catch {
      existing = [];
    }

    const booking = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      date: body.date,
      time: body.time,
      timezone: body.timezone,
      location: "Google Meet",
      meetLink: generateMeetLink(),
    };

    existing.push(booking);

    await writeFile(BOOKINGS_PATH, JSON.stringify(existing, null, 2), "utf8");

    const baseUrl = getBaseUrl(req);
    const rescheduleUrl = `${baseUrl}/schedule`;
    const cancelUrl = `${baseUrl}/cancel?bookingId=${encodeURIComponent(
      booking.id,
    )}`;

    try {
      const emailResult = await sendMeetingConfirmedEmail({
        to: booking.email,
        attendeeEmail: booking.email,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        meetingLink: booking.meetLink,
        rescheduleUrl,
        cancelUrl,
      });

      console.log(
        `[booking] Confirmation email sent for bookingId=${booking.id}, messageId=${emailResult.messageId}`,
      );
    } catch (emailError) {
      const message =
        emailError instanceof Error ? emailError.message : "Unknown email error";
      console.error(
        `[booking] Booking created but failed to send confirmation email for bookingId=${booking.id}`,
        emailError,
      );
      return NextResponse.json(
        {
          error: "Booking created but failed to send confirmation email.",
          detail: message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}

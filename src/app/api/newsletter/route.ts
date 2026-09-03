import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    // In production, integrate with Mailchimp, ConvertKit, Resend audiences, etc.
    // For now, log to console and return success.
    console.log("[Newsletter] New subscriber:", email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/bookingSchema";
import { internalLeadEmail, guestConfirmationEmail } from "@/emails/templates";
import { createBookingRef, generateBookingPdf, makePdfAttachment } from "@/emails/booking-pdf";
import { sendMail, type MailAttachment } from "@/lib/mail";

function cloneAttachment(attachment: MailAttachment): MailAttachment {
  return {
    ...attachment,
    content: Buffer.from(attachment.content),
  };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const data = parsed.data;

  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.SMTP_HOST) {
    console.error("Booking email not sent: SMTP_HOST is not set in .env.local");
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Please use WhatsApp for now." },
      { status: 503 },
    );
  }

  const inbox = process.env.BOOKING_INBOX;
  if (!inbox) {
    console.error("Booking email not sent: BOOKING_INBOX is not set in .env.local");
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Please use WhatsApp for now." },
      { status: 503 },
    );
  }

  const ref = createBookingRef();
  let pdfAttached = false;
  let pdfAttachment: MailAttachment | undefined;

  try {
    const pdfBuffer = await generateBookingPdf(data, ref);
    pdfAttachment = makePdfAttachment(pdfBuffer, ref);
    pdfAttached = true;
  } catch (err) {
    console.error("[booking] PDF generation failed:", err);
  }

  const lead = internalLeadEmail(data, { pdfAttached });
  const guest = guestConfirmationEmail(data, { pdfAttached });

  try {
    await sendMail({
      to: inbox,
      replyTo: data.email,
      subject: lead.subject,
      html: lead.html,
      text: lead.text,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    });

    await sendMail({
      to: data.email,
      subject: guest.subject,
      html: guest.html,
      text: guest.text,
      attachments: pdfAttachment ? [cloneAttachment(pdfAttachment)] : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[booking] SMTP send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or contact us on WhatsApp." },
      { status: 500 },
    );
  }
}

import PDFDocument from "pdfkit";
import type { BookingInput } from "@/lib/bookingSchema";
import { siteConfig } from "@/lib/siteConfig";

const GOLD = "#1b4332";
const GOLD_DARK = "#2d6a4f";
const INK = "#1a1a1a";
const MUTED = "#6b6b66";

export function createBookingRef(date = new Date()): string {
  return date.getTime().toString(36).toUpperCase();
}

export type PdfAttachment = {
  filename: string;
  content: Buffer;
  contentType: "application/pdf";
  contentDisposition: "attachment";
};

export function makePdfAttachment(buffer: Buffer, ref?: string): PdfAttachment {
  const suffix = ref ?? createBookingRef();
  return {
    filename: `booking-enquiry-${suffix}.pdf`,
    content: buffer,
    contentType: "application/pdf",
    contentDisposition: "attachment",
  };
}

function contentWidth(doc: PDFKit.PDFDocument): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function drawSeparator(doc: PDFKit.PDFDocument): void {
  const x = doc.page.margins.left;
  const y = doc.y;
  doc
    .moveTo(x, y)
    .lineTo(x + contentWidth(doc), y)
    .lineWidth(1)
    .strokeColor(GOLD)
    .stroke();
  doc.moveDown(0.6);
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string): void {
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD_DARK).text(title);
  doc.moveDown(0.15);
  drawSeparator(doc);
}

function fieldRow(doc: PDFKit.PDFDocument, label: string, value: string): void {
  const left = doc.page.margins.left;
  const rowY = doc.y;

  doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(label, left, rowY, {
    width: 120,
    lineBreak: false,
  });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(INK)
    .text(value, left + 120, rowY, {
      width: contentWidth(doc) - 120,
      lineBreak: false,
    });

  doc.font("Helvetica");
  doc.moveDown(0.55);
}

function addFooters(doc: PDFKit.PDFDocument): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    const left = doc.page.margins.left;
    const width = contentWidth(doc);
    const footerY = doc.page.height - doc.page.margins.bottom + 10;
    const pageNum = i - range.start + 1;

    doc
      .moveTo(left, footerY)
      .lineTo(left + width, footerY)
      .lineWidth(1)
      .strokeColor(GOLD)
      .stroke();

    doc.font("Helvetica").fontSize(8).fillColor(MUTED);
    doc.text(siteConfig.name, left, footerY + 6, { width, align: "center", lineBreak: false });
    doc.text(`${siteConfig.address} · ${siteConfig.email} · ${siteConfig.phoneDisplay}`, {
      width,
      align: "center",
      lineBreak: false,
    });
    doc.text(`Page ${pageNum} of ${range.count}`, { width, align: "center", lineBreak: false });
  }
}

export async function generateBookingPdf(
  data: BookingInput,
  ref = createBookingRef(),
): Promise<Buffer> {
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 80, left: 50, right: 50 },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(22).fillColor(GOLD).text("Rise Africa ", {
      continued: true,
      lineBreak: false,
    });
    doc.fillColor(GOLD_DARK).font("Helvetica").text("Safaris");

    doc.font("Helvetica").fontSize(9).fillColor(MUTED);
    doc.text(siteConfig.address);
    doc.text(siteConfig.email);
    doc.text(siteConfig.phoneDisplay);
    doc.moveDown(0.5);

    drawSeparator(doc);

    doc.font("Helvetica-Bold").fontSize(18).fillColor(INK).text("Booking Enquiry");
    doc.font("Helvetica").fontSize(9).fillColor(MUTED);
    doc.text(`Received: ${dateStr}`);
    doc.text(`Reference: ${ref}`);
    doc.moveDown(0.3);

    sectionTitle(doc, "Customer Details");
    fieldRow(doc, "Full Name", data.name);
    fieldRow(doc, "Email", data.email);
    if (data.phone) fieldRow(doc, "Phone", data.phone);

    sectionTitle(doc, "Booking Details");
    fieldRow(doc, "Tour / Interest", data.tour || "To be discussed");
    fieldRow(doc, "Preferred Dates", data.dates || "Flexible");
    fieldRow(doc, "Guests", data.guests || "—");

    if (data.message) {
      sectionTitle(doc, "Message");
      doc.font("Helvetica").fontSize(10).fillColor(INK).text(data.message, {
        width: contentWidth(doc),
      });
    }

    addFooters(doc);
    doc.end();
  });

  if (buffer.length < 4 || buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
    throw new Error("PDF generation produced invalid output (missing %PDF header)");
  }

  return buffer;
}

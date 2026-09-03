import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/siteConfig";
import type { BookingInput } from "@/lib/bookingSchema";
import { buildWhatsappUrl } from "@/lib/templates";

const GOLD = "#1b4332";
const GOLD_DARK = "#2d6a4f";
const INK = "#1a1a1a";

let _logoSvg: string | null = null;
function logoSvg(): string {
  if (!_logoSvg) {
    try {
      _logoSvg = fs.readFileSync(
        path.join(process.cwd(), "public", "images", "logo.jpg"),
        "base64",
      );
    } catch {
      _logoSvg = "";
    }
  }
  return _logoSvg;
}

const LOGO_HTML = `<img src="data:image/jpeg;base64,${logoSvg()}" alt="${siteConfig.name}" style="height:48px;display:block;" />`;

function esc(s = ""): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;color:#6b6b66;font-size:13px;width:140px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;color:${INK};font-size:14px;font-weight:600;">${esc(value)}</td>
  </tr>`;
}

type EmailTemplateOptions = {
  pdfAttached?: boolean;
};

export function internalLeadEmail(data: BookingInput, options?: EmailTemplateOptions) {
  const pdfAttached = options?.pdfAttached ?? false;
  const subject = data.tour
    ? `New booking enquiry: ${data.tour}`
    : `New safari booking enquiry`;

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:${INK};margin:0;padding:0;background:#fcfbf8;">
    <table role="presentation" width="100%" style="background:#fcfbf8;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #ece6d6;border-radius:16px;overflow:hidden;">
          <tr><td style="background:${GOLD};height:6px;"></td></tr>
          <tr><td style="padding:32px 32px 8px;">
            <table role="presentation" width="100%">
              <tr><td>${LOGO_HTML}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 32px;">
            <h2 style="margin:0 0 4px;font-size:20px;">New booking enquiry</h2>
            <p style="margin:0 0 16px;color:#6b6b66;font-size:13px;">Received via the ${esc(siteConfig.name)} website.</p>
            <table style="border-collapse:collapse;width:100%;">
              ${row("Name", data.name)}
              ${row("Email", data.email)}
              ${row("Phone", data.phone || undefined)}
              ${row("Tour", data.tour || undefined)}
              ${row("Preferred dates", data.dates || undefined)}
              ${row("Guests", data.guests || undefined)}
            </table>
            ${
              data.message
                ? `<p style="margin:18px 0 4px;color:#6b6b66;font-size:13px;">Message</p>
                   <p style="margin:0;white-space:pre-wrap;font-size:14px;">${esc(data.message)}</p>`
                : ""
            }
            <p style="margin-top:24px;font-size:13px;color:#6b6b66;">${
              pdfAttached
                ? `A PDF summary is attached. Reply directly to this email to respond to ${esc(data.name)}.`
                : `Reply directly to this email to respond to ${esc(data.name)}.`
            }</p>
          </td></tr>
          <tr><td style="padding:24px 32px 32px;border-top:1px solid #ece6d6;">
            <p style="margin:0;font-size:13px;color:#6b6b66;">${esc(siteConfig.name)} · ${esc(siteConfig.address)} · <a href="mailto:${siteConfig.email}" style="color:${GOLD_DARK};">${esc(siteConfig.email)}</a></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = [
    `New booking enquiry (${siteConfig.name})`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.tour ? `Tour: ${data.tour}` : null,
    data.dates ? `Preferred dates: ${data.dates}` : null,
    data.guests ? `Guests: ${data.guests}` : null,
    data.message ? `\nMessage:\n${data.message}` : null,
    pdfAttached ? `A PDF summary is attached.` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export function guestConfirmationEmail(data: BookingInput, options?: EmailTemplateOptions) {
  const pdfAttached = options?.pdfAttached ?? false;
  const subject = `We've received your enquiry — ${siteConfig.name}`;
  const wa = buildWhatsappUrl({
    tourName: data.tour || undefined,
    name: data.name,
    dates: data.dates,
    guests: data.guests,
  });

  const html = `<!doctype html><html><body style="margin:0;background:#fcfbf8;font-family:Arial,Helvetica,sans-serif;color:${INK};">
    <table role="presentation" width="100%" style="background:#fcfbf8;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #ece6d6;border-radius:16px;overflow:hidden;">
          <tr><td style="background:${GOLD};height:6px;"></td></tr>
          <tr><td style="padding:32px 32px 8px;">
            <table role="presentation" width="100%">
              <tr><td>${LOGO_HTML}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:8px 32px 0;">
            <h2 style="margin:0 0 8px;font-size:20px;">Thank you, ${esc(data.name)}</h2>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4a46;">
              We've received your enquiry and one of our safari specialists will be in touch
              shortly — usually within a few hours. Here's what you sent us:
            </p>
            <table style="border-collapse:collapse;width:100%;background:#f4f1ea;border-radius:12px;">
              <tr><td style="padding:16px 18px;">
                <table style="border-collapse:collapse;width:100%;">
                  ${row("Tour", data.tour || "To be discussed")}
                  ${row("Preferred dates", data.dates || "Flexible")}
                  ${row("Guests", data.guests || "—")}
                </table>
              </td></tr>
            </table>
            <p style="margin:20px 0 8px;font-size:15px;line-height:1.6;color:#4a4a46;">
              Prefer to chat now? Message us on WhatsApp and we'll reply right away:
            </p>
            <p style="margin:0 0 8px;">
              <a href="${wa}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">Chat on WhatsApp</a>
            </p>
            ${
              pdfAttached
                ? `<p style="margin:18px 0 8px;font-size:13px;color:#6b6b66;">
              A PDF summary of your enquiry is attached for your records.
            </p>`
                : ""
            }
          </td></tr>
          <tr><td style="padding:24px 32px 32px;border-top:1px solid #ece6d6;">
            <p style="margin:16px 0 4px;font-size:13px;color:#6b6b66;">${esc(siteConfig.name)}</p>
            <p style="margin:0;font-size:13px;color:#6b6b66;">${esc(siteConfig.address)} · <a href="mailto:${siteConfig.email}" style="color:${GOLD_DARK};">${esc(siteConfig.email)}</a></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = [
    `Thank you, ${data.name}!`,
    ``,
    `We've received your enquiry and will be in touch shortly.`,
    ``,
    data.tour ? `Tour: ${data.tour}` : null,
    data.dates ? `Preferred dates: ${data.dates}` : null,
    data.guests ? `Guests: ${data.guests}` : null,
    ``,
    `Prefer to chat now? WhatsApp us: ${wa}`,
    pdfAttached ? `A PDF summary is attached for your records.` : null,
    ``,
    `${siteConfig.name} · ${siteConfig.address} · ${siteConfig.email}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return { subject, html, text };
}

import { readFileSync } from "fs";
import { join } from "path";
import nodemailer from "nodemailer";

type EmailSettings = {
  EmailHost?: string;
  EmailUsername?: string;
  EmailPassword?: string;
  EmailFrom?: string;
  BookingInbox?: string;
  SmtpPort?: number;
  SmtpSecure?: boolean;
};

function loadAppSettingsEmail(): EmailSettings {
  try {
    const raw = readFileSync(join(process.cwd(), "appsettings.json"), "utf8");
    const json = JSON.parse(raw) as { emailSettings?: EmailSettings };
    return json.emailSettings ?? {};
  } catch {
    return {};
  }
}

function mailConfig() {
  const file = loadAppSettingsEmail();
  return {
    host: process.env.SMTP_HOST || file.EmailHost || "",
    user: process.env.SMTP_USER || file.EmailUsername || "",
    pass: process.env.SMTP_PASS || file.EmailPassword || "",
    from: process.env.EMAIL_FROM || file.EmailFrom || "info@rafricasafaris.com",
    inbox: process.env.BOOKING_INBOX || file.BookingInbox || "",
    port: Number(process.env.SMTP_PORT ?? file.SmtpPort ?? 587),
    secure:
      process.env.SMTP_SECURE === "true" ||
      file.SmtpSecure === true,
  };
}

export function getBookingInbox(): string {
  return mailConfig().inbox;
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
  contentDisposition?: "attachment" | "inline";
};

export function formatFromAddress(): string {
  const from = mailConfig().from;
  if (from.includes("<") && from.includes(">")) {
    return from;
  }
  return `"Rise Africa Safaris" <${from}>`;
}

function normalizeAttachments(attachments?: MailAttachment[]) {
  if (!attachments?.length) return undefined;

  return attachments.map((attachment) => {
    const isPdf =
      attachment.contentType === "application/pdf" ||
      attachment.filename.toLowerCase().endsWith(".pdf");

    return {
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType ?? (isPdf ? "application/pdf" : undefined),
      contentDisposition: attachment.contentDisposition ?? "attachment",
    };
  });
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const { host, user, pass, port, secure } = mailConfig();
    if (!host || !user || !pass) {
      throw new Error("Missing SMTP settings in .env.local or appsettings.json");
    }

    _transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: port === 587 && !secure,
      auth: { user, pass },
      pool: true,
      maxConnections: 1,
      maxMessages: Infinity,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });
  }
  return _transporter;
}

export type SendMailOptions = {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: MailAttachment[];
};

export async function sendMail({ to, replyTo, subject, html, text, attachments }: SendMailOptions) {
  const info = await getTransporter().sendMail({
    from: formatFromAddress(),
    to,
    replyTo,
    subject,
    html,
    text,
    attachments: normalizeAttachments(attachments),
  });

  console.log("[mail] Sent:", info.messageId);
  return info;
}

import nodemailer from "nodemailer";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in .env.local`);
  return v;
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
  contentDisposition?: "attachment" | "inline";
};

export function formatFromAddress(): string {
  const from = process.env.EMAIL_FROM ?? "info@rafricasafaris.com";
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
    const port = Number(process.env.SMTP_PORT ?? "587");
    const secure = process.env.SMTP_SECURE === "true";

    _transporter = nodemailer.createTransport({
      host: requireEnv("SMTP_HOST"),
      port,
      secure,
      requireTLS: port === 587 && !secure,
      auth: {
        user: requireEnv("SMTP_USER"),
        pass: requireEnv("SMTP_PASS"),
      },
      pool: true,
      maxConnections: 1,
      maxMessages: Infinity,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
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

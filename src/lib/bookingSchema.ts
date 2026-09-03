import { z } from "zod";

/** Shared validation for the booking-enquiry form (client + server). */
export const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  tour: z.string().max(160).optional().or(z.literal("")),
  dates: z.string().max(120).optional().or(z.literal("")),
  guests: z.string().max(60).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Honeypot: must stay empty. Bots fill it in.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

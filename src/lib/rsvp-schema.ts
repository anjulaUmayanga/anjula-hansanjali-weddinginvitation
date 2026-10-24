import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(60),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email")]).optional(),
  phone: z.union([z.literal(""), z.string().trim().max(30)]).optional(),
  attending: z.enum(["yes", "no"]),
  guestCount: z.coerce.number().int().min(1).max(10),
  message: z.union([z.literal(""), z.string().trim().max(500)]).optional(),
  publicWish: z.boolean(),
  slug: z.string().trim().max(40).nullable().optional(),
  /** Honeypot — must be empty */
  website: z.string().max(0).optional().default(""),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

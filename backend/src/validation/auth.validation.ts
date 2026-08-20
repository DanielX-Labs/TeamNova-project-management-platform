import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
  inviteCode: z.string().trim().length(8).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  // Keep sign-in compatible with accounts created under earlier password rules.
  password: z.string().min(1).max(128),
});

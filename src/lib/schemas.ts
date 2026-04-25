import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8).max(100),
  keepLoggedIn: z.boolean().optional().default(false),
});

export const sendCodeSchema = z.object({
  email: z.email(),
});

export const verifyCodeSchema = z.object({
  code: z.string().length(6),
  password: z.string().min(8).max(100),
});

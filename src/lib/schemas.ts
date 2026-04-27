import { z } from "zod";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

export const scoreInputSchema = z.object({
  userId: z.string().uuid(),
  scoreDate: isoDateSchema,
  stablefordScore: z.number().int().min(1).max(45),
});

export const drawRequestSchema = z.object({
  drawMonth: isoDateSchema,
  mode: z.enum(["random", "weighted"]),
  actorUserId: z.string().uuid(),
});

export const subscriptionEventSchema = z.object({
  userId: z.string().uuid(),
  plan: z.enum(["monthly", "yearly"]),
  status: z.enum(["active", "inactive", "past_due", "canceled"]),
  priceCents: z.number().int().positive(),
  charityPercent: z.number().min(10).max(100),
  currentPeriodEnd: z.string().optional(),
});

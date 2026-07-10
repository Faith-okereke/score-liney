import { z } from "zod";

export const txLineGuestSessionResponseSchema = z.object({
  token: z.string().min(1),
});

export const txLineActivationRequestSchema = z.object({
  txSig: z.string().min(1),
  walletSignature: z.string().min(1),
  leagues: z.array(z.number().int().nonnegative()),
});

export const txLineActivationResponseSchema = z.object({
  token: z.string().min(1),
});

export const txLineAuthStatusSchema = z.object({
  guestSessionActive: z.boolean(),
  apiTokenStored: z.boolean(),
  ready: z.boolean(),
});

export type TxLineActivationRequest = z.infer<
  typeof txLineActivationRequestSchema
>;


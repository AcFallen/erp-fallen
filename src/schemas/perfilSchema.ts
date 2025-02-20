import { z } from "zod";

export const createPerfilSchema = z.object({
  userId: z.string(),
  bio: z.string().min(10),
  avatar: z.any().optional(),
  phone: z.string().min(9),
  address: z.string(),
});

export type PerfilSchema = z.infer<typeof createPerfilSchema>;

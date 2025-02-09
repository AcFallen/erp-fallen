import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "USER"]);

export const createUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: RoleEnum.default("USER"),
});

// Tipo inferido de Zod
export type CreateUserDTO = z.infer<typeof createUserSchema>;

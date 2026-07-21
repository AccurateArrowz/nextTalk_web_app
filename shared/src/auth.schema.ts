import { z } from "zod";

export const userStatusSchema = z.object({
  state: z.enum(["online", "offline", "away"]),
  lastSeenAt: z.string()
});

export const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "platformAdmin"]),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  status: userStatusSchema
});

export const registerUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: authUserSchema,
  accessToken: z.string()
});

export const refreshResponseSchema = authResponseSchema;

export type UserStatus = z.infer<typeof userStatusSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

import { z } from "zod";
import { userStatusSchema } from "./auth.schema.js";

export const userProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "platformAdmin"]),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  focusMode: z.boolean(),
  status: z.object({
    state: z.enum(["online", "offline", "away"]),
    lastSeenAt: z.string()
  })
});

export const publicUserSchema = userProfileSchema.pick({
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  avatarUrl: true
}).extend({
  status: z.object({
    state: z.enum(["online", "offline", "away"])
  })
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().nullable().optional()
});

export const adminUserListItemSchema = userProfileSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string()
});

export const adminUserListResponseSchema = z.object({
  data: z.array(adminUserListItemSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

export const adminCreateUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["user", "platformAdmin"]).optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  status: z.object({
    state: z.enum(["online", "offline", "away"]),
    lastSeenAt: z.coerce.date()
  }).optional()
});

export const adminUpdateUserSchema = adminCreateUserSchema.partial();

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
});

export type PublicUser = z.infer<typeof publicUserSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;
export type AdminUserListResponse = z.infer<typeof adminUserListResponseSchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

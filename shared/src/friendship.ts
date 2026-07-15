import { z } from "zod";
import { presenceStateSchema } from "./conversation.js";

export const friendshipSchema = z.object({
  id: z.string(),
  userId: z.string(),
  friendId: z.string(),
  status: z.enum(["pending", "accepted", "blocked"]),
  requestedBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const friendPublicProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  status: z.object({
    state: presenceStateSchema
  }),
  friendshipId: z.string(),
  friendshipStatus: z.enum(["pending", "accepted", "blocked"]),
  isSender: z.boolean()
});

export type Friendship = z.infer<typeof friendshipSchema>;
export type FriendPublicProfile = z.infer<typeof friendPublicProfileSchema>;


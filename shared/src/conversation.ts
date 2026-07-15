import { z } from "zod";

export const presenceStateSchema = z.enum(["online", "offline", "away"]);

export const conversationParticipantProfileSchema = z.object({
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  status: z.object({
    state: presenceStateSchema
  })
});

export const conversationParticipantSchema = z.object({
  userId: z.string(),
  role: z.enum(["admin", "member"]),
  joinedAt: z.string(),
  visibleFrom: z.string().nullable(),
  profile: conversationParticipantProfileSchema.optional()
});

export const conversationLastMessageSchema = z.object({
  text: z.string().nullable(),
  senderId: z.string().nullable(),
  sentAt: z.string().nullable()
});

export const conversationSchema = z.object({
  id: z.string(),
  type: z.enum(["direct", "group"]),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  allowHistoryForNewMembers: z.boolean(),
  participants: z.array(conversationParticipantSchema),
  lastMessage: conversationLastMessageSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type ConversationPresenceState = z.infer<typeof presenceStateSchema>;
export type ConversationParticipantProfile = z.infer<
  typeof conversationParticipantProfileSchema
>;
export type ConversationParticipant = z.infer<typeof conversationParticipantSchema>;
export type ConversationLastMessage = z.infer<typeof conversationLastMessageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;


import { z } from "zod";

export const messageReadReceiptSchema = z.object({
  userId: z.string(),
  readAt: z.string()
});

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  type: z.enum(["text", "image", "file"]),
  content: z.string(),
  readBy: z.array(messageReadReceiptSchema),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string(),
  type: z.enum(["text", "image", "file"]).optional()
});

export type MessageReadReceipt = z.infer<typeof messageReadReceiptSchema>;
export type Message = z.infer<typeof messageSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;


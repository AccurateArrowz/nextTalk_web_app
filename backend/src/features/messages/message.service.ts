import { MessageModel } from "@features/messages/message.model.js";
import { ConversationModel } from "@features/conversations/conversation.model.js";
import { getSocketServer } from "../../socket.js";
import type { Message, SendMessageInput } from "@features/messages/message.interface.js";

interface MessageDocLike {
  _id: { toString(): string };
  conversationId: { toString(): string };
  senderId: { toString(): string };
  type: Message["type"];
  content: string;
  readBy?: Array<{ userId: { toString(): string }; readAt?: Date }>;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function toDto(doc: MessageDocLike): Message {
  return {
    id: doc._id.toString(),
    conversationId: doc.conversationId.toString(),
    senderId: doc.senderId.toString(),
    type: doc.type,
    content: doc.content,
    readBy: (doc.readBy ?? []).map((r: { userId: { toString(): string }; readAt?: Date }) => ({
      userId: r.userId.toString(),
      readAt: r.readAt?.toISOString() ?? new Date().toISOString()
    })),
    deletedAt: doc.deletedAt ? doc.deletedAt.toISOString() : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

class MessageService {
  /**
   * Send a message to a conversation.
   * Validates that the sender is a participant, then persists the message
   * and updates the conversation's lastMessage summary.
   * Finally, fans the new message out via Socket.IO to all connected room members.
   */
  async sendMessage(senderId: string, input: SendMessageInput): Promise<Message> {
    const conversation = await ConversationModel.findOne({
      _id: input.conversationId,
      "participants.userId": senderId
    });

    if (!conversation) {
      const err = new Error("Conversation not found or you are not a member");
      (err as any).statusCode = 404;
      throw err;
    }

    const message = await MessageModel.create({
      conversationId: input.conversationId,
      senderId,
      type: input.type ?? "text",
      content: input.content,
      readBy: [{ userId: senderId, readAt: new Date() }] // sender has read their own message
    });

    // Update the conversation's lastMessage cache
    conversation.lastMessage = {
      text: input.type === "text" ? input.content : `[${input.type}]`,
      senderId: message.senderId,
      sentAt: message.createdAt
    };
    await conversation.save();

    const dto = toDto(message);

    // Real-time fan-out via Socket.IO
    try {
      const io = getSocketServer();
      io.to(`conversation:${input.conversationId}`).emit("message:new", dto);
    } catch {
      // Socket server may not be initialised in test environments — safe to ignore
    }

    return dto;
  }

  /** Mark a message as read by the given user. */
  async markAsRead(userId: string, messageId: string): Promise<void> {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      const err = new Error("Message not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const readBy = (message.readBy ?? []) as Array<{ userId: { toString(): string } }>;
    const alreadyRead = readBy.some((r) => r.userId.toString() === userId);
    if (!alreadyRead) {
      message.readBy.push({ userId: userId as any, readAt: new Date() });
      await message.save();

      // Notify room that this user has read the message
      try {
        const io = getSocketServer();
        io.to(`conversation:${message.conversationId.toString()}`).emit("message:read", {
          messageId,
          userId,
          readAt: new Date().toISOString()
        });
      } catch {
        // safe to ignore in test environments
      }
    }
  }
}

export const messageService = new MessageService();

import { MessageModel } from "@features/messages/message.model.js";
import { ConversationModel } from "@features/conversations/conversation.model.js";
import { friendshipService } from "@features/friendships/friendship.service.js";
import { userRepository } from "@features/users/user.repository.js";
import { getSocketServer } from "../../socket.js";
import type { Message, SendMessageInput } from "@features/messages/message.types.js";


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

    if (conversation.type === "direct") {
      const recipient = conversation.participants.find(
        (participant: any) => participant.userId.toString() !== senderId
      );

      if (recipient) {
        const recipientUser = await userRepository.findById(recipient.userId.toString());
        const allowsNonFriends = recipientUser?.allowMessageFromNonFriends ?? true;

        if (!allowsNonFriends) {
          const areFriends = await friendshipService.areFriends(senderId, recipient.userId.toString());
          if (!areFriends) {
            const err = new Error("This user does not accept messages from non-friends");
            (err as any).statusCode = 403;
            throw err;
          }
        }
      }
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

    // Real-time fan-out via Socket.IO
    try {
      const io = getSocketServer();
      io.to(`conversation:${input.conversationId}`).emit("message:new", message);
    } catch {
      // Socket server may not be initialised in test environments — safe to ignore
    }

    return message;
  }

  /** Mark a message as read by the given user. */
  async markAsRead(userId: string, messageId: string): Promise<void> {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      const err = new Error("Message not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const conversation = await ConversationModel.findOne({
      _id: message.conversationId,
      "participants.userId": userId
    });

    if (!conversation) {
      const err = new Error("Conversation not found or you are not a member");
      (err as any).statusCode = 404;
      throw err;
    }

    const participant = conversation.participants.find(
      (p: any) => p.userId.toString() === userId
    );

    if (participant?.visibleFrom && message.createdAt < participant.visibleFrom) {
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

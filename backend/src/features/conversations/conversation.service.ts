import { ConversationModel } from "@features/conversations/conversation.model.js";
import { MessageModel } from "@features/messages/message.model.js";
import { userRepository } from "@features/users/user.repository.js";
import type { Types } from "mongoose";
import type {
  Conversation,
  ConversationParticipant
} from "@features/conversations/conversation.interface.js";
import type { Message } from "@features/messages/message.interface.js";

interface ConversationParticipantDoc {
  userId: Types.ObjectId | string;
  role: "admin" | "member";
  joinedAt?: Date;
  visibleFrom?: Date | null;
}

interface ConversationLastMessageDoc {
  text?: string | null;
  senderId?: Types.ObjectId | string | null;
  sentAt?: Date | null;
}

interface ConversationDocLike {
  _id: Types.ObjectId | string;
  type?: Conversation["type"];
  name?: string | null;
  avatarUrl?: string | null;
  allowHistoryForNewMembers?: boolean;
  participants?: ConversationParticipantDoc[];
  lastMessage?: ConversationLastMessageDoc | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageReadByDoc {
  userId: Types.ObjectId | string;
  readAt?: Date;
}

interface MessageDocLike {
  _id: Types.ObjectId | string;
  conversationId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  type: Message["type"];
  content: string;
  readBy?: MessageReadByDoc[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toConversationDto(doc: any): Conversation {
  return {
    id: doc._id.toString(),
    type: doc.type ?? "direct",
    name: doc.name ?? null,
    avatarUrl: doc.avatarUrl ?? null,
    allowHistoryForNewMembers: doc.allowHistoryForNewMembers ?? false,
    participants: (doc.participants ?? []).map((p: any) => ({
      userId: p.userId.toString(),
      role: p.role,
      joinedAt: p.joinedAt?.toISOString() ?? new Date().toISOString(),
      visibleFrom: p.visibleFrom ? p.visibleFrom.toISOString() : null
    })),
    lastMessage: doc.lastMessage?.sentAt
      ? {
          text: doc.lastMessage.text ?? null,
          senderId: doc.lastMessage.senderId?.toString() ?? null,
          sentAt: doc.lastMessage.sentAt.toISOString()
        }
      : null,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString()
  };
}

function toMessageDto(doc: any): Message {
  return {
    id: doc._id.toString(),
    conversationId: doc.conversationId.toString(),
    senderId: doc.senderId.toString(),
    type: doc.type,
    content: doc.content,
    readBy: (doc.readBy ?? []).map((r: any) => ({
      userId: r.userId.toString(),
      readAt: r.readAt?.toISOString() ?? new Date().toISOString()
    })),
    deletedAt: doc.deletedAt ? doc.deletedAt.toISOString() : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

class ConversationService {
  /**
   * Create a group conversation.
   * The creator is automatically assigned the "admin" role.
   * All participantIds become members.
   */
  async createGroup(
    creatorId: string,
    input: { name: string; participantIds: string[] }
  ): Promise<Conversation> {
    const uniqueIds = [...new Set([...input.participantIds, creatorId])];

    if (uniqueIds.length < 2) {
      const err = new Error("A group conversation needs at least 2 participants");
      (err as any).statusCode = 400;
      throw err;
    }

    const participants = uniqueIds.map((id) => ({
      userId: id,
      role: id === creatorId ? ("admin" as const) : ("member" as const),
      joinedAt: new Date(),
      visibleFrom: null // all founding members see full history
    }));

    const conversation = await ConversationModel.create({
      type: "group",
      name: input.name,
      participants,
      allowHistoryForNewMembers: false
    });

    return toConversationDto(conversation);
  }

  /**
   * Get or create a direct (1-on-1) conversation between two users.
   * Uses the directKey unique index for idempotency.
   */
  async getOrCreateDirect(userId: string, targetUserId: string): Promise<Conversation> {
    if (userId === targetUserId) {
      const err = new Error("Cannot create a conversation with yourself");
      (err as any).statusCode = 400;
      throw err;
    }

    const target = await userRepository.findById(targetUserId);
    if (!target) {
      const err = new Error("Target user not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const ids = [userId, targetUserId].sort();
    const directKey = ids.join("_");

    let conversation = await ConversationModel.findOne({ directKey });

    if (!conversation) {
      conversation = await ConversationModel.create({
        type: "direct",
        participants: [
          { userId, role: "member", joinedAt: new Date(), visibleFrom: null },
          { userId: targetUserId, role: "member", joinedAt: new Date(), visibleFrom: null }
        ],
        directKey
      });
    }

    return toConversationDto(conversation);
  }

  /** Return all conversations the user is a participant in, newest first. */
  async listForUser(userId: string): Promise<Conversation[]> {
    const conversations = await ConversationModel.find({
      "participants.userId": userId
    }).sort({ updatedAt: -1 });

    return conversations.map(toConversationDto);
  }

  /** Get a single conversation by ID (must be a participant). */
  async getById(userId: string, conversationId: string): Promise<Conversation> {
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      "participants.userId": userId
    });

    if (!conversation) {
      const err = new Error("Conversation not found");
      (err as any).statusCode = 404;
      throw err;
    }

    return toConversationDto(conversation);
  }

  /**
   * Admin invites a new participant to a group conversation.
   * If allowHistoryForNewMembers is false, the new member's visibleFrom is set to now.
   * If allowHistoryForNewMembers is true, visibleFrom stays null (full history visible).
   */
  async inviteParticipant(
    adminId: string,
    conversationId: string,
    targetUserId: string
  ): Promise<Conversation> {
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation || conversation.type !== "group") {
      const err = new Error("Group conversation not found");
      (err as any).statusCode = 404;
      throw err;
    }

    this.assertAdmin(adminId, conversation);

    const alreadyMember = conversation.participants.some(
      (p: any) => p.userId.toString() === targetUserId
    );
    if (alreadyMember) {
      const err = new Error("User is already a member of this conversation");
      (err as any).statusCode = 409;
      throw err;
    }

    const target = await userRepository.findById(targetUserId);
    if (!target) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const visibleFrom = conversation.allowHistoryForNewMembers ? null : new Date();

    conversation.participants.push({
      userId: targetUserId as unknown as Types.ObjectId,
      role: "member",
      joinedAt: new Date(),
      visibleFrom
    });

    await conversation.save();
    return toConversationDto(conversation);
  }

  /**
   * Admin removes a participant from a group conversation.
   * An admin cannot remove themselves (must transfer admin first — not in scope).
   */
  async removeParticipant(
    adminId: string,
    conversationId: string,
    targetUserId: string
  ): Promise<Conversation> {
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation || conversation.type !== "group") {
      const err = new Error("Group conversation not found");
      (err as any).statusCode = 404;
      throw err;
    }

    this.assertAdmin(adminId, conversation);

    if (adminId === targetUserId) {
      const err = new Error("Admin cannot remove themselves from the group");
      (err as any).statusCode = 400;
      throw err;
    }

    const initialLength = conversation.participants.length;
    conversation.participants = conversation.participants.filter(
      (p: any) => p.userId.toString() !== targetUserId
    );

    if (conversation.participants.length === initialLength) {
      const err = new Error("User is not a member of this conversation");
      (err as any).statusCode = 404;
      throw err;
    }

    await conversation.save();
    return toConversationDto(conversation);
  }

  /**
   * Admin toggles whether new joiners can see full history.
   * When set to true: retroactively clears visibleFrom for all existing restricted members.
   * When set to false: only affects future joins.
   */
  async toggleHistoryAccess(
    adminId: string,
    conversationId: string,
    allow: boolean
  ): Promise<Conversation> {
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation || conversation.type !== "group") {
      const err = new Error("Group conversation not found");
      (err as any).statusCode = 404;
      throw err;
    }

    this.assertAdmin(adminId, conversation);

    conversation.allowHistoryForNewMembers = allow;

    // Retroactive unlock: clear visibleFrom for all existing restricted members
    if (allow) {
      for (const participant of conversation.participants) {
        participant.visibleFrom = null;
      }
    }

    await conversation.save();
    return toConversationDto(conversation);
  }

  /**
   * Fetch paginated messages for a conversation.
   * Respects each participant's visibleFrom cutoff.
   * Cursor-based pagination using the message _id (before a given id).
   */
  async getMessages(
    userId: string,
    conversationId: string,
    options: { before?: string; limit?: number }
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      "participants.userId": userId
    });

    if (!conversation) {
      const err = new Error("Conversation not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const participant = conversation.participants.find((p: any) => p.userId.toString() === userId);

    const limit = Math.min(options.limit ?? 50, 100);

    const query: Record<string, any> = {
      conversationId,
      deletedAt: null
    };

    // Respect participant's message history visibility cutoff
    if (participant?.visibleFrom) {
      query.createdAt = { $gte: participant.visibleFrom };
    }

    // Cursor pagination: fetch messages older than `before` id
    if (options.before) {
      const cursorDoc = await MessageModel.findById(options.before);
      if (cursorDoc) {
        query._id = { $lt: cursorDoc._id };
      }
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 }) // newest first
      .limit(limit + 1);       // +1 to determine hasMore

    const hasMore = messages.length > limit;
    const page = messages.slice(0, limit);

    return {
      messages: page.map(toMessageDto),
      hasMore
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private assertAdmin(userId: string, conversation: any): void {
    const participant = conversation.participants.find(
      (p: any) => p.userId.toString() === userId
    );

    if (!participant) {
      const err = new Error("You are not a member of this conversation");
      (err as any).statusCode = 403;
      throw err;
    }

    if (participant.role !== "admin") {
      const err = new Error("Only admins can perform this action");
      (err as any).statusCode = 403;
      throw err;
    }
  }
}

export const conversationService = new ConversationService();

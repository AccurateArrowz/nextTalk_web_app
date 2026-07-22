
import type { Document, Types } from "mongoose";
import { conversationSchema } from "@nexttalk/shared";

export type presenceStateSchema = "online" | "offline" | "away";


export interface ConversationLastMessage {
  text: string | null;
  senderId: string | null;
  sentAt: string | null;
};

export interface IConversationParticipant {
  userId: Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
  visibleFrom: Date | null;
}


export interface IConversation {
  _id: Types.ObjectId;
  type: "direct" | "group";
  name?: string | null;
  avatarUrl?: string | null;
  participants: IConversationParticipant[];
  directKey?: string | null;
  allowHistoryForNewMembers: boolean;
  lastMessage?: (Omit<ConversationLastMessage, "senderId" | "sentAt"> & {
    senderId: Types.ObjectId | null;
    sentAt: Date | null;
  }) | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDocument extends IConversation, Document {}

import type { Document, Types } from "mongoose";
import { conversationSchema } from "@nexttalk/shared";

export type ConversationParticipant = {
  userId: string;
  role: "admin" | "member";
  joinedAt: string;
  visibleFrom: string | null;
  profile?: {
    username: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    status: { state: "online" | "offline" | "away" };
  };
};

export type ConversationLastMessage = {
  text: string | null;
  senderId: string | null;
  sentAt: string | null;
};

export type Conversation = {
  id: string;
  type: "direct" | "group";
  name: string | null;
  avatarUrl: string | null;
  allowHistoryForNewMembers: boolean;
  participants: ConversationParticipant[];
  lastMessage: ConversationLastMessage | null;
  createdAt: string;
  updatedAt: string;
};

export interface IConversationParticipant {
  userId: Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
  visibleFrom: Date | null;
}

// export interface IConversation {
//   _id: Types.ObjectId;
//   type: "direct" | "group";
//   name?: string | null;
//   avatarUrl?: string | null;
//   participants: IConversationParticipant[];
//   directKey?: string | null;
//   allowHistoryForNewMembers: boolean;
//   lastMessage?: (Omit<ConversationLastMessage, "senderId" | "sentAt"> & {
//     senderId: Types.ObjectId | null;
//     sentAt: Date | null;
//   }) | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

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

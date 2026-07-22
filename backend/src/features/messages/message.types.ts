import type { Document, Types } from "mongoose";

export type MessageReadReceipt = {
  userId: string;
  readAt: string;
};

export type SendMessageInput = {
  conversationId: string;
  content: string;
  type?: "text" | "image" | "file";
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  type: "text" | "image" | "file";
  content: string;
  readBy: MessageReadReceipt[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface IReadBy {
  userId: Types.ObjectId;
  readAt: Date;
}

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: "text" | "image" | "file";
  content: string;
  readBy: IReadBy[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends IMessage, Document {}

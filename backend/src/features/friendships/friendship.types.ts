import type { Document, Types } from "mongoose";

export type Friendship = {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "blocked";
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type FriendPublicProfile = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  status: { state: "online" | "offline" | "away" };
  friendshipId: string;
  friendshipStatus: "pending" | "accepted" | "blocked";
  isSender: boolean;
};

export interface IFriendship {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
  status: "pending" | "accepted" | "blocked";
  requestedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendshipDocument extends IFriendship, Document {}

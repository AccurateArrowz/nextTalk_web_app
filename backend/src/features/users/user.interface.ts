import type { Document, Types } from "mongoose";
import type { UserStatus } from "@nexttalk/shared";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "user" | "platformAdmin";
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  status: UserStatus & { lastSeenAt: Date };
  focusMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends IUser, Document {}


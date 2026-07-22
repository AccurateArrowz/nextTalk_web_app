import type { Document, Types } from "mongoose";

type UserRole = "user" | "platformAdmin";

type UserStatus = {
  state: "online"| "offline"| "away",
  lastSeenAt: Date
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole ;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  status: UserStatus ;
  focusMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PrivateFields = 'password' | 'createdAt' | "updatedAt" | 'focusMode';
export type PublicUser = Omit<IUser, PrivateFields >

export type UpdateUserProfileSchema = {
  [K in keyof PublicUser]?: PublicUser[K]
}

export interface UserDocument extends IUser, Document {}


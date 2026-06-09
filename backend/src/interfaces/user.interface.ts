import type { Document, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends IUser, Document {}

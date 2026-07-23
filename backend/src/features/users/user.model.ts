import { Schema, model } from "mongoose";
import type { UserDocument } from "@features/users/user.types.js";

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "platformAdmin"],
      default: "user",
    },
    firstName: { type: String, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    avatarUrl: { type: String, default: null },
    status: {
      state: { type: String, enum: ["online", "offline", "away"], default: "offline" },
      lastSeenAt: { type: Date, default: Date.now },
    },
    focusMode: { type: Boolean, default: false },
    allowMessageFromNonFriends: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);

import { Schema, model } from "mongoose";
import type { UserDocument } from "@interfaces/user.interface.js";

const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<UserDocument>("User", userSchema);

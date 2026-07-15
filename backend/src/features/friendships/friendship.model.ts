import { Schema, model } from "mongoose";

const friendshipSchema = new Schema<any>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      required: true,
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// "Get all my friends/requests" is a single indexed query
friendshipSchema.index({ userId: 1, status: 1 });

// Prevent duplicate rows for the same pair
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const FriendshipModel = model<any>("Friendship", friendshipSchema);

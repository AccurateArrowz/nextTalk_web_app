import { Schema, model } from "mongoose";

const messageSchema = new Schema<any>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    content: { type: String, required: true, maxlength: 5000 }, // text body, or file/image URL

    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],

    deletedAt: { type: Date, default: null }, // soft delete
  },
  { timestamps: true }
);

// Paginating a conversation's message history in reverse-chronological order
messageSchema.index({ conversationId: 1, createdAt: -1 });

export const MessageModel = model<any>("Message", messageSchema);

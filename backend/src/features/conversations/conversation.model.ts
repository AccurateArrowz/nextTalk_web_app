import { Schema, model } from "mongoose";

const conversationSchema = new Schema<any>(
  {
    type: { type: String, enum: ["direct", "group"], required: true },

    // group-only fields
    name: { type: String, default: null },
    avatarUrl: { type: String, default: null },

    participants: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          role: { type: String, enum: ["admin", "member"], default: "member" },
          joinedAt: { type: Date, default: Date.now },
          /** null = full history visible; Date = only see messages after this timestamp */
          visibleFrom: { type: Date, default: null },
        },
      ],
      validate: {
        validator: function (
          this: { type: "direct" | "group" },
          participants: Array<{ userId: { toString(): string } }>
        ) {
          const ids = participants.map((p: { userId: { toString(): string } }) => p.userId.toString());
          const hasDuplicates = new Set(ids).size !== ids.length;
          if (hasDuplicates) return false;
          if (this.type === "direct" && ids.length !== 2) return false;
          if (this.type === "group" && ids.length < 2) return false;
          return true;
        },
        message: "Invalid participants for this conversation type (duplicates, or wrong count for direct/group).",
      },
    },

    // direct-only field, e.g. "64f1a2_64f1b7" (sorted userIds joined)
    directKey: { type: String, default: null },

    /** Group-only: allows new joiners to see full history; retroactive when toggled on */
    allowHistoryForNewMembers: { type: Boolean, default: false },

    lastMessage: {
      text: { type: String, default: null },
      senderId: { type: Schema.Types.ObjectId, ref: "User", default: null },
      sentAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

conversationSchema.pre("validate", function (next) {
  const participants = (this as any).participants as Array<{ userId: { toString(): string } }>;
  if ((this as any).type === "direct" && participants?.length === 2) {
    const ids = participants.map((p) => p.userId.toString()).sort();
    (this as any).directKey = ids.join("_");
  }
  next();
});

// Find "all conversations for user X" fast
conversationSchema.index({ "participants.userId": 1 });

// One DM thread per user pair (partial index: only applies to type "direct")
conversationSchema.index(
  { directKey: 1 },
  { unique: true, partialFilterExpression: { type: "direct" } }
);

// Sort inbox by most recent activity
conversationSchema.index({ updatedAt: -1 });

export const ConversationModel = model<any>("Conversation", conversationSchema);

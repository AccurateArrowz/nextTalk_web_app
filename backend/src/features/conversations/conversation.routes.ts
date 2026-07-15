import { Router } from "express";
import { requireAuth } from "@middleware/require-auth.js";
import {
  createConversation,
  getConversation,
  getMessages,
  inviteParticipant,
  listConversations,
  removeParticipant,
  updateConversationSettings
} from "@features/conversations/conversation.controller.js";
import { markMessageRead, sendMessage } from "@features/messages/message.controller.js";

export const conversationRouter = Router();

// All conversation routes require authentication
conversationRouter.use(requireAuth);

// Conversation CRUD
conversationRouter.post("/", createConversation);           // Create group or get/create DM
conversationRouter.get("/", listConversations);              // List user's conversations
conversationRouter.get("/:id", getConversation);             // Get a single conversation

// Participant management (admin only — enforced in service layer)
conversationRouter.post("/:id/participants", inviteParticipant);             // Invite user
conversationRouter.delete("/:id/participants/:userId", removeParticipant);    // Remove user

// Conversation settings (admin only)
conversationRouter.patch("/:id/settings", updateConversationSettings);        // Toggle history

// Messages (nested under conversation for clean ownership)
conversationRouter.get("/:id/messages", getMessages);                        // Paginated history
conversationRouter.post("/:id/messages", sendMessage);                       // Send message
conversationRouter.patch("/:id/messages/:messageId/read", markMessageRead);  // Mark as read

import { Router } from "express";
import { requireAuth } from "@middleware/require-auth.js";
import {
  blockUser,
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
  removeFriend,
  respondToFriendRequest,
  sendFriendRequest
} from "@features/friendships/friendship.controller.js";

export const friendshipRouter = Router();

// All friendship routes require auth
friendshipRouter.use(requireAuth);

friendshipRouter.post("/request", sendFriendRequest);          // Send request
friendshipRouter.patch("/request/:id", respondToFriendRequest); // Accept / decline

friendshipRouter.get("/", listFriends);                         // Accepted friends
friendshipRouter.get("/requests/incoming", listIncomingRequests);// Incoming pending
friendshipRouter.get("/requests/outgoing", listOutgoingRequests);// Outgoing pending

friendshipRouter.delete("/:friendId", removeFriend);            // Unfriend
friendshipRouter.post("/block", blockUser);                     // Block a user

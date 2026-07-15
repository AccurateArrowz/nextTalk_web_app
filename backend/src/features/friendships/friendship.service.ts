import { FriendshipModel } from "@features/friendships/friendship.model.js";
import { userRepository } from "@features/users/user.repository.js";
import type { Types } from "mongoose";
import type {
  FriendPublicProfile,
  Friendship
} from "@features/friendships/friendship.interface.js";

class FriendshipService {
  private toDto(doc: any): Friendship {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      friendId: doc.friendId.toString(),
      status: doc.status,
      requestedBy: doc.requestedBy.toString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  }

  /** Send a friend request from senderId → recipientId */
  async sendRequest(senderId: string, recipientId: string): Promise<Friendship> {
    if (senderId === recipientId) {
      const err = new Error("Cannot send a friend request to yourself");
      (err as any).statusCode = 400;
      throw err;
    }

    const recipient = await userRepository.findById(recipientId);
    if (!recipient) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    // Check if a friendship already exists in either direction
    const existing = await FriendshipModel.findOne({
      $or: [
        { userId: senderId, friendId: recipientId },
        { userId: recipientId, friendId: senderId }
      ]
    });

    if (existing) {
      if (existing.status === "blocked") {
        const err = new Error("Cannot send friend request to this user");
        (err as any).statusCode = 403;
        throw err;
      }
      if (existing.status === "accepted") {
        const err = new Error("Already friends");
        (err as any).statusCode = 409;
        throw err;
      }
      if (existing.status === "pending") {
        const err = new Error("Friend request already pending");
        (err as any).statusCode = 409;
        throw err;
      }
    }

    const friendship = await FriendshipModel.create({
      userId: senderId,
      friendId: recipientId,
      status: "pending",
      requestedBy: senderId
    });

    return this.toDto(friendship);
  }

  /**
   * Accept or decline a pending incoming friend request.
   * Only the recipient (the non-sender side) may respond.
   */
  async respondToRequest(
    userId: string,
    friendshipId: string,
    action: "accept" | "decline"
  ): Promise<Friendship> {
    const friendship = await FriendshipModel.findById(friendshipId);

    if (!friendship) {
      const err = new Error("Friend request not found");
      (err as any).statusCode = 404;
      throw err;
    }

    if (friendship.status !== "pending") {
      const err = new Error("Request is no longer pending");
      (err as any).statusCode = 409;
      throw err;
    }

    // Only the recipient (friendId when sender is userId, or userId when sender is friendId)
    const recipientId =
      friendship.requestedBy.toString() === friendship.userId.toString()
        ? friendship.friendId.toString()
        : friendship.userId.toString();

    if (recipientId !== userId) {
      const err = new Error("Not authorised to respond to this request");
      (err as any).statusCode = 403;
      throw err;
    }

    if (action === "accept") {
      friendship.status = "accepted";
      await friendship.save();
      return this.toDto(friendship);
    }

    // decline → delete the record
    await FriendshipModel.findByIdAndDelete(friendshipId);
    return this.toDto(friendship); // return the old state for confirmation
  }

  /** List accepted friends for a user, hydrated with public profile info */
  async listFriends(userId: string): Promise<FriendPublicProfile[]> {
    const friendships = await FriendshipModel.find({
      $or: [{ userId }, { friendId: userId }],
      status: "accepted"
    });

    const results: FriendPublicProfile[] = [];

    for (const f of friendships) {
      const otherId =
        f.userId.toString() === userId ? f.friendId.toString() : f.userId.toString();
      const user = await userRepository
        .findById(otherId)
        .select("username firstName lastName avatarUrl status");
      if (!user) continue;

      results.push({
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: { state: user.status?.state ?? "offline" },
        friendshipId: f._id.toString(),
        friendshipStatus: f.status as "accepted",
        isSender: f.requestedBy.toString() === userId
      });
    }

    return results;
  }

  /**
   * List incoming pending requests (requests sent TO this user)
   * with the sender's public profile.
   */
  async listIncomingRequests(userId: string): Promise<FriendPublicProfile[]> {
    const friendships = await FriendshipModel.find({
      friendId: userId,
      status: "pending",
      requestedBy: { $ne: userId }
    });

    const results: FriendPublicProfile[] = [];

    for (const f of friendships) {
      const senderId = f.requestedBy.toString();
      const user = await userRepository
        .findById(senderId)
        .select("username firstName lastName avatarUrl status");
      if (!user) continue;

      results.push({
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: { state: user.status?.state ?? "offline" },
        friendshipId: f._id.toString(),
        friendshipStatus: "pending",
        isSender: false
      });
    }

    return results;
  }

  /** List outgoing pending requests (requests sent BY this user) */
  async listOutgoingRequests(userId: string): Promise<FriendPublicProfile[]> {
    const friendships = await FriendshipModel.find({
      requestedBy: userId,
      status: "pending"
    });

    const results: FriendPublicProfile[] = [];

    for (const f of friendships) {
      const otherId =
        f.userId.toString() === userId ? f.friendId.toString() : f.userId.toString();
      const user = await userRepository
        .findById(otherId)
        .select("username firstName lastName avatarUrl status");
      if (!user) continue;

      results.push({
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: { state: user.status?.state ?? "offline" },
        friendshipId: f._id.toString(),
        friendshipStatus: "pending",
        isSender: true
      });
    }

    return results;
  }

  /** Remove an accepted friend (either party can unfriend) */
  async removeFriend(userId: string, friendId: string): Promise<void> {
    const result = await FriendshipModel.findOneAndDelete({
      $or: [
        { userId, friendId, status: "accepted" },
        { userId: friendId, friendId: userId, status: "accepted" }
      ]
    });

    if (!result) {
      const err = new Error("Friendship not found");
      (err as any).statusCode = 404;
      throw err;
    }
  }

  /** Block a user. Creates or updates the friendship record to "blocked". */
  async blockUser(userId: string, targetId: string): Promise<void> {
    await FriendshipModel.findOneAndUpdate(
      {
        $or: [
          { userId, friendId: targetId },
          { userId: targetId, friendId: userId }
        ]
      },
      {
        userId,
        friendId: targetId,
        status: "blocked",
        requestedBy: userId
      },
      { upsert: true, new: true }
    );
  }
}

export const friendshipService = new FriendshipService();

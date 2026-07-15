import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { friendshipService } from "@features/friendships/friendship.service.js";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** POST /friends/request — { recipientId } */
export async function sendFriendRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { recipientId } = req.body as { recipientId?: string };
    if (!recipientId) {
      res.status(400).json({ message: "recipientId is required" });
      return;
    }
    const friendship = await friendshipService.sendRequest(
      req.authUserId as string,
      recipientId
    );
    res.status(201).json({ message: "Friend request sent", friendship });
  } catch (error) {
    next(error);
  }
}

/** PATCH /friends/request/:id — { action: "accept" | "decline" } */
export async function respondToFriendRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { action } = req.body as { action?: "accept" | "decline" };
    if (action !== "accept" && action !== "decline") {
      res.status(400).json({ message: "action must be 'accept' or 'decline'" });
      return;
    }
    const friendship = await friendshipService.respondToRequest(
      req.authUserId as string,
      getParamValue(req.params.id) as string,
      action
    );
    res.status(200).json({
      message: action === "accept" ? "Friend request accepted" : "Friend request declined",
      friendship
    });
  } catch (error) {
    next(error);
  }
}

/** GET /friends — accepted friends list */
export async function listFriends(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const friends = await friendshipService.listFriends(req.authUserId as string);
    res.status(200).json({ friends });
  } catch (error) {
    next(error);
  }
}

/** GET /friends/requests/incoming — pending requests sent to me */
export async function listIncomingRequests(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requests = await friendshipService.listIncomingRequests(req.authUserId as string);
    res.status(200).json({ requests });
  } catch (error) {
    next(error);
  }
}

/** GET /friends/requests/outgoing — pending requests I sent */
export async function listOutgoingRequests(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requests = await friendshipService.listOutgoingRequests(req.authUserId as string);
    res.status(200).json({ requests });
  } catch (error) {
    next(error);
  }
}

/** DELETE /friends/:friendId — unfriend */
export async function removeFriend(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await friendshipService.removeFriend(
      req.authUserId as string,
      getParamValue(req.params.friendId) as string
    );
    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    next(error);
  }
}

/** POST /friends/block — { targetId } */
export async function blockUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { targetId } = req.body as { targetId?: string };
    if (!targetId) {
      res.status(400).json({ message: "targetId is required" });
      return;
    }
    await friendshipService.blockUser(req.authUserId as string, targetId);
    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    next(error);
  }
}

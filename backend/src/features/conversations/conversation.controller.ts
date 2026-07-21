import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { conversationService } from "@features/conversations/conversation.service.js";
import { sendSuccess } from "@utils/response.js";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** POST /conversations — create group or open/get direct DM */
export async function createConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { type, name, participantIds, targetUserId } = req.body as {
      type: "group" | "direct";
      name?: string;
      participantIds?: string[];
      targetUserId?: string;
    };

    if (type === "direct") {
      if (!targetUserId) {
        res.status(400).json({
          success: false,
          message: "targetUserId is required for direct conversations"
        });
        return;
      }
      const conversation = await conversationService.getOrCreateDirect(
        req.authUserId as string,
        targetUserId
      );
      sendSuccess(res, { conversation });
      return;
    }

    // group
    if (!name || !participantIds || !Array.isArray(participantIds)) {
      res.status(400).json({
        success: false,
        message: "name and participantIds are required for group conversations"
      });
      return;
    }

    const conversation = await conversationService.createGroup(req.authUserId as string, {
      name,
      participantIds
    });
    sendSuccess(res, { conversation }, "Conversation created", 201);
  } catch (error) {
    next(error);
  }
}

/** GET /conversations — list all conversations for the authenticated user */
export async function listConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await conversationService.listForUser(req.authUserId as string);
    sendSuccess(res, { conversations });
  } catch (error) {
    next(error);
  }
}

/** GET /conversations/:id — get a single conversation */
export async function getConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await conversationService.getById(
      req.authUserId as string,
      getParamValue(req.params.id) as string
    );
    sendSuccess(res, { conversation });
  } catch (error) {
    next(error);
  }
}

/** POST /conversations/:id/participants — admin invites a user */
export async function inviteParticipant(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId: targetUserId } = req.body as { userId?: string };
    if (!targetUserId) {
      res.status(400).json({ success: false, message: "userId is required" });
      return;
    }
    const conversation = await conversationService.inviteParticipant(
      req.authUserId as string,
      getParamValue(req.params.id) as string,
      targetUserId
    );
    sendSuccess(res, { conversation }, "Participant invited");
  } catch (error) {
    next(error);
  }
}

/** DELETE /conversations/:id/participants/:userId — admin removes a user */
export async function removeParticipant(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await conversationService.removeParticipant(
      req.authUserId as string,
      getParamValue(req.params.id) as string,
      getParamValue(req.params.userId) as string
    );
    sendSuccess(res, { conversation }, "Participant removed");
  } catch (error) {
    next(error);
  }
}

/** PATCH /conversations/:id/settings — admin toggles history access */
export async function updateConversationSettings(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { allowHistoryForNewMembers } = req.body as { allowHistoryForNewMembers?: boolean };
    if (typeof allowHistoryForNewMembers !== "boolean") {
      res.status(400).json({
        success: false,
        message: "allowHistoryForNewMembers (boolean) is required"
      });
      return;
    }
    const conversation = await conversationService.toggleHistoryAccess(
      req.authUserId as string,
      getParamValue(req.params.id) as string,
      allowHistoryForNewMembers
    );
    sendSuccess(
      res,
      { conversation },
      `History access ${allowHistoryForNewMembers ? "enabled" : "disabled"}`
    );
  } catch (error) {
    next(error);
  }
}

/** GET /conversations/:id/messages — paginated message history */
export async function getMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const before = req.query.before as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const result = await conversationService.getMessages(
      req.authUserId as string,
      getParamValue(req.params.id) as string,
      { before, limit }
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

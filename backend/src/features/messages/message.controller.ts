import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { messageService } from "@features/messages/message.service.js";
import { sendSuccess } from "@utils/response.js";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** POST /conversations/:id/messages — send a message */
export async function sendMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { content, type } = req.body as {
      content?: string;
      type?: "text" | "image" | "file";
    };

    if (!content || content.trim() === "") {
      res.status(400).json({ success: false, message: "content is required" });
      return;
    }

    const message = await messageService.sendMessage(req.authUserId as string, {
      conversationId: getParamValue(req.params.id) as string,
      content: content.trim(),
      type: type ?? "text"
    });

    sendSuccess(res, { message }, "Message sent", 201);
  } catch (error) {
    next(error);
  }
}

/** PATCH /conversations/:id/messages/:messageId/read — mark as read */
export async function markMessageRead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await messageService.markAsRead(
      req.authUserId as string,
      getParamValue(req.params.messageId) as string
    );
    sendSuccess(res, null, "Message marked as read");
  } catch (error) {
    next(error);
  }
}

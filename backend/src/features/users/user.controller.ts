import type { NextFunction, Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { userService } from "@features/users/user.service.js";
import { sendSuccess } from "@utils/response.js";
import {
  updatePasswordSchema,
  updateUserProfileSchema
} from "@nexttalk/shared";

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `profile-${uniqueSuffix}${extension}`);
  }
});

export const profileImageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image uploads are allowed"));
      return;
    }

    callback(null, true);
  }
}).single("profileImage");

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await userService.getMe(req.authUserId as string);
    sendSuccess(res, { user: result });
  } catch (error) {
    next(error);
  }
}

export async function patchMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const avatarUrl = file ? `/uploads/${file.filename}` : undefined;
    const input = updateUserProfileSchema.parse({ ...req.body, avatarUrl });
    const result = await userService.updateMe(req.authUserId as string, input);

    sendSuccess(res, { user: result }, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = updatePasswordSchema.parse(req.body);
    await userService.updatePassword(req.authUserId as string, input);
    sendSuccess(res, null, "Password updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function searchUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string | undefined) ?? "";
    const results = await userService.searchByUsername(q, req.authUserId as string);
    sendSuccess(res, { users: results });
  } catch (error) {
    next(error);
  }
}

export async function updateFocusMode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const enabled = Boolean(req.body.enabled);
    const user = await userService.setFocusMode(req.authUserId as string, enabled);
    sendSuccess(res, { user }, `Focus mode ${enabled ? "enabled" : "disabled"}`);
  } catch (error) {
    next(error);
  }
}

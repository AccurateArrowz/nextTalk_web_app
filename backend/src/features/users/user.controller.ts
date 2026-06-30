import type { NextFunction, Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { userService } from "@features/users/user.service.js";

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
    res.status(200).json({ user: result });
  } catch (error) {
    next(error);
  }
}

export async function patchMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const profileImageUrl = file ? `/uploads/${file.filename}` : undefined;
    const result = await userService.updateMe(req.authUserId as string, {
      ...req.body,
      profileImageUrl
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: result
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await userService.updatePassword(req.authUserId as string, req.body);
    res.status(200).json({
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
}

import { Router } from "express";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUser,
  listAdminUsers,
  updateAdminUser
} from "@features/users/admin-user.controller.js";
import { requireAdmin, requireAuth } from "@middleware/require-auth.js";

export const adminUserRouter = Router();

adminUserRouter.use(requireAuth, requireAdmin);
adminUserRouter.get("/", listAdminUsers);
adminUserRouter.get("/:id", getAdminUser);
adminUserRouter.post("/", createAdminUser);
adminUserRouter.put("/:id", updateAdminUser);
adminUserRouter.patch("/:id", updateAdminUser);
adminUserRouter.delete("/:id", deleteAdminUser);

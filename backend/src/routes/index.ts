import { Router } from "express";
import { authRouter } from "@features/auth/auth.routes.js";
import { friendshipRouter } from "@features/friendships/friendship.routes.js";
import { conversationRouter } from "@features/conversations/conversation.routes.js";
import { healthRouter } from "@features/health/health.routes.js";
import { adminUserRouter } from "@features/users/admin-user.routes.js";
import { userRouter } from "@features/users/user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/admin/users", adminUserRouter);
apiRouter.use("/friends", friendshipRouter);
apiRouter.use("/conversations", conversationRouter);

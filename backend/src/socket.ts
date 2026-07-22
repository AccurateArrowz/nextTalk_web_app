import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer, type Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { jwtConfig } from "@config/jwt.js";
import { env } from "@config/env.js";
import { ConversationModel } from "@features/conversations/conversation.model.js";
import { userRepository } from "@features/users/user.repository.js";
import { TokenPayload } from "@features/auth/auth.types.js";

type AuthedSocket = Socket & {
  data: Socket["data"] & {
    userId?: string;
    userRole?: "user" | "platformAdmin";
  };
};

let io: SocketIOServer | null = null;

function extractToken(socket: Socket) {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken;
  }

  const header = socket.handshake.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  return undefined;
}

async function authenticateSocket(socket: Socket) {
  const token = extractToken(socket);

  if (!token) {
    throw new Error("Authentication required");
  }

  const payload = jwt.verify(token, jwtConfig.accessSecret) as TokenPayload;
  if (payload.kind !== "access" || !payload.sub) {
    throw new Error("Invalid token");
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) {
    throw new Error("Invalid token");
  }

  const authedSocket = socket as AuthedSocket;
  authedSocket.data.userId = payload.sub;
  authedSocket.data.userRole = user.role ?? "user";
}

export function initSocketServer(httpServer: HttpServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.clientOrigins,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      await authenticateSocket(socket);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:conversation", async (conversationId: string, ack?: (response: unknown) => void) => {
      try {
        const userId = (socket as AuthedSocket).data.userId;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const conversation = await ConversationModel.exists({
          _id: conversationId,
          "participants.userId": userId
        });

        if (!conversation) {
          throw new Error("Conversation not found");
        }

        await socket.join(`conversation:${conversationId}`);
        ack?.({ ok: true, conversationId });
      } catch (error) {
        ack?.({
          ok: false,
          message: error instanceof Error ? error.message : "Unable to join conversation"
        });
      }
    });

    socket.on("typing:start", (payload: { conversationId?: string }, ack?: (response: unknown) => void) => {
      const userId = (socket as AuthedSocket).data.userId;
      const conversationId = payload?.conversationId;

      if (!userId || !conversationId) {
        ack?.({ ok: false, message: "conversationId is required" });
        return;
      }

      socket.to(`conversation:${conversationId}`).emit("typing:start", {
        conversationId,
        userId
      });

      ack?.({ ok: true });
    });

    socket.on("typing:stop", (payload: { conversationId?: string }, ack?: (response: unknown) => void) => {
      const userId = (socket as AuthedSocket).data.userId;
      const conversationId = payload?.conversationId;

      if (!userId || !conversationId) {
        ack?.({ ok: false, message: "conversationId is required" });
        return;
      }

      socket.to(`conversation:${conversationId}`).emit("typing:stop", {
        conversationId,
        userId
      });

      ack?.({ ok: true });
    });
  });

  return io;
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server has not been initialised");
  }

  return io;
}

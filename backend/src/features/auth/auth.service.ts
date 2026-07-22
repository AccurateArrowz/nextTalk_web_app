import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { jwtConfig } from "@config/jwt.js";
import { userRepository } from "@features/users/user.repository.js";
import type {
  AuthResponse,
  LoginUserInput,
  RefreshResponse,
  RegisterUserInput
} from "@nexttalk/shared";
import { TokenPayload } from "./auth.types.js";


class AuthService {
  async register(input: RegisterUserInput): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      const error = new Error("Email already exists");
      (error as Error & { statusCode?: number }).statusCode = 409;
      throw error;
    }

    const existingUsername = await userRepository.findByUsername(input.username);
    if (existingUsername) {
      const error = new Error("Username already exists");
      (error as Error & { statusCode?: number }).statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null
    });

    const accessToken = this.generateAccessToken(user.id, user.email);

    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ?? "user",
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: {
          state: user.status?.state ?? "offline",
          lastSeenAt: user.status?.lastSeenAt?.toISOString() ?? new Date().toISOString()
        }
      },
      accessToken
    };
  }

  async login(input: LoginUserInput): Promise<AuthResponse> {
    if (!input?.email || !input?.password) {
      const error = new Error("Email and password are required");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    const userQuery = userRepository.findByEmail(input.email);
    const user = await userQuery.select("+password");

    if (!user) {
      const error = new Error("Invalid email or password");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    const accessToken = this.generateAccessToken(user.id, user.email);

    return {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ?? "user",
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: {
          state: user.status?.state ?? "offline",
          lastSeenAt: user.status?.lastSeenAt?.toISOString() ?? new Date().toISOString()
        }
      },
      accessToken
    };
  }

  async refreshFromToken(token: string): Promise<RefreshResponse> {
    const payload = this.verifyRefreshToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      const error = new Error("Invalid refresh token");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    return {
      message: "Session refreshed successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ?? "user",
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        status: {
          state: user.status?.state ?? "offline",
          lastSeenAt: user.status?.lastSeenAt?.toISOString() ?? new Date().toISOString()
        }
      },
      accessToken: this.generateAccessToken(user.id, user.email)
    };
  }

  generateRefreshToken(userId: string, email: string) {
    return jwt.sign(
      {
        sub: userId,
        email,
        kind: "refresh",
        jti: crypto.randomUUID()
      } satisfies TokenPayload,
      jwtConfig.refreshSecret,
      {
        expiresIn: jwtConfig.refreshTokenExpiresIn
      }
    );
  }

  private generateAccessToken(userId: string, email: string) {
    return jwt.sign(
      {
        sub: userId,
        email,
        kind: "access"
      } satisfies TokenPayload,
      jwtConfig.accessSecret,
      {
        expiresIn: jwtConfig.accessTokenExpiresIn
      }
    );
  }

  private verifyRefreshToken(token: string) {
    const payload = jwt.verify(token, jwtConfig.refreshSecret) as TokenPayload;

    if (payload.kind !== "refresh" || !payload.sub || !payload.email) {
      const error = new Error("Invalid refresh token");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    return payload;
  }
}

export const authService = new AuthService();

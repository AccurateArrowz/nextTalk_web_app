import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { jwtConfig } from "@config/jwt.js";
import { userRepository } from "@features/users/user.repository.js";
import type { AuthResponseDto, LoginUserDto, RefreshResponseDto, RegisterUserDto } from "@features/auth/auth.dto.js";

type TokenKind = "access" | "refresh";

type TokenPayload = {
  sub: string;
  email: string;
  kind: TokenKind;
  jti?: string;
};

class AuthService {
  async register(input: RegisterUserDto): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      const error = new Error("Email already exists");
      (error as Error & { statusCode?: number }).statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword
    });

    const accessToken = this.generateAccessToken(user.id, user.email);

    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImageUrl: user.profileImageUrl ?? null
      },
      accessToken
    };
  }

  async login(input: LoginUserDto): Promise<AuthResponseDto> {
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
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImageUrl: user.profileImageUrl ?? null
      },
      accessToken
    };
  }

  async refreshFromToken(token: string): Promise<RefreshResponseDto> {
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
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImageUrl: user.profileImageUrl ?? null
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
      jwtConfig.secret,
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
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.accessTokenExpiresIn
      }
    );
  }

  private verifyRefreshToken(token: string) {
    const payload = jwt.verify(token, jwtConfig.secret) as TokenPayload;

    if (payload.kind !== "refresh" || !payload.sub || !payload.email) {
      const error = new Error("Invalid refresh token");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    return payload;
  }
}

export const authService = new AuthService();

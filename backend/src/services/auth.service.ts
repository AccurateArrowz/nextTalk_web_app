import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "@config/jwt.js";
import { userRepository } from "@repositories/user.repository.js";
import type { AuthResponseDto, LoginUserDto, RegisterUserDto } from "@dtos/auth.dto.js";

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

    const accessToken = this.generateToken(user.id, user.email);

    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
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

    const accessToken = this.generateToken(user.id, user.email);

    return {
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl ?? null
      },
      accessToken
    };
  }

  private generateToken(userId: string, email: string) {
    return jwt.sign({ sub: userId, email }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  }
}

export const authService = new AuthService();

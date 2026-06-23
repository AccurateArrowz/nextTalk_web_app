import bcrypt from "bcryptjs";
import { userRepository } from "@repositories/user.repository.js";
import type { UpdateUserProfileDto, UserProfileDto } from "@dtos/user.dto.js";

class UserService {
  private toProfileDto(user: {
    id?: string;
    _id?: { toString(): string };
    fullName: string;
    email: string;
    profileImageUrl?: string | null;
  }): UserProfileDto {
    const id = user.id ?? user._id?.toString() ?? "";

    return {
      id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl ?? null
    };
  }

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return this.toProfileDto(user);
  }

  async updateMe(userId: string, input: UpdateUserProfileDto): Promise<UserProfileDto> {
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    if (input.email) {
      const duplicateEmailUser = await userRepository.findByEmail(input.email);

      if (duplicateEmailUser && duplicateEmailUser.id !== userId) {
        const error = new Error("Email already exists");
        (error as Error & { statusCode?: number }).statusCode = 409;
        throw error;
      }
    }

    const updatedUser = await userRepository.updateById(userId, input);

    if (!updatedUser) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return this.toProfileDto(updatedUser);
  }

  async updatePassword(userId: string, input: { currentPassword?: string; newPassword?: string }): Promise<void> {
    if (!input.currentPassword || !input.newPassword) {
      const error = new Error("Current and new passwords are required");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    const userQuery = userRepository.findById(userId);
    const user = await userQuery.select("+password");

    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid current password");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    if (input.newPassword.length < 8) {
      const error = new Error("New password must be at least 8 characters");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    // Additional validations from registerSchema
    if (!/[A-Z]/.test(input.newPassword)) {
      const error = new Error("New password must include one uppercase letter");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }
    if (!/[0-9]/.test(input.newPassword)) {
      const error = new Error("New password must include one number");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 12);
    user.password = hashedPassword;
    await user.save();
  }
}

export const userService = new UserService();

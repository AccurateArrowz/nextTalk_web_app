import bcrypt from "bcryptjs";
import { userRepository } from "@features/users/user.repository.js";
import type {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AdminUserListResponseDto,
  UpdateUserProfileDto,
  UserProfileDto
} from "@features/users/user.dto.js";

class UserService {
  private toProfileDto(user: {
    id?: string;
    _id?: { toString(): string };
    fullName: string;
    email: string;
    role?: "user" | "admin";
    status?: "active" | "inactive";
    profileImageUrl?: string | null;
  }): UserProfileDto {
    const id = user.id ?? user._id?.toString() ?? "";

    return {
      id,
      fullName: user.fullName,
      email: user.email,
      role: user.role ?? "user",
      status: user.status ?? "active",
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

  async listUsers(input: { page: number; limit: number; search?: string }): Promise<AdminUserListResponseDto> {
    const page = Math.max(1, input.page);
    const limit = Math.min(Math.max(1, input.limit), 100);
    const search = input.search?.trim();
    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      userRepository
        .findList(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      userRepository.countDocuments(query)
    ]);

    return {
      data: users.map((user) => ({
        ...this.toProfileDto(user),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async getUserById(userId: string): Promise<UserProfileDto & { createdAt: string; updatedAt: string }> {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return {
      ...this.toProfileDto(user),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  async createUser(input: AdminCreateUserDto): Promise<UserProfileDto & { createdAt: string; updatedAt: string }> {
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
      password: hashedPassword,
      role: input.role ?? "user",
      status: input.status ?? "active",
      profileImageUrl: input.profileImageUrl ?? null
    });

    return {
      ...this.toProfileDto(user),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  async updateUser(
    userId: string,
    input: AdminUpdateUserDto
  ): Promise<UserProfileDto & { createdAt: string; updatedAt: string }> {
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

    const payload: AdminUpdateUserDto = {
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      status: input.status,
      profileImageUrl: input.profileImageUrl
    };

    if (input.password) {
      payload.password = await bcrypt.hash(input.password, 12);
    }

    const updatedUser = await userRepository.updateById(userId, payload);

    if (!updatedUser) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return {
      ...this.toProfileDto(updatedUser),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString()
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await userRepository.deleteById(userId);

    if (!deletedUser) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }
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

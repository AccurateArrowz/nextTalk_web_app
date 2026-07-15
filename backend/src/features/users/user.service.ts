import bcrypt from "bcryptjs";
import { userRepository } from "@features/users/user.repository.js";
import type {
  AdminCreateUserInput,
  AdminUpdateUserInput,
  AdminUserListResponse,
  PublicUser,
  UpdatePasswordInput,
  UpdateUserProfile,
  UserProfile
} from "@nexttalk/shared";

class UserService {
  private toProfileDto(user: any): UserProfile {
    const id = user.id ?? user._id?.toString() ?? "";

    return {
      id,
      username: user.username,
      email: user.email,
      role: user.role ?? "user",
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      avatarUrl: user.avatarUrl ?? null,
      focusMode: user.focusMode ?? false,
      status: {
        state: user.status?.state ?? "offline",
        lastSeenAt: user.status?.lastSeenAt?.toISOString() ?? new Date().toISOString()
      }
    };
  }

  private toPublicDto(user: any): PublicUser {
    const id = user.id ?? user._id?.toString() ?? "";
    return {
      id,
      username: user.username,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      avatarUrl: user.avatarUrl ?? null,
      status: { state: user.status?.state ?? "offline" }
    };
  }

  async getMe(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return this.toProfileDto(user);
  }

  async updateMe(userId: string, input: UpdateUserProfile): Promise<UserProfile> {
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

  async listUsers(input: { page: number; limit: number; search?: string }): Promise<AdminUserListResponse> {
    const page = Math.max(1, input.page);
    const limit = Math.min(Math.max(1, input.limit), 100);
    const search = input.search?.trim();
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
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

  async getUserById(userId: string): Promise<UserProfile & { createdAt: string; updatedAt: string }> {
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

  async createUser(input: AdminCreateUserInput): Promise<UserProfile & { createdAt: string; updatedAt: string }> {
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
      role: input.role ?? "user",
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      avatarUrl: input.avatarUrl ?? null,
      status: input.status
    });

    return {
      ...this.toProfileDto(user),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  async updateUser(
    userId: string,
    input: AdminUpdateUserInput
  ): Promise<UserProfile & { createdAt: string; updatedAt: string }> {
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

    if (input.username) {
      const duplicateUsernameUser = await userRepository.findByUsername(input.username);

      if (duplicateUsernameUser && duplicateUsernameUser.id !== userId) {
        const error = new Error("Username already exists");
        (error as Error & { statusCode?: number }).statusCode = 409;
        throw error;
      }
    }

    const payload: any = {
      username: input.username,
      email: input.email,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
      avatarUrl: input.avatarUrl,
      status: input.status
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

  async updatePassword(userId: string, input: UpdatePasswordInput): Promise<void> {
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

  /**
   * Search users by username prefix/substring.
   * Returns a slim public profile — email is intentionally excluded.
   */
  async searchByUsername(
    query: string,
    requestingUserId: string,
    limit = 20
  ): Promise<PublicUser[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const users = await userRepository
      .findList({
        username: { $regex: trimmed, $options: "i" },
        _id: { $ne: requestingUserId } // exclude self
      })
      .limit(limit)
      .select("username firstName lastName avatarUrl status");

    return users.map((u) => this.toPublicDto(u));
  }

  /** Toggle focus mode on / off for the authenticated user. */
  async setFocusMode(userId: string, enabled: boolean): Promise<UserProfile> {
    const user = await userRepository.updateById(userId, { focusMode: enabled } as any);

    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    return this.toProfileDto(user);
  }
}

export const userService = new UserService();

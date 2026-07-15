import { UserModel } from "@features/users/user.model.js";

class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase().trim() });
  }

  findByUsername(username: string) {
    return UserModel.findOne({ username: username.trim() });
  }

  findById(id: string) {
    return UserModel.findById(id);
  }

  findList(query: Record<string, unknown>) {
    return UserModel.find(query);
  }

  countDocuments(query: Record<string, unknown>) {
    return UserModel.countDocuments(query);
  }

  updateById(
    id: string,
    payload: {
      username?: string;
      email?: string;
      password?: string;
      role?: "user" | "platformAdmin";
      firstName?: string | null;
      lastName?: string | null;
      avatarUrl?: string | null;
      status?: {
        state: "online" | "offline" | "away";
        lastSeenAt: Date;
      };
    }
  ) {
    return UserModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  create(payload: {
    username: string;
    email: string;
    password: string;
    role?: "user" | "platformAdmin";
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    status?: {
      state: "online" | "offline" | "away";
      lastSeenAt: Date;
    };
  }) {
    return UserModel.create(payload);
  }

  deleteById(id: string) {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();

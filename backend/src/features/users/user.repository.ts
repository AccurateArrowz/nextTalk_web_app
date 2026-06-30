import { UserModel } from "@features/users/user.model.js";

class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase().trim() });
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
      fullName?: string;
      email?: string;
      password?: string;
      role?: "user" | "admin";
      status?: "active" | "inactive";
      profileImageUrl?: string | null;
    }
  ) {
    return UserModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  create(payload: {
    fullName: string;
    email: string;
    password: string;
    role?: "user" | "admin";
    status?: "active" | "inactive";
    profileImageUrl?: string | null;
  }) {
    return UserModel.create(payload);
  }

  deleteById(id: string) {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();

import { UserModel } from "@models/user.model.js";

class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase().trim() });
  }

  findById(id: string) {
    return UserModel.findById(id);
  }

  updateById(
    id: string,
    payload: {
      fullName?: string;
      email?: string;
      profileImageUrl?: string | null;
    }
  ) {
    return UserModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  create(payload: { fullName: string; email: string; password: string; profileImageUrl?: string | null }) {
    return UserModel.create(payload);
  }
}

export const userRepository = new UserRepository();

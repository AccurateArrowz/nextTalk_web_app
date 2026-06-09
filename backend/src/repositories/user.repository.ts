import { UserModel } from "@models/user.model.js";

class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase().trim() });
  }

  create(payload: { fullName: string; email: string; password: string }) {
    return UserModel.create(payload);
  }
}

export const userRepository = new UserRepository();

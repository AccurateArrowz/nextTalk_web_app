"use client";

import { loginUser, registerUser, type LoginInput, type RegisterInput } from "@/app/_lib/auth";

export async function registerAction(input: RegisterInput) {
  return registerUser(input);
}

export async function loginAction(input: LoginInput) {
  return loginUser(input);
}

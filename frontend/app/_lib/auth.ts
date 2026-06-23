import { z } from "zod";

const isServer = typeof window === "undefined";
const apiBaseUrl = isServer
  ? (process.env.INTERNAL_API_URL ?? "http://localhost:8000")
  : "";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include one uppercase letter")
      .regex(/[0-9]/, "Password must include one number")
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required")
  })
  .strict();

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must include one uppercase letter")
      .regex(/[0-9]/, "New password must include one number")
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
};

export type AuthApiResponse = {
  message: string;
  user: UserProfile;
};

export type UserApiResponse = {
  user: UserProfile;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiBaseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include"
  });

  const payload = (await response.json().catch(() => ({}))) as
    | { message?: string }
    | Record<string, unknown>;

  if (!response.ok) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : "Something went wrong"
    );
  }

  return payload as T;
}

export function registerUser(input: RegisterInput) {
  return apiFetch<AuthApiResponse>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
}

export function loginUser(input: LoginInput) {
  return apiFetch<AuthApiResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
}

export function getCurrentUser() {
  return apiFetch<UserApiResponse>("/api/users/me", {
    method: "GET"
  });
}

export function updateProfile(formData: FormData) {
  return apiFetch<UserApiResponse>("/api/users/me", {
    method: "PATCH",
    body: formData
  });
}

export function updatePasswordApi(input: PasswordInput) {
  return apiFetch<{ message: string }>("/api/users/me/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
}

export function logoutUser() {
  return apiFetch<{ message: string }>("/api/auth/logout", {
    method: "POST"
  });
}


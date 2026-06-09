import { z } from "zod";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type AuthApiResponse = {
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
};

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
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
  return request<AuthApiResponse>("/register", input);
}

export function loginUser(input: LoginInput) {
  return request<AuthApiResponse>("/login", input);
}

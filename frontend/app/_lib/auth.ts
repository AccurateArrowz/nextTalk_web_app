import { z } from "zod";

const isServer = typeof window === "undefined";
const apiBaseUrl = isServer
  ? (process.env.INTERNAL_API_URL ?? "http://localhost:8000")
  : "";

let accessTokenInMemory: string | null = null;
let refreshAccessTokenRequest: Promise<AuthApiResponse> | null = null;

export function setAccessToken(token: string | null) {
  accessTokenInMemory = token;
}

export function getAccessToken() {
  return accessTokenInMemory;
}

export function clearAccessToken() {
  accessTokenInMemory = null;
}

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
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImageUrl: string | null;
};

export type AuthApiResponse = {
  message: string;
  user: UserProfile;
  accessToken: string;
};

export type UserApiResponse = {
  user: UserProfile;
};

export type AdminUserListItem = UserProfile & {
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListResponse = {
  data: AdminUserListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminUserPayload = {
  fullName: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImageUrl?: string | null;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${apiBaseUrl}${path}`;
  const headers = new Headers(options.headers);

  if (!isServer) {
    const token = getAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  const payload = (await response.json().catch(() => ({}))) as
    | { message?: string }
    | Record<string, unknown>;

  if (!response.ok) {
    if (
      !isServer &&
      response.status === 401 &&
      retryCount === 0 &&
      path !== "/api/auth/refresh" &&
      path !== "/api/auth/login" &&
      path !== "/api/auth/register"
    ) {
      try {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return apiFetch<T>(path, options, retryCount + 1);
        }
      } catch {
        clearAccessToken();
      }
    }

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
  }).then((response) => {
    setAccessToken(response.accessToken);
    return response;
  });
}

export function loginUser(input: LoginInput) {
  return apiFetch<AuthApiResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  }).then((response) => {
    setAccessToken(response.accessToken);
    return response;
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
  clearAccessToken();
  return apiFetch<{ message: string }>("/api/auth/logout", {
    method: "POST"
  });
}

export async function refreshAccessToken() {
  refreshAccessTokenRequest ??= apiFetch<AuthApiResponse>("/api/auth/refresh", {
    method: "POST"
  })
    .then((response) => {
      setAccessToken(response.accessToken);
      return response;
    })
    .finally(() => {
      refreshAccessTokenRequest = null;
    });

  return refreshAccessTokenRequest;
}

export function listAdminUsers(params: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  return apiFetch<AdminUserListResponse>(`/api/v1/admin/users${query.toString() ? `?${query}` : ""}`, {
    method: "GET"
  });
}

export function getAdminUser(id: string) {
  return apiFetch<{ data: AdminUserListItem }>(`/api/v1/admin/users/${id}`, {
    method: "GET"
  });
}

export function createAdminUser(input: AdminUserPayload) {
  return apiFetch<{ data: AdminUserListItem; message: string }>("/api/v1/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
}

export function updateAdminUser(id: string, input: AdminUserPayload) {
  return apiFetch<{ data: AdminUserListItem; message: string }>(`/api/v1/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
}

export function deleteAdminUser(id: string) {
  return apiFetch<{ message: string }>(`/api/v1/admin/users/${id}`, {
    method: "DELETE"
  });
}

// Handles auth api calls

import { apiFetch } from "../api/apiClient";
import { saveTokens, clearTokens, getRefreshToken } from "./tokenStorage";

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
};

export type MeResult = {
  userId: number;
  email: string;
  username: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
};

// POST /api/users/login
export async function login(req: LoginRequest): Promise<MeResult> {
  // Make call
  const tokens = await apiFetch<LoginResult>("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: req.identifier,
      password: req.password,
    }),
  });
  // save tokens
  saveTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
  // return user
  return await me();
}

// GET /api/users/me
export async function me(): Promise<MeResult> {
  return await apiFetch<MeResult>("/api/users/me");
}

// POST /api/users/logout
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return;
  }

  try {
    await apiFetch<void>("api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    clearTokens();
  }
}

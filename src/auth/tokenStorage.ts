// Handles auth token storage functions and types

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const STORAGE_KEY = "auth.tokens.v1";

// NOTE: local storage is just a map<string, string>(key, value)
// so we must turn the AuthTokens object into a string to store it
export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function getTokens(): AuthTokens | null {
  // pull and validate something is stored
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    // Deserialize from string to AuthTokens obj
    const parsed = JSON.parse(raw) as Partial<AuthTokens>;

    // Validate shape
    if (!parsed.accessToken || !parsed.refreshToken) return null;

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return getTokens()?.refreshToken ?? null;
}

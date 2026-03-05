// Handles API calls in one place

import { env } from "../config/env";
import { getAccessToken } from "../auth/tokenStorage";

type ApiError = {
    status: number;
    message: string;
};

async function parseError(res: Response): Promise<ApiError> {
    // check response header 
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let message = `Request failed (${res.status})`;

    // try to set message based on response type
    try {
        if (isJson) {
            const data = await res.json();
            message = data?.detail || data?.title || data.message || message;
        } else {
            const text = await res.text();
            if (text) message = text;
        }
    } catch {}

    return {status: res.status, message};
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    // Build header
    const token = getAccessToken();

    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");

    if(token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Make request
    const res = await fetch(`${env.apiBaseUrl}${path}`, {
        ...options,
        headers,
    });

    // Responses

    if(!res.ok) {
        throw await parseError(res);
    }

    // empty response
    if(res.status === 204) return undefined as T;

    // Validate response is json
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if(!isJson) {
        throw {status: res.status, message: "Expected JSON response"} as ApiError;
    }

    // Valid response
    return (await res.json()) as T;
}
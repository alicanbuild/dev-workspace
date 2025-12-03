import { useAuthStore } from "../stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const apiClient = {
  async get(path: string) {
    return this.request(path, "GET");
  },

  async post(path: string, body?: unknown) {
    return this.request(path, "POST", body);
  },

  async request(path: string, method: string, body?: unknown) {
    const token = useAuthStore.getState().token;

    let jsonBody: string | undefined = undefined;

    if (body !== undefined) {
      if (typeof body === "string") {
        jsonBody = body;
      } else if (typeof body === "object") {
        jsonBody = JSON.stringify(body);
      } else {
        throw new Error("Invalid body type");
      }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: jsonBody,
    });

    
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized"));
    }

    return response;
  },
};

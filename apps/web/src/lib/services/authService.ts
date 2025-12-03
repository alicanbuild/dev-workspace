import { apiClient } from "../apiClient";

export async function loginRequest(data: { email: string; password: string }) {
  return apiClient.post("/auth/login", data);
}

export async function registerRequest(data: {
  email: string;
  password: string;
  passwordConfirm: string;
}) {
  return apiClient.post("/auth/register", data);
}

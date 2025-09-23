import type { Token, User } from "@/auth/AuthContext";
import { api } from "./axios";

interface RegisterResponse {
  id: number;
  username: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const registerUser = async (credentials: {
  username: string;
  password: string;
}): Promise<RegisterResponse> => {
  const { data } = await api.post("/users/register", credentials);
  return data;
};

export const getAuthToken = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);
  params.append("grant_type", "password");
  const { data } = await api.post("/auth/token", params);
  return data;
};

export const getUserInfo = async (token: Token): Promise<User> => {
  const { data } = await api.get<User>("/users/me", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  return data;
};

import type { Token, User } from "@/auth/AuthContext";
import axios from "axios";

interface RegisterResponse {
  id: number;
  username: string;
}

export const registerUser = async (credentials: {
  username: string;
  password: string;
}): Promise<RegisterResponse> => {
  const { data } = await axios.post(
    "http://0.0.0.0:8000/users/register",
    credentials
  );
  return data;
};

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const getAuthToken = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);
  params.append("grant_type", "password");
  const { data } = await axios.post("http://0.0.0.0:8000/auth/token", params);
  return data;
};

export const getUserInfo = async (token: Token): Promise<User> => {
  const { data } = await axios.get<User>("http://0.0.0.0:8000/users/me", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  return data;
};

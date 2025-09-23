import axios from "axios";

export const api = axios.create({
  baseURL: "http://0.0.0.0:8000/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const access_token = JSON.parse(token || "null")?.access_token;
  if (token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

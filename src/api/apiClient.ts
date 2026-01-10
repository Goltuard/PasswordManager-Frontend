import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5197/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  const url = config.url ?? "";

  if (
    token &&
    !url.includes("Users/login") &&
    !url.includes("Users/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

import axios from "axios";
import { BACKEND_URL } from "../config";

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On an expired/invalid session, clear the token and bounce to sign-in —
// but never for the auth endpoints themselves (a bad password is expected there).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = url.includes("/signin") || url.includes("/signup");
    if (status === 401 && !isAuthCall && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/signin")) {
        window.location.assign("/signin");
      }
    }
    return Promise.reject(error);
  }
);

/** Friendly message extractor for caught axios errors. */
export function errMessage(err: unknown, fallback = "Something went wrong"): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    if (r?.data?.message) return r.data.message;
  }
  return fallback;
}

export default api;

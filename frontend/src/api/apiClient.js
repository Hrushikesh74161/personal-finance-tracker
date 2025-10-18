import axios from "axios";
import { pageRoutes } from "../constants/pageRoutes";

export default async function apiClient({ method, url, data, headers = {}, auth = true }) {
  const accessToken = JSON.parse(sessionStorage.getItem("loginInfo"))?.token; // get token from storage

  const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  // Add response interceptor to handle 401 unauthorized errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear login info from session storage
        sessionStorage.removeItem("loginInfo");
        // Redirect to login page
        window.location.href = pageRoutes.LOGIN_PAGE;
      }
      return Promise.reject(error);
    }
  );

  return await api[`${method}`](url, data);
};
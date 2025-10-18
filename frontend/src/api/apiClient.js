import axios from "axios";

export default async ({ method, url, data, headers = {}, auth = true }) => {
  const accessToken = JSON.parse(sessionStorage.getItem("loginInfo")).token; // get token from storage

  const api = axios.create({
    baseUrl: import.meta.env.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  return await api[method](url, data);
};
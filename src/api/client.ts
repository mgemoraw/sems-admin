import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const WEBSOCKET_BASE_URL =
  import.meta.env.VITE_WEBSOCKET_BASE_URL || "ws://localhost:8000/cable";
const API_DEV_URL =
  import.meta.env.VITE_API_DEV_URL || "http://localhost:8000/api/v1";
const WEBSOCKET_DEV_URL =
  import.meta.env.VITE_WEBSOCKET_DEV_URL || "ws://localhost:8000/cable";

const api = axios.create({
  // baseURL: API_BASE_URL,
  baseURL: API_DEV_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true; // ensures cookies are sent
  return config;
});

export default api;
export {  
  API_BASE_URL,
  WEBSOCKET_BASE_URL,
  API_DEV_URL,
  WEBSOCKET_DEV_URL

}
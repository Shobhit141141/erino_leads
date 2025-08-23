const { VITE_APP_API_URL, VITE_APP_ENV } = import.meta.env;

export const API_URL = VITE_APP_API_URL || "http://localhost:3000/api";
export const NODE_ENV = VITE_APP_ENV || "dev";
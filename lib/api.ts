/**
 * @file api.ts
 * @description Centralized Axios instance configuration with interceptors for global error handling.
 */

import axios, { AxiosError, AxiosInstance } from "axios";

// ============================================================================
// Constants & Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// Interceptors
// ============================================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Centralized error handling
    if (axios.isAxiosError(error)) {
      console.error("[API Error Interceptor]:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("[Unexpected Error Interceptor]:", error);
    }
    return Promise.reject(error);
  }
);

export default api;

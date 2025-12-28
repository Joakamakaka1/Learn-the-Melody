/**
 * api.ts
 * Configuration for Axios client to interact with the external Spotify proxy.
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
// Error Handling
// ============================================================================

export const handleApiError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
};

export default api;

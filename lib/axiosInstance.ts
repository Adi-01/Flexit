import axios from "axios";
import * as SecureStore from "expo-secure-store";

let onRefreshTokenFail: () => void = () => {};
export const setOnRefreshTokenFail = (callback: () => void) => {
  onRefreshTokenFail = callback;
};

const axiosInstance = axios.create({
  baseURL: "http://192.168.5.79:8000/api/v1/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// To prevent multiple refresh requests simultaneously
let refreshTokenPromise: Promise<string | null> | null = null;

// Request Interceptor: Add access token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("users/auth/refresh/")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = (async () => {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            if (!refreshToken) throw new Error("No refresh token found");

            const response = await axiosInstance.post("users/auth/refresh/", {
              refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;

            await SecureStore.setItemAsync("accessToken", newAccessToken);
            if (newRefreshToken) {
              await SecureStore.setItemAsync("refreshToken", newRefreshToken);
            }

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            return newAccessToken;
          })();
        }

        const newAccessToken = await refreshTokenPromise;
        refreshTokenPromise = null;

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to obtain new access token");
        }
      } catch (err) {
        refreshTokenPromise = null;
        console.error("🔒 Token refresh failed:", err);
        onRefreshTokenFail(); // Logout handler
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

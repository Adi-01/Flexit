import axiosInstance, { setOnRefreshTokenFail } from "@/lib/axiosInstance";
import { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

interface User {
  id: number;
  email: string;
  username: string;
  image_url: string;
  mobile?: string;
}

interface OTPResponse {
  message: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loginWithOTP: (
    email: string,
    code: string
  ) => Promise<{ status: "logged_in" | "signup_required" }>;
  logout: () => Promise<void>;
  requestOTP: (email: string) => Promise<AxiosResponse<OTPResponse>>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setOnRefreshTokenFail(() => logout());
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      const access = await SecureStore.getItemAsync("accessToken");
      if (access) {
        try {
          const res = await axiosInstance.get("users/auth/me/");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to restore session", err);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const requestOTP = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("users/auth/request-otp/", {
        email,
      });
      return res;
    } catch (err) {
      console.error("Failed to request OTP", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithOTP = useCallback(
    async (
      email: string,
      code: string
    ): Promise<{ status: "logged_in" | "signup_required" }> => {
      setLoading(true);
      try {
        const res = await axiosInstance.post("users/auth/verify-otp/", {
          email,
          code,
        });

        if (res.data.access && res.data.refresh && res.data.user) {
          await SecureStore.setItemAsync("accessToken", res.data.access);
          await SecureStore.setItemAsync("refreshToken", res.data.refresh);
          setUser(res.data.user);
          return { status: "logged_in" };
        } else if (res.data.next === "signup_required") {
          return { status: "signup_required" };
        } else {
          throw new Error("Unexpected response");
        }
      } catch (err: any) {
        console.error("OTP login failed", err);

        let message = "Something went wrong. Please try again.";
        if (err?.response?.data?.error) {
          message = err.response.data.error;
        } else if (err?.response?.data?.message) {
          message = err.response.data.message;
        }

        Alert.alert("Login Failed", message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setUser(null);
    setLoading(false);
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("users/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch current user", error);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithOTP,
        logout,
        requestOTP,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

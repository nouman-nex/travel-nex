import React from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import axios from "axios";
import {
  api,
  API_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";

const iAuthService = async (email, password) => {
  try {
    const response = await api.post("v1/auth/login", {
      email,
      password,
    });

    const backendData = response?.data?.data;

    return {
      token: backendData?.token,
      user: backendData?.user,
      resFromBackend: response?.data,
    };
  } catch (error) {
    console.error("Auth error:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        "Authentication failed",
    );
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [User, setUser] = React.useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await iAuthService(email, password);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      return response;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // eraseCookie("auth-user");
    localStorage.removeItem("token");
    localStorage.removeItem("seenEarningWarning");
    setIsAuthenticated(false);
    setUser(false);
  };

  React.useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(false);
        return;
      }

      setLoading(true);

      try {
        const response = await api.get("/v1/auth/me");

        if (response?.data?.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        User,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

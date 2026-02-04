import React from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import axios from "axios";
import { API_BASE_URL, postRequest } from "../../../../backendServices/ApiCalls";

const iAuthService = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { identifier: email, password });

    // const user = response.data.user
    // if (user){
    return { token: response?.data?.token, resFromBackend: response?.data }
    // }else{
    //   return { resFromBackend: response.data }
    // }
  } catch (error) {
    console.log("error:", error)
    throw new Error(error.response?.data?.message || "Authentication failed");
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
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response?.resFromBackend?.user)
        // const stringify = {
        //   token: response.token,
        //   email: response.email,
        //   password: response.password,
        // };
        // const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        // setCookie("auth-user", authUserSr, 1);
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false)
      }
      return response;
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // eraseCookie("auth-user");
    localStorage.removeItem('token');
    localStorage.removeItem('seenEarningWarning');
    setIsAuthenticated(false);
    setUser(false);
  };

  React.useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        setLoading(true);
        postRequest("/verifyToken", '', (response) => {
          setLoading(false);
          if (response?.data?.status == "success") {
            setUser(response?.data?.user)
            setIsAuthenticated(true);
          }
          if (response.data.status == "error") {
            logout()
          }
        },
          (error) => {
            logout()
            console.log(error?.response?.data);
          }
        );
      }else{
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, User, setUser ,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
}
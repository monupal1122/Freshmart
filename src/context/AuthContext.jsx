import React, { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "https://grocery-backend-3pow.onrender.com";

export const AuthContext = createContext();


const BASE_URL = `${API_URL}`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  // Load session on app start
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        console.log("Stored:", token, userData);

        if (token && userData) {
          setAuthToken(token);
          setUser(JSON.parse(userData));
        }
        console.log(userData,token);
        
      } catch (err) {
        console.log("Error checking login:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // SAVE TOKEN + USER
      const userData = data.user || data;
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(userData));

      setAuthToken(data.token);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.log("Login error:", err);
      return { success: false, error: err.message };
    }
  };

  // SIGNUP
  const signup = async (username, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // SAVE TOKEN + USER (same as login)
      const userData = data.user || data;
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(userData));

      setAuthToken(data.token);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.log("Signup error:", err);
      return { success: false, error: err.message };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      if (authToken) {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      setAuthToken(null);
      setUser(null);
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  // IS LOGGED IN HELPER
  const isLoggedIn = () => {
    return !user;
  };

  // VERIFY TOKEN WITH SERVER
  const verifyToken = async () => {
    if (!authToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        return true;
      } else {
        // Token invalid, logout
        await logout();
        return false;
      }
    } catch (err) {
      console.log("Token verification error:", err);
      await logout();
      return false;
    }
  };

  // CHECK TOKEN VALIDITY WITHOUT LOGOUT
  const checkTokenValid = async () => {
    if (!authToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      return res.ok;
    } catch (err) {
      console.log("Token check error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authToken,
        login,
        signup,
        logout,
        setUser,
        isLoggedIn,
        verifyToken,
        checkTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

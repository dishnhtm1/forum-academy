import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// src/context/AuthContext.js
const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api"; // fallback for local dev

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const saveAuthData = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("authToken", token); // ✅ Compatibility for admin page
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("role", user.role); // ✅ Used in admin redirect checks
    setCurrentUser(user);
  };

  const login = async (email, password) => {
    try {
      setError("");
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      saveAuthData(token, user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError("");
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      const { token, user } = response.data;
      saveAuthData(token, user); // ✅ Now register also saves user
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

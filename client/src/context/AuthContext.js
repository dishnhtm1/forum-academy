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
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
        fetchCurrentUser(token);
        } else {
        setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async (token) => {
        try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setCurrentUser(response.data);
        } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        } finally {
        setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError("");
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("currentUser", JSON.stringify(user)); // ✅ ADD THIS
            setCurrentUser(user);
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
        localStorage.setItem("token", token);
        setCurrentUser(user);
        return user;
        } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
        throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

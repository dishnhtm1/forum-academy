// src/requests.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Make sure .env is set correctly
});

// ✅ Automatically add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

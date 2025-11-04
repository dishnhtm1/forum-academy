/**
 * Shared API utilities for Admin Dashboard components
 * Contains common functions, auth helpers, and API configurations
 */

// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net";

/**
 * Get authentication headers for API requests
 * Checks both authToken and token in localStorage
 */
export const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    return {
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Get fallback headers when JWT authentication fails
 */
export const getFallbackHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

/**
 * Fetch authenticated audio from server with proper headers
 */
export const fetchAuthenticatedAudio = async (audioUrl) => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Fetching authenticated audio from URL:", audioUrl);

    const response = await fetch(audioUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const audioBlob = await response.blob();

    console.log("Authenticated audio fetch successful:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      blobSize: audioBlob.size,
      blobType: audioBlob.type,
    });

    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Authenticated audio fetch failed:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Download a file from the server
 */
export const downloadFile = async (filePath, fileName) => {
  try {
    let fileUrl = filePath;

    // If it's not a full URL, construct it
    if (!fileUrl.startsWith("http")) {
      fileUrl = `${API_BASE_URL}/${fileUrl}`;
    }

    console.log("Downloading file from:", fileUrl);

    const response = await fetch(fileUrl, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("File downloaded successfully:", fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

/**
 * Helper to safely extract arrays from API responses
 */
export const getArrayFromData = (data, key) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data[key] && Array.isArray(data[key])) return data[key];
  return [];
};

/**
 * Build absolute image URL for avatar/profile images
 */
export const getImageSrc = (path) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

/**
 * Translation helper: if key missing, use fallback
 */
export const translateWithFallback = (t, key, fallback) => {
  const val = t(key);
  return val === key ? fallback : val;
};

export default {
  API_BASE_URL,
  getAuthHeaders,
  getFallbackHeaders,
  fetchAuthenticatedAudio,
  downloadFile,
  getArrayFromData,
  getImageSrc,
  translateWithFallback,
};

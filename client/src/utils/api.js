// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// // Create a reusable axios instance with default config
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // You could add auth token here if using JWT instead of cookies
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { response } = error;

//     // Handle specific error status codes
//     if (response && response.status === 401) {
//       // Unauthorized - could redirect to login
//       console.error(
//         "Authentication error:",
//         response.data.message || "Unauthorized"
//       );
//       // sessionExpired event could be dispatched here
//     }

//     return Promise.reject(error);
//   }
// );

// // Helper to handle API requests with error handling
// const apiRequest = async (method, url, data = null, options = {}) => {
//   try {
//     const response = await api({
//       method,
//       url,
//       data,
//       ...options,
//     });
//     return response.data;
//   } catch (error) {
//     const message =
//       error.response?.data?.message || error.message || "An error occurred";
//     console.error(`API Error (${url}):`, message);
//     throw error;
//   }
// };

// // Auth API calls
// export const loginUser = (credentials) =>
//   apiRequest("post", "/auth/login", credentials);

// export const registerUser = (userData) =>
//   apiRequest("post", "/auth/register", userData);

// export const logoutUser = () => apiRequest("post", "/auth/logout");

// export const getCurrentUser = () => apiRequest("get", "/auth/me");

// export const forgotPassword = (email) =>
//   apiRequest("post", "/auth/forgot-password", { email });

// export const resetPassword = (token, newPassword) =>
//   apiRequest("post", "/auth/reset-password", { token, newPassword });

// export const updateUserProfile = (userData) =>
//   apiRequest("put", "/auth/profile", userData);

// // Application API calls with cancellation support
// export const submitApplication = (applicationData) =>
//   apiRequest("post", "/applications", applicationData);

// export const fetchApplications = (filters = {}) => {
//   const cancelToken = axios.CancelToken.source();
//   const promise = apiRequest("get", "/applications", null, {
//     params: filters,
//     cancelToken: cancelToken.token,
//   });
//   promise.cancel = () => cancelToken.cancel("Operation cancelled by user");
//   return promise;
// };

// export const getApplication = (id) => apiRequest("get", `/applications/${id}`);

// export const updateApplication = (id, data) =>
//   apiRequest("put", `/applications/${id}`, data);

// export const deleteApplication = (id) =>
//   apiRequest("delete", `/applications/${id}`);

// // Contact API calls
// export const submitContact = (contactData) =>
//   apiRequest("post", "/contacts", contactData);

// export const fetchContacts = (page = 1, limit = 10) =>
//   apiRequest("get", "/contacts", null, {
//     params: { page, limit },
//   });

// export const getContact = (id) => apiRequest("get", `/contacts/${id}`);

// export const updateContact = (id, data) =>
//     apiRequest("put", `/contacts/${id}`, data);

// export const deleteContact = (id) => apiRequest("delete", `/contacts/${id}`);

// // Add to c:\MERN-FIA-PORTAL\client\src\utils\api.js
// // Student API calls
// export const fetchStudents = (page = 1, pageSize = 10, search = "") =>
//     apiRequest("get", "/students", null, {
//         params: { page, pageSize, search },
//     });

// export const getStudent = (id) => apiRequest("get", `/students/${id}`);

// export const createStudent = (studentData) =>
//     apiRequest("post", "/students", studentData);

// export const updateStudent = (id, data) =>
//     apiRequest("put", `/students/${id}`, data);

// export const deleteStudent = (id) => apiRequest("delete", `/students/${id}`);

// // File upload helpers
// export const uploadFile = (file, type = "document") => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("type", type);

//     return apiRequest("post", "/upload", formData, {
//         headers: {
//         "Content-Type": "multipart/form-data",
//         },
//     });
// };

// // Course API calls
// export const fetchCourses = () => 
//     apiRequest('get', '/courses');

// // Student data
// export const fetchStudentData = () => 
//     apiRequest('get', '/students/dashboard');
// // Dashboard data
// export const getDashboardStats = () => apiRequest("get", "/dashboard/stats");

// export default api;


// utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token and user info in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userEmail', credentials.email);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get pending users (admin only)
export const getPendingUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/pending`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending users');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw error;
  }
};

// Approve user (admin only)
export const approveUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/approve/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve user');
    }
    
    return data;
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get current user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Get current user email
export const getUserEmail = () => {
  return localStorage.getItem('userEmail');
};
// // utils/api.js
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// // const API_BASE_URL = 'https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net/api'; 

// // Helper function to get auth headers
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   return {
//     'Content-Type': 'application/json',
//     'Authorization': token ? `Bearer ${token}` : ''
//   };
// };

// // Register a new user
// export const registerUser = async (userData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(userData)
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Registration failed');
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Registration error:', error);
//     throw error;
//   }
// };

// // Login user
// export const loginUser = async (credentials) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Login failed');
//     }
    
//     // Store token and user info in localStorage
//     if (data.token) {
//       localStorage.setItem('authToken', data.token);
//       localStorage.setItem('userRole', data.role);
//       localStorage.setItem('userEmail', credentials.email);
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Login error:', error);
//     throw error;
//   }
// };

// // Get pending users (admin only)
// export const getPendingUsers = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/pending`, {
//       method: 'GET',
//       headers: getAuthHeaders()
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to fetch pending users');
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error fetching pending users:', error);
//     throw error;
//   }
// };

// // Approve user (admin only)
// export const approveUser = async (userId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/approve/${userId}`, {
//       method: 'PUT',
//       headers: getAuthHeaders()
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to approve user');
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error approving user:', error);
//     throw error;
//   }
// };

// // Logout user
// export const logoutUser = () => {
//   localStorage.removeItem('authToken');
//   localStorage.removeItem('userRole');
//   localStorage.removeItem('userEmail');
//   window.location.href = '/';
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   return !!localStorage.getItem('authToken');
// };

// // Get current user role
// export const getUserRole = () => {
//   return localStorage.getItem('userRole');
// };

// // Get current user email
// export const getUserEmail = () => {
//   return localStorage.getItem('userEmail');
// };

// utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
//const API_BASE_URL = 'https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net/api'; 
//axios.post(`${BASE_URL}/api/auth/login`, {...})
//axios.post(`${API_BASE_URL}/auth/login`, {
//  email: 'test@example.com',
//  password: 'test123'
//});




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
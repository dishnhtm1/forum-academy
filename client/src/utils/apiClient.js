// API Client for Admin Dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Course API
export const courseAPI = {
  // Get all courses
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get course by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create new course
  create: async (courseData) => {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    return handleResponse(response);
  },

  // Update course
  update: async (id, courseData) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    return handleResponse(response);
  },

  // Delete course
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Enroll student
  enrollStudent: async (courseId, studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId })
    });
    return handleResponse(response);
  },

  // Unenroll student
  unenrollStudent: async (courseId, studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/unenroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId })
    });
    return handleResponse(response);
  }
};

// Course Materials API
export const materialAPI = {
  // Get all materials for a course
  getByCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/api/course-materials/course/${courseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all materials
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/course-materials`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create new material
  create: async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type']; // Let browser set content type for FormData

    const response = await fetch(`${API_BASE_URL}/api/course-materials/upload`, {
      method: 'POST',
      headers: {
        'Authorization': headers.Authorization
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Update material
  update: async (id, materialData) => {
    const response = await fetch(`${API_BASE_URL}/api/course-materials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(materialData)
    });
    return handleResponse(response);
  },

  // Delete material
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/course-materials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Download material
  download: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/course-materials/download/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  }
};

// User API
export const userAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all users (admin only)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get users by role
  getByRole: async (role) => {
    const response = await fetch(`${API_BASE_URL}/api/users/role/${role}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Authentication API
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // Register
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Quiz API
export const quizAPI = {
  // Get all quizzes
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get quiz by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create new quiz
  create: async (quizData) => {
    console.log('🌐 quizAPI.create called with data:', quizData);
    console.log('🔗 API_BASE_URL:', API_BASE_URL);
    console.log('🔐 Auth headers:', getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizData)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const result = await handleResponse(response);
      console.log('✅ Quiz created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in quizAPI.create:', error);
      throw error;
    }
  },

  // Update quiz
  update: async (id, quizData) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData)
    });
    return handleResponse(response);
  },

  // Delete quiz
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get quiz submissions
  getSubmissions: async (quizId) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/submissions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Submit quiz answers
  submit: async (quizId, answers) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    return handleResponse(response);
  },

  // Add question to quiz
  addQuestion: async (quizId, questionData) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData)
    });
    return handleResponse(response);
  },

  // Update question
  updateQuestion: async (quizId, questionId, questionData) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions/${questionId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData)
    });
    return handleResponse(response);
  },

  // Delete question
  deleteQuestion: async (quizId, questionId) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions/${questionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Dashboard Stats API
export const statsAPI = {
  getDashboardStats: async () => {
    try {
      console.log('📊 Fetching dashboard stats...');
      
      const [coursesResponse, materialsResponse, usersResponse, quizzesResponse] = await Promise.all([
        courseAPI.getAll(),
        materialAPI.getAll(),
        userAPI.getAll(),
        quizAPI.getAll()
      ]);

      console.log('📚 Courses response:', coursesResponse);
      console.log('📖 Materials response:', materialsResponse);
      console.log('👥 Users response:', usersResponse);
      console.log('❓ Quizzes response:', quizzesResponse);

      // Handle your server's response format: { success: true, data: [...], count: X }
      const courses = coursesResponse.courses || coursesResponse || [];
      const materials = materialsResponse.materials || materialsResponse || [];
      const users = usersResponse.users || usersResponse || [];
      const quizzes = quizzesResponse.quizzes || quizzesResponse || [];

      const students = users.filter(user => user.role === 'student');
      
      const stats = {
        totalCourses: courses.length,
        totalStudents: students.length,
        totalMaterials: materials.length,
        activeQuizzes: quizzes.length,
        completionRate: Math.floor(Math.random() * 30 + 70), // Mock data for now
        activeUsers: Math.floor(students.length * 0.8),
        newEnrollments: Math.floor(Math.random() * 20 + 5),
        pendingSubmissions: Math.floor(Math.random() * 20 + 5)
      };

      console.log('📊 Calculated stats:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        totalCourses: 0,
        totalStudents: 0,
        totalMaterials: 0,
        activeQuizzes: 0,
        completionRate: 0,
        activeUsers: 0,
        newEnrollments: 0,
        pendingSubmissions: 0
      };
    }
  }
};

export default {
  courseAPI,
  materialAPI,
  userAPI,
  authAPI,
  statsAPI,
  quizAPI
};

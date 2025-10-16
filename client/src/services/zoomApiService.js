// Zoom API Service using the same pattern as other API services
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
    error.status = response.status;
    error.response = errorData;
    throw error;
  }
  return response.json();
};

// Zoom API
export const zoomAPI = {
  // Get all Zoom meetings for a teacher
  getMeetings: async (params = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching Zoom meetings:', error);
      throw error;
    }
  },

  // Get a specific Zoom meeting
  getMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching Zoom meeting:', error);
      throw error;
    }
  },

  // Create a new Zoom meeting
  createMeeting: async (meetingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      throw error;
    }
  },

  // Update a Zoom meeting
  updateMeeting: async (meetingId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating Zoom meeting:', error);
      throw error;
    }
  },

  // Delete a Zoom meeting
  deleteMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting Zoom meeting:', error);
      throw error;
    }
  },

  // Start a Zoom meeting
  startMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}/start`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error starting Zoom meeting:', error);
      throw error;
    }
  },

  // End a Zoom meeting
  endMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}/end`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error ending Zoom meeting:', error);
      throw error;
    }
  },

  // Join a Zoom meeting
  joinMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}/join`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error joining Zoom meeting:', error);
      throw error;
    }
  },

  // Update attendance (join/leave)
  updateAttendance: async (meetingId, attendanceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}/attendance`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  // Get attendance records for a meeting
  getAttendance: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/meetings/${meetingId}/attendance`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Get SDK signature for Zoom Web SDK
  getSDKSignature: async (meetingId, role = 0) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zoom/sdk-signature/${meetingId}?role=${role}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error getting SDK signature:', error);
      throw error;
    }
  }
};

// Create a service object that matches the expected interface
class ZoomApiService {
  async getMeetings(params = {}) {
    // Use test route for now to bypass authentication
    return await zoomAPI.getMeetings(params);
  }

  async getMeeting(meetingId) {
    return await zoomAPI.getMeeting(meetingId);
  }

  async createMeeting(meetingData) {
    // Use test route for now to bypass authentication
    return await zoomAPI.createMeeting(meetingData);
  }

  async updateMeeting(meetingId, updateData) {
    return await zoomAPI.updateMeeting(meetingId, updateData);
  }

  async deleteMeeting(meetingId) {
    return await zoomAPI.deleteMeeting(meetingId);
  }

  async startMeeting(meetingId) {
    return await zoomAPI.startMeeting(meetingId);
  }

  async endMeeting(meetingId) {
    return await zoomAPI.endMeeting(meetingId);
  }

  async joinMeeting(meetingId) {
    return await zoomAPI.joinMeeting(meetingId);
  }

  async updateAttendance(meetingId, attendanceData) {
    return await zoomAPI.updateAttendance(meetingId, attendanceData);
  }

  async getAttendance(meetingId) {
    return await zoomAPI.getAttendance(meetingId);
  }

  async getSDKSignature(meetingId, role = 0) {
    return await zoomAPI.getSDKSignature(meetingId, role);
  }
}

export default new ZoomApiService();

import React, { createContext, useState, useCallback } from "react";
import { getAuthHeaders, API_BASE_URL } from "../utils/adminApiUtils";

/**
 * AdminContext - Global state management for Admin Dashboard
 * Provides shared state and functions across all admin components
 */
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Auth and User State
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    completionRate: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    newApplications: 0,
    upcomingEvents: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalHomework: 0,
    totalQuizzes: 0,
    totalListeningExercises: 0,
    totalEnrollments: 0,
    newEnrollmentsThisMonth: 0,
    activeEnrollments: 0,
    pendingEnrollments: 0,
  });

  // Common Fetch Functions
  const fetchDashboardStats = useCallback(async (dependencies) => {
    try {
      const authHeaders = getAuthHeaders();
      const {
        students = [],
        courses = [],
        teachers = [],
        applications = [],
        contactMessages = [],
        materials = [],
        enrollments = [],
        progressRecords = [],
      } = dependencies;

      const [quizzesRes, homeworkRes, listeningRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/quizzes`, { headers: authHeaders }).catch(
          () => ({ ok: false })
        ),
        fetch(`${API_BASE_URL}/api/homework`, { headers: authHeaders }).catch(
          () => ({ ok: false })
        ),
        fetch(`${API_BASE_URL}/api/listening-exercises`, {
          headers: authHeaders,
        }).catch(() => ({ ok: false })),
      ]);

      const quizzesData = quizzesRes.ok ? await quizzesRes.json() : {};
      const homeworkData = homeworkRes.ok ? await homeworkRes.json() : {};
      const listeningData = listeningRes.ok ? await listeningRes.json() : {};

      const quizzesArray = Array.isArray(quizzesData)
        ? quizzesData
        : quizzesData.quizzes || [];
      const homeworkArray = Array.isArray(homeworkData)
        ? homeworkData
        : homeworkData.homework || [];
      const listeningArray = Array.isArray(listeningData)
        ? listeningData
        : listeningData.exercises || [];

      const stats = {
        totalCourses: courses.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalApplications: applications.length,
        pendingApplications: applications.filter((a) => a.status === "pending")
          .length,
        approvedApplications: applications.filter(
          (a) => a.status === "approved"
        ).length,
        rejectedApplications: applications.filter(
          (a) => a.status === "rejected"
        ).length,
        totalMessages: contactMessages.length,
        unreadMessages: contactMessages.filter((m) => m.status === "pending")
          .length,
        totalMaterials: materials.length,
        totalHomework: homeworkArray.length,
        totalQuizzes: quizzesArray.length,
        totalListeningExercises: listeningArray.length,
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter((e) => e.status === "active")
          .length,
        completionRate: 75,
        pendingSubmissions: 8,
        activeQuizzes: quizzesArray.length,
        newEnrollmentsThisMonth: 0,
        pendingEnrollments: 0,
      };

      setDashboardStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  }, []);

  // Notification Functions
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const notificationsList = data.notifications || data || [];
        setNotifications(notificationsList);
        const unread = notificationsList.filter((n) => !n.read).length;
        setUnreadCount(unread);
        return notificationsList;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif.id !== notificationId)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

  const value = {
    // Auth State
    currentUser,
    setCurrentUser,
    loading,
    setLoading,

    // Notifications
    notifications,
    setNotifications,
    notificationVisible,
    setNotificationVisible,
    unreadCount,
    setUnreadCount,

    // Dashboard Stats
    dashboardStats,
    setDashboardStats,

    // Functions
    fetchDashboardStats,
    fetchNotifications,
    markNotificationAsRead,
    deleteNotification,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;

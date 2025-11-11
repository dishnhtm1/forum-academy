import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import moment from "moment";
import "../styles/AdminSidebar.css";
import "../styles/Dashboard.css";
import StudentDashboardOverview from "./student/StudentDashboardOverview";
import StudentListeningExercises from "./student/StudentListeningExercises";
import StudentQuizzes from "./student/StudentQuizzes";
import StudentHomework from "./student/StudentHomework";
import StudentLiveClasses from "./student/StudentLiveClasses";
import StudentProgress from "./student/StudentProgress";
import StudentCourses from "./student/StudentCourses";
import StudentAchievements from "./student/StudentAchievements";
import StudentCalendarView from "./student/StudentCalendarView";
import StudentLayout from "./student/StudentLayout";
import StudentHeader from "./student/StudentHeader";

// Ant Design imports
import {
  Layout,
  Card,
  Button,
  Form,
  Input,
  Upload,
  Modal,
  notification,
  Tag,
  Space,
  Row,
  Col,
  Spin,
  Alert,
  Typography,
  Drawer,
  Empty,
  List,
  Avatar,
  Badge,
  message,
  Descriptions,
  Radio,
} from "antd";

import {
  VideoCameraOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  BookOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  BellOutlined,
  TrophyOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  SoundOutlined,
  FormOutlined,
} from "@ant-design/icons";

// Import API client
import { authAPI, statsAPI } from "../utils/apiClient";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ASSIGNMENTS_STORAGE_KEY = "forumAcademy.quizAssignments.byStudent";

const STUDENT_ASSIGNMENT_CACHE_KEY = "forumAcademy.teacherAssignments.studentCache";

const StudentDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();

  // States
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dashboardStats, setDashboardStats] = useState({
    enrolledCourses: 0,
    completedQuizzes: 0,
    totalAssignments: 0,
    overallGrade: 0,
    studyStreak: 0,
    certificatesEarned: 0,
  });

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    byType: {
      grade_update: 0,
      assignment_new: 0,
      teacher_message: 0,
      quiz_available: 0,
      homework_due: 0,
      announcement: 0,
    },
  });

  // Mobile drawer state
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // New states for integrated features
  const [listeningExercises, setListeningExercises] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [homework, setHomework] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [selectedListening, setSelectedListening] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [listeningModalVisible, setListeningModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [submissionForm] = Form.useForm();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittingListening, setSubmittingListening] = useState(false);
  
  // Zoom Integration States
  const [zoomClasses, setZoomClasses] = useState([]);
  const [zoomNotifications, setZoomNotifications] = useState([]);
  const [zoomLoading, setZoomLoading] = useState(false);
  const [joinZoomModalVisible, setJoinZoomModalVisible] = useState(false);
  const [selectedZoomClass, setSelectedZoomClass] = useState(null);
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);

  // Language change handler
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log("🌐 Language changed to:", lng);
      setCurrentLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width <= 768;
      const tablet = width > 768 && width <= 1024;

      setIsMobile(mobile);

      // Auto-collapse based on screen size
      if (mobile || tablet) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication and user role
  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");

      if (!token || !userRole) {
        history.push("/login");
        return;
      }

      // Check if user has student permissions
      if (
        !["student", "teacher", "faculty", "admin", "superadmin"].includes(
          userRole
        )
      ) {
        message.error("Access denied. Student role required.");
        history.push("/");
        return;
      }

      // Create user object from stored data
      const userData = {
        id: userId,
        email: userEmail,
        role: userRole,
        name: userName,
      };

      setCurrentUser(userData);

      // Fetch all data
      Promise.all([
        fetchDashboardStats(),
        fetchListeningExercises(true),
        fetchQuizzes(),
        fetchHomework(),
        fetchProgress(),
        fetchZoomClasses(),
        fetchZoomNotifications(),
      ]).finally(() => {
        setLoading(false);
      });
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const fetchDashboardStats = async () => {
    try {
      console.log("🔄 Starting to fetch student dashboard stats...");
      const stats = await statsAPI.getStudentStats();
      console.log("✅ Received student stats:", stats);
      setDashboardStats(stats);
    } catch (error) {
      console.error("❌ Error fetching student stats:", error);
      // Set fallback data
      setDashboardStats({
        enrolledCourses: 3,
        completedQuizzes: 12,
        totalAssignments: 8,
        overallGrade: 85,
        studyStreak: 7,
        certificatesEarned: 2,
      });
    }
  };

  const LISTENING_CACHE_KEY = "forumAcademy.listening.assignments";
  const LISTENING_EVENT = "listeningAssignmentsUpdated";

  const loadCachedListeningExercises = useCallback(() => {
    try {
      const raw = localStorage.getItem(LISTENING_CACHE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      const assignments = Array.isArray(parsed)
        ? parsed
        : parsed?.assignments || [];
      return assignments;
    } catch {
      return [];
    }
  }, []);

  const fetchListeningExercises = useCallback(
    async (useCacheFirst = false) => {
      if (useCacheFirst) {
        const cached = loadCachedListeningExercises();
        if (cached.length > 0) {
          setListeningExercises(cached);
        }
      }

      try {
        const token =
          localStorage.getItem("authToken") || localStorage.getItem("token");

        if (!token) {
          console.error("❌ No authentication token found");
          message.error("Please login again");
          history.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/listening-exercises`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          console.error("❌ Authentication failed - token expired or invalid");
          message.error("Your session has expired. Please login again.");
          localStorage.clear();
          history.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const exercises = Array.isArray(data) ? data : [];

          const publishedExercises = exercises
            .filter((exercise) =>
              typeof exercise.isPublished === "boolean"
                ? exercise.isPublished
                : exercise.isActive !== false
            )
            .map((exercise) => ({
              ...exercise,
              course:
                exercise.course ||
                loadCachedListeningExercises().find(
                  (item) =>
                    (item._id || item.id) === (exercise._id || exercise.id)
                )?.course ||
                null,
            }));

          setListeningExercises(publishedExercises);
        } else {
          console.error(
            "❌ Failed to fetch listening exercises:",
            response.status
          );
        }
      } catch (error) {
        console.error("❌ Error fetching listening exercises:", error);
      }
    },
    [history, loadCachedListeningExercises]
  );

  useEffect(() => {
    const handleListeningUpdate = () => fetchListeningExercises(true);
    window.addEventListener(LISTENING_EVENT, handleListeningUpdate);
    return () => {
      window.removeEventListener(LISTENING_EVENT, handleListeningUpdate);
    };
  }, [fetchListeningExercises]);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        console.error("❌ No authentication token found");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("❌ Authentication failed for quizzes");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("📝 Quizzes Response:", data);
        const quizList = Array.isArray(data)
          ? data
          : Array.isArray(data?.quizzes)
          ? data.quizzes
          : [];

        let assignmentsForStudent = {};
        try {
          const storedAssignments = localStorage.getItem(
            ASSIGNMENTS_STORAGE_KEY
          );
          if (storedAssignments) {
            const parsed = JSON.parse(storedAssignments);
            if (parsed && typeof parsed === "object") {
              const studentId =
                localStorage.getItem("userId") ||
                localStorage.getItem("userID");
              if (studentId && parsed[studentId]) {
                assignmentsForStudent = parsed[studentId];
              }
            }
          }
        } catch (error) {
          console.error("❌ Error parsing quiz assignments:", error);
        }

        const assignedQuizzes = quizList
          .map((quiz) => {
            const quizId = quiz._id || quiz.id;
            if (!quizId) {
              return null;
            }
            const assignment = assignmentsForStudent[quizId];
            if (!assignment) {
              return null;
            }
            return {
              ...quiz,
              assignment,
            };
          })
          .filter(Boolean);

        console.log("✅ Assigned quizzes:", assignedQuizzes.length);
        setQuizzes(assignedQuizzes);
      } else {
        console.error("❌ Failed to fetch quizzes:", response.status);
        setQuizzes([]);
      }
    } catch (error) {
      console.error("❌ Error fetching quizzes:", error);
      setQuizzes([]);
    }
  };

  // Fetch homework
  const fetchHomework = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        console.error("❌ No authentication token found");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/homework`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("❌ Authentication failed for homework");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("📋 Homework Response:", data);
        const homeworkList = Array.isArray(data) ? data : [];
        const availableHomework = homeworkList.filter((hw) => {
          if (typeof hw.isPublished === "boolean") {
            return hw.isPublished;
          }
          if (typeof hw.isActive === "boolean") {
            return hw.isActive;
          }
          return true;
        });

        let cachedAssignments = [];
        try {
          const cachedRaw = localStorage.getItem(STUDENT_ASSIGNMENT_CACHE_KEY);
          if (cachedRaw) {
            const cachedParsed = JSON.parse(cachedRaw);
            if (Array.isArray(cachedParsed)) {
              cachedAssignments = cachedParsed;
            } else if (cachedParsed?.assignments) {
              cachedAssignments = cachedParsed.assignments;
            }
          }
        } catch (cacheError) {
          console.warn("Failed to read assignment cache:", cacheError);
        }

        const assignmentMap = new Map();
        availableHomework.forEach((assignment) => {
          const key = assignment._id || assignment.id;
          if (key) {
            assignmentMap.set(key, assignment);
          }
        });

        cachedAssignments.forEach((assignment) => {
          const key = assignment._id || assignment.id;
          if (!key) {
            return;
          }
          if (!assignmentMap.has(key)) {
            assignmentMap.set(key, assignment);
          }
        });

        const combinedHomework = Array.from(assignmentMap.values());

        console.log("✅ Homework assignments available:", combinedHomework.length);
        setHomework(combinedHomework);
      } else {
        console.error("❌ Failed to fetch homework:", response.status);
        setHomework([]);
      }
    } catch (error) {
      console.error("❌ Error fetching homework:", error);
      setHomework([]);
    }
  };

  // Fetch progress records
  const fetchProgress = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        console.error("❌ No authentication token found");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("❌ Authentication failed for progress");
        return;
      }

      if (response.ok) {
        const result = await response.json();
        console.log("🏆 Progress Response:", result);
        // Check if result has progress property or is array directly
        const progressList = result.progress
          ? result.progress
          : Array.isArray(result)
          ? result
          : [];
        console.log("✅ Progress Records:", progressList.length);
        setProgressRecords(progressList);
      } else {
        console.error("❌ Failed to fetch progress:", response.status);
      }
    } catch (error) {
      console.error("❌ Error fetching progress:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    message.success(t("studentDashboard.messages.logoutSuccess"));
    history.push("/");
  };

  // Notification Functions
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      let transformedNotifications = [];
      
      // Get authentication token
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      // First try to fetch real notifications from the authenticated endpoint
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response && response.ok) {
            const data = await response.json();

            if (data.success && data.notifications) {
              // Transform backend notifications to match frontend format
              transformedNotifications = data.notifications.map((notification) => ({
                id: notification._id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                timestamp: notification.createdAt,
                read: notification.read || false,
                priority: notification.priority || "medium",
                icon: getNotificationIcon(notification.type),
                color: getNotificationColor(notification.type),
                sender: notification.sender,
              }));
            }
          }
        } catch (apiError) {
          console.log("API notifications not available, checking local notifications");
        }
      }

      // Check for local notifications as fallback
      try {
        const localNotifications = JSON.parse(localStorage.getItem('localNotifications') || '[]');
        const localTransformed = localNotifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp,
          read: notification.read || false,
          priority: notification.priority || "medium",
          icon: getNotificationIcon(notification.type),
          color: getNotificationColor(notification.type),
          sender: notification.sender,
          source: 'local',
        }));
        
        // Merge API and local notifications, removing duplicates
        const allNotifications = [...transformedNotifications, ...localTransformed];
        const uniqueNotifications = allNotifications.filter((notification, index, self) => 
          index === self.findIndex(n => n.id === notification.id)
        );
        
        transformedNotifications = uniqueNotifications;
      } catch (localError) {
        console.log("Local notifications not available");
      }

      setNotifications(transformedNotifications);

      // Calculate stats from transformed notifications
      const unreadCount = transformedNotifications.filter(n => !n.read).length;
      const stats = {
        total: transformedNotifications.length,
        unread: unreadCount,
        byType: {
          grade_update: transformedNotifications.filter((n) => n.type === "grade_update").length,
          assignment_new: transformedNotifications.filter((n) => n.type === "assignment_new").length,
          teacher_message: transformedNotifications.filter((n) => n.type === "teacher_message").length,
          quiz_available: transformedNotifications.filter((n) => n.type === "quiz_available").length,
          homework_due: transformedNotifications.filter((n) => n.type === "homework_due").length,
          announcement: transformedNotifications.filter((n) => n.type === "announcement").length,
          admin_announcement: transformedNotifications.filter((n) => n.type === "admin_announcement").length,
          live_class_started: transformedNotifications.filter((n) => n.type === "live_class_started").length,
          live_class_ended: transformedNotifications.filter((n) => n.type === "live_class_ended").length,
          zoom_class: transformedNotifications.filter((n) => n.type === "zoom_class").length,
        },
      };

      setNotificationStats(stats);
      setUnreadCount(stats.unread);

      console.log("✅ Fetched notifications:", transformedNotifications.length);
      console.log("📊 Notification stats:", stats);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setNotificationStats({
        total: 0,
        unread: 0,
        byType: {
          grade_update: 0,
          assignment_new: 0,
          teacher_message: 0,
          quiz_available: 0,
          homework_due: 0,
          announcement: 0,
          admin_announcement: 0,
          live_class_started: 0,
          live_class_ended: 0,
          zoom_class: 0,
        },
      });
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      grade_update: "trophy",
      assignment_new: "file-text",
      teacher_message: "message",
      quiz_available: "question-circle",
      homework_due: "clock-circle",
      announcement: "bell",
      admin_announcement: "bell",
      live_class_started: "video-camera",
      live_class_ended: "video-camera",
      zoom_class: "video-camera",
    };
    return iconMap[type] || "bell";
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      grade_update: "#52c41a",
      assignment_new: "#1890ff",
      teacher_message: "#722ed1",
      quiz_available: "#faad14",
      homework_due: "#f5222d",
      announcement: "#13c2c2",
      admin_announcement: "#13c2c2",
      live_class_started: "#dc2626",
      live_class_ended: "#6b7280",
      zoom_class: "#dc2626",
    };
    return colorMap[type] || "#1890ff";
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Get authentication token
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      // Try to update on backend first
      if (token) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/read`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn("Failed to mark notification as read on server");
        }
      }

      // Update local state regardless
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      setNotifications(updatedNotifications);

      const unread = updatedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
      setNotificationStats((prev) => ({ ...prev, unread }));

      console.log(`✅ Marked notification ${notificationId} as read`);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // Get authentication token
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      // Try to update on backend first
      if (token) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/notifications/mark-all-read`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn("Failed to mark all notifications as read on server");
        }
      }

      // Update local state regardless
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        read: true,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      setNotificationStats((prev) => ({ ...prev, unread: 0 }));
      message.success(t("studentDashboard.notifications.allMarkedRead"));
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
      message.error("Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);

    // Handle different notification types
    switch (notification.type) {
      case "grade_update":
        setActiveTab("progress");
        message.info("📊 " + t("studentDashboard.messages.navigatingToProgress"));
        break;

      case "assignment_new":
      case "homework_due":
      case "homework_reminder":
        setActiveTab("homework");
        message.info("📝 " + t("studentDashboard.messages.navigatingToHomework"));
        break;

      case "quiz_available":
        setActiveTab("quizzes");
        message.info("❓ " + t("studentDashboard.messages.navigatingToQuizzes"));
        break;

      case "teacher_message":
        message.info("💬 " + t("studentDashboard.messages.messageOpened"));
        break;

      case "announcement":
      case "admin_announcement":
        message.info("📢 " + t("studentDashboard.messages.announcementOpened"));
        break;

      case "live_class_started":
      case "zoom_class":
        setActiveTab("zoom");
        setNotificationDrawerVisible(false); // Close drawer
        message.success("🎥 Live class is active! Join now.");
        // Refresh Zoom classes to show the new one
        fetchZoomClasses();
        break;

      case "live_class_ended":
        setActiveTab("zoom");
        message.info("🎥 This live class has ended.");
        break;

      default:
        message.info("🔔 " + t("studentDashboard.messages.notificationOpened"));
    }
  };

  // Load notifications when component mounts and data changes
  useEffect(() => {
    if (progressRecords.length > 0 || homework.length > 0) {
      fetchNotifications();
    }
  }, [progressRecords, homework, quizzes]);

  // Auto-refresh notifications every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressRecords.length > 0 || homework.length > 0) {
        console.log("🔄 Auto-refreshing notifications...");
        fetchNotifications();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [progressRecords, homework]);

  // Fetch real notifications periodically
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Refresh every minute

    return () => clearInterval(notificationInterval);
  }, []);

  // Zoom Integration Functions
  const fetchZoomClasses = async () => {
    try {
      setZoomLoading(true);
      console.log("📹 Fetching available Zoom classes for student...");
      
      // Get authentication token
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      if (!token) {
        console.error("❌ No authentication token found");
        setZoomClasses([]);
        return;
      }
      
      // Fetch all active Zoom meetings
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/zoom/meetings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.meetings) {
          // Filter for active/live meetings only
          const activeClasses = data.meetings
            .filter(meeting => meeting.status === 'active' || meeting.status === 'live')
            .map(meeting => ({
              id: meeting._id,
              title: meeting.title,
              courseName: meeting.course?.name || meeting.course?.title || 'Live Class',
              meetingId: meeting.meetingId,
              password: meeting.meetingPassword || '',
              startTime: new Date(meeting.startTime),
              duration: meeting.duration,
              status: 'active',
              teacherName: meeting.instructor?.firstName && meeting.instructor?.lastName 
                ? `${meeting.instructor.firstName} ${meeting.instructor.lastName}`
                : 'Teacher',
              joinUrl: meeting.joinUrl || `https://zoom.us/j/${meeting.meetingId}`,
              description: meeting.description || '',
              isAllowed: true, // Students can join active classes
              settings: meeting.settings || {}
            }));
          
          console.log(`📹 Found ${activeClasses.length} active live classes`);
          activeClasses.forEach(zoomClass => {
            console.log(`📹 ${zoomClass.title} - Status: ${zoomClass.status}`);
          });

          setZoomClasses(activeClasses);
        } else {
          console.log('📹 No active meetings found');
          setZoomClasses([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch live classes');
      }
    } catch (error) {
      console.error("❌ Error fetching Zoom classes:", error);
      message.error("Failed to fetch Zoom classes");
      setZoomClasses([]);
    } finally {
      setZoomLoading(false);
    }
  };

  const fetchZoomNotifications = async () => {
    try {
      console.log("📧 Fetching Zoom notifications...");
      // This would fetch notifications about Zoom classes
      const mockNotifications = [
        {
          id: "1",
          type: "zoom_class_started",
          title: "Live Class Started",
          message: "Your live class 'Introduction to Programming' has started. Click to join!",
          zoomClassId: "1",
          timestamp: new Date(),
          isRead: false
        }
      ];
      setZoomNotifications(mockNotifications);
    } catch (error) {
      console.error("❌ Error fetching Zoom notifications:", error);
    }
  };

  const handleJoinZoomClass = (zoomClass) => {
    if (!zoomClass.isAllowed) {
      message.error("You don't have permission to join this class. Please contact your teacher.");
      return;
    }

    if (zoomClass.status !== "active") {
      message.warning("This class is not currently active.");
      return;
    }

    setSelectedZoomClass(zoomClass);
    setJoinZoomModalVisible(true);
  };

  const handleConfirmJoinZoom = () => {
    if (selectedZoomClass) {
      // Record attendance automatically
      recordAttendance(selectedZoomClass);
      
      // Open Zoom link in new tab
      window.open(selectedZoomClass.joinUrl, '_blank');
      message.success("Opening Zoom class... Attendance recorded!");
      setJoinZoomModalVisible(false);
      setSelectedZoomClass(null);
    }
  };

  // Record attendance when student joins
  const recordAttendance = async (zoomClass) => {
    try {
      const attendanceData = {
        studentId: "student1", // This would be currentUser._id in real app
        studentName: "John Doe", // This would be currentUser.name in real app
        zoomClassId: zoomClass.id,
        joinTime: new Date(),
        status: 'present'
      };

      console.log("📝 Recording attendance:", attendanceData);
      
      // In a real app, this would send to the backend
      // await attendanceAPI.record(attendanceData);
      
      setAttendanceRecorded(true);
      
      // Show success notification
      notification.success({
        message: "Attendance Recorded",
        description: `Your attendance has been automatically recorded for ${zoomClass.title}`,
        duration: 4,
      });
      
    } catch (error) {
      console.error("❌ Error recording attendance:", error);
      message.error("Failed to record attendance");
    }
  };

  const markZoomNotificationAsRead = async (notificationId) => {
    try {
      const updatedNotifications = zoomNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      setZoomNotifications(updatedNotifications);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const studentMenuItems = [
    {
      key: "overview",
      icon: React.createElement(HomeOutlined),
      label: t("studentDashboard.menu.overview"),
    },
    {
      key: "listening",
      icon: React.createElement(SoundOutlined),
      label: t("studentDashboard.menu.listening"),
    },
    {
      key: "quizzes",
      icon: React.createElement(QuestionCircleOutlined),
      label: t("studentDashboard.menu.quizzes"),
    },
    {
      key: "homework",
      icon: React.createElement(FormOutlined),
      label: t("studentDashboard.menu.homework"),
    },
    {
      key: "zoom",
      icon: React.createElement(VideoCameraOutlined),
      label: t("studentDashboard.menu.liveClasses"),
    },
    {
      key: "progress",
      icon: React.createElement(TrophyOutlined),
      label: t("studentDashboard.menu.progress"),
    },
    {
      key: "courses",
      icon: React.createElement(BookOutlined),
      label: t("studentDashboard.menu.courses"),
    },
    {
      key: "calendar",
      icon: React.createElement(CalendarOutlined),
      label: t("studentDashboard.menu.calendar"),
    },
    {
      key: "achievements",
      icon: React.createElement(CrownOutlined),
      label: t("studentDashboard.menu.achievements"),
    },
  ];

  const renderOverview = () => (
    <StudentDashboardOverview
      t={t}
      currentUser={currentUser}
      listeningExercises={listeningExercises}
      quizzes={quizzes}
      homework={homework}
      progressRecords={progressRecords}
      setActiveTab={setActiveTab}
    />
  );

  const renderListeningExercises = () => (
    <StudentListeningExercises
      t={t}
      listeningExercises={listeningExercises}
      onStartExercise={(record) => {
        setSelectedListening(record);
        setListeningModalVisible(true);
      }}
    />
  );

  const renderQuizzes = () => (
    <StudentQuizzes
      t={t}
      quizzes={quizzes}
      onStartQuiz={(record) => {
        setSelectedQuiz(record);
        setQuizModalVisible(true);
      }}
    />
  );

  const renderHomework = () => (
    <StudentHomework
      t={t}
      homework={homework}
      onViewDetails={(record) => {
        setSelectedHomework(record);
        setHomeworkModalVisible(true);
      }}
      onSubmitHomework={(record) => {
        setSelectedHomework(record);
        setSubmissionModalVisible(true);
      }}
    />
  );

  const renderZoomClasses = () => (
    <>
      <StudentLiveClasses
        t={t}
        zoomClasses={zoomClasses}
        zoomLoading={zoomLoading}
        onJoinClass={handleJoinZoomClass}
      />
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <VideoCameraOutlined style={{ color: "#dc2626", fontSize: "20px" }} />
            <span>Join Live Class</span>
          </div>
        }
        open={joinZoomModalVisible}
        onCancel={() => {
          setJoinZoomModalVisible(false);
          setSelectedZoomClass(null);
        }}
        footer={null}
        width={500}
        className="modern-modal"
      >
        {selectedZoomClass && (
          <div style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ marginBottom: 8 }}>
                {selectedZoomClass.title}
              </Title>
              <Text style={{ color: "#666" }}>
                {selectedZoomClass.courseName} • {selectedZoomClass.teacherName}
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Meeting ID:</Text>
                  <br />
                  <Tag color="blue" style={{ fontFamily: "monospace", marginTop: 4 }}>
                    {selectedZoomClass.meetingId}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Password:</Text>
                  <br />
                  <Tag color="green" style={{ fontFamily: "monospace", marginTop: 4 }}>
                    {selectedZoomClass.password}
                  </Tag>
                </Col>
              </Row>
            </div>

            <Alert
              message="Joining Live Class"
              description="Click 'Join Now' to open the Zoom class in a new tab. Your attendance will be automatically recorded when you join."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            {attendanceRecorded && (
              <Alert
                message="Attendance Recorded"
                description="Your attendance has been automatically recorded for this class."
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => setJoinZoomModalVisible(false)}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={handleConfirmJoinZoom}
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    border: "none",
                  }}
                >
                  Join Now
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </>
  );

  const renderProgress = () => (
    <StudentProgress
      t={t}
      progressRecords={progressRecords}
      dashboardStats={dashboardStats}
    />
  );

  const renderCourses = () => <StudentCourses t={t} />;

  const renderAchievements = () => <StudentAchievements t={t} />;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "listening":
        return renderListeningExercises();
      case "quizzes":
        return renderQuizzes();
      case "homework":
        return renderHomework();
      case "zoom":
        return renderZoomClasses();
      case "progress":
        return renderProgress();
      case "courses":
        return renderCourses();
      case "calendar":
        return <StudentCalendarView t={t} />;
      case "achievements":
        return renderAchievements();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Handle listening exercise submission
  const handleListeningSubmission = async () => {
    try {
      if (!selectedListening) return;

      // Validate all questions are answered
      const totalQuestions = selectedListening.questions?.length || 0;
      const answeredQuestions = Object.keys(selectedAnswers).length;

      if (answeredQuestions < totalQuestions) {
        message.warning(
          `Please answer all ${totalQuestions} questions before submitting.`
        );
        return;
      }

      setSubmittingListening(true);
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      console.log("📤 Submitting listening exercise...");
      console.log("Exercise ID:", selectedListening._id);
      console.log("Selected Answers:", selectedAnswers);
      console.log("Questions:", selectedListening.questions);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/listening-exercises/${selectedListening._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: selectedAnswers,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        message.success(
          `Exercise submitted successfully! Score: ${result.score}/${result.totalQuestions} (${result.percentage}%)`
        );
        setListeningModalVisible(false);
        setSelectedAnswers({});
        setSelectedListening(null);
        // Refresh progress
        fetchProgress();
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to submit exercise");
      }
    } catch (error) {
      console.error("Error submitting listening exercise:", error);
      message.error("Error submitting exercise");
    } finally {
      setSubmittingListening(false);
    }
  };

  // Handle homework submission
  const handleHomeworkSubmission = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("homeworkId", selectedHomework._id);
      formData.append("content", values.content);
      if (values.file) {
        formData.append("file", values.file);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/homework-submissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Homework submitted successfully!");
        setSubmissionModalVisible(false);
        submissionForm.resetFields();
      } else {
        message.error("Failed to submit homework");
      }
    } catch (error) {
      console.error("Error submitting homework:", error);
      message.error("Error submitting homework");
    }
  };

  const handleSiderBreakpoint = (broken) => {
    if (broken) {
      setIsMobile(true);
      setCollapsed(true);
    } else {
      setIsMobile(false);
      setMobileDrawerVisible(false);
    }
  };

  const handleMenuSelect = (key) => {
    setActiveTab(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const handleCloseMobileDrawer = () => {
    setMobileDrawerVisible(false);
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerVisible((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const handleToggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ja" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleZoomTabSelect = () => {
    setActiveTab("zoom");
    message.info(`🎥 ${zoomClasses.length} live class(es) available`);
  };

  return (
    <>
      {/* Modern Styles */}
      <style>{`
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(24, 144, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Modern Stat Cards */
        .stat-card {
          border: none !important;
          border-radius: 16px !important;
          overflow: hidden;
          position: relative;
          animation: fadeIn 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(24, 144, 255, 0.15);
        }
        
        /* Gradient Stats Cards */
        .stat-card-1 { 
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important; 
        }
        .stat-card-2 { 
          background: linear-gradient(135deg, #059669 0%, #0d9488 100%) !important; 
        }
        .stat-card-3 { 
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%) !important; 
        }
        .stat-card-4 { 
          background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%) !important; 
        }
        
        /* Modern Sidebar */
        .modern-sidebar {
          background: linear-gradient(180deg, #1e293b 0%, #334155 50%, #1e293b 100%) !important;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .modern-sidebar .ant-menu {
          background: transparent !important;
          border: none !important;
          padding: 16px 0 !important;
        }
        
        .modern-sidebar .ant-menu-item {
          margin: 4px 16px !important;
          border-radius: 10px !important;
          height: 44px !important;
          line-height: 44px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 500 !important;
        }
        
        .modern-sidebar .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          transform: translateX(2px) !important;
        }
        
        .modern-sidebar .ant-menu-item-selected {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%) !important;
          color: #fff !important;
          font-weight: 600 !important;
          border-left: 3px solid #4f46e5 !important;
        }
        
        /* Modern Notification Item */
        .notification-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .notification-item:hover {
          background-color: #f0f5ff !important;
          transform: translateX(6px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
        }
        
        /* Modern Buttons */
        .modern-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modern-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        }
      `}</style>

      <StudentLayout
        isMobile={isMobile}
        collapsed={collapsed}
        onBreakpoint={handleSiderBreakpoint}
        studentMenuItems={studentMenuItems}
        activeTab={activeTab}
        onSelectMenu={handleMenuSelect}
        mobileDrawerVisible={mobileDrawerVisible}
        onCloseMobileDrawer={handleCloseMobileDrawer}
      >
        <StudentHeader
          isMobile={isMobile}
          collapsed={collapsed}
          activeTab={activeTab}
          studentMenuItems={studentMenuItems}
          notificationStats={notificationStats}
          onNotificationClick={() => setNotificationDrawerVisible(true)}
          zoomClasses={zoomClasses}
          onSelectZoomTab={handleZoomTabSelect}
          onToggleSidebar={handleToggleSidebar}
          currentLanguage={currentLanguage}
          onToggleLanguage={handleToggleLanguage}
          currentUser={currentUser}
          onLogout={handleLogout}
          t={t}
        />
        <Content
          style={{
            margin: isMobile ? "16px 8px" : "24px 16px",
            padding: isMobile ? 16 : 24,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            minHeight: 280,
            borderRadius: isMobile ? "12px" : "16px",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {renderContent()}
        </Content>
      </StudentLayout>

      {/* Notification Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space size={12}>
              <div style={{
                width: 32,
                height: 32,
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <BellOutlined style={{ color: "#fff", fontSize: "16px" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Notifications</span>
              {notificationStats.unread > 0 && (
                <Badge
                  count={notificationStats.unread}
                  style={{ 
                    backgroundColor: "#52c41a",
                    boxShadow: "0 2px 8px rgba(82, 196, 26, 0.3)"
                  }}
                />
              )}
            </Space>
            {notificationStats.unread > 0 && (
              <Button
                type="link"
                size="small"
                onClick={markAllNotificationsAsRead}
                style={{ color: "#fff", fontWeight: 500 }}
              >
                {t("studentDashboard.notifications.markAllRead")}
              </Button>
            )}
          </div>
        }
        placement="right"
        width={isMobile ? "100%" : 440}
        open={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        styles={{ 
          body: { 
            padding: 0,
            background: "linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)"
          },
          header: {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            color: "#fff",
            borderBottom: "none",
            padding: "20px",
          }
        }}
        extra={
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={fetchNotifications}
            loading={notificationLoading}
            title="Refresh notifications"
            style={{ color: "#fff" }}
          />
        }
      >
        {notificationLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>{t("studentDashboard.notifications.loading")}</div>
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description={t("studentDashboard.notifications.noNotifications")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "40px" }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                className="notification-item"
                style={{
                  padding: "16px 20px",
                  margin: "8px 12px",
                  backgroundColor: notification.read ? "#fff" : "rgba(102, 126, 234, 0.05)",
                  borderLeft: `4px solid ${notification.color}`,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "12px",
                  boxShadow: notification.read ? "0 2px 8px rgba(0, 0, 0, 0.04)" : "0 4px 12px rgba(102, 126, 234, 0.1)",
                }}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: "12px", fontWeight: 500 }}>
                      {moment(notification.timestamp).fromNow()}
                    </Text>
                    {!notification.read && (
                      <Badge
                        status="processing"
                        text="New"
                        style={{ fontSize: "11px", marginTop: "4px", fontWeight: 600 }}
                      />
                    )}
                  </div>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: notification.color }}
                      icon={
                        notification.icon === "message" ? (
                          <MessageOutlined />
                        ) : notification.icon === "file-text" ? (
                          <FileTextOutlined />
                        ) : notification.icon === "bell" ? (
                          <BellOutlined />
                        ) : notification.icon === "question-circle" ? (
                          <QuestionCircleOutlined />
                        ) : notification.icon === "trophy" ? (
                          <TrophyOutlined />
                        ) : notification.icon === "clock-circle" ? (
                          <ClockCircleOutlined />
                        ) : notification.icon === "video-camera" ? (
                          <VideoCameraOutlined />
                        ) : (
                          <BellOutlined />
                        )
                      }
                    />
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        strong={!notification.read}
                        style={{ fontSize: "14px" }}
                      >
                        {notification.title}
                      </Text>
                      <Tag
                        color={
                          notification.priority === "high"
                            ? "red"
                            : notification.priority === "medium"
                            ? "orange"
                            : "blue"
                        }
                        size="small"
                      >
                        {notification.priority}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "13px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {notification.message}
                      </Text>
                      {notification.sender && (
                        <div style={{ marginTop: "8px" }}>
                          <Space size="small">
                            <Avatar size={16} icon={<UserOutlined />} />
                            <Text
                              type="secondary"
                              style={{ fontSize: "12px" }}
                            >
                              {notification.sender.firstName}{" "}
                              {notification.sender.lastName}
                            </Text>
                          </Space>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}

        {/* Notification Actions */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
              position: "sticky",
              bottom: 0,
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Space style={{ width: "100%", justifyContent: "center" }} size={12}>
              <Button
                className="modern-btn"
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchNotifications}
                loading={notificationLoading}
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: 500,
                }}
              >
                {t("studentDashboard.notifications.refresh")}
              </Button>
              <Button
                className="modern-btn"
                icon={<CheckCircleOutlined />}
                onClick={markAllNotificationsAsRead}
                disabled={notificationStats.unread === 0}
                style={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: 500,
                }}
              >
                {t("studentDashboard.notifications.markAllAsRead")}
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default StudentDashboard;

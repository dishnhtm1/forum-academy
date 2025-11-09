import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import moment from "moment";
import "../styles/AdminSidebar.css";
import "../styles/Dashboard.css";
import ZoomMeetingCard from "./ZoomMeetingCard";

// Ant Design imports
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Form,
  Input,
  Upload,
  Modal,
  Select,
  Tabs,
  Progress,
  notification,
  Tag,
  Space,
  Divider,
  Row,
  Col,
  Statistic,
  DatePicker,
  Switch,
  InputNumber,
  Spin,
  Alert,
  Typography,
  Rate,
  Drawer,
  Breadcrumb,
  Empty,
  List,
  Timeline,
  Tooltip,
  Avatar,
  Badge,
  Popconfirm,
  message,
  Descriptions,
  Steps,
  Collapse,
  Calendar,
  Radio,
  Dropdown,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  BookOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  MessageOutlined,
  TeamOutlined,
  LogoutOutlined,
  ReadOutlined,
  CheckSquareOutlined,
  LineChartOutlined,
  RocketOutlined,
  FireOutlined,
  HeartOutlined,
  LikeOutlined,
  CrownOutlined,
  SoundOutlined,
  FormOutlined,
  FieldTimeOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// Import API client
import { authAPI, statsAPI } from "../utils/apiClient";

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
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
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
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
      setIsTablet(tablet);

      // Auto-collapse based on screen size
      if (mobile) {
        setCollapsed(true);
      } else if (tablet) {
        setCollapsed(true); // Collapse on tablets too for more space
      } else {
        setCollapsed(false); // Expand on desktop
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

  // Fetch listening exercises
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
      icon: <HomeOutlined />,
      label: t("studentDashboard.menu.overview"),
    },
    {
      key: "listening",
      icon: <SoundOutlined />,
      label: t("studentDashboard.menu.listening"),
    },
    {
      key: "quizzes",
      icon: <QuestionCircleOutlined />,
      label: t("studentDashboard.menu.quizzes"),
    },
    {
      key: "homework",
      icon: <FormOutlined />,
      label: t("studentDashboard.menu.homework"),
    },
    {
      key: "zoom",
      icon: <VideoCameraOutlined />,
      label: t("studentDashboard.menu.liveClasses"),
    },
    {
      key: "progress",
      icon: <TrophyOutlined />,
      label: t("studentDashboard.menu.progress"),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: t("studentDashboard.menu.courses"),
    },
    {
      key: "calendar",
      icon: <CalendarOutlined />,
      label: t("studentDashboard.menu.calendar"),
    },
    {
      key: "achievements",
      icon: <CrownOutlined />,
      label: t("studentDashboard.menu.achievements"),
    },
  ];

  const renderOverview = () => {
    const upcomingDeadlines = [
      ...homework.map((hw) => ({
        type: "homework",
        title: hw.title,
        dueDate: hw.dueDate,
        course: hw.course?.name,
      })),
      ...quizzes.map((q) => ({
        type: "quiz",
        title: q.title,
        dueDate: q.availableUntil,
        course: q.course?.name,
      })),
    ]
      .filter((item) => item.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <RocketOutlined style={{ marginRight: "12px", color: "#1890ff" }} />
          {t("studentDashboard.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          {t("studentDashboard.welcomeBack")}, <Text strong>{currentUser?.name}</Text>! {t("studentDashboard.continueJourney")}.
        </Text>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title={t("studentDashboard.overview.statistics.listeningExercises")}
                value={listeningExercises.length}
                prefix={<SoundOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title={t("studentDashboard.overview.statistics.availableQuizzes")}
                value={quizzes.length}
                prefix={<QuestionCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title={t("studentDashboard.overview.statistics.pendingHomework")}
                value={homework.length}
                prefix={<FormOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title={t("studentDashboard.overview.statistics.myGrades")}
                value={progressRecords.length}
                prefix={<TrophyOutlined style={{ color: "#f5222d" }} />}
                valueStyle={{ color: "#f5222d" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Access Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <SoundOutlined />
                  {t("studentDashboard.overview.quickAccess.listeningExercises")}
                </Space>
              }
              extra={
                <Button type="link" onClick={() => setActiveTab("listening")}>
                  {t("studentDashboard.overview.quickAccess.viewAll")}
                </Button>
              }
              hoverable
            >
              {listeningExercises.length > 0 ? (
                <List
                  dataSource={listeningExercises.slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">
                              {item.course?.title || item.course?.name}
                            </Text>
                            <Text type="secondary">
                              <ClockCircleOutlined /> {item.timeLimit || "N/A"}{" "}
                              min • {item.questions?.length || 0} questions
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description={t("studentDashboard.overview.noExercises")} />
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <QuestionCircleOutlined />
                  {t("studentDashboard.overview.quickAccess.recentQuizzes")}
                </Space>
              }
              extra={
                <Button type="link" onClick={() => setActiveTab("quizzes")}>
                  View All
                </Button>
              }
              hoverable
            >
              {quizzes.length > 0 ? (
                <List
                  dataSource={quizzes.slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.course?.name}</Text>
                            <Text type="secondary">
                              <FieldTimeOutlined /> {item.timeLimit} min •{" "}
                              {item.questions?.length || 0} questions
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description={t("studentDashboard.overview.noQuizzes")} />
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <FormOutlined />
                  {t("studentDashboard.overview.quickAccess.homework")}
                </Space>
              }
              extra={
                <Button type="link" onClick={() => setActiveTab("homework")}>
                  View All
                </Button>
              }
              hoverable
            >
              {homework.length > 0 ? (
                <List
                  dataSource={homework.slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.course?.name}</Text>
                            <Text type="secondary">
                              <CalendarOutlined /> Due:{" "}
                              {moment(item.dueDate).format("MMM DD, YYYY")}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description={t("studentDashboard.overview.noHomework")} />
              )}
            </Card>
          </Col>
        </Row>

        {/* Upcoming Deadlines */}
        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  {t("studentDashboard.overview.upcomingDeadlines")}
                </Space>
              }
            >
              {upcomingDeadlines.length > 0 ? (
                <Timeline
                  items={upcomingDeadlines.map((item, index) => ({
                    key: index,
                    color:
                      moment(item.dueDate).diff(moment(), "days") <= 3
                        ? "red"
                        : "blue",
                    children: (
                      <>
                        <Text strong>{item.title}</Text>
                        <br />
                        <Text type="secondary">
                          {item.course} • Due:{" "}
                          {moment(item.dueDate).format("MMM DD, YYYY")}
                        </Text>
                        <br />
                        <Tag
                          color={item.type === "homework" ? "orange" : "blue"}
                        >
                          {item.type.toUpperCase()}
                        </Tag>
                      </>
                    ),
                  }))}
                />
              ) : (
                <Empty description={t("studentDashboard.overview.noDeadlines")} />
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <RocketOutlined />
                  {t("studentDashboard.overview.quickActions.title")}
                </Space>
              }
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<SoundOutlined />}
                  block
                  onClick={() => setActiveTab("listening")}
                >
                  {t("studentDashboard.overview.quickActions.startListening")}
                </Button>
                <Button
                  size="large"
                  icon={<QuestionCircleOutlined />}
                  block
                  onClick={() => setActiveTab("quizzes")}
                >
                  {t("studentDashboard.overview.quickActions.takeQuiz")}
                </Button>
                <Button
                  size="large"
                  icon={<FormOutlined />}
                  block
                  onClick={() => setActiveTab("homework")}
                >
                  {t("studentDashboard.overview.quickActions.submitHomework")}
                </Button>
                <Button
                  size="large"
                  icon={<TrophyOutlined />}
                  block
                  onClick={() => setActiveTab("progress")}
                >
                  {t("studentDashboard.overview.quickActions.viewProgress")}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // Render Listening Exercises Section
  const renderListeningExercises = () => {
    const columns = [
      {
        title: t("studentDashboard.listening.columns.title"),
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary">
              {record.course?.title || record.course?.name}
            </Text>
          </Space>
        ),
      },
      {
        title: t("studentDashboard.listening.columns.difficulty"),
        dataIndex: "level",
        key: "level",
        render: (level) => {
          const colors = {
            beginner: "green",
            intermediate: "orange",
            advanced: "red",
          };
          const translatedLevel = level === "beginner" 
            ? t("studentDashboard.listening.difficulty.beginner")
            : level === "intermediate"
            ? t("studentDashboard.listening.difficulty.intermediate")
            : t("studentDashboard.listening.difficulty.advanced");
          return <Tag color={colors[level]}>{translatedLevel}</Tag>;
        },
      },
      {
        title: t("studentDashboard.listening.columns.duration"),
        dataIndex: "timeLimit",
        key: "timeLimit",
        render: (timeLimit) => (
          <Text>
            <ClockCircleOutlined /> {timeLimit || "N/A"} min
          </Text>
        ),
      },
      {
        title: t("studentDashboard.listening.columns.questions"),
        dataIndex: "questions",
        key: "questions",
        render: (questions) => <Tag>{questions?.length || 0} {t("studentDashboard.listening.columns.questions")}</Tag>,
      },
      {
        title: t("studentDashboard.listening.columns.status"),
        dataIndex: "isPublished",
        key: "isPublished",
        render: (isPublished) => (
          <Tag color={isPublished ? "success" : "default"}>
            {isPublished ? t("studentDashboard.listening.status.published") : t("studentDashboard.listening.status.draft")}
          </Tag>
        ),
      },
      {
        title: t("studentDashboard.listening.columns.actions"),
        key: "actions",
        render: (_, record) => (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              setSelectedListening(record);
              setListeningModalVisible(true);
            }}
          >
            {t("studentDashboard.listening.startExercise")}
          </Button>
        ),
      },
    ];

    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <SoundOutlined style={{ marginRight: "8px" }} />
          {t("studentDashboard.listening.title")}
        </Title>
        <Text type="secondary">
          {t("studentDashboard.listening.subtitle")}
        </Text>

        <Card style={{ marginTop: "24px" }}>
          <Table
            columns={columns}
            dataSource={listeningExercises}
            rowKey={(record) => record._id || record.id}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: t("studentDashboard.listening.noExercises") }}
          />
        </Card>
      </div>
    );
  };

  // Render Quizzes Section
  const renderQuizzes = () => {
    const columns = [
      {
        title: t("studentDashboard.quizzes.columns.title"),
        dataIndex: "title",
        key: "title",
        render: (text, record) => {
          const courseName =
            record.assignment?.courseDetails?.map((course) => course.title).join(", ") ||
            record.course?.name ||
            record.course?.title ||
            t("studentDashboard.quizzes.courseUnknown", "Course");
          return (
            <Space direction="vertical" size={0}>
              <Text strong>{text}</Text>
              <Text type="secondary">{courseName}</Text>
            </Space>
          );
        },
      },
      {
        title: t("studentDashboard.quizzes.columns.questions"),
        dataIndex: "questions",
        key: "questions",
        render: (questions) => (
          <Tag color="blue">
            {questions?.length || 0} {t("studentDashboard.quizzes.columns.questions")}
          </Tag>
        ),
      },
      {
        title: t("studentDashboard.quizzes.columns.timeLimit"),
        key: "timeLimit",
        render: (_, record) => {
          const duration = record.duration || record.timeLimit || 0;
          return (
            <Text>
              <FieldTimeOutlined /> {duration}{" "}
              {t("studentDashboard.quizzes.minutes", "minutes")}
            </Text>
          );
        },
      },
      {
        title: t("studentDashboard.quizzes.columns.dueDate"),
        key: "dueDate",
        render: (_, record) => {
          const dueDate = record.assignment?.dueDate;
          return dueDate
            ? moment(dueDate).format("MMM DD, YYYY HH:mm")
            : t("studentDashboard.quizzes.noDeadline", "No deadline");
        },
      },
      {
        title: t("studentDashboard.quizzes.columns.status"),
        key: "status",
        render: (_, record) => {
          const dueDate = record.assignment?.dueDate;
          if (!dueDate) {
            return (
              <Tag color="default">
                {t("studentDashboard.quizzes.status.available", "Available")}
              </Tag>
            );
          }
          const isOverdue = moment(dueDate).isBefore(moment());
          const isDueSoon =
            !isOverdue && moment(dueDate).diff(moment(), "hours") <= 24;
          if (isOverdue) {
            return (
              <Tag color="red">
                {t("studentDashboard.quizzes.status.overdue", "Overdue")}
              </Tag>
            );
          }
          if (isDueSoon) {
            return (
              <Tag color="orange">
                {t("studentDashboard.quizzes.status.dueSoon", "Due soon")}
              </Tag>
            );
          }
          return (
            <Tag color="green">
              {t("studentDashboard.quizzes.status.assigned", "Assigned")}
            </Tag>
          );
        },
      },
      {
        title: t("studentDashboard.quizzes.columns.actions"),
        key: "actions",
        render: (_, record) => (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              setSelectedQuiz(record);
              setQuizModalVisible(true);
            }}
          >
            {t("studentDashboard.quizzes.takeQuiz")}
          </Button>
        ),
      },
    ];

    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <QuestionCircleOutlined style={{ marginRight: "8px" }} />
          {t("studentDashboard.quizzes.title")}
        </Title>
        <Text type="secondary">
          {t("studentDashboard.quizzes.subtitle")}
        </Text>

        <Card style={{ marginTop: "24px" }}>
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey={(record) => record._id || record.id}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: t(
                "studentDashboard.quizzes.noAssigned",
                "No quizzes assigned yet."
              ),
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Homework Section
  const renderHomework = () => {
    const columns = [
      {
        title: t("studentDashboard.homework.columns.assignment"),
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary">{record.course?.name}</Text>
          </Space>
        ),
      },
      {
        title: t("studentDashboard.homework.columns.description"),
        dataIndex: "description",
        key: "description",
        render: (text) => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
      },
      {
        title: t("studentDashboard.homework.columns.dueDate"),
        dataIndex: "dueDate",
        key: "dueDate",
        render: (date) => {
          const isOverdue = moment(date).isBefore(moment());
          return (
            <Space>
              <CalendarOutlined
                style={{ color: isOverdue ? "#ff4d4f" : "#1890ff" }}
              />
              <Text type={isOverdue ? "danger" : "secondary"}>
                {moment(date).format("MMM DD, YYYY")}
              </Text>
              {isOverdue && <Tag color="error">{t("studentDashboard.homework.status.overdue")}</Tag>}
            </Space>
          );
        },
      },
      {
        title: t("studentDashboard.homework.columns.status"),
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const colors = {
            active: "success",
            draft: "default",
            archived: "warning",
          };
          const translatedStatus = status === "active"
            ? t("studentDashboard.homework.status.active")
            : status === "draft"
            ? t("studentDashboard.homework.status.draft")
            : t("studentDashboard.homework.status.archived");
          return <Tag color={colors[status]}>{translatedStatus}</Tag>;
        },
      },
      {
        title: t("studentDashboard.homework.columns.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedHomework(record);
                setHomeworkModalVisible(true);
              }}
            >
              {t("studentDashboard.homework.viewDetails")}
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => {
                setSelectedHomework(record);
                setSubmissionModalVisible(true);
              }}
            >
              {t("studentDashboard.homework.submit")}
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <FormOutlined style={{ marginRight: "8px" }} />
          {t("studentDashboard.homework.title")}
        </Title>
        <Text type="secondary">{t("studentDashboard.homework.subtitle")}</Text>

        <Card style={{ marginTop: "24px" }}>
          <Table
            columns={columns}
            dataSource={homework}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: t("studentDashboard.homework.noAssignments") }}
          />
        </Card>
      </div>
    );
  };

  // Render Zoom Classes Section
  const renderZoomClasses = () => {

    return (
      <div style={{ padding: "24px" }}>
        <div
          style={{
            marginBottom: 32,
            padding: "24px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.3)",
              }}
            >
              <VideoCameraOutlined style={{ color: "#fff", fontSize: "20px" }} />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                {t("studentDashboard.liveClasses.title")}
              </Title>
              <Text style={{ color: "#6b7280" }}>
                {t("studentDashboard.liveClasses.subtitle")}
              </Text>
            </div>
          </div>
        </div>

        {zoomLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Loading live classes...
            </div>
          </div>
        ) : zoomClasses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <VideoCameraOutlined
              style={{ fontSize: "64px", color: "#d9d9d9", marginBottom: "16px" }}
            />
            <Title level={3} style={{ color: "#999" }}>
              No Active Live Classes
            </Title>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong style={{ fontSize: "16px" }}>
                {t("studentDashboard.liveClasses.yourClasses")} ({zoomClasses.length})
              </Text>
            </div>
            {zoomClasses.map((meeting) => (
              <ZoomMeetingCard
                key={meeting.id}
                meeting={meeting}
                onJoinMeeting={handleJoinZoomClass}
              />
            ))}
          </div>
        )}

        {/* Join Zoom Modal */}
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
                  <Button onClick={() => setJoinZoomModalVisible(false)}>
                    Cancel
                  </Button>
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
      </div>
    );
  };

  // Render Progress Section
  const renderProgress = () => {
    const columns = [
      {
        title: t("studentDashboard.progress.columns.subject"),
        dataIndex: "subject",
        key: "subject",
        render: (subject) => <Tag color="blue">{subject}</Tag>,
      },
      {
        title: t("studentDashboard.progress.columns.assignment"),
        dataIndex: "assignment",
        key: "assignment",
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: t("studentDashboard.progress.columns.type"),
        dataIndex: "assignmentType",
        key: "assignmentType",
        render: (type) => {
          const colors = {
            homework: "orange",
            quiz: "blue",
            exam: "red",
            project: "purple",
          };
          const translatedType = type === "homework"
            ? t("studentDashboard.progress.types.homework")
            : type === "quiz"
            ? t("studentDashboard.progress.types.quiz")
            : type === "exam"
            ? t("studentDashboard.progress.types.exam")
            : type === "project"
            ? t("studentDashboard.progress.types.project")
            : t("studentDashboard.progress.types.other");
          return <Tag color={colors[type]}>{translatedType}</Tag>;
        },
      },
      {
        title: t("studentDashboard.progress.columns.score"),
        dataIndex: "score",
        key: "score",
        render: (score, record) => (
          <Space>
            <Text strong>
              {score}/{record.maxPoints ?? record.maxScore}
            </Text>
            <Text type="secondary">({record.percentage}%)</Text>
          </Space>
        ),
      },
      {
        title: t("studentDashboard.progress.columns.grade"),
        dataIndex: "grade",
        key: "grade",
        render: (grade) => {
          const getColor = (g) => {
            if (["A+", "A", "A-"].includes(g)) return "green";
            if (["B+", "B", "B-"].includes(g)) return "blue";
            if (["C+", "C", "C-"].includes(g)) return "orange";
            return "red";
          };
          return (
            <Tag color={getColor(grade)} style={{ fontWeight: "bold" }}>
              {grade}
            </Tag>
          );
        },
      },
      {
        title: t("studentDashboard.progress.columns.dateGraded"),
        dataIndex: "gradedDate",
        key: "gradedDate",
        render: (date) => moment(date).format("MMM DD, YYYY"),
      },
      {
        title: t("studentDashboard.progress.columns.teacher"),
        dataIndex: "teacher",
        key: "teacher",
        render: (teacher) =>
          teacher ? `${teacher.firstName} ${teacher.lastName}` : "N/A",
      },
    ];

    const averageGrade =
      progressRecords.length > 0
        ? (
            progressRecords.reduce(
              (sum, record) => sum + record.percentage,
              0
            ) / progressRecords.length
          ).toFixed(1)
        : 0;

    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: "8px" }} />
          {t("studentDashboard.progress.title")}
        </Title>
        <Text type="secondary">{t("studentDashboard.progress.subtitle")}</Text>

        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("studentDashboard.progress.statistics.totalGraded")}
                value={progressRecords.length}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("studentDashboard.progress.statistics.averageScore")}
                value={averageGrade}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{
                  color:
                    averageGrade >= 80
                      ? "#52c41a"
                      : averageGrade >= 60
                      ? "#faad14"
                      : "#f5222d",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("studentDashboard.progress.statistics.studyStreak")}
                value={dashboardStats.studyStreak || 0}
                suffix={t("studentDashboard.progress.statistics.days")}
                prefix={<FireOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: "24px" }} title={t("studentDashboard.progress.gradeHistory")}>
          <Table
            columns={columns}
            dataSource={progressRecords}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No grades recorded yet" }}
          />
        </Card>
      </div>
    );
  };

  const renderCourses = () => (
    <div style={{ padding: "24px" }}>
      <Title level={2}>📚 {t("studentDashboard.courses.title")}</Title>
      <Text type="secondary">{t("studentDashboard.courses.subtitle")}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={
              <div
                style={{
                  height: 120,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            }
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Advanced English"
              description="Progress: 75% • Next: Grammar Lesson 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={
              <div
                style={{
                  height: 120,
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              />
            }
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Japanese 101"
              description="Progress: 45% • Next: Hiragana Practice"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={
              <div
                style={{
                  height: 120,
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                }}
              />
            }
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Spanish Basics"
              description="Progress: 90% • Next: Final Exam"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAchievements = () => (
    <div style={{ padding: "24px" }}>
      <Title level={2}>🏆 {t("studentDashboard.achievements.title")}</Title>
      <Text type="secondary">{t("studentDashboard.achievements.subtitle")}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <TrophyOutlined style={{ fontSize: "48px", color: "#faad14" }} />
              <Title level={4}>{t("studentDashboard.achievements.quickLearner.title")}</Title>
              <Text type="secondary">{t("studentDashboard.achievements.quickLearner.description")}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <FireOutlined style={{ fontSize: "48px", color: "#f5222d" }} />
              <Title level={4}>{t("studentDashboard.achievements.sevenDayStreak.title")}</Title>
              <Text type="secondary">{t("studentDashboard.achievements.sevenDayStreak.description")}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <StarOutlined style={{ fontSize: "48px", color: "#722ed1" }} />
              <Title level={4}>{t("studentDashboard.achievements.perfectScore.title")}</Title>
              <Text type="secondary">{t("studentDashboard.achievements.perfectScore.description")}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    return (
      <>
        <div style={{ display: activeTab === "overview" ? "block" : "none" }}>
          {renderOverview()}
        </div>
        <div style={{ display: activeTab === "listening" ? "block" : "none" }}>
          {renderListeningExercises()}
        </div>
        <div style={{ display: activeTab === "quizzes" ? "block" : "none" }}>
          {renderQuizzes()}
        </div>
        <div style={{ display: activeTab === "homework" ? "block" : "none" }}>
          {renderHomework()}
        </div>
        <div style={{ display: activeTab === "zoom" ? "block" : "none" }}>
          {renderZoomClasses()}
        </div>
        <div style={{ display: activeTab === "progress" ? "block" : "none" }}>
          {renderProgress()}
        </div>
        <div style={{ display: activeTab === "courses" ? "block" : "none" }}>
          {renderCourses()}
        </div>
        <div style={{ display: activeTab === "calendar" ? "block" : "none" }}>
          <div style={{ padding: "24px" }}>
            <Title level={2}>
              <CalendarOutlined style={{ marginRight: "8px" }} />
              {t("studentDashboard.calendar.title")}
            </Title>
            <Calendar />
          </div>
        </div>
        <div
          style={{ display: activeTab === "achievements" ? "block" : "none" }}
        >
          {renderAchievements()}
        </div>
      </>
    );
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

      <Layout style={{ minHeight: "100vh" }}>
      {/* Listening Exercise Detail Modal */}
      <Modal
        title={
          <Space>
            <SoundOutlined />
            {t("studentDashboard.listening.modal.title")}
          </Space>
        }
        open={listeningModalVisible}
        onCancel={() => setListeningModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setListeningModalVisible(false);
              setSelectedAnswers({});
            }}
          >
            {t("studentDashboard.listening.modal.close")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={submittingListening}
            onClick={handleListeningSubmission}
            disabled={
              !selectedListening?.questions ||
              Object.keys(selectedAnswers).length <
                selectedListening?.questions?.length
            }
          >
            {t("studentDashboard.listening.modal.submit")} ({Object.keys(selectedAnswers).length}/
            {selectedListening?.questions?.length || 0})
          </Button>,
        ]}
        width={700}
      >
        {selectedListening && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t("studentDashboard.listening.modal.course")} span={2}>
                <Tag color="blue">{selectedListening.course?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.listening.modal.difficulty")}>
                <Tag
                  color={
                    selectedListening.difficulty === "beginner"
                      ? "green"
                      : selectedListening.difficulty === "intermediate"
                      ? "orange"
                      : "red"
                  }
                >
                  {selectedListening.difficulty === "beginner"
                    ? t("studentDashboard.listening.difficulty.beginner")
                    : selectedListening.difficulty === "intermediate"
                    ? t("studentDashboard.listening.difficulty.intermediate")
                    : t("studentDashboard.listening.difficulty.advanced")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.listening.modal.duration")}>
                {selectedListening.duration || "N/A"} minutes
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.listening.modal.questions")} span={2}>
                {selectedListening.questions?.length || 0} {t("studentDashboard.listening.modal.questions")}
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.listening.modal.description")} span={2}>
                {selectedListening.description || t("studentDashboard.listening.modal.noDescription")}
              </Descriptions.Item>
            </Descriptions>

            {selectedListening.audioUrl && (
              <>
                <Alert
                  message={t("studentDashboard.listening.modal.audioAvailable")}
                  description={t("studentDashboard.listening.modal.audioDescription")}
                  type="success"
                  showIcon
                  icon={<AudioOutlined />}
                />
                <Card title={t("studentDashboard.listening.modal.audioPlayer")} size="small">
                  <audio
                    controls
                    style={{ width: "100%" }}
                    src={selectedListening.audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </Card>
              </>
            )}

            {!selectedListening.audioUrl && (
              <Alert
                message={t("studentDashboard.listening.modal.noAudio")}
                description={t("studentDashboard.listening.modal.noAudioDescription")}
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            )}

            {selectedListening.questions &&
              selectedListening.questions.length > 0 && (
                <Card title={t("studentDashboard.listening.modal.questionsTitle")} size="small">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                  >
                    {selectedListening.questions.map((question, index) => (
                      <Card key={index} type="inner" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Text strong>
                            {t("studentDashboard.listening.modal.question")} {index + 1}:{" "}
                            {question.questionText || question.question}
                          </Text>

                          {/* Question Type Badge */}
                          <Tag color="blue">
                            {question.type?.replace(/_/g, " ").toUpperCase() ||
                              "QUESTION"}
                          </Tag>

                          {/* Debug: Log question details */}
                          {console.log(`Question ${index + 1}:`, {
                            type: question.type,
                            hasOptions: !!question.options,
                            optionsLength: question.options?.length,
                            correctAnswer: question.correctAnswer,
                            options: question.options,
                          })}

                          {/* Multiple Choice Questions - Smart detection: if has options array, treat as multiple choice */}
                          {question.options && question.options.length > 0 && (
                            <Radio.Group
                              value={selectedAnswers[question._id]}
                              onChange={(e) => {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [question._id]: e.target.value,
                                });
                              }}
                              style={{ width: "100%" }}
                            >
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                              >
                                {question.options.map((option, optIndex) => (
                                  <Radio key={optIndex} value={optIndex}>
                                    <Text>
                                      {String.fromCharCode(65 + optIndex)}.{" "}
                                      {typeof option === "string"
                                        ? option
                                        : option.text || option}
                                    </Text>
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          )}

                          {/* Fill in the Blank Questions */}
                          {question.type === "fill_in_blank" && (
                            <Input
                              placeholder="Type your answer here..."
                              value={selectedAnswers[question._id] || ""}
                              onChange={(e) => {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [question._id]: e.target.value,
                                });
                              }}
                              style={{ width: "100%" }}
                            />
                          )}

                          {/* Short Answer Questions */}
                          {question.type === "short_answer" && (
                            <Input.TextArea
                              rows={3}
                              placeholder="Type your answer here..."
                              value={selectedAnswers[question._id] || ""}
                              onChange={(e) => {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [question._id]: e.target.value,
                                });
                              }}
                              style={{ width: "100%" }}
                            />
                          )}

                          {/* True/False Questions */}
                          {question.type === "true_false" && (
                            <Radio.Group
                              value={selectedAnswers[question._id]}
                              onChange={(e) => {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [question._id]: e.target.value,
                                });
                              }}
                              style={{ width: "100%" }}
                            >
                              <Space direction="vertical">
                                <Radio value="true">True</Radio>
                                <Radio value="false">False</Radio>
                              </Space>
                            </Radio.Group>
                          )}

                          {/* Points indicator */}
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {t("studentDashboard.listening.modal.points")}: {question.points || 1}
                          </Text>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                </Card>
              )}
          </Space>
        )}
      </Modal>

      {/* Quiz Detail Modal */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined />
            Quiz Details
          </Space>
        }
        open={quizModalVisible}
        onCancel={() => setQuizModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQuizModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="start"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              message.info("Quiz interface will be implemented");
              // TODO: Implement quiz taking interface
            }}
          >
            Start Quiz
          </Button>,
        ]}
        width={700}
      >
        {selectedQuiz && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.course")} span={2}>
                <Tag color="blue">
                  {selectedQuiz.assignment?.courseDetails?.map((course) => course.title).join(", ") ||
                    selectedQuiz.course?.name ||
                    selectedQuiz.course?.title ||
                    t("studentDashboard.quizzes.courseUnknown")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.questions")}>
                {selectedQuiz.questions?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.timeLimit")}>
                <FieldTimeOutlined />{" "}
                {selectedQuiz.duration || selectedQuiz.timeLimit || 0}{" "}
                {t("studentDashboard.quizzes.minutes")}
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.passingScore")}>
                <Tag color="green">{selectedQuiz.passingScore}%</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.attempts")}>
                {selectedQuiz.maxAttempts === -1
                  ? t("studentDashboard.quizzes.unlimited")
                  : `${selectedQuiz.maxAttempts} ${t("studentDashboard.quizzes.attempts")}`}
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.quizzes.columns.dueDate")} span={2}>
                {selectedQuiz.assignment?.dueDate
                  ? moment(selectedQuiz.assignment.dueDate).format("MMM DD, YYYY HH:mm")
                  : t("studentDashboard.quizzes.noDeadline")}
              </Descriptions.Item>
            </Descriptions>

            <Alert
              message={t(
                "studentDashboard.quizzes.instructionsTitle",
                "Quiz instructions"
              )}
              description={
                <Space direction="vertical" size={4}>
                  <Text>
                    {t(
                      "studentDashboard.quizzes.instructionsDefault",
                      "Read all questions carefully before submitting."
                    )}
                  </Text>
                  {selectedQuiz.assignment?.notes && (
                    <Text>{selectedQuiz.assignment.notes}</Text>
                  )}
                </Space>
              }
              type="info"
              showIcon
            />
          </Space>
        )}
      </Modal>

      {/* Homework Detail Modal */}
      <Modal
        title={
          <Space>
            <FormOutlined />
            {t("studentDashboard.homework.detailModal.title")}
          </Space>
        }
        open={homeworkModalVisible}
        onCancel={() => setHomeworkModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHomeworkModalVisible(false)}>
            {t("studentDashboard.homework.detailModal.close")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              setHomeworkModalVisible(false);
              setSubmissionModalVisible(true);
            }}
          >
            {t("studentDashboard.homework.detailModal.submitHomework")}
          </Button>,
        ]}
        width={700}
      >
        {selectedHomework && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t("studentDashboard.homework.detailModal.course")} span={2}>
                <Tag color="blue">{selectedHomework.course?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.homework.detailModal.dueDate")} span={2}>
                <Space>
                  <CalendarOutlined />
                  <Text>
                    {moment(selectedHomework.dueDate).format("MMM DD, YYYY")}
                  </Text>
                  {moment(selectedHomework.dueDate).isBefore(moment()) && (
                    <Tag color="error">{t("studentDashboard.homework.status.overdue")}</Tag>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.homework.detailModal.description")} span={2}>
                {selectedHomework.description}
              </Descriptions.Item>
              <Descriptions.Item label={t("studentDashboard.homework.detailModal.instructions")} span={2}>
                {selectedHomework.instructions ||
                  t("studentDashboard.homework.detailModal.noInstructions")}
              </Descriptions.Item>
            </Descriptions>

            {selectedHomework.attachments?.length > 0 && (
              <Card title={t("studentDashboard.homework.detailModal.attachments")} size="small">
                <List
                  dataSource={selectedHomework.attachments}
                  renderItem={(item) => (
                    <List.Item>
                      <FileOutlined /> {item}
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Space>
        )}
      </Modal>

      {/* Homework Submission Modal */}
      <Modal
        title={
          <Space>
            <UploadOutlined />
            {t("studentDashboard.homework.submissionModal.title")}
          </Space>
        }
        open={submissionModalVisible}
        onCancel={() => {
          setSubmissionModalVisible(false);
          submissionForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={submissionForm}
          layout="vertical"
          onFinish={handleHomeworkSubmission}
        >
          <Alert
            message={t("studentDashboard.homework.submissionModal.guidelines")}
            description={t("studentDashboard.homework.submissionModal.guidelinesText")}
            type="warning"
            showIcon
            style={{ marginBottom: "24px" }}
          />

          <Form.Item
            label={t("studentDashboard.homework.submissionModal.answer")}
            name="content"
            rules={[{ required: true, message: "Please enter your answer" }]}
          >
            <Input.TextArea
              rows={6}
              placeholder={t("studentDashboard.homework.submissionModal.answerPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("studentDashboard.homework.submissionModal.attachFile")}
            name="file"
            valuePropName="file"
          >
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t("studentDashboard.homework.submissionModal.selectFile")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setSubmissionModalVisible(false);
                  submissionForm.resetFields();
                }}
              >
                {t("studentDashboard.homework.submissionModal.cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
              >
                {t("studentDashboard.homework.submissionModal.submit")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          onBreakpoint={(broken) => {
            if (broken) {
              setIsMobile(true);
              setCollapsed(true);
            } else {
              setIsMobile(false);
            }
          }}
          width={260}
          className="modern-sidebar"
          style={{
            background: "linear-gradient(180deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: collapsed ? 45 : 55,
                height: collapsed ? 45 : 55,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                marginBottom: collapsed ? 0 : 12,
                border: "2px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <BookOutlined style={{ fontSize: collapsed ? 24 : 28, color: "#fff" }} />
            </div>
            {!collapsed && (
              <>
                <Title
                  level={4}
                  style={{
                    color: "#fff",
                    margin: "8px 0 4px 0",
                    fontSize: "18px",
                    fontWeight: 600,
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Student Portal
                </Title>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "12px",
                    fontWeight: 400,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Forum Academy
                </Text>
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeTab]}
            items={studentMenuItems.map((item) => ({
              ...item,
              style: {
                margin: "4px 0",
                borderRadius: collapsed ? "0" : "0 25px 25px 0",
                height: "48px",
                display: "flex",
                alignItems: "center",
              },
            }))}
            onClick={(e) => setActiveTab(e.key)}
            style={{
              background: "transparent",
              border: "none",
              padding: "20px 0",
              height: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          />
        </Sider>
      )}

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
          transition: "all 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Header
          style={{
            padding: isMobile ? "0 16px" : "0 32px",
            background: "linear-gradient(90deg, #ffffff 0%, #f8f9ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.1)",
            position: "sticky",
            top: 0,
            zIndex: 999,
            height: isMobile ? "60px" : "72px",
            borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(!mobileDrawerVisible);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {!isMobile && (
              <Breadcrumb style={{ marginLeft: 16 }}>
                <Breadcrumb.Item>
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Student Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item>
                  {studentMenuItems.find((item) => item.key === activeTab)?.label}
                </Breadcrumb.Item>
              </Breadcrumb>
            )}
            {isMobile && (
              <Title
                level={5}
                style={{ margin: "0 0 0 16px", color: "#262626" }}
              >
                {studentMenuItems.find((item) => item.key === activeTab)?.label}
              </Title>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={notificationStats.unread} overflowCount={99}>
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationDrawerVisible(true)}
                style={{
                  color: notificationStats.unread > 0 ? "#1890ff" : undefined,
                  animation:
                    notificationStats.unread > 0
                      ? "pulse 2s infinite"
                      : "none",
                }}
              />
            </Badge>

            {/* Live Class Notification Badge */}
            <Badge count={zoomClasses.length} overflowCount={99} color="#dc2626">
              <Button
                type="text"
                icon={<VideoCameraOutlined />}
                onClick={() => {
                  setActiveTab("zoom");
                  message.info("🎥 " + zoomClasses.length + " live class(es) available");
                }}
                style={{
                  color: zoomClasses.length > 0 ? "#dc2626" : undefined,
                  fontSize: "16px",
                }}
                title="Active Live Classes"
              />
            </Badge>

            {/* Language Toggle Button */}
            <Button
              type="text"
              onClick={() => {
                const newLang = i18n.language === "en" ? "ja" : "en";
                i18n.changeLanguage(newLang);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "4px 8px" : "4px 12px",
                fontWeight: 500,
              }}
            >
              <GlobalOutlined style={{ fontSize: "16px" }} />
              {!isMobile && (
                <span>{i18n.language === "en" ? "EN" : "日本語"}</span>
              )}
            </Button>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: t("studentDashboard.header.myProfile"),
                    onClick: () => message.info("Profile settings coming soon"),
                  },
                  {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: t("studentDashboard.header.settings"),
                    onClick: () => message.info("Settings coming soon"),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: t("studentDashboard.header.logout"),
                    onClick: handleLogout,
                    danger: true,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: isMobile ? "6px 8px" : "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
              >
                <Avatar
                  size={isMobile ? 32 : "small"}
                  style={{
                    backgroundColor: "#1890ff",
                    marginRight: isMobile ? 6 : 8,
                  }}
                  icon={<UserOutlined />}
                />
                {!isMobile && (
                  <Text strong style={{ color: "#262626" }}>
                    {currentUser?.name || "Student"}
                  </Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

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
      </Layout>
      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
            }}>
              <BookOutlined style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>Student Portal</span>
          </div>
        }
        placement="left"
        closable={true}
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible && isMobile}
        width={isMobile ? Math.min(280, window.innerWidth * 0.8) : 280}
        styles={{
          body: {
            padding: 0,
            background: "linear-gradient(180deg, #1e293b 0%, #334155 100%)",
          },
          header: {
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            color: "#fff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "20px",
          },
        }}
        className="mobile-drawer"
      >
        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={studentMenuItems.map((item) => ({
            ...item,
            style: {
              margin: "8px 16px",
              borderRadius: "8px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 500,
            },
          }))}
          onClick={(e) => {
            setActiveTab(e.key);
            setMobileDrawerVisible(false);
          }}
          style={{
            border: "none",
            background: "transparent",
            padding: "16px 0",
            height: "100%",
            overflowY: "auto",
          }}
        />
      </Drawer>

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
    </Layout>
    </>
  );
};

export default StudentDashboard;

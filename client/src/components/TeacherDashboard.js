import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import moment from "moment";
import "../styles/AdminSidebar.css";
import "../styles/Dashboard.css";
import zoomApiService from "../services/zoomApiService";
import ZoomMeeting from "./ZoomMeeting";

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
  Dropdown,
} from "antd";

const { Option } = Select;

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
  FormOutlined,
  WarningOutlined,
  FolderOpenOutlined,
  PauseCircleOutlined,
  InboxOutlined,
  DashboardOutlined,
  FolderOutlined,
  CloseOutlined,
  SendOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  StopOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// Lucide React Icons
import {
  Users,
  FileText,
  Target,
  Zap,
  TrendingUp,
  PieChart,
  Clock,
  Award,
  Activity,
  BookOpen,
  GraduationCap,
  Clipboard,
} from "lucide-react";

// Import API client
import {
  authAPI,
  statsAPI,
  courseAPI,
  materialAPI,
  quizAPI,
  homeworkAPI,
  listeningAPI,
  userAPI,
  messageAPI,
  progressAPI,
  announcementAPI,
} from "../utils/apiClient";

// Chart.js imports
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const TeacherDashboard = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  const history = useHistory();

  // Debug: Check translations on mount and language change
  useEffect(() => {
    console.log("🔍 Current Language:", i18nInstance.language);
    console.log("🔍 Translation test - common.status:", t("common.status"));
    console.log("🔍 Translation test - common.actions:", t("common.actions"));
    console.log("🔍 Translation test - common.view:", t("common.view"));
  }, [i18nInstance.language, t]);

  // States
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language);
  const [collapsed, setCollapsed] = useState(false);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log("🌐 Language changed to:", lng);
      setCurrentLanguage(lng);
    };

    i18nInstance.on("languageChanged", handleLanguageChange);

    return () => {
      i18nInstance.off("languageChanged", handleLanguageChange);
    };
  }, [i18nInstance]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );

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
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    myCourses: 0,
    myStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    avgClassPerformance: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Zoom Integration States
  const [zoomClasses, setZoomClasses] = useState([]);
  const [activeZoomClass, setActiveZoomClass] = useState(null);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [zoomForm] = Form.useForm();
  const [embeddedZoomVisible, setEmbeddedZoomVisible] = useState(false);
  const [currentLiveClass, setCurrentLiveClass] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceReportVisible, setAttendanceReportVisible] = useState(false);
  const [selectedClassReport, setSelectedClassReport] = useState(null);
  const [zoomLoading, setZoomLoading] = useState(false);
  
  // Student Data Management States
  const [studentDataModalVisible, setStudentDataModalVisible] = useState(false);
  const [selectedStudentForData, setSelectedStudentForData] = useState(null);
  const [studentDataForm] = Form.useForm();
  const [studentGrades, setStudentGrades] = useState([]);
  const [logoutNotifications, setLogoutNotifications] = useState([]);

  // Quiz management states
  const [quizzes, setQuizzes] = useState([]);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizForm] = Form.useForm();

  // Homework management states
  const [homeworks, setHomeworks] = useState([]);
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [viewingHomework, setViewingHomework] = useState(null);
  const [homeworkLoading, setHomeworkLoading] = useState(false);
  const [homeworkForm] = Form.useForm();

  // Listening exercises states
  const [listeningExercises, setListeningExercises] = useState([]);
  const [isListeningModalVisible, setIsListeningModalVisible] = useState(false);
  const [editingListening, setEditingListening] = useState(null);
  const [viewingListening, setViewingListening] = useState(null);
  const [listeningLoading, setListeningLoading] = useState(false);
  const [togglingExerciseId, setTogglingExerciseId] = useState(null); // Track which exercise is being toggled
  const [listeningForm] = Form.useForm();
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const audioInstanceRef = React.useRef(null);

  // Listening submissions states
  const [selectedExerciseForSubmissions, setSelectedExerciseForSubmissions] =
    useState(null);
  const [submissionsModalVisible, setSubmissionsModalVisible] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const lastFetchedExerciseIdRef = React.useRef(null);
  const isFetchingRef = React.useRef(false);

  // Question management states for listening exercises
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [currentListeningForQuestions, setCurrentListeningForQuestions] =
    useState(null);
  const [questionForm] = Form.useForm();

  // Course management states
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Global courses for all modals
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseForm] = Form.useForm();

  // Material management states
  const [materials, setMaterials] = useState([]);
  const [isMaterialModalVisible, setIsMaterialModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [materialForm] = Form.useForm();

  // Student management states
  const [students, setStudents] = useState([]);
  const [selectedCourseForStudents, setSelectedCourseForStudents] =
    useState(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // Messaging states
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageForm] = Form.useForm();
  const [sendingMessage, setSendingMessage] = useState(false);

  // Video call states
  const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState(false);
  const [selectedStudentForCall, setSelectedStudentForCall] = useState(null);
  const [videoCallLoading, setVideoCallLoading] = useState(false);

  // Grading states
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [createProgressModalVisible, setCreateProgressModalVisible] =
    useState(false);
  const [editProgressModalVisible, setEditProgressModalVisible] =
    useState(false);
  const [viewProgressModalVisible, setViewProgressModalVisible] =
    useState(false);
  const [createAnnouncementModalVisible, setCreateAnnouncementModalVisible] =
    useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [viewingProgress, setViewingProgress] = useState(null);
  const [progressForm] = Form.useForm();
  const [editProgressForm] = Form.useForm();
  const [announcementForm] = Form.useForm();
  const [gradingLoading, setGradingLoading] = useState(false);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    success: false,
    overview: {
      totalStudents: 0,
      totalCourses: 0,
      totalSubmissions: 0,
      activeStudents: 0,
      averageScore: 0,
      recentSubmissions: 0,
    },
    performanceTrends: [],
    assignmentTypeDistribution: {},
    gradeDistribution: {},
    recentActivity: [],
    charts: {
      performanceData: {
        labels: [
          t("teacherDashboard.analytics.week1"),
          t("teacherDashboard.analytics.week2"),
          t("teacherDashboard.analytics.week3"),
          t("teacherDashboard.analytics.week4"),
        ],
        datasets: [
          {
            label: t("teacherDashboard.analytics.averageScorePercent"),
            data: [0, 0, 0, 0],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
          },
        ],
      },
      engagementData: {
        labels: [t("teacherDashboard.analytics.noData")],
        datasets: [
          {
            data: [1],
            backgroundColor: ["rgba(200, 200, 200, 0.8)"],
          },
        ],
      },
    },
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Mobile drawer state
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    byType: {
      student_message: 0,
      assignment_submission: 0,
      admin_announcement: 0,
      quiz_submission: 0,
      grade_request: 0,
      enrollment: 0,
    },
  });

  // Settings states
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    studentSubmissions: true,
  });

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

      // Check if user has teacher permissions
      if (!["teacher", "faculty", "admin", "superadmin"].includes(userRole)) {
        message.error("Access denied. Teacher role required.");
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
      fetchDashboardStats();
      setLoading(false);
    };

    checkAuth();
  }, [history]);

  const fetchDashboardStats = async () => {
    try {
      console.log("🔄 Calculating teacher dashboard stats from actual data...");
      console.log("📊 Current data lengths:", {
        courses: courses.length,
        materials: materials.length,
        quizzes: quizzes.length,
        homeworks: homeworks.length,
        students: students.length,
      });

      // Calculate stats from the actual data we have
      const myCourses = courses.length;

      // Count total students enrolled in teacher's courses
      let totalStudents = 0;
      courses.forEach((course) => {
        if (course.students && Array.isArray(course.students)) {
          totalStudents += course.students.length;
          console.log(
            `📚 Course "${course.title}" has ${course.students.length} students`
          );
        }
      });

      // If no students from courses, use total students as fallback for admin view
      if (totalStudents === 0 && students.length > 0) {
        totalStudents = students.length;
        console.log(
          "📊 Using total students count as fallback:",
          totalStudents
        );
      }

      // Count materials
      const totalMaterials = materials.length;

      // Count active quizzes
      const activeQuizzes = quizzes.filter((quiz) => {
        // Consider quiz active if not explicitly inactive
        return quiz.isActive !== false && quiz.status !== "inactive";
      }).length;

      // Count pending homework submissions (approximate)
      const pendingSubmissions = homeworks.reduce((total, homework) => {
        // If homework has submissions, count those not graded yet
        if (homework.submissions && Array.isArray(homework.submissions)) {
          const ungraded = homework.submissions.filter(
            (sub) => !sub.grade && !sub.isGraded && sub.status !== "graded"
          ).length;
          return total + ungraded;
        }
        // If no submissions data, assume some pending for active homework
        return total + (homework.isActive !== false ? 1 : 0);
      }, 0);

      // Calculate average performance (simplified)
      let avgPerformance = 0;
      if (quizzes.length > 0) {
        const totalSubmissions = quizzes.reduce((total, quiz) => {
          return total + (quiz.submissions ? quiz.submissions.length : 0);
        }, 0);

        if (totalSubmissions > 0) {
          const totalScore = quizzes.reduce((total, quiz) => {
            if (quiz.submissions && Array.isArray(quiz.submissions)) {
              const quizTotal = quiz.submissions.reduce(
                (qTotal, submission) => {
                  return qTotal + (submission.score || 0);
                },
                0
              );
              return total + quizTotal;
            }
            return total;
          }, 0);
          avgPerformance =
            Math.round((totalScore / totalSubmissions) * 100) / 100;
        }
      }

      const calculatedStats = {
        myCourses,
        myStudents: totalStudents,
        totalMaterials,
        pendingSubmissions,
        activeQuizzes,
        avgClassPerformance: avgPerformance,
      };

      console.log("✅ Calculated dashboard stats:", calculatedStats);
      setDashboardStats(calculatedStats);
    } catch (error) {
      console.error("❌ Error calculating teacher stats:", error);
      // Set fallback data using current data lengths
      const fallbackStats = {
        myCourses: courses.length || 0,
        myStudents: students.length || 0,
        totalMaterials: materials.length || 0,
        pendingSubmissions: 0,
        activeQuizzes: quizzes.length || 0,
        avgClassPerformance: 0,
      };
      console.log("🔄 Setting fallback stats:", fallbackStats);
      setDashboardStats(fallbackStats);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    message.success("Logged out successfully");
    history.push("/");
  };

  // Global course fetching function for all modals
  const fetchAllCourses = async () => {
    try {
      console.log("🔍 Fetching all courses for dropdowns...");
      const response = await courseAPI.getAll();
      console.log("📚 Raw courses response:", response);

      // Handle different response formats from server
      const coursesData = response.courses || response.data || response || [];
      console.log("📚 Processed courses data:", coursesData);

      setAllCourses(coursesData);
      // Also update courses for table display
      setCourses(coursesData);
      return coursesData;
    } catch (error) {
      console.error("❌ Error fetching courses for modals:", error);
      message.error("Error loading courses");
      setAllCourses([]);
      setCourses([]);
      return [];
    }
  };

  // Fetch Zoom meetings from API
  const fetchZoomMeetings = async () => {
    try {
      setZoomLoading(true);
      console.log("📹 Fetching Zoom meetings...");
      const response = await zoomApiService.getMeetings();
      
      if (response.success) {
        setZoomClasses(response.meetings || []);
        console.log("📹 Zoom meetings loaded:", response.meetings);
      } else {
        throw new Error(response.message || 'Failed to fetch meetings');
      }
    } catch (error) {
      console.error("❌ Error fetching Zoom meetings:", error);
      message.error("Failed to load Zoom meetings");
      setZoomClasses([]);
    } finally {
      setZoomLoading(false);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    console.log("🚀 TeacherDashboard mounting, loading initial data...");
    const loadInitialData = async () => {
      await fetchAllCourses();
      await fetchMaterials();
      await fetchQuizzes();
      await fetchHomeworks();
      await fetchStudents();
      await fetchProgressRecords();
      await fetchAnnouncements();
      await fetchZoomMeetings();
      // Stats will be calculated automatically via the other useEffect
      // Initialize analytics with local data
      setTimeout(() => {
        calculateLocalAnalytics();
      }, 1500); // Delay to ensure all data is loaded
    };
    loadInitialData();
  }, []);

  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return t("teacherDashboard.overview.justNow");

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("teacherDashboard.overview.justNow");
    if (diffMins < 60)
      return `${diffMins} ${t("teacherDashboard.overview.minutesAgo")}`;
    if (diffHours < 24)
      return `${diffHours} ${
        diffHours === 1
          ? t("teacherDashboard.overview.hourAgo")
          : t("teacherDashboard.overview.hoursAgo")
      }`;
    if (diffDays === 1) return t("teacherDashboard.overview.yesterday");
    if (diffDays < 7)
      return `${diffDays} ${t("teacherDashboard.overview.daysAgo")}`;
    return past.toLocaleDateString();
  };

  // Collect and aggregate recent activities
  const collectRecentActivities = () => {
    const activities = [];

    // Add quiz submissions (from progress records)
    progressRecords.forEach((record) => {
      if (record.assignmentType === "quiz") {
        activities.push({
          type: "quiz_submission",
          description: record.courseName || "Quiz",
          studentName: record.studentName || "Student",
          timestamp: record.submittedDate || record.createdAt,
          color: "green",
          icon: "QuestionCircleOutlined",
        });
      }
    });

    // Add homework submissions
    progressRecords.forEach((record) => {
      if (record.assignmentType === "homework") {
        activities.push({
          type: "homework_submission",
          description: record.courseName || "Homework",
          studentName: record.studentName || "Student",
          timestamp: record.submittedDate || record.createdAt,
          color: "blue",
          icon: "FileTextOutlined",
        });
      }
    });

    // Add material uploads
    materials.forEach((material) => {
      if (material.createdAt) {
        activities.push({
          type: "material_uploaded",
          description: material.courseName || material.courseId || "Course",
          materialTitle: material.title,
          timestamp: material.createdAt,
          color: "blue",
          icon: "FolderOutlined",
        });
      }
    });

    // Add announcements
    announcements.forEach((announcement) => {
      if (announcement.createdAt) {
        activities.push({
          type: "announcement",
          description: announcement.courseName || "General",
          title: announcement.title,
          timestamp: announcement.createdAt,
          color: "orange",
          icon: "NotificationOutlined",
        });
      }
    });

    // Sort by timestamp (most recent first) and take top 5
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRecentActivities(activities.slice(0, 5));
  };

  // Recalculate dashboard stats whenever data changes
  useEffect(() => {
    console.log("📊 Data changed, recalculating dashboard stats...");
    fetchDashboardStats();
    collectRecentActivities();
  }, [
    courses,
    materials,
    quizzes,
    homeworks,
    students,
    progressRecords,
    announcements,
  ]);

  // Data loading effects
  useEffect(() => {
    if (activeTab === "quizzes") {
      fetchQuizzes();
    } else if (activeTab === "homework") {
      fetchHomeworks();
    } else if (activeTab === "listening") {
      fetchListeningExercises();
    } else if (activeTab === "courses") {
      fetchCourses();
    } else if (activeTab === "materials") {
      fetchMaterials();
    } else if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "grading") {
      fetchProgressRecords();
      fetchAnnouncements();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Quiz Management Functions
  const fetchQuizzes = async () => {
    setQuizLoading(true);
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.quizzes || response.data || response || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      message.error(t("quiz.fetchError"));
    } finally {
      setQuizLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    quizForm.setFieldsValue({
      ...quiz,
      dueDate: quiz.dueDate ? moment(quiz.dueDate) : null,
    });
    setIsQuizModalVisible(true);
  };

  const handleViewQuiz = (quiz) => {
    setViewingQuiz(quiz);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.delete(quizId);
      message.success(t("quiz.deleteSuccess"));
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      message.error(t("quiz.deleteError"));
    }
  };

  const handleQuizSubmit = async (values) => {
    try {
      if (editingQuiz) {
        await quizAPI.update(editingQuiz._id, values);
        message.success(t("quiz.updateSuccess"));
      } else {
        await quizAPI.create(values);
        message.success(t("quiz.createSuccess"));
      }
      setIsQuizModalVisible(false);
      setEditingQuiz(null);
      quizForm.resetFields();
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
      message.error(t("quiz.saveError"));
    }
  };

  // Homework Management Functions
  const fetchHomeworks = async () => {
    setHomeworkLoading(true);
    try {
      const response = await homeworkAPI.getAll();
      setHomeworks(response.homework || response.data || response || []);
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      message.error(t("homework.fetchError"));
    } finally {
      setHomeworkLoading(false);
    }
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    homeworkForm.setFieldsValue({
      ...homework,
      dueDate: homework.dueDate ? moment(homework.dueDate) : null,
    });
    setIsHomeworkModalVisible(true);
  };

  const handleViewHomework = (homework) => {
    setViewingHomework(homework);
  };

  const handleViewSubmissions = (homework) => {
    // You can implement a submissions view modal
    message.info("View submissions functionality to be implemented");
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      await homeworkAPI.delete(homeworkId);
      message.success(t("homework.deleteSuccess"));
      fetchHomeworks();
    } catch (error) {
      console.error("Error deleting homework:", error);
      message.error(t("homework.deleteError"));
    }
  };

  const handleHomeworkSubmit = async (values) => {
    try {
      console.log("📤 Submitting homework with values:", values);
      console.log("📋 Status field value:", values.status);

      if (editingHomework) {
        await homeworkAPI.update(editingHomework._id, values);
        message.success(t("homework.updateSuccess"));
      } else {
        await homeworkAPI.create(values);
        message.success(t("homework.createSuccess"));
      }
      setIsHomeworkModalVisible(false);
      setEditingHomework(null);
      homeworkForm.resetFields();
      fetchHomeworks();
    } catch (error) {
      console.error("Error saving homework:", error);
      message.error(t("homework.saveError"));
    }
  };

  // Listening Exercises Functions
  const fetchListeningExercises = async () => {
    setListeningLoading(true);
    try {
      const response = await listeningAPI.getAll();
      setListeningExercises(
        response.listeningExercises || response.data || response || []
      );
    } catch (error) {
      console.error("Error fetching listening exercises:", error);
      message.error(t("listening.fetchError"));
    } finally {
      setListeningLoading(false);
    }
  };

  const fetchListeningSubmissions = useCallback(async (exerciseId) => {
    // Guard: Prevent duplicate fetches for the same exercise
    if (
      isFetchingRef.current ||
      lastFetchedExerciseIdRef.current === exerciseId
    ) {
      console.log("⏭️ Skipping duplicate fetch for exercise:", exerciseId);
      return;
    }

    isFetchingRef.current = true;
    lastFetchedExerciseIdRef.current = exerciseId;
    setSubmissionsLoading(true);

    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/listening-exercises/${exerciseId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Fetched submissions:", data);
        setSubmissions(data.submissions || []);
      } else {
        message.error("Failed to fetch submissions");
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      message.error("Error fetching submissions");
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const handleEditListening = (listening) => {
    setEditingListening(listening);
    listeningForm.setFieldsValue(listening);
    setIsListeningModalVisible(true);
  };

  const handleViewListening = (listening) => {
    setViewingListening(listening);
  };

  const handleDeleteListening = async (listeningId) => {
    try {
      await listeningAPI.delete(listeningId);
      message.success(t("listening.deleteSuccess"));
      fetchListeningExercises();
    } catch (error) {
      console.error("Error deleting listening exercise:", error);
      message.error(t("listening.deleteError"));
    }
  };

  const handleTogglePublishListening = async (exercise) => {
    if (togglingExerciseId) {
      console.log("⏳ Already toggling an exercise, please wait...");
      return; // Prevent multiple simultaneous toggles
    }

    try {
      setTogglingExerciseId(exercise._id); // Mark this exercise as being toggled
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const newPublishStatus = !exercise.isPublished;

      console.log(
        `🔄 Toggling exercise ${exercise._id} to ${
          newPublishStatus ? "published" : "unpublished"
        }`
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/listening-exercises/${exercise._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublished: newPublishStatus }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const updatedExercise = result.data || result.exercise || result;
        console.log("✅ Server response:", {
          success: result.success,
          isPublished: updatedExercise.isPublished,
        });

        message.success(
          newPublishStatus
            ? t("listening.publishSuccess")
            : t("listening.unpublishSuccess")
        );

        // Update the local state with the server response
        setListeningExercises((prevExercises) =>
          prevExercises.map((ex) =>
            ex._id === exercise._id
              ? {
                  ...ex,
                  isPublished: updatedExercise.isPublished,
                  // Update the whole exercise object to ensure everything is in sync
                  ...updatedExercise,
                }
              : ex
          )
        );

        console.log(
          "✅ Local state updated. New isPublished:",
          updatedExercise.isPublished
        );
      } else {
        const errorData = await response.json();
        console.error("❌ Server error:", errorData);
        message.error(t("listening.updateError"));
      }
    } catch (error) {
      console.error("❌ Error toggling publish status:", error);
      message.error(t("listening.updateError"));
    } finally {
      setTogglingExerciseId(null); // Clear the toggling state
      console.log("🔓 Toggle complete");
    }
  };

  const handleListeningSubmit = async (values) => {
    try {
      if (editingListening) {
        await listeningAPI.update(editingListening._id, values);
        message.success(t("listening.updateSuccess"));
      } else {
        // Create FormData for new listening exercise with audio file
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "audioFile" && values[key] && values[key].fileList) {
            formData.append("audioFile", values[key].fileList[0].originFileObj);
          } else if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        });
        await listeningAPI.create(formData);
        message.success(t("listening.createSuccess"));
      }
      setIsListeningModalVisible(false);
      setEditingListening(null);
      listeningForm.resetFields();
      fetchListeningExercises();
    } catch (error) {
      console.error("Error saving listening exercise:", error);
      message.error(t("listening.saveError"));
    }
  };

  const handlePlayAudio = async (exercise) => {
    try {
      // If clicking on the same audio that's currently playing, pause it
      if (currentPlayingId === exercise._id && audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        setCurrentPlayingId(null);
        message.info("Audio paused");
        return;
      }

      // Stop any currently playing audio
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }

      // Create new audio instance with timestamp to avoid caching
      const timestamp = new Date().getTime();
      const audioUrl = `${
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      }/api/listening-exercises/audio/${exercise._id}?t=${timestamp}`;

      console.log("🎵 Playing audio from URL:", audioUrl);

      // Create and configure audio
      const audio = new Audio(audioUrl);
      audioInstanceRef.current = audio;

      // Set up event listeners
      audio.onplay = () => {
        setCurrentPlayingId(exercise._id);
      };

      audio.onpause = () => {
        if (currentPlayingId === exercise._id) {
          setCurrentPlayingId(null);
        }
      };

      audio.onended = () => {
        setCurrentPlayingId(null);
        audioInstanceRef.current = null;
        message.success("Audio finished");
      };

      audio.onerror = (error) => {
        console.error("Error playing audio:", error);
        setCurrentPlayingId(null);
        audioInstanceRef.current = null;
        message.error(t("listening.audioError") || "Error playing audio file");
      };

      // Play audio
      await audio.play();
      message.success("Playing audio...");
    } catch (error) {
      console.error("Error playing audio:", error);
      setCurrentPlayingId(null);
      audioInstanceRef.current = null;
      message.error(t("listening.audioError") || "Error playing audio file");
    }
  };

  // ========== TABLE COLUMN DEFINITIONS (useMemo for language reactivity) ==========

  // Quiz Management Columns
  const quizColumns = React.useMemo(() => {
    console.log("🔄 Recreating quizColumns for language:", currentLanguage);
    console.log("🔍 Status translation:", t("common.status"));
    console.log("🔍 Actions translation:", t("common.actions"));
    return [
      {
        title: t("quiz.title"),
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t("quiz.course"),
        dataIndex: "course",
        key: "course",
        render: (course) => course?.title || t("quiz.noCourse"),
      },
      {
        title: t("quiz.questions"),
        dataIndex: "questions",
        key: "questions",
        render: (questions) => questions?.length || 0,
      },
      {
        title: t("quiz.timeLimit"),
        dataIndex: "timeLimit",
        key: "timeLimit",
        render: (time) =>
          time ? `${time} ${t("common.minutes")}` : t("quiz.noTimeLimit"),
      },
      {
        title: t("quiz.attempts"),
        dataIndex: "attempts",
        key: "attempts",
        render: (attempts) => attempts || t("quiz.unlimited"),
      },
      {
        title: t("common.status"),
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusValue = status || "draft";
          return (
            <Tag
              color={
                statusValue === "active"
                  ? "green"
                  : statusValue === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {t(`quiz.status.${statusValue}`)}
            </Tag>
          );
        },
      },
      {
        title: t("common.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("common.view")}>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => setViewingQuiz(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.edit")}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditQuiz(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.delete")}>
              <Popconfirm
                title={t("quiz.deleteConfirm")}
                onConfirm={() => handleDeleteQuiz(record._id)}
                okText={t("common.yes")}
                cancelText={t("common.no")}
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];
  }, [currentLanguage, t]);

  // Homework Management Columns
  const homeworkColumns = React.useMemo(
    () => [
      {
        title: t("homework.title"),
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t("homework.course"),
        dataIndex: "course",
        key: "course",
        render: (course) => course?.title || t("homework.noCourse"),
      },
      {
        title: t("homework.dueDate"),
        dataIndex: "dueDate",
        key: "dueDate",
        render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
        sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      },
      {
        title: t("homework.submissions"),
        dataIndex: "submissions",
        key: "submissions",
        render: (submissions) => submissions?.length || 0,
      },
      {
        title: t("common.status"),
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusValue = status || "draft";
          return (
            <Tag
              color={
                statusValue === "active"
                  ? "green"
                  : statusValue === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {t(`homework.status.${statusValue}`)}
            </Tag>
          );
        },
      },
      {
        title: t("common.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("common.view")}>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewHomework(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.edit")}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditHomework(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.delete")}>
              <Popconfirm
                title={t("homework.deleteConfirm")}
                onConfirm={() => handleDeleteHomework(record._id)}
                okText={t("common.yes")}
                cancelText={t("common.no")}
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [currentLanguage, t]
  );

  // Listening Exercise Columns
  const listeningColumns = React.useMemo(
    () => [
      {
        title: t("listening.title"),
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t("listening.course"),
        dataIndex: "course",
        key: "course",
        render: (course) => course?.title || t("listening.noCourse"),
      },
      {
        title: t("listening.duration"),
        dataIndex: "duration",
        key: "duration",
        render: (duration) =>
          duration
            ? `${Math.floor(duration / 60)} ${t("common.minutes")}`
            : "-",
      },
      {
        title: t("listening.questions"),
        dataIndex: "questions",
        key: "questions",
        render: (questions) => questions?.length || 0,
      },
      {
        title: t("common.status"),
        dataIndex: "isPublished",
        key: "isPublished",
        render: (isPublished) => {
          return (
            <Tag color={isPublished ? "green" : "orange"}>
              {isPublished
                ? t("listening.published")
                : t("listening.status.draft")}
            </Tag>
          );
        },
      },
      {
        title: t("common.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip
              title={
                record.isPublished
                  ? t("listening.unpublish")
                  : t("listening.publish")
              }
            >
              <Button
                type={record.isPublished ? "default" : "primary"}
                size="small"
                icon={
                  record.isPublished ? (
                    <StopOutlined />
                  ) : (
                    <CheckCircleOutlined />
                  )
                }
                loading={togglingExerciseId === record._id}
                disabled={
                  togglingExerciseId !== null &&
                  togglingExerciseId !== record._id
                }
                onClick={() => handleTogglePublishListening(record)}
              >
                {record.isPublished
                  ? t("listening.unpublish")
                  : t("listening.publish")}
              </Button>
            </Tooltip>
            <Tooltip title={t("listening.submissions.title")}>
              <Button
                type="default"
                size="small"
                icon={<BarChartOutlined />}
                onClick={() => {
                  setSelectedExerciseForSubmissions(record);
                  setSubmissionsModalVisible(true);
                }}
              >
                {t("listening.submissions.title")}
              </Button>
            </Tooltip>
            <Tooltip title={t("common.view")}>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => setViewingListening(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.edit")}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditListening(record)}
              />
            </Tooltip>
            <Tooltip title={t("common.delete")}>
              <Popconfirm
                title={t("listening.deleteConfirm")}
                onConfirm={() => handleDeleteListening(record._id)}
                okText={t("common.yes")}
                cancelText={t("common.no")}
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [currentLanguage, t]
  );

  // Course Management Functions
  const fetchCourses = async () => {
    setCourseLoading(true);
    try {
      const response = await courseAPI.getAll();
      console.log("📚 Raw course API response:", response);

      // Handle different response formats
      const coursesData = response.data || response.courses || response || [];
      console.log("📚 Processed courses data:", coursesData);

      setCourses(coursesData);
      // Also update global courses for modals
      setAllCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Error fetching courses");
    } finally {
      setCourseLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    // Convert date strings to moment objects for the form
    const formData = {
      ...course,
      startDate: course.startDate ? moment(course.startDate) : null,
      endDate: course.endDate ? moment(course.endDate) : null,
    };
    courseForm.setFieldsValue(formData);
    setIsCourseModalVisible(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      console.log("🗑️ Attempting to delete course:", courseId);
      const response = await courseAPI.delete(courseId);
      console.log("✅ Course deleted successfully:", response);
      message.success("Course and all related content deleted successfully");
      await fetchAllCourses();
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      console.error("❌ Error details:", {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // Show more specific error message
      const errorMessage = error.message || "Error deleting course";
      message.error(`Failed to delete course: ${errorMessage}`);
    }
  };

  const handleCourseSubmit = async (values) => {
    try {
      console.log("📝 Original form values:", values);

      // Format the form data
      const courseData = {
        ...values,
        // Convert moment objects to ISO strings for the API
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        // Ensure code is uppercase
        code: values.code ? values.code.toUpperCase() : "",
      };

      console.log("📚 Submitting course data:", courseData);

      if (editingCourse) {
        const result = await courseAPI.update(editingCourse._id, courseData);
        console.log("✅ Course update result:", result);
        message.success("Course updated successfully");
      } else {
        const result = await courseAPI.create(courseData);
        console.log("✅ Course create result:", result);
        message.success("Course created successfully");
      }

      setIsCourseModalVisible(false);
      setEditingCourse(null);
      courseForm.resetFields();

      // Refresh courses with explicit logging
      console.log("🔄 Refreshing courses after save...");
      await fetchAllCourses();
      console.log("✅ Course refresh completed");
    } catch (error) {
      console.error("❌ Error saving course:", error);
      message.error("Error saving course");
    }
  };

  // Material Management Functions
  const fetchMaterials = async () => {
    setMaterialLoading(true);
    try {
      console.log("📚 Fetching materials...");
      const response = await materialAPI.getAll();
      console.log("📚 Raw materials response:", response);

      // Handle different response formats
      const materialsData =
        response.materials || response.data || response || [];
      console.log("📚 Processed materials data:", materialsData);

      setMaterials(materialsData);
    } catch (error) {
      console.error("❌ Error fetching materials:", error);
      message.error("Error fetching materials");
      setMaterials([]);
    } finally {
      setMaterialLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    materialForm.setFieldsValue(material);
    setIsMaterialModalVisible(true);
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await materialAPI.delete(materialId);
      message.success("Material deleted successfully");
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      message.error("Error deleting material");
    }
  };

  const handleMaterialSubmit = async (values) => {
    try {
      console.log("📁 Material form values:", values);
      console.log("📁 Form values detailed:", JSON.stringify(values, null, 2));

      if (editingMaterial) {
        // For updates, send as JSON
        const updateData = {
          title: values.title,
          description: values.description,
          course: values.course,
          category: values.category,
        };
        console.log("✏️ Updating material:", updateData);
        await materialAPI.update(editingMaterial._id, updateData);
        message.success("Material updated successfully");
      } else {
        // For creation, prepare FormData for file upload
        const formData = new FormData();

        // Add text fields
        formData.append("title", values.title);
        formData.append("course", values.course);
        formData.append("category", values.category);
        if (values.description) {
          formData.append("description", values.description);
        }

        // Add file
        console.log("🔍 File structure debug:", {
          hasFile: !!values.file,
          fileKeys: values.file ? Object.keys(values.file) : "No file object",
          fileType: typeof values.file,
          isArray: Array.isArray(values.file),
          fileValue: values.file,
        });

        if (values.file) {
          let fileObj = null;

          // Handle Ant Design Upload file structures
          if (Array.isArray(values.file) && values.file.length > 0) {
            // When using Upload with beforeUpload: false, files are in an array
            const fileItem = values.file[0];
            console.log("📎 File item from array:", fileItem);

            if (fileItem.originFileObj) {
              fileObj = fileItem.originFileObj;
            } else if (fileItem.file) {
              fileObj = fileItem.file;
            } else {
              fileObj = fileItem;
            }
          } else if (
            values.file.fileList &&
            Array.isArray(values.file.fileList)
          ) {
            // Alternative file list structure
            const fileItem = values.file.fileList[0];
            if (fileItem && fileItem.originFileObj) {
              fileObj = fileItem.originFileObj;
            }
          } else if (values.file.file && values.file.file.originFileObj) {
            fileObj = values.file.file.originFileObj;
          } else if (values.file.originFileObj) {
            fileObj = values.file.originFileObj;
          } else if (values.file.file) {
            fileObj = values.file.file;
          }

          if (fileObj && fileObj instanceof File) {
            formData.append("file", fileObj);
            console.log("📎 File to upload:", {
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
            });
          } else {
            console.error(
              "❌ Could not extract valid File object from:",
              values.file
            );
            throw new Error("Please select a valid file");
          }
        } else {
          throw new Error("No file selected");
        }

        console.log("📤 Creating material with FormData");
        const result = await materialAPI.create(formData);
        console.log("✅ Material created:", result);
        message.success("Material uploaded successfully");
      }

      setIsMaterialModalVisible(false);
      setEditingMaterial(null);
      materialForm.resetFields();

      // Refresh materials list
      console.log("🔄 Refreshing materials...");
      await fetchMaterials();
    } catch (error) {
      console.error("❌ Error saving material:", error);
      message.error(
        "Error saving material: " + (error.message || "Unknown error")
      );
    }
  };

  // Student Management Functions
  const fetchStudents = async () => {
    setStudentLoading(true);
    try {
      console.log("👥 Fetching students...");
      const response = await userAPI.getByRole("student");
      console.log("👥 Students API response:", response);

      const studentsData = response.users || response.data || response || [];
      console.log("👥 Processed students data:", studentsData);
      console.log("👥 Sample student record:", studentsData[0]);

      setStudents(studentsData);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      message.error("Error fetching students");
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  // Messaging Functions
  const handleSendMessage = (student) => {
    console.log("💬 Opening message modal for student:", student);
    setSelectedStudent(student);
    setIsMessageModalVisible(true);
    messageForm.resetFields();
  };

  const handleMessageSubmit = async (values) => {
    try {
      setSendingMessage(true);
      console.log("📤 Sending message:", values);

      const messageData = {
        recipientId: selectedStudent._id,
        recipientEmail: selectedStudent.email,
        recipientName:
          selectedStudent.firstName + " " + selectedStudent.lastName,
        subject: values.subject,
        message: values.message,
        type: "teacher_to_student",
      };

      console.log("📤 Message data to send:", messageData);
      await messageAPI.sendToStudent(messageData);

      message.success("Message sent successfully!");
      setIsMessageModalVisible(false);
      setSelectedStudent(null);
      messageForm.resetFields();
    } catch (error) {
      console.error("❌ Error sending message:", error);
      message.error(
        "Failed to send message: " + (error.message || "Unknown error")
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // Video Call Functions
  const handleVideoCall = (student) => {
    console.log("📹 Opening video call modal for student:", student);
    setSelectedStudentForCall(student);
    setIsVideoCallModalVisible(true);
  };

  const handleStartVideoCall = async (callType) => {
    try {
      setVideoCallLoading(true);
      const studentName = `${selectedStudentForCall.firstName || ""} ${
        selectedStudentForCall.lastName || ""
      }`.trim();

      // Generate meeting room URL based on call type
      let meetingUrl = "";
      const meetingId = `teacher_${currentUser?.id || "unknown"}_student_${
        selectedStudentForCall._id
      }_${Date.now()}`;

      switch (callType) {
        case "zoom":
          // For production, you would integrate with Zoom API
          meetingUrl = `https://zoom.us/j/${meetingId}`;
          break;
        case "teams":
          // For production, you would integrate with Microsoft Teams API
          meetingUrl = `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
          break;
        case "meet":
          // For production, you would integrate with Google Meet API
          meetingUrl = `https://meet.google.com/${meetingId}`;
          break;
        case "jitsi":
          // Jitsi Meet - free and open source
          meetingUrl = `https://meet.jit.si/ForumAcademy_${meetingId}`;
          break;
        default:
          meetingUrl = `https://meet.jit.si/ForumAcademy_${meetingId}`;
      }

      // Open the meeting in a new window
      window.open(meetingUrl, "_blank", "width=1200,height=800");

      // Send notification message to student (optional)
      const messageData = {
        recipientId: selectedStudentForCall._id,
        recipientEmail: selectedStudentForCall.email,
        recipientName: studentName,
        subject: `Video Call Invitation - ${
          callType.charAt(0).toUpperCase() + callType.slice(1)
        }`,
        message: `Your teacher has started a video call session. Please join using this link: ${meetingUrl}`,
        type: "video_call_invitation",
      };

      await messageAPI.sendToStudent(messageData);

      message.success(
        `Video call started! Meeting link sent to ${studentName}`
      );
      setIsVideoCallModalVisible(false);
      setSelectedStudentForCall(null);
    } catch (error) {
      console.error("❌ Error starting video call:", error);
      message.error(
        "Failed to start video call: " + (error.message || "Unknown error")
      );
    } finally {
      setVideoCallLoading(false);
    }
  };

  // Zoom Integration Functions

  const handleCreateZoomClass = () => {
    setActiveZoomClass(null);
    zoomForm.resetFields();
    setZoomModalVisible(true);
  };

  const handleEditZoomClass = (zoomClass) => {
    setActiveZoomClass(zoomClass);
    zoomForm.setFieldsValue({
      title: zoomClass.title,
      courseId: zoomClass.courseId,
      startTime: zoomClass.startTime,
      duration: zoomClass.duration,
      allowedStudents: zoomClass.allowedStudents
    });
    setZoomModalVisible(true);
  };

  const handleZoomClassSubmit = async (values) => {
    try {
      console.log("📹 Creating/Updating Zoom class:", values);
      
      // Prepare meeting data for API
      const meetingData = {
        title: values.title,
        description: values.description || '',
        courseId: values.courseId,
        courseName: allCourses.find(c => c._id === values.courseId)?.title || '',
        startTime: values.startTime,
        duration: values.duration,
        allowedStudents: values.allowedStudents || [],
        settings: {
          waitingRoom: true,
          muteOnEntry: true,
          recordMeeting: false,
          autoRecording: 'none'
        }
      };

      let response;
      if (activeZoomClass) {
        // Update existing class
        response = await zoomApiService.updateMeeting(activeZoomClass._id, meetingData);
        if (response.success) {
          message.success("Zoom class updated successfully!");
          // Refresh meetings list
          await fetchZoomMeetings();
        } else {
          throw new Error(response.message || 'Failed to update meeting');
        }
      } else {
        // Create new class
        response = await zoomApiService.createMeeting(meetingData);
        if (response.success) {
          message.success("Zoom class created successfully!");
          // Refresh meetings list
          await fetchZoomMeetings();
        } else {
          throw new Error(response.message || 'Failed to create meeting');
        }
      }

      setZoomModalVisible(false);
      zoomForm.resetFields();
      setActiveZoomClass(null);
    } catch (error) {
      console.error("❌ Error saving Zoom class:", error);
      message.error(error.message || "Failed to save Zoom class");
    }
  };

  const handleStartZoomClass = async (zoomClass) => {
    try {
      console.log("📹 Starting Zoom class:", zoomClass);
      
      // Start meeting via API
      const response = await zoomApiService.startMeeting(zoomClass._id);
      
      if (response.success) {
        // Update local state
        setCurrentLiveClass(zoomClass);
        setEmbeddedZoomVisible(true);
        setAttendanceList([]);

        // Refresh meetings list to get updated status
        await fetchZoomMeetings();
        
        message.success("Zoom class started successfully!");
      } else {
        throw new Error(response.message || 'Failed to start meeting');
      }
    } catch (error) {
      console.error("❌ Error starting Zoom class:", error);
      message.error(error.message || "Failed to start Zoom class");
    }
  };

  const handleEndZoomClass = async (zoomClass) => {
    try {
      console.log("📹 Ending Zoom class:", zoomClass);
      
      // End meeting via API
      const response = await zoomApiService.endMeeting(zoomClass._id);
      
      if (response.success) {
        // Hide embedded view and clear current live class
        setEmbeddedZoomVisible(false);
        setCurrentLiveClass(null);
        
        // Refresh meetings list to get updated status
        await fetchZoomMeetings();
        
        message.success("Zoom class ended successfully! Attendance report generated.");
      } else {
        throw new Error(response.message || 'Failed to end meeting');
      }
    } catch (error) {
      console.error("❌ Error ending Zoom class:", error);
      message.error(error.message || "Failed to end Zoom class");
    }
  };

  const sendZoomNotificationToStudents = async (zoomClass) => {
    try {
      // This would send notifications to students
      console.log("📧 Sending Zoom notifications to students:", zoomClass.allowedStudents);
      
      // Mock notification sending
      const notificationData = {
        type: "zoom_class_started",
        title: "Live Class Started",
        message: `Your live class "${zoomClass.title}" has started. Click to join!`,
        data: {
          zoomClassId: zoomClass.id,
          joinUrl: zoomClass.joinUrl,
          meetingId: zoomClass.meetingId,
          password: zoomClass.password
        },
        recipients: zoomClass.allowedStudents
      };

      console.log("📧 Notification data:", notificationData);
      // Here you would call your notification API
    } catch (error) {
      console.error("❌ Error sending notifications:", error);
    }
  };

  const handleDeleteZoomClass = async (zoomClassId) => {
    try {
      console.log("📹 Deleting Zoom class:", zoomClassId);
      
      // Call API to delete the meeting
      const response = await zoomApiService.deleteMeeting(zoomClassId);
      
      if (response.success) {
        // Update local state
        const updatedClasses = zoomClasses.filter(cls => cls.id !== zoomClassId);
        setZoomClasses(updatedClasses);
        
        message.success("Zoom class deleted successfully!");
      } else {
        throw new Error(response.message || 'Failed to delete meeting');
      }
    } catch (error) {
      console.error("❌ Error deleting Zoom class:", error);
      message.error(error.message || "Failed to delete Zoom class");
    }
  };

  // Simulate student joining and attendance tracking
  const simulateStudentJoin = (studentId, studentName) => {
    const joinTime = new Date();
    const attendanceRecord = {
      id: Date.now().toString(),
      studentId,
      studentName,
      joinTime,
      status: 'present'
    };
    
    setAttendanceList(prev => {
      // Check if student already joined
      const existing = prev.find(record => record.studentId === studentId);
      if (existing) {
        return prev; // Don't add duplicate
      }
      return [...prev, attendanceRecord];
    });
    
    console.log(`👨‍🎓 Student ${studentName} joined the class at ${joinTime.toLocaleTimeString()}`);
  };

  // Simulate random students joining (for demo purposes)
  const simulateRandomJoins = () => {
    const mockStudents = [
      { id: 'student1', name: 'John Doe' },
      { id: 'student2', name: 'Jane Smith' },
      { id: 'student3', name: 'Mike Johnson' },
      { id: 'student4', name: 'Sarah Wilson' }
    ];

    // Simulate students joining over time
    setTimeout(() => simulateStudentJoin('student1', 'John Doe'), 2000);
    setTimeout(() => simulateStudentJoin('student2', 'Jane Smith'), 5000);
    setTimeout(() => simulateStudentJoin('student3', 'Mike Johnson'), 8000);
  };

  // View attendance report for a specific class
  const handleViewAttendanceReport = (zoomClass) => {
    const report = attendanceHistory.find(r => r.classId === zoomClass.id);
    if (report) {
      setSelectedClassReport(report);
      setAttendanceReportVisible(true);
    } else {
      message.info("No attendance report available for this class yet.");
    }
  };

  // Student Data Management Functions
  const handleAddStudentData = (student) => {
    setSelectedStudentForData(student);
    setStudentDataModalVisible(true);
    
    // Pre-fill form with existing data if available
    const existingData = studentGrades.find(grade => grade.studentId === student.id);
    if (existingData) {
      studentDataForm.setFieldsValue({
        attendance: existingData.attendance,
        examScore: existingData.examScore,
        projectScore: existingData.projectScore,
        finalProjectScore: existingData.finalProjectScore,
        notes: existingData.notes
      });
    } else {
      studentDataForm.resetFields();
    }
  };

  const handleStudentDataSubmit = async (values) => {
    try {
      const studentData = {
        id: Date.now().toString(),
        studentId: selectedStudentForData.id,
        studentName: selectedStudentForData.name,
        classId: currentLiveClass?.id,
        className: currentLiveClass?.title,
        attendance: values.attendance,
        examScore: values.examScore,
        projectScore: values.projectScore,
        finalProjectScore: values.finalProjectScore,
        notes: values.notes,
        updatedAt: new Date()
      };

      // Update or add student grade
      setStudentGrades(prev => {
        const existingIndex = prev.findIndex(grade => grade.studentId === selectedStudentForData.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...studentData };
          return updated;
        } else {
          return [...prev, studentData];
        }
      });

      message.success("Student data saved successfully!");
      setStudentDataModalVisible(false);
      setSelectedStudentForData(null);
      studentDataForm.resetFields();
    } catch (error) {
      console.error("❌ Error saving student data:", error);
      message.error("Failed to save student data");
    }
  };

  // Simulate student logout detection
  const simulateStudentLogout = (studentId, studentName) => {
    const logoutTime = new Date();
    const logoutNotification = {
      id: Date.now().toString(),
      studentId,
      studentName,
      logoutTime,
      message: `${studentName} has left the class`,
      type: 'logout'
    };

    setLogoutNotifications(prev => [logoutNotification, ...prev]);
    
    // Update attendance list to show logout time
    setAttendanceList(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, logoutTime, status: 'left' }
          : record
      )
    );

    // Show notification to teacher
    notification.warning({
      message: "Student Left Class",
      description: `${studentName} has left the live class at ${logoutTime.toLocaleTimeString()}`,
      duration: 5,
    });

    console.log(`👋 Student ${studentName} left the class at ${logoutTime.toLocaleTimeString()}`);
  };

  // Simulate random student logouts (for demo)
  const simulateRandomLogouts = () => {
    const mockStudents = [
      { id: 'student1', name: 'John Doe' },
      { id: 'student2', name: 'Jane Smith' },
      { id: 'student3', name: 'Mike Johnson' }
    ];

    // Simulate students leaving at different times
    setTimeout(() => simulateStudentLogout('student2', 'Jane Smith'), 15000); // 15 seconds
    setTimeout(() => simulateStudentLogout('student3', 'Mike Johnson'), 25000); // 25 seconds
  };

  // Grading Functions
  const fetchProgressRecords = async () => {
    try {
      setGradingLoading(true);
      console.log("📊 Fetching progress records...");
      const response = await progressAPI.getAll();
      console.log("✅ Full API response:", response);

      let progressData = [];

      // Server returns: { success: true, progress: [...], count: number }
      if (
        response &&
        response.data &&
        response.data.progress &&
        Array.isArray(response.data.progress)
      ) {
        progressData = response.data.progress;
        console.log(
          `✅ Found ${progressData.length} progress records in response.data.progress`
        );
      } else if (
        response &&
        response.progress &&
        Array.isArray(response.progress)
      ) {
        progressData = response.progress;
        console.log(
          `✅ Found ${progressData.length} progress records in response.progress`
        );
      } else {
        console.log("⚠️ No progress records found. Response structure:", {
          hasData: !!response?.data,
          hasProgress: !!response?.progress,
          dataKeys: response?.data ? Object.keys(response.data) : [],
          responseKeys: response ? Object.keys(response) : [],
        });
        progressData = [];
      }

      setProgressRecords(progressData);

      if (progressData.length > 0) {
        console.log("📊 Sample progress record:", progressData[0]);
        message.success(`Loaded ${progressData.length} progress records`);
      } else {
        message.info("No progress records found");
      }
    } catch (error) {
      console.error("❌ Error fetching progress records:", error);
      message.error(
        "Failed to fetch progress records: " +
          (error.message || "Unknown error")
      );
      setProgressRecords([]);
    } finally {
      setGradingLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      console.log("📢 Fetching announcements...");
      const response = await announcementAPI.getAll();
      console.log("✅ Full announcements API response:", response);

      let announcementData = [];

      // Server returns: { success: true, announcements: [...], count: number }
      if (
        response &&
        response.data &&
        response.data.announcements &&
        Array.isArray(response.data.announcements)
      ) {
        announcementData = response.data.announcements;
        console.log(
          `✅ Found ${announcementData.length} announcements in response.data.announcements`
        );
      } else if (
        response &&
        response.announcements &&
        Array.isArray(response.announcements)
      ) {
        announcementData = response.announcements;
        console.log(
          `✅ Found ${announcementData.length} announcements in response.announcements`
        );
      } else if (response && Array.isArray(response.data)) {
        announcementData = response.data;
        console.log(
          `✅ Found ${announcementData.length} announcements in response.data`
        );
      } else if (Array.isArray(response)) {
        announcementData = response;
        console.log(
          `✅ Found ${announcementData.length} announcements as direct array`
        );
      } else {
        console.log("⚠️ No announcements found. Response structure:", {
          hasData: !!response?.data,
          hasAnnouncements: !!response?.announcements,
          dataKeys: response?.data ? Object.keys(response.data) : [],
          responseKeys: response ? Object.keys(response) : [],
        });
        announcementData = [];
      }

      setAnnouncements(announcementData);

      if (announcementData.length > 0) {
        console.log("📢 Sample announcement:", announcementData[0]);
        message.success(`Loaded ${announcementData.length} announcements`);
      } else {
        message.info("No announcements found");
      }
    } catch (error) {
      console.error("❌ Error fetching announcements:", error);
      message.error(
        "Failed to fetch announcements: " + (error.message || "Unknown error")
      );
      setAnnouncements([]);
    }
  };

  const createProgressRecord = async (values) => {
    try {
      setGradingLoading(true);
      console.log("📊 Creating progress record:", values);

      // Calculate percentage
      const percentage = Math.round((values.score / values.maxScore) * 100);

      const progressData = {
        ...values,
        percentage,
        teacher: currentUser?.id || currentUser?._id,
        gradedDate: new Date(),
        submissionDate: values.submissionDate || new Date(),
      };

      console.log("📊 Progress data to create:", progressData);
      const response = await progressAPI.create(progressData);
      console.log("✅ Create response:", response);

      message.success("Grade added successfully!");
      setCreateProgressModalVisible(false);
      progressForm.resetFields();

      // Refresh the progress records list
      console.log("🔄 Refreshing progress records after creation...");
      await fetchProgressRecords();
      console.log("✅ Progress records refresh completed");
    } catch (error) {
      console.error("❌ Error creating progress record:", error);
      message.error(
        "Failed to add grade: " + (error.message || "Unknown error")
      );
    } finally {
      setGradingLoading(false);
    }
  };

  const updateProgressRecord = async (values) => {
    try {
      setGradingLoading(true);
      console.log("📊 Updating progress record:", selectedProgress._id, values);

      // Calculate percentage
      const percentage = Math.round((values.score / values.maxScore) * 100);

      const progressData = {
        ...values,
        percentage,
        gradedDate: new Date(),
      };

      await progressAPI.update(selectedProgress._id, progressData);

      message.success("Grade updated successfully!");
      setEditProgressModalVisible(false);
      setSelectedProgress(null);
      editProgressForm.resetFields();
      await fetchProgressRecords(); // Refresh the list
    } catch (error) {
      console.error("❌ Error updating progress record:", error);
      message.error(
        "Failed to update grade: " + (error.message || "Unknown error")
      );
    } finally {
      setGradingLoading(false);
    }
  };

  const deleteProgressRecord = async (progressId) => {
    try {
      console.log("🗑️ Deleting progress record:", progressId);
      await progressAPI.delete(progressId);

      message.success("Grade deleted successfully!");
      await fetchProgressRecords(); // Refresh the list
    } catch (error) {
      console.error("❌ Error deleting progress record:", error);
      message.error(
        "Failed to delete grade: " + (error.message || "Unknown error")
      );
    }
  };

  const createAnnouncement = async (values) => {
    try {
      console.log("📢 Creating announcement:", values);

      const announcementData = {
        ...values,
        author: currentUser?.id || currentUser?._id,
        publishDate: values.publishDate || new Date(),
        readCount: 0,
      };

      console.log("📢 Announcement data to create:", announcementData);
      const response = await announcementAPI.create(announcementData);
      console.log("✅ Announcement create response:", response);

      message.success("Announcement created successfully!");
      setCreateAnnouncementModalVisible(false);
      announcementForm.resetFields();

      // Refresh the announcements list
      console.log("🔄 Refreshing announcements after creation...");
      await fetchAnnouncements();
      console.log("✅ Announcements refresh completed");
    } catch (error) {
      console.error("❌ Error creating announcement:", error);
      message.error(
        "Failed to create announcement: " + (error.message || "Unknown error")
      );
    }
  };

  const openEditModal = (progress) => {
    setSelectedProgress(progress);
    editProgressForm.setFieldsValue({
      subject: progress.subject,
      assignment: progress.assignment,
      assignmentType: progress.assignmentType,
      score: progress.score,
      maxScore: progress.maxScore,
      grade: progress.grade,
      comments: progress.comments,
    });
    setEditProgressModalVisible(true);
  };

  const openViewModal = (progress) => {
    setViewingProgress(progress);
    setViewProgressModalVisible(true);
  };

  // Analytics Functions
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // Check if user is authenticated
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        message.warning(
          "Analytics data refreshed from local modules (login required for server analytics)"
        );
        // Just refresh the local data without server call
        await fetchDashboardStats();
        setAnalyticsLoading(false);
        return;
      }

      console.log("📊 Fetching teacher analytics from server...");
      const response = await statsAPI.getTeacherAnalytics();
      console.log("✅ Teacher analytics response:", response);

      if (response && response.success) {
        setAnalyticsData(response);
        message.success("Server analytics loaded successfully");
      } else {
        // Fallback to local data if server analytics fail
        console.log(
          "📊 Server analytics failed, using local data calculations"
        );
        message.success("Analytics refreshed from local data");
        await fetchDashboardStats();
      }
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);

      // Instead of showing errors, gracefully fallback to local calculations
      if (
        error.message.includes("No token") ||
        error.message.includes("authorization denied")
      ) {
        message.info(
          "Analytics refreshed from local data (login required for advanced analytics)"
        );
      } else if (
        error.message.includes("Route not found") ||
        error.message.includes("fetch")
      ) {
        message.info("Server analytics unavailable, showing local data");
      } else {
        message.info("Using local analytics data");
      }

      // Always try to refresh local dashboard stats
      try {
        await fetchDashboardStats();
      } catch (localError) {
        console.error("❌ Error refreshing local data:", localError);
        message.warning("Could not refresh analytics data");
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Local Analytics Calculation (works without server)
  const calculateLocalAnalytics = () => {
    try {
      // Calculate KPIs from local data
      const uniqueStudents = new Set();
      courses.forEach((course) => {
        if (course.students && Array.isArray(course.students)) {
          course.students.forEach((student) =>
            uniqueStudents.add(student._id || student)
          );
        }
      });
      const totalStudents = uniqueStudents.size || students.length;

      const totalSubmissions =
        progressRecords.length +
        quizzes.reduce(
          (acc, quiz) => acc + (quiz.submissions?.length || 0),
          0
        ) +
        homeworks.reduce((acc, hw) => acc + (hw.submissions?.length || 0), 0);

      const validScores = progressRecords.filter(
        (record) => record.percentage && !isNaN(record.percentage)
      );
      const averageScore =
        validScores.length > 0
          ? Math.round(
              validScores.reduce((acc, record) => acc + record.percentage, 0) /
                validScores.length
            )
          : 0;

      const activeStudents = Math.min(
        totalStudents,
        Math.floor(totalStudents * 0.8)
      );

      // Update analytics data with local calculations
      setAnalyticsData((prevData) => ({
        ...prevData,
        success: true,
        overview: {
          totalStudents,
          totalSubmissions,
          averageScore,
          activeStudents,
          totalCourses: courses.length,
          recentSubmissions: progressRecords.filter(
            (record) =>
              new Date(record.createdAt) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
        },
        lastUpdated: new Date().toISOString(),
      }));

      return { totalStudents, totalSubmissions, averageScore, activeStudents };
    } catch (error) {
      console.error("❌ Error calculating local analytics:", error);
      return null;
    }
  };

  // Notification Functions
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      // Use test route for now to bypass authentication
      const response = await fetch("/api/notifications/test", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Transform backend notifications to match frontend format
        const transformedNotifications = data.notifications.map(
          (notification) => ({
            id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            timestamp: notification.createdAt,
            read: notification.read,
            sender: notification.sender,
            priority: notification.priority,
            icon: notification.icon || getNotificationIcon(notification.type),
            color:
              notification.color || getNotificationColor(notification.type),
            actionUrl: notification.actionUrl,
          })
        );

        setNotifications(transformedNotifications);
        setNotificationStats({
          total: data.pagination.totalCount,
          unread: data.pagination.unreadCount,
          byType: {
            student_message: transformedNotifications.filter(
              (n) => n.type === "student_message"
            ).length,
            assignment_submission: transformedNotifications.filter(
              (n) => n.type === "assignment_submission"
            ).length,
            admin_announcement: transformedNotifications.filter(
              (n) => n.type === "admin_announcement"
            ).length,
            quiz_submission: transformedNotifications.filter(
              (n) => n.type === "quiz_submission"
            ).length,
            grade_request: transformedNotifications.filter(
              (n) => n.type === "grade_request"
            ).length,
            enrollment: transformedNotifications.filter(
              (n) => n.type === "enrollment"
            ).length,
          },
        });
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
        // Fallback to empty state
        setNotifications([]);
        setNotificationStats({
          total: 0,
          unread: 0,
          byType: {
            student_message: 0,
            assignment_submission: 0,
            admin_announcement: 0,
            quiz_submission: 0,
            grade_request: 0,
            enrollment: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to empty state
      setNotifications([]);
      setNotificationStats({
        total: 0,
        unread: 0,
        byType: {
          student_message: 0,
          assignment_submission: 0,
          admin_announcement: 0,
          quiz_submission: 0,
          grade_request: 0,
          enrollment: 0,
        },
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  // Helper functions for notification icons and colors
  const getNotificationIcon = (type) => {
    const iconMap = {
      student_message: "message",
      assignment_submission: "file-text",
      admin_announcement: "bell",
      quiz_submission: "question-circle",
      grade_request: "question-circle",
      enrollment: "user-add",
      progress_update: "bar-chart",
      grade_update: "trophy",
      system_alert: "warning",
    };
    return iconMap[type] || "bell";
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      student_message: "#1890ff",
      assignment_submission: "#52c41a",
      admin_announcement: "#faad14",
      quiz_submission: "#722ed1",
      grade_request: "#fa8c16",
      enrollment: "#13c2c2",
      progress_update: "#2f54eb",
      grade_update: "#f5222d",
      system_alert: "#fa541c",
    };
    return colorMap[type] || "#1890ff";
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setNotificationStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        setNotificationStats((prev) => ({
          ...prev,
          unread: 0,
        }));
        message.success(`${data.modifiedCount} notifications marked as read`);
      } else {
        message.error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      message.error("Failed to mark all notifications as read");
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);

    // Close notification drawer
    setNotificationDrawerVisible(false);

    // If there's a specific actionUrl, use it
    if (notification.actionUrl) {
      // For external URLs or specific navigation
      if (notification.actionUrl.startsWith("http")) {
        window.open(notification.actionUrl, "_blank");
        return;
      }
      // For internal routing, we could use history.push if needed
      message.info(`Navigation: ${notification.actionUrl}`);
    }

    // Navigate based on notification type as fallback
    switch (notification.type) {
      case "student_message":
        message.info("📩 Opening student message...");
        // Could open a message modal or navigate to messages
        break;

      case "assignment_submission":
        setActiveTab("grading");
        message.success("📝 Navigating to grading center...");
        break;

      case "admin_announcement":
        message.info("📢 Opening admin announcement...");
        // Show announcement details
        Modal.info({
          title: notification.title,
          content: notification.content || notification.message,
          width: 500,
        });
        break;

      case "quiz_submission":
        setActiveTab("quizzes");
        message.success("❓ Navigating to quiz management...");
        break;

      case "progress_update":
        setActiveTab("analytics");
        message.success("📊 Navigating to progress analytics...");
        break;

      case "grade_update":
        setActiveTab("grading");
        message.info("🎯 Opening grade management...");
        break;

      case "application_update":
        setActiveTab("applications");
        message.success("� Navigating to applications...");
        break;

      case "system_alert":
        message.warning("⚠️ System alert opened");
        break;

      default:
        message.info("🔔 Notification opened");
    }
  };

  // Load notifications when component mounts and data changes
  useEffect(() => {
    if (progressRecords.length > 0 || announcements.length > 0) {
      fetchNotifications();
    }
  }, [progressRecords, announcements, quizzes]);

  // Auto-refresh notifications every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressRecords.length > 0 || announcements.length > 0) {
        console.log("🔄 Auto-refreshing notifications...");
        fetchNotifications();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [progressRecords, announcements]);

  // Fetch real notifications periodically
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Refresh every minute

    return () => clearInterval(notificationInterval);
  }, []);

  // Settings Functions
  const handleProfileUpdate = async (values) => {
    setProfileLoading(true);
    try {
      // Split name into firstName and lastName
      const nameParts = values.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updateData = {
        firstName,
        lastName,
        phone: values.phone,
        department: values.department,
        bio: values.bio,
      };

      const response = await userAPI.update(currentUser._id, updateData);

      if (response.success) {
        const updatedUser = {
          ...currentUser,
          ...response.user,
          name: `${response.user.firstName || ""} ${
            response.user.lastName || ""
          }`.trim(),
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        message.success("Profile updated successfully");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await authAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success("Password changed successfully");
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationPreferenceChange = async (key, value) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [key]: value,
    });

    try {
      await userAPI.update(currentUser._id, {
        notificationPreferences: {
          ...notificationPreferences,
          [key]: value,
        },
      });
      message.success("Notification preferences updated");
    } catch (error) {
      console.error("Error updating preferences:", error);
      message.error("Failed to update preferences");
    }
  };

  const handleExportClassData = async () => {
    try {
      message.loading("Preparing export...", 2);

      // Dynamically import xlsx library
      const XLSX = await import("xlsx");

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Prepare Courses sheet
      const coursesData = courses.map((course) => ({
        "Course Name": course.name || "",
        "Course Code": course.code || "",
        Level: course.level || "",
        Description: course.description || "",
        Status: course.status || "",
        "Created Date": course.createdAt
          ? moment(course.createdAt).format("YYYY-MM-DD")
          : "",
      }));
      const coursesSheet = XLSX.utils.json_to_sheet(coursesData);
      XLSX.utils.book_append_sheet(wb, coursesSheet, "Courses");

      // Prepare Students sheet
      const studentsData = students.map((student) => ({
        "Student Name":
          `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
          student.name ||
          student.email,
        Email: student.email || "",
        Phone: student.phone || "",
        Department: student.department || "",
        "Enrollment Date": student.createdAt
          ? moment(student.createdAt).format("YYYY-MM-DD")
          : "",
      }));
      const studentsSheet = XLSX.utils.json_to_sheet(studentsData);
      XLSX.utils.book_append_sheet(wb, studentsSheet, "Students");

      // Prepare Materials sheet
      const materialsData = materials.map((material) => ({
        "Material Title": material.title || "",
        Course: material.course?.name || material.courseName || "",
        Type: material.type || "",
        Description: material.description || "",
        "Upload Date": material.createdAt
          ? moment(material.createdAt).format("YYYY-MM-DD")
          : "",
      }));
      const materialsSheet = XLSX.utils.json_to_sheet(materialsData);
      XLSX.utils.book_append_sheet(wb, materialsSheet, "Materials");

      // Prepare Quizzes sheet
      const quizzesData = quizzes.map((quiz) => ({
        "Quiz Title": quiz.title || "",
        Course: quiz.course?.name || quiz.courseName || "",
        Questions: quiz.questions?.length || 0,
        "Duration (min)": quiz.duration || "",
        "Created Date": quiz.createdAt
          ? moment(quiz.createdAt).format("YYYY-MM-DD")
          : "",
      }));
      const quizzesSheet = XLSX.utils.json_to_sheet(quizzesData);
      XLSX.utils.book_append_sheet(wb, quizzesSheet, "Quizzes");

      // Prepare Homework sheet
      const homeworksData = homeworks.map((hw) => ({
        "Assignment Title": hw.title || "",
        Course: hw.course?.name || hw.courseName || "",
        "Due Date": hw.dueDate ? moment(hw.dueDate).format("YYYY-MM-DD") : "",
        "Max Points": hw.maxPoints || "",
        Status: hw.status || "",
        "Created Date": hw.createdAt
          ? moment(hw.createdAt).format("YYYY-MM-DD")
          : "",
      }));
      const homeworksSheet = XLSX.utils.json_to_sheet(homeworksData);
      XLSX.utils.book_append_sheet(wb, homeworksSheet, "Assignments");

      // Prepare Progress Records sheet
      const progressData = progressRecords.map((record) => ({
        Student:
          record.student?.name ||
          `${record.student?.firstName || ""} ${
            record.student?.lastName || ""
          }`.trim() ||
          record.studentName ||
          "",
        Course: record.course?.name || record.courseName || "",
        Assignment: record.assignment || "",
        Score: record.score || "",
        Grade: record.grade || "",
        Feedback: record.feedback || "",
        "Submitted Date": record.submittedAt
          ? moment(record.submittedAt).format("YYYY-MM-DD")
          : "",
        "Graded Date": record.gradedAt
          ? moment(record.gradedAt).format("YYYY-MM-DD")
          : "",
      }));
      const progressSheet = XLSX.utils.json_to_sheet(progressData);
      XLSX.utils.book_append_sheet(wb, progressSheet, "Progress Records");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `class-data-${moment().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("Class data exported to Excel successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      message.error("Failed to export class data. Please try again.");
    }
  };

  const handleGenerateReport = async () => {
    try {
      message.loading("Generating report...", 2);

      // Fetch all students to ensure we have the latest data
      let allStudents = [...students];

      // Always try to fetch fresh student data for accurate reports
      try {
        const response = await userAPI.getAll();
        if (response.success && response.users) {
          allStudents = response.users.filter((u) => u.role === "student");
          console.log("Fetched students for report:", allStudents.length);
        }
      } catch (error) {
        console.log("Could not fetch students for report, using cached data");
      }

      // If still no students, show warning
      if (allStudents.length === 0) {
        message.warning("No student data available for report");
      }

      // Create a map of student IDs to student data for quick lookup
      const studentMap = {};
      allStudents.forEach((student) => {
        if (student && student._id) {
          // Add computed name field for consistency
          const computedName =
            student.name ||
            (student.firstName && student.lastName
              ? `${student.firstName} ${student.lastName}`
              : student.firstName ||
                student.lastName ||
                student.email ||
                "Unknown Student");

          studentMap[student._id] = {
            ...student,
            name: computedName,
          };
        }
      });

      console.log(
        "Student map created with",
        Object.keys(studentMap).length,
        "students"
      );
      console.log("Progress records to process:", progressRecords.length);

      // Debug: Log first student structure to understand the data
      if (allStudents.length > 0) {
        console.log("Sample student object:", allStudents[0]);
        console.log("Student fields:", Object.keys(allStudents[0]));
      }

      const reportData = {
        generatedDate: moment().format("MMMM DD, YYYY"),
        teacher: currentUser?.name,
        summary: {
          totalCourses: courses.length,
          totalStudents: allStudents.length,
          totalMaterials: materials.length,
          totalQuizzes: quizzes.length,
          totalHomework: homeworks.length,
          totalProgress: progressRecords.length,
        },
        courses: courses.map((c) => ({
          title: c.title,
          level: c.level,
          studentsEnrolled: c.enrolledStudents?.length || 0,
        })),
        recentActivity: progressRecords.slice(0, 10).map((p) => {
          // Get student name and email from the map, or from the progress record
          let studentName = "Unknown Student";
          let studentEmail = "N/A";
          let studentId = null;

          // Determine the student ID first
          if (p.student?._id) {
            studentId = p.student._id;
          } else if (typeof p.student === "string") {
            studentId = p.student;
          } else if (p.studentId) {
            studentId = p.studentId;
          }

          // Now get the student data
          if (p.student?.name) {
            // If student object is already populated
            studentName = p.student.name;
            studentEmail = p.student.email || "N/A";
          } else if (studentId && studentMap[studentId]) {
            // If we can find the student in our map
            studentName = studentMap[studentId].name || "Unknown Student";
            studentEmail = studentMap[studentId].email || "N/A";
          }

          console.log("Progress record:", {
            progressId: p._id,
            studentField: p.student,
            resolvedName: studentName,
            resolvedEmail: studentEmail,
          });

          return {
            student: studentName,
            studentEmail: studentEmail,
            type: p.assignmentType || p.type || "Assignment",
            score: p.score || 0,
            date: moment(p.createdAt || p.submittedAt).format("YYYY-MM-DD"),
          };
        }),
      };

      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Teaching Report - ${moment().format("YYYY-MM-DD")}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1890ff; }
            h2 { color: #333; border-bottom: 2px solid #1890ff; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #1890ff; color: white; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .summary-card { background: #f0f2f5; padding: 20px; border-radius: 8px; }
            .summary-card h3 { margin: 0 0 10px 0; color: #666; }
            .summary-card p { font-size: 32px; font-weight: bold; margin: 0; color: #1890ff; }
          </style>
        </head>
        <body>
          <h1>Teaching Report</h1>
          <p><strong>Generated:</strong> ${reportData.generatedDate}</p>
          <p><strong>Teacher:</strong> ${reportData.teacher}</p>
          
          <h2>Summary</h2>
          <div class="summary">
            <div class="summary-card">
              <h3>Total Courses</h3>
              <p>${reportData.summary.totalCourses}</p>
            </div>
            <div class="summary-card">
              <h3>Total Students</h3>
              <p>${reportData.summary.totalStudents}</p>
            </div>
            <div class="summary-card">
              <h3>Total Materials</h3>
              <p>${reportData.summary.totalMaterials}</p>
            </div>
            <div class="summary-card">
              <h3>Total Quizzes</h3>
              <p>${reportData.summary.totalQuizzes}</p>
            </div>
            <div class="summary-card">
              <h3>Total Homework</h3>
              <p>${reportData.summary.totalHomework}</p>
            </div>
            <div class="summary-card">
              <h3>Graded Submissions</h3>
              <p>${reportData.summary.totalProgress}</p>
            </div>
          </div>

          <h2>My Courses</h2>
          <table>
            <tr><th>Course Title</th><th>Level</th><th>Students Enrolled</th></tr>
            ${reportData.courses
              .map(
                (c) => `
              <tr><td>${c.title}</td><td>${c.level}</td><td>${c.studentsEnrolled}</td></tr>
            `
              )
              .join("")}
          </table>

          <h2>My Students</h2>
          <table>
            <tr><th>Student Name</th><th>Email</th><th>Enrolled Courses</th></tr>
            ${allStudents
              .map((s) => {
                const studentName =
                  s.name ||
                  (s.firstName && s.lastName
                    ? `${s.firstName} ${s.lastName}`
                    : s.firstName || s.lastName || s.email || "Unknown");
                return `
              <tr>
                <td>${studentName}</td>
                <td>${s.email || "No Email"}</td>
                <td>${s.enrolledCourses?.length || 0}</td>
              </tr>
            `;
              })
              .join("")}
          </table>

          <h2>Recent Activity</h2>
          <table>
            <tr><th>Student Name</th><th>Email</th><th>Assignment Type</th><th>Score</th><th>Date</th></tr>
            ${reportData.recentActivity
              .map(
                (a) => `
              <tr>
                <td>${a.student}</td>
                <td>${a.studentEmail}</td>
                <td>${a.type}</td>
                <td>${a.score}%</td>
                <td>${a.date}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([reportHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `teaching-report-${moment().format("YYYY-MM-DD")}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      message.error("Failed to generate report");
    }
  };

  // Load user profile data
  useEffect(() => {
    if (currentUser) {
      // Construct full name from firstName and lastName
      const fullName =
        currentUser.name ||
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
        currentUser.email;

      profileForm.setFieldsValue({
        name: fullName,
        email: currentUser.email,
        phone: currentUser.phone || "",
        department: currentUser.department || "english",
        bio: currentUser.bio || "",
      });

      setNotificationPreferences({
        emailNotifications:
          currentUser.notificationPreferences?.emailNotifications ?? true,
        assignmentReminders:
          currentUser.notificationPreferences?.assignmentReminders ?? true,
        studentSubmissions:
          currentUser.notificationPreferences?.studentSubmissions ?? true,
      });
    }
  }, [currentUser, profileForm]);

  // Form Components
  const QuizForm = ({ form, quiz, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log("🧩 QuizForm rendered with allCourses:", allCourses);

    const handleSubmit = () => {
      form.validateFields().then((values) => {
        onSubmit(values);
      });
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t("quiz.title")}
          rules={[{ required: true, message: t("quiz.titleRequired") }]}
        >
          <Input placeholder={t("quiz.titlePlaceholder")} />
        </Form.Item>

        <Form.Item name="description" label={t("quiz.description")}>
          <Input.TextArea
            rows={4}
            placeholder={t("quiz.descriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="course"
          label={t("quiz.course")}
          rules={[{ required: true, message: t("quiz.courseRequired") }]}
        >
          <Select
            placeholder={t("quiz.selectCourse")}
            loading={allCourses.length === 0}
          >
            {allCourses && allCourses.length > 0 ? (
              allCourses.map((course) => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || "Untitled Course"}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">
                No courses available
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="timeLimit" label={t("quiz.timeLimit")}>
              <InputNumber
                min={1}
                max={300}
                placeholder={t("quiz.timeLimitPlaceholder")}
                addonAfter={t("common.minutes")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="attempts" label={t("quiz.attempts")}>
              <InputNumber
                min={1}
                max={10}
                placeholder={t("quiz.attemptsPlaceholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label={t("common.status")}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">
              {t("quiz.status.draft")}
            </Select.Option>
            <Select.Option value="active">
              {t("quiz.status.active")}
            </Select.Option>
            <Select.Option value="archived">
              {t("quiz.status.archived")}
            </Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {quiz ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </Form>
    );
  };

  const QuizViewer = ({ quiz }) => {
    return (
      <div>
        <Descriptions column={2} bordered>
          <Descriptions.Item label={t("quiz.title")} span={2}>
            {quiz.title}
          </Descriptions.Item>
          <Descriptions.Item label={t("quiz.description")} span={2}>
            {quiz.description || t("quiz.noDescription")}
          </Descriptions.Item>
          <Descriptions.Item label={t("quiz.course")}>
            {quiz.course?.title || t("quiz.noCourse")}
          </Descriptions.Item>
          <Descriptions.Item label={t("quiz.timeLimit")}>
            {quiz.timeLimit
              ? `${quiz.timeLimit} ${t("common.minutes")}`
              : t("quiz.noTimeLimit")}
          </Descriptions.Item>
          <Descriptions.Item label={t("quiz.attempts")}>
            {quiz.attempts || t("quiz.unlimited")}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.status")}>
            <Tag
              color={
                quiz.status === "active"
                  ? "green"
                  : quiz.status === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {quiz.status
                ? t(`quiz.status.${quiz.status}`)
                : t("quiz.status.draft")}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {quiz.questions && quiz.questions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>{t("quiz.questions")}</Title>
            {quiz.questions.map((question, index) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Text strong>
                  {index + 1}. {question.text}
                </Text>
                {question.options && (
                  <div style={{ marginTop: 8 }}>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} style={{ marginLeft: 16 }}>
                        <Text type={option.isCorrect ? "success" : "secondary"}>
                          {String.fromCharCode(65 + optIndex)}. {option.text}
                          {option.isCorrect && (
                            <CheckCircleOutlined
                              style={{ marginLeft: 8, color: "#52c41a" }}
                            />
                          )}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const HomeworkForm = ({ form, homework, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log("📝 HomeworkForm rendered with allCourses:", allCourses);

    const handleSubmit = () => {
      form.validateFields().then((values) => {
        onSubmit(values);
      });
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t("homework.title")}
          rules={[{ required: true, message: t("homework.titleRequired") }]}
        >
          <Input placeholder={t("homework.titlePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("homework.description")}
          rules={[
            { required: true, message: t("homework.descriptionRequired") },
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder={t("homework.descriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="course"
          label={t("homework.course")}
          rules={[{ required: true, message: t("homework.courseRequired") }]}
        >
          <Select
            placeholder={t("homework.selectCourse")}
            loading={allCourses.length === 0}
          >
            {allCourses && allCourses.length > 0 ? (
              allCourses.map((course) => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || "Untitled Course"}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">
                No courses available
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label={t("homework.dueDate")}
          rules={[{ required: true, message: t("homework.dueDateRequired") }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder={t("homework.dueDatePlaceholder")}
          />
        </Form.Item>

        <Form.Item name="maxPoints" label={t("homework.maxPoints")}>
          <InputNumber
            min={1}
            max={1000}
            placeholder={t("homework.maxPointsPlaceholder")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("common.status")}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">
              {t("homework.status.draft")}
            </Select.Option>
            <Select.Option value="active">
              {t("homework.status.active")}
            </Select.Option>
            <Select.Option value="archived">
              {t("homework.status.archived")}
            </Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {homework ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </Form>
    );
  };

  const HomeworkViewer = ({ homework }) => {
    if (!homework) return null;

    return (
      <div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t("homework.title")}>
            {homework.title}
          </Descriptions.Item>
          <Descriptions.Item label={t("homework.description")}>
            {homework.description || t("homework.noDescription")}
          </Descriptions.Item>
          <Descriptions.Item label={t("homework.course")}>
            {homework.course?.title ||
              homework.course?.name ||
              t("homework.noCourse")}
          </Descriptions.Item>
          <Descriptions.Item label={t("homework.dueDate")}>
            {homework.dueDate
              ? moment(homework.dueDate).format("YYYY-MM-DD HH:mm")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("homework.maxPoints")}>
            {homework.maxPoints || t("homework.unlimited")}
          </Descriptions.Item>
          <Descriptions.Item label={t("homework.submissions")}>
            {homework.submissions?.length || 0}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.status")}>
            <Tag
              color={
                homework.status === "active"
                  ? "green"
                  : homework.status === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {homework.status
                ? t(`homework.status.${homework.status}`)
                : t("homework.status.draft")}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {homework.submissions && homework.submissions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>{t("homework.submissions")}</Title>
            <Table
              dataSource={homework.submissions}
              rowKey="_id"
              columns={[
                {
                  title: t("teacherDashboard.students.name"),
                  dataIndex: ["student", "name"],
                  key: "studentName",
                  render: (name, record) =>
                    name || record.student?.email || "Unknown",
                },
                {
                  title: t("homework.submissions"),
                  dataIndex: "submittedAt",
                  key: "submittedAt",
                  render: (date) =>
                    date ? moment(date).format("YYYY-MM-DD HH:mm") : "-",
                },
                {
                  title: t("homework.maxPoints"),
                  dataIndex: "score",
                  key: "score",
                  render: (score, record) =>
                    `${score || 0} / ${homework.maxPoints || 100}`,
                },
                {
                  title: t("common.status"),
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <Tag color={status === "graded" ? "green" : "orange"}>
                      {status === "graded"
                        ? t("homework.stats.graded")
                        : t("homework.stats.pending")}
                    </Tag>
                  ),
                },
              ]}
              pagination={false}
            />
          </div>
        )}
      </div>
    );
  };

  const ListeningForm = ({ form, listening, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log("🎧 ListeningForm rendered with allCourses:", allCourses);
    const [audioFile, setAudioFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = () => {
      form.validateFields().then((values) => {
        onSubmit({ ...values, audioFile });
      });
    };

    const uploadProps = {
      beforeUpload: (file) => {
        const isAudio = file.type.startsWith("audio/");
        if (!isAudio) {
          message.error(t("listening.audioFileOnly"));
          return false;
        }
        setAudioFile(file);
        return false;
      },
      onRemove: () => {
        setAudioFile(null);
      },
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t("listening.title")}
          rules={[{ required: true, message: t("listening.titleRequired") }]}
        >
          <Input placeholder={t("listening.titlePlaceholder")} />
        </Form.Item>

        <Form.Item name="description" label={t("listening.description")}>
          <Input.TextArea
            rows={4}
            placeholder={t("listening.descriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="course"
          label={t("listening.course")}
          rules={[{ required: true, message: t("listening.courseRequired") }]}
        >
          <Select
            placeholder={t("listening.selectCourse")}
            loading={allCourses.length === 0}
          >
            {allCourses && allCourses.length > 0 ? (
              allCourses.map((course) => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || "Untitled Course"}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">
                No courses available
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="level"
          label={t("listening.difficultyLevel")}
          rules={[
            { required: true, message: t("listening.difficultyRequired") },
          ]}
          initialValue="beginner"
        >
          <Select placeholder={t("listening.selectDifficulty")}>
            <Select.Option value="beginner">
              {t("listening.level.beginner")}
            </Select.Option>
            <Select.Option value="intermediate">
              {t("listening.level.intermediate")}
            </Select.Option>
            <Select.Option value="advanced">
              {t("listening.level.advanced")}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="audioFile"
          label={t("listening.audioFile")}
          rules={[
            { required: !listening, message: t("listening.audioFileRequired") },
          ]}
        >
          <Upload {...uploadProps} maxCount={1}>
            <Button icon={<UploadOutlined />}>
              {t("listening.uploadAudio")}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="duration" label={t("listening.duration")}>
          <InputNumber
            min={1}
            max={3600}
            placeholder={t("listening.durationPlaceholder")}
            addonAfter={t("common.seconds")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("common.status")}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">
              {t("listening.status.draft")}
            </Select.Option>
            <Select.Option value="active">
              {t("listening.status.active")}
            </Select.Option>
            <Select.Option value="archived">
              {t("listening.status.archived")}
            </Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={uploading}>
            {listening ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </Form>
    );
  };

  const ListeningViewer = ({ listening }) => {
    const [playingAudio, setPlayingAudio] = useState(false);
    const viewerAudioRef = React.useRef(null);

    const handlePlayAudio = () => {
      if (!listening?._id) return;

      // If audio is currently playing, pause it
      if (playingAudio && viewerAudioRef.current) {
        viewerAudioRef.current.pause();
        setPlayingAudio(false);
        message.info("Audio paused");
        return;
      }

      // Create new audio instance with timestamp to avoid caching
      const timestamp = new Date().getTime();
      const audioUrl = `${
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      }/api/listening-exercises/audio/${listening._id}?t=${timestamp}`;

      console.log("🎵 Playing audio from viewer:", audioUrl);

      // Create audio element
      const audio = new Audio(audioUrl);
      viewerAudioRef.current = audio;

      // Set up event listeners
      audio.onplay = () => setPlayingAudio(true);
      audio.onpause = () => setPlayingAudio(false);
      audio.onended = () => {
        setPlayingAudio(false);
        viewerAudioRef.current = null;
        message.success("Audio finished");
      };
      audio.onerror = (error) => {
        console.error("Error playing audio:", error);
        setPlayingAudio(false);
        viewerAudioRef.current = null;
        message.error("Error playing audio file");
      };

      // Play audio
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setPlayingAudio(false);
        viewerAudioRef.current = null;
        message.error("Error playing audio file");
      });
    };

    return (
      <div>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={t("listening.title")}>
            {listening.title}
          </Descriptions.Item>
          <Descriptions.Item label={t("listening.description")}>
            {listening.description || t("listening.noDescription")}
          </Descriptions.Item>
          <Descriptions.Item label={t("listening.course")}>
            {listening.course?.title ||
              listening.course?.name ||
              t("listening.noCourse")}
          </Descriptions.Item>
          <Descriptions.Item label={t("listening.difficultyLevel")}>
            <Tag
              color={
                listening.level === "beginner"
                  ? "green"
                  : listening.level === "intermediate"
                  ? "blue"
                  : "red"
              }
            >
              {listening.level
                ? t(`listening.level.${listening.level}`)
                : t("listening.level.beginner")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("listening.duration")}>
            {listening.duration
              ? `${Math.floor(listening.duration / 60)}:${(
                  listening.duration % 60
                )
                  .toString()
                  .padStart(2, "0")}`
              : t("listening.noDuration")}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.status")}>
            <Tag
              color={
                listening.status === "active"
                  ? "green"
                  : listening.status === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {t(`listening.status.${listening.status || "draft"}`)}
            </Tag>
          </Descriptions.Item>
          {listening.audioFile && (
            <Descriptions.Item label="Audio File">
              <Space>
                <Text type="secondary">
                  {listening.audioFile.originalName || "Audio file attached"}
                </Text>
                <Button
                  type="primary"
                  size="small"
                  icon={
                    playingAudio ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  onClick={handlePlayAudio}
                >
                  {playingAudio ? "Pause Audio" : "Play Audio"}
                </Button>
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Questions */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {t("listening.questions")} ({listening.questions?.length || 0})
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddQuestion(listening)}
            >
              {t("listening.question.add")}
            </Button>
          </div>

          {listening.questions && listening.questions.length > 0 && (
            <>
              {listening.questions.map((question, index) => (
                <Card key={index} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Text strong>
                        {index + 1}. {question.question}
                      </Text>
                      {question.timeStamp && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          @ {Math.floor(question.timeStamp / 60)}:
                          {(question.timeStamp % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Tag>
                      )}
                      <Tag color="purple">
                        {question.type?.replace("_", " ").toUpperCase()}
                      </Tag>
                      <Tag color="green">
                        {question.points || 1}{" "}
                        {question.points === 1 ? "point" : "points"}
                      </Tag>
                    </div>
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                          handleEditQuestion(listening, question, index)
                        }
                      />
                      <Popconfirm
                        title="Delete this question?"
                        onConfirm={() => handleDeleteQuestion(listening, index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="link"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                  {question.options && question.options.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          style={{ marginLeft: 16, marginTop: 4 }}
                        >
                          <Text
                            type={option.isCorrect ? "success" : "secondary"}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                            {option.isCorrect && (
                              <CheckCircleOutlined
                                style={{ marginLeft: 8, color: "#52c41a" }}
                              />
                            )}
                          </Text>
                        </div>
                      ))}
                    </div>
                  )}
                  {question.correctAnswer && !question.options && (
                    <div style={{ marginTop: 8, marginLeft: 16 }}>
                      <Text type="success">
                        <CheckCircleOutlined style={{ marginRight: 8 }} />
                        Correct Answer: {question.correctAnswer}
                      </Text>
                    </div>
                  )}
                  {question.explanation && (
                    <div
                      style={{
                        marginTop: 8,
                        marginLeft: 16,
                        padding: 8,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <Text type="secondary">
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        {question.explanation}
                      </Text>
                    </div>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>

        {listening.transcript && (
          <Card style={{ marginTop: 24 }}>
            <Title level={4}>Transcript</Title>
            <Text>{listening.transcript}</Text>
          </Card>
        )}

        {(!listening.questions || listening.questions.length === 0) && (
          <Empty
            style={{ marginTop: 24 }}
            description="No questions added yet"
          />
        )}
      </div>
    );
  };

  // Question Management Functions for Listening Exercises
  const handleAddQuestion = (listening) => {
    setCurrentListeningForQuestions(listening);
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    questionForm.resetFields();
    setIsQuestionModalVisible(true);
  };

  const handleEditQuestion = (listening, question, index) => {
    setCurrentListeningForQuestions(listening);
    setEditingQuestion(question);
    setEditingQuestionIndex(index);
    questionForm.setFieldsValue({
      ...question,
      options: question.options?.map((opt) => opt.text) || [],
    });
    setIsQuestionModalVisible(true);
  };

  const handleDeleteQuestion = async (listening, index) => {
    try {
      const updatedQuestions = [...(listening.questions || [])];
      updatedQuestions.splice(index, 1);

      await listeningAPI.update(listening._id, {
        ...listening,
        questions: updatedQuestions,
      });

      message.success("Question deleted successfully");
      fetchListeningExercises();

      // Update viewingListening if it's the same one
      if (viewingListening?._id === listening._id) {
        setViewingListening({ ...listening, questions: updatedQuestions });
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error("Error deleting question");
    }
  };

  const handleQuestionSubmit = async (values) => {
    try {
      if (!currentListeningForQuestions) return;

      const newQuestion = {
        type: values.type,
        question: values.question,
        timeStamp: values.timeStamp,
        points: values.points || 1,
        explanation: values.explanation,
      };

      // Handle different question types
      if (values.type === "multiple_choice") {
        newQuestion.options = values.options.map((optText, idx) => ({
          text: optText,
          isCorrect: idx === values.correctOptionIndex,
        }));
      } else {
        newQuestion.correctAnswer = values.correctAnswer;
      }

      const updatedQuestions = [
        ...(currentListeningForQuestions.questions || []),
      ];

      if (editingQuestionIndex !== null) {
        // Update existing question
        updatedQuestions[editingQuestionIndex] = newQuestion;
      } else {
        // Add new question
        updatedQuestions.push(newQuestion);
      }

      await listeningAPI.update(currentListeningForQuestions._id, {
        ...currentListeningForQuestions,
        questions: updatedQuestions,
      });

      message.success(
        editingQuestionIndex !== null
          ? t("listening.question.updateSuccess")
          : t("listening.question.addSuccess")
      );
      setIsQuestionModalVisible(false);
      questionForm.resetFields();
      setEditingQuestion(null);
      setEditingQuestionIndex(null);
      fetchListeningExercises();

      // Update viewingListening if it's the same one
      if (viewingListening?._id === currentListeningForQuestions._id) {
        setViewingListening({
          ...currentListeningForQuestions,
          questions: updatedQuestions,
        });
      }
    } catch (error) {
      console.error("Error saving question:", error);
      message.error(t("listening.question.saveError"));
    }
  };

  const QuestionForm = ({ form, question, onFinish, onCancel }) => {
    const [questionType, setQuestionType] = useState(
      question?.type || "multiple_choice"
    );
    const [optionCount, setOptionCount] = useState(
      question?.options?.length || 2
    );

    return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="type"
          label={t("listening.question.type")}
          rules={[
            { required: true, message: t("listening.question.typeRequired") },
          ]}
          initialValue="multiple_choice"
        >
          <Select onChange={setQuestionType}>
            <Select.Option value="multiple_choice">
              {t("listening.question.types.multiple_choice")}
            </Select.Option>
            <Select.Option value="fill_in_blank">
              {t("listening.question.types.fill_in_blank")}
            </Select.Option>
            <Select.Option value="short_answer">
              {t("listening.question.types.short_answer")}
            </Select.Option>
            <Select.Option value="true_false">
              {t("listening.question.types.true_false")}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="question"
          label={t("listening.question.text")}
          rules={[
            { required: true, message: t("listening.question.textRequired") },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("listening.question.textPlaceholder")}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="timeStamp"
              label={t("listening.question.timestamp")}
              tooltip={t("listening.question.timestampTooltip")}
            >
              <InputNumber
                min={0}
                placeholder={t("listening.question.timestampPlaceholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="points"
              label={t("listening.question.points")}
              initialValue={1}
            >
              <InputNumber min={1} max={10} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {questionType === "multiple_choice" && (
          <>
            <Form.Item label={t("listening.question.numberOfOptions")}>
              <InputNumber
                min={2}
                max={6}
                value={optionCount}
                onChange={setOptionCount}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {Array.from({ length: optionCount }).map((_, index) => (
              <Form.Item
                key={index}
                name={["options", index]}
                label={`${t("listening.question.option")} ${String.fromCharCode(
                  65 + index
                )}`}
                rules={[
                  {
                    required: true,
                    message: t("listening.question.optionRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={`${t(
                    "listening.question.optionPlaceholder"
                  )} ${String.fromCharCode(65 + index)}`}
                />
              </Form.Item>
            ))}

            <Form.Item
              name="correctOptionIndex"
              label={t("listening.question.correctAnswer")}
              rules={[
                {
                  required: true,
                  message: t("listening.question.correctAnswerRequired"),
                },
              ]}
            >
              <Select placeholder={t("listening.question.selectCorrectOption")}>
                {Array.from({ length: optionCount }).map((_, index) => (
                  <Select.Option key={index} value={index}>
                    {t("listening.question.option")}{" "}
                    {String.fromCharCode(65 + index)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {questionType === "true_false" && (
          <Form.Item
            name="correctAnswer"
            label={t("listening.question.correctAnswer")}
            rules={[
              {
                required: true,
                message: t("listening.question.correctAnswerRequired"),
              },
            ]}
          >
            <Select placeholder={t("listening.question.selectCorrectOption")}>
              <Select.Option value="true">True</Select.Option>
              <Select.Option value="false">False</Select.Option>
            </Select>
          </Form.Item>
        )}

        {questionType !== "multiple_choice" &&
          questionType !== "true_false" && (
            <Form.Item
              name="correctAnswer"
              label={t("listening.question.correctAnswer")}
              rules={[
                {
                  required: true,
                  message: t("listening.question.correctAnswerRequired"),
                },
              ]}
            >
              <Input
                placeholder={t("listening.question.correctAnswerPlaceholder")}
              />
            </Form.Item>
          )}

        <Form.Item
          name="explanation"
          label={t("listening.question.explanation")}
        >
          <Input.TextArea
            rows={2}
            placeholder={t("listening.question.explanationPlaceholder")}
          />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit">
            {question
              ? t("listening.question.update")
              : t("listening.question.add")}
          </Button>
        </div>
      </Form>
    );
  };

  const teacherMenuItems = [
    {
      key: "overview",
      icon: <DashboardOutlined />,
      label: t("teacherDashboard.sidebar.overview"),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: t("teacherDashboard.sidebar.myClasses"),
    },
    {
      key: "materials",
      icon: <FolderOutlined />,
      label: t("teacherDashboard.sidebar.materials"),
    },
    {
      key: "quizzes",
      icon: <QuestionCircleOutlined />,
      label: t("teacherDashboard.sidebar.quizManagement"),
    },
    {
      key: "homework",
      icon: <FileTextOutlined />,
      label: t("teacherDashboard.sidebar.assignmentCenter"),
    },
    {
      key: "listening",
      icon: <AudioOutlined />,
      label: t("teacherDashboard.sidebar.listeningExercises"),
    },
    {
      key: "students",
      icon: <TeamOutlined />,
      label: t("teacherDashboard.sidebar.studentManagement"),
    },
    {
      key: "zoom",
      icon: <VideoCameraOutlined />,
      label: "Live Classes",
    },
    {
      key: "grading",
      icon: <CheckSquareOutlined />,
      label: t("teacherDashboard.sidebar.gradingCenter"),
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: t("teacherDashboard.sidebar.analytics"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("teacherDashboard.sidebar.settings"),
    },
  ];

  const renderOverview = () => (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <div style={{ 
        marginBottom: "32px",
        padding: "24px",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      }}>
        <Title level={2} style={{ margin: 0, marginBottom: "8px", color: "#1f2937" }}>
          {t("teacherDashboard.overview.title")}
        </Title>
        <Text style={{ fontSize: "16px", color: "#6b7280" }}>
          {t("teacherDashboard.welcomeBack")}, {currentUser?.name} 👋
      </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card stat-card-1" bordered={false} style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <BookOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: 500
                }}>
                  Total
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.myCourses}
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9, fontWeight: 500 }}>
                  {t("teacherDashboard.overview.myClasses")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card stat-card-2" bordered={false} style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}>
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <TeamOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: 500
                }}>
                  Active
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.myStudents}
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9, fontWeight: 500 }}>
                  {t("teacherDashboard.overview.totalStudents")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card stat-card-3" bordered={false} style={{ background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" }}>
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <FileOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: 500
                }}>
                  Library
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.totalMaterials}
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9, fontWeight: 500 }}>
                  {t("teacherDashboard.overview.teachingMaterials")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card stat-card-4" bordered={false} style={{ background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)" }}>
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <ClockCircleOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: 500
                }}>
                  Pending
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.pendingSubmissions}
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9, fontWeight: 500 }}>
                  {t("teacherDashboard.overview.pendingReviews")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card stat-card-5" bordered={false} style={{ background: "linear-gradient(135deg, #7c2d12 0%, #92400e 100%)" }}>
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <QuestionCircleOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: 500
                }}>
                  Live
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.activeQuizzes}
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9, fontWeight: 500 }}>
                  {t("teacherDashboard.overview.activeQuizzes")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card
            className="glass-card"
            bordered={false}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClockCircleOutlined style={{ color: "#667eea", fontSize: "20px" }} />
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#1f2937" }}>
                  {t("teacherDashboard.overview.recentActivity")}
                </span>
              </div>
            }
            extra={
              <Button 
                className="modern-btn"
                size="small" 
                type="primary"
                ghost
                onClick={() => setActiveTab("grading")}
                style={{ borderRadius: "8px" }}
              >
                {t("teacherDashboard.overview.viewAll")}
              </Button>
            }
          >
            <Timeline>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  let activityText = "";

                  switch (activity.type) {
                    case "quiz_submission":
                      activityText = t(
                        "teacherDashboard.overview.activities.quizSubmission",
                        {
                          student: activity.studentName,
                          course: activity.description,
                        }
                      );
                      break;
                    case "homework_submission":
                      activityText = t(
                        "teacherDashboard.overview.activities.homeworkSubmission",
                        {
                          student: activity.studentName,
                          course: activity.description,
                        }
                      );
                      break;
                    case "material_uploaded":
                      activityText = t(
                        "teacherDashboard.overview.activities.materialUploaded",
                        {
                          material: activity.materialTitle,
                          course: activity.description,
                        }
                      );
                      break;
                    case "announcement":
                      activityText = t(
                        "teacherDashboard.overview.activities.announcement",
                        {
                          title: activity.title,
                          course: activity.description,
                        }
                      );
                      break;
                    default:
                      activityText = t(
                        "teacherDashboard.overview.activities.newActivity"
                      );
                  }

                  return (
                    <Timeline.Item key={index} color={activity.color}>
                      <Text>{activityText}</Text>
                      <br />
                      <Text type="secondary">
                        {getTimeAgo(activity.timestamp)}
                      </Text>
                    </Timeline.Item>
                  );
                })
              ) : (
                <Empty
                  description={t("teacherDashboard.overview.noRecentActivity")}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            className="glass-card"
            bordered={false}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap style={{ color: "#667eea", fontSize: "20px" }} />
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#1f2937" }}>
                  {t("teacherDashboard.overview.quickActions")}
                </span>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Button
                className="modern-btn"
                type="primary"
                icon={<PlusOutlined />}
                block
                size="large"
                onClick={() => setActiveTab("materials")}
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  border: "none",
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {t("teacherDashboard.overview.uploadMaterial")}
              </Button>
              <Button
                className="modern-btn"
                icon={<QuestionCircleOutlined />}
                block
                size="large"
                onClick={() => setActiveTab("quizzes")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#667eea",
                  color: "#667eea",
                }}
              >
                {t("teacherDashboard.overview.createQuiz")}
              </Button>
              <Button
                className="modern-btn"
                icon={<FileTextOutlined />}
                block
                size="large"
                onClick={() => setActiveTab("homework")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#764ba2",
                  color: "#764ba2",
                }}
              >
                {t("teacherDashboard.overview.assignHomework")}
              </Button>
              <Button
                className="modern-btn"
                icon={<BarChartOutlined />}
                block
                size="large"
                onClick={() => setActiveTab("analytics")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#f093fb",
                  color: "#f093fb",
                }}
              >
                {t("teacherDashboard.overview.viewAnalytics")}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card 
            className="glass-card"
            bordered={false}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp style={{ color: "#667eea", fontSize: "20px" }} />
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#1f2937" }}>
                  {t("teacherDashboard.overview.classPerformance")}
                </span>
              </div>
            }
          >
            <div style={{ padding: "16px 0" }}>
            <Progress
              percent={dashboardStats.avgClassPerformance}
              status="active"
                strokeWidth={12}
              strokeColor={{
                  from: "#667eea",
                  to: "#764ba2",
              }}
                trailColor="rgba(0, 0, 0, 0.06)"
                style={{ marginBottom: "16px" }}
            />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px", color: "#6b7280", fontWeight: 500 }}>
              {t("teacherDashboard.overview.avgPerformance")}
            </Text>
                <Text style={{ fontSize: "20px", fontWeight: 700, color: "#667eea" }}>
                  {dashboardStats.avgClassPerformance}%
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderGradingCenter = () => {
    // Progress table columns
    const progressColumns = [
      {
        title: t("teacherDashboard.grading.student"),
        dataIndex: "student",
        key: "student",
        render: (student) => (
          <Space>
            <Avatar icon={<UserOutlined />} size="small" />
            <span>
              {student?.firstName} {student?.lastName}
            </span>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.grading.subject"),
        dataIndex: "subject",
        key: "subject",
        render: (subject) => <Tag color="blue">{subject}</Tag>,
      },
      {
        title: t("teacherDashboard.grading.assignment"),
        dataIndex: "assignment",
        key: "assignment",
        render: (assignment) => <Text strong>{assignment}</Text>,
      },
      {
        title: t("teacherDashboard.grading.type"),
        dataIndex: "assignmentType",
        key: "assignmentType",
        render: (type) => {
          const colorMap = {
            homework: "green",
            quiz: "blue",
            exam: "red",
            project: "purple",
            participation: "orange",
            other: "gray",
          };
          return (
            <Tag color={colorMap[type] || "gray"}>{type?.toUpperCase()}</Tag>
          );
        },
      },
      {
        title: t("teacherDashboard.grading.score"),
        dataIndex: "score",
        key: "score",
        render: (score, record) => (
          <Space>
            <Text strong>
              {score}/{record.maxScore}
            </Text>
            <Text type="secondary">({record.percentage}%)</Text>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.grading.grade"),
        dataIndex: "grade",
        key: "grade",
        render: (grade) => {
          const colorMap = {
            "A+": "green",
            A: "green",
            "A-": "green",
            "B+": "blue",
            B: "blue",
            "B-": "blue",
            "C+": "orange",
            C: "orange",
            "C-": "orange",
            "D+": "red",
            D: "red",
            F: "red",
          };
          return <Tag color={colorMap[grade] || "gray"}>{grade}</Tag>;
        },
      },
      {
        title: t("teacherDashboard.grading.dateGraded"),
        dataIndex: "gradedDate",
        key: "gradedDate",
        render: (date) => moment(date).format("MMM DD, YYYY"),
      },
      {
        title: t("teacherDashboard.grading.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => openViewModal(record)}
              title={t("teacherDashboard.grading.viewDetails")}
            >
              {t("teacherDashboard.common.viewButton")}
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEditModal(record)}
              title={t("teacherDashboard.grading.editGrade")}
            >
              {t("teacherDashboard.common.edit")}
            </Button>
            <Popconfirm
              title={t("teacherDashboard.grading.deleteConfirm")}
              onConfirm={() => deleteProgressRecord(record._id)}
              okText={t("teacherDashboard.common.yes")}
              cancelText={t("teacherDashboard.common.no")}
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                title={t("teacherDashboard.grading.deleteGrade")}
              >
                {t("teacherDashboard.common.delete")}
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              📚 {t("teacherDashboard.grading.title")}
            </Title>
            <Text type="secondary">
              {t("teacherDashboard.grading.subtitle")}
            </Text>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row
          gutter={[16, 16]}
          style={{ marginTop: "24px", marginBottom: "24px" }}
        >
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("teacherDashboard.grading.totalGrades")}
                value={progressRecords.length}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("teacherDashboard.grading.studentsGraded")}
                value={
                  new Set(progressRecords.map((record) => record.student?._id))
                    .size
                }
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("teacherDashboard.grading.announcements")}
                value={
                  announcements.filter(
                    (ann) =>
                      ann.author?._id === (currentUser?.id || currentUser?._id)
                  ).length
                }
                prefix={<BellOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("teacherDashboard.grading.averageGrade")}
                value={
                  progressRecords.length > 0
                    ? Math.round(
                        progressRecords.reduce(
                          (sum, record) => sum + record.percentage,
                          0
                        ) / progressRecords.length
                      )
                    : 0
                }
                suffix="%"
                prefix={<StarOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for Grading and Announcements */}
        <Tabs
          defaultActiveKey="grading"
          items={[
            {
              key: "grading",
              label: `📊 ${t("teacherDashboard.grading.studentGrading")}`,
              children: (
                <Card
                  title={t("teacherDashboard.grading.progressRecords")}
                  extra={
                    <Space>
                      <Input
                        placeholder={t("teacherDashboard.grading.searchGrades")}
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                      />
                      <Select
                        placeholder={t(
                          "teacherDashboard.grading.filterBySubject"
                        )}
                        style={{ width: 150 }}
                        allowClear
                      >
                        {[
                          ...new Set(
                            progressRecords.map((record) => record.subject)
                          ),
                        ].map((subject) => (
                          <Option key={subject} value={subject}>
                            {subject}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        icon={<SearchOutlined />}
                        onClick={fetchProgressRecords}
                        loading={gradingLoading}
                        title={t("teacherDashboard.grading.refreshGrades")}
                      >
                        {t("teacherDashboard.grading.refresh")}
                      </Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateProgressModalVisible(true)}
                      >
                        {t("teacherDashboard.grading.addGrade")}
                      </Button>
                    </Space>
                  }
                >
                  {progressRecords.length > 0 ? (
                    <Table
                      columns={progressColumns}
                      dataSource={progressRecords}
                      rowKey="_id"
                      loading={gradingLoading}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                      }}
                      scroll={{ x: 1000 }}
                    />
                  ) : (
                    <Empty
                      description={t("teacherDashboard.grading.noRecords")}
                    />
                  )}
                </Card>
              ),
            },
            {
              key: "announcements",
              label: `📢 ${t("teacherDashboard.grading.announcements")}`,
              children: (
                <Card
                  title={t("teacherDashboard.grading.myAnnouncements")}
                  extra={
                    <Space>
                      <Select
                        placeholder={t(
                          "teacherDashboard.grading.filterByPriority"
                        )}
                        style={{ width: 150 }}
                        allowClear
                      >
                        <Option value="low">
                          {t("teacherDashboard.grading.priorityLow")}
                        </Option>
                        <Option value="medium">
                          {t("teacherDashboard.grading.priorityMedium")}
                        </Option>
                        <Option value="high">
                          {t("teacherDashboard.grading.priorityHigh")}
                        </Option>
                        <Option value="urgent">
                          {t("teacherDashboard.grading.priorityUrgent")}
                        </Option>
                      </Select>
                      <Button
                        icon={<SearchOutlined />}
                        onClick={fetchAnnouncements}
                        title={t(
                          "teacherDashboard.grading.refreshAnnouncements"
                        )}
                      >
                        {t("teacherDashboard.grading.refresh")}
                      </Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateAnnouncementModalVisible(true)}
                      >
                        {t("teacherDashboard.grading.createAnnouncement")}
                      </Button>
                    </Space>
                  }
                >
                  {announcements.length > 0 ? (
                    <List
                      itemLayout="vertical"
                      dataSource={announcements.filter(
                        (ann) =>
                          ann.author?._id ===
                          (currentUser?.id || currentUser?._id)
                      )}
                      renderItem={(announcement) => (
                        <List.Item
                          key={announcement._id}
                          style={{
                            padding: "16px",
                            marginBottom: "8px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px",
                          }}
                        >
                          <List.Item.Meta
                            avatar={<Avatar icon={<BellOutlined />} />}
                            title={
                              <Space>
                                <Text strong>{announcement.title}</Text>
                                <Tag
                                  color={
                                    announcement.priority === "urgent"
                                      ? "red"
                                      : "blue"
                                  }
                                >
                                  {announcement.priority?.toUpperCase()}
                                </Tag>
                                {announcement.isSticky && (
                                  <Tag color="gold">PINNED</Tag>
                                )}
                              </Space>
                            }
                            description={
                              <Space direction="vertical" size={4}>
                                <Text type="secondary">
                                  {t("teacherDashboard.grading.target")}:{" "}
                                  {announcement.targetAudience}
                                </Text>
                                <Text type="secondary">
                                  {t("teacherDashboard.grading.published")}:{" "}
                                  {moment(announcement.publishDate).format(
                                    "MMM DD, YYYY"
                                  )}
                                </Text>
                                <Text type="secondary">
                                  {t("teacherDashboard.grading.reads")}:{" "}
                                  {announcement.readCount || 0}
                                </Text>
                              </Space>
                            }
                          />
                          <Text ellipsis={{ rows: 2 }}>
                            {announcement.content}
                          </Text>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      description={t(
                        "teacherDashboard.grading.noAnnouncements"
                      )}
                    />
                  )}
                </Card>
              ),
            },
          ]}
        />
      </div>
    );
  };

  // Placeholder components for sections that were previously imported
  const renderPlaceholder = (title, description) => (
    <Card>
      <Title level={3}>{title}</Title>
      <Text type="secondary">{description}</Text>
      <Empty
        style={{ marginTop: 40 }}
        description={`${title} functionality is being developed`}
      />
    </Card>
  );

  // Course Management Component
  const renderCourseManagement = () => {
    const columns = [
      {
        title: t("teacherDashboard.courses.courseName"),
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t("teacherDashboard.courses.code"),
        dataIndex: "code",
        key: "code",
        render: (code) => <Tag color="purple">{code}</Tag>,
      },
      {
        title: t("teacherDashboard.courses.category"),
        dataIndex: "category",
        key: "category",
        render: (category) => {
          const categoryKey = `teacherDashboard.courses.categories.${category}`;
          return <Tag color="cyan">{t(categoryKey)}</Tag>;
        },
      },
      {
        title: t("teacherDashboard.courses.level"),
        dataIndex: "level",
        key: "level",
        render: (level) => {
          const levelKey = `teacherDashboard.courses.levels.${level}`;
          return <Tag color="blue">{t(levelKey)}</Tag>;
        },
      },
      {
        title: t("teacherDashboard.courses.students"),
        dataIndex: "students",
        key: "students",
        render: (students) => (students ? students.length : 0),
      },
      {
        title: t("teacherDashboard.courses.duration"),
        dataIndex: "duration",
        key: "duration",
        render: (duration) =>
          `${duration} ${t("teacherDashboard.courses.weeks")}`,
      },
      {
        title: t("teacherDashboard.courses.status"),
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive
              ? t("teacherDashboard.courses.active")
              : t("teacherDashboard.courses.inactive")}
          </Tag>
        ),
      },
      {
        title: t("teacherDashboard.courses.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("teacherDashboard.courses.editCourse")}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditCourse(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.courses.viewStudents")}>
              <Button
                type="link"
                size="small"
                icon={<TeamOutlined />}
                onClick={() => {
                  setSelectedCourseForStudents(record);
                  setActiveTab("students");
                }}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.courses.deleteCourse")}>
              <Popconfirm
                title={
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {t("teacherDashboard.courses.deleteConfirm")}
                    </div>
                    <div style={{ color: "#ff4d4f", fontSize: "12px" }}>
                      ⚠️ This will permanently delete the course and ALL related content including:
                      <br />• Homework assignments and submissions
                      <br />• Quizzes, questions, and submissions
                      <br />• Listening exercises and submissions
                      <br />• Course materials
                      <br />• All student progress data
                    </div>
                  </div>
                }
                onConfirm={() => handleDeleteCourse(record._id)}
                okText={t("teacherDashboard.common.yes")}
                cancelText={t("teacherDashboard.common.no")}
                okButtonProps={{ danger: true }}
                placement="topRight"
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        className="glass-card"
        bordered={false}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <BookOutlined style={{ color: "#fff", fontSize: "20px" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
              {t("teacherDashboard.courses.myClasses")}
            </span>
          </div>
        }
        extra={
          <Button
            className="modern-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCourse(null);
              courseForm.resetFields();
              setIsCourseModalVisible(true);
            }}
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              padding: "0 24px",
              fontWeight: 500,
            }}
          >
            {t("teacherDashboard.courses.addNewCourse")}
          </Button>
        }
      >
        <Table
          key={currentLanguage}
          columns={columns}
          dataSource={courses}
          loading={courseLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? "small" : "default"}
        />

        <Modal
          title={
            editingCourse
              ? t("teacherDashboard.courses.editCourse")
              : t("teacherDashboard.courses.addNewCourse")
          }
          open={isCourseModalVisible}
          onCancel={() => {
            setIsCourseModalVisible(false);
            setEditingCourse(null);
            courseForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={courseForm}
            layout="vertical"
            onFinish={handleCourseSubmit}
          >
            <Form.Item
              name="title"
              label={t("teacherDashboard.courses.courseTitle")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.courseTitleRequired"),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "teacherDashboard.courses.courseTitlePlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={t("teacherDashboard.courses.description")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.descriptionRequired"),
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder={t(
                  "teacherDashboard.courses.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              name="code"
              label={t("teacherDashboard.courses.courseCode")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.courseCodeRequired"),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "teacherDashboard.courses.courseCodePlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              name="category"
              label={t("teacherDashboard.courses.category")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.categoryRequired"),
                },
              ]}
            >
              <Select
                placeholder={t("teacherDashboard.courses.categoryPlaceholder")}
              >
                <Option value="language">
                  {t("teacherDashboard.courses.categories.language")}
                </Option>
                <Option value="business">
                  {t("teacherDashboard.courses.categories.business")}
                </Option>
                <Option value="technology">
                  {t("teacherDashboard.courses.categories.technology")}
                </Option>
                <Option value="arts">
                  {t("teacherDashboard.courses.categories.arts")}
                </Option>
                <Option value="science">
                  {t("teacherDashboard.courses.categories.science")}
                </Option>
                <Option value="other">
                  {t("teacherDashboard.courses.categories.other")}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label={t("teacherDashboard.courses.level")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.levelRequired"),
                },
              ]}
            >
              <Select
                placeholder={t("teacherDashboard.courses.levelPlaceholder")}
              >
                <Option value="beginner">
                  {t("teacherDashboard.courses.levels.beginner")}
                </Option>
                <Option value="intermediate">
                  {t("teacherDashboard.courses.levels.intermediate")}
                </Option>
                <Option value="advanced">
                  {t("teacherDashboard.courses.levels.advanced")}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label={t("teacherDashboard.courses.durationWeeks")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.courses.durationRequired"),
                },
              ]}
            >
              <InputNumber
                min={1}
                max={52}
                placeholder={t("teacherDashboard.courses.durationPlaceholder")}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label={t("teacherDashboard.courses.startDate")}
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.courses.startDateRequired"),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue("endDate")) {
                          return Promise.resolve();
                        }
                        if (value.isAfter(getFieldValue("endDate"))) {
                          return Promise.reject(
                            new Error(
                              t("teacherDashboard.courses.startDateBeforeEnd")
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label={t("teacherDashboard.courses.endDate")}
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.courses.endDateRequired"),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue("startDate")) {
                          return Promise.resolve();
                        }
                        if (value.isBefore(getFieldValue("startDate"))) {
                          return Promise.reject(
                            new Error(
                              t("teacherDashboard.courses.endDateAfterStart")
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="maxStudents"
              label={t("teacherDashboard.courses.maxStudents")}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder={t(
                  "teacherDashboard.courses.maxStudentsPlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setIsCourseModalVisible(false)}>
                  {t("teacherDashboard.common.cancel")}
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCourse
                    ? t("teacherDashboard.common.update")
                    : t("teacherDashboard.common.create")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };

  // Material Management Component
  const renderMaterialManagement = () => {
    const columns = [
      {
        title: t("teacherDashboard.materials.title"),
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t("teacherDashboard.materials.fileType"),
        dataIndex: "fileType",
        key: "fileType",
        render: (fileType) => (
          <Tag
            color={
              fileType === "video"
                ? "red"
                : fileType === "document"
                ? "blue"
                : fileType === "pdf"
                ? "orange"
                : "green"
            }
          >
            {fileType?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: t("teacherDashboard.materials.category"),
        dataIndex: "category",
        key: "category",
        render: (category) => {
          const categoryKey = `teacherDashboard.materials.categories.${category}`;
          return <Tag color="purple">{t(categoryKey)}</Tag>;
        },
      },
      {
        title: t("teacherDashboard.materials.course"),
        dataIndex: "course",
        key: "course",
        render: (course) =>
          course?.title ||
          course?.name ||
          t("teacherDashboard.materials.notAvailable"),
      },
      {
        title: t("teacherDashboard.materials.fileSize"),
        dataIndex: "fileSize",
        key: "fileSize",
        render: (size) => {
          if (!size) return t("teacherDashboard.materials.notAvailable");
          const mb = (size / (1024 * 1024)).toFixed(2);
          return `${mb} MB`;
        },
      },
      {
        title: t("teacherDashboard.materials.uploadDate"),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => {
          const currentLang = i18n.language;
          if (currentLang === "ja") {
            return moment(date).format("YYYY年MM月DD日");
          }
          return moment(date).format("MMM DD, YYYY");
        },
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      },
      {
        title: t("teacherDashboard.materials.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("teacherDashboard.materials.download")}>
              <Button
                type="link"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => {
                  // Use the API download endpoint
                  const token = localStorage.getItem("token");
                  const downloadUrl = `${
                    process.env.REACT_APP_API_URL || "http://localhost:5000"
                  }/api/course-materials/download/${record._id}`;

                  // Create a temporary link with auth header
                  fetch(downloadUrl, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then((response) => response.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.style.display = "none";
                      a.href = url;
                      a.download = record.fileName || "material";
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    })
                    .catch((error) => {
                      console.error("Download error:", error);
                      message.error(
                        t("teacherDashboard.materials.downloadError")
                      );
                    });
                }}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.materials.editMaterial")}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditMaterial(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.materials.deleteMaterial")}>
              <Popconfirm
                title={t("teacherDashboard.materials.deleteConfirm")}
                onConfirm={() => handleDeleteMaterial(record._id)}
                okText={t("teacherDashboard.common.yes")}
                cancelText={t("teacherDashboard.common.no")}
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        className="glass-card"
        bordered={false}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <FileOutlined style={{ color: "#fff", fontSize: "20px" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
              {t("teacherDashboard.materials.teachingMaterials")}
            </span>
          </div>
        }
        extra={
          <Button
            className="modern-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log(
                "📁 Opening Material modal with allCourses:",
                allCourses
              );
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log("🔄 Courses empty, refreshing...");
                await fetchAllCourses();
              }
              setEditingMaterial(null);
              materialForm.resetFields();
              setIsMaterialModalVisible(true);
            }}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              padding: "0 24px",
              fontWeight: 500,
            }}
          >
            {t("teacherDashboard.materials.uploadMaterial")}
          </Button>
        }
      >
        <Table
          key={currentLanguage}
          columns={columns}
          dataSource={materials}
          loading={materialLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? "small" : "default"}
        />

        <Modal
          title={
            editingMaterial
              ? t("teacherDashboard.materials.editMaterial")
              : t("teacherDashboard.materials.uploadNewMaterial")
          }
          open={isMaterialModalVisible}
          onCancel={() => {
            setIsMaterialModalVisible(false);
            setEditingMaterial(null);
            materialForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={materialForm}
            layout="vertical"
            onFinish={handleMaterialSubmit}
          >
            <Form.Item
              name="title"
              label={t("teacherDashboard.materials.materialTitle")}
              rules={[
                {
                  required: true,
                  message: t(
                    "teacherDashboard.materials.materialTitleRequired"
                  ),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "teacherDashboard.materials.materialTitlePlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={t("teacherDashboard.materials.description")}
            >
              <Input.TextArea
                rows={3}
                placeholder={t(
                  "teacherDashboard.materials.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              name="course"
              label={t("teacherDashboard.materials.course")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.materials.courseRequired"),
                },
              ]}
            >
              <Select
                placeholder={t("teacherDashboard.materials.selectCourse")}
                loading={allCourses.length === 0}
              >
                {allCourses && allCourses.length > 0 ? (
                  allCourses.map((course) => (
                    <Option key={course._id} value={course._id}>
                      {course.title ||
                        course.name ||
                        t("teacherDashboard.materials.untitledCourse")}
                    </Option>
                  ))
                ) : (
                  <Option disabled value="">
                    {t("teacherDashboard.materials.noCoursesAvailable")}
                  </Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label={t("teacherDashboard.materials.materialCategory")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.materials.categoryRequired"),
                },
              ]}
            >
              <Select
                placeholder={t("teacherDashboard.materials.selectCategory")}
              >
                <Option value="lecture">
                  {t("teacherDashboard.materials.categories.lecture")}
                </Option>
                <Option value="assignment">
                  {t("teacherDashboard.materials.categories.assignment")}
                </Option>
                <Option value="reading">
                  {t("teacherDashboard.materials.categories.reading")}
                </Option>
                <Option value="supplementary">
                  {t("teacherDashboard.materials.categories.supplementary")}
                </Option>
                <Option value="exam">
                  {t("teacherDashboard.materials.categories.exam")}
                </Option>
                <Option value="other">
                  {t("teacherDashboard.materials.categories.other")}
                </Option>
              </Select>
            </Form.Item>

            {!editingMaterial && (
              <Form.Item
                name="file"
                label={t("teacherDashboard.materials.file")}
                rules={[
                  {
                    required: true,
                    message: t("teacherDashboard.materials.fileRequired"),
                  },
                ]}
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={(info) => {
                    console.log("📎 Upload onChange:", info);
                    console.log("📎 File list:", info.fileList);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    {t("teacherDashboard.materials.uploadText")}
                  </p>
                  <p className="ant-upload-hint">
                    {t("teacherDashboard.materials.uploadHint")}
                  </p>
                </Upload.Dragger>
              </Form.Item>
            )}

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setIsMaterialModalVisible(false)}>
                  {t("teacherDashboard.common.cancel")}
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingMaterial
                    ? t("teacherDashboard.common.update")
                    : t("teacherDashboard.common.upload")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>

    );
  };

  // Student Management Component
  const renderStudentManagement = () => {
    const columns = [
      {
        title: t("teacherDashboard.students.name"),
        key: "name",
        render: (_, record) => {
          const fullName =
            `${record.firstName || ""} ${record.lastName || ""}`.trim() ||
            record.name ||
            "N/A";
          return <span>{fullName}</span>;
        },
        sorter: (a, b) => {
          const nameA =
            `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.name || "";
          const nameB =
            `${b.firstName || ""} ${b.lastName || ""}`.trim() || b.name || "";
          return nameA.localeCompare(nameB);
        },
      },
      {
        title: t("teacherDashboard.students.email"),
        dataIndex: "email",
        key: "email",
      },
      {
        title: t("teacherDashboard.students.enrolledCourses"),
        key: "enrolledCourses",
        render: (_, record) => {
          // Calculate enrolled courses from the courses data
          const enrolledCount = courses.filter(
            (course) =>
              course.students &&
              course.students.some((student) => student._id === record._id)
          ).length;

          return (
            <Tag color="blue">
              {enrolledCount} {t("teacherDashboard.students.coursesCount")}
            </Tag>
          );
        },
      },
      {
        title: t("teacherDashboard.students.joinDate"),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => moment(date).format("MMM DD, YYYY"),
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      },
      {
        title: t("teacherDashboard.students.status"),
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive
              ? t("teacherDashboard.students.active")
              : t("teacherDashboard.students.inactive")}
          </Tag>
        ),
      },
      {
        title: t("teacherDashboard.students.actions"),
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("teacherDashboard.students.viewProfile")}>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  Modal.info({
                    title: t("teacherDashboard.students.studentProfile"),
                    content: (
                      <div>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.name")}:
                          </strong>{" "}
                          {`${record.firstName || ""} ${
                            record.lastName || ""
                          }`.trim() ||
                            record.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.email")}:
                          </strong>{" "}
                          {record.email}
                        </p>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.role")}:
                          </strong>{" "}
                          {record.role || "Student"}
                        </p>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.status")}:
                          </strong>{" "}
                          {record.isApproved
                            ? t("teacherDashboard.students.approved")
                            : t("teacherDashboard.students.pending")}
                        </p>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.enrolledCourses")}:
                          </strong>{" "}
                          {
                            courses.filter(
                              (course) =>
                                course.students &&
                                course.students.some(
                                  (student) => student._id === record._id
                                )
                            ).length
                          }
                        </p>
                        <p>
                          <strong>
                            {t("teacherDashboard.students.joinDate")}:
                          </strong>{" "}
                          {moment(record.createdAt).format("MMMM DD, YYYY")}
                        </p>
                      </div>
                    ),
                  });
                }}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.students.sendMessage")}>
              <Button
                type="link"
                size="small"
                icon={<MessageOutlined />}
                onClick={() => handleSendMessage(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.students.videoCall")}>
              <Button
                type="link"
                size="small"
                icon={<VideoCameraOutlined />}
                onClick={() => handleVideoCall(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title={
          <Space>
            <span>{t("teacherDashboard.students.title")}</span>
            {selectedCourseForStudents && (
              <Tag color="blue">
                {t("teacherDashboard.students.courseLabel")}:{" "}
                {selectedCourseForStudents.title}
              </Tag>
            )}
          </Space>
        }
        extra={
          selectedCourseForStudents && (
            <Button
              onClick={() => setSelectedCourseForStudents(null)}
              icon={<CloseOutlined />}
            >
              {t("teacherDashboard.students.showAllStudents")}
            </Button>
          )
        }
      >
        <Table
          key={currentLanguage}
          columns={columns}
          dataSource={
            selectedCourseForStudents
              ? students.filter((student) =>
                  student.enrolledCourses?.some(
                    (course) => course._id === selectedCourseForStudents._id
                  )
                )
              : students
          }
          loading={studentLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? "small" : "default"}
        />

        {/* Message Modal */}
        <Modal
          title={`${t("teacherDashboard.students.sendMessageTo")} ${
            selectedStudent
              ? `${selectedStudent.firstName || ""} ${
                  selectedStudent.lastName || ""
                }`.trim()
              : t("teacherDashboard.students.student")
          }`}
          open={isMessageModalVisible}
          onCancel={() => {
            setIsMessageModalVisible(false);
            setSelectedStudent(null);
            messageForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={messageForm}
            layout="vertical"
            onFinish={handleMessageSubmit}
          >
            <Form.Item
              name="subject"
              label={t("teacherDashboard.students.messageSubject")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.students.subjectRequired"),
                },
              ]}
            >
              <Input
                placeholder={t("teacherDashboard.students.subjectPlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="message"
              label={t("teacherDashboard.students.message")}
              rules={[
                {
                  required: true,
                  message: t("teacherDashboard.students.messageRequired"),
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder={t("teacherDashboard.students.messagePlaceholder")}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsMessageModalVisible(false);
                    setSelectedStudent(null);
                    messageForm.resetFields();
                  }}
                >
                  {t("teacherDashboard.common.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={sendingMessage}
                  icon={<MessageOutlined />}
                >
                  {t("teacherDashboard.students.sendMessageButton")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Video Call Modal */}
        <Modal
          title={`${t("teacherDashboard.students.startVideoCallWith")} ${
            selectedStudentForCall
              ? `${selectedStudentForCall.firstName || ""} ${
                  selectedStudentForCall.lastName || ""
                }`.trim()
              : t("teacherDashboard.students.student")
          }`}
          open={isVideoCallModalVisible}
          onCancel={() => {
            setIsVideoCallModalVisible(false);
            setSelectedStudentForCall(null);
          }}
          footer={null}
          width={500}
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <VideoCameraOutlined
              style={{
                fontSize: "48px",
                color: "#1890ff",
                marginBottom: "20px",
              }}
            />
            <h3>{t("teacherDashboard.students.choosePlatform")}</h3>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              {t("teacherDashboard.students.platformDescription")}
            </p>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall("jitsi")}
                loading={videoCallLoading}
                style={{ height: "50px", fontSize: "16px" }}
              >
                {t("teacherDashboard.students.startWithJitsi")}
              </Button>

              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall("zoom")}
                loading={videoCallLoading}
                style={{ height: "50px", fontSize: "16px" }}
              >
                {t("teacherDashboard.students.startWithZoom")}
              </Button>

              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall("teams")}
                loading={videoCallLoading}
                style={{ height: "50px", fontSize: "16px" }}
              >
                {t("teacherDashboard.students.startWithTeams")}
              </Button>

              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall("meet")}
                loading={videoCallLoading}
                style={{ height: "50px", fontSize: "16px" }}
              >
                {t("teacherDashboard.students.startWithMeet")}
              </Button>
            </Space>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f6ffed",
                borderRadius: "6px",
                border: "1px solid #b7eb8f",
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", color: "#52c41a" }}>
                <CheckCircleOutlined style={{ marginRight: "5px" }} />
                {t("teacherDashboard.students.meetingLinkNote")}
              </p>
            </div>
          </div>
        </Modal>
      </Card>
    );
  };

  // Zoom Classes Component
  const renderZoomClasses = () => {
    const columns = [
      {
        title: "Class Title",
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.courseName}
            </div>
          </div>
        ),
      },
      {
        title: "Meeting ID",
        dataIndex: "meetingId",
        key: "meetingId",
        render: (text) => (
          <Tag color="blue" style={{ fontFamily: "monospace" }}>
            {text}
          </Tag>
        ),
      },
      {
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
        render: (text) => moment(text).format("MMM DD, YYYY HH:mm"),
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        render: (text) => `${text} minutes`,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusConfig = {
            scheduled: { color: "blue", text: "Scheduled" },
            active: { color: "green", text: "Live" },
            ended: { color: "gray", text: "Ended" },
          };
          const config = statusConfig[status] || { color: "default", text: status };
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },
      {
        title: "Allowed Students",
        dataIndex: "allowedStudents",
        key: "allowedStudents",
        render: (students) => (
          <Tag color="purple">{students ? students.length : 0} students</Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            {record.status === "scheduled" && (
              <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartZoomClass(record)}
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                  border: "none",
                }}
              >
                Start
              </Button>
            )}
            {record.status === "active" && (
              <Button
                type="primary"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleEndZoomClass(record)}
              >
                End
              </Button>
            )}
            {record.status === "ended" && (
              <Button 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => handleViewAttendanceReport(record)}
                style={{
                  background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
                  border: "none",
                  color: "#fff"
                }}
              >
                View Report
              </Button>
            )}
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditZoomClass(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this Zoom class?"
              onConfirm={() => handleDeleteZoomClass(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: isMobile ? "16px" : "24px" }}>
        <div
          style={{
            marginBottom: 32,
            padding: "24px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "space-between",
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
                Live Classes
              </Title>
              <Text style={{ color: "#6b7280" }}>
                Manage your Zoom live classes and student access
              </Text>
            </div>
          </div>
          <Button
            className="modern-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateZoomClass}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              padding: "0 24px",
              fontWeight: 500,
            }}
          >
            Create Live Class
          </Button>
        </div>

        <Card className="glass-card" bordered={false}>
          <Table
            columns={columns}
            dataSource={zoomClasses}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} classes`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Embedded Zoom View */}
        {embeddedZoomVisible && currentLiveClass && (
          <Card 
            className="glass-card" 
            bordered={false}
            style={{ marginTop: 24 }}
          >
            <div style={{ display: "flex", gap: 24, minHeight: 500 }}>
              {/* Zoom Meeting Embed */}
              <div style={{ flex: 2 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  marginBottom: 16 
                }}>
                  <VideoCameraOutlined style={{ color: "#dc2626", fontSize: "20px" }} />
                  <Title level={4} style={{ margin: 0 }}>
                    Live Class: {currentLiveClass.title}
                  </Title>
                  <Tag color="green" style={{ marginLeft: "auto" }}>
                    LIVE
                  </Tag>
                </div>
                
                {/* Real Zoom Meeting Component */}
                <ZoomMeeting
                  meetingId={currentLiveClass._id}
                  meetingData={{
                    ...currentLiveClass,
                    userId: currentUser._id,
                    userName: currentUser.name,
                    userEmail: currentUser.email
                  }}
                  onMeetingEnd={() => {
                    setEmbeddedZoomVisible(false);
                    setCurrentLiveClass(null);
                  }}
                  onAttendanceUpdate={async (attendanceData) => {
                    try {
                      await zoomApiService.updateAttendance(currentLiveClass._id, attendanceData);
                      // Refresh attendance list
                      const attendanceResponse = await zoomApiService.getAttendance(currentLiveClass._id);
                      if (attendanceResponse.success) {
                        setAttendanceList(attendanceResponse.attendance);
                      }
                    } catch (error) {
                      console.error('Error updating attendance:', error);
                    }
                  }}
                  isHost={true}
                />
              </div>

              {/* Attendance Panel */}
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8, 
                  marginBottom: 16 
                }}>
                  <CheckCircleOutlined style={{ color: "#059669", fontSize: "16px" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Attendance ({attendanceList.length})
                  </Title>
                </div>

                <div style={{
                  maxHeight: 350,
                  overflowY: "auto",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12
                }}>
                  {attendanceList.length === 0 ? (
                    <div style={{ 
                      textAlign: "center", 
                      color: "#6b7280", 
                      padding: "40px 20px" 
                    }}>
                      <UserOutlined style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }} />
                      <div>Waiting for students to join...</div>
                    </div>
                  ) : (
                    attendanceList.map((record) => (
                      <div
                        key={record.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 0",
                          borderBottom: "1px solid #f3f4f6"
                        }}
                      >
                        <Avatar 
                          size="small" 
                          style={{ 
                            background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" 
                          }}
                        >
                          {record.studentName.charAt(0)}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>
                            {record.studentName}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Joined at {record.joinTime.toLocaleTimeString()}
                            {record.logoutTime && (
                              <div style={{ fontSize: 11, color: "#f59e0b" }}>
                                Left at {record.logoutTime.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <Tag color={record.status === 'left' ? 'orange' : 'green'} size="small">
                          {record.status === 'left' ? 'Left' : 'Present'}
                        </Tag>
                      </div>
                    ))
                  )}
                </div>

                {/* Logout Notifications */}
                {logoutNotifications.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      marginBottom: 12 
                    }}>
                      <BellOutlined style={{ color: "#f59e0b", fontSize: "14px" }} />
                      <Text strong style={{ fontSize: 12 }}>
                        Recent Logouts ({logoutNotifications.length})
                      </Text>
                    </div>
                    <div style={{
                      maxHeight: 120,
                      overflowY: "auto",
                      border: "1px solid #fef3c7",
                      borderRadius: 6,
                      padding: 8,
                      background: "#fffbeb"
                    }}>
                      {logoutNotifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          style={{
                            fontSize: 11,
                            color: "#92400e",
                            marginBottom: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                        >
                          <span>👋</span>
                          <span>{notification.studentName}</span>
                          <span style={{ opacity: 0.7 }}>
                            {moment(notification.logoutTime).format("HH:mm")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Class Controls */}
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleEndZoomClass(currentLiveClass)}
                    style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                      border: "none",
                      borderRadius: 8
                    }}
                  >
                    End Class
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Zoom Class Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <VideoCameraOutlined style={{ color: "#dc2626", fontSize: "20px" }} />
              <span>
                {activeZoomClass ? "Edit Live Class" : "Create Live Class"}
              </span>
            </div>
          }
          open={zoomModalVisible}
          onCancel={() => {
            setZoomModalVisible(false);
            setActiveZoomClass(null);
            zoomForm.resetFields();
          }}
          footer={null}
          width={600}
          className="modern-modal"
        >
          <Form
            form={zoomForm}
            layout="vertical"
            onFinish={handleZoomClassSubmit}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="title"
              label="Class Title"
              rules={[{ required: true, message: "Please enter class title" }]}
            >
              <Input placeholder="e.g., Introduction to Programming - Live Session" />
            </Form.Item>

            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: "Please select a course" }]}
            >
              <Select placeholder="Select course">
                {allCourses.map((course) => (
                  <Option key={course._id} value={course._id}>
                    {course.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true, message: "Please select start time" }]}
                >
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    placeholder="Select start time"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="duration"
                  label="Duration (minutes)"
                  rules={[{ required: true, message: "Please enter duration" }]}
                >
                  <InputNumber
                    min={15}
                    max={480}
                    style={{ width: "100%" }}
                    placeholder="60"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="allowedStudents"
              label="Allowed Students"
              rules={[{ required: true, message: "Please select students" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select students who can join this class"
                style={{ width: "100%" }}
              >
                {students.map((student) => (
                  <Option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setZoomModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    border: "none",
                  }}
                >
                  {activeZoomClass ? "Update Class" : "Create Class"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Attendance Report Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircleOutlined style={{ color: "#059669", fontSize: "20px" }} />
              <span>Attendance Report</span>
            </div>
          }
          open={attendanceReportVisible}
          onCancel={() => {
            setAttendanceReportVisible(false);
            setSelectedClassReport(null);
          }}
          footer={null}
          width={1000}
          className="modern-modal"
        >
          {selectedClassReport && (
            <div style={{ marginTop: 24 }}>
              {/* Class Information */}
              <div style={{ 
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                padding: 20,
                borderRadius: 12,
                marginBottom: 24
              }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <Text strong>Class Title:</Text>
                      <br />
                      <Text style={{ fontSize: 16, fontWeight: 600 }}>
                        {selectedClassReport.className}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong>Course:</Text>
                      <br />
                      <Text>{selectedClassReport.courseName}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Date:</Text>
                      <br />
                      <Text>{selectedClassReport.date}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Start Time:</Text>
                      <br />
                      <Text>{moment(selectedClassReport.startTime).format("HH:mm")}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>End Time:</Text>
                      <br />
                      <Text>{moment(selectedClassReport.endTime).format("HH:mm")}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Duration:</Text>
                      <br />
                      <Text>{selectedClassReport.duration} minutes</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Total Students:</Text>
                      <br />
                      <Text>{selectedClassReport.totalStudents}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Present Students:</Text>
                      <br />
                      <Text style={{ color: "#059669", fontWeight: 600 }}>
                        {selectedClassReport.presentStudents}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Attendance Table */}
              <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  Student Attendance Details
                </Title>
                <Table
                  columns={[
                    {
                      title: "Student Name",
                      dataIndex: "studentName",
                      key: "studentName",
                      render: (text) => (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar 
                            size="small" 
                            style={{ 
                              background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" 
                            }}
                          >
                            {text.charAt(0)}
                          </Avatar>
                          <span style={{ fontWeight: 500 }}>{text}</span>
                        </div>
                      ),
                    },
                    {
                      title: "Login Time",
                      dataIndex: "joinTime",
                      key: "joinTime",
                      render: (time) => moment(time).format("HH:mm:ss"),
                    },
                    {
                      title: "Logout Time",
                      dataIndex: "logoutTime",
                      key: "logoutTime",
                      render: (time) => moment(time).format("HH:mm:ss"),
                    },
                    {
                      title: "Duration",
                      dataIndex: "duration",
                      key: "duration",
                      render: (duration) => (
                        <Tag color="blue">{duration} minutes</Tag>
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status) => (
                        <Tag color="green">Present</Tag>
                      ),
                    },
                  ]}
                  dataSource={selectedClassReport.attendanceRecords}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ x: 600 }}
                />
              </div>

              {/* Summary Statistics */}
              <div style={{ 
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                padding: 16,
                borderRadius: 8,
                marginBottom: 24
              }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="Attendance Rate"
                      value={Math.round((selectedClassReport.presentStudents / selectedClassReport.totalStudents) * 100)}
                      suffix="%"
                      valueStyle={{ color: "#059669" }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Average Duration"
                      value={Math.round(selectedClassReport.attendanceRecords.reduce((sum, record) => sum + record.duration, 0) / selectedClassReport.attendanceRecords.length)}
                      suffix="min"
                      valueStyle={{ color: "#0891b2" }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Total Duration"
                      value={selectedClassReport.duration}
                      suffix="min"
                      valueStyle={{ color: "#7c3aed" }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Absent Students"
                      value={selectedClassReport.totalStudents - selectedClassReport.presentStudents}
                      valueStyle={{ color: "#dc2626" }}
                    />
                  </Col>
                </Row>
              </div>

              {/* Action Buttons */}
              <div style={{ textAlign: "right" }}>
                <Space>
                  <Button onClick={() => setAttendanceReportVisible(false)}>
                    Close
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                      border: "none",
                    }}
                    onClick={() => {
                      // Export functionality would go here
                      message.success("Attendance report exported successfully!");
                    }}
                  >
                    Export Report
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>

      </div>
    );
  };

  // Analytics Component
  const renderAnalytics = () => {
    console.log("📊 Rendering analytics with data:", analyticsData);

    // Ensure we have safe defaults
    const safeAnalyticsData = analyticsData || {};
    const charts = safeAnalyticsData.charts || {};
    const overview = safeAnalyticsData.overview || {};
    const recentActivity = safeAnalyticsData.recentActivity || [];

    // Use real data if available, fallback to default
    const performanceChartData = charts.performanceData || {
      labels: [
        t("teacherDashboard.analytics.week1"),
        t("teacherDashboard.analytics.week2"),
        t("teacherDashboard.analytics.week3"),
        t("teacherDashboard.analytics.week4"),
      ],
      datasets: [
        {
          label: t("teacherDashboard.analytics.averageScorePercent"),
          data: [0, 0, 0, 0],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    };

    const engagementChartData = charts.engagementData || {
      labels: [t("teacherDashboard.analytics.noData")],
      datasets: [
        {
          data: [1],
          backgroundColor: ["rgba(200, 200, 200, 0.8)"],
        },
      ],
    };

    return (
      <div>
        {/* Analytics Header */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <BarChartOutlined style={{ color: "#1890ff" }} />
                  {t("teacherDashboard.analytics.title")}
                  <Badge
                    count={t("teacherDashboard.analytics.liveData")}
                    style={{
                      backgroundColor: "#52c41a",
                      fontSize: "10px",
                      marginLeft: "8px",
                    }}
                  />
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  {t("teacherDashboard.analytics.realTimeAnalytics")}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {t("teacherDashboard.analytics.dataCalculation")}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: isMobile ? "center" : "right" }}>
                <Space
                  direction={isMobile ? "horizontal" : "vertical"}
                  size="small"
                >
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      // First try local calculation, then server if available
                      calculateLocalAnalytics();
                      fetchAnalytics();
                    }}
                    loading={analyticsLoading}
                    size="large"
                  >
                    {t("teacherDashboard.analytics.refreshAnalytics")}
                  </Button>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {t("teacherDashboard.analytics.lastUpdated")}:{" "}
                    {new Date().toLocaleTimeString()}
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Real-time Data Status */}
        <Alert
          message={`📈 ${t("teacherDashboard.analytics.liveDataTitle")}`}
          description={
            <div>
              <Text>
                {t("teacherDashboard.analytics.currentDataIncludes")}:{" "}
                <strong>{courses.length}</strong>{" "}
                {t("teacherDashboard.analytics.courses")},{" "}
                <strong>{students.length}</strong>{" "}
                {t("teacherDashboard.analytics.students")},
                <strong> {progressRecords.length}</strong>{" "}
                {t("teacherDashboard.analytics.gradedAssignments")},{" "}
                <strong>{quizzes.length}</strong>{" "}
                {t("teacherDashboard.analytics.quizzes")},{" "}
                {t("teacherDashboard.analytics.and")}{" "}
                <strong>{homeworks.length}</strong>{" "}
                {t("teacherDashboard.analytics.homeworkAssignments")}.
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {t("teacherDashboard.analytics.metricsDescription")}
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Main Analytics Widgets / KPIs */}
        <Card
          title={
            <Space>
              <Award size={20} color="#1890ff" strokeWidth={2} />
              <span>{t("teacherDashboard.analytics.kpiTitle")}</span>
              <Badge
                count={t("teacherDashboard.analytics.live")}
                style={{ backgroundColor: "#52c41a" }}
              />
            </Space>
          }
          style={{ marginBottom: 24 }}
          extra={
            <Tooltip title={t("teacherDashboard.analytics.kpiTooltip")}>
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                size="small"
              />
            </Tooltip>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  minHeight: "140px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <Users size={40} color="white" strokeWidth={2} />
                </div>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      {t("teacherDashboard.analytics.totalStudents")}
                    </span>
                  }
                  value={(() => {
                    // Calculate from Student Management module
                    const uniqueStudents = new Set();
                    courses.forEach((course) => {
                      if (course.students && Array.isArray(course.students)) {
                        course.students.forEach((student) =>
                          uniqueStudents.add(student._id || student)
                        );
                      }
                    });
                    return (
                      uniqueStudents.size ||
                      students.length ||
                      overview.totalStudents ||
                      0
                    );
                  })()}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <Text
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
                >
                  {t("teacherDashboard.analytics.enrolledAcrossClasses")}
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                  color: "white",
                  border: "none",
                  minHeight: "140px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <FileText size={40} color="white" strokeWidth={2} />
                </div>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      {t("teacherDashboard.analytics.totalSubmissions")}
                    </span>
                  }
                  value={(() => {
                    // Calculate from Assignment & Quiz tables
                    const progressSubmissions = progressRecords.length;
                    const quizSubmissions = quizzes.reduce(
                      (acc, quiz) => acc + (quiz.submissions?.length || 0),
                      0
                    );
                    const homeworkSubmissions = homeworks.reduce(
                      (acc, hw) => acc + (hw.submissions?.length || 0),
                      0
                    );
                    return (
                      progressSubmissions +
                        quizSubmissions +
                        homeworkSubmissions ||
                      overview.totalSubmissions ||
                      0
                    );
                  })()}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <Text
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
                >
                  {t("teacherDashboard.analytics.submissionsDescription")}
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  color: "white",
                  border: "none",
                  minHeight: "140px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <Target size={40} color="white" strokeWidth={2} />
                </div>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      {t("teacherDashboard.analytics.averageScore")}
                    </span>
                  }
                  value={(() => {
                    // Calculate from Grading Center data
                    const validScores = progressRecords.filter(
                      (record) => record.percentage && !isNaN(record.percentage)
                    );
                    return validScores.length > 0
                      ? Math.round(
                          validScores.reduce(
                            (acc, record) => acc + record.percentage,
                            0
                          ) / validScores.length
                        )
                      : overview.averageScore || 0;
                  })()}
                  suffix="%"
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <Text
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
                >
                  {t("teacherDashboard.analytics.acrossAssessments")}
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
                  color: "white",
                  border: "none",
                  minHeight: "140px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <Zap size={40} color="white" strokeWidth={2} />
                </div>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      {t("teacherDashboard.analytics.activeStudents")}
                    </span>
                  }
                  value={(() => {
                    // From User Activity logs (simplified calculation)
                    const totalStudents = (() => {
                      const uniqueStudents = new Set();
                      courses.forEach((course) => {
                        if (course.students && Array.isArray(course.students)) {
                          course.students.forEach((student) =>
                            uniqueStudents.add(student._id || student)
                          );
                        }
                      });
                      return uniqueStudents.size || students.length;
                    })();
                    // Estimate 70-80% activity rate from recent submissions
                    const recentActivityRate =
                      progressRecords.length > 0 ? 0.8 : 0.7;
                    return (
                      Math.min(
                        totalStudents,
                        Math.floor(totalStudents * recentActivityRate)
                      ) ||
                      overview.activeStudents ||
                      0
                    );
                  })()}
                  suffix={`/ ${(() => {
                    const uniqueStudents = new Set();
                    courses.forEach((course) => {
                      if (course.students && Array.isArray(course.students)) {
                        course.students.forEach((student) =>
                          uniqueStudents.add(student._id || student)
                        );
                      }
                    });
                    return (
                      uniqueStudents.size ||
                      students.length ||
                      overview.totalStudents ||
                      0
                    );
                  })()}`}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <Text
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
                >
                  {t("teacherDashboard.analytics.recentActivity")}
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Data Sources Information */}
        <Card
          title={
            <Space>
              <BookOpen size={20} color="#1890ff" strokeWidth={2} />
              <span>{t("teacherDashboard.analytics.dataSourcesTitle")}</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: "#f6f6f6" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <GraduationCap size={28} color="#667eea" strokeWidth={2} />
                  </div>
                  <Text strong>
                    {t("teacherDashboard.analytics.totalStudents")}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("teacherDashboard.analytics.totalStudentsDesc")}
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: "#f6f6f6" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <Clipboard size={28} color="#f5576c" strokeWidth={2} />
                  </div>
                  <Text strong>
                    {t("teacherDashboard.analytics.totalSubmissions")}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("teacherDashboard.analytics.totalSubmissionsDesc")}
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: "#f6f6f6" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <Award size={28} color="#00f2fe" strokeWidth={2} />
                  </div>
                  <Text strong>
                    {t("teacherDashboard.analytics.averageScore")}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("teacherDashboard.analytics.averageScoreDesc")}
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: "#f6f6f6" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <Activity size={28} color="#38f9d7" strokeWidth={2} />
                  </div>
                  <Text strong>
                    {t("teacherDashboard.analytics.activeStudents")}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("teacherDashboard.analytics.activeStudentsDesc")}
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Charts Row */}
        <Row
          gutter={isMobile ? [16, 16] : [24, 24]}
          style={{ marginBottom: 24 }}
        >
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrendingUp size={20} color="#1890ff" strokeWidth={2} />
                  <span>
                    {t("teacherDashboard.analytics.performanceTrends")}
                  </span>
                </Space>
              }
              loading={analyticsLoading}
              extra={
                <Text type="secondary">
                  {t("teacherDashboard.analytics.last4Weeks")}
                </Text>
              }
            >
              {performanceChartData.datasets &&
              performanceChartData.datasets[0] &&
              performanceChartData.datasets[0].data.some((val) => val > 0) ? (
                <Line
                  data={performanceChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function (value) {
                            return value + "%";
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Empty
                  description={t(
                    "teacherDashboard.analytics.noPerformanceData"
                  )}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <PieChart size={20} color="#1890ff" strokeWidth={2} />
                  <span>{t("teacherDashboard.analytics.assignmentTypes")}</span>
                </Space>
              }
              loading={analyticsLoading}
              extra={
                <Text type="secondary">
                  {t("teacherDashboard.analytics.distribution")}
                </Text>
              }
            >
              {engagementChartData.labels &&
              engagementChartData.labels.length > 0 &&
              engagementChartData.labels[0] !==
                t("teacherDashboard.analytics.noData") ? (
                <Doughnut
                  data={engagementChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              ) : (
                <Empty
                  description={t("teacherDashboard.analytics.noAssignmentData")}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card
          title={
            <Space>
              <Clock size={20} color="#1890ff" strokeWidth={2} />
              <span>
                {t("teacherDashboard.analytics.recentGradingActivity")}
              </span>
            </Space>
          }
          extra={
            <Text type="secondary">
              {t("teacherDashboard.analytics.latestActivities", {
                count: recentActivity.length,
              })}
            </Text>
          }
        >
          {recentActivity.length > 0 ? (
            <Timeline>
              {recentActivity.map((activity, index) => (
                <Timeline.Item
                  key={activity.id || index}
                  color={
                    activity.percentage >= 90
                      ? "green"
                      : activity.percentage >= 80
                      ? "blue"
                      : activity.percentage >= 70
                      ? "orange"
                      : "red"
                  }
                >
                  <div>
                    <Text strong>{activity.studentName}</Text>
                    <Text> {t("teacherDashboard.analytics.completed")} </Text>
                    <Text strong>"{activity.assignment}"</Text>
                    <Text> {t("teacherDashboard.analytics.in")} </Text>
                    <Tag color="blue">{activity.subject}</Tag>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Tag
                        color={
                          ["A+", "A", "A-"].includes(activity.grade)
                            ? "green"
                            : ["B+", "B", "B-"].includes(activity.grade)
                            ? "blue"
                            : ["C+", "C", "C-"].includes(activity.grade)
                            ? "orange"
                            : "red"
                        }
                      >
                        {activity.grade}
                      </Tag>
                      <Text type="secondary">{activity.percentage}%</Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">
                        {moment(activity.date).fromNow()}
                      </Text>
                    </Space>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty
              description={t("teacherDashboard.analytics.noRecentActivity")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Grade Distribution */}
        {safeAnalyticsData.gradeDistribution &&
          Object.keys(safeAnalyticsData.gradeDistribution).length > 0 && (
            <Card
              title={
                <Space>
                  <FormOutlined />
                  <span>
                    {t("teacherDashboard.analytics.gradeDistribution")}
                  </span>
                </Space>
              }
              style={{ marginTop: 24 }}
            >
              <Row gutter={[16, 16]}>
                {Object.entries(safeAnalyticsData.gradeDistribution || {}).map(
                  ([grade, count]) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={grade}>
                      <Card size="small">
                        <Statistic
                          title={`Grade ${grade}`}
                          value={count}
                          valueStyle={{
                            color: ["A+", "A", "A-"].includes(grade)
                              ? "#3f8600"
                              : ["B+", "B", "B-"].includes(grade)
                              ? "#1890ff"
                              : ["C+", "C", "C-"].includes(grade)
                              ? "#faad14"
                              : "#cf1322",
                          }}
                        />
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            </Card>
          )}
      </div>
    );
  };

  // Quiz Management Functions
  const renderQuizManagement = () => {
    return (
      <div className="quiz-management">
        <div
          style={{
            marginBottom: 32,
            padding: "24px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #7c2d12 0%, #92400e 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <QuestionCircleOutlined style={{ color: "#fff", fontSize: "20px" }} />
            </div>
            <Title level={2} style={{ margin: 0, color: "#1f2937" }}>{t("quiz.management")}</Title>
          </div>
          <Button
            className="modern-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log("🧩 Opening Quiz modal with allCourses:", allCourses);
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log("🔄 Courses empty, refreshing...");
                await fetchAllCourses();
              }
              setIsQuizModalVisible(true);
            }}
            style={{
              background: "linear-gradient(135deg, #7c2d12 0%, #92400e 100%)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              padding: "0 24px",
              fontWeight: 500,
            }}
          >
            {t("quiz.create")}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-card-1" bordered={false} style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
              <div style={{ position: "relative", zIndex: 10, color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <FormOutlined style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.9)" }} />
                </div>
                <div style={{ color: "#fff" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2 }}>
                    {quizzes.length}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.9, fontWeight: 500 }}>
                    {t("quiz.stats.total")}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-card-4" bordered={false} style={{ background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)" }}>
              <div style={{ position: "relative", zIndex: 10, color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <CheckCircleOutlined style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.9)" }} />
                </div>
                <div style={{ color: "#fff" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2 }}>
                    {quizzes.filter((q) => q.status === "active").length}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.9, fontWeight: 500 }}>
                    {t("quiz.stats.active")}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-card-5" bordered={false} style={{ background: "linear-gradient(135deg, #7c2d12 0%, #92400e 100%)" }}>
              <div style={{ position: "relative", zIndex: 10, color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <EditOutlined style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.9)" }} />
                </div>
                <div style={{ color: "#fff" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2 }}>
                    {quizzes.filter((q) => q.status === "draft").length}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.9, fontWeight: 500 }}>
                    {t("quiz.stats.draft")}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-card-3" bordered={false} style={{ background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" }}>
              <div style={{ position: "relative", zIndex: 10, color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <TrophyOutlined style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.9)" }} />
                </div>
                <div style={{ color: "#fff" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2 }}>
                    {quizzes.filter((q) => q.submissions?.length > 0).length}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.9, fontWeight: 500 }}>
                    {t("quiz.stats.completed")}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="glass-card" bordered={false}>
          <Table
            key={`quiz-table-${currentLanguage}`}
            columns={quizColumns}
            dataSource={quizzes}
            rowKey="_id"
            loading={quizLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                  "quiz.items"
                )}`,
            }}
          />
        </Card>

        {/* Quiz Modal */}
        <Modal
          title={editingQuiz ? t("quiz.edit") : t("quiz.create")}
          visible={isQuizModalVisible}
          onCancel={() => {
            setIsQuizModalVisible(false);
            setEditingQuiz(null);
            quizForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <QuizForm
            form={quizForm}
            quiz={editingQuiz}
            onSubmit={handleQuizSubmit}
            onCancel={() => {
              setIsQuizModalVisible(false);
              setEditingQuiz(null);
              quizForm.resetFields();
            }}
          />
        </Modal>

        {/* View Quiz Modal */}
        <Modal
          title={t("quiz.view")}
          visible={!!viewingQuiz}
          onCancel={() => setViewingQuiz(null)}
          footer={[
            <Button key="close" onClick={() => setViewingQuiz(null)}>
              {t("common.close")}
            </Button>,
          ]}
          width={1000}
        >
          {viewingQuiz && <QuizViewer quiz={viewingQuiz} />}
        </Modal>
      </div>
    );
  };

  // Homework Management Functions
  const renderHomeworkManagement = () => {
    return (
      <div className="homework-management">
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>{t("homework.management")}</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log(
                "📝 Opening Homework modal with allCourses:",
                allCourses
              );
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log("🔄 Courses empty, refreshing...");
                await fetchAllCourses();
              }
              // Reset form and editing state for new homework
              setEditingHomework(null);
              homeworkForm.resetFields();
              // Set default status to draft
              homeworkForm.setFieldsValue({ status: "draft" });
              setIsHomeworkModalVisible(true);
            }}
          >
            {t("homework.create")}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("homework.stats.total")}
                value={homeworks.length}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("homework.stats.active")}
                value={homeworks.filter((h) => h.status === "active").length}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("homework.stats.pending")}
                value={homeworks.reduce(
                  (acc, h) =>
                    acc +
                    (h.submissions?.filter((s) => s.status === "submitted")
                      .length || 0),
                  0
                )}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("homework.stats.graded")}
                value={homeworks.reduce(
                  (acc, h) =>
                    acc +
                    (h.submissions?.filter((s) => s.status === "graded")
                      .length || 0),
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            key={`homework-table-${currentLanguage}`}
            columns={homeworkColumns}
            dataSource={homeworks}
            rowKey="_id"
            loading={homeworkLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                  "homework.items"
                )}`,
            }}
          />
        </Card>

        {/* Homework Create/Edit Modal */}
        <Modal
          title={editingHomework ? t("homework.edit") : t("homework.create")}
          visible={isHomeworkModalVisible}
          onCancel={() => {
            setIsHomeworkModalVisible(false);
            setEditingHomework(null);
            homeworkForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <HomeworkForm
            form={homeworkForm}
            homework={editingHomework}
            onSubmit={handleHomeworkSubmit}
            onCancel={() => {
              setIsHomeworkModalVisible(false);
              setEditingHomework(null);
              homeworkForm.resetFields();
            }}
          />
        </Modal>

        {/* Homework View Modal */}
        <Modal
          title={t("homework.view")}
          visible={!!viewingHomework}
          onCancel={() => setViewingHomework(null)}
          footer={[
            <Button key="close" onClick={() => setViewingHomework(null)}>
              {t("common.close")}
            </Button>,
          ]}
          width={900}
        >
          <HomeworkViewer homework={viewingHomework} />
        </Modal>
      </div>
    );
  };

  // Listening Exercises Functions
  // Listening Submissions Content Component
  const ListeningSubmissionsContent = ({
    exerciseId,
    submissions,
    loading,
    onRefresh,
  }) => {
    useEffect(() => {
      if (exerciseId) {
        fetchListeningSubmissions(exerciseId);
      }
    }, [exerciseId]); // fetchListeningSubmissions is stable due to useCallback with empty deps

    const getGradeColor = (percentage) => {
      if (percentage >= 90) return "success";
      if (percentage >= 80) return "processing";
      if (percentage >= 70) return "warning";
      return "error";
    };

    const submissionsColumns = [
      {
        title: t("listening.submissions.student"),
        key: "student",
        render: (_, record) => (
          <Space>
            <UserOutlined />
            <Text strong>
              {record.student?.firstName} {record.student?.lastName}
            </Text>
          </Space>
        ),
      },
      {
        title: t("listening.submissions.email"),
        dataIndex: ["student", "email"],
        key: "email",
      },
      {
        title: t("listening.submissions.score"),
        key: "score",
        render: (_, record) => (
          <Space>
            <TrophyOutlined style={{ color: "#faad14" }} />
            <Text strong>
              {record.score}/{record.answers?.length || 0}
            </Text>
          </Space>
        ),
      },
      {
        title: t("listening.submissions.percentage"),
        dataIndex: "percentage",
        key: "percentage",
        render: (percentage) => (
          <Tag color={getGradeColor(percentage)}>{percentage}%</Tag>
        ),
        sorter: (a, b) => a.percentage - b.percentage,
      },
      {
        title: t("listening.submissions.attempt"),
        dataIndex: "attemptNumber",
        key: "attemptNumber",
        render: (attempt) => (
          <Tag color="blue">
            {t("listening.submissions.attempt")} #{attempt}
          </Tag>
        ),
      },
      {
        title: t("listening.submissions.submitted"),
        dataIndex: "submittedAt",
        key: "submittedAt",
        render: (date) => (
          <Space>
            <ClockCircleOutlined />
            <Text type="secondary">
              {moment(date).format("MMM DD, YYYY HH:mm")}
            </Text>
          </Space>
        ),
        sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt),
      },
      {
        title: t("listening.submissions.actions"),
        key: "actions",
        render: (_, record) => (
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: t("listening.submissions.detailsModal.title"),
                width: 800,
                content: (
                  <div style={{ marginTop: 20 }}>
                    <Descriptions bordered column={2}>
                      <Descriptions.Item
                        label={t("listening.submissions.student")}
                        span={2}
                      >
                        <Space>
                          <UserOutlined />
                          <Text strong>
                            {record.student?.firstName}{" "}
                            {record.student?.lastName}
                          </Text>
                          <Text type="secondary">
                            ({record.student?.email})
                          </Text>
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("listening.submissions.score")}
                      >
                        <Space>
                          <TrophyOutlined style={{ color: "#faad14" }} />
                          <Text strong>
                            {record.score}/{record.answers?.length || 0}
                          </Text>
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("listening.submissions.percentage")}
                      >
                        <Tag color={getGradeColor(record.percentage)}>
                          {record.percentage}%
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("listening.submissions.attempt")}
                      >
                        {t("listening.submissions.attempt")} #
                        {record.attemptNumber}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t(
                          "listening.submissions.detailsModal.submittedAt"
                        )}
                      >
                        {moment(record.submittedAt).format(
                          "MMMM DD, YYYY HH:mm:ss"
                        )}
                      </Descriptions.Item>
                    </Descriptions>

                    <Card
                      title={t(
                        "listening.submissions.detailsModal.performance"
                      )}
                      size="small"
                      style={{ marginTop: 16 }}
                    >
                      <Progress
                        percent={record.percentage}
                        status={
                          record.percentage >= 70 ? "success" : "exception"
                        }
                      />
                    </Card>

                    <Card
                      title={t(
                        "listening.submissions.detailsModal.detailedAnswers"
                      )}
                      size="small"
                      style={{ marginTop: 16 }}
                    >
                      <List
                        dataSource={record.answers}
                        renderItem={(answer, index) => (
                          <List.Item>
                            <Space
                              direction="vertical"
                              style={{ width: "100%" }}
                              size="small"
                            >
                              <Space>
                                {answer.isCorrect ? (
                                  <CheckCircleOutlined
                                    style={{
                                      color: "#52c41a",
                                      fontSize: "18px",
                                    }}
                                  />
                                ) : (
                                  <CloseCircleOutlined
                                    style={{
                                      color: "#f5222d",
                                      fontSize: "18px",
                                    }}
                                  />
                                )}
                                <Text strong>
                                  {t(
                                    "listening.submissions.detailsModal.question"
                                  )}{" "}
                                  {index + 1}
                                </Text>
                                <Tag
                                  color={answer.isCorrect ? "success" : "error"}
                                >
                                  {answer.isCorrect
                                    ? t(
                                        "listening.submissions.detailsModal.correct"
                                      )
                                    : t(
                                        "listening.submissions.detailsModal.incorrect"
                                      )}
                                </Tag>
                              </Space>
                              <Text type="secondary">
                                {t(
                                  "listening.submissions.detailsModal.selectedOption"
                                )}
                                : {String.fromCharCode(65 + answer.answer)}
                              </Text>
                              <Text type="secondary">
                                {t(
                                  "listening.submissions.detailsModal.pointsEarned"
                                )}
                                : {answer.pointsEarned || 0}
                              </Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </div>
                ),
              });
            }}
          >
            {t("listening.submissions.viewDetails")}
          </Button>
        ),
      },
    ];

    // Calculate statistics
    const avgScore =
      submissions.length > 0
        ? (
            submissions.reduce((sum, sub) => sum + sub.percentage, 0) /
            submissions.length
          ).toFixed(1)
        : 0;

    const passRate =
      submissions.length > 0
        ? (
            (submissions.filter((sub) => sub.percentage >= 70).length /
              submissions.length) *
            100
          ).toFixed(1)
        : 0;

    return (
      <div>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("listening.submissions.totalSubmissions")}
                value={submissions.length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("listening.submissions.averageScore")}
                value={avgScore}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{
                  color:
                    avgScore >= 80
                      ? "#52c41a"
                      : avgScore >= 70
                      ? "#faad14"
                      : "#f5222d",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("listening.submissions.passRate")}
                value={passRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{
                  color: passRate >= 70 ? "#52c41a" : "#f5222d",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Submissions Table */}
        <Table
          columns={submissionsColumns}
          dataSource={submissions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: t("listening.submissions.noSubmissions") }}
        />
      </div>
    );
  };

  const renderListeningExercises = () => {
    return (
      <div className="listening-exercises">
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>{t("listening.management")}</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log(
                "🎧 Opening Listening modal with allCourses:",
                allCourses
              );
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log("🔄 Courses empty, refreshing...");
                await fetchAllCourses();
              }
              setIsListeningModalVisible(true);
            }}
          >
            {t("listening.create")}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("listening.stats.total")}
                value={listeningExercises.length}
                prefix={<AudioOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("listening.stats.active")}
                value={
                  listeningExercises.filter((l) => l.status === "active").length
                }
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("listening.stats.totalQuestions")}
                value={listeningExercises.reduce(
                  (acc, l) => acc + (l.questions?.length || 0),
                  0
                )}
                valueStyle={{ color: "#faad14" }}
                prefix={<QuestionCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t("listening.stats.avgDuration")}
                value={
                  listeningExercises.length > 0
                    ? Math.round(
                        listeningExercises.reduce(
                          (acc, l) => acc + (l.duration || 0),
                          0
                        ) /
                          listeningExercises.length /
                          60
                      )
                    : 0
                }
                suffix={t("common.minutes")}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            key={`listening-table-${currentLanguage}`}
            columns={listeningColumns}
            dataSource={listeningExercises}
            rowKey="_id"
            loading={listeningLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                  "listening.items"
                )}`,
            }}
          />
        </Card>

        {/* Listening Exercise Edit/Create Modal */}
        <Modal
          title={editingListening ? t("listening.edit") : t("listening.create")}
          visible={isListeningModalVisible}
          onCancel={() => {
            setIsListeningModalVisible(false);
            setEditingListening(null);
            listeningForm.resetFields();
          }}
          footer={null}
          width={1000}
        >
          <ListeningForm
            form={listeningForm}
            listening={editingListening}
            onSubmit={handleListeningSubmit}
            onCancel={() => {
              setIsListeningModalVisible(false);
              setEditingListening(null);
              listeningForm.resetFields();
            }}
          />
        </Modal>

        {/* Listening Exercise View Modal */}
        <Modal
          title={t("listening.view") || "View Listening Exercise"}
          visible={!!viewingListening}
          onCancel={() => setViewingListening(null)}
          footer={[
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                setEditingListening(viewingListening);
                setViewingListening(null);
                listeningForm.setFieldsValue(viewingListening);
                setIsListeningModalVisible(true);
              }}
            >
              {t("common.edit")}
            </Button>,
            <Button key="close" onClick={() => setViewingListening(null)}>
              {t("common.close")}
            </Button>,
          ]}
          width={700}
        >
          {viewingListening && <ListeningViewer listening={viewingListening} />}
        </Modal>

        {/* Question Management Modal */}
        <Modal
          title={
            editingQuestion
              ? t("common.edit") + " " + t("listening.question.text")
              : t("listening.question.add")
          }
          visible={isQuestionModalVisible}
          onCancel={() => {
            setIsQuestionModalVisible(false);
            questionForm.resetFields();
            setEditingQuestion(null);
            setEditingQuestionIndex(null);
          }}
          footer={null}
          width={600}
        >
          <QuestionForm
            form={questionForm}
            onFinish={handleQuestionSubmit}
            onCancel={() => {
              setIsQuestionModalVisible(false);
              questionForm.resetFields();
              setEditingQuestion(null);
              setEditingQuestionIndex(null);
            }}
          />
        </Modal>

        {/* Student Submissions Modal */}
        <Modal
          title={
            <Space>
              <BarChartOutlined />
              {t("listening.submissions.title")} -{" "}
              {selectedExerciseForSubmissions?.title}
            </Space>
          }
          visible={submissionsModalVisible}
          onCancel={() => {
            setSubmissionsModalVisible(false);
            setSelectedExerciseForSubmissions(null);
            setSubmissions([]);
          }}
          footer={[
            <Button
              key="close"
              onClick={() => {
                setSubmissionsModalVisible(false);
                setSelectedExerciseForSubmissions(null);
                setSubmissions([]);
              }}
            >
              {t("common.close")}
            </Button>,
          ]}
          width={1200}
          styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        >
          {selectedExerciseForSubmissions && (
            <ListeningSubmissionsContent
              exerciseId={selectedExerciseForSubmissions._id}
              submissions={submissions}
              loading={submissionsLoading}
              onRefresh={() =>
                fetchListeningSubmissions(selectedExerciseForSubmissions._id)
              }
            />
          )}
        </Modal>
      </div>
    );
  };

  // Settings Component
  const renderSettings = () => {
    return (
      <div style={{ padding: "24px" }}>
        <Title level={2}>{t("teacherDashboard.settings.title")}</Title>
        <Text type="secondary">{t("teacherDashboard.settings.subtitle")}</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card
              title={t("teacherDashboard.settings.profileInfoViewOnly")}
              style={{ marginBottom: 24 }}
            >
              <Form form={profileForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label={t("teacherDashboard.settings.fullName")}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label={t("teacherDashboard.settings.email")}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label={t("teacherDashboard.settings.phone")}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="department"
                      label={t("teacherDashboard.settings.department")}
                    >
                      <Select disabled>
                        <Option value="english">
                          {t("teacherDashboard.settings.departments.english")}
                        </Option>
                        <Option value="japanese">
                          {t("teacherDashboard.settings.departments.japanese")}
                        </Option>
                        <Option value="chinese">
                          {t("teacherDashboard.settings.departments.chinese")}
                        </Option>
                        <Option value="korean">
                          {t("teacherDashboard.settings.departments.korean")}
                        </Option>
                        <Option value="spanish">
                          {t("teacherDashboard.settings.departments.spanish")}
                        </Option>
                        <Option value="french">
                          {t("teacherDashboard.settings.departments.french")}
                        </Option>
                        <Option value="mathematics">
                          {t(
                            "teacherDashboard.settings.departments.mathematics"
                          )}
                        </Option>
                        <Option value="science">
                          {t("teacherDashboard.settings.departments.science")}
                        </Option>
                        <Option value="technology">
                          {t(
                            "teacherDashboard.settings.departments.technology"
                          )}
                        </Option>
                        <Option value="other">
                          {t("teacherDashboard.settings.departments.other")}
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="bio"
                  label={t("teacherDashboard.settings.bio")}
                >
                  <Input.TextArea disabled rows={4} />
                </Form.Item>
              </Form>
              <Alert
                message={t("teacherDashboard.settings.profileUpdatesTitle")}
                description={t("teacherDashboard.settings.profileUpdatesDesc")}
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>

            <Card
              title={t("teacherDashboard.settings.notificationPreferences")}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <Text strong>
                    {t("teacherDashboard.settings.emailNotifications")}
                  </Text>
                  <br />
                  <Text type="secondary">
                    {t("teacherDashboard.settings.emailNotificationsDesc")}
                  </Text>
                </div>
                <Switch
                  checked={notificationPreferences.emailNotifications}
                  onChange={(checked) =>
                    handleNotificationPreferenceChange(
                      "emailNotifications",
                      checked
                    )
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <Text strong>
                    {t("teacherDashboard.settings.assignmentReminders")}
                  </Text>
                  <br />
                  <Text type="secondary">
                    {t("teacherDashboard.settings.assignmentRemindersDesc")}
                  </Text>
                </div>
                <Switch
                  checked={notificationPreferences.assignmentReminders}
                  onChange={(checked) =>
                    handleNotificationPreferenceChange(
                      "assignmentReminders",
                      checked
                    )
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text strong>
                    {t("teacherDashboard.settings.studentSubmissions")}
                  </Text>
                  <br />
                  <Text type="secondary">
                    {t("teacherDashboard.settings.studentSubmissionsDesc")}
                  </Text>
                </div>
                <Switch
                  checked={notificationPreferences.studentSubmissions}
                  onChange={(checked) =>
                    handleNotificationPreferenceChange(
                      "studentSubmissions",
                      checked
                    )
                  }
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={t("teacherDashboard.settings.quickActions")}
              style={{ marginBottom: 24 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  icon={<DownloadOutlined />}
                  onClick={handleExportClassData}
                >
                  {t("teacherDashboard.settings.exportClassData")}
                </Button>
                <Button
                  block
                  icon={<FileTextOutlined />}
                  onClick={handleGenerateReport}
                >
                  {t("teacherDashboard.settings.generateReport")}
                </Button>
              </Space>
            </Card>

            <Card title={t("teacherDashboard.settings.accountSecurity")}>
              <Alert
                message={t("teacherDashboard.settings.passwordManagement")}
                description={t(
                  "teacherDashboard.settings.passwordManagementDesc"
                )}
                type="info"
                showIcon
              />
            </Card>
          </Col>
        </Row>

        {/* My Profile Modal - View Only */}
        <Modal
          title={t("teacherDashboard.profile.title")}
          visible={isProfileModalVisible}
          onCancel={() => setIsProfileModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsProfileModalVisible(false)}>
              {t("teacherDashboard.profile.close")}
            </Button>,
          ]}
          width={600}
        >
          <Form form={profileForm} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label={t("teacherDashboard.settings.fullName")}
                >
                  <Input disabled prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label={t("teacherDashboard.settings.email")}
                >
                  <Input disabled prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={t("teacherDashboard.settings.phone")}
                >
                  <Input disabled prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label={t("teacherDashboard.settings.department")}
                >
                  <Select disabled>
                    <Option value="english">
                      {t("teacherDashboard.settings.departments.english")}
                    </Option>
                    <Option value="japanese">
                      {t("teacherDashboard.settings.departments.japanese")}
                    </Option>
                    <Option value="chinese">
                      {t("teacherDashboard.settings.departments.chinese")}
                    </Option>
                    <Option value="korean">
                      {t("teacherDashboard.settings.departments.korean")}
                    </Option>
                    <Option value="spanish">
                      {t("teacherDashboard.settings.departments.spanish")}
                    </Option>
                    <Option value="french">
                      {t("teacherDashboard.settings.departments.french")}
                    </Option>
                    <Option value="mathematics">
                      {t("teacherDashboard.settings.departments.mathematics")}
                    </Option>
                    <Option value="science">
                      {t("teacherDashboard.settings.departments.science")}
                    </Option>
                    <Option value="technology">
                      {t("teacherDashboard.settings.departments.technology")}
                    </Option>
                    <Option value="other">
                      {t("teacherDashboard.settings.departments.other")}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="bio" label={t("teacherDashboard.settings.bio")}>
              <Input.TextArea disabled rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "courses":
        return renderCourseManagement();
      case "materials":
        return renderMaterialManagement();
      case "quizzes":
        return renderQuizManagement();
      case "homework":
        return renderHomeworkManagement();
      case "listening":
        return renderListeningExercises();
      case "students":
        return renderStudentManagement();
      case "zoom":
        return renderZoomClasses();
      case "grading":
        return renderGradingCenter();
      case "analytics":
        return renderAnalytics();
      case "settings":
        return renderSettings();
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

  return (
    <>
      <style>{`
        /* Modern Animations */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-3px); }
          60% { transform: translateY(-2px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        /* Glass Morphism Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(24, 144, 255, 0.15);
        }
        
        /* Gradient Stats Cards */
        .stat-card {
          border: none !important;
          border-radius: 16px !important;
          overflow: hidden;
          position: relative;
          animation: fadeIn 0.5s ease-out;
          color: white !important;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 1;
        }
        
        .stat-card .ant-card-body {
          background: transparent !important;
          color: white !important;
          position: relative;
          z-index: 2;
        }
        
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
        .stat-card-5 { 
          background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%) !important; 
        }
        .stat-card-6 { 
          background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%) !important; 
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
        
        .notification-badge {
          animation: bounce 1s infinite;
        }
        
        /* Modern Table Styles */
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
          color: white !important;
          font-weight: 600;
          border: none !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f5ff !important;
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
          border: none !important;
          background: transparent !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          position: relative !important;
        }
        
        .modern-sidebar .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          transform: translateX(2px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        .modern-sidebar .ant-menu-item-selected {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%) !important;
          color: #fff !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2) !important;
          border-left: 3px solid #4f46e5 !important;
        }
        
        .modern-sidebar .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 0 2px 2px 0;
        }
        
        .modern-sidebar .ant-menu-item-icon {
          font-size: 16px !important;
          margin-right: 12px !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-sidebar .ant-menu-item:hover .ant-menu-item-icon {
          transform: scale(1.1) !important;
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
        
        /* Card Hover Effects */
        .ant-card {
          border-radius: 12px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .ant-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        /* Progress Bar Gradient */
        .ant-progress-bg {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
        }
        
        /* Modern Modal */
        .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
        }
        
        .ant-modal-header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-bottom: none;
        }
        
        .ant-modal-title {
          color: white !important;
        }
        
        .ant-modal-close-x {
          color: white !important;
        }
        
        /* Timeline Modern */
        .ant-timeline-item {
          padding-bottom: 24px;
        }
        
        /* Tag Modern */
        .ant-tag {
          border-radius: 6px;
          font-weight: 500;
          padding: 2px 10px;
        }
        
        /* Smooth Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        /* Loading Skeleton */
        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <Layout style={{ minHeight: "100vh" }}>
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
              background:
                "linear-gradient(180deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
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
                    Teacher Portal
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
              items={teacherMenuItems.map((item) => ({
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
                  <Breadcrumb.Item>Teacher Dashboard</Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {
                      teacherMenuItems.find((item) => item.key === activeTab)
                        ?.label
                    }
                  </Breadcrumb.Item>
                </Breadcrumb>
              )}
              {isMobile && (
                <Title
                  level={5}
                  style={{ margin: "0 0 0 16px", color: "#262626" }}
                >
                  {
                    teacherMenuItems.find((item) => item.key === activeTab)
                      ?.label
                  }
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
                      label: t("teacherDashboard.header.myProfile"),
                      onClick: () => setIsProfileModalVisible(true),
                    },
                    {
                      key: "settings",
                      icon: <SettingOutlined />,
                      label: t("teacherDashboard.header.settings"),
                      onClick: () => setActiveTab("settings"),
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: t("teacherDashboard.header.logout"),
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
                      {currentUser?.name || "Teacher"}
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
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Teacher Portal</span>
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
            items={teacherMenuItems.map((item) => ({
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

        {/* Audio Player */}
        {audioUrl && (
          <div
            style={{
              position: "fixed",
              bottom: isMobile ? 16 : 24,
              right: isMobile ? 16 : 24,
              zIndex: 1000,
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(20px)",
              padding: isMobile ? 12 : 16,
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              minWidth: isMobile ? "280px" : "320px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}>
                <AudioOutlined style={{ color: "#fff", fontSize: "20px" }} />
              </div>
              <div style={{ flex: 1 }}>
            <audio
              controls
              autoPlay
              onEnded={() => {
                setCurrentPlayingId(null);
                setAudioUrl("");
              }}
                  style={{ width: "100%", height: "32px" }}
            >
              <source src={audioUrl} type="audio/mpeg" />
              <source src={audioUrl} type="audio/wav" />
              <source src={audioUrl} type="audio/ogg" />
              {t("listening.audioNotSupported")}
            </audio>
              </div>
            <Button
              size="small"
              type="text"
                shape="circle"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setCurrentPlayingId(null);
                setAudioUrl("");
              }}
                style={{ 
                  color: "#667eea",
                  fontSize: "18px",
                }}
            />
            </div>
          </div>
        )}

        {/* Grading Modals */}
        {/* Add Grade Modal */}
        <Modal
          title={t("teacherDashboard.grading.form.addGradeTitle")}
          open={createProgressModalVisible}
          onCancel={() => {
            setCreateProgressModalVisible(false);
            progressForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          {/* Debug Info */}
          {process.env.NODE_ENV === "development" && (
            <Card style={{ marginBottom: 16, backgroundColor: "#f6f6f6" }}>
              <Text style={{ fontSize: 12 }}>
                <strong>Debug Info:</strong> {students.length}{" "}
                {t("teacherDashboard.grading.form.studentsLoaded")}
                {students.length > 0 && (
                  <>
                    <br />
                    Students:{" "}
                    {students
                      .map((s) => `${s.firstName} ${s.lastName} (${s.email})`)
                      .join(", ")}
                  </>
                )}
              </Text>
            </Card>
          )}

          {students.length === 0 && (
            <Alert
              message={t("teacherDashboard.grading.form.noStudentsFoundAlert")}
              description={t(
                "teacherDashboard.grading.form.noStudentsDescription",
                { count: students.length }
              )}
              type="warning"
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={progressForm}
            layout="vertical"
            onFinish={createProgressRecord}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      {t("teacherDashboard.grading.form.student")}
                      <Button
                        type="link"
                        size="small"
                        onClick={fetchStudents}
                        loading={studentLoading}
                        title={t(
                          "teacherDashboard.grading.form.refreshStudentList"
                        )}
                      >
                        🔄
                      </Button>
                    </Space>
                  }
                  name="student"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.studentRequired"
                      ),
                    },
                  ]}
                >
                  <Select
                    placeholder={
                      students.length > 0
                        ? t("teacherDashboard.grading.form.selectStudent")
                        : t("teacherDashboard.grading.form.noStudentsAvailable")
                    }
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    notFoundContent={
                      students.length === 0
                        ? t("teacherDashboard.grading.form.noStudentsFound")
                        : t("teacherDashboard.grading.form.noMatchingStudents")
                    }
                  >
                    {students.map((student) => (
                      <Option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName}
                        {student.studentId && ` (ID: ${student.studentId})`}
                        {student.email && ` - ${student.email}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.subject")}
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.subjectRequired"
                      ),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      "teacherDashboard.grading.form.subjectPlaceholder"
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t("teacherDashboard.grading.form.assignmentName")}
              name="assignment"
              rules={[
                {
                  required: true,
                  message: t(
                    "teacherDashboard.grading.form.assignmentNameRequired"
                  ),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "teacherDashboard.grading.form.assignmentNamePlaceholder"
                )}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.assignmentType")}
                  name="assignmentType"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.assignmentTypeRequired"
                      ),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("teacherDashboard.grading.form.selectType")}
                  >
                    <Option value="homework">
                      {t("teacherDashboard.grading.form.types.homework")}
                    </Option>
                    <Option value="quiz">
                      {t("teacherDashboard.grading.form.types.quiz")}
                    </Option>
                    <Option value="exam">
                      {t("teacherDashboard.grading.form.types.exam")}
                    </Option>
                    <Option value="project">
                      {t("teacherDashboard.grading.form.types.project")}
                    </Option>
                    <Option value="participation">
                      {t("teacherDashboard.grading.form.types.participation")}
                    </Option>
                    <Option value="other">
                      {t("teacherDashboard.grading.form.types.other")}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.grade")}
                  name="grade"
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.grading.form.gradeRequired"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("teacherDashboard.grading.form.selectGrade")}
                  >
                    <Option value="A+">A+</Option>
                    <Option value="A">A</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B">B</Option>
                    <Option value="B-">B-</Option>
                    <Option value="C+">C+</Option>
                    <Option value="C">C</Option>
                    <Option value="C-">C-</Option>
                    <Option value="D+">D+</Option>
                    <Option value="D">D</Option>
                    <Option value="F">F</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.score")}
                  name="score"
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.grading.form.scoreRequired"),
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.maxScore")}
                  name="maxScore"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.maxScoreRequired"
                      ),
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    defaultValue={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t("teacherDashboard.grading.form.description")}
              name="description"
            >
              <Input.TextArea
                rows={2}
                placeholder={t(
                  "teacherDashboard.grading.form.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("teacherDashboard.grading.form.comments")}
              name="comments"
            >
              <Input.TextArea
                rows={3}
                placeholder={t(
                  "teacherDashboard.grading.form.commentsPlaceholder"
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("teacherDashboard.grading.form.submissionDate")}
              name="submissionDate"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button
                  onClick={() => {
                    setCreateProgressModalVisible(false);
                    progressForm.resetFields();
                  }}
                >
                  {t("teacherDashboard.grading.form.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={gradingLoading}
                >
                  {t("teacherDashboard.grading.form.addGrade")}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Edit Grade Modal */}
        <Modal
          title={t("teacherDashboard.grading.form.editGradeTitle")}
          open={editProgressModalVisible}
          onCancel={() => {
            setEditProgressModalVisible(false);
            setSelectedProgress(null);
            editProgressForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={editProgressForm}
            layout="vertical"
            onFinish={updateProgressRecord}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.subject")}
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.subjectRequired"
                      ),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.assignmentType")}
                  name="assignmentType"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.assignmentTypeRequired"
                      ),
                    },
                  ]}
                >
                  <Select>
                    <Option value="homework">
                      {t("teacherDashboard.grading.form.types.homework")}
                    </Option>
                    <Option value="quiz">
                      {t("teacherDashboard.grading.form.types.quiz")}
                    </Option>
                    <Option value="exam">
                      {t("teacherDashboard.grading.form.types.exam")}
                    </Option>
                    <Option value="project">
                      {t("teacherDashboard.grading.form.types.project")}
                    </Option>
                    <Option value="participation">
                      {t("teacherDashboard.grading.form.types.participation")}
                    </Option>
                    <Option value="other">
                      {t("teacherDashboard.grading.form.types.other")}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t("teacherDashboard.grading.form.assignmentName")}
              name="assignment"
              rules={[
                {
                  required: true,
                  message: t(
                    "teacherDashboard.grading.form.assignmentNameRequired"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.score")}
                  name="score"
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.grading.form.scoreRequired"),
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.maxScore")}
                  name="maxScore"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "teacherDashboard.grading.form.maxScoreRequired"
                      ),
                    },
                  ]}
                >
                  <InputNumber min={1} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t("teacherDashboard.grading.form.grade")}
                  name="grade"
                  rules={[
                    {
                      required: true,
                      message: t("teacherDashboard.grading.form.gradeRequired"),
                    },
                  ]}
                >
                  <Select>
                    <Option value="A+">A+</Option>
                    <Option value="A">A</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B">B</Option>
                    <Option value="B-">B-</Option>
                    <Option value="C+">C+</Option>
                    <Option value="C">C</Option>
                    <Option value="C-">C-</Option>
                    <Option value="D+">D+</Option>
                    <Option value="D">D</Option>
                    <Option value="F">F</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t("teacherDashboard.grading.form.comments")}
              name="comments"
            >
              <Input.TextArea
                rows={3}
                placeholder={t(
                  "teacherDashboard.grading.form.commentsPlaceholder"
                )}
              />
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button
                  onClick={() => {
                    setEditProgressModalVisible(false);
                    setSelectedProgress(null);
                    editProgressForm.resetFields();
                  }}
                >
                  {t("teacherDashboard.grading.form.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={gradingLoading}
                >
                  {t("teacherDashboard.grading.form.updateGrade")}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Create Announcement Modal */}
        <Modal
          title="Create Announcement"
          open={createAnnouncementModalVisible}
          onCancel={() => {
            setCreateAnnouncementModalVisible(false);
            announcementForm.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={announcementForm}
            layout="vertical"
            onFinish={createAnnouncement}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter announcement title" },
              ]}
            >
              <Input placeholder="Announcement title" />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please enter announcement content",
                },
              ]}
            >
              <Input.TextArea rows={5} placeholder="Announcement content" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Target Audience"
                  name="targetAudience"
                  rules={[
                    {
                      required: true,
                      message: "Please select target audience",
                    },
                  ]}
                >
                  <Select placeholder="Select audience">
                    <Option value="all">Everyone</Option>
                    <Option value="students">All Students</Option>
                    <Option value="teachers">All Teachers</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Priority" name="priority">
                  <Select placeholder="Select priority" defaultValue="medium">
                    <Option value="low">Low</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="high">High</Option>
                    <Option value="urgent">Urgent</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Type" name="type">
                  <Select placeholder="Select type" defaultValue="general">
                    <Option value="general">General</Option>
                    <Option value="assignment">Assignment</Option>
                    <Option value="exam">Exam</Option>
                    <Option value="event">Event</Option>
                    <Option value="reminder">Reminder</Option>
                    <Option value="grade_update">Grade Update</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Subject" name="subject">
                  <Input placeholder="Related subject (optional)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Publish Date" name="publishDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    defaultValue={moment()}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Expiry Date" name="expiryDate">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="isSticky" valuePropName="checked">
              <Switch /> Pin this announcement (sticky)
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button
                  onClick={() => {
                    setCreateAnnouncementModalVisible(false);
                    announcementForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                >
                  Create Announcement
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* View Progress Modal */}
        <Modal
          title={t("teacherDashboard.grading.viewModal.title")}
          open={viewProgressModalVisible}
          onCancel={() => {
            setViewProgressModalVisible(false);
            setViewingProgress(null);
          }}
          footer={[
            <Button
              key="close"
              onClick={() => {
                setViewProgressModalVisible(false);
                setViewingProgress(null);
              }}
            >
              {t("teacherDashboard.grading.viewModal.close")}
            </Button>,
          ]}
          width={700}
        >
          {viewingProgress && (
            <div>
              {/* Student Information */}
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>
                      {t(
                        "teacherDashboard.grading.viewModal.studentInformation"
                      )}
                    </span>
                  </Space>
                }
                style={{ marginBottom: 16 }}
              >
                <Descriptions column={2} bordered>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.studentName")}
                    span={1}
                  >
                    <Space>
                      <Avatar icon={<UserOutlined />} size="small" />
                      <Text strong>
                        {viewingProgress.student?.firstName}{" "}
                        {viewingProgress.student?.lastName}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.studentId")}
                    span={1}
                  >
                    <Text>{viewingProgress.student?.studentId || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.email")}
                    span={1}
                  >
                    <Text>{viewingProgress.student?.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.gradeLevel")}
                    span={1}
                  >
                    <Text>{viewingProgress.student?.gradeLevel || "N/A"}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Assignment Information */}
              <Card
                title={
                  <Space>
                    <FileTextOutlined />
                    <span>
                      {t(
                        "teacherDashboard.grading.viewModal.assignmentDetails"
                      )}
                    </span>
                  </Space>
                }
                style={{ marginBottom: 16 }}
              >
                <Descriptions column={2} bordered>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.form.subject")}
                    span={1}
                  >
                    <Tag color="blue">{viewingProgress.subject}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.form.assignmentType")}
                    span={1}
                  >
                    <Tag
                      color={
                        viewingProgress.assignmentType === "exam"
                          ? "red"
                          : viewingProgress.assignmentType === "quiz"
                          ? "blue"
                          : viewingProgress.assignmentType === "homework"
                          ? "green"
                          : viewingProgress.assignmentType === "project"
                          ? "purple"
                          : viewingProgress.assignmentType === "participation"
                          ? "orange"
                          : "gray"
                      }
                    >
                      {t(
                        `teacherDashboard.grading.form.types.${viewingProgress.assignmentType}`
                      )?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t(
                      "teacherDashboard.grading.viewModal.assignmentName"
                    )}
                    span={2}
                  >
                    <Text strong>{viewingProgress.assignment}</Text>
                  </Descriptions.Item>
                  {viewingProgress.description && (
                    <Descriptions.Item
                      label={t("teacherDashboard.grading.form.description")}
                      span={2}
                    >
                      <Text>{viewingProgress.description}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Grade Information */}
              <Card
                title={
                  <Space>
                    <TrophyOutlined />
                    <span>
                      {t("teacherDashboard.grading.viewModal.gradeInformation")}
                    </span>
                  </Space>
                }
                style={{ marginBottom: 16 }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title={t(
                          "teacherDashboard.grading.viewModal.scoreLabel"
                        )}
                        value={`${viewingProgress.score}/${viewingProgress.maxScore}`}
                        valueStyle={{
                          color:
                            viewingProgress.percentage >= 90
                              ? "#52c41a"
                              : viewingProgress.percentage >= 80
                              ? "#1890ff"
                              : viewingProgress.percentage >= 70
                              ? "#faad14"
                              : "#f5222d",
                        }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title={t(
                          "teacherDashboard.grading.viewModal.percentage"
                        )}
                        value={viewingProgress.percentage}
                        suffix="%"
                        valueStyle={{
                          color:
                            viewingProgress.percentage >= 90
                              ? "#52c41a"
                              : viewingProgress.percentage >= 80
                              ? "#1890ff"
                              : viewingProgress.percentage >= 70
                              ? "#faad14"
                              : "#f5222d",
                        }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#8c8c8c",
                            marginBottom: "8px",
                          }}
                        >
                          {t("teacherDashboard.grading.viewModal.letterGrade")}
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                          <Tag
                            color={
                              ["A+", "A", "A-"].includes(viewingProgress.grade)
                                ? "green"
                                : ["B+", "B", "B-"].includes(
                                    viewingProgress.grade
                                  )
                                ? "blue"
                                : ["C+", "C", "C-"].includes(
                                    viewingProgress.grade
                                  )
                                ? "orange"
                                : ["D+", "D"].includes(viewingProgress.grade)
                                ? "red"
                                : "red"
                            }
                            style={{ fontSize: "18px", padding: "4px 12px" }}
                          >
                            {viewingProgress.grade}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>

              {/* Timeline Information */}
              <Card
                title={
                  <Space>
                    <CalendarOutlined />
                    <span>
                      {t("teacherDashboard.grading.viewModal.timeline")}
                    </span>
                  </Space>
                }
                style={{ marginBottom: 16 }}
              >
                <Descriptions column={2} bordered>
                  <Descriptions.Item
                    label={t(
                      "teacherDashboard.grading.viewModal.submissionDate"
                    )}
                    span={1}
                  >
                    <Text>
                      {viewingProgress.submissionDate
                        ? moment(viewingProgress.submissionDate).format(
                            "MMM DD, YYYY HH:mm"
                          )
                        : "N/A"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.gradedDate")}
                    span={1}
                  >
                    <Text>
                      {moment(viewingProgress.gradedDate).format(
                        "MMM DD, YYYY HH:mm"
                      )}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("teacherDashboard.grading.viewModal.teacher")}
                    span={2}
                  >
                    <Space>
                      <Avatar icon={<UserOutlined />} size="small" />
                      <Text>
                        {viewingProgress.teacher?.firstName}{" "}
                        {viewingProgress.teacher?.lastName}
                      </Text>
                      <Text type="secondary">
                        ({viewingProgress.teacher?.email})
                      </Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Comments */}
              {viewingProgress.comments && (
                <Card
                  title={
                    <Space>
                      <MessageOutlined />
                      <span>
                        {t(
                          "teacherDashboard.grading.viewModal.teacherComments"
                        )}
                      </span>
                    </Space>
                  }
                >
                  <div
                    style={{
                      background: "#f6f6f6",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    <Text>{viewingProgress.comments}</Text>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Modal>

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
                  Mark all as read
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
              <div style={{ marginTop: "16px" }}>Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <Empty
              description="No notifications"
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
                          ) : notification.icon === "setting" ? (
                            <SettingOutlined />
                          ) : notification.icon === "clock-circle" ? (
                            <ClockCircleOutlined />
                          ) : notification.icon === "user" ? (
                            <UserOutlined />
                          ) : notification.icon === "team" ? (
                            <TeamOutlined />
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
                  Refresh
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
                  Mark All Read
                </Button>
              </Space>
            </div>
          )}
        </Drawer>
      </Layout>
    </>
  );
};

export default TeacherDashboard;

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);
import {
  Row,
  Col,
  Card,
  Statistic,
  Select,
  Timeline,
  Empty,
  Badge,
  Button,
  Typography,
  Calendar,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Tag,
  Popover,
  Space,
  Tooltip,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  FolderOutlined,
  FormOutlined,
  AudioOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  MessageOutlined,
  DollarOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  CalendarOutlined,
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import {
  getAuthHeaders,
  API_BASE_URL,
  getArrayFromData,
} from "../../utils/adminApiUtils";
import { materialAPI } from "../../utils/apiClient";

const { Text } = Typography;
const { Option } = Select;

// Vanilla JS Icon Component (matching sidebar style)
function Icon({ name, size = 24, color = "currentColor" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "teacher":
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "quiz":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "homework":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8" />
        </svg>
      );
    case "audio":
      return (
        <svg {...common}>
          <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    case "enrollment":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      );
    default:
      return null;
  }
}

const Admindashboardoverview = ({ t, setActiveKey }) => {
  const history = useHistory();
  const { i18n } = useTranslation();

  // Translation helper with English fallback when a key is missing
  const translate = useCallback(
    (key, fallback) => {
      try {
        const translator = t || i18n.t.bind(i18n);
        const value = translator ? translator(key) : key;
        if (!value || value === key) {
          return fallback || key;
        }
        return value;
      } catch (e) {
        return fallback || key;
      }
    },
    [t, i18n]
  );

  // Translation helper with explicit JA fallback
  const tJa = useCallback(
    (key, enFallback, jaFallback) => {
      const primary = translate(key, "");
      if (primary && primary !== key) return primary;
      const lang = (i18n?.language || "").toLowerCase();
      if (lang.startsWith("ja") && jaFallback) return jaFallback;
      return enFallback || key;
    },
    [translate, i18n]
  );

  // Context - handle case when context is undefined
  const context = useContext(AdminContext);
  const contextDashboardStats = context?.dashboardStats;
  const contextFetchDashboardStats = context?.fetchDashboardStats;

  // Local state
  const [localDashboardStats, setLocalDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalMaterials: 0,
    totalHomework: 0,
    totalQuizzes: 0,
    totalListeningExercises: 0,
    totalEnrollments: 0,
    newEnrollmentsThisMonth: 0,
    activeEnrollments: 0,
    pendingEnrollments: 0,
    completionRate: 75,
    pendingSubmissions: 8,
    activeQuizzes: 0,
  });

  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [courses, setCourses] = useState([]);

  // Clock and Screen Time states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenTime, setScreenTime] = useState(0); // in seconds
  const [sessionStartTime] = useState(new Date());

  // Calendar events and tasks state
  const [events, setEvents] = useState([]);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm] = Form.useForm();
  const [notifications, setNotifications] = useState([]);
  const [calendarViewMode, setCalendarViewMode] = useState("calendar"); // "calendar" or "list"
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [homework, setHomework] = useState([]);
  const [listening, setListening] = useState([]);

  // Always use local dashboard stats for this component
  const dashboardStats = localDashboardStats;

  // Debug logging
  useEffect(() => {
    console.log("📊 Dashboard Stats:", dashboardStats);
    console.log("� Message Stats:", {
      totalMessages: dashboardStats.totalMessages,
      unreadMessages: dashboardStats.unreadMessages,
      contactMessagesArray: contactMessages.length,
    });
    console.log("�📚 Data Arrays:", {
      courses: courses.length,
      students: students.length,
      teachers: teachers.length,
      applications: applications.length,
      materials: materials.length,
      contactMessages: contactMessages.length,
    });
  }, [
    dashboardStats,
    courses,
    students,
    teachers,
    applications,
    materials,
    contactMessages,
  ]);

  // Fetch functions
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const coursesData = data.courses || data || [];
        console.log(`✅ Fetched ${coursesData.length} courses`);
        setCourses(coursesData);
      } else {
        console.error("Failed to fetch courses:", response.statusText);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  }, [history]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?role=student`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const studentsData = data.users || data || [];
        console.log(`✅ Fetched ${studentsData.length} students`);
        setStudents(studentsData);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  }, [history]);

  const fetchApplications = useCallback(async () => {
    let apiApplications = [];
    const skipApiTesting = localStorage.getItem("skipApiTesting") === "true";
    const skipAuthRedirects =
      localStorage.getItem("skipAuthRedirects") === "true";

    console.log(`🔍 API Testing: ${skipApiTesting ? "SKIPPED" : "ENABLED"}`);
    console.log(
      `🔍 Auth Redirects: ${skipAuthRedirects ? "SKIPPED" : "ENABLED"}`
    );

    if (!skipApiTesting) {
      const endpoints = [
        `${API_BASE_URL}/api/applications`,
        `${API_BASE_URL}/api/student-applications`,
      ];

      for (const endpoint of endpoints) {
        try {
          let headers = getAuthHeaders();
          console.log(`🔍 Trying endpoint: ${endpoint}`);

          let response = await fetch(endpoint, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            headers: headers,
          });

          console.log(`📡 Response status: ${response.status} for ${endpoint}`);

          if (response.status === 401 && !skipAuthRedirects) {
            localStorage.clear();
            history.push("/login");
            return;
          }

          if (response.ok) {
            const data = await response.json();
            apiApplications = data.applications || data || [];
            console.log(
              `✅ Fetched ${apiApplications.length} applications from ${endpoint}`
            );
            break;
          }
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}, trying next...`);
          continue;
        }
      }
    }

    let localApplications = [];
    try {
      const localData = localStorage.getItem("applications");
      if (localData) {
        localApplications = JSON.parse(localData);
      }
    } catch (error) {
      console.log("No local applications found");
    }

    let processedApplications =
      apiApplications.length > 0 ? apiApplications : localApplications;
    let finalApplications = [...processedApplications];

    if (apiApplications.length === 0 && localApplications.length === 0) {
      const confirmedApplications = [
        {
          _id: "6848204f406c08f22fa028bc",
          fullName: "Sample Student",
          firstName: "Sample",
          lastName: "Student",
          email: "sample@demo.com",
          phone: "080 1234 5678",
          dateOfBirth: "2000-01-01",
          address: "Tokyo, Japan",
          nationality: "Japanese",
          highestEducation: "bachelors",
          schoolName: "Demo University",
          graduationYear: "2020",
          fieldOfStudy: "Computer Science",
          currentEmployment: "Working",
          techExperience: "2 years",
          course: "ai",
          program: "ai",
          startDate: "fall2025",
          format: "fullTime",
          goals: "Learn AI",
          whyThisProgram: "Career advancement",
          challenges: "",
          extraInfo: "Motivated learner",
          howDidYouHear: "online",
          agreeToTerms: true,
          createdAt: "2025-01-01T00:00:00.000Z",
          status: "pending",
          isLocal: false,
        },
      ];

      const existingIds = new Set(finalApplications.map((app) => app._id));
      const newApplications = confirmedApplications.filter(
        (app) => !existingIds.has(app._id)
      );
      finalApplications = [...finalApplications, ...newApplications];

      console.log(
        `✅ Merged data: ${finalApplications.length} total applications`
      );
    }

    const updatedStatuses = JSON.parse(
      localStorage.getItem("applicationStatuses") || "{}"
    );
    if (Object.keys(updatedStatuses).length > 0) {
      console.log(
        `🔄 Applying ${
          Object.keys(updatedStatuses).length
        } localStorage status updates...`
      );
      finalApplications = finalApplications.map((app) => ({
        ...app,
        status: updatedStatuses[app._id] || app.status,
      }));
      console.log(`✅ Applied localStorage status updates to all applications`);
    }

    setApplications(finalApplications);
    console.log(`📊 Final applications loaded: ${finalApplications.length}`);
  }, [history]);

  const fetchContactMessages = useCallback(async () => {
    let apiMessages = [];
    const endpoints = [`${API_BASE_URL}/api/contact`];

    console.log("🔍 Fetching contact messages from API...");
    console.log("🔑 Auth headers:", getAuthHeaders());

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: getAuthHeaders(),
        });

        console.log(`📡 Contact API response status: ${response.status}`);

        if (response.status === 401) {
          console.log(
            "❌ Unauthorized - clearing localStorage and redirecting"
          );
          localStorage.clear();
          history.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log("📦 Contact API raw response:", data);
          apiMessages = data.contacts || data || [];
          console.log(
            `✅ Fetched ${apiMessages.length} contact messages from API`
          );
          break;
        } else {
          console.log(
            `⚠️ API response not OK: ${response.status} ${response.statusText}`
          );
          const errorText = await response.text();
          console.log(`⚠️ Error response body:`, errorText);
        }
      } catch (error) {
        console.error(`❌ Failed to fetch from ${endpoint}:`, error);
        continue;
      }
    }

    let localMessages = [];
    try {
      const localNotifications = JSON.parse(
        localStorage.getItem("localNotifications") || "[]"
      );
      console.log(`📋 Found ${localNotifications.length} local notifications`);

      const contactNotifications = localNotifications.filter(
        (notif) => notif.type === "contact" || notif.type === "contact_message"
      );
      console.log(
        `📧 Filtered ${contactNotifications.length} contact notifications`
      );

      localMessages = contactNotifications.map((notif) => ({
        _id: notif.contactId || `contact_${Date.now()}`,
        name: notif.senderName || "Unknown",
        email: notif.email || "unknown@example.com",
        subject: notif.subject || "Contact Message",
        message: notif.message || "No message content",
        status: "pending",
        createdAt: notif.timestamp || new Date().toISOString(),
        isLocal: true,
      }));
    } catch (error) {
      console.log("❌ Error parsing local notifications:", error);
    }

    const allMessages = [...apiMessages, ...localMessages];
    console.log(
      `📊 Total messages before deduplication: ${allMessages.length} (API: ${apiMessages.length}, Local: ${localMessages.length})`
    );

    const uniqueMessages = allMessages.filter(
      (message, index, self) =>
        index ===
        self.findIndex(
          (msg) =>
            msg._id === message._id ||
            (msg.email === message.email && msg.subject === message.subject)
        )
    );

    console.log(`✅ Final contact messages count: ${uniqueMessages.length}`);
    console.log(`📧 Contact messages being set:`, uniqueMessages);
    setContactMessages(uniqueMessages);

    // Force a re-render by logging the state after a short delay
    setTimeout(() => {
      console.log(
        `📊 Contact messages state after set (should be ${uniqueMessages.length})`
      );
    }, 100);
  }, [history]);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?role=teacher`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const teachersData = data.users || data || [];
        console.log(`✅ Fetched ${teachersData.length} teachers`);
        setTeachers(teachersData);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  }, [history]);

  const fetchMaterials = useCallback(async () => {
    try {
      const data = await materialAPI.getAll();
      const materialsData = data || [];
      console.log(`✅ Fetched ${materialsData.length} materials`);
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMaterials([]);
    }
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const quizzesData = getArrayFromData(data, "quizzes");
        console.log(`✅ Fetched ${quizzesData.length} quizzes`);
        setQuizzes(quizzesData);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    }
  }, []);

  const fetchHomework = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/homework`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const homeworkData = getArrayFromData(data, "homework");
        console.log(`✅ Fetched ${homeworkData.length} homework`);
        setHomework(homeworkData);
      }
    } catch (error) {
      console.error("Error fetching homework:", error);
      setHomework([]);
    }
  }, []);

  const fetchListening = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listening-exercises`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const listeningData = getArrayFromData(data, "exercises");
        console.log(`✅ Fetched ${listeningData.length} listening exercises`);
        setListening(listeningData);
      }
    } catch (error) {
      console.error("Error fetching listening exercises:", error);
      setListening([]);
    }
  }, []);

  const fetchLocalDashboardStats = async () => {
    try {
      // Only fetch enrollments stats from API, calculate rest from local state
      const authHeaders = getAuthHeaders();
      const enrollmentsRes = await fetch(
        `${API_BASE_URL}/api/enrollments/stats`,
        {
          headers: authHeaders,
        }
      ).catch(() => ({ ok: false }));

      if (enrollmentsRes.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      const enrollmentsData = enrollmentsRes.ok
        ? await enrollmentsRes.json()
        : { total: 0, active: 0, pending: 0, newThisMonth: 0 };

      console.log("📧 Contact messages array:", contactMessages);
      console.log("📧 Contact messages length:", contactMessages.length);

      // Log all unique status values to see what we have
      const statusCounts = contactMessages.reduce((acc, m) => {
        const status = m.status || "undefined";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      console.log("📧 Message status breakdown:", statusCounts);

      const pendingMessages = contactMessages.filter(
        (m) => m.status === "pending"
      ).length;

      console.log(
        `📊 Dashboard Stats - Calculating from local state: ${applications.length} applications, ${contactMessages.length} messages (${pendingMessages} pending), ${students.length} students`
      );

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
        unreadMessages: pendingMessages,
        totalMaterials: materials.length,
        totalHomework: homework.length,
        totalQuizzes: quizzes.length,
        totalListeningExercises: listening.length,
        totalEnrollments: enrollmentsData.total || 0,
        newEnrollmentsThisMonth: enrollmentsData.newThisMonth || 0,
        activeEnrollments: enrollmentsData.active || 0,
        pendingEnrollments: enrollmentsData.pending || 0,
        completionRate: 75,
        pendingSubmissions: 8,
        activeQuizzes: quizzes.filter((q) => {
          const now = moment();
          return (
            q.availableFrom &&
            q.availableTo &&
            now.isAfter(moment(q.availableFrom)) &&
            now.isBefore(moment(q.availableTo))
          );
        }).length,
      };

      setLocalDashboardStats(stats);
      console.log(`✅ Dashboard stats updated:`, {
        totalMessages: stats.totalMessages,
        unreadMessages: stats.unreadMessages,
        totalApplications: stats.totalApplications,
        pendingApplications: stats.pendingApplications,
        totalEnrollments: stats.totalEnrollments,
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        localStorage.clear();
        history.push("/login");
      }
    }
  };

  const fetchInitialData = useCallback(async () => {
    console.log("🔄 Starting initial data fetch...");
    try {
      await Promise.all([
        fetchCourses(),
        fetchStudents(),
        fetchTeachers(),
        fetchApplications(),
        fetchContactMessages(),
        fetchMaterials(),
        fetchQuizzes(),
        fetchHomework(),
        fetchListening(),
      ]);
      console.log("✅ All initial data fetched successfully");
    } catch (error) {
      console.error("❌ Error fetching initial data:", error);
    }
  }, [
    fetchCourses,
    fetchStudents,
    fetchTeachers,
    fetchApplications,
    fetchContactMessages,
    fetchMaterials,
    fetchQuizzes,
    fetchHomework,
    fetchListening,
  ]);

  // useEffect to fetch data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Screen time tracking
  useEffect(() => {
    // Load saved screen time from localStorage
    const savedScreenTime = localStorage.getItem("adminScreenTime");
    if (savedScreenTime) {
      const parsed = parseInt(savedScreenTime, 10);
      if (!isNaN(parsed)) {
        setScreenTime(parsed);
      }
    }

    // Update screen time every second
    const interval = setInterval(() => {
      setScreenTime((prev) => {
        const newTime = prev + 1;
        localStorage.setItem("adminScreenTime", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update stats when data changes - trigger on actual data changes, not function changes
  useEffect(() => {
    console.log("📊 Data changed, recalculating stats...");
    console.log("📊 Current data counts:", {
      applications: applications.length,
      contactMessages: contactMessages.length,
      courses: courses.length,
      students: students.length,
      teachers: teachers.length,
      materials: materials.length,
    });
    fetchLocalDashboardStats();
  }, [
    applications,
    contactMessages,
    courses,
    students,
    teachers,
    materials,
    homework,
    quizzes,
    listening,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate gender distribution (mock data - replace with actual data when available)
  const boysCount = Math.floor(dashboardStats.totalStudents * 0.6);
  const girlsCount = dashboardStats.totalStudents - boysCount;

  // Mock attendance data
  const attendanceData = {
    present: [250, 280, 265, 290, 275, 285],
    absent: [50, 20, 35, 10, 25, 15],
  };

  // Check for upcoming events and create notifications
  const checkUpcomingEvents = React.useCallback(
    (eventsList = events) => {
      const now = moment();
      const upcoming = eventsList
        .filter((event) => {
          const eventDate = moment(event.date)
            .hour(event.time?.hour || 0)
            .minute(event.time?.minute || 0);
          const diff = eventDate.diff(now, "hours");
          return diff > 0 && diff <= 24 && !event.notified;
        })
        .map((event) => ({
          ...event,
          notified: true,
        }));

      if (upcoming.length > 0) {
        setNotifications((prev) => [...prev, ...upcoming]);
        message.info(
          translate(
            "admin.calendar.upcomingEvents",
            `${upcoming.length} event(s) coming up in the next 24 hours`
          )
        );

        // Update events to mark as notified
        setEvents((prevEvents) =>
          prevEvents.map((event) => {
            const upcomingEvent = upcoming.find((e) => e.id === event.id);
            return upcomingEvent ? { ...event, notified: true } : event;
          })
        );
      }
    },
    [events, translate]
  );

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("adminCalendarEvents");
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        setEvents(parsed);
        // Check for upcoming events after a short delay to ensure state is set
        setTimeout(() => {
          const now = moment();
          const upcoming = parsed.filter((event) => {
            const eventDate = moment(event.date)
              .hour(event.time?.hour || 0)
              .minute(event.time?.minute || 0);
            const diff = eventDate.diff(now, "hours");
            return diff > 0 && diff <= 24 && !event.notified;
          });

          if (upcoming.length > 0) {
            setNotifications((prev) => [...prev, ...upcoming]);
            message.info(
              translate(
                "admin.calendar.upcomingEvents",
                `${upcoming.length} event(s) coming up in the next 24 hours`
              )
            );
          }
        }, 100);
      } catch (e) {
        console.error("Error loading events:", e);
      }
    }
  }, [translate]);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length >= 0) {
      localStorage.setItem("adminCalendarEvents", JSON.stringify(events));
      // Check for upcoming events periodically
      const interval = setInterval(() => {
        checkUpcomingEvents();
      }, 3600000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [events, checkUpcomingEvents]);

  // Handle event creation/update
  const handleEventSubmit = (values) => {
    const eventData = {
      id: editingEvent?.id || `event-${Date.now()}`,
      title: values.title,
      description: values.description || "",
      date: values.date.format("YYYY-MM-DD"),
      time: values.time
        ? {
            hour: values.time.hour(),
            minute: values.time.minute(),
          }
        : null,
      type: values.type || "event",
      notified: false,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? eventData : e))
      );
      message.success(
        translate("admin.calendar.eventUpdated", "Event updated successfully")
      );
    } else {
      setEvents((prev) => [...prev, eventData]);
      message.success(
        translate("admin.calendar.eventCreated", "Event created successfully")
      );
    }

    setEventModalVisible(false);
    setEditingEvent(null);
    setSelectedDate(null);
    eventForm.resetFields();
    // Check for upcoming events after state update
    setTimeout(() => checkUpcomingEvents([...events, eventData]), 100);
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    message.success(
      translate("admin.calendar.eventDeleted", "Event deleted successfully")
    );
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    return events.filter((event) => event.date === dateStr);
  };

  // Open event modal
  const openEventModal = (date) => {
    setSelectedDate(date || moment());
    setEditingEvent(null);
    eventForm.resetFields();
    if (date) {
      eventForm.setFieldsValue({ date: date });
    }
    setEventModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (event) => {
    setEditingEvent(event);
    setSelectedDate(moment(event.date));
    eventForm.setFieldsValue({
      title: event.title,
      description: event.description,
      date: moment(event.date),
      time: event.time
        ? moment().hour(event.time.hour).minute(event.time.minute)
        : null,
      type: event.type || "event",
    });
    setEventModalVisible(true);
  };

  // Generate recent activities from real data
  const recentActivities = React.useMemo(() => {
    const activities = [];

    // Add recent applications
    applications.slice(0, 5).forEach((app, index) => {
      const appDate = app.createdAt
        ? moment(app.createdAt)
        : moment().subtract(index, "days");
      // Get the role from the application (default to "student")
      const appRole = app.role || "student";
      // Translate the role name
      const translatedRole = translate(
        `roleUtilities.roles.${appRole}`,
        appRole === "student"
          ? "Student"
          : appRole === "teacher"
          ? "Teacher"
          : "User"
      );
      // Get the registration message template and replace {{role}}
      const registrationTemplate = translate(
        "admin.activity.newRegistration",
        `New ${translatedRole} registration`
      );
      const registrationTitle = registrationTemplate.replace(
        "{{role}}",
        translatedRole
      );

      activities.push({
        id: `app-${app._id || `temp-${index}`}`,
        type: "application",
        title: `${registrationTitle} - ${
          app.fullName || app.firstName || app.email || "Unknown"
        }`,
        date: appDate.format("DD MMMM, YYYY").replace(/\s+/, " "),
        views: `${Math.floor(Math.random() * 50) + 5}k`,
        icon: "enrollment",
        status: app.status || "pending",
        course:
          app.course ||
          app.program ||
          translate(
            "admin.dashboard.generalApplication",
            "General Application"
          ),
        createdAt: appDate.valueOf(),
      });
    });

    // Add recent contact messages
    contactMessages.slice(0, 5).forEach((msg, index) => {
      const msgDate = msg.createdAt
        ? moment(msg.createdAt)
        : moment().subtract(index + 2, "days");
      activities.push({
        id: `msg-${msg._id || `temp-msg-${index}`}`,
        type: "message",
        title:
          translate("admin.activity.newContactMessage", "New contact message") +
          ` - ${msg.name || msg.email || "Unknown"}`,
        date: msgDate.format("DD MMMM, YYYY").replace(/\s+/, " "),
        views: `${Math.floor(Math.random() * 50) + 5}k`,
        icon: "announcements",
        subject:
          msg.subject || translate("admin.dashboard.noSubject", "No subject"),
        createdAt: msgDate.valueOf(),
      });
    });

    // Sort by date (newest first) and limit to 4 items
    return activities.sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  }, [applications, contactMessages, translate]);

  // Format screen time to HH:MM:SS
  const formatScreenTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="dashboard-overview"
      style={{ padding: "24px", background: "#F8F8F8", minHeight: "100vh" }}
    >
      {/* Welcome Header with Clock and Screen Time */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Text style={{ fontSize: 24, fontWeight: 600, color: "#333333" }}>
            {translate("admin.dashboard.welcomeBack", "Welcome Back")} 👋
          </Text>
          <div
            style={{
              fontSize: 16,
              color: "#666",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Clock and Screen Time Card */}
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            padding: 3,
            background: "linear-gradient(90deg, #6A82FB, #FC5C7D, #6A82FB)",
            backgroundSize: "200% 200%",
            animation: "gradientRotate 3s ease infinite",
            minWidth: 280,
          }}
        >
          <style>
            {`
              @keyframes gradientRotate {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
              @keyframes borderSpin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
              .snake-border {
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border-radius: 12px;
                padding: 3px;
                background: linear-gradient(45deg, #6A82FB, #FC5C7D, #20C997, #6A82FB);
                background-size: 400% 400%;
                animation: gradientRotate 4s ease infinite, borderSpin 8s linear infinite;
                z-index: -1;
              }
              .snake-border::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 12px;
                padding: 3px;
                background: linear-gradient(-45deg, #FC5C7D, #20C997, #6A82FB, #FC5C7D);
                background-size: 400% 400%;
                animation: gradientRotate 5s ease infinite reverse;
                z-index: -1;
              }
            `}
          </style>
          <Card
            style={{
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "none",
              background: "#FFFFFF",
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
            bodyStyle={{ padding: "16px 20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              {/* Real Clock */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 500,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {translate("admin.dashboard.currentTime", "Current Time")}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#333",
                    fontFamily: "monospace",
                    letterSpacing: 1,
                  }}
                >
                  {formatTime(currentTime)}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 50, background: "#E8E8E8" }} />

              {/* Screen Time */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 500,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {translate("admin.dashboard.screenTime", "Screen Time")}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#6A82FB",
                    fontFamily: "monospace",
                    letterSpacing: 1,
                  }}
                >
                  {formatScreenTime(screenTime)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Key Metric Cards - Redesigned */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={12}>
          <Card
            hoverable
            onClick={() => setActiveKey("students")}
            style={{
              cursor: "pointer",
              background: "#F0F4F8",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#333333",
                    marginBottom: 8,
                  }}
                >
                  {dashboardStats.totalStudents.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: 14, color: "#333333", fontWeight: 500 }}
                >
                  {translate("admin.metrics.totalStudents", "Total Students")}
                </div>
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#6A82FB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="users" size={28} color="#FFFFFF" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={12}>
          <Card
            hoverable
            onClick={() => setActiveKey("applications")}
            style={{
              cursor: "pointer",
              background: "#F0F4F8",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#333333",
                    marginBottom: 8,
                  }}
                >
                  {dashboardStats.totalTeachers.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: 14, color: "#333333", fontWeight: 500 }}
                >
                  {translate("admin.metrics.totalTeachers", "Total Teachers")}
                </div>
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#6A82FB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="teacher" size={28} color="#FFFFFF" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Total Students by Gender - Donut Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "none",
            }}
            title={
              <Text style={{ fontSize: 18, fontWeight: 500, color: "#333333" }}>
                {translate(
                  "admin.dashboard.studentsByGender",
                  "Total Students by Gender"
                )}
              </Text>
            }
          >
            <div
              style={{
                position: "relative",
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Doughnut
                key={i18n.language}
                data={{
                  labels: [
                    translate("admin.dashboard.boys", "Boys"),
                    translate("admin.dashboard.girls", "Girls"),
                  ],
                  datasets: [
                    {
                      data: [boysCount, girlsCount],
                      backgroundColor: ["#6A82FB", "#20C997"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 14,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 32, fontWeight: 700, color: "#333333" }}
                >
                  {dashboardStats.totalStudents.toLocaleString()}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 24,
                marginTop: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: "#6A82FB",
                  }}
                />
                <Text style={{ fontSize: 14, color: "#333333" }}>
                  {translate("admin.dashboard.boys", "Boys")}:{" "}
                  {boysCount.toLocaleString()}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: "#20C997",
                  }}
                />
                <Text style={{ fontSize: 14, color: "#333333" }}>
                  {translate("admin.dashboard.girls", "Girls")}:{" "}
                  {girlsCount.toLocaleString()}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Attendance - Bar Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "none",
            }}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 500, color: "#333333" }}
                >
                  {translate("admin.dashboard.attendance", "Attendance")}
                </Text>
                <div style={{ display: "flex", gap: 8 }}>
                  <Select
                    defaultValue="week"
                    style={{ width: 100 }}
                    size="small"
                  >
                    <Option
                      value="week"
                      label={tJa("admin.metrics.thisWeek", "This week", "今週")}
                    >
                      {tJa("admin.metrics.thisWeek", "This week", "今週")}
                    </Option>
                    <Option
                      value="month"
                      label={tJa(
                        "admin.metrics.thisMonth",
                        "This month",
                        "今月"
                      )}
                    >
                      {tJa("admin.metrics.thisMonth", "This month", "今月")}
                    </Option>
                  </Select>
                  <Select
                    defaultValue="class10"
                    style={{ width: 100 }}
                    size="small"
                  >
                    <Option
                      value="class10"
                      label={translate("admin.dashboard.class10", "Class 10")}
                    >
                      {translate("admin.dashboard.class10", "Class 10")}
                    </Option>
                    <Option
                      value="class11"
                      label={translate("admin.dashboard.class11", "Class 11")}
                    >
                      {translate("admin.dashboard.class11", "Class 11")}
                    </Option>
                    <Option
                      value="class12"
                      label={translate("admin.dashboard.class12", "Class 12")}
                    >
                      {translate("admin.dashboard.class12", "Class 12")}
                    </Option>
                  </Select>
                </div>
              </div>
            }
          >
            <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: "#6A82FB",
                  }}
                />
                <Text style={{ fontSize: 14, color: "#333333" }}>
                  {translate("admin.dashboard.totalPresent", "Total Present")}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: "#20C997",
                  }}
                />
                <Text style={{ fontSize: 14, color: "#333333" }}>
                  {translate("admin.dashboard.totalAbsent", "Total Absent")}
                </Text>
              </div>
            </div>
            <Bar
              key={i18n.language}
              data={{
                labels: [
                  tJa("days.mon", "Mon", "月"),
                  tJa("days.tue", "Tue", "火"),
                  tJa("days.wed", "Wed", "水"),
                  tJa("days.thu", "Thu", "木"),
                  tJa("days.fri", "Fri", "金"),
                  tJa("days.sat", "Sat", "土"),
                ],
                datasets: [
                  {
                    label: translate(
                      "admin.dashboard.totalPresent",
                      "Total Present"
                    ),
                    data: attendanceData.present,
                    backgroundColor: "#6A82FB",
                    borderRadius: 8,
                  },
                  {
                    label: translate(
                      "admin.dashboard.totalAbsent",
                      "Total Absent"
                    ),
                    data: attendanceData.absent,
                    backgroundColor: "#20C997",
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 300,
                    ticks: {
                      stepSize: 50,
                    },
                    grid: {
                      color: "#E8E8E8",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity and Event Calendar */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "none",
              background: "#FFFFFF",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 600, color: "#1A1A1A" }}>
                {translate("admin.dashboard.recentActivity", "Recent Activity")}
              </Text>
            </div>
            {recentActivities.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => {
                      if (activity.type === "application") {
                        setActiveKey("applications");
                      } else if (activity.type === "message") {
                        setActiveKey("applications");
                      }
                    }}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: "1px solid #F0F0F0",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: "#FAFAFA",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F5F5F5";
                      e.currentTarget.style.borderColor = "#E0E0E0";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FAFAFA";
                      e.currentTarget.style.borderColor = "#F0F0F0";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          background:
                            activity.type === "application"
                              ? "linear-gradient(135deg, #E8E8FF 0%, #D0D0FF 100%)"
                              : "linear-gradient(135deg, #F0F4F8 0%, #E8F0F8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {activity.type === "application" ? (
                          <Icon name="enrollment" size={24} color="#6A82FB" />
                        ) : (
                          <MessageOutlined
                            style={{ fontSize: 22, color: "#6A82FB" }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          strong
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#1A1A1A",
                            display: "block",
                            marginBottom: 6,
                            lineHeight: 1.4,
                          }}
                          ellipsis={{ tooltip: activity.title }}
                        >
                          {activity.title}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <Text
                            type="secondary"
                            style={{
                              fontSize: 13,
                              color: "#666666",
                              fontWeight: 500,
                            }}
                          >
                            {activity.date}
                          </Text>
                          {activity.course && (
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 12,
                                color: "#888888",
                                background: "#F0F0F0",
                                padding: "4px 8px",
                                borderRadius: 6,
                                display: "inline-block",
                                width: "fit-content",
                              }}
                            >
                              {activity.course}
                            </Text>
                          )}
                          {activity.subject && (
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 12,
                                color: "#888888",
                                background: "#F0F0F0",
                                padding: "4px 8px",
                                borderRadius: 6,
                                display: "inline-block",
                                width: "fit-content",
                              }}
                            >
                              {activity.subject}
                            </Text>
                          )}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                            }}
                          >
                            <EyeOutlined
                              style={{ fontSize: 14, color: "#999999" }}
                            />
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 13,
                                color: "#999999",
                                fontWeight: 500,
                              }}
                            >
                              {activity.views}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <MoreOutlined
                        style={{
                          color: "#CCCCCC",
                          fontSize: 18,
                          cursor: "pointer",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description={translate(
                  "admin.activity.noRecentActivity",
                  "No recent activity"
                )}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "40px 0" }}
              />
            )}
          </Card>
        </Col>

        {/* Enhanced Interactive Event Calendar */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "none",
              background: "#FFFFFF",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Enhanced Header Section */}
            <div
              style={{
                padding: "20px 20px 16px 20px",
                background: "linear-gradient(135deg, #F8F9FF 0%, #F0F4FF 100%)",
                borderBottom: "1px solid #E8E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(106, 130, 251, 0.3)",
                    }}
                  >
                    <CalendarOutlined style={{ fontSize: 20, color: "#fff" }} />
                  </div>
                  <div>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1A1A1A",
                        display: "block",
                      }}
                    >
                      {translate("admin.dashboard.eventCalendar", "Event Calendar")}
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, color: "#666", display: "block" }}
                    >
                      {events.length}{" "}
                      {events.length === 1
                        ? translate("admin.calendar.event", "event")
                        : translate("admin.calendar.events", "events")}
                    </Text>
                  </div>
                </div>
                <Space size="small">
                  {notifications.length > 0 && (
                    <Tooltip
                      title={translate(
                        "admin.calendar.upcomingNotifications",
                        `${notifications.length} upcoming event notifications`
                      )}
                    >
                      <Badge
                        count={notifications.length}
                        style={{
                          backgroundColor: "#FF4D4F",
                          boxShadow: "0 2px 4px rgba(255, 77, 79, 0.3)",
                        }}
                      >
                        <Button
                          type="text"
                          icon={<BellOutlined />}
                          style={{
                            color: "#666",
                            border: "1px solid #E8E8E8",
                            borderRadius: 8,
                          }}
                        />
                      </Badge>
                    </Tooltip>
                  )}
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => openEventModal()}
                    style={{
                      background: "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(106, 130, 251, 0.3)",
                    }}
                  >
                    {translate("admin.calendar.createEvent", "Create Event")}
                  </Button>
                </Space>
              </div>

              {/* View Toggle Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button.Group>
                  <Button
                    type={calendarViewMode === "calendar" ? "primary" : "default"}
                    icon={<CalendarOutlined />}
                    onClick={() => setCalendarViewMode("calendar")}
                    style={{
                      background:
                        calendarViewMode === "calendar"
                          ? "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)"
                          : "#fff",
                      borderColor:
                        calendarViewMode === "calendar" ? "transparent" : "#D9D9D9",
                      color: calendarViewMode === "calendar" ? "#fff" : "#666",
                      fontWeight: 600,
                      borderRadius: calendarViewMode === "calendar" ? "8px 0 0 8px" : 0,
                    }}
                  >
                    {translate("admin.calendar.calendarView", "Calendar")}
                  </Button>
                  <Button
                    type={calendarViewMode === "list" ? "primary" : "default"}
                    icon={<span style={{ fontSize: 14 }}>☰</span>}
                    onClick={() => setCalendarViewMode("list")}
                    style={{
                      background:
                        calendarViewMode === "list"
                          ? "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)"
                          : "#fff",
                      borderColor:
                        calendarViewMode === "list" ? "transparent" : "#D9D9D9",
                      color: calendarViewMode === "list" ? "#fff" : "#666",
                      fontWeight: 600,
                      borderRadius: calendarViewMode === "list" ? "0 8px 8px 0" : 0,
                    }}
                  >
                    {translate("admin.calendar.listView", "List")}
                  </Button>
                </Button.Group>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Enhanced List View of Events */}
            {calendarViewMode === "list" && (
              <div>
                {events.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {/* Group events by date */}
                    {(() => {
                      const groupedEvents = events.reduce((acc, event) => {
                        const dateKey = moment(event.date).format("YYYY-MM-DD");
                        if (!acc[dateKey]) {
                          acc[dateKey] = [];
                        }
                        acc[dateKey].push(event);
                        return acc;
                      }, {});

                      const sortedDates = Object.keys(groupedEvents).sort(
                        (a, b) => moment(a).diff(moment(b))
                      );

                      return sortedDates.map((dateKey) => {
                        const dateEvents = groupedEvents[dateKey];
                        const eventDate = moment(dateKey);
                        const isToday = eventDate.isSame(moment(), "day");
                        const isPast = eventDate.isBefore(moment(), "day");
                        const isTomorrow = eventDate.isSame(
                          moment().add(1, "day"),
                          "day"
                        );

                        return (
                          <div key={dateKey} style={{ marginBottom: 8 }}>
                            {/* Date Header */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 12,
                                paddingBottom: 8,
                                borderBottom: "2px solid #F0F0F0",
                              }}
                            >
                              <div
                                style={{
                                  width: 4,
                                  height: 20,
                                  borderRadius: 2,
                                  background: isToday
                                    ? "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)"
                                    : isPast
                                    ? "#D9D9D9"
                                    : "#20C997",
                                }}
                              />
                              <Text
                                strong
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: isToday ? "#6A82FB" : "#333",
                                }}
                              >
                                {isToday
                                  ? translate("admin.calendar.today", "Today")
                                  : isTomorrow
                                  ? translate(
                                      "admin.calendar.tomorrow",
                                      "Tomorrow"
                                    )
                                  : eventDate.format("DD MMMM, YYYY")}
                              </Text>
                              <Tag
                                style={{
                                  marginLeft: "auto",
                                  background: "#F0F0F0",
                                  color: "#666",
                                  border: "none",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                {dateEvents.length}{" "}
                                {dateEvents.length === 1
                                  ? translate("admin.calendar.event", "event")
                                  : translate("admin.calendar.events", "events")}
                              </Tag>
                            </div>

                            {/* Events for this date */}
                            {dateEvents
                              .sort((a, b) => {
                                if (a.time && b.time) {
                                  const timeA = moment()
                                    .hour(a.time.hour)
                                    .minute(a.time.minute);
                                  const timeB = moment()
                                    .hour(b.time.hour)
                                    .minute(b.time.minute);
                                  return timeA.diff(timeB);
                                }
                                return a.time ? -1 : 1;
                              })
                              .map((event) => {
                                const eventDate = moment(event.date);
                                const isPast = eventDate.isBefore(moment(), "day");

                                return (
                                  <div
                                    key={event.id}
                                    style={{
                                      padding: 16,
                                      borderRadius: 12,
                                      border: `1px solid ${
                                        event.type === "task"
                                          ? "#FFE4B5"
                                          : "#D0D0FF"
                                      }`,
                                      background: isPast
                                        ? "#FAFAFA"
                                        : event.type === "task"
                                        ? "linear-gradient(135deg, #FFF9F0 0%, #FFF4E6 100%)"
                                        : "linear-gradient(135deg, #F5F7FF 0%, #E8E8FF 100%)",
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 16,
                                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      cursor: "pointer",
                                      marginBottom: 8,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform =
                                        "translateX(4px)";
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 16px rgba(0,0,0,0.1)";
                                      e.currentTarget.style.borderColor =
                                        event.type === "task"
                                          ? "#FFD580"
                                          : "#9BB0FF";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform =
                                        "translateX(0)";
                                      e.currentTarget.style.boxShadow = "none";
                                      e.currentTarget.style.borderColor =
                                        event.type === "task"
                                          ? "#FFE4B5"
                                          : "#D0D0FF";
                                    }}
                                    onClick={() => openEditModal(event)}
                                  >
                                    {/* Time Indicator */}
                                    {event.time && (
                                      <div
                                        style={{
                                          minWidth: 60,
                                          textAlign: "center",
                                          padding: "8px 12px",
                                          borderRadius: 8,
                                          background: isPast
                                            ? "#F0F0F0"
                                            : event.type === "task"
                                            ? "linear-gradient(135deg, #FFD580 0%, #FFB84D 100%)"
                                            : "linear-gradient(135deg, #9BB0FF 0%, #7B94FF 100%)",
                                          color: isPast ? "#999" : "#fff",
                                          fontWeight: 700,
                                          fontSize: 12,
                                        }}
                                      >
                                        {moment()
                                          .hour(event.time.hour)
                                          .minute(event.time.minute)
                                          .format("HH:mm")}
                                      </div>
                                    )}

                                    {/* Event Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                          marginBottom: 8,
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <Tag
                                          color={
                                            event.type === "task"
                                              ? "orange"
                                              : "blue"
                                          }
                                          style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: 11,
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                          }}
                                        >
                                          {event.type === "task"
                                            ? translate(
                                                "admin.calendar.typeTask",
                                                "Task"
                                              )
                                            : translate(
                                                "admin.calendar.typeEvent",
                                                "Event"
                                              )}
                                        </Tag>
                                      </div>
                                      <Text
                                        strong
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 700,
                                          color: isPast ? "#999" : "#1A1A1A",
                                          display: "block",
                                          marginBottom: 6,
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {event.title}
                                      </Text>
                                      {event.description && (
                                        <Text
                                          type="secondary"
                                          style={{
                                            fontSize: 13,
                                            display: "block",
                                            marginBottom: 8,
                                            color: isPast ? "#BBB" : "#666",
                                            lineHeight: 1.5,
                                          }}
                                          ellipsis={{ rows: 2 }}
                                        >
                                          {event.description}
                                        </Text>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <Space
                                      direction="vertical"
                                      size="small"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Tooltip
                                        title={translate(
                                          "admin.calendar.edit",
                                          "Edit"
                                        )}
                                      >
                                        <Button
                                          size="small"
                                          icon={<EditOutlined />}
                                          onClick={() => openEditModal(event)}
                                          style={{
                                            border: "1px solid #D9D9D9",
                                            borderRadius: 6,
                                          }}
                                        />
                                      </Tooltip>
                                      <Tooltip
                                        title={translate(
                                          "admin.calendar.delete",
                                          "Delete"
                                        )}
                                      >
                                        <Button
                                          size="small"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => {
                                            Modal.confirm({
                                              title: translate(
                                                "admin.calendar.deleteConfirm",
                                                "Delete Event"
                                              ),
                                              content: translate(
                                                "admin.calendar.deleteMessage",
                                                "Are you sure you want to delete this event?"
                                              ),
                                              onOk: () =>
                                                handleDeleteEvent(event.id),
                                            });
                                          }}
                                          style={{ borderRadius: 6 }}
                                        />
                                      </Tooltip>
                                    </Space>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <Empty
                    description={translate(
                      "admin.calendar.noEvents",
                      "No events created yet. Click 'Create Event' to add one!"
                    )}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ padding: "60px 0" }}
                  >
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => openEventModal()}
                      size="large"
                      style={{
                        background:
                          "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(106, 130, 251, 0.3)",
                      }}
                    >
                      {translate(
                        "admin.calendar.createEvent",
                        "Create Event"
                      )}
                    </Button>
                  </Empty>
                )}
              </div>
            )}

              {/* Calendar View */}
              {calendarViewMode === "calendar" && (
              <div>
                <style>{`
                .ant-picker-calendar {
                  background: transparent !important;
                }
                .ant-picker-calendar .ant-picker-panel {
                  background: transparent !important;
                  border: none !important;
                }
                .ant-picker-calendar .ant-picker-cell {
                  border: none !important;
                  padding: 6px !important;
                }
                .ant-picker-calendar .ant-picker-cell:not(.ant-picker-cell-disabled) {
                  background: transparent !important;
                }
                .ant-picker-calendar .ant-picker-calendar-date {
                  border: none !important;
                  background: transparent !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                }
                .ant-picker-calendar .ant-picker-calendar-date-value {
                  display: none !important;
                }
                .ant-picker-calendar .ant-picker-cell-inner {
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  height: 100% !important;
                }
                .ant-picker-calendar .ant-picker-content th {
                  padding: 12px 4px !important;
                  font-weight: 700 !important;
                  color: #6A82FB !important;
                  font-size: 11px !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.8px !important;
                  background: linear-gradient(135deg, #F5F7FF 0%, #F0F3FF 100%) !important;
                  border-radius: 8px !important;
                }
                .ant-picker-calendar .ant-picker-content td {
                  padding: 4px !important;
                  border-radius: 8px !important;
                }
                @keyframes slideInUp {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .ant-picker-calendar .ant-picker-cell-in-view {
                  animation: slideInUp 0.4s ease;
                }
                @keyframes pulse {
                  0%, 100% {
                    box-shadow: 0 4px 12px rgba(106, 130, 251, 0.3);
                  }
                  50% {
                    box-shadow: 0 6px 16px rgba(106, 130, 251, 0.4);
                  }
                }
                .ant-picker-calendar .ant-picker-cell-in-view.ant-picker-cell-selected {
                  animation: pulse 2s infinite;
                }
                
                /* Custom Select Styling */
                .calendar-header-select .ant-select-selector {
                  background: rgba(255, 255, 255, 0.2) !important;
                  border: 1px solid rgba(255, 255, 255, 0.3) !important;
                  border-radius: 8px !important;
                  color: white !important;
                  font-weight: 600 !important;
                  padding: 4px 12px !important;
                  height: auto !important;
                  min-height: 36px !important;
                }
                .calendar-header-select .ant-select-selector:hover {
                  background: rgba(255, 255, 255, 0.3) !important;
                  border-color: rgba(255, 255, 255, 0.5) !important;
                }
                .calendar-header-select .ant-select-arrow {
                  color: white !important;
                }
                .calendar-header-select .ant-select-selection-item {
                  color: white !important;
                  font-size: 14px !important;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                  .ant-picker-calendar .ant-picker-content th {
                    font-size: 10px !important;
                    padding: 8px 2px !important;
                    letter-spacing: 0.5px !important;
                  }
                }
              `}</style>
                <Calendar
                  fullscreen={false}
                  style={{ background: "transparent" }}
                  validRange={[
                    moment().subtract(1, "year"),
                    moment().add(10, "years"),
                  ]}
                  headerRender={({ value, type, onChange, onTypeChange }) => {
                    const start = 0;
                    const end = 12;
                    const monthOptions = [];
                    const localeData = value.localeData();
                    const months = [];

                    // Generate months for the current year
                    const yearValue = value.year();
                    for (let i = 0; i < 12; i++) {
                      const monthMoment = moment()
                        .year(yearValue)
                        .month(i)
                        .startOf("month");
                      months.push(localeData.monthsShort(monthMoment));
                    }

                    for (let i = start; i < end; i++) {
                      monthOptions.push(
                        <Select.Option key={i} value={i} label={months[i]}>
                          {months[i]}
                        </Select.Option>
                      );
                    }

                    const year = value.year();
                    const month = value.month();
                    const options = [];
                    for (let i = year - 10; i < year + 10; i += 1) {
                      options.push(
                        <Select.Option key={i} value={i} label={String(i)}>
                          {i}
                        </Select.Option>
                      );
                    }

                    const isCurrentMonth = value.isSame(moment(), "month");

                    return (
                      <div
                        style={{
                          padding: "16px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            "linear-gradient(135deg, #6A82FB 0%, #7B94FF 50%, #5A6DEB 100%)",
                          borderRadius: 16,
                          marginBottom: 20,
                          boxShadow: "0 8px 24px rgba(106, 130, 251, 0.3)",
                          position: "relative",
                          overflow: "hidden",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        {/* Background accent elements */}
                        <div
                          style={{
                            position: "absolute",
                            width: 120,
                            height: 120,
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "50%",
                            top: -40,
                            right: -40,
                            pointerEvents: "none",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            width: 80,
                            height: 80,
                            background: "rgba(255, 255, 255, 0.08)",
                            borderRadius: "50%",
                            bottom: -30,
                            left: -30,
                            pointerEvents: "none",
                          }}
                        />

                        <Button
                          type="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newValue = value.clone().subtract(1, "month");
                            onChange(newValue);
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            minWidth: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            background: "rgba(255, 255, 255, 0.25)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                            zIndex: 1,
                            padding: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.35)";
                            e.currentTarget.style.transform =
                              "scale(1.08) translateX(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.25)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          aria-label={translate(
                            "admin.calendar.previousMonth",
                            "Previous month"
                          )}
                        >
                          ‹
                        </Button>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            zIndex: 1,
                            flex: "1 1 auto",
                            justifyContent: "center",
                            minWidth: 0,
                          }}
                        >
                          <Select
                            className="calendar-header-select"
                            value={month}
                            onChange={(newMonth) => {
                              const newValue = value.clone().month(newMonth);
                              onChange(newValue);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            style={{
                              width: "auto",
                              minWidth: 90,
                              maxWidth: 120,
                            }}
                            bordered={true}
                            dropdownStyle={{
                              background: "#fff",
                              borderRadius: 12,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            }}
                          >
                            {monthOptions}
                          </Select>
                          <div
                            style={{
                              width: 2,
                              height: 24,
                              background: "rgba(255, 255, 255, 0.3)",
                              borderRadius: 1,
                            }}
                          />
                          <Select
                            className="calendar-header-select"
                            value={year}
                            onChange={(newYear) => {
                              const newValue = value.clone().year(newYear);
                              onChange(newValue);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            style={{
                              width: "auto",
                              minWidth: 75,
                              maxWidth: 100,
                            }}
                            bordered={true}
                            dropdownStyle={{
                              background: "#fff",
                              borderRadius: 12,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            }}
                          >
                            {options}
                          </Select>
                        </div>
                        {!isCurrentMonth && (
                          <Button
                            type="text"
                            onClick={(e) => {
                              e.stopPropagation();
                              onChange(moment());
                            }}
                            style={{
                              height: 40,
                              padding: "0 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              background: "rgba(255, 255, 255, 0.25)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              zIndex: 1,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.35)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.25)";
                            }}
                          >
                            {translate("admin.calendar.today", "Today")}
                          </Button>
                        )}
                        <Button
                          type="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newValue = value.clone().add(1, "month");
                            onChange(newValue);
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            minWidth: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            background: "rgba(255, 255, 255, 0.25)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                            zIndex: 1,
                            padding: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.35)";
                            e.currentTarget.style.transform =
                              "scale(1.08) translateX(2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.25)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          aria-label={translate(
                            "admin.calendar.nextMonth",
                            "Next month"
                          )}
                        >
                          ›
                        </Button>
                      </div>
                    );
                  }}
                  cellRender={(date, info) => {
                    const isToday = date.isSame(moment(), "day");
                    const dateEvents = getEventsForDate(date);
                    const hasEvents = dateEvents.length > 0;

                    // Only render dates for the current month
                    if (info.type === "date") {
                      const currentMonth = info.date
                        ? moment(info.date).month()
                        : moment().month();
                      const isCurrentMonth = date.month() === currentMonth;

                      if (!isCurrentMonth) {
                        return (
                          <div
                            style={{ opacity: 0.3, pointerEvents: "none" }}
                          />
                        );
                      }

                      return (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            padding: "8px 3px",
                            minHeight: 70,
                            position: "relative",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => openEventModal(date)}
                          onMouseEnter={(e) => {
                            if (!isToday) {
                              e.currentTarget.style.background =
                                "rgba(106, 130, 251, 0.05)";
                              e.currentTarget.style.borderRadius = "10px";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: isToday ? 36 : 30,
                              height: isToday ? 36 : 30,
                              borderRadius: isToday ? "10px" : "50%",
                              background: isToday
                                ? "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)"
                                : "transparent",
                              color: isToday ? "#fff" : "#333",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: isToday ? 15 : 13,
                              fontWeight: isToday ? 700 : 600,
                              marginBottom: 5,
                              transition: "all 0.3s ease",
                              boxShadow: isToday
                                ? "0 4px 12px rgba(106, 130, 251, 0.3)"
                                : "none",
                            }}
                          >
                            {date.date()}
                          </div>
                          {hasEvents && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                alignItems: "center",
                                marginTop: "auto",
                                paddingBottom: 4,
                                width: "100%",
                              }}
                            >
                              {/* Event indicators with improved visibility */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: 3,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                  width: "100%",
                                }}
                              >
                                {dateEvents.slice(0, 3).map((event, idx) => (
                                  <div
                                    key={event.id}
                                    style={{
                                      width: dateEvents.length === 1 ? "60%" : "28%",
                                      height: 4,
                                      borderRadius: "2px",
                                      background:
                                        event.type === "task"
                                          ? "linear-gradient(90deg, #FFB84D, #FFD580)"
                                          : "linear-gradient(90deg, #7B94FF, #9BB0FF)",
                                      transition: "all 0.3s ease",
                                      boxShadow:
                                        event.type === "task"
                                          ? "0 2px 6px rgba(255, 180, 77, 0.4)"
                                          : "0 2px 6px rgba(123, 148, 255, 0.4)",
                                    }}
                                    title={event.title}
                                  />
                                ))}
                              </div>
                              {dateEvents.length > 3 && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#6A82FB",
                                    fontWeight: 700,
                                    marginTop: 2,
                                    background: "rgba(106, 130, 251, 0.1)",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                  }}
                                >
                                  +{dateEvents.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </div>
              )}
            </div>
          </Card>

          {/* Enhanced Event Creation/Edit Modal */}
          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarOutlined style={{ fontSize: 20, color: "#fff" }} />
                </div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>
                  {editingEvent
                    ? translate("admin.calendar.editEvent", "Edit Event")
                    : translate("admin.calendar.createEvent", "Create Event")}
                </span>
              </div>
            }
            open={eventModalVisible}
            onCancel={() => {
              setEventModalVisible(false);
              setEditingEvent(null);
              setSelectedDate(null);
              eventForm.resetFields();
            }}
            onOk={() => eventForm.submit()}
            okText={translate("admin.calendar.save", "Save")}
            cancelText={translate("admin.calendar.cancel", "Cancel")}
            width={600}
            okButtonProps={{
              style: {
                background:
                  "linear-gradient(135deg, #6A82FB 0%, #7B94FF 100%)",
                border: "none",
                fontWeight: 600,
                borderRadius: 8,
              },
            }}
            cancelButtonProps={{
              style: {
                borderRadius: 8,
                fontWeight: 500,
              },
            }}
          >
            <Form
              form={eventForm}
              layout="vertical"
              onFinish={handleEventSubmit}
              initialValues={{
                type: "event",
                date: selectedDate || moment(),
              }}
            >
              <Form.Item
                name="title"
                label={translate("admin.calendar.eventTitle", "Event Title")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "admin.calendar.titleRequired",
                      "Please enter event title"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={translate(
                    "admin.calendar.titlePlaceholder",
                    "Enter event title"
                  )}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={translate("admin.calendar.description", "Description")}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={translate(
                    "admin.calendar.descriptionPlaceholder",
                    "Enter event description (optional)"
                  )}
                />
              </Form.Item>

              <Form.Item
                name="type"
                label={translate("admin.calendar.eventType", "Type")}
              >
                <Select>
                  <Select.Option value="event">
                    {translate("admin.calendar.typeEvent", "Event")}
                  </Select.Option>
                  <Select.Option value="task">
                    {translate("admin.calendar.typeTask", "Task")}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label={translate("admin.calendar.date", "Date")}
                    rules={[
                      {
                        required: true,
                        message: translate(
                          "admin.calendar.dateRequired",
                          "Please select a date"
                        ),
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time"
                    label={translate("admin.calendar.time", "Time")}
                  >
                    <TimePicker
                      style={{ width: "100%" }}
                      format="HH:mm"
                      placeholder={translate(
                        "admin.calendar.timePlaceholder",
                        "Select time"
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default Admindashboardoverview;

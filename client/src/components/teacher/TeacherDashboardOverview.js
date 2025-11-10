import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Timeline,
  Empty,
  Select,
  Tag,
  Table,
  Calendar,
  List,
  Badge,
  DatePicker,
  Modal,
  Input,
  message,
  Divider,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  FileOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  BellOutlined,
  TrophyOutlined,
  LoadingOutlined,
  DashboardOutlined,
  SoundOutlined,
  CalendarOutlined,
  RiseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Sun,
  CloudRain,
  Wind,
  Cloud,
  CloudDrizzle,
  Snowflake,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  courseAPI,
  materialAPI,
  quizAPI,
  homeworkAPI,
  progressAPI,
  announcementAPI,
} from "../../utils/apiClient";
import { ensureTeacherMaterialsTranslations } from "../../utils/teacherMaterialsTranslations";
import { ensureTeacherMyClassesTranslations } from "../../utils/teacherMyClassesTranslations";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const getTimeAgo = (timestamp, t) => {
  if (!timestamp) {
    return t("teacherDashboard.overview.justNow", { defaultValue: "Just now" });
  }
  const now = new Date();
  const past = new Date(timestamp);
  if (Number.isNaN(past.getTime())) {
    return t("teacherDashboard.overview.justNow", { defaultValue: "Just now" });
  }
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) {
    return t("teacherDashboard.overview.justNow", { defaultValue: "Just now" });
  }
  if (diffMins < 60) {
    return t("teacherDashboard.overview.minutesAgo", {
      defaultValue: "{{count}} min ago",
      count: diffMins,
    });
  }
  if (diffHours < 24) {
    return diffHours === 1
      ? t("teacherDashboard.overview.hourAgo", { defaultValue: "1 hour ago" })
      : t("teacherDashboard.overview.hoursAgo", {
          defaultValue: "{{count}} hours ago",
          count: diffHours,
        });
  }
  if (diffDays === 1) {
    return t("teacherDashboard.overview.yesterday", {
      defaultValue: "Yesterday",
    });
  }
  if (diffDays < 7) {
    return t("teacherDashboard.overview.daysAgo", {
      defaultValue: "{{count}} days ago",
      count: diffDays,
    });
  }
  return past.toLocaleDateString();
};

const formatCurrency = (value, locale = undefined, currency = "JPY") => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch (error) {
    return value != null ? `${value}` : "0";
  }
};

const TeacherDashboardOverview = ({
  t,
  setActiveKey,
  currentUser,
  isMobile,
}) => {
  const { i18n } = useTranslation();
  ensureTeacherMaterialsTranslations(i18n);
  ensureTeacherMyClassesTranslations(i18n);
  const [dashboardStats, setDashboardStats] = useState({
    myCourses: 0,
    myStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    avgClassPerformance: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
  });
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString()
  );
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(() => new Date());
  const [taskCategory, setTaskCategory] = useState("custom");
  const dismissedTaskIdsRef = useRef(new Set());
  const [customTasks, setCustomTasks] = useState([]);
  const [weather, setWeather] = useState({
    temperature: null,
    windSpeed: null,
    humidity: null,
    weatherCode: null,
    description: null,
    category: "sunny",
    isRaining: false,
    isDay: true,
    isLoading: true,
    error: null,
    location: t("teacherDashboard.overview.weather.loading", {
      defaultValue: "Loading...",
    }),
  });

  useEffect(() => {
    ensureTeacherMaterialsTranslations(i18n);
  }, [i18n]);

  const teacherId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.teacherId;

  const teacherCourses = useMemo(() => {
    if (!courses || courses.length === 0) {
      return [];
    }
    if (!teacherId) {
      return courses;
    }
    return courses.filter(
      (course) =>
        course.teacherId === teacherId ||
        course.teacher === teacherId ||
        course.instructorId === teacherId
    );
  }, [courses, teacherId]);

  const teacherCourseIdSet = useMemo(() => {
    const ids = new Set();
    teacherCourses.forEach((course) => {
      if (!course) return;
      const identifier =
        course._id || course.id || course.courseId || course.code;
      const normalized = identifier != null ? String(identifier) : null;
      if (normalized) {
        ids.add(normalized);
      }
    });
    return ids;
  }, [teacherCourses]);

  const getMaterialCourseId = useCallback((material) => {
    if (!material) return null;
    if (material.course && typeof material.course === "object") {
      return (
        material.course._id ||
        material.course.id ||
        material.course.courseId ||
        material.course.code
      );
    }
    if (typeof material.course === "string") {
      return material.course;
    }
    if (material.courseId && typeof material.courseId === "object") {
      return (
        material.courseId._id ||
        material.courseId.id ||
        material.courseId.courseId ||
        material.courseId.code
      );
    }
    if (typeof material.courseId === "string") {
      return material.courseId;
    }
    return null;
  }, []);

  const teacherMaterials = useMemo(() => {
    if (!materials || materials.length === 0) {
      return [];
    }
    if (!teacherId && teacherCourseIdSet.size === 0) {
      return materials;
    }
    return materials.filter((material) => {
      const matchesTeacher =
        teacherId &&
        (material.teacherId === teacherId ||
          material.teacher === teacherId ||
          material.ownerId === teacherId);
      const courseId = getMaterialCourseId(material);
      const normalizedCourseId = courseId != null ? String(courseId) : null;
      const matchesCourse = normalizedCourseId
        ? teacherCourseIdSet.has(normalizedCourseId)
        : false;
      return matchesTeacher || matchesCourse;
    });
  }, [materials, teacherId, teacherCourseIdSet, getMaterialCourseId]);

  const isMobileView =
    typeof isMobile === "boolean" ? isMobile : viewport.isMobile;
  const isTabletView = viewport.isTablet;
  const isCompactView = isMobileView || isTabletView;

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      setViewport({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1200,
      });
    };
    updateViewport();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateViewport);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateViewport);
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const precipitationCodes = new Set([
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
    ]);

    const buildWeatherDictionary = () => ({
      0: {
        label: t("teacherDashboard.overview.weather.clear", {
          defaultValue: "Clear sky",
        }),
        category: "sunny",
      },
      1: {
        label: t("teacherDashboard.overview.weather.mainlyClear", {
          defaultValue: "Mainly clear",
        }),
        category: "sunny",
      },
      2: {
        label: t("teacherDashboard.overview.weather.partlyCloudy", {
          defaultValue: "Partly cloudy",
        }),
        category: "cloudy",
      },
      3: {
        label: t("teacherDashboard.overview.weather.overcast", {
          defaultValue: "Overcast",
        }),
        category: "cloudy",
      },
      45: {
        label: t("teacherDashboard.overview.weather.fog", {
          defaultValue: "Fog",
        }),
        category: "cloudy",
      },
      48: {
        label: t("teacherDashboard.overview.weather.fog", {
          defaultValue: "Fog",
        }),
        category: "cloudy",
      },
      51: {
        label: t("teacherDashboard.overview.weather.drizzleLight", {
          defaultValue: "Light drizzle",
        }),
        category: "drizzle",
      },
      53: {
        label: t("teacherDashboard.overview.weather.drizzle", {
          defaultValue: "Drizzle",
        }),
        category: "drizzle",
      },
      55: {
        label: t("teacherDashboard.overview.weather.drizzleDense", {
          defaultValue: "Dense drizzle",
        }),
        category: "drizzle",
      },
      56: {
        label: t("teacherDashboard.overview.weather.freezingDrizzle", {
          defaultValue: "Freezing drizzle",
        }),
        category: "drizzle",
      },
      57: {
        label: t("teacherDashboard.overview.weather.freezingDrizzle", {
          defaultValue: "Freezing drizzle",
        }),
        category: "drizzle",
      },
      61: {
        label: t("teacherDashboard.overview.weather.rainLight", {
          defaultValue: "Light rain",
        }),
        category: "rain",
      },
      63: {
        label: t("teacherDashboard.overview.weather.rain", {
          defaultValue: "Rain",
        }),
        category: "rain",
      },
      65: {
        label: t("teacherDashboard.overview.weather.rainHeavy", {
          defaultValue: "Heavy rain",
        }),
        category: "rain",
      },
      66: {
        label: t("teacherDashboard.overview.weather.freezingRain", {
          defaultValue: "Freezing rain",
        }),
        category: "rain",
      },
      67: {
        label: t("teacherDashboard.overview.weather.freezingRain", {
          defaultValue: "Freezing rain",
        }),
        category: "rain",
      },
      71: {
        label: t("teacherDashboard.overview.weather.snowLight", {
          defaultValue: "Light snow",
        }),
        category: "snow",
      },
      73: {
        label: t("teacherDashboard.overview.weather.snow", {
          defaultValue: "Snow",
        }),
        category: "snow",
      },
      75: {
        label: t("teacherDashboard.overview.weather.snowHeavy", {
          defaultValue: "Heavy snow",
        }),
        category: "snow",
      },
      77: {
        label: t("teacherDashboard.overview.weather.snow", {
          defaultValue: "Snow",
        }),
        category: "snow",
      },
      80: {
        label: t("teacherDashboard.overview.weather.showers", {
          defaultValue: "Rain showers",
        }),
        category: "rain",
      },
      81: {
        label: t("teacherDashboard.overview.weather.showers", {
          defaultValue: "Rain showers",
        }),
        category: "rain",
      },
      82: {
        label: t("teacherDashboard.overview.weather.showersHeavy", {
          defaultValue: "Heavy rain showers",
        }),
        category: "rain",
      },
      95: {
        label: t("teacherDashboard.overview.weather.thunderstorm", {
          defaultValue: "Thunderstorm",
        }),
        category: "storm",
      },
      96: {
        label: t("teacherDashboard.overview.weather.thunderstorm", {
          defaultValue: "Thunderstorm",
        }),
        category: "storm",
      },
      99: {
        label: t("teacherDashboard.overview.weather.thunderstorm", {
          defaultValue: "Thunderstorm",
        }),
        category: "storm",
      },
    });

    const storeCoordinates = ({ latitude, longitude }) => {
      try {
        localStorage.setItem(
          "teacherDashboardLocation",
          JSON.stringify({ latitude, longitude })
        );
      } catch (error) {
        // ignore storage failure
      }
    };

    const resolveCoordinates = () => {
      const defaultCoords = { latitude: 37.9162, longitude: 139.0364 };
      if (currentUser?.location) {
        const { location } = currentUser;
        if (
          Array.isArray(location?.coordinates) &&
          location.coordinates.length >= 2
        ) {
          const latitude = Number(location.coordinates[1]);
          const longitude = Number(location.coordinates[0]);
          if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
            return { latitude, longitude };
          }
        }
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);
        if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
          return { latitude, longitude };
        }
      }
      try {
        const stored = JSON.parse(
          localStorage.getItem("teacherDashboardLocation") || "null"
        );
        if (
          stored &&
          typeof stored.latitude === "number" &&
          typeof stored.longitude === "number"
        ) {
          return stored;
        }
      } catch (error) {
        // ignore parsing errors
      }
      return defaultCoords;
    };

    const fetchLocationName = async (latitude, longitude) => {
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const response = await fetch(geoUrl, { signal: controller.signal });
        if (!response.ok) return null;
        const data = await response.json();
        return (
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          t("teacherDashboard.overview.weather.defaultLocation", {
            defaultValue: "Niigata",
          })
        );
      } catch (error) {
        return null;
      }
    };

    const fetchWeather = async () => {
      const weatherErrorMessage = t(
        "teacherDashboard.overview.weather.errorMessage",
        { defaultValue: "Weather data is currently unavailable." }
      );
      try {
        setWeather((prev) => ({ ...prev, isLoading: true, error: null }));
        const { latitude, longitude } = resolveCoordinates();
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&timezone=auto`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(weatherErrorMessage);
        }
        const data = await response.json();
        const current = data?.current;
        if (!current) {
          throw new Error(weatherErrorMessage);
        }
        storeCoordinates({ latitude, longitude });
        const locationName =
          (await fetchLocationName(latitude, longitude)) || weather.location;
        const dictionary = buildWeatherDictionary();
        const descriptionEntry = dictionary[current.weather_code] || {
          label: t("teacherDashboard.overview.weather.unknown", {
            defaultValue: "Weather update",
          }),
          category: "sunny",
        };
        setWeather({
          temperature:
            typeof current.temperature_2m === "number"
              ? Math.round(current.temperature_2m)
              : null,
          windSpeed:
            typeof current.wind_speed_10m === "number"
              ? Math.round(current.wind_speed_10m)
              : null,
          humidity:
            typeof current.relative_humidity_2m === "number"
              ? current.relative_humidity_2m
              : null,
          weatherCode: current.weather_code,
          description: descriptionEntry.label,
          category: descriptionEntry.category,
          isRaining: precipitationCodes.has(current.weather_code),
          isDay: current.is_day === 1,
          isLoading: false,
          error: null,
          location: locationName,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Teacher dashboard weather error", error);
        setWeather((prev) => ({
          ...prev,
          isLoading: false,
          error: weatherErrorMessage,
        }));
      }
    };

    fetchWeather();
    const interval = window.setInterval(fetchWeather, 600000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [currentUser, t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          coursesRes,
          materialsRes,
          quizzesRes,
          homeworksRes,
          progressRes,
          announcementsRes,
        ] = await Promise.all([
          courseAPI.getAll(),
          materialAPI.getAll(),
          quizAPI.getAll(),
          homeworkAPI.getAll(),
          progressAPI.getAll(),
          announcementAPI.getAll(),
        ]);

        console.log("🔍 Raw API Responses:", {
          courses: coursesRes,
          materials: materialsRes,
          quizzes: quizzesRes,
          homeworks: homeworksRes,
          progress: progressRes,
          announcements: announcementsRes,
        });

        // Handle courses - can be direct array or wrapped object
        const coursesData = Array.isArray(coursesRes)
          ? coursesRes
          : coursesRes?.courses || coursesRes?.data || [];
        setCourses(coursesData);
        console.log("📊 Courses set:", coursesData.length);

        // Handle materials - can be direct array or wrapped object
        const materialsData = Array.isArray(materialsRes)
          ? materialsRes
          : materialsRes?.materials || materialsRes?.data || [];
        setMaterials(materialsData);
        console.log("📚 Materials set:", materialsData.length);

        // Handle quizzes - can be direct array or wrapped object
        const quizzesData = Array.isArray(quizzesRes)
          ? quizzesRes
          : quizzesRes?.quizzes || quizzesRes?.data || [];
        setQuizzes(quizzesData);
        console.log("❓ Quizzes set:", quizzesData.length);

        // Handle homeworks - can be direct array or wrapped object
        const homeworksData = Array.isArray(homeworksRes)
          ? homeworksRes
          : homeworksRes?.homeworks || homeworksRes?.data || [];
        setHomeworks(homeworksData);
        console.log("📝 Homeworks set:", homeworksData.length);

        // Handle progress - can be direct array or wrapped object
        const progressData = Array.isArray(progressRes)
          ? progressRes
          : progressRes?.progress || progressRes?.data || [];
        setProgressRecords(progressData);
        console.log("📈 Progress records set:", progressData.length);

        // Handle announcements - can be direct array or wrapped object
        const announcementsData = Array.isArray(announcementsRes)
          ? announcementsRes
          : announcementsRes?.announcements || announcementsRes?.data || [];
        setAnnouncements(announcementsData);
        console.log("📢 Announcements set:", announcementsData.length);
      } catch (error) {
        console.error("Teacher dashboard fetch error", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("🔄 Stats Calculation - Input Data:", {
      teacherId,
      coursesCount: courses.length,
      teacherCoursesCount: teacherCourses.length,
      materialsCount: materials.length,
      teacherMaterialsCount: teacherMaterials.length,
      quizzesCount: quizzes.length,
      homeworksCount: homeworks.length,
    });

    const scopedCourses = teacherCourses.length > 0 ? teacherCourses : courses;
    console.log("📚 Scoped courses:", scopedCourses.length, scopedCourses);

    const studentMap = new Map();
    scopedCourses.forEach((course) => {
      if (Array.isArray(course?.students)) {
        course.students.forEach((student) => {
          if (!student) return;
          if (typeof student === "string") {
            if (!studentMap.has(student)) {
              studentMap.set(student, { id: student });
            }
          } else {
            const key = student._id || student.id || student.email;
            if (!studentMap.has(key)) {
              studentMap.set(key, student);
            }
          }
        });
      }
    });

    const globalStudentSet = new Set();
    courses.forEach((course) => {
      if (Array.isArray(course?.students)) {
        course.students.forEach((student) => {
          if (!student) return;
          if (typeof student === "string") {
            globalStudentSet.add(student);
          } else {
            globalStudentSet.add(
              student._id || student.id || student.email || student.name
            );
          }
        });
      }
    });

    setStudents(Array.from(studentMap.values()));
    console.log("👥 Students:", {
      teacherStudents: studentMap.size,
      globalStudents: globalStudentSet.size,
      studentsList: Array.from(studentMap.values()),
    });

    const scopedMaterials =
      teacherMaterials.length > 0 ? teacherMaterials : materials;
    const teacherQuizzes = teacherId
      ? quizzes.filter(
          (quiz) =>
            quiz.teacherId === teacherId ||
            quiz.teacher === teacherId ||
            quiz.ownerId === teacherId
        )
      : quizzes;
    const teacherHomeworks = teacherId
      ? homeworks.filter(
          (hw) =>
            hw.teacherId === teacherId ||
            hw.teacher === teacherId ||
            hw.ownerId === teacherId
        )
      : homeworks;

    const pendingSubmissions = teacherHomeworks.reduce((total, homework) => {
      if (Array.isArray(homework?.submissions)) {
        const ungraded = homework.submissions.filter(
          (submission) =>
            !submission?.grade &&
            !submission?.isGraded &&
            submission?.status !== "graded"
        );
        return total + ungraded.length;
      }
      return total;
    }, 0);

    const globalPendingSubmissions = homeworks.reduce((total, homework) => {
      if (Array.isArray(homework?.submissions)) {
        const ungraded = homework.submissions.filter(
          (submission) =>
            !submission?.grade &&
            !submission?.isGraded &&
            submission?.status !== "graded"
        );
        return total + ungraded.length;
      }
      return total;
    }, 0);

    let averageScore = 0;
    let totalScore = 0;
    let totalAttempts = 0;

    teacherQuizzes.forEach((quiz) => {
      if (Array.isArray(quiz?.submissions)) {
        quiz.submissions.forEach((submission) => {
          if (typeof submission?.score === "number") {
            totalScore += submission.score;
            totalAttempts += 1;
          }
        });
      }
    });

    if (totalAttempts > 0) {
      averageScore = Math.round((totalScore / totalAttempts) * 10) / 10;
    }

    const activeTeacherQuizzes = teacherQuizzes.filter(
      (quiz) => quiz.isActive !== false && quiz.status !== "inactive"
    ).length;
    const activeGlobalQuizzes = quizzes.filter(
      (quiz) => quiz.isActive !== false && quiz.status !== "inactive"
    ).length;

    const stats = {
      myCourses: scopedCourses.length || courses.length || 0,
      myStudents: studentMap.size || globalStudentSet.size || 0,
      totalMaterials: scopedMaterials.length || materials.length,
      pendingSubmissions: pendingSubmissions || globalPendingSubmissions,
      activeQuizzes: activeTeacherQuizzes || activeGlobalQuizzes,
      avgClassPerformance: averageScore,
    };

    console.log("📊 Dashboard Stats Updated:", stats);
    setDashboardStats(stats);
  }, [
    courses,
    materials,
    quizzes,
    homeworks,
    teacherCourses,
    teacherMaterials,
    teacherId,
  ]);

  useEffect(() => {
    const activityList = [];

    progressRecords.forEach((record) => {
      const type = record.assignmentType;
      const timestamp =
        record.updatedAt || record.submittedDate || record.createdAt;
      if (!timestamp) return;

      if (type === "quiz") {
        activityList.push({
          type: "quiz_submission",
          studentName: record.studentName,
          description: record.courseName,
          timestamp,
          color: "green",
        });
      } else if (type === "homework") {
        activityList.push({
          type: "homework_submission",
          studentName: record.studentName,
          description: record.courseName,
          timestamp,
          color: "blue",
        });
      }
    });

    materials.slice(0, 8).forEach((material) => {
      if (!material.createdAt) return;
      activityList.push({
        type: "material_uploaded",
        materialTitle: material.title,
        description: material.courseName || material.courseId,
        timestamp: material.createdAt,
        color: "purple",
      });
    });

    announcements.slice(0, 8).forEach((announcement) => {
      if (!announcement.createdAt) return;
      activityList.push({
        type: "announcement",
        title: announcement.title,
        description:
          announcement.courseName ||
          t("teacherDashboard.overview.general", { defaultValue: "General" }),
        timestamp: announcement.createdAt,
        color: "orange",
      });
    });

    activityList.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setRecentActivities(activityList.slice(0, 8));
  }, [progressRecords, materials, announcements, t]);

  const navigateTo = (key) => {
    if (typeof setActiveKey === "function") {
      setActiveKey(key);
    }
  };

  const theme = useMemo(
    () => ({
      pageBg: "#edf1f9",
      surface: "#ffffff",
      textPrimary: "#1f1f2e",
      textSecondary: "#6b6f80",
      accentPrimary: "#7c3aed",
      accentSecondary: "#a855f7",
      accentSoft: "#ede9fe",
      success: "#16a34a",
      warning: "#f97316",
      cyan: "#22d3ee",
    }),
    []
  );

  const layoutPadding = isMobileView ? "16px" : isTabletView ? "24px" : "32px";
  const sectionGap = isMobileView ? 18 : 26;
  const mainCardPadding = isMobileView ? 18 : isTabletView ? 22 : 26;
  const sideCardPadding = isMobileView ? 18 : isTabletView ? 22 : 24;

  const progressPercent = Math.min(
    100,
    Math.round(dashboardStats.avgClassPerformance || 0)
  );
  const completedAssignments = homeworks.filter(
    (hw) => hw.status === "completed" || hw.status === "graded"
  ).length;
  const assignmentPercent =
    homeworks.length > 0
      ? Math.round((completedAssignments / homeworks.length) * 100)
      : 0;

  const topMetrics = useMemo(
    () => [
      {
        key: "classes",
        icon: BookOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.myClasses", {
          defaultValue: "My Classes",
        }),
        value: dashboardStats.myCourses,
        accent: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
      },
      {
        key: "materials",
        icon: FileOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.materials", {
          defaultValue: "Materials",
        }),
        value: dashboardStats.totalMaterials,
        accent: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
      },
      {
        key: "quizzes",
        icon: QuestionCircleOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.quizManagement", {
          defaultValue: "Quiz Management",
        }),
        value: dashboardStats.activeQuizzes,
        accent: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
      },
      {
        key: "assignments",
        icon: ClockCircleOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.assignmentCenter", {
          defaultValue: "Assignment Center",
        }),
        value: dashboardStats.pendingSubmissions,
        accent: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      },
      {
        key: "students",
        icon: TeamOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.studentManagement", {
          defaultValue: "Student Management",
        }),
        value: dashboardStats.myStudents,
        accent: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      },
      {
        key: "analytics",
        icon: DashboardOutlined,
        iconStyle: { fontSize: 24, color: "#ffffff" },
        label: t("teacherDashboard.overview.analyticsSettings", {
          defaultValue: "Analytics & Settings",
        }),
        value: `${progressPercent}%`,
        accent: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      },
    ],
    [dashboardStats, progressPercent, t]
  );

  const performanceTrend = useMemo(() => {
    const trendMap = new Map();

    const pushEntry = (timestamp, dataUpdater) => {
      if (!timestamp) return;
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return;
      const dayKey = date.toISOString().split("T")[0];
      if (!trendMap.has(dayKey)) {
        trendMap.set(dayKey, {
          key: dayKey,
          label: date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          students: 0,
          staff: 0,
          studentSamples: 0,
          staffSamples: 0,
        });
      }
      const entry = trendMap.get(dayKey);
      dataUpdater(entry);
    };

    progressRecords.forEach((record) => {
      const value =
        typeof record.score === "number"
          ? record.score
          : typeof record.progress === "number"
          ? record.progress
          : null;
      if (value == null) return;
      pushEntry(
        record.submittedDate || record.updatedAt || record.createdAt,
        (entry) => {
          entry.students += value;
          entry.studentSamples += 1;
        }
      );
    });

    quizzes.forEach((quiz) => {
      const submissions = Array.isArray(quiz.submissions)
        ? quiz.submissions.length
        : 0;
      if (submissions === 0) return;
      pushEntry(quiz.updatedAt || quiz.createdAt, (entry) => {
        entry.staff += submissions;
        entry.staffSamples += 1;
      });
    });

    const data = Array.from(trendMap.values())
      .sort((a, b) => new Date(a.key).getTime() - new Date(b.key).getTime())
      .slice(-7)
      .map((entry) => ({
        label: entry.label,
        students:
          entry.studentSamples > 0
            ? Math.round((entry.students / entry.studentSamples) * 10) / 10
            : 0,
        staff:
          entry.staffSamples > 0
            ? Math.round((entry.staff / entry.staffSamples) * 10) / 10
            : 0,
      }));

    if (data.length === 0) {
      const defaultDayLabels = {
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
      };
      const fallbackDays = ["mon", "tue", "wed", "thu", "fri"];
      return fallbackDays.map((dayKey) => ({
        label: t(`teacherDashboard.overview.daysShort.${dayKey}`, {
          defaultValue: defaultDayLabels[dayKey],
        }),
        students: 0,
        staff: 0,
      }));
    }

    return data;
  }, [progressRecords, quizzes, t]);

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const upcomingEvents = useMemo(() => {
    const events = [];

    homeworks.forEach((homework) => {
      const due = parseDate(
        homework.dueDate || homework.deadline || homework.endDate
      );
      if (due && due >= today) {
        events.push({
          id: homework._id || homework.id,
          title:
            homework.title ||
            homework.name ||
            t("teacherDashboard.overview.untitledHomework", {
              defaultValue: "Homework",
            }),
          date: due,
          type: "assignment",
          actionKey: "assignments",
        });
      }
    });

    quizzes.forEach((quiz) => {
      const due = parseDate(
        quiz.availableUntil || quiz.dueDate || quiz.deadline
      );
      if (due && due >= today) {
        events.push({
          id: quiz._id || quiz.id,
          title:
            quiz.title ||
            quiz.name ||
            t("teacherDashboard.overview.untitledQuiz", {
              defaultValue: "Quiz",
            }),
          date: due,
          type: "quiz",
          actionKey: "quizzes",
        });
      }
    });

    announcements.forEach((announcement) => {
      const date = parseDate(
        announcement.publishDate || announcement.createdAt
      );
      if (date && date >= today) {
        events.push({
          id: announcement._id || announcement.id,
          title:
            announcement.title ||
            t("teacherDashboard.overview.untitledAnnouncement", {
              defaultValue: "Announcement",
            }),
          date,
          type: "announcement",
          actionKey: "overview",
        });
      }
    });

    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    return events.slice(0, 6);
  }, [homeworks, quizzes, announcements, today, t]);

  const calendarEventsByDate = useMemo(() => {
    const map = {};
    [...upcomingEvents, ...customTasks].forEach((event) => {
      const key = event.date.toISOString().split("T")[0];
      map[key] = map[key] || [];
      map[key].push(event);
    });
    return map;
  }, [upcomingEvents, customTasks]);

  const visibleTasks = useMemo(
    () =>
      [...customTasks, ...upcomingEvents]
        .filter((event) => !dismissedTaskIdsRef.current.has(event.id))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [customTasks, upcomingEvents]
  );

  const upcomingTaskList = useMemo(
    () => visibleTasks.slice(0, 6),
    [visibleTasks]
  );

  const renderCalendarCell = useCallback(
    (value) => {
      const dateKey = value.format("YYYY-MM-DD");
      const dayEvents = calendarEventsByDate[dateKey];
      if (!dayEvents || dayEvents.length === 0) {
        return null;
      }
      return (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {dayEvents.map((event) => (
            <li key={`${event.id}-${event.type}`}>
              <Badge
                status={
                  event.type === "assignment"
                    ? "warning"
                    : event.type === "quiz"
                    ? "processing"
                    : event.type === "custom"
                    ? "success"
                    : "default"
                }
                text={event.title}
              />
            </li>
          ))}
        </ul>
      );
    },
    [calendarEventsByDate]
  );

  const handleAddTask = useCallback(() => {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      message.warning(
        t("teacherDashboard.overview.tasks.emptyTitle", {
          defaultValue: "Please enter a task title",
        })
      );
      return;
    }
    const newTask = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      type: taskCategory,
      date: taskDate instanceof Date ? taskDate : new Date(taskDate),
      actionKey: "overview",
      isTask: true,
    };
    setCustomTasks((prev) => [...prev, newTask]);
    setTaskTitle("");
    setTaskCategory("custom");
    setTaskDate(new Date());
    setTaskModalVisible(false);
  }, [taskTitle, taskCategory, taskDate, t]);

  const handleDismissTask = useCallback((id) => {
    dismissedTaskIdsRef.current.add(id);
    setCustomTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const assignmentsColumns = useMemo(
    () => [
      {
        title: t("teacherDashboard.overview.tableSrNo", {
          defaultValue: "Sr. No",
        }),
        dataIndex: "index",
        key: "index",
        width: 70,
        align: "center",
      },
      {
        title: t("teacherDashboard.overview.tableAssignment", {
          defaultValue: "Assignment",
        }),
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <Space direction="vertical" size={2}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.course ||
                t("teacherDashboard.overview.general", {
                  defaultValue: "General",
                })}
            </Text>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.overview.tableFees", {
          defaultValue: "Fees",
        }),
        dataIndex: "amount",
        key: "amount",
        render: (value) => formatCurrency(value),
        width: 130,
      },
      {
        title: t("teacherDashboard.overview.tableDue", { defaultValue: "Due" }),
        dataIndex: "due",
        key: "due",
        width: 140,
      },
      {
        title: t("teacherDashboard.overview.tableStatus", {
          defaultValue: "Status",
        }),
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status) => (
          <Tag
            color={
              status === "completed"
                ? "success"
                : status === "pending"
                ? "warning"
                : "default"
            }
          >
            {status
              ? t(`teacherDashboard.status.${status}`, { defaultValue: status })
              : "-"}
          </Tag>
        ),
      },
    ],
    [t]
  );

  const assignmentsData = useMemo(() => {
    const courseIndex = new Map();
    courses.forEach((course) => {
      courseIndex.set(course._id || course.id, course.title || course.name);
    });

    return homeworks.slice(0, 6).map((homework, index) => {
      const due = parseDate(
        homework.dueDate || homework.deadline || homework.endDate
      );
      const courseName =
        homework.courseName ||
        courseIndex.get(homework.courseId || homework.course) ||
        t("teacherDashboard.overview.general", { defaultValue: "General" });

      return {
        key: homework._id || homework.id || index,
        index: index + 1,
        title:
          homework.title ||
          homework.name ||
          t("teacherDashboard.overview.untitledHomework", {
            defaultValue: "Homework",
          }),
        course: courseName,
        amount: homework.fee || homework.amount || homework.price || 0,
        due: due
          ? due.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "-",
      };
    });
  }, [homeworks, courses, t]);

  // Helper function to format event dates
  const formatEventDate = (date) =>
    date
      ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : "-";

  const actionableInsights = useMemo(() => {
    const insights = [];
    const assignmentsCount = assignmentsData.length;

    if (dashboardStats.pendingSubmissions > 0) {
      insights.push({
        key: "pendingReviews",
        title: t(
          "teacherDashboard.overview.actionCenter.items.pendingReviews.title",
          {
            defaultValue: "Grade pending submissions",
            count: dashboardStats.pendingSubmissions,
          }
        ),
        description: t(
          "teacherDashboard.overview.actionCenter.items.pendingReviews.description",
          {
            defaultValue:
              "You have {{count}} assignments waiting for feedback.",
            count: dashboardStats.pendingSubmissions,
          }
        ),
        icon: ClockCircleOutlined,
        accent: "#6366f1",
        actionKey: "grading",
      });
    }

    if (dashboardStats.activeQuizzes === 0) {
      insights.push({
        key: "createQuiz",
        title: t(
          "teacherDashboard.overview.actionCenter.items.createQuiz.title",
          {
            defaultValue: "Launch a new quiz",
          }
        ),
        description: t(
          "teacherDashboard.overview.actionCenter.items.createQuiz.description",
          {
            defaultValue:
              "Keep momentum by scheduling a quick knowledge check for your classes.",
          }
        ),
        icon: QuestionCircleOutlined,
        accent: "#f97316",
        actionKey: "quizzes",
      });
    }

    if (assignmentsCount === 0) {
      insights.push({
        key: "planAssignment",
        title: t(
          "teacherDashboard.overview.actionCenter.items.planAssignment.title",
          {
            defaultValue: "Plan the next assignment",
          }
        ),
        description: t(
          "teacherDashboard.overview.actionCenter.items.planAssignment.description",
          {
            defaultValue:
              "Create a fresh assignment to reinforce this week’s lessons.",
          }
        ),
        icon: FileOutlined,
        accent: "#22c55e",
        actionKey: "assignments",
      });
    }

    if (upcomingEvents.length === 0) {
      insights.push({
        key: "scheduleEvent",
        title: t(
          "teacherDashboard.overview.actionCenter.items.scheduleEvent.title",
          {
            defaultValue: "Schedule an upcoming milestone",
          }
        ),
        description: t(
          "teacherDashboard.overview.actionCenter.items.scheduleEvent.description",
          {
            defaultValue:
              "Add an event or reminder so students stay aligned with your plan.",
          }
        ),
        icon: CalendarOutlined,
        accent: "#0ea5e9",
        actionKey: "overview",
      });
    }

    upcomingEvents.forEach((event) => {
      insights.push({
        key: `event-${event.id}-${event.type}`,
        title: event.title,
        description: `${t("teacherDashboard.overview.dueOn", {
          defaultValue: "Due on",
        })} ${formatEventDate(event.date)}`,
        icon:
          event.type === "assignment"
            ? FileOutlined
            : event.type === "quiz"
            ? QuestionCircleOutlined
            : CalendarOutlined,
        accent:
          event.type === "assignment"
            ? "#f59e0b"
            : event.type === "quiz"
            ? "#6366f1"
            : "#0ea5e9",
        actionKey: event.actionKey,
      });
    });

    if (insights.length === 0) {
      insights.push({
        key: "celebrate",
        title: t(
          "teacherDashboard.overview.actionCenter.items.celebrate.title",
          {
            defaultValue: "Great job staying organized!",
          }
        ),
        description: t(
          "teacherDashboard.overview.actionCenter.items.celebrate.description",
          {
            defaultValue:
              "No urgent tasks right now. Use the time to explore analytics or share new resources.",
          }
        ),
        icon: BarChartOutlined,
        accent: "#a855f7",
        actionKey: "analytics",
      });
    }

    return insights.slice(0, 6);
  }, [
    assignmentsData,
    dashboardStats.activeQuizzes,
    dashboardStats.pendingSubmissions,
    t,
    upcomingEvents,
  ]);

  const monthNames = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        new Date(2000, index).toLocaleString(undefined, { month: "long" })
      ),
    []
  );

  const selectedMonthNumber =
    selectedMonth === "all" ? null : Number(selectedMonth);

  const performerMap = useMemo(() => {
    const map = new Map();

    progressRecords.forEach((record) => {
      const name =
        record.studentName ||
        t("teacherDashboard.overview.unknownStudent", {
          defaultValue: "Student",
        });
      if (!map.has(name)) {
        map.set(name, {
          name,
          courses: new Set(),
          assignments: 0,
          scoreSum: 0,
          scoreCount: 0,
          lastActivity: null,
        });
      }
      const entry = map.get(name);
      entry.assignments += 1;
      if (record.courseName) {
        entry.courses.add(record.courseName);
      }
      if (typeof record.score === "number") {
        entry.scoreSum += record.score;
        entry.scoreCount += 1;
      } else if (typeof record.progress === "number") {
        entry.scoreSum += record.progress;
        entry.scoreCount += 1;
      }
      const timestamp = new Date(
        record.submittedDate || record.updatedAt || record.createdAt
      );
      if (!Number.isNaN(timestamp.getTime())) {
        entry.lastActivity = entry.lastActivity
          ? Math.max(entry.lastActivity, timestamp.getTime())
          : timestamp.getTime();
      }
    });

    return Array.from(map.values()).map((entry) => ({
      name: entry.name,
      courses: entry.courses.size,
      assignments: entry.assignments,
      averageScore:
        entry.scoreCount > 0 ? entry.scoreSum / entry.scoreCount : 0,
      lastActivity: entry.lastActivity ? new Date(entry.lastActivity) : null,
    }));
  }, [progressRecords, t]);

  const filteredPerformers = performerMap
    .filter((performer) => {
      if (selectedMonthNumber === null) return true;
      if (!performer.lastActivity) return false;
      return performer.lastActivity.getMonth() === selectedMonthNumber;
    })
    .sort((a, b) => {
      if (b.averageScore !== a.averageScore)
        return b.averageScore - a.averageScore;
      if (b.assignments !== a.assignments) return b.assignments - a.assignments;
      return b.courses - a.courses;
    });

  const bestPerformers = filteredPerformers;

  const renderWeatherIcon = () => {
    if (weather.isLoading) {
      return <LoadingOutlined style={{ fontSize: 48, color: "#ffffff" }} />;
    }
    const iconProps = { size: 48, color: "#ffffff", strokeWidth: 1.5 };
    switch (weather.category) {
      case "rain":
      case "storm":
        return <CloudRain {...iconProps} />;
      case "drizzle":
        return <CloudDrizzle {...iconProps} />;
      case "snow":
        return <Snowflake {...iconProps} />;
      case "cloudy":
        return <Cloud {...iconProps} />;
      default:
        return weather.isDay ? (
          <Sun {...iconProps} />
        ) : (
          <Cloud {...iconProps} />
        );
    }
  };

  const materialDisplaySource = useMemo(
    () => (teacherMaterials.length > 0 ? teacherMaterials : materials),
    [teacherMaterials, materials]
  );

  const latestMaterials = useMemo(() => {
    if (!materialDisplaySource || materialDisplaySource.length === 0) {
      return [];
    }
    return [...materialDisplaySource]
      .sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
          new Date(a?.updatedAt || a?.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [materialDisplaySource]);

  const resolveMaterialCourseName = useCallback(
    (material) => {
      if (!material) return "";
      if (material.course && typeof material.course === "object") {
        return (
          material.course.title ||
          material.course.name ||
          material.course.courseName ||
          material.course.code ||
          ""
        );
      }
      if (typeof material.course === "string") {
        const match =
          teacherCourses.find(
            (course) =>
              String(
                course._id || course.id || course.courseId || course.code
              ) === String(material.course)
          ) ||
          courses.find(
            (course) =>
              String(
                course._id || course.id || course.courseId || course.code
              ) === String(material.course)
          );
        return match?.title || match?.name || match?.code || material.course;
      }
      if (material.courseName) {
        return material.courseName;
      }
      const courseId = getMaterialCourseId(material);
      if (!courseId) return "";
      const match =
        teacherCourses.find(
          (course) =>
            String(
              course._id || course.id || course.courseId || course.code
            ) === String(courseId)
        ) ||
        courses.find(
          (course) =>
            String(
              course._id || course.id || course.courseId || course.code
            ) === String(courseId)
        );
      return match?.title || match?.name || match?.code || "";
    },
    [courses, teacherCourses, getMaterialCourseId]
  );

  const getMaterialCategoryLabel = useCallback(
    (category) => {
      const normalized = category || "other";
      const fallback = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      return t(`teacherMaterials.category.${normalized}`, {
        defaultValue: fallback,
      });
    },
    [t]
  );

  const formatMaterialTime = useCallback(
    (value) =>
      value
        ? getTimeAgo(value, t)
        : t("teacherDashboard.overview.notAvailable", {
            defaultValue: "Not available",
          }),
    [t]
  );

  const quickActions = [
    {
      key: "materials",
      icon: FileOutlined,
      label: t("teacherDashboard.overview.uploadMaterial", {
        defaultValue: "Upload material",
      }),
      description: t("teacherDashboard.overview.quickActionUpload", {
        defaultValue: "Share new resources instantly",
      }),
      actionKey: "materials",
      color: theme.accentPrimary,
    },
    {
      key: "quizzes",
      icon: QuestionCircleOutlined,
      label: t("teacherDashboard.overview.createQuiz", {
        defaultValue: "Create a quiz",
      }),
      description: t("teacherDashboard.overview.quickActionQuiz", {
        defaultValue: "Assess class understanding",
      }),
      actionKey: "quizzes",
      color: "#f97316",
    },
    {
      key: "assignments",
      icon: FileOutlined,
      label: t("teacherDashboard.overview.assignHomework", {
        defaultValue: "Assign homework",
      }),
      description: t("teacherDashboard.overview.quickActionAssignment", {
        defaultValue: "Plan meaningful practice",
      }),
      actionKey: "assignments",
      color: "#10b981",
    },
    {
      key: "analytics",
      icon: BarChartOutlined,
      label: t("teacherDashboard.overview.viewAnalytics", {
        defaultValue: "View analytics",
      }),
      description: t("teacherDashboard.overview.quickActionAnalytics", {
        defaultValue: "Track class progress",
      }),
      actionKey: "analytics",
      color: "#0ea5e9",
    },
  ];

  const teacherGreeting = (() => {
    const firstName =
      currentUser?.firstName ||
      currentUser?.name ||
      t("teacherDashboard.overview.teacher", { defaultValue: "Teacher" });
    const lastName = currentUser?.lastName ? ` ${currentUser.lastName}` : "";
    return `${firstName}${lastName}`.trim();
  })();

  const calendarState = (() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.toLocaleString(undefined, { month: "long" }),
      weekday: now.toLocaleString(undefined, { weekday: "long" }),
      year: now.getFullYear(),
    };
  })();

  const weatherDetail =
    weather.humidity != null
      ? `${t("teacherDashboard.overview.weather.humidity", {
          defaultValue: "Humidity",
        })}: ${weather.humidity}%`
      : t("teacherDashboard.overview.weather.noData", {
          defaultValue: "Live weather",
        });

  return (
    <Layout
      className="teacher-dashboard-layout"
      style={{ minHeight: "100vh", background: theme.pageBg }}
    >
      <Content
        className="teacher-dashboard-content"
        style={{ padding: layoutPadding, maxWidth: 1440, margin: "0 auto" }}
      >
        <div
          className="tdo-wrapper"
          style={{ display: "flex", flexDirection: "column", gap: sectionGap }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card
                variant="borderless"
                style={{
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  borderRadius: isCompactView ? 24 : 28,
                  overflow: "hidden",
                  boxShadow: "0 32px 48px rgba(79, 70, 229, 0.35)",
                }}
                styles={{ body: { padding: isMobileView ? 24 : 36 } }}
              >
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={16}>
                    <Space
                      direction="vertical"
                      size={16}
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: 0.85,
                        }}
                      >
                        {t("teacherDashboard.overview.welcomeBack", {
                          defaultValue: "WELCOME BACK",
                        })}
                      </div>
                      <Title
                        level={isMobileView ? 3 : 2}
                        style={{ color: "#ffffff", margin: 0 }}
                      >
                        {t("teacherDashboard.overview.heroGreeting", {
                          defaultValue: "{{name}} 👋",
                          name: teacherGreeting,
                        })}
                      </Title>
                      <Text
                        style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}
                      >
                        {t("teacherDashboard.overview.heroDescription", {
                          defaultValue:
                            "Review attendance patterns, keep tabs on assignments, and guide your classes to success.",
                        })}
                      </Text>
                      <Space wrap size={12}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => navigateTo("classes")}
                          style={{
                            background: "#ffffff",
                            color: theme.accentPrimary,
                            border: "none",
                            borderRadius: 12,
                            fontWeight: 600,
                            padding: "0 28px",
                          }}
                        >
                          {t("teacherDashboard.overview.heroButton", {
                            defaultValue: "Go to classes",
                          })}
                        </Button>
                        <Button
                          size="large"
                          ghost
                          onClick={() => navigateTo("analytics")}
                          style={{
                            borderColor: "rgba(255,255,255,0.65)",
                            color: "#ffffff",
                            borderRadius: 12,
                            padding: "0 28px",
                          }}
                        >
                          {t("teacherDashboard.overview.heroSecondary", {
                            defaultValue: "View analytics",
                          })}
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card
                      variant="borderless"
                      style={{
                        borderRadius: 24,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#ffffff",
                        backdropFilter: "blur(16px)",
                      }}
                      styles={{ body: { padding: 20 } }}
                    >
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Text
                              style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 12,
                                letterSpacing: 1,
                              }}
                            >
                              {t("teacherDashboard.overview.weather.today", {
                                defaultValue: "Today",
                              })}
                            </Text>
                            <div style={{ fontSize: 36, fontWeight: 700 }}>
                              {weather.temperature != null
                                ? `${weather.temperature}°C`
                                : "-"}
                            </div>
                          </div>
                          <div>{renderWeatherIcon()}</div>
                        </div>
                        <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                          {weather.description}
                        </Text>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 12,
                          }}
                        >
                          {weatherDetail}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Space size={8}>
                            <Wind size={16} color="rgba(255,255,255,0.8)" />
                            <Text
                              style={{
                                color: "rgba(255,255,255,0.8)",
                                fontSize: 12,
                              }}
                            >
                              {t("teacherDashboard.overview.weather.wind", {
                                defaultValue: "Wind",
                              })}
                              :{" "}
                              {weather.windSpeed != null
                                ? `${weather.windSpeed} km/h`
                                : "-"}
                            </Text>
                          </Space>
                          <Tag
                            color={weather.isRaining ? "#60a5fa" : "#a855f7"}
                            style={{
                              borderColor: "transparent",
                              color: "#fff",
                            }}
                          >
                            {weather.location}
                          </Tag>
                        </div>
                        {weather.error && (
                          <Text
                            type="secondary"
                            style={{ fontSize: 11, color: "#fcd34d" }}
                          >
                            {weather.error}
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {topMetrics.map((metric) => (
              <Col key={metric.key} xs={12} sm={8} md={8} lg={8} xl={8}>
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: 18,
                    color: "#ffffff",
                    background: metric.accent,
                    boxShadow: "0 14px 24px rgba(30, 64, 175, 0.18)",
                    minHeight: isMobileView ? 108 : 96,
                  }}
                  styles={{ body: { padding: isMobileView ? 14 : 18 } }}
                >
                  <Space
                    size={10}
                    direction="vertical"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 15,
                          background: "rgba(255,255,255,0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {React.createElement(metric.icon, {
                          style: metric.iconStyle,
                        })}
                      </div>
                      <Tag
                        color="rgba(255,255,255,0.3)"
                        style={{ borderColor: "transparent", color: "#ffffff" }}
                      >
                        {t("teacherDashboard.overview.today", {
                          defaultValue: "Today",
                        })}
                      </Tag>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: metric.isCurrency
                            ? 20
                            : isMobileView
                            ? 24
                            : 26,
                          fontWeight: 700,
                        }}
                      >
                        {metric.value}
                      </div>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 12,
                        }}
                      >
                        {metric.label}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 24]}>
            <Col
              xs={24}
              xl={16}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: sectionGap,
              }}
            >
              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: mainCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <BarChartOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.attendanceOverview", {
                        defaultValue: "Calendar & tasks",
                      })}
                    </Text>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <div
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(148,163,184,0.15)",
                        background: "#f8faff",
                        padding: 12,
                      }}
                    >
                      <Calendar
                        fullscreen={false}
                        cellRender={renderCalendarCell}
                        headerRender={({ value, onChange }) => {
                          const current = value.clone();
                          const monthOptions = Array.from(
                            { length: 12 },
                            (_, index) => ({
                              label: current.clone().month(index).format("MMM"),
                              value: index,
                            })
                          );
                          const year = current.year();
                          const yearOptions = Array.from(
                            { length: 5 },
                            (_, index) => {
                              const targetYear = year - 2 + index;
                              return {
                                label: String(targetYear),
                                value: targetYear,
                              };
                            }
                          );
                          return (
                            <Space
                              style={{
                                padding: "8px 12px",
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ color: theme.textPrimary }}>
                                {value.format("MMMM YYYY")}
                              </Text>
                              <Space>
                                <Select
                                  size="small"
                                  value={value.month()}
                                  options={monthOptions}
                                  onChange={(month) => {
                                    const newValue = value.clone();
                                    newValue.month(month);
                                    onChange(newValue);
                                  }}
                                  style={{ width: 100 }}
                                />
                                <Select
                                  size="small"
                                  value={value.year()}
                                  options={yearOptions}
                                  onChange={(yearValue) => {
                                    const newValue = value.clone();
                                    newValue.year(yearValue);
                                    onChange(newValue);
                                  }}
                                  style={{ width: 90 }}
                                />
                              </Space>
                            </Space>
                          );
                        }}
                      />
                    </div>
                    {isMobileView && upcomingTaskList.length === 0 && (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t("teacherDashboard.overview.noUpcoming", {
                          defaultValue: "No upcoming items",
                        })}
                        style={{ marginTop: 24 }}
                      />
                    )}
                    {isMobileView && upcomingTaskList.length > 0 && (
                      <>
                        <Divider style={{ margin: "16px 0" }} />
                        <Space
                          align="center"
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong style={{ color: theme.textPrimary }}>
                            {t("teacherDashboard.overview.upcomingTasks", {
                              defaultValue: "Task calendar",
                            })}
                          </Text>
                          <Tag color="processing">
                            {upcomingTaskList.length}
                          </Tag>
                        </Space>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          block
                          style={{ borderRadius: 12 }}
                          onClick={() => setTaskModalVisible(true)}
                        >
                          {t("teacherDashboard.overview.tasks.add", {
                            defaultValue: "Add task",
                          })}
                        </Button>
                        <List
                          dataSource={upcomingTaskList}
                          renderItem={(item) => (
                            <List.Item
                              style={{ padding: "8px 0" }}
                              actions={
                                item.isTask
                                  ? [
                                      <Button
                                        key="dismiss"
                                        size="small"
                                        type="link"
                                        onClick={() =>
                                          handleDismissTask(item.id)
                                        }
                                      >
                                        {t(
                                          "teacherDashboard.overview.tasks.dismiss",
                                          { defaultValue: "Dismiss" }
                                        )}
                                      </Button>,
                                    ]
                                  : undefined
                              }
                            >
                              <List.Item.Meta
                                title={
                                  <Space size={6}>
                                    <Badge
                                      color={
                                        item.type === "assignment"
                                          ? "#f59e0b"
                                          : item.type === "quiz"
                                          ? "#6366f1"
                                          : item.type === "custom"
                                          ? "#16a34a"
                                          : "#0ea5e9"
                                      }
                                    />
                                    <Text strong>{item.title}</Text>
                                  </Space>
                                }
                                description={
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                    {formatEventDate(item.date)}
                                  </Text>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    )}
                  </Col>
                  {!isMobileView && (
                    <Col xs={24} lg={8}>
                      <Card
                        variant="borderless"
                        style={{
                          borderRadius: 18,
                          height: "100%",
                          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                        }}
                        styles={{
                          body: {
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            height: "100%",
                          },
                        }}
                      >
                        <Space
                          align="center"
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong style={{ color: theme.textPrimary }}>
                            {t("teacherDashboard.overview.upcomingTasks", {
                              defaultValue: "Task calendar",
                            })}
                          </Text>
                          <Tag color="processing">
                            {upcomingTaskList.length}
                          </Tag>
                        </Space>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setTaskModalVisible(true)}
                          style={{ borderRadius: 12 }}
                        >
                          {t("teacherDashboard.overview.tasks.add", {
                            defaultValue: "Add task",
                          })}
                        </Button>
                        {upcomingTaskList.length ? (
                          <List
                            dataSource={upcomingTaskList}
                            renderItem={(item) => (
                              <List.Item
                                style={{ padding: "8px 0" }}
                                actions={
                                  item.isTask
                                    ? [
                                        <Button
                                          key="dismiss"
                                          size="small"
                                          type="link"
                                          onClick={() =>
                                            handleDismissTask(item.id)
                                          }
                                        >
                                          {t(
                                            "teacherDashboard.overview.tasks.dismiss",
                                            { defaultValue: "Dismiss" }
                                          )}
                                        </Button>,
                                      ]
                                    : undefined
                                }
                              >
                                <List.Item.Meta
                                  title={
                                    <Space size={6}>
                                      <Badge
                                        color={
                                          item.type === "assignment"
                                            ? "#f59e0b"
                                            : item.type === "quiz"
                                            ? "#6366f1"
                                            : item.type === "custom"
                                            ? "#16a34a"
                                            : "#0ea5e9"
                                        }
                                      />
                                      <Text strong>{item.title}</Text>
                                    </Space>
                                  }
                                  description={
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      {formatEventDate(item.date)}
                                    </Text>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={t(
                              "teacherDashboard.overview.noUpcoming",
                              { defaultValue: "No upcoming items" }
                            )}
                          />
                        )}
                      </Card>
                    </Col>
                  )}
                </Row>
              </Card>

              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: mainCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <TrophyOutlined style={{ color: theme.accentPrimary }} />
                    <div>
                      <Text strong style={{ color: theme.textPrimary }}>
                        {t("teacherDashboard.overview.actionCenter.title", {
                          defaultValue: "Action center",
                        })}
                      </Text>
                      <div style={{ fontSize: 12, color: theme.textSecondary }}>
                        {t("teacherDashboard.overview.actionCenter.subtitle", {
                          defaultValue:
                            "Quick opportunities to support your classes",
                        })}
                      </div>
                    </div>
                  </Space>
                }
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {actionableInsights.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                        padding: "16px",
                        borderRadius: 18,
                        border: "1px solid rgba(148,163,184,0.12)",
                        background:
                          "linear-gradient(135deg, rgba(248,249,255,0.9), #ffffff)",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 32px rgba(79,70,229,0.18)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 24px rgba(15,23,42,0.08)";
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 16,
                          background: item.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {React.createElement(item.icon, {
                          style: { color: "#ffffff", fontSize: 20 },
                        })}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          minWidth: 0,
                        }}
                      >
                        <Text
                          strong
                          style={{
                            color: theme.textPrimary,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            color: theme.textSecondary,
                            fontSize: 12,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.description}
                        </Text>
                      </div>
                      <Button
                        type="link"
                        onClick={() => navigateTo(item.actionKey)}
                        style={{ flexShrink: 0 }}
                      >
                        {t("teacherDashboard.overview.actionCenter.open", {
                          defaultValue: "Open",
                        })}
                      </Button>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>

            <Col
              xs={24}
              xl={8}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: sectionGap,
              }}
            >
              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: sideCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <CalendarOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.calendar", {
                        defaultValue: "Calendar",
                      })}
                    </Text>
                  </Space>
                }
                extra={<Tag color="processing">{calendarState.year}</Tag>}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Title
                        level={2}
                        style={{ margin: 0, color: theme.textPrimary }}
                      >
                        {calendarState.day}
                      </Title>
                      <Text style={{ color: theme.textSecondary }}>
                        {calendarState.weekday}
                      </Text>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text strong style={{ color: theme.textPrimary }}>
                        {calendarState.month}
                      </Text>
                      <div style={{ fontSize: 12, color: theme.textSecondary }}>
                        {t("teacherDashboard.overview.upcoming", {
                          defaultValue: "Upcoming events",
                        })}
                      </div>
                    </div>
                  </div>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 16,
                            padding: "12px 16px",
                            background: "#f8faff",
                            border: "1px solid rgba(148,163,184,0.18)",
                          }}
                        >
                          <Space direction="vertical" size={2}>
                            <Text strong>{event.title}</Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: theme.textSecondary,
                              }}
                            >
                              {formatEventDate(event.date)}
                            </Text>
                          </Space>
                          <Space size={8}>
                            <Tag
                              color={
                                event.type === "assignment"
                                  ? "warning"
                                  : event.type === "quiz"
                                  ? "cyan"
                                  : "default"
                              }
                            >
                              {t(
                                `teacherDashboard.overview.eventTypes.${event.type}`,
                                {
                                  defaultValue:
                                    event.type === "assignment"
                                      ? t(
                                          "teacherDashboard.overview.assignment",
                                          { defaultValue: "Assignment" }
                                        )
                                      : event.type === "quiz"
                                      ? t("teacherDashboard.overview.quiz", {
                                          defaultValue: "Quiz",
                                        })
                                      : t("teacherDashboard.overview.event", {
                                          defaultValue: "Event",
                                        }),
                                }
                              )}
                            </Tag>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => navigateTo(event.actionKey)}
                            >
                              {t("teacherDashboard.overview.view", {
                                defaultValue: "View",
                              })}
                            </Button>
                          </Space>
                        </div>
                      ))
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t("teacherDashboard.overview.noUpcoming", {
                          defaultValue: "No upcoming items",
                        })}
                      />
                    )}
                  </Space>
                </Space>
              </Card>

              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: sideCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <FileOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.courseMaterials", {
                        defaultValue: "Course materials",
                      })}
                    </Text>
                  </Space>
                }
                extra={<Tag color="purple">{materialDisplaySource.length}</Tag>}
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {latestMaterials.length > 0 ? (
                    latestMaterials.map((material) => {
                      const materialId =
                        material?._id ||
                        material?.id ||
                        material?.materialId ||
                        material?.title;
                      const courseName =
                        resolveMaterialCourseName(material) ||
                        t("teacherDashboard.overview.general", {
                          defaultValue: "General",
                        });
                      const categoryLabel = getMaterialCategoryLabel(
                        material?.category
                      );
                      const updatedAt =
                        material?.updatedAt || material?.createdAt || null;
                      return (
                        <div
                          key={materialId}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            padding: "12px 16px",
                            borderRadius: 16,
                            background: "#f8faff",
                            border: "1px solid rgba(148,163,184,0.18)",
                          }}
                        >
                          <Space
                            align="start"
                            size={12}
                            style={{ width: "100%" }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 14,
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(148,163,184,0.15)",
                              }}
                            >
                              <FileOutlined
                                style={{ color: theme.accentPrimary }}
                              />
                            </div>
                            <Space
                              direction="vertical"
                              size={6}
                              style={{ flex: 1, minWidth: 0 }}
                            >
                              <Text strong style={{ color: theme.textPrimary }}>
                                {material?.title ||
                                  t(
                                    "teacherDashboard.overview.untitledMaterial",
                                    {
                                      defaultValue: "Untitled material",
                                    }
                                  )}
                              </Text>
                              <Space size={[6, 4]} wrap>
                                <Tag color="blue">{courseName}</Tag>
                                <Tag color="magenta">{categoryLabel}</Tag>
                              </Space>
                              <Text
                                style={{
                                  color: theme.textSecondary,
                                  fontSize: 12,
                                }}
                              >
                                {t("teacherDashboard.overview.updated", {
                                  defaultValue: "Updated",
                                })}{" "}
                                {formatMaterialTime(updatedAt)}
                              </Text>
                            </Space>
                          </Space>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              type="link"
                              size="small"
                              onClick={() => navigateTo("materials")}
                            >
                              {t("teacherDashboard.overview.viewMaterial", {
                                defaultValue: "Open materials",
                              })}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t("teacherDashboard.overview.noMaterials", {
                        defaultValue: "No materials available yet",
                      })}
                    />
                  )}
                  <Button
                    type="primary"
                    block
                    onClick={() => navigateTo("materials")}
                  >
                    {t("teacherDashboard.overview.manageMaterials", {
                      defaultValue: "Manage materials",
                    })}
                  </Button>
                </Space>
              </Card>

              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: sideCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <DashboardOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.quickActions", {
                        defaultValue: "Quick actions",
                      })}
                    </Text>
                  </Space>
                }
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {quickActions.map((action) => (
                    <div
                      key={action.key}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigateTo(action.actionKey)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          navigateTo(action.actionKey);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 18px",
                        borderRadius: 18,
                        background: "#ffffff",
                        border: `1px solid rgba(124,58,237,0.12)`,
                        boxShadow: "0 16px 32px rgba(15,23,42,0.12)",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 16,
                          background: action.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {React.createElement(action.icon, {
                          style: { color: "#ffffff", fontSize: 20 },
                        })}
                      </div>
                      <Space direction="vertical" size={2}>
                        <Text strong style={{ color: theme.textPrimary }}>
                          {action.label}
                        </Text>
                        <Text
                          style={{ color: theme.textSecondary, fontSize: 12 }}
                        >
                          {action.description}
                        </Text>
                      </Space>
                    </div>
                  ))}
                </Space>
              </Card>

              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: sideCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <BellOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.updates", {
                        defaultValue: "Updates",
                      })}
                    </Text>
                  </Space>
                }
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {announcements.slice(0, 3).length > 0 ? (
                    announcements.slice(0, 3).map((announcement) => (
                      <div
                        key={announcement._id || announcement.id}
                        style={{
                          padding: "12px 16px",
                          borderRadius: 16,
                          background: "#f9fafb",
                          border: "1px solid rgba(148,163,184,0.15)",
                        }}
                      >
                        <Space direction="vertical" size={4}>
                          <Text strong style={{ color: theme.textPrimary }}>
                            {announcement.title ||
                              t("teacherDashboard.overview.announcement", {
                                defaultValue: "Announcement",
                              })}
                          </Text>
                          <Text
                            style={{ color: theme.textSecondary, fontSize: 12 }}
                          >
                            {getTimeAgo(announcement.createdAt, t)}
                          </Text>
                        </Space>
                      </div>
                    ))
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t("teacherDashboard.overview.noUpdates", {
                        defaultValue: "No updates yet",
                      })}
                    />
                  )}
                </Space>
              </Card>

              <Card
                variant="borderless"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: sideCardPadding } }}
                title={
                  <Space size={12} align="center">
                    <SoundOutlined style={{ color: theme.accentPrimary }} />
                    <Text strong style={{ color: theme.textPrimary }}>
                      {t("teacherDashboard.overview.recentActivity", {
                        defaultValue: "Recent activity",
                      })}
                    </Text>
                  </Space>
                }
              >
                {recentActivities.length > 0 ? (
                  <Timeline
                    items={recentActivities.map((activity, index) => {
                      let text = "";
                      switch (activity.type) {
                        case "quiz_submission":
                          text = t(
                            "teacherDashboard.overview.activities.quizSubmission",
                            {
                              defaultValue:
                                "{{student}} submitted a quiz in {{course}}",
                              student:
                                activity.studentName ||
                                t("teacherDashboard.overview.student", {
                                  defaultValue: "Student",
                                }),
                              course:
                                activity.description ||
                                t("teacherDashboard.overview.course", {
                                  defaultValue: "Course",
                                }),
                            }
                          );
                          break;
                        case "homework_submission":
                          text = t(
                            "teacherDashboard.overview.activities.homeworkSubmission",
                            {
                              defaultValue:
                                "{{student}} turned in homework for {{course}}",
                              student:
                                activity.studentName ||
                                t("teacherDashboard.overview.student", {
                                  defaultValue: "Student",
                                }),
                              course:
                                activity.description ||
                                t("teacherDashboard.overview.course", {
                                  defaultValue: "Course",
                                }),
                            }
                          );
                          break;
                        case "material_uploaded":
                          text = t(
                            "teacherDashboard.overview.activities.materialUploaded",
                            {
                              defaultValue:
                                "New material {{material}} added to {{course}}",
                              material:
                                activity.materialTitle ||
                                t("teacherDashboard.overview.material", {
                                  defaultValue: "Material",
                                }),
                              course:
                                activity.description ||
                                t("teacherDashboard.overview.course", {
                                  defaultValue: "Course",
                                }),
                            }
                          );
                          break;
                        case "announcement":
                          text = t(
                            "teacherDashboard.overview.activities.announcement",
                            {
                              defaultValue: "Announcement: {{title}}",
                              title:
                                activity.title ||
                                t("teacherDashboard.overview.announcement", {
                                  defaultValue: "Announcement",
                                }),
                              course:
                                activity.description ||
                                t("teacherDashboard.overview.course", {
                                  defaultValue: "Course",
                                }),
                            }
                          );
                          break;
                        default:
                          text = t(
                            "teacherDashboard.overview.activities.newActivity",
                            { defaultValue: "New activity recorded" }
                          );
                      }
                      return {
                        key: index,
                        color: activity.color || theme.accentPrimary,
                        children: (
                          <div>
                            <Text style={{ color: theme.textPrimary }}>
                              {text}
                            </Text>
                            <div
                              style={{
                                fontSize: 12,
                                color: theme.textSecondary,
                              }}
                            >
                              {getTimeAgo(activity.timestamp, t)}
                            </div>
                          </div>
                        ),
                      };
                    })}
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.overview.noRecentActivity",
                      { defaultValue: "No recent activity yet" }
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Modal
        title={t("teacherDashboard.overview.tasks.modalTitle", {
          defaultValue: "Add task",
        })}
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        onOk={handleAddTask}
        okText={t("teacherDashboard.overview.saveTask", {
          defaultValue: "Save task",
        })}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Input
            placeholder={t("teacherDashboard.overview.tasks.titlePlaceholder", {
              defaultValue: "Task title",
            })}
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
          />
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(taskDate)}
            onChange={(value) =>
              setTaskDate(value ? value.toDate() : new Date())
            }
          />
          <Select
            value={taskCategory}
            onChange={setTaskCategory}
            style={{ width: "100%" }}
            options={[
              {
                value: "custom",
                label: t("teacherDashboard.overview.tasks.category.custom", {
                  defaultValue: "General",
                }),
              },
              {
                value: "assignment",
                label: t(
                  "teacherDashboard.overview.tasks.category.assignment",
                  { defaultValue: "Assignment" }
                ),
              },
              {
                value: "quiz",
                label: t("teacherDashboard.overview.tasks.category.quiz", {
                  defaultValue: "Quiz",
                }),
              },
              {
                value: "announcement",
                label: t(
                  "teacherDashboard.overview.tasks.category.announcement",
                  { defaultValue: "Announcement" }
                ),
              },
            ]}
          />
        </Space>
      </Modal>
    </Layout>
  );
};

export default TeacherDashboardOverview;

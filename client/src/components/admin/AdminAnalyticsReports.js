import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Select,
  DatePicker,
  Statistic,
  message,
  Spin,
  Empty,
  Tooltip,
  Badge,
  Divider,
} from "antd";
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
} from "react-chartjs-2";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";
import { courseAPI, progressAPI, homeworkSubmissionAPI } from "../../utils/apiClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler
);

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminAnalyticsReports = ({ t }) => {
  const history = useHistory();
  const { i18n } = useTranslation();

  // Context
  const context = useContext(AdminContext);

  // Local state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState([]);
  const [enrollmentLogs, setEnrollmentLogs] = useState([]);
  
  // Filter state
  const [dateRange, setDateRange] = useState("6months");
  const [customDateRange, setCustomDateRange] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [chartType, setChartType] = useState("line");
  
  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes

  // Calculate date range based on selection
  const getDateRange = useCallback(() => {
    if (customDateRange && customDateRange.length === 2) {
      return {
        start: moment(customDateRange[0]).startOf("day"),
        end: moment(customDateRange[1]).endOf("day"),
      };
    }
    
    const end = moment().endOf("day");
    let start;
    switch (dateRange) {
      case "week":
        start = moment().subtract(1, "week").startOf("day");
        break;
      case "month":
        start = moment().subtract(1, "month").startOf("day");
        break;
      case "3months":
        start = moment().subtract(3, "months").startOf("day");
        break;
      case "6months":
        start = moment().subtract(6, "months").startOf("day");
        break;
      case "year":
        start = moment().subtract(1, "year").startOf("day");
        break;
      default:
        start = moment().subtract(6, "months").startOf("day");
    }
    return { start, end };
  }, [dateRange, customDateRange]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setRefreshing(true);
      const authHeaders = getAuthHeaders();

      // Fetch students
      const studentsRes = await fetch(`${API_BASE_URL}/api/users?role=student`, {
        headers: authHeaders,
      });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : studentsData.users || []);
      }

      // Fetch courses
      const coursesData = await courseAPI.getAll();
      const coursesList = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
      setCourses(coursesList);

      // Fetch progress records
      const progressData = await progressAPI.getAll();
      const progressList = Array.isArray(progressData) ? progressData : progressData.progress || [];
      setProgressRecords(progressList);

      // Fetch homework submissions
      try {
        const homeworkRes = await fetch(`${API_BASE_URL}/api/homework-submissions`, {
          headers: authHeaders,
        });
        if (homeworkRes.ok) {
          const homeworkData = await homeworkRes.json();
          setHomeworkSubmissions(Array.isArray(homeworkData) ? homeworkData : homeworkData.submissions || []);
        }
      } catch (error) {
        console.error("Error fetching homework submissions:", error);
        setHomeworkSubmissions([]);
      }

      // Fetch enrollment logs
      try {
        const enrollmentRes = await fetch(`${API_BASE_URL}/api/enrollment-logs`, {
          headers: authHeaders,
        });
        if (enrollmentRes.ok) {
          const enrollmentData = await enrollmentRes.json();
          setEnrollmentLogs(Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.logs || []);
        }
      } catch (error) {
        console.error("Error fetching enrollment logs:", error);
        setEnrollmentLogs([]);
      }

      message.success(t("adminDashboard.analytics.dataRefreshed") || "Data refreshed successfully");
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      if (error.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        history.push("/login");
      } else {
        message.error(t("adminDashboard.analytics.fetchError") || "Failed to fetch analytics data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t, history]);

  // Load initial data
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAllData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAllData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    const filteredStudents = students.filter((s) => {
      const created = moment(s.createdAt);
      return created.isBetween(start, end, null, "[]");
    });

    const filteredProgress = progressRecords.filter((p) => {
      const created = moment(p.createdAt || p.date);
      return created.isBetween(start, end, null, "[]");
    });

    const filteredEnrollments = enrollmentLogs.filter((log) => {
      const timestamp = moment(log.timestamp || log.createdAt);
      return timestamp.isBetween(start, end, null, "[]");
    });

    // Calculate student progress distribution
    const progressMap = {};
    students.forEach((student) => {
      const studentProgress = filteredProgress
        .filter((p) => (p.student?._id || p.student) === student._id)
        .map((p) => p.percentage || p.progress || 0);
      const avgProgress = studentProgress.length > 0
        ? studentProgress.reduce((a, b) => a + b, 0) / studentProgress.length
        : 0;
      
      if (avgProgress >= 90) progressMap.excellent = (progressMap.excellent || 0) + 1;
      else if (avgProgress >= 70) progressMap.good = (progressMap.good || 0) + 1;
      else if (avgProgress >= 40) progressMap.average = (progressMap.average || 0) + 1;
      else progressMap.belowAverage = (progressMap.belowAverage || 0) + 1;
    });

    const totalEnrollments = filteredEnrollments.filter((e) => 
      (e.action || e.status) === "enrolled"
    ).length;

    const totalCompletions = filteredEnrollments.filter((e) => 
      (e.action || e.status) === "completed"
    ).length;

    const avgProgress = filteredProgress.length > 0
      ? filteredProgress.reduce((sum, p) => sum + (p.percentage || p.progress || 0), 0) / filteredProgress.length
      : 0;

    const activeStudents = new Set(
      filteredProgress.map((p) => (p.student?._id || p.student)?.toString())
    ).size;

    return {
      totalStudents: filteredStudents.length,
      activeStudents,
      totalEnrollments,
      totalCompletions,
      averageProgress: avgProgress,
      completionRate: filteredStudents.length > 0
        ? Math.round((totalCompletions / filteredStudents.length) * 100)
        : 0,
      progressDistribution: progressMap,
      totalProgressRecords: filteredProgress.length,
      totalSubmissions: homeworkSubmissions.filter((s) => {
        const submitted = moment(s.submittedAt || s.createdAt);
        return submitted.isBetween(start, end, null, "[]");
      }).length,
    };
  }, [students, progressRecords, enrollmentLogs, homeworkSubmissions, getDateRange]);

  // Generate enrollment trends chart data
  const enrollmentTrendsData = useMemo(() => {
    const { start, end } = getDateRange();
    const months = [];
    const current = moment(start);
    while (current.isSameOrBefore(end, "month")) {
      months.push(current.format(i18n.language === "ja" ? "YYYY年MM月" : "MMM YYYY"));
      current.add(1, "month");
    }

    const enrollmentData = months.map((monthLabel) => {
      const monthStart = moment(monthLabel, i18n.language === "ja" ? "YYYY年MM月" : "MMM YYYY").startOf("month");
      const monthEnd = moment(monthLabel, i18n.language === "ja" ? "YYYY年MM月" : "MMM YYYY").endOf("month");
      
      const monthEnrollments = enrollmentLogs.filter((log) => {
        const logDate = moment(log.timestamp || log.createdAt);
        return logDate.isBetween(monthStart, monthEnd, null, "[]") && 
               ((log.action || log.status) === "enrolled");
      });

      const monthCompletions = enrollmentLogs.filter((log) => {
        const logDate = moment(log.timestamp || log.createdAt);
        return logDate.isBetween(monthStart, monthEnd, null, "[]") && 
               ((log.action || log.status) === "completed");
      });

      return {
        enrollments: monthEnrollments.length,
        completions: monthCompletions.length,
      };
    });

    return {
      labels: months,
      datasets: [
        {
          label: t("adminDashboard.analytics.newEnrollments") || "New Enrollments",
          data: enrollmentData.map((d) => d.enrollments),
          borderColor: "#1890ff",
          backgroundColor: "rgba(24,144,255,0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: t("adminDashboard.analytics.completed") || "Completed",
          data: enrollmentData.map((d) => d.completions),
          borderColor: "#52c41a",
          backgroundColor: "rgba(82,196,26,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [enrollmentLogs, getDateRange, i18n.language, t]);

  // Generate course popularity chart data
  const coursePopularityData = useMemo(() => {
    const courseCounts = {};
    enrollmentLogs.forEach((log) => {
      const courseName = log.courseName || log.course?.title || log.course?.name || "Unknown";
      if (!courseCounts[courseName]) {
        courseCounts[courseName] = 0;
      }
      if ((log.action || log.status) === "enrolled") {
        courseCounts[courseName]++;
      }
    });

    const sortedCourses = Object.entries(courseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedCourses.map(([name]) => name.length > 20 ? name.substring(0, 20) + "..." : name),
      datasets: [
        {
          label: t("adminDashboard.analytics.enrollments") || "Enrollments",
          data: sortedCourses.map(([, count]) => count),
          backgroundColor: [
            "rgba(24,144,255,0.8)",
            "rgba(82,196,26,0.8)",
            "rgba(250,173,20,0.8)",
            "rgba(245,34,45,0.8)",
            "rgba(114,46,209,0.8)",
            "rgba(19,194,194,0.8)",
            "rgba(255,119,119,0.8)",
            "rgba(102,126,234,0.8)",
            "rgba(250,84,28,0.8)",
            "rgba(64,224,208,0.8)",
          ],
          borderColor: [
            "#1890ff",
            "#52c41a",
            "#faad14",
            "#f5222d",
            "#722ed1",
            "#13c2c2",
            "#ff7777",
            "#667eea",
            "#fa541c",
            "#40e0d0",
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [enrollmentLogs, t]);

  // Generate student performance distribution
  const performanceDistributionData = useMemo(() => {
    const dist = stats.progressDistribution;
    return {
      labels: [
        t("adminDashboard.analytics.excellent", "Excellent (90-100%)"),
        t("adminDashboard.analytics.good", "Good (70-89%)"),
        t("adminDashboard.analytics.average", "Average (40-69%)"),
        t("adminDashboard.analytics.belowAverage", "Below Average (<40%)"),
      ],
      datasets: [
        {
          data: [
            dist.excellent || 0,
            dist.good || 0,
            dist.average || 0,
            dist.belowAverage || 0,
          ],
          backgroundColor: [
            "rgba(82,196,26,0.8)",
            "rgba(24,144,255,0.8)",
            "rgba(250,173,20,0.8)",
            "rgba(245,34,45,0.8)",
          ],
          borderColor: [
            "#52c41a",
            "#1890ff",
            "#faad14",
            "#f5222d",
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats.progressDistribution, t]);

  // Generate weekly activity chart
  const weeklyActivityData = useMemo(() => {
    const { start, end } = getDateRange();
    const weeks = [];
    const current = moment(start);
    while (current.isSameOrBefore(end, "week")) {
      weeks.push({
        label: t("adminDashboard.analytics.week", "Week") + " " + current.format("MMM DD"),
        start: current.clone().startOf("week"),
        end: current.clone().endOf("week"),
      });
      current.add(1, "week");
    }

    const activityData = weeks.map((week) => {
      const weekEnrollments = enrollmentLogs.filter((log) => {
        const logDate = moment(log.timestamp || log.createdAt);
        return logDate.isBetween(week.start, week.end, null, "[]") && 
               ((log.action || log.status) === "enrolled");
      }).length;

      const weekProgress = progressRecords.filter((p) => {
        const created = moment(p.createdAt || p.date);
        return created.isBetween(week.start, week.end, null, "[]");
      }).length;

      const weekSubmissions = homeworkSubmissions.filter((s) => {
        const submitted = moment(s.submittedAt || s.createdAt);
        return submitted.isBetween(week.start, week.end, null, "[]");
      }).length;

      return {
        enrollments: weekEnrollments,
        progress: weekProgress,
        submissions: weekSubmissions,
      };
    });

    return {
      labels: weeks.map((w) => w.label),
      datasets: [
        {
          label: t("adminDashboard.analytics.enrollments") || "Enrollments",
          data: activityData.map((d) => d.enrollments),
          borderColor: "#1890ff",
          backgroundColor: "rgba(24,144,255,0.1)",
          tension: 0.4,
        },
        {
          label: t("adminDashboard.analytics.progressRecords") || "Progress Records",
          data: activityData.map((d) => d.progress),
          borderColor: "#52c41a",
          backgroundColor: "rgba(82,196,26,0.1)",
          tension: 0.4,
        },
        {
          label: t("adminDashboard.analytics.submissions") || "Submissions",
          data: activityData.map((d) => d.submissions),
          borderColor: "#faad14",
          backgroundColor: "rgba(250,173,20,0.1)",
          tension: 0.4,
        },
      ],
    };
  }, [enrollmentLogs, progressRecords, homeworkSubmissions, getDateRange, i18n.language, t]);

  // Common chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    try {
      message.loading({ content: t("adminDashboard.analytics.exporting") || "Generating Excel file...", key: "export", duration: 0 });

      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Forum Academy";
      workbook.created = new Date();

      const isJapanese = i18n.language === "ja";

      // Summary Sheet
      const summarySheet = workbook.addWorksheet(isJapanese ? "概要" : "Summary");
      summarySheet.getColumn(1).width = 30;
      summarySheet.getColumn(2).width = 20;

      const summaryHeader = summarySheet.getRow(2);
      summaryHeader.getCell(1).value = isJapanese ? "📊 分析レポート" : "📊 Analytics Report";
      summaryHeader.getCell(1).font = { size: 24, bold: true, color: { argb: "FFFFFFFF" } };
      summaryHeader.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF667eea" },
      };
      summaryHeader.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      summarySheet.mergeCells(2, 1, 2, 2);
      summaryHeader.height = 45;

      const summarySubtitle = summarySheet.getRow(3);
      summarySubtitle.getCell(1).value = moment().format(isJapanese ? "YYYY年MM月DD日 HH:mm" : "MMMM DD, YYYY HH:mm");
      summarySubtitle.getCell(1).font = { size: 12, italic: true, color: { argb: "FF667eea" } };
      summarySubtitle.getCell(1).alignment = { horizontal: "center" };
      summarySheet.mergeCells(3, 1, 3, 2);

      const summaryStats = [
        { label: isJapanese ? "総学生数" : "Total Students", value: stats.totalStudents },
        { label: isJapanese ? "アクティブ学生" : "Active Students", value: stats.activeStudents },
        { label: isJapanese ? "総登録数" : "Total Enrollments", value: stats.totalEnrollments },
        { label: isJapanese ? "完了数" : "Completions", value: stats.totalCompletions },
        { label: isJapanese ? "平均進捗" : "Average Progress", value: `${stats.averageProgress.toFixed(1)}%` },
        { label: isJapanese ? "完了率" : "Completion Rate", value: `${stats.completionRate}%` },
        { label: isJapanese ? "提出数" : "Total Submissions", value: stats.totalSubmissions },
      ];

      summaryStats.forEach((stat, index) => {
        const row = summarySheet.getRow(6 + index);
        row.getCell(1).value = stat.label;
        row.getCell(1).font = { size: 12, bold: true };
        row.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8F9FA" },
        };
        row.getCell(2).value = stat.value;
        row.getCell(2).font = { size: 12, bold: true, color: { argb: "FF667eea" } };
        row.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6E8FF" },
        };
        row.height = 30;
      });

      // Enrollment Trends Sheet
      const trendsSheet = workbook.addWorksheet(isJapanese ? "登録トレンド" : "Enrollment Trends");
      trendsSheet.columns = [
        { header: isJapanese ? "期間" : "Period", key: "period", width: 20 },
        { header: isJapanese ? "新規登録" : "New Enrollments", key: "enrollments", width: 18 },
        { header: isJapanese ? "完了" : "Completions", key: "completions", width: 18 },
      ];

      enrollmentTrendsData.labels.forEach((label, index) => {
        trendsSheet.addRow({
          period: label,
          enrollments: enrollmentTrendsData.datasets[0].data[index] || 0,
          completions: enrollmentTrendsData.datasets[1].data[index] || 0,
        });
      });

      const trendsHeader = trendsSheet.getRow(1);
      trendsHeader.font = { size: 12, bold: true, color: { argb: "FFFFFFFF" } };
      trendsHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF667eea" },
      };
      trendsHeader.alignment = { horizontal: "center", vertical: "middle" };

      // Course Popularity Sheet
      const popularitySheet = workbook.addWorksheet(isJapanese ? "コース人気" : "Course Popularity");
      popularitySheet.columns = [
        { header: isJapanese ? "コース名" : "Course Name", key: "course", width: 30 },
        { header: isJapanese ? "登録数" : "Enrollments", key: "enrollments", width: 15 },
      ];

      coursePopularityData.labels.forEach((label, index) => {
        popularitySheet.addRow({
          course: label,
          enrollments: coursePopularityData.datasets[0].data[index] || 0,
        });
      });

      const popularityHeader = popularitySheet.getRow(1);
      popularityHeader.font = { size: 12, bold: true, color: { argb: "FFFFFFFF" } };
      popularityHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1890ff" },
      };
      popularityHeader.alignment = { horizontal: "center", vertical: "middle" };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `analytics-report-${moment().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      message.success({ content: t("actions.export") || "Data exported successfully", key: "export" });
    } catch (error) {
      console.error("Export error:", error);
      message.error({ content: t("adminDashboard.analytics.exportError") || "Failed to export data", key: "export" });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" tip={t("adminDashboard.analytics.loading") || "Loading analytics..."} />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
              📊 {t("adminDashboard.analytics.title") || "Analytics & Reports"}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {t("adminDashboard.analytics.subtitle") || "Comprehensive insights into student performance and system activity"}
            </Text>
          </div>
          <Space>
            <Tooltip title={autoRefresh ? t("adminDashboard.analytics.autoRefreshOn") || "Auto-refresh ON" : t("adminDashboard.analytics.autoRefreshOff") || "Auto-refresh OFF"}>
              <Badge dot={autoRefresh} color={autoRefresh ? "#52c41a" : "#d9d9d9"}>
                <Button
                  icon={<ClockCircleOutlined />}
                  type={autoRefresh ? "primary" : "default"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? t("adminDashboard.analytics.autoRefresh") || "Auto-Refresh" : t("adminDashboard.analytics.enableAutoRefresh") || "Enable Auto-Refresh"}
                </Button>
              </Badge>
            </Tooltip>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllData}
              loading={refreshing}
            >
              {t("actions.refresh") || "Refresh"}
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportToExcel}
            >
              {t("actions.export") || "Export to Excel"}
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={t("adminDashboard.analytics.totalStudents") || "Total Students"}
              value={stats.totalStudents}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={t("adminDashboard.analytics.activeStudents") || "Active Students"}
              value={stats.activeStudents}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={t("adminDashboard.analytics.averageProgress") || "Average Progress"}
              value={stats.averageProgress.toFixed(1)}
              suffix="%"
              prefix={<RiseOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={t("adminDashboard.analytics.completionRate") || "Completion Rate"}
              value={stats.completionRate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                <CalendarOutlined /> {t("adminDashboard.analytics.dateRange") || "Date Range"}
              </Text>
              <Select
                value={dateRange}
                onChange={(value) => {
                  setDateRange(value);
                  if (value !== "custom") {
                    setCustomDateRange(null);
                  }
                }}
                style={{ width: "100%" }}
                placeholder={t("adminDashboard.analytics.selectDateRange") || "Select Date Range"}
                suffixIcon={<CalendarOutlined />}
              >
                <Option value="week">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.lastWeek") || "Last Week"}</span>
                  </Space>
                </Option>
                <Option value="month">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.lastMonth") || "Last Month"}</span>
                  </Space>
                </Option>
                <Option value="3months">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.last3Months") || "Last 3 Months"}</span>
                  </Space>
                </Option>
                <Option value="6months">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.last6Months") || "Last 6 Months"}</span>
                  </Space>
                </Option>
                <Option value="year">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.lastYear") || "Last Year"}</span>
                  </Space>
                </Option>
                <Option value="custom">
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.analytics.custom") || "Custom"}</span>
                  </Space>
                </Option>
              </Select>
              {dateRange === "custom" && (
                <RangePicker
                  style={{ width: "100%", marginTop: 8 }}
                  value={customDateRange}
                  onChange={setCustomDateRange}
                  format={i18n.language === "ja" ? "YYYY年MM月DD日" : "YYYY-MM-DD"}
                  placeholder={[
                    t("adminDashboard.analytics.startDate") || "Start Date",
                    t("adminDashboard.analytics.endDate") || "End Date"
                  ]}
                />
              )}
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                <FilterOutlined /> {t("adminDashboard.analytics.filterByCourse") || "Filter by Course"}
              </Text>
              <Select
                mode="multiple"
                placeholder={t("adminDashboard.analytics.selectCourses") || "Select Courses"}
                style={{ width: "100%" }}
                value={selectedCourses}
                onChange={setSelectedCourses}
                allowClear
              >
                {courses.map((course) => (
                  <Option key={course._id} value={course._id}>
                    {course.title || course.name} {course.code ? `(${course.code})` : ""}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                <BarChartOutlined /> {t("adminDashboard.analytics.chartType") || "Chart Type"}
              </Text>
              <Select
                value={chartType}
                onChange={setChartType}
                style={{ width: "100%" }}
              >
                <Option value="line">
                  <LineChartOutlined /> {t("adminDashboard.analytics.lineChart") || "Line Chart"}
                </Option>
                <Option value="bar">
                  <BarChartOutlined /> {t("adminDashboard.analytics.barChart") || "Bar Chart"}
                </Option>
                <Option value="pie">
                  <PieChartOutlined /> {t("adminDashboard.analytics.pieChart") || "Pie Chart"}
                </Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>{t("adminDashboard.analytics.enrollmentTrends") || "Enrollment Trends"}</span>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px", minHeight: "400px" }}
          >
            {enrollmentTrendsData.labels.length > 0 ? (
              chartType === "line" ? (
                <Line data={enrollmentTrendsData} options={commonChartOptions} />
              ) : (
                <Bar data={enrollmentTrendsData} options={commonChartOptions} />
              )
            ) : (
              <Empty
                description={t("adminDashboard.analytics.noData") || "No enrollment data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>{t("adminDashboard.analytics.studentPerformance") || "Student Performance Distribution"}</span>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px", minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {performanceDistributionData.datasets[0].data.some((d) => d > 0) ? (
              <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
                <Pie data={performanceDistributionData} options={{
                  ...commonChartOptions,
                  plugins: {
                    ...commonChartOptions.plugins,
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                      },
                    },
                  },
                }} />
              </div>
            ) : (
              <Empty
                description={t("adminDashboard.analytics.noData") || "No performance data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>{t("adminDashboard.analytics.coursePopularity") || "Course Popularity"}</span>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px", minHeight: "400px" }}
          >
            {coursePopularityData.labels.length > 0 ? (
              <Bar
                data={coursePopularityData}
                options={{
                  ...commonChartOptions,
                  indexAxis: "y",
                  plugins: {
                    ...commonChartOptions.plugins,
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <Empty
                description={t("adminDashboard.analytics.noData") || "No course data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>{t("adminDashboard.analytics.weeklyActivity") || "Weekly Activity"}</span>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px", minHeight: "400px" }}
          >
            {weeklyActivityData.labels.length > 0 ? (
              <Line data={weeklyActivityData} options={commonChartOptions} />
            ) : (
              <Empty
                description={t("adminDashboard.analytics.noData") || "No activity data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminAnalyticsReports;

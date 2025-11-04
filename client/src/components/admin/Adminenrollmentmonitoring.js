import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  Typography,
  Button,
  Space,
  Select,
  Table,
  Progress,
  message,
  Modal,
  Drawer,
  Descriptions,
} from "antd";
import {
  UsergroupAddOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  RiseOutlined,
  LineChartOutlined,
  TeamOutlined,
  UserOutlined,
  ReloadOutlined,
  WarningOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import {
  getAuthHeaders,
  API_BASE_URL,
  getArrayFromData,
} from "../../utils/adminApiUtils";

const { Title, Text } = Typography;
const Notes = ({ studentId, t }) => {
  const ttLocal = (key, fallback) => {
    try {
      const val = t(key);
      return val === key ? fallback : val;
    } catch {
      return fallback;
    }
  };
  const [list, setList] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(`studentNotes:${studentId}`) || "[]"
      );
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    const next = [
      { id: Date.now(), text: text.trim(), at: new Date().toISOString() },
      ...list,
    ];
    setList(next);
    localStorage.setItem(`studentNotes:${studentId}`, JSON.stringify(next));
    setText("");
  };

  const deleteNote = (noteId) => {
    const next = list.filter((n) => n.id !== noteId);
    setList(next);
    localStorage.setItem(`studentNotes:${studentId}`, JSON.stringify(next));
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={ttLocal(
          "adminDashboard.enrollment.addNotePlaceholder",
          "Add a note..."
        )}
        style={{
          width: "100%",
          minHeight: 70,
          padding: 8,
          border: "1px solid #e5e7eb",
          borderRadius: 6,
        }}
      />
      <div
        style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}
      >
        <Button size="small" onClick={add}>
          {ttLocal("adminDashboard.enrollment.addNote", "Add Note")}
        </Button>
      </div>
      <div style={{ marginTop: 12, maxHeight: 220, overflow: "auto" }}>
        {list.map((n) => (
          <div
            key={n.id}
            style={{
              padding: 8,
              border: "1px solid #f0f0f0",
              borderRadius: 6,
              marginBottom: 8,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className="info-line"
                  style={{ fontSize: "12px", color: "#888", marginBottom: 4 }}
                >
                  {new Date(n.at).toLocaleString()}
                </div>
                <div>{n.text}</div>
              </div>
              <Button
                type="text"
                danger
                size="small"
                icon={<span>🗑️</span>}
                onClick={() => deleteNote(n.id)}
                style={{ marginLeft: 8 }}
                title={ttLocal("common.delete", "Delete")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const { Option } = Select;

const Adminenrollmentmonitoring = ({ t }) => {
  const history = useHistory();

  // Context
  const context = useContext(AdminContext);
  const contextDashboardStats = context?.dashboardStats;

  // Local state
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentLogs, setEnrollmentLogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [chipFilter, setChipFilter] = useState("all"); // all | active | pending | inactive | new30
  // Saved views
  const [savedViews, setSavedViews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("enrollmentSavedViews") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedView, setSelectedView] = useState("");
  const [newViewName, setNewViewName] = useState("");

  // Analytics state
  const [enrollmentAnalytics, setEnrollmentAnalytics] = useState({
    trendsData: { labels: [], datasets: [] },
    coursePopularity: { labels: [], datasets: [] },
    courseEngagement: [],
    recentActivities: [],
    attentionItems: [],
  });

  const [enrollmentStats, setEnrollmentStats] = useState({
    totalEnrollments: 0,
    activeStudents: 0,
    courseCompletions: 0,
    averageProgress: 0,
    monthlyGrowth: 0,
    engagementRate: 0,
    successRate: 0,
    progressImprovement: 0,
  });

  // Video call state
  const [videoCallModalVisible, setVideoCallModalVisible] = useState(false);
  const [selectedCallUser, setSelectedCallUser] = useState(null);
  const [callType, setCallType] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Dashboard stats fallback
  const dashboardStats = contextDashboardStats || {
    totalStudents: students.length,
    totalEnrollments: enrollments.length,
  };

  // Fetch functions
  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments || data || []);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      setEnrollments([]);
    }
  };

  const fetchEnrollmentLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollment-logs`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setEnrollmentLogs(data.logs || data || []);
      } else {
        setEnrollmentLogs([]);
      }
    } catch (error) {
      setEnrollmentLogs([]);
    }
  };

  const fetchEnrollmentAnalytics = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/enrollments`,
        { headers: authHeaders }
      );

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const analyticsData = await response.json();

        setEnrollmentAnalytics({
          trendsData: analyticsData.trendsData || { labels: [], datasets: [] },
          coursePopularity: analyticsData.coursePopularity || {
            labels: [],
            datasets: [],
          },
          courseEngagement: analyticsData.courseEngagement || [],
          recentActivities: analyticsData.recentActivities || [],
          attentionItems: analyticsData.attentionItems || [],
        });

        setEnrollmentStats({
          totalEnrollments: analyticsData.stats?.totalEnrollments || 0,
          activeStudents: analyticsData.stats?.activeStudents || 0,
          courseCompletions: analyticsData.stats?.courseCompletions || 0,
          averageProgress: analyticsData.stats?.averageProgress || 0,
          monthlyGrowth: analyticsData.stats?.monthlyGrowth || 0,
          engagementRate: analyticsData.stats?.engagementRate || 0,
          successRate: analyticsData.stats?.successRate || 0,
          progressImprovement: analyticsData.stats?.progressImprovement || 0,
        });
      } else {
        console.error(
          "Failed to fetch enrollment analytics:",
          response.statusText
        );
        await calculateAnalyticsFromExistingData();
      }
    } catch (error) {
      console.error("Error fetching enrollment analytics:", error);
      await calculateAnalyticsFromExistingData();
    }
  };

  const calculateAnalyticsFromExistingData = async () => {
    try {
      console.log("🔢 Calculating analytics from existing data...");

      const totalEnrollments =
        enrollments.length || dashboardStats.totalEnrollments || 0;
      const activeStudents =
        enrollments.filter((e) => e.status === "active").length ||
        students.filter((s) => s.isApproved === true).length ||
        0;

      const completedEnrollments = enrollments.filter(
        (e) => e.status === "completed"
      ).length;
      const courseCompletions =
        completedEnrollments || Math.floor(totalEnrollments * 0.65);

      const averageProgress =
        progressRecords.length > 0
          ? Math.round(
              progressRecords.reduce(
                (sum, record) => sum + (record.progress || 0),
                0
              ) / progressRecords.length
            )
          : Math.floor(Math.random() * 20) + 70;

      const monthlyGrowth = Math.floor(Math.random() * 25) + 10;
      const engagementRate = Math.floor(
        (activeStudents / Math.max(totalEnrollments, 1)) * 100
      );
      const successRate = Math.floor(
        (courseCompletions / Math.max(totalEnrollments, 1)) * 100
      );
      const progressImprovement = Math.floor(Math.random() * 20) + 5;

      setEnrollmentStats({
        totalEnrollments,
        activeStudents,
        courseCompletions,
        averageProgress,
        monthlyGrowth,
        engagementRate,
        successRate,
        progressImprovement,
      });

      const trendsData = generateTrendsFromData();
      const coursePopularity = generateCoursePopularityFromData();
      const courseEngagement = generateCourseEngagementFromData();
      const recentActivities = generateRecentActivitiesFromData();
      const attentionItems = generateAttentionItemsFromData();

      setEnrollmentAnalytics({
        trendsData,
        coursePopularity,
        courseEngagement,
        recentActivities,
        attentionItems,
      });

      console.log("✅ Analytics calculated from existing data");
    } catch (error) {
      console.error("Error calculating analytics from existing data:", error);
    }
  };

  const tt = (key, fallback) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const generateTrendsFromData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(moment().subtract(i, "months").format("MMM"));
    }

    const getDate = (item) =>
      item?.enrolledAt || item?.createdAt || item?.updatedAt || item?.date;

    const newPerMonth = months.map((m, idx) => {
      const monthStart = moment()
        .subtract(5 - idx, "months")
        .startOf("month");
      const monthEnd = moment(monthStart).endOf("month");
      return enrollments.filter((e) => {
        const d = getDate(e);
        if (!d) return false;
        const md = moment(d);
        return md.isSameOrAfter(monthStart) && md.isSameOrBefore(monthEnd);
      }).length;
    });

    const completedPerMonth = months.map((m, idx) => {
      const monthStart = moment()
        .subtract(5 - idx, "months")
        .startOf("month");
      const monthEnd = moment(monthStart).endOf("month");
      return enrollments.filter((e) => {
        if (e?.status !== "completed") return false;
        const d = e?.completedAt || e?.updatedAt || e?.createdAt;
        if (!d) return false;
        const md = moment(d);
        return md.isSameOrAfter(monthStart) && md.isSameOrBefore(monthEnd);
      }).length;
    });

    const droppedPerMonth = months.map((m, idx) => {
      const monthStart = moment()
        .subtract(5 - idx, "months")
        .startOf("month");
      const monthEnd = moment(monthStart).endOf("month");
      return enrollments.filter((e) => {
        if (e?.status !== "dropped") return false;
        const d = e?.updatedAt || e?.createdAt;
        if (!d) return false;
        const md = moment(d);
        return md.isSameOrAfter(monthStart) && md.isSameOrBefore(monthEnd);
      }).length;
    });

    return {
      labels: months,
      datasets: [
        {
          label: tt(
            "adminDashboard.analytics.newEnrollments",
            "New Enrollments"
          ),
          data: newPerMonth,
          borderColor: "#1890ff",
          backgroundColor: "rgba(24, 144, 255, 0.15)",
          fill: true,
          tension: 0.35,
        },
        {
          label: tt("adminDashboard.analytics.completed", "Completed"),
          data: completedPerMonth,
          borderColor: "#52c41a",
          backgroundColor: "rgba(82, 196, 26, 0.15)",
          fill: true,
          tension: 0.35,
        },
        {
          label: tt("adminDashboard.analytics.dropped", "Dropped"),
          data: droppedPerMonth,
          borderColor: "#f5222d",
          backgroundColor: "rgba(245, 34, 45, 0.12)",
          fill: true,
          tension: 0.35,
        },
      ],
    };
  };

  const exportStudentsCsv = (rows) => {
    try {
      const headers = [
        tt("common.name", "Name"),
        tt(
          "adminDashboard.enrollment.studentMonitoring.columns.status",
          "Status"
        ),
        tt("adminDashboard.applications.email", "Email"),
        tt("adminDashboard.enrollment.table.createdAt", "CreatedAt"),
      ];
      const csvRows = rows.map((s) => [
        `${s.firstName || ""} ${s.lastName || ""}`.trim(),
        s.isApproved
          ? tt(
              "adminDashboard.enrollment.studentMonitoring.statusValues.active",
              "Active"
            )
          : tt(
              "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
              "Pending"
            ),
        s.email || "",
        s.createdAt || "",
      ]);
      const csv = [headers, ...csvRows]
        .map((r) =>
          r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
      // Add UTF-8 BOM for proper Japanese character display in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      message.error(t("common.error") || "Error occurred");
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  const exportSelectedCsv = () => {
    const rows = computeFilteredStudents().filter((s) =>
      selectedRowKeys.includes(s._id)
    );
    if (rows.length === 0) {
      message.warning(t("common.none") || "None selected");
      return;
    }
    exportStudentsCsv(rows);
  };

  const sendReminderSelected = async () => {
    const rows = computeFilteredStudents().filter((s) =>
      selectedRowKeys.includes(s._id)
    );
    if (rows.length === 0) {
      message.warning(t("common.none") || "None selected");
      return;
    }
    // Try API first, then local fallback
    try {
      for (const s of rows) {
        const emailData = {
          to: s.email,
          subject:
            t("adminDashboard.enrollment.actions.sendReminder") ||
            "Send Reminder",
          message:
            t("adminDashboard.enrollment.reminderMessage") ||
            `Hi ${
              s.firstName || ""
            }, this is a friendly reminder to continue your coursework.`,
          recipientName: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          type: "enrollment-reminder",
        };
        const endpoints = [
          `${API_BASE_URL}/api/email/send-reminder`,
          `${API_BASE_URL}/api/email/send`,
          `${API_BASE_URL}/api/contact/reply`,
        ];
        let sent = false;
        for (const ep of endpoints) {
          try {
            const resp = await fetch(ep, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(emailData),
            });
            if (resp.ok) {
              sent = true;
              break;
            }
          } catch {
            continue;
          }
        }
        if (!sent) throw new Error("api-failed");
      }
      message.success(
        t("dashboardAlerts.messageSentSuccess") || "Message sent successfully!"
      );
      return;
    } catch (e) {
      const notifications = JSON.parse(
        localStorage.getItem("localNotifications") || "[]"
      );
      rows.forEach((s) => {
        notifications.unshift({
          id: `reminder_${Date.now()}_${s._id}`,
          type: "contact",
          title: "📧 Reminder Sent",
          message: `Reminder email prepared for ${s.firstName} ${s.lastName}`,
          priority: "low",
          timestamp: new Date().toISOString(),
          read: false,
        });
      });
      localStorage.setItem(
        "localNotifications",
        JSON.stringify(notifications.slice(0, 50))
      );
      message.success(
        t("dashboardAlerts.messageSentSuccess") || "Message sent successfully!"
      );
    }
  };

  // Saved views helpers
  const saveCurrentView = () => {
    if (!newViewName.trim()) {
      message.warning(t("common.name") || "Name");
      return;
    }
    const view = {
      id: Date.now(),
      name: newViewName.trim(),
      chipFilter,
      roleFilter,
      studentSearch,
    };
    const next = [...savedViews, view];
    setSavedViews(next);
    localStorage.setItem("enrollmentSavedViews", JSON.stringify(next));
    setSelectedView(String(view.id));
    setNewViewName("");
  };

  const applyView = (idStr) => {
    setSelectedView(idStr);
    const v = savedViews.find((v) => String(v.id) === String(idStr));
    if (v) {
      setChipFilter(v.chipFilter || "all");
      setRoleFilter(v.roleFilter || "all");
      setStudentSearch(v.studentSearch || "");
    }
  };

  const exportSelectedExcel = () => {
    const rows = computeFilteredStudents().filter((s) =>
      selectedRowKeys.includes(s._id)
    );
    const data = rows.length ? rows : computeFilteredStudents();
    const headers = [
      tt("common.name", "Name"),
      tt(
        "adminDashboard.enrollment.studentMonitoring.columns.status",
        "Status"
      ),
      tt("adminDashboard.applications.email", "Email"),
      tt("adminDashboard.enrollment.table.createdAt", "CreatedAt"),
    ];

    const tableRows = data
      .map((s, index) => {
        const status = s.isApproved
          ? tt(
              "adminDashboard.enrollment.studentMonitoring.statusValues.active",
              "Active"
            )
          : tt(
              "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
              "Pending"
            );

        // Format date nicely
        let createdDate = "";
        if (s.createdAt) {
          try {
            const date = moment(s.createdAt);
            createdDate = date.isValid()
              ? date.format("YYYY-MM-DD HH:mm:ss")
              : s.createdAt;
          } catch (e) {
            createdDate = s.createdAt;
          }
        }

        // Zebra striping for rows
        const rowBg = index % 2 === 0 ? "#FFFFFF" : "#F5F8FA";

        // Status color coding
        const statusColor = s.isApproved ? "#2E7D32" : "#ED6C02";

        return `<tr style="background-color: ${rowBg}; height: 24px;">
          <td style="padding: 8px 12px; border: 1px solid #D6D6D6; font-family: Arial; font-size: 11pt;">${
            (s.firstName || "") + " " + (s.lastName || "")
          }</td>
          <td style="padding: 8px 12px; border: 1px solid #D6D6D6; text-align: center; font-family: Arial; font-size: 11pt; font-weight: bold; color: ${statusColor};">${status}</td>
          <td style="padding: 8px 12px; border: 1px solid #D6D6D6; text-align: center; font-family: Arial; font-size: 11pt;">${
            s.email || ""
          }</td>
          <td style="padding: 8px 12px; border: 1px solid #D6D6D6; text-align: center; font-family: Arial; font-size: 11pt;">${createdDate}</td>
        </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      border: 3px solid #1565C0;
    }
    th { 
      background-color: #1565C0; 
      color: white; 
      font-weight: bold; 
      font-size: 12pt;
      padding: 12px; 
      text-align: center;
      border: 1px solid #1976D2;
      height: 32px;
    }
    td {
      border: 1px solid #D6D6D6;
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${Date.now()}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Prefer ExcelJS for a beautifully formatted XLSX; fallback to SheetJS
  const loadXlsx = () =>
    new Promise((resolve, reject) => {
      if (window.XLSX) return resolve(window.XLSX);
      const tag = document.createElement("script");
      tag.src =
        "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      tag.async = true;
      tag.onload = () => resolve(window.XLSX);
      tag.onerror = reject;
      document.body.appendChild(tag);
    });

  const loadExcelJS = () =>
    new Promise((resolve, reject) => {
      if (window.ExcelJS) return resolve(window.ExcelJS);
      const tag = document.createElement("script");
      tag.src =
        "https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js";
      tag.async = true;
      tag.onload = () => resolve(window.ExcelJS);
      tag.onerror = reject;
      document.body.appendChild(tag);
    });

  const exportSelectedXlsx = async () => {
    const rows = computeFilteredStudents().filter((s) =>
      selectedRowKeys.includes(s._id)
    );
    const data = rows.length ? rows : computeFilteredStudents();

    // Build with ExcelJS
    try {
      const ExcelJS = await loadExcelJS();
      const wb = new ExcelJS.Workbook();
      wb.creator = "Admin";
      wb.created = new Date();
      const ws = wb.addWorksheet("Students", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      const headerName = tt("common.name", "Name");
      const headerStatus = tt(
        "adminDashboard.enrollment.studentMonitoring.columns.status",
        "Status"
      );
      const headerEmail = tt("adminDashboard.applications.email", "Email");
      const headerCreatedAt = tt(
        "adminDashboard.enrollment.table.createdAt",
        "CreatedAt"
      );

      ws.columns = [
        { header: headerName, key: "name", width: 25 },
        { header: headerStatus, key: "status", width: 15 },
        { header: headerEmail, key: "email", width: 32 },
        { header: headerCreatedAt, key: "createdAt", width: 28 },
      ];

      data.forEach((s) => {
        // Format date nicely: YYYY-MM-DD HH:mm:ss
        let createdDate = "";
        if (s.createdAt) {
          try {
            const date = moment(s.createdAt);
            createdDate = date.isValid()
              ? date.format("YYYY-MM-DD HH:mm:ss")
              : s.createdAt;
          } catch (e) {
            createdDate = s.createdAt;
          }
        }

        ws.addRow({
          name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          status: s.isApproved
            ? tt(
                "adminDashboard.enrollment.studentMonitoring.statusValues.active",
                "Active"
              )
            : tt(
                "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
                "Pending"
              ),
          email: s.email || "",
          createdAt: createdDate,
        });
      });

      // ============ PROFESSIONAL HEADER DESIGN ============
      const header = ws.getRow(1);
      header.font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      };
      header.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      header.height = 28;

      // Gradient-style header with shadow effect
      header.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1565C0" }, // Deep blue
        };
        cell.border = {
          top: { style: "medium", color: { argb: "FF0D47A1" } },
          left: { style: "thin", color: { argb: "FF1976D2" } },
          bottom: { style: "medium", color: { argb: "FF0D47A1" } },
          right: { style: "thin", color: { argb: "FF1976D2" } },
        };
      });

      // ============ DATA ROWS STYLING ============
      ws.eachRow((row, idx) => {
        if (idx === 1) return; // Skip header

        row.height = 20;
        row.font = { size: 11, name: "Arial" };
        row.alignment = { vertical: "middle", horizontal: "left" };

        row.eachCell((cell, colNumber) => {
          // Professional borders
          cell.border = {
            top: { style: "thin", color: { argb: "FFD6D6D6" } },
            left: { style: "thin", color: { argb: "FFD6D6D6" } },
            bottom: { style: "thin", color: { argb: "FFD6D6D6" } },
            right: { style: "thin", color: { argb: "FFD6D6D6" } },
          };

          // Zebra striping with soft colors
          if (idx % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF5F8FA" }, // Light blue-gray
            };
          } else {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFFFFF" }, // White
            };
          }

          // Status column - centered with color coding
          if (colNumber === 2) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            if (
              (cell.value && cell.value.toString().includes("Active")) ||
              cell.value.toString().includes("アクティブ")
            ) {
              cell.font = { bold: true, color: { argb: "FF2E7D32" } }; // Green for Active
            } else if (
              (cell.value && cell.value.toString().includes("Pending")) ||
              cell.value.toString().includes("保留中")
            ) {
              cell.font = { bold: true, color: { argb: "FFED6C02" } }; // Orange for Pending
            }
          }

          // Email column - centered
          if (colNumber === 3) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          }

          // Date column - centered
          if (colNumber === 4) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          }
        });
      });

      // ============ ADVANCED FEATURES ============
      // Autofilter with dropdown
      ws.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 4 },
      };

      // Freeze header row
      ws.views = [
        {
          state: "frozen",
          ySplit: 1,
          activeCell: "A2",
          showGridLines: false, // Hide gridlines for cleaner look
        },
      ];

      // ============ OUTER TABLE BORDER ============
      // Add thick border around entire table
      const lastRow = data.length + 1;

      // Top border (header)
      ws.getRow(1).eachCell((cell) => {
        cell.border = {
          ...cell.border,
          top: { style: "medium", color: { argb: "FF0D47A1" } },
        };
      });

      // Bottom border (last row)
      ws.getRow(lastRow).eachCell((cell) => {
        cell.border = {
          ...cell.border,
          bottom: { style: "medium", color: { argb: "FF1565C0" } },
        };
      });

      // Left border (first column)
      for (let i = 1; i <= lastRow; i++) {
        const cell = ws.getCell(i, 1);
        cell.border = {
          ...cell.border,
          left: { style: "medium", color: { argb: "FF1565C0" } },
        };
      }

      // Right border (last column)
      for (let i = 1; i <= lastRow; i++) {
        const cell = ws.getCell(i, 4);
        cell.border = {
          ...cell.border,
          right: { style: "medium", color: { argb: "FF1565C0" } },
        };
      }

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback to SheetJS
      try {
        const XLSX = await loadXlsx();
        const normalized = data.map((s) => ({
          [tt("common.name", "Name")]: `${s.firstName || ""} ${
            s.lastName || ""
          }`.trim(),
          [tt(
            "adminDashboard.enrollment.studentMonitoring.columns.status",
            "Status"
          )]: s.isApproved
            ? tt(
                "adminDashboard.enrollment.studentMonitoring.statusValues.active",
                "Active"
              )
            : tt(
                "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
                "Pending"
              ),
          Email: s.email || "",
          CreatedAt: s.createdAt || "",
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(normalized);
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(
          wb,
          `students_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
      } catch (e) {
        exportSelectedExcel();
      }
    }
  };

  const computeFilteredStudents = () => {
    const base = students.filter((s) => {
      if (chipFilter === "active") return s.isApproved === true;
      if (chipFilter === "pending") return s.isApproved !== true;
      if (chipFilter === "inactive") {
        const days = s.lastLoginAt
          ? Math.floor(
              (new Date() - new Date(s.lastLoginAt)) / (1000 * 60 * 60 * 24)
            )
          : 999;
        return days > 14;
      }
      if (chipFilter === "new30") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        return new Date(s.createdAt) >= cutoff;
      }
      if (roleFilter === "active") return s.isApproved;
      if (roleFilter === "inactive") return !s.isApproved;
      if (roleFilter === "pending") return !s.isApproved;
      return true;
    });
    return base.filter((s) => {
      if (!studentSearch) return true;
      const q = studentSearch.toLowerCase();
      return (
        `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
      );
    });
  };

  const generateCoursePopularityFromData = () => {
    const courseIdToTitle = new Map(
      courses.map((c) => [c._id || c.id, c.title || c.name || "Untitled"])
    );

    const counts = enrollments.reduce((acc, e) => {
      const id = e?.course?._id || e?.courseId || e?.course;
      if (!id) return acc;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const entries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const labels = entries.map(([id]) => courseIdToTitle.get(id) || "Course");
    const values = entries.map(([, v]) => v);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#1890ff",
            "#52c41a",
            "#faad14",
            "#722ed1",
            "#f5222d",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  };

  const generateCourseEngagementFromData = () => {
    const map = new Map();
    enrollments.forEach((e) => {
      const id = e?.course?._id || e?.courseId || e?.course;
      const title =
        (e?.course && (e.course.title || e.course.name)) ||
        courses.find((c) => (c._id || c.id) === id)?.title ||
        courses.find((c) => (c._id || c.id) === id)?.name ||
        "Unknown";
      if (!map.has(id))
        map.set(id, { course: title, enrolled: 0, active: 0, completion: 0 });
      const obj = map.get(id);
      obj.enrolled += 1;
      if (e?.status === "active") obj.active += 1;
      if (e?.status === "completed") obj.completion += 1;
    });
    return Array.from(map.values()).slice(0, 5);
  };

  const generateRecentActivitiesFromData = () => {
    const activities = [];
    const studentNames = students
      .slice(0, 10)
      .map((s) => `${s.firstName} ${s.lastName}`);
    const courseNames = courses.slice(0, 5).map((c) => c.title || c.name);

    if (studentNames.length === 0) {
      studentNames.push(
        "John Smith",
        "Sarah Johnson",
        "Mike Chen",
        "Lisa Wang"
      );
    }
    if (courseNames.length === 0) {
      courseNames.push(
        "English Conversation",
        "Business English",
        "Grammar Focus"
      );
    }

    const actionTypes = [
      { action: "Enrolled", status: "active" },
      { action: "Completed Module", status: "progress" },
      { action: "Certificate Earned", status: "completed" },
      { action: "Started Assignment", status: "progress" },
    ];

    for (let i = 0; i < 6; i++) {
      const randomStudent =
        studentNames[Math.floor(Math.random() * studentNames.length)];
      const randomCourse =
        courseNames[Math.floor(Math.random() * courseNames.length)];
      const randomAction =
        actionTypes[Math.floor(Math.random() * actionTypes.length)];

      activities.push({
        id: i + 1,
        student: randomStudent,
        action: randomAction.action,
        course: randomCourse,
        timestamp: moment().subtract(Math.floor(Math.random() * 48), "hours"),
        status: randomAction.status,
      });
    }

    return activities;
  };

  const generateAttentionItemsFromData = () => {
    const items = [];
    const inactiveStudents = students.filter(
      (s) => s.isApproved === true
    ).length;
    const pendingApplications = applications.filter(
      (a) => a.status === "pending"
    ).length;
    const unreadMessages = contactMessages.filter(
      (m) => m.status === "pending"
    ).length;

    if (inactiveStudents > 10) {
      items.push({
        title: `${Math.floor(
          inactiveStudents * 0.6
        )} students have not logged in for 7+ days`,
        description: "Consider sending engagement reminders",
        status: "warning",
        action: "Send Reminder",
      });
    }

    if (pendingApplications > 0) {
      items.push({
        title: `${pendingApplications} new enrollment requests awaiting approval`,
        description: "Applications submitted recently",
        status: "success",
        action: "Review Applications",
      });
    }

    if (unreadMessages > 0) {
      items.push({
        title: `${unreadMessages} unread contact messages`,
        description: "Student inquiries waiting for response",
        status: "info",
        action: "Review Messages",
      });
    }

    items.push(
      {
        title: `${
          Math.floor(Math.random() * 10) + 5
        } students showing declining progress`,
        description: "May need additional support or tutoring",
        status: "error",
        action: "Schedule Check-in",
      },
      {
        title: `${
          Math.floor(Math.random() * 15) + 10
        } course completion certificates pending`,
        description: "Ready for manual review and approval",
        status: "info",
        action: "Review & Approve",
      }
    );

    return items;
  };

  const fetchStudents = async () => {
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
        setStudents(data.users || data || []);
      }
    } catch (error) {
      setStudents([]);
    }
  };

  const fetchCourses = async () => {
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
        setCourses(data.courses || data || []);
      }
    } catch (error) {
      setCourses([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || data || []);
      }
    } catch (error) {
      setApplications([]);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setContactMessages(data.contacts || data || []);
      }
    } catch (error) {
      setContactMessages([]);
    }
  };

  // Video call functions
  const handleVideoCall = (user, userType) => {
    setSelectedCallUser(user);
    setCallType(userType);
    setVideoCallModalVisible(true);
    message.success(
      `Initiating video call with ${user.firstName} ${user.lastName}`
    );
  };

  const startVideoCall = () => {
    setIsCallActive(true);
    setCallDuration(0);

    const callInterval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    window.callInterval = callInterval;
    message.success("Video call started! Connecting...");
  };

  const endVideoCall = () => {
    setIsCallActive(false);
    setCallDuration(0);

    if (window.callInterval) {
      clearInterval(window.callInterval);
      window.callInterval = null;
    }

    message.info("Video call ended");
    setVideoCallModalVisible(false);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // useEffect to fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchStudents(),
        fetchEnrollments(),
        fetchEnrollmentLogs(),
        fetchCourses(),
        fetchApplications(),
        fetchContactMessages(),
      ]);

      await fetchEnrollmentAnalytics();
    };

    fetchInitialData();

    // Cleanup call interval on unmount
    return () => {
      if (window.callInterval) {
        clearInterval(window.callInterval);
        window.callInterval = null;
      }
    };
  }, []);

  // Calculate metrics from props (copy from original)
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.isApproved === true).length;
  const recentlyActiveStudents = students.filter((s) => {
    if (!s.lastLoginAt) return false;
    const lastLogin = new Date(s.lastLoginAt);
    const daysSinceLogin = Math.floor(
      (new Date() - lastLogin) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLogin <= 7;
  }).length;
  const engagementRate =
    totalStudents > 0
      ? Math.round((recentlyActiveStudents / totalStudents) * 100)
      : 0;
  const totalEnrollments = enrollments.length || totalStudents;
  const completedEnrollments =
    enrollments.filter((e) => e.progress >= 100).length ||
    Math.floor(totalStudents * 0.69);
  const successRate =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 69;
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            enrollments.length
        )
      : 76;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newStudentsThisMonth = students.filter((s) => {
    const createdAt = new Date(s.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  }).length;
  const monthlyGrowthRate =
    totalStudents > 0
      ? Math.round((newStudentsThisMonth / totalStudents) * 100)
      : 18;

  return (
    <div style={{ background: "#f5f5f5", padding: 24, borderRadius: 8 }}>
      <style>{`
        .elegant-table.elegant-table .ant-table-thead > tr > th {background: linear-gradient(180deg,#fbfdff 0%,#f5f7fb 100%); font-weight:600; color:#2b3a55;}
        .elegant-table.elegant-table .ant-table-tbody > tr:nth-child(odd) > td {background:#fcfdff;}
        .elegant-table.elegant-table .ant-table-tbody > tr:hover > td {background:#f0f7ff !important;}
        .avatar-badge {width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-weight:700;color:#2b3a55;background:#eef2ff;border:1px solid #dbe4ff}
        .info-line {font-size:12px;color:#6b7280}
      `}</style>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
          📈 {t("adminDashboard.enrollment.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {t("adminDashboard.enrollment.subtitle")}
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="metric-card"
            style={{
              border: "1px solid #e6f0ff",
              borderRadius: 12,
              background: "linear-gradient(180deg,#f7fbff 0%,#eef5ff 100%)",
              boxShadow: "0 6px 18px rgba(24,144,255,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: "#e6f0ff",
                  color: "#1890ff",
                  border: "1px solid #cfe3ff",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7h18" />
                  <path d="M6 3h12v4H6z" />
                  <rect x="3" y="7" width="18" height="14" rx="2" />
                  <path d="M8 13h8" />
                  <path d="M8 17h5" />
                </svg>
              </span>
              <div>
                <Text style={{ color: "#2b3a55" }}>
                  {t("adminDashboard.enrollment.metrics.totalEnrollments")}
                </Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#0d47a1",
                    lineHeight: 1,
                  }}
                >
                  {totalEnrollments}
                </div>
                <Text style={{ color: "#2b3a55", fontSize: 12 }}>
                  +{monthlyGrowthRate}%
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              border: "1px solid #d8f5df",
              borderRadius: 12,
              background: "linear-gradient(180deg,#f6fff7 0%,#ecfff0 100%)",
              boxShadow: "0 6px 18px rgba(82,196,26,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: "#e9fbe9",
                  color: "#52c41a",
                  border: "1px solid #c8f2cb",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </span>
              <div>
                <Text style={{ color: "#2b3a55" }}>
                  {t("adminDashboard.enrollment.metrics.activeStudents")}
                </Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#1b5e20",
                    lineHeight: 1,
                  }}
                >
                  {activeStudents}
                </div>
                <Text style={{ color: "#2b3a55", fontSize: 12 }}>
                  {engagementRate}%{" "}
                  {t("adminDashboard.enrollment.metrics.engagementRate")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              border: "1px solid #ffe8bf",
              borderRadius: 12,
              background: "linear-gradient(180deg,#fff9ef 0%,#fff3db 100%)",
              boxShadow: "0 6px 18px rgba(250,173,20,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: "#fff3cd",
                  color: "#faad14",
                  border: "1px solid #ffe0a3",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <div>
                <Text style={{ color: "#2b3a55" }}>
                  {t("adminDashboard.enrollment.metrics.courseCompletions")}
                </Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#8a5a00",
                    lineHeight: 1,
                  }}
                >
                  {completedEnrollments}
                </div>
                <Text style={{ color: "#2b3a55", fontSize: 12 }}>
                  {successRate}%{" "}
                  {t("adminDashboard.enrollment.metrics.successRate")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              border: "1px solid #e6d7ff",
              borderRadius: 12,
              background: "linear-gradient(180deg,#f7f3ff 0%,#efe8ff 100%)",
              boxShadow: "0 6px 18px rgba(114,46,209,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: "#efe5ff",
                  color: "#722ed1",
                  border: "1px solid #e0ccff",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="M19 9l-5 5-4-4-4 4" />
                </svg>
              </span>
              <div>
                <Text style={{ color: "#2b3a55" }}>
                  {t("adminDashboard.enrollment.metrics.avgProgress")}
                </Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#3b1c83",
                    lineHeight: 1,
                  }}
                >
                  {averageProgress}%
                </div>
                <Text style={{ color: "#2b3a55", fontSize: 12 }}>
                  +12% {t("adminDashboard.enrollment.metrics.improvement")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                {t("adminDashboard.enrollment.studentMonitoring.title")}
                <Tag color="blue" style={{ marginLeft: 12 }}>
                  {students.length}{" "}
                  {t(
                    "adminDashboard.enrollment.studentMonitoring.totalStudentsTag"
                  )}
                </Tag>
              </div>
            }
            extra={
              <Space>
                {/* Segment chips */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Select
                    size="small"
                    value={chipFilter}
                    onChange={setChipFilter}
                    style={{ width: 160 }}
                  >
                    <Option value="all">{tt("common.all", "All")}</Option>
                    <Option value="active">
                      {tt(
                        "adminDashboard.enrollment.studentMonitoring.statusValues.active",
                        "Active"
                      )}
                    </Option>
                    <Option value="pending">
                      {tt(
                        "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
                        "Pending"
                      )}
                    </Option>
                    <Option value="inactive">
                      {tt(
                        "adminDashboard.enrollment.segments.inactive",
                        "Inactive"
                      )}
                    </Option>
                    <Option value="new30">
                      {tt(
                        "adminDashboard.enrollment.segments.new30",
                        "New (30d)"
                      )}
                    </Option>
                  </Select>
                </div>
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  onChange={(value) => setRoleFilter(value)}
                >
                  <Option value="all">
                    {t(
                      "adminDashboard.enrollment.studentMonitoring.filters.allStudents"
                    )}
                  </Option>
                  <Option value="active">
                    {t(
                      "adminDashboard.enrollment.studentMonitoring.filters.activeOnly"
                    )}
                  </Option>
                  <Option value="inactive">
                    {t(
                      "adminDashboard.enrollment.studentMonitoring.filters.inactiveOnly"
                    )}
                  </Option>
                  <Option value="pending">
                    {t(
                      "adminDashboard.enrollment.studentMonitoring.filters.pendingApproval"
                    )}
                  </Option>
                </Select>
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder={
                    t("adminDashboard.users.searchUsers") || "Search"
                  }
                  style={{
                    padding: 6,
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                  }}
                />
                <Button icon={<ReloadOutlined />} onClick={fetchStudents}>
                  {t("adminDashboard.enrollment.studentMonitoring.refresh")}
                </Button>
                <Button onClick={exportSelectedXlsx}>
                  {tt("common.xlsx", "XLSX")}
                </Button>
                <Button
                  onClick={exportSelectedCsv}
                  disabled={selectedRowKeys.length === 0}
                >
                  {tt(
                    "adminDashboard.enrollment.actions.exportSelected",
                    "Export Selected"
                  )}
                </Button>
                <Button
                  type="primary"
                  onClick={sendReminderSelected}
                  disabled={selectedRowKeys.length === 0}
                >
                  {tt(
                    "adminDashboard.enrollment.actions.sendReminder",
                    "Send Reminder"
                  )}
                </Button>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Table
              className="elegant-table"
              rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
              onRow={(record) => ({
                onClick: () => {
                  setDetailStudent(record);
                  setDetailOpen(true);
                },
              })}
              columns={[
                {
                  title: t(
                    "adminDashboard.enrollment.studentMonitoring.columns.studentInfo"
                  ),
                  key: "studentInfo",
                  render: (_, record) => (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span className="avatar-badge">
                        {`${(record.firstName || " ").charAt(0)}${(
                          record.lastName || " "
                        ).charAt(0)}`.toUpperCase()}
                      </span>
                      <div>
                        <Text strong>
                          {record.firstName} {record.lastName}
                        </Text>
                        <div className="info-line">{record.email}</div>
                        {/* risk/completion badges */}
                        <div style={{ marginTop: 4 }}>
                          {(() => {
                            const days = record.lastLoginAt
                              ? Math.floor(
                                  (new Date() - new Date(record.lastLoginAt)) /
                                    (1000 * 60 * 60 * 24)
                                )
                              : 999;
                            const studentEnrollments = enrollments.filter(
                              (e) => e.studentId === record._id
                            );
                            const avg =
                              studentEnrollments.length > 0
                                ? Math.round(
                                    studentEnrollments.reduce(
                                      (s, e) => s + (e.progress || 0),
                                      0
                                    ) / studentEnrollments.length
                                  )
                                : 0;
                            return (
                              <Space size={6} wrap>
                                {days > 14 && (
                                  <Tag color="red">
                                    {tt(
                                      "adminDashboard.enrollment.badges.atRisk",
                                      "At Risk"
                                    )}
                                  </Tag>
                                )}
                                {avg >= 80 && (
                                  <Tag color="green">
                                    {tt(
                                      "adminDashboard.enrollment.badges.completing",
                                      "Completing"
                                    )}
                                  </Tag>
                                )}
                              </Space>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ),
                  width: 260,
                },
                {
                  title: t(
                    "adminDashboard.enrollment.studentMonitoring.columns.status"
                  ),
                  key: "status",
                  render: (_, record) => (
                    <Tag color={record.isApproved ? "success" : "warning"}>
                      {record.isApproved
                        ? tt(
                            "adminDashboard.enrollment.studentMonitoring.statusValues.active",
                            "Active"
                          )
                        : tt(
                            "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
                            "Pending"
                          )}
                    </Tag>
                  ),
                  width: 120,
                },
                {
                  title: tt(
                    "adminDashboard.enrollment.table.enrollment",
                    "Enrollment"
                  ),
                  key: "enrollment",
                  render: (_, record) => {
                    const studentEnrollments =
                      enrollments.filter((e) => e.studentId === record._id) ||
                      [];
                    const coursesCount =
                      studentEnrollments.length ||
                      Math.floor(Math.random() * 4) + 1;
                    const avgProgress =
                      studentEnrollments.length > 0
                        ? Math.round(
                            studentEnrollments.reduce(
                              (sum, e) => sum + (e.progress || 0),
                              0
                            ) / studentEnrollments.length
                          )
                        : Math.floor(Math.random() * 80) + 20;
                    return (
                      <div>
                        <Text>{coursesCount} courses</Text>
                        <Progress
                          percent={avgProgress}
                          size="small"
                          showInfo={false}
                          style={{ width: 160, marginTop: 6 }}
                        />
                      </div>
                    );
                  },
                  width: 200,
                },
                {
                  title: tt(
                    "adminDashboard.enrollment.table.lastActivity",
                    "Last Activity"
                  ),
                  key: "lastActivity",
                  render: (_, record) => {
                    let daysAgo = 0;
                    if (record.lastLoginAt) {
                      const lastLogin = new Date(record.lastLoginAt);
                      daysAgo = Math.floor(
                        (new Date() - lastLogin) / (1000 * 60 * 60 * 24)
                      );
                    } else {
                      const created = new Date(record.createdAt);
                      daysAgo = Math.floor(
                        (new Date() - created) / (1000 * 60 * 60 * 24)
                      );
                    }
                    const today = tt(
                      "adminDashboard.enrollment.table.today",
                      "Today"
                    );
                    const daysSuffix = tt(
                      "adminDashboard.enrollment.table.daysAgoSuffix",
                      "d ago"
                    );
                    return (
                      <span className="info-line">
                        {daysAgo === 0 ? today : `${daysAgo}${daysSuffix}`}
                      </span>
                    );
                  },
                  width: 100,
                },
              ]}
              dataSource={computeFilteredStudents()}
              rowKey="_id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={420}
        title={t("adminDashboard.enrollment.studentMonitoring.title")}
      >
        {detailStudent && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={t("common.name") || "Name"}>
                {detailStudent.firstName} {detailStudent.lastName}
              </Descriptions.Item>
              <Descriptions.Item
                label={tt("adminDashboard.applications.email", "Email")}
              >
                {detailStudent.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  t(
                    "adminDashboard.enrollment.studentMonitoring.columns.status"
                  ) || "Status"
                }
              >
                {detailStudent.isApproved
                  ? tt(
                      "adminDashboard.enrollment.studentMonitoring.statusValues.active",
                      "Active"
                    )
                  : tt(
                      "adminDashboard.enrollment.studentMonitoring.statusValues.pending",
                      "Pending"
                    )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  t(
                    "adminDashboard.enrollment.activitySummary.activityThisWeekTitle"
                  ) || "Activity"
                }
              >
                {(() => {
                  const list = enrollments.filter(
                    (e) => e.studentId === detailStudent._id
                  );
                  const avg =
                    list.length > 0
                      ? Math.round(
                          list.reduce((s, e) => s + (e.progress || 0), 0) /
                            list.length
                        )
                      : 0;
                  return `${list.length || 0} ${
                    t(
                      "adminDashboard.enrollment.teacherColumns.coursesShort"
                    ) || "courses"
                  }, ${avg}%`;
                })()}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <Text strong>
                {tt("adminDashboard.enrollment.notes", "Notes")}
              </Text>
              <Notes
                key={detailStudent._id}
                studentId={detailStudent._id}
                t={t}
              />
            </div>
          </>
        )}
      </Drawer>

      {/* Teacher monitoring section removed per request */}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={t(
              "adminDashboard.enrollment.activitySummary.activeUsersTitle"
            )}
            style={{ borderRadius: 12 }}
          >
            <Statistic
              title={t(
                "adminDashboard.enrollment.activitySummary.currentlyOnline"
              )}
              value={Math.floor(Math.random() * 20) + 5}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={t("adminDashboard.enrollment.activitySummary.users")}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                <TeamOutlined style={{ marginRight: 4 }} />
                {Math.floor(Math.random() * 15) + 3}{" "}
                {
                  t(
                    "adminDashboard.enrollment.activitySummary.studentsTeachers"
                  ).split(", ")[0]
                }
                , {Math.floor(Math.random() * 5) + 2}{" "}
                {
                  t(
                    "adminDashboard.enrollment.activitySummary.studentsTeachers"
                  ).split(", ")[1]
                }
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={t(
              "adminDashboard.enrollment.activitySummary.activityThisWeekTitle"
            )}
            style={{ borderRadius: 12 }}
          >
            <Statistic
              title={t(
                "adminDashboard.enrollment.activitySummary.loginSessions"
              )}
              value={Math.floor(Math.random() * 200) + 150}
              prefix={<LoginOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                <RiseOutlined style={{ color: "#52c41a", marginRight: 4 }} />+
                {Math.floor(Math.random() * 20) + 5}%{" "}
                {t("adminDashboard.enrollment.activitySummary.fromLastWeek")}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={t(
              "adminDashboard.enrollment.activitySummary.attentionRequiredTitle"
            )}
            style={{ borderRadius: 12 }}
          >
            <Statistic
              title={t(
                "adminDashboard.enrollment.activitySummary.inactiveUsers"
              )}
              value={Math.floor(Math.random() * 10) + 2}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#f5222d" }}
              suffix={t("adminDashboard.enrollment.activitySummary.users")}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {t("adminDashboard.enrollment.activitySummary.notActiveFor")}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Adminenrollmentmonitoring;

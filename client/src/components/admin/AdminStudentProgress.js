import React, { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Button,
  Input,
  Select,
  Progress,
  Tooltip,
  message,
  Modal,
  Descriptions,
  Tag,
  Avatar,
  Divider,
  Empty,
  Badge,
  Spin,
  Checkbox,
  Slider,
  Form,
  DatePicker,
  Tabs,
  Timeline,
  Radio,
  Popconfirm,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CheckSquareOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EyeOutlined,
  StarOutlined,
  WarningOutlined,
  RiseOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BookOutlined,
  CloseOutlined,
  FilterOutlined,
  SendOutlined,
  FileTextOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";
import { progressAPI, courseAPI, homeworkSubmissionAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminStudentProgress = ({
  t,
  setSelectedProgress,
  setProgressModalVisible,
}) => {
  const history = useHistory();
  const { i18n } = useTranslation();

  // Context
  const context = useContext(AdminContext);

  // Local state
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalFilteredStudents, setTotalFilteredStudents] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentProgressData, setStudentProgressData] = useState({});
  const [studentEnrollments, setStudentEnrollments] = useState({});
  const [studentLastActivity, setStudentLastActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [progressRange, setProgressRange] = useState([0, 100]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [enrollmentDateRange, setEnrollmentDateRange] = useState(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageForm] = Form.useForm();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [studentNotes, setStudentNotes] = useState({});
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [progressHistory, setProgressHistory] = useState({});

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?role=student`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const studentsList = data.users || data || [];
        setStudents(studentsList);
        
        // Fetch progress data for each student
        await fetchStudentProgressData(studentsList);
        // Fetch enrollment data
        await fetchEnrollmentsData(studentsList);
        // Fetch last activity data
        await fetchLastActivityData(studentsList);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for enrollment data
  const fetchCourses = async () => {
    try {
      const coursesData = await courseAPI.getAll();
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  // Fetch real progress data for all students
  const fetchStudentProgressData = async (studentsList) => {
    try {
      const progressMap = {};
      
      // Fetch all progress records
      const allProgress = await progressAPI.getAll();
      const progressRecords = Array.isArray(allProgress) ? allProgress : allProgress.progress || [];
      
      // Calculate progress for each student
      for (const student of studentsList) {
        const studentProgress = progressRecords.filter(
          (p) => p.student?._id === student._id || p.student === student._id
        );
        
        if (studentProgress.length > 0) {
          // Calculate average progress from all progress records
          const avgProgress = Math.round(
            studentProgress.reduce((sum, p) => sum + (p.percentage || 0), 0) / studentProgress.length
          );
          progressMap[student._id] = Math.min(100, Math.max(0, avgProgress));
        } else {
          // Try to fetch individual student summary
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/progress/student/${student._id}/summary`,
              { headers: getAuthHeaders() }
            );
            if (response.ok) {
              const summary = await response.json();
              if (summary.averageScore) {
                progressMap[student._id] = Math.round(summary.averageScore);
              }
            }
          } catch (e) {
            // Fallback to 0 if no progress found
            progressMap[student._id] = 0;
          }
        }
      }
      
      setStudentProgressData(progressMap);
    } catch (error) {
      console.error("Error fetching student progress:", error);
      // Fallback to empty map
      setStudentProgressData({});
    }
  };

  // Fetch enrollment data for students
  const fetchEnrollmentsData = async (studentsList) => {
    try {
      const enrollmentMap = {};
      
      // Fetch all courses with enrollment data
      const coursesData = await courseAPI.getAll();
      const coursesList = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
      
      for (const student of studentsList) {
        const enrolledCourses = coursesList.filter((course) => {
          if (Array.isArray(course.students)) {
            return course.students.some(
              (s) => (s._id || s) === student._id || (s._id || s)?.toString() === student._id?.toString()
            );
          }
          return false;
        });
        enrollmentMap[student._id] = enrolledCourses.length;
      }
      
      setStudentEnrollments(enrollmentMap);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setStudentEnrollments({});
    }
  };

  // Fetch last activity data from submissions
  const fetchLastActivityData = async (studentsList) => {
    try {
      const activityMap = {};
      
      for (const student of studentsList) {
        let lastActivity = null;
        
        // Try to fetch homework submissions
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/homework-submissions?student=${student._id}`,
            { headers: getAuthHeaders() }
          );
          if (response.ok) {
            const submissions = await response.json();
            if (Array.isArray(submissions) && submissions.length > 0) {
              const submissionDates = submissions
                .map((s) => s.submittedAt || s.createdAt)
                .filter(Boolean)
                .map((d) => new Date(d));
              if (submissionDates.length > 0) {
                const latest = new Date(Math.max(...submissionDates));
                if (!lastActivity || latest > new Date(lastActivity)) {
                  lastActivity = latest;
                }
              }
            }
          }
        } catch (e) {
          // Continue to other sources
        }
        
        // Use student's last login or registration date as fallback
        if (!lastActivity) {
          if (student.lastLogin) {
            lastActivity = new Date(student.lastLogin);
          } else if (student.updatedAt) {
            lastActivity = new Date(student.updatedAt);
          } else if (student.createdAt) {
            lastActivity = new Date(student.createdAt);
          }
        }
        
        activityMap[student._id] = lastActivity;
      }
      
      setStudentLastActivity(activityMap);
    } catch (error) {
      console.error("Error fetching last activity:", error);
      setStudentLastActivity({});
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCourses();
      await fetchStudents();
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        activeStudents: 0,
        avgProgress: 0,
        completionRate: 0,
        excellentPerformers: 0,
        atRiskStudents: 0,
        progressData: [],
      };
    }

    const activeStudents = students.filter((s) => s.isApproved === true);
    
    // Use real progress data instead of random
    const progressData = students.map((student) => {
      return studentProgressData[student._id] ?? 0;
    });
    
    const avgProgress = progressData.length > 0
      ? Math.round(progressData.reduce((s, p) => s + p, 0) / progressData.length)
      : 0;
      
    const completionRate = progressData.length > 0
      ? Math.round((progressData.filter((p) => p >= 80).length / progressData.length) * 100)
      : 0;
      
    const excellentPerformers = progressData.filter((p) => p >= 90).length;
    const atRiskStudents = progressData.filter((p) => p < 40).length;
    
    return {
      totalStudents: students.length,
      activeStudents: activeStudents.length,
      avgProgress,
      completionRate,
      excellentPerformers,
      atRiskStudents,
      progressData,
    };
  }, [students, studentProgressData]);

  // Handle view student profile
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
    // Also call parent handlers if provided
    if (setSelectedProgress) setSelectedProgress(student);
    if (setProgressModalVisible) setProgressModalVisible(true);
    // Fetch progress history for the student
    fetchStudentProgressHistory(student._id);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
    if (setProgressModalVisible) setProgressModalVisible(false);
  };

  // Fetch progress history for a student
  const fetchStudentProgressHistory = async (studentId) => {
    try {
      const allProgress = await progressAPI.getAll();
      const progressRecords = Array.isArray(allProgress) ? allProgress : allProgress.progress || [];
      const studentProgress = progressRecords
        .filter((p) => (p.student?._id || p.student) === studentId)
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 10); // Get last 10 records
      setProgressHistory({ [studentId]: studentProgress });
    } catch (error) {
      console.error("Error fetching progress history:", error);
    }
  };

  // Handle bulk selection
  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(paginatedStudents.map((s) => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle bulk message
  const handleBulkMessage = () => {
    if (selectedStudents.length === 0) {
      message.warning(t("adminDashboard.students.noStudentsSelected") || "No students selected");
      return;
    }
    setMessageModalVisible(true);
  };

  // Handle send message
  const handleSendMessage = async (values) => {
    try {
      setSendingMessage(true);
      const recipients = selectedStudent 
        ? [selectedStudent] 
        : students.filter((s) => selectedStudents.includes(s._id));

      for (const student of recipients) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/send-message`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: student.email,
              subject: values.subject,
              message: values.message,
              recipientName: `${student.firstName} ${student.lastName}`,
              recipientId: student._id,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send message");
          }
        } catch (error) {
          console.error(`Error sending message to ${student.email}:`, error);
        }
      }

      message.success(
        t("adminDashboard.students.messageSent") || 
        `Message sent to ${recipients.length} student(s)`
      );
      setMessageModalVisible(false);
      messageForm.resetFields();
      setSelectedStudents([]);
      if (!selectedStudent) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error(t("adminDashboard.students.messageError") || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Helper function to generate styled Excel export
  const generateStyledExcel = async (studentList, fileName, showSummary = true) => {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Forum Academy";
    workbook.created = new Date();
    workbook.modified = new Date();

    const isJapanese = i18n.language === "ja";

    if (showSummary && studentList.length > 1) {
      // Create Summary Sheet
      const summarySheet = workbook.addWorksheet(isJapanese ? "概要" : "Summary");
      summarySheet.getColumn(1).width = 30;
      summarySheet.getColumn(2).width = 20;
      summarySheet.getColumn(3).width = 25;

      // Calculate summary stats
      const totalStudents = studentList.length;
      const activeStudents = studentList.filter((s) => s.isApproved).length;
      const progressValues = studentList.map((s) => getStudentProgress(s));
      const avgProgress = progressValues.reduce((a, b) => a + b, 0) / progressValues.length || 0;
      const completionRate = Math.round((progressValues.filter((p) => p >= 80).length / totalStudents) * 100) || 0;
      const excellentPerformers = progressValues.filter((p) => p >= 90).length;
      const atRiskStudents = progressValues.filter((p) => p < 40).length;

      // Summary Header
      const summaryHeaderRow = summarySheet.getRow(2);
      summaryHeaderRow.getCell(1).value = isJapanese ? "📊 学生進捗レポート" : "📊 Student Progress Report";
      summaryHeaderRow.getCell(1).font = { size: 24, bold: true, color: { argb: "FFFFFFFF" } };
      summaryHeaderRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF667eea" },
      };
      summaryHeaderRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      summarySheet.mergeCells(2, 1, 2, 3);
      summaryHeaderRow.height = 45;

      // Summary Subtitle
      const subtitleRow = summarySheet.getRow(3);
      subtitleRow.getCell(1).value = moment().format(isJapanese ? "YYYY年MM月DD日 HH:mm" : "MMMM DD, YYYY HH:mm");
      subtitleRow.getCell(1).font = { size: 12, italic: true, color: { argb: "FF667eea" } };
      subtitleRow.getCell(1).alignment = { horizontal: "center" };
      summarySheet.mergeCells(3, 1, 3, 3);
      subtitleRow.height = 20;

      // Summary Statistics
      const statsLabels = [
        { label: isJapanese ? "総学生数" : "Total Students", value: totalStudents },
        { label: isJapanese ? "アクティブ学生" : "Active Students", value: activeStudents },
        { label: isJapanese ? "平均進捗" : "Average Progress", value: `${avgProgress.toFixed(1)}%` },
        { label: isJapanese ? "完了率" : "Completion Rate", value: `${completionRate}%` },
        { label: isJapanese ? "優秀な成績者" : "Excellent Performers", value: excellentPerformers },
        { label: isJapanese ? "リスク学生" : "At Risk Students", value: atRiskStudents },
      ];

      statsLabels.forEach((stat, index) => {
        const row = summarySheet.getRow(6 + index);
        row.getCell(1).value = stat.label;
        row.getCell(1).font = { size: 12, bold: true, color: { argb: "FF495057" } };
        row.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8F9FA" },
        };
        row.getCell(1).border = {
          top: { style: "thin", color: { argb: "FFDEE2E6" } },
          bottom: { style: "thin", color: { argb: "FFDEE2E6" } },
          left: { style: "thin", color: { argb: "FFDEE2E6" } },
          right: { style: "thin", color: { argb: "FFDEE2E6" } },
        };
        row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row.getCell(1).padding = { left: 10, top: 8, bottom: 8 };

        row.getCell(2).value = stat.value;
        row.getCell(2).font = { size: 12, bold: true, color: { argb: "FF667eea" } };
        row.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6E8FF" },
        };
        row.getCell(2).border = {
          top: { style: "thin", color: { argb: "FFDEE2E6" } },
          bottom: { style: "thin", color: { argb: "FFDEE2E6" } },
          left: { style: "thin", color: { argb: "FFDEE2E6" } },
          right: { style: "thin", color: { argb: "FFDEE2E6" } },
        };
        row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
        row.height = 30;
      });
    }

    // Create Student Data Sheet
    const dataSheet = workbook.addWorksheet(isJapanese ? "学生データ" : "Student Data");
    
    // Define columns with proper widths
    const columns = [
      { header: isJapanese ? "学生名" : "Student Name", key: "name", width: 25 },
      { header: isJapanese ? "メール" : "Email", key: "email", width: 30 },
      { header: isJapanese ? "ステータス" : "Status", key: "status", width: 15 },
      { header: isJapanese ? "進捗 (%)" : "Progress (%)", key: "progress", width: 15 },
      { header: isJapanese ? "登録コース数" : "Enrolled Courses", key: "courses", width: 18 },
      { header: isJapanese ? "最終活動" : "Last Activity", key: "lastActivity", width: 18 },
      { header: isJapanese ? "承認済み" : "Approved", key: "approved", width: 12 },
      { header: isJapanese ? "登録日" : "Registration Date", key: "regDate", width: 18 },
    ];

    dataSheet.columns = columns;

    // Style header row
    const headerRow = dataSheet.getRow(1);
    headerRow.height = 35;
    headerRow.font = { size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF667eea" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    headerRow.border = {
      top: { style: "thin", color: { argb: "FF4C63D2" } },
      bottom: { style: "thin", color: { argb: "FF4C63D2" } },
      left: { style: "thin", color: { argb: "FF4C63D2" } },
      right: { style: "thin", color: { argb: "FF4C63D2" } },
    };

    // Add data rows with conditional formatting
    studentList.forEach((student) => {
      const progress = getStudentProgress(student);
      const status =
        progress >= 90
          ? isJapanese ? "優秀" : "Excellent"
          : progress >= 70
          ? isJapanese ? "良好" : "Good"
          : progress >= 40
          ? isJapanese ? "平均" : "Average"
          : isJapanese ? "リスク" : "At Risk";
      
      const enrolledCount = getStudentEnrollments(student);
      const lastActivity = getStudentLastActivity(student);
      const activityDate = lastActivity ? moment(lastActivity) : moment(student.createdAt);

      const row = dataSheet.addRow({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        status: status,
        progress: progress,
        courses: enrolledCount,
        lastActivity: activityDate.format(isJapanese ? "YYYY年MM月DD日" : "MMM DD, YYYY"),
        approved: student.isApproved ? (isJapanese ? "はい" : "Yes") : (isJapanese ? "いいえ" : "No"),
        regDate: moment(student.createdAt).format(isJapanese ? "YYYY年MM月DD日" : "MMM DD, YYYY"),
      });

      // Style status cell based on progress
      const statusCell = row.getCell(3);
      const progressCell = row.getCell(4);
      
      if (progress >= 90) {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF52C41A" } };
        statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        progressCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F7FF" } };
        progressCell.font = { color: { argb: "FF52C41A" }, bold: true };
      } else if (progress >= 70) {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1890FF" } };
        statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        progressCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F7FF" } };
        progressCell.font = { color: { argb: "FF1890FF" }, bold: true };
      } else if (progress >= 40) {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFA940" } };
        statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        progressCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7E6" } };
        progressCell.font = { color: { argb: "FFFFA940" }, bold: true };
      } else {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF4D4F" } };
        statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        progressCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFE6E6" } };
        progressCell.font = { color: { argb: "FFFF4D4F" }, bold: true };
      }

      // Style approved cell
      const approvedCell = row.getCell(7);
      if (student.isApproved) {
        approvedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } };
        approvedCell.font = { color: { argb: "FF155724" }, bold: true };
      } else {
        approvedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFE5E5" } };
        approvedCell.font = { color: { argb: "FF721C24" }, bold: true };
      }

      // Apply borders and alignment to all cells
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE8E8E8" } },
          bottom: { style: "thin", color: { argb: "FFE8E8E8" } },
          left: { style: "thin", color: { argb: "FFE8E8E8" } },
          right: { style: "thin", color: { argb: "FFE8E8E8" } },
        };
        if (colNumber !== 3 && colNumber !== 4 && colNumber !== 7) {
          cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
        } else {
          cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        }
      });

      row.height = 25;
    });

    // Freeze header row
    dataSheet.views = [{ state: "frozen", ySplit: 1 }];

    // Add filter to header row
    if (studentList.length > 0) {
      dataSheet.autoFilter = {
        from: "A1",
        to: `H${studentList.length + 1}`,
      };
    }

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle export individual student
  const handleExportIndividual = async (student) => {
    try {
      message.loading({ content: t("adminDashboard.students.exporting") || "Generating Excel file...", key: "export", duration: 0 });
      await generateStyledExcel(
        [student],
        `student-${student.firstName}-${student.lastName}-${moment().format("YYYY-MM-DD")}`,
        false
      );
      message.success({ content: t("actions.export") || "Data exported successfully", key: "export" });
    } catch (error) {
      console.error("Export error:", error);
      message.error({ content: "Failed to export student data", key: "export" });
    }
  };

  // Handle save note
  const handleSaveNote = (studentId, note) => {
    setStudentNotes({ ...studentNotes, [studentId]: note });
    message.success(t("adminDashboard.students.noteSaved") || "Note saved successfully");
    setNoteModalVisible(false);
    setEditingNote(null);
  };

  const exportStudentData = async () => {
    try {
      message.loading({ content: t("adminDashboard.students.exporting") || "Generating Excel file...", key: "export", duration: 0 });
      await generateStyledExcel(students, `student-progress-${moment().format("YYYY-MM-DD")}`, true);
      message.success({ content: t("actions.export") || "Data exported successfully", key: "export" });
    } catch (error) {
      console.error("Export error:", error);
      message.error({ content: "Failed to export student data", key: "export" });
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (!searchTerm && !filterStatus) return true;
      const matchesSearch =
        !searchTerm ||
        student.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!filterStatus) return matchesSearch;
      const index = students.indexOf(student);
      const p = stats.progressData[index] ?? 50;
      const status =
        p >= 90
          ? "excellent"
          : p >= 70
          ? "good"
          : p >= 40
          ? "average"
          : "atRisk";
      // Progress range filter
      const progress = getStudentProgress(student);
      if (progress < progressRange[0] || progress > progressRange[1]) {
        return false;
      }

      // Enrollment date filter
      if (enrollmentDateRange && enrollmentDateRange.length === 2) {
        const enrollmentDate = moment(student.createdAt);
        const startDate = moment(enrollmentDateRange[0]).startOf('day');
        const endDate = moment(enrollmentDateRange[1]).endOf('day');
        if (!enrollmentDate.isBetween(startDate, endDate, null, '[]')) {
          return false;
        }
      }

      return matchesSearch && (!filterStatus || getStudentStatus(progress) === filterStatus);
    });
  }, [students, searchTerm, filterStatus, progressRange, enrollmentDateRange, studentProgressData]);

  // Update total filtered count
  useEffect(() => {
    setTotalFilteredStudents(filteredStudents.length);
  }, [filteredStudents.length]);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  // Get student progress (using real data)
  const getStudentProgress = (student) => {
    return studentProgressData[student._id] ?? 0;
  };
  
  // Get student enrollment count
  const getStudentEnrollments = (student) => {
    return studentEnrollments[student._id] ?? 0;
  };
  
  // Get student last activity
  const getStudentLastActivity = (student) => {
    return studentLastActivity[student._id] || student.updatedAt || student.createdAt;
  };

  // Get student status key
  const getStudentStatus = (progress) => {
    if (progress >= 90) return "excellent";
    if (progress >= 70) return "good";
    if (progress >= 40) return "average";
    return "atRisk";
  };
  
  // Get student enrolled courses
  const getStudentEnrolledCourses = (student) => {
    if (!student || !courses.length) return [];
    return courses.filter((course) => {
      if (Array.isArray(course.students)) {
        return course.students.some(
          (s) => (s._id || s) === student._id || (s._id || s)?.toString() === student._id?.toString()
        );
      }
      return false;
    });
  };

  // Status configuration with enhanced visibility
  const statusConfig = {
    excellent: {
      color: "#52c41a",
      bg: "#f6ffed",
      borderColor: "#52c41a",
      textColor: "#389e0d",
      text: t("adminDashboard.students.excellent"),
      icon: <StarOutlined />,
    },
    good: {
      color: "#1890ff",
      bg: "#e6f7ff",
      borderColor: "#1890ff",
      textColor: "#0050b3",
      text: t("adminDashboard.students.good"),
      icon: <CheckCircleOutlined />,
    },
    average: {
      color: "#faad14",
      bg: "#fffbe6",
      borderColor: "#faad14",
      textColor: "#d48806",
      text: t("adminDashboard.students.average"),
      icon: <RiseOutlined />,
    },
    atRisk: {
      color: "#ff4d4f",
      bg: "#fff1f0",
      borderColor: "#ff4d4f",
      textColor: "#cf1322",
      text: t("adminDashboard.students.atRisk"),
      icon: <WarningOutlined />,
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            🎓 {t("adminDashboard.students.title")}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {t("adminDashboard.students.subtitle")}
          </Text>
        </div>
        <Space wrap>
          <Button
            icon={<FileExcelOutlined />}
            type="dashed"
            onClick={exportStudentData}
            size="large"
          >
            {t("actions.export") || "Export"}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={async () => {
              setLoading(true);
              try {
                await fetchCourses();
                await fetchStudents();
                message.success(
                  t("adminDashboard.students.refreshed") ||
                    "Data refreshed successfully"
                );
              } catch (error) {
                message.error("Failed to refresh data");
              } finally {
                setLoading(false);
              }
            }}
            size="large"
            loading={loading}
          >
            {t("actions.refresh") || "Refresh"}
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TeamOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block", marginBottom: 4 }}
                >
                  {t("adminDashboard.students.totalStudents")}
                </Text>
                <Title level={3} style={{ margin: 0, fontSize: 28 }}>
                  {stats.totalStudents}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("adminDashboard.students.registered")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block", marginBottom: 4 }}
                >
                  {t("adminDashboard.students.activeStudents")}
                </Text>
                <Title level={3} style={{ margin: 0, fontSize: 28 }}>
                  {stats.activeStudents}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("adminDashboard.students.approved")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrophyOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block", marginBottom: 4 }}
                >
                  {t("adminDashboard.students.avgProgress")}
                </Text>
                <Title level={3} style={{ margin: 0, fontSize: 28 }}>
                  {stats.avgProgress}%
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("adminDashboard.students.overallProgress")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckSquareOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block", marginBottom: 4 }}
                >
                  {t("adminDashboard.students.completionRate")}
                </Text>
                <Title level={3} style={{ margin: 0, fontSize: 28 }}>
                  {stats.completionRate}%
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("adminDashboard.students.completed80Plus")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Bar */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "block",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={10} lg={10}>
            <Input
              size="large"
              placeholder={t("adminDashboard.students.searchPlaceholder") || "Search students by name or email..."}
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: 8, width: "100%" }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Select
              size="large"
              placeholder={t("adminDashboard.students.filterByStatus") || "Filter by Status"}
              style={{ width: "100%", borderRadius: 8 }}
              value={filterStatus}
              onChange={(value) => {
                setFilterStatus(value || null);
                setCurrentPage(1);
              }}
              allowClear
            >
              <Option value="excellent">
                {t("adminDashboard.students.excellent") || "Excellent (90%+)"}
              </Option>
              <Option value="good">
                {t("adminDashboard.students.good") || "Good (70-89%)"}
              </Option>
              <Option value="average">
                {t("adminDashboard.students.average") || "Average (40-69%)"}
              </Option>
              <Option value="atRisk">
                {t("adminDashboard.students.atRisk") || "At Risk (<40%)"}
              </Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} style={{ textAlign: "right" }}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                {t("adminDashboard.students.showing") || "Showing"} {filteredStudents.length}{" "}
                {t("adminDashboard.students.of") || "of"} {students.length}{" "}
                {t("adminDashboard.students.students") || "students"}
              </Text>
              <Button
                type="link"
                size="small"
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                style={{ padding: 0 }}
              >
                {showAdvancedFilters 
                  ? (t("adminDashboard.students.hideFilters") || "Hide Filters")
                  : (t("adminDashboard.students.advancedFilters") || "Advanced Filters")}
              </Button>
            </Space>
          </Col>
        </Row>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <div>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    {t("adminDashboard.students.progressRange") || "Progress Range"}:
                  </Text>
                  <Slider
                    range
                    min={0}
                    max={100}
                    value={progressRange}
                    onChange={setProgressRange}
                    marks={{
                      0: "0%",
                      50: "50%",
                      100: "100%",
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {progressRange[0]}% - {progressRange[1]}%
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    {t("adminDashboard.students.enrollmentDateRange") || "Enrollment Date Range"}:
                  </Text>
                  <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    value={enrollmentDateRange}
                    onChange={setEnrollmentDateRange}
                    format={i18n.language === "ja" ? "YYYY年MM月DD日" : "YYYY-MM-DD"}
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Bulk Actions Bar */}
      {selectedStudents.length > 0 && (
        <Card
          style={{
            borderRadius: 12,
            marginBottom: 16,
            border: "2px solid #1890ff",
            background: "#e6f7ff",
          }}
          bodyStyle={{ padding: "12px 16px" }}
        >
          <Space>
            <Text strong>
              {selectedStudents.length} {t("adminDashboard.students.selected") || "student(s) selected"}
            </Text>
            <Button
              size="small"
              icon={<SendOutlined />}
              onClick={handleBulkMessage}
            >
              {t("adminDashboard.students.sendMessage") || "Send Message"}
            </Button>
            <Button
              size="small"
              onClick={async () => {
                try {
                  const selected = students.filter((s) => selectedStudents.includes(s._id));
                  message.loading({ content: t("adminDashboard.students.exporting") || "Generating Excel file...", key: "export", duration: 0 });
                  await generateStyledExcel(selected, `selected-students-${moment().format("YYYY-MM-DD")}`, selected.length > 1);
                  message.success({ content: t("actions.export") || "Data exported successfully", key: "export" });
                } catch (error) {
                  console.error("Export error:", error);
                  message.error({ content: "Failed to export student data", key: "export" });
                }
              }}
            >
              {t("actions.export") || "Export Selected"}
            </Button>
            <Button
              size="small"
              type="text"
              onClick={() => setSelectedStudents([])}
            >
              {t("adminDashboard.students.clearSelection") || "Clear Selection"}
            </Button>
          </Space>
        </Card>
      )}

      {/* Student Table */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined style={{ fontSize: 18 }} />
              <span>{t("adminDashboard.students.studentPerformance")}</span>
            </div>
          </div>
        }
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Spin size="large" tip="Loading student data..." />
          </div>
        ) : filteredStudents.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("adminDashboard.students.noStudentsFound")}
            style={{ padding: "60px 20px" }}
          />
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#fafafa",
                      borderBottom: "2px solid #e8e8e8",
                    }}
                  >
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                        width: 50,
                      }}
                    >
                      <Checkbox
                        indeterminate={
                          selectedStudents.length > 0 &&
                          selectedStudents.length < paginatedStudents.length
                        }
                        checked={
                          paginatedStudents.length > 0 &&
                          selectedStudents.length === paginatedStudents.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                      }}
                    >
                      {t("adminDashboard.students.student")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                      }}
                    >
                      {t("adminDashboard.students.tableStatus")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                      }}
                    >
                      {t("adminDashboard.students.progress")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                      }}
                    >
                      {t("adminDashboard.students.lastActivity")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#262626",
                        fontSize: 14,
                      }}
                    >
                      {t("adminDashboard.students.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => {
                    const progress = getStudentProgress(student);
                    const statusKey = getStudentStatus(progress);
                    const status = statusConfig[statusKey] || statusConfig.atRisk;
                    const lastActivity = getStudentLastActivity(student);
                    const activityDate = lastActivity ? moment(lastActivity) : moment(student.createdAt);
                    const daysAgo = moment().diff(activityDate, "days");
                    const isRecent = daysAgo <= 3;
                    const isSelected = selectedStudents.includes(student._id);

                    return (
                      <tr
                        key={student._id}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          background: isSelected ? "#e6f7ff" : "#fff",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "#fafafa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "#fff";
                          } else {
                            e.currentTarget.style.background = "#e6f7ff";
                          }
                        }}
                      >
                        <td
                          style={{ padding: "16px", textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handleSelectStudent(student._id, e.target.checked)}
                          />
                        </td>
                        <td
                          style={{ padding: "16px" }}
                          onClick={() => handleViewStudent(student)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <Avatar
                              size={40}
                              style={{
                                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              {student.firstName?.[0]?.toUpperCase() || "?"}
                            </Avatar>
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#262626",
                                  marginBottom: 4,
                                }}
                              >
                                {student.firstName} {student.lastName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#8c8c8c",
                                }}
                              >
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px", minWidth: 140 }}>
                          <Tag
                            icon={status.icon}
                            color={status.color}
                            style={{
                              background: status.bg,
                              borderColor: status.borderColor || status.color,
                              borderWidth: "1.5px",
                              borderStyle: "solid",
                              padding: "6px 14px",
                              borderRadius: 6,
                              fontWeight: 600,
                              fontSize: 13,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              color: status.textColor || status.color,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            {status.text}
                          </Tag>
                        </td>
                        <td style={{ padding: "16px", minWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Text
                              strong
                              style={{
                                fontSize: 16,
                                color: status.color,
                                minWidth: 45,
                              }}
                            >
                              {progress}%
                            </Text>
                            <Progress
                              percent={progress}
                              strokeColor={status.color}
                              trailColor="#f0f0f0"
                              showInfo={false}
                              style={{ flex: 1 }}
                              strokeWidth={8}
                            />
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                color: isRecent
                                  ? "#52c41a"
                                  : daysAgo <= 7
                                  ? "#faad14"
                                  : "#8c8c8c",
                                fontWeight: 500,
                                marginBottom: 4,
                              }}
                            >
                              {i18n.language === "ja"
                                ? activityDate.locale("ja").format("YYYY年MM月DD日")
                                : activityDate.format("MMM DD, YYYY")}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#8c8c8c",
                              }}
                            >
                              {activityDate.fromNow()}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{ padding: "16px", textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Space>
                            <Tooltip title={t("adminDashboard.students.viewProfile")}>
                              <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewStudent(student)}
                                style={{ color: "#1890ff" }}
                              />
                            </Tooltip>
                            <Tooltip title={t("adminDashboard.students.sendMessage") || "Send Message"}>
                              <Button
                                type="text"
                                icon={<SendOutlined />}
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setMessageModalVisible(true);
                                }}
                                style={{ color: "#52c41a" }}
                              />
                            </Tooltip>
                            <Tooltip title={t("actions.export") || "Export"}>
                              <Button
                                type="text"
                                icon={<FileTextOutlined />}
                                onClick={() => handleExportIndividual(student)}
                                style={{ color: "#faad14" }}
                              />
                            </Tooltip>
                            {studentNotes[student._id] && (
                              <Tooltip title={studentNotes[student._id]}>
                                <Badge dot color="blue">
                                  <InfoCircleOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                                </Badge>
                              </Tooltip>
                            )}
                          </Space>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div
                style={{
                  padding: "16px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <Text type="secondary" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                    {t("adminDashboard.students.showing") || "Showing"} {startIndex + 1}-
                    {Math.min(endIndex, filteredStudents.length)}{" "}
                    {t("adminDashboard.students.of") || "of"} {filteredStudents.length}{" "}
                    {t("adminDashboard.students.students") || "students"}
                  </Text>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Text type="secondary" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                      {t("adminDashboard.students.itemsPerPage") || "Items per page"}:
                    </Text>
                    <Select
                      size="small"
                      value={pageSize}
                      onChange={(v) => {
                        setPageSize(v);
                        setCurrentPage(1);
                      }}
                      style={{ minWidth: 80 }}
                    >
                      <Option value={5}>5</Option>
                      <Option value={8}>8</Option>
                      <Option value={10}>10</Option>
                      <Option value={15}>15</Option>
                      <Option value={20}>20</Option>
                    </Select>
                  </div>
                </div>
                <Space wrap>
                  <Button
                    size="small"
                    icon={<LeftOutlined />}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {t("actions.previous") || "Previous"}
                  </Button>
                  <Space size={4}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          size="small"
                          type={currentPage === pageNum ? "primary" : "default"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </Space>
                  <Button
                    size="small"
                    icon={<RightOutlined />}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {t("actions.next") || "Next"}
                  </Button>
                </Space>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Student Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <UserOutlined style={{ fontSize: 20 }} />
            <span>
              {selectedStudent
                ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                : t("adminDashboard.students.viewProfile")}
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="message"
            type="primary"
            icon={<SendOutlined />}
            onClick={() => {
              setModalVisible(false);
              setMessageModalVisible(true);
            }}
          >
            {t("adminDashboard.students.sendMessage") || "Send Message"}
          </Button>,
          <Button
            key="note"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingNote(studentNotes[selectedStudent._id] || "");
              setNoteModalVisible(true);
            }}
          >
            {t("adminDashboard.students.addNote") || "Add Note"}
          </Button>,
          <Button key="close" onClick={handleCloseModal}>
            {(() => {
              const translated = t("admin.modals.close");
              if (translated && translated !== "admin.modals.close") {
                return translated;
              }
              return i18n.language === "ja" ? "閉じる" : "Close";
            })()}
          </Button>,
        ]}
        width={900}
        destroyOnClose
      >
        {selectedStudent && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                paddingBottom: 24,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Avatar
                size={64}
                style={{
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 24,
                }}
              >
                {selectedStudent.firstName?.[0]?.toUpperCase() || "?"}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </Title>
                <Text type="secondary">{selectedStudent.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={selectedStudent.isApproved ? "green" : "orange"}
                    icon={
                      selectedStudent.isApproved ? (
                        <CheckCircleOutlined />
                      ) : (
                        <ClockCircleOutlined />
                      )
                    }
                  >
                    {selectedStudent.isApproved
                      ? t("adminDashboard.students.approved")
                      : t("adminDashboard.students.pending")}
                  </Tag>
                </div>
              </div>
            </div>

            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: "overview",
                  label: (
                    <Space>
                      <InfoCircleOutlined />
                      <span>{t("adminDashboard.students.overview") || "Overview"}</span>
                    </Space>
                  ),
                  children: (
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item
                        label={
                          <Space>
                            <BarChartOutlined />
                            <span>{t("adminDashboard.students.progress")}</span>
                          </Space>
                        }
                      >
                {(() => {
                  const progress = getStudentProgress(selectedStudent);
                  const statusKey = getStudentStatus(progress);
                  const status = statusConfig[statusKey];
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Text strong style={{ fontSize: 18, color: status.color }}>
                          {progress}%
                        </Text>
                        <Progress
                          percent={progress}
                          strokeColor={status.color}
                          style={{ flex: 1 }}
                        />
                      </div>
                        <Tag
                          icon={status.icon}
                          color={status.color}
                          style={{
                            marginTop: 8,
                            background: status.bg,
                            borderColor: status.borderColor || status.color,
                            borderWidth: "1.5px",
                            borderStyle: "solid",
                            padding: "6px 14px",
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 13,
                            color: status.textColor || status.color,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          }}
                        >
                          {status.text}
                        </Tag>
                    </>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    <span>Email</span>
                  </Space>
                }
              >
                {selectedStudent.email}
              </Descriptions.Item>
              {selectedStudent.phone && (
                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined />
                      <span>Phone</span>
                    </Space>
                  }
                >
                  {selectedStudent.phone}
                </Descriptions.Item>
              )}
              <Descriptions.Item
                label={
                  <Space>
                    <CalendarOutlined />
                    <span>{t("adminDashboard.students.registered") || "Registration Date"}</span>
                  </Space>
                }
              >
                {i18n.language === "ja"
                  ? moment(selectedStudent.createdAt)
                      .locale("ja")
                      .format("YYYY年MM月DD日")
                  : moment(selectedStudent.createdAt).format("MMMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined />
                    <span>{t("adminDashboard.students.lastActivity")}</span>
                  </Space>
                }
              >
                {(() => {
                  const lastActivity = getStudentLastActivity(selectedStudent);
                  const activityDate = lastActivity ? moment(lastActivity) : moment(selectedStudent.createdAt);
                  return (
                    <>
                      <div>
                        {i18n.language === "ja"
                          ? activityDate.locale("ja").format("YYYY年MM月DD日")
                          : activityDate.format("MMM DD, YYYY")}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {activityDate.fromNow()}
                      </Text>
                    </>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <BookOutlined />
                    <span>{t("adminDashboard.students.enrolledCourses") || "Enrolled Courses"}</span>
                  </Space>
                }
              >
                {(() => {
                  const enrolledCount = getStudentEnrollments(selectedStudent);
                  const enrolledCourses = getStudentEnrolledCourses(selectedStudent);
                  return (
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 16 }}>
                          {enrolledCount} {t("adminDashboard.students.courses") || "courses"}
                        </Text>
                      </div>
                      {enrolledCourses.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {enrolledCourses.slice(0, 5).map((course) => (
                            <Tag
                              key={course._id}
                              color="blue"
                              style={{ marginBottom: 4 }}
                            >
                              {course.title || course.name}
                              {course.code && ` (${course.code})`}
                            </Tag>
                          ))}
                          {enrolledCourses.length > 5 && (
                            <Tag color="default">
                              +{enrolledCourses.length - 5} more
                            </Tag>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Descriptions.Item>
            </Descriptions>
                  ),
                },
                {
                  key: "history",
                  label: (
                    <Space>
                      <LineChartOutlined />
                      <span>{t("adminDashboard.students.progressHistory") || "Progress History"}</span>
                    </Space>
                  ),
                  children: (
                    <div>
                      {progressHistory[selectedStudent._id] && progressHistory[selectedStudent._id].length > 0 ? (
                        <Timeline>
                          {progressHistory[selectedStudent._id].map((record, idx) => (
                            <Timeline.Item
                              key={idx}
                              color={
                                record.progress >= 90
                                  ? "green"
                                  : record.progress >= 70
                                  ? "blue"
                                  : record.progress >= 40
                                  ? "orange"
                                  : "red"
                              }
                            >
                              <div>
                                <Text strong>{record.progress || 0}%</Text>
                                <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
                                  {moment(record.createdAt || record.date).format(
                                    i18n.language === "ja" ? "YYYY年MM月DD日 HH:mm" : "MMM DD, YYYY HH:mm"
                                  )}
                                </div>
                                {record.comments && (
                                  <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                                    {record.comments}
                                  </Text>
                                )}
                              </div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      ) : (
                        <Empty
                          description={t("adminDashboard.students.noProgressHistory") || "No progress history available"}
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  key: "notes",
                  label: (
                    <Space>
                      <FileTextOutlined />
                      <span>{t("adminDashboard.students.notes") || "Notes"}</span>
                      {studentNotes[selectedStudent._id] && <Badge dot color="blue" />}
                    </Space>
                  ),
                  children: (
                    <div>
                      {studentNotes[selectedStudent._id] ? (
                        <div>
                          <Text>{studentNotes[selectedStudent._id]}</Text>
                          <div style={{ marginTop: 16 }}>
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setEditingNote(studentNotes[selectedStudent._id]);
                                setNoteModalVisible(true);
                              }}
                            >
                              {t("adminDashboard.students.editNote") || "Edit Note"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Empty
                            description={t("adminDashboard.students.noNotes") || "No notes for this student"}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                              setEditingNote("");
                              setNoteModalVisible(true);
                            }}
                          >
                            {t("adminDashboard.students.addNote") || "Add Note"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Message Modal */}
      <Modal
        title={
          <Space>
            <SendOutlined />
            <span>{t("adminDashboard.students.sendMessage") || "Send Message"}</span>
          </Space>
        }
        open={messageModalVisible}
        onCancel={() => {
          setMessageModalVisible(false);
          setSelectedStudent(null);
          messageForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={messageForm}
          layout="vertical"
          onFinish={handleSendMessage}
        >
          <Form.Item
            label={t("adminDashboard.students.recipient") || "Recipient"}
            name="recipient"
          >
            <Input
              value={
                selectedStudent
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.email})`
                  : `${selectedStudents.length} ${t("adminDashboard.students.students") || "students"}`
              }
              disabled
            />
          </Form.Item>
          <Form.Item
            label={t("adminDashboard.students.subject") || "Subject"}
            name="subject"
            rules={[{ required: true, message: t("adminDashboard.students.subjectRequired") || "Subject is required" }]}
          >
            <Input placeholder={t("adminDashboard.students.subjectPlaceholder") || "Enter message subject"} />
          </Form.Item>
          <Form.Item
            label={t("adminDashboard.students.message") || "Message"}
            name="message"
            rules={[{ required: true, message: t("adminDashboard.students.messageRequired") || "Message is required" }]}
          >
            <Input.TextArea
              rows={6}
              placeholder={t("adminDashboard.students.messagePlaceholder") || "Enter your message"}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={sendingMessage}
              >
                {t("adminDashboard.students.send") || "Send"}
              </Button>
              <Button
                onClick={() => {
                  setMessageModalVisible(false);
                  setSelectedStudent(null);
                  messageForm.resetFields();
                }}
              >
                {(() => {
                  const translated = t("admin.modals.cancel");
                  if (translated && translated !== "admin.modals.cancel") {
                    return translated;
                  }
                  return i18n.language === "ja" ? "キャンセル" : "Cancel";
                })()}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Note Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>
              {editingNote !== null && studentNotes[selectedStudent?._id]
                ? t("adminDashboard.students.editNote") || "Edit Note"
                : t("adminDashboard.students.addNote") || "Add Note"}
            </span>
          </Space>
        }
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          setEditingNote(null);
        }}
        onOk={() => {
          if (selectedStudent && editingNote !== null) {
            handleSaveNote(selectedStudent._id, editingNote);
          }
        }}
        okText={t("adminDashboard.students.save") || "Save"}
        cancelText={(() => {
          const translated = t("admin.modals.cancel");
          if (translated && translated !== "admin.modals.cancel") {
            return translated;
          }
          return i18n.language === "ja" ? "キャンセル" : "Cancel";
        })()}
        width={500}
      >
        <Input.TextArea
          rows={6}
          value={editingNote !== null ? editingNote : ""}
          onChange={(e) => setEditingNote(e.target.value)}
          placeholder={t("adminDashboard.students.notePlaceholder") || "Add a note about this student..."}
        />
      </Modal>
    </div>
  );
};

export default AdminStudentProgress;

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Form,
  Modal,
  InputNumber,
  Descriptions,
  Empty,
  Avatar,
  Badge,
  Statistic,
  Divider,
  Drawer,
  List,
  Skeleton,
} from "antd";
import { Grid } from "antd";
import {
  CheckSquareOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  MessageOutlined,
  ReloadOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  progressAPI,
  courseAPI,
  userAPI,
  messageAPI,
} from "../../utils/apiClient";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const gradeColorMap = {
  A: "green",
  B: "blue",
  C: "orange",
  D: "volcano",
  F: "red",
};

const TeacherGradingCenter = ({
  t: providedT,
  currentUser,
  isMobile: legacyIsMobile,
  history: historyProp,
}) => {
  const { t: i18nT } = useTranslation();
  const t = providedT || i18nT;
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const screens = useBreakpoint();
  const computedIsMobile =
    legacyIsMobile ?? (!screens.md && screens.xs !== false);

  const teacherId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.teacherId;

  const [progressForm] = Form.useForm();
  const [messageForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [savingGrade, setSavingGrade] = useState(false);
  const [messageSending, setMessageSending] = useState(false);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState(null);

  const [editingProgress, setEditingProgress] = useState(null);
  const [viewingProgress, setViewingProgress] = useState(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [viewProgressModalVisible, setViewProgressModalVisible] =
    useState(false);

  const [studentDrawerVisible, setStudentDrawerVisible] = useState(false);
  const [focusedStudentId, setFocusedStudentId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);

  const lastRefreshRef = useRef(null);

  const fetchDashboardData = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const [courseRes, progressRes] = await Promise.all([
        courseAPI.getAll(),
        progressAPI.getAll(),
      ]);

      let studentRes = [];
      try {
        if (userAPI.getByRole) {
          studentRes = await userAPI.getByRole("student");
        } else {
          studentRes = await userAPI.getAll();
        }
      } catch (studentError) {
        console.warn("TeacherGradingCenter: student fetch limited", studentError);
        studentRes = [];
      }

      const allCourses = courseRes.courses || courseRes || [];
      const teacherCourses = allCourses.filter((course) => {
        const owner =
          course.teacher ||
          course.teacherId ||
          course.instructor ||
          course.owner;
        if (!owner) return false;
        if (typeof owner === "string") {
          return owner === teacherId;
        }
        return (
          owner._id === teacherId ||
          owner.id === teacherId ||
          owner.teacherId === teacherId
        );
      });
      setCourses(teacherCourses);

      const courseStudentIds = new Set();
      teacherCourses.forEach((course) => {
        (course.students || []).forEach((student) => {
          if (typeof student === "string") {
            courseStudentIds.add(student);
          } else if (student?._id || student?.id) {
            courseStudentIds.add(student._id || student.id);
          }
        });
      });

      const allStudents = studentRes.users || studentRes || [];
      const teacherStudents =
        courseStudentIds.size === 0
          ? allStudents.filter((student) => {
              const advisor =
                student.teacher ||
                student.teacherId ||
                student.assignedTeacher;
              if (!advisor) return false;
              if (typeof advisor === "string") return advisor === teacherId;
              return advisor?._id === teacherId || advisor?.id === teacherId;
            })
          : allStudents.filter((student) =>
              courseStudentIds.has(student._id || student.id)
            );
      setStudents(teacherStudents);

      const allProgress = progressRes.progress || progressRes || [];
      const teacherProgress = allProgress.filter((record) => {
        const recordTeacher =
          record.teacher ||
          record.teacherId ||
          record.owner ||
          record.instructor;
        if (!recordTeacher) return false;
        if (typeof recordTeacher === "string") {
          return recordTeacher === teacherId;
        }
        return (
          recordTeacher._id === teacherId ||
          recordTeacher.id === teacherId ||
          recordTeacher.teacherId === teacherId
        );
      });

      setProgressRecords(
        teacherProgress.map((record) => ({
          ...record,
          createdAt: record.createdAt || record.dateCreated,
          updatedAt: record.updatedAt || record.lastModified,
        }))
      );
      lastRefreshRef.current = Date.now();
    } catch (error) {
      console.error("Error loading grading data:", error);
      message.error(
        t(
          "teacherDashboard.gradingCenter.errors.load",
          "Unable to load grading data. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [teacherId, t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const studentLookup = useMemo(() => {
    const map = new Map();
    students.forEach((student) => {
      map.set(student._id || student.id, student);
    });
    return map;
  }, [students]);

  const courseLookup = useMemo(() => {
    const map = new Map();
    courses.forEach((course) => {
      map.set(course._id || course.id, course);
    });
    return map;
  }, [courses]);

  const enrichRecord = useCallback(
    (record) => {
      const studentId =
        record.student?._id || record.studentId || record.student;
      const courseId = record.course?._id || record.courseId || record.course;
      const student = studentLookup.get(studentId) || record.student;
      const course = courseLookup.get(courseId) || record.course;

      const computedGrade =
        record.grade ||
        (() => {
          if (record.score == null || record.maxScore == null) return null;
          const percentage = (record.score / record.maxScore) * 100;
          if (percentage >= 90) return "A";
          if (percentage >= 80) return "B";
          if (percentage >= 70) return "C";
          if (percentage >= 60) return "D";
          return "F";
        })();

      return {
        ...record,
        studentId,
        courseId,
        student,
        course,
        grade: computedGrade,
        studentDisplayName:
          (student?.firstName || student?.givenName || "") +
          (student?.lastName || student?.familyName
            ? ` ${student?.lastName || student?.familyName}`
            : "") ||
          record.studentName ||
          t("teacherDashboard.gradingCenter.labels.unknownStudent", "Unknown"),
        courseTitle: course?.title || course?.name || record.courseName || "-",
        lastActivity: record.updatedAt || record.createdAt,
      };
    },
    [courseLookup, studentLookup, t]
  );

  const enrichedProgress = useMemo(
    () =>
      progressRecords
        .map(enrichRecord)
        .sort(
          (a, b) =>
            new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0)
        ),
    [progressRecords, enrichRecord]
  );

  const filteredProgress = useMemo(() => {
    return enrichedProgress.filter((record) => {
      const matchesSearch =
        !searchTerm ||
        record.assignmentName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.studentDisplayName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || record.assignmentType === selectedType;
      const matchesCourse =
        !selectedCourseId || record.courseId === selectedCourseId;
      const matchesStudent =
        !selectedStudentFilter || record.studentId === selectedStudentFilter;
      return matchesSearch && matchesType && matchesCourse && matchesStudent;
    });
  }, [
    enrichedProgress,
    searchTerm,
    selectedType,
    selectedCourseId,
    selectedStudentFilter,
  ]);

  const summaryMetrics = useMemo(() => {
    if (enrichedProgress.length === 0) {
      return {
        gradedCount: 0,
        averageScore: 0,
        pendingReviews: 0,
        latestUpdate: null,
      };
    }
    const graded = enrichedProgress.filter(
      (record) => record.score != null && record.maxScore != null
    );
    const gradedCount = graded.length;
    const averageScore = gradedCount
      ? Math.round(
          (graded.reduce(
            (acc, record) => acc + (record.score / record.maxScore) * 100,
            0
          ) /
            gradedCount) *
            10
        ) / 10
      : 0;
    const pendingReviews = enrichedProgress.filter(
      (record) => record.score == null || record.grade == null
    ).length;

    return {
      gradedCount,
      averageScore,
      pendingReviews,
      latestUpdate: enrichedProgress[0]?.lastActivity,
    };
  }, [enrichedProgress]);

  const courseBreakdown = useMemo(() => {
    const map = new Map();
    enrichedProgress.forEach((record) => {
      if (!record.courseId) return;
      const entry = map.get(record.courseId) || {
        courseId: record.courseId,
        courseTitle: record.courseTitle,
        total: 0,
        graded: 0,
        average: 0,
      };
      entry.total += 1;
      if (record.score != null && record.maxScore != null) {
        entry.graded += 1;
        entry.average += (record.score / record.maxScore) * 100;
      }
      map.set(record.courseId, entry);
    });

    return Array.from(map.values()).map((entry) => ({
      ...entry,
      average:
        entry.graded > 0
          ? Math.round((entry.average / entry.graded) * 10) / 10
          : 0,
    }));
  }, [enrichedProgress]);

  const recentGrades = useMemo(
    () => enrichedProgress.slice(0, 8),
    [enrichedProgress]
  );

  const openProgressModal = useCallback(
    (record = null) => {
      if (!record) {
        setEditingProgress(null);
        progressForm.resetFields();
        setProgressModalVisible(true);
        return;
      }

      setEditingProgress(record);
      progressForm.setFieldsValue({
        courseId: record.courseId,
        studentId: record.studentId,
        assignmentType: record.assignmentType,
        assignmentName: record.assignmentName,
        score: record.score,
        maxScore: record.maxScore || 100,
        grade: record.grade,
        feedback: record.feedback || "",
      });
      setProgressModalVisible(true);
    },
    [progressForm]
  );

const handleCreateProgress = useCallback(
  async (values) => {
    if (!teacherId) return;

    // ✅ Find the selected course (used to extract subject name)
    const selectedCourse =
      courses.find(
        (c) => c._id === values.courseId || c.id === values.courseId
      ) || {};

    // ✅ Complete payload with all required fields
    const payload = {
      student: values.studentId,
      courseId: values.courseId,
      assignmentType: values.assignmentType,
      assignmentName: values.assignmentName?.trim(),
      subject: selectedCourse?.title || selectedCourse?.name || "General", // required by backend
      assignment: values.assignmentName?.trim(), // required by backend
      score: values.score,
      maxScore: values.maxScore || 100,
      grade: values.grade,
      feedback: values.feedback?.trim() || "",
      teacherId,
    };

    setSavingGrade(true);
    try {
      let response;
      if (editingProgress) {
        response = await progressAPI.update(editingProgress._id, payload);
        message.success(
          t(
            "teacherDashboard.gradingCenter.messages.updated",
            "Grade updated successfully."
          )
        );
      } else {
        response = await progressAPI.create(payload);
        message.success(
          t(
            "teacherDashboard.gradingCenter.messages.created",
            "Grade recorded successfully."
          )
        );
      }

      const updatedRecord =
        response?.progress ||
        response?.data ||
        (editingProgress
          ? { ...editingProgress, ...payload, updatedAt: new Date().toISOString() }
          : null);

      if (updatedRecord) {
        setProgressRecords((prev) => {
          if (editingProgress) {
            return prev.map((item) =>
              (item._id || item.id) === (editingProgress._id || editingProgress.id)
                ? { ...item, ...updatedRecord }
                : item
            );
          }
          return [
            {
              ...updatedRecord,
              createdAt: updatedRecord.createdAt || new Date().toISOString(),
            },
            ...prev,
          ];
        });
      } else {
        fetchDashboardData();
      }

      setProgressModalVisible(false);
      setEditingProgress(null);
      progressForm.resetFields();
    } catch (error) {
      const serverMessage =
        error?.response?.message || error?.response?.error || error?.message;
      if (error?.status === 500) {
        console.warn(
          "TeacherGradingCenter: backend returned 500 while creating progress",
          error
        );
      } else {
        console.error("Failed to save grade:", error);
      }
      message.error(
        serverMessage ||
          t(
            "teacherDashboard.gradingCenter.errors.save",
            "Unable to save grade. Please try again."
          )
      );
    } finally {
      setSavingGrade(false);
    }
  },
  [editingProgress, fetchDashboardData, progressForm, t, teacherId, courses]
);


  const handleDeleteProgress = useCallback(
    async (recordId) => {
      try {
        await progressAPI.delete(recordId);
        message.success(
          t(
            "teacherDashboard.gradingCenter.messages.deleted",
            "Grade removed."
          )
        );
        setProgressRecords((prev) =>
          prev.filter(
            (item) => (item._id || item.id) !== recordId
          )
        );
      } catch (error) {
        console.error("Failed to delete grade:", error);
        message.error(
          t(
            "teacherDashboard.gradingCenter.errors.delete",
            "Unable to delete grade."
          )
        );
      }
    },
    [t]
  );

  const openStudentDrawer = useCallback(
    (studentId) => {
      setFocusedStudentId(studentId);
      setStudentDrawerVisible(true);
    },
    []
  );

  const closeStudentDrawer = useCallback(() => {
    setStudentDrawerVisible(false);
    setFocusedStudentId(null);
    setConversation([]);
    messageForm.resetFields();
  }, [messageForm]);

  const loadConversation = useCallback(
    async (studentId) => {
      if (!studentId) return;
      setConversationLoading(true);
      try {
        const response = await messageAPI.getConversation(studentId);
        const list = response.conversation || response.messages || response || [];
        setConversation(
          Array.isArray(list)
            ? list.sort(
                (a, b) => new Date(a.sentAt || a.createdAt || 0) - new Date(b.sentAt || b.createdAt || 0)
              )
            : []
        );
    } catch (error) {
      if (error?.status !== 404) {
        console.error("Failed to load conversation:", error);
      }
      setConversation([]);
      } finally {
        setConversationLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (studentDrawerVisible && focusedStudentId) {
      loadConversation(focusedStudentId);
    }
  }, [studentDrawerVisible, focusedStudentId, loadConversation]);

  const focusedStudent = focusedStudentId
    ? studentLookup.get(focusedStudentId)
    : null;

  const focusedStudentRecords = useMemo(() => {
    if (!focusedStudentId) return [];
    return enrichedProgress.filter(
      (record) => record.studentId === focusedStudentId
    );
  }, [focusedStudentId, enrichedProgress]);

  const handleSendMessage = useCallback(
    async (values) => {
      if (!focusedStudentId || !focusedStudent) return;
      setMessageSending(true);
      try {
        await messageAPI.sendToStudent({
          recipientId: focusedStudentId,
          recipientEmail:
            focusedStudent.email ||
            focusedStudent.contactEmail ||
            focusedStudent.username,
          recipientName:
            focusedStudent.firstName || focusedStudent.lastName
              ? `${focusedStudent.firstName || ""} ${
                  focusedStudent.lastName || ""
                }`.trim()
              : focusedStudent.name || "Student",
          subject: values.subject,
          message: values.body,
          type: "teacher_to_student",
        });

        message.success(
          t(
            "teacherDashboard.gradingCenter.messages.sent",
            "Message sent to student."
          )
        );
        messageForm.resetFields();
        loadConversation(focusedStudentId);
      } catch (error) {
        console.error("Failed to send message:", error);
        message.error(
          t(
            "teacherDashboard.gradingCenter.errors.messageSend",
            "Unable to send message right now."
          )
        );
      } finally {
        setMessageSending(false);
      }
    },
    [focusedStudent, focusedStudentId, loadConversation, messageForm, t]
  );

  const formatDateTime = useCallback(
    (value) => {
      if (!value) return t("teacherDashboard.common.labels.na", "N/A");
      return moment(value).calendar(null, {
        sameDay: `[${t("teacherDashboard.common.labels.today", "Today")}] HH:mm`,
        nextDay: `[${t("teacherDashboard.common.labels.tomorrow", "Tomorrow")}] HH:mm`,
        nextWeek: "MMM D HH:mm",
        lastDay: `[${t("teacherDashboard.common.labels.yesterday", "Yesterday")}] HH:mm`,
        lastWeek: "MMM D HH:mm",
        sameElse: "MMM D, YYYY HH:mm",
      });
    },
    [t]
  );

  const tableColumns = useMemo(
    () => [
      {
        title: t("teacherDashboard.gradingCenter.columns.student", "Student"),
        key: "student",
        fixed: computedIsMobile ? undefined : "left",
        render: (_, record) => (
          <Space size="middle">
            <Avatar style={{ backgroundColor: "#4f46e5" }} icon={<UserOutlined />}>
              {(record.studentDisplayName || "?").charAt(0)}
            </Avatar>
            <div>
              <Text strong>{record.studentDisplayName}</Text>
              <br />
              <Text type="secondary">
                {record.student?.email ||
                  t("teacherDashboard.common.labels.noEmail", "No email")}
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.assignment", "Assignment"),
        dataIndex: "assignmentName",
        key: "assignmentName",
        render: (value, record) => (
          <Space direction="vertical" size={0}>
            <Text>{value}</Text>
            <Tag>{record.assignmentType || t("teacherDashboard.common.labels.na", "N/A")}</Tag>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.course", "Course"),
        dataIndex: "courseTitle",
        key: "courseTitle",
        render: (value) => <Tag color="geekblue">{value}</Tag>,
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.score", "Score"),
        key: "score",
        render: (_, record) =>
          record.score != null && record.maxScore != null ? (
            <Text strong>
              {record.score}/{record.maxScore}
            </Text>
          ) : (
            <Badge
              status="processing"
              text={t(
                "teacherDashboard.gradingCenter.labels.awaitingScore",
                "Awaiting score"
              )}
            />
          ),
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.grade", "Grade"),
        dataIndex: "grade",
        key: "grade",
        render: (grade) =>
          grade ? (
            <Tag color={gradeColorMap[grade] || "default"}>{grade}</Tag>
          ) : (
            <Tag color="default">
              {t("teacherDashboard.gradingCenter.labels.toGrade", "To grade")}
            </Tag>
          ),
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.updated", "Updated"),
        dataIndex: "lastActivity",
        key: "lastActivity",
        render: (value) => (
          <Text type="secondary">{formatDateTime(value)}</Text>
        ),
      },
      {
        title: t("teacherDashboard.gradingCenter.columns.actions", "Actions"),
        key: "actions",
        fixed: computedIsMobile ? undefined : "right",
        render: (_, record) => (
          <Space>
            <Tooltip title={t("teacherDashboard.gradingCenter.actions.view", "View details")}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setViewingProgress(record);
                  setViewProgressModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.gradingCenter.actions.edit", "Edit grade")}>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => openProgressModal(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.gradingCenter.actions.message", "Message student")}>
              <Button
                icon={<MessageOutlined />}
                size="small"
                onClick={() => openStudentDrawer(record.studentId)}
              />
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title={t(
                "teacherDashboard.gradingCenter.actions.deleteConfirm",
                "Delete this grade?"
              )}
              onConfirm={() => handleDeleteProgress(record._id || record.id)}
            >
              <Tooltip title={t("teacherDashboard.gradingCenter.actions.delete", "Delete")}>
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [
      computedIsMobile,
      formatDateTime,
      handleDeleteProgress,
      openProgressModal,
      openStudentDrawer,
      t,
    ]
  );

const renderSummaryCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Space direction="vertical" size={4}>
          <Text type="secondary">
            {t("teacherDashboard.gradingCenter.metrics.graded", "Graded submissions")}
          </Text>
            <Statistic
              value={summaryMetrics.gradedCount}
              valueStyle={{ fontSize: computedIsMobile ? 20 : 28 }}
              prefix={<CheckSquareOutlined style={{ color: "#16a34a" }} />}
            />
          </Space>
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Space direction="vertical" size={4}>
          <Text type="secondary">
            {t("teacherDashboard.gradingCenter.metrics.average", "Average score")}
          </Text>
            <Statistic
              value={summaryMetrics.averageScore}
              suffix="%"
              precision={1}
              prefix={
                summaryMetrics.averageScore >= 75 ? (
                  <ArrowUpOutlined style={{ color: "#16a34a" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "#ef4444" }} />
                )
              }
              valueStyle={{ fontSize: computedIsMobile ? 20 : 28 }}
            />
          </Space>
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Space direction="vertical" size={4}>
          <Text type="secondary">
            {t("teacherDashboard.gradingCenter.metrics.pending", "Awaiting review")}
          </Text>
            <Statistic
              value={summaryMetrics.pendingReviews}
              valueStyle={{ fontSize: computedIsMobile ? 20 : 28 }}
              prefix={<Badge status="processing" />}
            />
          </Space>
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Space direction="vertical" size={4}>
          <Text type="secondary">
            {t("teacherDashboard.gradingCenter.metrics.lastUpdate", "Last update")}
          </Text>
            <Text strong style={{ fontSize: computedIsMobile ? 14 : 16 }}>
              {summaryMetrics.latestUpdate
                ? formatDateTime(summaryMetrics.latestUpdate)
                : t("teacherDashboard.common.labels.na", "N/A")}
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: computedIsMobile ? 16 : 24 }}>
      <Space
        direction="vertical"
        size={computedIsMobile ? 16 : 24}
        style={{ width: "100%" }}
      >
        <Card
          bodyStyle={{ padding: computedIsMobile ? 16 : 24 }}
          style={{ borderRadius: 18 }}
        >
          <Row
            gutter={[16, 16]}
            align="middle"
            justify="space-between"
            wrap
          >
            <Col flex="auto">
              <Space
                align={computedIsMobile ? "start" : "center"}
                size={16}
                direction={computedIsMobile ? "vertical" : "horizontal"}
              >
                <div
                  style={{
                    width: computedIsMobile ? 48 : 56,
                    height: computedIsMobile ? 48 : 56,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(59,130,246,0.12))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckSquareOutlined style={{ fontSize: 28, color: "#4f46e5" }} />
                </div>
                <div>
                  <Title level={computedIsMobile ? 3 : 2} style={{ margin: 0 }}>
                    {t(
                      "teacherDashboard.gradingCenter.title",
                      "Grading Center"
                    )}
                  </Title>
                  <Text type="secondary">
                    {t(
                      "teacherDashboard.gradingCenter.subtitle",
                      "Grade work, share feedback, and keep students in sync in real time."
                    )}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space wrap>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchDashboardData}
                >
                  {t("teacherDashboard.common.actions.refresh", "Refresh")}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openProgressModal()}
                >
                  {t("teacherDashboard.gradingCenter.actions.newGrade", "Add grade")}
                </Button>
              </Space>
            </Col>
          </Row>
          {renderSummaryCards()}

          <Space
            direction={computedIsMobile ? "vertical" : "horizontal"}
            style={{ width: "100%" }}
            size="middle"
            wrap
          >
          <Input
            allowClear
            style={{ width: computedIsMobile ? "100%" : 260 }}
            prefix={<SearchOutlined />}
            placeholder={t(
              "teacherDashboard.gradingCenter.search.placeholder",
              "Search by student or assignment"
            )}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
            <Select
              allowClear
              style={{ width: computedIsMobile ? "100%" : 180 }}
              placeholder={t(
                "teacherDashboard.gradingCenter.filters.course",
                "Filter by course"
              )}
              value={selectedCourseId}
              onChange={setSelectedCourseId}
            >
              {courses.map((course) => (
                <Option key={course._id || course.id} value={course._id || course.id}>
                  {course.title || course.name}
                </Option>
              ))}
            </Select>
            <Select
              allowClear
              style={{ width: computedIsMobile ? "100%" : 180 }}
              placeholder={t(
                "teacherDashboard.gradingCenter.filters.student",
                "Filter by student"
              )}
              value={selectedStudentFilter}
              onChange={setSelectedStudentFilter}
              showSearch
              optionFilterProp="label"
            >
              {students.map((student) => {
                const label = `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim() || student.name || student.email;
                return (
                  <Option
                    key={student._id || student.id}
                    value={student._id || student.id}
                    label={label}
                  >
                    {label}
                  </Option>
                );
              })}
            </Select>
            <Select
              allowClear
              style={{ width: computedIsMobile ? "100%" : 180 }}
              placeholder={t(
                "teacherDashboard.gradingCenter.filters.type",
                "Filter by type"
              )}
              value={selectedType}
              onChange={setSelectedType}
            >
              {["quiz", "homework", "exam", "project", "participation"].map(
                (type) => (
                  <Option key={type} value={type}>
                    {t(
                      `teacherDashboard.gradingCenter.assignmentTypes.${type}`,
                      type.charAt(0).toUpperCase() + type.slice(1)
                    )}
                  </Option>
                )
              )}
            </Select>
          </Space>
        </Card>

        <Card
          bodyStyle={{ padding: computedIsMobile ? 12 : 24 }}
          style={{ borderRadius: 18 }}
        >
          <Table
            rowKey={(record) => record._id || record.id}
            columns={tableColumns}
            dataSource={filteredProgress}
            loading={loading}
            pagination={{ pageSize: computedIsMobile ? 6 : 10, position: ["bottomCenter"] }}
            scroll={{ x: computedIsMobile ? undefined : 1000 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t(
                    "teacherDashboard.gradingCenter.empty",
                    "No graded work yet. Start by adding a grade."
                  )}
                />
              ),
            }}
            onRow={(record) => ({
              onClick: () => openStudentDrawer(record.studentId),
            })}
          />
        </Card>

        {!computedIsMobile && (
          <Card style={{ borderRadius: 18 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={4}>
                  {t(
                    "teacherDashboard.gradingCenter.sections.courseBreakdown",
                    "Course breakdown"
                  )}
                </Title>
                {courseBreakdown.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.gradingCenter.courseBreakdownEmpty",
                      "Grades will appear here when you start grading."
                    )}
                  />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={courseBreakdown}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Tag color="blue" key="graded">
                            {item.graded}/{item.total}
                          </Tag>,
                          <Tag color="green" key="average">
                            {item.average}%
                          </Tag>,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.courseTitle}
                          description={t(
                            "teacherDashboard.gradingCenter.courseBreakdownDescription",
                            "Graded {{graded}} of {{total}} submissions",
                            { graded: item.graded, total: item.total }
                          )}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>
                  {t(
                    "teacherDashboard.gradingCenter.sections.recentActivity",
                    "Recent activity"
                  )}
                </Title>
                {recentGrades.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.gradingCenter.recentActivityEmpty",
                      "No activity yet."
                    )}
                  />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={recentGrades}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge status="processing">
                              <Avatar icon={<RiseOutlined />} />
                            </Badge>
                          }
                          title={
                            <Space>
                              <Text strong>{item.studentDisplayName}</Text>
                              <Tag>{item.courseTitle}</Tag>
                            </Space>
                          }
                          description={
                            <Space size={8}>
                              <Text>
                                {item.assignmentName}
                                {item.grade && ` · ${item.grade}`}
                              </Text>
                              <Text type="secondary">
                                {formatDateTime(item.lastActivity)}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Col>
            </Row>
          </Card>
        )}
      </Space>

      <Modal
        title={
          editingProgress
            ? t("teacherDashboard.gradingCenter.modal.editTitle", "Edit grade")
            : t("teacherDashboard.gradingCenter.modal.createTitle", "Add grade")
        }
        open={progressModalVisible}
        onCancel={() => {
          setProgressModalVisible(false);
          setEditingProgress(null);
          progressForm.resetFields();
        }}
        footer={null}
        width={computedIsMobile ? "100%" : 640}
        destroyOnClose
      >
        <Form
          form={progressForm}
          layout="vertical"
          onFinish={handleCreateProgress}
        >
          <Form.Item
            name="courseId"
            label={t("teacherDashboard.gradingCenter.form.course", "Course")}
            rules={[
              { required: true, message: t("teacherDashboard.gradingCenter.validation.course", "Select a course") },
            ]}
          >
            <Select
              placeholder={t(
                "teacherDashboard.gradingCenter.form.coursePlaceholder",
                "Select course"
              )}
            >
              {courses.map((course) => (
                <Option key={course._id || course.id} value={course._id || course.id}>
                  {course.title || course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="studentId"
            label={t("teacherDashboard.gradingCenter.form.student", "Student")}
            rules={[
              { required: true, message: t("teacherDashboard.gradingCenter.validation.student", "Select a student") },
            ]}
          >
            <Select
              showSearch
              placeholder={t(
                "teacherDashboard.gradingCenter.form.studentPlaceholder",
                "Select student"
              )}
              optionFilterProp="label"
            >
              {students.map((student) => {
                const label = `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim() || student.name || student.email;
                return (
                  <Option
                    key={student._id || student.id}
                    value={student._id || student.id}
                    label={label}
                  >
                    {label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="assignmentType"
            label={t("teacherDashboard.gradingCenter.form.type", "Assignment type")}
            rules={[{ required: true }]}
          >
            <Select>
              {["quiz", "homework", "exam", "project", "participation"].map(
                (type) => (
                  <Option key={type} value={type}>
                    {t(
                      `teacherDashboard.gradingCenter.assignmentTypes.${type}`,
                      type
                    )}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="assignmentName"
            label={t("teacherDashboard.gradingCenter.form.assignment", "Assignment name")}
            rules={[
              {
                required: true,
                message: t(
                  "teacherDashboard.gradingCenter.validation.assignment",
                  "Enter the assignment name"
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="score"
                label={t("teacherDashboard.gradingCenter.form.score", "Score")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "teacherDashboard.gradingCenter.validation.score",
                      "Enter the score"
                    ),
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="maxScore"
                label={t("teacherDashboard.gradingCenter.form.maxScore", "Max score")}
                initialValue={100}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="grade"
            label={t("teacherDashboard.gradingCenter.form.grade", "Grade")}
          >
            <Select allowClear>
              {["A", "B", "C", "D", "F"].map((grade) => (
                <Option key={grade} value={grade}>
                  {grade}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="feedback"
            label={t("teacherDashboard.gradingCenter.form.feedback", "Feedback")}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingGrade}
              >
                {editingProgress
                  ? t("teacherDashboard.gradingCenter.actions.update", "Update")
                  : t("teacherDashboard.gradingCenter.actions.create", "Create")}
              </Button>
              <Button onClick={() => setProgressModalVisible(false)}>
                {t("teacherDashboard.common.actions.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("teacherDashboard.gradingCenter.view.title", "Grade details")}
        open={viewProgressModalVisible}
        onCancel={() => {
          setViewProgressModalVisible(false);
          setViewingProgress(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewProgressModalVisible(false)}>
            {t("teacherDashboard.common.actions.close", "Close")}
          </Button>,
        ]}
        width={computedIsMobile ? "95%" : 640}
        destroyOnClose
      >
        {viewingProgress ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.student", "Student")}>
              {viewingProgress.studentDisplayName}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.course", "Course")}>
              {viewingProgress.courseTitle}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.assignment", "Assignment")}>
              {viewingProgress.assignmentName}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.type", "Type")}>
              <Tag>{viewingProgress.assignmentType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.score", "Score")}>
              {viewingProgress.score != null
                ? `${viewingProgress.score}/${viewingProgress.maxScore}`
                : t("teacherDashboard.gradingCenter.labels.awaitingScore", "Awaiting score")}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.grade", "Grade")}>
              {viewingProgress.grade ? (
                <Tag color={gradeColorMap[viewingProgress.grade]}>
                  {viewingProgress.grade}
                </Tag>
              ) : (
                t("teacherDashboard.gradingCenter.labels.toGrade", "To grade")
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.feedback", "Feedback")}>
              {viewingProgress.feedback || t("teacherDashboard.gradingCenter.labels.noFeedback", "No feedback")}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.gradingCenter.view.lastUpdated", "Last updated")}>
              {formatDateTime(viewingProgress.lastActivity)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Skeleton active />
        )}
      </Modal>

      <Drawer
        title={
          focusedStudent
            ? `${t("teacherDashboard.gradingCenter.drawer.title", "Student workspace")}: ${
                focusedStudent.firstName || focusedStudent.lastName
                  ? `${focusedStudent.firstName || ""} ${
                      focusedStudent.lastName || ""
                    }`.trim()
                  : focusedStudent.name || focusedStudent.email
              }`
            : t("teacherDashboard.gradingCenter.drawer.empty", "Student workspace")
        }
        placement="right"
        width={computedIsMobile ? "100%" : 420}
        onClose={closeStudentDrawer}
        open={studentDrawerVisible}
        destroyOnClose
      >
        {focusedStudent ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card size="small" bordered={false} style={{ background: "rgba(79,70,229,0.06)" }}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space align="center">
                  <Avatar size={48} style={{ backgroundColor: "#4f46e5" }}>
                    {(focusedStudent.firstName || focusedStudent.name || "?").charAt(0)}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {`${focusedStudent.firstName || ""} ${
                        focusedStudent.lastName || ""
                      }`.trim() || focusedStudent.name || focusedStudent.email}
                    </Text>
                    <br />
                    <Text type="secondary">
                      {focusedStudent.email ||
                        t("teacherDashboard.common.labels.noEmail", "No email")}
                    </Text>
                  </div>
                </Space>
                <Divider style={{ margin: "12px 0" }} />
                <Space>
                  <Statistic
                    title={t("teacherDashboard.gradingCenter.drawer.stats.completed", "Completed")}
                    value={focusedStudentRecords.length}
                  />
                  <Statistic
                    title={t("teacherDashboard.gradingCenter.drawer.stats.average", "Average")}
                    value={
                      focusedStudentRecords.length
                        ? Math.round(
                            (focusedStudentRecords.reduce((acc, record) => {
                              if (record.score == null || record.maxScore == null) return acc;
                              return acc + (record.score / record.maxScore) * 100;
                            }, 0) /
                              focusedStudentRecords.length) *
                              10
                          ) / 10
                        : 0
                    }
                    suffix="%"
                  />
                </Space>
              </Space>
            </Card>

            <Card
              title={t(
                "teacherDashboard.gradingCenter.drawer.recentGrades",
                "Recent grades"
              )}
              size="small"
            >
              {focusedStudentRecords.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t(
                    "teacherDashboard.gradingCenter.drawer.noGrades",
                    "No grades recorded yet."
                  )}
                />
              ) : (
                <List
                  dataSource={focusedStudentRecords.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        item.grade ? (
                          <Tag color={gradeColorMap[item.grade]} key="grade">
                            {item.grade}
                          </Tag>
                        ) : (
                          <Tag key="grade">
                            {t("teacherDashboard.gradingCenter.labels.toGrade", "To grade")}
                          </Tag>
                        ),
                      ]}
                    >
                      <List.Item.Meta
                        title={item.assignmentName}
                        description={
                          <Space size={6}>
                            <Tag>{item.assignmentType}</Tag>
                            <Text type="secondary">
                              {formatDateTime(item.lastActivity)}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>

            <Card
              title={t(
                "teacherDashboard.gradingCenter.drawer.communication",
                "Message student"
              )}
              size="small"
            >
              <Form form={messageForm} layout="vertical" onFinish={handleSendMessage}>
                <Form.Item
                  name="subject"
                  label={t("teacherDashboard.gradingCenter.drawer.subject", "Subject")}
                  rules={[
                    { required: true, message: t("teacherDashboard.gradingCenter.validation.subject", "Enter a subject") },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="body"
                  label={t("teacherDashboard.gradingCenter.drawer.message", "Message")}
                  rules={[
                    { required: true, message: t("teacherDashboard.gradingCenter.validation.message", "Enter a message") },
                  ]}
                >
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<MessageOutlined />}
                      loading={messageSending}
                    >
                      {t("teacherDashboard.gradingCenter.actions.send", "Send")}
                    </Button>
                    <Button onClick={() => messageForm.resetFields()}>
                      {t("teacherDashboard.common.actions.clear", "Clear")}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>

              <Divider />

              <Text strong>
                {t(
                  "teacherDashboard.gradingCenter.drawer.conversation",
                  "Conversation history"
                )}
              </Text>
              <div style={{ maxHeight: 240, overflow: "auto", marginTop: 12 }}>
                {conversationLoading ? (
                  <Skeleton active />
                ) : conversation.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.gradingCenter.drawer.noConversation",
                      "No messages yet."
                    )}
                  />
                ) : (
                  <List
                    dataSource={conversation}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Space>
                              <Badge
                                status={
                                  item.direction === "incoming"
                                    ? "processing"
                                    : "success"
                                }
                              />
                              <Text>
                                {item.direction === "incoming"
                                  ? t("teacherDashboard.gradingCenter.drawer.studentLabel", "Student")
                                  : t("teacherDashboard.gradingCenter.drawer.teacherLabel", "You")}
                              </Text>
                              <Text type="secondary">
                                {formatDateTime(item.sentAt || item.createdAt)}
                              </Text>
                            </Space>
                          }
                          description={
                            <Paragraph style={{ marginBottom: 0 }}>
                              {item.body || item.message || item.content}
                            </Paragraph>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </Card>
          </Space>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t(
              "teacherDashboard.gradingCenter.drawer.placeholder",
              "Select a row from the table to view student details."
            )}
          />
        )}
      </Drawer>
    </div>
  );
};

export default TeacherGradingCenter;

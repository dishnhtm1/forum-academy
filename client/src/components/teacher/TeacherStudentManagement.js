import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  Grid,
  Input,
  List,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  GlobalOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  courseAPI,
  messageAPI,
  progressAPI,
  statsAPI,
  userAPI,
} from "../../utils/apiClient";

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const messageTemplatesConfig = (t) => [
  {
    key: "welcome",
    title: t("teacherDashboard.studentManagement.templates.welcome.title"),
    subject: t("teacherDashboard.studentManagement.templates.welcome.subject"),
    body: t("teacherDashboard.studentManagement.templates.welcome.body"),
  },
  {
    key: "reminder",
    title: t("teacherDashboard.studentManagement.templates.reminder.title"),
    subject: t("teacherDashboard.studentManagement.templates.reminder.subject"),
    body: t("teacherDashboard.studentManagement.templates.reminder.body"),
  },
  {
    key: "congrats",
    title: t("teacherDashboard.studentManagement.templates.congrats.title"),
    subject: t("teacherDashboard.studentManagement.templates.congrats.subject"),
    body: t("teacherDashboard.studentManagement.templates.congrats.body"),
  },
];

const getTeacherId = (user) =>
  user?._id || user?.id || user?.userId || user?.teacherId || null;

const makeStorageKey = (teacherId, suffix) =>
  `teacher_management_${teacherId || "guest"}_${suffix}`;

const normalizeRoleLabel = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const roleName = value.role || value.title || value.status || value.type;
    const name = `${value.firstName || value.givenName || value.name || ""} ${
      value.lastName || ""
    }`.trim();
    return roleName || name || value.label || null;
  }
  return null;
};

const normalizeStudentRecord = (raw, fallbackId) => {
  if (!raw) return null;
  const base =
    (typeof raw === "object" &&
      (raw.user || raw.student || raw.profile || raw.account)) ||
    raw;

  const id = base?._id || base?.id || base?.userId || fallbackId;
  const firstName =
    base?.firstName ||
    base?.givenName ||
    base?.name?.first ||
    base?.name ||
    "";
  const lastName =
    base?.lastName || base?.familyName || base?.name?.last || "";
  const email = base?.email || base?.contactEmail || base?.profileEmail || "";
  const normalizedName =
    typeof base?.name === "string"
      ? base.name
      : `${base?.name?.first || ""} ${base?.name?.last || ""}`.trim() ||
        base?.name?.full ||
        base?.displayName ||
        "";
  const derivedName = `${firstName} ${lastName}`.trim() || normalizedName;

  return {
    ...base,
    _id: id,
    id,
    firstName,
    lastName,
    email,
    name: derivedName,
  };
};

const getStudentDisplayName = (student, t) => {
  if (!student) {
    return t("teacherDashboard.studentManagement.unknownStudent", "Student");
  }

  const composed = `${student.firstName || ""} ${student.lastName || ""}`.trim();
  if (composed) return composed;

  if (typeof student.name === "string" && student.name.trim()) {
    return student.name.trim();
  }

  const nestedName = `${student.name?.first || ""} ${
    student.name?.last || ""
  }`.trim();
  if (nestedName) return nestedName;

  if (student.displayName) return student.displayName;
  if (student.username) return student.username;

  return t("teacherDashboard.studentManagement.unknownStudent", "Student");
};

const getStudentEmail = (student) => {
  if (!student) return "";
  if (typeof student.email === "string") return student.email;
  if (student.email?.primary) return student.email.primary;
  if (student.email?.address) return student.email.address;
  if (student.email?.value) return student.email.value;
  if (Array.isArray(student.emails) && student.emails.length > 0) {
    const first = student.emails.find(Boolean);
    if (typeof first === "string") return first;
    if (typeof first === "object") {
      return first.address || first.email || first.value || "";
    }
  }
  return "";
};

const getStudentInitial = (student, t) => {
  const name = getStudentDisplayName(student, t);
  return name.charAt(0).toUpperCase() || "S";
};

const TeacherStudentManagement = ({
  t: providedT,
  currentUser,
  isMobile,
}) => {
  const { t: i18nT, i18n } = useTranslation();
  const t = providedT || i18nT;
  const screens = useBreakpoint();
  const isMobileView = !screens.md;
  const isTabletView = screens.md && !screens.lg;
  const teacherId = getTeacherId(currentUser);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [progressRecords, setProgressRecords] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDrawerOpen, setStudentDrawerOpen] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bulkRecipients, setBulkRecipients] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [studentNotes, setStudentNotes] = useState({});
  const [noteDraft, setNoteDraft] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("active");

  const [messageForm] = Form.useForm();
  const [taskForm] = Form.useForm();

  const templates = useMemo(
    () => messageTemplatesConfig(t),
    [i18n.language, t]
  );

  const selectedCourseDetails = useMemo(
    () =>
      courses.find(
        (course) =>
          (course._id || course.id || course.courseId) === selectedCourse
      ),
    [courses, selectedCourse]
  );

  const loadPersistedState = useCallback(() => {
    if (!teacherId) return;

    try {
      const tasksKey = makeStorageKey(teacherId, "tasks");
      const notesKey = makeStorageKey(teacherId, "notes");

      const storedTasks = JSON.parse(localStorage.getItem(tasksKey) || "[]");
      const storedNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");

      setTasks(Array.isArray(storedTasks) ? storedTasks : []);
      setStudentNotes(
        typeof storedNotes === "object" && storedNotes !== null ? storedNotes : {}
      );
    } catch (error) {
      console.error("Failed to load persisted teacher data:", error);
    }
  }, [teacherId]);

  const persistTasks = useCallback(
    (nextTasks) => {
      setTasks(nextTasks);
      if (teacherId) {
        localStorage.setItem(
          makeStorageKey(teacherId, "tasks"),
          JSON.stringify(nextTasks)
        );
      }
    },
    [teacherId]
  );

  const persistNotes = useCallback(
    (nextNotes) => {
      setStudentNotes(nextNotes);
      if (teacherId) {
        localStorage.setItem(
          makeStorageKey(teacherId, "notes"),
          JSON.stringify(nextNotes)
        );
      }
    },
    [teacherId]
  );

  const loadConversation = useCallback(
    (studentId) => {
      if (!teacherId || !studentId) return [];
      const key = makeStorageKey(
        teacherId,
        `conversation_${studentId.toString()}`
      );
      try {
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        console.error("Failed to parse conversation history:", error);
        return [];
      }
    },
    [teacherId]
  );

  const persistConversation = useCallback(
    (studentId, entries) => {
      if (!teacherId || !studentId) return;
      const key = makeStorageKey(
        teacherId,
        `conversation_${studentId.toString()}`
      );
      localStorage.setItem(key, JSON.stringify(entries));
    },
    [teacherId]
  );

  const fetchCourses = useCallback(async () => {
    if (!currentUser) return;

    try {
      setRosterLoading(true);
      const response = await courseAPI.getAll();
        const allCourses = response.courses || response || [];

      const normalizedTeacherId = getTeacherId(currentUser);
      const teacherCourses = allCourses.filter((course) => {
        const teacherField =
          course.teacher ||
          course.teacherId ||
          course.instructor ||
          course.owner;
        if (!teacherField) return false;

        if (typeof teacherField === "string") {
          return teacherField === normalizedTeacherId;
        }

        if (typeof teacherField === "object") {
          return (
            teacherField._id === normalizedTeacherId ||
            teacherField.id === normalizedTeacherId
          );
        }

        return false;
      });

        setCourses(teacherCourses);

      if (
        teacherCourses.length > 0 &&
        !teacherCourses.some(
          (course) =>
            (course._id || course.id || course.courseId) === selectedCourse
        )
      ) {
          setSelectedCourse(teacherCourses[0]._id || teacherCourses[0].id);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error(
        t(
          "teacherDashboard.studentManagement.errors.courses",
          "Failed to load your courses."
        )
      );
    } finally {
      setRosterLoading(false);
    }
  }, [currentUser, selectedCourse, t]);

  const fetchStudents = useCallback(async () => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const getRoleForStudent = (courseData, studentId) =>
      normalizeRoleLabel(
        courseData?.roleAssignments?.[studentId] ||
          courseData?.studentRoles?.[studentId]
      );

    try {
      setRosterLoading(true);
      const response = await courseAPI.getById(selectedCourse);
        const course = response.course || response;

      if (!course || !Array.isArray(course.students)) {
        setStudents([]);
        return;
      }

      const roster = await Promise.all(
        course.students.map(async (studentEntry) => {
          if (!studentEntry) return null;

          // Student already populated
          if (typeof studentEntry === "object") {
            const normalized = normalizeStudentRecord(studentEntry);
            if (!normalized?._id && !normalized?.id) {
              return null;
            }
            const key = normalized._id || normalized.id;
            return {
              ...normalized,
              courseRole: getRoleForStudent(course, key),
            };
          }

          // Student provided as ID reference
          const studentId = studentEntry;
          try {
            if (!userAPI.getById) {
              return {
                _id: studentId,
                id: studentId,
                firstName: t("teacherDashboard.studentManagement.unknown"),
                lastName: "",
                email: "",
                status: "unknown",
                courseRole: getRoleForStudent(course, studentId),
              };
            }

              const studentRes = await userAPI.getById(studentId);
            const normalized = normalizeStudentRecord(
              studentRes.user || studentRes,
              studentId
            );
            if (!normalized) {
              return {
                _id: studentId,
                id: studentId,
                firstName: t("teacherDashboard.studentManagement.unknown"),
                lastName: "",
                email: "",
                status: "unknown",
                courseRole: getRoleForStudent(course, studentId),
              };
            }

            return {
              ...normalized,
              courseRole: getRoleForStudent(course, studentId),
            };
          } catch (error) {
            console.warn("Failed to fetch student profile:", studentId, error);
            return {
              _id: studentId,
              id: studentId,
              firstName: t("teacherDashboard.studentManagement.unknown"),
              lastName: "",
              email: "",
              status: "unknown",
              courseRole: getRoleForStudent(course, studentId),
            };
            }
          })
        );

      setStudents(roster.filter(Boolean));
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error(
        t(
          "teacherDashboard.studentManagement.errors.students",
          "Failed to load enrolled students."
        )
      );
    } finally {
      setRosterLoading(false);
    }
  }, [selectedCourse, t]);

  const fetchProgress = useCallback(async () => {
    if (!teacherId) return;
    try {
      setProgressLoading(true);
      const response = await progressAPI.getAll();
      const records = response.progress || response.data || response || [];
      const teacherRecords = Array.isArray(records)
        ? records.filter((record) => {
            const teacherField = record.teacher;
            if (!teacherField) return false;
            if (typeof teacherField === "string") {
              return teacherField === teacherId;
            }
            return (
              teacherField._id === teacherId ||
              teacherField.id === teacherId ||
              teacherField === teacherId
            );
          })
        : [];
      setProgressRecords(teacherRecords);
    } catch (error) {
      console.error("Failed to fetch progress records:", error);
    } finally {
      setProgressLoading(false);
    }
  }, [teacherId]);

  const fetchAnalytics = useCallback(async () => {
    if (!currentUser) return;
    try {
      setAnalyticsLoading(true);
      const response = await statsAPI.getTeacherAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error("Failed to fetch teacher analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadPersistedState();
  }, [loadPersistedState]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
      fetchStudents();
  }, [fetchStudents]);

  const updateConversationState = useCallback(
    (studentId) => {
      const entries = loadConversation(studentId);
      setConversation(entries);
    },
    [loadConversation]
  );

  const handleViewStudent = useCallback(
    (student) => {
      if (!student) return;
      setSelectedStudent(student);
      setStudentDrawerOpen(true);
      setConversationLoading(true);

      const entries = loadConversation(student._id || student.id);
      setConversation(entries);
      setConversationLoading(false);

      const existingNote =
        studentNotes?.[student._id || student.id] ||
        t(
          "teacherDashboard.studentManagement.notes.defaultPrompt",
          "Add your first note for this student."
        );
      setNoteDraft(existingNote === "__EMPTY__" ? "" : existingNote);
    },
    [loadConversation, studentNotes, t]
  );

  const handleCloseStudentDrawer = useCallback(() => {
    setStudentDrawerOpen(false);
    setSelectedStudent(null);
    setConversation([]);
    setNoteDraft("");
  }, []);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return students
      .map((student) => {
        const metricsKey = student._id || student.id;
        return {
          ...student,
          metricsKey,
        };
      })
      .filter((student) => {
        const matchesTerm =
          !term ||
          `${student.firstName || ""} ${student.lastName || ""}`
            .toLowerCase()
            .includes(term) ||
          student.email?.toLowerCase().includes(term);

        if (!matchesTerm) return false;

        if (statusFilter === "all") return true;

        const computedStatus =
          student.status ||
          student.engagementStatus ||
          student.courseRole ||
          "active";

        if (statusFilter === "active") {
          return computedStatus !== "inactive";
        }
        if (statusFilter === "attention") {
          const metrics = progressRecords.filter(
            (record) =>
              (record.student?._id || record.student) ===
              (student._id || student.id)
          );
          if (!metrics.length) return true;

          const average =
            metrics.reduce(
              (sum, record) => sum + (record.percentage ?? 0),
              0
            ) / metrics.length;
          return average < 70;
        }
        if (statusFilter === "inactive") {
          return computedStatus === "inactive";
        }
        return true;
      });
  }, [students, searchTerm, statusFilter, progressRecords]);

  const studentMetrics = useMemo(() => {
    if (!students.length) return {};

    const courseTitle = selectedCourseDetails?.title?.toLowerCase();
    const courseCode = selectedCourseDetails?.code?.toLowerCase();

    return students.reduce((acc, student) => {
      const studentId = student._id || student.id;
      const records = progressRecords
        .filter((record) => {
          const recordStudentId =
            record.student?._id ||
            record.student?.id ||
            record.student ||
            record.studentId;
          if (recordStudentId?.toString() !== studentId?.toString()) {
            return false;
          }
          if (!selectedCourseDetails) return true;

          const subject = record.subject?.toLowerCase() || "";
          return (
            subject.includes(courseCode || "") ||
            subject.includes(courseTitle || "")
          );
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.gradedDate || 0) -
            new Date(a.createdAt || a.gradedDate || 0)
        );

      const average =
        records.length > 0
          ? Math.round(
              (records.reduce(
                (sum, record) => sum + (record.percentage ?? 0),
                0
              ) /
                records.length) *
                10
            ) / 10
          : null;

      const lastSubmission = records[0];
      const submissionsLast30 = records.filter((record) => {
        const createdAt = new Date(record.createdAt || record.submissionDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      }).length;

      const engagementScore = Math.min(submissionsLast30 * 20 + (average || 0) / 5, 100);
      const engagementStatus =
        engagementScore >= 75
          ? "high"
          : engagementScore >= 40
          ? "medium"
          : "low";

      acc[studentId] = {
        averageScore: average,
        lastSubmission,
        submissionsLast30,
        engagementScore,
        engagementStatus,
        tags: lastSubmission?.tags || [],
        grade: lastSubmission?.grade || lastSubmission?.calculatedGrade || null,
        records,
      };
      return acc;
    }, {});
  }, [students, progressRecords, selectedCourseDetails]);

  const engagementTag = (status) => {
    if (status === "high") {
      return (
        <Tag color="green">
          {t(
            "teacherDashboard.studentManagement.engagement.high",
            "Highly engaged"
          )}
        </Tag>
      );
    }
    if (status === "medium") {
      return (
        <Tag color="blue">
          {t(
            "teacherDashboard.studentManagement.engagement.medium",
            "Moderate"
          )}
        </Tag>
      );
    }
    return (
      <Tag color="volcano">
        {t("teacherDashboard.studentManagement.engagement.low", "Needs focus")}
      </Tag>
    );
  };

  const formatDate = (value) => {
    if (!value) return t("teacherDashboard.studentManagement.empty", "—");
    try {
      return new Date(value).toLocaleString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return t("teacherDashboard.studentManagement.empty", "—");
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templates.find((item) => item.key === templateKey);
    setSelectedTemplate(templateKey);
    if (!template) return;

    messageForm.setFieldsValue({
      subject: template.subject,
      content: template.body.replace(
        "{{studentName}}",
        selectedStudent
          ? `${selectedStudent.firstName || ""} ${
              selectedStudent.lastName || ""
            }`.trim()
          : t("teacherDashboard.studentManagement.templates.placeholderName", {
              defaultValue: "student",
            })
      ),
    });
  };

  const resetMessageModal = () => {
    setSelectedTemplate(null);
    setBulkRecipients([]);
    messageForm.resetFields();
  };

  const openMessageModal = (student = null) => {
    if (student) {
    setSelectedStudent(student);
      setBulkRecipients([]);
    }
    setMessageModalVisible(true);
  };

  const openBulkMessageModal = () => {
    const recipientIds = filteredStudents.map(
      (student) => student._id || student.id
    );
    setBulkRecipients(recipientIds);
    setMessageModalVisible(true);
  };

  const handleSendMessage = async (values) => {
    const recipients =
      bulkRecipients.length > 0
        ? students.filter((student) =>
            bulkRecipients.includes(student._id || student.id)
          )
        : selectedStudent
        ? [selectedStudent]
        : [];

    if (recipients.length === 0) {
      message.warning(
        t(
          "teacherDashboard.studentManagement.errors.recipient",
          "Select at least one recipient."
        )
      );
      return;
    }

    try {
      message.loading({
        content: t(
          "teacherDashboard.studentManagement.messages.sending",
          "Sending message..."
        ),
        key: "send-message",
      });

      await Promise.all(
        recipients.map(async (recipient) => {
          const payload = {
            recipientId: recipient._id || recipient.id,
            recipientEmail: recipient.email,
            recipientName: `${recipient.firstName || ""} ${
              recipient.lastName || ""
            }`.trim(),
        subject: values.subject,
            message: values.content,
            type:
              bulkRecipients.length > 1
                ? "teacher_to_group"
                : "teacher_to_student",
          };

          await messageAPI.sendToStudent(payload);

          const entry = {
            id: Date.now(),
            direction: "outgoing",
            subject: values.subject,
            body: values.content,
            sentAt: new Date().toISOString(),
          };

          const studentId = recipient._id || recipient.id;
          const history = [...loadConversation(studentId), entry];
          persistConversation(studentId, history);
          if (selectedStudent && studentId === (selectedStudent._id || selectedStudent.id)) {
            setConversation(history);
          }
        })
      );

      message.success({
        content: t(
          "teacherDashboard.studentManagement.messages.sent",
          "Message sent successfully."
        ),
        key: "send-message",
      });

      resetMessageModal();
      setMessageModalVisible(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      message.error({
        content: t(
          "teacherDashboard.studentManagement.errors.messageSend",
          "Unable to send message. Please try again."
        ),
        key: "send-message",
      });
    }
  };

  const handleStudentNoteSave = () => {
    if (!selectedStudent) return;

    const studentId = selectedStudent._id || selectedStudent.id;
    const nextNotes = {
      ...studentNotes,
      [studentId]: noteDraft.trim() === "" ? "__EMPTY__" : noteDraft.trim(),
    };

    persistNotes(nextNotes);
    message.success(
      t(
        "teacherDashboard.studentManagement.notes.saved",
        "Note saved for this student."
      )
    );
  };

  const handleAddTask = (values) => {
    const nextTasks = [
      ...tasks,
      {
        id: `${Date.now()}`,
        title: values.title.trim(),
        relatedStudentId: values.relatedStudentId || null,
        dueDate: values.dueDate || null,
        createdAt: new Date().toISOString(),
        status: "pending",
      },
    ];
    persistTasks(nextTasks);
    taskForm.resetFields();
    message.success(
      t("teacherDashboard.studentManagement.tasks.added", "Task added")
    );
  };

  const handleToggleTaskStatus = (taskId) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: task.status === "completed" ? "pending" : "completed",
            completedAt:
              task.status === "completed" ? null : new Date().toISOString(),
          }
        : task
    );
    persistTasks(nextTasks);
  };

  const handleDeleteTask = (taskId) => {
    persistTasks(tasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = useMemo(() => {
    if (taskFilter === "all") return tasks;
    if (taskFilter === "active")
      return tasks.filter((task) => task.status !== "completed");
    if (taskFilter === "completed")
      return tasks.filter((task) => task.status === "completed");
    return tasks;
  }, [tasks, taskFilter]);

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        value: course._id || course.id || course.courseId,
        label: `${course.title || course.name} (${course.code || "N/A"})`,
      })),
    [courses]
  );

  const filterControls = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: screens.md ? 12 : 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Select
        showSearch
        placeholder={t(
          "teacherDashboard.studentManagement.selectCourse",
          "Select course"
        )}
        value={selectedCourse}
        onChange={setSelectedCourse}
        optionFilterProp="label"
        allowClear={false}
        options={courseOptions}
        size={screens.md ? "middle" : "large"}
        style={{
          flex: "1 1 220px",
          minWidth: screens.md ? 200 : "100%",
          maxWidth: screens.lg ? 260 : "100%",
        }}
      />
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={t(
          "teacherDashboard.studentManagement.searchPlaceholder",
          "Search students..."
        )}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        size={screens.md ? "middle" : "large"}
        style={{
          flex: "2 1 260px",
          minWidth: screens.md ? 200 : "100%",
        }}
      />
      <Select
        value={statusFilter}
        onChange={setStatusFilter}
        size={screens.md ? "middle" : "large"}
        suffixIcon={<FilterOutlined />}
        style={{
          flex: "0 1 180px",
          minWidth: screens.md ? 160 : "100%",
        }}
      >
        <Option value="all">
          {t("teacherDashboard.studentManagement.filters.all", "All students")}
        </Option>
        <Option value="active">
          {t("teacherDashboard.studentManagement.filters.active", "Active")}
        </Option>
        <Option value="attention">
          {t(
            "teacherDashboard.studentManagement.filters.needsAttention",
            "Needs attention"
          )}
        </Option>
        <Option value="inactive">
          {t("teacherDashboard.studentManagement.filters.inactive", "Inactive")}
        </Option>
      </Select>
      <Tooltip
        title={t(
          "teacherDashboard.studentManagement.actions.bulkMessage",
          "Send message to filtered students"
        )}
      >
        <Button
          icon={<MailOutlined />}
          onClick={openBulkMessageModal}
          disabled={filteredStudents.length === 0}
          size={screens.md ? "middle" : "large"}
          block={!screens.md}
          style={{
            flex: screens.md ? "0 0 190px" : "1 1 100%",
            minWidth: screens.md ? 170 : "100%",
          }}
        >
          {t(
            "teacherDashboard.studentManagement.actions.bulkMessageShort",
            "Message filtered"
          )}
        </Button>
      </Tooltip>
    </div>
  );

  const studentColumns = useMemo(() => {
    const columns = [
      {
        title: t("teacherDashboard.studentManagement.columns.student", "Student"),
      key: "student",
        dataIndex: "firstName",
        responsive: ["md"],
        render: (_, record) => {
          const metrics = studentMetrics[record._id || record.id];
          const displayName = getStudentDisplayName(record, t);
          const email = getStudentEmail(record);
          const avatarLetter = getStudentInitial(record, t);
          return (
            <Space size="middle">
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#4f46e5" }}
              >
                {avatarLetter}
              </Avatar>
          <div>
                <Text strong>{displayName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
                  {email ||
                    t("teacherDashboard.studentManagement.noEmail", "No email")}
            </Text>
                <br />
                {typeof record.courseRole === "string" && record.courseRole && (
                  <Tag color="geekblue">{record.courseRole}</Tag>
                )}
                {metrics?.tags?.slice(0, 2).map((tag) => (
                  <Tag key={tag} color="purple">
                    {tag}
                  </Tag>
                ))}
          </div>
        </Space>
          );
        },
      },
      {
        title: t(
          "teacherDashboard.studentManagement.columns.performance",
          "Performance"
        ),
        key: "performance",
        align: "center",
        responsive: ["lg"],
        render: (_, record) => {
          const metrics = studentMetrics[record._id || record.id];
          if (!metrics || metrics.averageScore == null) {
            return (
              <Text type="secondary">
                {t("teacherDashboard.studentManagement.noData", "No data")}
              </Text>
            );
          }
          return (
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={Math.min(Math.max(metrics.averageScore, 0), 100)}
                size={70}
                strokeColor={
                  metrics.averageScore >= 80
                    ? "#16a34a"
                    : metrics.averageScore >= 60
                    ? "#2563eb"
                    : "#f97316"
                }
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  {t(
                    "teacherDashboard.studentManagement.labels.recentGrade",
                    "Latest grade"
                  )}
                  :{" "}
                  <Text strong>
                    {metrics.grade ||
                      t(
                        "teacherDashboard.studentManagement.noGrade",
                        "Unpublished"
                      )}
                  </Text>
                </Text>
              </div>
            </div>
          );
        },
      },
      {
        title: t(
          "teacherDashboard.studentManagement.columns.recentActivity",
          "Recent activity"
        ),
        key: "recentActivity",
        responsive: ["lg"],
        render: (_, record) => {
          const metrics = studentMetrics[record._id || record.id];
          if (!metrics?.lastSubmission) {
            return (
              <Text type="secondary">
                {t(
                  "teacherDashboard.studentManagement.labels.noRecentWork",
                  "No recent submissions"
                )}
              </Text>
            );
          }
          return (
            <div>
              <Text strong>{metrics.lastSubmission.assignment}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatDate(metrics.lastSubmission.createdAt)}
              </Text>
              <br />
              <Tag color="blue">{metrics.lastSubmission.assignmentType}</Tag>
            </div>
          );
        },
      },
      {
        title: t(
          "teacherDashboard.studentManagement.columns.engagement",
          "Engagement"
        ),
        key: "engagement",
        responsive: ["md"],
        render: (_, record) => {
          const metrics = studentMetrics[record._id || record.id];
          if (!metrics) {
            return engagementTag("medium");
          }
          return (
            <Space direction="vertical" size={4}>
              {engagementTag(metrics.engagementStatus)}
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t(
                  "teacherDashboard.studentManagement.labels.submissionsLast30",
                  "{{count}} submissions in the last 30 days",
                  { count: metrics.submissionsLast30 }
                )}
              </Text>
            </Space>
          );
        },
      },
      {
        title: t("teacherDashboard.studentManagement.columns.actions", "Actions"),
      key: "actions",
        width: 160,
        fixed: screens.md ? "right" : undefined,
      render: (_, record) => (
        <Space>
            <Tooltip
              title={t(
                "teacherDashboard.studentManagement.actions.viewProfile",
                "View profile"
              )}
            >
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewStudent(record)}
            />
          </Tooltip>
            <Tooltip
              title={t(
                "teacherDashboard.studentManagement.actions.sendMessage",
                "Send message"
              )}
            >
            <Button
              icon={<MessageOutlined />}
              size="small"
                onClick={() => openMessageModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

    return columns;
  }, [
    engagementTag,
    handleViewStudent,
    openMessageModal,
    screens.md,
    studentMetrics,
    t,
  ]);

  const overviewCards = [
    {
      key: "students",
      title: t(
        "teacherDashboard.studentManagement.overview.totalStudents",
        "Active students"
      ),
      value:
        analytics?.overview?.totalStudents ??
        students.length ??
        0,
      icon: <TeamOutlined />,
      color: "#2563eb",
    },
    {
      key: "submissions",
      title: t(
        "teacherDashboard.studentManagement.overview.recentSubmissions",
        "Recent submissions"
      ),
      value: analytics?.overview?.recentSubmissions ?? 0,
      icon: <BarChartOutlined />,
      color: "#22c55e",
    },
    {
      key: "averageScore",
      title: t(
        "teacherDashboard.studentManagement.overview.averageScore",
        "Average score"
      ),
      value: analytics?.overview?.averageScore ?? 0,
      suffix: "%",
      icon: <CheckCircleOutlined />,
      color: "#f97316",
    },
    {
      key: "activeStudents",
      title: t(
        "teacherDashboard.studentManagement.overview.activeStudents",
        "Engaged last 30 days"
      ),
      value: analytics?.overview?.activeStudents ?? 0,
      icon: <ClockCircleOutlined />,
      color: "#a855f7",
    },
  ];

  const tasksHeader = (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {t("teacherDashboard.studentManagement.tasks.title", "Follow-up tasks")}
            </Title>
          <Text type="secondary">
            {t(
              "teacherDashboard.studentManagement.tasks.subtitle",
              "Keep priorities visible and track next actions."
            )}
          </Text>
        </div>
          <Select
          size={isMobileView ? "middle" : "large"}
          value={taskFilter}
          onChange={setTaskFilter}
          style={{
            width: isMobileView ? "100%" : 150,
            minWidth: 140,
          }}
        >
          <Option value="active">
            {t("teacherDashboard.studentManagement.tasks.filters.active", "Active")}
              </Option>
          <Option value="completed">
            {t(
              "teacherDashboard.studentManagement.tasks.filters.completed",
              "Completed"
            )}
          </Option>
          <Option value="all">
            {t("teacherDashboard.studentManagement.tasks.filters.all", "All")}
          </Option>
          </Select>
      </div>
      <Form form={taskForm} layout="vertical" onFinish={handleAddTask}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            width: "100%",
          }}
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: t(
                  "teacherDashboard.studentManagement.tasks.validation.title",
                  "Enter a task title"
                ),
              },
            ]}
            style={{
              flex: "2 1 280px",
              minWidth: isMobileView ? "100%" : 220,
              marginBottom: 0,
            }}
          >
          <Input
              prefix={<PlusOutlined />}
              placeholder={t(
                "teacherDashboard.studentManagement.tasks.placeholders.title",
                "Schedule a 1:1 with..."
              )}
              size={isMobileView ? "middle" : "large"}
            />
          </Form.Item>
          <Form.Item
            name="relatedStudentId"
            style={{
              flex: "1 1 220px",
              minWidth: isMobileView ? "100%" : 200,
              marginBottom: 0,
            }}
          >
            <Select
              allowClear
              placeholder={t(
                "teacherDashboard.studentManagement.tasks.placeholders.student",
                "Link a student"
              )}
              options={students.map((student) => ({
                label:
                  `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                  student.name,
                value: student._id || student.id,
              }))}
              size={isMobileView ? "middle" : "large"}
            />
          </Form.Item>
          <Form.Item
            name="dueDate"
            style={{
              flex: "0 1 180px",
              minWidth: isMobileView ? "100%" : 160,
              marginBottom: 0,
            }}
          >
            <Input
              type="date"
              placeholder={t(
                "teacherDashboard.studentManagement.tasks.placeholders.dueDate",
                "Due date"
              )}
              size={isMobileView ? "middle" : "large"}
            />
          </Form.Item>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: 16 }}
          block={isMobileView}
          size={isMobileView ? "middle" : "large"}
        >
          {t("teacherDashboard.studentManagement.tasks.add", "Add task")}
        </Button>
      </Form>
        </Space>
  );

  const renderTaskItem = (task) => {
    const relatedStudent =
      students.find(
        (student) => (student._id || student.id) === task.relatedStudentId
      ) || null;
    const isCompleted = task.status === "completed";
    const statusColor = isCompleted ? "#16a34a" : "#2563eb";
    const statusLabel = isCompleted
      ? t(
          "teacherDashboard.studentManagement.tasks.filters.completed",
          "Completed"
        )
      : t(
          "teacherDashboard.studentManagement.tasks.filters.active",
          "Active"
        );
    const dueLabel = task.dueDate ? formatDate(task.dueDate) : null;

    return (
      <List.Item style={{ padding: screens.md ? "16px 12px" : "14px 8px" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 16,
            alignItems: isMobileView ? "flex-start" : "center",
            flexWrap: isMobileView ? "wrap" : "nowrap",
          }}
        >
          <Badge color={statusColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Space size={8} wrap>
              <Text
                strong
                style={{ fontSize: 15 }}
                delete={isCompleted}
                type={isCompleted ? "secondary" : undefined}
              >
                {task.title}
              </Text>
              <Tag color={isCompleted ? "green" : "blue"}>{statusLabel}</Tag>
            </Space>
            <Space direction="vertical" size={4} style={{ marginTop: 6 }}>
              {relatedStudent && (
                <Space size={6}>
                  <UserOutlined style={{ color: "#64748b" }} />
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => handleViewStudent(relatedStudent)}
                  >
                    {(() => {
                      const composed = `${relatedStudent.firstName || ""} ${
                        relatedStudent.lastName || ""
                      }`.trim();
                      if (composed) return composed;
                      if (typeof relatedStudent.name === "string") {
                        return relatedStudent.name;
                      }
                      return (
                        `${relatedStudent.name?.first || ""} ${
                          relatedStudent.name?.last || ""
                        }`.trim() ||
                        relatedStudent.name?.full ||
                        ""
                      );
                    })()}
                  </Button>
                </Space>
              )}
              {dueLabel && (
                <Space size={6}>
                  <ClockCircleOutlined style={{ color: "#f97316" }} />
                  <Text type="secondary">
                    {t("teacherDashboard.studentManagement.tasks.due", "Due")}{" "}
                    {dueLabel}
                  </Text>
                </Space>
              )}
            </Space>
          </div>
          <Space size="middle" wrap>
            <Button
              type="link"
              onClick={() => handleToggleTaskStatus(task.id)}
              style={{ padding: 0 }}
            >
              {isCompleted
                ? t(
                    "teacherDashboard.studentManagement.tasks.markPending",
                    "Reopen"
                  )
                : t(
                    "teacherDashboard.studentManagement.tasks.markDone",
                    "Complete"
                  )}
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleDeleteTask(task.id)}
              style={{ padding: 0 }}
            >
              {t("teacherDashboard.studentManagement.tasks.delete", "Delete")}
            </Button>
          </Space>
        </div>
      </List.Item>
    );
  };

  const studentDrawerTabs = useMemo(() => {
    if (!selectedStudent) return [];
    const studentId = selectedStudent._id || selectedStudent.id;
    const metrics = studentMetrics[studentId] || {};

    return [
      {
        key: "overview",
        label: t("teacherDashboard.studentManagement.drawer.overview", "Overview"),
        children: (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item
              label={t("teacherDashboard.studentManagement.drawer.email", "Email")}
            >
              {selectedStudent.email ||
                t("teacherDashboard.studentManagement.noEmail", "No email")}
            </Descriptions.Item>
            <Descriptions.Item
              label={t("teacherDashboard.studentManagement.drawer.status", "Status")}
            >
              {engagementTag(metrics.engagementStatus)}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                "teacherDashboard.studentManagement.drawer.averageScore",
                "Average score"
              )}
            >
              {metrics.averageScore != null
                ? `${metrics.averageScore}%`
                : t("teacherDashboard.studentManagement.noData", "No data")}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                "teacherDashboard.studentManagement.drawer.submissions30",
                "Submissions (30 days)"
              )}
            >
              {metrics.submissionsLast30 || 0}
            </Descriptions.Item>
          </Descriptions>
        ),
      },
      {
        key: "progress",
        label: t(
          "teacherDashboard.studentManagement.drawer.progress",
          "Progress history"
        ),
        children: (
          <List
            dataSource={metrics.records || []}
            locale={{
              emptyText: t(
                "teacherDashboard.studentManagement.drawer.noProgress",
                "No progress records yet."
              ),
            }}
            renderItem={(record) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Tag color="blue">{record.assignmentType}</Tag>
                      <Text strong>{record.assignment}</Text>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">{formatDate(record.createdAt)}</Text>
                      <Text>
                        {t(
                          "teacherDashboard.studentManagement.drawer.score",
                          "Score"
                        )}
                        : {record.score}/{record.maxScore} (
                        {Math.round(record.percentage ?? 0)}%)
                      </Text>
                      {record.comments && (
                        <Text type="secondary">{record.comments}</Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ),
      },
      {
        key: "communication",
        label: t(
          "teacherDashboard.studentManagement.drawer.communication",
          "Communication"
        ),
        children: conversationLoading ? (
          <Spin />
        ) : (
          <Timeline
            mode="left"
            items={
              conversation.length > 0
                ? conversation
                    .slice()
                    .reverse()
                    .map((entry) => ({
                      color: entry.direction === "outgoing" ? "blue" : "green",
                      children: (
                        <Card size="small">
                          <Text strong>{entry.subject}</Text>
                          <br />
                          <Text type="secondary">{formatDate(entry.sentAt)}</Text>
                          <Divider style={{ margin: "12px 0" }} />
                          <Text>{entry.body}</Text>
                        </Card>
                      ),
                    }))
                : [
                    {
                      color: "gray",
                      children: (
                        <Text type="secondary">
                          {t(
                            "teacherDashboard.studentManagement.drawer.noMessages",
                            "No conversations yet."
                          )}
                        </Text>
                      ),
                    },
                  ]
            }
          />
        ),
      },
      {
        key: "notes",
        label: t("teacherDashboard.studentManagement.drawer.notes", "Notes"),
        children: (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <TextArea
              rows={6}
              value={noteDraft === "__EMPTY__" ? "" : noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder={t(
                "teacherDashboard.studentManagement.notes.placeholder",
                "Document follow-up plans, strengths, and concerns."
              )}
            />
            <Button type="primary" onClick={handleStudentNoteSave}>
              {t("teacherDashboard.studentManagement.notes.save", "Save note")}
            </Button>
          </Space>
        ),
      },
    ];
  }, [
    conversation,
    conversationLoading,
    engagementTag,
    noteDraft,
    selectedStudent,
    studentMetrics,
    t,
  ]);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
  ];

  return (
    <div style={{ padding: isMobile ? 16 : 24 }}>
      <Space
        direction="vertical"
        size="large"
        style={{ display: "flex", width: "100%" }}
      >
        <Card>
          <Row
            align="middle"
            gutter={[16, 16]}
            justify="space-between"
            style={{ flexWrap: "wrap" }}
          >
            <Col flex="auto">
              <Space size="middle">
                <TeamOutlined style={{ fontSize: 28, color: "#2563eb" }} />
                <div>
                  <Title level={2} style={{ margin: 0 }}>
                    {t(
                      "teacherDashboard.studentManagement.title",
                      "Student management workspace"
                    )}
                  </Title>
                  <Text type="secondary">
                    {t(
                      "teacherDashboard.studentManagement.subtitle",
                      "Track progress, follow up quickly, and keep classes thriving."
                    )}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size="middle" wrap>
                <Select
                  value={i18n.language.startsWith("ja") ? "ja" : "en"}
                  onChange={handleLanguageChange}
                  prefix={<GlobalOutlined />}
                  style={{ width: 140 }}
                  options={languageOptions}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    fetchStudents();
                    fetchProgress();
                    fetchAnalytics();
                  }}
                >
                  {t("teacherDashboard.studentManagement.actions.refresh", "Refresh")}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {overviewCards.map((card) => (
            <Col xs={24} sm={12} md={12} lg={6} key={card.key}>
              <Card>
                <Space align="center" size="large">
                  <Avatar
                    size={48}
                    style={{
                      backgroundColor: card.color,
                    }}
                    icon={card.icon}
                  />
                  <div>
                    <Text type="secondary">{card.title}</Text>
                    <br />
                    <Statistic
                      value={card.value}
                      suffix={card.suffix}
                      precision={card.key === "averageScore" ? 1 : 0}
                      loading={analyticsLoading}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card
              title={t(
                "teacherDashboard.studentManagement.rosterTitle",
                "Class roster"
              )}
              bodyStyle={{ paddingTop: screens.md ? 24 : 18 }}
            >
              <div style={{ marginBottom: screens.md ? 20 : 16 }}>
                {filterControls}
              </div>
        {selectedCourse ? (
                screens.md ? (
          <Table
            columns={studentColumns}
            dataSource={filteredStudents}
                    rowKey={(record) => record._id || record.id}
                    loading={rosterLoading || progressLoading}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 800 }}
                    locale={{
                      emptyText: (
                        <Empty
                          description={t(
                            "teacherDashboard.studentManagement.noStudents",
                            "No students match the current filters."
                          )}
                        />
                      ),
                    }}
          />
        ) : (
                  <List
                    loading={rosterLoading || progressLoading}
                    dataSource={filteredStudents}
                    locale={{
                      emptyText: (
                        <Empty
                          description={t(
                            "teacherDashboard.studentManagement.noStudents",
                            "No students match the current filters."
                          )}
                        />
                      ),
                    }}
                    renderItem={(record) => {
                      const metrics = studentMetrics[record._id || record.id];
                      const displayName = getStudentDisplayName(record, t);
                      const email = getStudentEmail(record);
                      return (
                        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                          <Card style={{ width: "100%" }} bodyStyle={{ padding: 16 }}>
                            <Space
                              align="start"
                              direction="vertical"
                              style={{ width: "100%" }}
                              size="large"
                            >
                              <Space align="center">
                                <Avatar
                                  size={48}
                                  style={{ backgroundColor: "#4f46e5" }}
                                >
                                  {getStudentInitial(record, t)}
                                </Avatar>
                                <div>
                                  <Text strong style={{ fontSize: 16 }}>
                                    {displayName}
                                  </Text>
                                  <br />
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {email ||
                                      t(
                                        "teacherDashboard.studentManagement.noEmail",
                                        "No email"
                                      )}
                                  </Text>
                                  <div style={{ marginTop: 8 }}>
                                    {typeof record.courseRole === "string" &&
                                      record.courseRole && (
                                        <Tag color="geekblue">{record.courseRole}</Tag>
                                      )}
                                    {metrics?.tags?.slice(0, 2).map((tag) => (
                                      <Tag key={tag} color="purple">
                                        {tag}
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                              </Space>

                              <Divider style={{ margin: "12px 0" }} />

                              <Space direction="vertical" style={{ width: "100%" }}>
                                <Text type="secondary">
                                  {t(
                                    "teacherDashboard.studentManagement.columns.performance",
                                    "Performance"
                                  )}
                                </Text>
                                {metrics && metrics.averageScore != null ? (
                                  <Space align="center">
                                    <Progress
                                      percent={Math.min(
                                        Math.max(metrics.averageScore, 0),
                                        100
                                      )}
                                      size="small"
                                      strokeColor={
                                        metrics.averageScore >= 80
                                          ? "#16a34a"
                                          : metrics.averageScore >= 60
                                          ? "#2563eb"
                                          : "#f97316"
                                      }
                                      showInfo={false}
                                      style={{ width: 140 }}
                                    />
                                    <Text strong>{metrics.averageScore}%</Text>
                                    <Tag color="blue">
                                      {metrics.lastSubmission?.assignmentType ||
                                        t(
                                          "teacherDashboard.studentManagement.labels.noRecentWork",
                                          "No recent submissions"
                                        )}
                                    </Tag>
                                  </Space>
                                ) : (
                                  <Text>
                                    {t(
                                      "teacherDashboard.studentManagement.noData",
                                      "No data"
                                    )}
                                  </Text>
                                )}
                              </Space>

                              <Divider style={{ margin: "12px 0" }} />

                              <Space size="middle">
                                <Tooltip
                                  title={t(
                                    "teacherDashboard.studentManagement.actions.viewProfile",
                                    "View profile"
                                  )}
                                >
                                  <Button
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => handleViewStudent(record)}
                                  />
                                </Tooltip>
                                <Tooltip
                                  title={t(
                                    "teacherDashboard.studentManagement.actions.sendMessage",
                                    "Send message"
                                  )}
                                >
                                  <Button
                                    icon={<MessageOutlined />}
                                    size="small"
                                    onClick={() => openMessageModal(record)}
                                  />
                                </Tooltip>
                              </Space>
                            </Space>
      </Card>
                        </List.Item>
                      );
                    }}
                  />
                )
              ) : (
                <Empty
                  description={t(
                    "teacherDashboard.studentManagement.selectCoursePrompt",
                    "Choose a course to see enrolled students."
                  )}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card title={tasksHeader} bodyStyle={{ paddingTop: 0 }}>
              <List
                dataSource={filteredTasks}
                renderItem={renderTaskItem}
                split={false}
                style={{ marginTop: 12 }}
                locale={{
                  emptyText: t(
                    "teacherDashboard.studentManagement.tasks.empty",
                    "No tasks yet."
                  ),
                }}
              />
            </Card>
          </Col>
        </Row>
      </Space>

      <Drawer
        width={screens.lg ? 560 : "100%"}
        open={studentDrawerOpen}
        onClose={handleCloseStudentDrawer}
        title={
          selectedStudent
            ? `${selectedStudent.firstName || ""} ${
                selectedStudent.lastName || ""
              }`.trim() || selectedStudent.name
            : t("teacherDashboard.studentManagement.drawer.title", "Student")
        }
      >
        {selectedStudent ? (
          <Tabs items={studentDrawerTabs} />
        ) : (
          <Empty
            description={t(
              "teacherDashboard.studentManagement.drawer.empty",
              "Select a student to view details."
            )}
          />
        )}
      </Drawer>

      <Modal
        open={messageModalVisible}
        title={
          bulkRecipients.length > 1
            ? t(
                "teacherDashboard.studentManagement.messages.bulkTitle",
                "Send message to selected students"
              )
            : t(
                "teacherDashboard.studentManagement.messages.title",
                "Send message"
              )
        }
        onCancel={() => {
          setMessageModalVisible(false);
          resetMessageModal();
        }}
        footer={null}
        width={700}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Form
            form={messageForm}
            layout="vertical"
            onFinish={handleSendMessage}
          >
          <Form.Item
              label={t("teacherDashboard.studentManagement.templates.label", "Template")}
              name="templateSelection"
            >
              <Select
                allowClear
                placeholder={t(
                  "teacherDashboard.studentManagement.templates.placeholder",
                  "Choose a template"
                )}
                value={selectedTemplate}
                onChange={handleTemplateSelect}
              >
                {templates.map((template) => (
                  <Option value={template.key} key={template.key}>
                    {template.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("teacherDashboard.studentManagement.messages.subject", "Subject")}
            name="subject"
              rules={[
                {
                  required: true,
                  message: t(
                    "teacherDashboard.studentManagement.messages.validation.subject",
                    "Enter a subject"
                  ),
                },
              ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              label={t("teacherDashboard.studentManagement.messages.content", "Message")}
            name="content"
              rules={[
                {
                  required: true,
                  message: t(
                    "teacherDashboard.studentManagement.messages.validation.content",
                    "Enter a message"
                  ),
                },
              ]}
            >
              <TextArea rows={8} />
          </Form.Item>

            {bulkRecipients.length > 1 && (
              <Alert
                type="info"
                message={t(
                  "teacherDashboard.studentManagement.messages.bulkContext",
                  "This message will be sent individually to each selected student. Replies will arrive separately."
                )}
              />
            )}

            <Space style={{ justifyContent: "flex-end", width: "100%" }}>
              <Button
                onClick={() => {
                  setMessageModalVisible(false);
                  resetMessageModal();
                }}
              >
                {t("teacherDashboard.studentManagement.actions.cancel", "Cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("teacherDashboard.studentManagement.actions.send", "Send")}
              </Button>
            </Space>
        </Form>
        </Space>
      </Modal>
    </div>
  );
};

export default TeacherStudentManagement;

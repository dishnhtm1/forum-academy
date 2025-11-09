import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Input,
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  Badge,
  message,
  Form,
  Modal,
  DatePicker,
  InputNumber,
  Segmented,
  Descriptions,
  Progress,
  Avatar,
  Empty,
  Divider,
  Statistic,
  List,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  BankOutlined,
  CodeOutlined,
  BgColorsOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BarsOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { courseAPI, userAPI } from "../../utils/apiClient";
import { ensureTeacherMyClassesTranslations } from "../../utils/teacherMyClassesTranslations";

const { Title, Text } = Typography;
const { Option } = Select;

const categoryColors = {
  language: "#6366f1",
  business: "#06b6d4",
  technology: "#8b5cf6",
  arts: "#ec4899",
  science: "#3b82f6",
  other: "#22c55e",
};

const categoryIconComponents = {
  language: GlobalOutlined,
  business: BankOutlined,
  technology: CodeOutlined,
  arts: BgColorsOutlined,
  science: ExperimentOutlined,
  other: FileTextOutlined,
};

const TeacherMyClasses = ({ t, currentUser, isMobile, history: historyProp, setActiveKey }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [courseForm] = Form.useForm();
  const { i18n } = useTranslation();
  ensureTeacherMyClassesTranslations(i18n);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [courseViewModalVisible, setCourseViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [studentModalCourse, setStudentModalCourse] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [assigningStudent, setAssigningStudent] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState(null);

  const normalizeId = value => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return (
        value._id ||
        value.id ||
        value.userId ||
        value.value ||
        (typeof value.toString === "function" ? value.toString() : undefined)
      );
    }
    return undefined;
  };

  const teacherIdentifier = useMemo(() => {
    if (!currentUser) return undefined;

    const candidates = [
      currentUser._id,
      currentUser.id,
      currentUser.userId,
      currentUser.user?._id,
      currentUser.user?.id,
      currentUser.profile?._id,
      currentUser.profile?.id,
      currentUser.defaultUserId,
    ];

    for (const candidate of candidates) {
      const normalized = normalizeId(candidate);
      if (normalized) return normalized;
    }

    return undefined;
  }, [currentUser]);

  const teacherEmail = useMemo(() => {
    if (!currentUser) return undefined;
    return (
      currentUser.email ||
      currentUser.user?.email ||
      currentUser.profile?.email ||
      currentUser.username ||
      currentUser.user?.username ||
      undefined
    );
  }, [currentUser]);

  const getCourseId = useCallback(
    course => course?._id || course?.id || course?.courseId || course?.code,
    []
  );

  const enrichCourseStudents = useCallback(
    course => {
      if (!course) return course;
      const enrichedStudents = Array.isArray(course.students)
        ? course.students.map(student => {
            if (typeof student === "string") {
              const match = allStudents.find(
                candidate => normalizeId(candidate?._id || candidate?.id) === student
              );
              return match || { _id: student };
            }
            return student;
          })
        : [];
      return { ...course, students: enrichedStudents };
    },
    [allStudents]
  );

  const updateCourseInState = useCallback(
    updatedCourse => {
      const normalizedCourse = enrichCourseStudents(updatedCourse);
      const courseId = getCourseId(normalizedCourse);
      setCourses(prev =>
        prev.map(course => (getCourseId(course) === courseId ? normalizedCourse : course))
      );
      setSelectedCourse(prev =>
        prev && getCourseId(prev) === courseId ? normalizedCourse : prev
      );
      setStudentModalCourse(prev =>
        prev && getCourseId(prev) === courseId ? normalizedCourse : prev
      );
    },
    [enrichCourseStudents, getCourseId]
  );

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🎯 TeacherMyClasses: fetching courses", {
        teacherIdentifier,
      });
      const response = await courseAPI.getAll();
      if (response?.success !== false) {
        const payload = Array.isArray(response)
          ? response
          : Array.isArray(response.courses)
          ? response.courses
          : Array.isArray(response.data)
          ? response.data
          : [];
        console.log("📚 TeacherMyClasses: raw courses payload", payload);
        const teacherCourses = payload.filter(
          course => {
            const courseTeacherId =
              normalizeId(course.teacherId) ||
              normalizeId(course.teacher) ||
              normalizeId(course?.instructor) ||
              normalizeId(course?.owner);
            const courseTeacherEmail =
              course.teacherEmail ||
              course.teacher_email ||
              course.teacher?.email ||
              course.instructor?.email ||
              course.owner?.email;

            if (teacherIdentifier || teacherEmail) {
              const matchesId =
                teacherIdentifier &&
                (courseTeacherId === teacherIdentifier || courseTeacherEmail === teacherIdentifier);
              const matchesEmail =
                teacherEmail &&
                (courseTeacherEmail === teacherEmail || courseTeacherId === teacherEmail);

              const match = matchesId || matchesEmail;
              if (!match) {
                console.log("⏭️ Filtered out course", {
                  courseId: course._id || course.id || course.code,
                  courseTeacherId,
                  courseTeacherEmail,
                  teacherIdentifier,
                  teacherEmail,
                });
              }
              return match;
            }

            // No identifier nor email available: show everything
            return true;
          }
        );
        console.log("✅ TeacherMyClasses: courses after filtering", teacherCourses);
        let effectiveCourses = teacherCourses;
        if (teacherCourses.length === 0 && payload.length > 0) {
          console.warn(
            "⚠️ TeacherMyClasses: No courses matched teacher filters; falling back to showing all courses"
          );
          effectiveCourses = payload;
        }
        setCourses(effectiveCourses.map(enrichCourseStudents));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error(t("teacherDashboard.myClasses.errors.fetch", { defaultValue: "Failed to fetch courses" }));
    } finally {
      setLoading(false);
    }
  }, [teacherIdentifier, teacherEmail, enrichCourseStudents, t]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const fetchAllStudents = useCallback(async () => {
    try {
      setStudentsLoading(true);
      const response = await userAPI.getByRole("student");
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.users)
        ? response.users
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setAllStudents(list);
    } catch (error) {
      console.error("Failed to fetch students", error);
      message.error(
        t("teacherDashboard.myClasses.errors.fetchStudents", {
          defaultValue: "Failed to fetch students",
        })
      );
    } finally {
      setStudentsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  useEffect(() => {
    setCourses(prev => prev.map(enrichCourseStudents));
    setSelectedCourse(prev => (prev ? enrichCourseStudents(prev) : prev));
    setStudentModalCourse(prev => (prev ? enrichCourseStudents(prev) : prev));
  }, [allStudents, enrichCourseStudents]);

  const handleCreateCourse = async values => {
    try {
      const teacherValue =
        teacherIdentifier ||
        normalizeId(currentUser?.id) ||
        normalizeId(currentUser?._id) ||
        normalizeId(currentUser?.userId) ||
        teacherEmail;
      console.log("🆕 TeacherMyClasses: preparing course create", {
        teacherIdentifier,
        currentUser,
        values,
        teacherValue,
      });
      const courseData = {
        title: values.title,
        description: values.description,
        code: values.code?.toUpperCase(),
        category: values.category,
        level: values.level,
        duration: values.duration || 12,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
        maxStudents: values.capacity || values.maxStudents || 30,
        isActive: values.status === "active",
        teacher: teacherValue,
        teacherId: teacherValue,
      };

      if (editingCourse) {
        await courseAPI.update(editingCourse._id, courseData);
        message.success(t("teacherDashboard.myClasses.notifications.updated", { defaultValue: "Course updated" }));
      } else {
        const result = await courseAPI.create(courseData);
        console.log("✅ TeacherMyClasses: course create response", result);
        message.success(t("teacherDashboard.myClasses.notifications.created", { defaultValue: "Course created" }));
      }

      setCourseModalVisible(false);
      courseForm.resetFields();
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      message.error(error?.message || t("teacherDashboard.myClasses.errors.save", { defaultValue: "Unable to save course" }));
    }
  };

  const handleEditCourse = course => {
    setEditingCourse(course);
    const formValues = {
      title: course.title,
      description: course.description,
      code: course.code,
      category: course.category,
      level: course.level,
      duration: course.duration,
      capacity: course.maxStudents || 30,
      status: course.isActive ? "active" : "inactive",
    };

    if (course.startDate) {
      const startDate = moment(course.startDate);
      if (startDate.isValid()) formValues.startDate = startDate;
    }
    if (course.endDate) {
      const endDate = moment(course.endDate);
      if (endDate.isValid()) formValues.endDate = endDate;
    }

    courseForm.setFieldsValue(formValues);
    setCourseModalVisible(true);
  };
  const handleManageStudents = course => {
    setStudentModalCourse(enrichCourseStudents(course));
    setStudentModalVisible(true);
    setSelectedStudentIds([]);
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudentIds.length || !studentModalCourse) return;
    const max = studentModalCourse.maxStudents || 30;
    const currentCount = studentModalCourse.students?.length || 0;
    if (currentCount >= max) {
      message.warning(
        t("teacherDashboard.myClasses.errors.capacityReached", {
          defaultValue: "Maximum capacity reached",
        })
      );
      return;
    }
    const availableSlots = max - currentCount;
    const studentsToAdd = selectedStudentIds.slice(0, availableSlots);
    if (!studentsToAdd.length) {
      message.warning(
        t("teacherDashboard.myClasses.errors.capacityReached", {
          defaultValue: "Maximum capacity reached",
        })
      );
      return;
    }
    try {
      setAssigningStudent(true);
      const courseId = getCourseId(studentModalCourse);
      const updatedCourse = await courseAPI.enrollStudent(courseId, studentsToAdd);
      updateCourseInState(updatedCourse);
      message.success(
        t("teacherDashboard.myClasses.notifications.enrolled", {
          defaultValue: "Students added",
        })
      );
      setSelectedStudentIds(selectedStudentIds.slice(availableSlots));
    } catch (error) {
      console.error("Failed to enroll student", error);
      message.error(
        t("teacherDashboard.myClasses.errors.enroll", {
          defaultValue: "Failed to add students",
        })
      );
    } finally {
      setAssigningStudent(false);
    }
  };

  const handleRemoveStudent = async studentId => {
    if (!studentModalCourse) return;
    try {
      setRemovingStudentId(studentId);
      const courseId = getCourseId(studentModalCourse);
      const updatedCourse = await courseAPI.unenrollStudent(courseId, studentId);
      updateCourseInState(updatedCourse);
      message.success(
        t("teacherDashboard.myClasses.notifications.removed", {
          defaultValue: "Student removed",
        })
      );
    } catch (error) {
      console.error("Failed to remove student", error);
      message.error(
        t("teacherDashboard.myClasses.errors.remove", {
          defaultValue: "Failed to remove student",
        })
      );
    } finally {
      setRemovingStudentId(null);
    }
  };

  const handleViewCourse = course => {
    setSelectedCourse(enrichCourseStudents(course));
    setCourseViewModalVisible(true);
  };

  const handleDeleteCourse = async courseOrId => {
    const courseId = typeof courseOrId === "string" ? courseOrId : getCourseId(courseOrId);
    try {
      await courseAPI.delete(courseId);
      message.success(t("teacherDashboard.myClasses.notifications.deleted", { defaultValue: "Course deleted" }));
      fetchCourses();
    } catch (err) {
      message.error(t("teacherDashboard.myClasses.errors.delete", { defaultValue: "Failed to delete course" }));
    }
  };

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return courses.filter(course => {
      const matchesSearch =
        !normalizedSearch ||
        course.title?.toLowerCase().includes(normalizedSearch) ||
        course.code?.toLowerCase().includes(normalizedSearch);
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const aggregatedStats = useMemo(() => {
    const totalStudents = filteredCourses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
    const activeCourses = filteredCourses.filter(course => course.isActive).length;
    const averageCapacity = filteredCourses.length
      ? Math.round(
          filteredCourses.reduce((acc, course) => acc + (course.students?.length || 0), 0) /
            filteredCourses.length
        )
      : 0;

    return {
      total: filteredCourses.length,
      active: activeCourses,
      students: totalStudents,
      averageCapacity,
    };
  }, [filteredCourses]);

  const courseColumns = useMemo(
    () => [
      {
        title: t("teacherDashboard.myClasses.table.title", { defaultValue: "Course" }),
        dataIndex: "title",
        key: "title",
        render: (title, record) => (
          <Space direction="vertical" size={2}>
            <Text strong>{title}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("teacherDashboard.myClasses.table.code", { defaultValue: "Code" })}: {record.code}
            </Text>
          </Space>
        ),
      },
      {
        title: t("teacherDashboard.myClasses.table.category", { defaultValue: "Category" }),
        dataIndex: "category",
        key: "category",
        render: category => (
          <Tag color={categoryColors[category] || "default"}>
            {(category && category.charAt(0).toUpperCase() + category.slice(1)) || t("teacherDashboard.myClasses.labels.other", { defaultValue: "Other" })}
          </Tag>
        ),
        responsive: ["md"],
      },
      {
        title: t("teacherDashboard.myClasses.table.students", { defaultValue: "Students" }),
        dataIndex: "students",
        key: "students",
        render: (students, record) => {
          const enrolled = students?.length || 0;
          const max = record.maxStudents || 30;
          return (
            <Space>
              <Badge count={enrolled} showZero color="#3b82f6" />
              <Text type="secondary">/ {max}</Text>
            </Space>
          );
        },
        align: "center",
      },
      {
        title: t("teacherDashboard.myClasses.table.status", { defaultValue: "Status" }),
        dataIndex: "isActive",
        key: "isActive",
        render: isActive => (
          <Tag color={isActive ? "success" : "default"}>
            {isActive
              ? t("teacherDashboard.myClasses.labels.active", { defaultValue: "Active" })
              : t("teacherDashboard.myClasses.labels.inactive", { defaultValue: "Inactive" })}
          </Tag>
        ),
        align: "center",
        responsive: ["sm"],
      },
      {
        title: t("teacherDashboard.myClasses.table.schedule", { defaultValue: "Schedule" }),
        key: "schedule",
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            {record.startDate && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {moment(record.startDate).format("MMM DD, YYYY")}
              </Text>
            )}
            {record.endDate && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {moment(record.endDate).format("MMM DD, YYYY")}
              </Text>
            )}
          </Space>
        ),
        responsive: ["lg"],
      },
      {
        title: t("teacherDashboard.myClasses.table.actions", { defaultValue: "Actions" }),
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Space size="small">
            <Tooltip title={t("teacherDashboard.myClasses.actions.view", { defaultValue: "View" })}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                onClick={() => handleViewCourse(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.myClasses.actions.edit", { defaultValue: "Edit" })}>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditCourse(record)}
              />
            </Tooltip>
            <Tooltip title={t("teacherDashboard.myClasses.actions.manage", { defaultValue: "Manage" })}>
              <Button
                icon={<TeamOutlined />}
                size="small"
                onClick={() => handleManageStudents(record)}
              />
            </Tooltip>
            <Popconfirm
              title={t("teacherDashboard.myClasses.confirm.delete", { defaultValue: "Delete this course?" })}
              okText={t("common.confirm", { defaultValue: "Confirm" })}
              cancelText={t("common.cancel", { defaultValue: "Cancel" })}
              onConfirm={() => handleDeleteCourse(record)}
            >
              <Tooltip title={t("teacherDashboard.myClasses.actions.delete", { defaultValue: "Delete" })}>
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [t]
  );

  const renderCourseCard = course => {
    const color = categoryColors[course.category] || "#475569";
    const IconComponent = categoryIconComponents[course.category] || BookOutlined;
    const enrolled = course.students?.length || 0;
    const max = course.maxStudents || 30;
    const percent = max ? Math.round((enrolled / max) * 100) : 0;
    const displayTitle = (course.title || course.name || "")
      .toString()
      .replace(/\s+/g, " ")
      .trim() || t("teacherDashboard.myClasses.form.titlePlaceholder", { defaultValue: "Untitled course" });
    const displayCode = (course.code || course.courseCode || "")
      .toString()
      .replace(/\s+/g, " ")
      .trim();

    return (
      <Col
        xs={24}
        sm={12}
        md={12}
        lg={8}
        xl={6}
        key={course._id || course.code}
        style={{
          display: "flex",
          flex: "1 1 300px",
          minWidth: isMobile ? "100%" : 280,
          maxWidth: isMobile ? "100%" : 360,
        }}
      >
        <Card
          hoverable
          bordered={false}
          style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(248,250,255,0.95) 0%, #ffffff 100%)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minWidth: 0,
          }}
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "100%",
            padding: 20,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", gap: 14, flex: 1 }}>
              <Avatar
                size={52}
                style={{
                  backgroundColor: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
                }}
              >
                <IconComponent />
              </Avatar>
              <Space direction="vertical" size={4} style={{ flex: 1, minWidth: 0 }}>
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                    hyphens: "auto",
                    whiteSpace: "normal",
                  }}
                >
                  {displayTitle}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, overflowWrap: "anywhere" }}
                >
                  {displayCode || "-"}
                </Text>
              </Space>
            </div>
            <Tag
              color={course.isActive ? "success" : "default"}
              style={{ borderRadius: 12, padding: "2px 10px", fontWeight: 600 }}
            >
              {course.isActive
                ? t("teacherDashboard.myClasses.labels.active", { defaultValue: "Active" })
                : t("teacherDashboard.myClasses.labels.inactive", { defaultValue: "Inactive" })}
            </Tag>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Tag
              bordered={false}
              style={{
                backgroundColor: color,
                color: "#fff",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
              }}
            >
              <IconComponent />
              <span>
                {course.category
                  ? t(`teacherDashboard.myClasses.categories.${course.category}`, {
                      defaultValue: course.category,
                    })
                  : t("teacherDashboard.myClasses.categories.other", { defaultValue: "Other" })}
              </span>
            </Tag>
            <Tag bordered={false} style={{ borderRadius: 14 }}>
              <CalendarOutlined style={{ marginRight: 6 }} />
              {course.startDate
                ? moment(course.startDate).format("MMM DD")
                : t("teacherDashboard.myClasses.labels.unscheduled", { defaultValue: "TBD" })}
            </Tag>
            <Tag bordered={false} style={{ borderRadius: 14 }}>
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {course.duration
                ? `${course.duration} ${t("teacherDashboard.myClasses.labels.weeks", { defaultValue: "weeks" })}`
                : t("teacherDashboard.myClasses.labels.flex", { defaultValue: "Flexible" })}
            </Tag>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text type="secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <TeamOutlined />
                {t("teacherDashboard.myClasses.labels.enrolled", { defaultValue: "Enrolled" })}
              </Text>
              <Text strong style={{ fontSize: 14 }}>
                {enrolled} / {max}
              </Text>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={color}
              trailColor="rgba(148,163,184,0.25)"
              style={{ marginBottom: 0 }}
            />
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div
            style={{
              marginTop: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
              width: "100%",
            }}
          >
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewCourse(course)}
            >
              {t("common.view", { defaultValue: "View" })}
            </Button>
            <Button icon={<EditOutlined />} onClick={() => handleEditCourse(course)}>
              {t("common.edit", { defaultValue: "Edit" })}
            </Button>
            <Button icon={<TeamOutlined />} onClick={() => handleManageStudents(course)}>
              {t("teacherDashboard.myClasses.actions.manage", { defaultValue: "Manage" })}
            </Button>
            <Popconfirm
              title={t("teacherDashboard.myClasses.confirm.delete", { defaultValue: "Delete this course?" })}
              okText={t("common.confirm", { defaultValue: "Confirm" })}
              cancelText={t("common.cancel", { defaultValue: "Cancel" })}
              onConfirm={() => handleDeleteCourse(course)}
            >
              <Button danger icon={<DeleteOutlined />}>
                {t("common.delete", { defaultValue: "Delete" })}
              </Button>
            </Popconfirm>
          </div>
        </Card>
      </Col>
    );
  };

  const controls = (
    <Space wrap size={[12, 12]} style={{ width: "100%", justifyContent: "space-between" }}>
      <Space wrap size={12}>
        <Input
          allowClear
          size="large"
          placeholder={t("teacherDashboard.myClasses.search", { defaultValue: "Search courses" })}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          style={{ width: isMobile ? "100%" : 260 }}
        />
        <Select
          allowClear
          size="large"
          placeholder={t("teacherDashboard.myClasses.filter.category", { defaultValue: "Category" })}
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: isMobile ? "100%" : 200 }}
        >
          <Option value="language">{t("teacherDashboard.myClasses.categories.language", { defaultValue: "Language" })}</Option>
          <Option value="business">{t("teacherDashboard.myClasses.categories.business", { defaultValue: "Business" })}</Option>
          <Option value="technology">{t("teacherDashboard.myClasses.categories.technology", { defaultValue: "Technology" })}</Option>
          <Option value="arts">{t("teacherDashboard.myClasses.categories.arts", { defaultValue: "Arts" })}</Option>
          <Option value="science">{t("teacherDashboard.myClasses.categories.science", { defaultValue: "Science" })}</Option>
          <Option value="other">{t("teacherDashboard.myClasses.categories.other", { defaultValue: "Other" })}</Option>
        </Select>
      </Space>

      <Space wrap size={12}>
        <Segmented
          options={[
            {
              label: (
                <Space size={6}>
                  <AppstoreOutlined />
                  {t("teacherDashboard.myClasses.view.grid", { defaultValue: "Grid" })}
                </Space>
              ),
              value: "grid",
            },
            {
              label: (
                <Space size={6}>
                  <BarsOutlined />
                  {t("teacherDashboard.myClasses.view.table", { defaultValue: "Table" })}
                </Space>
              ),
              value: "table",
            },
          ]}
          value={viewMode}
          onChange={value => setViewMode(value)}
        />
        <Space wrap size={12}>
          <Button
            icon={<VideoCameraOutlined />}
            size="large"
            onClick={() => setActiveKey?.("live")}
          >
            {t("teacherDashboard.myClasses.buttons.live", { defaultValue: "Go to Live Classes" })}
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCourse(null);
              courseForm.resetFields();
              setCourseModalVisible(true);
            }}
          >
            {t("teacherDashboard.myClasses.buttons.create", { defaultValue: "Create Course" })}
          </Button>
        </Space>
      </Space>
    </Space>
  );

  return (
    <div style={{ padding: isMobile ? "16px" : "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginBottom: 24,
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.1)",
          background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
        }}
        styles={{ body: { padding: isMobile ? 18 : 28 } }}
      >
        <Space direction="vertical" size={isMobile ? 16 : 20} style={{ width: "100%" }}>
          <Space align="center" size={16} wrap>
            <Avatar size={isMobile ? 44 : 56} style={{ background: "#6366f1" }} icon={<BookOutlined />} />
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ letterSpacing: 1, fontSize: 12, textTransform: "uppercase" }}>
                {t("teacherDashboard.myClasses.subtitle", { defaultValue: "Overview" })}
              </Text>
              <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                {t("teacherDashboard.sidebar.myClasses", { defaultValue: "My Classes" })}
              </Title>
            </Space>
          </Space>

          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                <Statistic
                  title={t("teacherDashboard.myClasses.metrics.total", { defaultValue: "Total Courses" })}
                  value={aggregatedStats.total}
                  valueStyle={{ color: "#4338ca" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                <Statistic
                  title={t("teacherDashboard.myClasses.metrics.active", { defaultValue: "Active" })}
                  value={aggregatedStats.active}
                  valueStyle={{ color: "#10b981" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                <Statistic
                  title={t("teacherDashboard.myClasses.metrics.students", { defaultValue: "Students" })}
                  value={aggregatedStats.students}
                  valueStyle={{ color: "#2563eb" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                <Statistic
                  title={t("teacherDashboard.myClasses.metrics.average", { defaultValue: "Avg. Enrolled" })}
                  value={aggregatedStats.averageCapacity}
                  suffix={t("teacherDashboard.myClasses.labels.studentsSuffix", { defaultValue: "std" })}
                  valueStyle={{ color: "#f97316" }}
                />
              </Card>
            </Col>
          </Row>

          {controls}
        </Space>
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: 24, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" }}
        styles={{ body: { padding: isMobile ? 16 : 24 } }}
      >
        {viewMode === "grid" ? (
          <Row gutter={[18, 18]}>
            {filteredCourses.length ? (
              filteredCourses.map(renderCourseCard)
            ) : (
              <Col span={24}>
                <Empty
                  description={t("teacherDashboard.myClasses.empty", { defaultValue: "No courses found" })}
                  imageStyle={{ height: 120 }}
                />
              </Col>
            )}
          </Row>
        ) : (
          <Table
            columns={courseColumns}
            dataSource={filteredCourses}
            rowKey={record => record._id || record.code}
            loading={loading}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 900 }}
          />
        )}
      </Card>

      <Modal
        title={editingCourse ? t("teacherDashboard.myClasses.modals.editTitle", { defaultValue: "Edit course" }) : t("teacherDashboard.myClasses.modals.createTitle", { defaultValue: "Create course" })}
        open={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setEditingCourse(null);
          courseForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={640}
        styles={{ body: { padding: 24 } }}
      >
        <Form form={courseForm} layout="vertical" onFinish={handleCreateCourse}>
          <Form.Item
            name="title"
            label={t("teacherDashboard.myClasses.form.title", { defaultValue: "Course title" })}
            rules={[{ required: true, message: t("teacherDashboard.myClasses.validation.title", { defaultValue: "Please enter a title" }) }]}
          >
            <Input placeholder={t("teacherDashboard.myClasses.form.titlePlaceholder", { defaultValue: "e.g. Conversational Japanese" })} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={t("teacherDashboard.myClasses.form.code", { defaultValue: "Course code" })}
                rules={[{ required: true, message: t("teacherDashboard.myClasses.validation.code", { defaultValue: "Enter a unique code" }) }]}
              >
                <Input placeholder="JPN-101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label={t("teacherDashboard.myClasses.form.level", { defaultValue: "Level" })}
                rules={[{ required: true }]}
              >
                <Select placeholder={t("teacherDashboard.myClasses.form.levelPlaceholder", { defaultValue: "Select level" })}>
                  <Option value="beginner">{t("teacherDashboard.myClasses.level.beginner", { defaultValue: "Beginner" })}</Option>
                  <Option value="intermediate">{t("teacherDashboard.myClasses.level.intermediate", { defaultValue: "Intermediate" })}</Option>
                  <Option value="advanced">{t("teacherDashboard.myClasses.level.advanced", { defaultValue: "Advanced" })}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label={t("teacherDashboard.myClasses.form.category", { defaultValue: "Category" })}
                rules={[{ required: true }]}
              >
                <Select placeholder={t("teacherDashboard.myClasses.form.categoryPlaceholder", { defaultValue: "Select category" })}>
                  <Option value="language">{t("teacherDashboard.myClasses.categories.language", { defaultValue: "Language" })}</Option>
                  <Option value="business">{t("teacherDashboard.myClasses.categories.business", { defaultValue: "Business" })}</Option>
                  <Option value="technology">{t("teacherDashboard.myClasses.categories.technology", { defaultValue: "Technology" })}</Option>
                  <Option value="arts">{t("teacherDashboard.myClasses.categories.arts", { defaultValue: "Arts" })}</Option>
                  <Option value="science">{t("teacherDashboard.myClasses.categories.science", { defaultValue: "Science" })}</Option>
                  <Option value="other">{t("teacherDashboard.myClasses.categories.other", { defaultValue: "Other" })}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label={t("teacherDashboard.myClasses.form.duration", { defaultValue: "Duration (weeks)" })}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="12" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label={t("teacherDashboard.myClasses.form.start", { defaultValue: "Start date" })}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label={t("teacherDashboard.myClasses.form.end", { defaultValue: "End date" })}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="capacity" label={t("teacherDashboard.myClasses.form.capacity", { defaultValue: "Max students" })}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="30" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("teacherDashboard.myClasses.form.status", { defaultValue: "Status" })}
                initialValue="active"
              >
                <Select>
                  <Option value="active">{t("teacherDashboard.myClasses.labels.active", { defaultValue: "Active" })}</Option>
                  <Option value="inactive">{t("teacherDashboard.myClasses.labels.inactive", { defaultValue: "Inactive" })}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={t("teacherDashboard.myClasses.form.description", { defaultValue: "Description" })}>
            <Input.TextArea rows={4} placeholder={t("teacherDashboard.myClasses.form.descriptionPlaceholder", { defaultValue: "Describe the learning goals, resources, or expectations." })} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button onClick={() => {
              setCourseModalVisible(false);
              setEditingCourse(null);
              courseForm.resetFields();
            }}>
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>
            <Button type="primary" htmlType="submit">
              {editingCourse ? t("common.update", { defaultValue: "Update" }) : t("common.create", { defaultValue: "Create" })}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={t("teacherDashboard.myClasses.modals.details", { defaultValue: "Course details" })}
        open={courseViewModalVisible}
        onCancel={() => setCourseViewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setCourseViewModalVisible(false)}>
            {t("common.close", { defaultValue: "Close" })}
          </Button>,
        ]}
        width={680}
        styles={{ body: { padding: 24 } }}
      >
        {selectedCourse ? (
          <Descriptions column={isMobile ? 1 : 2} bordered labelStyle={{ fontWeight: 600 }}>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.title", { defaultValue: "Course title" })}>
              {selectedCourse.title}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.code", { defaultValue: "Course code" })}>
              {selectedCourse.code}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.category", { defaultValue: "Category" })}>
              <Tag color={categoryColors[selectedCourse.category] || "default"}>
                {selectedCourse.category || t("teacherDashboard.myClasses.labels.other", { defaultValue: "Other" })}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.level", { defaultValue: "Level" })}>
              {selectedCourse.level}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.labels.enrolled", { defaultValue: "Enrolled" })}>
              {selectedCourse.students?.length || 0} / {selectedCourse.maxStudents || 30}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.status", { defaultValue: "Status" })}>
              <Tag color={selectedCourse.isActive ? "success" : "default"}>
                {selectedCourse.isActive
                  ? t("teacherDashboard.myClasses.labels.active", { defaultValue: "Active" })
                  : t("teacherDashboard.myClasses.labels.inactive", { defaultValue: "Inactive" })}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.start", { defaultValue: "Start date" })}>
              {selectedCourse.startDate ? moment(selectedCourse.startDate).format("LL") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.end", { defaultValue: "End date" })}>
              {selectedCourse.endDate ? moment(selectedCourse.endDate).format("LL") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.duration", { defaultValue: "Duration" })}>
              {selectedCourse.duration
                ? `${selectedCourse.duration} ${t("teacherDashboard.myClasses.labels.weeks", { defaultValue: "weeks" })}`
                : t("teacherDashboard.myClasses.labels.flex", { defaultValue: "Flexible" })}
            </Descriptions.Item>
            <Descriptions.Item label={t("teacherDashboard.myClasses.form.description", { defaultValue: "Description" })}>
              {selectedCourse.description || t("teacherDashboard.myClasses.labels.noDescription", { defaultValue: "No description" })}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("teacherDashboard.myClasses.empty", { defaultValue: "No courses found" })}
          />
        )}
      </Modal>

      <Modal
        title={t("teacherDashboard.myClasses.manage.title", { defaultValue: "Manage students" })}
        open={studentModalVisible}
        onCancel={() => {
          setStudentModalVisible(false);
          setStudentModalCourse(null);
      setSelectedStudentIds([]);
        }}
        footer={null}
        width={720}
        destroyOnClose
      >
        {studentModalCourse ? (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Space wrap size={12} align="start" style={{ width: "100%" }}>
              <Select
                showSearch
                allowClear
                mode="multiple"
                value={selectedStudentIds}
                onChange={values => setSelectedStudentIds(values)}
                placeholder={t("teacherDashboard.myClasses.manage.selectStudent", {
                  defaultValue: "Select students",
                })}
                loading={studentsLoading}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={allStudents.map(student => {
                  const id = normalizeId(student?._id || student?.id);
                  const name =
                    student?.name ||
                    `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
                    student?.email ||
                    id;
                  return {
                    label: `${name}${student?.email && student?.email !== name ? ` (${student.email})` : ""}`,
                    value: id,
                  };
                })}
                style={{ minWidth: 260 }}
              />
              <Button
                type="primary"
                onClick={handleEnrollStudent}
                loading={assigningStudent}
                disabled={!selectedStudentIds.length}
              >
                {t("teacherDashboard.myClasses.manage.add", { defaultValue: "Add students" })}
              </Button>
            </Space>

            <Divider style={{ margin: "12px 0" }} />
            <Title level={5} style={{ margin: 0 }}>
              {t("teacherDashboard.myClasses.manage.enrolled", { defaultValue: "Enrolled students" })}
            </Title>
            <List
              dataSource={studentModalCourse.students || []}
              locale={{
                emptyText: t("teacherDashboard.myClasses.manage.empty", {
                  defaultValue: "No students enrolled",
                }),
              }}
              renderItem={student => {
                const studentId = normalizeId(student?._id || student?.id);
                const displayName =
                  student?.name ||
                  `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
                  student?.email ||
                  studentId;
                return (
                  <List.Item
                    actions={[
                      <Button
                        key="remove"
                        danger
                        size="small"
                        loading={removingStudentId === studentId}
                        onClick={() => handleRemoveStudent(studentId)}
                      >
                        {t("teacherDashboard.myClasses.manage.remove", { defaultValue: "Remove" })}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<TeamOutlined />} />}
                      title={displayName}
                      description={student?.email}
                    />
                  </List.Item>
                );
              }}
            />
          </Space>
        ) : null}
      </Modal>
    </div>
  );
};

export default TeacherMyClasses;

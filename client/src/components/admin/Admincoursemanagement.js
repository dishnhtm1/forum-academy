import React, { useState, useEffect, useContext, useCallback } from "react";
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
  Progress,
  Avatar,
  Divider,
  Empty,
  Modal,
  DatePicker,
  InputNumber,
  Radio,
  Descriptions,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RiseOutlined,
  FallOutlined,
  GlobalOutlined,
  BankOutlined,
  CodeOutlined,
  BgColorsOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";
import { courseAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;

const Admincoursemanagement = ({
  t,
  setCourseModalVisible,
  setCourseViewModalVisible,
}) => {
  const history = useHistory();
  const [courseForm] = Form.useForm();
  const { i18n } = useTranslation();

  // Context
  const context = useContext(AdminContext);
  const contextFetchDashboardStats = context?.fetchDashboardStats;

  // Local state
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [courseModalVisibleLocal, setCourseModalVisibleLocal] = useState(false);
  const [courseViewModalVisibleLocal, setCourseViewModalVisibleLocal] =
    useState(false);

  // Use local state if props not provided
  const handleSetCourseModalVisible =
    setCourseModalVisible || setCourseModalVisibleLocal;
  const handleSetCourseViewModalVisible =
    setCourseViewModalVisible || setCourseViewModalVisibleLocal;

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
        setCourses(data.courses || data || []);
      } else {
        console.error("Failed to fetch courses:", response.statusText);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  }, [history]);

  const handleCreateCourse = async (values) => {
    try {
      const courseData = {
        title: values.title,
        description: values.description,
        code: values.code.toUpperCase(),
        category: values.category,
        level: values.level,
        duration: values.duration || 12,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
        maxStudents: values.capacity || values.maxStudents || 30,
        isActive: values.status === "active",
      };

      console.log("Creating/updating course with data:", courseData);

      if (editingCourse) {
        const response = await fetch(
          `${API_BASE_URL}/api/courses/${editingCourse._id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(courseData),
          }
        );

        if (response.status === 401) {
          localStorage.clear();
          history.push("/login");
          return;
        }

        if (response.ok) {
          message.success("Course updated successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update course");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(courseData),
        });

        if (response.status === 401) {
          localStorage.clear();
          history.push("/login");
          return;
        }

        if (response.ok) {
          message.success("Course created successfully");
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              t("admin.courseManagement.messages.createError")
          );
        }
      }

      handleSetCourseModalVisible(false);
      courseForm.resetFields();
      setEditingCourse(null);
      fetchCourses();

      if (contextFetchDashboardStats) {
        contextFetchDashboardStats();
      }
    } catch (error) {
      console.error("Error saving course:", error);
      message.error(error.message || "Error saving course");
    }
  };

  // useEffect to fetch data on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset form when modal opens for creating a new course
  useEffect(() => {
    if (courseModalVisibleLocal && !editingCourse) {
      courseForm.resetFields();
      courseForm.setFieldsValue({
        duration: 12,
        maxStudents: 30,
        status: "active",
      });
    }
  }, [courseModalVisibleLocal, editingCourse, courseForm]);

  const courseColumns = [
    {
      title: t("admin.courseManagement.table.columns.courseTitle"),
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("admin.courseManagement.table.columns.code")}: {record.code}
          </Text>
        </div>
      ),
    },
    {
      title: t("admin.courseManagement.table.columns.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">
          {t(`admin.courseManagement.filters.categories.${category}`)}
        </Tag>
      ),
    },
    {
      title: t("admin.courseManagement.table.columns.level"),
      dataIndex: "level",
      key: "level",
      render: (level) => {
        const colors = {
          beginner: "green",
          intermediate: "orange",
          advanced: "red",
        };
        return (
          <Tag color={colors[level]}>
            {t(`admin.courseManagement.table.levelValues.${level}`)}
          </Tag>
        );
      },
    },
    {
      title: t("admin.courseManagement.table.columns.students"),
      dataIndex: "students",
      key: "students",
      render: (students) => (
        <Badge count={students?.length || 0} showZero>
          <TeamOutlined style={{ fontSize: 20 }} />
        </Badge>
      ),
    },
    {
      title: t("admin.courseManagement.table.columns.status"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive
            ? t("admin.courseManagement.table.statusValues.active")
            : t("admin.courseManagement.table.statusValues.inactive")}
        </Tag>
      ),
    },
    {
      title: t("admin.courseManagement.table.columns.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title={t("admin.courseManagement.actions.view")}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCourse(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin.courseManagement.actions.edit")}>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCourse(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("admin.courseManagement.actions.deleteConfirm")}
            onConfirm={() => handleDeleteCourse(record._id)}
          >
            <Tooltip title={t("admin.courseManagement.actions.delete")}>
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Category colors - Soft, eye-friendly gradients
  const categoryColors = {
    language: "#5B86E5", // Soft blue
    business: "#36D1DC", // Cyan
    technology: "#8E54E9", // Purple
    arts: "#F093FB", // Pink
    science: "#4FACFE", // Sky blue
    other: "#43E97B", // Green
  };

  // Category icons - Ant Design Icons
  const categoryIcons = {
    language: <GlobalOutlined />,
    business: <BankOutlined />,
    technology: <CodeOutlined />,
    arts: <BgColorsOutlined />,
    science: <ExperimentOutlined />,
    other: <FileTextOutlined />,
  };

  // Action handlers - centralized for consistency
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    const formValues = {
      ...course,
      capacity: course.maxStudents || course.capacity || 30,
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
    handleSetCourseModalVisible(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    handleSetCourseViewModalVisible(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseAPI.delete(courseId);
      message.success(
        t("admin.courseManagement.messages.deleteSuccess") || "Course deleted"
      );
      fetchCourses();
    } catch (err) {
      message.error(
        t("admin.courseManagement.messages.deleteError") || "Failed to delete"
      );
    }
  };

  // Render course card - simplified design
  const renderCourseCard = (course) => {
    const categoryColor = categoryColors[course.category] || "#8c8c8c";
    const categoryIcon = categoryIcons[course.category] || <BookOutlined />;
    const enrollmentRate = course.maxStudents
      ? Math.round(((course.students?.length || 0) / course.maxStudents) * 100)
      : 0;

    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={course._id}>
        <Card
          hoverable
          style={{
            borderRadius: 12,
            height: "100%",
            border: `1px solid ${course.isActive ? categoryColor : "#e8e8e8"}`,
            borderTop: `4px solid ${course.isActive ? categoryColor : "#d9d9d9"}`,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
          bodyStyle={{ padding: "20px" }}
        >
          {/* Card Header */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#262626",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={course.title}
                >
                  {course.title}
                </Title>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block", marginTop: 4 }}
                >
                  {t("admin.courseManagement.table.columns.code")}: {course.code}
                </Text>
              </div>
              <Tag
                color={course.isActive ? "success" : "default"}
                style={{ marginLeft: 8, flexShrink: 0 }}
              >
                {course.isActive
                  ? t("admin.courseManagement.table.statusValues.active")
                  : t("admin.courseManagement.table.statusValues.inactive")}
              </Tag>
            </div>

            {/* Category & Level */}
            <Space size={8} wrap style={{ marginTop: 8 }}>
              <Tag
                color={categoryColor}
                style={{
                  borderRadius: 6,
                  border: "none",
                  color: "white",
                  margin: 0,
                }}
              >
                <span style={{ marginRight: 4 }}>{categoryIcon}</span>
                {t(`admin.courseManagement.filters.categories.${course.category}`)}
              </Tag>
              <Tag
                color={
                  course.level === "beginner"
                    ? "green"
                    : course.level === "intermediate"
                    ? "orange"
                    : "red"
                }
                style={{ borderRadius: 6, margin: 0 }}
              >
                {t(`admin.courseManagement.table.levelValues.${course.level}`)}
              </Tag>
            </Space>
          </div>

          {/* Course Metrics */}
          <div style={{ marginBottom: 16 }}>
            {/* Students */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <TeamOutlined style={{ marginRight: 6 }} />
                  {t("admin.courseManagement.table.columns.students")}
                </Text>
                <Text strong style={{ fontSize: 13 }}>
                  {course.students?.length || 0} / {course.maxStudents || 30}
                </Text>
              </div>
              <Progress
                percent={enrollmentRate}
                size="small"
                strokeColor={categoryColor}
                showInfo={false}
                style={{ margin: 0 }}
              />
            </div>

            {/* Duration & End Date */}
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              {course.duration && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  {course.duration}{" "}
                  {t("admin.courseManagement.form.values.weeks") || 
                   t("admin.courses.weeks") || 
                   "weeks"}
                </Text>
              )}
              {course.endDate && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CalendarOutlined style={{ marginRight: 6 }} />
                  {i18n.language === "ja"
                    ? moment(course.endDate).locale("ja").format("YYYY年MM月DD日")
                    : moment(course.endDate).format("MMM DD, YYYY")}
                </Text>
              )}
            </Space>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              paddingTop: 12,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewCourse(course)}
              style={{ flex: 1, borderRadius: 6 }}
            >
              {t("admin.courseManagement.actions.view")}
            </Button>
            <Tooltip title={t("admin.courseManagement.actions.edit")}>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditCourse(course)}
                style={{ borderRadius: 6 }}
              />
            </Tooltip>
            <Popconfirm
              title={t("admin.courseManagement.actions.deleteConfirm")}
              onConfirm={() => handleDeleteCourse(course._id)}
            >
              <Tooltip title={t("admin.courseManagement.actions.delete")}>
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  style={{ borderRadius: 6 }}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", padding: "24px" }}>
      {/* Simplified Header */}
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <BookOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            {t("admin.courseManagement.title")}
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: 14, marginLeft: 32 }}>
          {t("admin.courseManagement.subtitle")}
        </Text>
      </div>

      {/* Simplified Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#f0f5ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.courseManagement.stats.totalCourses")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {courses.length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#fff1f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FireOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.courseManagement.stats.activeCourses")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {courses.filter((c) => c.isActive !== false).length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#e6f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TeamOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.courseManagement.stats.totalEnrolled")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {courses.reduce(
                    (sum, c) => sum + (c.students?.length || 0),
                    0
                  )}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#fffbe6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrophyOutlined style={{ fontSize: 24, color: "#faad14" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.courseManagement.stats.avgCompletion")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  75<span style={{ fontSize: 18 }}>%</span>
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Simplified Filters & Actions Bar */}
      <Card
        style={{
          borderRadius: 8,
          marginBottom: 24,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8} lg={7}>
            <Input
              size="large"
              placeholder={t(
                "admin.courseManagement.filters.searchPlaceholder"
              )}
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: 6 }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              size="large"
              placeholder={t("admin.courseManagement.filters.filterByCategory")}
              style={{ width: "100%", borderRadius: 6 }}
              onChange={setSelectedCategory}
              allowClear
            >
              <Option value="language">
                <GlobalOutlined />{" "}
                {t("admin.courseManagement.filters.categories.language")}
              </Option>
              <Option value="business">
                <BankOutlined />{" "}
                {t("admin.courseManagement.filters.categories.business")}
              </Option>
              <Option value="technology">
                <CodeOutlined />{" "}
                {t("admin.courseManagement.filters.categories.technology")}
              </Option>
              <Option value="arts">
                <BgColorsOutlined />{" "}
                {t("admin.courseManagement.filters.categories.arts")}
              </Option>
              <Option value="science">
                <ExperimentOutlined />{" "}
                {t("admin.courseManagement.filters.categories.science")}
              </Option>
              <Option value="other">
                <FileTextOutlined />{" "}
                {t("admin.courseManagement.filters.categories.other")}
              </Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Space.Compact style={{ width: "100%" }}>
              <Button
                size="large"
                type={viewMode === "grid" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode("grid")}
                style={{ flex: 1, borderRadius: "6px 0 0 6px" }}
              >
                {t("admin.courseManagement.filters.gridView") || "Grid"}
              </Button>
              <Button
                size="large"
                type={viewMode === "table" ? "primary" : "default"}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode("table")}
                style={{ flex: 1, borderRadius: "0 6px 6px 0" }}
              >
                {t("admin.courseManagement.filters.tableView") || "Table"}
              </Button>
            </Space.Compact>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} style={{ textAlign: "right" }}>
            <Button
              size="large"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCourse(null);
                courseForm.resetFields();
                handleSetCourseModalVisible(true);
              }}
              style={{
                borderRadius: 6,
                width: "100%",
              }}
            >
              {t("admin.courseManagement.actions.createCourse")}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Results count */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 15, color: "#262626" }}>
          {filteredCourses.length === courses.length
            ? `${t("admin.courseManagement.table.title")} (${courses.length})`
            : `${
                t("admin.courseManagement.filters.searchResults") || "Showing"
              } ${filteredCourses.length} ${
                t("admin.courseManagement.filters.of") || "of"
              } ${courses.length}`}
        </Text>
      </div>

      {/* Content - Grid or Table View */}
      {viewMode === "grid" ? (
        <Row gutter={[16, 16]}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => renderCourseCard(course))
          ) : (
            <Col span={24}>
              <Card
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  padding: "60px 20px",
                  border: "1px solid #e8e8e8",
                }}
              >
                <Empty
                  description={
                    <Text type="secondary">
                      {searchTerm || selectedCategory
                        ? t("admin.courseManagement.filters.noResults") ||
                          "No courses found"
                        : t("admin.courseManagement.filters.noCourses") ||
                          "No courses available"}
                    </Text>
                  }
                />
              </Card>
            </Col>
          )}
        </Row>
      ) : (
        <Card
          style={{
            borderRadius: 8,
            border: "1px solid #e8e8e8",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          <Table
            columns={courseColumns}
            dataSource={filteredCourses}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              style: { marginTop: 16 },
            }}
          />
        </Card>
      )}

      {/* Edit/Create Course Modal */}
      <Modal
        title={
          editingCourse
            ? t("admin.courseManagement.modals.edit.title")
            : t("admin.courseManagement.modals.create.title")
        }
        open={courseModalVisibleLocal}
        onCancel={() => {
          handleSetCourseModalVisible(false);
          courseForm.resetFields();
          setEditingCourse(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={handleCreateCourse}
          initialValues={{
            duration: 12,
            maxStudents: 30,
            status: "active",
          }}
        >
          <Form.Item
            name="title"
            label={t("admin.courseManagement.form.fields.courseTitle")}
            rules={[
              {
                required: true,
                message: t(
                  "admin.courseManagement.form.validation.courseTitleRequired"
                ),
              },
            ]}
          >
            <Input
              placeholder={t(
                "admin.courseManagement.form.placeholders.courseTitle"
              )}
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={t("admin.courseManagement.form.fields.courseCode")}
            rules={[
              {
                required: true,
                message: t(
                  "admin.courseManagement.form.validation.courseCodeRequired"
                ),
              },
            ]}
          >
            <Input
              placeholder={t(
                "admin.courseManagement.form.placeholders.courseCode"
              )}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("admin.courseManagement.form.fields.description")}
            rules={[
              {
                required: true,
                message: t(
                  "admin.courseManagement.form.validation.descriptionRequired"
                ),
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t(
                "admin.courseManagement.form.placeholders.description"
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label={t("admin.courseManagement.form.fields.category")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.categoryRequired"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "admin.courseManagement.form.placeholders.selectCategory"
                  )}
                >
                  <Option value="language">
                    <GlobalOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.language")}
                  </Option>
                  <Option value="business">
                    <BankOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.business")}
                  </Option>
                  <Option value="technology">
                    <CodeOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.technology")}
                  </Option>
                  <Option value="arts">
                    <BgColorsOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.arts")}
                  </Option>
                  <Option value="science">
                    <ExperimentOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.science")}
                  </Option>
                  <Option value="other">
                    <FileTextOutlined />{" "}
                    {t("admin.courseManagement.filters.categories.other")}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label={t("admin.courseManagement.form.fields.level")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.levelRequired"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "admin.courseManagement.form.placeholders.selectLevel"
                  )}
                >
                  <Option value="beginner">
                    {t("admin.courseManagement.form.levelOptions.beginner")}
                  </Option>
                  <Option value="intermediate">
                    {t("admin.courseManagement.form.levelOptions.intermediate")}
                  </Option>
                  <Option value="advanced">
                    {t("admin.courseManagement.form.levelOptions.advanced")}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={t("admin.courseManagement.form.fields.startDate")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.startDateRequired"
                    ),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={t("admin.courseManagement.form.fields.endDate")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.endDateRequired"
                    ),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label={t("admin.courseManagement.form.fields.duration")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.durationRequired"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Weeks"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label={t("admin.courseManagement.form.fields.maxStudents")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.courseManagement.form.validation.capacityRequired"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Max students"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label={t("admin.courseManagement.form.fields.status")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value="active">
                {t("admin.courseManagement.form.statusOptions.active")}
              </Radio>
              <Radio value="inactive">
                {t("admin.courseManagement.form.statusOptions.inactive")}
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  handleSetCourseModalVisible(false);
                  courseForm.resetFields();
                  setEditingCourse(null);
                }}
              >
                {t("admin.courseManagement.modals.cancel") || 
                 t("admin.modals.cancel") || 
                 "Cancel"}
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCourse
                  ? t("admin.courseManagement.modals.update") || 
                    t("admin.modals.update") || 
                    "Update"
                  : t("admin.courseManagement.modals.create") || 
                    t("admin.modals.create") || 
                    "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Course Details Modal */}
      <Modal
        title={t("admin.courseManagement.modals.view.title")}
        open={courseViewModalVisibleLocal}
        onCancel={() => {
          handleSetCourseViewModalVisible(false);
          setSelectedCourse(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              handleSetCourseViewModalVisible(false);
              setSelectedCourse(null);
            }}
          >
            {t("admin.modals.close") || "Close"}
          </Button>,
          selectedCourse && (
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                handleSetCourseViewModalVisible(false);
                handleEditCourse(selectedCourse);
              }}
            >
              {t("admin.courseManagement.actions.edit")}
            </Button>
          ),
        ]}
        width={700}
        destroyOnClose
      >
        {selectedCourse && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.courseTitle")}>
              <Text strong>{selectedCourse.title}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.courseCode")}>
              {selectedCourse.code}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.description")}>
              {selectedCourse.description || (
                <Text type="secondary">No description</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.category")}>
              <Tag color="blue">
                {t(
                  `admin.courseManagement.filters.categories.${selectedCourse.category}`
                )}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.level")}>
              <Tag
                color={
                  selectedCourse.level === "beginner"
                    ? "green"
                    : selectedCourse.level === "intermediate"
                    ? "orange"
                    : "red"
                }
              >
                {t(
                  `admin.courseManagement.table.levelValues.${selectedCourse.level}`
                )}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.startDate")}>
              {selectedCourse.startDate
                ? i18n.language === "ja"
                  ? moment(selectedCourse.startDate).locale("ja").format("YYYY年MM月DD日")
                  : moment(selectedCourse.startDate).format("MMMM DD, YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.endDate")}>
              {selectedCourse.endDate
                ? i18n.language === "ja"
                  ? moment(selectedCourse.endDate).locale("ja").format("YYYY年MM月DD日")
                  : moment(selectedCourse.endDate).format("MMMM DD, YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.duration")}>
              {selectedCourse.duration || 12}{" "}
              {t("admin.courseManagement.form.values.weeks") || 
               t("admin.courses.weeks") || 
               "weeks"}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.maxStudents")}>
              {selectedCourse.maxStudents || 30}
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.table.columns.students")}>
              <Text strong>
                {selectedCourse.students?.length || 0} /{" "}
                {selectedCourse.maxStudents || 30}
              </Text>
              <Progress
                percent={Math.round(
                  ((selectedCourse.students?.length || 0) /
                    (selectedCourse.maxStudents || 30)) *
                    100
                )}
                size="small"
                style={{ marginTop: 8 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label={t("admin.courseManagement.form.fields.status")}>
              <Tag color={selectedCourse.isActive ? "green" : "default"}>
                {selectedCourse.isActive
                  ? t("admin.courseManagement.table.statusValues.active")
                  : t("admin.courseManagement.table.statusValues.inactive")}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Admincoursemanagement;

import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Tag,
  Typography,
  Card,
  Button,
  Row,
  Col,
  Statistic,
  Empty,
  Input,
  Select,
  Tooltip,
  Progress,
  Badge,
  Divider,
  message,
} from "antd";
import {
  QuestionCircleOutlined,
  FieldTimeOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  FireOutlined,
  BookOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { quizAPI } from "../../utils/apiClient";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// Storage keys to sync with teacher assignments
const STUDENT_ASSIGNMENTS_STORAGE_KEY =
  "forumAcademy.quizAssignments.byStudent";

const StudentQuizzes = ({
  t,
  quizzes: propsQuizzes,
  onStartQuiz,
  currentUser,
}) => {
  const [quizzes, setQuizzes] = useState(propsQuizzes || []);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  // Fetch quizzes from API and merge with teacher assignments
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!currentUser?._id && !currentUser?.id) {
        return;
      }

      try {
        setLoading(true);

        // Fetch all published quizzes
        const response = await quizAPI.getAll();
        let allQuizzes = response.data || [];

        // Filter only published/active quizzes
        allQuizzes = allQuizzes.filter(
          (quiz) => quiz.isPublished || quiz.isActive
        );

        // Get student assignments from localStorage (set by teacher)
        const studentId = currentUser._id || currentUser.id;
        const hasWindow = typeof window !== "undefined";

        if (hasWindow) {
          try {
            const studentAssignmentsJSON = localStorage.getItem(
              STUDENT_ASSIGNMENTS_STORAGE_KEY
            );
            if (studentAssignmentsJSON) {
              const studentAssignments = JSON.parse(studentAssignmentsJSON);
              const myAssignments = studentAssignments[studentId] || [];

              // Enrich quizzes with assignment data
              allQuizzes = allQuizzes.map((quiz) => {
                const quizId = quiz._id || quiz.id;
                const assignment = myAssignments.find(
                  (a) => a.quizId === quizId || a.quiz === quizId
                );

                if (assignment) {
                  return {
                    ...quiz,
                    assignment: {
                      dueDate: assignment.dueDate,
                      courseDetails: assignment.courseDetails || [],
                      assignedBy: assignment.assignedBy,
                      assignedAt: assignment.assignedAt,
                    },
                  };
                }
                return quiz;
              });

              // Filter to show only assigned quizzes
              allQuizzes = allQuizzes.filter((quiz) => quiz.assignment);
            }
          } catch (error) {
            console.error(
              "Error loading assignments from localStorage:",
              error
            );
          }
        }

        setQuizzes(allQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        message.error(
          t("studentDashboard.quizzes.fetchError", "Failed to load quizzes")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [currentUser, t]);

  // Update quizzes when props change
  useEffect(() => {
    if (propsQuizzes && propsQuizzes.length > 0) {
      setQuizzes(propsQuizzes);
    }
  }, [propsQuizzes]);

  // Calculate quiz statistics
  useEffect(() => {
    const now = moment();
    const completed = quizzes.filter((q) => q.submission?.completed).length;
    const overdue = quizzes.filter((q) => {
      const dueDate = q.assignment?.dueDate;
      return (
        dueDate && moment(dueDate).isBefore(now) && !q.submission?.completed
      );
    }).length;
    const pending = quizzes.length - completed - overdue;

    setStats({
      total: quizzes.length,
      completed,
      pending,
      overdue,
    });
  }, [quizzes]);

  // Filter quizzes based on search and status
  useEffect(() => {
    let filtered = [...quizzes];

    // Search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (quiz) =>
          quiz.title?.toLowerCase().includes(search) ||
          quiz.course?.name?.toLowerCase().includes(search) ||
          quiz.course?.title?.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      const now = moment();
      filtered = filtered.filter((quiz) => {
        const dueDate = quiz.assignment?.dueDate;
        const isCompleted = quiz.submission?.completed;

        switch (filterStatus) {
          case "completed":
            return isCompleted;
          case "pending":
            return !isCompleted && (!dueDate || moment(dueDate).isAfter(now));
          case "overdue":
            return dueDate && moment(dueDate).isBefore(now) && !isCompleted;
          case "dueSoon":
            return (
              dueDate &&
              !isCompleted &&
              moment(dueDate).isAfter(now) &&
              moment(dueDate).diff(now, "hours") <= 24
            );
          default:
            return true;
        }
      });
    }

    setFilteredQuizzes(filtered);
  }, [searchText, filterStatus, quizzes]);

  const getStatusInfo = (record) => {
    const dueDate = record.assignment?.dueDate;
    const isCompleted = record.submission?.completed;
    const now = moment();

    if (isCompleted) {
      return {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: t("studentDashboard.quizzes.status.completed", "Completed"),
      };
    }

    if (!dueDate) {
      return {
        color: "default",
        icon: <ClockCircleOutlined />,
        text: t("studentDashboard.quizzes.status.available", "Available"),
      };
    }

    const isOverdue = moment(dueDate).isBefore(now);
    const isDueSoon = !isOverdue && moment(dueDate).diff(now, "hours") <= 24;

    if (isOverdue) {
      return {
        color: "error",
        icon: <FireOutlined />,
        text: t("studentDashboard.quizzes.status.overdue", "Overdue"),
      };
    }

    if (isDueSoon) {
      return {
        color: "warning",
        icon: <ClockCircleOutlined />,
        text: t("studentDashboard.quizzes.status.dueSoon", "Due soon"),
      };
    }

    return {
      color: "processing",
      icon: <CalendarOutlined />,
      text: t("studentDashboard.quizzes.status.assigned", "Assigned"),
    };
  };

  const columns = [
    {
      title: t("studentDashboard.quizzes.columns.title"),
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (text, record) => {
        const courseName =
          record.assignment?.courseDetails
            ?.map((course) => course.title)
            .join(", ") ||
          record.course?.name ||
          record.course?.title ||
          t("studentDashboard.quizzes.courseUnknown", "Course");

        return (
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: "15px" }}>
              {text}
            </Text>
            <Space size={4}>
              <BookOutlined style={{ fontSize: "12px", color: "#8c8c8c" }} />
              <Text type="secondary" style={{ fontSize: "13px" }}>
                {courseName}
              </Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.questions"),
      dataIndex: "questions",
      key: "questions",
      width: "12%",
      align: "center",
      render: (questions) => (
        <Tag color="blue" style={{ fontSize: "13px", padding: "4px 12px" }}>
          <QuestionCircleOutlined style={{ marginRight: "4px" }} />
          {questions?.length || 0}
        </Tag>
      ),
    },
    {
      title: t("studentDashboard.quizzes.columns.timeLimit"),
      key: "timeLimit",
      width: "12%",
      align: "center",
      render: (_, record) => {
        const duration = record.duration || record.timeLimit || 0;
        return (
          <Tooltip
            title={`${duration} ${t(
              "studentDashboard.quizzes.minutes",
              "minutes"
            )}`}
          >
            <Tag icon={<FieldTimeOutlined />} color="purple">
              {duration} min
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.dueDate"),
      key: "dueDate",
      width: "18%",
      render: (_, record) => {
        const dueDate = record.assignment?.dueDate;
        if (!dueDate) {
          return (
            <Text type="secondary">
              {t("studentDashboard.quizzes.noDeadline", "No deadline")}
            </Text>
          );
        }

        const now = moment();
        const dueDateTime = moment(dueDate);
        const hoursLeft = dueDateTime.diff(now, "hours");
        const isOverdue = dueDateTime.isBefore(now);

        return (
          <Space direction="vertical" size={2}>
            <Text strong={hoursLeft <= 24 && !isOverdue}>
              {dueDateTime.format("MMM DD, YYYY")}
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: "12px",
                color: isOverdue
                  ? "#ff4d4f"
                  : hoursLeft <= 24
                  ? "#fa8c16"
                  : undefined,
              }}
            >
              {dueDateTime.format("HH:mm")}
              {!isOverdue && hoursLeft <= 48 && ` (${hoursLeft}h left)`}
            </Text>
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.status"),
      key: "status",
      width: "14%",
      align: "center",
      render: (_, record) => {
        const statusInfo = getStatusInfo(record);
        return <Badge status={statusInfo.color} text={statusInfo.text} />;
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.actions"),
      key: "actions",
      width: "14%",
      align: "center",
      render: (_, record) => {
        const isCompleted = record.submission?.completed;
        const statusInfo = getStatusInfo(record);

        return (
          <Button
            type={isCompleted ? "default" : "primary"}
            icon={
              isCompleted ? <CheckCircleOutlined /> : <PlayCircleOutlined />
            }
            onClick={() => onStartQuiz(record)}
            disabled={isCompleted}
            style={{
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            {isCompleted
              ? t("studentDashboard.quizzes.completed", "Completed")
              : t("studentDashboard.quizzes.takeQuiz", "Take Quiz")}
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "24px" }}>
        <Space align="center" size={12}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QuestionCircleOutlined
              style={{ fontSize: "24px", color: "#fff" }}
            />
          </div>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {t("studentDashboard.quizzes.title", "Practice Quizzes")}
            </Title>
            <Text type="secondary">
              {t(
                "studentDashboard.quizzes.subtitle",
                "Test your knowledge with interactive quizzes"
              )}
            </Text>
          </div>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.quizzes.stats.total", "Total Quizzes")}
              value={stats.total}
              prefix={<QuestionCircleOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.quizzes.stats.completed", "Completed")}
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            {stats.total > 0 && (
              <Progress
                percent={Math.round((stats.completed / stats.total) * 100)}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
                style={{ marginTop: "8px" }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.quizzes.stats.pending", "Pending")}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.quizzes.stats.overdue", "Overdue")}
              value={stats.overdue}
              prefix={<FireOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card
        bordered={false}
        style={{ marginBottom: "16px", borderRadius: "12px" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder={t(
                "studentDashboard.quizzes.search",
                "Search quizzes by title or course..."
              )}
              allowClear
              size="large"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: "8px" }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <FilterOutlined />
              <Select
                size="large"
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ minWidth: "200px" }}
              >
                <Option value="all">
                  {t("studentDashboard.quizzes.filter.all", "All Quizzes")}
                </Option>
                <Option value="pending">
                  {t("studentDashboard.quizzes.filter.pending", "Pending")}
                </Option>
                <Option value="dueSoon">
                  {t("studentDashboard.quizzes.filter.dueSoon", "Due Soon")}
                </Option>
                <Option value="overdue">
                  {t("studentDashboard.quizzes.filter.overdue", "Overdue")}
                </Option>
                <Option value="completed">
                  {t("studentDashboard.quizzes.filter.completed", "Completed")}
                </Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Quizzes Table */}
      <Card
        bordered={false}
        style={{ borderRadius: "12px", overflow: "hidden" }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredQuizzes}
          rowKey={(record) => record._id || record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("of", "of")} ${total} ${t(
                "studentDashboard.quizzes.items",
                "quizzes"
              )}`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text type="secondary">
                      {searchText || filterStatus !== "all"
                        ? t(
                            "studentDashboard.quizzes.noResults",
                            "No quizzes match your search"
                          )
                        : t(
                            "studentDashboard.quizzes.noAssigned",
                            "No quizzes assigned yet."
                          )}
                    </Text>
                    {(searchText || filterStatus !== "all") && (
                      <Button
                        type="link"
                        onClick={() => {
                          setSearchText("");
                          setFilterStatus("all");
                        }}
                      >
                        {t(
                          "studentDashboard.quizzes.clearFilters",
                          "Clear filters"
                        )}
                      </Button>
                    )}
                  </Space>
                }
              />
            ),
          }}
          style={{ background: "#fff" }}
        />
      </Card>
    </div>
  );
};

export default StudentQuizzes;

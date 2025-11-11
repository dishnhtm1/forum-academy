import React, { useState, useMemo } from "react";
import {
  Table,
  Space,
  Button,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Grid,
  Badge,
  Tooltip,
  Progress,
  Empty,
} from "antd";
import {
  FormOutlined,
  EyeOutlined,
  UploadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  BookOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const StudentHomework = ({ t, homework, onViewDetails, onSubmitHomework }) => {
  const screens = useBreakpoint();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("dueDate");

  // Calculate statistics
  const stats = useMemo(() => {
    const now = moment();
    const total = homework.length;
    const active = homework.filter((h) => h.status === "active").length;
    const overdue = homework.filter(
      (h) => h.status === "active" && moment(h.dueDate).isBefore(now)
    ).length;
    const upcoming = homework.filter(
      (h) =>
        h.status === "active" &&
        moment(h.dueDate).isAfter(now) &&
        moment(h.dueDate).diff(now, "days") <= 7
    ).length;

    return { total, active, overdue, upcoming };
  }, [homework]);

  // Filter and sort homework
  const filteredHomework = useMemo(() => {
    let filtered = homework;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (h) =>
          h.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          h.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          h.course?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const now = moment();
      switch (statusFilter) {
        case "active":
          filtered = filtered.filter(
            (h) => h.status === "active" && moment(h.dueDate).isAfter(now)
          );
          break;
        case "overdue":
          filtered = filtered.filter(
            (h) => h.status === "active" && moment(h.dueDate).isBefore(now)
          );
          break;
        case "archived":
          filtered = filtered.filter((h) => h.status === "archived");
          break;
        case "draft":
          filtered = filtered.filter((h) => h.status === "draft");
          break;
        default:
          break;
      }
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "dueDate":
          return moment(a.dueDate).diff(moment(b.dueDate));
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "course":
          return (a.course?.name || "").localeCompare(b.course?.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [homework, searchText, statusFilter, sortOrder]);

  // Get priority badge for homework
  const getPriorityBadge = (record) => {
    const now = moment();
    const dueDate = moment(record.dueDate);
    const daysUntilDue = dueDate.diff(now, "days");

    if (record.status !== "active") return null;

    if (dueDate.isBefore(now)) {
      return (
        <Badge
          count={t("studentDashboard.homework.status.overdue")}
          style={{ backgroundColor: "#ff4d4f" }}
        />
      );
    }

    if (daysUntilDue <= 1) {
      return (
        <Badge
          count={`${
            daysUntilDue === 0
              ? t("studentDashboard.homework.dueTodayBadge") || "Due Today"
              : t("studentDashboard.homework.dueTomorrowBadge") ||
                "Due Tomorrow"
          }`}
          style={{ backgroundColor: "#faad14" }}
        />
      );
    }

    if (daysUntilDue <= 7) {
      return (
        <Badge
          count={t("studentDashboard.homework.dueSoonBadge") || "Due Soon"}
          style={{ backgroundColor: "#1890ff" }}
        />
      );
    }

    return null;
  };

  // Responsive columns configuration
  const columns = [
    {
      title: t("studentDashboard.homework.columns.assignment"),
      dataIndex: "title",
      key: "title",
      fixed: screens.md ? "left" : false,
      width: screens.md ? 280 : undefined,
      render: (text, record) => {
        const priorityBadge = getPriorityBadge(record);
        return (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Space>
              <BookOutlined style={{ color: "#1890ff", fontSize: 16 }} />
              <Text strong style={{ fontSize: screens.xs ? 14 : 15 }}>
                {text}
              </Text>
            </Space>
            <Text
              type="secondary"
              style={{ fontSize: screens.xs ? 12 : 13, paddingLeft: 24 }}
            >
              {record.course?.name ||
                t("studentDashboard.homework.noCourse") ||
                "No Course"}
            </Text>
            {priorityBadge && (
              <div style={{ paddingLeft: 24, marginTop: 4 }}>
                {priorityBadge}
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.homework.columns.description"),
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ marginBottom: 0, maxWidth: 300 }}
          >
            {text ||
              t("studentDashboard.homework.noDescription") ||
              "No description"}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: t("studentDashboard.homework.columns.dueDate"),
      dataIndex: "dueDate",
      key: "dueDate",
      width: screens.md ? 200 : undefined,
      responsive: ["sm"],
      render: (date) => {
        const isOverdue = moment(date).isBefore(moment());
        const daysUntil = moment(date).diff(moment(), "days");
        const hoursUntil = moment(date).diff(moment(), "hours");

        return (
          <Space direction="vertical" size={2}>
            <Space>
              <CalendarOutlined
                style={{
                  color: isOverdue
                    ? "#ff4d4f"
                    : daysUntil <= 1
                    ? "#faad14"
                    : "#1890ff",
                }}
              />
              <Text
                type={
                  isOverdue
                    ? "danger"
                    : daysUntil <= 1
                    ? "warning"
                    : "secondary"
                }
                strong={isOverdue || daysUntil <= 1}
              >
                {moment(date).format("MMM DD, YYYY")}
              </Text>
            </Space>
            {!isOverdue && daysUntil <= 7 && (
              <Text type="secondary" style={{ fontSize: 12, paddingLeft: 20 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {hoursUntil < 24
                  ? `${hoursUntil} ${
                      t("studentDashboard.homework.hoursLeft") || "hours left"
                    }`
                  : `${daysUntil} ${
                      t("studentDashboard.homework.daysLeft") || "days left"
                    }`}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.homework.columns.status"),
      dataIndex: "status",
      key: "status",
      width: 130,
      responsive: ["lg"],
      render: (status, record) => {
        const isOverdue =
          status === "active" && moment(record.dueDate).isBefore(moment());

        if (isOverdue) {
          return (
            <Tag color="error" icon={<ExclamationCircleOutlined />}>
              {t("studentDashboard.homework.status.overdue")}
            </Tag>
          );
        }

        const colors = {
          active: "success",
          draft: "default",
          archived: "warning",
        };

        const icons = {
          active: <CheckCircleOutlined />,
          draft: <ClockCircleOutlined />,
          archived: <FileTextOutlined />,
        };

        const translatedStatus =
          status === "active"
            ? t("studentDashboard.homework.status.active")
            : status === "draft"
            ? t("studentDashboard.homework.status.draft")
            : t("studentDashboard.homework.status.archived");

        return (
          <Tag color={colors[status]} icon={icons[status]}>
            {translatedStatus}
          </Tag>
        );
      },
    },
    {
      title: t("studentDashboard.homework.columns.actions"),
      key: "actions",
      fixed: screens.md ? "right" : false,
      width: screens.lg ? 240 : screens.md ? 200 : undefined,
      render: (_, record) => {
        const isOverdue = moment(record.dueDate).isBefore(moment());
        return (
          <Space
            direction={screens.xs ? "vertical" : "horizontal"}
            style={{ width: "100%" }}
          >
            <Tooltip title={t("studentDashboard.homework.viewDetails")}>
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => onViewDetails(record)}
                block={screens.xs}
              >
                {screens.md
                  ? t("studentDashboard.homework.viewDetails")
                  : t("studentDashboard.homework.viewShort") || "View"}
              </Button>
            </Tooltip>
            <Tooltip
              title={
                isOverdue
                  ? t("studentDashboard.homework.overdueWarning") ||
                    "This assignment is overdue"
                  : t("studentDashboard.homework.submit")
              }
            >
              <Button
                type={isOverdue ? "default" : "primary"}
                danger={isOverdue}
                icon={<UploadOutlined />}
                onClick={() => onSubmitHomework(record)}
                block={screens.xs}
              >
                {screens.md
                  ? t("studentDashboard.homework.submit")
                  : t("studentDashboard.homework.submitShort") || "Submit"}
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div
      style={{
        padding: screens.xs ? "16px" : screens.md ? "24px" : "32px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: screens.xs ? "24px 20px" : "32px 28px",
          marginBottom: 24,
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
        }}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Space>
            <FormOutlined
              style={{
                fontSize: screens.xs ? 28 : 32,
                color: "#fff",
              }}
            />
            <Title
              level={screens.xs ? 3 : 2}
              style={{ margin: 0, color: "#fff" }}
            >
              {t("studentDashboard.homework.title")}
            </Title>
          </Space>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
            {t("studentDashboard.homework.subtitle")}
          </Text>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={
                t("studentDashboard.homework.totalAssignments") ||
                "Total Assignments"
              }
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontSize: screens.xs ? 20 : 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={
                t("studentDashboard.homework.activeAssignments") || "Active"
              }
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontSize: screens.xs ? 20 : 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.homework.dueSoon") || "Due Soon"}
              value={stats.upcoming}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14", fontSize: screens.xs ? 20 : 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title={t("studentDashboard.homework.overdueCount") || "Overdue"}
              value={stats.overdue}
              prefix={
                <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
              }
              valueStyle={{ color: "#ff4d4f", fontSize: screens.xs ? 20 : 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: "12px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={10} lg={12}>
            <Input
              placeholder={
                t("studentDashboard.homework.searchPlaceholder") ||
                "Search assignments, courses..."
              }
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={12} md={7} lg={6}>
            <Select
              style={{ width: "100%" }}
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">
                {t("studentDashboard.homework.filterAll") || "All Status"}
              </Select.Option>
              <Select.Option value="active">
                {t("studentDashboard.homework.status.active")}
              </Select.Option>
              <Select.Option value="overdue">
                {t("studentDashboard.homework.status.overdue")}
              </Select.Option>
              <Select.Option value="draft">
                {t("studentDashboard.homework.status.draft")}
              </Select.Option>
              <Select.Option value="archived">
                {t("studentDashboard.homework.status.archived")}
              </Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={7} lg={6}>
            <Select
              style={{ width: "100%" }}
              size="large"
              value={sortOrder}
              onChange={setSortOrder}
            >
              <Select.Option value="dueDate">
                {t("studentDashboard.homework.sortByDueDate") ||
                  "Sort by Due Date"}
              </Select.Option>
              <Select.Option value="title">
                {t("studentDashboard.homework.sortByTitle") || "Sort by Title"}
              </Select.Option>
              <Select.Option value="course">
                {t("studentDashboard.homework.sortByCourse") ||
                  "Sort by Course"}
              </Select.Option>
            </Select>
          </Col>
        </Row>

        {/* Results count */}
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            {t("studentDashboard.homework.showing") || "Showing"}{" "}
            <Text strong>{filteredHomework.length}</Text>{" "}
            {t("studentDashboard.homework.of") || "of"}{" "}
            <Text strong>{homework.length}</Text>{" "}
            {t("studentDashboard.homework.assignments") || "assignments"}
          </Text>
        </div>
      </Card>

      {/* Homework Table */}
      <Card bordered={false} style={{ borderRadius: "12px" }}>
        <Table
          columns={columns}
          dataSource={filteredHomework}
          rowKey={(record) => record._id || record.id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${
                t("studentDashboard.homework.of") || "of"
              } ${total} ${t("studentDashboard.homework.items") || "items"}`,
            responsive: true,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchText || statusFilter !== "all"
                    ? t("studentDashboard.homework.noMatchingAssignments") ||
                      "No assignments match your filters"
                    : t("studentDashboard.homework.noAssignments")
                }
              >
                {searchText || statusFilter !== "all" ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setSearchText("");
                      setStatusFilter("all");
                    }}
                  >
                    {t("studentDashboard.homework.clearFilters") ||
                      "Clear Filters"}
                  </Button>
                ) : null}
              </Empty>
            ),
          }}
          scroll={{ x: screens.xs ? 800 : screens.md ? 1000 : undefined }}
          rowClassName={(record) => {
            const isOverdue =
              record.status === "active" &&
              moment(record.dueDate).isBefore(moment());
            return isOverdue ? "overdue-row" : "";
          }}
          size={screens.xs ? "small" : "middle"}
        />
      </Card>

      {/* Custom Styles */}
      <style jsx>{`
        .overdue-row {
          background-color: #fff1f0;
        }
        .overdue-row:hover {
          background-color: #ffe7e6 !important;
        }
      `}</style>
    </div>
  );
};

export default StudentHomework;

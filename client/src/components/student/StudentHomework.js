import React from "react";
import { Table, Space, Button, Tag, Typography, Card } from "antd";
import {
  FormOutlined,
  EyeOutlined,
  UploadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const StudentHomework = ({
  t,
  homework,
  onViewDetails,
  onSubmitHomework,
}) => {
  const columns = [
    {
      title: t("studentDashboard.homework.columns.assignment"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">{record.course?.name}</Text>
        </Space>
      ),
    },
    {
      title: t("studentDashboard.homework.columns.description"),
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>
      ),
    },
    {
      title: t("studentDashboard.homework.columns.dueDate"),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => {
        const isOverdue = moment(date).isBefore(moment());
        return (
          <Space>
            <CalendarOutlined
              style={{ color: isOverdue ? "#ff4d4f" : "#1890ff" }}
            />
            <Text type={isOverdue ? "danger" : "secondary"}>
              {moment(date).format("MMM DD, YYYY")}
            </Text>
            {isOverdue && (
              <Tag color="error">
                {t("studentDashboard.homework.status.overdue")}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.homework.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          active: "success",
          draft: "default",
          archived: "warning",
        };
        const translatedStatus =
          status === "active"
            ? t("studentDashboard.homework.status.active")
            : status === "draft"
            ? t("studentDashboard.homework.status.draft")
            : t("studentDashboard.homework.status.archived");
        return <Tag color={colors[status]}>{translatedStatus}</Tag>;
      },
    },
    {
      title: t("studentDashboard.homework.columns.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(record)}
          >
            {t("studentDashboard.homework.viewDetails")}
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => onSubmitHomework(record)}
          >
            {t("studentDashboard.homework.submit")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <FormOutlined style={{ marginRight: "8px" }} />
        {t("studentDashboard.homework.title")}
      </Title>
      <Text type="secondary">{t("studentDashboard.homework.subtitle")}</Text>

      <Card style={{ marginTop: "24px" }}>
        <Table
          columns={columns}
          dataSource={homework}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: t("studentDashboard.homework.noAssignments"),
          }}
        />
      </Card>
    </div>
  );
};

export default StudentHomework;


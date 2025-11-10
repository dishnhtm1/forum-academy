import React from "react";
import { Table, Space, Tag, Typography, Card, Button } from "antd";
import {
  QuestionCircleOutlined,
  FieldTimeOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const StudentQuizzes = ({ t, quizzes, onStartQuiz }) => {
  const columns = [
    {
      title: t("studentDashboard.quizzes.columns.title"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        const courseName =
          record.assignment?.courseDetails
            ?.map((course) => course.title)
            .join(", ") ||
          record.course?.name ||
          record.course?.title ||
          t("studentDashboard.quizzes.courseUnknown", "Course");
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary">{courseName}</Text>
          </Space>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.questions"),
      dataIndex: "questions",
      key: "questions",
      render: (questions) => (
        <Tag color="blue">
          {questions?.length || 0}{" "}
          {t("studentDashboard.quizzes.columns.questions")}
        </Tag>
      ),
    },
    {
      title: t("studentDashboard.quizzes.columns.timeLimit"),
      key: "timeLimit",
      render: (_, record) => {
        const duration = record.duration || record.timeLimit || 0;
        return (
          <Text>
            <FieldTimeOutlined /> {duration}{" "}
            {t("studentDashboard.quizzes.minutes", "minutes")}
          </Text>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.dueDate"),
      key: "dueDate",
      render: (_, record) => {
        const dueDate = record.assignment?.dueDate;
        return dueDate
          ? moment(dueDate).format("MMM DD, YYYY HH:mm")
          : t("studentDashboard.quizzes.noDeadline", "No deadline");
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.status"),
      key: "status",
      render: (_, record) => {
        const dueDate = record.assignment?.dueDate;
        if (!dueDate) {
          return (
            <Tag color="default">
              {t("studentDashboard.quizzes.status.available", "Available")}
            </Tag>
          );
        }
        const isOverdue = moment(dueDate).isBefore(moment());
        const isDueSoon =
          !isOverdue && moment(dueDate).diff(moment(), "hours") <= 24;
        if (isOverdue) {
          return (
            <Tag color="red">
              {t("studentDashboard.quizzes.status.overdue", "Overdue")}
            </Tag>
          );
        }
        if (isDueSoon) {
          return (
            <Tag color="orange">
              {t("studentDashboard.quizzes.status.dueSoon", "Due soon")}
            </Tag>
          );
        }
        return (
          <Tag color="green">
            {t("studentDashboard.quizzes.status.assigned", "Assigned")}
          </Tag>
        );
      },
    },
    {
      title: t("studentDashboard.quizzes.columns.actions"),
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => onStartQuiz(record)}
        >
          {t("studentDashboard.quizzes.takeQuiz")}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <QuestionCircleOutlined style={{ marginRight: "8px" }} />
        {t("studentDashboard.quizzes.title")}
      </Title>
      <Text type="secondary">{t("studentDashboard.quizzes.subtitle")}</Text>

      <Card style={{ marginTop: "24px" }}>
        <Table
          columns={columns}
          dataSource={quizzes}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: t(
              "studentDashboard.quizzes.noAssigned",
              "No quizzes assigned yet."
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default StudentQuizzes;


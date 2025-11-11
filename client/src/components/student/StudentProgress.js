import React from "react";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Space } from "antd";
import {
  TrophyOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FireOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const StudentProgress = ({ t, progressRecords, dashboardStats }) => {
  const columns = [
    {
      title: t("studentDashboard.progress.columns.subject"),
      dataIndex: "subject",
      key: "subject",
      render: (subject) => <Tag color="blue">{subject}</Tag>,
    },
    {
      title: t("studentDashboard.progress.columns.assignment"),
      dataIndex: "assignment",
      key: "assignment",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t("studentDashboard.progress.columns.type"),
      dataIndex: "assignmentType",
      key: "assignmentType",
      render: (type) => {
        const colors = {
          homework: "orange",
          quiz: "blue",
          exam: "red",
          project: "purple",
        };
        const translatedType =
          type === "homework"
            ? t("studentDashboard.progress.types.homework")
            : type === "quiz"
            ? t("studentDashboard.progress.types.quiz")
            : type === "exam"
            ? t("studentDashboard.progress.types.exam")
            : type === "project"
            ? t("studentDashboard.progress.types.project")
            : t("studentDashboard.progress.types.other");
        return <Tag color={colors[type]}>{translatedType}</Tag>;
      },
    },
    {
      title: t("studentDashboard.progress.columns.score"),
      dataIndex: "score",
      key: "score",
      render: (score, record) => (
        <Space>
          <Text strong>
            {score}/{record.maxPoints ?? record.maxScore}
          </Text>
          <Text type="secondary">({record.percentage}%)</Text>
        </Space>
      ),
    },
    {
      title: t("studentDashboard.progress.columns.grade"),
      dataIndex: "grade",
      key: "grade",
      render: (grade) => {
        const getColor = (g) => {
          if (["A+", "A", "A-"].includes(g)) return "green";
          if (["B+", "B", "B-"].includes(g)) return "blue";
          if (["C+", "C", "C-"].includes(g)) return "orange";
          return "red";
        };
        return (
          <Tag color={getColor(grade)} style={{ fontWeight: "bold" }}>
            {grade}
          </Tag>
        );
      },
    },
    {
      title: t("studentDashboard.progress.columns.dateGraded"),
      dataIndex: "gradedDate",
      key: "gradedDate",
      render: (date) => (date ? moment(date).format("MMM DD, YYYY") : "—"),
    },
    {
      title: t("studentDashboard.progress.columns.teacher"),
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher) =>
        teacher ? `${teacher.firstName} ${teacher.lastName}` : "N/A",
    },
  ];

  const averageGrade =
    progressRecords.length > 0
      ? (
          progressRecords.reduce(
            (sum, record) => sum + (record.percentage || 0),
            0
          ) / progressRecords.length
        ).toFixed(1)
      : 0;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <TrophyOutlined style={{ marginRight: "8px" }} />
        {t("studentDashboard.progress.title")}
      </Title>
      <Text type="secondary">{t("studentDashboard.progress.subtitle")}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("studentDashboard.progress.statistics.totalGraded")}
              value={progressRecords.length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("studentDashboard.progress.statistics.averageScore")}
              value={averageGrade}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{
                color:
                  averageGrade >= 80
                    ? "#52c41a"
                    : averageGrade >= 60
                    ? "#faad14"
                    : "#f5222d",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("studentDashboard.progress.statistics.studyStreak")}
              value={dashboardStats.studyStreak || 0}
              suffix={t("studentDashboard.progress.statistics.days")}
              prefix={<FireOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: "24px" }}
        title={t("studentDashboard.progress.gradeHistory")}
      >
        <Table
          columns={columns}
          dataSource={progressRecords}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: t("studentDashboard.progress.noGrades", "No grades recorded yet") }}
        />
      </Card>
    </div>
  );
};

export default StudentProgress;


import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Descriptions,
  List,
  Typography,
  message,
  Statistic,
  Row,
  Col,
  Progress,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const ListeningSubmissionsView = ({ exerciseId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    if (exerciseId) {
      fetchSubmissions();
    }
  }, [exerciseId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/listening-exercises/${exerciseId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } else {
        message.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      message.error("Error fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "processing";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const columns = [
    {
      title: "Student",
      dataIndex: ["student"],
      key: "student",
      render: (student) => (
        <Space>
          <UserOutlined />
          <Text strong>
            {student?.firstName} {student?.lastName}
          </Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: ["student", "email"],
      key: "email",
    },
    {
      title: "Score",
      key: "score",
      render: (_, record) => (
        <Space>
          <TrophyOutlined style={{ color: "#faad14" }} />
          <Text strong>
            {record.score}/{record.answers?.length || 0}
          </Text>
        </Space>
      ),
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage) => (
        <Tag color={getGradeColor(percentage)}>{percentage}%</Tag>
      ),
    },
    {
      title: "Attempt",
      dataIndex: "attemptNumber",
      key: "attemptNumber",
      render: (attempt) => <Tag color="blue">Attempt #{attempt}</Tag>,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <Text type="secondary">
            {moment(date).format("MMM DD, YYYY HH:mm")}
          </Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedSubmission(record);
            setDetailModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const avgScore =
    submissions.length > 0
      ? (
          submissions.reduce((sum, sub) => sum + sub.percentage, 0) /
          submissions.length
        ).toFixed(1)
      : 0;

  const passRate =
    submissions.length > 0
      ? (
          (submissions.filter((sub) => sub.percentage >= 70).length /
            submissions.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div>
      <Title level={3}>Student Submissions</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Submissions"
              value={submissions.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Score"
              value={avgScore}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{
                color:
                  avgScore >= 80
                    ? "#52c41a"
                    : avgScore >= 70
                    ? "#faad14"
                    : "#f5222d",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pass Rate (≥70%)"
              value={passRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{
                color: passRate >= 70 ? "#52c41a" : "#f5222d",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Submissions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            Submission Details
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedSubmission && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Student" span={2}>
                <Space>
                  <UserOutlined />
                  <Text strong>
                    {selectedSubmission.student?.firstName}{" "}
                    {selectedSubmission.student?.lastName}
                  </Text>
                  <Text type="secondary">
                    ({selectedSubmission.student?.email})
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Exercise">
                {selectedSubmission.exercise?.title}
              </Descriptions.Item>
              <Descriptions.Item label="Attempt">
                Attempt #{selectedSubmission.attemptNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Score">
                <Space>
                  <TrophyOutlined style={{ color: "#faad14" }} />
                  <Text strong>
                    {selectedSubmission.score}/
                    {selectedSubmission.answers?.length || 0}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Percentage">
                <Tag color={getGradeColor(selectedSubmission.percentage)}>
                  {selectedSubmission.percentage}%
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted At" span={2}>
                {moment(selectedSubmission.submittedAt).format(
                  "MMMM DD, YYYY HH:mm:ss"
                )}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Performance" size="small">
              <Progress
                percent={selectedSubmission.percentage}
                status={
                  selectedSubmission.percentage >= 70 ? "success" : "exception"
                }
              />
            </Card>

            <Card title="Detailed Answers" size="small">
              <List
                dataSource={selectedSubmission.answers}
                renderItem={(answer, index) => (
                  <List.Item>
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="small"
                    >
                      <Space>
                        {answer.isCorrect ? (
                          <CheckCircleOutlined
                            style={{ color: "#52c41a", fontSize: "18px" }}
                          />
                        ) : (
                          <CloseCircleOutlined
                            style={{ color: "#f5222d", fontSize: "18px" }}
                          />
                        )}
                        <Text strong>Question {index + 1}</Text>
                        <Tag color={answer.isCorrect ? "success" : "error"}>
                          {answer.isCorrect ? "CORRECT" : "INCORRECT"}
                        </Tag>
                      </Space>
                      <Text type="secondary">
                        Selected Option:{" "}
                        {String.fromCharCode(65 + answer.answer)}
                      </Text>
                      <Text type="secondary">
                        Points Earned: {answer.pointsEarned || 0}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default ListeningSubmissionsView;

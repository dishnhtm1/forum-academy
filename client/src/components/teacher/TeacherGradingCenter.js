import React, { useState, useEffect, useCallback } from "react";
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
} from "antd";
import {
  CheckSquareOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { progressAPI, courseAPI, quizAPI, homeworkAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherGradingCenter = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [progressForm] = Form.useForm();

  const [progressRecords, setProgressRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const [viewingProgress, setViewingProgress] = useState(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [viewProgressModalVisible, setViewProgressModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getAll();
      if (response.success) {
        const allCourses = response.courses || response || [];
        const teacherCourses = allCourses.filter(
          (course) => course.teacher === currentUser?.id || course.teacherId === currentUser?.id
        );
        setCourses(teacherCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser]);

  const fetchProgressRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getAll();
      if (response.success) {
        const allProgress = response.progress || response || [];
        const teacherProgress = allProgress.filter(
          (progress) => progress.teacher === currentUser?.id || progress.teacherId === currentUser?.id
        );
        setProgressRecords(teacherProgress);
      }
    } catch (error) {
      console.error("Error fetching progress records:", error);
      message.error("Failed to fetch progress records");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
    fetchProgressRecords();
  }, [fetchCourses, fetchProgressRecords]);

  const handleCreateProgress = async (values) => {
    try {
      const progressData = {
        student: values.studentId,
        studentId: values.studentId,
        course: values.courseId,
        courseId: values.courseId,
        assignmentType: values.assignmentType,
        assignmentName: values.assignmentName,
        score: values.score,
        maxScore: values.maxScore || 100,
        grade: values.grade,
        feedback: values.feedback || "",
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
      };

      if (editingProgress) {
        await progressAPI.update(editingProgress._id, progressData);
        message.success("Grade updated successfully");
      } else {
        await progressAPI.create(progressData);
        message.success("Grade created successfully");
      }

      setProgressModalVisible(false);
      progressForm.resetFields();
      setEditingProgress(null);
      fetchProgressRecords();
    } catch (error) {
      message.error(error.message || "Error saving grade");
    }
  };

  const handleEditProgress = (progress) => {
    setEditingProgress(progress);
    progressForm.setFieldsValue({
      studentId: progress.student?._id || progress.student || progress.studentId,
      courseId: progress.course?._id || progress.course || progress.courseId,
      assignmentType: progress.assignmentType,
      assignmentName: progress.assignmentName,
      score: progress.score,
      maxScore: progress.maxScore || 100,
      grade: progress.grade,
      feedback: progress.feedback || "",
    });
    setProgressModalVisible(true);
  };

  const handleViewProgress = (progress) => {
    setViewingProgress(progress);
    setViewProgressModalVisible(true);
  };

  const handleDeleteProgress = async (progressId) => {
    try {
      await progressAPI.delete(progressId);
      message.success("Grade deleted successfully");
      fetchProgressRecords();
    } catch (err) {
      message.error("Failed to delete grade");
    }
  };

  const calculateGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const filteredProgress = progressRecords.filter((progress) => {
    const matchesSearch =
      !searchTerm ||
      progress.assignmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || progress.assignmentType === selectedType;
    return matchesSearch && matchesType;
  });

  const progressColumns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{record.studentName || "Unknown Student"}</Text>
        </Space>
      ),
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (course) => {
        const courseData = typeof course === 'object' ? course : courses.find(c => (c._id || c.id) === course);
        return <Tag color="blue">{courseData?.title || "Unknown"}</Tag>;
      },
    },
    {
      title: "Assignment",
      dataIndex: "assignmentName",
      key: "assignmentName",
    },
    {
      title: "Type",
      dataIndex: "assignmentType",
      key: "assignmentType",
      render: (type) => <Tag color="purple">{type || "N/A"}</Tag>,
    },
    {
      title: "Score",
      key: "score",
      render: (_, record) => (
        <Text strong>{record.score || 0} / {record.maxScore || 100}</Text>
      ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (grade, record) => {
        const finalGrade = grade || calculateGrade(record.score || 0, record.maxScore || 100);
        const colorMap = { A: "green", B: "blue", C: "orange", D: "red", F: "red" };
        return <Tag color={colorMap[finalGrade]}>{finalGrade}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewProgress(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditProgress(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this grade?"
            onConfirm={() => handleDeleteProgress(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <CheckSquareOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.gradingCenter") || "Grading Center"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search grades..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by type"
            allowClear
            value={selectedType}
            onChange={setSelectedType}
            style={{ width: 200 }}
          >
            <Option value="quiz">Quiz</Option>
            <Option value="homework">Homework</Option>
            <Option value="exam">Exam</Option>
            <Option value="project">Project</Option>
            <Option value="participation">Participation</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProgress(null);
              progressForm.resetFields();
              setProgressModalVisible(true);
            }}
          >
            Add Grade
          </Button>
        </Space>

        <Table
          columns={progressColumns}
          dataSource={filteredProgress}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Progress Modal */}
      <Modal
        title={editingProgress ? "Edit Grade" : "Add Grade"}
        open={progressModalVisible}
        onCancel={() => {
          setProgressModalVisible(false);
          setEditingProgress(null);
          progressForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={progressForm} layout="vertical" onFinish={handleCreateProgress}>
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select placeholder="Select course">
              {courses.map((course) => (
                <Option key={course._id || course.id} value={course._id || course.id}>
                  {course.title} ({course.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="studentId"
            label="Student ID"
            rules={[{ required: true, message: "Please enter student ID" }]}
          >
            <Input placeholder="Enter student ID" />
          </Form.Item>
          <Form.Item
            name="assignmentType"
            label="Assignment Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="quiz">Quiz</Option>
              <Option value="homework">Homework</Option>
              <Option value="exam">Exam</Option>
              <Option value="project">Project</Option>
              <Option value="participation">Participation</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="assignmentName"
            label="Assignment Name"
            rules={[{ required: true, message: "Please enter assignment name" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="score"
                label="Score"
                rules={[{ required: true, message: "Please enter score" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxScore"
                label="Max Score"
                initialValue={100}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="grade" label="Grade">
            <Select>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
              <Option value="F">F</Option>
            </Select>
          </Form.Item>
          <Form.Item name="feedback" label="Feedback">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProgress ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setProgressModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Progress Modal */}
      <Modal
        title="Grade Details"
        open={viewProgressModalVisible}
        onCancel={() => {
          setViewProgressModalVisible(false);
          setViewingProgress(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewProgressModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {viewingProgress && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Student">
              {viewingProgress.studentName || "Unknown Student"}
            </Descriptions.Item>
            <Descriptions.Item label="Course">
              {(() => {
                const courseData = typeof viewingProgress.course === 'object' 
                  ? viewingProgress.course 
                  : courses.find(c => (c._id || c.id) === viewingProgress.course);
                return courseData?.title || "Unknown";
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Assignment">
              {viewingProgress.assignmentName}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="purple">{viewingProgress.assignmentType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Score">
              {viewingProgress.score || 0} / {viewingProgress.maxScore || 100}
            </Descriptions.Item>
            <Descriptions.Item label="Grade">
              <Tag color="green">{viewingProgress.grade || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Feedback">
              {viewingProgress.feedback || "No feedback"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TeacherGradingCenter;

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
  DatePicker,
  InputNumber,
  Switch,
  Descriptions,
  Empty,
  Divider,
} from "antd";
import {
  QuestionCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { quizAPI, courseAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherQuizManagement = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [quizForm] = Form.useForm();
  const [questionForm] = Form.useForm();

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [viewQuizModalVisible, setViewQuizModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
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

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAll();
      if (response.success) {
        const allQuizzes = response.quizzes || response || [];
        const teacherQuizzes = allQuizzes.filter(
          (quiz) => quiz.teacher === currentUser?.id || quiz.teacherId === currentUser?.id
        );
        setQuizzes(teacherQuizzes);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      message.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, [fetchCourses, fetchQuizzes]);

  const handleCreateQuiz = async (values) => {
    try {
      const quizData = {
        title: values.title,
        description: values.description,
        course: values.courseId,
        courseId: values.courseId,
        duration: values.duration || 60,
        passingScore: values.passingScore || 60,
        maxAttempts: values.maxAttempts || 1,
        isActive: values.isActive !== false,
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
        questions: [],
      };

      if (editingQuiz) {
        await quizAPI.update(editingQuiz._id, quizData);
        message.success("Quiz updated successfully");
      } else {
        await quizAPI.create(quizData);
        message.success("Quiz created successfully");
      }

      setQuizModalVisible(false);
      quizForm.resetFields();
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (error) {
      message.error(error.message || "Error saving quiz");
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    quizForm.setFieldsValue({
      title: quiz.title,
      description: quiz.description,
      courseId: quiz.course?._id || quiz.course || quiz.courseId,
      duration: quiz.duration || 60,
      passingScore: quiz.passingScore || 60,
      maxAttempts: quiz.maxAttempts || 1,
      isActive: quiz.isActive !== false,
    });
    setQuizModalVisible(true);
  };

  const handleViewQuiz = (quiz) => {
    setViewingQuiz(quiz);
    setViewQuizModalVisible(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.delete(quizId);
      message.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (err) {
      message.error("Failed to delete quiz");
    }
  };

  const handleAddQuestion = async (values) => {
    try {
      const questionData = {
        question: values.question,
        type: values.type || "multiple-choice",
        options: values.options || [],
        correctAnswer: values.correctAnswer,
        points: values.points || 1,
      };

      if (editingQuestion) {
        await quizAPI.updateQuestion(viewingQuiz._id, editingQuestion._id || editingQuestion.id, questionData);
        message.success("Question updated successfully");
      } else {
        await quizAPI.addQuestion(viewingQuiz._id, questionData);
        message.success("Question added successfully");
      }

      setQuestionModalVisible(false);
      questionForm.resetFields();
      setEditingQuestion(null);
      fetchQuizzes();
      const updatedQuiz = await quizAPI.getById(viewingQuiz._id);
      if (updatedQuiz.success) {
        setViewingQuiz(updatedQuiz.quiz || updatedQuiz);
      }
    } catch (error) {
      message.error(error.message || "Error saving question");
    }
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestion(question);
    questionForm.setFieldsValue({
      question: question.question,
      type: question.type || "multiple-choice",
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      points: question.points || 1,
    });
    setQuestionModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await quizAPI.deleteQuestion(viewingQuiz._id, questionId);
      message.success("Question deleted successfully");
      fetchQuizzes();
      const updatedQuiz = await quizAPI.getById(viewingQuiz._id);
      if (updatedQuiz.success) {
        setViewingQuiz(updatedQuiz.quiz || updatedQuiz);
      }
    } catch (error) {
      message.error("Failed to delete question");
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      !searchTerm ||
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const quizColumns = [
    {
      title: "Quiz Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description || "No description"}
          </Text>
        </div>
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
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (questions) => <Tag>{questions?.length || 0}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
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
              onClick={() => handleViewQuiz(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditQuiz(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this quiz?"
            onConfirm={() => handleDeleteQuiz(record._id)}
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
            <QuestionCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.quizManagement") || "Quiz Management"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search quizzes..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingQuiz(null);
              quizForm.resetFields();
              setQuizModalVisible(true);
            }}
          >
            Create Quiz
          </Button>
        </Space>

        <Table
          columns={quizColumns}
          dataSource={filteredQuizzes}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Quiz Modal */}
      <Modal
        title={editingQuiz ? "Edit Quiz" : "Create Quiz"}
        open={quizModalVisible}
        onCancel={() => {
          setQuizModalVisible(false);
          setEditingQuiz(null);
          quizForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={quizForm} layout="vertical" onFinish={handleCreateQuiz}>
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
            name="title"
            label="Quiz Title"
            rules={[{ required: true, message: "Please enter quiz title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                initialValue={60}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="passingScore"
                label="Passing Score (%)"
                initialValue={60}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxAttempts"
                label="Max Attempts"
                initialValue={1}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuiz ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setQuizModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Quiz Modal */}
      <Modal
        title="Quiz Details"
        open={viewQuizModalVisible}
        onCancel={() => {
          setViewQuizModalVisible(false);
          setViewingQuiz(null);
        }}
        footer={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingQuestion(null);
              questionForm.resetFields();
              setQuestionModalVisible(true);
            }}
          >
            Add Question
          </Button>,
          <Button key="close" onClick={() => setViewQuizModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewingQuiz && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Title">{viewingQuiz.title}</Descriptions.Item>
              <Descriptions.Item label="Course">
                {(() => {
                  const courseData = typeof viewingQuiz.course === 'object' 
                    ? viewingQuiz.course 
                    : courses.find(c => (c._id || c.id) === viewingQuiz.course);
                  return courseData?.title || "Unknown";
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">{viewingQuiz.duration} minutes</Descriptions.Item>
              <Descriptions.Item label="Passing Score">{viewingQuiz.passingScore}%</Descriptions.Item>
              <Descriptions.Item label="Max Attempts">{viewingQuiz.maxAttempts}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={viewingQuiz.isActive ? "green" : "default"}>
                  {viewingQuiz.isActive ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider>Questions</Divider>
            {viewingQuiz.questions && viewingQuiz.questions.length > 0 ? (
              <div>
                {viewingQuiz.questions.map((question, index) => (
                  <Card
                    key={index}
                    style={{ marginBottom: 16 }}
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditQuestion(question, index)}
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Are you sure you want to delete this question?"
                        onConfirm={() => handleDeleteQuestion(question._id || question.id)}
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Text strong>Q{index + 1}: {question.question}</Text>
                    <br />
                    <Text type="secondary">Type: {question.type}</Text>
                    <br />
                    <Text type="secondary">Points: {question.points}</Text>
                    {question.options && question.options.length > 0 && (
                      <>
                        <br />
                        <Text type="secondary">Options: {question.options.join(", ")}</Text>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description="No questions yet" />
            )}
          </>
        )}
      </Modal>

      {/* Add/Edit Question Modal */}
      <Modal
        title={editingQuestion ? "Edit Question" : "Add Question"}
        open={questionModalVisible}
        onCancel={() => {
          setQuestionModalVisible(false);
          setEditingQuestion(null);
          questionForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={questionForm} layout="vertical" onFinish={handleAddQuestion}>
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Please enter question" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Question Type"
            initialValue="multiple-choice"
          >
            <Select>
              <Option value="multiple-choice">Multiple Choice</Option>
              <Option value="true-false">True/False</Option>
              <Option value="short-answer">Short Answer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="options"
            label="Options (comma separated)"
          >
            <Input placeholder="Option 1, Option 2, Option 3, Option 4" />
          </Form.Item>
          <Form.Item
            name="correctAnswer"
            label="Correct Answer"
            rules={[{ required: true, message: "Please enter correct answer" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="points"
            label="Points"
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuestion ? "Update" : "Add"}
              </Button>
              <Button onClick={() => setQuestionModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherQuizManagement;

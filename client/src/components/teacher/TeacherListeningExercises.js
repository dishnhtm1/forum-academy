import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Form,
  Modal,
  Upload,
  Switch,
  Descriptions,
  Empty,
} from "antd";
import {
  AudioOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { listeningAPI, courseAPI } from "../../utils/apiClient";
import { API_BASE_URL } from "../../utils/adminApiUtils";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const TeacherListeningExercises = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [exerciseForm] = Form.useForm();
  const [questionForm] = Form.useForm();

  const [exercises, setExercises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExercise, setEditingExercise] = useState(null);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [viewExerciseModalVisible, setViewExerciseModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

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

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await listeningAPI.getAll();
      if (response.success) {
        const allExercises = response.exercises || response || [];
        const teacherExercises = allExercises.filter(
          (exercise) => exercise.teacher === currentUser?.id || exercise.teacherId === currentUser?.id
        );
        setExercises(teacherExercises);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      message.error("Failed to fetch listening exercises");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
    fetchExercises();
  }, [fetchCourses, fetchExercises]);

  const handleCreateExercise = async (values) => {
    if (fileList.length === 0 && !editingExercise) {
      message.error("Please upload an audio file");
      return;
    }

    try {
      const formData = new FormData();
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj || fileList[0];
        formData.append("audioFile", file);
      }
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("course", values.courseId);
      formData.append("courseId", values.courseId);
      formData.append("isActive", values.isActive !== false ? "true" : "false");
      formData.append("teacher", currentUser?.id);
      formData.append("teacherId", currentUser?.id);

      if (editingExercise) {
        await listeningAPI.update(editingExercise._id, {
          title: values.title,
          description: values.description,
          course: values.courseId,
          courseId: values.courseId,
          isActive: values.isActive !== false,
        });
        message.success("Exercise updated successfully");
      } else {
        await listeningAPI.create(formData);
        message.success("Exercise created successfully");
      }

      setExerciseModalVisible(false);
      exerciseForm.resetFields();
      setFileList([]);
      setEditingExercise(null);
      fetchExercises();
    } catch (error) {
      message.error(error.message || "Error saving exercise");
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    exerciseForm.setFieldsValue({
      title: exercise.title,
      description: exercise.description,
      courseId: exercise.course?._id || exercise.course || exercise.courseId,
      isActive: exercise.isActive !== false,
    });
    setExerciseModalVisible(true);
  };

  const handleViewExercise = (exercise) => {
    setViewingExercise(exercise);
    setViewExerciseModalVisible(true);
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await listeningAPI.delete(exerciseId);
      message.success("Exercise deleted successfully");
      fetchExercises();
    } catch (err) {
      message.error("Failed to delete exercise");
    }
  };

  const handleToggleExercise = async (exercise) => {
    try {
      await listeningAPI.update(exercise._id, {
        ...exercise,
        isActive: !exercise.isActive,
      });
      message.success(`Exercise ${!exercise.isActive ? "activated" : "deactivated"}`);
      fetchExercises();
    } catch (error) {
      message.error("Failed to update exercise");
    }
  };

  const handlePlayAudio = async (exercise) => {
    try {
      const url = await listeningAPI.getAudioUrl(exercise._id);
      setAudioUrl(url);
      setCurrentPlayingId(exercise._id);
    } catch (error) {
      message.error("Failed to load audio");
    }
  };

  const handleAddQuestion = async (values) => {
    try {
      const questions = viewingExercise.questions || [];
      const questionData = {
        question: values.question,
        options: values.options ? values.options.split(",").map(o => o.trim()) : [],
        correctAnswer: values.correctAnswer,
        points: values.points || 1,
      };

      if (editingQuestion) {
        const updatedQuestions = questions.map((q, idx) => 
          (q._id || q.id) === (editingQuestion._id || editingQuestion.id) ? questionData : q
        );
        await listeningAPI.update(viewingExercise._id, {
          questions: updatedQuestions,
        });
        message.success("Question updated successfully");
      } else {
        await listeningAPI.update(viewingExercise._id, {
          questions: [...questions, questionData],
        });
        message.success("Question added successfully");
      }

      setQuestionModalVisible(false);
      questionForm.resetFields();
      setEditingQuestion(null);
      fetchExercises();
      const updated = await listeningAPI.getById(viewingExercise._id);
      if (updated.success) {
        setViewingExercise(updated.exercise || updated);
      }
    } catch (error) {
      message.error(error.message || "Error saving question");
    }
  };

  const handleDeleteQuestion = async (questionIndex) => {
    try {
      const questions = viewingExercise.questions || [];
      const updatedQuestions = questions.filter((_, idx) => idx !== questionIndex);
      await listeningAPI.update(viewingExercise._id, {
        questions: updatedQuestions,
      });
      message.success("Question deleted successfully");
      fetchExercises();
      const updated = await listeningAPI.getById(viewingExercise._id);
      if (updated.success) {
        setViewingExercise(updated.exercise || updated);
      }
    } catch (error) {
      message.error("Failed to delete question");
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      !searchTerm ||
      exercise.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const exerciseColumns = [
    {
      title: "Exercise Title",
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
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleExercise(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Play Audio">
            <Button
              icon={currentPlayingId === record._id ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="small"
              onClick={() => handlePlayAudio(record)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewExercise(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditExercise(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this exercise?"
            onConfirm={() => handleDeleteExercise(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        message.error("You can only upload audio files!");
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => setFileList([]),
    maxCount: 1,
    accept: "audio/*",
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <AudioOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.listeningExercises") || "Listening Exercises"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search exercises..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingExercise(null);
              exerciseForm.resetFields();
              setFileList([]);
              setExerciseModalVisible(true);
            }}
          >
            Create Exercise
          </Button>
        </Space>

        {currentPlayingId && audioUrl && (
          <Card style={{ marginBottom: 16 }}>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </Card>
        )}

        <Table
          columns={exerciseColumns}
          dataSource={filteredExercises}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Exercise Modal */}
      <Modal
        title={editingExercise ? "Edit Exercise" : "Create Exercise"}
        open={exerciseModalVisible}
        onCancel={() => {
          setExerciseModalVisible(false);
          setEditingExercise(null);
          exerciseForm.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={exerciseForm} layout="vertical" onFinish={handleCreateExercise}>
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
            label="Exercise Title"
            rules={[{ required: true, message: "Please enter exercise title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          {!editingExercise && (
            <Form.Item
              label="Audio File"
              rules={[{ required: true, message: "Please upload an audio file" }]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag audio file to this area to upload</p>
              </Dragger>
            </Form.Item>
          )}
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
                {editingExercise ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setExerciseModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Exercise Modal */}
      <Modal
        title="Exercise Details"
        open={viewExerciseModalVisible}
        onCancel={() => {
          setViewExerciseModalVisible(false);
          setViewingExercise(null);
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
          <Button key="close" onClick={() => setViewExerciseModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewingExercise && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Title">{viewingExercise.title}</Descriptions.Item>
              <Descriptions.Item label="Course">
                {(() => {
                  const courseData = typeof viewingExercise.course === 'object' 
                    ? viewingExercise.course 
                    : courses.find(c => (c._id || c.id) === viewingExercise.course);
                  return courseData?.title || "Unknown";
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={viewingExercise.isActive ? "green" : "default"}>
                  {viewingExercise.isActive ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Questions</Title>
              {viewingExercise.questions && viewingExercise.questions.length > 0 ? (
                viewingExercise.questions.map((question, index) => (
                  <Card key={index} style={{ marginBottom: 8 }}>
                    <Text strong>Q{index + 1}: {question.question}</Text>
                    <br />
                    <Text type="secondary">Options: {question.options?.join(", ") || "N/A"}</Text>
                    <br />
                    <Text type="secondary">Correct Answer: {question.correctAnswer}</Text>
                    <br />
                    <Space style={{ marginTop: 8 }}>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingQuestion(question);
                          questionForm.setFieldsValue({
                            question: question.question,
                            options: question.options?.join(", ") || "",
                            correctAnswer: question.correctAnswer,
                            points: question.points || 1,
                          });
                          setQuestionModalVisible(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure you want to delete this question?"
                        onConfirm={() => handleDeleteQuestion(index)}
                      >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Card>
                ))
              ) : (
                <Empty description="No questions yet" />
              )}
            </div>
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

export default TeacherListeningExercises;

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
} from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { homeworkAPI, courseAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherAssignmentCenter = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [homeworkForm] = Form.useForm();

  const [homeworks, setHomeworks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHomework, setEditingHomework] = useState(null);
  const [viewingHomework, setViewingHomework] = useState(null);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [viewHomeworkModalVisible, setViewHomeworkModalVisible] = useState(false);
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

  const fetchHomeworks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await homeworkAPI.getAll();
      if (response.success) {
        const allHomeworks = response.homeworks || response || [];
        const teacherHomeworks = allHomeworks.filter(
          (homework) => homework.teacher === currentUser?.id || homework.teacherId === currentUser?.id
        );
        setHomeworks(teacherHomeworks);
      }
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      message.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
    fetchHomeworks();
  }, [fetchCourses, fetchHomeworks]);

  const handleCreateHomework = async (values) => {
    try {
      const homeworkData = {
        title: values.title,
        description: values.description,
        course: values.courseId,
        courseId: values.courseId,
        dueDate: values.dueDate?.format("YYYY-MM-DD"),
        maxScore: values.maxScore || 100,
        isActive: values.isActive !== false,
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
      };

      if (editingHomework) {
        await homeworkAPI.update(editingHomework._id, homeworkData);
        message.success("Assignment updated successfully");
      } else {
        await homeworkAPI.create(homeworkData);
        message.success("Assignment created successfully");
      }

      setHomeworkModalVisible(false);
      homeworkForm.resetFields();
      setEditingHomework(null);
      fetchHomeworks();
    } catch (error) {
      message.error(error.message || "Error saving assignment");
    }
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    homeworkForm.setFieldsValue({
      title: homework.title,
      description: homework.description,
      courseId: homework.course?._id || homework.course || homework.courseId,
      dueDate: homework.dueDate ? moment(homework.dueDate) : null,
      maxScore: homework.maxScore || 100,
      isActive: homework.isActive !== false,
    });
    setHomeworkModalVisible(true);
  };

  const handleViewHomework = (homework) => {
    setViewingHomework(homework);
    setViewHomeworkModalVisible(true);
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      await homeworkAPI.delete(homeworkId);
      message.success("Assignment deleted successfully");
      fetchHomeworks();
    } catch (err) {
      message.error("Failed to delete assignment");
    }
  };

  const filteredHomeworks = homeworks.filter((homework) => {
    const matchesSearch =
      !searchTerm ||
      homework.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      homework.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const homeworkColumns = [
    {
      title: "Assignment Title",
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
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => dueDate ? moment(dueDate).format("MMM DD, YYYY") : "No due date",
    },
    {
      title: "Max Score",
      dataIndex: "maxScore",
      key: "maxScore",
      render: (score) => <Tag>{score || 100}</Tag>,
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
              onClick={() => handleViewHomework(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditHomework(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this assignment?"
            onConfirm={() => handleDeleteHomework(record._id)}
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
            <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.assignmentCenter") || "Assignment Center"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search assignments..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingHomework(null);
              homeworkForm.resetFields();
              setHomeworkModalVisible(true);
            }}
          >
            Create Assignment
          </Button>
        </Space>

        <Table
          columns={homeworkColumns}
          dataSource={filteredHomeworks}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Homework Modal */}
      <Modal
        title={editingHomework ? "Edit Assignment" : "Create Assignment"}
        open={homeworkModalVisible}
        onCancel={() => {
          setHomeworkModalVisible(false);
          setEditingHomework(null);
          homeworkForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={homeworkForm} layout="vertical" onFinish={handleCreateHomework}>
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
            label="Assignment Title"
            rules={[{ required: true, message: "Please enter assignment title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxScore"
                label="Max Score"
                initialValue={100}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
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
                {editingHomework ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setHomeworkModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Homework Modal */}
      <Modal
        title="Assignment Details"
        open={viewHomeworkModalVisible}
        onCancel={() => {
          setViewHomeworkModalVisible(false);
          setViewingHomework(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewHomeworkModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {viewingHomework && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Title">{viewingHomework.title}</Descriptions.Item>
            <Descriptions.Item label="Course">
              {(() => {
                const courseData = typeof viewingHomework.course === 'object' 
                  ? viewingHomework.course 
                  : courses.find(c => (c._id || c.id) === viewingHomework.course);
                return courseData?.title || "Unknown";
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {viewingHomework.dueDate ? moment(viewingHomework.dueDate).format("MMM DD, YYYY") : "No due date"}
            </Descriptions.Item>
            <Descriptions.Item label="Max Score">{viewingHomework.maxScore || 100}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={viewingHomework.isActive ? "green" : "default"}>
                {viewingHomework.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {viewingHomework.description || "No description"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TeacherAssignmentCenter;

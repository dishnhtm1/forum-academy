import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
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
  Badge,
  message,
  Form,
  Modal,
  DatePicker,
  InputNumber,
  Radio,
  Descriptions,
  Progress,
  Avatar,
  Empty,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  BankOutlined,
  CodeOutlined,
  BgColorsOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { courseAPI } from "../../utils/apiClient";
import { API_BASE_URL, getAuthHeaders } from "../../utils/adminApiUtils";

const { Title, Text } = Typography;
const { Option } = Select;

const TeacherMyClasses = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [courseForm] = Form.useForm();
  const { i18n } = useTranslation();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [courseViewModalVisible, setCourseViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      if (response.success) {
        // Filter courses for current teacher
        const teacherCourses = (response.courses || response || []).filter(
          (course) => course.teacher === currentUser?.id || course.teacherId === currentUser?.id
        );
        setCourses(teacherCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourse = async (values) => {
    try {
      const courseData = {
        title: values.title,
        description: values.description,
        code: values.code.toUpperCase(),
        category: values.category,
        level: values.level,
        duration: values.duration || 12,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
        maxStudents: values.capacity || values.maxStudents || 30,
        isActive: values.status === "active",
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
      };

      if (editingCourse) {
        await courseAPI.update(editingCourse._id, courseData);
        message.success("Course updated successfully");
      } else {
        await courseAPI.create(courseData);
        message.success("Course created successfully");
      }

      setCourseModalVisible(false);
      courseForm.resetFields();
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      message.error(error.message || "Error saving course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    const formValues = {
      ...course,
      capacity: course.maxStudents || 30,
      status: course.isActive ? "active" : "inactive",
    };
    if (course.startDate) {
      const startDate = moment(course.startDate);
      if (startDate.isValid()) formValues.startDate = startDate;
    }
    if (course.endDate) {
      const endDate = moment(course.endDate);
      if (endDate.isValid()) formValues.endDate = endDate;
    }
    courseForm.setFieldsValue(formValues);
    setCourseModalVisible(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setCourseViewModalVisible(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseAPI.delete(courseId);
      message.success("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      message.error("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    language: "#5B86E5",
    business: "#36D1DC",
    technology: "#8E54E9",
    arts: "#F093FB",
    science: "#4FACFE",
    other: "#43E97B",
  };

  const categoryIcons = {
    language: <GlobalOutlined />,
    business: <BankOutlined />,
    technology: <CodeOutlined />,
    arts: <BgColorsOutlined />,
    science: <ExperimentOutlined />,
    other: <FileTextOutlined />,
  };

  const courseColumns = [
    {
      title: t("teacherDashboard.myClasses.courseTitle") || "Course Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Code: {record.code}
          </Text>
        </div>
      ),
    },
    {
      title: t("teacherDashboard.myClasses.category") || "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">{category || "other"}</Tag>
      ),
    },
    {
      title: t("teacherDashboard.myClasses.students") || "Students",
      dataIndex: "students",
      key: "students",
      render: (students) => (
        <Badge count={students?.length || 0} showZero>
          <TeamOutlined style={{ fontSize: 20 }} />
        </Badge>
      ),
    },
    {
      title: t("teacherDashboard.myClasses.status") || "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: t("teacherDashboard.myClasses.actions") || "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCourse(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDeleteCourse(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderCourseCard = (course) => {
    const categoryColor = categoryColors[course.category] || "#8c8c8c";
    const categoryIcon = categoryIcons[course.category] || <BookOutlined />;
    const enrollmentRate = course.maxStudents
      ? Math.round(((course.students?.length || 0) / course.maxStudents) * 100)
      : 0;

    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={course._id}>
        <Card
          hoverable
          style={{
            borderRadius: 12,
            height: "100%",
            border: `1px solid ${course.isActive ? categoryColor : "#e8e8e8"}`,
            borderTop: `4px solid ${course.isActive ? categoryColor : "#d9d9d9"}`,
          }}
        >
          <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
            {course.title}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Code: {course.code}
          </Text>
          <Space size={8} style={{ marginTop: 8, marginBottom: 16 }}>
            <Tag color={categoryColor}>
              {categoryIcon} {course.category}
            </Tag>
            <Tag color={course.isActive ? "green" : "default"}>
              {course.isActive ? "Active" : "Inactive"}
            </Tag>
          </Space>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                <TeamOutlined /> Students
              </Text>
              <Text strong>{course.students?.length || 0} / {course.maxStudents || 30}</Text>
            </div>
            <Progress percent={enrollmentRate} size="small" showInfo={false} />
          </div>
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewCourse(course)}
            >
              View
            </Button>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditCourse(course)}
            >
              Edit
            </Button>
          </Space>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <BookOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.myClasses") || "My Classes"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical" size="middle">
          <Space wrap>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filter by category"
              allowClear
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
            >
              <Option value="language">Language</Option>
              <Option value="business">Business</Option>
              <Option value="technology">Technology</Option>
              <Option value="arts">Arts</Option>
              <Option value="science">Science</Option>
              <Option value="other">Other</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCourse(null);
                courseForm.resetFields();
                setCourseModalVisible(true);
              }}
            >
              Create Course
            </Button>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value="grid">Grid</Radio.Button>
              <Radio.Button value="table">Table</Radio.Button>
            </Radio.Group>
          </Space>
        </Space>

        {viewMode === "grid" ? (
          <Row gutter={[16, 16]}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(renderCourseCard)
            ) : (
              <Col span={24}>
                <Empty description="No courses found" />
              </Col>
            )}
          </Row>
        ) : (
          <Table
            columns={courseColumns}
            dataSource={filteredCourses}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Create/Edit Course Modal */}
      <Modal
        title={editingCourse ? "Edit Course" : "Create Course"}
        open={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setEditingCourse(null);
          courseForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={handleCreateCourse}
        >
          <Form.Item
            name="title"
            label="Course Title"
            rules={[{ required: true, message: "Please enter course title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Course Code"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="language">Language</Option>
                  <Option value="business">Business</Option>
                  <Option value="technology">Technology</Option>
                  <Option value="arts">Arts</Option>
                  <Option value="science">Science</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration (weeks)"
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Max Students"
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <Radio.Group>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setCourseModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Course Modal */}
      <Modal
        title="Course Details"
        open={courseViewModalVisible}
        onCancel={() => setCourseViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCourseViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedCourse && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Title">{selectedCourse.title}</Descriptions.Item>
            <Descriptions.Item label="Code">{selectedCourse.code}</Descriptions.Item>
            <Descriptions.Item label="Category">{selectedCourse.category}</Descriptions.Item>
            <Descriptions.Item label="Level">{selectedCourse.level}</Descriptions.Item>
            <Descriptions.Item label="Students">
              {selectedCourse.students?.length || 0} / {selectedCourse.maxStudents || 30}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedCourse.isActive ? "green" : "default"}>
                {selectedCourse.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedCourse.description || "No description"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TeacherMyClasses;

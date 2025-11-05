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
  DatePicker,
  TimePicker,
  Descriptions,
  Empty,
} from "antd";
import {
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import zoomApiService from "../../services/zoomApiService";
import { courseAPI } from "../../utils/apiClient";
import ZoomMeeting from "../ZoomMeeting";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherLiveClasses = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [zoomForm] = Form.useForm();

  const [zoomClasses, setZoomClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [embeddedZoomVisible, setEmbeddedZoomVisible] = useState(false);
  const [currentLiveClass, setCurrentLiveClass] = useState(null);
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

  const fetchZoomMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await zoomApiService.getMeetings();
      if (response.success) {
        const allMeetings = response.meetings || [];
        const teacherMeetings = allMeetings.filter(
          (meeting) => meeting.teacher === currentUser?.id || meeting.teacherId === currentUser?.id
        );
        setZoomClasses(teacherMeetings);
      }
    } catch (error) {
      console.error("Error fetching Zoom meetings:", error);
      message.error("Failed to fetch Zoom meetings");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
    fetchZoomMeetings();
  }, [fetchCourses, fetchZoomMeetings]);

  const handleCreateMeeting = async (values) => {
    try {
      const meetingData = {
        topic: values.topic,
        course: values.courseId,
        courseId: values.courseId,
        startTime: values.dateTime ? values.dateTime.format() : new Date().toISOString(),
        duration: values.duration || 60,
        description: values.description || "",
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
      };

      if (editingClass) {
        await zoomApiService.updateMeeting(editingClass.id, meetingData);
        message.success("Meeting updated successfully");
      } else {
        await zoomApiService.createMeeting(meetingData);
        message.success("Meeting created successfully");
      }

      setZoomModalVisible(false);
      zoomForm.resetFields();
      setEditingClass(null);
      fetchZoomMeetings();
    } catch (error) {
      message.error(error.message || "Error saving meeting");
    }
  };

  const handleEditClass = (zoomClass) => {
    setEditingClass(zoomClass);
    zoomForm.setFieldsValue({
      topic: zoomClass.topic,
      courseId: zoomClass.course?._id || zoomClass.course || zoomClass.courseId,
      dateTime: zoomClass.startTime ? moment(zoomClass.startTime) : null,
      duration: zoomClass.duration || 60,
      description: zoomClass.description || "",
    });
    setZoomModalVisible(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await zoomApiService.deleteMeeting(meetingId);
      message.success("Meeting deleted successfully");
      fetchZoomMeetings();
    } catch (err) {
      message.error("Failed to delete meeting");
    }
  };

  const handleStartMeeting = (zoomClass) => {
    setCurrentLiveClass(zoomClass);
    setEmbeddedZoomVisible(true);
  };

  const filteredClasses = zoomClasses.filter((zoomClass) => {
    const matchesSearch =
      !searchTerm ||
      zoomClass.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zoomClass.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const zoomColumns = [
    {
      title: "Meeting Topic",
      dataIndex: "topic",
      key: "topic",
      render: (topic, record) => (
        <div>
          <Text strong>{topic}</Text>
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
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => startTime ? moment(startTime).format("MMM DD, YYYY HH:mm") : "N/A",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration || 60} minutes`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Start Meeting">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => handleStartMeeting(record)}
            >
              Start
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditClass(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this meeting?"
            onConfirm={() => handleDeleteMeeting(record.id || record._id)}
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
            <VideoCameraOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.liveClasses") || "Live Classes"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search meetings..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingClass(null);
              zoomForm.resetFields();
              setZoomModalVisible(true);
            }}
          >
            Create Meeting
          </Button>
        </Space>

        <Table
          columns={zoomColumns}
          dataSource={filteredClasses}
          rowKey={(record) => record.id || record._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Zoom Meeting Modal */}
      <Modal
        title={editingClass ? "Edit Meeting" : "Create Meeting"}
        open={zoomModalVisible}
        onCancel={() => {
          setZoomModalVisible(false);
          setEditingClass(null);
          zoomForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={zoomForm} layout="vertical" onFinish={handleCreateMeeting}>
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
            name="topic"
            label="Meeting Topic"
            rules={[{ required: true, message: "Please enter meeting topic" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="Start Date & Time"
                rules={[{ required: true, message: "Please select start time" }]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                initialValue={60}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingClass ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setZoomModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Zoom Meeting Modal */}
      {embeddedZoomVisible && currentLiveClass && (
        <Modal
          title="Live Class"
          open={embeddedZoomVisible}
          onCancel={() => {
            setEmbeddedZoomVisible(false);
            setCurrentLiveClass(null);
          }}
          footer={null}
          width={1000}
          style={{ top: 20 }}
        >
          <ZoomMeeting meeting={currentLiveClass} />
        </Modal>
      )}
    </div>
  );
};

export default TeacherLiveClasses;

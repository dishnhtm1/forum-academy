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
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Avatar,
  message,
  Modal,
  Descriptions,
  Empty,
  Tabs,
  Form,
} from "antd";
import {
  TeamOutlined,
  EyeOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { userAPI, courseAPI, messageAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherStudentManagement = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [messageForm] = Form.useForm();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewStudentModalVisible, setViewStudentModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
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
        if (teacherCourses.length > 0 && !selectedCourse) {
          setSelectedCourse(teacherCourses[0]._id || teacherCourses[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser, selectedCourse]);

  const fetchStudents = useCallback(async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      const response = await courseAPI.getById(selectedCourse);
      if (response.success) {
        const course = response.course || response;
        const studentIds = course.students || [];
        const studentsData = await Promise.all(
          studentIds.map(async (studentId) => {
            try {
              const studentRes = await userAPI.getById(studentId);
              return studentRes.user || studentRes;
            } catch {
              return { id: studentId, name: "Unknown Student" };
            }
          })
        );
        setStudents(studentsData.filter(s => s));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse, fetchStudents]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewStudentModalVisible(true);
  };

  const handleSendMessage = async (values) => {
    try {
      await messageAPI.send({
        recipientId: selectedStudent.id || selectedStudent._id,
        recipientType: "student",
        subject: values.subject,
        content: values.content,
      });
      message.success("Message sent successfully");
      setMessageModalVisible(false);
      messageForm.resetFields();
      setSelectedStudent(null);
    } catch (error) {
      message.error("Failed to send message");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchTerm ||
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const studentColumns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.name || `${record.firstName} ${record.lastName}`}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status || "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewStudent(record)}
            />
          </Tooltip>
          <Tooltip title="Send Message">
            <Button
              icon={<MessageOutlined />}
              size="small"
              onClick={() => {
                setSelectedStudent(record);
                setMessageModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.studentManagement") || "Student Management"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Select
            placeholder="Select Course"
            value={selectedCourse}
            onChange={setSelectedCourse}
            style={{ width: 300 }}
          >
            {courses.map((course) => (
              <Option key={course._id || course.id} value={course._id || course.id}>
                {course.title} ({course.code})
              </Option>
            ))}
          </Select>
          <Input
            placeholder="Search students..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>

        {selectedCourse ? (
          <Table
            columns={studentColumns}
            dataSource={filteredStudents}
            rowKey={(record) => record.id || record._id}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="Please select a course to view students" />
        )}
      </Card>

      {/* View Student Modal */}
      <Modal
        title="Student Details"
        open={viewStudentModalVisible}
        onCancel={() => {
          setViewStudentModalVisible(false);
          setSelectedStudent(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewStudentModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedStudent && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {selectedStudent.name || `${selectedStudent.firstName} ${selectedStudent.lastName}`}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedStudent.phone || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedStudent.status === "active" ? "green" : "default"}>
                {selectedStudent.status || "Active"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Send Message Modal */}
      <Modal
        title="Send Message"
        open={messageModalVisible}
        onCancel={() => {
          setMessageModalVisible(false);
          setSelectedStudent(null);
          messageForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={messageForm} layout="vertical" onFinish={handleSendMessage}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter subject" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Message"
            rules={[{ required: true, message: "Please enter message" }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
              <Button onClick={() => setMessageModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherStudentManagement;

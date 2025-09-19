import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Upload,
  InputNumber, Switch, Progress, Descriptions, Rate, Badge
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined,
  UploadOutlined, DownloadOutlined, StarOutlined
} from '@ant-design/icons';
import moment from 'moment';

// Import API client
import { courseAPI, homeworkAPI, homeworkSubmissionAPI } from '../../utils/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const HomeworkManagement = ({ currentUser }) => {
  const [homework, setHomework] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [submissionsModalVisible, setSubmissionsModalVisible] = useState(false);
  const [gradingModalVisible, setGradingModalVisible] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [form] = Form.useForm();
  const [gradingForm] = Form.useForm();

  useEffect(() => {
    console.log('🏠 HomeworkManagement component mounted, fetching data...');
    fetchHomework();
    fetchCourses();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      console.log('📚 Fetching homework assignments...');
      const data = await homeworkAPI.getAll();
      console.log('✅ Homework fetched successfully:', data);
      setHomework(data);
    } catch (error) {
      console.error('❌ Error fetching homework:', error);
      message.error('Failed to fetch homework assignments');
      setHomework([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      console.log('🔄 Fetching courses for homework management...');
      const data = await courseAPI.getAll();
      console.log('✅ Courses fetched successfully:', data);
      setCourses(data);
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      message.error('Failed to fetch courses');
      setCourses([]); // Set empty array as fallback
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchSubmissions = async (homeworkId) => {
    try {
      console.log('📄 Fetching submissions for homework:', homeworkId);
      const data = await homeworkSubmissionAPI.getByHomework(homeworkId);
      console.log('✅ Submissions fetched successfully:', data);
      setSubmissions(data);
    } catch (error) {
      console.error('❌ Error fetching submissions:', error);
      message.error('Failed to fetch submissions');
      setSubmissions([]); // Set empty array as fallback
    }
  };

  const handleCreateHomework = async (values) => {
    try {
      console.log('📝 Creating new homework assignment...');
      console.log('Form values:', values);

      const homeworkData = {
        ...values,
        dueDate: values.dueDate.format(),
        assignedDate: values.assignedDate ? values.assignedDate.format() : new Date(),
        assignedBy: currentUser.id
      };

      console.log('📋 Homework data to send:', homeworkData);

      let result;
      if (editingHomework) {
        result = await homeworkAPI.update(editingHomework._id, homeworkData);
        message.success('Homework updated successfully');
      } else {
        result = await homeworkAPI.create(homeworkData);
        message.success('Homework created successfully');
      }

      console.log('✅ Homework saved successfully:', result);
      setHomeworkModalVisible(false);
      form.resetFields();
      setEditingHomework(null);
      fetchHomework();
    } catch (error) {
      console.error('❌ Error saving homework:', error);
      message.error(error.message || 'Failed to save homework');
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      console.log('🗑️ Deleting homework:', homeworkId);
      await homeworkAPI.delete(homeworkId);
      message.success('Homework deleted successfully');
      fetchHomework();
    } catch (error) {
      console.error('❌ Error deleting homework:', error);
      message.error(error.message || 'Failed to delete homework');
    }
  };

  const handleGradeSubmission = async (values) => {
    try {
      console.log('📊 Grading submission:', selectedSubmission._id);
      const gradeData = {
        ...values,
        gradedBy: currentUser.id,
        gradedAt: new Date(),
        status: 'graded'
      };

      await homeworkSubmissionAPI.grade(selectedSubmission._id, gradeData);
      message.success('Submission graded successfully');
      setGradingModalVisible(false);
      gradingForm.resetFields();
      setSelectedSubmission(null);
      fetchSubmissions(selectedHomework._id);
    } catch (error) {
      console.error('❌ Error grading submission:', error);
      message.error(error.message || 'Failed to grade submission');
    }
  };

  const getStatusColor = (homework) => {
    const now = moment();
    const dueDate = moment(homework.dueDate);
    
    if (now.isAfter(dueDate)) {
      return 'red';
    } else if (now.add(1, 'day').isAfter(dueDate)) {
      return 'orange';
    }
    return 'green';
  };

  const getStatusText = (homework) => {
    const now = moment();
    const dueDate = moment(homework.dueDate);
    
    if (now.isAfter(dueDate)) {
      return 'Overdue';
    } else if (now.add(1, 'day').isAfter(dueDate)) {
      return 'Due Soon';
    }
    return 'Active';
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Course',
      dataIndex: ['course', 'title'],
      key: 'course',
      render: (courseTitle, record) => (
        <div>
          <Text>{courseTitle || 'No Course'}</Text>
          <br />
          <Tag color="blue" size="small">{record.course?.code || 'N/A'}</Tag>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={
          category === 'assignment' ? 'blue' :
          category === 'project' ? 'purple' :
          category === 'essay' ? 'green' : 'default'
        }>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Points',
      dataIndex: 'maxPoints',
      key: 'maxPoints',
      render: (points) => <Badge count={points} style={{ backgroundColor: '#52c41a' }} />
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <div>
          <Text>{moment(date).format('MMM DD, YYYY')}</Text>
          <br />
          <Text type="secondary">{moment(date).format('HH:mm')}</Text>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record)}>
          {getStatusText(record)}
        </Tag>
      )
    },
    {
      title: 'Submissions',
      key: 'submissions',
      render: (_, record) => (
        <Button 
          size="small"
          onClick={() => {
            setSelectedHomework(record);
            fetchSubmissions(record._id);
            setSubmissionsModalVisible(true);
          }}
        >
          View Submissions
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit Homework">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => {
                setEditingHomework(record);
                form.setFieldsValue({
                  ...record,
                  dueDate: moment(record.dueDate),
                  assignedDate: moment(record.assignedDate)
                });
                setHomeworkModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this homework?"
            onConfirm={() => handleDeleteHomework(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Homework">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const submissionColumns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <Text>{record.student.firstName} {record.student.lastName}</Text>
          <br />
          <Text type="secondary">{record.student.email}</Text>
        </div>
      )
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date, record) => (
        <div>
          <Text>{moment(date).format('MMM DD, YYYY HH:mm')}</Text>
          {record.isLate && (
            <>
              <br />
              <Tag color="red" size="small">Late ({record.daysLate} days)</Tag>
            </>
          )}
        </div>
      )
    },
    {
      title: 'Files',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments) => (
        <div>
          {attachments?.map((file, index) => (
            <div key={index}>
              <Button 
                type="link" 
                size="small" 
                icon={<DownloadOutlined />}
                onClick={() => homeworkSubmissionAPI.download(file._id)}
              >
                {file.fileName}
              </Button>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Grade',
      key: 'grade',
      render: (_, record) => (
        <div>
          {record.grade !== undefined ? (
            <div>
              <Text strong>{record.grade}/{selectedHomework?.maxPoints}</Text>
              <br />
              <Progress 
                percent={record.percentage} 
                size="small"
                status={record.percentage >= 70 ? 'success' : 'exception'}
              />
            </div>
          ) : (
            <Text type="secondary">Not graded</Text>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'submitted' ? 'blue' :
          status === 'graded' ? 'green' :
          status === 'returned' ? 'orange' : 'default'
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            onClick={() => {
              setSelectedSubmission(record);
              gradingForm.setFieldsValue({
                grade: record.grade,
                feedback: record.feedback
              });
              setGradingModalVisible(true);
            }}
          >
            {record.grade !== undefined ? 'Update Grade' : 'Grade'}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Homework Management</Title>
          <Text type="secondary">
            {coursesLoading ? 'Loading courses...' : `${courses.length} courses available`}
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              loading={coursesLoading}
              onClick={fetchCourses}
              size="small"
            >
              Refresh Courses
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setHomeworkModalVisible(true)}
            >
              Create New Homework
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={homework}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
        />
      </Card>

      {/* Homework Creation/Edit Modal */}
      <Modal
        title={editingHomework ? 'Edit Homework' : 'Create New Homework'}
        open={homeworkModalVisible}
        onCancel={() => {
          setHomeworkModalVisible(false);
          form.resetFields();
          setEditingHomework(null);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateHomework}
          initialValues={{
            submissionType: 'file_upload',
            maxFileSize: 10,
            latePenalty: 5,
            lateSubmissionAllowed: true,
            isPublished: false
          }}
        >
          <Form.Item
            name="title"
            label="Homework Title"
            rules={[{ required: true, message: 'Please enter homework title' }]}
          >
            <Input placeholder="e.g. Chapter 3 Essay Assignment" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Detailed description of the assignment..." />
          </Form.Item>

          <Form.Item name="instructions" label="Instructions">
            <TextArea rows={3} placeholder="Specific instructions for students..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select 
                  placeholder={coursesLoading ? "Loading courses..." : "Select course"}
                  showSearch
                  loading={coursesLoading}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  notFoundContent={coursesLoading ? "Loading..." : courses.length === 0 ? "No courses available" : "No matching courses"}
                >
                  {courses.map(course => (
                    <Option key={course._id} value={course._id}>
                      {course.title} {course.code ? `(${course.code})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="assignment">Assignment</Option>
                  <Option value="project">Project</Option>
                  <Option value="essay">Essay</Option>
                  <Option value="presentation">Presentation</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="maxPoints"
                label="Max Points"
                rules={[{ required: true, message: 'Please enter max points' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assignedDate" label="Assigned Date">
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="submissionType" label="Submission Type">
                <Select placeholder="Select type">
                  <Option value="file_upload">File Upload</Option>
                  <Option value="text_entry">Text Entry</Option>
                  <Option value="both">Both</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxFileSize" label="Max File Size (MB)">
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="latePenalty" label="Late Penalty (% per day)">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lateSubmissionAllowed" valuePropName="checked" label="Allow Late Submissions">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isPublished" valuePropName="checked" label="Published">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Submissions Modal */}
      <Modal
        title={`Submissions: ${selectedHomework?.title}`}
        open={submissionsModalVisible}
        onCancel={() => setSubmissionsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setSubmissionsModalVisible(false)}>
            Close
          </Button>,
          <Button key="export" type="primary" icon={<DownloadOutlined />}>
            Export Grades
          </Button>
        ]}
      >
        <Table
          columns={submissionColumns}
          dataSource={submissions}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* Grading Modal */}
      <Modal
        title="Grade Submission"
        open={gradingModalVisible}
        onCancel={() => {
          setGradingModalVisible(false);
          gradingForm.resetFields();
          setSelectedSubmission(null);
        }}
        onOk={() => gradingForm.submit()}
        width={600}
      >
        {selectedSubmission && (
          <>
            <Descriptions column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Student">
                {selectedSubmission.student.firstName} {selectedSubmission.student.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {moment(selectedSubmission.submittedAt).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedSubmission.isLate ? 
                  <Tag color="red">Late ({selectedSubmission.daysLate} days)</Tag> : 
                  <Tag color="green">On Time</Tag>
                }
              </Descriptions.Item>
            </Descriptions>

            <Form
              form={gradingForm}
              layout="vertical"
              onFinish={handleGradeSubmission}
            >
              <Form.Item
                name="grade"
                label="Grade"
                rules={[{ required: true, message: 'Please enter a grade' }]}
              >
                <InputNumber 
                  min={0} 
                  max={selectedHomework?.maxPoints} 
                  style={{ width: '100%' }}
                  formatter={value => `${value}/${selectedHomework?.maxPoints}`}
                />
              </Form.Item>

              <Form.Item name="feedback" label="Feedback">
                <TextArea rows={4} placeholder="Provide feedback to the student..." />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HomeworkManagement;

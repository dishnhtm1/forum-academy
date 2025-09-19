import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Typography,
  Row, Col, DatePicker, InputNumber, message, Spin, Tabs, List, Avatar,
  Empty, Popconfirm, Switch, Tooltip, Badge, Progress, Statistic, Alert
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, 
  UserOutlined, BookOutlined, BellOutlined, SendOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, StarOutlined,
  SearchOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TeacherGrading = ({ currentUser }) => {
  console.log('👨‍🏫 TeacherGrading component rendering, currentUser:', currentUser);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [createProgressModalVisible, setCreateProgressModalVisible] = useState(false);
  const [editProgressModalVisible, setEditProgressModalVisible] = useState(false);
  const [createAnnouncementModalVisible, setCreateAnnouncementModalVisible] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [progressForm] = Form.useForm();
  const [editProgressForm] = Form.useForm();
  const [announcementForm] = Form.useForm();

  // Fetch students
  const fetchStudents = async () => {
    try {
      console.log('👥 Fetching students...');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No authentication token found');
        message.error('Authentication token not found');
        return;
      }

      // Try the dedicated students endpoint first, fallback to general users endpoint
      let response = await fetch('http://localhost:5000/api/users/students/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fallback to general users endpoint if dedicated endpoint fails
      if (!response.ok) {
        console.log('🔄 Fallback to general users endpoint...');
        response = await fetch('http://localhost:5000/api/users?role=student', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Students fetched successfully:', result);
        
        // Handle both response formats
        const studentsData = result.students || result.users || result || [];
        
        // Filter and process students
        const processedStudents = studentsData
          .filter(user => user.role === 'student' && user.isApproved !== false)
          .map(student => ({
            ...student,
            // Ensure we have names, fallback to email if needed
            firstName: student.firstName || student.name?.split(' ')[0] || 'Unknown',
            lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || 'Student',
            studentId: student.studentId || student.id || student._id?.slice(-6) // Use last 6 chars of ID if no studentId
          }));
        
        console.log('👥 Processed students:', processedStudents);
        setStudents(processedStudents);
        
        if (processedStudents.length === 0) {
          console.warn('⚠️ No approved students found');
          message.info('No approved students found');
        } else {
          console.log(`✅ Loaded ${processedStudents.length} students`);
        }
      } else {
        console.error('❌ Failed to fetch students:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        message.error(`Failed to fetch students: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      message.error('Error fetching students: ' + error.message);
    }
  };

  // Fetch progress records
  const fetchProgressRecords = async () => {
    try {
      console.log('📊 Fetching progress records...');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Progress records fetched successfully:', result);
        setProgressRecords(result.progress || []);
      } else {
        console.error('❌ Failed to fetch progress records:', response.status);
        message.error('Failed to fetch progress records');
      }
    } catch (error) {
      console.error('❌ Error fetching progress records:', error);
      message.error('Error fetching progress records');
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      console.log('📢 Fetching announcements...');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Announcements fetched successfully:', result);
        setAnnouncements(result.announcements || []);
      } else {
        console.error('❌ Failed to fetch announcements:', response.status);
        message.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('❌ Error fetching announcements:', error);
      message.error('Error fetching announcements');
    }
  };

  // Create progress record
  const createProgressRecord = async (values) => {
    try {
      console.log('📝 Creating progress record...', values);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/progress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          submissionDate: values.submissionDate ? values.submissionDate.toISOString() : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Progress record created successfully:', result);
        message.success('Progress record created successfully');
        setCreateProgressModalVisible(false);
        progressForm.resetFields();
        fetchProgressRecords();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to create progress record:', response.status);
        message.error(errorData.message || 'Failed to create progress record');
      }
    } catch (error) {
      console.error('❌ Error creating progress record:', error);
      message.error('Error creating progress record');
    }
  };

  // Update progress record
  const updateProgressRecord = async (values) => {
    try {
      console.log('✏️ Updating progress record...', values);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/progress/${selectedProgress._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          submissionDate: values.submissionDate ? values.submissionDate.toISOString() : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Progress record updated successfully:', result);
        message.success('Progress record updated successfully');
        setEditProgressModalVisible(false);
        editProgressForm.resetFields();
        setSelectedProgress(null);
        fetchProgressRecords();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to update progress record:', response.status);
        message.error(errorData.message || 'Failed to update progress record');
      }
    } catch (error) {
      console.error('❌ Error updating progress record:', error);
      message.error('Error updating progress record');
    }
  };

  // Delete progress record
  const deleteProgressRecord = async (progressId) => {
    try {
      console.log('🗑️ Deleting progress record...', progressId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/progress/${progressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Progress record deleted successfully');
        message.success('Progress record deleted successfully');
        fetchProgressRecords();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to delete progress record:', response.status);
        message.error(errorData.message || 'Failed to delete progress record');
      }
    } catch (error) {
      console.error('❌ Error deleting progress record:', error);
      message.error('Error deleting progress record');
    }
  };

  // Create announcement
  const createAnnouncement = async (values) => {
    try {
      console.log('📢 Creating announcement...', values);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          publishDate: values.publishDate ? values.publishDate.toISOString() : undefined,
          expiryDate: values.expiryDate ? values.expiryDate.toISOString() : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Announcement created successfully:', result);
        message.success('Announcement created successfully');
        setCreateAnnouncementModalVisible(false);
        announcementForm.resetFields();
        fetchAnnouncements();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to create announcement:', response.status);
        message.error(errorData.message || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('❌ Error creating announcement:', error);
      message.error('Error creating announcement');
    }
  };

  // Open edit modal
  const openEditModal = (progress) => {
    setSelectedProgress(progress);
    editProgressForm.setFieldsValue({
      ...progress,
      submissionDate: progress.submissionDate ? moment(progress.submissionDate) : undefined
    });
    setEditProgressModalVisible(true);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStudents(),
        fetchProgressRecords(),
        fetchAnnouncements()
      ]);
      setLoading(false);
    };

    if (currentUser?.role === 'teacher') {
      loadData();
    }
  }, [currentUser]);

  // Progress table columns
  const progressColumns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>{student?.firstName} {student?.lastName}</span>
        </Space>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Tag color="blue">{subject}</Tag>
    },
    {
      title: 'Assignment',
      dataIndex: 'assignment',
      key: 'assignment',
      render: (assignment) => <Text strong>{assignment}</Text>
    },
    {
      title: 'Type',
      dataIndex: 'assignmentType',
      key: 'assignmentType',
      render: (type) => {
        const colors = {
          homework: 'green',
          quiz: 'orange',
          exam: 'red',
          project: 'purple',
          participation: 'cyan'
        };
        return <Tag color={colors[type] || 'default'}>{type?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => (
        <Space>
          <Text strong>{score}/{record.maxScore}</Text>
          <Text type="secondary">({record.percentage}%)</Text>
        </Space>
      )
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => {
        const colors = {
          'A+': '#52c41a', 'A': '#52c41a', 'A-': '#52c41a',
          'B+': '#1890ff', 'B': '#1890ff', 'B-': '#1890ff',
          'C+': '#fa8c16', 'C': '#fa8c16', 'C-': '#fa8c16',
          'D+': '#f5222d', 'D': '#f5222d', 'F': '#f5222d'
        };
        return <Tag color={colors[grade]} style={{ fontWeight: 'bold' }}>{grade}</Tag>;
      }
    },
    {
      title: 'Date Graded',
      dataIndex: 'gradedDate',
      key: 'gradedDate',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this progress record?"
            onConfirm={() => deleteProgressRecord(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading grading interface...</Text>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'teacher') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text type="secondary">This page is only available for teachers.</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header with Menu Toggle Button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Button
          type="text"
          icon={<MenuUnfoldOutlined />}
          style={{ 
            fontSize: '16px', 
            marginRight: '16px',
            height: '40px',
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => {
            // Add your menu toggle logic here
            console.log('Menu toggle clicked');
          }}
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>📚 Teacher Dashboard</Title>
          <Text type="secondary">Manage student grades, track progress, and create announcements</Text>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Grades"
              value={progressRecords.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Students Graded"
              value={new Set(progressRecords.map(record => record.student?._id)).size}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Announcements"
              value={announcements.filter(ann => ann.author?._id === currentUser.id).length}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Grade"
              value={progressRecords.length > 0 
                ? Math.round(progressRecords.reduce((sum, record) => sum + record.percentage, 0) / progressRecords.length)
                : 0}
              suffix="%"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different management sections */}
      <Tabs
        defaultActiveKey="grading"
        items={[
          {
            key: 'grading',
            label: '📊 Student Grading',
            children: (
              <Card
                title="Progress Records"
                extra={
                  <Space>
                    <Input
                      placeholder="Search grades..."
                      prefix={<SearchOutlined />}
                      style={{ width: 200 }}
                    />
                    <Select
                      placeholder="Filter by subject"
                      style={{ width: 150 }}
                      allowClear
                    >
                      {[...new Set(progressRecords.map(record => record.subject))].map(subject => (
                        <Option key={subject} value={subject}>{subject}</Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setCreateProgressModalVisible(true)}
                    >
                      Add Grade
                    </Button>
                  </Space>
                }
              >
                {progressRecords.length > 0 ? (
                  <Table
                    columns={progressColumns}
                    dataSource={progressRecords}
                    rowKey="_id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                  />
                ) : (
                  <Empty description="No progress records found" />
                )}
              </Card>
            )
          },
          {
            key: 'announcements',
            label: '📢 Announcements',
            children: (
              <Card
                title="My Announcements"
                extra={
                  <Space>
                    <Select
                      placeholder="Filter by priority"
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Option value="low">Low</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="high">High</Option>
                      <Option value="urgent">Urgent</Option>
                    </Select>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setCreateAnnouncementModalVisible(true)}
                    >
                      Create Announcement
                    </Button>
                  </Space>
                }
              >
                {announcements.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={announcements.filter(ann => ann.author?._id === currentUser.id)}
                    renderItem={(announcement) => (
                      <List.Item
                        key={announcement._id}
                        style={{
                          padding: '16px',
                          marginBottom: '8px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '6px'
                        }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<BellOutlined />} />}
                          title={
                            <Space>
                              <Text strong>{announcement.title}</Text>
                              <Tag color={announcement.priority === 'urgent' ? 'red' : 'blue'}>
                                {announcement.priority?.toUpperCase()}
                              </Tag>
                              {announcement.isSticky && <Tag color="gold">PINNED</Tag>}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={4}>
                              <Text type="secondary">
                                Target: {announcement.targetAudience}
                              </Text>
                              <Text type="secondary">
                                Published: {moment(announcement.publishDate).format('MMM DD, YYYY')}
                              </Text>
                              <Text type="secondary">
                                Reads: {announcement.readCount || 0}
                              </Text>
                            </Space>
                          }
                        />
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {announcement.content}
                        </Paragraph>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No announcements created yet" />
                )}
              </Card>
            )
          }
        ]}
      />

      {/* Create Progress Modal */}
      <Modal
        title="Add Student Grade"
        visible={createProgressModalVisible}
        onCancel={() => {
          setCreateProgressModalVisible(false);
          progressForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <Card style={{ marginBottom: 16, backgroundColor: '#f6f6f6' }}>
            <Text style={{ fontSize: 12 }}>
              <strong>Debug Info:</strong> {students.length} students loaded 
              {students.length > 0 && (
                <>
                  <br />
                  Students: {students.map(s => `${s.firstName} ${s.lastName} (${s.email})`).join(', ')}
                </>
              )}
            </Text>
          </Card>
        )}
        
        {students.length === 0 && (
          <Alert
            message="No Students Found"
            description={`Currently ${students.length} students are loaded. Make sure students are registered and approved in the system.`}
            type="warning"
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form
          form={progressForm}
          layout="vertical"
          onFinish={createProgressRecord}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    Student
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={fetchStudents}
                      loading={loading}
                      title="Refresh student list"
                    >
                      🔄
                    </Button>
                  </Space>
                }
                name="student"
                rules={[{ required: true, message: 'Please select a student' }]}
              >
                <Select 
                  placeholder={students.length > 0 ? "Select student" : "No students available - click refresh"}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  notFoundContent={students.length === 0 ? "No students found" : "No matching students"}
                >
                  {students.map(student => (
                    <Option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                      {student.studentId && ` (ID: ${student.studentId})`}
                      {student.email && ` - ${student.email}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter subject' }]}
              >
                <Input placeholder="e.g., Mathematics, English" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Assignment Name"
            name="assignment"
            rules={[{ required: true, message: 'Please enter assignment name' }]}
          >
            <Input placeholder="e.g., Chapter 5 Quiz, Final Exam" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Assignment Type"
                name="assignmentType"
                rules={[{ required: true, message: 'Please select assignment type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="homework">Homework</Option>
                  <Option value="quiz">Quiz</Option>
                  <Option value="exam">Exam</Option>
                  <Option value="project">Project</Option>
                  <Option value="participation">Participation</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Grade"
                name="grade"
                rules={[{ required: true, message: 'Please select grade' }]}
              >
                <Select placeholder="Select grade">
                  <Option value="A+">A+</Option>
                  <Option value="A">A</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B">B</Option>
                  <Option value="B-">B-</Option>
                  <Option value="C+">C+</Option>
                  <Option value="C">C</Option>
                  <Option value="C-">C-</Option>
                  <Option value="D+">D+</Option>
                  <Option value="D">D</Option>
                  <Option value="F">F</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Score"
                name="score"
                rules={[{ required: true, message: 'Please enter score' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Score"
                name="maxScore"
                rules={[{ required: true, message: 'Please enter max score' }]}
              >
                <InputNumber min={1} max={100} defaultValue={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={2} placeholder="Assignment description (optional)" />
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
          >
            <TextArea rows={3} placeholder="Feedback for student (optional)" />
          </Form.Item>

          <Form.Item
            label="Submission Date"
            name="submissionDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                setCreateProgressModalVisible(false);
                progressForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Grade
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Edit Progress Modal */}
      <Modal
        title="Edit Student Grade"
        visible={editProgressModalVisible}
        onCancel={() => {
          setEditProgressModalVisible(false);
          editProgressForm.resetFields();
          setSelectedProgress(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editProgressForm}
          layout="vertical"
          onFinish={updateProgressRecord}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter subject' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Assignment Type"
                name="assignmentType"
                rules={[{ required: true, message: 'Please select assignment type' }]}
              >
                <Select>
                  <Option value="homework">Homework</Option>
                  <Option value="quiz">Quiz</Option>
                  <Option value="exam">Exam</Option>
                  <Option value="project">Project</Option>
                  <Option value="participation">Participation</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Assignment Name"
            name="assignment"
            rules={[{ required: true, message: 'Please enter assignment name' }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Score"
                name="score"
                rules={[{ required: true, message: 'Please enter score' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Max Score"
                name="maxScore"
                rules={[{ required: true, message: 'Please enter max score' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Grade"
                name="grade"
                rules={[{ required: true, message: 'Please select grade' }]}
              >
                <Select>
                  <Option value="A+">A+</Option>
                  <Option value="A">A</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B">B</Option>
                  <Option value="B-">B-</Option>
                  <Option value="C+">C+</Option>
                  <Option value="C">C</Option>
                  <Option value="C-">C-</Option>
                  <Option value="D+">D+</Option>
                  <Option value="D">D</Option>
                  <Option value="F">F</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Comments"
            name="comments"
          >
            <TextArea rows={3} placeholder="Feedback for student" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                setEditProgressModalVisible(false);
                editProgressForm.resetFields();
                setSelectedProgress(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Grade
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Create Announcement Modal */}
      <Modal
        title="Create Announcement"
        visible={createAnnouncementModalVisible}
        onCancel={() => {
          setCreateAnnouncementModalVisible(false);
          announcementForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={announcementForm}
          layout="vertical"
          onFinish={createAnnouncement}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter announcement title' }]}
          >
            <Input placeholder="Announcement title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter announcement content' }]}
          >
            <TextArea rows={5} placeholder="Announcement content" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Target Audience"
                name="targetAudience"
                rules={[{ required: true, message: 'Please select target audience' }]}
              >
                <Select placeholder="Select audience">
                  <Option value="all">Everyone</Option>
                  <Option value="students">All Students</Option>
                  <Option value="teachers">All Teachers</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Priority"
                name="priority"
              >
                <Select placeholder="Select priority" defaultValue="medium">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Type"
                name="type"
              >
                <Select placeholder="Select type" defaultValue="general">
                  <Option value="general">General</Option>
                  <Option value="assignment">Assignment</Option>
                  <Option value="exam">Exam</Option>
                  <Option value="event">Event</Option>
                  <Option value="reminder">Reminder</Option>
                  <Option value="grade_update">Grade Update</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subject"
                name="subject"
              >
                <Input placeholder="Related subject (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Publish Date"
                name="publishDate"
              >
                <DatePicker style={{ width: '100%' }} defaultValue={moment()} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isSticky"
            valuePropName="checked"
          >
            <Switch /> Pin this announcement (sticky)
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                setCreateAnnouncementModalVisible(false);
                announcementForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Create Announcement
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherGrading;
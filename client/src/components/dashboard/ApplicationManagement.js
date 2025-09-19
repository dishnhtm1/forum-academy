import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Typography,
  Row, Col, Statistic, Badge, Tooltip, message, Popconfirm, Drawer,
  Descriptions, Timeline, Divider, Alert, Spin, Tabs
} from 'antd';
import {
  EyeOutlined, CheckOutlined, CloseOutlined, MessageOutlined,
  UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined,
  FileTextOutlined, SearchOutlined, FilterOutlined, DownloadOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SendOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ApplicationManagement = ({ currentUser }) => {
  console.log('📋 ApplicationManagement component rendering, currentUser:', currentUser);

  // States
  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyType, setReplyType] = useState(''); // 'application' or 'contact'
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyForm] = Form.useForm();
  const [createUserForm] = Form.useForm();
  const [editUserForm] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  // Fetch applications
  const fetchApplications = async () => {
    try {
      console.log('🔄 Fetching applications...');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Applications fetched successfully:', data);
        
        // Handle different response formats
        let applicationsArray = [];
        if (data.success && data.applications) {
          applicationsArray = data.applications;
        } else if (data.success && data.contacts) {
          applicationsArray = data.contacts; // For backward compatibility
        } else if (Array.isArray(data)) {
          applicationsArray = data;
        }
        
        setApplications(applicationsArray);
        
        // Calculate stats
        const total = applicationsArray.length;
        const pending = applicationsArray.filter(app => app.status === 'pending').length;
        const approved = applicationsArray.filter(app => app.status === 'approved').length;
        const rejected = applicationsArray.filter(app => app.status === 'rejected').length;
        
        setStats(prev => ({
          ...prev,
          totalApplications: total,
          pendingApplications: pending,
          approvedApplications: approved,
          rejectedApplications: rejected
        }));
      } else {
        console.error('❌ Failed to fetch applications:', response.status);
        setApplications([]);
        message.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      setApplications([]);
      message.error('Error fetching applications');
    }
  };

  // Fetch contact messages
  const fetchContactMessages = async () => {
    try {
      console.log('🔄 Fetching contact messages...');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Contact messages fetched successfully:', data);
        
        // Handle different response formats
        let messagesArray = [];
        if (data.success && data.contacts) {
          messagesArray = data.contacts;
        } else if (Array.isArray(data)) {
          messagesArray = data;
        }
        
        setContactMessages(messagesArray);
        
        // Calculate message stats
        const total = messagesArray.length;
        const unread = messagesArray.filter(msg => msg.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalMessages: total,
          unreadMessages: unread
        }));
      } else {
        console.error('❌ Failed to fetch contact messages:', response.status);
        setContactMessages([]);
        message.error('Failed to fetch contact messages');
      }
    } catch (error) {
      console.error('❌ Error fetching contact messages:', error);
      setContactMessages([]);
      message.error('Error fetching contact messages');
      message.error('Error fetching contact messages');
    }
  };

  // Fetch users for management
  const fetchUsers = async () => {
    try {
      console.log('👥 Fetching users...');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Users fetched successfully:', result);
        setUsers(result.users || []);
        
        // Update stats
        const total = result.users?.length || 0;
        const pending = result.users?.filter(user => !user.isApproved).length || 0;
        const approved = result.users?.filter(user => user.isApproved).length || 0;
        
        setStats(prev => ({
          ...prev,
          totalUsers: total,
          pendingUsers: pending,
          approvedUsers: approved
        }));
      } else {
        console.error('❌ Failed to fetch users:', response.status);
        setUsers([]);
        message.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
      message.error('Error fetching users');
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      console.log('🔄 Updating application status:', applicationId, status);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        console.log('✅ Application status updated successfully');
        message.success(`Application ${status} successfully!`);
        fetchApplications(); // Refresh the list
        setApplicationModalVisible(false);
      } else {
        console.error('❌ Failed to update application status:', response.status);
        message.error('Failed to update application status');
      }
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      message.error('Error updating application status');
    }
  };

  // Update contact message status
  const updateContactStatus = async (messageId, newStatus) => {
    try {
      console.log('🔄 Updating contact status:', messageId, newStatus);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        console.log('✅ Contact status updated successfully');
        fetchContactMessages(); // Refresh the list
        message.success(`Message marked as ${newStatus}`);
      } else {
        console.error('❌ Failed to update contact status:', response.status);
        message.error('Failed to update contact status');
      }
    } catch (error) {
      console.error('❌ Error updating contact status:', error);
      message.error('Error updating contact status');
    }
  };

  // Reply functions
  const openReplyModal = (type, target) => {
    setReplyType(type);
    setReplyTarget(target);
    setReplyModalVisible(true);
    replyForm.setFieldsValue({
      recipientEmail: target.email,
      recipientName: target.name || target.fullName,
      replySubject: type === 'contact' 
        ? `Re: ${target.subject}` 
        : `Application Update - ${target.fullName}`
    });
  };

  const handleReply = async (values) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const endpoint = replyType === 'contact' 
        ? `${process.env.REACT_APP_API_URL}/api/contact/${replyTarget._id}/reply`
        : `${process.env.REACT_APP_API_URL}/api/applications/${replyTarget._id}/reply`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          replySubject: values.replySubject,
          replyMessage: values.replyMessage,
          sendStatusEmail: values.sendStatusEmail || false
        })
      });

      if (response.ok) {
        message.success('Reply sent successfully!');
        setReplyModalVisible(false);
        replyForm.resetFields();
        
        // Refresh data
        if (replyType === 'contact') {
          fetchContactMessages();
        } else {
          fetchApplications();
        }
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      message.error('Error sending reply');
    }
  };

  // User approval functions
  const updateUserStatus = async (userId, isApproved, rejectionReason = '') => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/approval`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          approved: isApproved,
          rejectionReason 
        })
      });

      if (response.ok) {
        const action = isApproved ? 'approved' : 'rejected';
        message.success(`User ${action} successfully`);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      message.error('Error updating user status');
    }
  };

  // Create new user function
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(`${userData.role} created successfully! They can now login.`);
        createUserForm.resetFields();
        setCreateUserModalVisible(false);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      message.error('Error creating user');
    }
  };

  // Update existing user function
  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(`User updated successfully!`);
        editUserForm.resetFields();
        setEditUserModalVisible(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      message.error('Error updating user');
    }
  };

  // Function to open edit modal with user data
  const openEditModal = (user) => {
    setSelectedUser(user);
    editUserForm.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      address: user.address,
      qualifications: user.qualifications,
      experience: user.experience,
      specialization: user.specialization,
      japaneseLevel: user.japaneseLevel,
      studyGoals: user.studyGoals,
      previousEducation: user.previousEducation
    });
    setEditUserModalVisible(true);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApplications(), fetchContactMessages(), fetchUsers()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Table columns for applications
  const applicationColumns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.email}
          </Text>
        </div>
      )
    },
    {
      title: 'Program',
      dataIndex: 'course',
      key: 'course',
      render: (course, record) => (
        <Tag color="blue">{course || record.program || 'Not specified'}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red'
        };
        return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Applied Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedApplication(record);
              setApplicationModalVisible(true);
            }}
          >
            View
          </Button>
          <Button
            icon={<MessageOutlined />}
            size="small"
            type="default"
            onClick={() => openReplyModal('application', record)}
          >
            Reply
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                icon={<CheckOutlined />}
                size="small"
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => updateApplicationStatus(record._id, 'approved')}
              >
                Approve
              </Button>
              <Button
                icon={<CloseOutlined />}
                size="small"
                danger
                onClick={() => updateApplicationStatus(record._id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Approved
            </Tag>
          )}
          {record.status === 'rejected' && (
            <Tag color="red" icon={<CloseCircleOutlined />}>
              Rejected
            </Tag>
          )}
        </Space>
      )
    }
  ];

  // Table columns for contact messages
  const messageColumns = [
    {
      title: 'Contact Info',
      key: 'contact',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.email}
          </Text>
        </div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Text ellipsis style={{ maxWidth: 200 }}>{subject}</Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Pending' },
          resolved: { color: 'green', text: 'Resolved' },
          approved: { color: 'blue', text: 'Approved' },
          ignored: { color: 'red', text: 'Ignored' }
        };
        const config = statusConfig[status] || { color: 'default', text: status || 'Unknown' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Received',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedMessage(record);
              setMessageModalVisible(true);
              if (record.status === 'pending') {
                updateContactStatus(record._id, 'resolved');
              }
            }}
          >
            View
          </Button>
          <Button
            icon={<MessageOutlined />}
            size="small"
            type="default"
            onClick={() => openReplyModal('contact', record)}
          >
            Reply
          </Button>
          {record.status === 'pending' && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              onClick={() => updateContactStatus(record._id, 'resolved')}
            >
              Mark Resolved
            </Button>
          )}
        </Space>
      )
    }
  ];

  // Table columns for user management
  const userColumns = [
    {
      title: 'User Info',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <Text strong>{record.firstName} {record.lastName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.email}
          </Text>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'teacher' ? 'blue' : role === 'student' ? 'green' : 'default'}>
          {role?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved) => {
        if (isApproved === true) {
          return <Tag color="green" icon={<CheckCircleOutlined />}>Approved</Tag>;
        } else if (isApproved === false) {
          return <Tag color="red" icon={<CloseCircleOutlined />}>Rejected</Tag>;
        } else {
          return <Tag color="orange">Pending</Tag>;
        }
      }
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          {record.isApproved !== true && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => updateUserStatus(record._id, true)}
            >
              Approve
            </Button>
          )}
          {record.isApproved !== false && (
            <Button
              icon={<CloseOutlined />}
              size="small"
              danger
              onClick={() => updateUserStatus(record._id, false)}
            >
              Reject
            </Button>
          )}
        </Space>
      )
    }
  ];

  const filteredApplications = Array.isArray(applications) ? applications.filter(app => {
    const matchesStatus = !filterStatus || app.status === filterStatus;
    const matchesSearch = !searchTerm || 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) : [];

  const filteredMessages = Array.isArray(contactMessages) ? contactMessages.filter(msg => {
    const matchesSearch = !searchTerm || 
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) : [];

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) : [];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading applications and messages...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📋 Application Management</Title>
      <Text type="secondary">Manage student applications, contact messages, and user registrations</Text>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Applications"
              value={stats.totalApplications}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Review"
              value={stats.pendingApplications}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Contact Messages"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Users"
              value={users.filter(user => user.isApproved !== true && user.isApproved !== false).length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different management sections */}
      <Tabs
        defaultActiveKey="applications"
        items={[
          {
            key: 'applications',
            label: '📝 Applications',
            children: (
              <Card 
                title="Student Applications" 
                extra={
                  <Space>
                    <Input
                      placeholder="Search applications..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Select
                      placeholder="Filter by status"
                      value={filterStatus}
                      onChange={setFilterStatus}
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Select.Option value="pending">Pending</Select.Option>
                      <Select.Option value="approved">Approved</Select.Option>
                      <Select.Option value="rejected">Rejected</Select.Option>
                    </Select>
                  </Space>
                }
              >
                <Table
                  columns={applicationColumns}
                  dataSource={filteredApplications}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Card>
            )
          },
          {
            key: 'contacts',
            label: '💬 Messages',
            children: (
              <Card 
                title="Contact Messages"
                extra={
                  <Space>
                    <Input
                      placeholder="Search messages..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Button icon={<DownloadOutlined />} type="primary">
                      Export Messages
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={messageColumns}
                  dataSource={filteredMessages}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Card>
            )
          },
          {
            key: 'users',
            label: '👥 Users',
            children: (
              <Card 
                title="User Registrations"
                extra={
                  <Space>
                    <Input
                      placeholder="Search users..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Select
                      placeholder="Filter by role"
                      value={roleFilter}
                      onChange={(value) => setRoleFilter(value)}
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Select.Option value="teacher">Teacher</Select.Option>
                      <Select.Option value="student">Student</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                    {(searchTerm || roleFilter) && (
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setRoleFilter('');
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button 
                      type="primary" 
                      icon={<UserOutlined />}
                      onClick={() => setCreateUserModalVisible(true)}
                    >
                      Create User
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={userColumns}
                  dataSource={filteredUsers}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* Application Details Modal */}
      <Modal
        title="📋 Application Details"
        open={applicationModalVisible}
        onCancel={() => setApplicationModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setApplicationModalVisible(false)}>
            Close
          </Button>,
          ...(selectedApplication?.status === 'pending' ? [
            <Popconfirm
              key="reject"
              title="Are you sure you want to reject this application?"
              onConfirm={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
            >
              <Button danger icon={<CloseOutlined />}>
                Reject
              </Button>
            </Popconfirm>,
            <Popconfirm
              key="approve"
              title="Are you sure you want to approve this application?"
              onConfirm={() => updateApplicationStatus(selectedApplication._id, 'approved')}
            >
              <Button type="primary" icon={<CheckOutlined />}>
                Approve
              </Button>
            </Popconfirm>
          ] : [])
        ]}
      >
        {selectedApplication && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Full Name" span={2}>
              {selectedApplication.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedApplication.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedApplication.phone || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {selectedApplication.dateOfBirth ? 
                moment(selectedApplication.dateOfBirth).format('MMMM DD, YYYY') : 
                'Not provided'
              }
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selectedApplication.address || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Program Interested">
              {selectedApplication.course || selectedApplication.program || 'Not specified'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedApplication.status === 'approved' ? 'green' :
                selectedApplication.status === 'rejected' ? 'red' : 'orange'
              }>
                {selectedApplication.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Application Date" span={2}>
              {moment(selectedApplication.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
            </Descriptions.Item>
            
            {/* Education Information */}
            {selectedApplication.highestEducation && (
              <Descriptions.Item label="Highest Education">
                {selectedApplication.highestEducation}
              </Descriptions.Item>
            )}
            {selectedApplication.schoolName && (
              <Descriptions.Item label="School Name">
                {selectedApplication.schoolName}
              </Descriptions.Item>
            )}
            {selectedApplication.graduationYear && (
              <Descriptions.Item label="Graduation Year">
                {selectedApplication.graduationYear}
              </Descriptions.Item>
            )}
            {selectedApplication.fieldOfStudy && (
              <Descriptions.Item label="Field of Study">
                {selectedApplication.fieldOfStudy}
              </Descriptions.Item>
            )}
            
            {/* Course Information */}
            {selectedApplication.startDate && (
              <Descriptions.Item label="Preferred Start Date">
                {selectedApplication.startDate}
              </Descriptions.Item>
            )}
            {selectedApplication.format && (
              <Descriptions.Item label="Study Format">
                {selectedApplication.format}
              </Descriptions.Item>
            )}
            
            {/* Additional Information */}
            {selectedApplication.goals && (
              <Descriptions.Item label="Career Goals" span={2}>
                {selectedApplication.goals}
              </Descriptions.Item>
            )}
            {selectedApplication.whyThisProgram && (
              <Descriptions.Item label="Why This Program" span={2}>
                {selectedApplication.whyThisProgram}
              </Descriptions.Item>
            )}
            {selectedApplication.howDidYouHear && (
              <Descriptions.Item label="How Did You Hear About Us">
                {selectedApplication.howDidYouHear}
              </Descriptions.Item>
            )}
            {selectedApplication.currentEmployment && (
              <Descriptions.Item label="Current Employment">
                {selectedApplication.currentEmployment}
              </Descriptions.Item>
            )}
            {selectedApplication.techExperience && (
              <Descriptions.Item label="Technical Experience" span={2}>
                {selectedApplication.techExperience}
              </Descriptions.Item>
            )}
            {selectedApplication.extraInfo && (
              <Descriptions.Item label="Additional Information" span={2}>
                {selectedApplication.extraInfo}
              </Descriptions.Item>
            )}
            
            {selectedApplication.motivation && (
              <Descriptions.Item label="Motivation" span={2}>
                {selectedApplication.motivation}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Message Details Modal */}
      <Modal
        title="💬 Contact Message"
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setMessageModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedMessage && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {selectedMessage.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedMessage.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedMessage.phone || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedMessage.subject}
            </Descriptions.Item>
            <Descriptions.Item label="Message">
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}>
                {selectedMessage.message}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Received">
              {moment(selectedMessage.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge 
                status={selectedMessage.isRead ? 'default' : 'processing'} 
                text={selectedMessage.isRead ? 'Read' : 'Unread'} 
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        title={
          <div>
            <MessageOutlined style={{ marginRight: 8 }} />
            Reply to {replyType === 'contact' ? 'Contact Message' : 'Application'}
          </div>
        }
        visible={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {replyTarget && (
          <Form
            form={replyForm}
            layout="vertical"
            onFinish={handleReply}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Recipient Email" name="recipientEmail">
                  <Input disabled prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Recipient Name" name="recipientName">
                  <Input disabled prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item 
              label="Subject" 
              name="replySubject"
              rules={[{ required: true, message: 'Please enter a subject' }]}
            >
              <Input prefix={<FileTextOutlined />} />
            </Form.Item>
            
            <Form.Item 
              label="Message" 
              name="replyMessage"
              rules={[{ required: true, message: 'Please enter your message' }]}
            >
              <TextArea 
                rows={6} 
                placeholder="Type your reply message here..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            {replyType === 'application' && (
              <Form.Item name="sendStatusEmail" valuePropName="checked">
                <div style={{ padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #d4edda', borderRadius: '4px' }}>
                  <input type="checkbox" style={{ marginRight: '8px' }} />
                  Send as application status update email (recommended for status changes)
                </div>
              </Form.Item>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setReplyModalVisible(false);
                  replyForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<SendOutlined />}
                >
                  Send Reply
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        title="👤 User Details"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Close
          </Button>,
          ...(selectedUser && selectedUser.isApproved !== true && selectedUser.isApproved !== false ? [
            <Popconfirm
              key="reject"
              title="Are you sure you want to reject this user registration?"
              onConfirm={() => updateUserStatus(selectedUser._id, false)}
            >
              <Button danger icon={<CloseOutlined />}>
                Reject
              </Button>
            </Popconfirm>,
            <Popconfirm
              key="approve"
              title="Are you sure you want to approve this user registration?"
              onConfirm={() => updateUserStatus(selectedUser._id, true)}
            >
              <Button type="primary" icon={<CheckOutlined />}>
                Approve
              </Button>
            </Popconfirm>
          ] : [])
        ]}
      >
        {selectedUser && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Full Name" span={2}>
              {selectedUser.firstName} {selectedUser.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={selectedUser.role === 'teacher' ? 'blue' : 'green'}>
                {selectedUser.role?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {selectedUser.dateOfBirth ? 
                moment(selectedUser.dateOfBirth).format('MMMM DD, YYYY') : 
                'Not provided'
              }
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedUser.phone || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selectedUser.address || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Registration Date" span={2}>
              {moment(selectedUser.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedUser.isApproved === true ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>Approved</Tag>
              ) : selectedUser.isApproved === false ? (
                <Tag color="red" icon={<CloseCircleOutlined />}>Rejected</Tag>
              ) : (
                <Tag color="orange">Pending Approval</Tag>
              )}
            </Descriptions.Item>

            {/* Teacher-specific fields */}
            {selectedUser.role === 'teacher' && (
              <>
                {selectedUser.qualifications && (
                  <Descriptions.Item label="Qualifications" span={2}>
                    {selectedUser.qualifications}
                  </Descriptions.Item>
                )}
                {selectedUser.experience && (
                  <Descriptions.Item label="Teaching Experience" span={2}>
                    {selectedUser.experience}
                  </Descriptions.Item>
                )}
                {selectedUser.specialization && (
                  <Descriptions.Item label="Specialization" span={2}>
                    {Array.isArray(selectedUser.specialization) 
                      ? selectedUser.specialization.join(', ') 
                      : selectedUser.specialization}
                  </Descriptions.Item>
                )}
              </>
            )}

            {/* Student-specific fields */}
            {selectedUser.role === 'student' && (
              <>
                {selectedUser.japaneseLevel && (
                  <Descriptions.Item label="Japanese Level">
                    {selectedUser.japaneseLevel}
                  </Descriptions.Item>
                )}
                {selectedUser.studyGoals && (
                  <Descriptions.Item label="Study Goals" span={2}>
                    {selectedUser.studyGoals}
                  </Descriptions.Item>
                )}
                {selectedUser.previousEducation && (
                  <Descriptions.Item label="Previous Education" span={2}>
                    {selectedUser.previousEducation}
                  </Descriptions.Item>
                )}
              </>
            )}

            {/* Approval information */}
            {selectedUser.approvedBy && (
              <Descriptions.Item label="Approved By">
                {selectedUser.approvedBy}
              </Descriptions.Item>
            )}
            {selectedUser.approvedAt && (
              <Descriptions.Item label="Approved Date">
                {moment(selectedUser.approvedAt).format('MMMM DD, YYYY [at] HH:mm')}
              </Descriptions.Item>
            )}
            {selectedUser.rejectionReason && (
              <Descriptions.Item label="Rejection Reason" span={2}>
                {selectedUser.rejectionReason}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        title="👤 Create New User"
        open={createUserModalVisible}
        onCancel={() => {
          setCreateUserModalVisible(false);
          createUserForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createUserForm}
          layout="vertical"
          onFinish={createUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<CloseOutlined />} />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select user role">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="teacher">Teacher</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          {/* Conditional fields based on role */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role');
              
              if (role === 'teacher') {
                return (
                  <>
                    <Form.Item
                      label="Qualifications"
                      name="qualifications"
                    >
                      <Input.TextArea rows={2} placeholder="Educational qualifications and certifications" />
                    </Form.Item>
                    <Form.Item
                      label="Teaching Experience"
                      name="experience"
                    >
                      <Input.TextArea rows={2} placeholder="Previous teaching experience" />
                    </Form.Item>
                    <Form.Item
                      label="Specialization"
                      name="specialization"
                    >
                      <Input placeholder="Teaching specializations (e.g., Japanese, English, Math)" />
                    </Form.Item>
                  </>
                );
              } else if (role === 'student') {
                return (
                  <>
                    <Form.Item
                      label="Japanese Level"
                      name="japaneseLevel"
                    >
                      <Select placeholder="Select Japanese proficiency level">
                        <Select.Option value="beginner">Beginner</Select.Option>
                        <Select.Option value="elementary">Elementary</Select.Option>
                        <Select.Option value="intermediate">Intermediate</Select.Option>
                        <Select.Option value="advanced">Advanced</Select.Option>
                        <Select.Option value="native">Native</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Study Goals"
                      name="studyGoals"
                    >
                      <Input.TextArea rows={2} placeholder="What do you want to achieve?" />
                    </Form.Item>
                    <Form.Item
                      label="Previous Education"
                      name="previousEducation"
                    >
                      <Input.TextArea rows={2} placeholder="Educational background" />
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setCreateUserModalVisible(false);
                createUserForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create User
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={editUserModalVisible}
        onCancel={() => {
          setEditUserModalVisible(false);
          editUserForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editUserForm}
          layout="vertical"
          onFinish={updateUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select
              onChange={(value) => {
                editUserForm.setFieldsValue({ role: value });
              }}
            >
              <Option value="student">Student</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <TextArea rows={2} />
          </Form.Item>

          {/* Role-specific fields */}
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
            {({ getFieldValue }) => {
              const role = getFieldValue('role');
              
              if (role === 'teacher') {
                return (
                  <>
                    <Form.Item
                      label="Subject"
                      name="subject"
                    >
                      <Input placeholder="e.g., Mathematics, English, Science" />
                    </Form.Item>
                    <Form.Item
                      label="Experience (years)"
                      name="experience"
                    >
                      <Input type="number" min="0" />
                    </Form.Item>
                    <Form.Item
                      label="Qualifications"
                      name="qualifications"
                    >
                      <TextArea rows={2} placeholder="Educational background and certifications" />
                    </Form.Item>
                  </>
                );
              }
              
              if (role === 'student') {
                return (
                  <>
                    <Form.Item
                      label="Student ID"
                      name="studentId"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Grade Level"
                      name="gradeLevel"
                    >
                      <Select>
                        <Option value="Grade 1">Grade 1</Option>
                        <Option value="Grade 2">Grade 2</Option>
                        <Option value="Grade 3">Grade 3</Option>
                        <Option value="Grade 4">Grade 4</Option>
                        <Option value="Grade 5">Grade 5</Option>
                        <Option value="Grade 6">Grade 6</Option>
                        <Option value="Grade 7">Grade 7</Option>
                        <Option value="Grade 8">Grade 8</Option>
                        <Option value="Grade 9">Grade 9</Option>
                        <Option value="Grade 10">Grade 10</Option>
                        <Option value="Grade 11">Grade 11</Option>
                        <Option value="Grade 12">Grade 12</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Parent/Guardian Name"
                      name="parentName"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Parent/Guardian Phone"
                      name="parentPhone"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Emergency Contact"
                      name="emergencyContact"
                    >
                      <Input />
                    </Form.Item>
                  </>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Form.Item
            label="New Password (optional)"
            name="password"
            help="Leave blank to keep current password"
          >
            <Input.Password />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                setEditUserModalVisible(false);
                editUserForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ApplicationManagement;
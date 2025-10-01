import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AdminSidebar.css';
import '../styles/Dashboard.css';

// Ant Design imports
import {
  Layout, Menu, Card, Table, Button, Form, Input, Upload, Modal, Select,
  Tabs, Progress, notification, Tag, Space, Divider, Row, Col, Statistic,
  DatePicker, Switch, InputNumber, Spin, Alert, Typography, Rate,
  Drawer, Breadcrumb, Empty, List, Timeline, Tooltip, Avatar, Badge,
  Popconfirm, message, Descriptions, Steps, Collapse
} from 'antd';

import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EyeOutlined, SearchOutlined, FilterOutlined, BookOutlined,
  FileTextOutlined, PlayCircleOutlined, HomeOutlined, UserOutlined,
  BarChartOutlined, CalendarOutlined, BellOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, StarOutlined, ClockCircleOutlined,
  TrophyOutlined, MessageOutlined, TeamOutlined, LogoutOutlined,
  ReadOutlined, CheckSquareOutlined, LineChartOutlined
} from '@ant-design/icons';

// Import TeacherGrading component if it exists
import TeacherGrading from './TeacherGrading';

// Import API client
import { authAPI, statsAPI, courseAPI, materialAPI, quizAPI, homeworkAPI } from '../utils/apiClient';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // States
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    myCourses: 0,
    myStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    avgClassPerformance: 0
  });

  // Check authentication and user role
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userRole) {
        history.push('/login');
        return;
      }

      // Check if user has teacher permissions
      if (!['teacher', 'faculty', 'admin', 'superadmin'].includes(userRole)) {
        message.error('Access denied. Teacher role required.');
        history.push('/');
        return;
      }
      
      // Create user object from stored data
      const userData = {
        id: userId,
        email: userEmail,
        role: userRole,
        name: userName
      };
      
      setCurrentUser(userData);
      fetchDashboardStats();
      setLoading(false);
    };

    checkAuth();
  }, [history]);

  const fetchDashboardStats = async () => {
    try {
      console.log('🔄 Starting to fetch teacher dashboard stats...');
      const stats = await statsAPI.getTeacherStats();
      console.log('✅ Received teacher stats:', stats);
      setDashboardStats(stats);
    } catch (error) {
      console.error('❌ Error fetching teacher stats:', error);
      // Set fallback data
      setDashboardStats({
        myCourses: 0,
        myStudents: 0,
        totalMaterials: 0,
        pendingSubmissions: 0,
        activeQuizzes: 0,
        avgClassPerformance: 0
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    message.success('Logged out successfully');
    history.push('/');
  };

  const teacherMenuItems = [
    {
      key: 'overview',
      icon: <HomeOutlined />,
      label: 'Overview',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'My Classes',
    },
    {
      key: 'materials',
      icon: <FileOutlined />,
      label: 'Teaching Materials',
    },
    {
      key: 'quizzes',
      icon: <QuestionCircleOutlined />,
      label: 'Quiz Management',
    },
    {
      key: 'homework',
      icon: <FileTextOutlined />,
      label: 'Assignment Center',
    },
    {
      key: 'listening',
      icon: <AudioOutlined />,
      label: 'Listening Exercises',
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Student Management',
    },
    {
      key: 'grading',
      icon: <CheckSquareOutlined />,
      label: 'Grading Center',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Class Analytics',
    }
  ];

  const renderOverview = () => (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Teacher Dashboard</Title>
      <Text type="secondary">
        Welcome back, {currentUser?.name}
      </Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="My Classes"
              value={dashboardStats.myCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={dashboardStats.myStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Teaching Materials"
              value={dashboardStats.totalMaterials}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={dashboardStats.pendingSubmissions}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Active Quizzes"
              value={dashboardStats.activeQuizzes}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="Recent Activity" extra={<Button size="small">View All</Button>}>
            <Timeline>
              <Timeline.Item color="green">
                <Text>New quiz submission in Advanced English</Text>
                <br />
                <Text type="secondary">2 minutes ago</Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text>Course material uploaded to Japanese 101</Text>
                <br />
                <Text type="secondary">1 hour ago</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text>Homework deadline reminder sent</Text>
                <br />
                <Text type="secondary">3 hours ago</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                block
                onClick={() => setActiveTab('materials')}
              >
                Upload Teaching Material
              </Button>
              <Button 
                icon={<QuestionCircleOutlined />} 
                block
                onClick={() => setActiveTab('quizzes')}
              >
                Create New Quiz
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                block
                onClick={() => setActiveTab('homework')}
              >
                Assign Homework
              </Button>
              <Button 
                icon={<BarChartOutlined />} 
                block
                onClick={() => setActiveTab('analytics')}
              >
                View Class Analytics
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Class Performance Overview">
            <Progress 
              percent={dashboardStats.avgClassPerformance} 
              status="active"
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
            />
            <Text type="secondary">
              Average performance across all your classes this semester
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderGradingCenter = () => (
    <TeacherGrading currentUser={currentUser} />
  );

  // Placeholder components for sections that were previously imported
  const renderPlaceholder = (title, description) => (
    <Card>
      <Title level={3}>{title}</Title>
      <Text type="secondary">{description}</Text>
      <Empty 
        style={{ marginTop: 40 }}
        description={`${title} functionality is being developed`}
      />
    </Card>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderPlaceholder('My Classes', 'Manage your courses and class schedules');
      case 'materials':
        return renderPlaceholder('Teaching Materials', 'Upload and manage course materials');
      case 'quizzes':
        return renderPlaceholder('Quiz Management', 'Create and manage quizzes for your students');
      case 'homework':
        return renderPlaceholder('Assignment Center', 'Create and track homework assignments');
      case 'listening':
        return renderPlaceholder('Listening Exercises', 'Manage audio-based learning exercises');
      case 'students':
        return renderPlaceholder('Student Management', 'View and manage your students');
      case 'grading':
        return renderGradingCenter();
      case 'analytics':
        return renderPlaceholder('Class Analytics', 'View detailed analytics and reports');
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          background: '#001529',
        }}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            {collapsed ? 'FA' : 'Forum Academy'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          items={teacherMenuItems}
          onClick={(e) => setActiveTab(e.key)}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Space>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Avatar 
              style={{ backgroundColor: '#87d068' }} 
              icon={<UserOutlined />} 
            />
            <Text strong>{currentUser?.name}</Text>
            <Button type="link" onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#f0f2f5',
          minHeight: 280 
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherDashboard;
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
  Popconfirm, message, Descriptions, Steps, Collapse, Calendar
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
  ReadOutlined, CheckSquareOutlined, LineChartOutlined, RocketOutlined,
  FireOutlined, HeartOutlined, LikeOutlined, CrownOutlined
} from '@ant-design/icons';

// Import API client
import { authAPI, statsAPI } from '../utils/apiClient';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const StudentDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // States
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dashboardStats, setDashboardStats] = useState({
    enrolledCourses: 0,
    completedQuizzes: 0,
    totalAssignments: 0,
    overallGrade: 0,
    studyStreak: 0,
    certificatesEarned: 0
  });

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

      // Check if user has student permissions
      if (!['student', 'teacher', 'faculty', 'admin', 'superadmin'].includes(userRole)) {
        message.error('Access denied. Student role required.');
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
      console.log('🔄 Starting to fetch student dashboard stats...');
      const stats = await statsAPI.getStudentStats();
      console.log('✅ Received student stats:', stats);
      setDashboardStats(stats);
    } catch (error) {
      console.error('❌ Error fetching student stats:', error);
      // Set fallback data
      setDashboardStats({
        enrolledCourses: 3,
        completedQuizzes: 12,
        totalAssignments: 8,
        overallGrade: 85,
        studyStreak: 7,
        certificatesEarned: 2
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

  const studentMenuItems = [
    {
      key: 'overview',
      icon: <HomeOutlined />,
      label: 'Overview',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'My Courses',
    },
    {
      key: 'quizzes',
      icon: <QuestionCircleOutlined />,
      label: 'Practice Quizzes',
    },
    {
      key: 'assignments',
      icon: <FileTextOutlined />,
      label: 'My Assignments',
    },
    {
      key: 'listening',
      icon: <AudioOutlined />,
      label: 'Listening Practice',
    },
    {
      key: 'progress',
      icon: <BarChartOutlined />,
      label: 'Learning Progress',
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: 'Study Schedule',
    },
    {
      key: 'achievements',
      icon: <TrophyOutlined />,
      label: 'Achievements',
    },
    {
      key: 'resources',
      icon: <FileOutlined />,
      label: 'Study Materials',
    }
  ];

  const renderOverview = () => (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Student Dashboard</Title>
      <Text type="secondary">
        Welcome back, {currentUser?.name}
      </Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Enrolled Courses"
              value={dashboardStats.enrolledCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Completed Quizzes"
              value={dashboardStats.completedQuizzes}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Assignments"
              value={dashboardStats.totalAssignments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Overall Grade"
              value={dashboardStats.overallGrade}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Study Streak"
              value={dashboardStats.studyStreak}
              suffix=" days"
              prefix={<FireOutlined />}
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
                <Text>Completed "English Grammar Quiz"</Text>
                <br />
                <Text type="secondary">Score: 92% • 2 hours ago</Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text>Started "Advanced Japanese" lesson</Text>
                <br />
                <Text type="secondary">Progress: 45% • Yesterday</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text>Submitted homework assignment</Text>
                <br />
                <Text type="secondary">Spanish 101 • 2 days ago</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<BookOutlined />} 
                block
                onClick={() => setActiveTab('courses')}
              >
                Continue Learning
              </Button>
              <Button 
                icon={<QuestionCircleOutlined />} 
                block
                onClick={() => setActiveTab('quizzes')}
              >
                Take Practice Quiz
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                block
                onClick={() => setActiveTab('assignments')}
              >
                View Assignments
              </Button>
              <Button 
                icon={<BarChartOutlined />} 
                block
                onClick={() => setActiveTab('progress')}
              >
                Check Progress
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Learning Progress">
            <Progress 
              percent={dashboardStats.overallGrade} 
              status="active"
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
            />
            <Text type="secondary">
              Overall academic performance this semester
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderCourses = () => (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📚 My Courses</Title>
      <Text type="secondary">Continue your learning journey</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={<div style={{ height: 120, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />}
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Advanced English"
              description="Progress: 75% • Next: Grammar Lesson 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={<div style={{ height: 120, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />}
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Japanese 101"
              description="Progress: 45% • Next: Hiragana Practice"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={<div style={{ height: 120, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} />}
            actions={[
              <Button type="link">Continue</Button>,
              <Button type="link">View Materials</Button>,
            ]}
          >
            <Card.Meta
              title="Spanish Basics"
              description="Progress: 90% • Next: Final Exam"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAchievements = () => (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🏆 Achievements</Title>
      <Text type="secondary">Your learning milestones and badges</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <TrophyOutlined style={{ fontSize: '48px', color: '#faad14' }} />
              <Title level={4}>Quick Learner</Title>
              <Text type="secondary">Completed 10 lessons in one week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <FireOutlined style={{ fontSize: '48px', color: '#f5222d' }} />
              <Title level={4}>7-Day Streak</Title>
              <Text type="secondary">Studied for 7 consecutive days</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <StarOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
              <Title level={4}>Perfect Score</Title>
              <Text type="secondary">Scored 100% on a quiz</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    return (
      <>
        <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
          {renderOverview()}
        </div>
        <div style={{ display: activeTab === 'courses' ? 'block' : 'none' }}>
          {renderCourses()}
        </div>
        <div style={{ display: activeTab === 'quizzes' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Alert
              message="Quiz System"
              description="Take practice quizzes and tests to improve your knowledge."
              type="info"
              showIcon
            />
          </div>
        </div>
        <div style={{ display: activeTab === 'assignments' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Alert
              message="Assignment Center"
              description="View and submit your homework assignments here."
              type="info"
              showIcon
            />
          </div>
        </div>
        <div style={{ display: activeTab === 'listening' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Alert
              message="Listening Practice"
              description="Improve your listening skills with interactive exercises."
              type="info"
              showIcon
            />
          </div>
        </div>
        <div style={{ display: activeTab === 'progress' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Alert
              message="Progress Tracking"
              description="Monitor your learning progress across all courses."
              type="info"
              showIcon
            />
          </div>
        </div>
        <div style={{ display: activeTab === 'calendar' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Title level={2}>📅 Study Calendar</Title>
            <Calendar />
          </div>
        </div>
        <div style={{ display: activeTab === 'achievements' ? 'block' : 'none' }}>
          {renderAchievements()}
        </div>
        <div style={{ display: activeTab === 'resources' ? 'block' : 'none' }}>
          <div style={{ padding: '24px' }}>
            <Alert
              message="Study Resources"
              description="Access additional learning materials and resources."
              type="info"
              showIcon
            />
          </div>
        </div>
      </>
    );
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
          items={studentMenuItems}
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
            <Badge count={3}>
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

export default StudentDashboard;
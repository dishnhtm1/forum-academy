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
  TrophyOutlined, MessageOutlined, TeamOutlined
} from '@ant-design/icons';

// Import components
import CourseManagement from './dashboard/CourseManagement';
import MaterialManagement from './dashboard/MaterialManagement';
import QuizManagement from './dashboard/QuizManagement';
import HomeworkManagement from './dashboard/HomeworkManagement';
import ListeningExercises from './dashboard/ListeningExercises';
import StudentProgress from './dashboard/StudentProgress';
import Analytics from './dashboard/Analytics';

// Import API client
import { authAPI, statsAPI } from '../utils/apiClient';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminFacultyDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // States
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    completionRate: 0
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

      // Check if user has admin/faculty permissions
      if (!['superadmin', 'admin', 'faculty', 'teacher'].includes(userRole)) {
        message.error('Access denied. Admin/Faculty role required.');
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
      const stats = await statsAPI.getDashboardStats();
      setDashboardStats({
        ...stats,
        pendingSubmissions: Math.floor(Math.random() * 20 + 5),
        activeQuizzes: Math.floor(Math.random() * 10 + 3)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set fallback data
      setDashboardStats({
        totalCourses: 0,
        totalStudents: 0,
        totalMaterials: 0,
        pendingSubmissions: 0,
        activeQuizzes: 0,
        completionRate: 0
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

  const menuItems = [
    {
      key: 'overview',
      icon: <HomeOutlined />,
      label: 'Overview',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Course Management',
    },
    {
      key: 'materials',
      icon: <FileOutlined />,
      label: 'Course Materials',
    },
    {
      key: 'quizzes',
      icon: <QuestionCircleOutlined />,
      label: 'Quiz Engine',
    },
    {
      key: 'homework',
      icon: <FileTextOutlined />,
      label: 'Homework System',
    },
    {
      key: 'listening',
      icon: <AudioOutlined />,
      label: 'Listening Exercises',
    },
    {
      key: 'students',
      icon: <UserOutlined />,
      label: 'Student Progress',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics & Reports',
    }
  ];

  const renderOverview = () => (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard Overview</Title>
      <Text type="secondary">
        Welcome back, {currentUser?.firstName} {currentUser?.lastName}
      </Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={dashboardStats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={dashboardStats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Course Materials"
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
                Upload Course Material
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
                View Analytics
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Course Completion Rates">
            <Progress 
              percent={dashboardStats.completionRate} 
              status="active"
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
            />
            <Text type="secondary">
              Overall student completion rate across all courses
            </Text>
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
          <CourseManagement currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'materials' ? 'block' : 'none' }}>
          <MaterialManagement currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'quizzes' ? 'block' : 'none' }}>
          <QuizManagement currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'homework' ? 'block' : 'none' }}>
          <HomeworkManagement currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'listening' ? 'block' : 'none' }}>
          <ListeningExercises currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'students' ? 'block' : 'none' }}>
          <StudentProgress currentUser={currentUser} />
        </div>
        <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}>
          <Analytics currentUser={currentUser} />
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
          items={menuItems}
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
            <Text strong>{currentUser?.firstName}</Text>
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

export default AdminFacultyDashboard;

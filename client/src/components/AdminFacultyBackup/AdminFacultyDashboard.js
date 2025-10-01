import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AdminSidebar.css';

// Ant Design imports
import {
  Layout, Menu, Card, Table, Button, Form, Input, Upload, Modal, Select,
  Tabs, Progress, notification, Tag, Space, Divider, Row, Col, Statistic,
  DatePicker, Switch, InputNumber, Spin, Alert, Typography, Rate,
  Drawer, Breadcrumb, Empty, List, Timeline, Tooltip, Avatar, Badge,
  Popconfirm, message, Descriptions, Steps, Collapse, Dropdown, Slider,
  Checkbox, Radio, AutoComplete, Cascader, TimePicker, Transfer, TreeSelect
} from 'antd';

import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EyeOutlined, SearchOutlined, FilterOutlined, BookOutlined,
  FileTextOutlined, PlayCircleOutlined, HomeOutlined, UserOutlined,
  BarChartOutlined, CalendarOutlined, BellOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, StarOutlined, ClockCircleOutlined,
  TrophyOutlined, MessageOutlined, TeamOutlined, DashboardOutlined,
  SolutionOutlined, FundOutlined, PieChartOutlined, LineChartOutlined,
  AreaChartOutlined, RadarChartOutlined, HeatMapOutlined, DotChartOutlined,
  GlobalOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
  SafetyOutlined, LockOutlined, KeyOutlined, CloudOutlined, DatabaseOutlined,
  ApiOutlined, CodeOutlined, BugOutlined, ToolOutlined, ExperimentOutlined,
  RocketOutlined, ThunderboltOutlined, FireOutlined, GiftOutlined,
  HeartOutlined, SmileOutlined, FrownOutlined, MehOutlined,
  LikeOutlined, DislikeOutlined, CommentOutlined, ShareAltOutlined,
  SaveOutlined, PrinterOutlined, ScanOutlined, WifiOutlined,
  SoundOutlined, NotificationOutlined, WarningOutlined, InfoCircleOutlined,
  ExclamationCircleOutlined, StopOutlined, PauseCircleOutlined,
  ForwardOutlined, BackwardOutlined, FastForwardOutlined, FastBackwardOutlined,
  StepForwardOutlined, StepBackwardOutlined, CaretRightOutlined,
  CaretLeftOutlined, CaretUpOutlined, CaretDownOutlined,
  FullscreenOutlined, FullscreenExitOutlined, ExpandOutlined,
  CompressOutlined, PlusCircleOutlined, MinusCircleOutlined,
  CheckSquareOutlined, BorderOutlined, FormOutlined, HighlightOutlined,
  SnippetsOutlined, DiffOutlined, CopyOutlined, ScissorOutlined,
  DeleteRowOutlined, MergeCellsOutlined, SplitCellsOutlined,
  AppstoreOutlined, BarsOutlined, BuildOutlined, BlockOutlined,
  GatewayOutlined, ClusterOutlined, DeploymentUnitOutlined,
  VerifiedOutlined, SafetyCertificateOutlined, SecurityScanOutlined,
  IdcardOutlined, ContactsOutlined, FolderOutlined, FolderOpenOutlined,
  FolderAddOutlined, HddOutlined, CloudServerOutlined, CloudSyncOutlined,
  CloudDownloadOutlined, CloudUploadOutlined, InboxOutlined, LaptopOutlined,
  MobileOutlined, TabletOutlined, DesktopOutlined, WalletOutlined,
  BankOutlined, CreditCardOutlined, DollarOutlined, EuroOutlined,
  PoundOutlined, TransactionOutlined, MoneyCollectOutlined,
  FieldTimeOutlined, HistoryOutlined, ReloadOutlined, SyncOutlined,
  RedoOutlined, UndoOutlined, LoginOutlined, LogoutOutlined,
  UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined,
  UsergroupDeleteOutlined, ManOutlined, WomanOutlined,
  ShoppingCartOutlined, ShoppingOutlined, ShopOutlined,
  TagsOutlined, BarcodeOutlined, QrcodeOutlined,
  CameraOutlined, PictureOutlined, CompassOutlined,
  AimOutlined, SendOutlined, RiseOutlined,
  FallOutlined, StockOutlined, FundProjectionScreenOutlined,
  PercentageOutlined
} from '@ant-design/icons';

import moment from 'moment';
import { Line, Bar, Doughnut, Radar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler
);

// Import dashboard components
import ApplicationManagement from './dashboard/ApplicationManagement';
import CourseManagement from './dashboard/CourseManagement';
import HomeworkManagement from './dashboard/HomeworkManagement';
import ListeningExercises from './dashboard/ListeningExercises';
import MaterialManagement from './dashboard/MaterialManagement';
import QuizManagement from './dashboard/QuizManagement';
import StudentProgress from '../components/StudentProgress';

// Import API clients
import { authAPI, statsAPI, courseAPI, materialAPI, quizAPI, homeworkAPI, userAPI } from '../utils/apiClient';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Step } = Steps;
const { Meta } = Card;
const { SubMenu } = Menu;
const { confirm } = Modal;

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Main Dashboard Component
const AdminFacultyDashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // States
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState('dark');
  
  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    completionRate: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    newApplications: 0,
    upcomingEvents: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  // Component-specific states
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [homework, setHomework] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [listeningExercises, setListeningExercises] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Refs for audio players
  const audioRef = useRef(null);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Authentication check
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

      if (!['superadmin', 'admin', 'faculty', 'teacher'].includes(userRole)) {
        message.error('Access denied. Admin/Faculty role required.');
        history.push('/');
        return;
      }
      
      const userData = {
        id: userId,
        email: userEmail,
        role: userRole,
        name: userName,
        firstName: userName?.split(' ')[0] || 'Admin',
        lastName: userName?.split(' ')[1] || 'User'
      };
      
      setCurrentUser(userData);
      fetchInitialData();
      setLoading(false);
    };

    checkAuth();
  }, [history]);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchCourses(),
        fetchStudents(),
        fetchApplications(),
        fetchContactMessages(),
        fetchProgressData(),
        fetchAnnouncements()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch various stats
      const [coursesRes, studentsRes, applicationsRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/users?role=student`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      const applicationsData = await applicationsRes.json();
      const messagesData = await messagesRes.json();

      // Calculate stats
      const stats = {
        totalCourses: coursesData.courses?.length || 0,
        totalStudents: studentsData.users?.length || 0,
        totalApplications: applicationsData.applications?.length || 0,
        pendingApplications: applicationsData.applications?.filter(a => a.status === 'pending').length || 0,
        approvedApplications: applicationsData.applications?.filter(a => a.status === 'approved').length || 0,
        rejectedApplications: applicationsData.applications?.filter(a => a.status === 'rejected').length || 0,
        totalMessages: messagesData.contacts?.length || 0,
        unreadMessages: messagesData.contacts?.filter(m => m.status === 'pending').length || 0,
        completionRate: 75, // Mock data
        totalMaterials: 42, // Mock data
        pendingSubmissions: 8, // Mock data
        activeQuizzes: 5 // Mock data
      };

      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getAll();
      setCourses(data.courses || data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users?role=student`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.users || data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContactMessages(data.contacts || data || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProgressRecords(data.progress || []);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleLogout = () => {
    confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        localStorage.clear();
        message.success('Logged out successfully');
        history.push('/');
      }
    });
  };

  // Menu items with icons
  const menuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: 'Dashboard Overview'
    },
    {
      key: 'applications',
      icon: <SolutionOutlined />,
      label: 'Applications & Users'
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Course Management'
    },
    {
      key: 'materials',
      icon: <FolderOutlined />,
      label: 'Course Materials'
    },
    {
      key: 'quizzes',
      icon: <FormOutlined />,
      label: 'Quiz Engine'
    },
    {
      key: 'homework',
      icon: <FileTextOutlined />,
      label: 'Homework System'
    },
    {
      key: 'listening',
      icon: <AudioOutlined />,
      label: 'Listening Exercises'
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Student Progress'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics & Reports'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  // Render Dashboard Overview
  const renderOverview = () => (
    <div className="dashboard-overview">
      <Row gutter={[24, 24]}>
        {/* Stats Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-blue" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Total Courses</span>}
              value={dashboardStats.totalCourses}
              prefix={<BookOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <Progress 
              percent={75} 
              strokeColor="#fff" 
              trailColor="rgba(255,255,255,0.3)"
              showInfo={false}
              style={{ marginTop: 10 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-green" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Total Students</span>}
              value={dashboardStats.totalStudents}
              prefix={<UserOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <Progress 
              percent={85} 
              strokeColor="#fff" 
              trailColor="rgba(255,255,255,0.3)"
              showInfo={false}
              style={{ marginTop: 10 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-orange" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Pending Applications</span>}
              value={dashboardStats.pendingApplications}
              prefix={<SolutionOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <Progress 
              percent={dashboardStats.totalApplications > 0 ? 
                (dashboardStats.pendingApplications / dashboardStats.totalApplications) * 100 : 0} 
              strokeColor="#fff" 
              trailColor="rgba(255,255,255,0.3)"
              showInfo={false}
              style={{ marginTop: 10 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-purple" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Unread Messages</span>}
              value={dashboardStats.unreadMessages}
              prefix={<MessageOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <Progress 
              percent={dashboardStats.totalMessages > 0 ? 
                (dashboardStats.unreadMessages / dashboardStats.totalMessages) * 100 : 0} 
              strokeColor="#fff" 
              trailColor="rgba(255,255,255,0.3)"
              showInfo={false}
              style={{ marginTop: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Student Performance Trends" 
            extra={
              <Select defaultValue="week" style={{ width: 120 }}>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="year">This Year</Option>
              </Select>
            }
          >
            <Line
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Average Score',
                    data: [75, 78, 80, 82, 79, 85, 88],
                    borderColor: '#1890ff',
                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                    tension: 0.4
                  },
                  {
                    label: 'Completion Rate',
                    data: [65, 70, 72, 75, 73, 78, 82],
                    borderColor: '#52c41a',
                    backgroundColor: 'rgba(82, 196, 26, 0.1)',
                    tension: 0.4
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Application Status">
            <Doughnut
              data={{
                labels: ['Pending', 'Approved', 'Rejected'],
                datasets: [{
                  data: [
                    dashboardStats.pendingApplications,
                    dashboardStats.approvedApplications,
                    dashboardStats.rejectedApplications
                  ],
                  backgroundColor: [
                    '#faad14',
                    '#52c41a',
                    '#f5222d'
                  ]
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Activity and Quick Actions */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            extra={<Button type="link">View All</Button>}
            bodyStyle={{ padding: '12px 24px' }}
          >
            <Timeline>
              {applications.slice(0, 3).map((app, index) => (
                <Timeline.Item 
                  key={app._id || index}
                  color={app.status === 'pending' ? 'orange' : app.status === 'approved' ? 'green' : 'red'}
                  dot={<UserAddOutlined />}
                >
                  <Text strong>New application from {app.fullName}</Text>
                  <br />
                  <Text type="secondary">{app.course || app.program || 'General Application'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {moment(app.createdAt).fromNow()}
                  </Text>
                </Timeline.Item>
              ))}
              {contactMessages.slice(0, 2).map((msg, index) => (
                <Timeline.Item 
                  key={msg._id || index}
                  color="blue"
                  dot={<MessageOutlined />}
                >
                  <Text strong>Message from {msg.name}</Text>
                  <br />
                  <Text type="secondary">{msg.subject}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {moment(msg.createdAt).fromNow()}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button 
                  type="primary" 
                  icon={<SolutionOutlined />} 
                  block 
                  size="large"
                  onClick={() => setActiveKey('applications')}
                  style={{ height: 60 }}
                >
                  Review Applications
                  {dashboardStats.pendingApplications > 0 && (
                    <Badge 
                      count={dashboardStats.pendingApplications} 
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  icon={<MessageOutlined />} 
                  block 
                  size="large"
                  onClick={() => setActiveKey('applications')}
                  style={{ height: 60 }}
                >
                  Check Messages
                  {dashboardStats.unreadMessages > 0 && (
                    <Badge 
                      count={dashboardStats.unreadMessages} 
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  icon={<BookOutlined />} 
                  block 
                  size="large"
                  onClick={() => setActiveKey('courses')}
                  style={{ height: 60 }}
                >
                  Manage Courses
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  icon={<TeamOutlined />} 
                  block 
                  size="large"
                  onClick={() => setActiveKey('students')}
                  style={{ height: 60 }}
                >
                  Student Progress
                </Button>
              </Col>
            </Row>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardStats.pendingApplications > 0 && (
                <Alert
                  message={`${dashboardStats.pendingApplications} new applications pending review`}
                  type="warning"
                  showIcon
                  action={
                    <Button size="small" type="primary" onClick={() => setActiveKey('applications')}>
                      Review Now
                    </Button>
                  }
                />
              )}
              {dashboardStats.unreadMessages > 0 && (
                <Alert
                  message={`${dashboardStats.unreadMessages} unread messages`}
                  type="info"
                  showIcon
                  action={
                    <Button size="small" onClick={() => setActiveKey('applications')}>
                      View Messages
                    </Button>
                  }
                />
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Summary Statistics */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="System Overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Total Applications"
                    value={dashboardStats.totalApplications}
                    prefix={<SolutionOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Active Courses"
                    value={dashboardStats.totalCourses}
                    prefix={<BookOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Total Students"
                    value={dashboardStats.totalStudents}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Course Materials"
                    value={dashboardStats.totalMaterials}
                    prefix={<FileOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAnalytics = () => (
    <Card title="Analytics & Reports">
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Performance Chart">
            <Bar
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Average Score',
                  data: [75, 80, 78, 85, 82, 88],
                  backgroundColor: '#1890ff'
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Student Distribution">
            <Pie
              data={{
                labels: ['Excellent', 'Good', 'Average', 'Below Average'],
                datasets: [{
                  data: [25, 40, 25, 10],
                  backgroundColor: ['#52c41a', '#1890ff', '#faad14', '#f5222d']
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  const renderSettings = () => (
    <Card title="Settings">
      <Tabs defaultActiveKey="profile">
        <TabPane tab="Profile" key="profile">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="First Name">
                  <Input defaultValue={currentUser?.firstName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name">
                  <Input defaultValue={currentUser?.lastName} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Email">
              <Input defaultValue={currentUser?.email} disabled />
            </Form.Item>
            <Form.Item label="Role">
              <Input defaultValue={currentUser?.role} disabled />
            </Form.Item>
            <Button type="primary">Update Profile</Button>
          </Form>
        </TabPane>
        <TabPane tab="Preferences" key="preferences">
          <Form layout="vertical">
            <Form.Item label="Language">
              <Select defaultValue="en">
                <Option value="en">English</Option>
                <Option value="ja">Japanese</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Theme">
              <Radio.Group value={theme} onChange={(e) => setTheme(e.target.value)}>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Email Notifications">
              <Switch defaultChecked />
            </Form.Item>
            <Button type="primary">Save Preferences</Button>
          </Form>
        </TabPane>
        <TabPane tab="Security" key="security">
          <Form layout="vertical">
            <Form.Item label="Current Password">
              <Input.Password />
            </Form.Item>
            <Form.Item label="New Password">
              <Input.Password />
            </Form.Item>
            <Form.Item label="Confirm Password">
              <Input.Password />
            </Form.Item>
            <Button type="primary">Change Password</Button>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );

  // Main content renderer with integrated dashboard components
  const renderContent = () => {
    switch(activeKey) {
      case 'overview':
        return renderOverview();
      case 'applications':
        return <ApplicationManagement currentUser={currentUser} />;
      case 'courses':
        return <CourseManagement currentUser={currentUser} />;
      case 'materials':
        return <MaterialManagement currentUser={currentUser} />;
      case 'quizzes':
        return <QuizManagement currentUser={currentUser} />;
      case 'homework':
        return <HomeworkManagement currentUser={currentUser} />;
      case 'listening':
        return <ListeningExercises currentUser={currentUser} />;
      case 'students':
        return currentUser?.role === 'student' ? 
          <StudentProgress currentUser={currentUser} /> :
          <Card title="Student Progress Management">
            <Table
              dataSource={students}
              columns={[
                { 
                  title: 'Student', 
                  key: 'name', 
                  render: (record) => (
                    <Space>
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {record.firstName?.charAt(0)}
                      </Avatar>
                      <div>
                        <Text strong>{record.firstName} {record.lastName}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                      </div>
                    </Space>
                  )
                },
                { 
                  title: 'Course', 
                  dataIndex: 'course', 
                  key: 'course',
                  render: (course) => <Tag color="blue">{course || 'Not Enrolled'}</Tag>
                },
                { 
                  title: 'Progress', 
                  key: 'progress', 
                  render: () => (
                    <Progress 
                      percent={Math.floor(Math.random() * 100)} 
                      size="small"
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  )
                },
                { 
                  title: 'Last Active', 
                  key: 'lastActive',
                  render: () => moment().subtract(Math.floor(Math.random() * 7), 'days').fromNow()
                },
                { 
                  title: 'Status', 
                  key: 'status',
                  render: () => {
                    const statuses = ['active', 'inactive', 'pending'];
                    const status = statuses[Math.floor(Math.random() * statuses.length)];
                    const colors = { active: 'green', inactive: 'red', pending: 'orange' };
                    return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
                  }
                },
                { 
                  title: 'Actions', 
                  key: 'actions', 
                  render: (_, record) => (
                    <Space>
                      <Tooltip title="View Details">
                        <Button icon={<EyeOutlined />} size="small" />
                      </Tooltip>
                      <Tooltip title="Send Message">
                        <Button icon={<MessageOutlined />} size="small" />
                      </Tooltip>
                      <Tooltip title="View Progress">
                        <Button icon={<BarChartOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  )
                }
              ]}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </Card>;
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
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
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Modern Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        width={260}
        className="modern-sidebar"
        style={{
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: '4px 0 30px rgba(102, 126, 234, 0.4)',
          overflow: 'auto'
        }}
      >
        {/* Logo Section */}
        <div className="sidebar-logo-section" style={{
          padding: '30px 20px',
          textAlign: 'center',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="logo-container">
            <div className="logo-icon-box" style={{
              width: 70,
              height: 70,
              margin: '0 auto',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
              marginBottom: 15
            }}>
              <RocketOutlined style={{ fontSize: 35, color: '#fff' }} />
            </div>
            {!collapsed && (
              <div>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>
                  Forum Academy
                </Title>
                <Badge 
                  count="ADMIN PORTAL" 
                  style={{ 
                    backgroundColor: '#52c41a',
                    color: '#fff',
                    marginTop: 8
                  }} 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={(e) => setActiveKey(e.key)}
          style={{ 
            background: 'transparent',
            borderRight: 0,
            padding: '20px 10px'
          }}
          items={menuItems.map(item => ({
            ...item,
            style: {
              margin: '8px 0',
              borderRadius: '12px'
            }
          }))}
        />

        {/* Status Section */}
        {!collapsed && (
          <div className="sidebar-status" style={{
            padding: 20,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: 12,
              borderRadius: 10,
              marginBottom: 12
            }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}>
                COMPLETION RATE
              </Text>
              <Progress 
                percent={dashboardStats.completionRate || 75} 
                strokeColor="#4facfe"
                trailColor="rgba(255, 255, 255, 0.2)"
                showInfo={false}
              />
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: 12,
              borderRadius: 10
            }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}>
                ACTIVE USERS
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
                  {dashboardStats.totalStudents}
                </Text>
                <TeamOutlined style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 18 }} />
              </div>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="sidebar-user-section" style={{
          padding: 20,
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 12,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={handleLogout}
          >
            <Avatar 
              style={{ 
                backgroundColor: '#ff6b6b',
                minWidth: 40
              }}
            >
              {currentUser?.firstName?.charAt(0)}
            </Avatar>
            {!collapsed && (
              <>
                <div style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', display: 'block', fontWeight: 700 }}>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}>
                    {currentUser?.role}
                  </Text>
                </div>
                <LogoutOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </>
            )}
          </div>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.3s' }}>
        {/* Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18 }}
            />
            <Breadcrumb>
              <Breadcrumb.Item>
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {menuItems.find(item => item.key === activeKey)?.label || 'Dashboard'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>

          <Space size="large">
            <Input.Search 
              placeholder="Search..." 
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={() => setActiveKey('courses')}>
                    <BookOutlined /> New Course
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => setActiveKey('quizzes')}>
                    <FormOutlined /> New Quiz
                  </Menu.Item>
                  <Menu.Item key="3" onClick={() => setActiveKey('homework')}>
                    <FileTextOutlined /> New Assignment
                  </Menu.Item>
                  <Menu.Item key="4" onClick={() => setActiveKey('materials')}>
                    <UploadOutlined /> Upload Material
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Quick Add
              </Button>
            </Dropdown>

            <Badge count={dashboardStats.pendingApplications + dashboardStats.unreadMessages}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ fontSize: 18 }}
                onClick={() => setActiveKey('applications')}
              />
            </Badge>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile" onClick={() => setActiveKey('settings')}>
                    <UserOutlined /> Profile
                  </Menu.Item>
                  <Menu.Item key="settings" onClick={() => setActiveKey('settings')}>
                    <SettingOutlined /> Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="logout" onClick={handleLogout}>
                    <LogoutOutlined /> Logout
                  </Menu.Item>
                </Menu>
              }
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {currentUser?.firstName?.charAt(0)}
                </Avatar>
                <Text strong>{currentUser?.firstName}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ 
          margin: '24px', 
          minHeight: 280,
          background: '#f0f2f5'
        }}>
          {renderContent()}
        </Content>

        {/* Footer */}
        <Layout.Footer style={{ textAlign: 'center', background: '#fff' }}>
          <Text type="secondary">
            Forum Academy Admin Dashboard ©{new Date().getFullYear()} | Powered by React & Ant Design
          </Text>
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

// Add custom styles
const style = document.createElement('style');
style.innerHTML = `
  .modern-sidebar .ant-menu-item-selected {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%) !important;
  }
  
  .modern-sidebar .ant-menu-item:hover {
    background: rgba(255, 255, 255, 0.2) !important;
  }
  
  .stat-card {
    transition: all 0.3s;
    border: none !important;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
  
  .gradient-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .gradient-green {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  }
  
  .gradient-orange {
    background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
  }
  
  .gradient-purple {
    background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
  }
  
  .ant-layout-sider-collapsed .sidebar-status,
  .ant-layout-sider-collapsed .sidebar-user-section > div > div:last-child {
    display: none;
  }

  @media (max-width: 768px) {
    .ant-layout-header {
      padding: 0 12px !important;
    }
    
    .ant-layout-header .ant-input-search {
      display: none;
    }
    
    .ant-layout-content {
      margin: 12px !important;
    }
    
    .stat-card {
      margin-bottom: 12px;
    }
  }
`;
document.head.appendChild(style);

export default AdminFacultyDashboard;

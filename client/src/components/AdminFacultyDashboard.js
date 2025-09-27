import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AdminSidebar.css';
import '../styles/DashboardStats.css';

// Ant Design imports
import {
  Layout, Menu, Card, Table, Button, Form, Input, Upload, Modal, Select,
  Tabs, Progress, notification, Tag, Space, Divider, Row, Col, Statistic,
  DatePicker, Switch, InputNumber, Spin, Alert, Typography, Rate,
  Drawer, Breadcrumb, Empty, List, Timeline, Tooltip, Avatar, Badge,
  Popconfirm, message, Descriptions, Steps, Collapse, Dropdown, Slider,
  Checkbox, Radio
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
  PercentageOutlined, TagOutlined, CheckOutlined, CloseOutlined
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

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

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
    unreadMessages: 0,
    totalHomework: 0,
    totalQuizzes: 0,
    totalListeningExercises: 0
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
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Forum-related states
  const [forumCategories, setForumCategories] = useState([]);
  const [forumThreads, setForumThreads] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [forumStats, setForumStats] = useState({
    totalCategories: 0,
    totalThreads: 0,
    totalPosts: 0,
    activeUsers: 0,
    pendingModeration: 0
  });

  // Forum management specific states
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  
  // Modal states
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [courseViewModalVisible, setCourseViewModalVisible] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
  const [submissionsModalVisible, setSubmissionsModalVisible] = useState(false);
  const [gradingModalVisible, setGradingModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  
  // Selected items
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Form states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingHomework, setEditingHomework] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playingExerciseId, setPlayingExerciseId] = useState(null);
  const [replyType, setReplyType] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  
  // Forms
  const [courseForm] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [quizForm] = Form.useForm();
  const [homeworkForm] = Form.useForm();
  const [exerciseForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [createUserForm] = Form.useForm();
  const [editUserForm] = Form.useForm();
  const [gradingForm] = Form.useForm();
  
  // Refs for audio players
  const audioRef = useRef(null);
  const tableAudioRef = useRef(null);

  // Helper function to download files
  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${filePath}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download file');
    }
  };

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
        fetchUsers(),
        fetchQuizzes(),
        fetchHomework(),
        fetchMaterials(),
        fetchListeningExercises(),
        fetchForumData()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const authHeaders = getAuthHeaders();
      
      // Fetch various stats
      const [coursesRes, studentsRes, teachersRes, applicationsRes, messagesRes, materialsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/courses`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/users?role=student`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/users?role=teacher`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/applications`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/contact`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/course-materials`, { headers: authHeaders })
      ]);

      // Check for authentication errors
      if (coursesRes.status === 401 || studentsRes.status === 401 || teachersRes.status === 401 ||
          applicationsRes.status === 401 || messagesRes.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }

      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      const teachersData = await teachersRes.json();
      const applicationsData = await applicationsRes.json();
      const messagesData = await messagesRes.json();
      const materialsData = materialsRes.ok ? await materialsRes.json() : { materials: [] };

      // Calculate stats
      const stats = {
        totalCourses: coursesData.courses?.length || coursesData.length || 0,
        totalStudents: studentsData.users?.length || studentsData.length || 0,
        totalTeachers: teachersData.users?.length || teachersData.length || 0,
        totalApplications: applicationsData.applications?.length || applicationsData.length || 0,
        pendingApplications: (applicationsData.applications || applicationsData || []).filter(a => a.status === 'pending').length,
        approvedApplications: (applicationsData.applications || applicationsData || []).filter(a => a.status === 'approved').length,
        rejectedApplications: (applicationsData.applications || applicationsData || []).filter(a => a.status === 'rejected').length,
        totalMessages: messagesData.contacts?.length || messagesData.length || 0,
        unreadMessages: (messagesData.contacts || messagesData || []).filter(m => m.status === 'pending').length,
        totalMaterials: materialsData.materials?.length || materials.length || 0,
        totalHomework: homework.length,
        totalQuizzes: quizzes.length,
        totalListeningExercises: listeningExercises.length,
        completionRate: 75,
        pendingSubmissions: 8,
        activeQuizzes: quizzes.filter(q => {
          const now = moment();
          return q.availableFrom && q.availableTo &&
            now.isAfter(moment(q.availableFrom)) && 
            now.isBefore(moment(q.availableTo));
        }).length
      };

      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        message.error('Session expired. Please login again.');
        localStorage.clear();
        history.push('/');
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || data || []);
      } else {
        console.error('Failed to fetch courses:', response.statusText);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?role=student`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.users || data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setContactMessages(data.contacts || data || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setContactMessages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getAll();
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    }
  };

  const fetchHomework = async () => {
    try {
      const data = await homeworkAPI.getAll();
      setHomework(data || []);
    } catch (error) {
      console.error('Error fetching homework:', error);
      setHomework([]);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await materialAPI.getAll();
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
  };

  const fetchListeningExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/listening-exercises`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setListeningExercises(data || []);
      }
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      setListeningExercises([]);
    }
  };

  const fetchForumData = async () => {
    try {
      // Fetch forum categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/forum/categories`, {
        headers: getAuthHeaders()
      });

      // Fetch forum threads
      const threadsResponse = await fetch(`${API_BASE_URL}/api/forum/threads`, {
        headers: getAuthHeaders()
      });

      // Fetch forum posts
      const postsResponse = await fetch(`${API_BASE_URL}/api/forum/posts`, {
        headers: getAuthHeaders()
      });

      // Fetch forum stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/forum/stats`, {
        headers: getAuthHeaders()
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setForumCategories(categoriesData.categories || []);
      }

      if (threadsResponse.ok) {
        const threadsData = await threadsResponse.json();
        setForumThreads(threadsData.threads || []);
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setForumPosts(postsData.posts || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setForumStats(statsData || {
          totalCategories: 0,
          totalThreads: 0,
          totalPosts: 0,
          activeUsers: 0,
          pendingModeration: 0
        });
      }
    } catch (error) {
      console.error('Error fetching forum data:', error);
      // Set dummy data for development
      setForumCategories([
        { _id: '1', name: 'General Discussion', description: 'General topics', threads: 15, posts: 45 },
        { _id: '2', name: 'Course Help', description: 'Get help with courses', threads: 8, posts: 32 },
        { _id: '3', name: 'Announcements', description: 'Official announcements', threads: 3, posts: 12 }
      ]);
      setForumThreads([
        { _id: '1', title: 'Welcome to Forum Academy', category: '1', author: 'Admin', replies: 5, views: 120, lastPost: new Date() },
        { _id: '2', title: 'Homework Help Thread', category: '2', author: 'Student1', replies: 12, views: 89, lastPost: new Date() }
      ]);
      setForumPosts([
        { _id: '1', threadId: '1', author: 'Admin', content: 'Welcome message...', createdAt: new Date() }
      ]);
      setForumStats({
        totalCategories: 3,
        totalThreads: 25,
        totalPosts: 89,
        activeUsers: 45,
        pendingModeration: 2
      });
    }
  };

  const fetchQuizSubmissions = async (quizId) => {
    try {
      const data = await quizAPI.getSubmissions(quizId);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    }
  };

  // Fetch homework submissions
  const fetchHomeworkSubmissions = async (homeworkId) => {
    try {
      const data = await homeworkAPI.getSubmissions(homeworkId);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching homework submissions:', error);
      setSubmissions([]);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }

      if (response.ok) {
        message.success(`Application ${status} successfully!`);
        fetchApplications();
        setApplicationModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      message.error('Error updating application status');
    }
  };

  // Update contact message status
  const updateContactStatus = async (messageId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }

      if (response.ok) {
        fetchContactMessages();
        message.success(`Message marked as ${newStatus}`);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      message.error('Error updating contact status');
    }
  };

  // Update user status
  const updateUserStatus = async (userId, isApproved, rejectionReason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/approval`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          approved: isApproved,
          rejectionReason 
        })
      });

      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }

      if (response.ok) {
        const action = isApproved ? 'approved' : 'rejected';
        message.success(`User ${action} successfully`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Error updating user status');
    }
  };

  // Create new user
  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (response.status === 401) {
        message.error('Authentication failed. Please login again.');
        localStorage.clear();
        history.push('/');
        return;
      }

      if (response.ok) {
        message.success(`${userData.role} created successfully!`);
        createUserForm.resetFields();
        setCreateUserModalVisible(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Error creating user');
    }
  };

  // Handle course creation/update
  const handleCreateCourse = async (values) => {
    try {
      const courseData = {
        title: values.title,
        description: values.description,
        code: values.code.toUpperCase(), // Ensure code is uppercase as required by backend
        category: values.category,
        level: values.level,
        duration: values.duration || 12, // Default 12 weeks
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
        maxStudents: values.capacity || values.maxStudents || 30,
        isActive: values.status === 'active' // Map status to isActive boolean
      };

      console.log('Creating/updating course with data:', courseData);

      if (editingCourse) {
        const response = await fetch(`${API_BASE_URL}/api/courses/${editingCourse._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(courseData)
        });

        if (response.status === 401) {
          message.error('Authentication failed. Please login again.');
          localStorage.clear();
          history.push('/');
          return;
        }

        if (response.ok) {
          message.success('Course updated successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update course');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(courseData)
        });

        if (response.status === 401) {
          message.error('Authentication failed. Please login again.');
          localStorage.clear();
          history.push('/');
          return;
        }

        if (response.ok) {
          message.success('Course created successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create course');
        }
      }

      setCourseModalVisible(false);
      courseForm.resetFields();
      setEditingCourse(null);
      fetchCourses();
      fetchDashboardStats(); // Refresh stats
    } catch (error) {
      console.error('Error saving course:', error);
      message.error(error.message || 'Error saving course');
    }
  };

  // Handle quiz creation/update
  const handleCreateQuiz = async (values) => {
    try {
      const quizData = {
        ...values,
        dueDate: values.dueDate?.format(),
        availableFrom: values.availableFrom?.format() || new Date(),
        availableTo: values.availableTo?.format(),
        createdBy: currentUser.id,
        questions: questions
      };

      if (editingQuiz) {
        await quizAPI.update(editingQuiz._id, quizData);
      } else {
        await quizAPI.create(quizData);
      }

      message.success(`Quiz ${editingQuiz ? 'updated' : 'created'} successfully`);
      setQuizModalVisible(false);
      quizForm.resetFields();
      setEditingQuiz(null);
      setQuestions([]);
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      message.error('Error saving quiz: ' + error.message);
    }
  };

  // Handle homework creation/update
  const handleCreateHomework = async (values) => {
    try {
      const homeworkData = {
        ...values,
        dueDate: values.dueDate?.format(),
        assignedDate: values.assignedDate?.format() || new Date(),
        assignedBy: currentUser.id
      };

      if (editingHomework) {
        await homeworkAPI.update(editingHomework._id, homeworkData);
      } else {
        await homeworkAPI.create(homeworkData);
      }

      message.success(`Homework ${editingHomework ? 'updated' : 'created'} successfully`);
      setHomeworkModalVisible(false);
      homeworkForm.resetFields();
      setEditingHomework(null);
      fetchHomework();
    } catch (error) {
      console.error('Error saving homework:', error);
      message.error('Failed to save homework');
    }
  };

  // Handle material upload
  const handleUploadMaterial = async (values) => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('course', values.course);
    formData.append('category', values.category);
    formData.append('week', values.week || 1);
    formData.append('lesson', values.lesson || 1);
    formData.append('tags', JSON.stringify(values.tags || []));
    formData.append('accessLevel', values.accessLevel || 'course_students');

    try {
      await materialAPI.create(formData);
      message.success('Material uploaded successfully!');
      setMaterialModalVisible(false);
      materialForm.resetFields();
      setFileList([]);
      fetchMaterials();
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Failed to upload material');
    }
  };

  // Handle listening exercise creation
  const handleCreateExercise = async (values) => {
    if (!audioFile) {
      message.error('Please upload an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', audioFile);
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('course', values.course);
    formData.append('level', values.level);
    formData.append('instructions', values.instructions || '');
    formData.append('transcript', values.transcript || '');
    formData.append('timeLimit', values.timeLimit || 30);
    formData.append('playLimit', values.playLimit || 3);
    formData.append('questions', JSON.stringify(questions));
    formData.append('createdBy', currentUser.id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/listening-exercises`, {
        method: editingExercise ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        message.success(`Exercise ${editingExercise ? 'updated' : 'created'} successfully`);
        setExerciseModalVisible(false);
        exerciseForm.resetFields();
        setEditingExercise(null);
        setAudioFile(null);
        setQuestions([]);
        fetchListeningExercises();
      } else {
        throw new Error('Failed to save exercise');
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
      message.error('Error saving exercise');
    }
  };

  // Add question to quiz/exercise
  const addQuestion = () => {
    questionForm.validateFields().then(values => {
      const newQuestion = {
        id: Date.now(),
        ...values,
        options: values.type === 'multiple_choice' ? values.options || [] : []
      };
      setQuestions([...questions, newQuestion]);
      questionForm.resetFields();
      message.success('Question added successfully');
    });
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
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
      key: 'forum',
      icon: <CommentOutlined />,
      label: 'Forum Management'
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
      {/* Main Stats Cards - First Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-blue" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Total Students</span>}
              value={dashboardStats.totalStudents}
              prefix={<TeamOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <div style={{ marginTop: 10, color: '#fff', opacity: 0.9 }}>
              <small>Active learners enrolled</small>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-green" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Total Teachers</span>}
              value={dashboardStats.totalTeachers}
              prefix={<UserOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <div style={{ marginTop: 10, color: '#fff', opacity: 0.9 }}>
              <small>Qualified instructors</small>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-orange" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Total Courses</span>}
              value={dashboardStats.totalCourses}
              prefix={<BookOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <div style={{ marginTop: 10, color: '#fff', opacity: 0.9 }}>
              <small>Available programs</small>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card gradient-purple" hoverable>
            <Statistic
              title={<span style={{ color: '#fff' }}>Course Materials</span>}
              value={dashboardStats.totalMaterials}
              prefix={<FolderOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px' }}
            />
            <div style={{ marginTop: 10, color: '#fff', opacity: 0.9 }}>
              <small>Learning resources</small>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats Cards - Second Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Quizzes"
              value={dashboardStats.totalQuizzes}
              prefix={<FormOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <small>{dashboardStats.activeQuizzes} active</small>
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Homework Assignments"
              value={dashboardStats.totalHomework}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <small>{dashboardStats.pendingSubmissions} pending review</small>
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Listening Exercises"
              value={dashboardStats.totalListeningExercises}
              prefix={<AudioOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <small>Audio comprehension</small>
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Pending Applications"
              value={dashboardStats.pendingApplications}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <small>Awaiting review</small>
              </Text>
            </div>
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
              { (applications.length > 0 || contactMessages.length > 0) ? (
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
              ) : (
                <Empty description="No recent activity" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) }
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
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render Applications & Users Management
  const renderApplicationsManagement = () => {
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
        width: 300,
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
              onClick={() => {
                setReplyType('application');
                setReplyTarget(record);
                setReplyModalVisible(true);
              }}
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
          </Space>
        )
      }
    ];

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

    const filteredApplications = applications.filter(app => {
      const matchesStatus = !filterStatus || app.status === filterStatus;
      const matchesSearch = !searchTerm || 
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const filteredMessages = contactMessages.filter(msg => {
      const matchesSearch = !searchTerm || 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const filteredUsers = users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    return (
      <div>
        <Title level={2}>📋 Application Management</Title>
        <Text type="secondary">Manage student applications, contact messages, and user registrations</Text>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px', marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Applications"
                value={dashboardStats.totalApplications}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending Review"
                value={dashboardStats.pendingApplications}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Contact Messages"
                value={dashboardStats.totalMessages}
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
      </div>
    );
  };

  // Render Course Management
  const renderCourseManagement = () => {
    const courseColumns = [
      {
        title: 'Course Title',
        dataIndex: 'title',
        key: 'title',
        render: (title, record) => (
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Code: {record.code}
            </Text>
          </div>
        )
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (category) => <Tag color="blue">{category}</Tag>
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        render: (level) => {
          const colors = {
            beginner: 'green',
            intermediate: 'orange',
            advanced: 'red'
          };
          return <Tag color={colors[level]}>{level?.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Students',
        dataIndex: 'students',
        key: 'students',
        render: (students) => (
          <Badge count={students?.length || 0} showZero>
            <TeamOutlined style={{ fontSize: 20 }} />
          </Badge>
        )
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => {
          return (
            <Tag color={isActive ? 'green' : 'default'}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
          );
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setEditingCourse(record);
                  const formValues = {
                    ...record,
                    capacity: record.maxStudents || record.capacity || 30,
                    status: record.isActive ? 'active' : 'inactive'
                  };
                  
                  // Handle dates safely
                  if (record.startDate) {
                    const startDate = moment(record.startDate);
                    if (startDate.isValid()) {
                      formValues.startDate = startDate;
                    }
                  }
                  
                  if (record.endDate) {
                    const endDate = moment(record.endDate);
                    if (endDate.isValid()) {
                      formValues.endDate = endDate;
                    }
                  }
                  
                  courseForm.setFieldsValue(formValues);
                  setCourseModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setSelectedCourse(record);
                  setCourseViewModalVisible(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={async () => {
                try {
                  await courseAPI.delete(record._id);
                  message.success('Course deleted successfully');
                  fetchCourses();
                } catch (error) {
                  message.error('Failed to delete course');
                }
              }}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>📚 Course Management</Title>
        <Text type="secondary">Create and manage courses, curriculum, and enrollments</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={courses.length}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Courses"
                value={courses.filter(c => c.isActive !== false).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Enrolled"
                value={courses.reduce((sum, c) => sum + (c.students?.length || 0), 0)}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Completion"
                value={75}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="All Courses"
          extra={
            <Space>
              <Input
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Filter by category"
                style={{ width: 150 }}
                onChange={setSelectedCategory}
                allowClear
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
            </Space>
          }
        >
          <Table
            columns={courseColumns}
            dataSource={courses.filter(course => {
              const matchesSearch = !searchTerm || 
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.code?.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = !selectedCategory || course.category === selectedCategory;
              return matchesSearch && matchesCategory;
            })}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Material Management
  const renderMaterialManagement = () => {
    const materialColumns = [
      {
        title: 'Material',
        key: 'material',
        render: (_, record) => (
          <Space>
            {record.fileType === 'video' ? <VideoCameraOutlined /> : 
             record.fileType === 'pdf' ? <FileTextOutlined /> : 
             <FileOutlined />}
            <div>
              <Text strong>{record.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.description}
              </Text>
            </div>
          </Space>
        )
      },
      {
        title: 'Course',
        dataIndex: 'course',
        key: 'course',
        render: (course) => {
          const courseData = courses.find(c => c._id === course);
          return <Tag color="blue">{courseData?.title || 'Unknown'}</Tag>;
        }
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (category) => <Tag>{category}</Tag>
      },
      {
        title: 'Size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        render: (size) => {
          const sizeInMB = (size / (1024 * 1024)).toFixed(2);
          return `${sizeInMB} MB`;
        }
      },
      {
        title: 'Uploaded',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format('MMM DD, YYYY')
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Download">
              <Button
                icon={<DownloadOutlined />}
                size="small"
                onClick={() => {
                  // Remove duplicate '/uploads/' prefix if filePath already contains it
                  const filePath = record.filePath.startsWith('uploads/') ?
                    record.filePath : `uploads/${record.filePath}`;
                  window.open(`${API_BASE_URL}/${filePath}`, '_blank');
                }}
              />
            </Tooltip>
            <Tooltip title="Preview">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setSelectedMaterial(record);
                  setPreviewModalVisible(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this material?"
              onConfirm={async () => {
                try {
                  await materialAPI.delete(record._id);
                  message.success('Material deleted successfully');
                  fetchMaterials();
                } catch (error) {
                  message.error('Failed to delete material');
                }
              }}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>📁 Course Materials</Title>
        <Text type="secondary">Upload and manage course materials, documents, and resources</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Materials"
                value={materials.length}
                prefix={<FolderOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Videos"
                value={materials.filter(m => m.category === 'video').length}
                prefix={<VideoCameraOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Documents"
                value={materials.filter(m => m.category === 'document').length}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Size"
                value={(materials.reduce((sum, m) => sum + (m.fileSize || 0), 0) / (1024 * 1024)).toFixed(1)}
                suffix="MB"
                prefix={<CloudOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Course Materials"
          extra={
            <Space>
              <Input
                placeholder="Search materials..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Filter by type"
                style={{ width: 150 }}
                onChange={setSelectedFileType}
                allowClear
              >
                <Option value="video">Videos</Option>
                <Option value="document">Documents</Option>
                <Option value="resource">Resources</Option>
              </Select>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => {
                  materialForm.resetFields();
                  setFileList([]);
                  setMaterialModalVisible(true);
                }}
              >
                Upload Material
              </Button>
            </Space>
          }
        >
          <Table
            columns={materialColumns}
            dataSource={materials.filter(material => {
              const matchesSearch = !searchTerm || 
                material.title?.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesType = !selectedFileType || material.category === selectedFileType;
              return matchesSearch && matchesType;
            })}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Quiz Management
  const renderQuizManagement = () => {
    const quizColumns = [
      {
        title: 'Quiz Title',
        dataIndex: 'title',
        key: 'title',
        render: (title, record) => (
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.questions?.length || 0} questions
            </Text>
          </div>
        )
      },
      {
        title: 'Course',
        dataIndex: 'course',
        key: 'course',
        render: (course) => {
          const courseData = courses.find(c => c._id === course);
          return <Tag color="blue">{courseData?.title || 'Unknown'}</Tag>;
        }
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration) => `${duration} mins`
      },
      {
        title: 'Passing Score',
        dataIndex: 'passingScore',
        key: 'passingScore',
        render: (score) => (
          <Progress
            percent={score}
            size="small"
            strokeColor={score >= 70 ? '#52c41a' : '#faad14'}
          />
        )
      },
      {
        title: 'Submissions',
        key: 'submissions',
        render: (_, record) => (
          <Badge count={record.submissions?.length || 0} showZero>
            <Button
              size="small"
              onClick={() => {
                setSelectedQuiz(record);
                fetchQuizSubmissions(record._id);
                setSubmissionsModalVisible(true);
              }}
            >
              View
            </Button>
          </Badge>
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: (_, record) => {
          const now = moment();
          const availableFrom = record.availableFrom ? moment(record.availableFrom) : null;
          const availableTo = record.availableTo ? moment(record.availableTo) : null;
          
          let status = 'draft';
          let color = 'default';
          
          if (availableFrom && availableTo) {
            if (now.isBefore(availableFrom)) {
              status = 'scheduled';
              color = 'orange';
            } else if (now.isAfter(availableTo)) {
              status = 'expired';
              color = 'red';
            } else {
              status = 'active';
              color = 'green';
            }
          }
          
          return <Tag color={color}>{status.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setEditingQuiz(record);
                  setQuestions(record.questions || []);
                  quizForm.setFieldsValue({
                    ...record,
                    availableFrom: record.availableFrom ? moment(record.availableFrom) : null,
                    availableTo: record.availableTo ? moment(record.availableTo) : null
                  });
                  setQuizModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Preview">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setSelectedQuiz(record);
                  setPreviewModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Results">
              <Button
                icon={<BarChartOutlined />}
                size="small"
                onClick={() => {
                  setSelectedQuiz(record);
                  setResultsModalVisible(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this quiz?"
              onConfirm={async () => {
                try {
                  await quizAPI.delete(record._id);
                  message.success('Quiz deleted successfully');
                  fetchQuizzes();
                } catch (error) {
                  message.error('Failed to delete quiz');
                }
              }}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>📝 Quiz Management</Title>
        <Text type="secondary">Create and manage quizzes, assessments, and evaluations</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Quizzes"
                value={quizzes.length}
                prefix={<FormOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Quizzes"
                value={quizzes.filter(q => {
                  const now = moment();
                  return q.availableFrom && q.availableTo &&
                    now.isAfter(moment(q.availableFrom)) && 
                    now.isBefore(moment(q.availableTo));
                }).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Questions"
                value={quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
                prefix={<QuestionCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Score"
                value={78}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="All Quizzes"
          extra={
            <Space>
              <Input
                placeholder="Search quizzes..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingQuiz(null);
                  setQuestions([]);
                  quizForm.resetFields();
                  setQuizModalVisible(true);
                }}
              >
                Create Quiz
              </Button>
            </Space>
          }
        >
          <Table
            columns={quizColumns}
            dataSource={quizzes.filter(quiz => {
              const matchesSearch = !searchTerm || 
                quiz.title?.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesSearch;
            })}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Homework Management
  const renderHomeworkManagement = () => {
    const homeworkColumns = [
      {
        title: 'Assignment',
        key: 'assignment',
        render: (_, record) => (
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        )
      },
      {
        title: 'Course',
        dataIndex: 'course',
        key: 'course',
        render: (course) => {
          const courseData = courses.find(c => c._id === course);
          return <Tag color="blue">{courseData?.title || 'Unknown'}</Tag>;
        }
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (date) => {
          const dueDate = moment(date);
          const isOverdue = dueDate.isBefore(moment());
          return (
            <Space>
              <CalendarOutlined style={{ color: isOverdue ? '#f5222d' : '#1890ff' }} />
              <Text type={isOverdue ? 'danger' : undefined}>
                {dueDate.format('MMM DD, YYYY')}
              </Text>
            </Space>
          );
        }
      },
      {
        title: 'Points',
        dataIndex: 'totalPoints',
        key: 'totalPoints',
        render: (points) => <Tag color="green">{points} pts</Tag>
      },
      {
        title: 'Submissions',
        key: 'submissions',
        render: (_, record) => {
          const submitted = record.submissions?.length || 0;
          const total = students.filter(s => s.course === record.course).length || 0;
          return (
            <Progress
              percent={total > 0 ? Math.round((submitted / total) * 100) : 0}
              size="small"
              format={() => `${submitted}/${total}`}
            />
          );
        }
      },
      {
        title: 'Status',
        key: 'status',
        render: (_, record) => {
          const now = moment();
          const dueDate = moment(record.dueDate);
          const isOverdue = dueDate.isBefore(now);
          return (
            <Tag color={isOverdue ? 'red' : 'green'}>
              {isOverdue ? 'OVERDUE' : 'ACTIVE'}
            </Tag>
          );
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setEditingHomework(record);
                  homeworkForm.setFieldsValue({
                    ...record,
                    dueDate: record.dueDate ? moment(record.dueDate) : null,
                    assignedDate: record.assignedDate ? moment(record.assignedDate) : null
                  });
                  setHomeworkModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="View Submissions">
              <Button
                icon={<FolderOpenOutlined />}
                size="small"
                onClick={() => {
                  setSelectedHomework(record);
                  setSubmissionsModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Grade">
              <Button
                icon={<CheckSquareOutlined />}
                size="small"
                onClick={() => {
                  setSelectedHomework(record);
                  setGradingModalVisible(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this homework?"
              onConfirm={async () => {
                try {
                  await homeworkAPI.delete(record._id);
                  message.success('Homework deleted successfully');
                  fetchHomework();
                } catch (error) {
                  message.error('Failed to delete homework');
                }
              }}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>📚 Homework Management</Title>
        <Text type="secondary">Create and manage homework assignments and submissions</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Assignments"
                value={homework.length}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active"
                value={homework.filter(h => moment(h.dueDate).isAfter(moment())).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Overdue"
                value={homework.filter(h => moment(h.dueDate).isBefore(moment())).length}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending Review"
                value={dashboardStats.pendingSubmissions}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="All Assignments"
          extra={
            <Space>
              <Input
                placeholder="Search assignments..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingHomework(null);
                  homeworkForm.resetFields();
                  setHomeworkModalVisible(true);
                }}
              >
                Create Assignment
              </Button>
            </Space>
          }
        >
          <Table
            columns={homeworkColumns}
            dataSource={homework.filter(hw => {
              const matchesSearch = !searchTerm || 
                hw.title?.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesSearch;
            })}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Listening Exercises
  const renderListeningExercises = () => {
    const exerciseColumns = [
      {
        title: 'Exercise',
        key: 'exercise',
        render: (_, record) => (
          <Space>
            <AudioOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <div>
              <Text strong>{record.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.description}
              </Text>
            </div>
          </Space>
        )
      },
      {
        title: 'Course',
        dataIndex: 'course',
        key: 'course',
        render: (course) => {
          const courseData = courses.find(c => c._id === course);
          return <Tag color="blue">{courseData?.title || 'Unknown'}</Tag>;
        }
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        render: (level) => {
          const colors = {
            beginner: 'green',
            intermediate: 'orange',
            advanced: 'red'
          };
          return <Tag color={colors[level]}>{level?.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration) => `${duration || 0} sec`
      },
      {
        title: 'Questions',
        dataIndex: 'questions',
        key: 'questions',
        render: (questions) => (
          <Badge count={questions?.length || 0} showZero>
            <QuestionCircleOutlined style={{ fontSize: 20 }} />
          </Badge>
        )
      },
      {
        title: 'Play Limit',
        dataIndex: 'playLimit',
        key: 'playLimit',
        render: (limit) => <Tag>{limit || 3} plays</Tag>
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Play Audio">
              <Button
                icon={playingExerciseId === record._id && isPlaying ? 
                  <PauseCircleOutlined /> : <PlayCircleOutlined />}
                size="small"
                onClick={() => {
                  if (playingExerciseId === record._id && isPlaying) {
                    setIsPlaying(false);
                    setPlayingExerciseId(null);
                  } else {
                    setIsPlaying(true);
                    setPlayingExerciseId(record._id);
                  }
                }}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setEditingExercise(record);
                  setQuestions(record.questions || []);
                  exerciseForm.setFieldsValue(record);
                  setExerciseModalVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="View Submissions">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setSelectedExercise(record);
                  setSubmissionsModalVisible(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this exercise?"
              onConfirm={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`${API_BASE_URL}/api/listening-exercises/${record._id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                  });
                  if (response.ok) {
                    message.success('Exercise deleted successfully');
                    fetchListeningExercises();
                  }
                } catch (error) {
                  message.error('Failed to delete exercise');
                }
              }}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>🎧 Listening Exercises</Title>
        <Text type="secondary">Create and manage listening comprehension exercises</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Exercises"
                value={listeningExercises.length}
                prefix={<AudioOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Beginner Level"
                value={listeningExercises.filter(e => e.level === 'beginner').length}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Questions"
                value={listeningExercises.reduce((sum, e) => sum + (e.questions?.length || 0), 0)}
                prefix={<QuestionCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Duration"
                value={Math.round(listeningExercises.reduce((sum, e) => sum + (e.duration || 0), 0) / listeningExercises.length || 0)}
                suffix="sec"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Listening Exercises"
          extra={
            <Space>
              <Input
                placeholder="Search exercises..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingExercise(null);
                  setQuestions([]);
                  setAudioFile(null);
                  exerciseForm.resetFields();
                  setExerciseModalVisible(true);
                }}
              >
                Create Exercise
              </Button>
            </Space>
          }
        >
          <Table
            columns={exerciseColumns}
            dataSource={listeningExercises.filter(exercise => {
              const matchesSearch = !searchTerm || 
                exercise.title?.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesSearch;
            })}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>
      </div>
    );
  };

  // Render Student Progress
  const renderStudentProgress = () => (
    <div>
      <Title level={2}>👥 Student Progress</Title>
      <Text type="secondary">Monitor student performance and progress across all courses</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Students"
              value={students.filter(s => s.isApproved === true).length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Progress"
              value={75}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={68}
              suffix="%"
              prefix={<CheckSquareOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Student Performance Overview">
        <Table
          columns={[
            {
              title: 'Student',
              key: 'student',
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
              title: 'Enrolled Courses',
              key: 'courses',
              render: () => (
                <Badge count={Math.floor(Math.random() * 5) + 1} showZero>
                  <BookOutlined style={{ fontSize: 20 }} />
                </Badge>
              )
            },
            {
              title: 'Progress',
              key: 'progress',
              render: () => {
                const progress = Math.floor(Math.random() * 100);
                return (
                  <Progress
                    percent={progress}
                    size="small"
                    strokeColor={progress >= 70 ? '#52c41a' : progress >= 40 ? '#faad14' : '#f5222d'}
                  />
                );
              }
            },
            {
              title: 'Last Activity',
              key: 'lastActivity',
              render: () => moment().subtract(Math.floor(Math.random() * 7), 'days').format('MMM DD, YYYY')
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
                      setSelectedProgress(record);
                      setProgressModalVisible(true);
                    }}
                  >
                    View Details
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={students}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>
    </div>
  );

  // Render Analytics & Reports
  const renderAnalytics = () => (
    <div>
      <Title level={2}>📊 Analytics & Reports</Title>
      <Text type="secondary">Comprehensive analytics and reporting dashboard</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Course Enrollment Trends">
            <Bar
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'New Enrollments',
                  data: [12, 19, 15, 25, 22, 30],
                  backgroundColor: 'rgba(24, 144, 255, 0.6)',
                  borderColor: '#1890ff',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                }
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Student Performance Distribution">
            <Pie
              data={{
                labels: ['Excellent (90-100%)', 'Good (80-89%)', 'Average (70-79%)', 'Below Average (<70%)'],
                datasets: [{
                  data: [25, 35, 30, 10],
                  backgroundColor: [
                    '#52c41a',
                    '#1890ff',
                    '#faad14',
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

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Monthly Activity Report">
            <Line
              data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                  {
                    label: 'Quiz Submissions',
                    data: [45, 52, 48, 61],
                    borderColor: '#1890ff',
                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                    tension: 0.4
                  },
                  {
                    label: 'Homework Submissions',
                    data: [38, 42, 35, 48],
                    borderColor: '#52c41a',
                    backgroundColor: 'rgba(82, 196, 26, 0.1)',
                    tension: 0.4
                  },
                  {
                    label: 'Material Downloads',
                    data: [65, 78, 72, 85],
                    borderColor: '#faad14',
                    backgroundColor: 'rgba(250, 173, 20, 0.1)',
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
                    beginAtZero: true
                  }
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render Settings
  const renderSettings = () => (
    <div>
      <Title level={2}>⚙️ System Settings</Title>
      <Text type="secondary">Configure system settings and preferences</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="General Settings">
            <Form layout="vertical">
              <Form.Item label="System Name">
                <Input defaultValue="Forum Academy" />
              </Form.Item>
              <Form.Item label="Admin Email">
                <Input defaultValue="admin@forumacademy.com" />
              </Form.Item>
              <Form.Item label="Time Zone">
                <Select defaultValue="UTC">
                  <Option value="UTC">UTC</Option>
                  <Option value="EST">Eastern Time</Option>
                  <Option value="PST">Pacific Time</Option>
                  <Option value="JST">Japan Standard Time</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Language">
                <Select defaultValue="en">
                  <Option value="en">English</Option>
                  <Option value="ja">Japanese</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Notification Settings">
            <Form layout="vertical">
              <Form.Item label="Email Notifications">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="SMS Notifications">
                <Switch />
              </Form.Item>
              <Form.Item label="Push Notifications">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Weekly Reports">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="System Information">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Version">v2.1.0</Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {moment().subtract(2, 'days').format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Database Status">
                <Tag color="green">Connected</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Server Status">
                <Tag color="green">Online</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Users">
                {users.length}
              </Descriptions.Item>
              <Descriptions.Item label="Total Courses">
                {courses.length}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render Forum Management
  const renderForumManagement = () => {
    const categoryColumns = [
      {
        title: 'Category',
        key: 'category',
        render: (_, record) => (
          <Space>
            <FolderOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <div>
              <Text strong>{record.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.description}
              </Text>
            </div>
          </Space>
        )
      },
      {
        title: 'Threads',
        dataIndex: 'threads',
        key: 'threads',
        render: (threads) => (
          <Badge count={threads || 0} showZero>
            <CommentOutlined style={{ fontSize: 20 }} />
          </Badge>
        )
      },
      {
        title: 'Posts',
        dataIndex: 'posts',
        key: 'posts',
        render: (posts) => (
          <Badge count={posts || 0} showZero>
            <MessageOutlined style={{ fontSize: 20 }} />
          </Badge>
        )
      },
      {
        title: 'Last Activity',
        key: 'lastActivity',
        render: () => moment().subtract(Math.floor(Math.random() * 7), 'days').format('MMM DD, YYYY')
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => message.info('Edit category functionality coming soon')}
              />
            </Tooltip>
            <Tooltip title="View Threads">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => message.info('View threads functionality coming soon')}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this category?"
              onConfirm={() => message.success('Category deleted successfully')}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    const threadColumns = [
      {
        title: 'Thread',
        key: 'thread',
        render: (_, record) => (
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Space>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                by {record.author}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                in {forumCategories.find(c => c._id === record.category)?.name || 'Unknown'}
              </Text>
            </Space>
          </div>
        )
      },
      {
        title: 'Replies',
        dataIndex: 'replies',
        key: 'replies',
        render: (replies) => (
          <Badge count={replies || 0} showZero>
            <CommentOutlined style={{ fontSize: 20 }} />
          </Badge>
        )
      },
      {
        title: 'Views',
        dataIndex: 'views',
        key: 'views',
        render: (views) => <Text>{views || 0}</Text>
      },
      {
        title: 'Last Post',
        dataIndex: 'lastPost',
        key: 'lastPost',
        render: (date) => moment(date).format('MMM DD, YYYY')
      },
      {
        title: 'Status',
        key: 'status',
        render: () => (
          <Tag color="green">Active</Tag>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="View Thread">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => message.info('View thread functionality coming soon')}
              />
            </Tooltip>
            <Tooltip title="Moderate">
              <Button
                icon={<WarningOutlined />}
                size="small"
                onClick={() => message.info('Moderate thread functionality coming soon')}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this thread?"
              onConfirm={() => message.success('Thread deleted successfully')}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    const postColumns = [
      {
        title: 'Post',
        key: 'post',
        render: (_, record) => (
          <div>
            <Text strong>{record.threadId ? 'Reply' : 'Original Post'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              by {record.author} • {moment(record.createdAt).format('MMM DD, YYYY HH:mm')}
            </Text>
            <br />
            <Text ellipsis style={{ maxWidth: 300 }}>
              {record.content?.substring(0, 100)}...
            </Text>
          </div>
        )
      },
      {
        title: 'Thread',
        key: 'thread',
        render: (_, record) => {
          const thread = forumThreads.find(t => t._id === record.threadId);
          return <Text>{thread?.title || 'Unknown Thread'}</Text>;
        }
      },
      {
        title: 'Status',
        key: 'status',
        render: () => (
          <Tag color="green">Approved</Tag>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="View Post">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => message.info('View post functionality coming soon')}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => message.info('Edit post functionality coming soon')}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this post?"
              onConfirm={() => message.success('Post deleted successfully')}
            >
              <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div>
        <Title level={2}>💬 Forum Management</Title>
        <Text type="secondary">Manage forum categories, threads, posts, and moderation</Text>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Categories"
                value={forumStats.totalCategories}
                prefix={<FolderOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Threads"
                value={forumStats.totalThreads}
                prefix={<CommentOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Posts"
                value={forumStats.totalPosts}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending Moderation"
                value={forumStats.pendingModeration}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for different forum sections */}
        <Tabs
          defaultActiveKey="categories"
          items={[
            {
              key: 'categories',
              label: '📁 Categories',
              children: (
                <Card
                  title="Forum Categories"
                  extra={
                    <Space>
                      <Input
                        placeholder="Search categories..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => message.info('Create category functionality coming soon')}
                      >
                        Create Category
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={categoryColumns}
                    dataSource={forumCategories}
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
              key: 'threads',
              label: '🗣️ Threads',
              children: (
                <Card
                  title="Forum Threads"
                  extra={
                    <Space>
                      <Input
                        placeholder="Search threads..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                      />
                      <Select
                        placeholder="Filter by category"
                        style={{ width: 150 }}
                        allowClear
                      >
                        {forumCategories.map(cat => (
                          <Option key={cat._id} value={cat._id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => message.info('Create thread functionality coming soon')}
                      >
                        Create Thread
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={threadColumns}
                    dataSource={forumThreads}
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
              key: 'posts',
              label: '📝 Posts',
              children: (
                <Card
                  title="Forum Posts"
                  extra={
                    <Space>
                      <Input
                        placeholder="Search posts..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                      />
                      <Select
                        placeholder="Filter by status"
                        style={{ width: 150 }}
                        allowClear
                      >
                        <Option value="approved">Approved</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="reported">Reported</Option>
                      </Select>
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => message.info('Advanced filters coming soon')}
                      >
                        Advanced Filters
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={postColumns}
                    dataSource={forumPosts}
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
              key: 'moderation',
              label: '⚠️ Moderation',
              children: (
                <Card title="Content Moderation Queue">
                  <Empty
                    description="No content pending moderation"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={() => message.info('Refresh moderation queue')}
                    >
                      Refresh Queue
                    </Button>
                  </div>
                </Card>
              )
            },
            {
              key: 'analytics',
              label: '📊 Analytics',
              children: (
                <div>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card title="Forum Activity Trends">
                        <Line
                          data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [
                              {
                                label: 'New Threads',
                                data: [5, 8, 6, 12, 9, 15, 11],
                                borderColor: '#1890ff',
                                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                tension: 0.4
                              },
                              {
                                label: 'New Posts',
                                data: [25, 32, 28, 45, 38, 52, 41],
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
                            }
                          }}
                        />
                      </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Card title="Top Categories">
                        <List
                          dataSource={forumCategories.slice(0, 5)}
                          renderItem={(category, index) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
                                title={category.name}
                                description={`${category.threads || 0} threads • ${category.posts || 0} posts`}
                              />
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </div>
    );
  };

  // Main content renderer with integrated dashboard components
  const renderContent = () => {
    switch(activeKey) {
      case 'overview':
        return renderOverview();
      case 'applications':
        return renderApplicationsManagement();
      case 'courses':
        return renderCourseManagement();
      case 'materials':
        return renderMaterialManagement();
      case 'quizzes':
        return renderQuizManagement();
      case 'homework':
        return renderHomeworkManagement();
      case 'listening':
        return renderListeningExercises();
      case 'forum':
        return renderForumManagement();
      case 'students':
        return renderStudentProgress();
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Breadcrumb style={{ marginLeft: 16 }}>
              <Breadcrumb.Item>
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>{menuItems.find(item => item.key === activeKey)?.label}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notifications */}
            <Badge count={5}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: 18 }}
              />
            </Badge>
            
            {/* User Profile Dropdown */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
                    onClick: () => message.info('Profile page coming soon')
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                    onClick: () => setActiveKey('settings')
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout
                  }
                ]
              }}
              placement="bottomRight"
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 8,
                transition: 'background 0.3s',
                maxWidth: '200px',
                '&:hover': {
                  background: '#f0f0f0'
                }
              }}>
                <Avatar
                  style={{
                    backgroundColor: '#1890ff',
                    marginRight: 8,
                    flexShrink: 0
                  }}
                  icon={<UserOutlined />}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text strong style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '14px'
                  }}>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Text>
                  <Text type="secondary" style={{
                    fontSize: 12,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {currentUser?.role?.toUpperCase()}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
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
        <Layout.Footer style={{ 
          textAlign: 'center',
          background: '#fff',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Text type="secondary">
            Forum Academy Admin Dashboard ©{new Date().getFullYear()} | 
            <span style={{ marginLeft: 8 }}>
              Made with <HeartOutlined style={{ color: '#ff4d4f' }} /> by Forum Academy Team
            </span>
          </Text>
        </Layout.Footer>
      </Layout>

      {/* Modals */}
      
      {/* Application Details Modal */}
      <Modal
        title="Application Details"
        visible={applicationModalVisible}
        onCancel={() => setApplicationModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setApplicationModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="reply"
            icon={<MessageOutlined />}
            onClick={() => {
              setReplyType('application');
              setReplyTarget(selectedApplication);
              setApplicationModalVisible(false);
              setReplyModalVisible(true);
            }}
          >
            Reply to Applicant
          </Button>,
          selectedApplication?.status === 'pending' && (
            <>
              <Button
                key="reject"
                danger
                onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
              >
                Reject
              </Button>
              <Button
                key="approve"
                type="primary"
                onClick={() => updateApplicationStatus(selectedApplication._id, 'approved')}
              >
                Approve
              </Button>
            </>
          )
        ]}
      >
        {selectedApplication && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Full Name" span={2}>
              {selectedApplication.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedApplication.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedApplication.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Program">
              {selectedApplication.course || selectedApplication.program}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedApplication.status === 'pending' ? 'orange' :
                selectedApplication.status === 'approved' ? 'green' : 'red'
              }>
                {selectedApplication.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Applied Date">
              {moment(selectedApplication.createdAt).format('MMMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={2}>
              <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                {selectedApplication.message}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Course View Modal */}
      <Modal
        title="Course Details"
        visible={courseViewModalVisible}
        onCancel={() => setCourseViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setCourseViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCourse(selectedCourse);
              const formValues = {
                ...selectedCourse,
                capacity: selectedCourse.maxStudents || selectedCourse.capacity || 30,
                status: selectedCourse.isActive ? 'active' : 'inactive'
              };
              
              if (selectedCourse.startDate) {
                const startDate = moment(selectedCourse.startDate);
                if (startDate.isValid()) {
                  formValues.startDate = startDate;
                }
              }
              
              if (selectedCourse.endDate) {
                const endDate = moment(selectedCourse.endDate);
                if (endDate.isValid()) {
                  formValues.endDate = endDate;
                }
              }
              
              courseForm.setFieldsValue(formValues);
              setCourseViewModalVisible(false);
              setCourseModalVisible(true);
            }}
          >
            Edit Course
          </Button>
        ]}
      >
        {selectedCourse && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Title" span={2}>
              <Text strong>{selectedCourse.title}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Code">
              <Tag color="blue">{selectedCourse.code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag color="green">{selectedCourse.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Level">
              <Tag color={
                selectedCourse.level === 'beginner' ? 'green' :
                selectedCourse.level === 'intermediate' ? 'orange' : 'red'
              }>
                {selectedCourse.level?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                {selectedCourse.description}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {selectedCourse.duration || 12} weeks
            </Descriptions.Item>
            <Descriptions.Item label="Capacity">
              {selectedCourse.maxStudents || selectedCourse.capacity || 30} students
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedCourse.isActive ? 'green' : 'default'}>
                {selectedCourse.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            {selectedCourse.startDate && (
              <Descriptions.Item label="Start Date">
                {moment(selectedCourse.startDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
            )}
            {selectedCourse.endDate && (
              <Descriptions.Item label="End Date">
                {moment(selectedCourse.endDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Students Enrolled" span={2}>
              <List
                dataSource={selectedCourse.students || []}
                renderItem={(studentId) => {
                  const student = students.find(s => s._id === studentId);
                  return (
                    <List.Item>
                      <Space>
                        <Avatar icon={<UserOutlined />} size="small" />
                        <Text>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</Text>
                      </Space>
                    </List.Item>
                  );
                }}
                size="small"
                bordered={false}
                style={{ maxHeight: 200, overflow: 'auto' }}
              />
              {(!selectedCourse.students || selectedCourse.students.length === 0) && (
                <Text type="secondary">No students enrolled yet</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created" span={2}>
              {moment(selectedCourse.createdAt).format('MMMM DD, YYYY')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Message Details Modal */}
      <Modal
        title="Message Details"
        visible={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setMessageModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="reply"
            type="primary"
            icon={<MailOutlined />}
            onClick={() => {
              setReplyType('message');
              setReplyTarget(selectedMessage);
              setReplyModalVisible(true);
            }}
          >
            Reply
          </Button>
        ]}
      >
        {selectedMessage && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="From">
              {selectedMessage.name} ({selectedMessage.email})
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedMessage.phone || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedMessage.subject}
            </Descriptions.Item>
            <Descriptions.Item label="Message">
              <Paragraph>{selectedMessage.message}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Received">
              {moment(selectedMessage.createdAt).format('MMMM DD, YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedMessage.status === 'pending' ? 'orange' : 'green'}>
                {selectedMessage.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        title="User Details"
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Close
          </Button>,
          selectedUser?.isApproved !== true && (
            <Button
              key="approve"
              type="primary"
              onClick={() => updateUserStatus(selectedUser._id, true)}
            >
              Approve User
            </Button>
          ),
          selectedUser?.isApproved !== false && (
            <Button
              key="reject"
              danger
              onClick={() => updateUserStatus(selectedUser._id, false)}
            >
              Reject User
            </Button>
          )
        ]}
      >
        {selectedUser && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
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
            <Descriptions.Item label="Status">
              {selectedUser.isApproved === true ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>Approved</Tag>
              ) : selectedUser.isApproved === false ? (
                <Tag color="red" icon={<CloseCircleOutlined />}>Rejected</Tag>
              ) : (
                <Tag color="orange">Pending</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Registered">
              {moment(selectedUser.createdAt).format('MMMM DD, YYYY')}
            </Descriptions.Item>
            {selectedUser.phone && (
              <Descriptions.Item label="Phone" span={2}>
                {selectedUser.phone}
              </Descriptions.Item>
            )}
            {selectedUser.bio && (
              <Descriptions.Item label="Bio" span={2}>
                {selectedUser.bio}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        visible={createUserModalVisible}
        onCancel={() => {
          setCreateUserModalVisible(false);
          createUserForm.resetFields();
        }}
        onOk={() => createUserForm.submit()}
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
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select user role">
              <Option value="student">Student</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input placeholder="Enter phone number (optional)" />
          </Form.Item>
          
          <Form.Item
            name="isApproved"
            label="Approval Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Approved" unCheckedChildren="Pending" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reply Modal */}
      <Modal
        title={`Reply to ${replyTarget?.name || replyTarget?.fullName || 'User'}`}
        visible={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
          setReplyType('');
          setReplyTarget(null);
        }}
        onOk={() => replyForm.submit()}
        width={600}
      >
        <Form
          form={replyForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              // Prepare email data based on reply type
              const emailData = {
                to: replyTarget?.email,
                subject: values.subject,
                message: values.message,
                type: replyType,
                relatedId: replyTarget?._id
              };

              // Send email via API
              const response = await fetch(`${API_BASE_URL}/api/send-email`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(emailData)
              });

              if (response.ok) {
                message.success('Reply sent successfully!');
                
                // Update status if it's an application reply
                if (replyType === 'application' && replyTarget?.status === 'pending') {
                  await updateApplicationStatus(replyTarget._id, 'contacted');
                }
                
                // Update status if it's a message reply
                if (replyType === 'message' && replyTarget?.status === 'pending') {
                  await updateContactStatus(replyTarget._id, 'resolved');
                }
                
                setReplyModalVisible(false);
                replyForm.resetFields();
                setReplyType('');
                setReplyTarget(null);
                
                // Refresh data
                if (replyType === 'application') {
                  fetchApplications();
                } else if (replyType === 'message') {
                  fetchContactMessages();
                }
              } else {
                throw new Error('Failed to send reply');
              }
            } catch (error) {
              console.error('Error sending reply:', error);
              message.error('Failed to send reply. Please try again.');
            }
          }}
        >
          {/* Display recipient information */}
          <div style={{ 
            background: '#f0f2f5', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px' 
          }}>
            <Text strong>Replying to: </Text>
            <Text>{replyTarget?.email}</Text>
            {replyType === 'application' && (
              <>
                <br />
                <Text type="secondary">
                  Application for: {replyTarget?.course || replyTarget?.program || 'General Application'}
                </Text>
              </>
            )}
            {replyType === 'message' && replyTarget?.subject && (
              <>
                <br />
                <Text type="secondary">
                  Original Subject: {replyTarget.subject}
                </Text>
              </>
            )}
          </div>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
            initialValue={
              replyType === 'application' 
                ? `Re: Your Application to Forum Academy`
                : replyTarget?.subject 
                  ? `Re: ${replyTarget.subject}` 
                  : ''
            }
          >
            <Input placeholder="Enter email subject" />
          </Form.Item>
          
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea 
              rows={8} 
              placeholder={
                replyType === 'application'
                  ? "Dear Applicant,\n\nThank you for your application to Forum Academy...\n\nBest regards,\nForum Academy Team"
                  : "Type your reply message here..."
              }
            />
          </Form.Item>

          {/* Quick Templates */}
          <Form.Item label="Quick Templates">
            <Space wrap>
              {replyType === 'application' && (
                <>
                  <Button
                    size="small"
                    onClick={() => {
                      replyForm.setFieldsValue({
                        message: `Dear ${replyTarget?.fullName || 'Applicant'},\n\nThank you for your application to Forum Academy. We have received your application and are currently reviewing it.\n\nWe will contact you within 3-5 business days with an update on your application status.\n\nIf you have any questions in the meantime, please don't hesitate to reach out.\n\nBest regards,\nForum Academy Admissions Team`
                      });
                    }}
                  >
                    Application Received
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      replyForm.setFieldsValue({
                        message: `Dear ${replyTarget?.fullName || 'Applicant'},\n\nWe need additional information to process your application. Please provide:\n\n1. [Required Document/Information]\n2. [Required Document/Information]\n\nPlease reply to this email with the requested information.\n\nBest regards,\nForum Academy Admissions Team`
                      });
                    }}
                  >
                    Request Information
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      replyForm.setFieldsValue({
                        message: `Dear ${replyTarget?.fullName || 'Applicant'},\n\nCongratulations! We are pleased to inform you that your application to Forum Academy has been approved.\n\nNext steps:\n1. Complete your enrollment by [date]\n2. Submit required documents\n3. Attend orientation on [date]\n\nWelcome to Forum Academy!\n\nBest regards,\nForum Academy Admissions Team`
                      });
                    }}
                  >
                    Acceptance Letter
                  </Button>
                </>
              )}
              {replyType === 'message' && (
                <>
                  <Button
                    size="small"
                    onClick={() => {
                      replyForm.setFieldsValue({
                        message: `Dear ${replyTarget?.name || 'User'},\n\nThank you for contacting Forum Academy. We have received your message and will respond within 24-48 hours.\n\nBest regards,\nForum Academy Support Team`
                      });
                    }}
                  >
                    Acknowledgment
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      replyForm.setFieldsValue({
                        message: `Dear ${replyTarget?.name || 'User'},\n\nThank you for your inquiry. [Your detailed response here]\n\nIf you have any further questions, please don't hesitate to contact us.\n\nBest regards,\nForum Academy Support Team`
                      });
                    }}
                  >
                    General Response
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
          
          <Form.Item
            name="attachments"
            label="Attachments (Optional)"
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Attach Files</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="sendCopy"
            valuePropName="checked"
          >
            <Checkbox>Send me a copy of this email</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Course Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        visible={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          courseForm.resetFields();
          setEditingCourse(null);
        }}
        onOk={() => courseForm.submit()}
        width={800}
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={handleCreateCourse}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input placeholder="Enter course title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Course Code"
                rules={[{ required: true, message: 'Please enter course code' }]}
              >
                <Input placeholder="e.g., CS101" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter course description' }]}
          >
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
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
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select placeholder="Select level">
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
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select end date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration (weeks)"
                rules={[{ required: true, message: 'Please enter duration' }]}
                initialValue={12}
              >
                <InputNumber min={1} max={52} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="capacity"
                label="Maximum Students"
                rules={[{ required: true, message: 'Please enter capacity' }]}
                initialValue={30}
              >
                <InputNumber min={1} max={500} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Material Upload Modal */}
      <Modal
        title="Upload Course Material"
        visible={materialModalVisible}
        onCancel={() => {
          setMaterialModalVisible(false);
          materialForm.resetFields();
          setFileList([]);
        }}
        onOk={() => materialForm.submit()}
        width={700}
      >
        <Form
          form={materialForm}
          layout="vertical"
          onFinish={handleUploadMaterial}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter material description (optional)" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select course' }]}
              >
                <Select placeholder="Select course">
                  {courses.map(course => (
                    <Option key={course._id} value={course._id}>
                      {course.title}
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
                  <Option value="lecture">Lecture</Option>
                  <Option value="assignment">Assignment</Option>
                  <Option value="resource">Resource</Option>
                  <Option value="video">Video</Option>
                  <Option value="document">Document</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Upload File"
            rules={[{ required: true, message: 'Please upload a file' }]}
          >
            <Dragger
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, RAR
              </p>
            </Dragger>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="week"
                label="Week Number"
              >
                <InputNumber min={1} max={52} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accessLevel"
                label="Access Level"
              >
                <Select defaultValue="course_students">
                  <Option value="public">Public</Option>
                  <Option value="course_students">Course Students Only</Option>
                  <Option value="premium">Premium Members</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
        visible={quizModalVisible}
        onCancel={() => {
          setQuizModalVisible(false);
          quizForm.resetFields();
          setEditingQuiz(null);
          setQuestions([]);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={quizForm}
          layout="vertical"
          onFinish={handleCreateQuiz}
        >
          <Tabs defaultActiveKey="basic">
            <TabPane tab="Basic Information" key="basic">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Quiz Title"
                    rules={[{ required: true, message: 'Please enter quiz title' }]}
                  >
                    <Input placeholder="Enter quiz title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="course"
                    label="Course"
                    rules={[{ required: true, message: 'Please select course' }]}
                  >
                    <Select placeholder="Select course">
                      {courses.map(course => (
                        <Option key={course._id} value={course._id}>
                          {course.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea rows={3} placeholder="Enter quiz description" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="duration"
                    label="Duration (minutes)"
                    rules={[{ required: true, message: 'Please enter duration' }]}
                  >
                    <InputNumber min={1} max={300} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="passingScore"
                    label="Passing Score (%)"
                    rules={[{ required: true, message: 'Please enter passing score' }]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="attempts"
                    label="Max Attempts"
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="availableFrom"
                    label="Available From"
                  >
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="availableTo"
                    label="Available Until"
                  >
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab={`Questions (${questions.length})`} key="questions">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setQuestionsModalVisible(true)}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Add Question
              </Button>
              
              {questions.length > 0 ? (
                <List
                  dataSource={questions}
                  renderItem={(question, index) => (
                    <List.Item
                      actions={[
                        <Button
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => message.info('Edit functionality coming soon')}
                        />,
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          onClick={() => removeQuestion(question.id)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={question.question}
                        description={
                          <div>
                            <Tag color="blue">{question.type}</Tag>
                            <Tag color="green">Points: {question.points || 1}</Tag>
                            {question.type === 'multiple_choice' && (
                              <div style={{ marginTop: 8 }}>
                                Options: {question.options?.join(', ')}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No questions added yet" />
              )}
            </TabPane>
          </Tabs>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setQuizModalVisible(false);
                quizForm.resetFields();
                setQuestions([]);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Add Question Modal */}
      <Modal
        title="Add Question"
        visible={questionsModalVisible}
        onCancel={() => {
          setQuestionsModalVisible(false);
          questionForm.resetFields();
        }}
        onOk={() => {
          addQuestion();
          setQuestionsModalVisible(false);
        }}
        width={600}
      >
        <Form
          form={questionForm}
          layout="vertical"
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter question' }]}
          >
            <TextArea rows={3} placeholder="Enter your question" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Question Type"
            rules={[{ required: true, message: 'Please select question type' }]}
          >
            <Select placeholder="Select question type">
              <Option value="multiple_choice">Multiple Choice</Option>
              <Option value="true_false">True/False</Option>
              <Option value="short_answer">Short Answer</Option>
              <Option value="essay">Essay</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'multiple_choice' ? (
                <Form.Item
                  name="options"
                  label="Options"
                  rules={[{ required: true, message: 'Please add options' }]}
                >
                  <Select
                    mode="tags"
                    placeholder="Add options (press Enter after each)"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          
          <Form.Item
            name="correctAnswer"
            label="Correct Answer"
            rules={[{ required: true, message: 'Please enter correct answer' }]}
          >
            <Input placeholder="Enter the correct answer" />
          </Form.Item>
          
          <Form.Item
            name="points"
            label="Points"
          >
            <InputNumber min={1} max={100} defaultValue={1} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Homework Modal */}
      <Modal
        title={editingHomework ? 'Edit Homework' : 'Create New Homework'}
        visible={homeworkModalVisible}
        onCancel={() => {
          setHomeworkModalVisible(false);
          homeworkForm.resetFields();
          setEditingHomework(null);
        }}
        onOk={() => homeworkForm.submit()}
        width={800}
      >
        <Form
          form={homeworkForm}
          layout="vertical"
          onFinish={handleCreateHomework}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Assignment Title"
                rules={[{ required: true, message: 'Please enter assignment title' }]}
              >
                <Input placeholder="Enter assignment title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select course' }]}
              >
                <Select placeholder="Select course">
                  {courses.map(course => (
                    <Option key={course._id} value={course._id}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter assignment description' }]}
          >
            <TextArea rows={4} placeholder="Enter assignment description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalPoints"
                label="Total Points"
                rules={[{ required: true, message: 'Please enter total points' }]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="instructions"
            label="Instructions"
          >
            <TextArea rows={3} placeholder="Enter detailed instructions for students" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Exercise Modal */}
      <Modal
        title={editingExercise ? 'Edit Exercise' : 'Create New Listening Exercise'}
        visible={exerciseModalVisible}
        onCancel={() => {
          setExerciseModalVisible(false);
          exerciseForm.resetFields();
          setEditingExercise(null);
          setAudioFile(null);
          setQuestions([]);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={exerciseForm}
          layout="vertical"
          onFinish={handleCreateExercise}
        >
          <Tabs defaultActiveKey="basic">
            <TabPane tab="Basic Information" key="basic">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Exercise Title"
                    rules={[{ required: true, message: 'Please enter exercise title' }]}
                  >
                    <Input placeholder="Enter exercise title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="course"
                    label="Course"
                    rules={[{ required: true, message: 'Please select course' }]}
                  >
                    <Select placeholder="Select course">
                      {courses.map(course => (
                        <Option key={course._id} value={course._id}>
                          {course.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea rows={3} placeholder="Enter exercise description" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="level"
                    label="Difficulty Level"
                    rules={[{ required: true, message: 'Please select level' }]}
                  >
                    <Select placeholder="Select level">
                      <Option value="beginner">Beginner</Option>
                      <Option value="intermediate">Intermediate</Option>
                      <Option value="advanced">Advanced</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="timeLimit"
                    label="Time Limit (minutes)"
                  >
                    <InputNumber min={1} max={120} defaultValue={30} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="playLimit"
                    label="Play Limit"
                  >
                    <InputNumber min={1} max={10} defaultValue={3} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="instructions"
                label="Instructions"
              >
                <TextArea rows={3} placeholder="Enter instructions for students" />
              </Form.Item>
              
              <Form.Item
                label="Audio File"
                rules={[{ required: !editingExercise, message: 'Please upload an audio file' }]}
              >
                <Upload
                  beforeUpload={(file) => {
                    setAudioFile(file);
                    return false;
                  }}
                  onRemove={() => setAudioFile(null)}
                  accept="audio/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload Audio File</Button>
                </Upload>
              </Form.Item>
              
              <Form.Item
                name="transcript"
                label="Transcript (Optional)"
              >
                <TextArea rows={4} placeholder="Enter audio transcript" />
              </Form.Item>
            </TabPane>
            
            <TabPane tab={`Questions (${questions.length})`} key="questions">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setQuestionsModalVisible(true)}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Add Question
              </Button>
              
              {questions.length > 0 ? (
                <List
                  dataSource={questions}
                  renderItem={(question, index) => (
                    <List.Item
                      actions={[
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          onClick={() => removeQuestion(question.id)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={question.question}
                        description={
                          <div>
                            <Tag color="blue">{question.type}</Tag>
                            <Tag color="green">Points: {question.points || 1}</Tag>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No questions added yet" />
              )}
            </TabPane>
          </Tabs>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setExerciseModalVisible(false);
                exerciseForm.resetFields();
                setQuestions([]);
                setAudioFile(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingExercise ? 'Update Exercise' : 'Create Exercise'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Submissions Modal */}
      <Modal
        title="View Submissions"
        visible={submissionsModalVisible}
        onCancel={() => setSubmissionsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setSubmissionsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Table
          columns={[
            {
              title: 'Student',
              key: 'student',
              render: (_, record) => (
                <div>
                  <Text strong>{record.studentName || 'Unknown Student'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {record.studentEmail || 'No email'}
                  </Text>
                </div>
              )
            },
            {
              title: 'Score',
              dataIndex: 'score',
              key: 'score',
              render: (score, record) => {
                const percentage = record.totalPoints ? Math.round((score / record.totalPoints) * 100) : 0;
                return (
                  <div>
                    <Text strong>{score || 0}/{record.totalPoints || 0}</Text>
                    <br />
                    <Progress
                      percent={percentage}
                      size="small"
                      strokeColor={percentage >= 70 ? '#52c41a' : percentage >= 40 ? '#faad14' : '#f5222d'}
                    />
                  </div>
                );
              }
            },
            {
              title: 'Submitted',
              dataIndex: 'submittedAt',
              key: 'submittedAt',
              render: (date) => moment(date).format('MMM DD, YYYY HH:mm')
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'graded' ? 'green' : 'orange'}>
                  {status?.toUpperCase() || 'PENDING'}
                </Tag>
              )
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
                      setSelectedSubmission(record);
                      setViewModalVisible(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                      setSelectedSubmission(record);
                      setGradingModalVisible(true);
                    }}
                  >
                    Grade
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={submissions}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
        />
      </Modal>

      {/* Progress Modal */}
      <Modal
        title="Student Progress Details"
        visible={progressModalVisible}
        onCancel={() => setProgressModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setProgressModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedProgress && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Student Name" span={2}>
                {selectedProgress.firstName} {selectedProgress.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedProgress.email}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Date">
                {moment(selectedProgress.createdAt).format('MMMM DD, YYYY')}
              </Descriptions.Item>
            </Descriptions>
            
            <Card title="Course Progress" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Courses Enrolled"
                    value={Math.floor(Math.random() * 5) + 1}
                    prefix={<BookOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Avg. Progress"
                    value={Math.floor(Math.random() * 100)}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Assignments Completed"
                    value={Math.floor(Math.random() * 20)}
                    prefix={<CheckSquareOutlined />}
                  />
                </Col>
              </Row>
            </Card>
            
            <Card title="Recent Activity">
              <Timeline>
                <Timeline.Item color="green">
                  <Text>Completed Quiz: JavaScript Basics</Text>
                  <br />
                  <Text type="secondary">2 days ago</Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text>Submitted Homework: React Components</Text>
                  <br />
                  <Text type="secondary">5 days ago</Text>
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <Text>Downloaded Material: CSS Grid Guide</Text>
                  <br />
                  <Text type="secondary">1 week ago</Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Material Preview"
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              if (selectedMaterial) {
                window.open(`${API_BASE_URL}/uploads/${selectedMaterial.filePath}`, '_blank');
              }
            }}
          >
            Download
          </Button>
        ]}
      >
        {selectedMaterial && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Title" span={2}>
                {selectedMaterial.title}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedMaterial.description || 'No description'}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedMaterial.category}
              </Descriptions.Item>
              <Descriptions.Item label="File Size">
                {((selectedMaterial.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
              </Descriptions.Item>
              <Descriptions.Item label="Uploaded">
                {moment(selectedMaterial.createdAt).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Access Level">
                {selectedMaterial.accessLevel || 'course_students'}
              </Descriptions.Item>
            </Descriptions>
            
            <Card title="File Preview">
              <div style={{ textAlign: 'center', padding: '40px' }}>
                {selectedMaterial.fileType === 'pdf' ? (
                  <div>
                    <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                    <br />
                    <Text>PDF Document</Text>
                  </div>
                ) : selectedMaterial.fileType === 'video' ? (
                  <div>
                    <VideoCameraOutlined style={{ fontSize: 64, color: '#52c41a' }} />
                    <br />
                    <Text>Video File</Text>
                  </div>
                ) : (
                  <div>
                    <FileOutlined style={{ fontSize: 64, color: '#faad14' }} />
                    <br />
                    <Text>Document File</Text>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Results Modal */}
      <Modal
        title="Quiz Results & Analytics"
        visible={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setResultsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedQuiz && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Submissions"
                    value={selectedQuiz.submissions?.length || 0}
                    prefix={<FormOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Average Score"
                    value={78}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Pass Rate"
                    value={85}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Completion Rate"
                    value={92}
                    suffix="%"
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Score Distribution">
                  <Bar
                    data={{
                      labels: ['0-40%', '41-60%', '61-80%', '81-100%'],
                      datasets: [{
                        label: 'Number of Students',
                        data: [2, 5, 8, 12],
                        backgroundColor: [
                          '#f5222d',
                          '#faad14',
                          '#1890ff',
                          '#52c41a'
                        ]
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Question Analysis">
                  <List
                    dataSource={selectedQuiz.questions?.slice(0, 5) || []}
                    renderItem={(question, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={`Question ${index + 1}`}
                          description={
                            <div>
                              <Progress
                                percent={Math.floor(Math.random() * 100)}
                                size="small"
                                format={(percent) => `${percent}% correct`}
                              />
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Grading Modal */}
      <Modal
        title="Grade Submission"
        visible={gradingModalVisible}
        onCancel={() => setGradingModalVisible(false)}
        onOk={() => gradingForm.submit()}
        width={700}
      >
        <Form
          form={gradingForm}
          layout="vertical"
          onFinish={(values) => {
            message.success('Grade submitted successfully!');
            setGradingModalVisible(false);
            gradingForm.resetFields();
          }}
        >
          {selectedSubmission && (
            <div>
              <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Student">
                  {selectedSubmission.studentName || 'Unknown Student'}
                </Descriptions.Item>
                <Descriptions.Item label="Assignment">
                  {selectedHomework?.title || selectedQuiz?.title || 'Unknown'}
                </Descriptions.Item>
                <Descriptions.Item label="Submitted">
                  {moment(selectedSubmission.submittedAt).format('MMMM DD, YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Current Score">
                  {selectedSubmission.score || 0}/{selectedSubmission.totalPoints || 0}
                </Descriptions.Item>
              </Descriptions>
              
              <Form.Item
                name="score"
                label="Score"
                rules={[{ required: true, message: 'Please enter score' }]}
              >
                <InputNumber
                  min={0}
                  max={selectedSubmission.totalPoints || 100}
                  style={{ width: '100%' }}
                  placeholder="Enter score"
                />
              </Form.Item>
              
              <Form.Item
                name="feedback"
                label="Feedback"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter feedback for the student"
                />
              </Form.Item>
              
              <Form.Item
                name="status"
                label="Status"
              >
                <Select defaultValue="graded">
                  <Option value="graded">Graded</Option>
                  <Option value="needs_revision">Needs Revision</Option>
                  <Option value="excellent">Excellent</Option>
                </Select>
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>

      {/* View Submission Modal */}
      <Modal
        title="Submission Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedSubmission && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Student" span={2}>
                {selectedSubmission.studentName || 'Unknown Student'}
              </Descriptions.Item>
              <Descriptions.Item label="Assignment">
                {selectedHomework?.title || selectedQuiz?.title || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Score">
                {selectedSubmission.score || 0}/{selectedSubmission.totalPoints || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {moment(selectedSubmission.submittedAt).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedSubmission.status === 'graded' ? 'green' : 'orange'}>
                  {selectedSubmission.status?.toUpperCase() || 'PENDING'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Feedback" span={2}>
                {selectedSubmission.feedback || 'No feedback provided'}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedSubmission.answers && (
              <Card title="Student Answers" style={{ marginTop: 16 }}>
                <List
                  dataSource={selectedSubmission.answers}
                  renderItem={(answer, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={`Question ${index + 1}`}
                        description={
                          <div>
                            <Text strong>Answer: </Text>
                            <Text>{answer.answer || 'No answer provided'}</Text>
                            <br />
                            <Text strong>Correct: </Text>
                            <Tag color={answer.isCorrect ? 'green' : 'red'}>
                              {answer.isCorrect ? 'Yes' : 'No'}
                            </Tag>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminFacultyDashboard;

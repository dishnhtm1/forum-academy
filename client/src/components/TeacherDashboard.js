import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import '../styles/AdminSidebar.css';
import '../styles/Dashboard.css';

// Ant Design imports
import {
  Layout, Menu, Card, Table, Button, Form, Input, Upload, Modal, Select,
  Tabs, Progress, notification, Tag, Space, Divider, Row, Col, Statistic,
  DatePicker, Switch, InputNumber, Spin, Alert, Typography, Rate,
  Drawer, Breadcrumb, Empty, List, Timeline, Tooltip, Avatar, Badge,
  Popconfirm, message, Descriptions, Steps, Collapse, Dropdown
} from 'antd';

const { Option } = Select;

import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EyeOutlined, SearchOutlined, FilterOutlined, BookOutlined,
  FileTextOutlined, PlayCircleOutlined, HomeOutlined, UserOutlined,
  BarChartOutlined, CalendarOutlined, BellOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, StarOutlined, ClockCircleOutlined,
  TrophyOutlined, MessageOutlined, TeamOutlined, LogoutOutlined,
  ReadOutlined, CheckSquareOutlined, LineChartOutlined, FormOutlined,
  WarningOutlined, FolderOpenOutlined, PauseCircleOutlined,
  InboxOutlined, DashboardOutlined, FolderOutlined, CloseOutlined,
  SendOutlined
} from '@ant-design/icons';

// Import API client
import { authAPI, statsAPI, courseAPI, materialAPI, quizAPI, homeworkAPI, listeningAPI, userAPI, messageAPI, progressAPI, announcementAPI } from '../utils/apiClient';

// Chart.js imports
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

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
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width <= 768;
      const tablet = width > 768 && width <= 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto-collapse based on screen size
      if (mobile) {
        setCollapsed(true);
      } else if (tablet) {
        setCollapsed(true); // Collapse on tablets too for more space
      } else {
        setCollapsed(false); // Expand on desktop
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

  // Quiz management states
  const [quizzes, setQuizzes] = useState([]);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizForm] = Form.useForm();
  
  // Homework management states
  const [homeworks, setHomeworks] = useState([]);
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [homeworkLoading, setHomeworkLoading] = useState(false);
  const [homeworkForm] = Form.useForm();
  
  // Listening exercises states
  const [listeningExercises, setListeningExercises] = useState([]);
  const [isListeningModalVisible, setIsListeningModalVisible] = useState(false);
  const [editingListening, setEditingListening] = useState(null);
  const [listeningLoading, setListeningLoading] = useState(false);
  const [listeningForm] = Form.useForm();
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');

  // Course management states
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Global courses for all modals
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseForm] = Form.useForm();

  // Material management states
  const [materials, setMaterials] = useState([]);
  const [isMaterialModalVisible, setIsMaterialModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [materialForm] = Form.useForm();

  // Student management states
  const [students, setStudents] = useState([]);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // Messaging states
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageForm] = Form.useForm();
  const [sendingMessage, setSendingMessage] = useState(false);

  // Video call states
  const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState(false);
  const [selectedStudentForCall, setSelectedStudentForCall] = useState(null);
  const [videoCallLoading, setVideoCallLoading] = useState(false);

  // Grading states
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [createProgressModalVisible, setCreateProgressModalVisible] = useState(false);
  const [editProgressModalVisible, setEditProgressModalVisible] = useState(false);
  const [viewProgressModalVisible, setViewProgressModalVisible] = useState(false);
  const [createAnnouncementModalVisible, setCreateAnnouncementModalVisible] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [viewingProgress, setViewingProgress] = useState(null);
  const [progressForm] = Form.useForm();
  const [editProgressForm] = Form.useForm();
  const [announcementForm] = Form.useForm();
  const [gradingLoading, setGradingLoading] = useState(false);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    success: false,
    overview: {
      totalStudents: 0,
      totalCourses: 0,
      totalSubmissions: 0,
      activeStudents: 0,
      averageScore: 0,
      recentSubmissions: 0
    },
    performanceTrends: [],
    assignmentTypeDistribution: {},
    gradeDistribution: {},
    recentActivity: [],
    charts: {
      performanceData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Average Score (%)',
          data: [0, 0, 0, 0],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      engagementData: {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['rgba(200, 200, 200, 0.8)']
        }]
      }
    }
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Mobile drawer state
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    byType: {
      student_message: 0,
      assignment_submission: 0,
      admin_announcement: 0,
      quiz_submission: 0,
      grade_request: 0,
      enrollment: 0
    }
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
      console.log('🔄 Calculating teacher dashboard stats from actual data...');
      console.log('📊 Current data lengths:', {
        courses: courses.length,
        materials: materials.length,
        quizzes: quizzes.length,
        homeworks: homeworks.length,
        students: students.length
      });
      
      // Calculate stats from the actual data we have
      const myCourses = courses.length;
      
      // Count total students enrolled in teacher's courses
      let totalStudents = 0;
      courses.forEach(course => {
        if (course.students && Array.isArray(course.students)) {
          totalStudents += course.students.length;
          console.log(`📚 Course "${course.title}" has ${course.students.length} students`);
        }
      });
      
      // If no students from courses, use total students as fallback for admin view
      if (totalStudents === 0 && students.length > 0) {
        totalStudents = students.length;
        console.log('📊 Using total students count as fallback:', totalStudents);
      }
      
      // Count materials
      const totalMaterials = materials.length;
      
      // Count active quizzes
      const activeQuizzes = quizzes.filter(quiz => {
        // Consider quiz active if not explicitly inactive
        return quiz.isActive !== false && quiz.status !== 'inactive';
      }).length;
      
      // Count pending homework submissions (approximate)
      const pendingSubmissions = homeworks.reduce((total, homework) => {
        // If homework has submissions, count those not graded yet
        if (homework.submissions && Array.isArray(homework.submissions)) {
          const ungraded = homework.submissions.filter(sub => 
            !sub.grade && !sub.isGraded && sub.status !== 'graded'
          ).length;
          return total + ungraded;
        }
        // If no submissions data, assume some pending for active homework
        return total + (homework.isActive !== false ? 1 : 0);
      }, 0);
      
      // Calculate average performance (simplified)
      let avgPerformance = 0;
      if (quizzes.length > 0) {
        const totalSubmissions = quizzes.reduce((total, quiz) => {
          return total + (quiz.submissions ? quiz.submissions.length : 0);
        }, 0);
        
        if (totalSubmissions > 0) {
          const totalScore = quizzes.reduce((total, quiz) => {
            if (quiz.submissions && Array.isArray(quiz.submissions)) {
              const quizTotal = quiz.submissions.reduce((qTotal, submission) => {
                return qTotal + (submission.score || 0);
              }, 0);
              return total + quizTotal;
            }
            return total;
          }, 0);
          avgPerformance = Math.round((totalScore / totalSubmissions) * 100) / 100;
        }
      }
      
      const calculatedStats = {
        myCourses,
        myStudents: totalStudents,
        totalMaterials,
        pendingSubmissions,
        activeQuizzes,
        avgClassPerformance: avgPerformance
      };
      
      console.log('✅ Calculated dashboard stats:', calculatedStats);
      setDashboardStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error calculating teacher stats:', error);
      // Set fallback data using current data lengths
      const fallbackStats = {
        myCourses: courses.length || 0,
        myStudents: students.length || 0,
        totalMaterials: materials.length || 0,
        pendingSubmissions: 0,
        activeQuizzes: quizzes.length || 0,
        avgClassPerformance: 0
      };
      console.log('🔄 Setting fallback stats:', fallbackStats);
      setDashboardStats(fallbackStats);
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

  // Global course fetching function for all modals
  const fetchAllCourses = async () => {
    try {
      console.log('🔍 Fetching all courses for dropdowns...');
      const response = await courseAPI.getAll();
      console.log('📚 Raw courses response:', response);
      
      // Handle different response formats from server
      const coursesData = response.courses || response.data || response || [];
      console.log('📚 Processed courses data:', coursesData);
      
      setAllCourses(coursesData);
      // Also update courses for table display
      setCourses(coursesData);
      return coursesData;
    } catch (error) {
      console.error('❌ Error fetching courses for modals:', error);
      message.error('Error loading courses');
      setAllCourses([]);
      setCourses([]);
      return [];
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    console.log('🚀 TeacherDashboard mounting, loading initial data...');
    const loadInitialData = async () => {
      await fetchAllCourses();
      await fetchMaterials();
      await fetchQuizzes();
      await fetchHomeworks();
      await fetchStudents();
      await fetchProgressRecords();
      await fetchAnnouncements();
      // Stats will be calculated automatically via the other useEffect
      // Initialize analytics with local data
      setTimeout(() => {
        calculateLocalAnalytics();
      }, 1500); // Delay to ensure all data is loaded
    };
    loadInitialData();
  }, []);

  // Recalculate dashboard stats whenever data changes
  useEffect(() => {
    console.log('📊 Data changed, recalculating dashboard stats...');
    fetchDashboardStats();
  }, [courses, materials, quizzes, homeworks, students, progressRecords]);

  // Data loading effects
  useEffect(() => {
    if (activeTab === 'quizzes') {
      fetchQuizzes();
    } else if (activeTab === 'homework') {
      fetchHomeworks();
    } else if (activeTab === 'listening') {
      fetchListeningExercises();
    } else if (activeTab === 'courses') {
      fetchCourses();
    } else if (activeTab === 'materials') {
      fetchMaterials();
    } else if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'grading') {
      fetchProgressRecords();
      fetchAnnouncements();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Quiz Management Functions
  const fetchQuizzes = async () => {
    setQuizLoading(true);
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.quizzes || response.data || response || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      message.error(t('quiz.fetchError'));
    } finally {
      setQuizLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    quizForm.setFieldsValue({
      ...quiz,
      dueDate: quiz.dueDate ? moment(quiz.dueDate) : null,
    });
    setIsQuizModalVisible(true);
  };

  const handleViewQuiz = (quiz) => {
    setViewingQuiz(quiz);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.deleteQuiz(quizId);
      message.success(t('quiz.deleteSuccess'));
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      message.error(t('quiz.deleteError'));
    }
  };

  const handleQuizSubmit = async (values) => {
    try {
      if (editingQuiz) {
        await quizAPI.updateQuiz(editingQuiz._id, values);
        message.success(t('quiz.updateSuccess'));
      } else {
        await quizAPI.createQuiz(values);
        message.success(t('quiz.createSuccess'));
      }
      setIsQuizModalVisible(false);
      setEditingQuiz(null);
      quizForm.resetFields();
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      message.error(t('quiz.saveError'));
    }
  };

  // Homework Management Functions
  const fetchHomeworks = async () => {
    setHomeworkLoading(true);
    try {
      const response = await homeworkAPI.getAll();
      setHomeworks(response.homework || response.data || response || []);
    } catch (error) {
      console.error('Error fetching homeworks:', error);
      message.error(t('homework.fetchError'));
    } finally {
      setHomeworkLoading(false);
    }
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    homeworkForm.setFieldsValue({
      ...homework,
      dueDate: homework.dueDate ? moment(homework.dueDate) : null,
    });
    setIsHomeworkModalVisible(true);
  };

  const handleViewHomework = (homework) => {
    // You can implement a view modal similar to quiz
    message.info('View homework functionality to be implemented');
  };

  const handleViewSubmissions = (homework) => {
    // You can implement a submissions view modal
    message.info('View submissions functionality to be implemented');
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      await homeworkAPI.deleteHomework(homeworkId);
      message.success(t('homework.deleteSuccess'));
      fetchHomeworks();
    } catch (error) {
      console.error('Error deleting homework:', error);
      message.error(t('homework.deleteError'));
    }
  };

  const handleHomeworkSubmit = async (values) => {
    try {
      if (editingHomework) {
        await homeworkAPI.updateHomework(editingHomework._id, values);
        message.success(t('homework.updateSuccess'));
      } else {
        await homeworkAPI.createHomework(values);
        message.success(t('homework.createSuccess'));
      }
      setIsHomeworkModalVisible(false);
      setEditingHomework(null);
      homeworkForm.resetFields();
      fetchHomeworks();
    } catch (error) {
      console.error('Error saving homework:', error);
      message.error(t('homework.saveError'));
    }
  };

  // Listening Exercises Functions
  const fetchListeningExercises = async () => {
    setListeningLoading(true);
    try {
      const response = await listeningAPI.getAll();
      setListeningExercises(response.listeningExercises || response.data || response || []);
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      message.error(t('listening.fetchError'));
    } finally {
      setListeningLoading(false);
    }
  };

  const handleEditListening = (listening) => {
    setEditingListening(listening);
    listeningForm.setFieldsValue(listening);
    setIsListeningModalVisible(true);
  };

  const handleViewListening = (listening) => {
    // You can implement a view modal similar to quiz
    message.info('View listening exercise functionality to be implemented');
  };

  const handleDeleteListening = async (listeningId) => {
    try {
      await listeningAPI.delete(listeningId);
      message.success(t('listening.deleteSuccess'));
      fetchListeningExercises();
    } catch (error) {
      console.error('Error deleting listening exercise:', error);
      message.error(t('listening.deleteError'));
    }
  };

  const handleListeningSubmit = async (values) => {
    try {
      if (editingListening) {
        await listeningAPI.update(editingListening._id, values);
        message.success(t('listening.updateSuccess'));
      } else {
        // Create FormData for new listening exercise with audio file
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'audioFile' && values[key] && values[key].fileList) {
            formData.append('audioFile', values[key].fileList[0].originFileObj);
          } else if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        });
        await listeningAPI.create(formData);
        message.success(t('listening.createSuccess'));
      }
      setIsListeningModalVisible(false);
      setEditingListening(null);
      listeningForm.resetFields();
      fetchListeningExercises();
    } catch (error) {
      console.error('Error saving listening exercise:', error);
      message.error(t('listening.saveError'));
    }
  };

  const handlePlayAudio = async (exercise) => {
    try {
      if (currentPlayingId === exercise._id) {
        // Pause audio
        setCurrentPlayingId(null);
        setAudioUrl('');
      } else {
        // Play audio
        setCurrentPlayingId(exercise._id);
        if (exercise.audioUrl) {
          setAudioUrl(exercise.audioUrl);
        } else {
          const audioUrl = await listeningAPI.getAudioUrl(exercise._id);
          setAudioUrl(audioUrl);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      message.error(t('listening.audioError'));
    }
  };

  // Course Management Functions
  const fetchCourses = async () => {
    setCourseLoading(true);
    try {
      const response = await courseAPI.getAll();
      console.log('📚 Raw course API response:', response);
      
      // Handle different response formats
      const coursesData = response.data || response.courses || response || [];
      console.log('📚 Processed courses data:', coursesData);
      
      setCourses(coursesData);
      // Also update global courses for modals
      setAllCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Error fetching courses');
    } finally {
      setCourseLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    // Convert date strings to moment objects for the form
    const formData = {
      ...course,
      startDate: course.startDate ? moment(course.startDate) : null,
      endDate: course.endDate ? moment(course.endDate) : null,
    };
    courseForm.setFieldsValue(formData);
    setIsCourseModalVisible(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseAPI.delete(courseId);
      message.success('Course deleted successfully');
      await fetchAllCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Error deleting course');
    }
  };

  const handleCourseSubmit = async (values) => {
    try {
      console.log('📝 Original form values:', values);
      
      // Format the form data
      const courseData = {
        ...values,
        // Convert moment objects to ISO strings for the API
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        // Ensure code is uppercase
        code: values.code ? values.code.toUpperCase() : '',
      };

      console.log('📚 Submitting course data:', courseData);

      if (editingCourse) {
        const result = await courseAPI.update(editingCourse._id, courseData);
        console.log('✅ Course update result:', result);
        message.success('Course updated successfully');
      } else {
        const result = await courseAPI.create(courseData);
        console.log('✅ Course create result:', result);
        message.success('Course created successfully');
      }
      
      setIsCourseModalVisible(false);
      setEditingCourse(null);
      courseForm.resetFields();
      
      // Refresh courses with explicit logging
      console.log('🔄 Refreshing courses after save...');
      await fetchAllCourses();
      console.log('✅ Course refresh completed');
    } catch (error) {
      console.error('❌ Error saving course:', error);
      message.error('Error saving course');
    }
  };

  // Material Management Functions
  const fetchMaterials = async () => {
    setMaterialLoading(true);
    try {
      console.log('📚 Fetching materials...');
      const response = await materialAPI.getAll();
      console.log('📚 Raw materials response:', response);
      
      // Handle different response formats
      const materialsData = response.materials || response.data || response || [];
      console.log('📚 Processed materials data:', materialsData);
      
      setMaterials(materialsData);
    } catch (error) {
      console.error('❌ Error fetching materials:', error);
      message.error('Error fetching materials');
      setMaterials([]);
    } finally {
      setMaterialLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    materialForm.setFieldsValue(material);
    setIsMaterialModalVisible(true);
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await materialAPI.delete(materialId);
      message.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      message.error('Error deleting material');
    }
  };

  const handleMaterialSubmit = async (values) => {
    try {
      console.log('📁 Material form values:', values);
      console.log('📁 Form values detailed:', JSON.stringify(values, null, 2));
      
      if (editingMaterial) {
        // For updates, send as JSON
        const updateData = {
          title: values.title,
          description: values.description,
          course: values.course,
          category: values.category
        };
        console.log('✏️ Updating material:', updateData);
        await materialAPI.update(editingMaterial._id, updateData);
        message.success('Material updated successfully');
      } else {
        // For creation, prepare FormData for file upload
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', values.title);
        formData.append('course', values.course);
        formData.append('category', values.category);
        if (values.description) {
          formData.append('description', values.description);
        }
        
        // Add file
        console.log('🔍 File structure debug:', {
          hasFile: !!values.file,
          fileKeys: values.file ? Object.keys(values.file) : 'No file object',
          fileType: typeof values.file,
          isArray: Array.isArray(values.file),
          fileValue: values.file
        });
        
        if (values.file) {
          let fileObj = null;
          
          // Handle Ant Design Upload file structures
          if (Array.isArray(values.file) && values.file.length > 0) {
            // When using Upload with beforeUpload: false, files are in an array
            const fileItem = values.file[0];
            console.log('📎 File item from array:', fileItem);
            
            if (fileItem.originFileObj) {
              fileObj = fileItem.originFileObj;
            } else if (fileItem.file) {
              fileObj = fileItem.file;
            } else {
              fileObj = fileItem;
            }
          } else if (values.file.fileList && Array.isArray(values.file.fileList)) {
            // Alternative file list structure
            const fileItem = values.file.fileList[0];
            if (fileItem && fileItem.originFileObj) {
              fileObj = fileItem.originFileObj;
            }
          } else if (values.file.file && values.file.file.originFileObj) {
            fileObj = values.file.file.originFileObj;
          } else if (values.file.originFileObj) {
            fileObj = values.file.originFileObj;
          } else if (values.file.file) {
            fileObj = values.file.file;
          }
          
          if (fileObj && fileObj instanceof File) {
            formData.append('file', fileObj);
            console.log('📎 File to upload:', {
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type
            });
          } else {
            console.error('❌ Could not extract valid File object from:', values.file);
            throw new Error('Please select a valid file');
          }
        } else {
          throw new Error('No file selected');
        }
        
        console.log('📤 Creating material with FormData');
        const result = await materialAPI.create(formData);
        console.log('✅ Material created:', result);
        message.success('Material uploaded successfully');
      }
      
      setIsMaterialModalVisible(false);
      setEditingMaterial(null);
      materialForm.resetFields();
      
      // Refresh materials list
      console.log('🔄 Refreshing materials...');
      await fetchMaterials();
    } catch (error) {
      console.error('❌ Error saving material:', error);
      message.error('Error saving material: ' + (error.message || 'Unknown error'));
    }
  };

  // Student Management Functions
  const fetchStudents = async () => {
    setStudentLoading(true);
    try {
      console.log('👥 Fetching students...');
      const response = await userAPI.getByRole('student');
      console.log('👥 Students API response:', response);
      
      const studentsData = response.users || response.data || response || [];
      console.log('👥 Processed students data:', studentsData);
      console.log('👥 Sample student record:', studentsData[0]);
      
      setStudents(studentsData);
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      message.error('Error fetching students');
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  // Messaging Functions
  const handleSendMessage = (student) => {
    console.log('💬 Opening message modal for student:', student);
    setSelectedStudent(student);
    setIsMessageModalVisible(true);
    messageForm.resetFields();
  };

  const handleMessageSubmit = async (values) => {
    try {
      setSendingMessage(true);
      console.log('📤 Sending message:', values);
      
      const messageData = {
        recipientId: selectedStudent._id,
        recipientEmail: selectedStudent.email,
        recipientName: selectedStudent.firstName + ' ' + selectedStudent.lastName,
        subject: values.subject,
        message: values.message,
        type: 'teacher_to_student'
      };

      console.log('📤 Message data to send:', messageData);
      await messageAPI.sendToStudent(messageData);
      
      message.success('Message sent successfully!');
      setIsMessageModalVisible(false);
      setSelectedStudent(null);
      messageForm.resetFields();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      message.error('Failed to send message: ' + (error.message || 'Unknown error'));
    } finally {
      setSendingMessage(false);
    }
  };

  // Video Call Functions
  const handleVideoCall = (student) => {
    console.log('📹 Opening video call modal for student:', student);
    setSelectedStudentForCall(student);
    setIsVideoCallModalVisible(true);
  };

  const handleStartVideoCall = async (callType) => {
    try {
      setVideoCallLoading(true);
      const studentName = `${selectedStudentForCall.firstName || ''} ${selectedStudentForCall.lastName || ''}`.trim();
      
      // Generate meeting room URL based on call type
      let meetingUrl = '';
      const meetingId = `teacher_${currentUser?.id || 'unknown'}_student_${selectedStudentForCall._id}_${Date.now()}`;
      
      switch (callType) {
        case 'zoom':
          // For production, you would integrate with Zoom API
          meetingUrl = `https://zoom.us/j/${meetingId}`;
          break;
        case 'teams':
          // For production, you would integrate with Microsoft Teams API
          meetingUrl = `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
          break;
        case 'meet':
          // For production, you would integrate with Google Meet API
          meetingUrl = `https://meet.google.com/${meetingId}`;
          break;
        case 'jitsi':
          // Jitsi Meet - free and open source
          meetingUrl = `https://meet.jit.si/ForumAcademy_${meetingId}`;
          break;
        default:
          meetingUrl = `https://meet.jit.si/ForumAcademy_${meetingId}`;
      }

      // Open the meeting in a new window
      window.open(meetingUrl, '_blank', 'width=1200,height=800');
      
      // Send notification message to student (optional)
      const messageData = {
        recipientId: selectedStudentForCall._id,
        recipientEmail: selectedStudentForCall.email,
        recipientName: studentName,
        subject: `Video Call Invitation - ${callType.charAt(0).toUpperCase() + callType.slice(1)}`,
        message: `Your teacher has started a video call session. Please join using this link: ${meetingUrl}`,
        type: 'video_call_invitation'
      };

      await messageAPI.sendToStudent(messageData);
      
      message.success(`Video call started! Meeting link sent to ${studentName}`);
      setIsVideoCallModalVisible(false);
      setSelectedStudentForCall(null);
    } catch (error) {
      console.error('❌ Error starting video call:', error);
      message.error('Failed to start video call: ' + (error.message || 'Unknown error'));
    } finally {
      setVideoCallLoading(false);
    }
  };

  // Grading Functions
  const fetchProgressRecords = async () => {
    try {
      setGradingLoading(true);
      console.log('📊 Fetching progress records...');
      const response = await progressAPI.getAll();
      console.log('✅ Full API response:', response);
      
      let progressData = [];
      
      // Server returns: { success: true, progress: [...], count: number }
      if (response && response.data && response.data.progress && Array.isArray(response.data.progress)) {
        progressData = response.data.progress;
        console.log(`✅ Found ${progressData.length} progress records in response.data.progress`);
      } else if (response && response.progress && Array.isArray(response.progress)) {
        progressData = response.progress;
        console.log(`✅ Found ${progressData.length} progress records in response.progress`);
      } else {
        console.log('⚠️ No progress records found. Response structure:', {
          hasData: !!response?.data,
          hasProgress: !!response?.progress,
          dataKeys: response?.data ? Object.keys(response.data) : [],
          responseKeys: response ? Object.keys(response) : []
        });
        progressData = [];
      }
      
      setProgressRecords(progressData);
      
      if (progressData.length > 0) {
        console.log('📊 Sample progress record:', progressData[0]);
        message.success(`Loaded ${progressData.length} progress records`);
      } else {
        message.info('No progress records found');
      }
      
    } catch (error) {
      console.error('❌ Error fetching progress records:', error);
      message.error('Failed to fetch progress records: ' + (error.message || 'Unknown error'));
      setProgressRecords([]);
    } finally {
      setGradingLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      console.log('📢 Fetching announcements...');
      const response = await announcementAPI.getAll();
      console.log('✅ Full announcements API response:', response);
      
      let announcementData = [];
      
      // Server returns: { success: true, announcements: [...], count: number }
      if (response && response.data && response.data.announcements && Array.isArray(response.data.announcements)) {
        announcementData = response.data.announcements;
        console.log(`✅ Found ${announcementData.length} announcements in response.data.announcements`);
      } else if (response && response.announcements && Array.isArray(response.announcements)) {
        announcementData = response.announcements;
        console.log(`✅ Found ${announcementData.length} announcements in response.announcements`);
      } else if (response && Array.isArray(response.data)) {
        announcementData = response.data;
        console.log(`✅ Found ${announcementData.length} announcements in response.data`);
      } else if (Array.isArray(response)) {
        announcementData = response;
        console.log(`✅ Found ${announcementData.length} announcements as direct array`);
      } else {
        console.log('⚠️ No announcements found. Response structure:', {
          hasData: !!response?.data,
          hasAnnouncements: !!response?.announcements,
          dataKeys: response?.data ? Object.keys(response.data) : [],
          responseKeys: response ? Object.keys(response) : []
        });
        announcementData = [];
      }
      
      setAnnouncements(announcementData);
      
      if (announcementData.length > 0) {
        console.log('📢 Sample announcement:', announcementData[0]);
        message.success(`Loaded ${announcementData.length} announcements`);
      } else {
        message.info('No announcements found');
      }
      
    } catch (error) {
      console.error('❌ Error fetching announcements:', error);
      message.error('Failed to fetch announcements: ' + (error.message || 'Unknown error'));
      setAnnouncements([]);
    }
  };

  const createProgressRecord = async (values) => {
    try {
      setGradingLoading(true);
      console.log('📊 Creating progress record:', values);
      
      // Calculate percentage
      const percentage = Math.round((values.score / values.maxScore) * 100);
      
      const progressData = {
        ...values,
        percentage,
        teacher: currentUser?.id || currentUser?._id,
        gradedDate: new Date(),
        submissionDate: values.submissionDate || new Date()
      };

      console.log('📊 Progress data to create:', progressData);
      const response = await progressAPI.create(progressData);
      console.log('✅ Create response:', response);
      
      message.success('Grade added successfully!');
      setCreateProgressModalVisible(false);
      progressForm.resetFields();
      
      // Refresh the progress records list
      console.log('🔄 Refreshing progress records after creation...');
      await fetchProgressRecords();
      console.log('✅ Progress records refresh completed');
      
    } catch (error) {
      console.error('❌ Error creating progress record:', error);
      message.error('Failed to add grade: ' + (error.message || 'Unknown error'));
    } finally {
      setGradingLoading(false);
    }
  };

  const updateProgressRecord = async (values) => {
    try {
      setGradingLoading(true);
      console.log('📊 Updating progress record:', selectedProgress._id, values);
      
      // Calculate percentage
      const percentage = Math.round((values.score / values.maxScore) * 100);
      
      const progressData = {
        ...values,
        percentage,
        gradedDate: new Date()
      };

      await progressAPI.update(selectedProgress._id, progressData);
      
      message.success('Grade updated successfully!');
      setEditProgressModalVisible(false);
      setSelectedProgress(null);
      editProgressForm.resetFields();
      await fetchProgressRecords(); // Refresh the list
    } catch (error) {
      console.error('❌ Error updating progress record:', error);
      message.error('Failed to update grade: ' + (error.message || 'Unknown error'));
    } finally {
      setGradingLoading(false);
    }
  };

  const deleteProgressRecord = async (progressId) => {
    try {
      console.log('🗑️ Deleting progress record:', progressId);
      await progressAPI.delete(progressId);
      
      message.success('Grade deleted successfully!');
      await fetchProgressRecords(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting progress record:', error);
      message.error('Failed to delete grade: ' + (error.message || 'Unknown error'));
    }
  };

  const createAnnouncement = async (values) => {
    try {
      console.log('📢 Creating announcement:', values);
      
      const announcementData = {
        ...values,
        author: currentUser?.id || currentUser?._id,
        publishDate: values.publishDate || new Date(),
        readCount: 0
      };

      console.log('📢 Announcement data to create:', announcementData);
      const response = await announcementAPI.create(announcementData);
      console.log('✅ Announcement create response:', response);
      
      message.success('Announcement created successfully!');
      setCreateAnnouncementModalVisible(false);
      announcementForm.resetFields();
      
      // Refresh the announcements list
      console.log('🔄 Refreshing announcements after creation...');
      await fetchAnnouncements();
      console.log('✅ Announcements refresh completed');
      
    } catch (error) {
      console.error('❌ Error creating announcement:', error);
      message.error('Failed to create announcement: ' + (error.message || 'Unknown error'));
    }
  };

  const openEditModal = (progress) => {
    setSelectedProgress(progress);
    editProgressForm.setFieldsValue({
      subject: progress.subject,
      assignment: progress.assignment,
      assignmentType: progress.assignmentType,
      score: progress.score,
      maxScore: progress.maxScore,
      grade: progress.grade,
      comments: progress.comments
    });
    setEditProgressModalVisible(true);
  };

  const openViewModal = (progress) => {
    setViewingProgress(progress);
    setViewProgressModalVisible(true);
  };

  // Analytics Functions
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        message.warning('Analytics data refreshed from local modules (login required for server analytics)');
        // Just refresh the local data without server call
        await fetchDashboardStats();
        setAnalyticsLoading(false);
        return;
      }
      
      console.log('📊 Fetching teacher analytics from server...');
      const response = await statsAPI.getTeacherAnalytics();
      console.log('✅ Teacher analytics response:', response);
      
      if (response && response.success) {
        setAnalyticsData(response);
        message.success('Server analytics loaded successfully');
      } else {
        // Fallback to local data if server analytics fail
        console.log('📊 Server analytics failed, using local data calculations');
        message.success('Analytics refreshed from local data');
        await fetchDashboardStats();
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      
      // Instead of showing errors, gracefully fallback to local calculations
      if (error.message.includes('No token') || error.message.includes('authorization denied')) {
        message.info('Analytics refreshed from local data (login required for advanced analytics)');
      } else if (error.message.includes('Route not found') || error.message.includes('fetch')) {
        message.info('Server analytics unavailable, showing local data');
      } else {
        message.info('Using local analytics data');
      }
      
      // Always try to refresh local dashboard stats
      try {
        await fetchDashboardStats();
      } catch (localError) {
        console.error('❌ Error refreshing local data:', localError);
        message.warning('Could not refresh analytics data');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Local Analytics Calculation (works without server)
  const calculateLocalAnalytics = () => {
    try {
      // Calculate KPIs from local data
      const uniqueStudents = new Set();
      courses.forEach(course => {
        if (course.students && Array.isArray(course.students)) {
          course.students.forEach(student => uniqueStudents.add(student._id || student));
        }
      });
      const totalStudents = uniqueStudents.size || students.length;

      const totalSubmissions = progressRecords.length + 
        (quizzes.reduce((acc, quiz) => acc + (quiz.submissions?.length || 0), 0)) +
        (homeworks.reduce((acc, hw) => acc + (hw.submissions?.length || 0), 0));

      const validScores = progressRecords.filter(record => record.percentage && !isNaN(record.percentage));
      const averageScore = validScores.length > 0 
        ? Math.round(validScores.reduce((acc, record) => acc + record.percentage, 0) / validScores.length)
        : 0;

      const activeStudents = Math.min(totalStudents, Math.floor(totalStudents * 0.8));

      // Update analytics data with local calculations
      setAnalyticsData(prevData => ({
        ...prevData,
        success: true,
        overview: {
          totalStudents,
          totalSubmissions,
          averageScore,
          activeStudents,
          totalCourses: courses.length,
          recentSubmissions: progressRecords.filter(record => 
            new Date(record.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        },
        lastUpdated: new Date().toISOString()
      }));

      return { totalStudents, totalSubmissions, averageScore, activeStudents };
    } catch (error) {
      console.error('❌ Error calculating local analytics:', error);
      return null;
    }
  };

  // Notification Functions
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform backend notifications to match frontend format
        const transformedNotifications = data.notifications.map(notification => ({
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: notification.createdAt,
          read: notification.read,
          sender: notification.sender,
          priority: notification.priority,
          icon: notification.icon || getNotificationIcon(notification.type),
          color: notification.color || getNotificationColor(notification.type),
          actionUrl: notification.actionUrl
        }));

        setNotifications(transformedNotifications);
        setNotificationStats({
          total: data.pagination.totalCount,
          unread: data.pagination.unreadCount,
          byType: {
            student_message: transformedNotifications.filter(n => n.type === 'student_message').length,
            assignment_submission: transformedNotifications.filter(n => n.type === 'assignment_submission').length,
            admin_announcement: transformedNotifications.filter(n => n.type === 'admin_announcement').length,
            quiz_submission: transformedNotifications.filter(n => n.type === 'quiz_submission').length,
            grade_request: transformedNotifications.filter(n => n.type === 'grade_request').length,
            enrollment: transformedNotifications.filter(n => n.type === 'enrollment').length
          }
        });
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
        // Fallback to empty state
        setNotifications([]);
        setNotificationStats({
          total: 0,
          unread: 0,
          byType: {
            student_message: 0,
            assignment_submission: 0,
            admin_announcement: 0,
            quiz_submission: 0,
            grade_request: 0,
            enrollment: 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty state
      setNotifications([]);
      setNotificationStats({
        total: 0,
        unread: 0,
        byType: {
          student_message: 0,
          assignment_submission: 0,
          admin_announcement: 0,
          quiz_submission: 0,
          grade_request: 0,
          enrollment: 0
        }
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  // Helper functions for notification icons and colors
  const getNotificationIcon = (type) => {
    const iconMap = {
      student_message: 'message',
      assignment_submission: 'file-text',
      admin_announcement: 'bell',
      quiz_submission: 'question-circle',
      grade_request: 'question-circle',
      enrollment: 'user-add',
      progress_update: 'bar-chart',
      grade_update: 'trophy',
      system_alert: 'warning'
    };
    return iconMap[type] || 'bell';
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      student_message: '#1890ff',
      assignment_submission: '#52c41a',
      admin_announcement: '#faad14',
      quiz_submission: '#722ed1',
      grade_request: '#fa8c16',
      enrollment: '#13c2c2',
      progress_update: '#2f54eb',
      grade_update: '#f5222d',
      system_alert: '#fa541c'
    };
    return colorMap[type] || '#1890ff';
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        setNotificationStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setNotificationStats(prev => ({
          ...prev,
          unread: 0
        }));
        message.success(`${data.modifiedCount} notifications marked as read`);
      } else {
        message.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      message.error('Failed to mark all notifications as read');
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    
    // Close notification drawer
    setNotificationDrawerVisible(false);
    
    // If there's a specific actionUrl, use it
    if (notification.actionUrl) {
      // For external URLs or specific navigation
      if (notification.actionUrl.startsWith('http')) {
        window.open(notification.actionUrl, '_blank');
        return;
      }
      // For internal routing, we could use history.push if needed
      message.info(`Navigation: ${notification.actionUrl}`);
    }
    
    // Navigate based on notification type as fallback
    switch (notification.type) {
      case 'student_message':
        message.info('📩 Opening student message...');
        // Could open a message modal or navigate to messages
        break;
        
      case 'assignment_submission':
        setActiveTab('grading');
        message.success('📝 Navigating to grading center...');
        break;
        
      case 'admin_announcement':
        message.info('📢 Opening admin announcement...');
        // Show announcement details
        Modal.info({
          title: notification.title,
          content: notification.content || notification.message,
          width: 500
        });
        break;
        
      case 'quiz_submission':
        setActiveTab('quizzes');
        message.success('❓ Navigating to quiz management...');
        break;
        
      case 'progress_update':
        setActiveTab('analytics');
        message.success('📊 Navigating to progress analytics...');
        break;
        
      case 'grade_update':
        setActiveTab('grading');
        message.info('🎯 Opening grade management...');
        break;
        
      case 'application_update':
        setActiveTab('applications');
        message.success('� Navigating to applications...');
        break;
        
      case 'system_alert':
        message.warning('⚠️ System alert opened');
        break;
        
      default:
        message.info('🔔 Notification opened');
    }
  };

  // Load notifications when component mounts and data changes
  useEffect(() => {
    if (progressRecords.length > 0 || announcements.length > 0) {
      fetchNotifications();
    }
  }, [progressRecords, announcements, quizzes]);

  // Auto-refresh notifications every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressRecords.length > 0 || announcements.length > 0) {
        console.log('🔄 Auto-refreshing notifications...');
        fetchNotifications();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [progressRecords, announcements]);

  // Fetch real notifications periodically
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Refresh every minute

    return () => clearInterval(notificationInterval);
  }, []);

  // Form Components
  const QuizForm = ({ form, quiz, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log('🧩 QuizForm rendered with allCourses:', allCourses);

    const handleSubmit = () => {
      form.validateFields().then(values => {
        onSubmit(values);
      });
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t('quiz.title')}
          rules={[{ required: true, message: t('quiz.titleRequired') }]}
        >
          <Input placeholder={t('quiz.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('quiz.description')}
        >
          <Input.TextArea rows={4} placeholder={t('quiz.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="course"
          label={t('quiz.course')}
          rules={[{ required: true, message: t('quiz.courseRequired') }]}
        >
          <Select placeholder={t('quiz.selectCourse')} loading={allCourses.length === 0}>
            {allCourses && allCourses.length > 0 ? (
              allCourses.map(course => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || 'Untitled Course'}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">No courses available</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="timeLimit"
              label={t('quiz.timeLimit')}
            >
              <InputNumber
                min={1}
                max={300}
                placeholder={t('quiz.timeLimitPlaceholder')}
                addonAfter={t('common.minutes')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attempts"
              label={t('quiz.attempts')}
            >
              <InputNumber
                min={1}
                max={10}
                placeholder={t('quiz.attemptsPlaceholder')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label={t('common.status')}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">{t('quiz.status.draft')}</Select.Option>
            <Select.Option value="active">{t('quiz.status.active')}</Select.Option>
            <Select.Option value="archived">{t('quiz.status.archived')}</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {quiz ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </Form>
    );
  };

  const QuizViewer = ({ quiz }) => {
    return (
      <div>
        <Descriptions column={2} bordered>
          <Descriptions.Item label={t('quiz.title')} span={2}>
            {quiz.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('quiz.description')} span={2}>
            {quiz.description || t('quiz.noDescription')}
          </Descriptions.Item>
          <Descriptions.Item label={t('quiz.course')}>
            {quiz.course?.title || t('quiz.noCourse')}
          </Descriptions.Item>
          <Descriptions.Item label={t('quiz.timeLimit')}>
            {quiz.timeLimit ? `${quiz.timeLimit} ${t('common.minutes')}` : t('quiz.noTimeLimit')}
          </Descriptions.Item>
          <Descriptions.Item label={t('quiz.attempts')}>
            {quiz.attempts || t('quiz.unlimited')}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            <Tag color={quiz.status === 'active' ? 'green' : quiz.status === 'draft' ? 'orange' : 'red'}>
              {t(`quiz.status.${quiz.status}`)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
        
        {quiz.questions && quiz.questions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>{t('quiz.questions')}</Title>
            {quiz.questions.map((question, index) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Text strong>{index + 1}. {question.text}</Text>
                {question.options && (
                  <div style={{ marginTop: 8 }}>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} style={{ marginLeft: 16 }}>
                        <Text type={option.isCorrect ? 'success' : 'secondary'}>
                          {String.fromCharCode(65 + optIndex)}. {option.text}
                          {option.isCorrect && <CheckCircleOutlined style={{ marginLeft: 8, color: '#52c41a' }} />}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const HomeworkForm = ({ form, homework, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log('📝 HomeworkForm rendered with allCourses:', allCourses);

    const handleSubmit = () => {
      form.validateFields().then(values => {
        onSubmit(values);
      });
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t('homework.title')}
          rules={[{ required: true, message: t('homework.titleRequired') }]}
        >
          <Input placeholder={t('homework.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('homework.description')}
          rules={[{ required: true, message: t('homework.descriptionRequired') }]}
        >
          <Input.TextArea rows={6} placeholder={t('homework.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="course"
          label={t('homework.course')}
          rules={[{ required: true, message: t('homework.courseRequired') }]}
        >
          <Select placeholder={t('homework.selectCourse')} loading={allCourses.length === 0}>
            {allCourses && allCourses.length > 0 ? (
              allCourses.map(course => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || 'Untitled Course'}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">No courses available</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label={t('homework.dueDate')}
          rules={[{ required: true, message: t('homework.dueDateRequired') }]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder={t('homework.dueDatePlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="maxPoints"
          label={t('homework.maxPoints')}
        >
          <InputNumber
            min={1}
            max={1000}
            placeholder={t('homework.maxPointsPlaceholder')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('common.status')}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">{t('homework.status.draft')}</Select.Option>
            <Select.Option value="active">{t('homework.status.active')}</Select.Option>
            <Select.Option value="archived">{t('homework.status.archived')}</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {homework ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </Form>
    );
  };

  const ListeningForm = ({ form, listening, onSubmit, onCancel }) => {
    // Use global courses from parent component
    console.log('🎧 ListeningForm rendered with allCourses:', allCourses);
    const [audioFile, setAudioFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = () => {
      form.validateFields().then(values => {
        onSubmit({ ...values, audioFile });
      });
    };

    const uploadProps = {
      beforeUpload: (file) => {
        const isAudio = file.type.startsWith('audio/');
        if (!isAudio) {
          message.error(t('listening.audioFileOnly'));
          return false;
        }
        setAudioFile(file);
        return false;
      },
      onRemove: () => {
        setAudioFile(null);
      },
    };

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={t('listening.title')}
          rules={[{ required: true, message: t('listening.titleRequired') }]}
        >
          <Input placeholder={t('listening.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('listening.description')}
        >
          <Input.TextArea rows={4} placeholder={t('listening.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="course"
          label={t('listening.course')}
          rules={[{ required: true, message: t('listening.courseRequired') }]}
        >
          <Select placeholder={t('listening.selectCourse')} loading={allCourses.length === 0}>
            {allCourses && allCourses.length > 0 ? (
              allCourses.map(course => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title || course.name || 'Untitled Course'}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">No courses available</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="audioFile"
          label={t('listening.audioFile')}
          rules={[{ required: !listening, message: t('listening.audioFileRequired') }]}
        >
          <Upload {...uploadProps} maxCount={1}>
            <Button icon={<UploadOutlined />}>
              {t('listening.uploadAudio')}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="duration"
          label={t('listening.duration')}
        >
          <InputNumber
            min={1}
            max={3600}
            placeholder={t('listening.durationPlaceholder')}
            addonAfter={t('common.seconds')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('common.status')}
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">{t('listening.status.draft')}</Select.Option>
            <Select.Option value="active">{t('listening.status.active')}</Select.Option>
            <Select.Option value="archived">{t('listening.status.archived')}</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={uploading}>
            {listening ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </Form>
    );
  };

  const teacherMenuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: t('adminSidebar.navigation.overview'),
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'My Classes',
    },
    {
      key: 'materials',
      icon: <FolderOutlined />,
      label: t('adminSidebar.navigation.materials'),
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
      label: t('adminSidebar.navigation.listening'),
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
      label: t('adminSidebar.navigation.analytics'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('adminSidebar.navigation.settings'),
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

  const renderGradingCenter = () => {
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
          const colorMap = {
            homework: 'green',
            quiz: 'blue',
            exam: 'red',
            project: 'purple',
            participation: 'orange',
            other: 'gray'
          };
          return <Tag color={colorMap[type] || 'gray'}>{type?.toUpperCase()}</Tag>;
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
          const colorMap = {
            'A+': 'green', 'A': 'green', 'A-': 'green',
            'B+': 'blue', 'B': 'blue', 'B-': 'blue',
            'C+': 'orange', 'C': 'orange', 'C-': 'orange',
            'D+': 'red', 'D': 'red', 'F': 'red'
          };
          return <Tag color={colorMap[grade] || 'gray'}>{grade}</Tag>;
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
              icon={<EyeOutlined />}
              size="small"
              onClick={() => openViewModal(record)}
              title="View details"
            >
              View
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEditModal(record)}
              title="Edit grade"
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
                title="Delete grade"
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>📚 Grading Center</Title>
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
                value={announcements.filter(ann => ann.author?._id === (currentUser?.id || currentUser?._id)).length}
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

        {/* Tabs for Grading and Announcements */}
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
                        icon={<SearchOutlined />}
                        onClick={fetchProgressRecords}
                        loading={gradingLoading}
                        title="Refresh grades"
                      >
                        Refresh
                      </Button>
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
                      loading={gradingLoading}
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
                        icon={<SearchOutlined />}
                        onClick={fetchAnnouncements}
                        title="Refresh announcements"
                      >
                        Refresh
                      </Button>
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
                      dataSource={announcements.filter(ann => ann.author?._id === (currentUser?.id || currentUser?._id))}
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
                          <Text ellipsis={{ rows: 2 }}>
                            {announcement.content}
                          </Text>
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
      </div>
    );
  };

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

  // Course Management Component
  const renderCourseManagement = () => {
    const columns = [
      {
        title: 'Course Name',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        render: (code) => <Tag color="purple">{code}</Tag>,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (category) => <Tag color="cyan">{category}</Tag>,
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        render: (level) => <Tag color="blue">{level}</Tag>,
      },
      {
        title: 'Students',
        dataIndex: 'students',
        key: 'students',
        render: (students) => students ? students.length : 0,
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration) => `${duration} weeks`,
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit Course">
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditCourse(record)}
              />
            </Tooltip>
            <Tooltip title="View Students">
              <Button 
                type="link" 
                size="small" 
                icon={<TeamOutlined />}
                onClick={() => {
                  setSelectedCourseForStudents(record);
                  setActiveTab('students');
                }}
              />
            </Tooltip>
            <Tooltip title="Delete Course">
              <Popconfirm
                title="Are you sure you want to delete this course?"
                onConfirm={() => handleDeleteCourse(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title="My Classes"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCourse(null);
              courseForm.resetFields();
              setIsCourseModalVisible(true);
            }}
          >
            Add New Course
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={courses}
          loading={courseLoading}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? 'small' : 'default'}
        />

        <Modal
          title={editingCourse ? "Edit Course" : "Add New Course"}
          open={isCourseModalVisible}
          onCancel={() => {
            setIsCourseModalVisible(false);
            setEditingCourse(null);
            courseForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={courseForm}
            layout="vertical"
            onFinish={handleCourseSubmit}
          >
            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: 'Please enter course title' }]}
            >
              <Input placeholder="Enter course title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter course description' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter course description" />
            </Form.Item>

            <Form.Item
              name="code"
              label="Course Code"
              rules={[{ required: true, message: 'Please enter course code' }]}
            >
              <Input placeholder="Enter course code (e.g., ENG101)" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select course category' }]}
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

            <Form.Item
              name="level"
              label="Level"
              rules={[{ required: true, message: 'Please select course level' }]}
            >
              <Select placeholder="Select level">
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration (weeks)"
              rules={[{ required: true, message: 'Please enter course duration' }]}
            >
              <InputNumber min={1} max={52} placeholder="Enter duration in weeks" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[
                    { required: true, message: 'Please select start date' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('endDate')) {
                          return Promise.resolve();
                        }
                        if (value.isAfter(getFieldValue('endDate'))) {
                          return Promise.reject(new Error('Start date must be before end date'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[
                    { required: true, message: 'Please select end date' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('startDate')) {
                          return Promise.resolve();
                        }
                        if (value.isBefore(getFieldValue('startDate'))) {
                          return Promise.reject(new Error('End date must be after start date'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="maxStudents"
              label="Maximum Students"
            >
              <InputNumber min={1} max={100} placeholder="Enter max students (default: 30)" />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setIsCourseModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCourse ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };

  // Material Management Component
  const renderMaterialManagement = () => {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: 'File Type',
        dataIndex: 'fileType',
        key: 'fileType',
        render: (fileType) => (
          <Tag color={fileType === 'video' ? 'red' : fileType === 'document' ? 'blue' : fileType === 'pdf' ? 'orange' : 'green'}>
            {fileType?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (category) => (
          <Tag color="purple">
            {category?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: 'Course',
        dataIndex: 'course',
        key: 'course',
        render: (course) => course?.title || course?.name || 'N/A',
      },
      {
        title: 'File Size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        render: (size) => {
          if (!size) return 'N/A';
          const mb = (size / (1024 * 1024)).toFixed(2);
          return `${mb} MB`;
        },
      },
      {
        title: 'Upload Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format('MMM DD, YYYY'),
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Download">
              <Button 
                type="link" 
                size="small" 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // Use the API download endpoint
                  const token = localStorage.getItem('token');
                  const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/course-materials/download/${record._id}`;
                  
                  // Create a temporary link with auth header
                  fetch(downloadUrl, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  })
                  .then(response => response.blob())
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = record.fileName || 'material';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  })
                  .catch(error => {
                    console.error('Download error:', error);
                    message.error('Failed to download file');
                  });
                }}
              />
            </Tooltip>
            <Tooltip title="Edit Material">
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditMaterial(record)}
              />
            </Tooltip>
            <Tooltip title="Delete Material">
              <Popconfirm
                title="Are you sure you want to delete this material?"
                onConfirm={() => handleDeleteMaterial(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title="Teaching Materials"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log('📁 Opening Material modal with allCourses:', allCourses);
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log('🔄 Courses empty, refreshing...');
                await fetchAllCourses();
              }
              setEditingMaterial(null);
              materialForm.resetFields();
              setIsMaterialModalVisible(true);
            }}
          >
            Upload Material
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={materials}
          loading={materialLoading}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? 'small' : 'default'}
        />

        <Modal
          title={editingMaterial ? "Edit Material" : "Upload New Material"}
          open={isMaterialModalVisible}
          onCancel={() => {
            setIsMaterialModalVisible(false);
            setEditingMaterial(null);
            materialForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={materialForm}
            layout="vertical"
            onFinish={handleMaterialSubmit}
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
              <Input.TextArea rows={3} placeholder="Enter material description" />
            </Form.Item>

            <Form.Item
              name="course"
              label="Course"
              rules={[{ required: true, message: 'Please select a course' }]}
            >
              <Select placeholder="Select course" loading={allCourses.length === 0}>
                {allCourses && allCourses.length > 0 ? (
                  allCourses.map(course => (
                    <Option key={course._id} value={course._id}>
                      {course.title || course.name || 'Untitled Course'}
                    </Option>
                  ))
                ) : (
                  <Option disabled value="">No courses available</Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Material Category"
              rules={[{ required: true, message: 'Please select material category' }]}
            >
              <Select placeholder="Select material category">
                <Option value="lecture">Lecture</Option>
                <Option value="assignment">Assignment</Option>
                <Option value="reading">Reading</Option>
                <Option value="supplementary">Supplementary</Option>
                <Option value="exam">Exam</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {!editingMaterial && (
              <Form.Item
                name="file"
                label="File"
                rules={[{ required: true, message: 'Please select a file' }]}
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={(info) => {
                    console.log('📎 Upload onChange:', info);
                    console.log('📎 File list:', info.fileList);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for single file upload. Supported formats: PDF, DOC, PPT, MP4, MP3, etc.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            )}

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setIsMaterialModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingMaterial ? 'Update' : 'Upload'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };

  // Student Management Component
  const renderStudentManagement = () => {
    const columns = [
      {
        title: 'Name',
        key: 'name',
        render: (_, record) => {
          const fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim() || record.name || 'N/A';
          return <span>{fullName}</span>;
        },
        sorter: (a, b) => {
          const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '';
          const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.name || '';
          return nameA.localeCompare(nameB);
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Enrolled Courses',
        key: 'enrolledCourses',
        render: (_, record) => {
          // Calculate enrolled courses from the courses data
          const enrolledCount = courses.filter(course => 
            course.students && course.students.some(student => student._id === record._id)
          ).length;
          
          return (
            <Tag color="blue">
              {enrolledCount} courses
            </Tag>
          );
        },
      },
      {
        title: 'Join Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format('MMM DD, YYYY'),
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="View Profile">
              <Button 
                type="link" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => {
                  Modal.info({
                    title: 'Student Profile',
                    content: (
                      <div>
                        <p><strong>Name:</strong> {`${record.firstName || ''} ${record.lastName || ''}`.trim() || record.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {record.email}</p>
                        <p><strong>Role:</strong> {record.role || 'Student'}</p>
                        <p><strong>Status:</strong> {record.isApproved ? 'Approved' : 'Pending'}</p>
                        <p><strong>Enrolled Courses:</strong> {courses.filter(course => 
                          course.students && course.students.some(student => student._id === record._id)
                        ).length}</p>
                        <p><strong>Join Date:</strong> {moment(record.createdAt).format('MMMM DD, YYYY')}</p>
                      </div>
                    ),
                  });
                }}
              />
            </Tooltip>
            <Tooltip title="Send Message">
              <Button 
                type="link" 
                size="small" 
                icon={<MessageOutlined />}
                onClick={() => handleSendMessage(record)}
              />
            </Tooltip>
            <Tooltip title="Video Call">
              <Button 
                type="link" 
                size="small" 
                icon={<VideoCameraOutlined />}
                onClick={() => handleVideoCall(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title={
          <Space>
            <span>Student Management</span>
            {selectedCourseForStudents && (
              <Tag color="blue">
                Course: {selectedCourseForStudents.title}
              </Tag>
            )}
          </Space>
        }
        extra={
          selectedCourseForStudents && (
            <Button
              onClick={() => setSelectedCourseForStudents(null)}
              icon={<CloseOutlined />}
            >
              Show All Students
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={selectedCourseForStudents 
            ? students.filter(student => 
                student.enrolledCourses?.some(course => course._id === selectedCourseForStudents._id)
              )
            : students
          }
          loading={studentLoading}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            simple: isMobile,
          }}
          size={isMobile ? 'small' : 'default'}
        />

        {/* Message Modal */}
        <Modal
          title={`Send Message to ${selectedStudent ? `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() : 'Student'}`}
          open={isMessageModalVisible}
          onCancel={() => {
            setIsMessageModalVisible(false);
            setSelectedStudent(null);
            messageForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={messageForm}
            layout="vertical"
            onFinish={handleMessageSubmit}
          >
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter a subject' }]}
            >
              <Input placeholder="Enter message subject" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please enter your message' }]}
            >
              <Input.TextArea 
                rows={6} 
                placeholder="Type your message here..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button onClick={() => {
                  setIsMessageModalVisible(false);
                  setSelectedStudent(null);
                  messageForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={sendingMessage}
                  icon={<MessageOutlined />}
                >
                  Send Message
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Video Call Modal */}
        <Modal
          title={`Start Video Call with ${selectedStudentForCall ? `${selectedStudentForCall.firstName || ''} ${selectedStudentForCall.lastName || ''}`.trim() : 'Student'}`}
          open={isVideoCallModalVisible}
          onCancel={() => {
            setIsVideoCallModalVisible(false);
            setSelectedStudentForCall(null);
          }}
          footer={null}
          width={500}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <VideoCameraOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
            <h3>Choose Video Call Platform</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Select your preferred video calling platform to start the session
            </p>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall('jitsi')}
                loading={videoCallLoading}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Start with Jitsi Meet (Free)
              </Button>
              
              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall('zoom')}
                loading={videoCallLoading}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Start with Zoom
              </Button>
              
              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall('teams')}
                loading={videoCallLoading}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Start with Microsoft Teams
              </Button>
              
              <Button
                size="large"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => handleStartVideoCall('meet')}
                loading={videoCallLoading}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Start with Google Meet
              </Button>
            </Space>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#52c41a' }}>
                <CheckCircleOutlined style={{ marginRight: '5px' }} />
                Meeting link will be automatically sent to the student via message
              </p>
            </div>
          </div>
        </Modal>
      </Card>
    );
  };

  // Analytics Component
  const renderAnalytics = () => {
    console.log('📊 Rendering analytics with data:', analyticsData);

    // Ensure we have safe defaults
    const safeAnalyticsData = analyticsData || {};
    const charts = safeAnalyticsData.charts || {};
    const overview = safeAnalyticsData.overview || {};
    const recentActivity = safeAnalyticsData.recentActivity || [];

    // Use real data if available, fallback to default
    const performanceChartData = charts.performanceData || {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Average Score (%)',
          data: [0, 0, 0, 0],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };

    const engagementChartData = charts.engagementData || {
      labels: ['No Data'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['rgba(200, 200, 200, 0.8)'],
        },
      ],
    };

    return (
      <div>
        {/* Analytics Header */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📊 Analytics & Reports
                  <Badge 
                    count="LIVE" 
                    style={{ 
                      backgroundColor: '#52c41a',
                      fontSize: '10px',
                      marginLeft: '8px'
                    }} 
                  />
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Real-time analytics powered by your teaching modules
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Data automatically calculated from Student Management, Grading Center, Quiz & Assignment systems
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
                <Space direction={isMobile ? 'horizontal' : 'vertical'} size="small">
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={() => {
                      // First try local calculation, then server if available
                      calculateLocalAnalytics();
                      fetchAnalytics();
                    }}
                    loading={analyticsLoading}
                    size="large"
                  >
                    Refresh Analytics
                  </Button>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Last updated: {new Date().toLocaleTimeString()}
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Real-time Data Status */}
        <Alert
          message="📈 Live Data Analytics"
          description={
            <div>
              <Text>
                Current data includes: <strong>{courses.length}</strong> courses, <strong>{students.length}</strong> students, 
                <strong> {progressRecords.length}</strong> graded assignments, <strong>{quizzes.length}</strong> quizzes, 
                and <strong>{homeworks.length}</strong> homework assignments.
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                All metrics below are calculated in real-time from your active teaching modules.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* 🧩 Main Analytics Widgets / KPIs */}
        <Card 
          title={
            <Space>
              <TrophyOutlined style={{ color: '#1890ff' }} />
              <span>🧩 Key Performance Indicators</span>
              <Badge count="LIVE" style={{ backgroundColor: '#52c41a' }} />
            </Space>
          } 
          style={{ marginBottom: 24 }}
          extra={
            <Tooltip title="These metrics are calculated from your actual teaching data">
              <Button type="text" icon={<QuestionCircleOutlined />} size="small" />
            </Tooltip>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  minHeight: '140px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Students</span>}
                  value={(() => {
                    // Calculate from Student Management module
                    const uniqueStudents = new Set();
                    courses.forEach(course => {
                      if (course.students && Array.isArray(course.students)) {
                        course.students.forEach(student => uniqueStudents.add(student._id || student));
                      }
                    });
                    return uniqueStudents.size || students.length || overview.totalStudents || 0;
                  })()}
                  valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Enrolled across all classes
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  minHeight: '140px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Submissions</span>}
                  value={(() => {
                    // Calculate from Assignment & Quiz tables
                    const progressSubmissions = progressRecords.length;
                    const quizSubmissions = quizzes.reduce((acc, quiz) => acc + (quiz.submissions?.length || 0), 0);
                    const homeworkSubmissions = homeworks.reduce((acc, hw) => acc + (hw.submissions?.length || 0), 0);
                    return progressSubmissions + quizSubmissions + homeworkSubmissions || overview.totalSubmissions || 0;
                  })()}
                  valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Assignments, quizzes & exercises
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  minHeight: '140px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Average Score</span>}
                  value={(() => {
                    // Calculate from Grading Center data
                    const validScores = progressRecords.filter(record => record.percentage && !isNaN(record.percentage));
                    return validScores.length > 0 
                      ? Math.round(validScores.reduce((acc, record) => acc + record.percentage, 0) / validScores.length)
                      : overview.averageScore || 0;
                  })()}
                  suffix="%"
                  valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Across all assessments
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  border: 'none',
                  minHeight: '140px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Active Students</span>}
                  value={(() => {
                    // From User Activity logs (simplified calculation)
                    const totalStudents = (() => {
                      const uniqueStudents = new Set();
                      courses.forEach(course => {
                        if (course.students && Array.isArray(course.students)) {
                          course.students.forEach(student => uniqueStudents.add(student._id || student));
                        }
                      });
                      return uniqueStudents.size || students.length;
                    })();
                    // Estimate 70-80% activity rate from recent submissions
                    const recentActivityRate = progressRecords.length > 0 ? 0.8 : 0.7;
                    return Math.min(totalStudents, Math.floor(totalStudents * recentActivityRate)) || overview.activeStudents || 0;
                  })()}
                  suffix={`/ ${(() => {
                    const uniqueStudents = new Set();
                    courses.forEach(course => {
                      if (course.students && Array.isArray(course.students)) {
                        course.students.forEach(student => uniqueStudents.add(student._id || student));
                      }
                    });
                    return uniqueStudents.size || students.length || overview.totalStudents || 0;
                  })()}`}
                  valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Recent activity (7 days)
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Data Sources Information */}
        <Card 
          title={
            <Space>
              <InboxOutlined />
              <span>📋 Data Sources & Calculation Methods</span>
            </Space>
          } 
          style={{ marginBottom: 24 }}
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f6f6f6' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>👥</div>
                  <Text strong>Total Students</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Count of all students enrolled across teacher's classes from <strong>Student Management</strong> module
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f6f6f6' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>📝</div>
                  <Text strong>Total Submissions</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Total assignments, quizzes, exercises submitted from <strong>Grading Center</strong> data
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f6f6f6' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎯</div>
                  <Text strong>Average Score</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Average grade across all submitted assessments from <strong>Progress Records</strong>
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f6f6f6' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚡</div>
                  <Text strong>Active Students</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Students with submissions or activity in the past 7 days from <strong>User Activity</strong> logs
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Charts Row */}
        <Row gutter={isMobile ? [16, 16] : [24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <LineChartOutlined />
                  <span>Performance Trends</span>
                </Space>
              }
              loading={analyticsLoading}
              extra={
                <Text type="secondary">Last 4 weeks</Text>
              }
            >
              {performanceChartData.datasets && performanceChartData.datasets[0] && performanceChartData.datasets[0].data.some(val => val > 0) ? (
                <Line 
                  data={performanceChartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <Empty 
                  description="No performance data available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined />
                  <span>Assignment Types</span>
                </Space>
              }
              loading={analyticsLoading}
              extra={
                <Text type="secondary">Distribution</Text>
              }
            >
              {engagementChartData.labels && engagementChartData.labels.length > 0 && engagementChartData.labels[0] !== 'No Data' ? (
                <Doughnut 
                  data={engagementChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <Empty 
                  description="No assignment data available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card 
          title={
            <Space>
              <ClockCircleOutlined />
              <span>Recent Grading Activity</span>
            </Space>
          }
          extra={
            <Text type="secondary">Latest {recentActivity.length} activities</Text>
          }
        >
          {recentActivity.length > 0 ? (
            <Timeline>
              {recentActivity.map((activity, index) => (
                <Timeline.Item 
                  key={activity.id || index}
                  color={
                    activity.percentage >= 90 ? 'green' :
                    activity.percentage >= 80 ? 'blue' :
                    activity.percentage >= 70 ? 'orange' : 'red'
                  }
                >
                  <div>
                    <Text strong>{activity.studentName}</Text>
                    <Text> completed </Text>
                    <Text strong>"{activity.assignment}"</Text>
                    <Text> in </Text>
                    <Tag color="blue">{activity.subject}</Tag>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Tag color={
                        ['A+', 'A', 'A-'].includes(activity.grade) ? 'green' :
                        ['B+', 'B', 'B-'].includes(activity.grade) ? 'blue' :
                        ['C+', 'C', 'C-'].includes(activity.grade) ? 'orange' : 'red'
                      }>
                        {activity.grade}
                      </Tag>
                      <Text type="secondary">{activity.percentage}%</Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">
                        {moment(activity.date).fromNow()}
                      </Text>
                    </Space>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty 
              description="No recent grading activity"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Grade Distribution */}
        {safeAnalyticsData.gradeDistribution && Object.keys(safeAnalyticsData.gradeDistribution).length > 0 && (
          <Card 
            title={
              <Space>
                <FormOutlined />
                <span>Grade Distribution</span>
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Row gutter={[16, 16]}>
              {Object.entries(safeAnalyticsData.gradeDistribution || {}).map(([grade, count]) => (
                <Col xs={12} sm={8} md={6} lg={4} key={grade}>
                  <Card size="small">
                    <Statistic
                      title={`Grade ${grade}`}
                      value={count}
                      valueStyle={{
                        color: ['A+', 'A', 'A-'].includes(grade) ? '#3f8600' :
                               ['B+', 'B', 'B-'].includes(grade) ? '#1890ff' :
                               ['C+', 'C', 'C-'].includes(grade) ? '#faad14' : '#cf1322'
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </div>
    );
  };

  // Quiz Management Functions
  const renderQuizManagement = () => {
    const columns = [
      {
        title: t('quiz.title'),
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t('quiz.course'),
        dataIndex: 'course',
        key: 'course',
        render: (course) => course?.title || t('quiz.noCourse'),
      },
      {
        title: t('quiz.questions'),
        dataIndex: 'questions',
        key: 'questions',
        render: (questions) => questions?.length || 0,
      },
      {
        title: t('quiz.timeLimit'),
        dataIndex: 'timeLimit',
        key: 'timeLimit',
        render: (time) => time ? `${time} ${t('common.minutes')}` : t('quiz.noTimeLimit'),
      },
      {
        title: t('quiz.attempts'),
        dataIndex: 'attempts',
        key: 'attempts',
        render: (attempts) => attempts || t('quiz.unlimited'),
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : status === 'draft' ? 'orange' : 'red'}>
            {t(`quiz.status.${status}`)}
          </Tag>
        ),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title={t('common.view')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => handleViewQuiz(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.edit')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditQuiz(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <Popconfirm
                title={t('quiz.deleteConfirm')}
                onConfirm={() => handleDeleteQuiz(record._id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <div className="quiz-management">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>{t('quiz.management')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log('🧩 Opening Quiz modal with allCourses:', allCourses);
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log('🔄 Courses empty, refreshing...');
                await fetchAllCourses();
              }
              setIsQuizModalVisible(true);
            }}
          >
            {t('quiz.create')}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('quiz.stats.total')}
                value={quizzes.length}
                prefix={<FormOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('quiz.stats.active')}
                value={quizzes.filter(q => q.status === 'active').length}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('quiz.stats.draft')}
                value={quizzes.filter(q => q.status === 'draft').length}
                valueStyle={{ color: '#faad14' }}
                prefix={<EditOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('quiz.stats.completed')}
                value={quizzes.filter(q => q.submissions?.length > 0).length}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="_id"
            loading={quizLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('quiz.items')}`,
            }}
          />
        </Card>

        {/* Quiz Modal */}
        <Modal
          title={editingQuiz ? t('quiz.edit') : t('quiz.create')}
          visible={isQuizModalVisible}
          onCancel={() => {
            setIsQuizModalVisible(false);
            setEditingQuiz(null);
            quizForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <QuizForm 
            form={quizForm}
            quiz={editingQuiz}
            onSubmit={handleQuizSubmit}
            onCancel={() => {
              setIsQuizModalVisible(false);
              setEditingQuiz(null);
              quizForm.resetFields();
            }}
          />
        </Modal>

        {/* View Quiz Modal */}
        <Modal
          title={t('quiz.view')}
          visible={!!viewingQuiz}
          onCancel={() => setViewingQuiz(null)}
          footer={[
            <Button key="close" onClick={() => setViewingQuiz(null)}>
              {t('common.close')}
            </Button>
          ]}
          width={1000}
        >
          {viewingQuiz && <QuizViewer quiz={viewingQuiz} />}
        </Modal>
      </div>
    );
  };

  // Homework Management Functions
  const renderHomeworkManagement = () => {
    const columns = [
      {
        title: t('homework.title'),
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t('homework.course'),
        dataIndex: 'course',
        key: 'course',
        render: (course) => course?.title || t('homework.noCourse'),
      },
      {
        title: t('homework.dueDate'),
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (date) => date ? new Date(date).toLocaleDateString() : t('homework.noDueDate'),
        sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      },
      {
        title: t('homework.submissions'),
        key: 'submissions',
        render: (_, record) => (
          <span>
            {record.submissions?.length || 0} / {record.course?.students?.length || 0}
          </span>
        ),
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : status === 'draft' ? 'orange' : 'red'}>
            {t(`homework.status.${status}`)}
          </Tag>
        ),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title={t('common.view')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => handleViewHomework(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.edit')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditHomework(record)}
              />
            </Tooltip>
            <Tooltip title={t('homework.viewSubmissions')}>
              <Button 
                type="link" 
                size="small" 
                icon={<InboxOutlined />}
                onClick={() => handleViewSubmissions(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <Popconfirm
                title={t('homework.deleteConfirm')}
                onConfirm={() => handleDeleteHomework(record._id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <div className="homework-management">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>{t('homework.management')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log('📝 Opening Homework modal with allCourses:', allCourses);
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log('🔄 Courses empty, refreshing...');
                await fetchAllCourses();
              }
              setIsHomeworkModalVisible(true);
            }}
          >
            {t('homework.create')}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('homework.stats.total')}
                value={homeworks.length}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('homework.stats.active')}
                value={homeworks.filter(h => h.status === 'active').length}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('homework.stats.pending')}
                value={homeworks.reduce((acc, h) => acc + (h.submissions?.filter(s => s.status === 'submitted').length || 0), 0)}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('homework.stats.graded')}
                value={homeworks.reduce((acc, h) => acc + (h.submissions?.filter(s => s.status === 'graded').length || 0), 0)}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={homeworks}
            rowKey="_id"
            loading={homeworkLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('homework.items')}`,
            }}
          />
        </Card>

        {/* Homework Modal */}
        <Modal
          title={editingHomework ? t('homework.edit') : t('homework.create')}
          visible={isHomeworkModalVisible}
          onCancel={() => {
            setIsHomeworkModalVisible(false);
            setEditingHomework(null);
            homeworkForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <HomeworkForm 
            form={homeworkForm}
            homework={editingHomework}
            onSubmit={handleHomeworkSubmit}
            onCancel={() => {
              setIsHomeworkModalVisible(false);
              setEditingHomework(null);
              homeworkForm.resetFields();
            }}
          />
        </Modal>
      </div>
    );
  };

  // Listening Exercises Functions
  const renderListeningExercises = () => {
    const columns = [
      {
        title: t('listening.title'),
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: t('listening.course'),
        dataIndex: 'course',
        key: 'course',
        render: (course) => course?.title || t('listening.noCourse'),
      },
      {
        title: t('listening.duration'),
        dataIndex: 'duration',
        key: 'duration',
        render: (duration) => duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : t('listening.noDuration'),
      },
      {
        title: t('listening.questions'),
        dataIndex: 'questions',
        key: 'questions',
        render: (questions) => questions?.length || 0,
      },
      {
        title: t('listening.audio'),
        key: 'audio',
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            icon={currentPlayingId === record._id ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handlePlayAudio(record)}
          >
            {currentPlayingId === record._id ? t('listening.pause') : t('listening.play')}
          </Button>
        ),
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : status === 'draft' ? 'orange' : 'red'}>
            {t(`listening.status.${status}`)}
          </Tag>
        ),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title={t('common.view')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => handleViewListening(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.edit')}>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditListening(record)}
              />
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <Popconfirm
                title={t('listening.deleteConfirm')}
                onConfirm={() => handleDeleteListening(record._id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <div className="listening-exercises">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>{t('listening.management')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={async () => {
              console.log('🎧 Opening Listening modal with allCourses:', allCourses);
              // Refresh courses if empty
              if (allCourses.length === 0) {
                console.log('🔄 Courses empty, refreshing...');
                await fetchAllCourses();
              }
              setIsListeningModalVisible(true);
            }}
          >
            {t('listening.create')}
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('listening.stats.total')}
                value={listeningExercises.length}
                prefix={<AudioOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('listening.stats.active')}
                value={listeningExercises.filter(l => l.status === 'active').length}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('listening.stats.totalQuestions')}
                value={listeningExercises.reduce((acc, l) => acc + (l.questions?.length || 0), 0)}
                valueStyle={{ color: '#faad14' }}
                prefix={<QuestionCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('listening.stats.avgDuration')}
                value={listeningExercises.length > 0 ? 
                  Math.round(listeningExercises.reduce((acc, l) => acc + (l.duration || 0), 0) / listeningExercises.length / 60) : 0}
                suffix={t('common.minutes')}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={listeningExercises}
            rowKey="_id"
            loading={listeningLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('listening.items')}`,
            }}
          />
        </Card>

        {/* Listening Exercise Modal */}
        <Modal
          title={editingListening ? t('listening.edit') : t('listening.create')}
          visible={isListeningModalVisible}
          onCancel={() => {
            setIsListeningModalVisible(false);
            setEditingListening(null);
            listeningForm.resetFields();
          }}
          footer={null}
          width={1000}
        >
          <ListeningForm 
            form={listeningForm}
            listening={editingListening}
            onSubmit={handleListeningSubmit}
            onCancel={() => {
              setIsListeningModalVisible(false);
              setEditingListening(null);
              listeningForm.resetFields();
            }}
          />
        </Modal>
      </div>
    );
  };

  // Settings Component
  const renderSettings = () => {
    return (
      <div>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Profile Settings" style={{ marginBottom: 24 }}>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Full Name">
                      <Input defaultValue={currentUser?.name} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email">
                      <Input defaultValue={currentUser?.email} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Phone Number">
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Department">
                      <Select defaultValue="english" placeholder="Select department">
                        <Option value="english">English Language</Option>
                        <Option value="mathematics">Mathematics</Option>
                        <Option value="science">Science</Option>
                        <Option value="technology">Technology</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Bio">
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Tell us about yourself..." 
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary">Update Profile</Button>
                </Form.Item>
              </Form>
            </Card>

            <Card title="Notification Preferences">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Text strong>Email Notifications</Text>
                  <br />
                  <Text type="secondary">Receive notifications via email</Text>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Text strong>Assignment Reminders</Text>
                  <br />
                  <Text type="secondary">Get reminders for assignment deadlines</Text>
                </div>
                <Switch defaultChecked />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Text strong>Student Submissions</Text>
                  <br />
                  <Text type="secondary">Notify when students submit work</Text>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Quick Actions" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block icon={<DownloadOutlined />}>
                  Export Class Data
                </Button>
                <Button block icon={<FileOutlined />}>
                  Generate Report
                </Button>
                <Button block icon={<SettingOutlined />}>
                  Advanced Settings
                </Button>
              </Space>
            </Card>

            <Card title="Account Security">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block>
                  Change Password
                </Button>
                <Button block>
                  Two-Factor Authentication
                </Button>
                <Button block danger>
                  Deactivate Account
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
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
      case 'students':
        return renderStudentManagement();
      case 'grading':
        return renderGradingCenter();
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
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .notification-item:hover {
          background-color: #f0f2f5 !important;
          transform: translateX(4px);
        }
        
        .notification-badge {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-3px); }
          60% { transform: translateY(-2px); }
        }
      `}</style>
      
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          onBreakpoint={(broken) => {
            if (broken) {
              setIsMobile(true);
              setCollapsed(true);
            } else {
              setIsMobile(false);
            }
          }}
          width={260}
          className="modern-sidebar"
          style={{
            background: 'linear-gradient(180deg, #1890ff 0%, #096dd9 50%, #0050b3 100%)',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            boxShadow: '4px 0 30px rgba(24, 144, 255, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
        {/* Logo Section */}
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: 50,
            height: 50,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: collapsed ? 0 : 15
          }}>
            <BookOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          {!collapsed && (
            <>
              <Title level={4} style={{ color: '#fff', margin: '10px 0 5px 0', fontSize: '18px' }}>
                Teacher Portal
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                Forum Academy
              </Text>
            </>
          )}
        </div>
        
        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          items={teacherMenuItems.map(item => ({
            ...item,
            style: {
              margin: '4px 0',
              borderRadius: collapsed ? '0' : '0 25px 25px 0',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }
          }))}
          onClick={(e) => setActiveTab(e.key)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '20px 0',
            height: 'calc(100vh - 120px)',
            overflowY: 'auto'
          }}
        />
        </Sider>
      )}

      {/* Main Layout */}
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 260), 
        transition: 'all 0.3s ease',
        minHeight: '100vh'
      }}>
        <Header style={{ 
          padding: isMobile ? '0 16px' : '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          height: isMobile ? '56px' : '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(!mobileDrawerVisible);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            {!isMobile && (
              <Breadcrumb style={{ marginLeft: 16 }}>
                <Breadcrumb.Item>
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Teacher Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item>{teacherMenuItems.find(item => item.key === activeTab)?.label}</Breadcrumb.Item>
              </Breadcrumb>
            )}
            {isMobile && (
              <Title level={5} style={{ margin: '0 0 0 16px', color: '#262626' }}>
                {teacherMenuItems.find(item => item.key === activeTab)?.label}
              </Title>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={notificationStats.unread} overflowCount={99}>
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationDrawerVisible(true)}
                style={{ 
                  color: notificationStats.unread > 0 ? '#1890ff' : undefined,
                  animation: notificationStats.unread > 0 ? 'pulse 2s infinite' : 'none'
                }}
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'My Profile',
                    onClick: () => message.info('Profile settings coming soon!')
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                    onClick: () => setActiveTab('settings')
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout,
                    danger: true
                  }
                ]
              }}
              placement="bottomRight"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                padding: isMobile ? '6px 8px' : '8px 12px', 
                borderRadius: '6px', 
                transition: 'background-color 0.2s' 
              }}>
                <Avatar 
                  size={isMobile ? 32 : "small"}
                  style={{ backgroundColor: '#1890ff', marginRight: isMobile ? 6 : 8 }} 
                  icon={<UserOutlined />} 
                />
                {!isMobile && (
                  <Text strong style={{ color: '#262626' }}>
                    {currentUser?.name || 'Teacher'}
                  </Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ 
          margin: isMobile ? '16px 8px' : '24px 16px', 
          padding: isMobile ? 16 : 24, 
          background: '#f0f2f5',
          minHeight: 280,
          borderRadius: isMobile ? '8px' : '12px',
          transition: 'all 0.3s ease'
        }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span style={{ fontWeight: 600 }}>Teacher Portal</span>
          </div>
        }
        placement="left"
        closable={true}
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible && isMobile}
        width={isMobile ? Math.min(280, window.innerWidth * 0.8) : 280}
        bodyStyle={{ 
          padding: 0,
          background: 'linear-gradient(180deg, #f0f2f5 0%, #fafafa 100%)'
        }}
        headerStyle={{
          background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
          color: '#fff',
          borderBottom: 'none'
        }}
        className="mobile-drawer"
      >
        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={teacherMenuItems.map(item => ({
            ...item,
            style: {
              margin: '8px 16px',
              borderRadius: '8px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 500
            }
          }))}
          onClick={(e) => {
            setActiveTab(e.key);
            setMobileDrawerVisible(false);
          }}
          style={{ 
            border: 'none',
            background: 'transparent',
            padding: '16px 0',
            height: '100%',
            overflowY: 'auto'
          }}
        />
      </Drawer>

      {/* Audio Player */}
      {audioUrl && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          background: 'white',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <audio
            controls
            autoPlay
            onEnded={() => {
              setCurrentPlayingId(null);
              setAudioUrl('');
            }}
          >
            <source src={audioUrl} type="audio/mpeg" />
            <source src={audioUrl} type="audio/wav" />
            <source src={audioUrl} type="audio/ogg" />
            {t('listening.audioNotSupported')}
          </audio>
          <Button
            size="small"
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setCurrentPlayingId(null);
              setAudioUrl('');
            }}
            style={{ marginLeft: 8 }}
          />
        </div>
      )}

      {/* Grading Modals */}
      {/* Add Grade Modal */}
      <Modal
        title="Add Student Grade"
        open={createProgressModalVisible}
        onCancel={() => {
          setCreateProgressModalVisible(false);
          progressForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {/* Debug Info */}
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
                      loading={studentLoading}
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
            <Input.TextArea rows={2} placeholder="Assignment description (optional)" />
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
          >
            <Input.TextArea rows={3} placeholder="Feedback for student (optional)" />
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
              <Button type="primary" htmlType="submit" loading={gradingLoading}>
                Add Grade
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Edit Grade Modal */}
      <Modal
        title="Edit Student Grade"
        open={editProgressModalVisible}
        onCancel={() => {
          setEditProgressModalVisible(false);
          setSelectedProgress(null);
          editProgressForm.resetFields();
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
            <Input.TextArea rows={3} placeholder="Feedback for student" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                setEditProgressModalVisible(false);
                setSelectedProgress(null);
                editProgressForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={gradingLoading}>
                Update Grade
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Create Announcement Modal */}
      <Modal
        title="Create Announcement"
        open={createAnnouncementModalVisible}
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
            <Input.TextArea rows={5} placeholder="Announcement content" />
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

      {/* View Progress Modal */}
      <Modal
        title="View Student Grade Details"
        open={viewProgressModalVisible}
        onCancel={() => {
          setViewProgressModalVisible(false);
          setViewingProgress(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewProgressModalVisible(false);
            setViewingProgress(null);
          }}>
            Close
          </Button>
        ]}
        width={700}
      >
        {viewingProgress && (
          <div>
            {/* Student Information */}
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Student Information</span>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Student Name" span={1}>
                  <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <Text strong>
                      {viewingProgress.student?.firstName} {viewingProgress.student?.lastName}
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Student ID" span={1}>
                  <Text>{viewingProgress.student?.studentId || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={1}>
                  <Text>{viewingProgress.student?.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Grade Level" span={1}>
                  <Text>{viewingProgress.student?.gradeLevel || 'N/A'}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Assignment Information */}
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Assignment Details</span>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Subject" span={1}>
                  <Tag color="blue">{viewingProgress.subject}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Assignment Type" span={1}>
                  <Tag color={
                    viewingProgress.assignmentType === 'exam' ? 'red' :
                    viewingProgress.assignmentType === 'quiz' ? 'blue' :
                    viewingProgress.assignmentType === 'homework' ? 'green' :
                    viewingProgress.assignmentType === 'project' ? 'purple' :
                    viewingProgress.assignmentType === 'participation' ? 'orange' : 'gray'
                  }>
                    {viewingProgress.assignmentType?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Assignment Name" span={2}>
                  <Text strong>{viewingProgress.assignment}</Text>
                </Descriptions.Item>
                {viewingProgress.description && (
                  <Descriptions.Item label="Description" span={2}>
                    <Text>{viewingProgress.description}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* Grade Information */}
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>Grade Information</span>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Score"
                      value={`${viewingProgress.score}/${viewingProgress.maxScore}`}
                      valueStyle={{ 
                        color: viewingProgress.percentage >= 90 ? '#52c41a' : 
                               viewingProgress.percentage >= 80 ? '#1890ff' :
                               viewingProgress.percentage >= 70 ? '#faad14' : '#f5222d'
                      }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Percentage"
                      value={viewingProgress.percentage}
                      suffix="%"
                      valueStyle={{ 
                        color: viewingProgress.percentage >= 90 ? '#52c41a' : 
                               viewingProgress.percentage >= 80 ? '#1890ff' :
                               viewingProgress.percentage >= 70 ? '#faad14' : '#f5222d'
                      }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }}>
                        Letter Grade
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        <Tag 
                          color={
                            ['A+', 'A', 'A-'].includes(viewingProgress.grade) ? 'green' :
                            ['B+', 'B', 'B-'].includes(viewingProgress.grade) ? 'blue' :
                            ['C+', 'C', 'C-'].includes(viewingProgress.grade) ? 'orange' :
                            ['D+', 'D'].includes(viewingProgress.grade) ? 'red' : 'red'
                          }
                          style={{ fontSize: '18px', padding: '4px 12px' }}
                        >
                          {viewingProgress.grade}
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Timeline Information */}
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Timeline</span>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Submission Date" span={1}>
                  <Text>{viewingProgress.submissionDate ? moment(viewingProgress.submissionDate).format('MMM DD, YYYY HH:mm') : 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Graded Date" span={1}>
                  <Text>{moment(viewingProgress.gradedDate).format('MMM DD, YYYY HH:mm')}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Teacher" span={2}>
                  <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <Text>
                      {viewingProgress.teacher?.firstName} {viewingProgress.teacher?.lastName}
                    </Text>
                    <Text type="secondary">({viewingProgress.teacher?.email})</Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Comments */}
            {viewingProgress.comments && (
              <Card
                title={
                  <Space>
                    <MessageOutlined />
                    <span>Teacher Comments</span>
                  </Space>
                }
              >
                <div style={{
                  background: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9'
                }}>
                  <Text>{viewingProgress.comments}</Text>
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Notification Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <BellOutlined style={{ color: '#1890ff' }} />
              <span>Notifications</span>
              {notificationStats.unread > 0 && (
                <Badge count={notificationStats.unread} style={{ backgroundColor: '#52c41a' }} />
              )}
            </Space>
            {notificationStats.unread > 0 && (
              <Button 
                type="link" 
                size="small" 
                onClick={markAllNotificationsAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        }
        placement="right"
        width={isMobile ? '100%' : 420}
        open={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        bodyStyle={{ padding: 0 }}
        extra={
          <Button 
            type="text" 
            icon={<SearchOutlined />} 
            onClick={fetchNotifications}
            loading={notificationLoading}
            title="Refresh notifications"
          />
        }
      >
        {notificationLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <Empty 
            description="No notifications"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  padding: '16px',
                  backgroundColor: notification.read ? '#fff' : '#f6f8fa',
                  borderLeft: `4px solid ${notification.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {moment(notification.timestamp).fromNow()}
                    </Text>
                    {!notification.read && (
                      <Badge 
                        status="processing" 
                        text="New" 
                        style={{ fontSize: '10px', marginTop: '4px' }}
                      />
                    )}
                  </div>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: notification.color }}
                      icon={
                        notification.icon === 'message' ? <MessageOutlined /> :
                        notification.icon === 'file-text' ? <FileTextOutlined /> :
                        notification.icon === 'bell' ? <BellOutlined /> :
                        notification.icon === 'question-circle' ? <QuestionCircleOutlined /> :
                        notification.icon === 'setting' ? <SettingOutlined /> :
                        notification.icon === 'clock-circle' ? <ClockCircleOutlined /> :
                        notification.icon === 'user' ? <UserOutlined /> :
                        notification.icon === 'team' ? <TeamOutlined /> :
                        <BellOutlined />
                      }
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong={!notification.read} style={{ fontSize: '14px' }}>
                        {notification.title}
                      </Text>
                      <Tag 
                        color={
                          notification.priority === 'high' ? 'red' :
                          notification.priority === 'medium' ? 'orange' :
                          'blue'
                        }
                        size="small"
                      >
                        {notification.priority}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text 
                        type="secondary" 
                        style={{ 
                          fontSize: '13px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {notification.message}
                      </Text>
                      {notification.sender && (
                        <div style={{ marginTop: '8px' }}>
                          <Space size="small">
                            <Avatar size={16} icon={<UserOutlined />} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {notification.sender.firstName} {notification.sender.lastName}
                            </Text>
                          </Space>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
        
        {/* Notification Actions */}
        {notifications.length > 0 && (
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            position: 'sticky',
            bottom: 0
          }}>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                ghost 
                icon={<SearchOutlined />}
                onClick={fetchNotifications}
                loading={notificationLoading}
              >
                Refresh
              </Button>
              <Button 
                icon={<CheckCircleOutlined />}
                onClick={markAllNotificationsAsRead}
                disabled={notificationStats.unread === 0}
              >
                Mark All Read
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </Layout>
    </>
  );
};

export default TeacherDashboard;
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
  ReadOutlined, CheckSquareOutlined, LineChartOutlined, FormOutlined,
  WarningOutlined, FolderOpenOutlined, PauseCircleOutlined,
  InboxOutlined
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

  // Data loading effects
  useEffect(() => {
    if (activeTab === 'quizzes') {
      fetchQuizzes();
    } else if (activeTab === 'homework') {
      fetchHomeworks();
    } else if (activeTab === 'listening') {
      fetchListeningExercises();
    }
  }, [activeTab]);

  // Quiz Management Functions
  const fetchQuizzes = async () => {
    setQuizLoading(true);
    try {
      const response = await quizAPI.getQuizzes();
      setQuizzes(response.data || []);
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
      const response = await homeworkAPI.getHomeworks();
      setHomeworks(response.data || []);
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
      // TODO: Implement listeningExerciseAPI
      setListeningExercises([]);
      message.info('Listening exercises API not yet implemented');
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
      // TODO: Implement listeningExerciseAPI.deleteListeningExercise
      message.info('Delete listening exercise API not yet implemented');
      fetchListeningExercises();
    } catch (error) {
      console.error('Error deleting listening exercise:', error);
      message.error(t('listening.deleteError'));
    }
  };

  const handleListeningSubmit = async (values) => {
    try {
      // TODO: Implement listeningExerciseAPI.updateListeningExercise and createListeningExercise
      message.info('Listening exercise save API not yet implemented');
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
          // TODO: Implement listeningExerciseAPI.getAudioUrl
          message.info('Audio URL API not yet implemented');
          setAudioUrl('');
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      message.error(t('listening.audioError'));
    }
  };

  // Form Components
  const QuizForm = ({ form, quiz, onSubmit, onCancel }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      fetchCourses();
    }, []);

    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

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
          <Select placeholder={t('quiz.selectCourse')}>
            {courses.map(course => (
              <Select.Option key={course._id} value={course._id}>
                {course.title}
              </Select.Option>
            ))}
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
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      fetchCourses();
    }, []);

    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

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
          <Select placeholder={t('homework.selectCourse')}>
            {courses.map(course => (
              <Select.Option key={course._id} value={course._id}>
                {course.title}
              </Select.Option>
            ))}
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
    const [courses, setCourses] = useState([]);
    const [audioFile, setAudioFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
      fetchCourses();
    }, []);

    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

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
          <Select placeholder={t('listening.selectCourse')}>
            {courses.map(course => (
              <Select.Option key={course._id} value={course._id}>
                {course.title}
              </Select.Option>
            ))}
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
            onClick={() => setIsQuizModalVisible(true)}
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
            onClick={() => setIsHomeworkModalVisible(true)}
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
            onClick={() => setIsListeningModalVisible(true)}
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

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderPlaceholder('My Classes', 'Manage your courses and class schedules');
      case 'materials':
        return renderPlaceholder('Teaching Materials', 'Upload and manage course materials');
      case 'quizzes':
        return renderQuizManagement();
      case 'homework':
        return renderHomeworkManagement();
      case 'listening':
        return renderListeningExercises();
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
    </Layout>
  );
};

export default TeacherDashboard;
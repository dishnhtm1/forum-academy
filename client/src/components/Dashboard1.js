import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { materialAPI } from '../utils/apiClient';
// Import sidebar styles
import '../styles/AdminSidebar.css';
// Import dashboard styles
import '../styles/Dashboard.css';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Ant Design imports
import {
    Layout, Menu, Card, Table, Button, Form, Input, Upload, Modal, Select, 
    Tabs, Progress, notification, Tag, Space, Divider, Row, Col, Statistic,
    DatePicker, TimePicker, Switch, Radio, Checkbox, InputNumber, TreeSelect,
    Spin, Alert, Badge, Avatar, Dropdown, Popconfirm, Typography, Rate,
    Steps, Drawer, Carousel, Collapse, Breadcrumb, Affix, BackTop, Result,
    Empty, List, Calendar, Timeline, Comment, Tooltip as AntTooltip
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, 
    DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
    QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
    ExclamationCircleOutlined, BellOutlined, SettingOutlined,
    UserOutlined, BookOutlined, FileTextOutlined, PlayCircleOutlined,
    PauseCircleOutlined, EyeOutlined, SearchOutlined, FilterOutlined,
    MoreOutlined, StarOutlined, MessageOutlined, HomeOutlined,
    DashboardOutlined, TeamOutlined, FileAddOutlined, MailOutlined,
    BarChartOutlined, LineChartOutlined, PieChartOutlined, 
    ClockCircleOutlined, CalendarOutlined, TrophyOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, LeftOutlined
} from '@ant-design/icons';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    // Add styles to override Ant Design menu backgrounds
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-admin-menu .ant-menu,
            .enhanced-admin-menu .ant-menu-sub,
            .enhanced-admin-menu .ant-menu-item,
            .enhanced-admin-menu .ant-menu-submenu,
            .enhanced-admin-menu .ant-menu-submenu-title,
            .enhanced-admin-menu .ant-menu-submenu-popup {
                background: transparent !important;
                background-color: transparent !important;
            }
            .enhanced-admin-menu .ant-menu-item:hover,
            .enhanced-admin-menu .ant-menu-submenu-title:hover {
                background-color: rgba(255,255,255,0.1) !important;
            }
            .enhanced-admin-menu .ant-menu-item-selected {
                background-color: rgba(255,255,255,0.15) !important;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // ✅ Helper functions
    // const getRoleDisplayName = (role) => {
    //     const roleNames = {
    //         student: 'Student',
    //         teacher: 'Teacher',
    //         admin: 'Administrator'
    //     };
    //     return roleNames[role] || 'User';
    // };

    // const getDashboardTitle = (role) => {
    //     const titles = {
    //         student: 'Learning Journey Tracker',
    //         teacher: 'Classroom Pulse Dashboard',
    //         admin: 'System Health Monitor'
    //     };
    //     return titles[role] || 'Dashboard';
    // };

    // ✅ Translation and Theme States
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ✅ User and Authentication States
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Navigation and UI States
    const [activeTab, setActiveTab] = useState('overview');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentApplicationPage, setCurrentApplicationPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // ✅ Data Collection States
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [applicationSubmissions, setApplicationSubmissions] = useState([]);
    const [contactSubmissions, setContactSubmissions] = useState([]);

    // ✅ Search and Filter States - Users
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // ✅ Search and Filter States - Applications
    const [searchTermApp, setSearchTermApp] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedAppStatus, setSelectedAppStatus] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null); // For status update dropdown

    // ✅ Search and Filter States - Contact Forms
    const [searchTermContact, setSearchTermContact] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedContactStatus, setSelectedContactStatus] = useState('');
    
    // ✅ Contact Pagination States
    const [contactCurrentPage, setContactCurrentPage] = useState(1);
    const [contactItemsPerPage] = useState(8);
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    
    // ✅ Contact Management States
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [replyData, setReplyData] = useState({
        subject: '',
        message: '',
        recipient: null
    });

    // ✅ Modal and Form States
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ✅ User Management States
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newUserData, setNewUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    });

    // ✅ Add these new state variables with your existing states
    const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDeleteApplicationConfirm, setShowDeleteApplicationConfirm] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [showSendMessageModal, setShowSendMessageModal] = useState(false);
    const [messageData, setMessageData] = useState({
        subject: '',
        message: '',
        recipient: null
    });

    // ✅ Course Materials Management States
    const [showViewMaterialModal, setShowViewMaterialModal] = useState(false);
    const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [isUpdatingMaterial, setIsUpdatingMaterial] = useState(false);
    const [isDeletingMaterial, setIsDeletingMaterial] = useState(false);

    // ✅ Application Management Functions
    const handleViewApplication = (application) => {
        console.log('👁️ View application clicked:', application);
        setSelectedApplication(application);
        setShowViewApplicationModal(true);
    };
    
    const handleDeleteApplication = (application) => {
        console.log('🗑️ Delete application clicked:', application);
        setApplicationToDelete(application);
        setShowDeleteApplicationConfirm(true);
    };

    // ✅ FIXED: Update the handleSendMessage function to use correct field name
    const handleSendMessage = (application) => {
        console.log('📧 Send message clicked:', application);
        setMessageData({
            subject: `Regarding your application for ${application.program}`, // ✅ Changed from programInterested to program
            message: '',
            recipient: application
        });
        setShowSendMessageModal(true);
    };

    const handleSendMessageToUser = (user) => {
        console.log('📧 Send message to user clicked:', user);
        setMessageData({
            subject: '',
            message: '',
            recipient: user
        });
        setShowSendMessageModal(true);
    };
    
    const confirmDeleteApplication = async () => {
        console.log('🔥 DELETE APPLICATION CONFIRMATION CLICKED!');
        console.log('Application to delete:', applicationToDelete);
        
        if (!applicationToDelete) {
            alert('No application selected for deletion');
            return;
        }
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            console.log('🗑️ Attempting to delete application:', applicationToDelete._id);
            
            // Use the correct API URL
            const response = await fetch(`${API_BASE_URL}/api/applications/${applicationToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Delete application response status:', response.status);
            console.log('Response URL:', response.url);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Delete application successful:', result);
                
                if (result.success) {
                    // Remove application from local state
                    setApplicationSubmissions(prevApps => 
                        prevApps.filter(app => app._id !== applicationToDelete._id)
                    );
                    
                    // Reset modal state
                    setShowDeleteApplicationConfirm(false);
                    setApplicationToDelete(null);
                    
                    alert('Application deleted successfully!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const errorText = await response.text();
                console.error('Delete application failed:', errorText);
                
                // Try to parse as JSON, fallback to text
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || 'Unknown error';
                } catch {
                    errorMessage = errorText || 'Unknown error';
                }
                
                alert(`Error deleting application: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Error deleting application. Please try again.');
        }
    };
    
    const handleSendMessageSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            // Check if this is an application or a user
            const isApplication = messageData.recipient.program || messageData.recipient.applicationId;
            
            const messagePayload = {
                to: messageData.recipient.email,
                subject: messageData.subject,
                message: messageData.message,
                recipientName: `${messageData.recipient.firstName} ${messageData.recipient.lastName}`,
                recipientId: messageData.recipient._id,
                ...(isApplication && { applicationId: messageData.recipient._id })
            };
            
            console.log('📧 Sending message:', messagePayload);
            
            // Use different endpoint based on recipient type
            const endpoint = isApplication ? 'applications/send-message' : 'auth/send-message';
            const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messagePayload)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Message sent successfully:', result);
                
                // Reset form and close modal
                setShowSendMessageModal(false);
                setMessageData({
                    subject: '',
                    message: '',
                    recipient: null
                });
                
                alert('Message sent successfully!');
            } else {
                const error = await response.json();
                alert(`Error sending message: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Please try again.');
        }
    };

    // const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    //     try {
    //         const token = getToken();
    //         if (!token) {
    //             alert('No authentication token found');
    //             return;
    //         }

    //         console.log(`🔄 Updating application ${applicationId} status to: ${newStatus}`);

    //         const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/applications/${applicationId}/status`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ status: newStatus })
    //         });

    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log('Application status updated successfully:', result);

    //             // Update local state
    //             setApplicationSubmissions(prev => prev.map(app => 
    //                 app._id === applicationId 
    //                     ? { ...app, status: newStatus }
    //                     : app
    //             ));

    //             // Close dropdown
    //             setDropdownOpen(null);

    //             // Show success message
    //             const statusMessages = {
    //                 'approved': t('admin.applicationApprovedSuccess') || 'Application approved successfully!',
    //                 'rejected': t('admin.applicationRejectedSuccess') || 'Application rejected successfully!',
    //                 'pending': t('admin.applicationPendingSuccess') || 'Application marked as pending successfully!'
    //             };

    //             alert(statusMessages[newStatus] || 'Application status updated successfully!');
    //         } else {
    //             const error = await response.json();
    //             console.error('Failed to update application status:', error);
    //             alert(`Error updating status: ${error.message || 'Unknown error'}`);
    //         }
    //     } catch (error) {
    //         console.error('Error updating application status:', error);
    //         alert('Error updating application status. Please try again.');
    //     }
    // };
    const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
        const token = getToken();
        if (!token) {
            alert('No authentication token found');
            return;
        }

        console.log(`🔄 Updating application ${applicationId} status to: ${newStatus}`);

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

        if (response.ok) {
            const result = await response.json();
            console.log('Application status updated successfully:', result);

            setApplicationSubmissions(prev => prev.map(app => 
                app._id === applicationId 
                    ? { ...app, status: newStatus }
                    : app
            ));

            setDropdownOpen(null);

            const statusMessages = {
                'approved': t('admin.applicationApprovedSuccess') || 'Application approved successfully!',
                'rejected': t('admin.applicationRejectedSuccess') || 'Application rejected successfully!',
                'pending': t('admin.applicationPendingSuccess') || 'Application marked as pending successfully!'
            };

            alert(statusMessages[newStatus] || 'Application status updated successfully!');
        } else {
            const error = await response.json();
            console.error('Failed to update application status:', error);
            alert(`Error updating status: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        alert('Error updating application status. Please try again.');
    }
};


    // Add these helper functions
    const getTotalPages = () => {
        if (activeTab === 'users') {
            const totalItems = getFilteredUsers().length;
            return Math.ceil(totalItems / itemsPerPage);
        } else {
            const totalItems = getFilteredApplications().length;
            return Math.ceil(totalItems / itemsPerPage);
        }
    };

    const getCurrentPageItems = () => {
        if (activeTab === 'users') {
            const filteredItems = getFilteredUsers();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredItems.slice(startIndex, endIndex);
        } else {
            const filteredItems = getFilteredApplications();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredItems.slice(startIndex, endIndex);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = activeTab === 'users' ? getUserTotalPages() : getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLanguageToggle = (language) => {
        setCurrentLanguage(language);
        
        // If using react-i18next or similar i18n library
        if (typeof i18n !== 'undefined' && i18n.changeLanguage) {
            i18n.changeLanguage(language);
        }
        
        // Store preference in localStorage
        localStorage.setItem('preferredLanguage', language);
        
        // Optional: Send to backend to save user preference
        try {
            // Example API call to save language preference
            fetch('/api/user/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ language: language })
            });
        } catch (error) {
            console.log('Could not save language preference:', error);
        }
    };

    const handleThemeToggle = (theme) => {
        const isDark = theme === 'dark';
        setIsDarkMode(isDark);
        localStorage.setItem('preferredTheme', theme);
        
        // Apply dark mode classes to body and document
        if (isDark) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            // Apply dark styles to the entire page
            document.body.style.backgroundColor = '#1f2937';
            document.body.style.color = '#f9fafb';
        } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            // Reset to light styles
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        }
        console.log(`Theme switched to: ${theme}`);
    };

    // Theme toggle handler (if you don't have this)
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('preferredTheme', !isDarkMode ? 'dark' : 'light');
    };

    // Update useEffect to load saved language preference
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        const savedTheme = localStorage.getItem('preferredTheme');
        
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
            setCurrentLanguage(savedLanguage);
        } else {
            setCurrentLanguage(i18n.language);
        }
        
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, [i18n]);

    // Mobile detection useEffect with auto-collapse
    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth <= 768;
            setIsMobile(isMobileView);
            
            // Auto-collapse sidebar on mobile for icon-only view
            // But allow manual control on desktop
            if (isMobileView) {
                setAdminSidebarCollapsed(true);
            }
        };

        // Check on initial load
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch course materials when component loads
    useEffect(() => {
        fetchCourseMaterials();
    }, []);

    // Add new state for course creation
    const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
    const [newCourseData, setNewCourseData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: '',
        maxStudents: '',
        price: '',
        tags: '',
        syllabus: ''
    });
    
    const [isTransitioning, setIsTransitioning] = useState(false);

    // ✅ Enhanced Admin Dashboard States
    const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // Course Material Management States
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [showMaterialUploadModal, setShowMaterialUploadModal] = useState(false);
    const [materialUploadForm] = Form.useForm();
    const [materialToEdit, setMaterialToEdit] = useState(null);
    
    // Quiz Engine States
    const [quizzes, setQuizzes] = useState([]);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizForm] = Form.useForm();
    const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    
    // Listening Comprehension States
    const [listeningExercises, setListeningExercises] = useState([]);
    const [showListeningModal, setShowListeningModal] = useState(false);
    const [listeningForm] = Form.useForm();
    
    // Homework Submission States
    const [homeworkAssignments, setHomeworkAssignments] = useState([]);
    const [homeworkSubmissions, setHomeworkSubmissions] = useState([]);
    const [showHomeworkModal, setShowHomeworkModal] = useState(false);
    const [homeworkForm] = Form.useForm();
    
    // Additional Forms for render functions
    const [courseMaterialForm] = Form.useForm();
    const [additionalQuizForm] = Form.useForm();
    
    // Student Progress Analytics States
    const [studentProgressData, setStudentProgressData] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({
        totalStudents: 0,
        totalCourses: 0,
        completionRate: 0,
        averageGrade: 0
    });
    
    // Notification States
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const [dashboardData, setDashboardData] = useState({
        student: {
            journeyProgress: 68,
            completedMilestones: 12,
            totalMilestones: 18,
            streak: 7,
            upcomingDeadlines: [
                { id: 1, title: 'Data Analysis Project', dueDate: '2025-06-02', course: 'Data Science', urgent: true },
                { id: 2, title: 'JavaScript Quiz', dueDate: '2025-06-05', course: 'Web Development', urgent: false },
                { id: 3, title: 'ML Algorithm Report', dueDate: '2025-06-08', course: 'Machine Learning', urgent: false }
            ],
            studyGoals: { weekly: 20, completed: 14 },
            performanceData: {
                strengths: ['Data Visualization', 'Problem Solving'],
                improvements: ['Time Management', 'Code Optimization']
            }
        },
        teacher: {
            classEngagement: 84,
            studentSentiment: 'positive',
            activePolls: 2,
            pendingGrading: 15,
            recentActivity: [
                { type: 'quiz_completed', student: 'John Doe', course: 'Data Science 101', score: 95 },
                { type: 'question_asked', student: 'Jane Smith', course: 'Advanced Analytics', time: '2 mins ago' }
            ],
            engagementHeatmap: {
                'Data Visualization': 92,
                'Statistical Analysis': 78,
                'Python Programming': 85,
                'Machine Learning': 71
            }
        },
        admin: {
            systemHealth: 98.5,
            activeUsers: 1247,
            serverLoad: 34,
            storageUsed: 67,
            recentAlerts: [
                { type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
                { type: 'warning', message: 'High traffic detected on course enrollment', time: '3 hours ago' }
            ],
            userGrowth: { thisWeek: 23, lastWeek: 18 },
            contentApprovals: 5,
            pendingContacts: 0,
            pendingApplications: 0
        }
    });

    const history = useHistory();
    // Base API URL - Use local server for development
    // const API_BASE_URL = 'https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net';
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    // const getToken = localStorage.getItem("authToken");
    const getToken = () => localStorage.getItem("authToken");

    // const API_BASE_URL = process.env.REACT_APP_API_URL ;
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server

    // const API_BASE_URL = process.env.REACT_APP_API_URL ;
    // const token = localStorage.getItem("token");
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server

    const fetchPendingUsers = async (token) => {
        try {
            console.log('Fetching pending users...');
            const response = await fetch(`${API_BASE_URL}/api/auth/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Pending users response:', data);
                const users = data.users || data || [];
                setPendingUsers(users);
                console.log('Pending users set:', users);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingApplications: users.length
                    }
                }));
            } else {
                console.warn('Pending users endpoint returned error:', response.status);
                setPendingUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
            setPendingUsers([]);
        }
    };

        // Around line 102, update the fetchApplicationSubmissions function:
    const fetchApplicationSubmissions = async (token) => {
        try {
            console.log('Fetching application submissions...');
            console.log('API URL:', `${API_BASE_URL}/api/applications`); // Remove /all
            
            const response = await fetch(`${API_BASE_URL}/api/applications`, { // Remove /all
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Applications response status:', response.status);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Applications response:', data);
                const applications = data.applications || data || [];
                setApplicationSubmissions(applications);
                console.log('Applications set:', applications);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingApplications: applications.filter(app => app.status === 'pending').length
                    }
                }));
            } else {
                const errorText = await response.text();
                console.error('Applications endpoint returned error:', response.status, errorText);
                setApplicationSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            setApplicationSubmissions([]);
        }
    };
    
    // Around line 162, update the fetchContactSubmissions function:
    const fetchContactSubmissions = async (token) => {
        try {
            console.log('Fetching contact submissions...');
            const response = await fetch(`${API_BASE_URL}/api/contact`, { // Remove /all
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Contacts response:', data);
                const contacts = data.contacts || data || [];
                setContactSubmissions(contacts);
                console.log('Contacts set:', contacts);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingContacts: contacts.filter(contact => contact.status === 'pending').length
                    }
                }));
            } else {
                console.warn('Contacts endpoint returned error:', response.status);
                setContactSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch contact submissions:', error);
            setContactSubmissions([]);
        }
    };

    const fetchAllUsers = async (token) => {
        try {
            console.log('Fetching all users...');
            const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('All users response:', data);
                const users = data.users || data || [];
                setAllUsers(users);
                console.log('All users set:', users);
            } else {
                console.warn('Users endpoint returned error:', response.status);
                setAllUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch all users:', error);
            setAllUsers([]);
        }
    };

    // Fetch course materials from API
    const fetchCourseMaterials = async () => {
        try {
            console.log('Fetching course materials...');
            const materials = await materialAPI.getAll();
            console.log('Course materials fetched:', materials);
            setCourseMaterials(materials);
        } catch (error) {
            console.error('Failed to fetch course materials:', error);
            setCourseMaterials([]);
        }
    };

    // ✅ Course Materials Management Functions
    const handleViewMaterial = (material) => {
        console.log('👁️ Viewing material:', material);
        setSelectedMaterial(material);
        setShowViewMaterialModal(true);
    };

    const handleEditMaterial = (material) => {
        console.log('✏️ Editing material:', material);
        setEditingMaterial(material);
        setShowEditMaterialModal(true);
        // Pre-fill form fields
        courseMaterialForm.setFieldsValue({
            title: material.title,
            description: material.description,
            course: material.course?._id || material.course,
            category: material.category,
            week: material.week,
            lesson: material.lesson,
            tags: material.tags?.join(', '),
            accessLevel: material.accessLevel
        });
    };

    const handleUpdateMaterial = async (values) => {
        if (!editingMaterial) return;
        
        setIsUpdatingMaterial(true);
        try {
            console.log('🔄 Updating material:', editingMaterial._id, values);
            
            // Process tags if provided
            if (values.tags) {
                values.tags = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            const updatedMaterial = await materialAPI.update(editingMaterial._id, values);
            console.log('✅ Material updated successfully:', updatedMaterial);
            
            // Update local state
            setCourseMaterials(prev => prev.map(material => 
                material._id === editingMaterial._id ? updatedMaterial : material
            ));
            
            notification.success({
                message: 'Success',
                description: 'Material updated successfully!'
            });
            
            setShowEditMaterialModal(false);
            setEditingMaterial(null);
            courseMaterialForm.resetFields();
        } catch (error) {
            console.error('❌ Failed to update material:', error);
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to update material'
            });
        } finally {
            setIsUpdatingMaterial(false);
        }
    };

    const handleDeleteMaterial = async (material) => {
        Modal.confirm({
            title: 'Delete Material',
            content: `Are you sure you want to delete "${material.title}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setIsDeletingMaterial(true);
                try {
                    console.log('🗑️ Deleting material:', material._id);
                    await materialAPI.delete(material._id);
                    
                    // Remove from local state
                    setCourseMaterials(prev => prev.filter(item => item._id !== material._id));
                    
                    notification.success({
                        message: 'Success',
                        description: 'Material deleted successfully!'
                    });
                    
                    console.log('✅ Material deleted successfully');
                } catch (error) {
                    console.error('❌ Failed to delete material:', error);
                    notification.error({
                        message: 'Error',
                        description: error.message || 'Failed to delete material'
                    });
                } finally {
                    setIsDeletingMaterial(false);
                }
            }
        });
    };

    const handleDownloadMaterial = async (material) => {
        try {
            console.log('⬇️ Downloading material:', material.title);
            const blob = await materialAPI.download(material._id);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = material.fileName || material.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            notification.success({
                message: 'Success',
                description: 'Download started!'
            });
        } catch (error) {
            console.error('❌ Failed to download material:', error);
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to download material'
            });
        }
    };

    const handleUserApproval = async (userId, approve) => {
        const token = getToken();
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/approval`, { // ✅ Use new user routes
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approved: approve })
            });

            if (response.ok) {
                await fetchPendingUsers(token);
                await fetchAllUsers(token);
                alert(`User ${approve ? 'approved' : 'rejected'} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${approve ? 'approve' : 'reject'} user: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${approve ? 'approve' : 'reject'} user:`, error);
            alert(`Error: Failed to ${approve ? 'approve' : 'reject'} user`);
        }
    };

    const handleContactAction = async (contactId, action) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/${contactId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: action })
            });

            if (response.ok) {
                await fetchContactSubmissions(token);
                
                // Show success message with native alert
                const statusMessages = {
                    pending: currentLanguage === 'ja' ? '保留中' : 'Pending',
                    approved: currentLanguage === 'ja' ? '優先度高' : 'Priority',
                    resolved: currentLanguage === 'ja' ? '解決済み' : 'Resolved',
                    ignored: currentLanguage === 'ja' ? '無視' : 'Ignored'
                };

                const successMessage = currentLanguage === 'ja' 
                    ? `ステータスが「${statusMessages[action]}」に更新されました`
                    : `Status updated to "${statusMessages[action]}"`;
                
                alert(successMessage);
            } else {
                const errorData = await response.json();
                
                const errorMessage = currentLanguage === 'ja' 
                    ? 'エラー！ ステータスの更新に失敗しました。' 
                    : 'Error! Failed to update status.';
                
                alert(errorMessage);
            }
        } catch (error) {
            console.error(`Failed to ${action} contact submission:`, error);
            
            const networkErrorMessage = currentLanguage === 'ja' 
                ? 'エラー！ ネットワークエラーが発生しました。' 
                : 'Error! A network error occurred.';
            
            alert(networkErrorMessage);
        }
    };

    const handleApplicationAction = async (applicationId, action) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: action })
            });

            if (response.ok) {
                await fetchApplicationSubmissions(token);
                alert(`Application ${action} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${action} application: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${action} application:`, error);
            alert(`Error: Failed to ${action} application`);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const token = getToken(); // Use helper function
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/create-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
            });

            if (response.ok) {
                alert('User created successfully!');
                setShowCreateUserForm(false);
                setNewUserData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'student'
                });
                await fetchAllUsers(token);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    // ✅ User Management Functions
    const handleEditUser = (user) => {
        console.log('✏️ Edit user clicked:', user);
        setEditingUser(user);
        setNewUserData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: '' // Don't populate password for security
        });
        setShowEditUserForm(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const updateData = {
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                role: newUserData.role
            };
            
            // Only include password if it was provided
            if (newUserData.password.trim()) {
                updateData.password = newUserData.password;
            }

            const response = await fetch(`${API_BASE_URL}/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update response:', result);
                
                // ✅ Use the user object from the response
                const updatedUser = result.user;
                
                // Update the user in the local state
                setAllUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === editingUser._id ? updatedUser : user
                    )
                );
                
                // Reset form state
                setShowEditUserForm(false);
                setEditingUser(null);
                setNewUserData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'student'
                });
                
                alert('User updated successfully!');
            } else {
                const error = await response.json();
                alert(`Error updating user: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
        }
    };
    
    const confirmDeleteUser = async () => {
        console.log('🔥 DELETE CONFIRMATION CLICKED!');
        console.log('User to delete:', userToDelete);
        
        if (!userToDelete) {
            alert('No user selected for deletion');
            return;
        }
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            console.log('🗑️ Attempting to delete user:', userToDelete._id);
            
            const response = await fetch(`${API_BASE_URL}/api/users/${userToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Delete successful:', result);
                
                if (result.success) {
                    // Remove user from local state
                    setAllUsers(prevUsers => 
                        prevUsers.filter(user => user._id !== userToDelete._id)
                    );
                    
                    // Reset modal state
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                    
                    alert('User deleted successfully!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const error = await response.json();
                console.error('Delete failed:', error);
                alert(`Error deleting user: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    };

    const handleDeleteUser = (user) => {
        console.log('🎯 DELETE BUTTON CLICKED!');
        console.log('👤 User data:', user);
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const getFilteredUsers = () => {
        return allUsers.filter(user => {
            const matchesSearch = searchTerm === '' || 
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = selectedRole === '' || user.role === selectedRole;
            
            const matchesStatus = selectedStatus === '' || 
                (selectedStatus === 'approved' && user.isApproved) ||
                (selectedStatus === 'pending' && !user.isApproved);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    };

    const getFilteredApplications = () => {
        // Debug: Show actual program values in the data
        const uniquePrograms = [...new Set(applicationSubmissions.map(app => app.program).filter(Boolean))];
        console.log('🔍 Unique program values in database:', uniquePrograms);
        
        const filtered = applicationSubmissions.filter(app => {
            const matchesSearch = !searchTermApp || 
                app.firstName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
                app.lastName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
                app.program?.toLowerCase().includes(searchTermApp.toLowerCase());
            
            // FIX: Handle all possible "all programs" values properly
            const matchesProgram = !selectedProgram || 
                selectedProgram === '' || 
                selectedProgram === 'All Programs' || 
                selectedProgram === 'all' ||
                selectedProgram === 'All' ||
                app.program === selectedProgram; // ✅ This should match exactly with database values
                
            const matchesStatus = !selectedAppStatus || 
                selectedAppStatus === '' || 
                selectedAppStatus === 'All Statuses' || 
                selectedAppStatus === 'all' ||
                app.status === selectedAppStatus;
            
            return matchesSearch && matchesProgram && matchesStatus;
        });
        
        console.log('📊 Filtered applications:', filtered.length);
        return filtered;
    };
    
    const getFilteredContacts = () => {
        const uniqueSubjects = [...new Set(contactSubmissions.map(c => c.subject).filter(Boolean))];
        // console.log('🔍 Unique subject values in database:', uniqueSubjects);
        
        // Rest of your existing filtering logic...
        const filtered = contactSubmissions.filter(contact => {
            const matchesSearch = !searchTermContact || 
                contact.name?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.email?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.subject?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.message?.toLowerCase().includes(searchTermContact.toLowerCase());
            
            const matchesCategory = !selectedCategory || 
                selectedCategory === '' || 
                selectedCategory === 'All Categories' || 
                selectedCategory === 'all' ||
                selectedCategory === 'All' ||
                contact.subject === selectedCategory;
                
            const matchesStatus = !selectedContactStatus || 
                selectedContactStatus === '' || 
                selectedContactStatus === 'All Statuses' || 
                selectedContactStatus === 'all' ||
                contact.status === selectedContactStatus;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
        
        // console.log('📊 Filtered results:', filtered.length);
        return filtered;
    };

    // ✅ Get paginated contacts
    const getPaginatedContacts = () => {
        const filtered = getFilteredContacts();
        const startIndex = (contactCurrentPage - 1) * contactItemsPerPage;
        const endIndex = startIndex + contactItemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    // ✅ Get total pages for contacts
    const getContactTotalPages = () => {
        const filtered = getFilteredContacts();
        return Math.ceil(filtered.length / contactItemsPerPage);
    };

    // ✅ Handle contact pagination
    const handleContactPageChange = (page) => {
        setContactCurrentPage(page);
    };

    // ✅ Handle view contact details
    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        setShowContactModal(true);
    };

    // ✅ Handle reply to contact
    const handleReplyToContact = (contact) => {
        setReplyData({
            subject: `Re: ${contact.subject}`,
            message: '',
            recipient: contact
        });
        setShowReplyModal(true);
    };

    // ✅ Handle delete contact
    const handleDeleteContact = async (contact) => {
        // Show native confirmation dialog
        const confirmMessage = currentLanguage === 'ja' 
            ? `連絡先を削除しますか？\n\n名前: ${contact.name}\nメール: ${contact.email}\n件名: ${contact.subject}\n\nこの操作は元に戻せません。`
            : `Delete Contact?\n\nName: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\n\nThis action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            const token = getToken();
            try {
                const response = await fetch(`${API_BASE_URL}/api/contact/${contact._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Remove the contact from the local state
                    setContactSubmissions(prev => prev.filter(c => c._id !== contact._id));
                    
                    // Show success message
                    const successMessage = currentLanguage === 'ja' 
                        ? '削除完了！ メッセージが正常に削除されました。' 
                        : 'Deleted! The contact message has been deleted successfully.';
                    alert(successMessage);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete contact');
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
                
                // Show error message
                const errorMessage = currentLanguage === 'ja' 
                    ? 'エラー！ メッセージの削除に失敗しました。' 
                    : 'Error! Failed to delete the contact message.';
                alert(errorMessage);
            }
        }
    };

    // ✅ Handle reply submission
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        
        // Validation
        if (!replyData.subject.trim() || !replyData.message.trim()) {
            const validationMessage = currentLanguage === 'ja' 
                ? '件名とメッセージを入力してください。' 
                : 'Please fill in both subject and message fields.';
            alert(validationMessage);
            return;
        }
        
        setIsSendingReply(true);
        
        try {
            console.log('📧 Sending reply:', {
                contactId: replyData.recipient._id,
                subject: replyData.subject,
                message: replyData.message,
                recipientEmail: replyData.recipient.email
            });

            // Try the reply endpoint first
            let response = await fetch(`${API_BASE_URL}/api/contact/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contactId: replyData.recipient._id,
                    subject: replyData.subject,
                    message: replyData.message,
                    recipientEmail: replyData.recipient.email
                })
            });

            console.log('Reply response status:', response.status);

            // If reply endpoint fails, fallback to status update
            if (!response.ok && response.status === 404) {
                console.log('🔄 Reply endpoint not available, using status update as fallback...');
                
                // Update contact status to resolved as a fallback
                await handleContactAction(replyData.recipient._id, 'resolved');
                
                // Log the reply content for admin reference
                console.log(`📧 REPLY CONTENT (for manual sending):
                To: ${replyData.recipient.email}
                From: ${replyData.recipient.name}
                Subject: ${replyData.subject}
                Message: ${replyData.message}`);
                
                // Show fallback message
                const fallbackMessage = currentLanguage === 'ja' 
                    ? `返信処理完了！\n\n宛先: ${replyData.recipient.email}\n件名: ${replyData.subject}\n\nステータスが「解決済み」に更新されました。\n\n⚠️ メール送信機能は現在設定中です。返信内容はコンソールログに記録されました。`
                    : `Reply Processed!\n\nTo: ${replyData.recipient.email}\nSubject: ${replyData.subject}\n\nContact status updated to resolved.\n\n⚠️ Email sending is being configured. Reply content logged to console.`;
                
                alert(fallbackMessage);
                
                // Close modal and refresh
                setShowReplyModal(false);
                setReplyData({ subject: '', message: '', recipient: null });
                
                const refreshToken = getToken();
                if (refreshToken) {
                    await fetchContactSubmissions(refreshToken);
                }
                
                return;
            }

            if (response.ok) {
                const result = await response.json();
                console.log('Reply sent successfully:', result);
                
                // Close modal and reset form
                setShowReplyModal(false);
                setReplyData({ subject: '', message: '', recipient: null });
                
                // Refresh the contacts list to show updated status
                const refreshToken = getToken();
                if (refreshToken) {
                    await fetchContactSubmissions(refreshToken);
                }
                
                // ✅ Show detailed success message for REAL email sending
                const successMessage = currentLanguage === 'ja' 
                    ? `📧 メール送信完了！\n\n✅ 実際のメールが送信されました：\n• 宛先: ${replyData.recipient.email}\n• 件名: ${replyData.subject}\n• 送信時刻: ${new Date().toLocaleString()}\n\n相手にメールが届きました。\nステータスが「解決済み」に更新されました。`
                    : `📧 Email Sent Successfully!\n\n✅ Real email has been delivered to:\n• Recipient: ${replyData.recipient.email}\n• Subject: ${replyData.subject}\n• Sent: ${new Date().toLocaleString()}\n\nThe person will receive your message in their inbox.\nContact status updated to resolved.`;
                alert(successMessage);
            } else {
                const errorData = await response.json();
                console.error('Reply failed:', errorData);
                
                // Check if it's an email configuration error
                if (errorData.message && errorData.message.includes('email configuration')) {
                    const configMessage = currentLanguage === 'ja' 
                        ? `⚠️ メール設定エラー\n\nメール送信設定が正しく行われていません。\n\n管理者に連絡してGmailの設定を確認してください：\n• EMAIL_USER: ${errorData.emailConfig?.hasEmailUser ? '設定済み' : '未設定'}\n• EMAIL_PASS: ${errorData.emailConfig?.hasEmailPass ? '設定済み' : '未設定'}\n\nエラー: ${errorData.error || 'Unknown error'}`
                        : `⚠️ Email Configuration Error\n\nEmail sending is not properly configured.\n\nPlease contact administrator to check Gmail settings:\n• EMAIL_USER: ${errorData.emailConfig?.hasEmailUser ? 'Configured' : 'Not set'}\n• EMAIL_PASS: ${errorData.emailConfig?.hasEmailPass ? 'Configured' : 'Not set'}\n\nError: ${errorData.error || 'Unknown error'}`;
                    alert(configMessage);
                } else {
                    throw new Error(errorData.message || 'Failed to send reply');
                }
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            
            // Show error message
            const errorMessage = currentLanguage === 'ja' 
                ? `エラー！ 返信の送信に失敗しました。\n\nエラー詳細: ${error.message}\n\nもう一度お試しください。` 
                : `Error! Failed to send the reply.\n\nError details: ${error.message}\n\nPlease try again.`;
            alert(errorMessage);
        } finally {
            setIsSendingReply(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const token = getToken();
        
        try {
            const coursePayload = {
                ...newCourseData,
                tags: newCourseData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                maxStudents: parseInt(newCourseData.maxStudents) || 0,
                price: parseFloat(newCourseData.price) || 0
            };

            const response = await fetch(`${API_BASE_URL}/api/courses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coursePayload)
            });

            if (response.ok) {
                const createdCourse = await response.json();
                alert('Course created successfully!');
                setShowCreateCourseForm(false);
                setNewCourseData({
                    title: '',
                    description: '',
                    category: '',
                    level: 'beginner',
                    duration: '',
                    maxStudents: '',
                    price: '',
                    tags: '',
                    syllabus: ''
                });
                // Optionally refresh course list here
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to create course'}`);
            }
        } catch (error) {
            console.error('Failed to create course:', error);
            alert('Failed to create course. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        history.push('/');
    };
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getToken();
                
                console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'MISSING');
                console.log('🌐 API_BASE_URL:', API_BASE_URL);
                
                if (!token) {
                    console.log('❌ No token found, redirecting to home');
                    setIsLoading(false);
                    history.push('/');
                    return;
                }

                console.log('🔍 Checking authentication...');
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('👤 Auth response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Authentication failed: ${response.status}`);
                }

                const data = await response.json();
                const userData = data.user;
                console.log('✅ User authenticated:', userData);

                setUser({
                    id: userData.id || userData._id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    name: `${userData.firstName} ${userData.lastName}`.trim() || userData.email?.split('@')[0] || 'User',
                    isApproved: userData.isApproved
                });

                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userEmail', userData.email);

                // Enhanced admin data fetching with better error handling
                if (userData.role === 'admin') {
                    console.log('👑 Admin user detected, fetching admin data...');
                    
                    // Fetch all admin data concurrently but handle errors gracefully
                    const fetchPromises = [
                        fetchApplicationSubmissions(token).catch(error => {
                            console.error('❌ Applications fetch failed:', error);
                            return [];
                        }),
                        fetchContactSubmissions(token).catch(error => {
                            console.error('❌ Contacts fetch failed:', error);
                            return [];
                        }),
                        fetchPendingUsers(token).catch(error => {
                            console.error('❌ Pending users fetch failed:', error);
                            return [];
                        }),
                        fetchAllUsers(token).catch(error => {
                            console.error('❌ All users fetch failed:', error);
                            return [];
                        })
                    ];

                    try {
                        await Promise.allSettled(fetchPromises);
                        console.log('✅ Admin data fetch completed');
                    } catch (error) {
                        console.error('❌ Admin data fetch error:', error);
                    }
                }

                setIsLoading(false);

            } catch (error) {
                console.error('❌ Authentication error:', error);
                localStorage.clear();
                setIsLoading(false);
                history.push('/');
            }
        };

        checkAuth();
    }, [history, API_BASE_URL]);
    
    // ✅ Improved loading screen with sidebar-matching theme
    if (isLoading) {
        return (
            <div className={`min-h-screen ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
                    : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100'
            } flex items-center justify-center transition-all duration-500`}>
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700/50' 
                        : 'bg-gradient-to-br from-cyan-50/90 to-blue-100/90 backdrop-blur-xl border-cyan-200/50'
                } rounded-3xl border p-12 text-center max-w-md mx-4 relative overflow-hidden`}>
                    {/* Animated Spinner */}
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className={`absolute inset-0 border-4 ${
                            isDarkMode ? 'border-gray-600' : 'border-cyan-200'
                        } rounded-full`}></div>
                        <div className={`absolute inset-0 border-4 border-transparent ${
                            isDarkMode 
                                ? 'border-t-cyan-400 border-r-blue-400' 
                                : 'border-t-cyan-500 border-r-blue-500'
                        } rounded-full animate-spin`}></div>
                        <div className={`absolute inset-2 border-4 border-transparent ${
                            isDarkMode 
                                ? 'border-t-blue-400 border-r-purple-400' 
                                : 'border-t-blue-400 border-r-indigo-400'
                        } rounded-full animate-spin animation-delay-75`}></div>
                        <div className={`absolute inset-4 border-4 border-transparent ${
                            isDarkMode 
                                ? 'border-t-purple-400 border-r-cyan-400' 
                                : 'border-t-indigo-300 border-r-cyan-300'
                        } rounded-full animate-spin animation-delay-150`}></div>
                    </div>
    
                    {/* Loading Text */}
                    <div className="space-y-4">
                        <h2 className={`text-2xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        } flex items-center justify-center`}>
                            <span className="mr-2">🚀</span>
                            Loading Your Dashboard
                        </h2>
                        <p className={`text-lg font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Preparing your personalized experience...
                        </p>
                        
                        {/* Progress Dots */}
                        <div className="flex justify-center space-x-2 mt-6">
                            <div className={`w-3 h-3 ${
                                isDarkMode ? 'bg-cyan-400' : 'bg-cyan-500'
                            } rounded-full animate-bounce`}></div>
                            <div className={`w-3 h-3 ${
                                isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                            } rounded-full animate-bounce animation-delay-100`}></div>
                            <div className={`w-3 h-3 ${
                                isDarkMode ? 'bg-purple-400' : 'bg-indigo-500'
                            } rounded-full animate-bounce animation-delay-200`}></div>
                        </div>
    
                        {/* Loading Steps */}
                        <div className={`mt-8 space-y-2 text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Authenticating user</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Loading dashboard data</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                <span>Customizing interface</span>
                            </div>
                        </div>
                    </div>
    
                    {/* Decorative Background Elements matching sidebar theme */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <div className={`absolute -top-4 -right-4 w-24 h-24 ${
                            isDarkMode 
                                ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20' 
                                : 'bg-gradient-to-br from-cyan-300/30 to-blue-300/30'
                        } rounded-full`}></div>
                        <div className={`absolute -bottom-6 -left-6 w-32 h-32 ${
                            isDarkMode 
                                ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                                : 'bg-gradient-to-br from-blue-300/30 to-indigo-300/30'
                        } rounded-full`}></div>
                        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${
                            isDarkMode 
                                ? 'bg-gradient-to-br from-orange-600/10 to-red-600/10' 
                                : 'bg-gradient-to-br from-orange-200/20 to-red-200/20'
                        } rounded-full blur-3xl`}></div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ If no user data, show error
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
                    <button 
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => history.push('/')}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Student Dashboard Components
    const renderStudentDashboard = () => {
        if (activeTab === 'overview') {
            return renderStudentOverview();
        } else if (activeTab === 'courses') {
            return renderStudentCourses();
        } else if (activeTab === 'analytics') {
            return renderStudentAnalytics();
        } else if (activeTab === 'messages') {
            return renderStudentMessages();
        } else if (activeTab === 'settings') {
            return renderStudentSettings();
        }
        return renderStudentOverview();
    };
    
    const renderStudentOverview = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Hero Section - Learning Journey */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700' 
                    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-gray-200'
            } rounded-3xl p-8 shadow-xl overflow-hidden relative`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${
                    isDarkMode 
                        ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
                        : 'bg-gradient-to-br from-blue-200/30 to-purple-200/30'
                } rounded-full -translate-y-32 translate-x-32`}></div>
                <div className={`absolute bottom-0 left-0 w-48 h-48 ${
                    isDarkMode 
                        ? 'bg-gradient-to-tr from-indigo-900/30 to-pink-900/30' 
                        : 'bg-gradient-to-tr from-indigo-200/30 to-pink-200/30'
                } rounded-full translate-y-24 -translate-x-24`}></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Progress Circle */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-48 h-48">
                            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke={isDarkMode ? "rgba(75, 85, 99, 0.8)" : "rgba(229, 231, 235, 0.8)"} 
                                    strokeWidth="6" 
                                    fill="transparent"
                                />
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke="url(#progressGradient)" 
                                    strokeWidth="6" 
                                    fill="transparent"
                                    strokeDasharray={`${dashboardData.student.journeyProgress * 2.51} 251`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className={`text-4xl font-bold mb-1 ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>{dashboardData.student.journeyProgress}%</div>
                                    <div className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Journey Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>Your Learning Journey</h1>
                            <p className={`text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Keep up the amazing progress! You're doing great.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800/60 border-gray-600/50' 
                                    : 'bg-white/60 border-white/50'
                            } backdrop-blur-sm rounded-2xl p-6 border`}>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🎯</span>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{dashboardData.student.completedMilestones}</div>
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Milestones Achieved</div>
                                    </div>
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {dashboardData.student.totalMilestones - dashboardData.student.completedMilestones} more to go
                                </div>
                            </div>
    
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800/60 border-gray-600/50' 
                                    : 'bg-white/60 border-white/50'
                            } backdrop-blur-sm rounded-2xl p-6 border`}>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🔥</span>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{dashboardData.student.streak}</div>
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Day Streak</div>
                                    </div>
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Keep it up!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">4</div>
                                <div className="text-blue-100 text-sm font-medium">Active Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This month</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏰</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{dashboardData.student.upcomingDeadlines.length}</div>
                                <div className="text-green-100 text-sm font-medium">Deadlines</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Urgent</span>
                            <span className="font-semibold text-red-600">1 due soon</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{dashboardData.student.studyGoals.completed}h</div>
                                <div className="text-purple-100 text-sm font-medium">Study Hours</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Weekly goal</span>
                            <span className="font-semibold text-purple-600">{dashboardData.student.studyGoals.weekly}h</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">A-</div>
                                <div className="text-orange-100 text-sm font-medium">Avg Grade</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Improvement</span>
                            <span className="font-semibold text-green-600">+0.2</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Recommendations */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">🤖</span>
                                AI Study Recommendations
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Personalized suggestions to boost your learning</p>
                        </div>
                        <div className="p-6">
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700' 
                                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                            } rounded-2xl p-6 border`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">🔥</span>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                High Priority
                                            </span>
                                            <div className={`text-sm mt-1 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>Estimated: 45 minutes</div>
                                        </div>
                                    </div>
                                </div>
                                <h4 className={`text-lg font-semibold mb-2 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>Review Statistical Hypothesis Testing</h4>
                                <p className={`mb-4 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>Based on your recent quiz performance, focusing on this topic will boost your Data Science grade significantly.</p>
                                <div className="flex space-x-3">
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <span className="mr-2">🚀</span>
                                        Start Study Session
                                    </button>
                                    <button className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}>
                                        <span className="mr-2">📅</span>
                                        Schedule Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Upcoming Deadlines */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-orange-900/50 to-red-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-orange-50 to-red-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">📅</span>
                                Upcoming Deadlines
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Stay on top of your assignments</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {dashboardData.student.upcomingDeadlines.map(deadline => (
                                    <div key={deadline.id} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                                        deadline.urgent 
                                            ? isDarkMode 
                                                ? 'bg-red-900/20 border-red-700' 
                                                : 'bg-red-25 border-red-200'
                                            : isDarkMode 
                                                ? 'bg-gray-700 border-gray-600' 
                                                : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <div className="flex-shrink-0">
                                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-semibold ${
                                                deadline.urgent ? 'bg-red-500' : 'bg-blue-500'
                                            }`}>
                                                <span className="text-lg">{new Date(deadline.dueDate).getDate()}</span>
                                                <span className="text-xs">{new Date(deadline.dueDate).toLocaleDateString('en', { month: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-semibold truncate ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{deadline.title}</h4>
                                            <p className={`text-sm ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>{deadline.course}</p>
                                            <div className="flex items-center mt-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    deadline.urgent ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {deadline.urgent ? '⚠️ Due soon' : `${Math.ceil((new Date(deadline.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="flex-shrink-0 inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <span className="mr-1">📝</span>
                                            Work On It
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Sidebar Content */}
                <div className="space-y-8">
                    {/* Performance Insights */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">📈</span>
                                Performance Insights
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 flex items-center ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <span className="mr-2">💪</span>
                                    Your Strengths
                                </h4>
                                <div className="space-y-2">
                                    {dashboardData.student.performanceData.strengths.map((strength, index) => (
                                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2 mb-2">
                                            <span className="mr-1">✨</span>
                                            {strength}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 flex items-center ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <span className="mr-2">🎯</span>
                                    Areas for Growth
                                </h4>
                                <div className="space-y-2">
                                    {dashboardData.student.performanceData.improvements.map((improvement, index) => (
                                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mr-2 mb-2">
                                            <span className="mr-1">📈</span>
                                            {improvement}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">⚡</span>
                                Quick Actions
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Get things done faster</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleTabTransition('contacts')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                        isDarkMode 
                                            ? 'bg-blue-900/20 border-blue-700 hover:bg-blue-800/30' 
                                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Ask Question</span>
                                </button>
                                <button 
                                    onClick={() => setShowQuizModal(true)}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                        isDarkMode 
                                            ? 'bg-green-900/20 border-green-700 hover:bg-green-800/30' 
                                            : 'bg-green-50 border-green-200 hover:bg-green-100'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Take Quiz</span>
                                </button>
                                <button 
                                    onClick={() => {
                                        notification.info({
                                            message: 'Goal Setting',
                                            description: 'Goal setting feature will be available soon!',
                                            duration: 3
                                        });
                                    }}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                        isDarkMode 
                                            ? 'bg-purple-900/20 border-purple-700 hover:bg-purple-800/30' 
                                            : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Set Goal</span>
                                </button>
                                <button 
                                    onClick={() => handleTabTransition('materials')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                        isDarkMode 
                                            ? 'bg-orange-900/20 border-orange-700 hover:bg-orange-800/30' 
                                            : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📖</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Study Notes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentCourses = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📚</span>
                        My Learning Path
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Track your progress across all enrolled courses
                    </p>
                </div>
                
                <button 
                    onClick={() => {
                        notification.info({
                            message: 'Course Catalog',
                            description: 'Course browsing feature will be available soon!',
                            duration: 3
                        });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <span className="mr-2">🔍</span>
                    Browse More Courses
                </button>
            </div>
    
            {/* Learning Progress Overview */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📊</span>
                        Overall Progress
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Your learning statistics at a glance
                    </p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Course Completion Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#3b82f6" 
                                        strokeWidth="2"
                                        strokeDasharray="75, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">75%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Course Completion
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                3 of 4 courses completed
                            </p>
                        </div>
    
                        {/* Assignment Score Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="2"
                                        strokeDasharray="88, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-green-600">88%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Assignment Score
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                Average across all courses
                            </p>
                        </div>
    
                        {/* Study Goal Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#f59e0b" 
                                        strokeWidth="2"
                                        strokeDasharray="60, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-orange-600">60%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Study Goal
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                12h of 20h weekly goal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Enrolled Courses */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📖</span>
                        Enrolled Courses
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Continue your learning journey
                    </p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Data Science Course Card */}
                        <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        📊
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Data Science
                                        </span>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                            Beginner Level
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                Introduction to Data Science
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                Learn the fundamentals of data analysis, visualization, and statistical thinking.
                            </p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                        Progress
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        85% Complete
                                    </span>
                                </div>
                                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 transition-colors duration-300`}>
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                    Next: Python Basics
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📁</span>
                                    Materials
                                </button>
                            </div>
                        </div>
    
                        {/* JavaScript Course Card */}
                        <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        💻
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Web Development
                                        </span>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                            Intermediate Level
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                Full-Stack JavaScript
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                Master modern JavaScript development with React, Node.js, and MongoDB.
                            </p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                        Progress
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        62% Complete
                                    </span>
                                </div>
                                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 transition-colors duration-300`}>
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" style={{width: '62%'}}></div>
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                    Next: React Hooks
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📁</span>
                                    Materials
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentAnalytics = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📊</span>
                        Learning Analytics
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Track your progress and discover insights about your learning journey
                    </p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <select className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                        <option>Last 30 days</option>
                        <option>This semester</option>
                        <option>All time</option>
                    </select>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        <span className="mr-2">📄</span>
                        Export Report
                    </button>
                </div>
            </div>
    
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📈</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">7</div>
                                <div className="text-blue-100 text-sm font-medium">Day Streak</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Since last week</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +2 days
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">88.5%</div>
                                <div className="text-green-100 text-sm font-medium">Avg Score</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Improvement</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +5.2%
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">14.5h</div>
                                <div className="text-orange-100 text-sm font-medium">Study Time</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' 
                            : 'bg-gradient-to-r from-orange-50 to-red-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This week</span>
                            <span className="font-semibold text-orange-600">Goal: 20h</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">3/4</div>
                                <div className="text-purple-100 text-sm font-medium">Goals Met</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This month</span>
                            <span className="font-semibold text-purple-600">75% rate</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Trends */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">📈</span>
                            Performance Trends
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Your weekly progress overview
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Chart */}
                            <div className={`relative h-48 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30' 
                                    : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                            } rounded-xl p-4 transition-colors duration-300`}>
                                <div className="flex items-end justify-between h-full space-x-2">
                                    {[
                                        { week: 'Week 1', height: '70%', value: '85%', color: 'bg-blue-500' },
                                        { week: 'Week 2', height: '80%', value: '88%', color: 'bg-green-500' },
                                        { week: 'Week 3', height: '75%', value: '82%', color: 'bg-yellow-500' },
                                        { week: 'Week 4', height: '90%', value: '92%', color: 'bg-purple-500' }
                                    ].map((bar, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="relative group">
                                                <div 
                                                    className={`w-full ${bar.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer`}
                                                    style={{ height: bar.height }}
                                                ></div>
                                                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${
                                                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                                                } text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    {bar.value}
                                                </div>
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 font-medium transition-colors duration-300`}>
                                                {bar.week}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Performance Insights */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${
                                    isDarkMode 
                                        ? 'bg-green-900/30 border-green-700' 
                                        : 'bg-green-50 border-green-200'
                                } rounded-xl p-4 border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-green-600 text-lg">📈</span>
                                        <span className={`text-sm font-semibold ${
                                            isDarkMode ? 'text-green-400' : 'text-green-800'
                                        } transition-colors duration-300`}>Best Week</span>
                                    </div>
                                    <div className={`text-2xl font-bold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Week 4</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-green-400' : 'text-green-600'
                                    } transition-colors duration-300`}>92% average score</div>
                                </div>
                                <div className={`${
                                    isDarkMode 
                                        ? 'bg-orange-900/30 border-orange-700' 
                                        : 'bg-orange-50 border-orange-200'
                                } rounded-xl p-4 border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-orange-600 text-lg">🎯</span>
                                        <span className={`text-sm font-semibold ${
                                            isDarkMode ? 'text-orange-400' : 'text-orange-800'
                                        } transition-colors duration-300`}>Focus Area</span>
                                    </div>
                                    <div className={`text-sm font-bold ${
                                        isDarkMode ? 'text-orange-300' : 'text-orange-900'
                                    } transition-colors duration-300`}>Time Management</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                                    } transition-colors duration-300`}>Needs improvement</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Subject Performance */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">📚</span>
                            Subject Performance
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Performance across different subjects
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {[
                                { name: 'Data Science', score: 92, trend: '+8%', color: 'blue', bg: 'bg-blue-500' },
                                { name: 'JavaScript', score: 87, trend: '+3%', color: 'green', bg: 'bg-green-500' },
                                { name: 'Machine Learning', score: 78, trend: '-2%', color: 'orange', bg: 'bg-orange-500' }
                            ].map((subject, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 ${subject.bg} rounded-xl flex items-center justify-center text-white font-semibold text-sm`}>
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                    {subject.name}
                                                </h4>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    Current progress
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                {subject.score}%
                                            </div>
                                            <div className={`text-sm font-medium ${
                                                subject.trend.startsWith('+') ? 'text-green-600' : 
                                                subject.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                                {subject.trend}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div 
                                            className={`${subject.bg} h-3 rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: `${subject.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    
                {/* Recent Achievements */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-yellow-900/50 to-orange-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🏆</span>
                            Recent Achievements
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Your latest milestones and badges
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { 
                                    icon: '🔥', 
                                    title: 'Week Warrior', 
                                    desc: 'Completed 7 days of continuous learning',
                                    date: '2 days ago',
                                    color: 'bg-red-500'
                                },
                                { 
                                    icon: '⭐', 
                                    title: 'Quiz Master', 
                                    desc: 'Scored 95% or higher on 5 quizzes',
                                    date: '1 week ago',
                                    color: 'bg-yellow-500'
                                },
                                { 
                                    icon: '🎯', 
                                    title: 'Goal Crusher', 
                                    desc: 'Met all weekly study goals for the month',
                                    date: '2 weeks ago',
                                    color: 'bg-purple-500'
                                }
                            ].map((achievement, index) => (
                                <div key={index} className={`flex items-start space-x-4 p-4 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                } rounded-xl border transition-colors`}>
                                    <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                            {achievement.title}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
                                            {achievement.desc}
                                        </p>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>
                                            {achievement.date}
                                        </span>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}>
                                        <span className="text-lg">🔗</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className={`mt-6 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Next Achievement</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>Study for 30 days straight</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>7/30</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    } transition-colors duration-300`}>Days completed</div>
                                </div>
                            </div>
                            <div className={`mt-3 w-full ${
                                isDarkMode ? 'bg-blue-800' : 'bg-blue-200'
                            } rounded-full h-2 transition-colors duration-300`}>
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '23%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Study Patterns */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">⏰</span>
                            Study Patterns
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            When you learn best
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { time: '9:00 AM', level: 'High', percentage: 95, color: 'bg-green-500' },
                                { time: '11:00 AM', level: 'Medium', percentage: 70, color: 'bg-yellow-500' },
                                { time: '2:00 PM', level: 'High', percentage: 90, color: 'bg-green-500' },
                                { time: '4:00 PM', level: 'Low', percentage: 45, color: 'bg-red-500' },
                                { time: '7:00 PM', level: 'Medium', percentage: 75, color: 'bg-yellow-500' }
                            ].map((pattern, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className={`w-20 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                        {pattern.time}
                                    </div>
                                    <div className={`flex-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div 
                                            className={`${pattern.color} h-3 rounded-full transition-all duration-1000`}
                                            style={{ width: `${pattern.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className={`w-16 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                        {pattern.level}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className={`mt-6 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-green-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Productivity Tip</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-green-400' : 'text-green-700'
                                    } transition-colors duration-300`}>
                                        You're most focused at 9 AM and 2 PM. Schedule your toughest topics during these times!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentMessages = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">💬</span>
                        Messages & Discussions
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Connect with instructors, join study groups, and get help
                    </p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <span className="mr-2">❓</span>
                    Ask Question
                </button>
            </div>
    
            {/* Message Tabs */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
                    {['All Messages', 'My Questions', 'Study Groups', 'Announcements'].map((tab, index) => (
                        <button 
                            key={index}
                            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                                index === 0 
                                    ? `text-blue-600 border-blue-600 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` 
                                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:border-gray-400' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} border-transparent`
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
    
                {/* Messages Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Discussion Threads */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Unread Message */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            } rounded-2xl p-6 border relative overflow-hidden transition-colors duration-300`}>
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        New
                                    </span>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        👨‍🏫
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Dr. Smith
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Data Science 101
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                2 hours ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Assignment 3 - Additional Resources
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            I've uploaded some additional practice problems for the statistical analysis assignment. These will help you prepare for the upcoming quiz. Please review them before our next class.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    3 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    📢 Announcement
                                                </span>
                                            </div>
                                            <button className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg ${
                                                isDarkMode 
                                                    ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-800/50' 
                                                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                            } transition-colors`}>
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Study Group Message */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                            } rounded-2xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        👥
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Study Group #3
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                JavaScript Fundamentals
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                5 hours ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Weekly Study Session - React Hooks
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            Hey everyone! This week we're covering React Hooks. Anyone wants to join our virtual session this Saturday at 2 PM? We'll be going through useState and useEffect with practical examples.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    8 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    👥 Study Group
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className={`inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-lg text-green-700 ${
                                                    isDarkMode 
                                                        ? 'bg-green-900/50 hover:bg-green-800/50' 
                                                        : 'bg-green-50 hover:bg-green-100'
                                                } transition-colors`}>
                                                    Join
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${
                                                    isDarkMode 
                                                        ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                } text-sm font-medium rounded-lg transition-colors`}>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Question Thread */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                            } rounded-2xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        ME
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                My Question
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Machine Learning
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                1 day ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Understanding Gradient Descent
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            I'm having trouble understanding how the learning rate affects the gradient descent algorithm. Could someone explain with a simple example?
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    2 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    ❓ Question
                                                </span>
                                            </div>
                                            <button className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg ${
                                                isDarkMode 
                                                    ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-800/50' 
                                                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                            } transition-colors`}>
                                                View Answers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Help */}
                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                                <div className={`p-6 border-b ${
                                    isDarkMode 
                                        ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                                        : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                                } transition-colors duration-300`}>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                        <span className="mr-2">🚀</span>
                                        Quick Help
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: '💡', label: 'Study Tips', color: isDarkMode ? 'bg-yellow-900/50 border-yellow-700 hover:bg-yellow-800/50' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
                                            { icon: '🔧', label: 'Tech Support', color: isDarkMode ? 'bg-blue-900/50 border-blue-700 hover:bg-blue-800/50' : 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
                                            { icon: '📚', label: 'Materials', color: isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-800/50' : 'bg-green-50 border-green-200 hover:bg-green-100' },
                                            { icon: '⏰', label: 'Schedule', color: isDarkMode ? 'bg-purple-900/50 border-purple-700 hover:bg-purple-800/50' : 'bg-purple-50 border-purple-200 hover:bg-purple-100' }
                                        ].map((item, index) => (
                                            <button key={index} className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${item.color}`}>
                                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                                                <span className={`text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                } transition-colors duration-300`}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
    
                            {/* AI Chat Preview */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">AI Tutor</h4>
                                        <p className="text-blue-100 text-sm">Available 24/7</p>
                                    </div>
                                </div>
                                <p className="text-blue-100 mb-4">Get instant help with your questions! Our AI tutor can explain concepts, help with homework, and provide study guidance.</p>
                                <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                    Start Chat
                                </button>
                            </div>
    
                            {/* Active Study Groups */}
                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                                <div className={`p-6 border-b ${
                                    isDarkMode 
                                        ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                                        : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                                } transition-colors duration-300`}>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                        <span className="mr-2">👥</span>
                                        Your Study Groups
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[
                                            { name: 'React Masters', members: 12, active: true, color: 'bg-blue-500' },
                                            { name: 'Data Science Club', members: 8, active: false, color: 'bg-green-500' },
                                            { name: 'ML Beginners', members: 15, active: true, color: 'bg-purple-500' }
                                        ].map((group, index) => (
                                            <div key={index} className={`flex items-center space-x-3 p-3 ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                            } rounded-xl transition-colors duration-300`}>
                                                <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                        {group.name}
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                        {group.members} members
                                                    </div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full ${group.active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        + Join More Groups
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentSettings = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">⚙️</span>
                        Account Settings
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Manage your account preferences and settings
                    </p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    💾 Save Changes
                </button>
            </div>
    
            {/* User Account Information */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${
                    isDarkMode 
                        ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                        : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                } transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">👤</span>
                        Account Information
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Your profile and account details
                    </p>
                </div>
                <div className="p-6">
                    <div className="flex items-start space-x-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
                                <span className="text-sm">📷</span>
                            </button>
                        </div>
                        
                        {/* User Details */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={user?.name || "John Doe"}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || "john.doe@example.com"}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={user?.studentId || "STU2024001"}
                                        disabled
                                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-600 border-gray-600 text-gray-400' 
                                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Join Date
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="September 15, 2024"
                                        disabled
                                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-600 border-gray-600 text-gray-400' 
                                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                        }`}
                                    />
                                </div>
                            </div>
    
                            <div>
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Bio
                                </label>
                                <textarea
                                    rows="3"
                                    defaultValue="Passionate student learning data science and machine learning. Always eager to explore new technologies and solve complex problems."
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Language & Display Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Language Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🌐</span>
                            {t('adminDashboard.language.title')}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            {t('adminDashboard.language.description')}
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div 
                                onClick={() => handleLanguageToggle('en')}
                                className={`cursor-pointer flex items-center justify-between p-4 ${
                                    currentLanguage === 'en' 
                                        ? isDarkMode 
                                            ? 'bg-blue-900/50 border-blue-600' 
                                            : 'bg-blue-50 border-blue-300'
                                        : isDarkMode 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-gray-50 border-gray-200'
                                } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🇺🇸</span>
                                    </div>
                                    <div>
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            English
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            Default language
                                        </div>
                                    </div>
                                </div>
                                <div className={`relative w-6 h-6 rounded-full border-2 ${
                                    currentLanguage === 'en' 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : isDarkMode 
                                            ? 'border-gray-500' 
                                            : 'border-gray-300'
                                } transition-all duration-300`}>
                                    {currentLanguage === 'en' && (
                                        <div className="absolute inset-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
    
                            <div 
                                onClick={() => handleLanguageToggle('ja')}
                                className={`cursor-pointer flex items-center justify-between p-4 ${
                                    currentLanguage === 'ja' 
                                        ? isDarkMode 
                                            ? 'bg-red-900/50 border-red-600' 
                                            : 'bg-red-50 border-red-300'
                                        : isDarkMode 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-gray-50 border-gray-200'
                                } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🇯🇵</span>
                                    </div>
                                    <div>
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            {t('adminDashboard.language.languages.japanese')}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            {t('adminDashboard.language.languages.japaneseName')}
                                        </div>
                                    </div>
                                </div>
                                <div className={`relative w-6 h-6 rounded-full border-2 ${
                                    currentLanguage === 'ja' 
                                        ? 'border-red-500 bg-red-500' 
                                        : isDarkMode 
                                            ? 'border-gray-500' 
                                            : 'border-gray-300'
                                } transition-all duration-300`}>
                                    {currentLanguage === 'ja' && (
                                        <div className="absolute inset-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        </div>
    
                        {/* Language Change Feedback */}
                        {currentLanguage !== 'en' && (
                            <div className={`p-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                            } rounded-xl border transition-all duration-300`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-600 text-2xl">✅</span>
                                    <div>
                                        <h4 className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-900'
                                        } transition-colors duration-300`}>{t('adminDashboard.language.changeNotification.title')}</h4>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-700'
                                        } transition-colors duration-300`}>
                                            {t('adminDashboard.language.changeNotification.message', { 
                                                language: currentLanguage === 'ja' 
                                                    ? t('adminDashboard.language.languages.japanese') + ' (' + t('adminDashboard.language.languages.japaneseName') + ')'
                                                    : t('adminDashboard.language.languages.english')
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
    
                        <div className={`p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Language Note</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>
                                        Changing language will apply to the interface. Course content language may vary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Display Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🎨</span>
                            Display Settings
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Customize your visual experience
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                Theme Preference
                            </label>
                            
                            <div className="space-y-3">
                                <div 
                                    onClick={() => handleThemeToggle('light')}
                                    className={`cursor-pointer flex items-center justify-between p-4 ${
                                        !isDarkMode 
                                            ? 'bg-blue-50 border-blue-300' 
                                            : 'bg-gray-700 border-gray-600'
                                    } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">☀️</span>
                                        </div>
                                        <div>
                                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Light Mode
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                Bright and clean interface
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`relative w-6 h-6 rounded-full border-2 ${
                                        !isDarkMode 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : isDarkMode 
                                                ? 'border-gray-500' 
                                                : 'border-gray-300'
                                    } transition-all duration-300`}>
                                        {!isDarkMode && (
                                            <div className="absolute inset-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
    
                                <div 
                                    onClick={() => handleThemeToggle('dark')}
                                    className={`cursor-pointer flex items-center justify-between p-4 ${
                                        isDarkMode 
                                            ? 'bg-blue-900/50 border-blue-600' 
                                            : 'bg-gray-50 border-gray-200'
                                    } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">🌙</span>
                                        </div>
                                        <div>
                                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Dark Mode
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                Easy on the eyes, perfect for night study
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`relative w-6 h-6 rounded-full border-2 ${
                                        isDarkMode 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-gray-300'
                                    } transition-all duration-300`}>
                                        {isDarkMode && (
                                            <div className="absolute inset-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Theme Change Feedback */}
                        <div className={`p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-green-600 text-2xl">✨</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Theme Tip</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-green-400' : 'text-green-700'
                                    } transition-colors duration-300`}>
                                        {isDarkMode 
                                            ? 'Dark mode is active! Perfect for studying in low-light environments.' 
                                            : 'Light mode provides a bright, clean interface perfect for daytime use.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
);

// ✅ Enhanced Admin Dashboard Components with Ant Design
const renderEnhancedAdminOverview = () => {
    return (
        <div className="space-y-6">
            {/* Key Metrics Cards */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center">
                        <Statistic
                            title="Total Students"
                            value={allUsers.filter(u => u.role === 'student').length}
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <Progress percent={75} size="small" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center">
                        <Statistic
                            title="Course Materials"
                            value={courseMaterials.length}
                            prefix={<BookOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <Progress percent={60} size="small" strokeColor="#52c41a" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center">
                        <Statistic
                            title="Active Quizzes"
                            value={quizzes.length}
                            prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                        <Progress percent={45} size="small" strokeColor="#722ed1" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center">
                        <Statistic
                            title="Pending Reviews"
                            value={homeworkSubmissions.filter(h => h.status === 'submitted').length}
                            prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                        <Progress percent={30} size="small" strokeColor="#fa8c16" />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions & Recent Activity */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title={<span><BarChartOutlined /> Recent Activity</span>}>
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    dot: <UserOutlined />,
                                    children: (
                                        <div>
                                            New student registration - John Doe
                                            <div style={{ color: '#999', fontSize: '12px' }}>2 hours ago</div>
                                        </div>
                                    )
                                },
                                {
                                    color: 'blue',
                                    dot: <FileOutlined />,
                                    children: (
                                        <div>
                                            Course material uploaded - "Advanced JavaScript"
                                            <div style={{ color: '#999', fontSize: '12px' }}>4 hours ago</div>
                                        </div>
                                    )
                                },
                                {
                                    color: 'red',
                                    dot: <ExclamationCircleOutlined />,
                                    children: (
                                        <div>
                                            Quiz deadline approaching - "React Fundamentals"
                                            <div style={{ color: '#999', fontSize: '12px' }}>6 hours ago</div>
                                        </div>
                                    )
                                },
                                {
                                    color: 'purple',
                                    dot: <MessageOutlined />,
                                    children: (
                                        <div>
                                            New message from faculty - Sarah Wilson
                                            <div style={{ color: '#999', fontSize: '12px' }}>1 day ago</div>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<span><TrophyOutlined /> Quick Actions</span>}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                block
                                onClick={() => setShowMaterialUploadModal(true)}
                            >
                                Upload Material
                            </Button>
                            <Button 
                                icon={<QuestionCircleOutlined />} 
                                block
                                onClick={() => setShowQuizModal(true)}
                            >
                                Create Quiz
                            </Button>
                            <Button 
                                icon={<AudioOutlined />} 
                                block
                                onClick={() => setShowListeningModal(true)}
                            >
                                Add Listening Exercise
                            </Button>
                            <Button 
                                icon={<FileAddOutlined />} 
                                block
                                onClick={() => setShowHomeworkModal(true)}
                            >
                                Create Homework
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* System Status */}
            <Card title={<span><SettingOutlined /> System Status</span>}>
                <Row gutter={[24, 24]}>
                    <Col span={8}>
                        <div className="text-center">
                            <Progress type="circle" percent={98} size={80} />
                            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Server Health</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <Progress type="circle" percent={67} size={80} strokeColor="#ff7875" />
                            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Storage Usage</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <Progress type="circle" percent={85} size={80} strokeColor="#52c41a" />
                            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>User Activity</div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

const renderCourseMaterialManagement = () => {
    // Use pre-declared form hook from component state
    const form = courseMaterialForm;
    
    const columns = [
        {
            title: 'Type',
            dataIndex: 'fileType',
            key: 'fileType',
            render: (type) => {
                const iconMap = {
                    pdf: <FileOutlined style={{ color: '#ff4d4f' }} />,
                    video: <VideoCameraOutlined style={{ color: '#1890ff' }} />,
                    audio: <AudioOutlined style={{ color: '#52c41a' }} />,
                    document: <FileTextOutlined style={{ color: '#722ed1' }} />,
                    image: <FileOutlined style={{ color: '#eb2f96' }} />
                };
                const safeType = type || 'document';
                return <span>{iconMap[safeType] || <FileTextOutlined />} {safeType ? safeType.toUpperCase() : 'DOCUMENT'}</span>;
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title) => title || 'Untitled'
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            render: (course) => course?.title || course || 'No Course'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category || 'General'
        },
        {
            title: 'Week/Lesson',
            key: 'weekLesson',
            render: (_, record) => `W${record.week || 1}/L${record.lesson || 1}`
        },
        {
            title: 'Upload Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
        },
        {
            title: 'Size',
            dataIndex: 'fileSize',
            key: 'fileSize',
            render: (size) => size ? `${(size / 1024 / 1024).toFixed(2)} MB` : 'N/A'
        },
        {
            title: 'Downloads',
            dataIndex: 'downloadCount',
            key: 'downloadCount',
            render: (count) => count || 0
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <AntTooltip title="View Details">
                        <Button 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => handleViewMaterial(record)}
                        >
                            View
                        </Button>
                    </AntTooltip>
                    <AntTooltip title="Download File">
                        <Button 
                            icon={<DownloadOutlined />} 
                            size="small"
                            onClick={() => handleDownloadMaterial(record)}
                        >
                            Download
                        </Button>
                    </AntTooltip>
                    <AntTooltip title="Edit Material">
                        <Button 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEditMaterial(record)}
                        >
                            Edit
                        </Button>
                    </AntTooltip>
                    <AntTooltip title="Delete Material">
                        <Button 
                            icon={<DeleteOutlined />} 
                            size="small" 
                            danger
                            loading={isDeletingMaterial}
                            onClick={() => handleDeleteMaterial(record)}
                        >
                            Delete
                        </Button>
                    </AntTooltip>
                </Space>
            )
        }
    ];

    // Delete function moved to line 931 with proper API integration

    const handleUploadSubmit = async (values) => {
        try {
            console.log('📁 Uploading material:', values);
            
            // Create FormData for file upload
            const formData = new FormData();
            
            // Add form fields to FormData
            formData.append('title', values.title);
            formData.append('description', values.description || '');
            formData.append('course', values.course);
            formData.append('category', values.category || 'other');
            formData.append('week', values.week || 1);
            formData.append('lesson', values.lesson || 1);
            formData.append('accessLevel', values.accessLevel || 'course_students');
            
            // Add tags if provided
            if (values.tags) {
                formData.append('tags', JSON.stringify(values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)));
            }
            
            // Add file if uploaded
            console.log('🔍 File values received:', values.file);
            if (values.file && values.file.length > 0) {
                const file = values.file[0];
                if (file.originFileObj) {
                    formData.append('file', file.originFileObj);
                    console.log('📎 File attached:', file.originFileObj.name);
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Invalid file format or file not properly selected'
                    });
                    return;
                }
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Please select a file to upload'
                });
                return;
            }
            
            // Upload to API
            const uploadedMaterial = await materialAPI.create(formData);
            console.log('✅ Material uploaded successfully:', uploadedMaterial);
            
            // Add to local state
            setCourseMaterials(prev => [uploadedMaterial, ...prev]);
            
            // Close modal and reset form
            setShowMaterialUploadModal(false);
            courseMaterialForm.resetFields();
            
            notification.success({
                message: 'Success',
                description: 'Material uploaded successfully!'
            });
        } catch (error) {
            console.error('❌ Failed to upload material:', error);
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to upload material'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Course Materials</h2>
                    <p className="text-gray-600">Manage PDFs, videos, and audio files</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowMaterialUploadModal(true)}
                >
                    Upload Material
                </Button>
            </div>

            <Card>
                <Table 
                    dataSource={courseMaterials} 
                    columns={columns} 
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                    loading={isLoading}
                />
            </Card>

            {/* Upload Modal */}
            <Modal
                title="Upload Course Material"
                open={showMaterialUploadModal}
                onCancel={() => setShowMaterialUploadModal(false)}
                footer={null}
                width={600}
            >
                <Form form={courseMaterialForm} layout="vertical" onFinish={handleUploadSubmit}>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter material title" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Enter description" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="course" label="Course" rules={[{ required: true }]}>
                                <Select placeholder="Select course">
                                    <Select.Option value="68c05878d9c8e322824d4827">ENG101 - English for Beginners</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d4828">BUS201 - Business Communication</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d4829">TECH301 - Introduction to Programming</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d482a">JAP101 - Japanese Language Basics</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d482b">ADV401 - Advanced Business Strategy</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label="Category">
                                <Select placeholder="Select category">
                                    <Select.Option value="lecture">Lecture</Select.Option>
                                    <Select.Option value="assignment">Assignment</Select.Option>
                                    <Select.Option value="reading">Reading Material</Select.Option>
                                    <Select.Option value="supplementary">Supplementary</Select.Option>
                                    <Select.Option value="exam">Exam</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="week" label="Week" initialValue={1}>
                                <InputNumber min={1} max={20} placeholder="Week" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="lesson" label="Lesson" initialValue={1}>
                                <InputNumber min={1} max={10} placeholder="Lesson" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="accessLevel" label="Access Level" initialValue="course_students">
                                <Select placeholder="Access Level">
                                    <Select.Option value="course_students">Course Students</Select.Option>
                                    <Select.Option value="public">Public</Select.Option>
                                    <Select.Option value="instructor_only">Instructor Only</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="tags" label="Tags (comma separated)">
                        <Input placeholder="e.g., beginner, homework, important" />
                    </Form.Item>
                    <Form.Item 
                        name="file" 
                        label="File Upload" 
                        rules={[{ required: true, message: 'Please select a file' }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload.Dragger
                            beforeUpload={() => false} // Prevent auto upload
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.avi,.mov,.mp3,.wav,.aac,.jpg,.jpeg,.png,.gif"
                            maxCount={1}
                            listType="text"
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to upload</p>
                            <p className="ant-upload-hint">
                                Support for documents (PDF, DOC), videos (MP4, AVI), audio (MP3, WAV), and images
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Upload</Button>
                            <Button onClick={() => setShowMaterialUploadModal(false)}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Material Modal */}
            <Modal
                title="Material Details"
                open={showViewMaterialModal}
                onCancel={() => setShowViewMaterialModal(false)}
                width={700}
                footer={[
                    <Button 
                        key="download" 
                        icon={<DownloadOutlined />}
                        onClick={() => {
                            handleDownloadMaterial(selectedMaterial);
                            setShowViewMaterialModal(false);
                        }}
                    >
                        Download
                    </Button>,
                    <Button 
                        key="edit" 
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setShowViewMaterialModal(false);
                            handleEditMaterial(selectedMaterial);
                        }}
                    >
                        Edit
                    </Button>,
                    <Button key="close" onClick={() => setShowViewMaterialModal(false)}>
                        Close
                    </Button>
                ]}
            >
                {selectedMaterial && (
                    <div className="space-y-4">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small" title="Basic Information">
                                    <div className="space-y-2">
                                        <div><strong>Title:</strong> {selectedMaterial.title}</div>
                                        <div><strong>Description:</strong> {selectedMaterial.description || 'No description'}</div>
                                        <div><strong>Course:</strong> {selectedMaterial.course?.title || selectedMaterial.course || 'No course'}</div>
                                        <div><strong>Category:</strong> {selectedMaterial.category || 'General'}</div>
                                        <div><strong>Week:</strong> {selectedMaterial.week || 1}</div>
                                        <div><strong>Lesson:</strong> {selectedMaterial.lesson || 1}</div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card size="small" title="File Information">
                                    <div className="space-y-2">
                                        <div><strong>Type:</strong> {selectedMaterial.fileType?.toUpperCase() || 'DOCUMENT'}</div>
                                        <div><strong>File Name:</strong> {selectedMaterial.fileName}</div>
                                        <div><strong>Size:</strong> {selectedMaterial.fileSize ? `${(selectedMaterial.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</div>
                                        <div><strong>Downloads:</strong> {selectedMaterial.downloadCount || 0}</div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Upload Information">
                                    <div className="space-y-2">
                                        <div><strong>Uploaded By:</strong> {selectedMaterial.uploadedBy?.firstName} {selectedMaterial.uploadedBy?.lastName}</div>
                                        <div><strong>Upload Date:</strong> {selectedMaterial.createdAt ? new Date(selectedMaterial.createdAt).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Access Level:</strong> {selectedMaterial.accessLevel || 'course_students'}</div>
                                        {selectedMaterial.tags && selectedMaterial.tags.length > 0 && (
                                            <div><strong>Tags:</strong> {selectedMaterial.tags.join(', ')}</div>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>

            {/* Edit Material Modal */}
            <Modal
                title="Edit Course Material"
                open={showEditMaterialModal}
                onCancel={() => {
                    setShowEditMaterialModal(false);
                    setEditingMaterial(null);
                    courseMaterialForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form 
                    form={courseMaterialForm} 
                    layout="vertical" 
                    onFinish={handleUpdateMaterial}
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter material title" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Enter description" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="course" label="Course">
                                <Select placeholder="Select course" allowClear>
                                    <Select.Option value="68c05878d9c8e322824d4827">ENG101 - English for Beginners</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d4828">BUS201 - Business Communication</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d4829">TECH301 - Introduction to Programming</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d482a">JAP101 - Japanese Language Basics</Select.Option>
                                    <Select.Option value="68c05878d9c8e322824d482b">ADV401 - Advanced Business Strategy</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label="Category">
                                <Select placeholder="Select category" allowClear>
                                    <Select.Option value="lecture">Lecture</Select.Option>
                                    <Select.Option value="assignment">Assignment</Select.Option>
                                    <Select.Option value="reading">Reading Material</Select.Option>
                                    <Select.Option value="supplementary">Supplementary</Select.Option>
                                    <Select.Option value="exam">Exam</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="week" label="Week">
                                <InputNumber min={1} max={20} placeholder="Week" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="lesson" label="Lesson">
                                <InputNumber min={1} max={10} placeholder="Lesson" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="accessLevel" label="Access Level">
                                <Select placeholder="Access Level">
                                    <Select.Option value="course_students">Course Students</Select.Option>
                                    <Select.Option value="public">Public</Select.Option>
                                    <Select.Option value="instructor_only">Instructor Only</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="tags" label="Tags (comma separated)">
                        <Input placeholder="e.g., beginner, homework, important" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                loading={isUpdatingMaterial}
                            >
                                Update Material
                            </Button>
                            <Button 
                                onClick={() => {
                                    setShowEditMaterialModal(false);
                                    setEditingMaterial(null);
                                    courseMaterialForm.resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const renderQuizEngine = () => {
    // Use pre-declared form hook from component state
    const form = additionalQuizForm;
    
    const quizColumns = [
        {
            title: 'Quiz Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
        },
        {
            title: 'Questions',
            dataIndex: 'questions',
            key: 'questions',
            render: (questions) => `${questions.length} questions`
        },
        {
            title: 'Time Limit',
            dataIndex: 'timeLimit',
            key: 'timeLimit',
            render: (time) => `${time} minutes`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'orange'}>
                    {status ? status.toUpperCase() : 'UNKNOWN'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small">Preview</Button>
                    <Button icon={<EditOutlined />} size="small">Edit</Button>
                    <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                </Space>
            )
        }
    ];

    const handleCreateQuiz = async (values) => {
        const newQuiz = {
            id: Date.now(),
            ...values,
            questions: currentQuizQuestions,
            createdDate: new Date().toISOString(),
            status: 'active'
        };
        setQuizzes(prev => [...prev, newQuiz]);
        setShowQuizModal(false);
        setCurrentQuizQuestions([]);
        form.resetFields();
        notification.success({ message: 'Quiz created successfully!' });
    };

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            question: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 1
        };
        setCurrentQuizQuestions(prev => [...prev, newQuestion]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Quiz Engine</h2>
                    <p className="text-gray-600">Create and manage quizzes with automatic grading</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowQuizModal(true)}
                >
                    Create Quiz
                </Button>
            </div>

            <Card>
                <Table 
                    dataSource={quizzes} 
                    columns={quizColumns} 
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                />
            </Card>

            {/* Create Quiz Modal */}
            <Modal
                title="Create New Quiz"
                open={showQuizModal}
                onCancel={() => setShowQuizModal(false)}
                footer={null}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateQuiz}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Quiz Title" rules={[{ required: true }]}>
                                <Input placeholder="Enter quiz title" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="course" label="Course" rules={[{ required: true }]}>
                                <Select placeholder="Select course">
                                    <Select.Option value="javascript">JavaScript</Select.Option>
                                    <Select.Option value="react">React</Select.Option>
                                    <Select.Option value="node">Node.js</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="timeLimit" label="Time Limit (minutes)" rules={[{ required: true }]}>
                                <InputNumber min={5} max={180} placeholder="30" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="passingScore" label="Passing Score (%)">
                                <InputNumber min={0} max={100} placeholder="70" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Divider>Questions</Divider>
                    
                    <div className="space-y-4">
                        {currentQuizQuestions.map((question, index) => (
                            <Card key={question.id} size="small">
                                <div className="space-y-3">
                                    <Input 
                                        placeholder={`Question ${index + 1}`}
                                        value={question.question}
                                        onChange={(e) => {
                                            const updated = [...currentQuizQuestions];
                                            updated[index].question = e.target.value;
                                            setCurrentQuizQuestions(updated);
                                        }}
                                    />
                                    {question.options.map((option, optionIndex) => (
                                        <Input 
                                            key={optionIndex}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            value={option}
                                            onChange={(e) => {
                                                const updated = [...currentQuizQuestions];
                                                updated[index].options[optionIndex] = e.target.value;
                                                setCurrentQuizQuestions(updated);
                                            }}
                                        />
                                    ))}
                                    <Select 
                                        placeholder="Correct Answer"
                                        value={question.correctAnswer}
                                        onChange={(value) => {
                                            const updated = [...currentQuizQuestions];
                                            updated[index].correctAnswer = value;
                                            setCurrentQuizQuestions(updated);
                                        }}
                                        style={{ width: '200px' }}
                                    >
                                        {question.options.map((_, optionIndex) => (
                                            <Select.Option key={optionIndex} value={optionIndex}>
                                                Option {optionIndex + 1}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </Card>
                        ))}
                        
                        <Button type="dashed" onClick={addQuestion} block>
                            <PlusOutlined /> Add Question
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Space>
                            <Button type="primary" htmlType="submit">Create Quiz</Button>
                            <Button onClick={() => setShowQuizModal(false)}>Cancel</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

const renderListeningExercises = () => {
    const exerciseColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (level) => <Tag color="blue">{level ? level.toUpperCase() : 'N/A'}</Tag>
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => `${duration} min`
        },
        {
            title: 'Submissions',
            dataIndex: 'submissions',
            key: 'submissions',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<PlayCircleOutlined />} size="small">Play</Button>
                    <Button icon={<EditOutlined />} size="small">Edit</Button>
                    <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Listening Exercises</h2>
                    <p className="text-gray-600">Upload and manage audio exercises for students</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowListeningModal(true)}
                >
                    Add Exercise
                </Button>
            </div>

            <Card>
                <Table 
                    dataSource={listeningExercises} 
                    columns={exerciseColumns} 
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                />
            </Card>

            {/* Create Listening Exercise Modal */}
            <Modal
                title="Create Listening Exercise"
                open={showListeningModal}
                onCancel={() => setShowListeningModal(false)}
                footer={null}
                width={600}
            >
                <Form layout="vertical" onFinish={(values) => {
                    const newExercise = {
                        id: Date.now(),
                        ...values,
                        submissions: 0,
                        createdDate: new Date().toISOString()
                    };
                    setListeningExercises(prev => [...prev, newExercise]);
                    setShowListeningModal(false);
                    notification.success({ message: 'Listening exercise created successfully!' });
                }}>
                    <Form.Item name="title" label="Exercise Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter exercise title" />
                    </Form.Item>
                    <Form.Item name="level" label="Difficulty Level" rules={[{ required: true }]}>
                        <Select placeholder="Select level">
                            <Select.Option value="beginner">Beginner</Select.Option>
                            <Select.Option value="intermediate">Intermediate</Select.Option>
                            <Select.Option value="advanced">Advanced</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="duration" label="Duration (minutes)">
                        <InputNumber min={1} max={60} placeholder="5" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="audioFile" label="Audio File">
                        <Upload.Dragger>
                            <p className="ant-upload-drag-icon">
                                <AudioOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag audio file to upload</p>
                            <p className="ant-upload-hint">Support for MP3, WAV files</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item name="transcript" label="Transcript">
                        <Input.TextArea rows={4} placeholder="Enter audio transcript" />
                    </Form.Item>
                    <Form.Item name="questions" label="Exercise Questions">
                        <Input.TextArea rows={3} placeholder="Enter comprehension questions" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Create Exercise</Button>
                            <Button onClick={() => setShowListeningModal(false)}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const renderHomeworkSystem = () => {
    const assignmentColumns = [
        {
            title: 'Assignment',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Submissions',
            dataIndex: 'submissions',
            key: 'submissions',
            render: (submissions, record) => `${submissions}/${record.totalStudents}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : status === 'closed' ? 'red' : 'orange'}>
                    {status ? status.toUpperCase() : 'UNKNOWN'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small">View</Button>
                    <Button icon={<EditOutlined />} size="small">Edit</Button>
                    <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Homework System</h2>
                    <p className="text-gray-600">Create assignments and track submissions</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowHomeworkModal(true)}
                >
                    Create Assignment
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Table 
                            dataSource={homeworkAssignments} 
                            columns={assignmentColumns} 
                            pagination={{ pageSize: 10 }}
                            rowKey="id"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Create Homework Modal */}
            <Modal
                title="Create Homework Assignment"
                open={showHomeworkModal}
                onCancel={() => setShowHomeworkModal(false)}
                footer={null}
                width={700}
            >
                <Form layout="vertical" onFinish={(values) => {
                    const newAssignment = {
                        id: Date.now(),
                        ...values,
                        submissions: 0,
                        totalStudents: 25,
                        status: 'active',
                        createdDate: new Date().toISOString()
                    };
                    setHomeworkAssignments(prev => [...prev, newAssignment]);
                    setShowHomeworkModal(false);
                    notification.success({ message: 'Homework assignment created successfully!' });
                }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Assignment Title" rules={[{ required: true }]}>
                                <Input placeholder="Enter assignment title" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="course" label="Course" rules={[{ required: true }]}>
                                <Select placeholder="Select course">
                                    <Select.Option value="javascript">JavaScript</Select.Option>
                                    <Select.Option value="react">React</Select.Option>
                                    <Select.Option value="node">Node.js</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="maxPoints" label="Max Points">
                                <InputNumber min={1} max={100} placeholder="100" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Assignment Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="Enter assignment description and requirements" />
                    </Form.Item>
                    <Form.Item name="attachments" label="Assignment Files">
                        <Upload.Dragger multiple>
                            <p className="ant-upload-drag-icon">
                                <FileOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to upload</p>
                            <p className="ant-upload-hint">Upload assignment files, templates, or resources</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item name="submissionType" label="Submission Type">
                        <Radio.Group defaultValue="file">
                            <Radio value="file">📎 File Upload</Radio>
                            <Radio value="text">📝 Text Response</Radio>
                            <Radio value="both">📎📝 Both</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Create Assignment</Button>
                            <Button onClick={() => setShowHomeworkModal(false)}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

    // Teacher Dashboard Components
    const renderTeacherDashboard = () => {
        if (activeTab === 'overview') {
            return renderTeacherOverview();
        } else if (activeTab === 'courses') {
            return renderTeacherCourses();
        } else if (activeTab === 'analytics') {
            return renderTeacherAnalytics();
        } else if (activeTab === 'messages') {
            return renderTeacherMessages();
        } else if (activeTab === 'settings') {
            return renderTeacherSettings();
        }
        return renderTeacherOverview();
    };

    const renderTeacherOverview = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Classroom Pulse Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
                
                <div className="relative z-10 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Pulse Indicator */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-40 h-40 mb-6">
                                {/* Animated pulse rings */}
                                <div className={`absolute inset-0 rounded-full border-4 ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'border-green-400' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'border-yellow-400' : 'border-red-400'
                                } animate-ping`}></div>
                                <div className={`absolute inset-2 rounded-full border-2 ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'border-green-300' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'border-yellow-300' : 'border-red-300'
                                } animate-pulse`}></div>
                                <div className={`absolute inset-4 rounded-full ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'bg-green-400' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'bg-yellow-400' : 'bg-red-400'
                                } flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                                    {dashboardData.teacher.studentSentiment === 'positive' ? '😊' : 
                                        dashboardData.teacher.studentSentiment === 'neutral' ? '😐' : '😟'}
                                </div>
                            </div>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">Classroom Pulse</h2>
                                <p className="text-white/80 text-lg">Real-time engagement monitoring</p>
                            </div>
                        </div>
    
                        {/* Engagement Stats */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-emerald-300 text-2xl">📊</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Overall Engagement</h3>
                                            <p className="text-white/60 text-sm">Class participation rate</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">{dashboardData.teacher.classEngagement}%</div>
                                        <div className="text-emerald-300 text-sm font-medium flex items-center">
                                            ↗ <span className="ml-1">+5% vs last week</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                                        style={{ width: `${dashboardData.teacher.classEngagement}%` }}
                                    ></div>
                                </div>
                            </div>
    
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-300 text-2xl">💭</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Student Sentiment</h3>
                                            <p className="text-white/60 text-sm">Overall class mood</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                                            dashboardData.teacher.studentSentiment === 'positive' ? 'bg-green-400 text-green-900' :
                                            dashboardData.teacher.studentSentiment === 'neutral' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-400 text-red-900'
                                        }`}>
                                            {dashboardData.teacher.studentSentiment ? dashboardData.teacher.studentSentiment.toUpperCase() : 'UNKNOWN'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {['😊', '😐', '😟'].map((emoji, index) => (
                                        <div key={index} className={`flex-1 h-3 rounded-full ${
                                            (index === 0 && dashboardData.teacher.studentSentiment === 'positive') ||
                                            (index === 1 && dashboardData.teacher.studentSentiment === 'neutral') ||
                                            (index === 2 && dashboardData.teacher.studentSentiment === 'negative')
                                            ? 'bg-white/60' : 'bg-white/20'
                                        } transition-all duration-500`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">156</div>
                                    <div className="text-blue-100 text-sm font-medium">Total Students</div>
                                </div>
                            </div>
                            <div className="flex items-center text-blue-100 text-sm">
                                <span className="w-2 h-2 bg-blue-200 rounded-full mr-2 animate-pulse"></span>
                                Across 3 active courses
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This semester</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="text-green-400 mr-1">↗</span>
                                +12 new
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{dashboardData.teacher.activePolls}</div>
                                    <div className="text-emerald-100 text-sm font-medium">Active Polls</div>
                                </div>
                            </div>
                            <div className="flex items-center text-emerald-100 text-sm">
                                <div className="flex space-x-1 mr-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse delay-150"></div>
                                </div>
                                Live responses coming in
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Response rate</span>
                            <span className="font-semibold text-emerald-600">87%</span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📝</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{dashboardData.teacher.pendingGrading}</div>
                                    <div className="text-orange-100 text-sm font-medium">Pending Grading</div>
                                </div>
                            </div>
                            <div className="flex items-center text-orange-100 text-sm">
                                <span className="w-2 h-2 bg-orange-200 rounded-full mr-2 animate-bounce"></span>
                                Assignments & Quizzes
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Due soon</span>
                            <span className="font-semibold text-red-600 flex items-center">
                                <span className="text-red-400 mr-1">⚠</span>
                                2 overdue
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📅</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">3</div>
                                    <div className="text-purple-100 text-sm font-medium">Classes Today</div>
                                </div>
                            </div>
                            <div className="flex items-center text-purple-100 text-sm">
                                <span className="w-2 h-2 bg-purple-200 rounded-full mr-2"></span>
                                Next: Data Science at 2:00 PM
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This week</span>
                            <span className="font-semibold text-purple-600">12 total</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Topic Engagement Heatmap */}
                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-orange-900/50' : 'from-red-50 to-orange-50'} transition-colors duration-300`}>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-2xl">🔥</span>
                            Topic Engagement Heatmap
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Student engagement levels across different topics</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {Object.entries(dashboardData.teacher.engagementHeatmap).map(([topic, engagement]) => (
                                <div key={topic} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{topic}</span>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                                            engagement > 80 ? 'text-green-700 bg-green-100' : 
                                            engagement > 60 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
                                        }`}>
                                            {engagement}%
                                        </span>
                                    </div>
                                    <div className={`relative h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                                        <div 
                                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-md ${
                                                engagement > 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                                                engagement > 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                                            }`}
                                            style={{ width: `${engagement}%` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Engagement Insights */}
                        <div className={`mt-6 p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} mb-1 transition-colors duration-300`}>Engagement Insight</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>
                                        Machine Learning shows lower engagement (71%). Consider adding more interactive examples 
                                        or breaking down complex concepts into smaller modules.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* AI Teaching Insights & Quick Tools */}
                <div className="space-y-8">
                    {/* AI Suggestions */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/50 to-purple-900/50' : 'from-indigo-50 to-purple-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🤖</span>
                                AI Teaching Insights
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 transition-colors duration-300`}>Smart recommendations for your classes</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className={`p-4 bg-gradient-to-br ${isDarkMode ? 'from-purple-900/50 to-pink-900/50 border-purple-700' : 'from-purple-50 to-pink-50 border-purple-200'} rounded-xl border transition-colors duration-300`}>
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">📊</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                                                Data-Driven Recommendation
                                            </span>
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                                Consider Additional Practice for Machine Learning
                                            </h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 transition-colors duration-300`}>
                                                71% engagement suggests students may benefit from more interactive examples 
                                                and hands-on coding exercises.
                                            </p>
                                            <div className="flex space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">🚀</span>
                                                    Create Session
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1.5 border ${isDarkMode ? 'border-purple-600 text-purple-300 hover:bg-purple-900/50' : 'border-purple-300 text-purple-700 hover:bg-purple-50'} rounded-lg transition-colors text-sm font-medium`}>
                                                    <span className="mr-1">📅</span>
                                                    Schedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Teaching Tools */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-green-900/50 to-emerald-900/50' : 'from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🛠️</span>
                                Quick Teaching Tools
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 transition-colors duration-300`}>Instant access to common actions</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '📊', label: 'Create Poll', color: isDarkMode ? 'bg-blue-900/50 border-blue-700 hover:bg-blue-800/50 text-blue-300' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' },
                                    { icon: '📝', label: 'New Quiz', color: isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-800/50 text-green-300' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' },
                                    { icon: '📢', label: 'Announcement', color: isDarkMode ? 'bg-orange-900/50 border-orange-700 hover:bg-orange-800/50 text-orange-300' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700' },
                                    { icon: '📈', label: 'Grade Assignments', color: isDarkMode ? 'bg-purple-900/50 border-purple-700 hover:bg-purple-800/50 text-purple-300' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' }
                                ].map((tool, index) => (
                                    <button key={index} className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 group ${tool.color}`}>
                                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                                        <span className="text-sm font-medium">{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Real-time Activity Feed */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-cyan-900/50 to-blue-900/50' : 'from-cyan-50 to-blue-50'} transition-colors duration-300`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">⚡</span>
                                Real-time Activity
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Live updates from your students</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>Live</span>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {dashboardData.teacher.recentActivity.map((activity, index) => (
                            <div key={index} className={`flex items-start space-x-4 p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-xl border transition-colors group`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                                    activity.type === 'quiz_completed' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                }`}>
                                    {activity.type === 'quiz_completed' ? '✅' : '❓'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {activity.type === 'quiz_completed' ? (
                                        <>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                <span className="text-blue-600">{activity.student}</span> completed a quiz
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{activity.course}</span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    activity.score >= 90 ? 'bg-green-100 text-green-800' :
                                                    activity.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    Score: {activity.score}%
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                <span className="text-blue-600">{activity.student}</span> asked a question
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{activity.course}</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>{activity.time}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}>
                                    <span className="text-lg">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherCourses = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
    
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">📚</span>
                        My Courses
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Manage your courses and track student progress</p>
                </div>
                
                <button 
                    onClick={() => setShowCreateCourseForm(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <span className="mr-2 text-lg">➕</span>
                    Create New Course
                </button>
            </div>
    
            {/* Course Creation Modal */}
            {showCreateCourseForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                    <span className="mr-3 text-3xl">🎓</span>
                                    Create New Course
                                </h3>
                                <button 
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
                                >
                                    <span className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>✕</span>
                                </button>
                            </div>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 transition-colors duration-300`}>Fill in the details to create your new course</p>
                        </div>
    
                        <form onSubmit={handleCreateCourse} className="p-6 space-y-6">
                            {/* Course Title */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newCourseData.title}
                                    onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    placeholder="e.g., Introduction to Data Science"
                                />
                            </div>
    
                            {/* Course Description */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Description *
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newCourseData.description}
                                    onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                    placeholder="Describe what students will learn in this course..."
                                />
                            </div>
    
                            {/* Category and Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.category}
                                        onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="programming">Programming</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="machine-learning">Machine Learning</option>
                                        <option value="web-development">Web Development</option>
                                        <option value="mobile-development">Mobile Development</option>
                                        <option value="cybersecurity">Cybersecurity</option>
                                        <option value="cloud-computing">Cloud Computing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Difficulty Level *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.level}
                                        onChange={(e) => setNewCourseData({...newCourseData, level: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
    
                            {/* Duration and Max Students */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Duration (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.duration}
                                        onChange={(e) => setNewCourseData({...newCourseData, duration: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., 12"
                                    />
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Max Students
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.maxStudents}
                                        onChange={(e) => setNewCourseData({...newCourseData, maxStudents: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>
    
                            {/* Price and Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newCourseData.price}
                                        onChange={(e) => setNewCourseData({...newCourseData, price: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="0.00"
                                    />
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={newCourseData.tags}
                                        onChange={(e) => setNewCourseData({...newCourseData, tags: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., python, data, statistics (comma separated)"
                                    />
                                </div>
                            </div>
    
                            {/* Syllabus */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Syllabus
                                </label>
                                <textarea
                                    rows="6"
                                    value={newCourseData.syllabus}
                                    onChange={(e) => setNewCourseData({...newCourseData, syllabus: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                    placeholder="Week 1: Introduction to concepts&#10;Week 2: Core fundamentals&#10;Week 3: Practical applications..."
                                />
                            </div>
    
                            {/* Action Buttons */}
                            <div className={`flex space-x-4 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className={`flex-1 px-6 py-3 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl transition-colors font-medium`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                >
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    
            {/* Course Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📖</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">3</div>
                                <div className="text-blue-100 text-sm font-medium">Active Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-cyan-900/30' : 'from-blue-50 to-cyan-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This semester</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">156</div>
                                <div className="text-emerald-100 text-sm font-medium">Total Students</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-emerald-900/30 to-teal-900/30' : 'from-emerald-50 to-teal-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Enrolled</span>
                            <span className="font-semibold text-emerald-600">+12 this week</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">23</div>
                                <div className="text-orange-100 text-sm font-medium">Pending Reviews</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Assignments</span>
                            <span className="font-semibold text-red-600">2 overdue</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">4.8</div>
                                <div className="text-purple-100 text-sm font-medium">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Student feedback</span>
                            <span className="font-semibold text-purple-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Active Courses Grid */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🎯</span>
                        Active Courses
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Manage and monitor your ongoing courses</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Data Science Course */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-blue-700/30 to-indigo-700/30' : 'from-blue-200/30 to-indigo-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            📊
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-700'} mb-2 transition-colors`}>
                                    Data Science 101
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Introduction to data analysis, visualization, and statistical thinking
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-blue-600">45</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-green-600">12</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-orange-600">89%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Course Progress</span>
                                        <span className="font-semibold text-blue-600">89%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000" style={{width: '89%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-blue-500 text-blue-400 hover:bg-blue-900/50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Machine Learning Course */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-green-700/30 to-emerald-700/30' : 'from-green-200/30 to-emerald-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            🤖
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-green-300' : 'text-gray-900 group-hover:text-green-700'} mb-2 transition-colors`}>
                                    Machine Learning Basics
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Fundamental concepts of ML algorithms and practical applications
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-green-600">38</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-blue-600">16</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-yellow-600">71%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Course Progress</span>
                                        <span className="font-semibold text-green-600">71%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000" style={{width: '71%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-green-500 text-green-400 hover:bg-green-900/50' : 'border-green-300 text-green-700 hover:bg-green-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Python Programming Course - Draft */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-yellow-900/50 border-orange-700' : 'from-orange-50 to-yellow-50 border-orange-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-orange-700/30 to-yellow-700/30' : 'from-orange-200/30 to-yellow-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            🐍
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                Draft
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Spring 2025</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-400 hover:text-orange-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-orange-300' : 'text-gray-900 group-hover:text-orange-700'} mb-2 transition-colors`}>
                                    Advanced Python Programming
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Deep dive into Python frameworks, libraries, and advanced concepts
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-orange-600">8</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-yellow-600">45%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Complete</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Development Progress</span>
                                        <span className="font-semibold text-orange-600">45%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 h-3 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">🔨</span>
                                        Continue Building
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-orange-500 text-orange-400 hover:bg-orange-900/50' : 'border-orange-300 text-orange-700 hover:bg-orange-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">👁️</span>
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Assignments Awaiting Review */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-red-900/50 to-orange-900/50' : 'border-gray-200 bg-gradient-to-r from-red-50 to-orange-50'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">📝</span>
                        Assignments Awaiting Review
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Grade pending assignments and provide feedback</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Urgent Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-pink-900/50 border-red-700' : 'from-red-50 to-pink-50 border-red-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                    📊
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Data Visualization Project</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        ⚠️ Overdue
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Data Science 101 • Due: 2 days ago</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        23 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 4.2 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                    <span className="mr-2">🚀</span>
                                    Start Grading
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">👁️</span>
                                    Preview
                                </button>
                            </div>
                        </div>
    
                        {/* Regular Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                🤖
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>ML Algorithm Quiz</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        📅 Due Tomorrow
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Machine Learning Basics • Due: Tomorrow</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        31 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 2.8 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    <span className="mr-2">📝</span>
                                    Review Answers
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📊</span>
                                    Analytics
                                </button>
                            </div>
                        </div>
    
                        {/* Additional Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                📈
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Statistical Analysis Report</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✅ On Time
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Data Science 101 • Due: Next week</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        18 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 6.1 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    <span className="mr-2">📝</span>
                                    Start Review
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">⚙️</span>
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`mt-8 p-6 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : 'from-gray-50 to-gray-100'} rounded-xl transition-colors duration-300`}>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                            <span className="mr-2">⚡</span>
                            Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button 
                                onClick={() => setShowHomeworkModal(true)}
                                className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500' : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'} rounded-xl border transition-all group`}
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-700'} transition-colors`}>Create Assignment</span>
                            </button>
                            <button 
                                onClick={() => handleTabTransition('analytics')}
                                className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500' : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'} rounded-xl border transition-all group`}
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-green-400' : 'text-gray-700 group-hover:text-green-700'} transition-colors`}>Grade Book</span>
                            </button>
                            <button 
                                onClick={() => handleTabTransition('contacts')}
                                className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500' : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300'} rounded-xl border transition-all group`}
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📢</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-700 group-hover:text-purple-700'} transition-colors`}>Announcement</span>
                            </button>
                            <button 
                                onClick={() => handleTabTransition('analytics')}
                                className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500' : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'} rounded-xl border transition-all group`}
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-orange-400' : 'text-gray-700 group-hover:text-orange-700'} transition-colors`}>Analytics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherAnalytics = () => {
        if (!Bar || !Line || !Doughnut) {
            return (
                <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-2xl text-center`}>
                        <h3 className="text-xl font-bold mb-4">📊 Analytics Dashboard</h3>
                        <p className="text-gray-500">Chart components are loading...</p>
                        <div className="mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    </div>
                </div>
            );
        }

        // Performance Trends Chart Data
        const performanceData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'Class Average (%)',
                    data: [78, 82, 85, 81, 87],
                    backgroundColor: isDarkMode 
                        ? 'rgba(59, 130, 246, 0.8)' 
                        : 'rgba(59, 130, 246, 0.6)',
                    borderColor: isDarkMode 
                        ? 'rgba(59, 130, 246, 1)' 
                        : 'rgba(59, 130, 246, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Engagement (%)',
                    data: [75, 80, 88, 79, 92],
                    backgroundColor: isDarkMode 
                        ? 'rgba(16, 185, 129, 0.8)' 
                        : 'rgba(16, 185, 129, 0.6)',
                    borderColor: isDarkMode 
                        ? 'rgba(16, 185, 129, 1)' 
                        : 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };

        // Engagement by Time Chart Data
        const engagementTimeData = {
            labels: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'],
            datasets: [
                {
                    label: 'Engagement Level (%)',
                    data: [95, 70, 90, 45, 75],
                    backgroundColor: [
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(245, 158, 11, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        };

        // Assignment Completion Doughnut Chart Data
        const assignmentCompletionData = {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [
                {
                    data: [86.5, 8.2, 5.3],
                    backgroundColor: [
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                        isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.6)',
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                    ],
                    borderWidth: 2,
                }
            ]
        };

        // Chart Options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: isDarkMode ? '#E5E7EB' : '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    titleColor: isDarkMode ? '#F9FAFB' : '#111827',
                    bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                }
            },
            scales: {
                x: {
                    grid: {
                        color: isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    },
                    ticks: {
                        color: isDarkMode ? '#D1D5DB' : '#6B7280',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    },
                    ticks: {
                        color: isDarkMode ? '#D1D5DB' : '#6B7280',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        };

        const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#E5E7EB' : '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    titleColor: isDarkMode ? '#F9FAFB' : '#111827',
                    bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            cutout: '60%',
        };

        return (
            <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-4xl">📈</span>
                            Course Analytics
                        </h2>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Comprehensive insights into student performance and engagement</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <select className={`px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This semester</option>
                            <option>All time</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg">
                            <span className="mr-2">📄</span>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">85.4%</div>
                                    <div className="text-blue-100 text-sm font-medium">Avg Performance</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-cyan-900/30' : 'from-blue-50 to-cyan-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Improvement</span>
                                <span className="font-semibold text-green-600 flex items-center">
                                    <span className="mr-1">↗</span>
                                    +3.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">92%</div>
                                    <div className="text-emerald-100 text-sm font-medium">Engagement Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-emerald-900/30 to-teal-900/30' : 'from-emerald-50 to-teal-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Active learners</span>
                                <span className="font-semibold text-emerald-600">143/156</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">⏱️</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">4.2h</div>
                                    <div className="text-orange-100 text-sm font-medium">Avg Study Time</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Per week</span>
                                <span className="font-semibold text-orange-600">Goal: 6h</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">94%</div>
                                    <div className="text-purple-100 text-sm font-medium">Completion Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Assignments</span>
                                <span className="font-semibold text-purple-600">On track</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student Performance Trends */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">📈</span>
                                Performance Trends
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Weekly student performance overview</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Chart.js Chart */}
                                <div className="h-80">
                                    <Bar data={performanceData} options={chartOptions} />
                                </div>
                                
                                {/* Performance Insights */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-green-600 text-xl">🏆</span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Best Performing</span>
                                        </div>
                                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-900'} transition-colors duration-300`}>Week 5</div>
                                        <div className="text-xs text-green-600">87% class average</div>
                                    </div>
                                    <div className={`bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-red-900/50 border-orange-700' : 'from-orange-50 to-red-50 border-orange-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-orange-600 text-xl">🎯</span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-800'} transition-colors duration-300`}>Improvement Area</span>
                                        </div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-orange-200' : 'text-orange-900'} transition-colors duration-300`}>Consistency</div>
                                        <div className="text-xs text-orange-600">Week 4 dip noted</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Engagement by Time */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">⏰</span>
                                Engagement by Time
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Student activity patterns throughout the day</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Chart.js Chart */}
                                <div className="h-80">
                                    <Bar data={engagementTimeData} options={chartOptions} />
                                </div>
                                
                                <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-600 text-2xl">💡</span>
                                        <div>
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} transition-colors duration-300`}>Teaching Tip</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>Schedule important topics during 9 AM and 2 PM when engagement is highest!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Completion Rates */}
                    <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">📋</span>
                                Assignment Completion Analytics
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Detailed breakdown of assignment submission and completion rates</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Doughnut Chart */}
                                <div className="lg:col-span-1">
                                    <div className="h-80">
                                        <Doughnut data={assignmentCompletionData} options={doughnutOptions} />
                                    </div>
                                </div>

                                {/* Individual Assignment Progress */}
                                <div className="lg:col-span-2 space-y-4">
                                    {[
                                        { name: 'Data Visualization Project', completion: 95, submissions: 43, total: 45, color: 'bg-green-500', status: 'excellent' },
                                        { name: 'Python Quiz #3', completion: 87, submissions: 39, total: 45, color: 'bg-blue-500', status: 'good' },
                                        { name: 'ML Essay Assignment', completion: 73, submissions: 33, total: 45, color: 'bg-orange-500', status: 'needs attention' },
                                        { name: 'Statistical Analysis Lab', completion: 91, submissions: 41, total: 45, color: 'bg-purple-500', status: 'good' }
                                    ].map((assignment, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 ${assignment.color} rounded-xl flex items-center justify-center text-white font-semibold text-sm`}>
                                                        {assignment.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{assignment.name}</h4>
                                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{assignment.submissions}/{assignment.total} submitted</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{assignment.completion}%</div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        assignment.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                                        assignment.status === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {assignment.status === 'excellent' ? '🌟 Excellent' :
                                                            assignment.status === 'good' ? '👍 Good' : '⚠️ Needs Attention'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                                <div 
                                                    className={`${assignment.color} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                                                    style={{ width: `${assignment.completion}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className={`mt-6 p-4 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : 'from-gray-50 to-gray-100'} rounded-xl transition-colors duration-300`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Overall Completion Rate</span>
                                            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>86.5%</span>
                                        </div>
                                        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            Above institutional average of 82%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Summary */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-indigo-900/50 to-purple-900/50' : 'border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50'} transition-colors duration-300`}>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-2xl">📊</span>
                            Analytics Summary & Recommendations
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Key insights and actionable recommendations for your courses</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-green-600 text-3xl">🎯</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-900'} transition-colors duration-300`}>Strengths</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'} transition-colors duration-300`}>What's working well</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">✅</span>High engagement during morning sessions</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Excellent assignment completion rates</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Strong student performance trends</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Above-average completion metrics</li>
                                </ul>
                            </div>

                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-yellow-900/50 border-orange-700' : 'from-orange-50 to-yellow-50 border-orange-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-orange-600 text-3xl">⚠️</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'} transition-colors duration-300`}>Areas to Improve</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} transition-colors duration-300`}>Focus areas</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Afternoon engagement drops significantly</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Some students need extra support</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>ML topics require simplification</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Week 4 performance consistency</li>
                                </ul>
                            </div>

                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-blue-600 text-3xl">💡</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} transition-colors duration-300`}>Recommendations</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>Action items</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Schedule complex topics in AM</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Add interactive ML examples</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Offer additional office hours</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Implement peer learning sessions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTeacherMessages = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">💬</span>
                        Messages & Communications
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Connect with students and manage course communications</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className={`inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg transition-colors`}>
                        <span className="mr-2">📊</span>
                        Analytics
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">✍️</span>
                        Compose Message
                    </button>
                </div>
            </div>
    
            {/* Communication Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">23</div>
                                <div className="text-blue-100 text-sm font-medium">Unread Messages</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-indigo-900/30' : 'from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Today</span>
                            <span className="font-semibold text-red-600">5 urgent</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">❓</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">47</div>
                                <div className="text-green-100 text-sm font-medium">Student Questions</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-green-900/30 to-emerald-900/30' : 'from-green-50 to-emerald-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This week</span>
                            <span className="font-semibold text-green-600">92% answered</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📢</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">8</div>
                                <div className="text-purple-100 text-sm font-medium">Announcements</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This month</span>
                            <span className="font-semibold text-purple-600">86% read</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">2.3h</div>
                                <div className="text-orange-100 text-sm font-medium">Avg Response</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Response time</span>
                            <span className="font-semibold text-green-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Messages Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🔍</span>
                                Message Filters
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { label: 'All Messages', count: 156, active: true, color: isDarkMode ? 'text-blue-400 bg-blue-900/50' : 'text-blue-600 bg-blue-50' },
                                    { label: 'Unread', count: 23, active: false, color: isDarkMode ? 'text-red-400 bg-red-900/50' : 'text-red-600 bg-red-50' },
                                    { label: 'Student Questions', count: 47, active: false, color: isDarkMode ? 'text-green-400 bg-green-900/50' : 'text-green-600 bg-green-50' },
                                    { label: 'Announcements', count: 8, active: false, color: isDarkMode ? 'text-purple-400 bg-purple-900/50' : 'text-purple-600 bg-purple-50' },
                                    { label: 'Urgent', count: 5, active: false, color: isDarkMode ? 'text-orange-400 bg-orange-900/50' : 'text-orange-600 bg-orange-50' }
                                ].map((filter, index) => (
                                    <button key={index} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${
                                        filter.active 
                                            ? (isDarkMode ? 'border-blue-600 bg-blue-900/30' : 'border-blue-300 bg-blue-50') 
                                            : (isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50')
                                    }`}>
                                        <span className={`font-medium ${filter.active ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')} transition-colors duration-300`}>
                                            {filter.label}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${filter.color} transition-colors duration-300`}>
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">⚡</span>
                                Quick Actions
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { 
                                        icon: '📢', 
                                        label: 'Send Announcement', 
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
                                        onClick: () => setShowContactModal(true)
                                    },
                                    { 
                                        icon: '📅', 
                                        label: 'Schedule Reminder', 
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500 text-green-400' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
                                        onClick: () => notification.info({
                                            message: 'Schedule Reminder',
                                            description: 'Reminder scheduling feature coming soon!',
                                            duration: 3
                                        })
                                    },
                                    { 
                                        icon: '🎯', 
                                        label: 'Grade Notification', 
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500 text-purple-400' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
                                        onClick: () => handleTabTransition('analytics')
                                    },
                                    { 
                                        icon: '📚', 
                                        label: 'Share Resources', 
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500 text-orange-400' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700',
                                        onClick: () => setShowMaterialUploadModal(true)
                                    }
                                ].map((action, index) => (
                                    <button 
                                        key={index} 
                                        onClick={action.onClick}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all group ${action.color}`}
                                    >
                                        <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                        <span className="font-medium">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Messages List */}
                <div className="lg:col-span-3">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Recent Messages</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>Live Updates</span>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <div className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'} transition-colors duration-300`}>
                                {/* Urgent Message */}
                                <div className={`p-6 bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-pink-900/50' : 'from-red-50 to-pink-50'} border-l-4 border-red-500 ${isDarkMode ? 'hover:bg-red-900/60' : 'hover:bg-red-100'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            JS
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>John Smith</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    🚨 Urgent
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>2 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Data Science 101
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Question about regression analysis assignment</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>I'm having trouble understanding the difference between linear and logistic regression. Could you please provide some clarification before the deadline tomorrow?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">⚡</span>
                                                    Reply Now
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">📞</span>
                                                    Schedule Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Regular Message */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            MJ
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Mary Johnson</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>5 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Machine Learning Basics
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Thank you for the detailed feedback</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Your comments on my neural network project were very helpful. I've implemented the suggested improvements and would love to get your thoughts...</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">💬</span>
                                                    Reply
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">👁️</span>
                                                    View Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* System Message */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            <span className="text-lg">🏫</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Admin Department</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    System
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>1 day ago</span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Grade submission deadline reminder</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Please remember that final grades for the current semester are due by Friday, June 15th at 11:59 PM...</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">📋</span>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* More messages... */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            AL
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Alice Lee</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>2 days ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Python Programming
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Request for office hours</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>I would like to schedule some one-on-one time to discuss my final project proposal. When would be a good time for you?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">📅</span>
                                                    Schedule Meeting
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">💬</span>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Announcement Templates */}
                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">📢</span>
                                Quick Announcement Templates
                            </h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Send common announcements with one click</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { 
                                        title: 'Assignment Reminder', 
                                        desc: 'Remind students about upcoming deadlines',
                                        icon: '⏰',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500 text-orange-400' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700'
                                    },
                                    { 
                                        title: 'Study Resources', 
                                        desc: 'Share additional learning materials',
                                        icon: '📚',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                                    },
                                    { 
                                        title: 'Class Schedule Change', 
                                        desc: 'Notify about schedule modifications',
                                        icon: '📅',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500 text-purple-400' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700'
                                    },
                                    { 
                                        title: 'Congratulate Top Performers', 
                                        desc: 'Celebrate student achievements',
                                        icon: '🏆',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500 text-green-400' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
                                    }
                                ].map((template, index) => (
                                    <button key={index} className={`flex items-start space-x-4 p-4 rounded-xl border transition-all group ${template.color}`}>
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                                        <div className="text-left">
                                            <h4 className="font-semibold mb-1">{template.title}</h4>
                                            <p className="text-sm opacity-80">{template.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherSettings = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">⚙️</span>
                        Teacher Settings
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Customize your teaching experience and preferences</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className={`inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg transition-colors`}>
                        <span className="mr-2">🔄</span>
                        Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">💾</span>
                        Save Settings
                    </button>
                </div>
            </div>
    
            {/* Settings Container */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Account Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">👤</span>
                        Account Information
                    </h3>
                    
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <span className="text-sm">📷</span>
                            </button>
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                {user?.name || "Dr. Sarah Wilson"}
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                {user?.email || "sarah.wilson@university.edu"}
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                👨‍🏫 Teacher
                            </span>
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue={user?.name || "Dr. Sarah Wilson"}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue={user?.email || "sarah.wilson@university.edu"}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Employee ID
                            </label>
                            <input
                                type="text"
                                defaultValue="EMP-2024-001"
                                readOnly
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'} rounded-lg transition-all cursor-not-allowed`}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Department
                            </label>
                            <select className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                                <option>Computer Science</option>
                                <option>Mathematics</option>
                                <option>Data Science</option>
                                <option>Engineering</option>
                                <option>Business</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Bio/Description
                            </label>
                            <textarea
                                rows="4"
                                defaultValue="Dr. Sarah Wilson is a Computer Science professor with over 10 years of experience in data science and machine learning education."
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                placeholder="Tell students about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🌐</span>
                        {t('adminDashboard.language.title')}
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    🗣️
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Interface Language
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Choose your preferred language
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'en' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇺🇸 English
                                </span>
                                <button
                                    onClick={() => {
                                        const newLanguage = currentLanguage === 'en' ? 'ja' : 'en';
                                        handleLanguageToggle(newLanguage);
                                    }}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                        currentLanguage === 'ja' ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            currentLanguage === 'ja' ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'ja' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇯🇵 Japanese
                                </span>
                            </div>
                        </div>
                        
                        {/* Language Change Feedback */}
                        {currentLanguage !== 'en' && (
                            <div className={`mt-4 p-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                            } rounded-xl border transition-all duration-300`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-600 text-2xl">✅</span>
                                    <div>
                                        <h4 className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-900'
                                        } transition-colors duration-300`}>{t('adminDashboard.language.changeNotification.title')}</h4>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-700'
                                        } transition-colors duration-300`}>
                                            {t('adminDashboard.language.changeNotification.message', { 
                                                language: currentLanguage === 'ja' 
                                                    ? t('adminDashboard.language.languages.japanese') + ' (' + t('adminDashboard.language.languages.japaneseName') + ')'
                                                    : t('adminDashboard.language.languages.english')
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                
                        <div className={`mt-4 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Language Note</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>
                                        Changing language will apply to the interface. Course content language may vary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Dark Mode Toggle Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🎨</span>
                        Display Settings
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    {isDarkMode ? '🌙' : '☀️'}
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Dark Mode
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Switch between light and dark themes
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    ☀️ Light
                                </span>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            isDarkMode ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    🌙 Dark
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Additional Settings */}
                <div className="p-8">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🛠️</span>
                        Teaching Preferences
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Grading Preferences */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                Grading System
                            </h4>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                        Default Grading Scale
                                    </label>
                                    <select className={`w-full px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                                        <option>A-F Letter Grades</option>
                                        <option>0-100 Percentage</option>
                                        <option>1-10 Scale</option>
                                        <option>Pass/Fail</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                        Late Penalty (% per day)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="10"
                                        className={`w-full px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
    
                        {/* Notification Preferences */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                Notifications
                            </h4>
                            <div className="space-y-4">
                                {[
                                    'Student Messages',
                                    'Assignment Submissions',
                                    'Grading Deadlines',
                                    'System Updates'
                                ].map((notification, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {notification}
                                        </span>
                                        <button
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                                index % 2 === 0 ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                                    index % 2 === 0 ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Security Section */}
                    <div className={`mt-8 p-6 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/50 to-red-900/50 border-orange-700' : 'from-orange-50 to-red-50 border-orange-200'} rounded-xl border transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-orange-600 text-2xl">🔐</span>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'} transition-colors duration-300`}>
                                        Account Security
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} transition-colors duration-300`}>
                                        Password last changed 45 days ago
                                    </p>
                                </div>
                            </div>
                            <button className="admin-clean-button inline-flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Admin Dashboard Components
    const renderAdminOverview = () => (
        <div className="space-y-8">
            {/* System Health Header - Enhanced Dark Mode */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative p-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* System Health Score */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        stroke="rgba(255,255,255,0.2)" 
                                        strokeWidth="8" 
                                        fill="transparent"
                                    />
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        stroke="white" 
                                        strokeWidth="8" 
                                        fill="transparent"
                                        strokeDasharray={`${dashboardData.admin.systemHealth * 2.51} 251`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">{dashboardData.admin.systemHealth}%</div>
                                        <div className="text-xs text-white/80 font-medium uppercase tracking-wide">{t('admin.status.optimal')}</div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('admin.systemHealth.title')}</h2>
                            <p className="text-white/80 text-center lg:text-left">{t('admin.systemHealth.description')}</p>
                        </div>
    
                        {/* Real-time Metrics */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-green-400 text-xl">🖥️</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.serverLoad.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.serverLoad.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.serverLoad}%</div>
                                        <div className="text-green-400 text-sm font-medium">↗ {t('admin.status.optimal')}</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${dashboardData.admin.serverLoad}%` }}
                                    ></div>
                                </div>
                            </div>
    
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-orange-400 text-xl">💾</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.storage.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.storage.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.storageUsed}%</div>
                                        <div className="text-orange-400 text-sm font-medium">📈 {t('admin.status.growing')}</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-orange-400 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${dashboardData.admin.storageUsed}%` }}
                                    ></div>
                                </div>
                            </div>
    
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-400 text-xl">⚡</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.response.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.response.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">142ms</div>
                                        <div className="text-blue-400 text-sm font-medium">⚡ {t('admin.status.fast')}</div>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(10)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-8 w-3 rounded-sm ${i < 7 ? 'bg-blue-400' : 'bg-white/20'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
    
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-purple-400 text-xl">🌐</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.sessions.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.sessions.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">247</div>
                                        <div className="text-purple-400 text-sm font-medium">👥 {t('admin.status.active')}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                    <span className="text-white/60 text-sm">{t('admin.status.liveMonitoring')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Clean Simple Admin Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="admin-clean-card group">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
                                <div className="text-gray-500 text-sm font-medium">{t('admin.metrics.totalUsers')}</div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{t('admin.metrics.pendingApproval')}</span>
                                <span className={`admin-status-indicator ${pendingUsers.length > 0 ? 'admin-status-warning' : 'admin-status-indicator'}`}>
                                    {pendingUsers.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${(allUsers.filter(u => u.isApproved).length / allUsers.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {Math.round((allUsers.filter(u => u.isApproved).length / allUsers.length) * 100)}% {t('admin.status.approved')}
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className="admin-clean-card group">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{applicationSubmissions.length}</div>
                                <div className="text-gray-500 text-sm font-medium">{t('admin.metrics.applications')}</div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{t('admin.metrics.pendingReview')}</span>
                                <span className={`admin-status-indicator ${(dashboardData.admin.pendingApplications || 0) > 0 ? 'admin-status-warning' : 'admin-status-indicator'}`}>
                                    {dashboardData.admin.pendingApplications || 0}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${applicationSubmissions.length > 0 ? ((applicationSubmissions.filter(app => app.status === 'approved').length / applicationSubmissions.length) * 100) : 0}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {applicationSubmissions.filter(app => app.status === 'approved').length} {t('admin.status.approved')}
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{contactSubmissions.length}</div>
                                <div className="text-orange-100 text-sm font-medium">{t('admin.metrics.messages')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.metrics.needsResponse')}</span>
                            <span className="font-semibold text-red-600">{dashboardData.admin.pendingContacts || 0}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-300`}>
                            <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${contactSubmissions.length > 0 ? ((contactSubmissions.filter(contact => contact.status === 'resolved').length / contactSubmissions.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>
                            {contactSubmissions.filter(contact => contact.status === 'resolved').length} {t('admin.status.resolved')}
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-purple-100 text-sm font-medium">{t('admin.metrics.uptime')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.metrics.last30Days')}</span>
                            <span className="font-semibold text-green-600">{t('admin.status.excellent')}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-300`}>
                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: '99.9%' }}></div>
                        </div>
                        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>
                            43.2 {t('admin.metrics.downtime')}
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Content Grid - Dark Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Role Distribution - Dark Mode */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">📊</span>
                            {t('admin.userDistribution.title')}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 transition-colors duration-300`}>{t('admin.userDistribution.subtitle')}</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🎓</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.roles.students')}</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.roles.studentsDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{allUsers.filter(u => u.role === 'student').length}</div>
                                    <div className="text-xs text-blue-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'student').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
    
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🏫</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.roles.teachers')}</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.roles.teachersDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{allUsers.filter(u => u.role === 'teacher').length}</div>
                                    <div className="text-xs text-green-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'teacher').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
    
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-purple-900/20 border-purple-700/50' : 'bg-purple-50 border-purple-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍💼</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.roles.administrators')}</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.roles.administratorsDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">{allUsers.filter(u => u.role === 'admin').length}</div>
                                    <div className="text-xs text-purple-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'admin').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className={`mt-6 p-4 rounded-xl transition-colors ${
                            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{t('admin.metrics.totalActiveUsers')}</span>
                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{allUsers.filter(u => u.isApproved).length}</span>
                            </div>
                            <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                {t('admin.metrics.growthRate')}: +{Math.floor(Math.random() * 15) + 5}% {t('admin.metrics.thisMonth')}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Recent Activity Feed - Dark Mode */}
                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                    <span className="mr-2">⚡</span>
                                    {t('admin.activity.title')}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 transition-colors duration-300`}>{t('admin.activity.subtitle')}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{t('admin.status.live')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {/* Pending User Approvals - Dark Mode */}
                            {pendingUsers.length > 0 && pendingUsers.slice(0, 3).map(user => (
                                <div key={user._id} className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                    isDarkMode 
                                        ? 'bg-orange-900/20 border-orange-700/50 hover:bg-orange-900/30' 
                                        : 'bg-orange-25 border-orange-200 hover:bg-orange-50'
                                }`}>
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">!</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>
                                                {t('admin.activity.newRegistration', { role: user.role })}
                                            </h4>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            {user.firstName} {user.lastName} ({user.email}) {t('admin.activity.awaitingApproval')}
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-green-300 bg-green-900/50 hover:bg-green-900/70 border border-green-700/50' 
                                                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                                onClick={() => handleUserApproval(user._id, true)}
                                            >
                                                ✅ {t('admin.actions.approve')}
                                            </button>
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-red-300 bg-red-900/50 hover:bg-red-900/70 border border-red-700/50' 
                                                        : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                }`}
                                                onClick={() => handleUserApproval(user._id, false)}
                                            >
                                                ❌ {t('admin.actions.reject')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
    
                            {/* Recent Contact Messages - Dark Mode */}
                            {contactSubmissions.length > 0 && contactSubmissions.filter(c => c.status === 'pending').slice(0, 2).map(contact => (
                                <div key={contact._id} className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                    isDarkMode 
                                        ? 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30' 
                                        : 'bg-blue-25 border-blue-200 hover:bg-blue-50'
                                }`}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                        {contact.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.activity.newContactMessage')}</h4>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            {contact.name} - {contact.subject}
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700/50' 
                                                        : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                }`}
                                                onClick={() => handleContactAction(contact._id, 'approved')}
                                            >
                                                🔥 {t('admin.actions.priority')}
                                            </button>
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-green-300 bg-green-900/50 hover:bg-green-900/70 border border-green-700/50' 
                                                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                                onClick={() => handleContactAction(contact._id, 'resolved')}
                                            >
                                                ✅ {t('admin.actions.resolve')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
    
                            {/* System Events - Dark Mode */}
                            <div className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                isDarkMode 
                                    ? 'bg-green-900/20 border-green-700/50' 
                                    : 'bg-green-25 border-green-200'
                            }`}>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">🛡️</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.activity.securityScan')}</h4>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{t('admin.time.fiveMinutesAgo')}</span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.activity.noThreats')}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 transition-colors ${
                                        isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-green-100 text-green-800'
                                    }`}>
                                        ✅ {t('admin.status.allClear')}
                                    </span>
                                </div>
                            </div>
    
                            <div className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                isDarkMode 
                                    ? 'bg-purple-900/20 border-purple-700/50' 
                                    : 'bg-purple-25 border-purple-200'
                            }`}>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">💾</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{t('admin.activity.databaseBackup')}</h4>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{t('admin.time.oneHourAgo')}</span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>{t('admin.activity.backupSuccess')}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 transition-colors ${
                                        isDarkMode ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        📊 {t('admin.status.automated')}
                                    </span>
                                </div>
                            </div>
                        </div>
    
                        {/* Quick Actions - Dark Mode */}
                        <div className={`mt-8 p-6 rounded-xl transition-colors ${
                            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                        }`}>
                            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-4 transition-colors duration-300`}>{t('admin.quickActions.title')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button 
                                    onClick={() => handleTabTransition('all-users')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                        isDarkMode 
                                            ? 'bg-gray-800 border-gray-600 hover:bg-blue-900/30 hover:border-blue-700/50' 
                                            : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                    }`}
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👥</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-blue-300' : 'text-gray-700 group-hover:text-blue-700'
                                    }`}>{t('admin.quickActions.manageUsers')}</span>
                                </button>
                                <button 
                                    onClick={() => handleTabTransition('applications')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                        isDarkMode 
                                            ? 'bg-gray-800 border-gray-600 hover:bg-green-900/30 hover:border-green-700/50' 
                                            : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                                    }`}
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📋</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-green-300' : 'text-gray-700 group-hover:text-green-700'
                                    }`}>{t('admin.quickActions.applications')}</span>
                                </button>
                                <button 
                                    onClick={() => handleTabTransition('contacts')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                        isDarkMode 
                                            ? 'bg-gray-800 border-gray-600 hover:bg-orange-900/30 hover:border-orange-700/50' 
                                            : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'
                                    }`}
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📧</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-orange-300' : 'text-gray-700 group-hover:text-orange-700'
                                    }`}>{t('admin.quickActions.messages')}</span>
                                </button>
                                <button 
                                    onClick={() => handleTabTransition('settings')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                        isDarkMode 
                                            ? 'bg-gray-800 border-gray-600 hover:bg-purple-900/30 hover:border-purple-700/50' 
                                            : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                                    }`}
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-purple-300' : 'text-gray-700 group-hover:text-purple-700'
                                    }`}>{t('admin.quickActions.settings')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* System Alerts & Notifications - Dark Mode */}
            {dashboardData.admin.recentAlerts && dashboardData.admin.recentAlerts.length > 0 && (
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🚨</span>
                            {t('admin.alerts.title')}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 transition-colors duration-300`}>{t('admin.alerts.subtitle')}</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {dashboardData.admin.recentAlerts.map((alert, index) => (
                                <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl border transition-colors ${
                                    alert.type === 'warning' 
                                        ? (isDarkMode ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-yellow-25 border-yellow-200')
                                        : (isDarkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-25 border-blue-200')
                                }`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}>
                                        <span className="text-white text-sm">
                                            {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{alert.message}</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>{alert.time}</p>
                                    </div>
                                    <button className={`transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                                        <span className="text-lg">✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Helper functions for user management pagination
    const getUserTotalPages = () => {
        const totalItems = getFilteredUsers().length;
        return Math.ceil(totalItems / itemsPerPage);
    };

    const getCurrentPageUsers = () => {
        const filteredUsers = getFilteredUsers();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    // Helper functions for application management pagination
    const getApplicationTotalPages = () => {
        const totalItems = getFilteredApplications().length;
        return Math.ceil(totalItems / itemsPerPage);
    };

    const getCurrentPageApplications = () => {
        const filteredApplications = getFilteredApplications();
        const startIndex = (currentApplicationPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredApplications.slice(startIndex, endIndex);
    };

    const renderUserManagement = () => (
        <div className="space-y-6">
            {/* Clean Header Section */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Title and Stats Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${
                                isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                            } rounded-lg flex items-center justify-center`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('userManagement.title')}
                                </h2>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                    Manage and monitor your team
                                </p>
                            </div>
                        </div>
                        
                        {/* Clean Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {allUsers.length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('userManagement.stats.totalUsers')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-orange-600">
                                            {pendingUsers.length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('userManagement.stats.pending')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-green-600">
                                            {allUsers.filter(u => u.isApproved).length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('userManagement.stats.approved')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="space-y-3">
                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={t('userManagement.search.placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('userManagement.filters.allRoles')}</option>
                                    <option value="student">{t('userManagement.filters.students')}</option>
                                    <option value="teacher">{t('userManagement.filters.teachers')}</option>
                                    <option value="admin">{t('userManagement.filters.admins')}</option>
                                </select>
                                <select 
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('userManagement.filters.allStatus')}</option>
                                    <option value="approved">{t('userManagement.filters.approved')}</option>
                                    <option value="pending">{t('userManagement.filters.pending')}</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Create User Button */}
                        <button 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setShowCreateUserForm(true)}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t('userManagement.actions.createUser')}
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Clean Create User Modal */}
            {showCreateUserForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                    } rounded-lg shadow-xl border w-full max-w-2xl`}>
                        {/* Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('userManagement.modals.createUser.title')}
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Add a new team member to the platform
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setShowCreateUserForm(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-6">
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.firstName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.placeholders.firstName')}
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.lastName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.placeholders.lastName')}
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.email')}
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t('userManagement.placeholders.email')}
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.password')}
                                        </label>
                                        <input
                                            type="password"
                                            placeholder={t('userManagement.placeholders.password')}
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.role')}
                                        </label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        >
                                            <option value="student">{t('userManagement.roles.student')}</option>
                                            <option value="teacher">{t('userManagement.roles.teacher')}</option>
                                            <option value="admin">{t('userManagement.roles.admin')}</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => setShowCreateUserForm(false)}
                                    >
                                        {t('userManagement.actions.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        {t('userManagement.actions.createUser')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Clean Edit User Modal */}
            {showEditUserForm && editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                    } rounded-lg shadow-xl border w-full max-w-2xl`}>
                        {/* Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('userManagement.modals.editUser.title')}
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Editing: {editingUser.firstName} {editingUser.lastName}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => {
                                    setShowEditUserForm(false);
                                    setEditingUser(null);
                                    setNewUserData({
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        password: '',
                                        role: 'student'
                                    });
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-6">
                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.firstName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.placeholders.firstName')}
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.lastName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.placeholders.lastName')}
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.email')}
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t('userManagement.placeholders.email')}
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.newPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            placeholder={t('userManagement.placeholders.newPassword')}
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                        />
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('userManagement.hints.passwordHint')}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {t('userManagement.fields.role')}
                                        </label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        >
                                            <option value="student">{t('userManagement.roles.student')}</option>
                                            <option value="teacher">{t('userManagement.roles.teacher')}</option>
                                            <option value="admin">{t('userManagement.roles.admin')}</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setShowEditUserForm(false);
                                            setEditingUser(null);
                                            setNewUserData({
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                password: '',
                                                role: 'student'
                                            });
                                        }}
                                    >
                                        {t('userManagement.actions.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('userManagement.actions.updateUser')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Clean Delete Confirmation Modal */}
            {showDeleteConfirm && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                    } rounded-lg shadow-xl border w-full max-w-md`}>
                        <div className="p-6">
                            {/* Warning Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="text-center space-y-3">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('userManagement.modals.deleteUser.title')}
                                </h3>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
                                    <p>
                                        {t('userManagement.modals.deleteUser.message', { 
                                            name: `${userToDelete.firstName} ${userToDelete.lastName}`, 
                                            email: userToDelete.email 
                                        })}
                                    </p>
                                    <div className={`p-3 rounded-lg ${
                                        isDarkMode 
                                            ? 'bg-red-900 bg-opacity-30 border border-red-800' 
                                            : 'bg-red-50 border border-red-200'
                                    }`}>
                                        <p className="text-red-600 font-medium text-sm">
                                            {t('userManagement.modals.deleteUser.warning')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        console.log('❌ Cancel delete clicked');
                                        setShowDeleteConfirm(false);
                                        setUserToDelete(null);
                                    }}
                                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {t('userManagement.actions.cancel')}
                                </button>
                                <button
                                    onClick={confirmDeleteUser}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t('userManagement.actions.confirmDelete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Clean Users Table */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            } rounded-xl shadow-sm border overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className={`${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600' 
                                    : 'bg-gray-50 border-gray-200'
                            } border-b`}>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.user')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.contact')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.role')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.status')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.joined')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                        <span>{t('userManagement.table.headers.actions')}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${
                            isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                        } divide-y`}>
                            {getCurrentPageUsers().map((user, index) => (
                                <tr key={user._id} className={`transition-colors ${
                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                } ${!user.isApproved ? (
                                    isDarkMode 
                                        ? 'bg-orange-900 bg-opacity-20 border-l-4 border-orange-500' 
                                        : 'bg-orange-50 border-l-4 border-orange-400'
                                ) : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                                                    user.role === 'admin' ? 'bg-purple-600' :
                                                    user.role === 'teacher' ? 'bg-green-600' :
                                                    'bg-blue-600'
                                                }`}>
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 ${
                                                    isDarkMode ? 'border-gray-800' : 'border-white'
                                                } rounded-full ${
                                                    user.isApproved ? 'bg-green-400' : 'bg-orange-400'
                                                }`}></div>
                                            </div>
                                            <div>
                                                <div className={`text-sm font-semibold ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className={`text-xs ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    ID: {user._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className={`text-sm ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>{user.email}</div>
                                            {user.phone && (
                                                <div className={`text-xs ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                } flex items-center`}>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                                            user.role === 'admin' ? (
                                                isDarkMode 
                                                    ? 'bg-purple-900 bg-opacity-50 text-purple-300 border border-purple-700' 
                                                    : 'bg-purple-100 text-purple-800'
                                            ) :
                                            user.role === 'teacher' ? (
                                                isDarkMode 
                                                    ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700' 
                                                    : 'bg-green-100 text-green-800'
                                            ) : (
                                                isDarkMode 
                                                    ? 'bg-blue-900 bg-opacity-50 text-blue-300 border border-blue-700' 
                                                    : 'bg-blue-100 text-blue-800'
                                            )
                                        }`}>
                                            {t(`userManagement.roles.${user.role}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                                user.isApproved ? (
                                                    isDarkMode 
                                                        ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700' 
                                                        : 'bg-green-100 text-green-800'
                                                ) : (
                                                    isDarkMode 
                                                        ? 'bg-orange-900 bg-opacity-50 text-orange-300 border border-orange-700' 
                                                        : 'bg-orange-100 text-orange-800'
                                                )
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    user.isApproved ? 'bg-green-400' : 'bg-orange-400'
                                                }`}></span>
                                                {user.isApproved ? t('userManagement.status.approved') : t('userManagement.status.pending')}
                                            </span>
                                            {!user.isApproved && (
                                                <div className={`text-xs font-medium flex items-center ${
                                                    isDarkMode ? 'text-orange-300' : 'text-orange-600'
                                                }`}>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    {t('userManagement.status.needsReview')}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        <div className="space-y-1">
                                            <div className={`font-medium ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(user.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? t('userManagement.time.today') : t('userManagement.time.daysAgo', { days });
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {!user.isApproved ? (
                                                <>
                                                    <button 
                                                        className={`p-2 border border-transparent rounded-lg text-green-600 ${
                                                            isDarkMode ? 'hover:bg-green-900 hover:bg-opacity-30' : 'hover:bg-green-100'
                                                        } transition-colors`}
                                                        onClick={() => handleUserApproval(user._id, true)}
                                                        title={t('userManagement.actions.approveUser')}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        className={`p-2 border border-transparent rounded-lg text-red-600 ${
                                                            isDarkMode ? 'hover:bg-red-900 hover:bg-opacity-30' : 'hover:bg-red-100'
                                                        } transition-colors`}
                                                        onClick={() => handleUserApproval(user._id, false)}
                                                        title={t('userManagement.actions.rejectUser')}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className={`p-2 border border-transparent rounded-lg text-blue-600 ${
                                                            isDarkMode ? 'hover:bg-blue-900 hover:bg-opacity-30' : 'hover:bg-blue-100'
                                                        } transition-colors`}
                                                        onClick={() => handleEditUser(user)}
                                                        title={t('userManagement.actions.editUser')}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        className={`p-2 border border-transparent rounded-lg text-red-600 ${
                                                            isDarkMode ? 'hover:bg-red-900 hover:bg-opacity-30' : 'hover:bg-red-100'
                                                        } transition-colors`}
                                                        onClick={() => handleDeleteUser(user)}
                                                        title={t('userManagement.actions.deleteUser')}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            
                                            {/* More Actions Dropdown */}
                                            <div className="relative group">
                                                <button className={`p-2 border border-transparent rounded-lg ${
                                                    isDarkMode 
                                                        ? 'text-gray-400 hover:bg-gray-700 hover:bg-opacity-50' 
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                } transition-colors`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                                <div className={`absolute right-0 mt-2 w-48 ${
                                                    isDarkMode 
                                                        ? 'bg-gray-800 border-gray-700' 
                                                        : 'bg-white border-gray-200'
                                                } rounded-lg shadow-lg border z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                                                    <div className="py-1">
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm ${
                                                                isDarkMode 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            } transition-colors`}
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            {t('userManagement.actions.editUser')}
                                                        </button>
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm ${
                                                                isDarkMode 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            } transition-colors`}
                                                            onClick={() => handleSendMessageToUser(user)}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('userManagement.actions.sendMessage')}
                                                        </button>
                                                        <hr className={`my-1 ${
                                                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                                        }`} />
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                                                                isDarkMode ? 'hover:bg-red-900 hover:bg-opacity-30' : 'hover:bg-red-50'
                                                            } transition-colors`}
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            {t('userManagement.actions.deleteUser')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                {/* Enhanced Table Footer with Pagination */}
                <div className={`${
                    isDarkMode 
                        ? 'bg-gradient-to-r from-gray-800/90 to-gray-700/90 border-gray-600/50' 
                        : 'bg-gradient-to-r from-gray-50/90 to-white/90 border-gray-200/50'
                } px-8 py-6 flex items-center justify-between border-t backdrop-blur-sm`}>
                    <div className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } flex items-center space-x-2`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span>
                            {t('userManagement.table.pagination.showing', {
                                from: Math.min((currentPage - 1) * itemsPerPage + 1, getFilteredUsers().length),
                                to: Math.min(currentPage * itemsPerPage, getFilteredUsers().length),
                                total: getFilteredUsers().length
                            })}
                        </span>
                        {(searchTerm || selectedRole || selectedStatus) && (
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                isDarkMode 
                                    ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' 
                                    : 'bg-blue-100 text-blue-600 border border-blue-200'
                            }`}>
                                <svg className="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {t('userManagement.table.pagination.filtered')}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            className={`group px-4 py-2 border rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                currentPage === 1
                                    ? `opacity-50 cursor-not-allowed ${
                                        isDarkMode 
                                            ? 'border-gray-600/50 text-gray-500 bg-gray-800/50' 
                                            : 'border-gray-200/50 text-gray-400 bg-white/50'
                                    }`
                                    : `hover:scale-105 shadow-lg ${
                                        isDarkMode 
                                            ? 'border-gray-600/50 text-gray-200 bg-gray-800/50 hover:bg-gray-700/50' 
                                            : 'border-gray-200/50 text-gray-700 bg-white/50 hover:bg-gray-50/50'
                                    }`
                            }`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <span className="flex items-center space-x-2">
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>{t('userManagement.table.pagination.previous')}</span>
                            </span>
                        </button>
                        
                        <div className="flex space-x-2">
                            {[...Array(getUserTotalPages())].map((_, index) => {
                                const pageNumber = index + 1;
                                
                                // Show first page, last page, current page, and pages around current page
                                if (getUserTotalPages() <= 5 || 
                                    pageNumber === 1 || 
                                    pageNumber === getUserTotalPages() || 
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg ${
                                                currentPage === pageNumber
                                                    ? `text-white transform scale-110 ${
                                                        isDarkMode 
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/25' 
                                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/25'
                                                    }`
                                                    : `hover:scale-105 ${
                                                        isDarkMode 
                                                            ? 'border border-gray-600/50 text-gray-200 bg-gray-800/50 hover:bg-gray-700/50' 
                                                            : 'border border-gray-200/50 text-gray-700 bg-white/50 hover:bg-gray-50/50'
                                                    }`
                                            }`}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                    return (
                                        <span key={pageNumber} className={`px-3 py-2 ${
                                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        } font-bold`}>
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        
                        <button 
                            className={`group px-4 py-2 border rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                currentPage === getUserTotalPages()
                                    ? `opacity-50 cursor-not-allowed ${
                                        isDarkMode 
                                            ? 'border-gray-600/50 text-gray-500 bg-gray-800/50' 
                                            : 'border-gray-200/50 text-gray-400 bg-white/50'
                                    }`
                                    : `hover:scale-105 shadow-lg ${
                                        isDarkMode 
                                            ? 'border-gray-600/50 text-gray-200 bg-gray-800/50 hover:bg-gray-700/50' 
                                            : 'border-gray-200/50 text-gray-700 bg-white/50 hover:bg-gray-50/50'
                                    }`
                            }`}
                            onClick={handleNextPage}
                            disabled={currentPage === getUserTotalPages()}
                        >
                            <span className="flex items-center space-x-2">
                                <span>{t('userManagement.table.pagination.next')}</span>
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Send Message Modal for User Management */}
            {showSendMessageModal && messageData.recipient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } rounded-lg shadow-xl border w-full max-w-2xl`}>
                        <div className={`flex items-center justify-between p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('userManagement.actions.sendMessage')}
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {t('userManagement.modals.sendMessage.subtitle', { 
                                            firstName: messageData.recipient.firstName, 
                                            lastName: messageData.recipient.lastName 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => {
                                    setShowSendMessageModal(false);
                                    setMessageData({
                                        subject: '',
                                        message: '',
                                        recipient: null
                                    });
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSendMessageSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('userManagement.modals.sendMessage.to')}
                                    </label>
                                    <div className={`p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    } border`}>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {messageData.recipient.firstName} {messageData.recipient.lastName} ({messageData.recipient.email})
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('userManagement.modals.sendMessage.subject')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('userManagement.modals.sendMessage.subjectPlaceholder')}
                                        value={messageData.subject}
                                        onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('userManagement.modals.sendMessage.message')}
                                    </label>
                                    <textarea
                                        rows="6"
                                        placeholder={t('userManagement.modals.sendMessage.messagePlaceholder')}
                                        value={messageData.message}
                                        onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>
                                
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setShowSendMessageModal(false);
                                            setMessageData({
                                                subject: '',
                                                message: '',
                                                recipient: null
                                            });
                                        }}
                                    >
                                        {t('userManagement.modals.sendMessage.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {t('userManagement.modals.sendMessage.send')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderApplicationManagement = () => (
        <div className="space-y-6">
            {/* Clean Header Section */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Title and Stats Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${
                                isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'
                            } rounded-lg flex items-center justify-center`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('applicationManagement.title')}
                                </h2>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                    {t('applicationManagement.subtitle')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Clean Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {applicationSubmissions.length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('applicationManagement.stats.totalApplications')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-orange-600">
                                            {applicationSubmissions.filter(app => app.status === 'pending').length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('applicationManagement.stats.pending')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-green-600">
                                            {applicationSubmissions.filter(app => app.status === 'approved').length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('applicationManagement.stats.approved')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-red-600">
                                            {applicationSubmissions.filter(app => app.status === 'rejected').length}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('applicationManagement.stats.rejected')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="space-y-3">
                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={t('applicationManagement.search.placeholder')}
                                    value={searchTermApp}
                                    onChange={(e) => setSearchTermApp(e.target.value)}
                                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <select 
                                    value={selectedProgram}
                                    onChange={(e) => setSelectedProgram(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('applicationManagement.search.allPrograms')}</option>
                                    <option value="webDevelopment">{t('programs.webDevelopment')}</option>
                                    <option value="dataScience">{t('programs.dataScience')}</option>
                                    <option value="cybersecurity">{t('programs.cybersecurity')}</option>
                                    <option value="cloudComputing">{t('programs.cloudComputing')}</option>
                                    <option value="aiMachineLearning">{t('programs.aiMachineLearning')}</option>
                                </select>
                                <select 
                                    value={selectedAppStatus}
                                    onChange={(e) => setSelectedAppStatus(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('applicationManagement.search.allStatus')}</option>
                                    <option value="pending">{t('status.pending')}</option>
                                    <option value="approved">{t('status.approved')}</option>
                                    <option value="under_review">{t('status.underReview')}</option>
                                    <option value="rejected">{t('status.rejected')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* View Application Modal */}
            {showViewApplicationModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300`}>
                        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 bg-inherit`}>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center`}>
                                <span className="mr-2">👁️</span>
                                {t('applicationManagement.modals.viewApplication.title')}
                            </h3>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                onClick={() => {
                                    setShowViewApplicationModal(false);
                                    setSelectedApplication(null);
                                }}
                            >
                                <span className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-xl`}>✕</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
                                        👤 {t('applicationManagement.modals.viewApplication.personalInfo')}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('applicationManagement.modals.viewApplication.fields.fullName')}</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {selectedApplication.firstName} {selectedApplication.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('applicationManagement.modals.viewApplication.fields.email')}</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.email}</p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('applicationManagement.modals.viewApplication.fields.phone')}</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.phone}</p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('applicationManagement.modals.viewApplication.fields.dateOfBirth')}</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {selectedApplication.dateOfBirth ? new Date(selectedApplication.dateOfBirth).toLocaleDateString() : t('applicationManagement.modals.viewApplication.notProvided')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
                                        📍 {t('applicationManagement.modals.viewApplication.contactInfo')}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Address</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.address || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>City</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.city || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Country</label>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.country || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                            {/* Academic Information */}
                            <div className="space-y-4">
                                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
                                    🎓 {t('applicationManagement.modals.viewApplication.academicInfo')}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* <div>
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Program Interested</label>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>{selectedApplication.programInterested}</p>
                                    </div> */}
                                    {/* // In your view application modal, update this part: */}
                                    <div>
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('applicationManagement.modals.viewApplication.fields.programInterested')}</label>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>
                                            {(() => {
                                                const program = selectedApplication.program;
                                                // Try different variations of the program name
                                                const variations = [
                                                    program, // Original
                                                    program?.replace(/\s+/g, ''), // Remove spaces
                                                    program?.replace(/\s+/g, '').replace(/[&]/g, ''), // Remove spaces and &
                                                    program?.toLowerCase().replace(/\s+/g, ''), // Lowercase no spaces
                                                    program?.charAt(0).toLowerCase() + program?.slice(1).replace(/\s+/g, ''), // camelCase
                                                ];
                                                
                                                for (const variation of variations) {
                                                    if (variation) {
                                                        const translatedProgram = t(`programs.${variation}`, { defaultValue: null });
                                                        if (translatedProgram && translatedProgram !== `programs.${variation}`) {
                                                            return translatedProgram;
                                                        }
                                                    }
                                                }
                                                return program; // Fallback to original
                                            })()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Education Level</label>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedApplication.educationLevel || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
            
                            {/* Additional Information */}
                            {selectedApplication.personalStatement && (
                                <div className="space-y-4">
                                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
                                        📝 Personal Statement
                                    </h4>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap`}>
                                            {selectedApplication.personalStatement}
                                        </p>
                                    </div>
                                </div>
                            )}
            
                            {/* Application Status and Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Application Status</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                        selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedApplication.status ? (t(`status.${selectedApplication.status}`) || selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)) : t('status.pending')}
                                    </span>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Submitted On</label>
                                    <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {new Date(selectedApplication.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Application ID</label>
                                    <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-mono text-sm`}>
                                        {selectedApplication._id?.slice(-8) || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className={`flex justify-end space-x-3 p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button 
                                onClick={() => handleSendMessage(selectedApplication)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                📧 {t('applicationManagement.modals.viewApplication.sendMessage')}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowViewApplicationModal(false);
                                    setSelectedApplication(null);
                                }}
                                className={`px-4 py-2 border rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                {t('applicationManagement.modals.viewApplication.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Delete Application Confirmation Modal */}
            {showDeleteApplicationConfirm && applicationToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-md mx-4 transition-colors duration-300`}>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <span className="text-red-600 text-2xl">⚠️</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                                    {t('applicationManagement.modals.deleteConfirm.title')}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
                                    {t('applicationManagement.modals.deleteConfirm.message', {
                                        firstName: applicationToDelete.firstName,
                                        lastName: applicationToDelete.lastName,
                                        program: (() => {
                                            const program = applicationToDelete.programInterested || applicationToDelete.program;
                                            // Try different variations of the program name for translation
                                            const variations = [
                                                program, // Original
                                                program?.replace(/\s+/g, ''), // Remove spaces
                                                program?.replace(/\s+/g, '').replace(/[&]/g, ''), // Remove spaces and &
                                                program?.toLowerCase().replace(/\s+/g, ''), // Lowercase no spaces
                                                program?.charAt(0).toLowerCase() + program?.slice(1).replace(/\s+/g, ''), // camelCase
                                            ];
                                            
                                            for (const variation of variations) {
                                                if (variation) {
                                                    const translatedProgram = t(`programs.${variation}`, { defaultValue: null });
                                                    if (translatedProgram && translatedProgram !== `programs.${variation}`) {
                                                        return translatedProgram;
                                                    }
                                                }
                                            }
                                            return program; // Fallback to original
                                        })()
                                    })}
                                    <br />
                                    <span className="text-red-500 font-medium">{t('applicationManagement.modals.deleteConfirm.warning')}</span>
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteApplicationConfirm(false);
                                        setApplicationToDelete(null);
                                    }}
                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {t('applicationManagement.modals.deleteConfirm.cancel')}
                                </button>
                                <button
                                    onClick={confirmDeleteApplication}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    🗑️ {t('applicationManagement.modals.deleteConfirm.delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
                {/* //Send Message Modal */}
            {showSendMessageModal && messageData.recipient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-2xl transition-colors duration-300`}>
                        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center`}>
                                <span className="mr-2">📧</span>
                                {t('applicationManagement.modals.sendMessage.title', {
                                    firstName: messageData.recipient.firstName,
                                    lastName: messageData.recipient.lastName
                                })}
                            </h3>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                onClick={() => {
                                    setShowSendMessageModal(false);
                                    setMessageData({
                                        subject: '',
                                        message: '',
                                        recipient: null
                                    });
                                }}
                            >
                                <span className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-xl`}>✕</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSendMessageSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('applicationManagement.modals.sendMessage.fields.to')}</label>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {messageData.recipient.firstName} {messageData.recipient.lastName} ({messageData.recipient.email})
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('applicationManagement.modals.sendMessage.fields.subject')}</label>
                                    <input
                                        type="text"
                                        value={messageData.subject}
                                        onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('applicationManagement.modals.sendMessage.fields.message')}</label>
                                    <textarea
                                        rows="8"
                                        value={messageData.message}
                                        onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                                        placeholder={t('applicationManagement.modals.sendMessage.placeholder')}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                        required
                                    />
                                </div>
                                
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setShowSendMessageModal(false);
                                            setMessageData({
                                                subject: '',
                                                message: '',
                                                recipient: null
                                            });
                                        }}
                                    >
                                        {t('applicationManagement.modals.sendMessage.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        📧 {t('applicationManagement.modals.sendMessage.send')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Clean Applications Table */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            } rounded-xl shadow-sm border overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className={`${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600' 
                                    : 'bg-gray-50 border-gray-200'
                            } border-b`}>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.applicant')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.contact')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.program')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.status')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.submitted')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                } uppercase tracking-wider`}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                        <span>{t('applicationManagement.table.headers.actions')}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${
                            isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                        } divide-y`}>
                            {getCurrentPageApplications().map((application, index) => (
                                <tr key={application._id} className={`transition-colors ${
                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                } ${application.status === 'pending' ? (
                                    isDarkMode 
                                        ? 'bg-orange-900 bg-opacity-20 border-l-4 border-orange-500' 
                                        : 'bg-orange-50 border-l-4 border-orange-400'
                                ) : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                    {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 ${
                                                    isDarkMode ? 'border-gray-800' : 'border-white'
                                                } rounded-full ${
                                                    application.status === 'approved' ? 'bg-green-400' : 
                                                    application.status === 'rejected' ? 'bg-red-400' : 'bg-orange-400'
                                                }`}></div>
                                            </div>
                                            <div>
                                                <div className={`text-sm font-semibold ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {application.firstName} {application.lastName}
                                                </div>
                                                <div className={`text-xs ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    ID: {application._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className={`text-sm ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>{application.email}</div>
                                            {application.phone && (
                                                <div className={`text-xs ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                } flex items-center`}>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {application.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                                                isDarkMode 
                                                    ? 'bg-indigo-900 bg-opacity-50 text-indigo-300 border border-indigo-700' 
                                                    : 'bg-indigo-100 text-indigo-800'
                                            }`}>
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                {(() => {
                                                    const program = application.program;
                                                    // Try different variations of the program name
                                                    const variations = [
                                                        program, // Original
                                                        program?.replace(/\s+/g, ''), // Remove spaces
                                                        program?.replace(/\s+/g, '').replace(/[&]/g, ''), // Remove spaces and &
                                                        program?.toLowerCase().replace(/\s+/g, ''), // Lowercase no spaces
                                                        program?.charAt(0).toLowerCase() + program?.slice(1).replace(/\s+/g, ''), // camelCase
                                                    ];
                                                    
                                                    for (const variation of variations) {
                                                        if (variation) {
                                                            const translatedProgram = t(`programs.${variation}`, { defaultValue: null });
                                                            if (translatedProgram && translatedProgram !== `programs.${variation}`) {
                                                                return translatedProgram;
                                                            }
                                                        }
                                                    }
                                                    return program; // Fallback to original
                                                })()}
                                            </span>
                                            <div className={`text-xs ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                Start Date: {new Date(application.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                                application.status === 'approved' ? (
                                                    isDarkMode 
                                                        ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700' 
                                                        : 'bg-green-100 text-green-800'
                                                ) : application.status === 'rejected' ? (
                                                    isDarkMode 
                                                        ? 'bg-red-900 bg-opacity-50 text-red-300 border border-red-700' 
                                                        : 'bg-red-100 text-red-800'
                                                ) : application.status === 'under_review' ? (
                                                    isDarkMode 
                                                        ? 'bg-blue-900 bg-opacity-50 text-blue-300 border border-blue-700' 
                                                        : 'bg-blue-100 text-blue-800'
                                                ) : (
                                                    isDarkMode 
                                                        ? 'bg-orange-900 bg-opacity-50 text-orange-300 border border-orange-700' 
                                                        : 'bg-orange-100 text-orange-800'
                                                )
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    application.status === 'approved' ? 'bg-green-400' : 
                                                    application.status === 'rejected' ? 'bg-red-400' : 
                                                    application.status === 'under_review' ? 'bg-blue-400' : 'bg-orange-400'
                                                }`}></span>
                                                {(() => {
                                                    const status = application.status;
                                                    // Try different variations of the status
                                                    const variations = [
                                                        status, // Original
                                                        status?.toLowerCase(), // Lowercase
                                                        status?.toUpperCase(), // Uppercase  
                                                        status?.replace('_', ''), // Remove underscores
                                                        status?.replace('_', ' '), // Replace underscore with space
                                                        status?.charAt(0).toUpperCase() + status?.slice(1), // Capitalize first
                                                    ];
                                                    
                                                    for (const variation of variations) {
                                                        if (variation) {
                                                            const translatedStatus = t(`status.${variation}`, { defaultValue: null });
                                                            if (translatedStatus && translatedStatus !== `status.${variation}`) {
                                                                return translatedStatus;
                                                            }
                                                        }
                                                    }
                                                    return status?.replace('_', ' ').toUpperCase() || t('status.pending'); // Fallback
                                                })()}
                                            </span>
                                            {application.status === 'pending' && (
                                                <div className={`text-xs font-medium flex items-center ${
                                                    isDarkMode ? 'text-orange-300' : 'text-orange-600'
                                                }`}>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    {t('common.needsReview')}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        <div className="space-y-1">
                                            <div className={`font-medium ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                                {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(application.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? t('userManagement.time.today') : t('userManagement.time.daysAgo', { days });
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {/* View Application */}
                                            <button 
                                                className={`p-2 border border-transparent rounded-lg text-blue-600 ${
                                                    isDarkMode ? 'hover:bg-blue-900 hover:bg-opacity-30' : 'hover:bg-blue-100'
                                                } transition-colors`}
                                                onClick={() => handleViewApplication(application)}
                                                title={t('applicationManagement.table.actions.viewDetails')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            
                                            {/* Send Message */}
                                            <button 
                                                className={`p-2 border border-transparent rounded-lg text-green-600 ${
                                                    isDarkMode ? 'hover:bg-green-900 hover:bg-opacity-30' : 'hover:bg-green-100'
                                                } transition-colors`}
                                                onClick={() => handleSendMessage(application)}
                                                title={t('applicationManagement.table.actions.sendMessage')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            
                                            {/* Delete Application */}
                                            <button 
                                                className={`p-2 border border-transparent rounded-lg text-red-600 ${
                                                    isDarkMode ? 'hover:bg-red-900 hover:bg-opacity-30' : 'hover:bg-red-100'
                                                } transition-colors`}
                                                onClick={() => handleDeleteApplication(application)}
                                                title={t('applicationManagement.table.actions.delete')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            
                                            {/* Status Update Dropdown */}
                                            <div className="relative group">
                                                <button className={`p-2 border border-transparent rounded-lg ${
                                                    isDarkMode 
                                                        ? 'text-gray-400 hover:bg-gray-700 hover:bg-opacity-50' 
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                } transition-colors`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                                <div className={`absolute right-0 mt-2 w-48 ${
                                                    isDarkMode 
                                                        ? 'bg-gray-800 border-gray-700' 
                                                        : 'bg-white border-gray-200'
                                                } rounded-lg shadow-lg border z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                                                    <div className="py-1">
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm ${
                                                                isDarkMode 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            } transition-colors`}
                                                            onClick={() => handleUpdateApplicationStatus(application._id, 'approved')}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {t('applicationManagement.table.actions.approve')}
                                                        </button>
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm ${
                                                                isDarkMode 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            } transition-colors`}
                                                            onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            {t('applicationManagement.table.actions.reject')}
                                                        </button>
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm ${
                                                                isDarkMode 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            } transition-colors`}
                                                            onClick={() => handleUpdateApplicationStatus(application._id, 'pending')}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {t('actions.markPending')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
                <div className={`${isDarkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-3 flex items-center justify-between border-t transition-colors duration-300`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        {t('applicationManagement.pagination.showing')} {((currentApplicationPage - 1) * itemsPerPage) + 1}-{Math.min(currentApplicationPage * itemsPerPage, getFilteredApplications().length)} {t('applicationManagement.pagination.of')} {getFilteredApplications().length} {t('applicationManagement.pagination.results')}
                        {(searchTermApp || selectedProgram || selectedAppStatus) && (
                            <span className={`ml-2 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`}>
                                {t('applicationManagement.pagination.filtered')}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentApplicationPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentApplicationPage === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                currentApplicationPage === 1
                                    ? (isDarkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-100 cursor-not-allowed')
                                    : (isDarkMode 
                                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300')
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {(() => {
                                const totalPages = getApplicationTotalPages();
                                const pages = [];
                                const maxVisiblePages = 5;
                                
                                if (totalPages <= maxVisiblePages) {
                                    for (let i = 1; i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    const startPage = Math.max(1, currentApplicationPage - 2);
                                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                                    
                                    if (startPage > 1) {
                                        pages.push(1);
                                        if (startPage > 2) pages.push('...');
                                    }
                                    
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(i);
                                    }
                                    
                                    if (endPage < totalPages) {
                                        if (endPage < totalPages - 1) pages.push('...');
                                        pages.push(totalPages);
                                    }
                                }
                                
                                return pages.map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className={`px-3 py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentApplicationPage(page)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                currentApplicationPage === page
                                                    ? (isDarkMode 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-blue-600 text-white')
                                                    : (isDarkMode 
                                                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300')
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ));
                            })()}
                        </div>
                        
                        <button
                            onClick={() => setCurrentApplicationPage(prev => Math.min(prev + 1, getApplicationTotalPages()))}
                            disabled={currentApplicationPage === getApplicationTotalPages()}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                currentApplicationPage === getApplicationTotalPages()
                                    ? (isDarkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-100 cursor-not-allowed')
                                    : (isDarkMode 
                                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300')
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContactManagement = () => {
        // Pagination calculations
        const filteredContacts = getFilteredContacts();
        const startIndex = (contactCurrentPage - 1) * contactItemsPerPage;
        const endIndex = startIndex + contactItemsPerPage;
        const paginatedContacts = filteredContacts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredContacts.length / contactItemsPerPage);

        return (
            <div className="space-y-6">
                {/* Clean Header Section */}
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                } rounded-xl p-6 border shadow-sm`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Title and Stats Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${
                                    isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                                } rounded-lg flex items-center justify-center`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('contactManagement.title')}
                                    </h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                        Manage and respond to contact messages
                                    </p>
                                </div>
                            </div>
                            
                            {/* Clean Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className={`${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {contactSubmissions.length}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Total Messages
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xl font-semibold text-orange-600">
                                                {contactSubmissions.filter(contact => contact.status === 'pending').length}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Pending
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xl font-semibold text-green-600">
                                                {contactSubmissions.filter(contact => contact.status === 'resolved').length}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Resolved
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xl font-semibold text-blue-600">
                                                {contactSubmissions.filter(contact => contact.status === 'approved').length}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Priority
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="space-y-3">
                            {/* Search and Filter Controls */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search messages..."
                                        value={searchTermContact}
                                        onChange={(e) => setSearchTermContact(e.target.value)}
                                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                        }`}
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <select 
                                        value={selectedCategory} 
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="general">General</option>
                                        <option value="admissions">Admission</option>
                                        <option value="courses">Course Information</option>
                                        <option value="careers">Career Services</option>
                                        <option value="others">Others</option>
                                    </select>
                                    <select 
                                        value={selectedContactStatus}
                                        onChange={(e) => setSelectedContactStatus(e.target.value)}
                                        className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Priority</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="ignored">Ignored</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clean Table Section */}
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                } rounded-xl border shadow-sm overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={`${
                                isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                            } transition-colors`}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                        Contact
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                        Message
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                        Date
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`${
                                isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                            } transition-colors`}>
                                {paginatedContacts.map((contact, index) => (
                                    <tr key={contact._id} className={`${
                                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    } transition-colors ${
                                        contact.status === 'pending' ? (
                                            isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
                                        ) : ''
                                    }`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                                        {contact.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 ${
                                                        isDarkMode ? 'border-gray-800' : 'border-white'
                                                    } rounded-full ${
                                                        contact.status === 'pending' ? 'bg-orange-400' : 
                                                        contact.status === 'resolved' ? 'bg-green-400' : 
                                                        contact.status === 'approved' ? 'bg-blue-400' : 'bg-gray-400'
                                                    }`}></div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className={`text-sm font-medium ${
                                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                    }`}>
                                                        {contact.name}
                                                    </div>
                                                    <div className={`text-xs ${
                                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                        {contact.email}
                                                    </div>
                                                    {contact.phone && (
                                                        <div className={`text-xs ${
                                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                            {contact.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className={`text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {contact.subject}
                                                </div>
                                                <div className={`text-sm ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                } max-w-xs`}>
                                                    <div className={`p-2 rounded-lg ${
                                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                                    }`}>
                                                        {contact.message.length > 60 ? 
                                                            `${contact.message.substring(0, 60)}...` : 
                                                            contact.message
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                value={contact.status}
                                                onChange={(e) => handleContactAction(contact._id, e.target.value)}
                                                className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer ${
                                                    contact.status === 'pending' ? 
                                                        (isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800') : 
                                                    contact.status === 'approved' ? 
                                                        (isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800') : 
                                                    contact.status === 'resolved' ? 
                                                        (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800') : 
                                                        (isDarkMode ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800')
                                                }`}
                                                style={{
                                                    appearance: 'none',
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: 'right 0.5rem center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '1rem 1rem',
                                                    paddingRight: '2rem',
                                                    paddingLeft: '0.75rem',
                                                    paddingTop: '0.375rem',
                                                    paddingBottom: '0.375rem'
                                                }}
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="approved">🔥 Priority</option>
                                                <option value="resolved">✅ Resolved</option>
                                                <option value="ignored">❌ Ignored</option>
                                            </select>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            <div className="space-y-1">
                                                <div className={`font-medium ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs">
                                                    {(() => {
                                                        const days = Math.floor((Date.now() - new Date(contact.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                        return days === 0 ? 'Today' : `${days} days ago`;
                                                    })()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isDarkMode 
                                                            ? 'text-blue-400 hover:bg-blue-900/30' 
                                                            : 'text-blue-600 hover:bg-blue-100'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setShowContactModal(true);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isDarkMode 
                                                            ? 'text-purple-400 hover:bg-purple-900/30' 
                                                            : 'text-purple-600 hover:bg-purple-100'
                                                    }`}
                                                    onClick={() => {
                                                        setReplyData({
                                                            subject: `Re: ${contact.subject}`,
                                                            message: '',
                                                            recipient: contact
                                                        });
                                                        setShowReplyModal(true);
                                                    }}
                                                    title="Reply"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isDarkMode 
                                                            ? 'text-red-400 hover:bg-red-900/30' 
                                                            : 'text-red-600 hover:bg-red-100'
                                                    }`}
                                                    onClick={() => {
                                                        setContactToDelete(contact);
                                                        setShowDeleteContactModal(true);
                                                    }}
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className={`${
                        isDarkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'
                    } px-6 py-3 flex items-center justify-between border-t`}>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} results
                            {(searchTermContact || selectedCategory || selectedContactStatus) && (
                                <span className={`ml-2 font-medium ${
                                    isDarkMode ? 'text-purple-400' : 'text-purple-600'
                                }`}>
                                    (filtered)
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                                    contactCurrentPage === 1 
                                        ? (isDarkMode 
                                            ? 'border-gray-600 text-gray-500 bg-gray-800 cursor-not-allowed' 
                                            : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed')
                                        : (isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50')
                                }`}
                                onClick={() => setContactCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={contactCurrentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    const isActive = page === contactCurrentPage;
                                    return (
                                        <button
                                            key={page}
                                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                                isActive
                                                    ? 'bg-purple-600 text-white'
                                                    : (isDarkMode 
                                                        ? 'border border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50')
                                            }`}
                                            onClick={() => setContactCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button 
                                className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                                    contactCurrentPage === totalPages 
                                        ? (isDarkMode 
                                            ? 'border-gray-600 text-gray-500 bg-gray-800 cursor-not-allowed' 
                                            : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed')
                                        : (isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50')
                                }`}
                                onClick={() => setContactCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={contactCurrentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Detail Modal */}
                {showContactModal && selectedContact && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className={`${
                            isDarkMode 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } rounded-lg shadow-xl border w-full max-w-2xl`}>
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Contact Message Details
                                        </h3>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            From {selectedContact.name}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    className={`p-2 rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => {
                                        setShowContactModal(false);
                                        setSelectedContact(null);
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Name
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            {selectedContact.name}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Email
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            {selectedContact.email}
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedContact.phone && (
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Phone
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            {selectedContact.phone}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Subject
                                    </label>
                                    <div className={`p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}>
                                        {selectedContact.subject}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Message
                                    </label>
                                    <div className={`p-4 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } max-h-48 overflow-y-auto`}>
                                        {selectedContact.message}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Status
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                selectedContact.status === 'pending' ? 
                                                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : 
                                                selectedContact.status === 'approved' ? 
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                                                selectedContact.status === 'resolved' ? 
                                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {selectedContact.status === 'pending' ? 'Pending' : 
                                                selectedContact.status === 'approved' ? 'Priority' : 
                                                selectedContact.status === 'resolved' ? 'Resolved' : 'Ignored'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Received
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            {new Date(selectedContact.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className={`flex justify-end space-x-3 p-6 border-t ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <button 
                                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setShowContactModal(false);
                                        setSelectedContact(null);
                                    }}
                                >
                                    Close
                                </button>
                                {selectedContact.status === 'pending' && (
                                    <>
                                        <button 
                                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                                            onClick={() => {
                                                handleContactAction(selectedContact._id, 'resolved');
                                                setShowContactModal(false);
                                                setSelectedContact(null);
                                            }}
                                        >
                                            Mark as Resolved
                                        </button>
                                        <button 
                                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            onClick={() => {
                                                handleContactAction(selectedContact._id, 'approved');
                                                setShowContactModal(false);
                                                setSelectedContact(null);
                                            }}
                                        >
                                            Mark as Priority
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reply Modal */}
                {showReplyModal && replyData.recipient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className={`${
                            isDarkMode 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } rounded-lg shadow-xl border w-full max-w-2xl`}>
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Reply to Contact
                                        </h3>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Send a response to {replyData.recipient.name}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    className={`p-2 rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => {
                                        setShowReplyModal(false);
                                        setReplyData({ subject: '', message: '', recipient: null });
                                        setIsSendingReply(false);
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                                <form onSubmit={handleReplySubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            To
                                        </label>
                                        <div className={`p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                        } border`}>
                                            <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {replyData.recipient.name} ({replyData.recipient.email})
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter reply subject"
                                            value={replyData.subject}
                                            onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Message
                                        </label>
                                        <textarea
                                            rows="6"
                                            placeholder="Type your reply message here..."
                                            value={replyData.message}
                                            onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    
                                    <div className={`flex justify-end space-x-3 pt-4 border-t ${
                                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <button 
                                            type="button" 
                                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                                isDarkMode 
                                                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                            }`}
                                            onClick={() => {
                                                setShowReplyModal(false);
                                                setReplyData({ subject: '', message: '', recipient: null });
                                                setIsSendingReply(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSendingReply}
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSendingReply ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                    </svg>
                                                    Send Reply
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteContactModal && contactToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className={`${
                            isDarkMode 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } rounded-lg shadow-xl border w-full max-w-md`}>
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Delete Contact Message
                                        </h3>
                                    </div>
                                </div>
                                <button 
                                    className={`p-2 rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => {
                                        setShowDeleteContactModal(false);
                                        setContactToDelete(null);
                                        setIsDeleting(false);
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-lg font-medium ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        } mb-2`}>
                                            Are you sure you want to delete this contact message?
                                        </h4>
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        } space-y-2`}>
                                            <p><strong>From:</strong> {contactToDelete.name} ({contactToDelete.email})</p>
                                            <p><strong>Subject:</strong> {contactToDelete.subject}</p>
                                            <p className="text-red-600 dark:text-red-400 font-medium">
                                                This action cannot be undone. The contact message will be permanently deleted.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className={`flex justify-end space-x-3 p-6 border-t ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <button 
                                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setShowDeleteContactModal(false);
                                        setContactToDelete(null);
                                        setIsDeleting(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isDeleting}
                                    onClick={async () => {
                                        const token = getToken();
                                        setIsDeleting(true);
                                        
                                        try {
                                            console.log('Deleting contact:', contactToDelete._id);
                                            
                                            const response = await fetch(`${API_BASE_URL}/api/contact/${contactToDelete._id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/json'
                                                }
                                            });

                                            if (response.ok) {
                                                const result = await response.json();
                                                console.log('Contact deleted successfully:', result);
                                                
                                                // Show success message
                                                const successMessage = currentLanguage === 'ja' 
                                                    ? `削除完了！\n\n${contactToDelete.name}さんからのメッセージが正常に削除されました。` 
                                                    : `Contact Deleted!\n\nMessage from ${contactToDelete.name} has been deleted successfully.`;
                                                alert(successMessage);
                                                
                                                // Close the modal
                                                setShowDeleteContactModal(false);
                                                setContactToDelete(null);
                                                
                                                // Refresh the contacts list to reflect the deletion
                                                const authToken = getToken();
                                                if (authToken) {
                                                    await fetchContactSubmissions(authToken);
                                                }
                                            } else {
                                                const errorData = await response.json();
                                                throw new Error(errorData.message || 'Failed to delete contact');
                                            }
                                        } catch (error) {
                                            console.error('Error deleting contact:', error);
                                            
                                            // Show error message
                                            const errorMessage = currentLanguage === 'ja' 
                                                ? 'エラー！ メッセージの削除に失敗しました。もう一度お試しください。' 
                                                : 'Error! Failed to delete the contact message. Please try again.';
                                            alert(errorMessage);
                                        } finally {
                                            setIsDeleting(false);
                                        }
                                    }}
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ✅ Enhanced Admin Dashboard with Ant Design and Sidebar
    const renderAdminDashboard = () => {
        const { Sider, Header, Content } = Layout;
        const { Title } = Typography;
        
        const handleTabTransition = (newTab) => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveTab(newTab);
                setIsTransitioning(false);
            }, 150);
        };
    
        // Enhanced breadcrumb navigation with new sections
        const getBreadcrumb = () => {
            const breadcrumbs = {
                overview: 'Dashboard Overview',
                'all-users': 'User Management',
                'pending-users': 'Pending User Approval',
                applications: 'Application Management', 
                contacts: 'Contact Management',
                materials: 'Course Materials',
                quizzes: 'Quiz Engine',
                listening: 'Listening Exercises',
                homework: 'Homework System',
                analytics: 'Student Analytics',
                settings: 'System Settings'
            };
            return breadcrumbs[activeTab] || 'Dashboard';
        };

        // Sidebar menu items with icons
        const menuItems = [
            {
                key: 'overview',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: 'users',
                icon: <TeamOutlined />,
                label: 'Users',
                children: [
                    { key: 'all-users', label: 'All Users' },
                    { key: 'pending-users', label: 'Pending Approval' }
                ]
            },
            {
                key: 'academic',
                icon: <BookOutlined />,
                label: 'Academic',
                children: [
                    { key: 'materials', label: 'Course Materials' },
                    { key: 'quizzes', label: 'Quiz Engine' },
                    { key: 'listening', label: 'Listening Exercises' },
                    { key: 'homework', label: 'Homework System' }
                ]
            },
            {
                key: 'applications',
                icon: <FileTextOutlined />,
                label: 'Applications',
            },
            {
                key: 'contacts',
                icon: <MailOutlined />,
                label: 'Messages',
            },
            {
                key: 'analytics',
                icon: <BarChartOutlined />,
                label: 'Analytics',
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Settings',
            }
        ];
    
        return (
            <Layout 
                className={isDarkMode ? 'dark-mode' : ''}
                style={{ 
                    minHeight: '100vh', 
                    backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                }}>
                {/* Enhanced Awesome Sidebar */}
                <Sider 
                    collapsible 
                    collapsed={adminSidebarCollapsed} 
                    onCollapse={setAdminSidebarCollapsed}
                    trigger={null} // Disable default trigger
                    style={{
                        background: isDarkMode 
                            ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
                            : 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
                        borderRadius: '20px',
                        margin: '12px',
                        height: 'calc(100vh - 24px)',
                        overflow: 'hidden',
                        boxShadow: isDarkMode 
                            ? '0 25px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 25px 50px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                    }}
                    width={300}
                    collapsedWidth={85}
                >
                    {/* Enhanced Logo/Brand Section */}
                    <div style={{ 
                        padding: adminSidebarCollapsed ? '20px 12px' : '32px 24px', 
                        textAlign: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Animated background elements */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            animation: 'rotate 20s linear infinite',
                        }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{
                                width: adminSidebarCollapsed ? '40px' : '60px',
                                height: adminSidebarCollapsed ? '40px' : '60px',
                                margin: '0 auto 16px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: adminSidebarCollapsed ? '20px' : '28px',
                                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                transform: 'translateY(0)',
                                transition: 'all 0.3s ease'
                            }}>
                                📚
                            </div>
                            
                            {!adminSidebarCollapsed && (
                                <>
                                    <Title level={3} style={{ 
                                        color: 'white', 
                                        margin: '0 0 8px 0',
                                        fontWeight: 800,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '22px'
                                    }}>
                                        Forum Academy
                                    </Title>
                                    <div style={{ 
                                        color: 'rgba(255,255,255,0.85)', 
                                        fontSize: '13px', 
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        padding: '4px 12px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'inline-block'
                                    }}>
                                        ⚡ Admin Portal
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Navigation Menu */}
                    <div style={{ 
                        padding: adminSidebarCollapsed ? '12px 8px' : '20px 16px',
                        height: 'calc(100% - 200px)',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.3) transparent'
                    }}>
                        <Menu
                            mode="inline"
                            selectedKeys={[activeTab]}
                            items={menuItems}
                            onClick={({ key }) => handleTabTransition(key)}
                            style={{
                                background: 'transparent !important',
                                backgroundColor: 'transparent !important',
                                border: 'none',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 500,
                                '--ant-menu-bg': 'transparent',
                                '--ant-menu-item-bg': 'transparent',
                                '--ant-menu-submenu-bg': 'transparent'
                            }}
                            theme="dark"
                            className="enhanced-admin-menu"
                        />
                        
                        {/* Quick Stats Mini Cards */}
                        {!adminSidebarCollapsed && (
                            <div style={{ marginTop: '24px', space: '16px' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.15)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 500 }}>
                                            System Health
                                        </div>
                                        <div style={{ 
                                            color: '#10b981', 
                                            fontSize: '14px', 
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                background: '#10b981',
                                                borderRadius: '50%',
                                                animation: 'pulse 2s infinite'
                                            }}></div>
                                            98%
                                        </div>
                                    </div>
                                    <div style={{
                                        height: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        marginTop: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: '98%',
                                            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                                            borderRadius: '2px',
                                            transition: 'width 1s ease-out'
                                        }}></div>
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.15)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ 
                                            color: 'rgba(255,255,255,0.8)', 
                                            fontSize: '12px', 
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{ fontSize: '14px' }}>👥</span>
                                            Online Users
                                        </div>
                                        <div style={{ 
                                            color: 'white', 
                                            fontSize: '16px', 
                                            fontWeight: 700
                                        }}>
                                            247
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Admin Profile Section - Always visible at bottom */}
                    <div 
                        className={`${isMobile ? 'admin-profile-mobile' : 'admin-profile-section'}`}
                        style={{
                            padding: adminSidebarCollapsed && !isMobile ? '12px 8px' : isMobile ? '12px 16px' : '16px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: isMobile ? '0' : '16px',
                            color: 'white',
                            backdropFilter: 'blur(15px)',
                            border: isMobile ? 'none' : '2px solid rgba(255,255,255,0.3)',
                            borderTop: isMobile ? '2px solid rgba(255,255,255,0.3)' : undefined,
                            boxShadow: isMobile 
                                ? '0 -8px 32px rgba(0,0,0,0.3), 0 -4px 16px rgba(0,0,0,0.2)' 
                                : '0 12px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                            minHeight: adminSidebarCollapsed && !isMobile ? '80px' : isMobile ? '70px' : '120px',
                            display: 'flex',
                            flexDirection: isMobile ? 'row' : 'column',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'center' : 'stretch',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                        {/* Top Section - Admin User Info */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: adminSidebarCollapsed ? '0' : '12px',
                            justifyContent: adminSidebarCollapsed ? 'center' : 'flex-start',
                            marginBottom: adminSidebarCollapsed ? '8px' : '12px',
                            flexWrap: adminSidebarCollapsed ? 'wrap' : 'nowrap'
                        }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar 
                                    size={adminSidebarCollapsed ? 32 : 40}
                                    style={{ 
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        color: 'white',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                                    }}
                                    icon={<UserOutlined />}
                                />
                                {/* Online status indicator */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: adminSidebarCollapsed ? '8px' : '10px',
                                    height: adminSidebarCollapsed ? '8px' : '10px',
                                    background: '#10b981',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                            </div>
                            
                            {!adminSidebarCollapsed && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        fontWeight: 700,
                                        marginBottom: '2px',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                        {user?.firstName && user?.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : 'Admin User'}
                                    </div>
                                    <div style={{ 
                                        fontSize: '11px', 
                                        opacity: 0.85,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span style={{ fontSize: '10px' }}>👑</span>
                                        Administrator
                                    </div>
                                </div>
                            )}
                            
                            {!adminSidebarCollapsed && (
                                <Button
                                    type="text"
                                    icon={<SettingOutlined />}
                                    style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        border: 'none',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setActiveTab('settings')}
                                />
                            )}
                        </div>

                        {/* Bottom Section - Combined Collapse/Toggle Button */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Enhanced Combined Collapse/Toggle Button */}
                            <Button
                                type="text"
                                className="awesome-collapse-trigger"
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    border: '2px solid rgba(255,255,255,0.25)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%)',
                                    borderRadius: adminSidebarCollapsed ? '12px' : '16px',
                                    width: adminSidebarCollapsed ? '40px' : '100%',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: adminSidebarCollapsed ? 'center' : 'space-between',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: '16px',
                                    backdropFilter: 'blur(15px)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    padding: adminSidebarCollapsed ? '0' : '8px 12px'
                                }}
                                onClick={() => setAdminSidebarCollapsed(!adminSidebarCollapsed)}
                            >
                                {/* Toggle Switch Component */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: adminSidebarCollapsed ? '0' : '8px',
                                    width: adminSidebarCollapsed ? 'auto' : '100%',
                                    justifyContent: adminSidebarCollapsed ? 'center' : 'space-between'
                                }}>
                                    {/* Switch Visual */}
                                    <div style={{
                                        width: adminSidebarCollapsed ? '20px' : '28px',
                                        height: adminSidebarCollapsed ? '12px' : '16px',
                                        background: adminSidebarCollapsed 
                                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        borderRadius: '12px',
                                        position: 'relative',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}>
                                        <div style={{
                                            width: adminSidebarCollapsed ? '8px' : '12px',
                                            height: adminSidebarCollapsed ? '8px' : '12px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '2px',
                                            left: adminSidebarCollapsed ? '2px' : '14px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}></div>
                                    </div>

                                    {/* Icon and Text */}
                                    {!adminSidebarCollapsed && !isMobile && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            flex: 1
                                        }}>
                                            <LeftOutlined style={{
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.8)',
                                                transform: adminSidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                            <span style={{ 
                                                fontSize: '12px', 
                                                fontWeight: 600,
                                                opacity: 0.9,
                                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {adminSidebarCollapsed ? 'Expand' : 'Collapse'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Collapsed State Icon */}
                                    {adminSidebarCollapsed && (
                                        <MenuUnfoldOutlined style={{
                                            fontSize: '14px',
                                            marginLeft: '4px',
                                            opacity: 0.9
                                        }} />
                                    )}
                                </div>
                            </Button>
                        </div>
                    </div>


                </Sider>

                <Layout style={{ backgroundColor: 'transparent' }}>
                    {/* Enhanced Header */}
                    <Header style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        margin: '8px 8px 0 0',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <Breadcrumb 
                                style={{ color: 'white' }}
                                items={[
                                    {
                                        title: <HomeOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                                    },
                                    {
                                        title: <span style={{ color: 'rgba(255,255,255,0.8)' }}>Admin Portal</span>
                                    },
                                    {
                                        title: <span style={{ color: 'white', fontWeight: 600 }}>{getBreadcrumb()}</span>
                                    }
                                ]}
                            />
                            <Title level={4} style={{ color: 'white', margin: '8px 0 0 0' }}>
                                {getBreadcrumb()}
                            </Title>
                        </div>
                        
                        {/* Header Actions */}
                        <Space size="middle">
                            {/* Language Toggle */}
                            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '2px' }}>
                                <Button 
                                    type={currentLanguage === 'en' ? 'primary' : 'text'}
                                    size="small"
                                    onClick={() => handleLanguageToggle('en')}
                                    style={{ 
                                        color: currentLanguage === 'en' ? '#667eea' : 'white',
                                        border: 'none',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        height: '24px',
                                        minWidth: '28px'
                                    }}
                                >
                                    EN
                                </Button>
                                <Button 
                                    type={currentLanguage === 'ja' ? 'primary' : 'text'}
                                    size="small"
                                    onClick={() => handleLanguageToggle('ja')}
                                    style={{ 
                                        color: currentLanguage === 'ja' ? '#667eea' : 'white',
                                        border: 'none',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        height: '24px',
                                        minWidth: '28px'
                                    }}
                                >
                                    JA
                                </Button>
                            </div>

                            {/* Dark Mode Toggle */}
                            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '2px' }}>
                                <Button 
                                    type={!isDarkMode ? 'primary' : 'text'}
                                    size="small"
                                    onClick={() => handleThemeToggle('light')}
                                    style={{ 
                                        color: !isDarkMode ? '#667eea' : 'white',
                                        border: 'none',
                                        height: '24px',
                                        minWidth: '28px'
                                    }}
                                >
                                    ☀️
                                </Button>
                                <Button 
                                    type={isDarkMode ? 'primary' : 'text'}
                                    size="small"
                                    onClick={() => handleThemeToggle('dark')}
                                    style={{ 
                                        color: isDarkMode ? '#667eea' : 'white',
                                        border: 'none',
                                        height: '24px',
                                        minWidth: '28px'
                                    }}
                                >
                                    🌙
                                </Button>
                            </div>

                            {/* Status Indicator */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500'
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: '#22c55e',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                                {currentLanguage === 'en' ? 'Online' : 'オンライン'}
                            </div>

                            <Badge count={unreadNotifications}>
                                <Button 
                                    type="text" 
                                    icon={<BellOutlined />} 
                                    style={{ color: 'white' }}
                                    size="large"
                                />
                            </Badge>
                            <Button 
                                type="text" 
                                icon={<SettingOutlined />} 
                                style={{ color: 'white' }}
                                size="large"
                                onClick={() => handleTabTransition('settings')}
                            />
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'profile',
                                            icon: <UserOutlined />,
                                            label: 'Profile Settings',
                                        },
                                        {
                                            key: 'logout',
                                            icon: <ExclamationCircleOutlined />,
                                            label: 'Logout',
                                            onClick: handleLogout
                                        }
                                    ]
                                }}
                            >
                                <Avatar 
                                    style={{ backgroundColor: 'white', color: '#667eea', cursor: 'pointer' }}
                                    icon={<UserOutlined />}
                                />
                            </Dropdown>
                        </Space>
                    </Header>

                    {/* Main Content Area */}
                    <Content style={{
                        margin: '8px 8px 8px 0',
                        padding: '24px',
                        background: isDarkMode ? '#1f1f1f' : '#ffffff',
                        borderRadius: '16px',
                        minHeight: 'calc(100vh - 140px)',
                        overflow: 'auto'
                    }}>
                        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
                            {(() => {
                                switch(activeTab) {
                                    case 'overview':
                                        return renderEnhancedAdminOverview();
                                    case 'all-users':
                                    case 'pending-users':
                                        return renderUserManagement();
                                    case 'materials':
                                        return renderCourseMaterialManagement();
                                    case 'quizzes':
                                        return renderQuizEngine();
                                    case 'listening':
                                        return renderListeningExercises();
                                    case 'homework':
                                        return renderHomeworkSystem();
                                    case 'applications':
                                        return renderApplicationManagement();
                                    case 'contacts':
                                        return renderContactManagement();
                                    case 'analytics':
                                        return renderStudentAnalytics();
                                    case 'settings':
                                        return renderAdminSettings();
                                    default:
                                        return renderEnhancedAdminOverview();
                                }
                            })()}
                        </div>
                    </Content>
                </Layout>

                {/* Floating Action Button - Enhanced */}
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<PlusOutlined />}
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        right: '32px',
                        width: '64px',
                        height: '64px',
                        fontSize: '24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                        zIndex: 1000
                    }}
                    onClick={() => setShowMaterialUploadModal(true)}
                />
            </Layout>
        );
    };

    const renderAdminSettings = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">⚙️</span>
                        Admin Settings
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>
                        Configure system-wide preferences and administrative controls
                    </p>
                </div>
                
                <div className="flex space-x-3">
                    <button className={`inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg transition-colors`}>
                        <span className="mr-2">🔄</span>
                        Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">💾</span>
                        Save All Settings
                    </button>
                </div>
            </div>
    
            {/* Settings Container */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Account Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">👨‍💼</span>
                        Administrator Profile
                    </h3>
                    
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                                <span className="text-sm">📷</span>
                            </button>
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                {user?.firstName && user?.lastName 
                                    ? `${user.firstName} ${user.lastName}` 
                                    : user?.name || 'Administrator'
                                }
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                {user?.email || 'admin@fiainstitute.com'}
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-2">
                                👨‍💼 {user?.role === 'admin' ? 'Super Admin' : 'Administrator'}
                            </span>
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue={user?.firstName && user?.lastName 
                                    ? `${user.firstName} ${user.lastName}` 
                                    : user?.name || 'Administrator'
                                }
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue={user?.email || 'admin@fiainstitute.com'}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Admin ID
                            </label>
                            <input
                                type="text"
                                defaultValue="ADM-2024-001"
                                readOnly
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'} rounded-lg transition-all cursor-not-allowed`}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Access Level
                            </label>
                            <select className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}>
                                <option>Super Administrator</option>
                                <option>System Administrator</option>
                                <option>Content Administrator</option>
                                <option>User Administrator</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                defaultValue={user?.phone || '+1 (555) 123-4567'}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Last Login
                            </label>
                            <input
                                type="text"
                                defaultValue={new Date().toLocaleString()}
                                readOnly
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'} rounded-lg transition-all cursor-not-allowed`}
                            />
                        </div>
                    </div>
                </div>
    
                {/* Language Toggle Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🌐</span>
                        Language Settings
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    🗣️
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Interface Language
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Choose your preferred language
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'en' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇺🇸 English
                                </span>
                                <button
                                    onClick={() => {
                                        const newLanguage = currentLanguage === 'en' ? 'ja' : 'en';
                                        handleLanguageToggle(newLanguage);
                                    }}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                        currentLanguage === 'ja' ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            currentLanguage === 'ja' ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'ja' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇯🇵 Japanese
                                </span>
                            </div>
                        </div>
                        
                        {/* Language Change Feedback */}
                        {currentLanguage !== 'en' && (
                            <div className={`mt-4 p-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                            } rounded-xl border transition-all duration-300`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-600 text-2xl">✅</span>
                                    <div>
                                        <h4 className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-900'
                                        } transition-colors duration-300`}>Language Changed</h4>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-700'
                                        } transition-colors duration-300`}>
                                            Interface language has been updated to {currentLanguage === 'ja' ? 'Japanese (日本語)' : 'English'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
    
                        <div className={`mt-4 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Admin Note</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>
                                        Language changes apply to admin interface only. User portal languages are managed separately.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Dark Mode Toggle Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🎨</span>
                        Display Settings
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    {isDarkMode ? '🌙' : '☀️'}
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Dark Mode
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Switch between light and dark themes
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    ☀️ Light
                                </span>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            isDarkMode ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    🌙 Dark
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* System Configuration */}
                <div className="p-8">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🔧</span>
                        System Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* System Preferences */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                System Preferences
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { title: 'Enable automatic backups', desc: 'Daily system backup at 2:00 AM', checked: true },
                                    { title: 'Maintenance mode notifications', desc: 'Alert users before maintenance', checked: true },
                                    { title: 'Debug logging', desc: 'Enhanced logging for troubleshooting', checked: false },
                                    { title: 'Real-time monitoring', desc: 'Live system performance tracking', checked: true }
                                ].map((setting, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} transition-colors duration-300`}>
                                                {setting.title}
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                                {setting.desc}
                                            </div>
                                        </div>
                                        <button
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                                setting.checked ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                                    setting.checked ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        {/* Notification Settings */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                Admin Notifications
                            </h4>
                            <div className="space-y-4">
                                {[
                                    'User Registration Alerts',
                                    'System Error Notifications',
                                    'Security Alerts',
                                    'Database Backup Status',
                                    'Performance Warnings'
                                ].map((notification, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {notification}
                                        </span>
                                        <button
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                                index % 2 === 0 ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                                    index % 2 === 0 ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Security Section */}
                    <div className={`mt-8 p-6 bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-orange-900/50 border-red-700' : 'from-red-50 to-orange-50 border-red-200'} rounded-xl border transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-red-600 text-2xl">🔐</span>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} transition-colors duration-300`}>
                                        Security Settings
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'} transition-colors duration-300`}>
                                        Manage admin account security and access controls
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                    <span className="mr-2">🔑</span>
                                    Change Password
                                </button>
                                <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                    <span className="mr-2">🛡️</span>
                                    2FA Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



    const renderDashboardContent = () => {
        switch(user?.role) {
            case 'student':
                return renderStudentDashboard();
            case 'teacher':
                return renderTeacherDashboard();
            case 'admin':
                return renderAdminDashboard();
            default:
                return renderStudentDashboard();
        }
    };

    const renderDashboardTabs = () => {
        const studentTabs = [
            { id: 'overview', label: 'Overview', icon: '🏠', gradient: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-100 group-hover:bg-blue-200' },
            { id: 'courses', label: 'My Courses', icon: '📚', gradient: 'from-green-500 to-emerald-600', bgColor: 'bg-green-100 group-hover:bg-green-200' },
            { id: 'analytics', label: 'Analytics', icon: '📈', gradient: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-100 group-hover:bg-purple-200' },
            { id: 'messages', label: 'Messages', icon: '💬', gradient: 'from-orange-500 to-red-600', bgColor: 'bg-orange-100 group-hover:bg-orange-200' },
            { id: 'settings', label: 'Settings', icon: '⚙️', gradient: 'from-gray-500 to-slate-600', bgColor: 'bg-gray-100 group-hover:bg-gray-200' }
        ];
    
        const teacherTabs = [
            { id: 'overview', label: 'Overview', icon: '📊', gradient: 'from-blue-500 to-purple-600', bgColor: 'bg-blue-100 group-hover:bg-blue-200' },
            { id: 'courses', label: 'Courses', icon: '📚', gradient: 'from-green-500 to-teal-600', bgColor: 'bg-green-100 group-hover:bg-green-200' },
            { id: 'analytics', label: 'Analytics', icon: '📈', gradient: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-100 group-hover:bg-purple-200' },
            { id: 'messages', label: 'Messages', icon: '💬', gradient: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-100 group-hover:bg-orange-200' },
            { id: 'settings', label: 'Settings', icon: '⚙️', gradient: 'from-gray-500 to-zinc-600', bgColor: 'bg-gray-100 group-hover:bg-gray-200' }
        ];
    
        const tabs = user.role === 'teacher' ? teacherTabs : studentTabs;

        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'} flex transition-colors duration-300`}>
                {/* Responsive Sidebar */}
                <div className={`w-16 sm:w-80 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl border-r ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} flex flex-col transition-colors duration-300`}>
                    {/* Sidebar Header - Updated for dark mode */}
                    <div className={`p-2 sm:p-6 border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 mb-4">
                            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg sm:text-xl font-bold">
                                    {user?.role === 'teacher' ? '📚' : '🎓'}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>FIA Portal</h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    {user?.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
                                </p>
                            </div>
                        </div>
                    </div>
        
                    {/* Navigation Items - Updated with dark mode */}
                    <nav className="flex-1 py-2 sm:py-6 px-2 sm:px-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                title={tab.label}
                                className={`w-full flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-2 sm:px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    activeTab === tab.id
                                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                                        : `${isDarkMode 
                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${
                                    activeTab === tab.id 
                                    ? 'bg-white/20' 
                                    : `${isDarkMode 
                                        ? 'bg-gray-700 group-hover:bg-gray-600' 
                                        : tab.bgColor
                                    }`
                                }`}>
                                    <span className="text-lg sm:text-base">{tab.icon}</span>
                                </div>
                                <span className="hidden sm:block font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
        
                    {/* User Profile Section - Updated with dark mode */}
                    <div className={`p-2 sm:p-6 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 mb-4">
                            <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0 hidden sm:block">
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate transition-colors duration-300`}>
                                    {user?.name}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate transition-colors duration-300`}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="w-full flex items-center justify-center space-x-0 sm:space-x-2 px-2 sm:px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            <span className="font-medium hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
        
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header - Mobile Only - Updated with dark mode */}
                    <div className={`sm:hidden ${isDarkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl shadow-sm border-b p-4 transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                    {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                                </h1>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} capitalize transition-colors duration-300`}>
                                    {user.role} Portal
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors duration-300 ${
                                    isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
        
                    {/* Desktop Header - Already has dark mode support */}
                    <div className={`hidden sm:block ${isDarkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl shadow-lg border-b px-4 sm:px-8 py-4 sm:py-6 transition-colors duration-300`}>
                        {/* Header content remains the same as it already has dark mode support */}
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div>
                                    <h1 className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                        {currentLanguage === 'en' 
                                            ? `Welcome back, ${user?.name}!` 
                                            : `おかえりなさい、${user?.name}！`
                                        }
                                        <span className="ml-2 text-2xl sm:text-4xl">👋</span>
                                    </h1>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 text-sm sm:text-base transition-colors duration-300`}>
                                        {currentLanguage === 'en' 
                                            ? `Here's what's happening in your ${user?.role} dashboard today.`
                                            : `今日の${user?.role === 'student' ? '学生' : '教師'}ダッシュボードの状況です。`
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end space-x-4">
                                    {/* Simple Language Toggle */}
                                    <div className={`flex ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1 rounded-lg transition-colors duration-300`}>
                                        <button 
                                            className={`flex items-center justify-center w-8 h-7 rounded-md transition-all text-xs font-semibold ${
                                                currentLanguage === 'en' 
                                                    ? 'text-white bg-blue-500 shadow-sm' 
                                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                                            }`}
                                            onClick={() => handleLanguageToggle('en')}
                                            title="English"
                                        >
                                            EN
                                        </button>
                                        <button 
                                            className={`flex items-center justify-center w-8 h-7 rounded-md transition-all text-xs font-semibold ${
                                                currentLanguage === 'ja' 
                                                    ? 'text-white bg-blue-500 shadow-sm' 
                                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                                            }`}
                                            onClick={() => handleLanguageToggle('ja')}
                                            title="Japanese"
                                        >
                                            JA
                                        </button>
                                    </div>
        
                                    {/* Simple Dark Mode Toggle */}
                                    <div className={`flex ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1 rounded-lg transition-colors duration-300`}>
                                        <button 
                                            className={`flex items-center justify-center w-8 h-7 rounded-md transition-all ${
                                                !isDarkMode 
                                                    ? 'text-orange-600 bg-orange-100 shadow-sm' 
                                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                                            }`}
                                            onClick={() => handleThemeToggle('light')}
                                            title="Light Mode"
                                        >
                                            <span className="text-sm">☀️</span>
                                        </button>
                                        <button 
                                            className={`flex items-center justify-center w-8 h-7 rounded-md transition-all ${
                                                isDarkMode 
                                                    ? 'text-indigo-400 bg-indigo-900 shadow-sm' 
                                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                                            }`}
                                            onClick={() => handleThemeToggle('dark')}
                                            title="Dark Mode"
                                        >
                                            <span className="text-sm">🌙</span>
                                        </button>
                                    </div>
        
                                    {/* Clean Online Status */}
                                    <div className="admin-status-indicator flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-xs font-medium">
                                            {currentLanguage === 'en' ? 'Online' : 'オンライン'}
                                        </span>
                                    </div>
        
                                    {/* Date */}
                                    <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block transition-colors duration-300`}>
                                        {currentLanguage === 'en' 
                                            ? new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })
                                            : new Date().toLocaleDateString('ja-JP', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* Dashboard Content - UPDATED WITH DARK MODE */}
                    <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'} transition-colors duration-300`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
                            {user.role === 'teacher' ? renderTeacherDashboard() : renderStudentDashboard()}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getRoleDisplayName = (role) => {
        const roleNames = {
            student: 'Student',
            teacher: 'Teacher',
            admin: 'Administrator'
        };
        return roleNames[role] || 'User';
    };

    const getDashboardTitle = (role) => {
        const titles = {
            student: 'Learning Journey Tracker',
            teacher: 'Classroom Pulse Dashboard',
            admin: 'System Health Monitor'
        };
        return titles[role] || 'Dashboard';
    };

    return (
        <div className="min-h-screen">
            {/* Loading Screen */}
            {isLoading && (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center max-w-md mx-4">
                        {/* Animated Spinner */}
                        <div className="relative w-20 h-20 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 border-r-blue-400 rounded-full animate-spin animation-delay-75"></div>
                            <div className="absolute inset-4 border-4 border-transparent border-t-blue-300 border-r-purple-300 rounded-full animate-spin animation-delay-150"></div>
                        </div>
    
                        {/* Loading Text */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                                <span className="mr-2">🚀</span>
                                Loading Your Dashboard
                            </h2>
                            <p className="text-gray-600 text-lg font-medium">
                                Preparing your personalized experience...
                            </p>
                            
                            {/* Progress Dots */}
                            <div className="flex justify-center space-x-2 mt-6">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
                            </div>
    
                            {/* Loading Steps */}
                            <div className="mt-8 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Authenticating user</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Loading dashboard data</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span>Customizing interface</span>
                                </div>
                            </div>
                        </div>
    
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Student & Teacher Dashboard with Responsive Sidebar */}
            {!isLoading && (user?.role === 'student' || user?.role === 'teacher') && renderDashboardTabs()}
    
            {/* Admin Dashboard - Use only Ant Design Layout */}
            {!isLoading && user?.role === 'admin' && renderAdminDashboard()}
        </div>
    );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [applicationSubmissions, setApplicationSubmissions] = useState([]);
    const [contactSubmissions, setContactSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [newUserData, setNewUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    });
    
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
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Fetch functions - Fixed to handle MongoDB data properly
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
            } else {
                console.warn('Pending users endpoint returned error:', response.status);
                setPendingUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
            setPendingUsers([]);
        }
    };

    const fetchApplicationSubmissions = async (token) => {
        try {
            console.log('Fetching application submissions...');
            const response = await fetch(`${API_BASE_URL}/api/applications/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

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
                console.warn('Applications endpoint returned error:', response.status);
                setApplicationSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            setApplicationSubmissions([]);
        }
    };

    const fetchContactSubmissions = async (token) => {
        try {
            console.log('Fetching contact submissions...');
            const response = await fetch(`${API_BASE_URL}/api/contact/all`, {
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

    // Handler functions
    const handleUserApproval = async (userId, approve) => {
        const token = localStorage.getItem('authToken');
        try {
            const endpoint = approve ? 'approve' : 'reject';
            const method = approve ? 'PUT' : 'DELETE';
            
            const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}/${userId}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
                alert(`Contact submission ${action} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${action} contact: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${action} contact submission:`, error);
            alert(`Error: Failed to ${action} contact submission`);
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
        const token = localStorage.getItem('authToken');
        
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

    const handleLogout = () => {
        localStorage.clear();
        history.push('/');
    };

    // Main authentication effect - Fixed to properly fetch admin data
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                history.push('/');
                return;
            }

            try {
                console.log('Checking authentication...');
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Token invalid');
                }

                const data = await response.json();
                const userData = data.user;
                console.log('User data received:', userData);

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
                localStorage.setItem('userName', `${userData.firstName} ${userData.lastName}`.trim());

                // Fetch admin data if user is admin
                if (userData.role === 'admin') {
                    console.log('User is admin, fetching admin data...');
                    try {
                        // Fetch all admin data in parallel
                        const adminDataPromises = [
                            fetchPendingUsers(token),
                            fetchContactSubmissions(token),
                            fetchApplicationSubmissions(token),
                            fetchAllUsers(token)
                        ];

                        await Promise.allSettled(adminDataPromises);
                        console.log('Admin data fetch completed');
                    } catch (fetchError) {
                        console.error('Error fetching admin data:', fetchError);
                    }
                }

            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.clear();
                history.push('/');
                return;
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [history, API_BASE_URL]);

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your personalized dashboard...</p>
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
        <>
            <div className="journey-header">
                <div className="journey-progress">
                    <div className="progress-circle">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="45" 
                                stroke="url(#progressGradient)" 
                                strokeWidth="8" 
                                fill="none"
                                strokeDasharray={`${dashboardData.student.journeyProgress * 2.83} 283`}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="progress-text">
                            <span className="progress-number">{dashboardData.student.journeyProgress}%</span>
                            <span className="progress-label">Complete</span>
                        </div>
                    </div>
                    <div className="journey-stats">
                        <h2>Your Learning Journey</h2>
                        <div className="milestone-tracker">
                            <div className="milestone-item">
                                <span className="milestone-number">{dashboardData.student.completedMilestones}</span>
                                <span className="milestone-label">Milestones Achieved</span>
                            </div>
                            <div className="milestone-item">
                                <span className="milestone-number">{dashboardData.student.streak}</span>
                                <span className="milestone-label">Day Streak 🔥</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>Active Courses</h3>
                        <p className="stat-number">4</p>
                        <span className="stat-trend">+1 this month</span>
                    </div>
                </div>
                <div className="stat-card gradient-green">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <h3>Upcoming Deadlines</h3>
                        <p className="stat-number">{dashboardData.student.upcomingDeadlines.length}</p>
                        <span className="stat-trend urgent">1 urgent</span>
                    </div>
                </div>
                <div className="stat-card gradient-purple">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Study Hours</h3>
                        <p className="stat-number">{dashboardData.student.studyGoals.completed}h</p>
                        <span className="stat-trend">Goal: {dashboardData.student.studyGoals.weekly}h/week</span>
                    </div>
                </div>
                <div className="stat-card gradient-orange">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <h3>Average Grade</h3>
                        <p className="stat-number">A-</p>
                        <span className="stat-trend">+0.2 improvement</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="ai-recommendations">
                    <h3>🤖 AI Study Plan</h3>
                    <div className="recommendation-card">
                        <div className="recommendation-header">
                            <span className="priority-badge high">High Priority</span>
                            <span className="time-estimate">45 min</span>
                        </div>
                        <h4>Review Statistical Hypothesis Testing</h4>
                        <p>Based on your recent quiz performance, focusing on this topic will boost your Data Science grade.</p>
                        <button className="start-study-btn">Start Study Session</button>
                    </div>
                </div>

                <div className="deadline-tracker">
                    <h3>📅 Upcoming Deadlines</h3>
                    <div className="deadline-list">
                        {dashboardData.student.upcomingDeadlines.map(deadline => (
                            <div key={deadline.id} className={`deadline-item ${deadline.urgent ? 'urgent' : ''}`}>
                                <div className="deadline-date">
                                    <span className="day">{new Date(deadline.dueDate).getDate()}</span>
                                    <span className="month">{new Date(deadline.dueDate).toLocaleDateString('en', { month: 'short' })}</span>
                                </div>
                                <div className="deadline-info">
                                    <h4>{deadline.title}</h4>
                                    <p>{deadline.course}</p>
                                    <span className="time-left">
                                        {deadline.urgent ? '⚠️ Due soon' : `${Math.ceil((new Date(deadline.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                                    </span>
                                </div>
                                <button className="work-on-btn">Work On It</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="performance-analytics">
                    <h3>📈 Performance Insights</h3>
                    <div className="strengths-weaknesses">
                        <div className="strength-section">
                            <h4>Your Strengths</h4>
                            {dashboardData.student.performanceData.strengths.map((strength, index) => (
                                <div key={index} className="skill-badge strength">{strength}</div>
                            ))}
                        </div>
                        <div className="improvement-section">
                            <h4>Areas for Improvement</h4>
                            {dashboardData.student.performanceData.improvements.map((improvement, index) => (
                                <div key={index} className="skill-badge improvement">{improvement}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>⚡ Quick Actions</h3>
                    <div className="action-grid">
                        <button className="action-btn">
                            <span className="action-icon">💬</span>
                            <span>Ask Question</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📝</span>
                            <span>Take Quiz</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">🎯</span>
                            <span>Set Goal</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📖</span>
                            <span>Study Notes</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderStudentCourses = () => (
        <div className="student-courses-section">
            <div className="section-header">
                <h2>📚 My Learning Path</h2>
                <button className="browse-courses-btn">🔍 Browse More Courses</button>
            </div>

            <div className="learning-progress-overview">
                <h3>📊 Overall Progress</h3>
                <div className="progress-overview-grid">
                    <div className="progress-overview-item">
                        <div className="progress-ring">
                            <svg viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="2"
                                    strokeDasharray="75, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                            </svg>
                            <div className="progress-text">75%</div>
                        </div>
                        <div className="progress-info">
                            <h4>Course Completion</h4>
                            <p>3 of 4 courses completed</p>
                        </div>
                    </div>
                    <div className="progress-overview-item">
                        <div className="progress-ring">
                            <svg viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="2"
                                    strokeDasharray="88, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                            </svg>
                            <div className="progress-text">88%</div>
                        </div>
                        <div className="progress-info">
                            <h4>Assignment Score</h4>
                            <p>Average across all courses</p>
                        </div>
                    </div>
                    <div className="progress-overview-item">
                        <div className="progress-ring">
                            <svg viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="2"
                                    strokeDasharray="60, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                            </svg>
                            <div className="progress-text">60%</div>
                        </div>
                        <div className="progress-info">
                            <h4>Study Goal</h4>
                            <p>12h of 20h weekly goal</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="enrolled-courses">
                <h3>📖 Enrolled Courses</h3>
                <div className="student-courses-grid">
                    <div className="student-course-card active">
                        <div className="course-thumbnail">
                            <div className="course-category">Data Science</div>
                            <div className="course-difficulty">Beginner</div>
                        </div>
                        <div className="course-content">
                            <h4>Introduction to Data Science</h4>
                            <p>Learn the fundamentals of data analysis, visualization, and statistical thinking.</p>
                            <div className="course-progress-bar">
                                <div className="progress-fill" style={{width: '85%'}}></div>
                            </div>
                            <div className="course-meta">
                                <span className="progress-text">85% Complete</span>
                                <span className="next-lesson">Next: Python Basics</span>
                            </div>
                            <div className="course-actions">
                                <button className="continue-btn">Continue Learning</button>
                                <button className="view-materials-btn">📁 Materials</button>
                            </div>
                        </div>
                    </div>

                    <div className="student-course-card active">
                        <div className="course-thumbnail">
                            <div className="course-category">Web Development</div>
                            <div className="course-difficulty">Intermediate</div>
                        </div>
                        <div className="course-content">
                            <h4>Full-Stack JavaScript</h4>
                            <p>Master modern JavaScript development with React, Node.js, and MongoDB.</p>
                            <div className="course-progress-bar">
                                <div className="progress-fill" style={{width: '62%'}}></div>
                            </div>
                            <div className="course-meta">
                                <span className="progress-text">62% Complete</span>
                                <span className="next-lesson">Next: React Hooks</span>
                            </div>
                            <div className="course-actions">
                                <button className="continue-btn">Continue Learning</button>
                                <button className="view-materials-btn">📁 Materials</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentAnalytics = () => (
        <div className="student-analytics-section">
            <div className="section-header">
                <h2>📊 Learning Analytics</h2>
                <div className="analytics-filter">
                    <select>
                        <option>Last 30 days</option>
                        <option>This semester</option>
                        <option>All time</option>
                    </select>
                </div>
            </div>

            <div className="analytics-overview">
                <div className="analytics-card primary">
                    <div className="analytics-icon">📈</div>
                    <div className="analytics-content">
                        <h3>Learning Streak</h3>
                        <div className="analytics-value">7 days</div>
                        <div className="analytics-trend positive">+2 from last week</div>
                    </div>
                </div>
                <div className="analytics-card success">
                    <div className="analytics-icon">⭐</div>
                    <div className="analytics-content">
                        <h3>Average Score</h3>
                        <div className="analytics-value">88.5%</div>
                        <div className="analytics-trend positive">+5.2% improvement</div>
                    </div>
                </div>
                <div className="analytics-card warning">
                    <div className="analytics-icon">⏱️</div>
                    <div className="analytics-content">
                        <h3>Study Time</h3>
                        <div className="analytics-value">14.5h</div>
                        <div className="analytics-trend">This week</div>
                    </div>
                </div>
                <div className="analytics-card info">
                    <div className="analytics-icon">🎯</div>
                    <div className="analytics-content">
                        <h3>Goals Met</h3>
                        <div className="analytics-value">3/4</div>
                        <div className="analytics-trend">This month</div>
                    </div>
                </div>
            </div>

            <div className="detailed-analytics">
                <div className="performance-chart-card">
                    <h3>📈 Performance Trends</h3>
                    <div className="chart-container">
                        <div className="performance-chart">
                            <div className="chart-bars">
                                <div className="performance-bar" style={{height: '70%'}}>
                                    <div className="bar-value">85%</div>
                                    <div className="bar-label">Week 1</div>
                                </div>
                                <div className="performance-bar" style={{height: '80%'}}>
                                    <div className="bar-value">88%</div>
                                    <div className="bar-label">Week 2</div>
                                </div>
                                <div className="performance-bar" style={{height: '75%'}}>
                                    <div className="bar-value">82%</div>
                                    <div className="bar-label">Week 3</div>
                                </div>
                                <div className="performance-bar" style={{height: '90%'}}>
                                    <div className="bar-value">92%</div>
                                    <div className="bar-label">Week 4</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="subject-performance-card">
                    <h3>📚 Subject Performance</h3>
                    <div className="subject-list">
                        <div className="subject-item">
                            <div className="subject-info">
                                <span className="subject-name">Data Science</span>
                                <span className="subject-score">92%</span>
                            </div>
                            <div className="subject-progress">
                                <div className="subject-progress-bar">
                                    <div className="subject-progress-fill" style={{width: '92%'}}></div>
                                </div>
                            </div>
                            <div className="subject-trend positive">+8%</div>
                        </div>
                        <div className="subject-item">
                            <div className="subject-info">
                                <span className="subject-name">JavaScript</span>
                                <span className="subject-score">87%</span>
                            </div>
                            <div className="subject-progress">
                                <div className="subject-progress-bar">
                                    <div className="subject-progress-fill" style={{width: '87%'}}></div>
                                </div>
                            </div>
                            <div className="subject-trend positive">+3%</div>
                        </div>
                        <div className="subject-item">
                            <div className="subject-info">
                                <span className="subject-name">Machine Learning</span>
                                <span className="subject-score">78%</span>
                            </div>
                            <div className="subject-progress">
                                <div className="subject-progress-bar">
                                    <div className="subject-progress-fill" style={{width: '78%'}}></div>
                                </div>
                            </div>
                            <div className="subject-trend neutral">-2%</div>
                        </div>
                    </div>
                </div>

                <div className="achievements-card">
                    <h3>🏆 Recent Achievements</h3>
                    <div className="achievements-list">
                        <div className="achievement-item">
                            <div className="achievement-icon">🔥</div>
                            <div className="achievement-info">
                                <h4>Week Warrior</h4>
                                <p>Completed 7 days of continuous learning</p>
                                <span className="achievement-date">2 days ago</span>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <div className="achievement-icon">⭐</div>
                            <div className="achievement-info">
                                <h4>Quiz Master</h4>
                                <p>Scored 95% or higher on 5 quizzes</p>
                                <span className="achievement-date">1 week ago</span>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <div className="achievement-icon">🎯</div>
                            <div className="achievement-info">
                                <h4>Goal Crusher</h4>
                                <p>Met all weekly study goals for the month</p>
                                <span className="achievement-date">2 weeks ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentMessages = () => (
        <div className="student-messages-section">
            <div className="section-header">
                <h2>💬 Messages & Discussions</h2>
                <button className="new-question-btn">❓ Ask Question</button>
            </div>

            <div className="messages-tabs">
                <button className="message-tab active">All Messages</button>
                <button className="message-tab">My Questions</button>
                <button className="message-tab">Study Groups</button>
                <button className="message-tab">Announcements</button>
            </div>

            <div className="messages-container">
                <div className="discussion-threads">
                    <div className="thread-item unread">
                        <div className="thread-avatar">
                            <div className="avatar-icon">👨‍🏫</div>
                        </div>
                        <div className="thread-content">
                            <div className="thread-header">
                                <span className="sender-name">Dr. Smith</span>
                                <span className="thread-course">Data Science 101</span>
                                <span className="thread-time">2 hours ago</span>
                            </div>
                            <h4 className="thread-title">Assignment 3 - Additional Resources</h4>
                            <p className="thread-preview">I've uploaded some additional practice problems for the statistical analysis assignment...</p>
                            <div className="thread-meta">
                                <span className="reply-count">3 replies</span>
                                <span className="thread-type">📢 Announcement</span>
                            </div>
                        </div>
                        <div className="thread-status unread-badge">New</div>
                    </div>

                    <div className="thread-item">
                        <div className="thread-avatar">
                            <div className="avatar-icon">👥</div>
                        </div>
                        <div className="thread-content">
                            <div className="thread-header">
                                <span className="sender-name">Study Group #3</span>
                                <span className="thread-course">JavaScript Fundamentals</span>
                                <span className="thread-time">5 hours ago</span>
                            </div>
                            <h4 className="thread-title">Weekly Study Session - React Hooks</h4>
                            <p className="thread-preview">Hey everyone! This week we're covering React Hooks. Anyone wants to join our virtual session?</p>
                            <div className="thread-meta">
                                <span className="reply-count">8 replies</span>
                                <span className="thread-type">👥 Study Group</span>
                            </div>
                        </div>
                        <div className="join-group-btn">Join</div>
                    </div>
                </div>

                <div className="quick-help-section">
                    <h3>🚀 Quick Help</h3>
                    <div className="help-categories">
                        <button className="help-category-btn">
                            <span className="help-icon">💡</span>
                            <span>Study Tips</span>
                        </button>
                        <button className="help-category-btn">
                            <span className="help-icon">🔧</span>
                            <span>Technical Support</span>
                        </button>
                        <button className="help-category-btn">
                            <span className="help-icon">📚</span>
                            <span>Course Materials</span>
                        </button>
                        <button className="help-category-btn">
                            <span className="help-icon">⏰</span>
                            <span>Schedule Help</span>
                        </button>
                    </div>

                    <div className="ai-chat-preview">
                        <h4>💬 Chat with AI Tutor</h4>
                        <p>Get instant help with your questions!</p>
                        <button className="start-chat-btn">Start Chat</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentSettings = () => (
        <div className="student-settings-section">
            <div className="section-header">
                <h2>⚙️ Learning Preferences</h2>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3>🎯 Learning Goals</h3>
                    <div className="setting-item">
                        <label>Weekly Study Goal</label>
                        <input type="number" defaultValue="20" />
                        <span>hours per week</span>
                    </div>
                    <div className="setting-item">
                        <label>Preferred Learning Style</label>
                        <select>
                            <option>Visual Learner</option>
                            <option>Auditory Learner</option>
                            <option>Kinesthetic Learner</option>
                            <option>Reading/Writing Learner</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Daily Reminder</label>
                        <input type="checkbox" defaultChecked />
                        <span>Send me daily study reminders</span>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>🔔 Notification Preferences</h3>
                    <div className="setting-item">
                        <label>Assignment Reminders</label>
                        <input type="checkbox" defaultChecked />
                        <span>Remind me 24 hours before due dates</span>
                    </div>
                    <div className="setting-item">
                        <label>Course Updates</label>
                        <input type="checkbox" defaultChecked />
                        <span>Notify me of new course materials</span>
                    </div>
                    <div className="setting-item">
                        <label>Discussion Replies</label>
                        <input type="checkbox" />
                        <span>Email me when someone replies to my questions</span>
                    </div>
                    <div className="setting-item">
                        <label>Study Group Invites</label>
                        <input type="checkbox" defaultChecked />
                        <span>Allow study group invitations</span>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>📱 Dashboard Customization</h3>
                    <div className="setting-item">
                        <label>Theme Preference</label>
                        <select>
                            <option>Light Theme</option>
                            <option>Dark Theme</option>
                            <option>Auto (System)</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Show Progress Animations</label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable animated progress indicators</span>
                    </div>
                    <div className="setting-item">
                        <label>Compact View</label>
                        <input type="checkbox" />
                        <span>Use compact layout for courses</span>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>🎓 Academic Preferences</h3>
                    <div className="setting-item">
                        <label>Difficulty Preference</label>
                        <select>
                            <option>Adaptive (Recommended)</option>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Auto-Submit Quizzes</label>
                        <input type="checkbox" />
                        <span>Automatically submit when time expires</span>
                    </div>
                    <div className="setting-item">
                        <label>Show Detailed Feedback</label>
                        <input type="checkbox" defaultChecked />
                        <span>Show explanations for quiz answers</span>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="save-btn">💾 Save Preferences</button>
                <button className="reset-btn">🔄 Reset to Defaults</button>
            </div>
        </div>
    );

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
        <>
            <div className="pulse-header">
                <div className="pulse-indicator">
                    <div className={`pulse-circle ${dashboardData.teacher.studentSentiment}`}>
                        <div className="pulse-ring"></div>
                        <div className="pulse-core"></div>
                    </div>
                    <div className="pulse-stats">
                        <h2>Classroom Pulse</h2>
                        <p>Overall Engagement: <strong>{dashboardData.teacher.classEngagement}%</strong></p>
                        <p>Student Sentiment: <span className={`sentiment ${dashboardData.teacher.studentSentiment}`}>
                            {dashboardData.teacher.studentSentiment.toUpperCase()} 
                            {dashboardData.teacher.studentSentiment === 'positive' ? ' 😊' : dashboardData.teacher.studentSentiment === 'neutral' ? ' 😐' : ' 😟'}
                        </span></p>
                    </div>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Students</h3>
                        <p className="stat-number">156</p>
                        <span className="stat-trend">Across 3 courses</span>
                    </div>
                </div>
                <div className="stat-card gradient-green">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Active Polls</h3>
                        <p className="stat-number">{dashboardData.teacher.activePolls}</p>
                        <span className="stat-trend">Live responses</span>
                    </div>
                </div>
                <div className="stat-card gradient-orange">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>Pending Grading</h3>
                        <p className="stat-number">{dashboardData.teacher.pendingGrading}</p>
                        <span className="stat-trend">Assignments & Quizzes</span>
                    </div>
                </div>
                <div className="stat-card gradient-purple">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>Classes Today</h3>
                        <p className="stat-number">3</p>
                        <span className="stat-trend">Next: 2:00 PM</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="engagement-heatmap">
                    <h3>🔥 Topic Engagement Heatmap</h3>
                    <div className="heatmap-grid">
                        {Object.entries(dashboardData.teacher.engagementHeatmap).map(([topic, engagement]) => (
                            <div key={topic} className="heatmap-item">
                                <div className="topic-name">{topic}</div>
                                <div className="engagement-bar">
                                    <div 
                                        className="engagement-fill" 
                                        style={{ 
                                            width: `${engagement}%`,
                                            backgroundColor: engagement > 80 ? '#10b981' : engagement > 60 ? '#f59e0b' : '#ef4444'
                                        }}
                                    ></div>
                                </div>
                                <span className="engagement-score">{engagement}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="activity-feed">
                    <h3>⚡ Real-time Activity</h3>
                    <div className="activity-list">
                        {dashboardData.teacher.recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {activity.type === 'quiz_completed' ? '✅' : '❓'}
                                </div>
                                <div className="activity-info">
                                    {activity.type === 'quiz_completed' ? (
                                        <>
                                            <p><strong>{activity.student}</strong> completed a quiz</p>
                                            <small>{activity.course} • Score: {activity.score}%</small>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>{activity.student}</strong> asked a question</p>
                                            <small>{activity.course} • {activity.time}</small>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ai-suggestions">
                    <h3>🤖 AI Teaching Insights</h3>
                    <div className="suggestion-card">
                        <div className="suggestion-type">📊 Data-Driven Recommendation</div>
                        <h4>Consider Additional Practice for Machine Learning</h4>
                        <p>71% engagement suggests students may benefit from more interactive examples and hands-on coding exercises.</p>
                        <div className="suggestion-actions">
                            <button className="suggestion-btn primary">Create Practice Session</button>
                            <button className="suggestion-btn secondary">Schedule Review</button>
                        </div>
                    </div>
                </div>

                <div className="teaching-tools">
                    <h3>🛠️ Quick Tools</h3>
                    <div className="tools-grid">
                        <button className="tool-btn">
                            <span className="tool-icon">📊</span>
                            <span>Create Poll</span>
                        </button>
                        <button className="tool-btn">
                            <span className="tool-icon">📝</span>
                            <span>New Quiz</span>
                        </button>
                        <button className="tool-btn">
                            <span className="tool-icon">📢</span>
                            <span>Send Announcement</span>
                        </button>
                        <button className="tool-btn">
                            <span className="tool-icon">📈</span>
                            <span>Grade Assignments</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderTeacherCourses = () => (
        <div className="courses-section">
            <div className="section-header">
                <h2>📚 My Courses</h2>
                <button className="create-course-btn">➕ Create New Course</button>
            </div>
            
            <div className="courses-grid">
                <div className="course-card active">
                    <div className="course-header">
                        <div className="course-icon">📊</div>
                        <div className="course-status">Active</div>
                    </div>
                    <h3>Data Science 101</h3>
                    <p>Introduction to data analysis and visualization</p>
                    <div className="course-stats">
                        <div className="stat">
                            <span className="stat-number">45</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">12</span>
                            <span className="stat-label">Lessons</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">89%</span>
                            <span className="stat-label">Completion</span>
                        </div>
                    </div>
                    <div className="course-actions">
                        <button className="action-btn primary">Manage Course</button>
                        <button className="action-btn secondary">View Analytics</button>
                    </div>
                </div>

                <div className="course-card active">
                    <div className="course-header">
                        <div className="course-icon">🤖</div>
                        <div className="course-status">Active</div>
                    </div>
                    <h3>Machine Learning Basics</h3>
                    <p>Fundamental concepts of ML algorithms</p>
                    <div className="course-stats">
                        <div className="stat">
                            <span className="stat-number">38</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">16</span>
                            <span className="stat-label">Lessons</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">71%</span>
                            <span className="stat-label">Completion</span>
                        </div>
                    </div>
                    <div className="course-actions">
                        <button className="action-btn primary">Manage Course</button>
                        <button className="action-btn secondary">View Analytics</button>
                    </div>
                </div>

                <div className="course-card draft">
                    <div className="course-header">
                        <div className="course-icon">🐍</div>
                        <div className="course-status">Draft</div>
                    </div>
                    <h3>Advanced Python Programming</h3>
                    <p>Deep dive into Python frameworks and libraries</p>
                    <div className="course-stats">
                        <div className="stat">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">8</span>
                            <span className="stat-label">Lessons</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">45%</span>
                            <span className="stat-label">Complete</span>
                        </div>
                    </div>
                    <div className="course-actions">
                        <button className="action-btn primary">Continue Building</button>
                        <button className="action-btn secondary">Preview</button>
                    </div>
                </div>
            </div>

            <div className="pending-assignments">
                <h3>📝 Assignments Awaiting Review</h3>
                <div className="assignments-list">
                    <div className="assignment-item urgent">
                        <div className="assignment-info">
                            <h4>Data Visualization Project</h4>
                            <p>Data Science 101 • Due: 2 days ago</p>
                            <span className="submissions-count">23 submissions</span>
                        </div>
                        <div className="assignment-actions">
                            <button className="review-btn">Start Grading</button>
                        </div>
                    </div>
                    <div className="assignment-item">
                        <div className="assignment-info">
                            <h4>ML Algorithm Quiz</h4>
                            <p>Machine Learning Basics • Due: Tomorrow</p>
                            <span className="submissions-count">31 submissions</span>
                        </div>
                        <div className="assignment-actions">
                            <button className="review-btn">Review Answers</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherAnalytics = () => (
        <div className="analytics-section">
            <div className="section-header">
                <h2>📈 Course Analytics</h2>
                <div className="date-filter">
                    <select>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This semester</option>
                    </select>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <h3>Student Performance Trends</h3>
                    <div className="chart-placeholder">
                        <div className="mock-chart">
                            <div className="chart-bars">
                                <div className="bar" style={{height: '60%'}}></div>
                                <div className="bar" style={{height: '75%'}}></div>
                                <div className="bar" style={{height: '80%'}}></div>
                                <div className="bar" style={{height: '70%'}}></div>
                                <div className="bar" style={{height: '85%'}}></div>
                            </div>
                            <div className="chart-labels">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                                <span>Week 5</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Engagement by Time</h3>
                    <div className="engagement-timeline">
                        <div className="timeline-item">
                            <span className="time">9:00 AM</span>
                            <div className="engagement-level high"></div>
                            <span className="level-text">High</span>
                        </div>
                        <div className="timeline-item">
                            <span className="time">11:00 AM</span>
                            <div className="engagement-level medium"></div>
                            <span className="level-text">Medium</span>
                        </div>
                        <div className="timeline-item">
                            <span className="time">2:00 PM</span>
                            <div className="engagement-level high"></div>
                            <span className="level-text">High</span>
                        </div>
                        <div className="timeline-item">
                            <span className="time">4:00 PM</span>
                            <div className="engagement-level low"></div>
                            <span className="level-text">Low</span>
                        </div>
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Top Performing Students</h3>
                    <div className="student-rankings">
                        <div className="student-rank">
                            <div className="rank-position">1</div>
                            <div className="student-info">
                                <span className="student-name">Alice Johnson</span>
                                <span className="student-score">95.2%</span>
                            </div>
                        </div>
                        <div className="student-rank">
                            <div className="rank-position">2</div>
                            <div className="student-info">
                                <span className="student-name">Bob Smith</span>
                                <span className="student-score">92.8%</span>
                            </div>
                        </div>
                        <div className="student-rank">
                            <div className="rank-position">3</div>
                            <div className="student-info">
                                <span className="student-name">Carol Davis</span>
                                <span className="student-score">90.1%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Assignment Completion Rates</h3>
                    <div className="completion-stats">
                        <div className="completion-item">
                            <span className="assignment-name">Data Viz Project</span>
                            <div className="completion-bar">
                                <div className="completion-fill" style={{width: '95%'}}></div>
                            </div>
                            <span className="completion-rate">95%</span>
                        </div>
                        <div className="completion-item">
                            <span className="assignment-name">Python Quiz #3</span>
                            <div className="completion-bar">
                                <div className="completion-fill" style={{width: '87%'}}></div>
                            </div>
                            <span className="completion-rate">87%</span>
                        </div>
                        <div className="completion-item">
                            <span className="assignment-name">ML Essay</span>
                            <div className="completion-bar">
                                <div className="completion-fill" style={{width: '73%'}}></div>
                            </div>
                            <span className="completion-rate">73%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

        // ...existing code...
    const renderTeacherMessages = () => (
        <div className="messages-section">
            <div className="section-header">
                <h2>💬 Messages & Communications</h2>
                <button className="compose-btn">✍️ Compose Message</button>
            </div>
    
            <div className="messages-layout">
                <div className="message-sidebar">
                    <div className="message-filters">
                        <button className="filter-btn active">All Messages</button>
                        <button className="filter-btn">Student Questions</button>
                        <button className="filter-btn">Announcements</button>
                        <button className="filter-btn">Urgent</button>
                    </div>
                </div>
    
                <div className="messages-content">
                    <div className="message-thread">
                        <div className="message-item unread">
                            <div className="message-avatar">JS</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="sender-name">John Smith</span>
                                    <span className="message-time">2 hours ago</span>
                                    <span className="message-course">Data Science 101</span>
                                </div>
                                <div className="message-preview">
                                    Question about the regression analysis assignment...
                                </div>
                            </div>
                            <div className="message-status urgent">!</div>
                        </div>
    
                        <div className="message-item">
                            <div className="message-avatar">MJ</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="sender-name">Mary Johnson</span>
                                    <span className="message-time">5 hours ago</span>
                                    <span className="message-course">ML Basics</span>
                                </div>
                                <div className="message-preview">
                                    Thank you for the detailed feedback on my project...
                                </div>
                            </div>
                        </div>
    
                        <div className="message-item">
                            <div className="message-avatar">AD</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="sender-name">Admin Department</span>
                                    <span className="message-time">1 day ago</span>
                                    <span className="message-course">System</span>
                                </div>
                                <div className="message-preview">
                                    Grade submission deadline reminder...
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="quick-announcements">
                        <h3>📢 Quick Announcements</h3>
                        <div className="announcement-templates">
                            <button className="template-btn">Remind about upcoming deadline</button>
                            <button className="template-btn">Share study resources</button>
                            <button className="template-btn">Class schedule change</button>
                            <button className="template-btn">Congratulate top performers</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderTeacherSettings = () => (
        <div className="settings-section">
            <div className="section-header">
                <h2>⚙️ Teacher Settings</h2>
            </div>
    
            <div className="settings-grid">
                <div className="settings-card">
                    <h3>📊 Grading Preferences</h3>
                    <div className="setting-item">
                        <label>Default Grading Scale</label>
                        <select>
                            <option>A-F Letter Grades</option>
                            <option>0-100 Percentage</option>
                            <option>1-10 Scale</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Auto-release Grades</label>
                        <input type="checkbox" />
                        <span>Automatically release grades to students</span>
                    </div>
                    <div className="setting-item">
                        <label>Late Submission Penalty</label>
                        <input type="number" placeholder="10" />
                        <span>% per day late</span>
                    </div>
                </div>
    
                <div className="settings-card">
                    <h3>🔔 Notification Settings</h3>
                    <div className="setting-item">
                        <label>Email Notifications</label>
                        <input type="checkbox" defaultChecked />
                        <span>Receive email for new student messages</span>
                    </div>
                    <div className="setting-item">
                        <label>Assignment Reminders</label>
                        <input type="checkbox" defaultChecked />
                        <span>Get reminded about grading deadlines</span>
                    </div>
                    <div className="setting-item">
                        <label>Weekly Reports</label>
                        <input type="checkbox" />
                        <span>Receive weekly class performance summary</span>
                    </div>
                </div>
    
                <div className="settings-card">
                    <h3>👥 Class Management</h3>
                    <div className="setting-item">
                        <label>Default Class Size Limit</label>
                        <input type="number" defaultValue="50" />
                    </div>
                    <div className="setting-item">
                        <label>Allow Student Collaboration</label>
                        <input type="checkbox" defaultChecked />
                        <span>Students can work in groups</span>
                    </div>
                    <div className="setting-item">
                        <label>Automatic Attendance Tracking</label>
                        <input type="checkbox" />
                        <span>Track student login times</span>
                    </div>
                </div>
    
                <div className="settings-card">
                    <h3>🎨 Dashboard Customization</h3>
                    <div className="setting-item">
                        <label>Dashboard Theme</label>
                        <select>
                            <option>Light Mode</option>
                            <option>Dark Mode</option>
                            <option>Auto (System)</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Show Engagement Metrics</label>
                        <input type="checkbox" defaultChecked />
                        <span>Display real-time engagement data</span>
                    </div>
                    <div className="setting-item">
                        <label>Quick Actions Sidebar</label>
                        <input type="checkbox" defaultChecked />
                        <span>Show quick tools in sidebar</span>
                    </div>
                </div>
            </div>
    
            <div className="settings-actions">
                <button className="save-btn">💾 Save Settings</button>
                <button className="reset-btn">🔄 Reset to Defaults</button>
            </div>
        </div>
    );
    
    // Admin Dashboard Components
    const renderAdminOverview = () => (
        <>
            <div className="system-health-header">
                <div className="health-indicator">
                    <div className="health-score">
                        <div className="score-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="45" 
                                    stroke="#10b981" 
                                    strokeWidth="6" 
                                    fill="none"
                                    strokeDasharray={`${dashboardData.admin.systemHealth * 2.83} 283`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="score-text">
                                <span className="score-number">{dashboardData.admin.systemHealth}%</span>
                                <span className="score-label">Healthy</span>
                            </div>
                        </div>
                    </div>
                    <div className="system-stats">
                        <h2>System Health Monitor</h2>
                        <div className="health-metrics">
                            <div className="metric">
                                <span className="metric-label">Server Load</span>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${dashboardData.admin.serverLoad}%`, backgroundColor: '#3b82f6' }}></div>
                                </div>
                                <span className="metric-value">{dashboardData.admin.serverLoad}%</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Storage Used</span>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${dashboardData.admin.storageUsed}%`, backgroundColor: '#f59e0b' }}></div>
                                </div>
                                <span className="metric-value">{dashboardData.admin.storageUsed}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="dashboard-stats">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{allUsers.length}</p>
                        <span className="stat-trend">{pendingUsers.length} pending approval</span>
                    </div>
                </div>
                <div className="stat-card gradient-green">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>Applications</h3>
                        <p className="stat-number">{applicationSubmissions.length}</p>
                        <span className="stat-trend">{dashboardData.admin.pendingApplications || 0} pending</span>
                    </div>
                </div>
                <div className="stat-card gradient-orange">
                    <div className="stat-icon">📧</div>
                    <div className="stat-content">
                        <h3>Contact Messages</h3>
                        <p className="stat-number">{contactSubmissions.length}</p>
                        <span className="stat-trend">{dashboardData.admin.pendingContacts || 0} pending</span>
                    </div>
                </div>
                <div className="stat-card gradient-purple">
                    <div className="stat-icon">🖥️</div>
                    <div className="stat-content">
                        <h3>System Uptime</h3>
                        <p className="stat-number">99.8%</p>
                        <span className="stat-trend">Last 30 days</span>
                    </div>
                </div>
            </div>
    
            <div className="dashboard-content">
                <div className="admin-quick-overview">
                    <div className="overview-section">
                        <h3>📊 Quick Stats</h3>
                        <div className="quick-stats-grid">
                            <div className="quick-stat">
                                <span className="stat-label">Students</span>
                                <span className="stat-value">{allUsers.filter(u => u.role === 'student').length}</span>
                            </div>
                            <div className="quick-stat">
                                <span className="stat-label">Teachers</span>
                                <span className="stat-value">{allUsers.filter(u => u.role === 'teacher').length}</span>
                            </div>
                            <div className="quick-stat">
                                <span className="stat-label">Admins</span>
                                <span className="stat-value">{allUsers.filter(u => u.role === 'admin').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {contactSubmissions.length > 0 && (
                    <div className="contact-submissions">
                        <h3>📧 Recent Contact Submissions</h3>
                        <div className="submissions-list">
                            {contactSubmissions.slice(0, 3).map(contact => (
                                <div key={contact._id} className={`submission-card ${contact.status}`}>
                                    <div className="submission-header">
                                        <div className="contact-info">
                                            <h4>{contact.name}</h4>
                                            <p className="contact-email">{contact.email}</p>
                                            <span className={`status-badge ${contact.status}`}>
                                                {contact.status === 'pending' ? '⏳ Pending' : 
                                                contact.status === 'approved' ? '✅ Approved' : 
                                                contact.status === 'resolved' ? '✅ Resolved' : '❌ Ignored'}
                                            </span>
                                        </div>
                                        <div className="submission-date">
                                            <small>{new Date(contact.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    <div className="submission-content">
                                        <p><strong>Subject:</strong> {contact.subject}</p>
                                        <p><strong>Message:</strong></p>
                                        <div className="message-content">
                                            {contact.message.length > 100 ? 
                                                `${contact.message.substring(0, 100)}...` : 
                                                contact.message
                                            }
                                        </div>
                                    </div>
                                    {contact.status === 'pending' && (
                                        <div className="submission-actions">
                                            <button 
                                                className="action-btn approve"
                                                onClick={() => handleContactAction(contact._id, 'resolved')}
                                            >
                                                ✅ Resolve
                                            </button>
                                            <button 
                                                className="action-btn priority"
                                                onClick={() => handleContactAction(contact._id, 'approved')}
                                            >
                                                🔥 Priority
                                            </button>
                                            <button 
                                                className="action-btn ignore"
                                                onClick={() => handleContactAction(contact._id, 'ignored')}
                                            >
                                                ❌ Ignore
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                {pendingUsers.length > 0 && (
                    <div className="user-management">
                        <h3>👤 Pending User Approvals</h3>
                        <div className="pending-list">
                            {pendingUsers.slice(0, 3).map(user => (
                                <div key={user._id} className="pending-user-card">
                                    <div className="user-avatar">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <div className="user-details">
                                        <h4>{user.firstName} {user.lastName}</h4>
                                        <p>{user.email}</p>
                                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                                    </div>
                                    <div className="approval-actions">
                                        <button 
                                            className="approve-btn"
                                            onClick={() => handleUserApproval(user._id, true)}
                                        >
                                            ✅ Approve
                                        </button>
                                        <button 
                                            className="reject-btn"
                                            onClick={() => handleUserApproval(user._id, false)}
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
    
    // const renderUserManagement = () => (
    //     <div className="user-management-section">
    //         <div className="section-header">
    //             <h2>👥 User Management</h2>
    //             <button 
    //                 className="create-user-btn"
    //                 onClick={() => setShowCreateUserForm(true)}
    //             >
    //                 ➕ Create New User
    //             </button>
    //         </div>
    
    //         {showCreateUserForm && (
    //             <div className="create-user-modal">
    //                 <div className="modal-content">
    //                     <h3>Create New User</h3>
    //                     <form onSubmit={handleCreateUser}>
    //                         <div className="form-row">
    //                             <input
    //                                 type="text"
    //                                 placeholder="First Name"
    //                                 value={newUserData.firstName}
    //                                 onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
    //                                 required
    //                             />
    //                             <input
    //                                 type="text"
    //                                 placeholder="Last Name"
    //                                 value={newUserData.lastName}
    //                                 onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
    //                                 required
    //                             />
    //                         </div>
    //                         <input
    //                             type="email"
    //                             placeholder="Email"
    //                             value={newUserData.email}
    //                             onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
    //                             required
    //                         />
    //                         <input
    //                             type="password"
    //                             placeholder="Password"
    //                             value={newUserData.password}
    //                             onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
    //                             required
    //                         />
    //                         <select
    //                             value={newUserData.role}
    //                             onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
    //                         >
    //                             <option value="student">Student</option>
    //                             <option value="teacher">Teacher</option>
    //                             <option value="admin">Admin</option>
    //                         </select>
    //                         <div className="form-actions">
    //                             <button type="submit">Create User</button>
    //                             <button type="button" onClick={() => setShowCreateUserForm(false)}>Cancel</button>
    //                         </div>
    //                     </form>
    //                 </div>
    //             </div>
    //         )}
    
    //         <div className="users-grid">
    //             {allUsers.map(user => (
    //                 <div key={user._id} className="user-card">
    //                     <div className="user-avatar">
    //                         {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
    //                     </div>
    //                     <div className="user-info">
    //                         <h4>{user.firstName} {user.lastName}</h4>
    //                         <p>{user.email}</p>
    //                         <span className={`role-badge ${user.role}`}>{user.role}</span>
    //                         <span className={`status-badge ${user.isApproved ? 'approved' : 'pending'}`}>
    //                             {user.isApproved ? '✅ Approved' : '⏳ Pending'}
    //                         </span>
    //                     </div>
    //                     {!user.isApproved && (
    //                         <div className="user-actions">
    //                             <button 
    //                                 className="approve-btn"
    //                                 onClick={() => handleUserApproval(user._id, true)}
    //                             >
    //                                 Approve
    //                             </button>
    //                             <button 
    //                                 className="reject-btn"
    //                                 onClick={() => handleUserApproval(user._id, false)}
    //                             >
    //                                 Reject
    //                             </button>
    //                         </div>
    //                     )}
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
    
        const renderUserManagement = () => (
        <div className="user-management-section">
            <div className="section-header">
                <div className="header-left">
                    <h2>👥 User Management</h2>
                    <div className="user-stats">
                        <span className="stat-item">
                            <strong>{allUsers.length}</strong> Total Users
                        </span>
                        <span className="stat-item">
                            <strong>{pendingUsers.length}</strong> Pending
                        </span>
                        <span className="stat-item">
                            <strong>{allUsers.filter(u => u.isApproved).length}</strong> Approved
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="search-filter-bar">
                        <input 
                            type="text" 
                            placeholder="🔍 Search users..." 
                            className="search-input"
                        />
                        <select className="filter-select">
                            <option value="">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                            <option value="admin">Admins</option>
                        </select>
                        <select className="filter-select">
                            <option value="">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <button 
                        className="create-user-btn"
                        onClick={() => setShowCreateUserForm(true)}
                    >
                        ➕ Create New User
                    </button>
                </div>
            </div>
    
            {showCreateUserForm && (
                <div className="create-user-modal-overlay">
                    <div className="create-user-modal">
                        <div className="modal-header">
                            <h3>✨ Create New User</h3>
                            <button 
                                className="close-modal-btn"
                                onClick={() => setShowCreateUserForm(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleCreateUser}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                        >
                                            <option value="student">👨‍🎓 Student</option>
                                            <option value="teacher">👨‍🏫 Teacher</option>
                                            <option value="admin">👨‍💼 Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowCreateUserForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        ✨ Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
    
            <div className="users-table-container">
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th className="sortable">
                                    <div className="th-content">
                                        👤 User
                                        <span className="sort-icon">↕️</span>
                                    </div>
                                </th>
                                <th className="sortable">
                                    <div className="th-content">
                                        📧 Contact
                                        <span className="sort-icon">↕️</span>
                                    </div>
                                </th>
                                <th className="sortable">
                                    <div className="th-content">
                                        🎭 Role
                                        <span className="sort-icon">↕️</span>
                                    </div>
                                </th>
                                <th className="sortable">
                                    <div className="th-content">
                                        📊 Status
                                        <span className="sort-icon">↕️</span>
                                    </div>
                                </th>
                                <th className="sortable">
                                    <div className="th-content">
                                        📅 Joined
                                        <span className="sort-icon">↕️</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="th-content">
                                        ⚡ Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user, index) => (
                                <tr key={user._id} className={`user-row ${!user.isApproved ? 'pending-row' : ''}`}>
                                    <td className="user-cell">
                                        <div className="user-info-cell">
                                            <div className="user-avatar-table">
                                                <div className={`avatar-circle ${user.role}`}>
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div className="online-indicator"></div>
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="user-id">
                                                    ID: {user._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="contact-cell">
                                        <div className="contact-info">
                                            <div className="email-primary">
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="phone-secondary">
                                                    📱 {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="role-cell">
                                        <span className={`role-badge-table ${user.role}`}>
                                            <span className="role-icon">
                                                {user.role === 'admin' ? '👨‍💼' : 
                                                 user.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                                            </span>
                                            <span className="role-text">
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="status-cell">
                                        <div className="status-container">
                                            <span className={`status-badge-table ${user.isApproved ? 'approved' : 'pending'}`}>
                                                <span className="status-dot"></span>
                                                <span className="status-text">
                                                    {user.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </span>
                                            {!user.isApproved && (
                                                <span className="urgency-indicator">
                                                    ⚠️ Needs Review
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="date-cell">
                                        <div className="date-info">
                                            <div className="join-date">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="time-ago">
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(user.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? 'Today' : `${days} days ago`;
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            {!user.isApproved ? (
                                                <>
                                                    <button 
                                                        className="action-btn approve-btn-table"
                                                        onClick={() => handleUserApproval(user._id, true)}
                                                        title="Approve User"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        className="action-btn reject-btn-table"
                                                        onClick={() => handleUserApproval(user._id, false)}
                                                        title="Reject User"
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    className="action-btn view-btn-table"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </button>
                                            )}
                                            <div className="action-dropdown">
                                                <button className="dropdown-toggle">⋮</button>
                                                <div className="dropdown-menu">
                                                    <button className="dropdown-item">📝 Edit</button>
                                                    <button className="dropdown-item">📧 Message</button>
                                                    <button className="dropdown-item">🔒 Reset Password</button>
                                                    <hr className="dropdown-divider" />
                                                    <button className="dropdown-item danger">🗑️ Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                <div className="table-footer">
                    <div className="table-info">
                        <span>Showing {allUsers.length} of {allUsers.length} users</span>
                    </div>
                    <div className="table-pagination">
                        <button className="pagination-btn" disabled={true}>
                            ← Previous
                        </button>
                        <div className="pagination-numbers">
                            <button className="page-number active">1</button>
                            <button className="page-number">2</button>
                            <button className="page-number">3</button>
                        </div>
                        <button className="pagination-btn">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
    
            <div className="bulk-actions-bar">
                <div className="bulk-actions-left">
                    <input type="checkbox" id="select-all" />
                    <label htmlFor="select-all">Select All</label>
                    <span className="selected-count">0 selected</span>
                </div>
                <div className="bulk-actions-right">
                    <button className="bulk-btn approve-all">✅ Approve Selected</button>
                    <button className="bulk-btn reject-all">❌ Reject Selected</button>
                    <button className="bulk-btn export">📤 Export</button>
                </div>
            </div>
        </div>
    );

    const renderApplicationManagement = () => (
        <div className="applications-section">
            <h2>📋 Application Management</h2>
            <div className="applications-grid">
                {applicationSubmissions.map(application => (
                    <div key={application._id} className="application-card">
                        <div className="application-header">
                            <h4>{application.firstName} {application.lastName}</h4>
                            <span className={`status-badge ${application.status}`}>
                                {application.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <div className="application-details">
                            <p><strong>Email:</strong> {application.email}</p>
                            <p><strong>Phone:</strong> {application.phone}</p>
                            <p><strong>Program:</strong> {application.program}</p>
                            <p><strong>Start Date:</strong> {application.startDate}</p>
                            <p><strong>Education:</strong> {application.highestEducation}</p>
                            <p><strong>School:</strong> {application.schoolName}</p>
                            {application.goals && (
                                <div className="application-goals">
                                    <strong>Goals:</strong>
                                    <p>{application.goals.substring(0, 100)}...</p>
                                </div>
                            )}
                        </div>
                        {application.status === 'pending' && (
                            <div className="application-actions">
                                <button 
                                    className="approve-btn"
                                    onClick={() => handleApplicationAction(application._id, 'approved')}
                                >
                                    ✅ Approve
                                </button>
                                <button 
                                    className="review-btn"
                                    onClick={() => handleApplicationAction(application._id, 'under_review')}
                                >
                                    👀 Under Review
                                </button>
                                <button 
                                    className="reject-btn"
                                    onClick={() => handleApplicationAction(application._id, 'rejected')}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderContactManagement = () => (
        <div className="contacts-section">
            <h2>📧 Contact Management</h2>
            <div className="contacts-grid">
                {contactSubmissions.map(contact => (
                    <div key={contact._id} className="contact-card">
                        <div className="contact-header">
                            <h4>{contact.name}</h4>
                            <span className={`status-badge ${contact.status}`}>
                                {contact.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="contact-details">
                            <p><strong>Email:</strong> {contact.email}</p>
                            {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
                            <p><strong>Subject:</strong> {contact.subject}</p>
                            <div className="contact-message">
                                <strong>Message:</strong>
                                <p>{contact.message}</p>
                            </div>
                            <small>Received: {new Date(contact.createdAt).toLocaleString()}</small>
                        </div>
                        {contact.status === 'pending' && (
                            <div className="contact-actions">
                                <button 
                                    className="resolve-btn"
                                    onClick={() => handleContactAction(contact._id, 'resolved')}
                                >
                                    ✅ Resolve
                                </button>
                                <button 
                                    className="priority-btn"
                                    onClick={() => handleContactAction(contact._id, 'approved')}
                                >
                                    🔥 Priority
                                </button>
                                <button 
                                    className="ignore-btn"
                                    onClick={() => handleContactAction(contact._id, 'ignored')}
                                >
                                    ❌ Ignore
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderAdminDashboard = () => {
        if (activeTab === 'overview') {
            return renderAdminOverview();
        } else if (activeTab === 'users') {
            return renderUserManagement();
        } else if (activeTab === 'applications') {
            return renderApplicationManagement();
        } else if (activeTab === 'contacts') {
            return renderContactManagement();
        }
        return renderAdminOverview();
    };
    
    const renderAdminSidebar = () => (
        <nav className="sidebar-nav">
            <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Overview
            </button>
            <button 
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.96 2.96 0 0 0 17 6.5c-.86 0-1.76.34-2.42 1.01L12 10l2.58 2.58c.76.76 2 .76 2.76 0l.66-.66V22h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6H9l-2.54-7.63A2.96 2.96 0 0 0 3.5 6.5c-.86 0-1.76.34-2.42 1.01L0 10l2.58 2.58c.76.76 2 .76 2.76 0L6 12v10h1z"/>
                </svg>
                Users
            </button>
            <button 
                className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Applications
            </button>
            <button 
                className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                Contacts
            </button>
            <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
                Settings
            </button>
        </nav>
    );
    
    const renderDefaultSidebar = () => (
        <nav className="sidebar-nav">
            <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Overview
            </button>
            <button 
                className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                </svg>
                Courses
            </button>
            <button 
                className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Analytics
            </button>
            <button 
                className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                Messages
            </button>
            <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
                Settings
            </button>
        </nav>
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
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>{getDashboardTitle(user?.role)}</h2>
                    <p className="user-type">{getRoleDisplayName(user?.role)} Portal</p>
                </div>
                
                {user?.role === 'admin' ? renderAdminSidebar() : renderDefaultSidebar()}
    
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
    
            <div className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p>Here's what's happening in your {getRoleDisplayName(user?.role).toLowerCase()} dashboard today.</p>
                </div>
    
                {renderDashboardContent()}
            </div>
        </div>
    );
};
    
export default Dashboard;
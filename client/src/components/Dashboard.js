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

    // const API_BASE_URL = process.env.REACT_APP_API_URL ;
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server

    const API_BASE_URL = process.env.REACT_APP_API_URL ;
    const token = localStorage.getItem("token");
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server


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
        // Around line 360, update the useEffect:
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'MISSING');
            console.log('🌐 API_BASE_URL:', API_BASE_URL);
            
            if (!token) {
                console.log('❌ No token found, redirecting to home');
                history.push('/');
                return;
            }
    
            try {
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
                    
                    try {
                        console.log('📋 Fetching applications...');
                        await fetchApplicationSubmissions(token);
                        console.log('✅ Applications fetch completed');
                    } catch (error) {
                        console.error('❌ Applications fetch failed:', error);
                    }
    
                    try {
                        console.log('📧 Fetching contacts...');
                        await fetchContactSubmissions(token);
                        console.log('✅ Contacts fetch completed');
                    } catch (error) {
                        console.error('❌ Contacts fetch failed:', error);
                    }
    
                    try {
                        console.log('👥 Fetching users...');
                        await fetchPendingUsers(token);
                        await fetchAllUsers(token);
                        console.log('✅ Users fetch completed');
                    } catch (error) {
                        console.error('❌ Users fetch failed:', error);
                    }
                }
    
            } catch (error) {
                console.error('❌ Authentication error:', error);
                localStorage.clear();
                history.push('/');
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
        <div className="space-y-8">
            {/* System Health Header */}
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
                                        <div className="text-xs text-white/80 font-medium">HEALTHY</div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">System Health Monitor</h2>
                            <p className="text-white/80 text-center lg:text-left">All systems operating optimally</p>
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
                                            <h3 className="text-white font-semibold">Server Load</h3>
                                            <p className="text-white/60 text-sm">CPU utilization</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.serverLoad}%</div>
                                        <div className="text-green-400 text-sm font-medium">↗ Optimal</div>
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
                                            <h3 className="text-white font-semibold">Storage Used</h3>
                                            <p className="text-white/60 text-sm">Database & files</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.storageUsed}%</div>
                                        <div className="text-orange-400 text-sm font-medium">📈 Growing</div>
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
                                            <h3 className="text-white font-semibold">Response Time</h3>
                                            <p className="text-white/60 text-sm">Average API speed</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">142ms</div>
                                        <div className="text-blue-400 text-sm font-medium">⚡ Fast</div>
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
                                            <h3 className="text-white font-semibold">Active Sessions</h3>
                                            <p className="text-white/60 text-sm">Current users online</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">247</div>
                                        <div className="text-purple-400 text-sm font-medium">👥 Active</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                    <span className="text-white/60 text-sm">Live monitoring</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{allUsers.length}</div>
                                <div className="text-blue-100 text-sm font-medium">Total Users</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pending approval</span>
                            <span className="font-semibold text-orange-600">{pendingUsers.length}</span>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${(allUsers.filter(u => u.isApproved).length / allUsers.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            {Math.round((allUsers.filter(u => u.isApproved).length / allUsers.length) * 100)}% approved
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{applicationSubmissions.length}</div>
                                <div className="text-green-100 text-sm font-medium">Applications</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pending review</span>
                            <span className="font-semibold text-orange-600">{dashboardData.admin.pendingApplications || 0}</span>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${applicationSubmissions.length > 0 ? ((applicationSubmissions.filter(app => app.status === 'approved').length / applicationSubmissions.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            {applicationSubmissions.filter(app => app.status === 'approved').length} approved
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{contactSubmissions.length}</div>
                                <div className="text-orange-100 text-sm font-medium">Messages</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Needs response</span>
                            <span className="font-semibold text-red-600">{dashboardData.admin.pendingContacts || 0}</span>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${contactSubmissions.length > 0 ? ((contactSubmissions.filter(contact => contact.status === 'resolved').length / contactSubmissions.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            {contactSubmissions.filter(contact => contact.status === 'resolved').length} resolved
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-purple-100 text-sm font-medium">Uptime</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last 30 days</span>
                            <span className="font-semibold text-green-600">Excellent</span>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: '99.9%' }}></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            43.2 minutes downtime
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Role Distribution */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📊</span>
                            User Distribution
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Platform user breakdown by role</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🎓</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Students</div>
                                        <div className="text-sm text-gray-600">Active learners</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{allUsers.filter(u => u.role === 'student').length}</div>
                                    <div className="text-xs text-blue-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'student').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🏫</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Teachers</div>
                                        <div className="text-sm text-gray-600">Course instructors</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{allUsers.filter(u => u.role === 'teacher').length}</div>
                                    <div className="text-xs text-green-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'teacher').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍💼</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Administrators</div>
                                        <div className="text-sm text-gray-600">System managers</div>
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
    
                        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Total Active Users</span>
                                <span className="text-lg font-bold text-gray-900">{allUsers.filter(u => u.isApproved).length}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Growth rate: +{Math.floor(Math.random() * 15) + 5}% this month
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="mr-2">⚡</span>
                                    Real-time Activity
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Live system events and user actions</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-500">Live</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {/* Pending User Approvals */}
                            {pendingUsers.length > 0 && pendingUsers.slice(0, 3).map(user => (
                                <div key={user._id} className="flex items-start space-x-4 p-4 bg-orange-25 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">
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
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                New {user.role} registration
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {user.firstName} {user.lastName} ({user.email}) awaiting approval
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                                                onClick={() => handleUserApproval(user._id, true)}
                                            >
                                                ✅ Approve
                                            </button>
                                            <button 
                                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                                                onClick={() => handleUserApproval(user._id, false)}
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
    
                            {/* Recent Contact Messages */}
                            {contactSubmissions.length > 0 && contactSubmissions.filter(c => c.status === 'pending').slice(0, 2).map(contact => (
                                <div key={contact._id} className="flex items-start space-x-4 p-4 bg-blue-25 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                        {contact.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-900">New contact message</h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {contact.name} - {contact.subject}
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                                                onClick={() => handleContactAction(contact._id, 'approved')}
                                            >
                                                🔥 Priority
                                            </button>
                                            <button 
                                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                                                onClick={() => handleContactAction(contact._id, 'resolved')}
                                            >
                                                ✅ Resolve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
    
                            {/* System Events */}
                            <div className="flex items-start space-x-4 p-4 bg-green-25 border border-green-200 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">🛡️</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-900">Security scan completed</h4>
                                        <span className="text-xs text-gray-500">5 minutes ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600">No threats detected. All systems secure.</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                        ✅ All Clear
                                    </span>
                                </div>
                            </div>
    
                            <div className="flex items-start space-x-4 p-4 bg-purple-25 border border-purple-200 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">💾</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-900">Database backup completed</h4>
                                        <span className="text-xs text-gray-500">1 hour ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Daily backup successful. 2.4GB archived.</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                                        📊 Automated
                                    </span>
                                </div>
                            </div>
                        </div>
    
                        {/* Quick Actions */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Administration</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👥</span>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">Manage Users</span>
                                </button>
                                <button className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group">
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📋</span>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-green-700">Applications</span>
                                </button>
                                <button className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📧</span>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-orange-700">Messages</span>
                                </button>
                                <button className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</span>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-purple-700">Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* System Alerts & Notifications */}
            {dashboardData.admin.recentAlerts && dashboardData.admin.recentAlerts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🚨</span>
                            System Alerts
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Recent system notifications and alerts</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {dashboardData.admin.recentAlerts.map((alert, index) => (
                                <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl border ${
                                    alert.type === 'warning' ? 'bg-yellow-25 border-yellow-200' : 'bg-blue-25 border-blue-200'
                                }`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}>
                                        <span className="text-white text-sm">
                                            {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
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
    
    const renderUserManagement = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">👥</span>
                        User Management
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{allUsers.length}</span> Total Users
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-orange-600">{pendingUsers.length}</span> Pending
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-green-600">{allUsers.filter(u => u.isApproved).length}</span> Approved
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            placeholder="🔍 Search users..." 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                            <option value="admin">Admins</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <button 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        onClick={() => setShowCreateUserForm(true)}
                    >
                        ➕ Create New User
                    </button>
                </div>
            </div>
    
            {/* Create User Modal */}
            {showCreateUserForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">✨</span>
                                Create New User
                            </h3>
                            <button 
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setShowCreateUserForm(false)}
                            >
                                <span className="text-gray-400 hover:text-gray-600 text-xl">✕</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="student">👨‍🎓 Student</option>
                                            <option value="teacher">👨‍🏫 Teacher</option>
                                            <option value="admin">👨‍💼 Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowCreateUserForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        ✨ Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>👤 User</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📧 Contact</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>🎭 Role</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📊 Status</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📅 Joined</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ⚡ Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allUsers.map((user, index) => (
                                <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${!user.isApproved ? 'bg-orange-25 border-l-4 border-orange-400' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                                                    user.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                                    user.role === 'teacher' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                                                    'bg-gradient-to-br from-blue-400 to-purple-500'
                                                }`}>
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${
                                                    user.isApproved ? 'bg-green-400' : 'bg-orange-400'
                                                }`}></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {user._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            {user.phone && (
                                                <div className="text-xs text-gray-500">📱 {user.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            <span className="mr-1">
                                                {user.role === 'admin' ? '👨‍💼' : 
                                                 user.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                                            </span>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.isApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    user.isApproved ? 'bg-green-400' : 'bg-orange-400'
                                                }`}></span>
                                                {user.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                            {!user.isApproved && (
                                                <div className="text-xs text-orange-600 font-medium">
                                                    ⚠️ Needs Review
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs">
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(user.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? 'Today' : `${days} days ago`;
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {!user.isApproved ? (
                                                <>
                                                    <button 
                                                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                                                        onClick={() => handleUserApproval(user._id, true)}
                                                        title="Approve User"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                                        onClick={() => handleUserApproval(user._id, false)}
                                                        title="Reject User"
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </button>
                                            )}
                                            
                                            {/* Dropdown Menu */}
                                            <div className="relative group">
                                                <button className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                                    ⋮
                                                </button>
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                    <div className="py-1">
                                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            <span className="mr-2">📝</span>
                                                            Edit User
                                                        </button>
                                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            <span className="mr-2">📧</span>
                                                            Send Message
                                                        </button>
                                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            <span className="mr-2">🔒</span>
                                                            Reset Password
                                                        </button>
                                                        <hr className="my-1 border-gray-200" />
                                                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                            <span className="mr-2">🗑️</span>
                                                            Delete User
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
    
                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Showing {allUsers.length} of {allUsers.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white hover:bg-gray-50 transition-colors" disabled>
                            ← Previous
                        </button>
                        <div className="flex space-x-1">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">2</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">3</button>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Bulk Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="select-all-users" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="select-all-users" className="text-sm font-medium text-gray-700">Select All</label>
                        <span className="text-sm text-gray-500">0 selected</span>
                    </div>
                    <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                            ✅ Approve Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                            ❌ Reject Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            📤 Export Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderApplicationManagement = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">📋</span>
                        Application Management
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{applicationSubmissions.length}</span> Total Applications
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-orange-600">{applicationSubmissions.filter(app => app.status === 'pending').length}</span> Pending
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-green-600">{applicationSubmissions.filter(app => app.status === 'approved').length}</span> Approved
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-red-600">{applicationSubmissions.filter(app => app.status === 'rejected').length}</span> Rejected
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            placeholder="🔍 Search applications..." 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Programs</option>
                            <option value="data-science">Data Science</option>
                            <option value="web-development">Web Development</option>
                            <option value="machine-learning">Machine Learning</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="under_review">Under Review</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        📤 Export Applications
                    </button>
                </div>
            </div>
    
            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>👤 Applicant</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📧 Contact</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>🎓 Program</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📊 Status</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📅 Applied</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ⚡ Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applicationSubmissions.map((application, index) => (
                                <tr key={application._id} className={`hover:bg-gray-50 transition-colors ${application.status === 'pending' ? 'bg-orange-25 border-l-4 border-orange-400' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                    {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-400 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {application.firstName} {application.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {application._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{application.email}</div>
                                            {application.phone && (
                                                <div className="text-xs text-gray-500">📱 {application.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <span className="mr-1">🎓</span>
                                                {application.program}
                                            </span>
                                            <div className="text-xs text-gray-500">
                                                Start: {new Date(application.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                application.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                                                application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                application.status === 'under_review' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    application.status === 'pending' ? 'bg-orange-400' : 
                                                    application.status === 'approved' ? 'bg-green-400' : 
                                                    application.status === 'under_review' ? 'bg-blue-400' : 
                                                    'bg-red-400'
                                                }`}></span>
                                                {application.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            {application.status === 'pending' && (
                                                <div className="text-xs text-orange-600 font-medium">
                                                    ⚠️ Needs Review
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900">
                                                {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs">
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(application.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? 'Today' : `${days} days ago`;
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {application.status === 'pending' ? (
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                                                    onClick={() => handleApplicationAction(application._id, 'approved')}
                                                    title="Approve Application"
                                                >
                                                    ✅
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                    onClick={() => handleApplicationAction(application._id, 'under_review')}
                                                    title="Under Review"
                                                >
                                                    👀
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                                    onClick={() => handleApplicationAction(application._id, 'rejected')}
                                                    title="Reject Application"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                                    title="Send Message"
                                                >
                                                    📧
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Showing {applicationSubmissions.length} of {applicationSubmissions.length} applications
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white hover:bg-gray-50 transition-colors" disabled>
                            ← Previous
                        </button>
                        <div className="flex space-x-1">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">2</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">3</button>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Bulk Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="select-all-apps" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="select-all-apps" className="text-sm font-medium text-gray-700">Select All</label>
                        <span className="text-sm text-gray-500">0 selected</span>
                    </div>
                    <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                            ✅ Approve Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            👀 Review Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                            ❌ Reject Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            📤 Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderContactManagement = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">📧</span>
                        Contact Management
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{contactSubmissions.length}</span> Total Messages
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-orange-600">{contactSubmissions.filter(contact => contact.status === 'pending').length}</span> Pending
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-green-600">{contactSubmissions.filter(contact => contact.status === 'resolved').length}</span> Resolved
                        </span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-blue-600">{contactSubmissions.filter(contact => contact.status === 'approved').length}</span> Priority
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            placeholder="🔍 Search messages..." 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Categories</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="enrollment">Enrollment</option>
                            <option value="complaint">Complaint</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Priority</option>
                            <option value="resolved">Resolved</option>
                            <option value="ignored">Ignored</option>
                        </select>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        📤 Export Messages
                    </button>
                </div>
            </div>
    
            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>👤 Contact</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📧 Details</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>💬 Message</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📊 Status</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>📅 Received</span>
                                        <span className="text-gray-400">↕️</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ⚡ Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contactSubmissions.map((contact, index) => (
                                <tr key={contact._id} className={`hover:bg-gray-50 transition-colors ${contact.status === 'pending' ? 'bg-orange-25 border-l-4 border-orange-400' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                    {contact.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${
                                                    contact.status === 'pending' ? 'bg-orange-400' : 
                                                    contact.status === 'resolved' ? 'bg-green-400' : 
                                                    contact.status === 'approved' ? 'bg-blue-400' : 'bg-gray-400'
                                                }`}></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {contact.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {contact._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{contact.email}</div>
                                            {contact.phone && (
                                                <div className="text-xs text-gray-500">📱 {contact.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {contact.subject}
                                            </div>
                                            <div className="text-sm text-gray-600 max-w-xs">
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    {contact.message.length > 80 ? 
                                                        `${contact.message.substring(0, 80)}...` : 
                                                        contact.message
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                contact.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                                                contact.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
                                                contact.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    contact.status === 'pending' ? 'bg-orange-400' : 
                                                    contact.status === 'approved' ? 'bg-blue-400' : 
                                                    contact.status === 'resolved' ? 'bg-green-400' : 
                                                    'bg-gray-400'
                                                }`}></span>
                                                {contact.status === 'pending' ? '⏳ Pending' : 
                                                contact.status === 'approved' ? '🔥 Priority' : 
                                                contact.status === 'resolved' ? '✅ Resolved' : '❌ Ignored'}
                                            </span>
                                            {contact.status === 'pending' && (
                                                <div className="text-xs text-orange-600 font-medium">
                                                    ⚠️ Needs Response
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900">
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
                                        {contact.status === 'pending' ? (
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                                                    onClick={() => handleContactAction(contact._id, 'resolved')}
                                                    title="Resolve"
                                                >
                                                    ✅
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                    onClick={() => handleContactAction(contact._id, 'approved')}
                                                    title="Mark as Priority"
                                                >
                                                    🔥
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                                    onClick={() => handleContactAction(contact._id, 'ignored')}
                                                    title="Ignore"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="View Full Message"
                                                >
                                                    👁️
                                                </button>
                                                <button 
                                                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                                    title="Reply"
                                                >
                                                    📧
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Showing {contactSubmissions.length} of {contactSubmissions.length} messages
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white hover:bg-gray-50 transition-colors" disabled>
                            ← Previous
                        </button>
                        <div className="flex space-x-1">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">2</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">3</button>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Bulk Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="select-all-contacts" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="select-all-contacts" className="text-sm font-medium text-gray-700">Select All</label>
                        <span className="text-sm text-gray-500">0 selected</span>
                    </div>
                    <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                            ✅ Resolve Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            🔥 Mark as Priority
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors">
                            ❌ Ignore Selected
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            📤 Export
                        </button>
                    </div>
                </div>
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
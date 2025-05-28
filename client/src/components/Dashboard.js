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
            contentApprovals: 5
        }
    });

    const history = useHistory();
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Keep existing authentication code
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                history.push('/');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Token invalid');
                }

                const data = await response.json();
                const userData = data.user;

                setUser({
                    id: userData.id,
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

                if (userData.role === 'admin') {
                    fetchPendingUsers(token);
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

    // Keep existing API functions
    const fetchPendingUsers = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
        }
    };

    const handleUserApproval = async (userId, approve) => {
        const token = localStorage.getItem('authToken');
        try {
            const endpoint = approve ? 'approve' : 'reject';
            const method = approve ? 'PUT' : 'DELETE';
            
            const response = await fetch(`${API_BASE_URL}/auth/${endpoint}/${userId}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchPendingUsers(token);
            }
        } catch (error) {
            console.error(`Failed to ${approve ? 'approve' : 'reject'} user:`, error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        history.push('/');
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your personalized dashboard...</p>
            </div>
        );
    }

    // Student Dashboard - Learning Journey Tracker
    const renderStudentDashboard = () => (
        <>
            {/* Learning Journey Progress */}
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

            {/* Dashboard Stats */}
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

            {/* Main Content */}
            <div className="dashboard-content">
                {/* AI Study Recommendations */}
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

                {/* Upcoming Deadlines */}
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

                {/* Performance Analytics */}
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

                {/* Quick Actions */}
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

    // Teacher Dashboard - Classroom Pulse
    const renderTeacherDashboard = () => (
        <>
            {/* Classroom Pulse Header */}
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

            {/* Teacher Stats */}
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

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Engagement Heatmap */}
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

                {/* Real-time Activity Feed */}
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

                {/* AI Teaching Suggestions */}
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

                {/* Quick Tools */}
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

    // Admin Dashboard - System Health Monitor
    const renderAdminDashboard = () => (
        <>
            {/* System Health Header */}
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

            {/* Admin Stats */}
            <div className="dashboard-stats">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Active Users</h3>
                        <p className="stat-number">{dashboardData.admin.activeUsers.toLocaleString()}</p>
                        <span className="stat-trend">+{dashboardData.admin.userGrowth.thisWeek} this week</span>
                    </div>
                </div>
                <div className="stat-card gradient-green">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>Active Courses</h3>
                        <p className="stat-number">18</p>
                        <span className="stat-trend">2 pending approval</span>
                    </div>
                </div>
                <div className="stat-card gradient-orange">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>Pending Approvals</h3>
                        <p className="stat-number">{pendingUsers.length + dashboardData.admin.contentApprovals}</p>
                        <span className="stat-trend">Users & Content</span>
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

            {/* Main Content */}
            <div className="dashboard-content">
                {/* User Management */}
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

                {/* System Alerts */}
                <div className="system-alerts">
                    <h3>🚨 System Alerts</h3>
                    <div className="alert-list">
                        {dashboardData.admin.recentAlerts.map((alert, index) => (
                            <div key={index} className={`alert-item ${alert.type}`}>
                                <div className="alert-icon">
                                    {alert.type === 'info' ? 'ℹ️' : alert.type === 'warning' ? '⚠️' : '🚨'}
                                </div>
                                <div className="alert-content">
                                    <p>{alert.message}</p>
                                    <small>{alert.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Analytics */}
                <div className="platform-analytics">
                    <h3>📊 Platform Analytics</h3>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <h4>User Growth</h4>
                            <div className="growth-comparison">
                                <div className="growth-item">
                                    <span className="growth-period">This Week</span>
                                    <span className="growth-number">+{dashboardData.admin.userGrowth.thisWeek}</span>
                                </div>
                                <div className="growth-item">
                                    <span className="growth-period">Last Week</span>
                                    <span className="growth-number">+{dashboardData.admin.userGrowth.lastWeek}</span>
                                </div>
                            </div>
                        </div>
                        <div className="analytics-card">
                            <h4>Course Engagement</h4>
                            <div className="engagement-stats">
                                <div className="stat-row">
                                    <span>Average Session Time</span>
                                    <span>47 minutes</span>
                                </div>
                                <div className="stat-row">
                                    <span>Completion Rate</span>
                                    <span>73%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="admin-actions">
                    <h3>⚡ Quick Actions</h3>
                    <div className="admin-tools-grid">
                        <button className="admin-tool-btn">
                            <span className="tool-icon">👥</span>
                            <span>Manage Users</span>
                        </button>
                        <button className="admin-tool-btn">
                            <span className="tool-icon">📚</span>
                            <span>Course Approval</span>
                        </button>
                        <button className="admin-tool-btn">
                            <span className="tool-icon">📊</span>
                            <span>View Reports</span>
                        </button>
                        <button className="admin-tool-btn">
                            <span className="tool-icon">⚙️</span>
                            <span>System Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
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
                        {user?.role === 'admin' ? 'System' : 'Courses'}
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
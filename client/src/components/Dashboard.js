// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import '../styles/Dashboard.css';

// const Dashboard = () => {
//     const [user, setUser] = useState(null);
//     const [activeTab, setActiveTab] = useState('overview');
//     const [isLoading, setIsLoading] = useState(true);
//     const history = useHistory();

//     useEffect(() => {
//         // Check if user is authenticated
//         const checkAuth = () => {
//             const token = localStorage.getItem('authToken');
//             const userType = localStorage.getItem('userType');
//             const userEmail = localStorage.getItem('userEmail');

//             if (!token) {
//                 history.push('/');
//                 return;
//             }

//             setUser({
//                 email: userEmail,
//                 type: userType,
//                 name: userEmail?.split('@')[0] || 'User'
//             });
//             setIsLoading(false);
//         };

//         checkAuth();
//     }, [history]);

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         history.push('/');
//     };

//     if (isLoading) {
//         return (
//             <div className="dashboard-loading">
//                 <div className="spinner"></div>
//                 <p>Loading dashboard...</p>
//             </div>
//         );
//     }

//     const renderStudentDashboard = () => (
//         <>
//             <div className="dashboard-stats">
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Enrolled Courses</h3>
//                         <p className="stat-number">4</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Assignments Due</h3>
//                         <p className="stat-number">3</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Study Hours</h3>
//                         <p className="stat-number">24</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Average Grade</h3>
//                         <p className="stat-number">A-</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="dashboard-content">
//                 <div className="recent-courses">
//                     <h3>Recent Courses</h3>
//                     <div className="course-list">
//                         <div className="course-item">
//                             <div className="course-icon">📊</div>
//                             <div className="course-info">
//                                 <h4>Data Science Fundamentals</h4>
//                                 <p>Progress: 75%</p>
//                             </div>
//                             <button className="view-course-btn">Continue</button>
//                         </div>
//                         <div className="course-item">
//                             <div className="course-icon">💻</div>
//                             <div className="course-info">
//                                 <h4>Web Development</h4>
//                                 <p>Progress: 60%</p>
//                             </div>
//                             <button className="view-course-btn">Continue</button>
//                         </div>
//                         <div className="course-item">
//                             <div className="course-icon">🤖</div>
//                             <div className="course-info">
//                                 <h4>Machine Learning</h4>
//                                 <p>Progress: 45%</p>
//                             </div>
//                             <button className="view-course-btn">Continue</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="upcoming-tasks">
//                     <h3>Upcoming Tasks</h3>
//                     <div className="task-list">
//                         <div className="task-item">
//                             <div className="task-date">
//                                 <span className="day">25</span>
//                                 <span className="month">May</span>
//                             </div>
//                             <div className="task-info">
//                                 <h4>Data Analysis Project</h4>
//                                 <p>Due in 2 days</p>
//                             </div>
//                         </div>
//                         <div className="task-item">
//                             <div className="task-date">
//                                 <span className="day">28</span>
//                                 <span className="month">May</span>
//                             </div>
//                             <div className="task-info">
//                                 <h4>JavaScript Quiz</h4>
//                                 <p>Due in 5 days</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );

//     const renderFacultyDashboard = () => (
//         <>
//             <div className="dashboard-stats">
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Active Courses</h3>
//                         <p className="stat-number">3</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Total Students</h3>
//                         <p className="stat-number">156</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Pending Grading</h3>
//                         <p className="stat-number">12</p>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
//                         </svg>
//                     </div>
//                     <div className="stat-content">
//                         <h3>Classes Today</h3>
//                         <p className="stat-number">2</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="dashboard-content">
//                 <div className="recent-courses">
//                     <h3>My Courses</h3>
//                     <div className="course-list">
//                         <div className="course-item">
//                             <div className="course-icon">📊</div>
//                             <div className="course-info">
//                                 <h4>Data Science 101</h4>
//                                 <p>45 Students • MWF 10:00 AM</p>
//                             </div>
//                             <button className="view-course-btn">Manage</button>
//                         </div>
//                         <div className="course-item">
//                             <div className="course-icon">🔬</div>
//                             <div className="course-info">
//                                 <h4>Advanced Analytics</h4>
//                                 <p>32 Students • TTh 2:00 PM</p>
//                             </div>
//                             <button className="view-course-btn">Manage</button>
//                         </div>
//                         <div className="course-item">
//                             <div className="course-icon">📈</div>
//                             <div className="course-info">
//                                 <h4>Business Intelligence</h4>
//                                 <p>58 Students • Online</p>
//                             </div>
//                             <button className="view-course-btn">Manage</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="upcoming-tasks">
//                     <h3>Today's Schedule</h3>
//                     <div className="task-list">
//                         <div className="task-item">
//                             <div className="task-date">
//                                 <span className="time">10:00</span>
//                                 <span className="period">AM</span>
//                             </div>
//                             <div className="task-info">
//                                 <h4>Data Science 101</h4>
//                                 <p>Room 203 • Lecture Hall</p>
//                             </div>
//                         </div>
//                         <div className="task-item">
//                             <div className="task-date">
//                                 <span className="time">2:00</span>
//                                 <span className="period">PM</span>
//                             </div>
//                             <div className="task-info">
//                                 <h4>Office Hours</h4>
//                                 <p>Building A • Room 415</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );

//     return (
//         <div className="dashboard-container">
//             <div className="dashboard-sidebar">
//                 <div className="sidebar-header">
//                     <h2>Dashboard</h2>
//                     <p className="user-type">{user?.type === 'student' ? 'Student' : 'Faculty'} Portal</p>
//                 </div>
                
//                 <nav className="sidebar-nav">
//                     <button 
//                         className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('overview')}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
//                         </svg>
//                         Overview
//                     </button>
//                     <button 
//                         className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('courses')}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
//                         </svg>
//                         Courses
//                     </button>
//                     <button 
//                         className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('calendar')}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
//                         </svg>
//                         Calendar
//                     </button>
//                     <button 
//                         className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('messages')}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
//                         </svg>
//                         Messages
//                     </button>
//                     <button 
//                         className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('settings')}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
//                         </svg>
//                         Settings
//                     </button>
//                 </nav>

//                 <div className="sidebar-footer">
//                     <div className="user-info">
//                         <div className="user-avatar">
//                             {user?.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="user-details">
//                             <p className="user-name">{user?.name}</p>
//                             <p className="user-email">{user?.email}</p>
//                         </div>
//                     </div>
//                     <button className="logout-btn" onClick={handleLogout}>
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
//                         </svg>
//                         Logout
//                     </button>
//                 </div>
//             </div>

//             <div className="dashboard-main">
//                 <div className="dashboard-header">
//                     <h1>Welcome back, {user?.name}!</h1>
//                     <p>Here's what's happening with your account today.</p>
//                 </div>

//                 {user?.type === 'student' ? renderStudentDashboard() : renderFacultyDashboard()}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const userRole = localStorage.getItem('userRole'); // Changed from userType to userRole
            const userEmail = localStorage.getItem('userEmail');

            if (!token) {
                history.push('/');
                return;
            }

            setUser({
                email: userEmail,
                type: userRole, // Map userRole to type for compatibility
                role: userRole, // Keep both for flexibility
                name: userEmail?.split('@')[0] || 'User'
            });
            setIsLoading(false);
        };

        checkAuth();
    }, [history]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole'); // Changed from userType to userRole
        localStorage.removeItem('userEmail');
        history.push('/');
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const renderStudentDashboard = () => (
        <>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Enrolled Courses</h3>
                        <p className="stat-number">4</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Assignments Due</h3>
                        <p className="stat-number">3</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Study Hours</h3>
                        <p className="stat-number">24</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Average Grade</h3>
                        <p className="stat-number">A-</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-courses">
                    <h3>Recent Courses</h3>
                    <div className="course-list">
                        <div className="course-item">
                            <div className="course-icon">📊</div>
                            <div className="course-info">
                                <h4>Data Science Fundamentals</h4>
                                <p>Progress: 75%</p>
                            </div>
                            <button className="view-course-btn">Continue</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">💻</div>
                            <div className="course-info">
                                <h4>Web Development</h4>
                                <p>Progress: 60%</p>
                            </div>
                            <button className="view-course-btn">Continue</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">🤖</div>
                            <div className="course-info">
                                <h4>Machine Learning</h4>
                                <p>Progress: 45%</p>
                            </div>
                            <button className="view-course-btn">Continue</button>
                        </div>
                    </div>
                </div>

                <div className="upcoming-tasks">
                    <h3>Upcoming Tasks</h3>
                    <div className="task-list">
                        <div className="task-item">
                            <div className="task-date">
                                <span className="day">25</span>
                                <span className="month">May</span>
                            </div>
                            <div className="task-info">
                                <h4>Data Analysis Project</h4>
                                <p>Due in 2 days</p>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="task-date">
                                <span className="day">28</span>
                                <span className="month">May</span>
                            </div>
                            <div className="task-info">
                                <h4>JavaScript Quiz</h4>
                                <p>Due in 5 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderTeacherDashboard = () => (
        <>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Active Courses</h3>
                        <p className="stat-number">3</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Total Students</h3>
                        <p className="stat-number">156</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Pending Grading</h3>
                        <p className="stat-number">12</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Classes Today</h3>
                        <p className="stat-number">2</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-courses">
                    <h3>My Courses</h3>
                    <div className="course-list">
                        <div className="course-item">
                            <div className="course-icon">📊</div>
                            <div className="course-info">
                                <h4>Data Science 101</h4>
                                <p>45 Students • MWF 10:00 AM</p>
                            </div>
                            <button className="view-course-btn">Manage</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">🔬</div>
                            <div className="course-info">
                                <h4>Advanced Analytics</h4>
                                <p>32 Students • TTh 2:00 PM</p>
                            </div>
                            <button className="view-course-btn">Manage</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">📈</div>
                            <div className="course-info">
                                <h4>Business Intelligence</h4>
                                <p>58 Students • Online</p>
                            </div>
                            <button className="view-course-btn">Manage</button>
                        </div>
                    </div>
                </div>

                <div className="upcoming-tasks">
                    <h3>Today's Schedule</h3>
                    <div className="task-list">
                        <div className="task-item">
                            <div className="task-date">
                                <span className="time">10:00</span>
                                <span className="period">AM</span>
                            </div>
                            <div className="task-info">
                                <h4>Data Science 101</h4>
                                <p>Room 203 • Lecture Hall</p>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="task-date">
                                <span className="time">2:00</span>
                                <span className="period">PM</span>
                            </div>
                            <div className="task-info">
                                <h4>Office Hours</h4>
                                <p>Building A • Room 415</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderAdminDashboard = () => (
        <>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">245</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Active Courses</h3>
                        <p className="stat-number">18</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l3.12 1.85c.3.18.68.09.86-.21s.09-.68-.21-.86l-2.76-1.63v-4.65c0-.4-.32-.72-.72-.72z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Pending Approvals</h3>
                        <p className="stat-number">5</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>System Health</h3>
                        <p className="stat-number">98%</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-courses">
                    <h3>System Overview</h3>
                    <div className="course-list">
                        <div className="course-item">
                            <div className="course-icon">👥</div>
                            <div className="course-info">
                                <h4>User Management</h4>
                                <p>Manage users and permissions</p>
                            </div>
                            <button className="view-course-btn">Manage</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">📚</div>
                            <div className="course-info">
                                <h4>Course Management</h4>
                                <p>Oversee all courses</p>
                            </div>
                            <button className="view-course-btn">Manage</button>
                        </div>
                        <div className="course-item">
                            <div className="course-icon">⚙️</div>
                            <div className="course-info">
                                <h4>System Settings</h4>
                                <p>Configure system parameters</p>
                            </div>
                            <button className="view-course-btn">Configure</button>
                        </div>
                    </div>
                </div>

                <div className="upcoming-tasks">
                    <h3>Recent Activity</h3>
                    <div className="task-list">
                        <div className="task-item">
                            <div className="task-date">
                                <span className="day">5</span>
                                <span className="month">New</span>
                            </div>
                            <div className="task-info">
                                <h4>User Registrations</h4>
                                <p>Pending approval</p>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="task-date">
                                <span className="day">2</span>
                                <span className="month">New</span>
                            </div>
                            <div className="task-info">
                                <h4>Course Requests</h4>
                                <p>From faculty members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderDashboardContent = () => {
        const userRole = user?.type || user?.role;
        
        switch(userRole) {
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

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>Dashboard</h2>
                    <p className="user-type">{user?.type === 'student' ? 'Student' : user?.type === 'teacher' ? 'Teacher' : 'Admin'} Portal</p>
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
                        {user?.type === 'admin' ? 'System' : 'Courses'}
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('calendar')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        </svg>
                        Calendar
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
                    <h1>Welcome back, {user?.name}!</h1>
                    <p>Here's what's happening with your account today.</p>
                </div>

                {renderDashboardContent()}
            </div>
        </div>
    );
};

export default Dashboard;
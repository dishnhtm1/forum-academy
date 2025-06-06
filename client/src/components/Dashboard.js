import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Dashboard = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [applicationSubmissions, setApplicationSubmissions] = useState([]);
    const [contactSubmissions, setContactSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTermApp, setSearchTermApp] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedAppStatus, setSelectedAppStatus] = useState('');
    const [searchTermContact, setSearchTermContact] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedContactStatus, setSelectedContactStatus] = useState('');
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [newUserData, setNewUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    });

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
    // Base API URL
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

    const handleEditUser = (user) => {
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
            const token = getToken(); // Use helper function
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
                const updatedUser = await response.json();
                
                // Update the user in the local state
                setAllUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === editingUser._id ? updatedUser : user
                    )
                );
                
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

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteUser = async () => {
        try {
            const token = getToken(); // ✅ Use helper function consistently
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
                
                // Remove user from local state
                setAllUsers(prevUsers => 
                    prevUsers.filter(user => user._id !== userToDelete._id)
                );
                
                setShowDeleteConfirm(false);
                setUserToDelete(null);
                
                alert('User deleted successfully!');
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

    // Add this filtering function before the renderUserManagement function
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

    // Add these filter functions before the render functions
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

    // Add course creation handler
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
            const token = getToken(); // Use helper function
            
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
        <div className="space-y-8">
            {/* Hero Section - Learning Journey */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-gray-200 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Progress Circle */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-48 h-48">
                            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke="rgba(229, 231, 235, 0.8)" 
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
                                    <div className="text-4xl font-bold text-gray-900 mb-1">{dashboardData.student.journeyProgress}%</div>
                                    <div className="text-sm text-gray-600 font-medium">Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Journey Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h1>
                            <p className="text-gray-600 text-lg">Keep up the amazing progress! You're doing great.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🎯</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{dashboardData.student.completedMilestones}</div>
                                        <div className="text-sm text-gray-600">Milestones Achieved</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {dashboardData.student.totalMilestones - dashboardData.student.completedMilestones} more to go
                                </div>
                            </div>
    
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🔥</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{dashboardData.student.streak}</div>
                                        <div className="text-sm text-gray-600">Day Streak</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Keep it up!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This month</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Urgent</span>
                            <span className="font-semibold text-red-600">1 due soon</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Weekly goal</span>
                            <span className="font-semibold text-purple-600">{dashboardData.student.studyGoals.weekly}h</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Improvement</span>
                            <span className="font-semibold text-green-600">+0.2</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Recommendations */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">🤖</span>
                                AI Study Recommendations
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Personalized suggestions to boost your learning</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">🔥</span>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                High Priority
                                            </span>
                                            <div className="text-sm text-gray-600 mt-1">Estimated: 45 minutes</div>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Review Statistical Hypothesis Testing</h4>
                                <p className="text-gray-600 mb-4">Based on your recent quiz performance, focusing on this topic will boost your Data Science grade significantly.</p>
                                <div className="flex space-x-3">
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <span className="mr-2">🚀</span>
                                        Start Study Session
                                    </button>
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="mr-2">📅</span>
                                        Schedule Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">📅</span>
                                Upcoming Deadlines
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Stay on top of your assignments</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {dashboardData.student.upcomingDeadlines.map(deadline => (
                                    <div key={deadline.id} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                                        deadline.urgent ? 'bg-red-25 border-red-200' : 'bg-gray-50 border-gray-200'
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
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{deadline.title}</h4>
                                            <p className="text-sm text-gray-600">{deadline.course}</p>
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">📈</span>
                                Performance Insights
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
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
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">⚡</span>
                                Quick Actions
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Get things done faster</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                                    <span className="text-sm font-medium text-gray-700">Ask Question</span>
                                </button>
                                <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                    <span className="text-sm font-medium text-gray-700">Take Quiz</span>
                                </button>
                                <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</span>
                                    <span className="text-sm font-medium text-gray-700">Set Goal</span>
                                </button>
                                <button className="flex flex-col items-center p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors group">
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📖</span>
                                    <span className="text-sm font-medium text-gray-700">Study Notes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentCourses = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">📚</span>
                        My Learning Path
                    </h2>
                    <p className="text-gray-600">Track your progress across all enrolled courses</p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <span className="mr-2">🔍</span>
                    Browse More Courses
                </button>
            </div>
    
            {/* Learning Progress Overview */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">📊</span>
                        Overall Progress
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Your learning statistics at a glance</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="2"
                                        strokeDasharray="75, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">75%</span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">Course Completion</h4>
                            <p className="text-sm text-gray-600">3 of 4 courses completed</p>
                        </div>
    
                        <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="2"
                                        strokeDasharray="88, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-green-600">88%</span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">Assignment Score</h4>
                            <p className="text-sm text-gray-600">Average across all courses</p>
                        </div>
    
                        <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="2"
                                        strokeDasharray="60, 100" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-orange-600">60%</span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">Study Goal</h4>
                            <p className="text-sm text-gray-600">12h of 20h weekly goal</p>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">📖</span>
                        Enrolled Courses
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Continue your learning journey</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        📊
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Data Science
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">Beginner Level</div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Introduction to Data Science</h4>
                            <p className="text-gray-600 text-sm mb-4">Learn the fundamentals of data analysis, visualization, and statistical thinking.</p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold text-gray-900">85% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Next: Python Basics</div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="mr-1">📁</span>
                                    Materials
                                </button>
                            </div>
                        </div>
    
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        💻
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Web Development
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">Intermediate Level</div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Full-Stack JavaScript</h4>
                            <p className="text-gray-600 text-sm mb-4">Master modern JavaScript development with React, Node.js, and MongoDB.</p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold text-gray-900">62% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" style={{width: '62%'}}></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Next: React Hooks</div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">📊</span>
                        Learning Analytics
                    </h2>
                    <p className="text-gray-600">Track your progress and discover insights about your learning journey</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Since last week</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +2 days
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Improvement</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +5.2%
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This week</span>
                            <span className="font-semibold text-orange-600">Goal: 20h</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This month</span>
                            <span className="font-semibold text-purple-600">75% rate</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Trends */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📈</span>
                            Performance Trends
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Your weekly progress overview</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Chart */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
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
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {bar.value}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600 mt-2 font-medium">{bar.week}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Performance Insights */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-green-600 text-lg">📈</span>
                                        <span className="text-sm font-semibold text-green-800">Best Week</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-900">Week 4</div>
                                    <div className="text-xs text-green-600">92% average score</div>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-orange-600 text-lg">🎯</span>
                                        <span className="text-sm font-semibold text-orange-800">Focus Area</span>
                                    </div>
                                    <div className="text-sm font-bold text-orange-900">Time Management</div>
                                    <div className="text-xs text-orange-600">Needs improvement</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Subject Performance */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📚</span>
                            Subject Performance
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Performance across different subjects</p>
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
                                                <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                                                <div className="text-sm text-gray-500">Current progress</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900">{subject.score}%</div>
                                            <div className={`text-sm font-medium ${
                                                subject.trend.startsWith('+') ? 'text-green-600' : 
                                                subject.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                                {subject.trend}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🏆</span>
                            Recent Achievements
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Your latest milestones and badges</p>
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
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{achievement.desc}</p>
                                        <span className="text-xs text-gray-500 font-medium">{achievement.date}</span>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <span className="text-lg">🔗</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-blue-900">Next Achievement</h4>
                                    <p className="text-sm text-blue-700">Study for 30 days straight</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-blue-900">7/30</div>
                                    <div className="text-xs text-blue-600">Days completed</div>
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '23%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Study Patterns */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">⏰</span>
                            Study Patterns
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">When you learn best</p>
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
                                    <div className="w-20 text-sm font-medium text-gray-700">{pattern.time}</div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`${pattern.color} h-3 rounded-full transition-all duration-1000`}
                                            style={{ width: `${pattern.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-16 text-sm font-medium text-gray-700">{pattern.level}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3">
                                <span className="text-green-600 text-2xl">💡</span>
                                <div>
                                    <h4 className="font-semibold text-green-900">Productivity Tip</h4>
                                    <p className="text-sm text-green-700">You're most focused at 9 AM and 2 PM. Schedule your toughest topics during these times!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentMessages = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">💬</span>
                        Messages & Discussions
                    </h2>
                    <p className="text-gray-600">Connect with instructors, join study groups, and get help</p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <span className="mr-2">❓</span>
                    Ask Question
                </button>
            </div>
    
            {/* Message Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
                    {['All Messages', 'My Questions', 'Study Groups', 'Announcements'].map((tab, index) => (
                        <button 
                            key={index}
                            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                                index === 0 
                                    ? 'text-blue-600 border-blue-600 bg-white' 
                                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
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
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden">
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
                                            <span className="font-semibold text-gray-900">Dr. Smith</span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Data Science 101
                                            </span>
                                            <span className="text-gray-500">2 hours ago</span>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">Assignment 3 - Additional Resources</h4>
                                        <p className="text-gray-600">I've uploaded some additional practice problems for the statistical analysis assignment. These will help you prepare for the upcoming quiz. Please review them before our next class.</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="flex items-center text-gray-500">
                                                    <span className="mr-1">💬</span>
                                                    3 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    📢 Announcement
                                                </span>
                                            </div>
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Study Group Message */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        👥
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="font-semibold text-gray-900">Study Group #3</span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                JavaScript Fundamentals
                                            </span>
                                            <span className="text-gray-500">5 hours ago</span>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">Weekly Study Session - React Hooks</h4>
                                        <p className="text-gray-600">Hey everyone! This week we're covering React Hooks. Anyone wants to join our virtual session this Saturday at 2 PM? We'll be going through useState and useEffect with practical examples.</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="flex items-center text-gray-500">
                                                    <span className="mr-1">💬</span>
                                                    8 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    👥 Study Group
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                                                    Join
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Question Thread */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        ME
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="font-semibold text-gray-900">My Question</span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Machine Learning
                                            </span>
                                            <span className="text-gray-500">1 day ago</span>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">Understanding Gradient Descent</h4>
                                        <p className="text-gray-600">I'm having trouble understanding how the learning rate affects the gradient descent algorithm. Could someone explain with a simple example?</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="flex items-center text-gray-500">
                                                    <span className="mr-1">💬</span>
                                                    2 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    ❓ Question
                                                </span>
                                            </div>
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
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
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">🚀</span>
                                        Quick Help
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: '💡', label: 'Study Tips', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
                                            { icon: '🔧', label: 'Tech Support', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
                                            { icon: '📚', label: 'Materials', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
                                            { icon: '⏰', label: 'Schedule', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' }
                                        ].map((item, index) => (
                                            <button key={index} className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${item.color}`}>
                                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
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
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{group.name}</div>
                                                    <div className="text-sm text-gray-500">{group.members} members</div>
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">⚙️</span>
                        Learning Preferences
                    </h2>
                    <p className="text-gray-600">Customize your learning experience and notification preferences</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        🔄 Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        💾 Save Preferences
                    </button>
                </div>
            </div>
    
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Learning Goals */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🎯</span>
                            Learning Goals
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Set your study targets and preferences</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Weekly Study Goal</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    defaultValue="20"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Hours"
                                />
                                <span className="text-sm text-gray-500 font-medium">hours per week</span>
                            </div>
                            <div className="text-xs text-gray-500">Current progress: 14/20 hours this week</div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Preferred Learning Style</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                                <option>Visual Learner</option>
                                <option>Auditory Learner</option>
                                <option>Kinesthetic Learner</option>
                                <option>Reading/Writing Learner</option>
                            </select>
                            <div className="text-xs text-gray-500">Helps us recommend the best content format for you</div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Daily Study Reminder</label>
                            <div className="flex items-center space-x-3">
                                <input 
                                    type="checkbox" 
                                    defaultChecked 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Send me daily study reminders</span>
                            </div>
                            <div className="text-xs text-gray-500">Get reminded to study at your optimal time</div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Difficulty Preference</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Beginner', 'Intermediate', 'Advanced', 'Adaptive'].map((level, index) => (
                                    <label key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="difficulty" 
                                            defaultChecked={level === 'Adaptive'}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🔔</span>
                            Notification Preferences
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Control when and how you receive updates</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {[
                            {
                                title: 'Assignment Reminders',
                                desc: 'Remind me 24 hours before due dates',
                                checked: true
                            },
                            {
                                title: 'Course Updates',
                                desc: 'Notify me of new course materials',
                                checked: true
                            },
                            {
                                title: 'Discussion Replies',
                                desc: 'Email me when someone replies to my questions',
                                checked: false
                            },
                            {
                                title: 'Study Group Invites',
                                desc: 'Allow study group invitations',
                                checked: true
                            },
                            {
                                title: 'Achievement Notifications',
                                desc: 'Celebrate milestones and badges',
                                checked: true
                            },
                            {
                                title: 'Weekly Progress Reports',
                                desc: 'Get weekly learning summaries',
                                checked: false
                            }
                        ].map((setting, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input 
                                    type="checkbox" 
                                    defaultChecked={setting.checked}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{setting.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">{setting.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Dashboard Customization */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📱</span>
                            Dashboard Customization
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Personalize your dashboard appearance</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Theme Preference</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { name: 'Light', icon: '☀️', active: true },
                                    { name: 'Dark', icon: '🌙', active: false },
                                    { name: 'Auto', icon: '🔄', active: false }
                                ].map((theme, index) => (
                                    <label key={index} className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                        theme.active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="theme" 
                                            defaultChecked={theme.active}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl mb-2">{theme.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
    
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Show Progress Animations',
                                    desc: 'Enable animated progress indicators',
                                    checked: true
                                },
                                {
                                    title: 'Compact View',
                                    desc: 'Use compact layout for courses',
                                    checked: false
                                },
                                {
                                    title: 'Show Motivational Quotes',
                                    desc: 'Display daily inspiration',
                                    checked: true
                                }
                            ].map((setting, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={setting.checked}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{setting.title}</div>
                                        <div className="text-sm text-gray-600 mt-1">{setting.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    
                {/* Academic Preferences */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🎓</span>
                            Academic Preferences
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Configure your academic experience</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Quiz Settings</label>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Auto-Submit Quizzes</div>
                                        <div className="text-sm text-gray-600 mt-1">Automatically submit when time expires</div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Show Detailed Feedback</div>
                                        <div className="text-sm text-gray-600 mt-1">Show explanations for quiz answers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Study Reminders</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div>
                                        <div className="font-medium text-gray-900">Break Reminders</div>
                                        <div className="text-sm text-gray-600">Remind me to take breaks</div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div>
                                        <div className="font-medium text-gray-900">Focus Mode</div>
                                        <div className="text-sm text-gray-600">Block distracting websites during study</div>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Privacy & Security */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">🔒</span>
                        Privacy & Security
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Manage your privacy settings and account security</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Profile Visibility</h4>
                            {[
                                { title: 'Show study streak to others', checked: true },
                                { title: 'Allow others to see my achievements', checked: false },
                                { title: 'Show my progress in study groups', checked: true }
                            ].map((setting, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={setting.checked}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{setting.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Account Security</h4>
                            <div className="space-y-3">
                                <button className="w-full text-left p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="font-medium text-gray-900">Change Password</div>
                                    <div className="text-sm text-gray-600">Last changed 2 months ago</div>
                                </button>
                                <button className="w-full text-left p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                                    <div className="text-sm text-gray-600">Not enabled</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
        <div className="space-y-8">
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
                                            {dashboardData.teacher.studentSentiment.toUpperCase()}
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
                <div className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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
                            <span className="text-gray-600">This semester</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="text-green-400 mr-1">↗</span>
                                +12 new
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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
                            <span className="text-gray-600">Response rate</span>
                            <span className="font-semibold text-emerald-600">87%</span>
                        </div>
                    </div>
                </div>
    
                <div className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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
                            <span className="text-gray-600">Due soon</span>
                            <span className="font-semibold text-red-600 flex items-center">
                                <span className="text-red-400 mr-1">⚠</span>
                                2 overdue
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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
                            <span className="text-gray-600">This week</span>
                            <span className="font-semibold text-purple-600">12 total</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Topic Engagement Heatmap */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">🔥</span>
                            Topic Engagement Heatmap
                        </h3>
                        <p className="text-gray-600 mt-1">Student engagement levels across different topics</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {Object.entries(dashboardData.teacher.engagementHeatmap).map(([topic, engagement]) => (
                                <div key={topic} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{topic}</span>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                                            engagement > 80 ? 'text-green-700 bg-green-100' : 
                                            engagement > 60 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
                                        }`}>
                                            {engagement}%
                                        </span>
                                    </div>
                                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
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
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">Engagement Insight</h4>
                                    <p className="text-sm text-blue-700">
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="mr-2 text-xl">🤖</span>
                                AI Teaching Insights
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">Smart recommendations for your classes</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">📊</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                                                Data-Driven Recommendation
                                            </span>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Consider Additional Practice for Machine Learning
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                71% engagement suggests students may benefit from more interactive examples 
                                                and hands-on coding exercises.
                                            </p>
                                            <div className="flex space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">🚀</span>
                                                    Create Session
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1.5 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="mr-2 text-xl">🛠️</span>
                                Quick Teaching Tools
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">Instant access to common actions</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '📊', label: 'Create Poll', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' },
                                    { icon: '📝', label: 'New Quiz', color: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' },
                                    { icon: '📢', label: 'Announcement', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700' },
                                    { icon: '📈', label: 'Grade Assignments', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' }
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <span className="mr-3 text-2xl">⚡</span>
                                Real-time Activity
                            </h3>
                            <p className="text-gray-600 mt-1">Live updates from your students</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-500 font-medium">Live</span>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {dashboardData.teacher.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                                    activity.type === 'quiz_completed' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                }`}>
                                    {activity.type === 'quiz_completed' ? '✅' : '❓'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {activity.type === 'quiz_completed' ? (
                                        <>
                                            <p className="text-sm font-semibold text-gray-900">
                                                <span className="text-blue-600">{activity.student}</span> completed a quiz
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-sm text-gray-600">{activity.course}</span>
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
                                            <p className="text-sm font-semibold text-gray-900">
                                                <span className="text-blue-600">{activity.student}</span> asked a question
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-sm text-gray-600">{activity.course}</span>
                                                <span className="text-sm text-gray-500">{activity.time}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-blue-600">
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
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-4xl">📚</span>
                        My Courses
                    </h2>
                    <p className="text-gray-600 text-lg">Manage your courses and track student progress</p>
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <span className="mr-3 text-3xl">🎓</span>
                                    Create New Course
                                </h3>
                                <button 
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <span className="text-2xl text-gray-500">✕</span>
                                </button>
                            </div>
                            <p className="text-gray-600 mt-2">Fill in the details to create your new course</p>
                        </div>

                        <form onSubmit={handleCreateCourse} className="p-6 space-y-6">
                            {/* Course Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newCourseData.title}
                                    onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g., Introduction to Data Science"
                                />
                            </div>

                            {/* Course Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Description *
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newCourseData.description}
                                    onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Describe what students will learn in this course..."
                                />
                            </div>

                            {/* Category and Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.category}
                                        onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Difficulty Level *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.level}
                                        onChange={(e) => setNewCourseData({...newCourseData, level: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Duration (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.duration}
                                        onChange={(e) => setNewCourseData({...newCourseData, duration: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., 12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Max Students
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.maxStudents}
                                        onChange={(e) => setNewCourseData({...newCourseData, maxStudents: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>

                            {/* Price and Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newCourseData.price}
                                        onChange={(e) => setNewCourseData({...newCourseData, price: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={newCourseData.tags}
                                        onChange={(e) => setNewCourseData({...newCourseData, tags: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., python, data, statistics (comma separated)"
                                    />
                                </div>
                            </div>

                            {/* Syllabus */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Syllabus
                                </label>
                                <textarea
                                    rows="6"
                                    value={newCourseData.syllabus}
                                    onChange={(e) => setNewCourseData({...newCourseData, syllabus: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Week 1: Introduction to concepts&#10;Week 2: Core fundamentals&#10;Week 3: Practical applications..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This semester</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Enrolled</span>
                            <span className="font-semibold text-emerald-600">+12 this week</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Assignments</span>
                            <span className="font-semibold text-red-600">2 overdue</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Student feedback</span>
                            <span className="font-semibold text-purple-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Active Courses Grid */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-2xl">🎯</span>
                        Active Courses
                    </h3>
                    <p className="text-gray-600 mt-1">Manage and monitor your ongoing courses</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Data Science Course */}
                        <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                            
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
                                            <div className="text-xs text-gray-500 mt-1">Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                    Data Science 101
                                </h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Introduction to data analysis, visualization, and statistical thinking
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-blue-600">45</div>
                                        <div className="text-xs text-gray-600 font-medium">Students</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-green-600">12</div>
                                        <div className="text-xs text-gray-600 font-medium">Lessons</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-orange-600">89%</div>
                                        <div className="text-xs text-gray-600 font-medium">Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Course Progress</span>
                                        <span className="font-semibold text-blue-600">89%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000" style={{width: '89%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Machine Learning Course */}
                        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                            
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
                                            <div className="text-xs text-gray-500 mt-1">Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                                    Machine Learning Basics
                                </h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Fundamental concepts of ML algorithms and practical applications
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-green-600">38</div>
                                        <div className="text-xs text-gray-600 font-medium">Students</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-blue-600">16</div>
                                        <div className="text-xs text-gray-600 font-medium">Lessons</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-yellow-600">71%</div>
                                        <div className="text-xs text-gray-600 font-medium">Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Course Progress</span>
                                        <span className="font-semibold text-green-600">71%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000" style={{width: '71%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Python Programming Course - Draft */}
                        <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                            
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
                                            <div className="text-xs text-gray-500 mt-1">Spring 2025</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                                    Advanced Python Programming
                                </h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Deep dive into Python frameworks, libraries, and advanced concepts
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-gray-400">0</div>
                                        <div className="text-xs text-gray-600 font-medium">Students</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-orange-600">8</div>
                                        <div className="text-xs text-gray-600 font-medium">Lessons</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-yellow-600">45%</div>
                                        <div className="text-xs text-gray-600 font-medium">Complete</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Development Progress</span>
                                        <span className="font-semibold text-orange-600">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 h-3 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">🔨</span>
                                        Continue Building
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium">
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-2xl">📝</span>
                        Assignments Awaiting Review
                    </h3>
                    <p className="text-gray-600 mt-1">Grade pending assignments and provide feedback</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Urgent Assignment */}
                        <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300 group">
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
                                    <h4 className="text-lg font-bold text-gray-900">Data Visualization Project</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        ⚠️ Overdue
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">Data Science 101 • Due: 2 days ago</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="flex items-center text-gray-500">
                                        <span className="mr-1">📄</span>
                                        23 submissions
                                    </span>
                                    <span className="flex items-center text-gray-500">
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
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="mr-1">👁️</span>
                                    Preview
                                </button>
                            </div>
                        </div>
    
                        {/* Regular Assignment */}
                        <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                🤖
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">ML Algorithm Quiz</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        📅 Due Tomorrow
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">Machine Learning Basics • Due: Tomorrow</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="flex items-center text-gray-500">
                                        <span className="mr-1">📄</span>
                                        31 submissions
                                    </span>
                                    <span className="flex items-center text-gray-500">
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
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="mr-1">📊</span>
                                    Analytics
                                </button>
                            </div>
                        </div>
    
                        {/* Additional Assignment */}
                        <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                📈
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">Statistical Analysis Report</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✅ On Time
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">Data Science 101 • Due: Next week</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="flex items-center text-gray-500">
                                        <span className="mr-1">📄</span>
                                        18 submissions
                                    </span>
                                    <span className="flex items-center text-gray-500">
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
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="mr-1">⚙️</span>
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">⚡</span>
                            Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Create Assignment</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Grade Book</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📢</span>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Announcement</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</span>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Analytics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderTeacherAnalytics = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-4xl">📈</span>
                        Course Analytics
                    </h2>
                    <p className="text-gray-600 text-lg">Comprehensive insights into student performance and engagement</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Improvement</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +3.2%
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Active learners</span>
                            <span className="font-semibold text-emerald-600">143/156</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Per week</span>
                            <span className="font-semibold text-orange-600">Goal: 6h</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Assignments</span>
                            <span className="font-semibold text-purple-600">On track</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Performance Trends */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">📈</span>
                            Performance Trends
                        </h3>
                        <p className="text-gray-600 mt-1">Weekly student performance overview</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Chart Visualization */}
                            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                <div className="flex items-end justify-between h-full space-x-3">
                                    {[
                                        { week: 'Week 1', height: '60%', value: '78%', color: 'bg-blue-500', trend: 'baseline' },
                                        { week: 'Week 2', height: '75%', value: '82%', color: 'bg-green-500', trend: 'up' },
                                        { week: 'Week 3', height: '80%', value: '85%', color: 'bg-emerald-500', trend: 'up' },
                                        { week: 'Week 4', height: '70%', value: '81%', color: 'bg-yellow-500', trend: 'down' },
                                        { week: 'Week 5', height: '85%', value: '87%', color: 'bg-purple-500', trend: 'up' }
                                    ].map((bar, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="relative group mb-2">
                                                <div 
                                                    className={`w-full ${bar.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer`}
                                                    style={{ height: bar.height }}
                                                ></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {bar.value} average
                                                </div>
                                                {/* Trend indicator */}
                                                <div className="absolute -top-3 -right-1">
                                                    {bar.trend === 'up' && <span className="text-green-500 text-xs">↗</span>}
                                                    {bar.trend === 'down' && <span className="text-red-500 text-xs">↘</span>}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium text-center">{bar.week}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Performance Insights */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-green-600 text-xl">🏆</span>
                                        <span className="text-sm font-semibold text-green-800">Best Performing</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-900">Week 5</div>
                                    <div className="text-xs text-green-600">87% class average</div>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-orange-600 text-xl">🎯</span>
                                        <span className="text-sm font-semibold text-orange-800">Improvement Area</span>
                                    </div>
                                    <div className="text-sm font-bold text-orange-900">Consistency</div>
                                    <div className="text-xs text-orange-600">Week 4 dip noted</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Engagement by Time */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">⏰</span>
                            Engagement by Time
                        </h3>
                        <p className="text-gray-600 mt-1">Student activity patterns throughout the day</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { time: '9:00 AM', level: 'High', percentage: 95, color: 'bg-green-500', emoji: '🔥' },
                                { time: '11:00 AM', level: 'Medium', percentage: 70, color: 'bg-yellow-500', emoji: '📚' },
                                { time: '2:00 PM', level: 'High', percentage: 90, color: 'bg-green-500', emoji: '🔥' },
                                { time: '4:00 PM', level: 'Low', percentage: 45, color: 'bg-red-500', emoji: '😴' },
                                { time: '7:00 PM', level: 'Medium', percentage: 75, color: 'bg-yellow-500', emoji: '📚' }
                            ].map((pattern, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="w-20 text-sm font-medium text-gray-700">{pattern.time}</div>
                                    <span className="text-lg">{pattern.emoji}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                        <div 
                                            className={`${pattern.color} h-4 rounded-full transition-all duration-1000 relative`}
                                            style={{ width: `${pattern.percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                        </div>
                                    </div>
                                    <div className="w-16 text-sm font-medium text-gray-700 text-right">{pattern.level}</div>
                                    <div className="w-12 text-sm font-bold text-gray-900 text-right">{pattern.percentage}%</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className="font-semibold text-blue-900">Teaching Tip</h4>
                                    <p className="text-sm text-blue-700">Schedule important topics during 9 AM and 2 PM when engagement is highest!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Top Performing Students */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">🏆</span>
                            Top Performing Students
                        </h3>
                        <p className="text-gray-600 mt-1">Leaderboard of highest achievers</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { rank: 1, name: 'Alice Johnson', score: '95.2%', trend: '+2.1%', avatar: 'AJ', color: 'bg-yellow-500' },
                                { rank: 2, name: 'Bob Smith', score: '92.8%', trend: '+1.5%', avatar: 'BS', color: 'bg-gray-400' },
                                { rank: 3, name: 'Carol Davis', score: '90.1%', trend: '+0.8%', avatar: 'CD', color: 'bg-orange-500' },
                                { rank: 4, name: 'David Wilson', score: '88.9%', trend: '-0.3%', avatar: 'DW', color: 'bg-blue-500' },
                                { rank: 5, name: 'Emma Brown', score: '87.6%', trend: '+1.2%', avatar: 'EB', color: 'bg-purple-500' }
                            ].map((student, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                            student.rank === 1 ? 'bg-yellow-500' :
                                            student.rank === 2 ? 'bg-gray-400' :
                                            student.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                                        }`}>
                                            {student.rank}
                                        </div>
                                        <div className={`w-10 h-10 ${student.color} rounded-xl flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform`}>
                                            {student.avatar}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-500">Current average</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-900">{student.score}</div>
                                        <div className={`text-sm font-medium ${
                                            student.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {student.trend}
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-blue-600">
                                        <span className="text-lg">→</span>
                                    </button>
                                </div>
                            ))}
                        </div>
    
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-green-900">Class Average</h4>
                                    <p className="text-sm text-green-700">Overall performance metrics</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-900">85.4%</div>
                                    <div className="text-sm text-green-600">+3.2% this month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Assignment Completion Rates */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">📋</span>
                            Assignment Completion
                        </h3>
                        <p className="text-gray-600 mt-1">Track assignment submission and completion rates</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
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
                                                <h4 className="font-semibold text-gray-900">{assignment.name}</h4>
                                                <div className="text-sm text-gray-500">{assignment.submissions}/{assignment.total} submitted</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900">{assignment.completion}%</div>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                assignment.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                                assignment.status === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {assignment.status === 'excellent' ? '🌟 Excellent' :
                                                    assignment.status === 'good' ? '👍 Good' : '⚠️ Needs Attention'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`${assignment.color} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                                            style={{ width: `${assignment.completion}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
    
                        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Overall Completion Rate</span>
                                <span className="text-lg font-bold text-gray-900">86.5%</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Above institutional average of 82%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Detailed Analytics Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-2xl">📊</span>
                        Analytics Summary
                    </h3>
                    <p className="text-gray-600 mt-1">Key insights and recommendations</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-green-600 text-3xl">🎯</span>
                                <div>
                                    <h4 className="font-bold text-green-900">Strengths</h4>
                                    <p className="text-sm text-green-700">What's working well</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-green-800">
                                <li className="flex items-center"><span className="mr-2">✅</span>High engagement during morning sessions</li>
                                <li className="flex items-center"><span className="mr-2">✅</span>Excellent assignment completion rates</li>
                                <li className="flex items-center"><span className="mr-2">✅</span>Strong student performance trends</li>
                            </ul>
                        </div>
    
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-orange-600 text-3xl">⚠️</span>
                                <div>
                                    <h4 className="font-bold text-orange-900">Areas to Improve</h4>
                                    <p className="text-sm text-orange-700">Focus areas</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-orange-800">
                                <li className="flex items-center"><span className="mr-2">📈</span>Afternoon engagement drops</li>
                                <li className="flex items-center"><span className="mr-2">📈</span>Some students need extra support</li>
                                <li className="flex items-center"><span className="mr-2">📈</span>ML topics need simplification</li>
                            </ul>
                        </div>
    
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-blue-600 text-3xl">💡</span>
                                <div>
                                    <h4 className="font-bold text-blue-900">Recommendations</h4>
                                    <p className="text-sm text-blue-700">Action items</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-center"><span className="mr-2">🚀</span>Schedule key topics in AM</li>
                                <li className="flex items-center"><span className="mr-2">🚀</span>Add interactive ML examples</li>
                                <li className="flex items-center"><span className="mr-2">🚀</span>Offer additional office hours</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderTeacherMessages = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-4xl">💬</span>
                        Messages & Communications
                    </h2>
                    <p className="text-gray-600 text-lg">Connect with students and manage course communications</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Today</span>
                            <span className="font-semibold text-red-600">5 urgent</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This week</span>
                            <span className="font-semibold text-green-600">92% answered</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">This month</span>
                            <span className="font-semibold text-purple-600">86% read</span>
                        </div>
                    </div>
                </div>
    
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
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
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Response time</span>
                            <span className="font-semibold text-green-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Messages Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="mr-2 text-xl">🔍</span>
                                Message Filters
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { label: 'All Messages', count: 156, active: true, color: 'text-blue-600 bg-blue-50' },
                                    { label: 'Unread', count: 23, active: false, color: 'text-red-600 bg-red-50' },
                                    { label: 'Student Questions', count: 47, active: false, color: 'text-green-600 bg-green-50' },
                                    { label: 'Announcements', count: 8, active: false, color: 'text-purple-600 bg-purple-50' },
                                    { label: 'Urgent', count: 5, active: false, color: 'text-orange-600 bg-orange-50' }
                                ].map((filter, index) => (
                                    <button key={index} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${
                                        filter.active ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <span className={`font-medium ${filter.active ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {filter.label}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${filter.color}`}>
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="mr-2 text-xl">⚡</span>
                                Quick Actions
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { icon: '📢', label: 'Send Announcement', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' },
                                    { icon: '📅', label: 'Schedule Reminder', color: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' },
                                    { icon: '🎯', label: 'Grade Notification', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' },
                                    { icon: '📚', label: 'Share Resources', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700' }
                                ].map((action, index) => (
                                    <button key={index} className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all group ${action.color}`}>
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-500 font-medium">Live Updates</span>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <div className="divide-y divide-gray-200">
                                {/* Urgent Message */}
                                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 hover:bg-red-100 transition-colors cursor-pointer group">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            JS
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="font-semibold text-gray-900">John Smith</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    🚨 Urgent
                                                </span>
                                                <span className="text-sm text-gray-500">2 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Data Science 101
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-medium mb-1">Question about regression analysis assignment</p>
                                            <p className="text-sm text-gray-600">I'm having trouble understanding the difference between linear and logistic regression. Could you please provide some clarification before the deadline tomorrow?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">⚡</span>
                                                    Reply Now
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                    <span className="mr-1">📞</span>
                                                    Schedule Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Regular Message */}
                                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            MJ
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="font-semibold text-gray-900">Mary Johnson</span>
                                                <span className="text-sm text-gray-500">5 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Machine Learning Basics
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-medium mb-1">Thank you for the detailed feedback</p>
                                            <p className="text-sm text-gray-600">Your comments on my neural network project were very helpful. I've implemented the suggested improvements and would love to get your thoughts...</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">💬</span>
                                                    Reply
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                    <span className="mr-1">👁️</span>
                                                    View Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* System Message */}
                                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            <span className="text-lg">🏫</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="font-semibold text-gray-900">Admin Department</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    System
                                                </span>
                                                <span className="text-sm text-gray-500">1 day ago</span>
                                            </div>
                                            <p className="text-gray-700 font-medium mb-1">Grade submission deadline reminder</p>
                                            <p className="text-sm text-gray-600">Please remember that final grades for the current semester are due by Friday, June 15th at 11:59 PM...</p>
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
                                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            AL
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="font-semibold text-gray-900">Alice Lee</span>
                                                <span className="text-sm text-gray-500">2 days ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Python Programming
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-medium mb-1">Request for office hours</p>
                                            <p className="text-sm text-gray-600">I would like to schedule some one-on-one time to discuss my final project proposal. When would be a good time for you?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">📅</span>
                                                    Schedule Meeting
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
                    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="mr-2 text-xl">📢</span>
                                Quick Announcement Templates
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Send common announcements with one click</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { 
                                        title: 'Assignment Reminder', 
                                        desc: 'Remind students about upcoming deadlines',
                                        icon: '⏰',
                                        color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700'
                                    },
                                    { 
                                        title: 'Study Resources', 
                                        desc: 'Share additional learning materials',
                                        icon: '📚',
                                        color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                                    },
                                    { 
                                        title: 'Class Schedule Change', 
                                        desc: 'Notify about schedule modifications',
                                        icon: '📅',
                                        color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700'
                                    },
                                    { 
                                        title: 'Congratulate Top Performers', 
                                        desc: 'Celebrate student achievements',
                                        icon: '🏆',
                                        color: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-4xl">⚙️</span>
                        Teacher Settings
                    </h2>
                    <p className="text-gray-600 text-lg">Customize your teaching experience and preferences</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <span className="mr-2">🔄</span>
                        Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">💾</span>
                        Save Settings
                    </button>
                </div>
            </div>
    
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Grading Preferences */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">📊</span>
                            Grading Preferences
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Configure your grading system and policies</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Default Grading Scale</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                                <option>A-F Letter Grades</option>
                                <option>0-100 Percentage</option>
                                <option>1-10 Scale</option>
                                <option>Pass/Fail</option>
                            </select>
                            <div className="text-xs text-gray-500">This will be the default for new assignments</div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Late Submission Penalty</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    defaultValue="10"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="10"
                                />
                                <span className="text-sm text-gray-500 font-medium">% per day late</span>
                            </div>
                            <div className="text-xs text-gray-500">Applied automatically to late submissions</div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Grade Release Settings</label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Auto-release grades to students</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Require manual approval before release</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Send email notifications for new grades</span>
                                </div>
                            </div>
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Rubric Preferences</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['Detailed Rubrics', 'Point-based Scoring', 'Holistic Assessment', 'Peer Review Integration'].map((rubric, index) => (
                                    <label key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="rubric" 
                                            defaultChecked={rubric === 'Detailed Rubrics'}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{rubric}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Notification Settings */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">🔔</span>
                            Notification Settings
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Control when and how you receive updates</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {[
                            {
                                title: 'New Student Messages',
                                desc: 'Get notified when students send you messages',
                                checked: true
                            },
                            {
                                title: 'Assignment Submissions',
                                desc: 'Alert when students submit assignments',
                                checked: true
                            },
                            {
                                title: 'Grading Deadlines',
                                desc: 'Remind me about upcoming grading deadlines',
                                checked: false
                            },
                            {
                                title: 'Student Questions in Forums',
                                desc: 'Notify when students post in course forums',
                                checked: true
                            },
                            {
                                title: 'Course Analytics Reports',
                                desc: 'Weekly performance and engagement summaries',
                                checked: false
                            },
                            {
                                title: 'System Announcements',
                                desc: 'Important updates from administration',
                                checked: true
                            }
                        ].map((setting, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input 
                                    type="checkbox" 
                                    defaultChecked={setting.checked}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{setting.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">{setting.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Class Management */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">👥</span>
                            Class Management
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Configure classroom policies and defaults</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Default Class Size Limit</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    defaultValue="50"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="50"
                                />
                                <span className="text-sm text-gray-500 font-medium">students per class</span>
                            </div>
                            <div className="text-xs text-gray-500">Applied to new courses you create</div>
                        </div>
    
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Student Permissions</h4>
                            {[
                                {
                                    title: 'Allow Student Collaboration',
                                    desc: 'Students can work together on assignments',
                                    checked: true
                                },
                                {
                                    title: 'Enable Peer Reviews',
                                    desc: 'Students can review each other\'s work',
                                    checked: false
                                },
                                {
                                    title: 'Discussion Forum Access',
                                    desc: 'Students can create forum topics',
                                    checked: true
                                },
                                {
                                    title: 'File Sharing Between Students',
                                    desc: 'Allow students to share files with classmates',
                                    checked: false
                                }
                            ].map((permission, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={permission.checked}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{permission.title}</div>
                                        <div className="text-sm text-gray-600 mt-1">{permission.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Attendance Tracking</label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Automatic attendance tracking</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Track student login times</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Send attendance reports to admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Dashboard Customization */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">🎨</span>
                            Dashboard Customization
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Personalize your teaching dashboard</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Dashboard Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { name: 'Light', icon: '☀️', active: true },
                                    { name: 'Dark', icon: '🌙', active: false },
                                    { name: 'Auto', icon: '🔄', active: false }
                                ].map((theme, index) => (
                                    <label key={index} className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                        theme.active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="theme" 
                                            defaultChecked={theme.active}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl mb-2">{theme.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
    
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Dashboard Widgets</h4>
                            {[
                                {
                                    title: 'Show Real-time Engagement Metrics',
                                    desc: 'Display live student engagement data',
                                    checked: true
                                },
                                {
                                    title: 'Quick Actions Sidebar',
                                    desc: 'Show quick teaching tools in sidebar',
                                    checked: true
                                },
                                {
                                    title: 'Student Performance Graphs',
                                    desc: 'Display performance charts on overview',
                                    checked: false
                                },
                                {
                                    title: 'Upcoming Deadlines Widget',
                                    desc: 'Show assignment and grading deadlines',
                                    checked: true
                                }
                            ].map((widget, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={widget.checked}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{widget.title}</div>
                                        <div className="text-sm text-gray-600 mt-1">{widget.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
    
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Default Course View</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                                <option>Grid View</option>
                                <option>List View</option>
                                <option>Card View</option>
                                <option>Compact View</option>
                            </select>
                            <div className="text-xs text-gray-500">How courses are displayed on your dashboard</div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Teaching Tools & Integrations */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-2xl">🛠️</span>
                        Teaching Tools & Integrations
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Configure external tools and teaching preferences</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Assignment Tools</h4>
                            {[
                                { title: 'Enable plagiarism detection', checked: true },
                                { title: 'Auto-generate assignment codes', checked: false },
                                { title: 'Anonymous grading option', checked: true },
                                { title: 'Bulk download submissions', checked: true }
                            ].map((tool, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={tool.checked}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{tool.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Communication Tools</h4>
                            {[
                                { title: 'Enable video conferencing integration', checked: true },
                                { title: 'Allow voice messages in chat', checked: false },
                                { title: 'Auto-translate messages', checked: false },
                                { title: 'Smart reply suggestions', checked: true }
                            ].map((tool, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={tool.checked}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{tool.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-blue-600 text-2xl">🚀</span>
                            <div>
                                <h4 className="font-semibold text-blue-900">Pro Teaching Features</h4>
                                <p className="text-sm text-blue-700">Upgrade to unlock advanced analytics, AI-powered insights, and automated grading tools.</p>
                            </div>
                            <button className="ml-auto inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                Learn More
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                            <option value="admin">Admins</option>
                        </select>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
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

            {/* Edit User Modal */}
            {showEditUserForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">📝</span>
                                Edit User
                            </h3>
                            <button 
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                                <span className="text-gray-400 hover:text-gray-600 text-xl">✕</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleUpdateUser} className="space-y-6">
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
                                            placeholder="Leave blank to keep current password"
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <div className="text-xs text-gray-500">Leave blank to keep current password</div>
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
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                                    >
                                        💾 Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Delete User
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>? 
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button 
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setUserToDelete(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="px-4 py-2 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                                    onClick={confirmDeleteUser}
                                >
                                    🗑️ Delete User
                                </button>
                            </div>
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
                            {getFilteredUsers().map((user, index) => (
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
                                                <>
                                                    <button 
                                                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                                        onClick={() => handleEditUser(user)}
                                                        title="Edit User"
                                                    >
                                                        📝
                                                    </button>
                                                    <button 
                                                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                                        onClick={() => handleDeleteUser(user)}
                                                        title="Delete User"
                                                    >
                                                        🗑️
                                                    </button>
                                                </>
                                            )}
                                            
                                            {/* Dropdown Menu */}
                                            <div className="relative group">
                                                <button className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                                    ⋮
                                                </button>
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                    <div className="py-1">
                                                        <button 
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleEditUser(user)}
                                                        >
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
                                                        <button 
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
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
                        Showing {getFilteredUsers().length} of {allUsers.length} users
                        {(searchTerm || selectedRole || selectedStatus) && (
                            <span className="ml-2 text-blue-600 font-medium">
                                (filtered)
                            </span>
                        )}
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

    // Updated renderApplicationManagement function
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
                            value={searchTermApp}
                            onChange={(e) => setSearchTermApp(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {/* // Find your application management render function and update the program dropdown: */}
                        <select 
                            value={selectedProgram} 
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        >
                            <option value="">All Programs</option>
                            {/* ✅ Update these to match the EXACT database values */}
                            <option value="webDevelopment">Web Development</option>
                            <option value="dataScience">Data Science and Analytics</option>
                            <option value="cybersecurity">Cybersecurity</option>
                            <option value="cloudComputing">Cloud Computing</option>
                            <option value="aiMachineLearning">AI & Machine Learning</option>
                        </select>
                        <select 
                            value={selectedAppStatus}
                            onChange={(e) => setSelectedAppStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
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
                            {getFilteredApplications().map((application, index) => (
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
                        Showing {getFilteredApplications().length} of {applicationSubmissions.length} applications
                        {(searchTermApp || selectedProgram || selectedAppStatus) && (
                            <span className="ml-2 text-blue-600 font-medium">
                                (filtered)
                            </span>
                        )}
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
                        <span className="text-sm text-gray-500">{getFilteredApplications().length} items</span>
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
                            📤 Export Filtered
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Updated renderContactManagement function
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
                            value={searchTermContact}
                            onChange={(e) => setSearchTermContact(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
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
                            {getFilteredContacts().map((contact, index) => (
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
                        Showing {getFilteredContacts().length} of {contactSubmissions.length} messages
                        {(searchTermContact || selectedCategory || selectedContactStatus) && (
                            <span className="ml-2 text-blue-600 font-medium">
                                (filtered)
                            </span>
                        )}
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
                        <span className="text-sm text-gray-500">{getFilteredContacts().length} items</span>
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
                            📤 Export Filtered
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAdminDashboard = () => {
        
        const handleTabTransition = (newTab) => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveTab(newTab);
                setIsTransitioning(false);
            }, 150);
        };
    
        // Add breadcrumb navigation
        const getBreadcrumb = () => {
            const breadcrumbs = {
                overview: 'System Overview',
                users: 'User Management',
                applications: 'Application Management', 
                contacts: 'Contact Management',
                settings: 'System Settings'
            };
            return breadcrumbs[activeTab] || 'Dashboard';
        };
    
        return (
            <div className="space-y-6">
                {/* Enhanced Admin Header with Breadcrumb */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-blue-100">
                                <span className="text-sm">🏠 Admin Portal</span>
                                <span className="text-sm">→</span>
                                <span className="text-sm font-medium">{getBreadcrumb()}</span>
                            </div>
                            <h1 className="text-2xl font-bold flex items-center">
                                <span className="mr-2">
                                    {activeTab === 'overview' ? '📊' : 
                                        activeTab === 'users' ? '👥' : 
                                        activeTab === 'applications' ? '📋' : 
                                        activeTab === 'contacts' ? '📧' : '⚙️'}
                                </span>
                                {getBreadcrumb()}
                            </h1>
                        </div>
                        
                        {/* Quick Stats Mini Cards */}
                        <div className="hidden lg:flex space-x-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                <div className="text-lg font-bold">{pendingUsers.length}</div>
                                <div className="text-xs text-blue-100">Pending Users</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                <div className="text-lg font-bold">{applicationSubmissions.filter(app => app.status === 'pending').length}</div>
                                <div className="text-xs text-blue-100">New Applications</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                <div className="text-lg font-bold">{contactSubmissions.filter(c => c.status === 'pending').length}</div>
                                <div className="text-xs text-blue-100">Unread Messages</div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Content with Smooth Transitions */}
                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
                    {(() => {
                        switch(activeTab) {
                            case 'overview':
                                return (
                                    <div className="animate-fadeIn">
                                        {renderAdminOverview()}
                                    </div>
                                );
                            case 'users':
                                return (
                                    <div className="animate-slideInLeft">
                                        {renderUserManagement()}
                                    </div>
                                );
                            case 'applications':
                                return (
                                    <div className="animate-slideInRight">
                                        {renderApplicationManagement()}
                                    </div>
                                );
                            case 'contacts':
                                return (
                                    <div className="animate-slideInUp">
                                        {renderContactManagement()}
                                    </div>
                                );
                            case 'settings':
                                return (
                                    <div className="animate-fadeIn">
                                        {renderAdminSettings()}
                                    </div>
                                );
                            default:
                                return (
                                    <div className="animate-fadeIn">
                                        {renderAdminOverview()}
                                    </div>
                                );
                        }
                    })()}
                </div>
    
                {/* Floating Action Button for Quick Actions */}
                <div className="fixed bottom-8 right-8 z-50">
                    <div className="relative group">
                        <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
                            <span className="text-xl">⚡</span>
                        </button>
                        
                        {/* Quick Action Menu */}
                        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                            <button 
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => setShowCreateUserForm(true)}
                            >
                                <span>👤</span>
                                <span>Create New User</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors">
                                <span>📧</span>
                                <span>Send Announcement</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">
                                <span>📊</span>
                                <span>Generate Report</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                                <span>⚙️</span>
                                <span>System Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    // Add the missing renderAdminSettings function
    const renderAdminSettings = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">⚙️</span>
                        System Settings
                    </h2>
                    <p className="text-gray-600">Configure system-wide settings and preferences</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        🔄 Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        💾 Save All Changes
                    </button>
                </div>
            </div>
    
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🌐</span>
                            General Settings
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Platform Name</label>
                            <input
                                type="text"
                                defaultValue="FIA Learning Portal"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Default Language</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Time Zone</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option>UTC</option>
                                <option>EST</option>
                                <option>PST</option>
                            </select>
                        </div>
                    </div>
                </div>
    
                {/* Security Settings */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🔒</span>
                            Security Settings
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                            <input
                                type="number"
                                defaultValue="30"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password Requirements</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                                    <span className="ml-2 text-sm text-gray-700">Minimum 8 characters</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                                    <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Email Settings */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📧</span>
                            Email Configuration
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SMTP Server</label>
                            <input
                                type="text"
                                placeholder="smtp.gmail.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SMTP Port</label>
                            <input
                                type="number"
                                defaultValue="587"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">From Email Address</label>
                            <input
                                type="email"
                                placeholder="noreply@fiaportal.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-green-300 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <span>📧</span>
                            <span>Test Email Configuration</span>
                        </button>
                    </div>
                </div>
    
                {/* Backup & Maintenance */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">💾</span>
                            Backup & Maintenance
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Automatic Backups</h4>
                                <p className="text-sm text-gray-600">Daily database backups at 2:00 AM</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <span>💾</span>
                                <span>Create Manual Backup</span>
                            </button>
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                <span>🔄</span>
                                <span>Clear System Cache</span>
                            </button>
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <span>🧹</span>
                                <span>Clean Temporary Files</span>
                            </button>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-600 text-lg">⚠️</span>
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">Maintenance Mode</h4>
                                    <p className="text-sm text-yellow-700">Enable to perform system updates safely</p>
                                    <button className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 font-medium">
                                        Enable Maintenance Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderAdminSidebar = () => (
        <nav className="flex flex-col space-y-2 p-4">
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('overview')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'overview' 
                    ? 'bg-white/20' 
                    : 'bg-blue-100 group-hover:bg-blue-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                </div>
                <span className="font-medium">Overview</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'users' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('users')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'users' 
                    ? 'bg-white/20' 
                    : 'bg-green-100 group-hover:bg-green-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.96 2.96 0 0 0 17 6.5c-.86 0-1.76.34-2.42 1.01L12 10l2.58 2.58c.76.76 2 .76 2.76 0l.66-.66V22h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6H9l-2.54-7.63A2.96 2.96 0 0 0 3.5 6.5c-.86 0-1.76.34-2.42 1.01L0 10l2.58 2.58c.76.76 2 .76 2.76 0L6 12v10h1z"/>
                    </svg>
                </div>
                <span className="font-medium">Users</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'applications' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('applications')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'applications' 
                    ? 'bg-white/20' 
                    : 'bg-orange-100 group-hover:bg-orange-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                </div>
                <span className="font-medium">Applications</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'contacts' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('contacts')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'contacts' 
                    ? 'bg-white/20' 
                    : 'bg-purple-100 group-hover:bg-purple-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </div>
                <span className="font-medium">Contacts</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'settings' 
                    ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('settings')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'settings' 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                </div>
                <span className="font-medium">Settings</span>
            </button>
        </nav>
    );
    
    const renderDefaultSidebar = () => (
        <nav className="flex flex-col space-y-2 p-4">
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('overview')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'overview' 
                    ? 'bg-white/20' 
                    : 'bg-blue-100 group-hover:bg-blue-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                </div>
                <span className="font-medium">Overview</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'courses' 
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('courses')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'courses' 
                    ? 'bg-white/20' 
                    : 'bg-green-100 group-hover:bg-green-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                    </svg>
                </div>
                <span className="font-medium">Courses</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'analytics' 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('analytics')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'analytics' 
                    ? 'bg-white/20' 
                    : 'bg-purple-100 group-hover:bg-purple-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                </div>
                <span className="font-medium">Analytics</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'messages' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('messages')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'messages' 
                    ? 'bg-white/20' 
                    : 'bg-orange-100 group-hover:bg-orange-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </div>
                <span className="font-medium">Messages</span>
            </button>
    
            <button 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === 'settings' 
                    ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('settings')}
            >
                <div className={`p-2 rounded-lg ${
                    activeTab === 'settings' 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                </div>
                <span className="font-medium">Settings</span>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                                {user?.role === 'admin' ? '⚡' : user?.role === 'teacher' ? '📚' : '🎓'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{getDashboardTitle(user?.role)}</h2>
                            <p className="text-sm text-gray-600">{getRoleDisplayName(user?.role)} Portal</p>
                        </div>
                    </div>
                </div>
                
                {/* Navigation */}
                <div className="flex-1 py-6">
                    {user?.role === 'admin' ? renderAdminSidebar() : renderDefaultSidebar()}
                </div>
    
                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-200/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button 
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={handleLogout}
                    >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
    
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    Welcome back, {user?.name}! 
                                    <span className="ml-2 text-4xl">👋</span>
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Here's what's happening in your {getRoleDisplayName(user?.role).toLowerCase()} dashboard today.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">Online</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date().toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                        {renderDashboardContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
    
export default Dashboard;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import {
    fetchApplications,
    fetchContacts,
    fetchStudents,
    fetchCourses,
} from "../../utils/api";
    import { formatDate, truncateText, getStatusColor } from "../../utils/helpers";

    const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        totalContacts: 0,
        totalStudents: 0,
        totalCourses: 0,
        newApplications: 0,
        newContacts: 0,
    });

    const [recentApplications, setRecentApplications] = useState([]);
    const [recentContacts, setRecentContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch applications
            const applicationsData = await fetchApplications();

            // Fetch contacts
            const contactsData = await fetchContacts();

            // Fetch students
            const studentsData = await fetchStudents();

            // Fetch courses
            const coursesData = await fetchCourses();

            // Calculate stats
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const newApps = applicationsData.data.filter(
            (app) => new Date(app.createdAt) >= oneWeekAgo
            ).length;

            const newConts = contactsData.data.filter(
            (contact) => new Date(contact.createdAt) >= oneWeekAgo
            ).length;

            // Update state with fetched data
            setStats({
            totalApplications: applicationsData.count || 0,
            totalContacts: contactsData.count || 0,
            totalStudents: studentsData.count || 0,
            totalCourses: coursesData.count || 0,
            newApplications: newApps,
            newContacts: newConts,
            });

            // Get recent items (latest 5)
            setRecentApplications(applicationsData.data.slice(0, 5));
            setRecentContacts(contactsData.data.slice(0, 5));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout sidebarContent={<AdminSidebar />} title="Admin Dashboard">
        {isLoading ? (
            <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
            </div>
        ) : error ? (
            <div className="error-message">
            <span className="material-icons">error</span>
            <p>{error}</p>
            <button
                className="retry-button"
                onClick={() => window.location.reload()}
            >
                Retry
            </button>
            </div>
        ) : (
            <>
            <div className="dashboard-welcome">
                <h2>Welcome to the Admin Portal</h2>
                <p>
                Manage applications, contacts, students, and courses from a
                central dashboard.
                </p>
            </div>

            <DashboardStats stats={stats} />

            <div className="dashboard-cards-grid">
                {/* Recent Applications Card */}
                <div className="dashboard-card">
                <div className="card-header">
                    <h3>Recent Applications</h3>
                    <Link to="/admin/applications" className="view-all">
                    View All <span className="material-icons">chevron_right</span>
                    </Link>
                </div>
                <div className="card-body">
                    {recentApplications.length === 0 ? (
                    <div className="empty-list">
                        <p>No recent applications</p>
                    </div>
                    ) : (
                    <div className="list">
                        {recentApplications.map((app) => (
                        <div className="list-item" key={app._id}>
                            <div className="item-content">
                            <h4>{`${app.firstName} ${app.lastName}`}</h4>
                            <p>
                                <span className="label">Program:</span>{" "}
                                {app.program || "Not specified"}
                            </p>
                            <p className="item-date">
                                {formatDate(app.createdAt)}
                            </p>
                            </div>
                            <div className="item-status">
                            <span
                                className={`status-badge ${getStatusColor(
                                app.status
                                )}`}
                            >
                                {app.status || "New"}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>

                {/* Recent Contacts Card */}
                <div className="dashboard-card">
                <div className="card-header">
                    <h3>Recent Contacts</h3>
                    <Link to="/admin/contacts" className="view-all">
                    View All <span className="material-icons">chevron_right</span>
                    </Link>
                </div>
                <div className="card-body">
                    {recentContacts.length === 0 ? (
                    <div className="empty-list">
                        <p>No recent contacts</p>
                    </div>
                    ) : (
                    <div className="list">
                        {recentContacts.map((contact) => (
                        <div className="list-item" key={contact._id}>
                            <div className="item-content">
                            <h4>{contact.name}</h4>
                            <p>{contact.subject || "No subject"}</p>
                            <p className="item-message">
                                {truncateText(contact.message, 60)}
                            </p>
                            <p className="item-date">
                                {formatDate(contact.createdAt)}
                            </p>
                            </div>
                            <div className="item-status">
                            <span
                                className={`status-badge ${getStatusColor(
                                contact.status
                                )}`}
                            >
                                {contact.status || "New"}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            </div>
            </>
        )}
        </DashboardLayout>
    );
};

export default AdminDashboard;

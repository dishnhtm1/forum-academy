import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentSidebar from "../../components/student/StudentSidebar";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentData } from "../../utils/api";
import "../../styles/Dashboard.css";

const StudentDashboard = () => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        courses: [],
        assignments: [],
        announcements: [],
        schedule: [],
    });

    useEffect(() => {
        const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchStudentData(currentUser.id);
            setDashboardData(data);
        } catch (err) {
            console.error("Error loading student dashboard:", err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setIsLoading(false);
        }
        };

        loadDashboardData();
    }, [currentUser.id]);

    if (isLoading) {
        return (
        <DashboardLayout
            sidebarContent={<StudentSidebar />}
            title="Student Dashboard"
        >
            <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
            </div>
        </DashboardLayout>
        );
    }

    if (error) {
        return (
        <DashboardLayout
            sidebarContent={<StudentSidebar />}
            title="Student Dashboard"
        >
            <div className="error-message">
            <span className="material-icons">error</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
        sidebarContent={<StudentSidebar />}
        title="Student Dashboard"
        >
        <div className="dashboard-welcome">
            <h2>Welcome back, {currentUser.name}!</h2>
            <p>
            Track your progress, access your courses, and manage your assignments
            from a central dashboard.
            </p>
        </div>

        <div className="dashboard-overview">
            <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon courses">
                <span className="material-icons">school</span>
                </div>
                <h3 className="stat-title">Enrolled Courses</h3>
                <div className="stat-value">{dashboardData.courses.length}</div>
                <div className="stat-trend neutral">
                <span className="material-icons">book</span>
                <span>Active courses</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon applications">
                <span className="material-icons">assignment</span>
                </div>
                <h3 className="stat-title">Pending Assignments</h3>
                <div className="stat-value">
                {dashboardData.assignments.filter((a) => !a.submitted).length}
                </div>
                <div className="stat-trend neutral">
                <span className="material-icons">schedule</span>
                <span>Upcoming deadlines</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon students">
                <span className="material-icons">timeline</span>
                </div>
                <h3 className="stat-title">Overall Progress</h3>
                <div className="stat-value">75%</div>
                <div className="stat-trend positive">
                <span className="material-icons">arrow_upward</span>
                <span>5% this week</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon contacts">
                <span className="material-icons">notifications</span>
                </div>
                <h3 className="stat-title">Announcements</h3>
                <div className="stat-value">
                {dashboardData.announcements.length}
                </div>
                <div className="stat-trend neutral">
                <span className="material-icons">campaign</span>
                <span>New notifications</span>
                </div>
            </div>
            </div>
        </div>

        <div className="dashboard-cards-grid">
            {/* Upcoming Assignments Card */}
            <div className="dashboard-card">
            <div className="card-header">
                <h3>Upcoming Assignments</h3>
                <a href="/student/assignments" className="view-all">
                View All <span className="material-icons">chevron_right</span>
                </a>
            </div>
            <div className="card-body">
                {dashboardData.assignments.length === 0 ? (
                <div className="empty-list">
                    <p>No upcoming assignments</p>
                </div>
                ) : (
                <div className="list">
                    {dashboardData.assignments
                    .filter((a) => !a.submitted)
                    .slice(0, 3)
                    .map((assignment) => (
                        <div className="list-item" key={assignment._id}>
                        <div className="item-content">
                            <h4>{assignment.title}</h4>
                            <p>{assignment.course}</p>
                            <div className="item-date">
                            <span className="material-icons">event</span>
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="item-status">
                            <span
                            className={`status-badge ${
                                new Date(assignment.dueDate) < new Date()
                                ? "rejected"
                                : "pending"
                            }`}
                            >
                            {new Date(assignment.dueDate) < new Date()
                                ? "Overdue"
                                : "Pending"}
                            </span>
                        </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* Course Progress Card */}
            <div className="dashboard-card">
            <div className="card-header">
                <h3>Course Progress</h3>
                <a href="/student/courses" className="view-all">
                View All <span className="material-icons">chevron_right</span>
                </a>
            </div>
            <div className="card-body">
                {dashboardData.courses.length === 0 ? (
                <div className="empty-list">
                    <p>You are not enrolled in any courses yet</p>
                </div>
                ) : (
                <div className="list">
                    {dashboardData.courses.slice(0, 3).map((course) => (
                    <div className="list-item" key={course._id}>
                        <div className="item-content">
                        <h4>{course.title}</h4>
                        <p>{course.instructor}</p>
                        <div className="progress-bar">
                            <div
                            className="progress"
                            style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            {course.progress}% Complete
                        </p>
                        </div>
                        <div className="item-status">
                        <a
                            href={`/student/courses/${course._id}`}
                            className="btn btn-outline btn-sm"
                        >
                            Continue
                        </a>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>

        <div className="dashboard-row">
            {/* Calendar/Schedule */}
            <div className="dashboard-card">
            <div className="card-header">
                <h3>Upcoming Schedule</h3>
                <span className="date-display">
                {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
                </span>
            </div>
            <div className="card-body">
                {dashboardData.schedule.length === 0 ? (
                <div className="empty-list">
                    <p>No upcoming events scheduled</p>
                </div>
                ) : (
                <div className="schedule-list">
                    {dashboardData.schedule.slice(0, 4).map((event, index) => (
                    <div className="schedule-item" key={index}>
                        <div className="schedule-time">
                        <span className="time">{event.time}</span>
                        <span className="date">{event.date}</span>
                        </div>
                        <div className="schedule-event">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <span className="event-type">{event.type}</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;

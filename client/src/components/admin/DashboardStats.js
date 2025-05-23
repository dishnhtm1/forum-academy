import React from "react";

const DashboardStats = ({ stats }) => {
    const {
        totalApplications = 0,
        totalContacts = 0,
        totalStudents = 0,
        totalCourses = 0,
        newApplications = 0,
        newContacts = 0,
    } = stats || {};

    // Calculate percentages for the growth indicators
    const calculateGrowth = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous) * 100;
    };

    return (
        <div className="stats-grid">
        <div className="stat-card">
            <div className="stat-icon applications">
            <span className="material-icons">description</span>
            </div>
            <h3 className="stat-title">Applications</h3>
            <div className="stat-value">{totalApplications}</div>
            <div
            className={`stat-trend ${
                newApplications >= 0 ? "positive" : "negative"
            }`}
            >
            <span className="material-icons">
                {newApplications >= 0 ? "arrow_upward" : "arrow_downward"}
            </span>
            <span>{Math.abs(newApplications)} new this week</span>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon contacts">
            <span className="material-icons">contact_mail</span>
            </div>
            <h3 className="stat-title">Contacts</h3>
            <div className="stat-value">{totalContacts}</div>
            <div
            className={`stat-trend ${newContacts >= 0 ? "positive" : "negative"}`}
            >
            <span className="material-icons">
                {newContacts >= 0 ? "arrow_upward" : "arrow_downward"}
            </span>
            <span>{Math.abs(newContacts)} new this week</span>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon students">
            <span className="material-icons">school</span>
            </div>
            <h3 className="stat-title">Students</h3>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-trend neutral">
            <span className="material-icons">person</span>
            <span>Total enrolled</span>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon courses">
            <span className="material-icons">book</span>
            </div>
            <h3 className="stat-title">Courses</h3>
            <div className="stat-value">{totalCourses}</div>
            <div className="stat-trend neutral">
            <span className="material-icons">class</span>
            <span>Active courses</span>
            </div>
        </div>
        </div>
    );
};

export default DashboardStats;

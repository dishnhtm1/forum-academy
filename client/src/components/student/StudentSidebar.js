import React from "react";
import { NavLink } from "react-router-dom";

const StudentSidebar = () => {
    return (
        <nav className="sidebar-nav">
        <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/student/dashboard"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">dashboard</span>
                <span>Dashboard</span>
                </NavLink>
            </li>
            </ul>
        </div>

        <div className="nav-section">
            <h3 className="nav-title">Learning</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/student/courses"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">book</span>
                <span>My Courses</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/assignments"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">assignment</span>
                <span>Assignments</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/grades"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">grade</span>
                <span>Grades</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/schedule"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">event</span>
                <span>Schedule</span>
                </NavLink>
            </li>
            </ul>
        </div>

        <div className="nav-section">
            <h3 className="nav-title">Community</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/student/discussion"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">forum</span>
                <span>Discussion</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/messages"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">chat</span>
                <span>Messages</span>
                </NavLink>
            </li>
            </ul>
        </div>

        <div className="nav-section">
            <h3 className="nav-title">Account</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/student/profile"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">person</span>
                <span>My Profile</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/settings"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">settings</span>
                <span>Settings</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/student/help"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">help</span>
                <span>Help & Support</span>
                </NavLink>
            </li>
            </ul>
        </div>
        </nav>
    );
};

export default StudentSidebar;

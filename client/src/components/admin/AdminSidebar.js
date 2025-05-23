import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <nav className="sidebar-nav">
        <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/admin/dashboard"
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
            <h3 className="nav-title">Management</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/admin/applications"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">description</span>
                <span>Applications</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/admin/contacts"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">contact_mail</span>
                <span>Contacts</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/admin/students"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">school</span>
                <span>Students</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/admin/courses"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">book</span>
                <span>Courses</span>
                </NavLink>
            </li>
            </ul>
        </div>

        <div className="nav-section">
            <h3 className="nav-title">Settings</h3>
            <ul className="nav-list">
            <li className="nav-item">
                <NavLink
                to="/admin/profile"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">person</span>
                <span>Profile</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                >
                <span className="material-icons">settings</span>
                <span>Settings</span>
                </NavLink>
            </li>
            </ul>
        </div>
        </nav>
    );
};

export default AdminSidebar;

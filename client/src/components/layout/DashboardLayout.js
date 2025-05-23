import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const DashboardLayout = ({ children, sidebarContent, title = "Dashboard" }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        document.body.classList.toggle("sidebar-open");
    };

    return (
        <div className="dashboard-container">
        {/* Mobile header - only visible on small screens */}
        <div className="dashboard-mobile-header">
            <button className="menu-toggle" onClick={toggleMobileMenu}>
            <span className="material-icons">menu</span>
            </button>
            <div className="mobile-logo">
            <img src="/logo.png" alt="Forum Information Academy" />
            </div>
            <div className="mobile-user">
            <span className="material-icons">account_circle</span>
            </div>
        </div>

        {/* Sidebar */}
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
            <div className="logo">
                <img src="/logo.png" alt="Forum Information Academy" />
                <h2>FIA Portal</h2>
            </div>
            <button className="close-sidebar" onClick={toggleMobileMenu}>
                <span className="material-icons">close</span>
            </button>
            </div>

            {/* Sidebar Content passed as prop */}
            <div className="sidebar-content">{sidebarContent}</div>

            <div className="sidebar-footer">
            <button className="logout-button" onClick={handleLogout}>
                <span className="material-icons">logout</span>
                <span>Logout</span>
            </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
            <div className="dashboard-header">
            <div className="page-title">
                <h1>{title}</h1>
            </div>

            <div className="user-profile">
                <div className="user-info">
                <span className="user-name">{currentUser?.name || "User"}</span>
                <span className="user-role">{currentUser?.role || "User"}</span>
                </div>
                <div className="avatar">
                {currentUser?.profileImage ? (
                    <img src={currentUser.profileImage} alt={currentUser.name} />
                ) : (
                    <span className="material-icons">account_circle</span>
                )}
                </div>
            </div>
            </div>

            <div className="dashboard-content">{children}</div>
        </main>
        </div>
    );
};

export default DashboardLayout;

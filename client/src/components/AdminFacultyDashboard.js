import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { Layout } from "antd";

// Context
import AdminContext, { AdminProvider } from "../context/AdminContext";

// Layout Components
import AdminLayout from "./admin/AdminLayout";
import AdminHeader from "./admin/AdminHeader";

// Page Components (to be refactored with their own state and handlers)
import Admindashboardoverview from "./admin/Admindashboardoverview";
import Adminapplicationanduser from "./admin/Adminapplicationanduser";
import Adminenrollmentmonitoring from "./admin/Adminenrollmentmonitoring";
import Admincoursemanagement from "./admin/Admincoursemanagement";
import Admincoursematerials from "./admin/Admincoursematerials";
import AdminStudentProgress from "./admin/AdminStudentProgress";
import AdminAnnouncement from "./admin/AdminAnnouncement";
import AdminAnalyticsReports from "./admin/AdminAnalyticsReports";
import AdminSetting from "./admin/AdminSetting";

// Styles
import "../styles/AdminSidebar.css";
import "../styles/DashboardStats.css";
import "../styles/EnhancedStudentProgress.css";
import "../styles/UniqueTable.css";

const { Content } = Layout;

/**
 * AdminFacultyDashboard - Main Coordinator Component
 *
 * This is a lightweight wrapper that:
 * 1. Manages authentication and basic layout
 * 2. Routes between different admin sections based on sidebar selection
 * 3. Provides global state via AdminContext
 * 4. Coordinates data between components
 *
 * The actual functionality for each section has been moved to:
 * - Admindashboardoverview.js - Overview/Dashboard section
 * - Adminapplicationanduser.js - Applications and user management
 * - Adminenrollmentmonitoring.js - Enrollment analytics
 * - Admincoursemanagement.js - Course management
 * - Admincoursematerials.js - Course materials
 * - AdminStudentProgress.js - Student progress tracking
 * - AdminAnnouncement.js - Announcements
 * - AdminAnalyticsReports.js - Analytics and reports
 * - AdminSetting.js - System settings
 */
const AdminFacultyDashboard = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  // Layout and UI State
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [theme, setTheme] = useState("dark");
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Language change handler
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        console.log("🔐 AdminFacultyDashboard Auth Check - Token:", !!token);

        if (!token) {
          console.log("❌ No token found, redirecting to login");
          history.push("/login");
          return;
        }

        // Get user data from localStorage or session
        const userDataStr =
          localStorage.getItem("currentUser") ||
          sessionStorage.getItem("currentUser");
        const userData = userDataStr ? JSON.parse(userDataStr) : null;

        console.log("👤 User Data:", userData);
        console.log("🎭 User Role:", userData?.role);

        // Also check userRole from localStorage as fallback
        const roleFromStorage = localStorage.getItem("userRole");
        const actualRole = userData?.role || roleFromStorage;

        console.log("📋 Actual Role:", actualRole);

        if (
          actualRole !== "admin" &&
          actualRole !== "superadmin" &&
          actualRole !== "faculty"
        ) {
          console.log("⛔ Invalid role:", actualRole, "- redirecting to login");
          history.push("/login");
          return;
        }

        console.log("✅ Auth successful, setting user and loading content");
        setCurrentUser(userData || { role: actualRole });
        setLoading(false);
      } catch (error) {
        console.error("❌ Authentication check failed:", error);
        history.push("/login");
      }
    };

    checkAuth();
  }, [history]);

  // Render the active section based on sidebar selection
  const renderContent = () => {
    const contentProps = {
      t,
      activeKey,
      setActiveKey,
      currentUser,
      isMobile,
      isTablet,
    };

    switch (activeKey) {
      case "overview":
        return <Admindashboardoverview {...contentProps} />;
      case "applications":
        return <Adminapplicationanduser {...contentProps} />;
      case "enrollments":
        return <Adminenrollmentmonitoring {...contentProps} />;
      case "courses":
        return <Admincoursemanagement {...contentProps} />;
      case "materials":
        return <Admincoursematerials {...contentProps} />;
      case "students":
        return <AdminStudentProgress {...contentProps} />;
      case "announcements":
        return <AdminAnnouncement {...contentProps} />;
      case "analytics":
        return <AdminAnalyticsReports {...contentProps} />;
      case "settings":
        return <AdminSetting {...contentProps} />;
      default:
        return <Admindashboardoverview {...contentProps} />;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    history.push("/login");
  };

  const handleMenuClick = (key) => {
    setActiveKey(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerVisible(!mobileDrawerVisible);
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px" }}>
          <div style={{ textAlign: "center" }}>Loading...</div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminLayout
        activeKey={activeKey}
        onMenuClick={handleMenuClick}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        theme={theme}
        onThemeChange={setTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileDrawerVisible={mobileDrawerVisible}
        onMobileDrawerToggle={handleMobileDrawerToggle}
        notificationDrawerVisible={notificationDrawerVisible}
        onNotificationDrawerToggle={() =>
          setNotificationDrawerVisible(!notificationDrawerVisible)
        }
      >
        <AdminHeader
          collapsed={collapsed}
          onCollapse={setCollapsed}
          currentUser={currentUser}
          onNotificationClick={() =>
            setNotificationDrawerVisible(!notificationDrawerVisible)
          }
          onProfileClick={() => {
            // Open profile modal in content
          }}
          onLogout={handleLogout}
          isMobile={isMobile}
          onMobileDrawerToggle={handleMobileDrawerToggle}
        />

        <Content
          style={{
            padding: isMobile ? "12px" : isTablet ? "16px" : "24px",
            minHeight: "calc(100vh - 72px)",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {renderContent()}
        </Content>
      </AdminLayout>
    </Layout>
  );
};

/**
 * Wrapped version with AdminProvider context
 * This ensures all child components have access to global state
 */
export default function AdminFacultyDashboardWithProvider() {
  return (
    <AdminProvider>
      <AdminFacultyDashboard />
    </AdminProvider>
  );
}

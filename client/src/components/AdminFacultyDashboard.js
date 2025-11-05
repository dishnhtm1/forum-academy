import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import {
  Layout,
  Spin,
  Drawer,
  Badge,
  Button,
  Space,
  Empty,
  Tag,
  Modal,
  Row,
  Col,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  CloseOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { API_BASE_URL, getAuthHeaders } from "../utils/adminApiUtils";

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
const { Title, Text } = Typography;

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
  const [unreadCount, setUnreadCount] = useState(0);

  // Debug: Log unreadCount changes
  useEffect(() => {
    console.log("🔔 Admin Dashboard - Unread Count:", unreadCount);
  }, [unreadCount]);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationDetailModalVisible, setNotificationDetailModalVisible] =
    useState(false);

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

  // Notification helper functions
  const getNotificationIcon = (type) => {
    const iconMap = {
      announcement: "bell",
      admin_announcement: "bell",
      grade_update: "trophy",
      assignment_new: "file-text",
      quiz_available: "question-circle",
      homework_due: "clock-circle",
      live_class_started: "video-camera",
      live_class_ended: "video-camera",
      zoom_class: "video-camera",
      notification_read: "check-circle",
      application: "solution",
      contact: "message",
    };
    return iconMap[type] || "bell";
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      announcement: "#1890ff",
      admin_announcement: "#1890ff",
      grade_update: "#52c41a",
      assignment_new: "#722ed1",
      quiz_available: "#faad14",
      homework_due: "#f5222d",
      live_class_started: "#dc2626",
      live_class_ended: "#6b7280",
      zoom_class: "#dc2626",
      notification_read: "#52c41a",
      application: "#1890ff",
      contact: "#52c41a",
    };
    return colorMap[type] || "#1890ff";
  };

  const getNotificationTypeLabel = (type) => {
    const translated = t(`adminDashboard.notifications.types.${type}`);
    return translated === `adminDashboard.notifications.types.${type}`
      ? type
      : translated;
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      let transformedNotifications = [];

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/notifications`, {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          });

          if (response && response.ok) {
            const data = await response.json();
            if (data.success && data.notifications) {
              // Get read notification IDs from localStorage
              const readNotificationIds = JSON.parse(
                localStorage.getItem("readNotificationIds") || "[]"
              );

              transformedNotifications = data.notifications.map(
                (notification) => {
                  const notificationId = notification._id || notification.id;
                  // Check if this notification has been marked as read in localStorage
                  const isRead =
                    notification.read ||
                    readNotificationIds.includes(notificationId);

                  return {
                    id: notificationId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    timestamp: notification.createdAt,
                    read: isRead,
                    priority: notification.priority || "medium",
                    icon: getNotificationIcon(notification.type),
                    color: getNotificationColor(notification.type),
                    sender: notification.sender,
                    readerName: notification.readerName,
                    readerRole: notification.readerRole,
                    announcementId: notification.announcementId,
                    actionUrl: notification.actionUrl,
                  };
                }
              );
            }
          }
        } catch (apiError) {
          console.log(
            "API notifications not available, checking local notifications"
          );
        }
      }

      // Check for local notifications as fallback
      try {
        // Get read notification IDs from localStorage
        const readNotificationIds = JSON.parse(
          localStorage.getItem("readNotificationIds") || "[]"
        );

        const deletedNotificationIds = JSON.parse(
          localStorage.getItem("deletedNotificationIds") || "[]"
        );

        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        console.log(
          "📋 Admin Dashboard - Total local notifications:",
          localNotifications.length
        );
        console.log(
          "📋 Admin Dashboard - Notification types:",
          localNotifications.map((n) => ({
            type: n.type,
            targetAudience: n.targetAudience,
          }))
        );

        const localTransformed = localNotifications
          .filter((notif) => {
            const notificationId = notif._id || notif.id;
            // Filter out deleted notifications
            if (deletedNotificationIds.includes(notificationId)) {
              return false;
            }
            const matches =
              notif.targetAudience === "admins" ||
              notif.targetAudience === "admin" ||
              notif.targetAudience === "all" ||
              notif.type === "notification_read" ||
              notif.type === "announcement" ||
              notif.type === "application" ||
              notif.type === "contact";
            if (matches) {
              console.log(
                "✅ Admin Dashboard - Including notification:",
                notif.type,
                notif.title
              );
            }
            return matches;
          })
          .map((notification) => {
            const notificationId =
              notification._id || notification.id || `local_${Date.now()}`;
            // Check if this notification has been marked as read
            const isRead =
              notification.read || readNotificationIds.includes(notificationId);

            // Translate title and message if keys are provided
            let title = notification.title;
            let message = notification.message;

            if (notification.titleKey) {
              const translatedTitle = t(notification.titleKey);
              title =
                notification.type === "contact"
                  ? `📧 ${translatedTitle}`
                  : notification.type === "application"
                  ? `📝 ${translatedTitle}`
                  : translatedTitle;
            }

            if (notification.messageKey && notification.messageParams) {
              message = t(notification.messageKey, notification.messageParams);
            }

            return {
              id: notificationId,
              type: notification.type,
              title: title,
              message: message,
              timestamp: notification.timestamp || notification.createdAt,
              read: isRead,
              priority: notification.priority || "medium",
              icon: getNotificationIcon(notification.type),
              color: getNotificationColor(notification.type),
              sender: notification.sender,
              readerName: notification.readerName,
              readerRole: notification.readerRole,
              source: "local",
              announcementId: notification.announcementId,
              actionUrl: notification.actionUrl,
              titleKey: notification.titleKey,
              messageKey: notification.messageKey,
              messageParams: notification.messageParams,
            };
          });

        // Merge API and local notifications, preserving read status
        const allNotifications = [
          ...transformedNotifications,
          ...localTransformed,
        ];

        // Deduplicate and merge, preserving read status from readNotificationIds
        const uniqueNotifications = allNotifications.reduce(
          (acc, notification) => {
            const existingIndex = acc.findIndex(
              (n) => n.id === notification.id
            );
            if (existingIndex === -1) {
              // Ensure read status is applied from readNotificationIds
              if (readNotificationIds.includes(notification.id)) {
                notification.read = true;
              }
              acc.push(notification);
            } else {
              // If we have a duplicate, preserve read status
              if (readNotificationIds.includes(notification.id)) {
                acc[existingIndex].read = true;
              }
            }
            return acc;
          },
          []
        );

        transformedNotifications = uniqueNotifications;
      } catch (localError) {
        console.log("Local notifications not available");
      }

      setNotifications(transformedNotifications);
      const unread = transformedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
      console.log(
        "🔔 Admin Dashboard - Fetched notifications:",
        transformedNotifications.length,
        "Unread:",
        unread
      );
      console.log(
        "🔔 Admin Dashboard - Notification list:",
        transformedNotifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          read: n.read,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (token) {
        try {
          await fetch(
            `${API_BASE_URL}/api/notifications/${notificationId}/read`,
            {
              method: "PUT",
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.log("Could not mark notification as read on server");
        }
      }

      // Save read status to a separate storage key for persistence across refreshes
      try {
        const readNotificationIds = JSON.parse(
          localStorage.getItem("readNotificationIds") || "[]"
        );
        if (!readNotificationIds.includes(notificationId)) {
          readNotificationIds.push(notificationId);
          localStorage.setItem(
            "readNotificationIds",
            JSON.stringify(readNotificationIds)
          );
        }
      } catch (error) {
        console.log("Could not save read status to localStorage");
      }

      // Update local storage notifications
      try {
        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        const updatedLocalNotifications = localNotifications.map((notif) =>
          notif._id === notificationId || notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        );
        localStorage.setItem(
          "localNotifications",
          JSON.stringify(updatedLocalNotifications)
        );
      } catch (localError) {
        console.log("Could not update local storage notifications");
      }

      // Update local state IMMEDIATELY
      setNotifications((prev) => {
        const updated = prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        );
        // Recalculate unread count immediately
        const unread = updated.filter((n) => !n.read).length;
        setUnreadCount(unread);
        return updated;
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      // Get current notifications to ensure we have the latest state
      setNotifications((prev) => {
        const unreadNotifications = prev.filter((n) => !n.read);
        const token =
          localStorage.getItem("authToken") || localStorage.getItem("token");

        // Save all notification IDs as read to localStorage for persistence
        try {
          const readNotificationIds = JSON.parse(
            localStorage.getItem("readNotificationIds") || "[]"
          );
          const allNotificationIds = prev.map((n) => n.id).filter(Boolean);
          const updatedReadIds = [
            ...new Set([...readNotificationIds, ...allNotificationIds]),
          ];
          localStorage.setItem(
            "readNotificationIds",
            JSON.stringify(updatedReadIds)
          );
        } catch (error) {
          console.log("Could not save read status to localStorage");
        }

        // Mark all as read on server (fire and forget)
        if (token && unreadNotifications.length > 0) {
          unreadNotifications.forEach((notif) => {
            fetch(`${API_BASE_URL}/api/notifications/${notif.id}/read`, {
              method: "PUT",
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            }).catch((error) => {
              console.log("Could not mark notification as read on server");
            });
          });
        }

        // Update local storage notifications - mark all as read
        try {
          const localNotifications = JSON.parse(
            localStorage.getItem("localNotifications") || "[]"
          );
          const updatedLocalNotifications = localNotifications.map((notif) => ({
            ...notif,
            read: true,
          }));
          localStorage.setItem(
            "localNotifications",
            JSON.stringify(updatedLocalNotifications)
          );
        } catch (localError) {
          console.log("Could not update local storage notifications");
        }

        // Mark all as read in state
        const updated = prev.map((notif) => ({ ...notif, read: true }));
        setUnreadCount(0);
        return updated;
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      // Try to delete from API
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
            method: "DELETE",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          });
          console.log("✅ Notification deleted from API:", notificationId);
        } catch (error) {
          console.log("Could not delete notification from API");
        }
      }

      // Add to deletedNotificationIds to prevent it from reappearing
      try {
        const deletedNotificationIds = JSON.parse(
          localStorage.getItem("deletedNotificationIds") || "[]"
        );
        if (!deletedNotificationIds.includes(notificationId)) {
          deletedNotificationIds.push(notificationId);
          localStorage.setItem(
            "deletedNotificationIds",
            JSON.stringify(deletedNotificationIds)
          );
          console.log(
            "✅ Notification ID added to deleted list:",
            notificationId
          );
        }
      } catch (error) {
        console.log("Could not add notification to deleted list");
      }

      // Remove from localStorage
      try {
        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        const updatedNotifications = localNotifications.filter(
          (notif) => notif._id !== notificationId && notif.id !== notificationId
        );
        localStorage.setItem(
          "localNotifications",
          JSON.stringify(updatedNotifications)
        );
        console.log(
          "✅ Notification deleted from localStorage:",
          notificationId
        );
      } catch (error) {
        console.log("Could not delete notification from localStorage");
      }

      // Remove from readNotificationIds
      try {
        const readNotificationIds = JSON.parse(
          localStorage.getItem("readNotificationIds") || "[]"
        );
        const updatedReadIds = readNotificationIds.filter(
          (id) => id !== notificationId
        );
        localStorage.setItem(
          "readNotificationIds",
          JSON.stringify(updatedReadIds)
        );
      } catch (error) {
        console.log("Could not update readNotificationIds");
      }

      // Update state
      setNotifications((prev) => {
        const updated = prev.filter((notif) => notif.id !== notificationId);
        const unread = updated.filter((n) => !n.read).length;
        setUnreadCount(unread);
        return updated;
      });

      message.success(
        t("adminDashboard.notifications.deleteSuccess") ||
          "Notification deleted successfully"
      );
      console.log("✅ Notification deleted successfully:", notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error(
        t("adminDashboard.notifications.deleteError") ||
          "Failed to delete notification"
      );
    }
  };

  // Handle notification item click - show details modal
  const handleNotificationItemClick = async (notification) => {
    setSelectedNotification(notification);
    setNotificationDetailModalVisible(true);

    // Mark as read if unread
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  // Handle notification click to toggle drawer
  const handleNotificationClick = () => {
    const newVisible = !notificationDrawerVisible;
    setNotificationDrawerVisible(newVisible);
    // Always refresh when opening drawer to get latest notifications
    if (newVisible) {
      fetchNotifications();
    }
  };

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
          onNotificationClick={handleNotificationClick}
          onProfileClick={() => {
            // Open profile modal in content
          }}
          onLogout={handleLogout}
          isMobile={isMobile}
          onMobileDrawerToggle={handleMobileDrawerToggle}
          unreadCount={unreadCount}
          activeKey={activeKey}
          menuItems={[]}
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

      {/* Notification Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space size={12}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "rgba(24, 144, 255, 0.1)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BellOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>
                {t("adminDashboard.notifications.title") || "Notifications"}
              </span>
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  style={{
                    backgroundColor: "#ff4d4f",
                    boxShadow: "0 2px 8px rgba(255, 77, 79, 0.3)",
                  }}
                />
              )}
            </Space>
            {unreadCount > 0 && (
              <Button
                type="link"
                size="small"
                onClick={markAllNotificationsAsRead}
                style={{ color: "#1890ff", fontWeight: 500 }}
              >
                {t("adminDashboard.notifications.markAllRead") ||
                  "Mark all as read"}
              </Button>
            )}
          </div>
        }
        placement="right"
        width={isMobile ? "100%" : 440}
        open={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        styles={{
          body: {
            padding: 0,
            background: "#fafafa",
          },
          header: {
            background: "#fff",
            borderBottom: "1px solid #e8e8e8",
            padding: "20px",
          },
        }}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setNotificationDrawerVisible(false)}
            style={{ color: "#8c8c8c" }}
          />
        }
      >
        {notificationLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description={
              t("adminDashboard.notifications.noNotifications") ||
              "No notifications yet"
            }
            style={{ marginTop: "60px" }}
          />
        ) : (
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            {notifications.map((notification, index) => (
              <div
                key={notification.id || index}
                onClick={() => handleNotificationItemClick(notification)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  background: notification.read ? "#fff" : "#f6f8ff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = notification.read
                    ? "#f5f5f5"
                    : "#e6f4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = notification.read
                    ? "#fff"
                    : "#f6f8ff";
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      background: `${getNotificationColor(
                        notification.type
                      )}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {notification.type === "notification_read" ? (
                      <UserOutlined
                        style={{
                          color: getNotificationColor(notification.type),
                          fontSize: 18,
                        }}
                      />
                    ) : (
                      <SoundOutlined
                        style={{
                          color: getNotificationColor(notification.type),
                          fontSize: 18,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: notification.read ? 500 : 600,
                          fontSize: 14,
                          color: "#262626",
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.title}
                      </div>
                      {!notification.read && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#1890ff",
                            flexShrink: 0,
                            marginLeft: 8,
                            marginTop: 4,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#8c8c8c",
                        lineHeight: 1.5,
                        marginBottom: 8,
                        wordBreak: "break-word",
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#bfbfbf",
                        }}
                      >
                        {moment(notification.timestamp).fromNow()}
                      </div>
                      <Tag
                        color={
                          notification.priority === "high"
                            ? "red"
                            : notification.priority === "medium"
                            ? "orange"
                            : "default"
                        }
                        style={{ fontSize: 11 }}
                      >
                        {notification.priority || "medium"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Actions */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #e8e8e8",
              background: "#fff",
              position: "sticky",
              bottom: 0,
            }}
          >
            <Space
              style={{ width: "100%", justifyContent: "center" }}
              size={12}
            >
              <Button
                type="primary"
                icon={<BellOutlined />}
                onClick={fetchNotifications}
                loading={notificationLoading}
              >
                {t("adminDashboard.notifications.refresh") || "Refresh"}
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={markAllNotificationsAsRead}
                disabled={unreadCount === 0}
              >
                {t("adminDashboard.notifications.markAllAsRead") ||
                  "Mark all as read"}
              </Button>
            </Space>
          </div>
        )}
      </Drawer>

      {/* Notification Details Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {selectedNotification?.type === "notification_read" ? (
              <UserOutlined
                style={{
                  color: selectedNotification
                    ? getNotificationColor(selectedNotification.type)
                    : "#52c41a",
                  fontSize: 20,
                }}
              />
            ) : (
              <SoundOutlined
                style={{
                  color: selectedNotification
                    ? getNotificationColor(selectedNotification.type)
                    : "#1890ff",
                  fontSize: 20,
                }}
              />
            )}
            <span>
              {t("adminDashboard.notifications.details") ||
                "Notification Details"}
            </span>
          </div>
        }
        open={notificationDetailModalVisible}
        onCancel={() => {
          setNotificationDetailModalVisible(false);
          setSelectedNotification(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setNotificationDetailModalVisible(false);
              setSelectedNotification(null);
            }}
          >
            {t("adminDashboard.notifications.close") || "Close"}
          </Button>,
          <Popconfirm
            key="delete"
            title={
              t("adminDashboard.notifications.confirmDelete") ||
              "Delete this notification?"
            }
            description={
              t("adminDashboard.notifications.confirmDeleteDesc") ||
              "This action cannot be undone."
            }
            okText={t("common.delete") || "Delete"}
            cancelText={t("common.cancel") || "Cancel"}
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              if (selectedNotification) {
                deleteNotification(selectedNotification.id);
                setNotificationDetailModalVisible(false);
                setNotificationDrawerVisible(false);
                setSelectedNotification(null);
              }
            }}
          >
            <Button key="delete-btn" danger icon={<DeleteOutlined />}>
              {t("adminDashboard.notifications.delete") || "Delete"}
            </Button>
          </Popconfirm>,
          selectedNotification?.actionUrl && (
            <Button
              key="view"
              type="primary"
              onClick={() => {
                if (selectedNotification.actionUrl) {
                  // Handle contact and application notifications - navigate to applications tab
                  if (
                    selectedNotification.type === "contact" ||
                    selectedNotification.type === "application"
                  ) {
                    setActiveKey("applications");
                    setNotificationDetailModalVisible(false);
                    setNotificationDrawerVisible(false);
                    setSelectedNotification(null);
                  } else {
                    // For other notification types, use the actionUrl
                    history.push(selectedNotification.actionUrl);
                    setNotificationDetailModalVisible(false);
                    setNotificationDrawerVisible(false);
                    setSelectedNotification(null);
                  }
                }
              }}
            >
              {t("adminDashboard.notifications.viewDetails") || "View Details"}
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedNotification && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Title level={4} style={{ marginBottom: 8 }}>
                {selectedNotification.title}
              </Title>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  {moment(selectedNotification.timestamp).format(
                    "MMMM DD, YYYY [at] HH:mm"
                  )}
                </Text>
                <Text type="secondary" style={{ marginLeft: 12 }}>
                  ({moment(selectedNotification.timestamp).fromNow()})
                </Text>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#f5f5f5",
                borderRadius: "8px",
                marginBottom: 20,
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              <Text>{selectedNotification.message}</Text>
            </div>

            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={12}>
                <Text strong>
                  {t("adminDashboard.notifications.type") || "Type"}:{" "}
                </Text>
                <Tag color={getNotificationColor(selectedNotification.type)}>
                  {getNotificationTypeLabel(
                    selectedNotification.type || "announcement"
                  )}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>
                  {t("adminDashboard.notifications.priority") || "Priority"}:{" "}
                </Text>
                <Tag
                  color={
                    selectedNotification.priority === "high"
                      ? "red"
                      : selectedNotification.priority === "medium"
                      ? "orange"
                      : "default"
                  }
                >
                  {selectedNotification.priority || "medium"}
                </Tag>
              </Col>
            </Row>

            {selectedNotification.readerName && (
              <div style={{ marginTop: 16 }}>
                <Text strong>
                  {t("adminDashboard.notifications.readBy") || "Read by"}:{" "}
                </Text>
                <Text>
                  {selectedNotification.readerName}
                  {selectedNotification.readerRole &&
                    ` (${selectedNotification.readerRole})`}
                </Text>
              </div>
            )}

            {selectedNotification.sender && (
              <div style={{ marginTop: 16 }}>
                <Text strong>
                  {t("adminDashboard.notifications.sender") || "From"}:{" "}
                </Text>
                <Text>
                  {selectedNotification.sender?.firstName ||
                    selectedNotification.sender?.name ||
                    "System"}
                </Text>
              </div>
            )}

            {selectedNotification.read && (
              <div style={{ marginTop: 16 }}>
                <Tag color="green">
                  {t("adminDashboard.notifications.read") || "Read"}
                </Tag>
              </div>
            )}
          </div>
        )}
      </Modal>
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

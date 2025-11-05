import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Layout,
  Spin,
  message,
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
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { API_BASE_URL, getAuthHeaders } from "../utils/adminApiUtils";

// Layout Components
import TeacherLayout from "./teacher/TeacherLayout";
import TeacherHeader from "./teacher/TeacherHeader";

// Page Components
import TeacherDashboardOverview from "./teacher/TeacherDashboardOverview";
import TeacherMyClasses from "./teacher/TeacherMyClasses";
import TeacherMaterials from "./teacher/TeacherMaterials";
import TeacherQuizManagement from "./teacher/TeacherQuizManagement";
import TeacherAssignmentCenter from "./teacher/TeacherAssignmentCenter";
import TeacherListeningExercises from "./teacher/TeacherListeningExercises";
import TeacherStudentManagement from "./teacher/TeacherStudentManagement";
import TeacherLiveClasses from "./teacher/TeacherLiveClasses";
import TeacherGradingCenter from "./teacher/TeacherGradingCenter";
import TeacherAnalytics from "./teacher/TeacherAnalytics";
import TeacherSettings from "./teacher/TeacherSettings";

// Styles
import "../styles/AdminSidebar.css";
import "../styles/DashboardStats.css";

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * TeacherDashboard - Main Coordinator Component
 *
 * This is a lightweight wrapper that:
 * 1. Manages authentication and basic layout
 * 2. Routes between different teacher sections based on sidebar selection
 * 3. Provides props to child components
 *
 * The actual functionality for each section has been moved to separate files:
 * - TeacherDashboardOverview.js - Overview/Dashboard section
 * - TeacherMyClasses.js - My Classes section
 * - TeacherMaterials.js - Materials section
 * - TeacherQuizManagement.js - Quiz Management section
 * - TeacherAssignmentCenter.js - Assignment Center section
 * - TeacherListeningExercises.js - Listening Exercises section
 * - TeacherStudentManagement.js - Student Management section
 * - TeacherLiveClasses.js - Live Classes section
 * - TeacherGradingCenter.js - Grading Center section
 * - TeacherAnalytics.js - Analytics section
 * - TeacherSettings.js - Settings section
 */
const TeacherDashboard = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  // Layout and UI State
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
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

        if (!token) {
          history.push("/login");
          return;
        }

        // Get user data from localStorage or session
        const userRole = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        const userName = localStorage.getItem("userName");
        const userId = localStorage.getItem("userId");

        const userDataStr =
          localStorage.getItem("currentUser") ||
          sessionStorage.getItem("currentUser");
        const userData = userDataStr ? JSON.parse(userDataStr) : null;

        // Check if user has teacher permissions
        if (!["teacher", "faculty", "admin", "superadmin"].includes(userRole)) {
          message.error("Access denied. Teacher role required.");
          history.push("/");
          return;
        }

        // Create user object from stored data
        const finalUserData = {
          id: userId,
          email: userEmail,
          role: userRole,
          name: userName,
          ...userData,
        };

        setCurrentUser(finalUserData);
        setLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
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
      history,
    };

    switch (activeKey) {
      case "overview":
        return <TeacherDashboardOverview {...contentProps} />;
      case "classes":
        return <TeacherMyClasses {...contentProps} />;
      case "materials":
        return <TeacherMaterials {...contentProps} />;
      case "quizzes":
        return <TeacherQuizManagement {...contentProps} />;
      case "assignments":
        return <TeacherAssignmentCenter {...contentProps} />;
      case "listening":
        return <TeacherListeningExercises {...contentProps} />;
      case "students":
        return <TeacherStudentManagement {...contentProps} />;
      case "live":
        return <TeacherLiveClasses {...contentProps} />;
      case "grading":
        return <TeacherGradingCenter {...contentProps} />;
      case "analytics":
        return <TeacherAnalytics {...contentProps} />;
      case "settings":
        return <TeacherSettings {...contentProps} />;
      default:
        return <TeacherDashboardOverview {...contentProps} />;
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

  const handleNotificationClick = () => {
    const newVisible = !notificationDrawerVisible;
    setNotificationDrawerVisible(newVisible);
    // Always refresh when opening drawer to get latest notifications
    if (newVisible) {
      console.log(
        "🔄 Teacher Dashboard - Opening notification drawer, fetching notifications..."
      );
      fetchNotifications();

      // Clear any existing interval to prevent duplicates
      if (window._notificationRefreshInterval) {
        clearInterval(window._notificationRefreshInterval);
        window._notificationRefreshInterval = null;
      }
    } else {
      // Clear the refresh interval when drawer closes
      if (window._notificationRefreshInterval) {
        clearInterval(window._notificationRefreshInterval);
        window._notificationRefreshInterval = null;
        console.log(
          "🔔 Teacher Dashboard - Notification drawer closed, stopped refresh"
        );
      }
    }
  };

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    setNotificationLoading(true);
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      let transformedNotifications = [];

      // Get deleted notification IDs from localStorage to filter them out
      const deletedNotificationIds = JSON.parse(
        localStorage.getItem("deletedNotificationIds") || "[]"
      );

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

              transformedNotifications = data.notifications
                .filter((notification) => {
                  const notificationId = notification._id || notification.id;
                  // Filter out deleted notifications
                  return !deletedNotificationIds.includes(notificationId);
                })
                .map((notification) => {
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
                    announcementId: notification.announcementId,
                    actionUrl: notification.actionUrl,
                  };
                });
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

        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        console.log(
          "📋 Teacher Dashboard - Raw local notifications:",
          localNotifications.length
        );
        if (localNotifications.length > 0) {
          console.log(
            "📋 Teacher Dashboard - Sample local notifications:",
            localNotifications.slice(0, 3).map((n) => ({
              id: n.id || n._id,
              type: n.type,
              targetAudience: n.targetAudience,
              title: n.title?.substring(0, 30),
            }))
          );
        }

        const localTransformed = localNotifications
          .filter((notif) => {
            const notificationId = notif._id || notif.id;
            // Filter out deleted notifications
            if (deletedNotificationIds.includes(notificationId)) {
              console.log(
                "🗑️ Teacher Dashboard - Filtered out deleted notification:",
                notificationId
              );
              return false;
            }

            const matches =
              notif.targetAudience === "teachers" ||
              notif.targetAudience === "all" ||
              notif.type === "announcement" ||
              notif.type === "admin_announcement";
            if (!matches && localNotifications.length > 0) {
              console.log("❌ Teacher Dashboard - Filtered out notification:", {
                type: notif.type,
                targetAudience: notif.targetAudience,
                title: notif.title?.substring(0, 30),
              });
            }
            return matches;
          })
          .map((notification) => {
            const notificationId =
              notification._id || notification.id || `local_${Date.now()}`;
            // Check if this notification has been marked as read
            const isRead =
              notification.read || readNotificationIds.includes(notificationId);

            return {
              id: notificationId,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              timestamp: notification.timestamp || notification.createdAt,
              read: isRead,
              priority: notification.priority || "medium",
              icon: getNotificationIcon(notification.type),
              color: getNotificationColor(notification.type),
              sender: notification.sender,
              source: "local",
              announcementId: notification.announcementId,
              actionUrl: notification.actionUrl,
            };
          });

        // Merge API and local notifications, preserving read status
        const allNotifications = [
          ...transformedNotifications,
          ...localTransformed,
        ];
        console.log(
          "📋 Teacher Dashboard - All notifications before deduplication:",
          allNotifications.length
        );
        console.log(
          "📋 Teacher Dashboard - Local transformed:",
          localTransformed.length
        );

        // Deduplicate and merge, preserving read status from readNotificationIds
        // Use a Map for better deduplication by ID
        const notificationMap = new Map();

        allNotifications.forEach((notification) => {
          const notificationId = notification.id;
          if (!notificationId) return; // Skip notifications without ID

          // Check if we already have this notification
          if (!notificationMap.has(notificationId)) {
            // Apply read status from readNotificationIds
            if (readNotificationIds.includes(notificationId)) {
              notification.read = true;
            }
            notificationMap.set(notificationId, notification);
          } else {
            // If duplicate, merge properties and preserve read status
            const existing = notificationMap.get(notificationId);
            if (readNotificationIds.includes(notificationId)) {
              existing.read = true;
            }
            // Prefer newer timestamp if available
            if (
              notification.timestamp &&
              (!existing.timestamp ||
                new Date(notification.timestamp) > new Date(existing.timestamp))
            ) {
              existing.timestamp = notification.timestamp;
            }
          }
        });

        const uniqueNotifications = Array.from(notificationMap.values());

        // Sort by timestamp (newest first)
        uniqueNotifications.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt || 0);
          const timeB = new Date(b.timestamp || b.createdAt || 0);
          return timeB - timeA;
        });

        // Remove duplicate announcements (same announcementId) - keep only the newest
        const announcementMap = new Map();
        const finalNotifications = [];
        uniqueNotifications.forEach((notification) => {
          if (notification.announcementId) {
            const key = `announce_${notification.announcementId}`;
            if (!announcementMap.has(key)) {
              announcementMap.set(key, notification);
              finalNotifications.push(notification);
            } else {
              // If duplicate announcement, prefer the newer one
              const existing = announcementMap.get(key);
              const existingTime = new Date(
                existing.timestamp || existing.createdAt || 0
              );
              const newTime = new Date(
                notification.timestamp || notification.createdAt || 0
              );
              if (newTime > existingTime) {
                const index = finalNotifications.indexOf(existing);
                if (index !== -1) {
                  finalNotifications[index] = notification;
                  announcementMap.set(key, notification);
                }
              }
            }
          } else {
            finalNotifications.push(notification);
          }
        });

        console.log(
          "📋 Teacher Dashboard - Final notifications after announcement deduplication:",
          finalNotifications.length
        );
        transformedNotifications = finalNotifications;
      } catch (localError) {
        console.log("Local notifications not available");
      }

      // Final sort by timestamp (newest first) to ensure latest notifications appear first
      transformedNotifications.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.createdAt || 0);
        const timeB = new Date(b.timestamp || b.createdAt || 0);
        return timeB - timeA; // Newest first
      });

      setNotifications(transformedNotifications);
      const unread = transformedNotifications.filter((n) => !n.read).length;

      // Check if we have new unread notifications compared to before
      const previousUnreadCount = unreadCount;
      setUnreadCount(unread);

      // Show a subtle toast notification if new notifications arrived while drawer is closed
      if (unread > previousUnreadCount && !notificationDrawerVisible) {
        const newCount = unread - previousUnreadCount;
        message.info({
          content: `📢 ${newCount} new notification${newCount > 1 ? "s" : ""}`,
          duration: 2,
        });
      }

      console.log(
        "🔔 Teacher Dashboard - Fetched notifications:",
        transformedNotifications.length,
        "Unread:",
        unread
      );
      console.log(
        "🔔 Teacher Dashboard - Latest 5 notifications:",
        transformedNotifications.slice(0, 5).map((n) => ({
          id: n.id,
          title: n.title?.substring(0, 40),
          read: n.read,
          timestamp: n.timestamp || n.createdAt,
          source: n.source || "API",
          type: n.type,
          targetAudience: n.targetAudience,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  }, [t]); // Add dependencies

  // Get notification icon based on type
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
    };
    return iconMap[type] || "bell";
  };

  // Get notification color based on type
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
    };
    return colorMap[type] || "#1890ff";
  };

  // Get translated notification type
  const getNotificationTypeLabel = (type) => {
    const translated = t(`teacherDashboard.notifications.types.${type}`);
    return translated === `teacherDashboard.notifications.types.${type}`
      ? type
      : translated;
  };

  // Create notification for admin when teacher reads an announcement
  const createAdminReadNotification = async (notification) => {
    try {
      // Only create notification if it's from admin and not already read
      if (
        notification.type === "announcement" ||
        notification.type === "admin_announcement"
      ) {
        const teacherName =
          currentUser?.firstName || currentUser?.name || "Teacher";
        const teacherLastName = currentUser?.lastName || "";
        const fullName = `${teacherName} ${teacherLastName}`.trim();

        const readNotificationData = {
          type: "notification_read",
          title:
            t("teacherDashboard.notifications.readNotification.title", {
              name: fullName,
            }) || `${fullName} read your notification`,
          message:
            t("teacherDashboard.notifications.readNotification.message", {
              name: fullName,
              title: notification.title || "announcement",
            }) ||
            `${fullName} has read your notification: "${
              notification.title || "announcement"
            }"`,
          priority: "low",
          targetAudience: "admins",
          readerName: fullName,
          readerRole: "teacher",
          announcementId: notification.announcementId,
          actionUrl: notification.actionUrl,
          icon: "✓",
          color: "#52c41a",
        };

        // Try to send to API
        const token =
          localStorage.getItem("authToken") || localStorage.getItem("token");
        if (token) {
          try {
            const notificationEndpoints = [
              `${API_BASE_URL}/api/notifications`,
              `${API_BASE_URL}/notifications`,
              `${API_BASE_URL}/api/admin/notifications`,
            ];

            for (const endpoint of notificationEndpoints) {
              try {
                const response = await fetch(endpoint, {
                  method: "POST",
                  headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(readNotificationData),
                });

                if (response && response.ok) {
                  console.log("✅ Read notification sent to admin via API");
                  return; // Success, exit
                }
              } catch (error) {
                continue; // Try next endpoint
              }
            }
          } catch (error) {
            console.log("Could not send read notification to API");
          }
        }

        // Fallback: Save to local storage for admin
        try {
          const localNotifications = JSON.parse(
            localStorage.getItem("localNotifications") || "[]"
          );
          const uniqueId = `read_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          const readNotification = {
            ...readNotificationData,
            _id: uniqueId,
            id: uniqueId,
            createdAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            isLocal: true,
            read: false,
          };
          localNotifications.push(readNotification);
          localStorage.setItem(
            "localNotifications",
            JSON.stringify(localNotifications)
          );
          console.log(
            "✅ Read notification saved locally for admin:",
            readNotification
          );
          console.log(
            "📋 Total local notifications:",
            localNotifications.length
          );
        } catch (error) {
          console.error("Could not save read notification locally:", error);
        }
      }
    } catch (error) {
      console.error("Error creating admin read notification:", error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      // Find the notification to check if we need to notify admin
      const notification = notifications.find((n) => n.id === notificationId);

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

      // Create notification for admin if this is an admin announcement
      if (
        notification &&
        (notification.type === "announcement" ||
          notification.type === "admin_announcement")
      ) {
        console.log(
          "📢 Teacher Dashboard - Creating read notification for admin:",
          notification
        );
        await createAdminReadNotification(notification);
      } else {
        console.log(
          "📢 Teacher Dashboard - Not creating read notification. Notification type:",
          notification?.type
        );
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

      // Update local state IMMEDIATELY - use functional update to ensure we have latest state
      setNotifications((prev) => {
        const updated = prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        );
        // Recalculate unread count immediately
        const unread = updated.filter((n) => !n.read).length;
        setUnreadCount(unread);
        console.log(
          "✅ Teacher Dashboard - Marked notification as read:",
          notificationId,
          "Unread count:",
          unread
        );
        return updated;
      });

      // Refresh notifications to ensure consistency
      setTimeout(() => {
        fetchNotifications();
      }, 500);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

      message.success(t("teacherDashboard.notifications.deleteSuccess"));
      console.log("✅ Notification deleted successfully:", notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error(t("teacherDashboard.notifications.deleteError"));
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

  // Handle notification item click - show details modal
  const handleNotificationItemClick = async (notification) => {
    setSelectedNotification(notification);
    setNotificationDetailModalVisible(true);

    // Mark as read if unread
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    // Refresh periodically to catch new notifications
    const interval = setInterval(() => {
      console.log("🔄 Teacher Dashboard - Auto-refreshing notifications...");
      fetchNotifications();
    }, 30000); // Refresh every 30 seconds (more reasonable)

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px" }}>
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TeacherLayout
        activeKey={activeKey}
        onMenuClick={handleMenuClick}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileDrawerVisible={mobileDrawerVisible}
        onMobileDrawerToggle={handleMobileDrawerToggle}
      >
        <TeacherHeader
          collapsed={collapsed}
          onCollapse={setCollapsed}
          currentUser={currentUser}
          onNotificationClick={handleNotificationClick}
          onProfileClick={() => {
            setActiveKey("settings");
          }}
          onLogout={handleLogout}
          isMobile={isMobile}
          onMobileDrawerToggle={handleMobileDrawerToggle}
          activeKey={activeKey}
          unreadCount={unreadCount}
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
      </TeacherLayout>

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
                {t("teacherDashboard.notifications.title") || "Notifications"}
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
                {t("teacherDashboard.notifications.markAllRead") ||
                  "Mark all as read"}
              </Button>
            )}
          </div>
        }
        placement="right"
        width={isMobile ? "100%" : 440}
        open={notificationDrawerVisible}
        onClose={() => {
          // Clear quick refresh interval when drawer closes
          if (window._notificationRefreshInterval) {
            clearInterval(window._notificationRefreshInterval);
            window._notificationRefreshInterval = null;
          }
          setNotificationDrawerVisible(false);
        }}
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
            onClick={() => {
              // Clear quick refresh interval when drawer closes
              if (window._notificationRefreshInterval) {
                clearInterval(window._notificationRefreshInterval);
                window._notificationRefreshInterval = null;
              }
              setNotificationDrawerVisible(false);
            }}
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
              t("teacherDashboard.notifications.noNotifications") ||
              "No notifications yet"
            }
            style={{ marginTop: "60px" }}
          />
        ) : (
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            {notifications.map((notification, index) => (
              <div
                key={notification.id || index}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  background: notification.read ? "#fff" : "#f6f8ff",
                  transition: "all 0.2s",
                  position: "relative",
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
                <div
                  style={{ display: "flex", gap: 12, cursor: "pointer" }}
                  onClick={() => handleNotificationItemClick(notification)}
                >
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
                    <SoundOutlined
                      style={{
                        color: getNotificationColor(notification.type),
                        fontSize: 18,
                      }}
                    />
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
                          paddingRight: "30px",
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
                {/* Delete Button - Position absolutely in top right */}
                <Popconfirm
                  title={t("teacherDashboard.notifications.deleteConfirmTitle")}
                  description={t(
                    "teacherDashboard.notifications.deleteConfirmContent"
                  )}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText={t("common.yes")}
                  cancelText={t("common.no")}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      color: "#ff4d4f",
                      opacity: 0.6,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.6";
                    }}
                  />
                </Popconfirm>
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
                {t("teacherDashboard.notifications.refresh") || "Refresh"}
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={markAllNotificationsAsRead}
                disabled={unreadCount === 0}
              >
                {t("teacherDashboard.notifications.markAllAsRead") ||
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
            <SoundOutlined
              style={{
                color: selectedNotification
                  ? getNotificationColor(selectedNotification.type)
                  : "#1890ff",
                fontSize: 20,
              }}
            />
            <span>
              {t("teacherDashboard.notifications.details") ||
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
            {t("teacherDashboard.notifications.close") || "Close"}
          </Button>,
          selectedNotification?.actionUrl && (
            <Button
              key="view"
              type="primary"
              onClick={() => {
                if (selectedNotification.actionUrl) {
                  history.push(selectedNotification.actionUrl);
                  setNotificationDetailModalVisible(false);
                  setNotificationDrawerVisible(false);
                  setSelectedNotification(null);
                }
              }}
            >
              {t("teacherDashboard.notifications.viewDetails") ||
                "View Details"}
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
                  {t("teacherDashboard.notifications.type") || "Type"}:{" "}
                </Text>
                <Tag color={getNotificationColor(selectedNotification.type)}>
                  {getNotificationTypeLabel(
                    selectedNotification.type || "announcement"
                  )}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>
                  {t("teacherDashboard.notifications.priority") || "Priority"}:{" "}
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

            {selectedNotification.sender && (
              <div style={{ marginTop: 16 }}>
                <Text strong>
                  {t("teacherDashboard.notifications.sender") || "From"}:{" "}
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
                  {t("teacherDashboard.notifications.read") || "Read"}
                </Tag>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default TeacherDashboard;

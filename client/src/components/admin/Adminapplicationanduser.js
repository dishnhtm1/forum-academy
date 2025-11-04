import React, { useState, useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Statistic,
  Tabs,
  Space,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Typography,
  Modal,
  Descriptions,
  Divider,
  Popconfirm,
  message,
  notification,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";

const { Text } = Typography;

const Adminapplicationanduser = ({ t }) => {
  const history = useHistory();
  // i18n fallback to ensure current site language is used if prop t is missing or static
  const { t: tHook, i18n } = useTranslation();

  // Context - handle case when context is undefined
  const context = useContext(AdminContext);
  const contextDashboardStats = context?.dashboardStats;
  const contextFetchDashboardStats = context?.fetchDashboardStats;

  // Local state
  const [localDashboardStats, setLocalDashboardStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });

  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [replyType, setReplyType] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // UI state: show all rows per table
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
  });
  // Pagination (applications)
  const [applicationsPagination, setApplicationsPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Unified translator ensures we always use active locale
  const tr = (key) => {
    try {
      const primary = typeof t === "function" ? t(key) : undefined;
      return primary !== undefined ? primary : tHook(key);
    } catch (e) {
      return tHook ? tHook(key) : key;
    }
  };

  // Safe translation fallback: avoids showing raw keys when missing
  const tt = (key, fallback) => {
    try {
      const value = tr(key);
      if (
        !value ||
        value === key ||
        (typeof value === "string" && value.includes("."))
      ) {
        return fallback;
      }
      return value;
    } catch (e) {
      return fallback;
    }
  };

  // Locale-aware fallback: returns JA fallback if current language is Japanese
  const l10n = (key, enFallback, jaFallback) => {
    const primary = tr(key);
    if (
      primary &&
      primary !== key &&
      !(typeof primary === "string" && primary.includes("."))
    ) {
      return primary;
    }
    const lang = (i18n?.language || "").toLowerCase();
    if (lang.startsWith("ja")) return jaFallback;
    return enFallback;
  };

  // Use context dashboard stats if available, otherwise use local
  const dashboardStats =
    contextDashboardStats?.totalStudents !== undefined
      ? contextDashboardStats
      : localDashboardStats;

  // Derived stats directly from current table datasets
  const derivedStats = useMemo(() => {
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (a) => a.status === "approved"
    ).length;
    const rejectedApplications = applications.filter(
      (a) => a.status === "rejected"
    ).length;
    const pendingApplications = Math.max(
      0,
      totalApplications - approvedApplications - rejectedApplications
    );
    const totalMessages = contactMessages.length;
    const messagesApproved = contactMessages.filter(
      (m) => m.status === "approved"
    ).length;
    const messagesIgnored = contactMessages.filter(
      (m) => m.status === "ignored"
    ).length;
    const messagesResolved = contactMessages.filter(
      (m) => m.status === "resolved"
    ).length;
    const messagesPending = contactMessages.filter(
      (m) => m.status === "pending" || !m.status
    ).length;
    const usersApproved = users.filter((u) => u.isApproved === true).length;
    const usersRejected = users.filter((u) => u.isApproved === false).length;
    const pendingUsers = users.filter(
      (u) => u.isApproved !== true && u.isApproved !== false
    ).length;
    const usersStudents = users.filter(
      (u) => (u.role || "").toLowerCase() === "student"
    ).length;
    const usersTeachers = users.filter(
      (u) => (u.role || "").toLowerCase() === "teacher"
    ).length;
    const usersAdmins = users.filter(
      (u) => (u.role || "").toLowerCase() === "admin"
    ).length;
    return {
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalMessages,
      messagesApproved,
      messagesIgnored,
      messagesResolved,
      messagesPending,
      usersApproved,
      usersRejected,
      pendingUsers,
      usersStudents,
      usersTeachers,
      usersAdmins,
    };
  }, [applications, contactMessages, users]);

  // Reset applications pagination when filters/search change
  useEffect(() => {
    setApplicationsPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchTerm, filterStatus]);

  // Fetch functions
  const fetchApplications = async () => {
    let apiApplications = [];
    const skipApiTesting = localStorage.getItem("skipApiTesting") === "true";
    const skipAuthRedirects =
      localStorage.getItem("skipAuthRedirects") === "true";

    console.log(`🔍 API Testing: ${skipApiTesting ? "SKIPPED" : "ENABLED"}`);

    if (!skipApiTesting) {
      const endpoints = [
        `${API_BASE_URL}/api/applications`,
        `${API_BASE_URL}/api/student-applications`,
      ];

      for (const endpoint of endpoints) {
        try {
          let headers = getAuthHeaders();
          console.log(`🔍 Trying endpoint: ${endpoint}`);

          let response = await fetch(endpoint, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            headers: headers,
          });

          console.log(`📡 Response status: ${response.status} for ${endpoint}`);

          if (response.status === 401 && !skipAuthRedirects) {
            localStorage.clear();
            history.push("/login");
            return;
          }

          if (response.ok) {
            const data = await response.json();
            apiApplications = data.applications || data || [];
            console.log(
              `✅ Fetched ${apiApplications.length} applications from ${endpoint}`
            );
            break;
          }
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}, trying next...`);
          continue;
        }
      }
    }

    let localApplications = [];
    try {
      const localData = localStorage.getItem("applications");
      if (localData) {
        localApplications = JSON.parse(localData);
      }
    } catch (error) {
      console.log("No local applications found");
    }

    let processedApplications =
      apiApplications.length > 0 ? apiApplications : localApplications;
    let finalApplications = [...processedApplications];

    const updatedStatuses = JSON.parse(
      localStorage.getItem("applicationStatuses") || "{}"
    );
    if (Object.keys(updatedStatuses).length > 0) {
      console.log(
        `🔄 Applying ${
          Object.keys(updatedStatuses).length
        } localStorage status updates...`
      );
      finalApplications = finalApplications.map((app) => ({
        ...app,
        status: updatedStatuses[app._id] || app.status,
      }));
    }

    setApplications(finalApplications);
    console.log(`📊 Final applications loaded: ${finalApplications.length}`);
  };

  const fetchContactMessages = async () => {
    let apiMessages = [];
    const endpoints = [`${API_BASE_URL}/api/contact`];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          localStorage.clear();
          history.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          apiMessages = data.contacts || data || [];
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${endpoint}, trying next...`);
        continue;
      }
    }

    let localMessages = [];
    try {
      const localNotifications = JSON.parse(
        localStorage.getItem("localNotifications") || "[]"
      );
      const contactNotifications = localNotifications.filter(
        (notif) => notif.type === "contact" || notif.type === "contact_message"
      );

      localMessages = contactNotifications.map((notif) => ({
        _id: notif.contactId || `contact_${Date.now()}`,
        name: notif.senderName || "Unknown",
        email: notif.email || "unknown@example.com",
        subject: notif.subject || "Contact Message",
        message: notif.message || "No message content",
        status: "pending",
        createdAt: notif.timestamp || new Date().toISOString(),
        isLocal: true,
      }));
    } catch (error) {
      console.log("No local contact messages found");
    }

    const allMessages = [...apiMessages, ...localMessages];
    const uniqueMessages = allMessages.filter(
      (message, index, self) =>
        index ===
        self.findIndex(
          (msg) =>
            msg._id === message._id ||
            (msg.email === message.email && msg.subject === message.subject)
        )
    );

    setContactMessages(uniqueMessages);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        message.success(
          `Application ${status} successfully! (Status saved locally)`
        );
        fetchApplications();
        setApplicationModalVisible(false);
        return;
      } else {
        const errorData = await response.json();
        console.log(`API call failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.log(`API call failed for ${status}, updating local data...`);
    }

    try {
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: status } : app
        )
      );

      const updatedStatuses = JSON.parse(
        localStorage.getItem("applicationStatuses") || "{}"
      );
      updatedStatuses[applicationId] = status;
      localStorage.setItem(
        "applicationStatuses",
        JSON.stringify(updatedStatuses)
      );

      if (contextFetchDashboardStats) {
        await contextFetchDashboardStats();
      }

      message.success(`Application ${status} successfully! (Updated locally)`);
      setApplicationModalVisible(false);

      notification.success({
        message: `Application ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }`,
        description: `The application has been ${status} successfully.`,
        duration: 3,
      });
    } catch (error) {
      console.error(`Error ${status} application locally:`, error);
      message.error(`Failed to ${status} application`);
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      const endpoints = [
        `${API_BASE_URL}/api/applications/${applicationId}`,
        `${API_BASE_URL}/api/student-applications/${applicationId}`,
        `http://localhost:5000/api/applications/${applicationId}`,
      ];

      let deleted = false;
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          if (response.status === 401) {
            localStorage.clear();
            history.push("/login");
            return;
          }
          if (response.ok) {
            deleted = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (deleted) {
        message.success(
          l10n(
            "adminDashboard.applications.deleted",
            "Application deleted",
            "申請を削除しました"
          )
        );
        fetchApplications();
      } else {
        // local fallback
        setApplications((prev) => prev.filter((a) => a._id !== applicationId));
        message.warning(
          l10n(
            "adminDashboard.applications.deletedLocally",
            "Server unavailable. Deleted locally.",
            "サーバーに接続できません。ローカルで削除しました。"
          )
        );
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      message.error(
        l10n(
          "adminDashboard.applications.deleteError",
          "Failed to delete application",
          "削除に失敗しました"
        )
      );
    }
  };

  const updateContactStatus = async (messageId, newStatus) => {
    try {
      // Check if this is a valid MongoDB ObjectId (24 hex characters)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(messageId);

      if (!isValidObjectId) {
        console.log("Local message, updating status locally only");
        // This is a local message, just update it in state and localStorage
        const updated = contactMessages.map((m) =>
          m._id === messageId ? { ...m, status: newStatus } : m
        );
        setContactMessages(updated);

        // Also update in localStorage
        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        const updatedNotifs = localNotifications.map((notif) =>
          notif.contactId === messageId
            ? { ...notif, status: newStatus }
            : notif
        );
        localStorage.setItem(
          "localNotifications",
          JSON.stringify(updatedNotifs)
        );

        message.success(`Message marked as ${newStatus}`);
        return;
      }

      // This is a real database message, update on backend
      const headers = getAuthHeaders();
      headers["Content-Type"] = "application/json";

      const response = await fetch(
        `${API_BASE_URL}/api/contact/${messageId}/status`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401) {
        setTimeout(() => {
          localStorage.clear();
          history.push("/login");
        }, 0);
        return;
      }

      if (response.ok) {
        fetchContactMessages();
        message.success(`Message marked as ${newStatus}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        message.error(errorData.message || "Failed to update contact status");
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      message.error("Error updating contact status");
    }
  };

  const deleteContact = async (messageId) => {
    try {
      // Check if this is a valid MongoDB ObjectId (24 hex characters)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(messageId);

      if (!isValidObjectId) {
        console.log("Local message, deleting from localStorage only");
        // This is a local message, just remove it from state and localStorage
        const remaining = contactMessages.filter((m) => m._id !== messageId);
        setContactMessages(remaining);

        // Also remove from localStorage
        const localNotifications = JSON.parse(
          localStorage.getItem("localNotifications") || "[]"
        );
        const filtered = localNotifications.filter(
          (notif) => notif.contactId !== messageId
        );
        localStorage.setItem("localNotifications", JSON.stringify(filtered));

        message.success(
          l10n(
            "adminDashboard.contact.deleted",
            "Message deleted",
            "メッセージを削除しました"
          )
        );
        return;
      }

      // This is a real database message, delete from backend
      const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        setTimeout(() => {
          localStorage.clear();
          history.push("/login");
        }, 0);
        return;
      }

      if (response.ok) {
        message.success(
          l10n(
            "adminDashboard.contact.deleted",
            "Message deleted",
            "メッセージを削除しました"
          )
        );
        fetchContactMessages();
      } else {
        const errorData = await response.json().catch(() => ({}));
        message.error(
          errorData.message ||
            l10n(
              "adminDashboard.contact.deleteError",
              "Failed to delete message",
              "削除に失敗しました"
            )
        );
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error(
        l10n(
          "adminDashboard.contact.deleteError",
          "Failed to delete message",
          "削除に失敗しました"
        )
      );
    }
  };

  const updateUserStatus = async (userId, isApproved, rejectionReason = "") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/approval`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            approved: isApproved,
            rejectionReason,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        const action = isApproved ? "approved" : "rejected";
        message.success(`User ${action} successfully`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Error updating user status");
    }
  };

  // Apply quick reply template with name substitution
  const applyTemplate = (templateKey) => {
    const recipientName =
      replyTarget?.fullName || replyTarget?.name || "Applicant";

    let subject = "";
    let message = "";

    // Get template text - either from translations or use fallback
    if (templateKey === "templateAcceptance") {
      const templateText = tr(`adminDashboard.applications.${templateKey}`);
      message = templateText.replace(/\{\{name\}\}/g, recipientName);
      subject =
        tr("adminDashboard.applications.subjects.subjectAcceptance") ||
        "Application Approved - Welcome to Forum Academy!";
    } else if (templateKey === "templateReceived") {
      const templateText = tr(`adminDashboard.applications.${templateKey}`);
      message = templateText.replace(/\{\{name\}\}/g, recipientName);
      subject =
        tr("adminDashboard.applications.subjects.subjectReceived") ||
        "Application Received - Forum Academy";
    } else if (templateKey === "templateRequest") {
      const templateText = tr(`adminDashboard.applications.${templateKey}`);
      message = templateText.replace(/\{\{name\}\}/g, recipientName);
      subject =
        tr("adminDashboard.applications.subjects.subjectRequest") ||
        "Additional Information Required - Forum Academy";
    } else if (templateKey === "templateRejection") {
      // Rejection template (EN/JA inline fallback)
      const isJa = (i18n?.language || "").toLowerCase().startsWith("ja");
      if (isJa) {
        subject = "申請状況のお知らせ - Forum Academy";
        message = `${recipientName} 様,

Forum Academy へのご出願ありがとうございます。

慎重に審査を行った結果、誠に残念ではございますが、今回はご期待に添いかねる結果となりました。大変心苦しいご連絡となりますが、何卒ご理解賜りますようお願い申し上げます。

今後のご活躍を心よりお祈りするとともに、条件が変わった際にはぜひ再度のご出願をご検討ください。

ご不明点等ございましたら、お気軽にお問い合わせください。

敬具
Forum Academy 入学事務局`;
      } else {
        subject =
          tr("adminDashboard.applications.subjects.subjectRejection") ||
          "Application Status Update - Forum Academy";
        message = `Dear ${recipientName},

Thank you for your interest in Forum Academy and for taking the time to submit your application.

After careful consideration, we regret to inform you that we are unable to accept your application at this time. This decision was made after a thorough review process, and we understand this may be disappointing news.

We encourage you to continue pursuing your educational goals and consider reapplying in the future when circumstances may be different.

We wish you the best in your educational journey.

Best regards,
Forum Academy Admissions Team`;
      }
    } else if (templateKey === "templateReview") {
      // Under review template (EN/JA inline fallback)
      const isJa = (i18n?.language || "").toLowerCase().startsWith("ja");
      if (isJa) {
        subject = "申請審査中 - Forum Academy";
        message = `${recipientName} 様,

Forum Academy へのご出願ありがとうございます。

現在、入学審査委員会にて申請内容を確認しております。提出いただいた書類は慎重に審査しております。

通常、3〜5営業日以内に申請状況の更新をご連絡いたします。追加情報が必要な場合は、別途ご案内いたします。

ご不明点がございましたらお気軽にお問い合わせください。

よろしくお願いいたします。
Forum Academy 入学事務局`;
      } else {
        subject =
          tr("adminDashboard.applications.subjects.subjectReview") ||
          "Application Under Review - Forum Academy";
        message = `Dear ${recipientName},

Thank you for your application to Forum Academy.

We are writing to inform you that your application is currently under review by our admissions committee. We are carefully evaluating all submitted materials.

You can expect to hear back from us within 3-5 business days with an update on your application status.

If you have any questions or need to provide additional information, please don't hesitate to contact us.

Best regards,
Forum Academy Admissions Team`;
      }
    } else if (templateKey === "templateFollowUp") {
      // Follow-up template
      subject =
        tr("adminDashboard.applications.subjects.subjectFollowUp") ||
        "Following Up on Your Application - Forum Academy";
      message = `Dear ${recipientName},

We hope this message finds you well.

We are following up on your application to Forum Academy. We wanted to check in and see if you have any questions or need any additional information from our team.

Please feel free to reach out if there's anything we can assist you with regarding your application or our programs.

We look forward to hearing from you.

Best regards,
Forum Academy Admissions Team`;
    } else if (templateKey === "templateReplyThanks") {
      // Generic thank-you reply for contact messages
      const isJa = (i18n?.language || "").toLowerCase().startsWith("ja");
      subject = isJa
        ? "お問い合わせありがとうございます - Forum Academy"
        : "Thank you for contacting Forum Academy";
      message = isJa
        ? `${recipientName} 様,\n\nこの度はお問い合わせいただきありがとうございました。\n内容を確認のうえ、担当者より改めてご連絡いたします。\n\nお急ぎの場合は、このメールにご返信ください。\n\nよろしくお願いいたします。\nForum Academy 担当者`
        : `Dear ${recipientName},\n\nThank you for reaching out to Forum Academy.\nWe have received your message and a member of our team will get back to you shortly.\n\nIf this is urgent, please reply directly to this email.\n\nBest regards,\nForum Academy Team`;
    } else if (templateKey === "templateNeedInfo") {
      // Ask for additional info reply for contact messages
      const isJa = (i18n?.language || "").toLowerCase().startsWith("ja");
      subject = isJa
        ? "追加情報のお願い - Forum Academy"
        : "Request for Additional Information - Forum Academy";
      message = isJa
        ? `${recipientName} 様,\n\nお問い合わせありがとうございます。\n詳しくご案内するため、以下の情報のご提供をお願いいたします。\n\n・お名前（フリガナ）\n・ご希望のコース / 期間\n・ご連絡のつくお電話番号\n\nご不明点があればお気軽にご返信ください。\n\nよろしくお願いいたします。\nForum Academy 担当者`
        : `Dear ${recipientName},\n\nThank you for your message. To assist you better, could you please provide the following details?\n\n- Your full name\n- Intended course / term\n- A reachable phone number\n\nFeel free to reply to this email with the requested information.\n\nBest regards,\nForum Academy Team`;
    }

    setReplySubject(subject);
    setReplyMessage(message);
    setSelectedTemplate(templateKey);
  };

  const sendReplyMessage = async () => {
    if (!replyMessage.trim()) {
      message.error(
        l10n(
          "adminDashboard.applications.modals.validationMessage",
          "Please enter a message",
          "メッセージを入力してください"
        )
      );
      return;
    }

    const emailData = {
      to: replyTarget?.email || "",
      subject: replySubject,
      message: replyMessage,
      recipientName: replyTarget?.fullName || replyTarget?.name || "",
      type: replyType,
    };

    // Try multiple backend routes for compatibility
    const endpoints = [
      `${API_BASE_URL}/api/email/send-reply`,
      `${API_BASE_URL}/api/email/send`,
      `${API_BASE_URL}/api/contact/reply`,
      `${API_BASE_URL}/contact/reply`,
      `http://localhost:5000/api/email/send-reply`,
    ];

    let sent = false;
    let lastError = null;

    try {
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(emailData),
          });

          if (response.status === 401) {
            localStorage.clear();
            history.push("/login");
            return;
          }

          if (response.ok) {
            sent = true;
            break;
          } else {
            const err = await response.json().catch(() => ({}));
            lastError = err.message || `HTTP ${response.status}`;
          }
        } catch (err) {
          lastError = err.message;
          continue;
        }
      }

      if (sent) {
        message.success(
          l10n(
            "adminDashboard.applications.modals.sentSuccess",
            "Message sent successfully!",
            "送信しました"
          )
        );
        setReplyModalVisible(false);
        setReplySubject("");
        setReplyMessage("");
        setReplyType(null);
        setReplyTarget(null);
        return;
      }

      throw new Error(lastError || "Send failed");
    } catch (error) {
      // Local fallback so admins aren't blocked
      const localMessages = JSON.parse(
        localStorage.getItem("sentMessages") || "[]"
      );
      localMessages.push({
        to: replyTarget?.email,
        subject: replySubject,
        message: replyMessage,
        sentAt: new Date().toISOString(),
        type: replyType,
        transport: "local-fallback",
      });
      localStorage.setItem("sentMessages", JSON.stringify(localMessages));

      message.warning(
        l10n(
          "adminDashboard.applications.modals.sentLocally",
          "Server unavailable. Saved locally and marked as sent.",
          "サーバーに接続できません。ローカルに保存し送信済みとして扱います。"
        )
      );

      setReplyModalVisible(false);
      setReplySubject("");
      setReplyMessage("");
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (response.status === 401) {
        localStorage.clear();
        history.push("/login");
        return;
      }

      if (response.ok) {
        message.success(`${userData.role} created successfully!`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Error creating user");
    }
  };

  const fetchLocalDashboardStats = async () => {
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter((a) => a.status === "pending")
        .length,
      approvedApplications: applications.filter((a) => a.status === "approved")
        .length,
      rejectedApplications: applications.filter((a) => a.status === "rejected")
        .length,
      totalMessages: contactMessages.length,
      unreadMessages: contactMessages.filter((m) => m.status === "pending")
        .length,
    };
    setLocalDashboardStats(stats);
  };

  // useEffect to fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchApplications(),
        fetchContactMessages(),
        fetchUsers(),
      ]);

      if (contextFetchDashboardStats) {
        await contextFetchDashboardStats();
      } else {
        await fetchLocalDashboardStats();
      }
    };

    fetchInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update stats when applications or messages change
  useEffect(() => {
    if (!contextFetchDashboardStats) {
      fetchLocalDashboardStats();
    }
  }, [applications, contactMessages]); // eslint-disable-line react-hooks/exhaustive-deps

  const applicationColumns = [
    {
      title: t("table.applicant"),
      dataIndex: "fullName",
      key: "fullName",
      render: (name, record) => {
        const displayName =
          name ||
          [record.firstName, record.lastName].filter(Boolean).join(" ") ||
          record.name ||
          tr("common.notProvided") ||
          "—";
        return (
          <div>
            <Text strong>{displayName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email || ""}
            </Text>
          </div>
        );
      },
    },
    {
      title: t("table.program"),
      dataIndex: "course",
      key: "course",
      render: (course, record) => (
        <Tag color="blue">
          {course || record.program || t("common.notProvided")}
        </Tag>
      ),
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          pending: {
            color: "orange",
            icon: <ClockCircleOutlined />,
            text: t("status.pending") || "PENDING",
          },
          approved: {
            color: "green",
            icon: <CheckCircleOutlined />,
            text: t("status.approved") || "APPROVED",
          },
          rejected: {
            color: "red",
            icon: <CloseCircleOutlined />,
            text: t("status.rejected") || "REJECTED",
          },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag
            color={config.color}
            icon={config.icon}
            className="pill-tag"
            style={{
              fontSize: 12,
              fontWeight: "bold",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: t("table.applied"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: t("table.actions"),
      key: "actions",
      width: 300,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedApplication(record);
              setApplicationModalVisible(true);
            }}
          >
            {l10n("actions.view", "View", "表示")}
          </Button>
          <Button
            icon={<MessageOutlined />}
            size="small"
            onClick={() => {
              setReplyType("application");
              setReplyTarget(record);
              setReplySubject(
                `Re: Application - ${
                  record.fullName || record.name || "Applicant"
                }`
              );
              setReplyMessage("");
              setReplyModalVisible(true);
            }}
          >
            {l10n("actions.reply", "Reply", "返信")}
          </Button>
          <Popconfirm
            title={l10n(
              "adminDashboard.applications.confirmDeleteTitle",
              "Delete this application?",
              "この申請を削除しますか？"
            )}
            description={l10n(
              "adminDashboard.applications.confirmDeleteDesc",
              "This action cannot be undone.",
              "この操作は取り消せません。"
            )}
            okText={l10n("common.delete", "Delete", "削除")}
            cancelText={l10n("common.cancel", "Cancel", "キャンセル")}
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteApplication(record._id)}
          >
            <Button danger size="small">
              {l10n("common.delete", "Delete", "削除")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const messageColumns = [
    {
      title: t("adminDashboard.contact.contactInfo"),
      key: "contact",
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: t("adminDashboard.contact.subject"),
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {subject}
        </Text>
      ),
    },
    {
      title: t("adminDashboard.contact.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          pending: {
            color: "orange",
            text: t("adminDashboard.contact.statusValues.pending"),
          },
          resolved: {
            color: "green",
            text: t("adminDashboard.contact.statusValues.resolved"),
          },
          approved: {
            color: "blue",
            text: t("adminDashboard.contact.statusValues.approved"),
          },
          ignored: {
            color: "red",
            text: t("adminDashboard.contact.statusValues.ignored"),
          },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status || t("adminDashboard.contact.statusValues.unknown"),
        };
        return (
          <Tag color={config.color} className="pill-tag">
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: t("adminDashboard.contact.received"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: t("adminDashboard.contact.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedMessage(record);
              setMessageModalVisible(true);
              if (record.status === "pending")
                updateContactStatus(record._id, "resolved");
            }}
          >
            {t("adminDashboard.contact.view")}
          </Button>
          <Button
            icon={<MessageOutlined />}
            size="small"
            onClick={() => {
              setReplyType("message");
              setReplyTarget(record);
              setReplySubject(`Re: ${record.subject || "Message"}`);
              setReplyMessage("");
              setReplyModalVisible(true);
            }}
          >
            {l10n("adminDashboard.applications.modals.reply", "Reply", "返信")}
          </Button>
          {record.status === "pending" && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              onClick={() => updateContactStatus(record._id, "resolved")}
            >
              {t("adminDashboard.contact.markResolved")}
            </Button>
          )}
          <Popconfirm
            title={l10n(
              "adminDashboard.contact.confirmDeleteTitle",
              "Delete this message?",
              "このメッセージを削除しますか？"
            )}
            description={l10n(
              "adminDashboard.contact.confirmDeleteDesc",
              "This action cannot be undone.",
              "この操作は取り消せません。"
            )}
            okText={l10n("common.delete", "Delete", "削除")}
            cancelText={l10n("common.cancel", "Cancel", "キャンセル")}
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteContact(record._id)}
          >
            <Button danger size="small">
              {l10n("adminDashboard.contact.delete", "Delete", "削除")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: t("adminDashboard.users.userInfo"),
      key: "userInfo",
      render: (_, record) => (
        <div>
          <Text strong>
            {record.firstName} {record.lastName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: t("adminDashboard.users.role"),
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "teacher"
              ? "blue"
              : role === "student"
              ? "green"
              : "default"
          }
        >
          {t(`adminDashboard.users.roleValues.${role?.toLowerCase()}`)}
        </Tag>
      ),
    },
    {
      title: t("adminDashboard.users.status"),
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) =>
        isApproved === true ? (
          <Tag
            color="green"
            icon={<CheckCircleOutlined />}
            className="pill-tag"
          >
            {t("adminDashboard.users.statusValues.approved")}
          </Tag>
        ) : isApproved === false ? (
          <Tag color="red" icon={<CloseCircleOutlined />} className="pill-tag">
            {t("adminDashboard.users.statusValues.rejected")}
          </Tag>
        ) : (
          <Tag color="orange" className="pill-tag">
            {t("adminDashboard.users.statusValues.pending")}
          </Tag>
        ),
    },
    {
      title: t("adminDashboard.users.registrationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: t("adminDashboard.users.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          >
            {t("adminDashboard.users.view")}
          </Button>
          {record.isApproved !== true && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => updateUserStatus(record._id, true)}
            >
              {t("adminDashboard.users.approve")}
            </Button>
          )}
          {record.isApproved !== false && (
            <Button
              icon={<CloseOutlined />}
              size="small"
              danger
              onClick={() => updateUserStatus(record._id, false)}
            >
              {t("adminDashboard.users.reject")}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "pending"
        ? !(app.status === "approved" || app.status === "rejected")
        : app.status === filterStatus);
    const matchesSearch =
      !searchTerm ||
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      [app.firstName, app.lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMessages = contactMessages.filter((msg) => {
    const matchesSearch =
      !searchTerm ||
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Lightweight, component-scoped styles to elevate table visuals */}
      <style>{`
        .elevated-card {
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
        }

        /* Tabs icon labels */
        .tab-label { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: #2b3a55; }
        .tab-icon { width: 16px; height: 16px; display: inline-block; }
        .table-toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        /* Higher specificity to override Ant styles */
        .elegant-table.elegant-table .ant-table-thead > tr > th {
          background: linear-gradient(180deg, #fbfdff 0%, #f5f7fb 100%);
          color: #2b3a55;
          font-weight: 600;
          border-bottom: 1px solid #eef1f5 !important;
        }
        .elegant-table.elegant-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .elegant-table.elegant-table .row--odd > td {
          background: #fcfdff !important;
        }
        .elegant-table.elegant-table .ant-table-tbody > tr:hover > td {
          background: #f0f7ff !important;
          transition: background 0.25s ease;
        }
        .pill-tag {
          border-radius: 999px;
          padding: 2px 10px;
          font-weight: 600;
        }
        /* Make cells compact and polished */
        .elegant-table.elegant-table .ant-table-cell {
          padding: 10px 14px !important;
        }
        /* Sticky header shadow */
        .elegant-table .ant-table-sticky-holder {
          box-shadow: 0 6px 12px rgba(0,0,0,0.04);
        }
        /* Page title icon */
        .page-title { display:flex; align-items:center; gap:10px; }
        .page-icon { width:22px; height:22px; color:#5b77ff; }
        /* Small inline icons for buttons */
        .btn-icon { display:inline-flex; vertical-align:middle; margin-right:6px; }
      `}</style>
      <Typography.Title level={2} className="page-title">
        <span className="page-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4h8l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <path d="M16 4v6h6" />
            <path d="M12 13h6" />
            <path d="M12 17h6" />
          </svg>
        </span>
        {t("applicationManagement.title")}
      </Typography.Title>
      <Text type="secondary">{t("applicationManagement.subtitle")}</Text>

      {/* Compact overview: three grouped cards to clarify domains */}
      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card
            title={l10n(
              "adminDashboard.applications.overview",
              "Applications",
              "申請"
            )}
            className="elevated-card"
          >
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label={l10n("common.total", "Total", "合計")}>
                {derivedStats.totalApplications}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.approved",
                  "Approved",
                  "承認済み"
                )}
              >
                {derivedStats.approvedApplications}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.pending",
                  "Pending",
                  "保留"
                )}
              >
                {derivedStats.pendingApplications}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.rejected",
                  "Rejected",
                  "却下"
                )}
              >
                {derivedStats.rejectedApplications}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={l10n(
              "adminDashboard.applications.messages",
              "Messages",
              "メッセージ"
            )}
            className="elevated-card"
          >
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item
                label={l10n("common.inbox", "Inbox", "受信トレイ")}
              >
                {derivedStats.totalMessages}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.contact.statusValues.pending",
                  "Pending",
                  "保留"
                )}
              >
                {derivedStats.messagesPending}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.contact.statusValues.resolved",
                  "Resolved",
                  "対応済み"
                )}
              >
                {derivedStats.messagesResolved}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.contact.statusValues.approved",
                  "Approved",
                  "承認済み"
                )}
              >
                {derivedStats.messagesApproved}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.contact.statusValues.ignored",
                  "Ignored",
                  "無視"
                )}
              >
                {derivedStats.messagesIgnored}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={l10n("adminDashboard.users.title", "Users", "ユーザー")}
            className="elevated-card"
          >
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.statusValues.approved",
                  "Approved",
                  "承認済み"
                )}
              >
                {derivedStats.usersApproved}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.statusValues.pending",
                  "Pending",
                  "保留"
                )}
              >
                {derivedStats.pendingUsers}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.statusValues.rejected",
                  "Rejected",
                  "却下"
                )}
              >
                {derivedStats.usersRejected}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.roleValues.student",
                  "Students",
                  "学生"
                )}
              >
                {derivedStats.usersStudents}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.roleValues.teacher",
                  "Teachers",
                  "教師"
                )}
              >
                {derivedStats.usersTeachers}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.users.roleValues.admin",
                  "Admins",
                  "管理者"
                )}
              >
                {derivedStats.usersAdmins}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="applications"
        items={[
          {
            key: "applications",
            label: (
              <span className="tab-label">
                <span className="tab-icon" aria-hidden>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 4h7l5 5v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    <path d="M13 4v6h6" />
                  </svg>
                </span>
                {t("adminDashboard.applications.tabTitle")}
              </span>
            ),
            children: (
              <Card
                className="elevated-card"
                title={t("adminDashboard.applications.studentApplications")}
                extra={
                  <Space className="table-toolbar">
                    <Input
                      placeholder={t(
                        "adminDashboard.applications.searchApplications"
                      )}
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 260 }}
                    />
                    <Select
                      placeholder={t(
                        "adminDashboard.applications.filterStatus"
                      )}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      style={{ width: 180 }}
                      allowClear
                    >
                      <Select.Option value="pending">
                        {t("adminDashboard.applications.statusValues.pending")}
                      </Select.Option>
                      <Select.Option value="approved">
                        {t("adminDashboard.applications.statusValues.approved")}
                      </Select.Option>
                      <Select.Option value="rejected">
                        {t("adminDashboard.applications.statusValues.rejected")}
                      </Select.Option>
                    </Select>
                    <Button onClick={() => setShowAllApplications((v) => !v)}>
                      {showAllApplications
                        ? l10n("actions.showPaged", "Paged", "ページ分割")
                        : l10n("actions.showAll", "Show all", "すべて表示")}
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        fetchApplications();
                        fetchContactMessages();
                        contextFetchDashboardStats
                          ? contextFetchDashboardStats()
                          : fetchLocalDashboardStats();
                      }}
                      title={t("actions.refresh") || "Refresh Applications"}
                    >
                      {t("actions.refresh") || "Refresh"}
                    </Button>
                  </Space>
                }
              >
                <Table
                  className="elegant-table"
                  tableLayout="fixed"
                  size="middle"
                  bordered
                  sticky
                  columns={applicationColumns}
                  dataSource={filteredApplications}
                  rowKey="_id"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "row--odd" : "row--even"
                  }
                  scroll={{ x: "max-content" }}
                  pagination={
                    showAllApplications
                      ? false
                      : {
                          current: applicationsPagination.current,
                          pageSize: applicationsPagination.pageSize,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / ${total}`,
                          onChange: (page, pageSize) =>
                            setApplicationsPagination({
                              current: page,
                              pageSize,
                            }),
                          onShowSizeChange: (page, pageSize) =>
                            setApplicationsPagination({ current: 1, pageSize }),
                        }
                  }
                />
              </Card>
            ),
          },
          {
            key: "contacts",
            label: (
              <span className="tab-label">
                <span className="tab-icon" aria-hidden>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    <path d="M17 3H7a4 4 0 0 0-4 4" />
                  </svg>
                </span>
                {t("adminDashboard.applications.messagesTab")}
              </span>
            ),
            children: (
              <Card
                className="elevated-card"
                title={t("adminDashboard.contact.title")}
                extra={
                  <Space className="table-toolbar">
                    <Input
                      placeholder={t("adminDashboard.contact.searchMessages")}
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 260 }}
                    />
                    <Button onClick={() => setShowAllMessages((v) => !v)}>
                      {showAllMessages
                        ? l10n("actions.showPaged", "Paged", "ページ分割")
                        : l10n("actions.showAll", "Show all", "すべて表示")}
                    </Button>
                  </Space>
                }
              >
                <Table
                  className="elegant-table"
                  tableLayout="fixed"
                  size="middle"
                  bordered
                  sticky
                  columns={messageColumns}
                  dataSource={filteredMessages}
                  rowKey="_id"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "row--odd" : "row--even"
                  }
                  scroll={{ x: "max-content" }}
                  pagination={
                    showAllMessages
                      ? false
                      : {
                          pageSize: 10,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / ${total}`,
                        }
                  }
                />
              </Card>
            ),
          },
          {
            key: "users",
            label: (
              <span className="tab-label">
                <span className="tab-icon" aria-hidden>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 11c1.66 0 3-1.6 3-3.5S17.66 4 16 4s-3 1.6-3 3.5 1.34 3.5 3 3.5z" />
                    <path d="M8 11c1.66 0 3-1.6 3-3.5S9.66 4 8 4 5 5.6 5 7.5 6.34 11 8 11z" />
                    <path d="M2 20v-1c0-2.21 3.58-4 6-4" />
                    <path d="M22 20v-1c0-2.21-3.58-4-6-4" />
                  </svg>
                </span>
                {t("adminDashboard.users.tabTitle")}
              </span>
            ),
            children: (
              <Card
                className="elevated-card"
                title={t("adminDashboard.users.title")}
                extra={
                  <Space className="table-toolbar">
                    <Input
                      placeholder={t("adminDashboard.users.searchUsers")}
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 260 }}
                    />
                    <Select
                      placeholder={t(
                        "adminDashboard.users.roleValues.filterByRole"
                      )}
                      value={roleFilter}
                      onChange={(value) => setRoleFilter(value)}
                      style={{ width: 180 }}
                      allowClear
                    >
                      <Select.Option value="teacher">
                        {t("adminDashboard.users.roleValues.teacher")}
                      </Select.Option>
                      <Select.Option value="student">
                        {t("adminDashboard.users.roleValues.student")}
                      </Select.Option>
                      <Select.Option value="admin">
                        {t("adminDashboard.users.roleValues.admin")}
                      </Select.Option>
                    </Select>
                    <Button
                      type="primary"
                      onClick={() => setCreateUserModalVisible(true)}
                    >
                      {l10n(
                        "adminDashboard.users.createUser",
                        "Create User",
                        "ユーザー作成"
                      )}
                    </Button>
                    <Button onClick={() => setShowAllUsers((v) => !v)}>
                      {showAllUsers
                        ? l10n("actions.showPaged", "Paged", "ページ分割")
                        : l10n("actions.showAll", "Show all", "すべて表示")}
                    </Button>
                  </Space>
                }
              >
                <Table
                  className="elegant-table"
                  tableLayout="fixed"
                  size="middle"
                  bordered
                  sticky
                  columns={userColumns}
                  dataSource={filteredUsers}
                  rowKey="_id"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "row--odd" : "row--even"
                  }
                  scroll={{ x: "max-content" }}
                  pagination={
                    showAllUsers
                      ? false
                      : {
                          pageSize: 10,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / ${total}`,
                        }
                  }
                />
              </Card>
            ),
          },
        ]}
      />
      {/* Application Details Modal */}
      <Modal
        open={applicationModalVisible}
        onCancel={() => setApplicationModalVisible(false)}
        title={l10n(
          "adminDashboard.applications.modals.applicationDetails",
          "Application Details",
          "申請の詳細"
        )}
        footer={
          selectedApplication && selectedApplication.status === "pending" ? (
            <Space>
              <Button onClick={() => setApplicationModalVisible(false)}>
                {l10n(
                  "adminDashboard.applications.modals.close",
                  "Close",
                  "閉じる"
                )}
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() =>
                  updateApplicationStatus(selectedApplication._id, "approved")
                }
              >
                {l10n(
                  "adminDashboard.applications.modals.approveApplication",
                  "Approve",
                  "承認"
                )}
              </Button>
              <Button
                danger
                onClick={() =>
                  updateApplicationStatus(selectedApplication._id, "rejected")
                }
              >
                {l10n(
                  "adminDashboard.applications.modals.rejectApplication",
                  "Reject",
                  "却下"
                )}
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setApplicationModalVisible(false)}>
              {l10n(
                "adminDashboard.applications.modals.close",
                "Close",
                "閉じる"
              )}
            </Button>
          )
        }
      >
        {selectedApplication && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.modals.name",
                  "Name",
                  "氏名"
                )}
              >
                {selectedApplication.fullName}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.email",
                  "Email",
                  "メール"
                )}
              >
                {selectedApplication.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.modals.desiredCourse",
                  "Course",
                  "希望コース"
                )}
              >
                {selectedApplication.course ||
                  selectedApplication.program ||
                  tr("common.notProvided")}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.modals.applicationStatus",
                  "Status",
                  "ステータス"
                )}
              >
                {selectedApplication.status}
              </Descriptions.Item>
              <Descriptions.Item
                label={l10n(
                  "adminDashboard.applications.modals.submittedOn",
                  "Applied",
                  "申請日"
                )}
              >
                {moment(selectedApplication.createdAt).format("MMM DD, YYYY")}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space>
              <Button
                icon={<MessageOutlined />}
                onClick={() => {
                  setReplyType("application");
                  setReplyTarget(selectedApplication);
                  setReplySubject(
                    `Re: Application - ${selectedApplication.fullName}`
                  );
                  setReplyMessage("");
                  setReplyModalVisible(true);
                }}
              >
                {l10n(
                  "adminDashboard.applications.modals.sendMessage",
                  "Send Message",
                  "メッセージ送信"
                )}
              </Button>
            </Space>
          </>
        )}
      </Modal>

      {/* Message Details Modal */}
      <Modal
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        title={l10n(
          "adminDashboard.applications.modals.messageDetails",
          "Message Details",
          "メッセージ詳細"
        )}
        footer={
          <Space>
            <Button onClick={() => setMessageModalVisible(false)}>
              {l10n(
                "adminDashboard.applications.modals.close",
                "Close",
                "閉じる"
              )}
            </Button>
            {selectedMessage && selectedMessage.status === "pending" && (
              <Button
                type="primary"
                onClick={() =>
                  updateContactStatus(selectedMessage._id, "resolved")
                }
              >
                {l10n(
                  "adminDashboard.applications.modals.markResolved",
                  "Mark Resolved",
                  "対応済みにする"
                )}
              </Button>
            )}
          </Space>
        }
      >
        {selectedMessage && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.messageFrom",
                "From",
                "送信者"
              )}
            >
              {selectedMessage.name} ({selectedMessage.email})
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.subject",
                "Subject",
                "件名"
              )}
            >
              {selectedMessage.subject}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.messageContent",
                "Message",
                "本文"
              )}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>
                {selectedMessage.message}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.messageStatus",
                "Status",
                "ステータス"
              )}
            >
              {selectedMessage.status}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.receivedOn",
                "Received",
                "受信日"
              )}
            >
              {moment(selectedMessage.createdAt).format("MMM DD, YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        title={l10n(
          "adminDashboard.applications.modals.userDetails",
          "User Details",
          "ユーザー詳細"
        )}
        footer={
          <Space>
            <Button onClick={() => setUserModalVisible(false)}>
              {l10n(
                "adminDashboard.applications.modals.close",
                "Close",
                "閉じる"
              )}
            </Button>
            {selectedUser && selectedUser.isApproved !== true && (
              <Button
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => updateUserStatus(selectedUser._id, true)}
              >
                {l10n(
                  "adminDashboard.applications.modals.approveUser",
                  "Approve User",
                  "承認する"
                )}
              </Button>
            )}
            {selectedUser && selectedUser.isApproved !== false && (
              <Button
                danger
                onClick={() => updateUserStatus(selectedUser._id, false)}
              >
                {l10n(
                  "adminDashboard.applications.modals.rejectUser",
                  "Reject User",
                  "却下する"
                )}
              </Button>
            )}
          </Space>
        }
      >
        {selectedUser && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.name",
                "Name",
                "氏名"
              )}
            >
              {selectedUser.firstName} {selectedUser.lastName}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.email",
                "Email",
                "メール"
              )}
            >
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.role",
                "Role",
                "役割"
              )}
            >
              {selectedUser.role}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.accountStatus",
                "Status",
                "ステータス"
              )}
            >
              {selectedUser.isApproved === true
                ? l10n(
                    "adminDashboard.applications.approved",
                    "Approved",
                    "承認済み"
                  )
                : selectedUser.isApproved === false
                ? l10n(
                    "adminDashboard.applications.rejected",
                    "Rejected",
                    "却下"
                  )
                : l10n(
                    "adminDashboard.applications.pending",
                    "Pending",
                    "保留"
                  )}
            </Descriptions.Item>
            <Descriptions.Item
              label={l10n(
                "adminDashboard.applications.modals.registeredDate",
                "Registered",
                "登録日"
              )}
            >
              {moment(selectedUser.createdAt).format("MMM DD, YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Reply/Send Message Modal */}
      <Modal
        open={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          setReplySubject("");
          setReplyMessage("");
          setSelectedTemplate(null);
        }}
        title={
          <Space>
            <MessageOutlined />
            {l10n(
              "adminDashboard.applications.modals.sendMessage",
              "Send Message",
              "メッセージ送信"
            )}
          </Space>
        }
        footer={
          <Space>
            <Button
              onClick={() => {
                setReplyModalVisible(false);
                setReplySubject("");
                setReplyMessage("");
                setSelectedTemplate(null);
              }}
            >
              {l10n(
                "adminDashboard.applications.modals.cancel",
                "Cancel",
                "キャンセル"
              )}
            </Button>
            <Button
              type="primary"
              icon={<MessageOutlined />}
              onClick={sendReplyMessage}
              disabled={!replyMessage.trim()}
            >
              {l10n("adminDashboard.applications.modals.send", "Send", "送信")}
            </Button>
          </Space>
        }
        width={700}
      >
        {replyTarget && (
          <div>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item
                label={
                  tr("adminDashboard.applications.modals.recipientInfo") ||
                  "Recipient"
                }
              >
                <strong>{replyTarget.fullName || replyTarget.name}</strong>
                <br />
                <Text type="secondary">{replyTarget.email}</Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Quick Reply Templates */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {l10n(
                  "adminDashboard.applications.quickTemplates",
                  "Quick Templates",
                  "クイックテンプレート"
                )}
              </Text>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  size="small"
                  type={
                    selectedTemplate === "templateAcceptance"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => applyTemplate("templateAcceptance")}
                >
                  <span className="btn-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#52c41a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-6" />
                    </svg>
                  </span>
                  {l10n(
                    "adminDashboard.applications.templateAcceptanceBtn",
                    "Accept",
                    "承認"
                  )}
                </Button>
                <Button
                  size="small"
                  type={
                    selectedTemplate === "templateReview"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => applyTemplate("templateReview")}
                >
                  <span className="btn-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1890ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  {l10n(
                    "adminDashboard.applications.templateReviewBtn",
                    "Under Review",
                    "審査中"
                  )}
                </Button>
                <Button
                  size="small"
                  type={
                    selectedTemplate === "templateRejection"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => applyTemplate("templateRejection")}
                >
                  <span className="btn-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff4d4f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  </span>
                  {l10n(
                    "adminDashboard.applications.templateRejectionBtn",
                    "Reject",
                    "却下"
                  )}
                </Button>
                <Button
                  size="small"
                  type={
                    selectedTemplate === "templateRequest"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => applyTemplate("templateRequest")}
                >
                  <span className="btn-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#faad14"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 4h8l2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                      <path d="M9 12h6M9 16h6M9 8h6" />
                    </svg>
                  </span>
                  {l10n(
                    "adminDashboard.applications.templateRequestBtn",
                    "Request Info",
                    "追加情報の依頼"
                  )}
                </Button>
              </div>
              <Text
                type="secondary"
                style={{ fontSize: 12, display: "block", marginTop: 8 }}
              >
                {l10n(
                  "adminDashboard.applications.modals.templateHint",
                  "Click a template to auto-fill the message. You can edit it before sending.",
                  "テンプレートをクリックすると本文が自動入力されます。送信前に編集できます。"
                )}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {l10n("adminDashboard.applications.subject", "Subject", "件名")}
              </Text>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder={l10n(
                  "adminDashboard.applications.modals.enterSubject",
                  "Enter subject...",
                  "件名を入力..."
                )}
                style={{ marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong>
                {l10n("adminDashboard.applications.message", "Message", "本文")}
              </Text>
              <Input.TextArea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={l10n(
                  "adminDashboard.applications.modals.enterMessage",
                  "Enter your message...",
                  "メッセージを入力..."
                )}
                rows={10}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        open={createUserModalVisible}
        onCancel={() => setCreateUserModalVisible(false)}
        title={l10n(
          "adminDashboard.users.createUser",
          "Create User",
          "ユーザー作成"
        )}
        onOk={async () => {
          if (
            !newUserData.email ||
            !newUserData.firstName ||
            !newUserData.role ||
            !newUserData.password
          ) {
            message.error(
              l10n(
                "adminDashboard.users.validationRequired",
                "Please complete required fields",
                "必須項目を入力してください"
              )
            );
            return;
          }
          await createUser(newUserData);
          setCreateUserModalVisible(false);
          setNewUserData({
            firstName: "",
            lastName: "",
            email: "",
            role: "student",
            password: "",
          });
        }}
        okText={l10n("common.create", "Create", "作成")}
        cancelText={l10n("common.cancel", "Cancel", "キャンセル")}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>
              {l10n(
                "adminDashboard.users.fields.firstName",
                "First Name",
                "名"
              )}
            </Text>
            <Input
              value={newUserData.firstName}
              onChange={(e) =>
                setNewUserData({ ...newUserData, firstName: e.target.value })
              }
              placeholder={l10n(
                "adminDashboard.users.placeholders.firstName",
                "Enter first name",
                "名を入力"
              )}
            />
          </div>
          <div>
            <Text strong>
              {l10n("adminDashboard.users.fields.lastName", "Last Name", "姓")}
            </Text>
            <Input
              value={newUserData.lastName}
              onChange={(e) =>
                setNewUserData({ ...newUserData, lastName: e.target.value })
              }
              placeholder={l10n(
                "adminDashboard.users.placeholders.lastName",
                "Enter last name",
                "姓を入力"
              )}
            />
          </div>
          <div>
            <Text strong>
              {l10n("adminDashboard.users.fields.email", "Email", "メール")}
            </Text>
            <Input
              type="email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              placeholder={l10n(
                "adminDashboard.users.placeholders.email",
                "Enter email",
                "メールを入力"
              )}
            />
          </div>
          <div>
            <Text strong>
              {l10n(
                "adminDashboard.users.fields.password",
                "Password",
                "パスワード"
              )}
            </Text>
            <Input.Password
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              placeholder={l10n(
                "adminDashboard.users.placeholders.password",
                "Enter temporary password",
                "仮パスワードを入力"
              )}
            />
          </div>
          <div>
            <Text strong>
              {l10n("adminDashboard.users.fields.role", "Role", "役割")}
            </Text>
            <Select
              value={newUserData.role}
              onChange={(v) => setNewUserData({ ...newUserData, role: v })}
              style={{ width: "100%" }}
            >
              <Select.Option value="student">
                {t("adminDashboard.users.roleValues.student")}
              </Select.Option>
              <Select.Option value="teacher">
                {t("adminDashboard.users.roleValues.teacher")}
              </Select.Option>
              <Select.Option value="admin">
                {t("adminDashboard.users.roleValues.admin")}
              </Select.Option>
            </Select>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default Adminapplicationanduser;

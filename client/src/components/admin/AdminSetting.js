import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Switch,
  Descriptions,
  Tag,
  Progress,
  Space,
  Dropdown,
  message,
  Tabs,
  Statistic,
  Divider,
  Tooltip,
  Badge,
  Alert,
  Spin,
} from "antd";
import {
  UndoOutlined,
  SaveOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  UserOutlined,
  BookOutlined,
  HddOutlined,
  ReloadOutlined,
  GlobalOutlined,
  MailOutlined,
  MobileOutlined,
  NotificationOutlined,
  FileDoneOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  LockOutlined,
  ToolOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";
import ExcelJS from "exceljs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminSetting = ({ t: propsT }) => {
  const history = useHistory();
  const { t, i18n: translationInstance } = useTranslation();
  const [settingsForm] = Form.useForm();

  // Context
  const context = useContext(AdminContext);

  // Local state
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    systemName: "Forum Academy",
    adminEmail: "admin@forumacademy.com",
    timeZone: "UTC",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: "connected",
    server: "online",
    storage: 70,
  });
  const [activeTab, setActiveTab] = useState("general");

  // Use prop t or hook t
  const tFunc = propsT || t;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Save settings
  const handleSaveSettings = async (values) => {
    setSettingsLoading(true);
    try {
      const newSettings = { ...systemSettings, ...values };

      // Save to localStorage
      localStorage.setItem("systemSettings", JSON.stringify(newSettings));
      setSystemSettings(newSettings);

      // Apply language change immediately
      if (values.language && translationInstance) {
        translationInstance.changeLanguage(values.language);
        moment.locale(values.language === "ja" ? "ja" : "en");
      }

      // Save to backend (optional)
      try {
        await fetch(`${API_BASE_URL}/api/admin/settings`, {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSettings),
        });
      } catch (backendError) {
        console.log("Backend settings save failed, using local storage only");
      }

      message.success(
        tFunc("adminDashboard.settings.saveSuccess") ||
          "Settings saved successfully!"
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      message.error(
        tFunc("adminDashboard.settings.saveError") || "Failed to save settings"
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  // Reset settings
  const handleResetSettings = () => {
    const defaultSettings = {
      systemName: "Forum Academy",
      adminEmail: "admin@forumacademy.com",
      timeZone: "UTC",
      language: "en",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReports: true,
      maintenanceMode: false,
      autoBackup: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    };

    setSystemSettings(defaultSettings);
    settingsForm.setFieldsValue(defaultSettings);
    localStorage.setItem("systemSettings", JSON.stringify(defaultSettings));
    translationInstance.changeLanguage("en");
    moment.locale("en");
    message.success(
      tFunc("adminDashboard.settings.resetSuccess") ||
        "Settings reset to default"
    );
  };

  // Generate styled Excel backup
  const generateStyledExcel = async (backupData, format = "excel") => {
    const workbook = new ExcelJS.Workbook();
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

    // Helper function for styling
    const styleHeader = (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF6C5CE7" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    };

    const styleCell = (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle" };
    };

    // Summary Sheet
    const summarySheet = workbook.addWorksheet(
      tFunc("adminDashboard.settings.backupSummary") || "Summary"
    );
    summarySheet.columns = [
      { header: tFunc("adminDashboard.settings.backupField") || "Field", width: 30 },
      { header: tFunc("adminDashboard.settings.backupValue") || "Value", width: 50 },
    ];

    const summaryData = [
      [tFunc("adminDashboard.settings.backupTimestamp") || "Timestamp", timestamp],
      [
        tFunc("adminDashboard.settings.backupVersion") || "Version",
        backupData.version || "2.1.0",
      ],
      [
        tFunc("adminDashboard.settings.backupTotalUsers") || "Total Users",
        backupData.users?.length || 0,
      ],
      [
        tFunc("adminDashboard.settings.backupTotalCourses") || "Total Courses",
        backupData.courses?.length || 0,
      ],
    ];

    summarySheet.getRow(1).eachCell(styleHeader);
    summaryData.forEach((row, index) => {
      const sheetRow = summarySheet.addRow(row);
      sheetRow.eachCell(styleCell);
    });

    // Users Sheet
    if (backupData.users && backupData.users.length > 0) {
      const usersSheet = workbook.addWorksheet(
        tFunc("adminDashboard.settings.backupUsers") || "Users"
      );
      usersSheet.columns = [
        { header: "ID", width: 15 },
        { header: tFunc("adminDashboard.settings.backupName") || "Name", width: 25 },
        { header: tFunc("adminDashboard.settings.backupEmail") || "Email", width: 30 },
        { header: tFunc("adminDashboard.settings.backupRole") || "Role", width: 15 },
        {
          header: tFunc("adminDashboard.settings.backupCreated") || "Created",
          width: 20,
        },
      ];

      usersSheet.getRow(1).eachCell(styleHeader);
      backupData.users.forEach((user) => {
        const row = usersSheet.addRow([
          user._id || user.id || "",
          user.name || "",
          user.email || "",
          user.role || "",
          user.createdAt
            ? moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")
            : "",
        ]);
        row.eachCell(styleCell);
      });
    }

    // Courses Sheet
    if (backupData.courses && backupData.courses.length > 0) {
      const coursesSheet = workbook.addWorksheet(
        tFunc("adminDashboard.settings.backupCourses") || "Courses"
      );
      coursesSheet.columns = [
        { header: "ID", width: 15 },
        {
          header: tFunc("adminDashboard.settings.backupCourseTitle") || "Title",
          width: 30,
        },
        {
          header: tFunc("adminDashboard.settings.backupCourseCode") || "Code",
          width: 15,
        },
        {
          header: tFunc("adminDashboard.settings.backupDuration") || "Duration",
          width: 15,
        },
        {
          header: tFunc("adminDashboard.settings.backupCreated") || "Created",
          width: 20,
        },
      ];

      coursesSheet.getRow(1).eachCell(styleHeader);
      backupData.courses.forEach((course) => {
        const row = coursesSheet.addRow([
          course._id || course.id || "",
          course.title || course.name || "",
          course.code || "",
          course.duration || "",
          course.createdAt
            ? moment(course.createdAt).format("YYYY-MM-DD HH:mm:ss")
            : "",
        ]);
        row.eachCell(styleCell);
      });
    }

    // Settings Sheet
    const settingsSheet = workbook.addWorksheet(
      tFunc("adminDashboard.settings.backupSettings") || "Settings"
    );
    settingsSheet.columns = [
      { header: tFunc("adminDashboard.settings.backupSetting") || "Setting", width: 30 },
      { header: tFunc("adminDashboard.settings.backupValue") || "Value", width: 50 },
    ];

    settingsSheet.getRow(1).eachCell(styleHeader);
    Object.entries(backupData.systemSettings || {}).forEach(([key, value]) => {
      const row = settingsSheet.addRow([
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value),
      ]);
      row.eachCell(styleCell);
    });

    return workbook;
  };

  // Create backup
  const handleCreateBackup = async (format = "json") => {
    setBackupLoading(true);
    try {
      const timestamp = moment().format("YYYY-MM-DD-HH-mm-ss");
      const backupData = {
        timestamp: new Date().toISOString(),
        users: users,
        courses: courses,
        systemSettings: systemSettings,
        version: "2.1.0",
      };

      if (format === "excel") {
        const workbook = await generateStyledExcel(backupData, format);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `forum-academy-backup-${timestamp}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // JSON or other formats
        const fileName = `forum-academy-backup-${timestamp}.json`;
        const mimeType = "application/json";
        const fileContent = JSON.stringify(backupData, null, 2);

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Update last backup time
      const updatedSettings = {
        ...systemSettings,
        lastBackup: moment().format("MMM DD, YYYY HH:mm"),
      };
      setSystemSettings(updatedSettings);
      localStorage.setItem("systemSettings", JSON.stringify(updatedSettings));

      message.success(
        tFunc("adminDashboard.settings.backupCreated") ||
          "Backup created successfully!"
      );
    } catch (error) {
      console.error("Error creating backup:", error);
      message.error(
        tFunc("adminDashboard.settings.backupError") ||
          "Failed to create backup"
      );
    } finally {
      setBackupLoading(false);
    }
  };

  // Clear cache
  const handleClearCache = async () => {
    setCacheLoading(true);
    try {
      const cacheKeys = [
        "localNotifications",
        "readNotifications",
        "applicationStatuses",
        "skipApiTesting",
        "skipAuthRedirects",
        "cachedApplications",
        "cachedContactMessages",
        "cachedUsers",
        "cachedCourses",
      ];

      cacheKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Clear browser cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      message.success(
        tFunc("adminDashboard.settings.cacheCleared") ||
          "Cache cleared successfully!"
      );
    } catch (error) {
      console.error("Error clearing cache:", error);
      message.error(
        tFunc("adminDashboard.settings.cacheError") || "Failed to clear cache"
      );
    } finally {
      setCacheLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchCourses();

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("systemSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSystemSettings(parsedSettings);
        settingsForm.setFieldsValue(parsedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }

    // Set moment locale
    if (translationInstance?.language) {
      moment.locale(translationInstance.language === "ja" ? "ja" : "en");
    }
  }, []);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Title level={2} style={{ margin: 0 }}>
                <SettingOutlined style={{ marginRight: 8, color: "#6C5CE7" }} />
                {tFunc("adminDashboard.settings.title") || "System Settings"}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {tFunc("adminDashboard.settings.subtitle") ||
                  "Configure system settings and preferences"}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip
                title={tFunc("adminDashboard.settings.resetToDefault") || "Reset to Default"}
              >
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleResetSettings}
                  danger
                >
                  {tFunc("adminDashboard.settings.resetToDefault")}
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {tFunc("adminDashboard.settings.totalUsers") || "Total Users"}
                </span>
              }
              value={users.length}
              valueStyle={{ color: "#fff" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {tFunc("adminDashboard.settings.totalCourses") ||
                    "Total Courses"}
                </span>
              }
              value={courses.length}
              valueStyle={{ color: "#fff" }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {tFunc("adminDashboard.settings.storageUsed") ||
                    "Storage Used"}
                </span>
              }
              value={systemStatus.storage}
              suffix="%"
              valueStyle={{ color: "#fff" }}
              prefix={<HddOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {tFunc("adminDashboard.settings.version") || "Version"}
                </span>
              }
              value="2.1.0"
              valueStyle={{ color: "#fff", fontSize: 24 }}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Settings Form */}
      <Card
        style={{
          borderRadius: 12,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Form
          form={settingsForm}
          layout="vertical"
          onFinish={handleSaveSettings}
          initialValues={systemSettings}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size="large"
          >
            {/* General Settings Tab */}
            <TabPane
              tab={
                <span>
                  <GlobalOutlined />
                  {tFunc("adminDashboard.settings.generalSettings") ||
                    "General Settings"}
                </span>
              }
              key="general"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <SettingOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.systemName") ||
                            "System Name"}
                        </span>
                      </Space>
                    }
                    name="systemName"
                    rules={[
                      {
                        required: true,
                        message:
                          tFunc("adminDashboard.settings.systemNameRequired") ||
                          "System name is required",
                      },
                    ]}
                  >
                    <Input
                      placeholder={
                        tFunc("adminDashboard.settings.systemNamePlaceholder") ||
                        "Enter system name"
                      }
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <MailOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.adminEmail") ||
                            "Admin Email"}
                        </span>
                      </Space>
                    }
                    name="adminEmail"
                    rules={[
                      {
                        required: true,
                        message:
                          tFunc("adminDashboard.settings.adminEmailRequired") ||
                          "Admin email is required",
                      },
                      {
                        type: "email",
                        message:
                          tFunc("adminDashboard.settings.validEmailRequired") ||
                          "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      placeholder={
                        tFunc("adminDashboard.settings.adminEmailPlaceholder") ||
                        "Enter admin email"
                      }
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <ClockCircleOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.timeZone") ||
                            "Time Zone"}
                        </span>
                      </Space>
                    }
                    name="timeZone"
                  >
                    <Select size="large" placeholder="Select time zone">
                      <Option value="UTC">
                        UTC - {tFunc("adminDashboard.settings.coordinatedUniversalTime") || "Coordinated Universal Time"}
                      </Option>
                      <Option value="JST">
                        JST - {tFunc("adminDashboard.settings.japanStandardTime") || "Japan Standard Time"}
                      </Option>
                      <Option value="GMT">
                        GMT - {tFunc("adminDashboard.settings.greenwichMeanTime") || "Greenwich Mean Time"}
                      </Option>
                      <Option value="EST">
                        EST - {tFunc("adminDashboard.settings.easternStandardTime") || "Eastern Standard Time"}
                      </Option>
                      <Option value="PST">
                        PST - {tFunc("adminDashboard.settings.pacificStandardTime") || "Pacific Standard Time"}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <GlobalOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.language") ||
                            "Language"}
                        </span>
                      </Space>
                    }
                    name="language"
                  >
                    <Select
                      size="large"
                      onChange={(value) => {
                        translationInstance.changeLanguage(value);
                        moment.locale(value === "ja" ? "ja" : "en");
                        settingsForm.setFieldValue("language", value);
                      }}
                      placeholder="Select language"
                    >
                      <Option value="en">
                        <span>🇺🇸 English</span>
                      </Option>
                      <Option value="ja">
                        <span>🇯🇵 日本語 (Japanese)</span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* Notification Settings Tab */}
            <TabPane
              tab={
                <span>
                  <BellOutlined />
                  {tFunc("adminDashboard.settings.notificationSettings") ||
                    "Notification Settings"}
                </span>
              }
              key="notifications"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Alert
                    message={
                      tFunc("adminDashboard.settings.notificationInfo") ||
                      "Configure how you receive system notifications and reports"
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <MailOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.emailNotifications") ||
                              "Email Notifications"}
                          </span>
                        </Space>
                      }
                      name="emailNotifications"
                      valuePropName="checked"
                    >
                      <Switch
                        size="default"
                        onChange={(checked) =>
                          message.success(
                            checked
                              ? tFunc(
                                  "adminDashboard.settings.emailNotificationsEnabled"
                                ) || "Email notifications enabled!"
                              : tFunc(
                                  "adminDashboard.settings.emailNotificationsDisabled"
                                ) || "Email notifications disabled!"
                          )
                        }
                      />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.emailNotificationsDesc") ||
                          "Receive email notifications for important system events"}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <MobileOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.smsNotifications") ||
                              "SMS Notifications"}
                          </span>
                        </Space>
                      }
                      name="smsNotifications"
                      valuePropName="checked"
                    >
                      <Switch size="default" />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.smsInfoText") ||
                          "SMS notifications require additional setup and may incur charges."}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <NotificationOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.pushNotifications") ||
                              "Push Notifications"}
                          </span>
                        </Space>
                      }
                      name="pushNotifications"
                      valuePropName="checked"
                    >
                      <Switch size="default" />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.pushNotificationsDesc") ||
                          "Receive browser push notifications for real-time updates"}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <FileDoneOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.weeklyReports") ||
                              "Weekly Reports"}
                          </span>
                        </Space>
                      }
                      name="weeklyReports"
                      valuePropName="checked"
                    >
                      <Switch size="default" />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.weeklyReportsDesc") ||
                          "Receive weekly summary reports via email"}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            {/* Security Settings Tab */}
            <TabPane
              tab={
                <span>
                  <SafetyOutlined />
                  {tFunc("adminDashboard.settings.securitySettings") ||
                    "Security Settings"}
                </span>
              }
              key="security"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Alert
                    message={
                      tFunc("adminDashboard.settings.securityInfo") ||
                      "Configure security settings to protect your system"
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <ClockCircleOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.sessionTimeout") ||
                            "Session Timeout (minutes)"}
                        </span>
                      </Space>
                    }
                    name="sessionTimeout"
                    rules={[
                      {
                        required: true,
                        message:
                          tFunc("adminDashboard.settings.sessionTimeoutRequired") ||
                          "Session timeout is required",
                      },
                    ]}
                  >
                    <InputNumber
                      min={5}
                      max={1440}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="30"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <Space>
                        <LockOutlined />
                        <span>
                          {tFunc("adminDashboard.settings.maxLoginAttempts") ||
                            "Maximum Login Attempts"}
                        </span>
                      </Space>
                    }
                    name="maxLoginAttempts"
                    rules={[
                      {
                        required: true,
                        message:
                          tFunc("adminDashboard.settings.maxLoginAttemptsRequired") ||
                          "Max login attempts is required",
                      },
                    ]}
                  >
                    <InputNumber
                      min={3}
                      max={10}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="5"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <ToolOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.maintenanceMode") ||
                              "Maintenance Mode"}
                          </span>
                        </Space>
                      }
                      name="maintenanceMode"
                      valuePropName="checked"
                    >
                      <Switch size="default" />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.maintenanceModeDesc") ||
                          "Enable maintenance mode to restrict user access during updates"}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      background: "#fafafa",
                    }}
                  >
                    <Form.Item
                      label={
                        <Space>
                          <CloudDownloadOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.autoBackup") ||
                              "Automatic Backup"}
                          </span>
                        </Space>
                      }
                      name="autoBackup"
                      valuePropName="checked"
                    >
                      <Switch size="default" />
                      <Text type="secondary" style={{ marginLeft: 12, display: "block", marginTop: 8 }}>
                        {tFunc("adminDashboard.settings.autoBackupDesc") ||
                          "Automatically create backups on a scheduled basis"}
                      </Text>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            {/* System Information Tab */}
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined />
                  {tFunc("adminDashboard.settings.systemInformation") ||
                    "System Information"}
                </span>
              }
              key="system"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 2 }}
                    size="middle"
                    style={{ background: "#fff", borderRadius: 8, padding: 16 }}
                  >
                    <Descriptions.Item
                      label={
                        <Space>
                          <InfoCircleOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.version") ||
                              "Version"}
                          </span>
                        </Space>
                      }
                    >
                      <Tag color="blue" style={{ fontSize: 14, padding: "4px 12px" }}>
                        v2.1.0
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <ClockCircleOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.lastUpdated") ||
                              "Last Updated"}
                          </span>
                        </Space>
                      }
                    >
                      <Text style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                        {moment()
                          .subtract(2, "days")
                          .format(
                            translationInstance.language === "ja"
                              ? "YYYY年MM月DD日"
                              : "MMMM DD, YYYY"
                          )}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <DatabaseOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.databaseStatus") ||
                              "Database Status"}
                          </span>
                        </Space>
                      }
                    >
                      <Tag
                        color="green"
                        icon={<CheckCircleOutlined />}
                        style={{ fontSize: 14, padding: "4px 12px" }}
                      >
                        {tFunc("adminDashboard.settings.connected") ||
                          "Connected"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <CloudServerOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.serverStatus") ||
                              "Server Status"}
                          </span>
                        </Space>
                      }
                    >
                      <Tag
                        color="green"
                        icon={<CheckCircleOutlined />}
                        style={{ fontSize: 14, padding: "4px 12px" }}
                      >
                        {tFunc("adminDashboard.settings.online") || "Online"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <HddOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.storageUsed") ||
                              "Storage Used"}
                          </span>
                        </Space>
                      }
                      span={2}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <Progress
                          percent={systemStatus.storage}
                          size="default"
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                          style={{ flex: 1 }}
                        />
                        <Text strong style={{ minWidth: 50, textAlign: "right" }}>
                          {systemStatus.storage}%
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <CloudDownloadOutlined />
                          <span>
                            {tFunc("adminDashboard.settings.lastBackup") ||
                              "Last Backup"}
                          </span>
                        </Space>
                      }
                      span={2}
                    >
                      <Text strong>
                        {systemSettings.lastBackup ||
                          moment()
                            .subtract(1, "day")
                            .format("MMM DD, YYYY HH:mm")}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>

                <Col xs={24}>
                  <Divider />
                  <Space size="large" style={{ width: "100%", justifyContent: "center" }}>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "excel",
                            label: (
                              <Space>
                                <FileExcelOutlined />
                                {tFunc("adminDashboard.settings.backupExcel") ||
                                  "Excel (.xlsx)"}
                              </Space>
                            ),
                            onClick: () => handleCreateBackup("excel"),
                          },
                          {
                            key: "json",
                            label: (
                              <Space>
                                <FileTextOutlined />
                                {tFunc("adminDashboard.settings.backupJSON") ||
                                  "JSON (.json)"}
                              </Space>
                            ),
                            onClick: () => handleCreateBackup("json"),
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={backupLoading}
                        size="large"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        {tFunc("adminDashboard.settings.createBackup") ||
                          "Create Backup"}{" "}
                        ▼
                      </Button>
                    </Dropdown>
                    <Button
                      type="default"
                      icon={<DeleteOutlined />}
                      onClick={handleClearCache}
                      loading={cacheLoading}
                      size="large"
                      danger
                    >
                      {tFunc("adminDashboard.settings.clearCache") ||
                        "Clear Cache"}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </TabPane>
          </Tabs>

          {/* Action Buttons */}
          <Divider />
          <Row>
            <Col span={24}>
              <div style={{ textAlign: "center" }}>
                <Space size="large">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={settingsLoading}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      minWidth: 150,
                    }}
                  >
                    {tFunc("adminDashboard.settings.saveSettings") ||
                      "Save Settings"}
                  </Button>
                  <Button
                    size="large"
                    onClick={() => settingsForm.resetFields()}
                    style={{ minWidth: 150 }}
                  >
                    {tFunc("adminDashboard.settings.cancel") || "Cancel"}
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSetting;

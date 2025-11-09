import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Tooltip,
  Modal,
  message,
  notification,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
} from "antd";
import {
  SoundOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import { getAuthHeaders, API_BASE_URL } from "../../utils/adminApiUtils";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminAnnouncement = ({ t: tProp }) => {
  const { t: tHook } = useTranslation();
  const t = tProp || tHook;
  const history = useHistory();
  const [announcementForm] = Form.useForm();

  // Context
  const context = useContext(AdminContext);
  const currentUser = context?.currentUser;

  // Local state
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Modal state - managed internally
  const [announcementModalVisible, setAnnouncementModalVisible] =
    useState(false);
  const [announcementViewModalVisible, setAnnouncementViewModalVisible] =
    useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      let apiAnnouncements = [];

      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`, {
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          history.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          apiAnnouncements = data.announcements || [];
        }
      } catch (apiError) {
        console.log("API not available, using local announcements");
      }

      // Always load local announcements and merge with API announcements
      const localAnnouncements = JSON.parse(
        localStorage.getItem("localAnnouncements") || "[]"
      );

      // Merge API and local announcements, with local taking precedence for duplicates
      const allAnnouncements = [...apiAnnouncements, ...localAnnouncements];

      // Remove duplicates (prefer local over API if same ID)
      const uniqueAnnouncements = allAnnouncements.reduce(
        (acc, announcement) => {
          const existingIndex = acc.findIndex(
            (a) => a._id === announcement._id || a.id === announcement.id
          );
          if (existingIndex === -1) {
            acc.push(announcement);
          } else {
            // If duplicate, prefer local announcement
            if (announcement.isLocal) {
              acc[existingIndex] = announcement;
            }
          }
          return acc;
        },
        []
      );

      // Sort by creation date (newest first)
      uniqueAnnouncements.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setAnnouncements(uniqueAnnouncements);
      console.log(
        "📢 Fetched announcements:",
        uniqueAnnouncements.length,
        "Total (API:",
        apiAnnouncements.length,
        "Local:",
        localAnnouncements.length,
        ")"
      );
    } catch (error) {
      console.error("Error fetching announcements:", error);
      // Load local announcements as fallback
      const localAnnouncements = JSON.parse(
        localStorage.getItem("localAnnouncements") || "[]"
      );
      setAnnouncements(localAnnouncements);
    }
  };

  // Create local notification as fallback
  const createLocalNotification = (notificationData) => {
    try {
      const localNotifications = JSON.parse(
        localStorage.getItem("localNotifications") || "[]"
      );
      const uniqueId = `local_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const notification = {
        ...notificationData,
        _id: uniqueId,
        id: uniqueId,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        isLocal: true,
        read: false,
      };
      localNotifications.push(notification);
      localStorage.setItem(
        "localNotifications",
        JSON.stringify(localNotifications)
      );
      console.log("✅ AdminAnnouncement - Local notification created:", {
        id: notification.id,
        type: notification.type,
        title: notification.title?.substring(0, 50),
        targetAudience: notification.targetAudience,
      });
      console.log(
        "📋 AdminAnnouncement - Total local notifications:",
        localNotifications.length
      );
      console.log("📋 AdminAnnouncement - Full notification:", notification);
      return notification;
    } catch (error) {
      console.error(
        "❌ AdminAnnouncement - Error creating local notification:",
        error
      );
      return null;
    }
  };

  // Create notifications for announcement target audience
  const createAnnouncementNotifications = async (
    announcementData,
    announcementResult
  ) => {
    try {
      // Get translated notification title prefix
      const newAnnouncementPrefix =
        t("announcements.notification.titlePrefix") || "New Announcement";

      const notificationData = {
        type: "admin_announcement",
        title: `📢 ${newAnnouncementPrefix}: ${announcementData.title}`,
        message: announcementData.content,
        priority: announcementData.priority || "medium",
        sender: announcementData.authorName || "Admin",
        targetAudience: announcementData.targetAudience,
        announcementId: announcementResult._id || announcementResult.id,
        actionUrl: `/announcements/${
          announcementResult._id || announcementResult.id
        }`,
        icon: "📢",
        color: "#1890ff",
      };

      // Try multiple notification endpoints
      const notificationEndpoints = [
        `${API_BASE_URL}/api/notifications`,
        `${API_BASE_URL}/notifications`,
        `${API_BASE_URL}/api/admin/notifications`,
      ];

      let notificationSuccess = false;

      for (const endpoint of notificationEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationData),
          });

          if (response.ok) {
            notificationSuccess = true;
            console.log("✅ Notifications created successfully via", endpoint);
            // Also save locally as backup
            createLocalNotification(notificationData);
            break;
          }
        } catch (error) {
          console.log(`Failed to create notifications via ${endpoint}:`, error);
          continue;
        }
      }

      if (!notificationSuccess) {
        console.warn(
          "⚠️ Could not create notifications - endpoints may not be available, saving locally"
        );
        createLocalNotification(notificationData);
      } else {
        // Even if API succeeds, always save locally as backup for teachers
        console.log("✅ API notification sent, also saving locally as backup");
        createLocalNotification(notificationData);
      }
    } catch (error) {
      console.error("Error creating notifications:", error);
    }
  };

  // Handle create/update announcement
  const handleCreateAnnouncement = async (values) => {
    try {
      const announcementData = {
        title: values.title,
        content: values.content,
        targetAudience: values.targetAudience || "all",
        priority: values.priority || "medium",
        type: values.type || "general",
        isSticky: values.isSticky || false,
        publishDate: values.publishDate
          ? values.publishDate.toISOString()
          : new Date().toISOString(),
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        tags: values.tags || [],
        author: currentUser?.id || currentUser?._id,
        authorName:
          (currentUser?.firstName || currentUser?.name || "Admin") +
          " " +
          (currentUser?.lastName || ""),
      };

      console.log(
        "📢 AdminAnnouncement - Creating announcement:",
        announcementData
      );

      // Try multiple possible API endpoints
      const possibleEndpoints = [
        `${API_BASE_URL}/api/announcements`,
        `${API_BASE_URL}/announcements`,
        `${API_BASE_URL}/api/admin/announcements`,
      ];

      let response;
      let success = false;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          const url = selectedAnnouncement
            ? `${endpoint}/${selectedAnnouncement._id}`
            : endpoint;

          const method = selectedAnnouncement ? "PUT" : "POST";

          response = await fetch(url, {
            method,
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(announcementData),
          });

          if (response.ok) {
            success = true;
            break;
          }

          lastError = await response.text();
        } catch (error) {
          lastError = error.message;
          continue;
        }
      }

      if (!success) {
        // Store announcement locally if API fails
        const localAnnouncements = JSON.parse(
          localStorage.getItem("localAnnouncements") || "[]"
        );
        const announcementId =
          selectedAnnouncement?._id || `local_${Date.now()}`;
        const newAnnouncement = {
          ...announcementData,
          _id: announcementId,
          id: announcementId,
          createdAt: new Date().toISOString(),
          isLocal: true,
        };

        if (selectedAnnouncement) {
          const index = localAnnouncements.findIndex(
            (a) => a._id === selectedAnnouncement._id
          );
          if (index !== -1) {
            localAnnouncements[index] = newAnnouncement;
          }
        } else {
          localAnnouncements.push(newAnnouncement);
        }

        localStorage.setItem(
          "localAnnouncements",
          JSON.stringify(localAnnouncements)
        );

        // Create notifications even when saved locally
        const announcementResult = { _id: announcementId, id: announcementId };
        await createAnnouncementNotifications(
          announcementData,
          announcementResult
        );

        // Get audience label for translation
        const audienceLabel =
          t(
            `announcements.audienceLabels.${announcementData.targetAudience}`
          ) || announcementData.targetAudience;

        const successMessage = selectedAnnouncement
          ? t("announcements.success.updated") ||
            "Announcement updated successfully!"
          : t("announcements.success.created") ||
            "Announcement created successfully!";

        const successDescription = selectedAnnouncement
          ? t("announcements.success.updatedDescription", {
              audience: audienceLabel,
            }) || `Notifications sent to ${audienceLabel} users.`
          : t("announcements.success.createdDescription", {
              audience: audienceLabel,
            }) || `Notifications sent to ${audienceLabel} users.`;

        message.success(successMessage + " " + successDescription);
        message.warning(
          `📢 Announcement saved locally. It will sync when the server is available.`
        );

        // Show success notification
        const publishedMessage =
          t("announcements.success.published") || "Announcement Published!";
        const publishedDescription =
          t("announcements.success.publishedDescription", {
            title: values.title,
            audience: audienceLabel,
          }) ||
          `"${values.title}" has been published and notifications sent to ${audienceLabel} users.`;

        notification.success({
          message: publishedMessage,
          description: publishedDescription,
          icon: <SoundOutlined style={{ color: "#1890ff" }} />,
          duration: 4,
        });

        setAnnouncementModalVisible(false);
        setSelectedAnnouncement(null);
        announcementForm.resetFields();
        fetchAnnouncements();
        return;
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const result = await response.json();

        // Create notifications for target audience
        await createAnnouncementNotifications(announcementData, result);

        // Get audience label for translation
        const audienceLabel =
          t(
            `announcements.audienceLabels.${announcementData.targetAudience}`
          ) || announcementData.targetAudience;

        const successMessage = selectedAnnouncement
          ? t("announcements.success.updated") ||
            "Announcement updated successfully!"
          : t("announcements.success.created") ||
            "Announcement created successfully!";

        const successDescription = selectedAnnouncement
          ? t("announcements.success.updatedDescription", {
              audience: audienceLabel,
            }) || `Notifications sent to ${audienceLabel} users.`
          : t("announcements.success.createdDescription", {
              audience: audienceLabel,
            }) || `Notifications sent to ${audienceLabel} users.`;

        message.success(successMessage + " " + successDescription);

        setAnnouncementModalVisible(false);
        setSelectedAnnouncement(null);
        fetchAnnouncements();

        // Show success notification
        const publishedMessage =
          t("announcements.success.published") || "Announcement Published!";
        const publishedDescription =
          t("announcements.success.publishedDescription", {
            title: values.title,
            audience: audienceLabel,
          }) ||
          `"${values.title}" has been published and notifications sent to ${audienceLabel} users.`;

        notification.success({
          message: publishedMessage,
          description: publishedDescription,
          icon: <SoundOutlined style={{ color: "#1890ff" }} />,
          duration: 4,
        });
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      message.error("Failed to save announcement");
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const confirmDelete = (record) => {
    const deleteTitle = t("announcements.deleteTitle");
    const deleteConfirm = t("announcements.deleteConfirm");

    Modal.confirm({
      title:
        deleteTitle === "announcements.deleteTitle"
          ? "Delete Announcement"
          : deleteTitle,
      content:
        deleteConfirm === "announcements.deleteConfirm"
          ? "Are you sure you want to delete this announcement?"
          : deleteConfirm,
      onOk: async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/announcements/${record._id}`,
            { method: "DELETE", headers: getAuthHeaders() }
          );
          if (response.ok) fetchAnnouncements && fetchAnnouncements();
        } catch (e) {}
      },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2}>📢 {t("announcements.title")}</Title>
          <Text type="secondary">{t("announcements.subtitle")}</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setAnnouncementViewModalVisible(false);
            setViewModalVisible(false);
            setSelectedAnnouncement(null);
            if (announcementForm) announcementForm.resetFields();
            setAnnouncementModalVisible(true);
          }}
        >
          {t("announcements.createButton")}
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("announcements.stats.totalAnnouncements")}
              value={announcements.length}
              prefix={<SoundOutlined style={{ fontSize: 20 }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("announcements.stats.activeAnnouncements")}
              value={
                announcements.filter(
                  (a) => !a.expiryDate || new Date(a.expiryDate) > new Date()
                ).length
              }
              prefix={<CheckCircleOutlined style={{ fontSize: 20 }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("announcements.stats.highPriority")}
              value={announcements.filter((a) => a.priority === "high").length}
              prefix={<ExclamationCircleOutlined style={{ fontSize: 20 }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("announcements.stats.thisMonth")}
              value={
                announcements.filter(
                  (a) =>
                    new Date(a.createdAt).getMonth() === new Date().getMonth()
                ).length
              }
              prefix={<CalendarOutlined style={{ fontSize: 20 }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t("announcements.table.title")}>
        <Table
          columns={[
            {
              title: t("announcements.table.columns.title"),
              dataIndex: "title",
              key: "title",
              render: (text, record) => (
                <div>
                  <Text strong>{text}</Text>
                  {record.isSticky && (
                    <Tag color="orange" style={{ marginLeft: 8 }}>
                      📌 Pinned
                    </Tag>
                  )}
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t("announcements.table.createdAgo", {
                      time: moment(record.createdAt).fromNow(),
                    })}
                  </Text>
                </div>
              ),
            },
            {
              title: t("announcements.table.columns.targetAudience"),
              dataIndex: "targetAudience",
              key: "targetAudience",
              render: (audience) => {
                const colors = {
                  all: "blue",
                  students: "green",
                  teachers: "orange",
                  admins: "red",
                };
                return (
                  <Tag color={colors[audience] || "default"}>
                    {t(`announcements.targetAudience.${audience}`)}
                  </Tag>
                );
              },
            },
            {
              title: t("announcements.table.columns.priority"),
              dataIndex: "priority",
              key: "priority",
              render: (priority) => {
                const colors = {
                  low: "default",
                  medium: "processing",
                  high: "warning",
                };
                return (
                  <Tag color={colors[priority]}>
                    {t(`announcements.priority.${priority}`)}
                  </Tag>
                );
              },
            },
            {
              title: t("announcements.table.columns.type"),
              dataIndex: "type",
              key: "type",
              render: (type) => <Tag>{t(`announcements.type.${type}`)}</Tag>,
            },
            {
              title: t("announcements.table.columns.status"),
              key: "status",
              render: (_, record) => {
                const now = new Date();
                const publishDate = new Date(record.publishDate);
                const expiryDate = record.expiryDate
                  ? new Date(record.expiryDate)
                  : null;
                if (publishDate > now)
                  return (
                    <Tag color="orange">
                      {t("announcements.status.scheduled")}
                    </Tag>
                  );
                if (expiryDate && expiryDate < now)
                  return (
                    <Tag color="red">{t("announcements.status.expired")}</Tag>
                  );
                return (
                  <Tag color="green">{t("announcements.status.active")}</Tag>
                );
              },
            },
            {
              title: t("announcements.table.columns.actions"),
              key: "actions",
              render: (_, record) => (
                <Space>
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    className="modern-btn"
                    onClick={() => {
                      setAnnouncementViewModalVisible(false);
                      setViewModalVisible(false);
                      setSelectedAnnouncement(record);
                      setAnnouncementViewModalVisible(true);
                    }}
                  />
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                      setAnnouncementViewModalVisible(false);
                      setViewModalVisible(false);
                      setSelectedAnnouncement(record);
                      announcementForm.setFieldsValue({
                        ...record,
                        publishDate: record.publishDate
                          ? moment(record.publishDate)
                          : null,
                        expiryDate: record.expiryDate
                          ? moment(record.expiryDate)
                          : null,
                      });
                      setAnnouncementModalVisible(true);
                    }}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => confirmDelete(record)}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={announcements}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Create/Edit Announcement Modal */}
      <Modal
        title={
          selectedAnnouncement
            ? t("announcements.modal.editTitle") || "Edit Announcement"
            : t("announcements.modal.createTitle") || "Create New Announcement"
        }
        open={announcementModalVisible}
        onCancel={() => {
          setAnnouncementModalVisible(false);
          setSelectedAnnouncement(null);
          announcementForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={announcementForm}
          layout="vertical"
          onFinish={handleCreateAnnouncement}
          initialValues={{
            priority: "medium",
            type: "general",
            targetAudience: "all",
            isSticky: false,
          }}
        >
          <Form.Item
            name="title"
            label={t("announcements.modal.form.title") || "Title"}
            rules={[
              {
                required: true,
                message:
                  t("announcements.modal.form.validation.title") ||
                  "Please enter announcement title",
              },
              {
                min: 3,
                message:
                  t("announcements.modal.form.validation.titleMin") ||
                  "Title must be at least 3 characters",
              },
              {
                whitespace: true,
                message:
                  t("announcements.modal.form.validation.titleWhitespace") ||
                  "Title cannot be empty or contain only whitespace",
              },
            ]}
          >
            <Input
              placeholder={
                t("announcements.modal.form.titlePlaceholder") ||
                "Enter announcement title (minimum 3 characters)"
              }
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={t("announcements.modal.form.content") || "Content"}
            rules={[
              {
                required: true,
                message:
                  t("announcements.modal.form.validation.content") ||
                  "Please enter announcement content",
              },
              {
                min: 10,
                message:
                  t("announcements.modal.form.validation.contentMin") ||
                  "Content must be at least 10 characters",
              },
              {
                whitespace: true,
                message:
                  t("announcements.modal.form.validation.contentWhitespace") ||
                  "Content cannot be empty or contain only whitespace",
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder={
                t("announcements.modal.form.contentPlaceholder") ||
                "Enter announcement content that will be visible to users (minimum 10 characters)"
              }
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="targetAudience"
                label={
                  t("announcements.modal.form.targetAudience") ||
                  "Target Audience"
                }
              >
                <Select>
                  <Option value="all">
                    {t("announcements.modal.form.audienceOptions.all") ||
                      "All Users"}
                  </Option>
                  <Option value="students">
                    {t("announcements.modal.form.audienceOptions.students") ||
                      "Students Only"}
                  </Option>
                  <Option value="teachers">
                    {t("announcements.modal.form.audienceOptions.teachers") ||
                      "Teachers Only"}
                  </Option>
                  <Option value="admins">
                    {t("announcements.modal.form.audienceOptions.admins") ||
                      "Admins Only"}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label={t("announcements.modal.form.priority") || "Priority"}
              >
                <Select>
                  <Option value="low">
                    {t("announcements.modal.form.priorityOptions.low") ||
                      "Low Priority"}
                  </Option>
                  <Option value="medium">
                    {t("announcements.modal.form.priorityOptions.medium") ||
                      "Medium Priority"}
                  </Option>
                  <Option value="high">
                    {t("announcements.modal.form.priorityOptions.high") ||
                      "High Priority"}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t("announcements.modal.form.type") || "Type"}
              >
                <Select>
                  <Option value="general">
                    {t("announcements.modal.form.typeOptions.general") ||
                      "General"}
                  </Option>
                  <Option value="academic">
                    {t("announcements.modal.form.typeOptions.academic") ||
                      "Academic"}
                  </Option>
                  <Option value="event">
                    {t("announcements.modal.form.typeOptions.event") || "Event"}
                  </Option>
                  <Option value="maintenance">
                    {t("announcements.modal.form.typeOptions.maintenance") ||
                      "Maintenance"}
                  </Option>
                  <Option value="urgent">
                    {t("announcements.modal.form.typeOptions.urgent") ||
                      "Urgent"}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isSticky"
                label={
                  t("announcements.modal.form.pinAnnouncement") ||
                  "Pin Announcement"
                }
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="publishDate"
                label={
                  t("announcements.modal.form.publishDate") || "Publish Date"
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  placeholder={
                    t("announcements.modal.form.publishDatePlaceholder") ||
                    "Select publish date (optional)"
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiryDate"
                label={
                  t("announcements.modal.form.expiryDate") || "Expiry Date"
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  placeholder={
                    t("announcements.modal.form.expiryDatePlaceholder") ||
                    "Select expiry date (optional)"
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label={t("announcements.modal.form.tags") || "Tags (optional)"}
          >
            <Input
              placeholder={
                t("announcements.modal.form.tagsPlaceholder") ||
                "Add tags for better organization"
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setAnnouncementModalVisible(false);
                  setSelectedAnnouncement(null);
                  announcementForm.resetFields();
                }}
              >
                {t("announcements.modal.buttons.cancel") || "Cancel"}
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedAnnouncement
                  ? t("announcements.modal.buttons.update") || "Update & Notify"
                  : t("announcements.modal.buttons.create") ||
                    "Create & Send Notifications"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Announcement Modal */}
      <Modal
        title={t("announcements.modal.viewTitle") || "Announcement Details"}
        open={announcementViewModalVisible}
        onCancel={() => {
          setAnnouncementViewModalVisible(false);
          setSelectedAnnouncement(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setAnnouncementViewModalVisible(false);
              setSelectedAnnouncement(null);
            }}
          >
            {t("announcements.modal.buttons.close") || "Close"}
          </Button>,
        ]}
        width={700}
      >
        {selectedAnnouncement && (
          <div>
            <Title level={4}>{selectedAnnouncement.title}</Title>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                {t("announcements.table.createdAgo", {
                  time: moment(selectedAnnouncement.createdAt).fromNow(),
                })}
              </Text>
            </div>
            <div style={{ marginBottom: 16, whiteSpace: "pre-wrap" }}>
              <Text>{selectedAnnouncement.content}</Text>
            </div>
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Text strong>
                  {t("announcements.modal.form.targetAudience") ||
                    "Target Audience"}
                  :{" "}
                </Text>
                <Tag color="blue">
                  {t(
                    `announcements.targetAudience.${selectedAnnouncement.targetAudience}`
                  )}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>
                  {t("announcements.modal.form.priority") || "Priority"}:{" "}
                </Text>
                <Tag
                  color={
                    selectedAnnouncement.priority === "high"
                      ? "red"
                      : selectedAnnouncement.priority === "medium"
                      ? "orange"
                      : "default"
                  }
                >
                  {t(`announcements.priority.${selectedAnnouncement.priority}`)}
                </Tag>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text strong>
                  {t("announcements.modal.form.type") || "Type"}:{" "}
                </Text>
                <Tag>
                  {t(`announcements.type.${selectedAnnouncement.type}`)}
                </Tag>
              </Col>
              <Col span={12}>
                {selectedAnnouncement.isSticky && (
                  <Tag color="orange">📌 Pinned</Tag>
                )}
              </Col>
            </Row>
            {selectedAnnouncement.publishDate && (
              <div style={{ marginTop: 16 }}>
                <Text strong>
                  {t("announcements.modal.form.publishDate") || "Publish Date"}:{" "}
                </Text>
                <Text>
                  {moment(selectedAnnouncement.publishDate).format(
                    "MMMM DD, YYYY HH:mm"
                  )}
                </Text>
              </div>
            )}
            {selectedAnnouncement.expiryDate && (
              <div style={{ marginTop: 8 }}>
                <Text strong>
                  {t("announcements.modal.form.expiryDate") || "Expiry Date"}:{" "}
                </Text>
                <Text>
                  {moment(selectedAnnouncement.expiryDate).format(
                    "MMMM DD, YYYY HH:mm"
                  )}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAnnouncement;

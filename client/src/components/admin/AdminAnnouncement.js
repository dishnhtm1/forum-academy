import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
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

const AdminAnnouncement = ({
  t,
  setAnnouncementViewModalVisible,
  setViewModalVisible,
  setAnnouncementModalVisible,
}) => {
  const history = useHistory();
  const [announcementForm] = Form.useForm();

  // Context
  const context = useContext(AdminContext);
  const currentUser = context?.currentUser;

  // Local state
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Fetch announcements
  const fetchAnnouncements = async () => {
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
        setAnnouncements(data.announcements || []);
      } else {
        // Load local announcements if API fails
        const localAnnouncements = JSON.parse(
          localStorage.getItem("localAnnouncements") || "[]"
        );
        setAnnouncements(localAnnouncements);
      }
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
      const notification = {
        ...notificationData,
        _id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        isLocal: true,
        read: false,
      };
      localNotifications.push(notification);
      localStorage.setItem(
        "localNotifications",
        JSON.stringify(localNotifications)
      );
    } catch (error) {
      console.error("Error creating local notification:", error);
    }
  };

  // Create notifications for announcement target audience
  const createAnnouncementNotifications = async (
    announcementData,
    announcementResult
  ) => {
    try {
      const notificationData = {
        type: "announcement",
        title: `📢 New Announcement: ${announcementData.title}`,
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
            break;
          }
        } catch (error) {
          console.log(`Failed to create notifications via ${endpoint}:`, error);
          continue;
        }
      }

      if (!notificationSuccess) {
        console.warn(
          "⚠️ Could not create notifications - endpoints may not be available"
        );
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
        authorName: currentUser?.firstName + " " + currentUser?.lastName,
      };

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
        const newAnnouncement = {
          ...announcementData,
          _id: selectedAnnouncement?._id || `local_${Date.now()}`,
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

        message.warning(
          `📢 Announcement saved locally. It will sync when the server is available.`
        );
        setAnnouncementModalVisible(false);
        setSelectedAnnouncement(null);
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

        message.success(
          `📢 Announcement ${
            selectedAnnouncement ? "updated" : "created"
          } successfully! Notifications sent to ${
            announcementData.targetAudience
          } users.`
        );
        setAnnouncementModalVisible(false);
        setSelectedAnnouncement(null);
        fetchAnnouncements();

        // Show success notification
        notification.success({
          message: "Announcement Published!",
          description: `"${values.title}" has been published and notifications sent to ${announcementData.targetAudience} users.`,
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
    Modal.confirm({
      title: t("announcements.deleteTitle") || "Delete Announcement",
      content:
        t("announcements.deleteConfirm") ||
        "Are you sure you want to delete this announcement?",
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
            announcementForm && announcementForm.resetFields();
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
    </div>
  );
};

export default AdminAnnouncement;

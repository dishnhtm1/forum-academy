import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  message,
  Form,
  Input,
  Switch,
  Divider,
  Avatar,
  Upload,
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { userAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TeacherSettings = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    studentSubmissions: true,
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
        firstName: currentUser.firstName || currentUser.name?.split(" ")[0] || "",
        lastName: currentUser.lastName || currentUser.name?.split(" ")[1] || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, profileForm]);

  const handleUpdateProfile = async (values) => {
    try {
      setProfileLoading(true);
      await userAPI.update(currentUser.id || currentUser._id, values);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      await userAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch (error) {
      message.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <SettingOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.settings") || "Settings"}
            </Title>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <UserOutlined />
                <span>Profile Settings</span>
              </Space>
            }>
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Form.Item label="Avatar">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Avatar size={100} icon={<UserOutlined />} />
                  </Upload>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="firstName" label="First Name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName" label="Last Name">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="email" label="Email">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input />
                </Form.Item>
                <Form.Item name="bio" label="Bio">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={profileLoading}
                  >
                    Save Profile
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Password Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <LockOutlined />
                <span>Password Settings</span>
              </Space>
            }>
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
              >
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: "Please enter current password" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[{ required: true, message: "Please enter new password" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[{ required: true, message: "Please confirm password" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={passwordLoading}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Notification Settings */}
          <Col xs={24}>
            <Card title={
              <Space>
                <BellOutlined />
                <span>Notification Settings</span>
              </Space>
            }>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Email Notifications</Text>
                  <Switch
                    checked={notificationPreferences.emailNotifications}
                    onChange={(checked) =>
                      setNotificationPreferences({
                        ...notificationPreferences,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Assignment Reminders</Text>
                  <Switch
                    checked={notificationPreferences.assignmentReminders}
                    onChange={(checked) =>
                      setNotificationPreferences({
                        ...notificationPreferences,
                        assignmentReminders: checked,
                      })
                    }
                  />
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Student Submissions</Text>
                  <Switch
                    checked={notificationPreferences.studentSubmissions}
                    onChange={(checked) =>
                      setNotificationPreferences({
                        ...notificationPreferences,
                        studentSubmissions: checked,
                      })
                    }
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TeacherSettings;

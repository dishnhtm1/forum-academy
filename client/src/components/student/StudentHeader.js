/**
 * StudentHeader (2025 refresh)
 * --------------------------------------------
 * - Keeps Japanese translations by continuing to rely on `t()` for all copy.
 * - Modernises the layout with responsive spacing and optional search (desktop).
 * - Adds accessible tooltips/aria labels to icon buttons.
 * - Ensures controls collapse gracefully on small screens while retaining all
 *   original callbacks provided by the parent dashboard.
 */
import React, { useMemo } from "react";
import {
  Layout,
  Button,
  Breadcrumb,
  Badge,
  Avatar,
  Dropdown,
  Typography,
  message,
  Space,
  Tooltip,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Title, Text } = Typography;

const StudentHeader = ({
  isMobile,
  collapsed,
  activeTab,
  studentMenuItems,
  notificationStats,
  onNotificationClick,
  zoomClasses,
  onSelectZoomTab,
  onToggleSidebar,
  currentLanguage,
  onToggleLanguage,
  currentUser,
  onLogout,
  t,
}) => {
  const currentTabLabel = useMemo(() => {
    return (
      studentMenuItems.find((item) => item.key === activeTab)?.label || ""
    );
  }, [studentMenuItems, activeTab]);

  const unreadNotifications = notificationStats?.unread ?? 0;
  const activeZoomSessions = zoomClasses?.length ?? 0;

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        height: isMobile ? "56px" : "68px",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <Space align="center" size={isMobile ? 6 : 12}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
          aria-label={t("studentDashboard.header.toggleSidebar", "Toggle menu")}
          style={{
            fontSize: 18,
            width: isMobile ? 38 : 44,
            height: isMobile ? 38 : 44,
          }}
        />
        {!isMobile ? (
          <Breadcrumb separator="/" style={{ margin: 0 }}>
            <Breadcrumb.Item>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {t("studentDashboard.header.breadcrumbRoot", "Student Dashboard")}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{currentTabLabel}</Breadcrumb.Item>
          </Breadcrumb>
        ) : (
          <Title level={5} style={{ margin: 0, color: "#1f2937" }}>
            {currentTabLabel}
          </Title>
        )}
      </Space>

      <Space align="center" size={isMobile ? 6 : 14}>
        <Tooltip title={t("studentDashboard.header.notifications", "通知")}>
          <Badge count={unreadNotifications} overflowCount={99}>
            <Button
              type="text"
              aria-label={t("studentDashboard.header.notifications", "通知")}
              icon={<BellOutlined />}
              onClick={onNotificationClick}
              style={{ fontSize: 18 }}
            />
          </Badge>
        </Tooltip>

        <Tooltip title={t("studentDashboard.header.liveClasses", "ライブクラス")}>
          <Badge count={activeZoomSessions} overflowCount={99} color="#dc2626">
            <Button
              type="text"
              aria-label={t("studentDashboard.header.liveClasses", "ライブクラス")}
              icon={<VideoCameraOutlined />}
              onClick={onSelectZoomTab}
              style={{ fontSize: 18 }}
            />
          </Badge>
        </Tooltip>

        <Tooltip title={t("studentDashboard.header.toggleLanguage", "言語切替")}>
          <Button
            type="text"
            onClick={onToggleLanguage}
            aria-label={t("studentDashboard.header.toggleLanguage", "言語切替")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: isMobile ? "4px 6px" : "6px 10px",
              fontWeight: 500,
            }}
          >
            <GlobalOutlined style={{ fontSize: 18 }} />
            {!isMobile && (
              <span>{currentLanguage === "en" ? "EN" : "日本語"}</span>
            )}
          </Button>
        </Tooltip>

        <Dropdown
          menu={{
            items: [
              {
                key: "profile",
                icon: <UserOutlined />,
                label: t("studentDashboard.header.myProfile"),
                onClick: () => message.info("Profile settings coming soon"),
              },
              {
                key: "settings",
                icon: <SettingOutlined />,
                label: t("studentDashboard.header.settings"),
                onClick: () => message.info("Settings coming soon"),
              },
              { type: "divider" },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: t("studentDashboard.header.logout"),
                onClick: onLogout,
                danger: true,
              },
            ],
          }}
          placement="bottomRight"
        >
          <Space
            align="center"
            style={{
              padding: isMobile ? "4px 6px" : "6px 12px",
              borderRadius: 999,
              background: "rgba(148, 163, 184, 0.12)",
              cursor: "pointer",
            }}
          >
            <Avatar
              size={isMobile ? 30 : 34}
              style={{ backgroundColor: "#2563eb", color: "#fff" }}
              icon={<UserOutlined />}
            />
            {!isMobile && (
              <Text strong style={{ color: "#1f2937" }}>
                {currentUser?.name || "Student"}
              </Text>
            )}
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default StudentHeader;


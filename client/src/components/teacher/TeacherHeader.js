import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

function Icon({ name, size = 20, color = "currentColor" }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "menu":
      return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "bell":
      return <svg {...common}><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"/><path d="M9 21h6"/></svg>;
    case "user":
      return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    default:
      return null;
  }
}

function TeacherHeader(props) {
  const {
    collapsed,
    onCollapse,
    isMobile,
    onMobileDrawerToggle,
    activeKey,
    unreadCount,
    onNotificationClick,
    currentUser,
    onProfileClick,
    onLogout,
    activeKeyLabel,
  } = props;

  const { t } = useTranslation();

  // Return fallback when i18n key is missing (prevents showing the raw key)
  const tt = (key, fallback) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const getActiveLabel = () => {
    if (activeKeyLabel) return activeKeyLabel;
    
    const menuLabels = {
      overview: t("teacherDashboard.sidebar.overview") || "Overview",
      classes: t("teacherDashboard.sidebar.myClasses") || "My Classes",
      materials: t("teacherDashboard.sidebar.materials") || "Materials",
      quizzes: t("teacherDashboard.sidebar.quizManagement") || "Quiz Management",
      assignments: t("teacherDashboard.sidebar.assignmentCenter") || "Assignment Center",
      listening: t("teacherDashboard.sidebar.listeningExercises") || "Listening Exercises",
      students: t("teacherDashboard.sidebar.studentManagement") || "Student Management",
      live: t("teacherDashboard.sidebar.liveClasses") || "Live Classes",
      grading: t("teacherDashboard.sidebar.gradingCenter") || "Grading Center",
      analytics: t("teacherDashboard.sidebar.analytics") || "Analytics",
      settings: t("teacherDashboard.sidebar.settings") || "Settings",
    };
    
    return menuLabels[activeKey] || t("teacherDashboard.title") || "Teacher Dashboard";
  };

  const userMenuItems = [
    { key: "profile", label: tt("teacherDashboard.sidebar.profile", "Profile"), onClick: onProfileClick },
    { key: "settings", label: tt("teacherDashboard.sidebar.settings", "Settings"), onClick: () => {} },
    { key: "logout", label: tt("teacherDashboard.sidebar.logout", "Logout"), onClick: onLogout },
  ];

  return (
    <>
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 999,
          height: 72,
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <button
            onClick={() => (isMobile ? onMobileDrawerToggle() : onCollapse(!collapsed))}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              marginRight: 12,
            }}
            aria-label="Toggle menu"
          >
            <Icon name="menu" size={isMobile ? 24 : 20} />
          </button>
          {/* Page title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#262626", lineHeight: 1.2 }}>
              {getActiveLabel()}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #d9d9d9",
                  borderRadius: 999,
                  overflow: "hidden",
                  height: 28,
                  background: "#fff",
                }}
              >
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    localStorage.setItem("language", "en");
                  }}
                  aria-pressed={i18n.language === "en"}
                  style={{
                    padding: "0 12px",
                    height: 28,
                    border: 0,
                    cursor: "pointer",
                    background: i18n.language === "en" ? "#1890ff" : "transparent",
                    color: i18n.language === "en" ? "#fff" : "#595959",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage("ja");
                    localStorage.setItem("language", "ja");
                  }}
                  aria-pressed={i18n.language === "ja"}
                  style={{
                    padding: "0 12px",
                    height: 28,
                    border: 0,
                    cursor: "pointer",
                    background: i18n.language === "ja" ? "#1890ff" : "transparent",
                    color: i18n.language === "ja" ? "#fff" : "#595959",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  JP
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onNotificationClick}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              background: "transparent",
              position: "relative",
              cursor: "pointer",
            }}
            aria-label="Notifications"
          >
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4, background: "#ff4d4f", color: "#fff", borderRadius: 8, padding: "0 6px", fontSize: 10, fontWeight: 600,
              }}>{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
            <Icon name="bell" size={isMobile ? 22 : 20} />
          </button>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
            {/* Inline user chip (desktop), icon only on mobile */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5f5f5", padding: "6px 10px", borderRadius: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1890ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  {(currentUser?.firstName?.[0] || currentUser?.name?.[0] || "T") + (currentUser?.lastName?.[0] || currentUser?.name?.[1] || "E")}
                </div>
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontWeight: 600, color: "#262626", fontSize: 13 }}>{currentUser?.name || currentUser?.firstName || "Teacher"} {currentUser?.lastName || ""}</div>
                  <div style={{ fontSize: 11, color: "#8c8c8c" }}>{currentUser?.email || "teacher@example.com"}</div>
                </div>
                <div style={{ fontSize: 11, color: "#1677ff", background: "#e6f4ff", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>Teacher</div>
              </div>
            )}

            <button
              onClick={(e) => {
                const menu = e.currentTarget.nextSibling;
                if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#f5f5f5",
                border: 0,
                cursor: "pointer",
              }}
              aria-label="User menu"
              title="Account"
            >
              <Icon name="user" size={isMobile ? 22 : 20} />
            </button>
            <div
              style={{
                display: "none",
                position: "absolute",
                right: 0,
                top: 46,
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                minWidth: 160,
                zIndex: 1000,
              }}
            >
              {userMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    item.onClick && item.onClick();
                    const menuEl = document.activeElement?.parentElement;
                    if (menuEl && menuEl.style) menuEl.style.display = "none";
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: 0,
                    textAlign: "left",
                    padding: "10px 12px",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherHeader;


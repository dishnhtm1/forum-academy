import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

function Icon({ name, size = 18, color = "currentColor" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "classes":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M20 22V6a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 6.5V22" />
        </svg>
      );
    case "materials":
      return (
        <svg {...common}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 17l9 4 9-4" />
          <path d="M3 12l9 4 9-4" />
        </svg>
      );
    case "quiz":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "assignment":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "listening":
      return (
        <svg {...common}>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    case "students":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "live":
      return (
        <svg {...common}>
          <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
        </svg>
      );
    case "grading":
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <rect x="7" y="12" width="3" height="6" />
          <rect x="12" y="8" width="3" height="10" />
          <rect x="17" y="5" width="3" height="13" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.04 3.3l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8c.64.18 1.16.7 1.34 1.34H21a2 2 0 1 1 0 4h-.09c-.18.64-.7 1.16-1.51 1z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    default:
      return null;
  }
}

function TeacherLayout(props) {
  const {
    activeKey,
    onMenuClick,
    children,
    collapsed = false,
    isMobile = false,
    onMobileDrawerToggle,
    mobileDrawerVisible = false,
    currentUser,
    onLogout,
  } = props;

  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemPosition, setHoveredItemPosition] = useState({ top: 0 });

  // Helper function to get translations with fallbacks
  const getTranslation = (key, fallback) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  // Track viewport for responsive behaviors
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isTablet = !isMobile && viewportWidth <= 1024;

  // Color scheme matching the AdminLayout - clean and modern
  const colors = {
    background: "#FFFFFF",
    backgroundLight: "#F8F8F8",
    accentStart: "#8B5CF6",
    accentEnd: "#EC4899",
    activeBg: "#F3E8FF",
    activeText: "#8B5CF6",
    textPrimary: "#333333",
    textSecondary: "#888888",
    textLight: "#AAAAAA",
    border: "#E8E8E8",
    searchBg: "#F0F0F0",
  };

  // Menu items organized by sections
  const mainItems = [
    {
      key: "overview",
      iconName: "overview",
      label: t("teacherDashboard.sidebar.overview") || "Overview",
    },
    {
      key: "classes",
      iconName: "classes",
      label: t("teacherDashboard.sidebar.myClasses") || "My Classes",
    },
    {
      key: "materials",
      iconName: "materials",
      label: t("teacherDashboard.sidebar.materials") || "Materials",
    },
    {
      key: "quizzes",
      iconName: "quiz",
      label: t("teacherDashboard.sidebar.quizManagement") || "Quiz Management",
    },
    {
      key: "assignments",
      iconName: "assignment",
      label: t("teacherDashboard.sidebar.assignmentCenter") || "Assignment Center",
    },
    {
      key: "listening",
      iconName: "listening",
      label: t("teacherDashboard.sidebar.listeningExercises") || "Listening Exercises",
    },
  ];

  const studentItems = [
    {
      key: "students",
      iconName: "students",
      label: t("teacherDashboard.sidebar.studentManagement") || "Student Management",
    },
    {
      key: "live",
      iconName: "live",
      label: t("teacherDashboard.sidebar.liveClasses") || "Live Classes",
    },
    {
      key: "grading",
      iconName: "grading",
      label: t("teacherDashboard.sidebar.gradingCenter") || "Grading Center",
    },
  ];

  const analyticsItems = [
    {
      key: "analytics",
      iconName: "analytics",
      label: t("teacherDashboard.sidebar.analytics") || "Analytics",
    },
    {
      key: "settings",
      iconName: "settings",
      label: t("teacherDashboard.sidebar.settings") || "Settings",
    },
  ];

  const showCompact = !isMobile && (collapsed || isTablet);
  const sidebarWidth = showCompact ? 70 : 280;
  const itemContentWidth = "100%";
  const itemHeight = 40;

  // Logo component with gradient
  const Logo = ({ compact = false }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 0 : 12,
        justifyContent: compact ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          width: compact ? 32 : 36,
          height: compact ? 32 : 36,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${colors.accentStart} 0%, ${colors.accentEnd} 100%)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: compact ? 14 : 16,
          letterSpacing: 0.5,
          boxShadow: `0 2px 8px rgba(139, 92, 246, 0.25)`,
          flexShrink: 0,
        }}
        aria-label="Teacher Portal"
        title="Teacher Portal"
      >
        <Icon name="book" size={compact ? 20 : 22} color="#fff" />
      </div>
      {!compact && (
        <div style={{ lineHeight: 1.2, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              color: colors.textPrimary,
              fontSize: 18,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
              whiteSpace: "normal",
              overflow: "visible",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {t("teacherDashboard.sidebar.teacherPortal") || "Teacher Portal"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
            }}
          >
            Forum Academy
          </div>
        </div>
      )}
    </div>
  );

  // Navigation item component
  const NavItem = ({ item, compact = false }) => {
    const isActive = item.key === activeKey;
    const isHovered = hoveredItem === item.key;
    const iconSize = 20;
    const buttonRef = useRef(null);

    const itemStyle = {
      position: "relative",
      width: compact ? "100%" : itemContentWidth,
      height: "auto",
      minHeight: itemHeight,
      display: "flex",
      alignItems: "center",
      gap: compact ? 0 : 12,
      padding: compact ? "0" : "10px 16px",
      border: 0,
      background: isActive
        ? colors.activeBg
        : isHovered && !compact
        ? "rgba(243, 232, 255, 0.5)"
        : "transparent",
      color: isActive ? colors.activeText : colors.textPrimary,
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 500,
      margin: "2px 0",
      textAlign: "left",
      justifyContent: compact ? "center" : "flex-start",
      fontSize: 14,
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
      transition: "all 0.2s ease",
    };

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <button
          ref={buttonRef}
          style={itemStyle}
          onClick={() => onMenuClick(item.key)}
          onMouseEnter={(e) => {
            if (compact && buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect();
              setHoveredItemPosition({ top: rect.top + rect.height / 2 });
            }
            setHoveredItem(item.key);
          }}
          onMouseLeave={() => {
            setHoveredItem(null);
          }}
          aria-label={item.label}
        >
          <span
            style={{
              display: "inline-flex",
              minWidth: iconSize,
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              name={item.iconName}
              color={isActive ? colors.activeText : colors.textPrimary}
              size={iconSize}
            />
          </span>
          {!compact && (
            <span
              style={{
                flex: 1,
                overflow: "visible",
                textOverflow: "clip",
                whiteSpace: "normal",
                lineHeight: 1.4,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {item.label}
            </span>
          )}
        </button>
        {/* Tooltip for collapsed view */}
        {compact && isHovered && (
          <div
            style={{
              position: "fixed",
              left: sidebarWidth + 12,
              top: hoveredItemPosition.top,
              transform: "translateY(-50%)",
              background: colors.textPrimary,
              color: "#FFFFFF",
              padding: "8px 12px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: "nowrap",
              zIndex: 10000,
              pointerEvents: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {item.label}
            <div
              style={{
                position: "absolute",
                left: -6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: `6px solid ${colors.textPrimary}`,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: colors.background,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: showCompact ? "16px 12px" : "20px 16px",
          borderBottom: `1px solid ${colors.border}`,
          minHeight: showCompact ? 64 : 80,
          display: "flex",
          flexDirection: "column",
          gap: showCompact ? 8 : 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: showCompact ? "center" : "flex-start",
            gap: 8,
          }}
        >
          <Logo compact={showCompact} />
        </div>
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: showCompact ? "12px 8px" : "16px 12px",
        }}
      >
        {/* Main Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            marginTop: 8,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: colors.textSecondary,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {t("teacherDashboard.sidebar.sections.main") || "Main"}
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {mainItems.map((item) => (
            <NavItem key={item.key} item={item} compact={showCompact} />
          ))}
        </nav>

        {/* Student Management Section */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 8,
            marginTop: 24,
            paddingLeft: 4,
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: showCompact ? "none" : "block",
          }}
        >
          {t("teacherDashboard.sidebar.sections.students") || "Students"}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {studentItems.map((item) => (
            <NavItem key={item.key} item={item} compact={showCompact} />
          ))}
        </nav>

        {/* Analytics & Settings Section */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 8,
            marginTop: 24,
            paddingLeft: 4,
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: showCompact ? "none" : "block",
          }}
        >
          {t("teacherDashboard.sidebar.sections.analytics") || "Analytics & Settings"}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {analyticsItems.map((item) => (
            <NavItem key={item.key} item={item} compact={showCompact} />
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .teacher-sidebar {
          background: ${colors.background};
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
          border-right: 1px solid ${colors.border};
          font-family: system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif;
        }
        /* Japanese text support - ensure proper rendering */
        .teacher-sidebar * {
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        /* Smooth scrollbar */
        .teacher-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .teacher-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .teacher-sidebar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        .teacher-sidebar::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
        /* Compact on tablet widths */
        @media (max-width: 1024px) {
          .teacher-sidebar {
            width: 70px !important;
          }
        }
        @media (max-width: 768px) {
          .teacher-sidebar {
            width: 280px !important;
          }
        }
      `}</style>

      {!isMobile && (
        <aside
          className="teacher-sidebar"
          style={{
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            width: sidebarWidth,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {sidebarContent}
        </aside>
      )}

      {isMobile && mobileDrawerVisible && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={onMobileDrawerToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 1100,
            display: "flex",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="teacher-sidebar"
            style={{ width: 280, height: "100%", background: colors.background }}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          background: colors.backgroundLight,
        }}
      >
        {children}
      </main>
    </>
  );
}

export default TeacherLayout;


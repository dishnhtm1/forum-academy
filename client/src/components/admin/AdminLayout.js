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
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M3 13h8V3H3v10zM13 21h8v-8h-8v8zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" />
        </svg>
      );
    case "applications":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h6" />
        </svg>
      );
    case "enroll":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "courses":
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
    case "students":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "announcements":
      return (
        <svg {...common}>
          <path d="M3 10v6a1 1 0 0 0 1 1h3l4 4V5L7 9H4a1 1 0 0 0-1 1z" />
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
    case "chevron-left":
      return (
        <svg {...common}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}


function AdminLayout(props) {
  const {
    activeKey,
    onMenuClick,
    children,
    collapsed = false,
    isMobile = false,
    onMobileDrawerToggle,
    mobileDrawerVisible = false,
    currentUser,
    getImageSrc,
    onLogout,
  } = props;

  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemPosition, setHoveredItemPosition] = useState({ top: 0 });

  // Helper function to get translations with fallbacks
  const getTranslation = (key, fallback) => {
    const translated = t(key);
    // If translation returns the key itself, it means translation is missing, use fallback
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

  // Color scheme matching the image
  const colors = {
    background: "#FFFFFF",
    backgroundLight: "#F8F8F8",
    accentStart: "#6A82FB",
    accentEnd: "#8B5CF6",
    activeBg: "#E8E8FF",
    activeText: "#6A82FB",
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
      iconName: "dashboard",
      label: t("adminSidebar.navigation.overview") || "Dashboard Overview",
    },
    {
      key: "applications",
      iconName: "applications",
      label: t("adminSidebar.navigation.applications") || "Applications & Users",
    },
    {
      key: "enrollments",
      iconName: "enroll",
      label: t("adminSidebar.navigation.enrollments") || "Enrollment Monitoring",
    },
    {
      key: "courses",
      iconName: "courses",
      label: t("adminSidebar.navigation.courses") || "Course Management",
    },
    {
      key: "materials",
      iconName: "materials",
      label: t("adminSidebar.navigation.materials") || "Course Materials",
    },
    {
      key: "students",
      iconName: "students",
      label: t("adminSidebar.navigation.students") || "Student Progress",
    },
  ];

  const communicationItems = [
    {
      key: "announcements",
      iconName: "announcements",
      label: t("adminSidebar.navigation.announcements") || "Announcements",
    },
    {
      key: "analytics",
      iconName: "analytics",
      label: t("adminSidebar.navigation.analytics") || "Analytics",
    },
    {
      key: "settings",
      iconName: "settings",
      label: t("adminSidebar.navigation.settings") || "Settings",
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
          boxShadow: `0 2px 8px rgba(106, 130, 251, 0.25)`,
          flexShrink: 0,
        }}
        aria-label="FIA"
        title="FIA"
      >
        FIA
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
            Forum Information Academy
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
            }}
          >
            Admin Panel
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
        ? "rgba(232, 232, 255, 0.5)"
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
          {!compact && item.badge && (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 12,
                background: colors.searchBg,
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                minWidth: 24,
                textAlign: "center",
              }}
            >
              {item.badge}
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
            {getTranslation("adminSidebar.sections.main", "Main")}
          </div>
          {!showCompact && (
            <button
              onClick={() => {
                // Handle "Show All" functionality if needed
                console.log("Show All clicked");
              }}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: colors.activeText,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
              }}
            >
              {getTranslation("adminSidebar.sections.showAll", "Show All")}
            </button>
          )}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {mainItems.map((item) => (
            <NavItem key={item.key} item={item} compact={showCompact} />
          ))}
        </nav>

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
          {getTranslation("adminSidebar.sections.communication", "Communication")}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {communicationItems.map((item) => (
            <NavItem key={item.key} item={item} compact={showCompact} />
          ))}
        </nav>
      </div>

    </div>
  );

  return (
    <>
      <style>{`
        .admin-sidebar-redesign {
          background: ${colors.background};
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
          border-right: 1px solid ${colors.border};
          font-family: system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif;
        }
        /* Japanese text support - ensure proper rendering */
        .admin-sidebar-redesign * {
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        /* Smooth scrollbar */
        .admin-sidebar-redesign::-webkit-scrollbar {
          width: 6px;
        }
        .admin-sidebar-redesign::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar-redesign::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        .admin-sidebar-redesign::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
        /* Compact on tablet widths */
        @media (max-width: 1024px) {
          .admin-sidebar-redesign {
            width: 70px !important;
          }
        }
        @media (max-width: 768px) {
          .admin-sidebar-redesign {
            width: 280px !important;
          }
        }
      `}</style>

      {!isMobile && (
        <aside
          className="admin-sidebar-redesign"
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
            className="admin-sidebar-redesign"
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

export default AdminLayout;

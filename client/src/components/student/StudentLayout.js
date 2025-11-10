import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// Simple Icon Component matching TeacherLayout style
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
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "listening":
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case "quizzes":
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "homework":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "zoom":
      return (
        <svg {...common}>
          <path d="M22 8.7l-5 3.3V8a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4l5 3.3z" />
        </svg>
      );
    case "progress":
      return (
        <svg {...common}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "courses":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "achievements":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
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

function StudentLayout(props) {
  const {
    isMobile,
    collapsed,
    onBreakpoint,
    studentMenuItems,
    activeTab,
    onSelectMenu,
    mobileDrawerVisible,
    onCloseMobileDrawer,
    children,
  } = props;

  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemPosition, setHoveredItemPosition] = useState({ top: 0 });

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

  // Color scheme matching modern design
  const colors = {
    background: "#FFFFFF",
    backgroundLight: "#F8F8F8",
    accentStart: "#a855f7",
    accentEnd: "#6366f1",
    activeBg: "#f3e8ff",
    activeText: "#8B5CF6",
    textPrimary: "#333333",
    textSecondary: "#888888",
    textLight: "#AAAAAA",
    border: "#E8E8E8",
  };

  // Organize menu items by sections
  const sections = useMemo(() => {
    const mainKeys = new Set([
      "overview",
      "listening",
      "quizzes",
      "homework",
      "zoom",
      "progress",
    ]);
    const main = [];
    const explore = [];
    studentMenuItems.forEach((item) => {
      if (mainKeys.has(item.key)) {
        main.push(item);
      } else {
        explore.push(item);
      }
    });
    return { main, explore };
  }, [studentMenuItems]);

  const showCompact = !isMobile && (collapsed || isTablet);
  const sidebarWidth = showCompact ? 70 : 280;

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
          boxShadow: `0 2px 8px rgba(168, 85, 247, 0.25)`,
          flexShrink: 0,
        }}
        aria-label="Student Portal"
        title="Student Portal"
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
            {t("studentDashboard.portal.title")}
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
            }}
          >
            {t("studentDashboard.portal.subtitle")}
          </div>
        </div>
      )}
    </div>
  );

  // Get icon name from menu item
  const getIconName = (item) => {
    const key = item.key;
    const iconMap = {
      overview: "overview",
      listening: "listening",
      quizzes: "quizzes",
      homework: "homework",
      zoom: "zoom",
      progress: "progress",
      courses: "courses",
      calendar: "calendar",
      achievements: "achievements",
    };
    return iconMap[key] || "overview";
  };

  // Navigation item component
  const NavItem = ({ item, compact = false, onAfterSelect }) => {
    const isActive = item.key === activeTab;
    const isHovered = hoveredItem === item.key;
    const iconSize = 20;
    const buttonRef = useRef(null);

    const itemStyle = {
      position: "relative",
      width: compact ? "100%" : "100%",
      height: "auto",
      minHeight: 40,
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

    const handleClick = () => {
      onSelectMenu(item.key);
      if (onAfterSelect) {
        onAfterSelect();
      }
    };

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <button
          ref={buttonRef}
          style={itemStyle}
          onClick={handleClick}
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
          title={compact ? item.label : ""}
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
              name={getIconName(item)}
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
        {sections.main.length > 0 && (
          <>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: colors.textSecondary,
                marginBottom: 8,
                marginTop: 8,
                paddingLeft: 4,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: showCompact ? "none" : "block",
              }}
            >
              {t("studentDashboard.sidebar.sections.main")}
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              {sections.main.map((item) => (
                <NavItem key={item.key} item={item} compact={showCompact} />
              ))}
            </nav>
          </>
        )}

        {/* Explore Section */}
        {sections.explore.length > 0 && (
          <>
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
              {t("studentDashboard.sidebar.sections.explore")}
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              {sections.explore.map((item) => (
                <NavItem key={item.key} item={item} compact={showCompact} />
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .student-sidebar {
          background: ${colors.background};
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
          border-right: 1px solid ${colors.border};
          font-family: system-ui, -apple-system, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif;
        }
        .student-sidebar * {
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .student-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .student-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .student-sidebar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        .student-sidebar::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
        @media (max-width: 1024px) {
          .student-sidebar {
            width: 70px !important;
          }
        }
        @media (max-width: 768px) {
          .student-sidebar {
            width: 280px !important;
          }
        }
      `}</style>

      {!isMobile && (
        <aside
          className="student-sidebar"
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
          onClick={onCloseMobileDrawer}
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
            className="student-sidebar"
            style={{
              width: 280,
              height: "100%",
              background: colors.background,
            }}
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

StudentLayout.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onBreakpoint: PropTypes.func.isRequired,
  studentMenuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onSelectMenu: PropTypes.func.isRequired,
  mobileDrawerVisible: PropTypes.bool.isRequired,
  onCloseMobileDrawer: PropTypes.func.isRequired,
  children: PropTypes.node,
};

StudentLayout.defaultProps = {
  children: null,
};

export default StudentLayout;

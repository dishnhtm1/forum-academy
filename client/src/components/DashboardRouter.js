import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Spin } from "antd";

const DashboardRouter = () => {
  const history = useHistory();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) {
      console.log("⚠️ DashboardRouter - Already redirected, skipping");
      return;
    }

    const userRole = localStorage.getItem("userRole");
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    const currentPath = window.location.pathname;

    console.log(
      "🔍 DashboardRouter - Role:",
      userRole,
      "Token:",
      !!token,
      "Path:",
      currentPath
    );

    // If already on a specific dashboard, don't redirect
    if (
      currentPath.includes("/admin/dashboard") ||
      currentPath.includes("/teacher/dashboard") ||
      currentPath.includes("/student/dashboard")
    ) {
      console.log("✅ Already on a dashboard page, skipping redirect");
      hasRedirected.current = true;
      return;
    }

    if (!token || !userRole) {
      console.log("❌ No token or role found, redirecting to login");
      hasRedirected.current = true;
      history.replace("/login");
      return;
    }

    // Mark as redirected before navigation
    hasRedirected.current = true;

    // Route based on user role - use replace instead of push to avoid history buildup
    switch (userRole.toLowerCase()) {
      case "admin":
      case "superadmin":
      case "faculty":
        console.log("👨‍💼 Redirecting to AdminFacultyDashboard");
        history.replace("/admin/dashboard");
        break;
      case "teacher":
        console.log("👨‍🏫 Redirecting to TeacherDashboard");
        history.replace("/teacher/dashboard");
        break;
      case "student":
        console.log("👨‍🎓 Redirecting to StudentDashboard");
        history.replace("/student/dashboard");
        break;
      default:
        console.log("❓ Unknown role, defaulting to student dashboard");
        history.replace("/student/dashboard");
        break;
    }
  }, [history]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Spin size="large" />
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default DashboardRouter;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Timeline,
  Empty,
  Progress,
  Space,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  FileOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Zap, TrendingUp } from "lucide-react";
import {
  courseAPI,
  materialAPI,
  quizAPI,
  homeworkAPI,
  progressAPI,
  announcementAPI,
} from "../../utils/apiClient";

const { Title, Text } = Typography;

// Helper function to format time ago
const getTimeAgo = (timestamp, t) => {
  if (!timestamp) return t("teacherDashboard.overview.justNow");

  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t("teacherDashboard.overview.justNow");
  if (diffMins < 60)
    return `${diffMins} ${t("teacherDashboard.overview.minutesAgo")}`;
  if (diffHours < 24)
    return `${diffHours} ${
      diffHours === 1
        ? t("teacherDashboard.overview.hourAgo")
        : t("teacherDashboard.overview.hoursAgo")
    }`;
  if (diffDays === 1) return t("teacherDashboard.overview.yesterday");
  if (diffDays < 7)
    return `${diffDays} ${t("teacherDashboard.overview.daysAgo")}`;
  return past.toLocaleDateString();
};

const TeacherDashboardOverview = ({ t, setActiveKey, currentUser, isMobile }) => {
  const [dashboardStats, setDashboardStats] = useState({
    myCourses: 0,
    myStudents: 0,
    totalMaterials: 0,
    pendingSubmissions: 0,
    activeQuizzes: 0,
    avgClassPerformance: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [students, setStudents] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await courseAPI.getAll();
        if (coursesRes.success) {
          setCourses(coursesRes.courses || coursesRes || []);
        }

        // Fetch materials
        const materialsRes = await materialAPI.getAll();
        if (materialsRes.success) {
          setMaterials(materialsRes.materials || materialsRes || []);
        }

        // Fetch quizzes
        const quizzesRes = await quizAPI.getAll();
        if (quizzesRes.success) {
          setQuizzes(quizzesRes.quizzes || quizzesRes || []);
        }

        // Fetch homeworks
        const homeworksRes = await homeworkAPI.getAll();
        if (homeworksRes.success) {
          setHomeworks(homeworksRes.homeworks || homeworksRes || []);
        }

        // Fetch progress records
        const progressRes = await progressAPI.getAll();
        if (progressRes.success) {
          setProgressRecords(progressRes.progress || progressRes || []);
        }

        // Fetch announcements
        const announcementsRes = await announcementAPI.getAll();
        if (announcementsRes.success) {
          setAnnouncements(announcementsRes.announcements || announcementsRes || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  useEffect(() => {
    const myCourses = courses.length;

    let totalStudents = 0;
    courses.forEach((course) => {
      if (course.students && Array.isArray(course.students)) {
        totalStudents += course.students.length;
      }
    });
    if (totalStudents === 0 && students.length > 0) {
      totalStudents = students.length;
    }

    const totalMaterials = materials.length;
    const activeQuizzes = quizzes.filter(
      (quiz) => quiz.isActive !== false && quiz.status !== "inactive"
    ).length;

    const pendingSubmissions = homeworks.reduce((total, homework) => {
      if (homework.submissions && Array.isArray(homework.submissions)) {
        const ungraded = homework.submissions.filter(
          (sub) => !sub.grade && !sub.isGraded && sub.status !== "graded"
        ).length;
        return total + ungraded;
      }
      return total + (homework.isActive !== false ? 1 : 0);
    }, 0);

    let avgPerformance = 0;
    if (quizzes.length > 0) {
      const totalSubmissions = quizzes.reduce(
        (total, quiz) => total + (quiz.submissions ? quiz.submissions.length : 0),
        0
      );
      if (totalSubmissions > 0) {
        const totalScore = quizzes.reduce((total, quiz) => {
          if (quiz.submissions && Array.isArray(quiz.submissions)) {
            const quizTotal = quiz.submissions.reduce(
              (qTotal, submission) => qTotal + (submission.score || 0),
              0
            );
            return total + quizTotal;
          }
          return total;
        }, 0);
        avgPerformance = Math.round((totalScore / totalSubmissions) * 100) / 100;
      }
    }

    setDashboardStats({
      myCourses,
      myStudents: totalStudents,
      totalMaterials,
      pendingSubmissions,
      activeQuizzes,
      avgClassPerformance: avgPerformance,
    });
  }, [courses, materials, quizzes, homeworks, students]);

  // Collect recent activities
  useEffect(() => {
    const activities = [];

    progressRecords.forEach((record) => {
      if (record.assignmentType === "quiz") {
        activities.push({
          type: "quiz_submission",
          description: record.courseName || "Quiz",
          studentName: record.studentName || "Student",
          timestamp: record.submittedDate || record.createdAt,
          color: "green",
        });
      }
      if (record.assignmentType === "homework") {
        activities.push({
          type: "homework_submission",
          description: record.courseName || "Homework",
          studentName: record.studentName || "Student",
          timestamp: record.submittedDate || record.createdAt,
          color: "blue",
        });
      }
    });

    materials.forEach((material) => {
      if (material.createdAt) {
        activities.push({
          type: "material_uploaded",
          description: material.courseName || material.courseId || "Course",
          materialTitle: material.title,
          timestamp: material.createdAt,
          color: "blue",
        });
      }
    });

    announcements.forEach((announcement) => {
      if (announcement.createdAt) {
        activities.push({
          type: "announcement",
          description: announcement.courseName || "General",
          title: announcement.title,
          timestamp: announcement.createdAt,
          color: "orange",
        });
      }
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRecentActivities(activities.slice(0, 5));
  }, [progressRecords, materials, announcements]);

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <div
        style={{
          marginBottom: "32px",
          padding: "24px",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Title level={2} style={{ margin: 0, marginBottom: "8px", color: "#1f2937" }}>
          {t("teacherDashboard.overview.title")}
        </Title>
        <Text style={{ fontSize: "16px", color: "#6b7280" }}>
          {t("teacherDashboard.welcomeBack")}, {currentUser?.name} 👋
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="stat-card stat-card-1"
            variant="borderless"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            }}
          >
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <BookOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Total
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.myCourses}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.myClasses")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="stat-card stat-card-2"
            variant="borderless"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
            }}
          >
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <TeamOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Active
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.myStudents}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.totalStudents")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="stat-card stat-card-3"
            variant="borderless"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
            }}
          >
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <FileOutlined style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Library
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.totalMaterials}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.teachingMaterials")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="stat-card stat-card-4"
            variant="borderless"
            style={{
              background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
            }}
          >
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }}
                />
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Pending
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.pendingSubmissions}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.pendingReviews")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="stat-card stat-card-5"
            variant="borderless"
            style={{
              background: "linear-gradient(135deg, #7c2d12 0%, #92400e 100%)",
            }}
          >
            <div style={{ position: "relative", zIndex: 10, color: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <QuestionCircleOutlined
                  style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }}
                />
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Live
                </div>
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }}>
                  {dashboardStats.activeQuizzes}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.activeQuizzes")}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card
            className="glass-card"
            variant="borderless"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClockCircleOutlined style={{ color: "#667eea", fontSize: "20px" }} />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {t("teacherDashboard.overview.recentActivity")}
                </span>
              </div>
            }
            extra={
              <Button
                className="modern-btn"
                size="small"
                type="primary"
                ghost
                onClick={() => setActiveKey("grading")}
                style={{ borderRadius: "8px" }}
              >
                {t("teacherDashboard.overview.viewAll")}
              </Button>
            }
          >
            {recentActivities.length > 0 ? (
              <Timeline
                items={recentActivities.map((activity, index) => {
                  let activityText = "";
                  switch (activity.type) {
                    case "quiz_submission":
                      activityText = t(
                        "teacherDashboard.overview.activities.quizSubmission",
                        {
                          student: activity.studentName,
                          course: activity.description,
                        }
                      );
                      break;
                    case "homework_submission":
                      activityText = t(
                        "teacherDashboard.overview.activities.homeworkSubmission",
                        {
                          student: activity.studentName,
                          course: activity.description,
                        }
                      );
                      break;
                    case "material_uploaded":
                      activityText = t(
                        "teacherDashboard.overview.activities.materialUploaded",
                        {
                          material: activity.materialTitle,
                          course: activity.description,
                        }
                      );
                      break;
                    case "announcement":
                      activityText = t(
                        "teacherDashboard.overview.activities.announcement",
                        {
                          title: activity.title,
                          course: activity.description,
                        }
                      );
                      break;
                    default:
                      activityText = t("teacherDashboard.overview.activities.newActivity");
                  }
                  return {
                    key: index,
                    color: activity.color,
                    children: (
                      <>
                        <Text>{activityText}</Text>
                        <br />
                        <Text type="secondary">{getTimeAgo(activity.timestamp, t)}</Text>
                      </>
                    ),
                  };
                })}
              />
            ) : (
              <Empty
                description={t("teacherDashboard.overview.noRecentActivity")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            className="glass-card"
            variant="borderless"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap style={{ color: "#667eea", fontSize: "20px" }} />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {t("teacherDashboard.overview.quickActions")}
                </span>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Button
                className="modern-btn"
                type="primary"
                icon={<PlusOutlined />}
                block
                size="large"
                onClick={() => setActiveKey("materials")}
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  border: "none",
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {t("teacherDashboard.overview.uploadMaterial")}
              </Button>
              <Button
                className="modern-btn"
                icon={<QuestionCircleOutlined />}
                block
                size="large"
                onClick={() => setActiveKey("quizzes")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#667eea",
                  color: "#667eea",
                }}
              >
                {t("teacherDashboard.overview.createQuiz")}
              </Button>
              <Button
                className="modern-btn"
                icon={<FileTextOutlined />}
                block
                size="large"
                onClick={() => setActiveKey("assignments")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#764ba2",
                  color: "#764ba2",
                }}
              >
                {t("teacherDashboard.overview.assignHomework")}
              </Button>
              <Button
                className="modern-btn"
                icon={<BarChartOutlined />}
                block
                size="large"
                onClick={() => setActiveKey("analytics")}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderColor: "#f093fb",
                  color: "#f093fb",
                }}
              >
                {t("teacherDashboard.overview.viewAnalytics")}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card
            className="glass-card"
            variant="borderless"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp style={{ color: "#667eea", fontSize: "20px" }} />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {t("teacherDashboard.overview.classPerformance")}
                </span>
              </div>
            }
          >
            <div style={{ padding: "16px 0" }}>
              <Progress
                percent={dashboardStats.avgClassPerformance}
                status="active"
                size={12}
                strokeColor={{
                  from: "#667eea",
                  to: "#764ba2",
                }}
                trailColor="rgba(0, 0, 0, 0.06)"
                style={{ marginBottom: "16px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  {t("teacherDashboard.overview.avgPerformance")}
                </Text>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#667eea",
                  }}
                >
                  {dashboardStats.avgClassPerformance}%
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboardOverview;


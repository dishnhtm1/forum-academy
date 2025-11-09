import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  ReloadOutlined,
  TeamOutlined,
  BookOutlined,
  MailOutlined,
  RiseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import {
  courseAPI,
  quizAPI,
  homeworkAPI,
  progressAPI,
  userAPI,
} from "../../utils/apiClient";

const { Title, Text, Paragraph } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

const DATE_WINDOW_DAYS = 14;

const TeacherAnalytics = ({ t: providedT, currentUser, isMobile }) => {
  const { t: i18nT } = useTranslation();
  const t = providedT || i18nT;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingReviews: 0,
    averageScore: 0,
  });
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [overdueAssessments, setOverdueAssessments] = useState([]);
  const [attentionStudents, setAttentionStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [courseSummaries, setCourseSummaries] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [],
  });
  const [userAudit, setUserAudit] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const teacherId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.teacherId;

  const formatDate = useCallback(
    (value) => {
      if (!value) return t("common:unknown", "Unknown");
      try {
        return new Date(value).toLocaleString(i18nT.language, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return value;
      }
    },
    [t, i18nT.language]
  );

  const formatDiffLabel = useCallback(
    (dueDate) => {
      if (!dueDate) return "";
      const diff = dueDate.getTime() - Date.now();
      const days = Math.round(diff / (1000 * 60 * 60 * 24));
      if (days === 0) {
        return t(
          "teacherDashboard.analytics.workload.dueToday",
          "Due today"
        );
      }
      if (days === 1) {
        return t(
          "teacherDashboard.analytics.workload.dueTomorrow",
          "Due tomorrow"
        );
      }
      if (days > 1) {
        return t(
          "teacherDashboard.analytics.workload.dueInDays",
          "Due in {{count}} days",
          { count: days }
        );
      }
      return t(
        "teacherDashboard.analytics.workload.overdueDays",
        "{{count}} days overdue",
        { count: Math.abs(days) }
      );
    },
    [t]
  );

  const parseDueDate = (item) => {
    const raw =
      item.dueDate ||
      item.deadline ||
      item.closeDate ||
      item.availableUntil ||
      item.endTime ||
      item.startTime ||
      item.createdAt;
    if (!raw) return null;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const safeCourseId = (course) =>
    course?._id || course?.id || course?.courseId || course;

  const buildAssessmentEntry = (item, type, courseLookup) => {
    const dueDate = parseDueDate(item);
    if (!dueDate) return null;
    return {
      id: item._id || item.id,
      type,
      title: item.title || item.name || t("common:untitled", "Untitled"),
      dueDate,
      courseId: safeCourseId(item.course || item.courseId),
      courseName:
        courseLookup.get(safeCourseId(item.course || item.courseId))?.title ||
        t("common:unknown", "Unknown"),
      duration: item.duration || item.timeLimit || null,
    };
  };

  const extractStudentName = (record) => {
    if (!record) return { name: t("common:unknown", "Unknown"), email: "" };
    if (typeof record === "string") {
      return { name: record, email: "" };
    }
    const first = record.firstName || record.givenName || "";
    const last = record.lastName || record.familyName || "";
    const combined = `${first} ${last}`.trim();
    return {
      name:
        combined ||
        record.name ||
        record.username ||
        t("common:unknown", "Unknown"),
      email: record.email || "",
    };
  };

  const fetchAnalytics = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const [coursesRes, quizzesRes, homeworksRes, progressRes] =
        await Promise.all([
          courseAPI.getAll(),
          quizAPI.getAll(),
          homeworkAPI.getAll(),
          progressAPI.getAll(),
        ]);

      const allCourses = coursesRes.courses || coursesRes || [];
      const teacherCourses = allCourses.filter((course) => {
        const teacherField =
          course.teacher ||
          course.teacherId ||
          course.instructor ||
          course.owner;
        if (!teacherField) return false;
        if (typeof teacherField === "string") {
          return teacherField === teacherId;
        }
        return (
          teacherField._id === teacherId ||
          teacherField.id === teacherId ||
          teacherField === teacherId
        );
      });

      const courseLookup = new Map(
        teacherCourses.map((course) => [
          safeCourseId(course),
          {
            title: course.title || course.name || t("common:untitled", "Untitled"),
            code: course.code || course.courseCode || "",
            students: Array.isArray(course.students)
              ? course.students.length
              : 0,
          },
        ])
      );

      const quizzes = (quizzesRes.quizzes || quizzesRes || []).filter(
        (quiz) =>
          quiz.teacher === teacherId ||
          quiz.teacherId === teacherId ||
          quiz.owner === teacherId
      );
      const homeworks = (homeworksRes.homeworks || homeworksRes || []).filter(
        (homework) =>
          homework.teacher === teacherId ||
          homework.teacherId === teacherId ||
          homework.owner === teacherId
      );
      const progressRecords = (progressRes.progress || progressRes || []).filter(
        (record) =>
          record.teacher === teacherId ||
          record.teacherId === teacherId ||
          (record.teacher?._id || record.teacher?.id) === teacherId
      );

      const studentSet = new Set();
      teacherCourses.forEach((course) => {
        (course.students || []).forEach((studentId) => studentSet.add(studentId));
      });

      const now = new Date();
      const windowLimit = new Date();
      windowLimit.setDate(windowLimit.getDate() + DATE_WINDOW_DAYS);
      const upcoming = [];
      const overdue = [];

      [...quizzes, ...homeworks].forEach((item) => {
        const entry = buildAssessmentEntry(
          item,
          quizzes.includes(item) ? "quiz" : "homework",
          courseLookup
        );
        if (!entry) return;
        if (entry.dueDate < now) {
          overdue.push(entry);
        } else if (entry.dueDate <= windowLimit) {
          upcoming.push(entry);
        }
      });

      upcoming.sort((a, b) => a.dueDate - b.dueDate);
      overdue.sort((a, b) => b.dueDate - a.dueDate);

      const pendingReviews = progressRecords.filter(
        (record) =>
          !record.grade ||
          record.grade === "N/A" ||
          record.published === false ||
          record.isPublished === false
      );

      const studentMap = new Map();
      progressRecords.forEach((record) => {
        const studentInfo = extractStudentName(record.student || record.studentId);
        const entry = studentMap.get(studentInfo.name) || {
          name: studentInfo.name,
          email: studentInfo.email,
          submissions: 0,
          total: 0,
          lastSubmission: null,
        };
        entry.submissions += 1;
        const pct =
          record.percentage ??
          record.score ??
          record.gradePercentage ??
          0;
        entry.total += pct;
        const submittedAt = new Date(
          record.createdAt || record.submissionDate || record.updatedAt || 0
        );
        if (!entry.lastSubmission || submittedAt > entry.lastSubmission) {
          entry.lastSubmission = submittedAt;
        }
        studentMap.set(studentInfo.name, entry);
      });

      const attention = Array.from(studentMap.values())
        .map((entry) => ({
          name: entry.name,
          email: entry.email,
          submissions: entry.submissions,
          average:
            entry.submissions > 0
              ? Math.round((entry.total / entry.submissions) * 10) / 10
              : 0,
          lastSubmission: entry.lastSubmission,
        }))
        .filter((entry) => entry.average < 70 || entry.submissions <= 1)
        .sort((a, b) => a.average - b.average)
        .slice(0, 6);

      const activity = progressRecords
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt || 0) -
            new Date(a.createdAt || a.updatedAt || 0)
        )
        .slice(0, 10)
        .map((record) => {
          const studentInfo = extractStudentName(record.student || record.studentId);
          return {
            id: record._id || record.id,
            assignment: record.assignment || record.subject || "—",
            student: studentInfo.name,
            course: record.courseTitle || record.course || "—",
            date: record.createdAt || record.updatedAt,
            score:
              record.percentage ??
              record.score ??
              record.grade ??
              "",
          };
        });

      const courseSummaryData = teacherCourses.map((course) => {
        const stats = courseLookup.get(safeCourseId(course)) || {};
        const scoreEntries = progressRecords.filter(
          (record) =>
            safeCourseId(record.course || record.courseId) ===
            safeCourseId(course)
        );
        const avgScore =
          scoreEntries.length > 0
            ? Math.round(
                (scoreEntries.reduce(
                  (sum, record) =>
                    sum +
                    (record.percentage ??
                      record.score ??
                      record.gradePercentage ??
                      0),
                  0
                ) /
                  scoreEntries.length) *
                  10
              ) / 10
            : null;
        return {
          key: safeCourseId(course),
          title: stats.title,
          code: stats.code,
          students: stats.students,
          avgScore,
          pendingReviews: pendingReviews.filter(
            (record) =>
              safeCourseId(record.course || record.courseId) ===
              safeCourseId(course)
          ).length,
        };
      });

      const buckets = [0, 0, 0, 0];
      const counts = [0, 0, 0, 0];
      const nowTime = Date.now();
      progressRecords.forEach((record) => {
        const created = new Date(record.createdAt || record.updatedAt || 0);
        const diffWeeks = Math.floor(
          (nowTime - created.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        if (diffWeeks >= 0 && diffWeeks < 4) {
          const index = 3 - diffWeeks;
          buckets[index] +=
            record.percentage ??
            record.score ??
            record.gradePercentage ??
            0;
          counts[index] += 1;
        }
      });

      setPerformanceData({
        labels: [
          t("teacherDashboard.analytics.performance.week", "Week {{index}}", {
            index: 1,
          }),
          t("teacherDashboard.analytics.performance.week", "Week {{index}}", {
            index: 2,
          }),
          t("teacherDashboard.analytics.performance.week", "Week {{index}}", {
            index: 3,
          }),
          t("teacherDashboard.analytics.performance.week", "Week {{index}}", {
            index: 4,
          }),
        ],
        datasets: [
          {
            label: t(
              "teacherDashboard.analytics.performance.averageScore",
              "Average score"
            ),
            data: buckets.map((total, index) =>
              counts[index] > 0 ? Math.round((total / counts[index]) * 10) / 10 : 0
            ),
            borderColor: "rgba(37, 99, 235, 1)",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            tension: 0.3,
            fill: true,
          },
        ],
      });

      setSummary({
        totalStudents: studentSet.size,
        totalCourses: teacherCourses.length,
        pendingReviews: pendingReviews.length,
        averageScore:
          progressRecords.length > 0
            ? Math.round(
                (progressRecords.reduce(
                  (sum, record) =>
                    sum +
                    (record.percentage ??
                      record.score ??
                      record.gradePercentage ??
                      0),
                  0
                ) /
                  progressRecords.length) *
                  10
              ) / 10
            : 0,
      });

      setUpcomingAssessments(upcoming);
      setOverdueAssessments(overdue);
      setAttentionStudents(attention);
      setRecentActivity(activity);
      setCourseSummaries(courseSummaryData);
    } catch (error) {
      console.error("Teacher analytics fetch error:", error);
      message.error(
        t(
          "teacherDashboard.analytics.errors.fetch",
          "Unable to load analytics data."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [teacherId, t, i18nT.language]);

  const fetchUserAudit = useCallback(async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const response = await userAPI.getAll();
      const users = response.users || response || [];
      const now = Date.now();
      const ninetyDaysMs = 1000 * 60 * 60 * 24 * 90;

      const flagged = users
        .filter((user) => ["teacher", "student"].includes(user.role))
        .map((user) => {
          const reasons = [];

          const lastLoginRaw =
            user.lastLogin ||
            user.lastLoginAt ||
            user.lastActive ||
            user.lastActiveAt ||
            user.updatedAt;
          const lastLogin = lastLoginRaw ? new Date(lastLoginRaw) : null;
          if (!lastLogin || Number.isNaN(lastLogin.getTime())) {
            reasons.push("noRecentLogin");
          } else if (now - lastLogin.getTime() > ninetyDaysMs) {
            reasons.push("inactive");
          }

          if (user.role === "teacher") {
            const profileFilled =
              Boolean((user.firstName || user.lastName || "").trim()) &&
              Boolean(user.department || user.bio || user.phone);
            if (!profileFilled) {
              reasons.push("incompleteProfile");
            }
          }

          if (user.role === "student") {
            const enrollments =
              (Array.isArray(user.enrollments) && user.enrollments.length) ||
              (Array.isArray(user.courses) && user.courses.length);
            if (!enrollments) {
              reasons.push("missingEnrollment");
            }
          }

          if (user.isEmailVerified === false) {
            reasons.push("unverified");
          }

          return {
            key: user._id || user.id,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email ||
              "—",
            email: user.email,
            role: user.role,
            reasons,
          };
        })
        .filter((entry) => entry.reasons.length > 0);

      setUserAudit(flagged);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUserError(
        t(
          "teacherDashboard.analytics.accounts.fetchError",
          "Unable to load account records."
        )
      );
    } finally {
      setUserLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAnalytics();
    fetchUserAudit();
  }, [fetchAnalytics, fetchUserAudit]);

  const heroMetrics = useMemo(
    () => [
      {
        key: "students",
        label: t(
          "teacherDashboard.analytics.hero.activeStudents",
          "Active students"
        ),
        value: summary.totalStudents,
        icon: <TeamOutlined />,
      },
      {
        key: "courses",
        label: t(
          "teacherDashboard.analytics.hero.activeCourses",
          "Active courses"
        ),
        value: summary.totalCourses,
        icon: <BookOutlined />,
      },
      {
        key: "reviews",
        label: t(
          "teacherDashboard.analytics.hero.pendingReviews",
          "Pending reviews"
        ),
        value: summary.pendingReviews,
        icon: <MailOutlined />,
      },
      {
        key: "averageScore",
        label: t(
          "teacherDashboard.analytics.hero.averageScore",
          "Average score"
        ),
        value: `${summary.averageScore}%`,
        icon: <RiseOutlined />,
      },
    ],
    [summary, t]
  );

  const actionableItems = useMemo(() => {
    const soonThreshold = new Date();
    soonThreshold.setDate(soonThreshold.getDate() + 3);
    const dueSoon = upcomingAssessments.filter(
      (item) => item.dueDate <= soonThreshold
    );
    return [
      {
        key: "dueSoon",
        count: dueSoon.length,
        preview: dueSoon.slice(0, 3).map((item) => item.title),
      },
      {
        key: "overdue",
        count: overdueAssessments.length,
        preview: overdueAssessments.slice(0, 3).map((item) => item.title),
      },
      {
        key: "pendingReviews",
        count: summary.pendingReviews,
        preview:
          summary.pendingReviews > 0
            ? [
                t(
                  "teacherDashboard.analytics.actionCenter.previewPending",
                  "{{count}} submissions need grading",
                  { count: summary.pendingReviews }
                ),
              ]
            : [],
      },
    ].filter((item) => item.count > 0);
  }, [upcomingAssessments, overdueAssessments, summary.pendingReviews, t]);

  const communicationQueue = useMemo(() => {
    const topDue = upcomingAssessments.slice(0, 3);
    const topStudents = attentionStudents.slice(0, 3);
    return [
      ...topDue.map((item) => ({
        key: `${item.id}-due`,
        audience: "students",
        title: item.title,
        note: formatDiffLabel(item.dueDate),
      })),
      ...topStudents.map((student) => ({
        key: `${student.name}-student`,
        audience: "teachers",
        title: student.name,
        note: `${t(
          "teacherDashboard.analytics.students.averageScore",
          "Average {{score}}%",
          { score: student.average }
        )}`,
      })),
    ];
  }, [upcomingAssessments, attentionStudents, formatDiffLabel, t]);

  const messagePlaybook = useMemo(() => {
    const nextDeadline = upcomingAssessments[0];
    const lowestStudent = attentionStudents[0];
    return [
      {
        key: "deadlineReminder",
        title: t(
          "teacherDashboard.analytics.templates.items.deadlineReminder.title",
          "Remind students about the next deadline"
        ),
        body: t(
          "teacherDashboard.analytics.templates.items.deadlineReminder.body",
          "Hi everyone,\nA reminder that \"{{assessment}}\" is due {{when}}. Please submit before the deadline and reach out if you need help.",
          {
            assessment: nextDeadline?.title || t("common:upcomingAssessment", "the upcoming assessment"),
            when: nextDeadline ? formatDiffLabel(nextDeadline.dueDate) : t("common:soon", "soon"),
          }
        ),
      },
      {
        key: "studentSupport",
        title: t(
          "teacherDashboard.analytics.templates.items.studentSupport.title",
          "Check in with a student"
        ),
        body: t(
          "teacherDashboard.analytics.templates.items.studentSupport.body",
          "Hi {{student}},\nI noticed your recent submissions. Let's schedule a quick check-in to support your progress.",
          {
            student: lowestStudent?.name || t("common:student", "student"),
          }
        ),
      },
      {
        key: "teacherSync",
        title: t(
          "teacherDashboard.analytics.templates.items.teacherSync.title",
          "Sync with fellow teachers"
        ),
        body: t(
          "teacherDashboard.analytics.templates.items.teacherSync.body",
          "Team,\nHere are the current grading priorities and translation tasks. Let’s align during our next stand-up.",
        ),
      },
    ];
  }, [attentionStudents, formatDiffLabel, t, upcomingAssessments]);

  const accountReasonTag = (reason) => (
    <Tag key={reason} color="gold">
      {t(
        `teacherDashboard.analytics.accounts.flags.${reason}`,
        reason
      )}
    </Tag>
  );

  const handleCopyText = useCallback(
    (value) => {
      navigator.clipboard
        .writeText(value)
        .then(() =>
          message.success(t("common:copied", "Copied to clipboard"))
        )
        .catch(() =>
          message.error(t("common:copyFailed", "Unable to copy text."))
        );
    },
    [t]
  );

  const accountColumns = useMemo(
    () => [
      {
        title: t(
          "teacherDashboard.analytics.accounts.columns.name",
          "User"
        ),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t(
          "teacherDashboard.analytics.accounts.columns.email",
          "Email"
        ),
        dataIndex: "email",
        key: "email",
        render: (value) =>
          value || (
            <Tag color="volcano">
              {t(
                "teacherDashboard.analytics.accounts.flags.placeholderEmail",
                "Placeholder email"
              )}
            </Tag>
          ),
      },
      {
        title: t(
          "teacherDashboard.analytics.accounts.columns.role",
          "Role"
        ),
        dataIndex: "role",
        key: "role",
        render: (role) => <Tag color="blue">{role}</Tag>,
      },
      {
        title: t(
          "teacherDashboard.analytics.accounts.columns.issues",
          "Flags"
        ),
        dataIndex: "reasons",
        key: "reasons",
        render: (reasons) => (
          <Space wrap size={[4, 4]}>
            {reasons.map((reason) => accountReasonTag(reason))}
          </Space>
        ),
      },
    ],
    [t]
  );

  const courseColumns = useMemo(
    () => [
      {
        title: t(
          "teacherDashboard.analytics.courseHealth.columns.course",
          "Course"
        ),
        dataIndex: "title",
        key: "title",
      },
      {
        title: t(
          "teacherDashboard.analytics.courseHealth.columns.code",
          "Code"
        ),
        dataIndex: "code",
        key: "code",
      },
      {
        title: t(
          "teacherDashboard.analytics.courseHealth.columns.students",
          "Students"
        ),
        dataIndex: "students",
        key: "students",
        align: "right",
      },
      {
        title: t(
          "teacherDashboard.analytics.courseHealth.columns.avgScore",
          "Avg score"
        ),
        dataIndex: "avgScore",
        key: "avgScore",
        align: "right",
        render: (value) =>
          value != null ? `${value}%` : t("common:notAvailable", "N/A"),
      },
      {
        title: t(
          "teacherDashboard.analytics.courseHealth.columns.pendingReviews",
          "Pending reviews"
        ),
        dataIndex: "pendingReviews",
        key: "pendingReviews",
        align: "right",
        render: (value) =>
          value > 0 ? <Tag color="volcano">{value}</Tag> : <Tag color="blue">0</Tag>,
      },
    ],
    [t]
  );

  return (
    <Spin spinning={loading}>
      <div style={{ padding: isMobile ? 12 : 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card>
            <Row
              gutter={[16, 16]}
              align="middle"
              justify="space-between"
              wrap
            >
              <Col flex="auto">
                <Space
                  size={16}
                  direction={isMobile ? "vertical" : "horizontal"}
                  style={{ width: "100%" }}
                  align={isMobile ? "start" : "center"}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(37, 99, 235, 0.12)",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <TeamOutlined style={{ fontSize: 24, color: "#2563eb" }} />
                  </div>
                  <div>
                    <Title level={isMobile ? 3 : 2} style={{ marginBottom: 6 }}>
                      {t(
                        "teacherDashboard.analytics.title",
                        "Teacher Performance Analytics"
                      )}
                    </Title>
                    <Text type="secondary">
                      {t(
                        "teacherDashboard.analytics.subtitle",
                        "Track classes, grading, and communication insights in one place."
                      )}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col>
                <Tooltip
                  title={t(
                    "teacherDashboard.analytics.actions.refresh",
                    "Refresh data"
                  )}
                >
                  <Button
                    icon={<ReloadOutlined />}
                    size={isMobile ? "middle" : "large"}
                    onClick={() => {
                      fetchAnalytics();
                      fetchUserAudit();
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {heroMetrics.map((metric) => (
                <Col xs={12} sm={12} md={6} key={metric.key}>
                  <Card
                    style={{
                      border: "1px solid rgba(37, 99, 235, 0.08)",
                      borderRadius: 16,
                    }}
                  >
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">{metric.label}</Text>
                      <Space size={8} align="center">
                        {metric.icon}
                        <Title level={3} style={{ margin: 0 }}>
                          {metric.value}
                        </Title>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Card
                title={t(
                  "teacherDashboard.analytics.workload.title",
                  "Upcoming workload"
                )}
                extra={
                  <Text type="secondary">
                    {t(
                      "teacherDashboard.analytics.workload.subtitle",
                      "Track deadlines and overdue items."
                    )}
                  </Text>
                }
              >
                {upcomingAssessments.length === 0 &&
                overdueAssessments.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.analytics.workload.empty",
                      "No pending deadlines in the next two weeks."
                    )}
                  />
                ) : (
                  <List
                    dataSource={[...overdueAssessments, ...upcomingAssessments]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Tag
                            key="due"
                            color={
                              item.dueDate < new Date() ? "volcano" : "blue"
                            }
                          >
                            {formatDiffLabel(item.dueDate)}
                          </Tag>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Space>
                              <Tag color={item.type === "quiz" ? "purple" : "green"}>
                                {item.type === "quiz"
                                  ? t("teacherDashboard.analytics.workload.quiz", "Quiz")
                                  : t("teacherDashboard.analytics.workload.homework", "Homework")}
                              </Tag>
                              <Text strong>{item.title}</Text>
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={4}>
                              <Text type="secondary">
                                {item.courseName} · {formatDate(item.dueDate)}
                              </Text>
                              {item.duration && (
                                <Tag>
                                  {t(
                                    "teacherDashboard.analytics.workload.duration",
                                    "{{minutes}} min",
                                    { minutes: item.duration }
                                  )}
                                </Tag>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card
                title={t(
                  "teacherDashboard.analytics.students.title",
                  "Students needing support"
                )}
                extra={
                  <Text type="secondary">
                    {t(
                      "teacherDashboard.analytics.students.subtitle",
                      "Focus on learners with low performance or limited submissions."
                    )}
                  </Text>
                }
              >
                {attentionStudents.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t(
                      "teacherDashboard.analytics.students.empty",
                      "No students need immediate follow-up."
                    )}
                  />
                ) : (
                  <List
                    dataSource={attentionStudents}
                    renderItem={(student) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Space>
                              <Text strong>{student.name}</Text>
                              {student.average < 60 && (
                                <Tag color="volcano">
                                  {t(
                                    "teacherDashboard.analytics.students.tags.lowScore",
                                    "Low score"
                                  )}
                                </Tag>
                              )}
                              {student.submissions <= 1 && (
                                <Tag color="orange">
                                  {t(
                                    "teacherDashboard.analytics.students.tags.new",
                                    "Needs engagement"
                                  )}
                                </Tag>
                              )}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={2}>
                              <Text type="secondary">
                                {t(
                                  "teacherDashboard.analytics.students.details",
                                  "Average {{score}}% · {{submissions}} submissions",
                                  {
                                    score: student.average,
                                    submissions: student.submissions,
                                  }
                                )}
                              </Text>
                              {student.email && (
                                <Text type="secondary">{student.email}</Text>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Card
                title={t(
                  "teacherDashboard.analytics.performance.title",
                  "Performance trends"
                )}
              >
                <Line
                  data={performanceData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card
                title={t(
                  "teacherDashboard.analytics.courseHealth.title",
                  "Course health"
                )}
              >
                <Table
                  rowKey="key"
                  size="small"
                  dataSource={courseSummaries}
                  columns={courseColumns}
                  pagination={{
                    pageSize: isMobile ? 5 : 7,
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card
                  title={t(
                    "teacherDashboard.analytics.recent.title",
                    "Recent assessment activity"
                  )}
                >
                  {recentActivity.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t(
                        "teacherDashboard.analytics.recent.empty",
                        "No assessment activity yet."
                      )}
                    />
                  ) : (
                    <List
                      dataSource={recentActivity}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <Space>
                                <Text strong>{item.assignment}</Text>
                                <Tag>{item.course}</Tag>
                              </Space>
                            }
                            description={
                              <Space size={12}>
                                <Text type="secondary">{item.student}</Text>
                                {item.score !== "" && (
                                  <Text type="secondary">
                                    {t(
                                      "teacherDashboard.analytics.recent.score",
                                      "Score: {{score}}",
                                      { score: item.score }
                                    )}
                                  </Text>
                                )}
                                <Text type="secondary">
                                  {formatDate(item.date)}
                                </Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Card>

              </Space>
            </Col>
            <Col xs={24} lg={10}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card
                  title={t(
                    "teacherDashboard.analytics.communication.title",
                    "Communication support"
                  )}
                >
                  {communicationQueue.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t(
                        "teacherDashboard.analytics.communication.empty",
                        "No communication follow-ups detected."
                      )}
                    />
                  ) : (
                    <List
                      dataSource={communicationQueue}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <Space>
                                <Tag color="geekblue">
                                  {t(
                                    `teacherDashboard.analytics.communication.audiences.${item.audience}`,
                                    item.audience
                                  )}
                                </Tag>
                                <Text strong>{item.title}</Text>
                              </Space>
                            }
                            description={
                              <Text type="secondary">{item.note}</Text>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Card>

              </Space>
            </Col>
          </Row>

          <Card
            title={t(
              "teacherDashboard.analytics.accounts.title",
              "Account integrity monitor"
            )}
          >
            {userError && (
              <Alert
                type="error"
                message={userError}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Spin spinning={userLoading}>
              {userAudit.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t(
                    "teacherDashboard.analytics.accounts.empty",
                    "All accounts look good."
                  )}
                />
              ) : (
                <Table
                  rowKey="key"
                  size="small"
                  dataSource={userAudit}
                  pagination={{
                    pageSize: isMobile ? 5 : 8,
                  }}
                  columns={accountColumns}
                />
              )}
            </Spin>
          </Card>
        </Space>
      </div>
    </Spin>
  );
};

export default TeacherAnalytics;


import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Progress,
  Badge,
  Empty,
  Button,
  Select,
  Alert,
  Divider,
  List,
  Timeline,
  Tooltip,
} from "antd";
import {
  TrophyOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FireOutlined,
  RiseOutlined,
  StarOutlined,
  BookOutlined,
  CalendarOutlined,
  FilterOutlined,
  DownloadOutlined,
  BulbOutlined,
  AimOutlined,
  ThunderboltOutlined,
  SmileOutlined,
  RocketOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const StudentProgress = ({ t, progressRecords, dashboardStats }) => {
  const [filterType, setFilterType] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  // Calculate statistics
  const averageGrade =
    progressRecords.length > 0
      ? (
          progressRecords.reduce(
            (sum, record) => sum + (record.percentage || 0),
            0
          ) / progressRecords.length
        ).toFixed(1)
      : 0;

  const getGradeCount = (gradePrefix) => {
    return progressRecords.filter((r) => r.grade?.startsWith(gradePrefix))
      .length;
  };

  const aGrades = getGradeCount("A");
  const bGrades = getGradeCount("B");
  const cGrades = getGradeCount("C");
  const dGrades = getGradeCount("D");
  const fGrades = getGradeCount("F");

  // Get recent performance trend (last 5 assignments)
  const recentRecords = [...progressRecords]
    .sort((a, b) => moment(b.gradedDate) - moment(a.gradedDate))
    .slice(0, 5);

  const recentAverage =
    recentRecords.length > 0
      ? (
          recentRecords.reduce((sum, r) => sum + (r.percentage || 0), 0) /
          recentRecords.length
        ).toFixed(1)
      : 0;

  const trend =
    recentAverage > averageGrade
      ? "improving"
      : recentAverage < averageGrade
      ? "declining"
      : "stable";

  // Get subjects that need improvement (average < 70%)
  const subjectPerformance = {};
  progressRecords.forEach((record) => {
    if (!subjectPerformance[record.subject]) {
      subjectPerformance[record.subject] = { total: 0, count: 0 };
    }
    subjectPerformance[record.subject].total += record.percentage || 0;
    subjectPerformance[record.subject].count += 1;
  });

  const needsImprovement = Object.entries(subjectPerformance)
    .map(([subject, data]) => ({
      subject,
      average: (data.total / data.count).toFixed(1),
    }))
    .filter((item) => item.average < 70)
    .sort((a, b) => a.average - b.average);

  const strengths = Object.entries(subjectPerformance)
    .map(([subject, data]) => ({
      subject,
      average: (data.total / data.count).toFixed(1),
    }))
    .filter((item) => item.average >= 85)
    .sort((a, b) => b.average - a.average);

  // Get unique subjects for filter
  const subjects = [...new Set(progressRecords.map((r) => r.subject))];

  // Filter records
  const filteredRecords = progressRecords.filter((record) => {
    const typeMatch =
      filterType === "all" || record.assignmentType === filterType;
    const subjectMatch =
      filterSubject === "all" || record.subject === filterSubject;
    return typeMatch && subjectMatch;
  });

  // Simplified table columns
  const columns = [
    {
      title: t("studentDashboard.progress.columns.assignment"),
      dataIndex: "assignment",
      key: "assignment",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "14px" }}>
            {text}
          </Text>
          <Space size={4}>
            <Tag
              color="blue"
              style={{
                borderRadius: "4px",
                fontSize: "11px",
                padding: "0 6px",
              }}
            >
              {record.subject}
            </Tag>
            <Tag
              color={
                record.assignmentType === "homework"
                  ? "orange"
                  : record.assignmentType === "quiz"
                  ? "blue"
                  : record.assignmentType === "exam"
                  ? "red"
                  : "purple"
              }
              style={{
                borderRadius: "4px",
                fontSize: "11px",
                padding: "0 6px",
              }}
            >
              {record.assignmentType === "homework"
                ? t("studentDashboard.progress.types.homework")
                : record.assignmentType === "quiz"
                ? t("studentDashboard.progress.types.quiz")
                : record.assignmentType === "exam"
                ? t("studentDashboard.progress.types.exam")
                : record.assignmentType === "project"
                ? t("studentDashboard.progress.types.project")
                : t("studentDashboard.progress.types.other")}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: t("studentDashboard.progress.columns.score"),
      dataIndex: "score",
      key: "score",
      width: 200,
      render: (score, record) => (
        <Space direction="vertical" size={2} style={{ width: "100%" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text strong style={{ fontSize: "15px" }}>
              {score}/{record.maxPoints ?? record.maxScore}
            </Text>
            <Tag
              color={
                record.percentage >= 80
                  ? "success"
                  : record.percentage >= 60
                  ? "warning"
                  : "error"
              }
              style={{ fontWeight: "bold" }}
            >
              {record.percentage}%
            </Tag>
          </Space>
          <Progress
            percent={record.percentage}
            size="small"
            showInfo={false}
            strokeColor={{
              "0%":
                record.percentage >= 80
                  ? "#52c41a"
                  : record.percentage >= 60
                  ? "#faad14"
                  : "#ff4d4f",
              "100%":
                record.percentage >= 80
                  ? "#73d13d"
                  : record.percentage >= 60
                  ? "#ffc53d"
                  : "#ff7875",
            }}
          />
        </Space>
      ),
    },
    {
      title: t("studentDashboard.progress.columns.grade"),
      dataIndex: "grade",
      key: "grade",
      width: 100,
      align: "center",
      render: (grade) => {
        const getColor = (g) => {
          if (["A+", "A", "A-"].includes(g)) return "success";
          if (["B+", "B", "B-"].includes(g)) return "processing";
          if (["C+", "C", "C-"].includes(g)) return "warning";
          return "error";
        };
        const getIcon = (g) => {
          if (["A+", "A", "A-"].includes(g)) return <StarOutlined />;
          return null;
        };
        return (
          <Tag
            color={getColor(grade)}
            icon={getIcon(grade)}
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              padding: "6px 16px",
            }}
          >
            {grade}
          </Tag>
        );
      },
    },
    {
      title: t("studentDashboard.progress.columns.dateGraded"),
      dataIndex: "gradedDate",
      key: "gradedDate",
      width: 150,
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#8c8c8c" }} />
          <Text style={{ fontSize: "13px" }}>
            {date ? moment(date).format("MMM DD, YYYY") : "—"}
          </Text>
        </Space>
      ),
    },
  ];

  // Real, actionable study recommendations based on actual performance data
  const getStudyRecommendations = () => {
    const recommendations = [];

    // Performance-based recommendations
    if (averageGrade < 60) {
      recommendations.push({
        icon: <BulbOutlined style={{ color: "#ff4d4f" }} />,
        title: t(
          "studentDashboard.progress.recommendations.immediateActionRequired"
        ),
        description: t(
          "studentDashboard.progress.recommendations.immediateActionDescription"
        ),
        action: t("studentDashboard.progress.recommendations.contactTeacher"),
        type: "error",
        priority: "high",
      });
    } else if (averageGrade < 75) {
      recommendations.push({
        icon: <AimOutlined style={{ color: "#faad14" }} />,
        title: t(
          "studentDashboard.progress.recommendations.strengthenFoundation"
        ),
        description: t(
          "studentDashboard.progress.recommendations.strengthenFoundationDescription"
        ),
        action: t("studentDashboard.progress.recommendations.reviewWeakTopics"),
        type: "warning",
        priority: "medium",
      });
    } else if (averageGrade >= 85) {
      recommendations.push({
        icon: <StarOutlined style={{ color: "#52c41a" }} />,
        title: t(
          "studentDashboard.progress.recommendations.excellenceAchieved"
        ),
        description: t(
          "studentDashboard.progress.recommendations.excellenceAchievedDescription"
        ),
        action: t(
          "studentDashboard.progress.recommendations.exploreAdvancedTopics"
        ),
        type: "success",
        priority: "low",
      });
    }

    // Trend-based actionable advice
    if (trend === "improving") {
      recommendations.push({
        icon: <RiseOutlined style={{ color: "#52c41a" }} />,
        title: t("studentDashboard.progress.recommendations.momentumBuilding"),
        description: t(
          "studentDashboard.progress.recommendations.momentumBuildingDescription"
        ),
        action: t(
          "studentDashboard.progress.recommendations.keepCurrentRoutine"
        ),
        type: "success",
        priority: "low",
      });
    } else if (trend === "declining") {
      recommendations.push({
        icon: <LineChartOutlined style={{ color: "#ff4d4f" }} />,
        title: t("studentDashboard.progress.recommendations.performanceAlert"),
        description: t(
          "studentDashboard.progress.recommendations.performanceAlertDescription"
        ),
        action: t(
          "studentDashboard.progress.recommendations.identifyProblemAreas"
        ),
        type: "error",
        priority: "high",
      });
    }

    // Study habit recommendations
    if (dashboardStats.studyStreak < 3) {
      recommendations.push({
        icon: <FireOutlined style={{ color: "#faad14" }} />,
        title: t("studentDashboard.progress.recommendations.buildDailyRoutine"),
        description: t(
          "studentDashboard.progress.recommendations.buildDailyRoutineDescription"
        ),
        action: t("studentDashboard.progress.recommendations.setStudySchedule"),
        type: "warning",
        priority: "high",
      });
    } else if (dashboardStats.studyStreak >= 7) {
      recommendations.push({
        icon: <ThunderboltOutlined style={{ color: "#722ed1" }} />,
        title: `${dashboardStats.studyStreak} ${t(
          "studentDashboard.progress.recommendations.dayStreak"
        )}`,
        description: t(
          "studentDashboard.progress.recommendations.streakDescription"
        ),
        action: t("studentDashboard.progress.recommendations.maintainMomentum"),
        type: "success",
        priority: "low",
      });
    }

    // Subject-specific recommendations based on weak areas
    if (needsImprovement.length > 0) {
      needsImprovement.slice(0, 2).forEach((subject) => {
        recommendations.push({
          icon: <BookOutlined style={{ color: "#ff4d4f" }} />,
          title: t("studentDashboard.progress.recommendations.focusOn", {
            subject: subject.subject,
          }),
          description: t(
            "studentDashboard.progress.recommendations.focusOnDescription",
            { average: subject.average }
          ),
          action: t("studentDashboard.progress.recommendations.study", {
            subject: subject.subject,
          }),
          type: "error",
          priority: "high",
          subject: subject.subject,
        });
      });
    }

    // Time management for recent performance
    if (recentRecords.length >= 3) {
      const recentLowScores = recentRecords.filter(
        (r) => r.percentage < 70
      ).length;
      if (recentLowScores >= 2) {
        recommendations.push({
          icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
          title: "Time Management Check",
          description:
            "Multiple recent low scores suggest rushed work. Start assignments 3 days before deadline.",
          action: "Plan Ahead",
          type: "warning",
          priority: "high",
        });
      }
    }

    // Exam preparation if upcoming patterns detected
    const examScores = progressRecords.filter(
      (r) => r.assignmentType === "exam"
    );
    if (examScores.length > 0) {
      const examAverage = (
        examScores.reduce((sum, r) => sum + (r.percentage || 0), 0) /
        examScores.length
      ).toFixed(1);
      if (examAverage < 75) {
        recommendations.push({
          icon: <FlagOutlined style={{ color: "#ff4d4f" }} />,
          title: "Improve Exam Performance",
          description: `Your exam average (${examAverage}%) is lower than overall. Practice with past papers and time yourself.`,
          action: "Practice Tests",
          type: "error",
          priority: "high",
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const recommendations = getStudyRecommendations();

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header Section with Gradient */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "16px",
          marginBottom: "24px",
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
        }}
      >
        <div style={{ padding: "12px 0" }}>
          <Space size="large" align="center">
            <div
              style={{
                width: "72px",
                height: "72px",
                background: "rgba(255, 255, 255, 0.25)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <TrophyOutlined style={{ fontSize: "36px", color: "#fff" }} />
            </div>
            <div>
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                {t("studentDashboard.progress.title")}
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: "4px 0 0 0",
                  fontSize: "15px",
                }}
              >
                {t("studentDashboard.progress.subtitle")}
              </Paragraph>
            </div>
          </Space>
        </div>
      </Card>

      {/* Performance Alert */}
      {trend === "improving" && (
        <Alert
          message="Great Progress! 📈"
          description="Your recent performance shows improvement. Keep up the excellent work!"
          type="success"
          showIcon
          icon={<RiseOutlined />}
          style={{ marginBottom: "24px", borderRadius: "12px" }}
          closable
        />
      )}
      {trend === "declining" && (
        <Alert
          message="Performance Alert"
          description="Your recent scores are lower than usual. Don't worry - review the study tips below to get back on track!"
          type="warning"
          showIcon
          icon={<LineChartOutlined />}
          style={{ marginBottom: "24px", borderRadius: "12px" }}
          closable
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  fontSize: "120px",
                  opacity: 0.1,
                  color: "#fff",
                }}
              >
                <CheckCircleOutlined />
              </div>
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "14px",
                    }}
                  >
                    {t("studentDashboard.progress.statistics.totalGraded")}
                  </span>
                }
                value={progressRecords.length}
                prefix={<CheckCircleOutlined style={{ color: "#fff" }} />}
                valueStyle={{
                  color: "#fff",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              border: "none",
              background:
                averageGrade >= 80
                  ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                  : averageGrade >= 60
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              boxShadow: "0 4px 12px rgba(17, 153, 142, 0.2)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  fontSize: "120px",
                  opacity: 0.1,
                  color: "#fff",
                }}
              >
                <BarChartOutlined />
              </div>
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "14px",
                    }}
                  >
                    {t("studentDashboard.progress.statistics.averageScore")}
                  </span>
                }
                value={averageGrade}
                suffix="%"
                prefix={<BarChartOutlined style={{ color: "#fff" }} />}
                valueStyle={{
                  color: "#fff",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <Progress
                percent={parseFloat(averageGrade)}
                showInfo={false}
                strokeColor="#fff"
                trailColor="rgba(255, 255, 255, 0.3)"
                style={{ marginTop: "8px" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              boxShadow: "0 4px 12px rgba(240, 147, 251, 0.2)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  fontSize: "120px",
                  opacity: 0.1,
                  color: "#fff",
                }}
              >
                <FireOutlined />
              </div>
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "14px",
                    }}
                  >
                    {t("studentDashboard.progress.statistics.studyStreak")}
                  </span>
                }
                value={dashboardStats.studyStreak || 0}
                suffix={t("studentDashboard.progress.statistics.days")}
                prefix={<FireOutlined style={{ color: "#fff" }} />}
                valueStyle={{
                  color: "#fff",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              boxShadow: "0 4px 12px rgba(255, 236, 210, 0.3)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  fontSize: "120px",
                  opacity: 0.1,
                  color: "#ff6b6b",
                }}
              >
                <StarOutlined />
              </div>
              <Statistic
                title={
                  <span
                    style={{
                      color: "#ff6b6b",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    A Grades
                  </span>
                }
                value={aGrades}
                prefix={<StarOutlined style={{ color: "#ff6b6b" }} />}
                valueStyle={{
                  color: "#ff6b6b",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <Text style={{ color: "#ff8787", fontSize: "12px" }}>
                {progressRecords.length > 0
                  ? `${((aGrades / progressRecords.length) * 100).toFixed(0)}%`
                  : "0%"}{" "}
                of total
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        {/* Study Recommendations */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            title={
              <Space>
                <BulbOutlined style={{ fontSize: "20px", color: "#faad14" }} />
                <Text strong style={{ fontSize: "16px" }}>
                  {t("studentDashboard.progress.studyRecommendations")}
                </Text>
              </Space>
            }
          >
            <List
              dataSource={recommendations}
              renderItem={(item) => (
                <List.Item style={{ border: "none", padding: "12px 0" }}>
                  <Alert
                    message={
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Space>
                          {item.icon}
                          <Text strong>{item.title}</Text>
                        </Space>
                        {item.priority === "high" && (
                          <Tag color="red" style={{ margin: 0 }}>
                            {t("studentDashboard.progress.highPriority")}
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        <Text>{item.description}</Text>
                        {item.action && (
                          <Button
                            type="primary"
                            size="small"
                            style={{
                              background:
                                item.type === "error"
                                  ? "#ff4d4f"
                                  : item.type === "warning"
                                  ? "#faad14"
                                  : "#52c41a",
                              border: "none",
                            }}
                          >
                            {item.action}
                          </Button>
                        )}
                      </Space>
                    }
                    type={item.type}
                    showIcon={false}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </List.Item>
              )}
            />

            <Divider />

            <Title level={5}>
              <RocketOutlined />{" "}
              {t("studentDashboard.progress.evidenceBasedStudyTechniques")}
            </Title>
            <Timeline>
              <Timeline.Item
                dot={<BookOutlined style={{ fontSize: "16px" }} />}
                color="blue"
              >
                <Space direction="vertical" size={0}>
                  <Text strong>
                    {t("studentDashboard.progress.spacedRepetition")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("studentDashboard.progress.spacedRepetitionDesc")}
                  </Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item
                dot={<AimOutlined style={{ fontSize: "16px" }} />}
                color="green"
              >
                <Space direction="vertical" size={0}>
                  <Text strong>
                    {t("studentDashboard.progress.activeRecall")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("studentDashboard.progress.activeRecallDesc")}
                  </Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item
                dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
                color="purple"
              >
                <Space direction="vertical" size={0}>
                  <Text strong>
                    {t("studentDashboard.progress.pomodoroTechnique")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("studentDashboard.progress.pomodoroTechniqueDesc")}
                  </Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item
                dot={<SmileOutlined style={{ fontSize: "16px" }} />}
                color="orange"
              >
                <Space direction="vertical" size={0}>
                  <Text strong>
                    {t("studentDashboard.progress.teachSomeoneElse")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {t("studentDashboard.progress.teachSomeoneElseDesc")}
                  </Text>
                </Space>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        {/* Performance Insights */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            title={
              <Space>
                <BarChartOutlined
                  style={{ fontSize: "20px", color: "#667eea" }}
                />
                <Text strong style={{ fontSize: "16px" }}>
                  {t("studentDashboard.progress.detailedAnalysis")}
                </Text>
              </Space>
            }
          >
            {/* Assignment Type Performance */}
            <Title level={5} style={{ marginTop: 0 }}>
              <CheckCircleOutlined style={{ color: "#1890ff" }} />{" "}
              {t("studentDashboard.progress.performanceByType")}
            </Title>
            {["homework", "quiz", "exam", "project"].map((type) => {
              const typeRecords = progressRecords.filter(
                (r) => r.assignmentType === type
              );
              if (typeRecords.length === 0) return null;

              const typeAverage = (
                typeRecords.reduce((sum, r) => sum + (r.percentage || 0), 0) /
                typeRecords.length
              ).toFixed(1);
              const typeName = t(`studentDashboard.progress.types.${type}`);

              return (
                <div key={type} style={{ marginBottom: "16px" }}>
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <Text>
                      {typeName} ({typeRecords.length})
                    </Text>
                    <Text
                      strong
                      style={{
                        color:
                          typeAverage >= 80
                            ? "#52c41a"
                            : typeAverage >= 60
                            ? "#faad14"
                            : "#ff4d4f",
                      }}
                    >
                      {typeAverage}%
                    </Text>
                  </Space>
                  <Progress
                    percent={parseFloat(typeAverage)}
                    strokeColor={
                      typeAverage >= 80
                        ? "#52c41a"
                        : typeAverage >= 60
                        ? "#faad14"
                        : "#ff4d4f"
                    }
                    showInfo={false}
                  />
                </div>
              );
            })}

            <Divider />

            {/* Strengths */}
            {strengths.length > 0 && (
              <>
                <Title level={5} style={{ color: "#52c41a" }}>
                  <StarOutlined />{" "}
                  {t("studentDashboard.progress.yourStrengths")}
                </Title>
                <List
                  size="small"
                  dataSource={strengths.slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Tag
                          color="success"
                          style={{ borderRadius: "6px", padding: "4px 12px" }}
                        >
                          {item.subject}
                        </Tag>
                        <Text strong style={{ color: "#52c41a" }}>
                          {item.average}%
                        </Text>
                      </Space>
                    </List.Item>
                  )}
                  style={{ marginBottom: "16px" }}
                />
              </>
            )}

            {/* Needs Improvement */}
            {needsImprovement.length > 0 && (
              <>
                <Title level={5} style={{ color: "#ff4d4f" }}>
                  <FlagOutlined /> {t("studentDashboard.progress.focusAreas")}
                </Title>
                <List
                  size="small"
                  dataSource={needsImprovement.slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Tag
                          color="error"
                          style={{ borderRadius: "6px", padding: "4px 12px" }}
                        >
                          {item.subject}
                        </Tag>
                        <Space>
                          <Text strong style={{ color: "#ff4d4f" }}>
                            {item.average}%
                          </Text>
                          <Tooltip
                            title={t(
                              "studentDashboard.progress.scheduleExtraStudyTime"
                            )}
                          >
                            <Button
                              type="link"
                              size="small"
                              icon={<BulbOutlined />}
                              style={{ color: "#faad14" }}
                            >
                              {t("studentDashboard.progress.tips")}
                            </Button>
                          </Tooltip>
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}

            {strengths.length === 0 && needsImprovement.length === 0 && (
              <Empty
                description={t(
                  "studentDashboard.progress.completeMoreAssignments"
                )}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}

            <Divider />

            <Alert
              message={t("studentDashboard.progress.recentPerformance")}
              description={
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text>
                    {t("studentDashboard.progress.lastFiveAssignmentsAverage")}:{" "}
                    <Text strong>{recentAverage}%</Text>
                  </Text>
                  <Text>
                    {t("studentDashboard.progress.overallAverage")}:{" "}
                    <Text strong>{averageGrade}%</Text>
                  </Text>
                  <Progress
                    percent={parseFloat(recentAverage)}
                    strokeColor={
                      recentAverage >= 80
                        ? "#52c41a"
                        : recentAverage >= 60
                        ? "#faad14"
                        : "#ff4d4f"
                    }
                  />
                </Space>
              }
              type="info"
              style={{ borderRadius: "8px" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Simplified Grade History Table */}
      <Card
        style={{
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
        title={
          <Space>
            <BookOutlined style={{ fontSize: "20px", color: "#667eea" }} />
            <Text strong style={{ fontSize: "16px" }}>
              {t("studentDashboard.progress.gradeHistory")}
            </Text>
          </Space>
        }
        extra={
          <Space>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 120 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All Types</Option>
              <Option value="homework">
                {t("studentDashboard.progress.types.homework")}
              </Option>
              <Option value="quiz">
                {t("studentDashboard.progress.types.quiz")}
              </Option>
              <Option value="exam">
                {t("studentDashboard.progress.types.exam")}
              </Option>
              <Option value="project">
                {t("studentDashboard.progress.types.project")}
              </Option>
            </Select>
            <Select
              value={filterSubject}
              onChange={setFilterSubject}
              style={{ width: 140 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All Subjects</Option>
              {subjects.map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredRecords.sort(
            (a, b) => moment(b.gradedDate) - moment(a.gradedDate)
          )}
          rowKey={(record) => record._id || record.id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) =>
              t("studentDashboard.progress.totalRecords", { total }),
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t(
                  "studentDashboard.progress.noGrades",
                  "No grades recorded yet"
                )}
              >
                <Text type="secondary">
                  {t(
                    "studentDashboard.progress.completeAssignmentsToSeeGrades"
                  )}
                </Text>
              </Empty>
            ),
          }}
          style={{
            borderRadius: "8px",
          }}
        />
      </Card>

      <style jsx="true">{`
        .ant-table-thead > tr > th {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          ) !important;
          color: white !important;
          font-weight: 600 !important;
          border: none !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: #f0f5ff !important;
        }
      `}</style>
    </div>
  );
};

export default StudentProgress;

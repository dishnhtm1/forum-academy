import React, { useMemo } from "react";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Statistic,
  Space,
  List,
  Empty,
  Timeline,
  Button,
  Tag,
  Typography,
  Divider,
  Tooltip,
} from "antd";
import {
  RocketOutlined,
  SoundOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text: AntText } = Typography;

const StudentDashboardOverview = ({
  t,
  currentUser,
  listeningExercises,
  quizzes,
  homework,
  progressRecords,
  setActiveTab,
}) => {
  const upcomingDeadlines = useMemo(
    () =>
      [
        ...homework.map((hw) => ({
          type: "homework",
          title: hw.title,
          dueDate: hw.dueDate,
          course: hw.course?.name,
        })),
        ...quizzes.map((quiz) => ({
          type: "quiz",
          title: quiz.title,
          dueDate: quiz.availableUntil || quiz.assignment?.dueDate,
          course:
            quiz.course?.name || quiz.assignment?.courseDetails?.[0]?.title,
        })),
      ]
        .filter((item) => item.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    [homework, quizzes]
  );

  const listeningTotalQuestions = useMemo(
    () =>
      listeningExercises.reduce(
        (sum, exercise) => sum + (exercise.questions?.length || 0),
        0
      ),
    [listeningExercises]
  );

  const recentProgress = useMemo(
    () => progressRecords.slice(0, 4),
    [progressRecords]
  );

  const quickActions = [
    {
      key: "listening",
      icon: <SoundOutlined />,
      label: t("studentDashboard.overview.quickActions.startListening"),
    },
    {
      key: "quizzes",
      icon: <QuestionCircleOutlined />,
      label: t("studentDashboard.overview.quickActions.takeQuiz"),
    },
    {
      key: "homework",
      icon: <FormOutlined />,
      label: t("studentDashboard.overview.quickActions.submitHomework"),
    },
    {
      key: "progress",
      icon: <TrophyOutlined />,
      label: t("studentDashboard.overview.quickActions.viewProgress"),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Card
        style={{
          border: "none",
          borderRadius: 12,
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.12) 100%)",
          padding: 0,
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Space direction="vertical" size={8}>
              <Title level={3} style={{ margin: 0, color: "#111827" }}>
                <RocketOutlined style={{ marginRight: 12, color: "#6366f1" }} />
                {t("studentDashboard.title")}
              </Title>
              <AntText style={{ fontSize: 15, color: "#475569" }}>
                {t("studentDashboard.welcomeBack")}{" "}
                <AntText strong style={{ color: "#1f2937" }}>
                  {currentUser?.name}
                </AntText>
                {" • "}
                {t("studentDashboard.continueJourney")}
              </AntText>
              <Space wrap size={[8, 8]}>
                {quickActions.map((action) => (
                  <Button
                    key={action.key}
                    type={action.key === "listening" ? "primary" : "default"}
                    icon={action.icon}
                    onClick={() => setActiveTab(action.key)}
                    style={{
                      borderRadius: 8,
                      minWidth: 140,
                      height: 32,
                      fontSize: 13,
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Card
              bordered={false}
              style={{
                borderRadius: 10,
                height: "100%",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 4px 12px rgba(99,102,241,0.1)",
              }}
              bodyStyle={{ padding: 12 }}
            >
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <AntText style={{ fontSize: 12, color: "#64748b" }}>
                  {t("studentDashboard.overview.quickActions.title")}
                </AntText>
                <Space wrap size={[8, 8]}>
                  <Tooltip
                    title={t(
                      "studentDashboard.overview.statistics.listeningExercises"
                    )}
                  >
                    <Statistic
                      value={listeningExercises.length}
                      valueStyle={{ fontSize: 20 }}
                      prefix={<SoundOutlined style={{ color: "#6366f1" }} />}
                    />
                  </Tooltip>
                  <Tooltip
                    title={t(
                      "studentDashboard.overview.statistics.availableQuizzes"
                    )}
                  >
                    <Statistic
                      value={quizzes.length}
                      valueStyle={{ fontSize: 20 }}
                      prefix={
                        <QuestionCircleOutlined style={{ color: "#0ea5e9" }} />
                      }
                    />
                  </Tooltip>
                  <Tooltip
                    title={t(
                      "studentDashboard.overview.statistics.pendingHomework"
                    )}
                  >
                    <Statistic
                      value={homework.length}
                      valueStyle={{ fontSize: 20 }}
                      prefix={<FormOutlined style={{ color: "#f97316" }} />}
                    />
                  </Tooltip>
                  <Tooltip
                    title={t("studentDashboard.overview.statistics.myGrades")}
                  >
                    <Statistic
                      value={progressRecords.length}
                      valueStyle={{ fontSize: 20 }}
                      prefix={<TrophyOutlined style={{ color: "#facc15" }} />}
                    />
                  </Tooltip>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={t(
              "studentDashboard.overview.quickAccess.listeningExercises"
            )}
            extra={
              listeningExercises.length > 0 && (
                <Button type="link" onClick={() => setActiveTab("listening")}>
                  {t("studentDashboard.overview.quickAccess.viewAll")}
                </Button>
              )
            }
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            {listeningExercises.length ? (
              <List
                itemLayout="horizontal"
                dataSource={listeningExercises.slice(0, 4)}
                size="small"
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="preview"
                        type="text"
                        size="small"
                        icon={<SoundOutlined />}
                        onClick={() => setActiveTab("listening")}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <AntText strong style={{ fontSize: 14 }}>
                          {item.title}
                        </AntText>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            {item.course?.title || item.course?.name}
                          </AntText>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> {item.timeLimit || "N/A"}{" "}
                            min • {item.questions?.length || 0}{" "}
                            {t("studentDashboard.listening.columns.questions")}
                          </AntText>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={t("studentDashboard.overview.noExercises")} />
            )}
            <Divider style={{ margin: "12px 0" }} />
            <Space size="large" wrap>
              <Statistic
                title={t("studentDashboard.listening.columns.questions")}
                value={listeningTotalQuestions}
                valueStyle={{ fontSize: 18 }}
                prefix={<RiseOutlined style={{ color: "#6366f1" }} />}
              />
              <Statistic
                title={t(
                  "studentDashboard.overview.statistics.listeningExercises"
                )}
                value={listeningExercises.length}
                valueStyle={{ fontSize: 18 }}
                prefix={<CheckCircleOutlined style={{ color: "#22c55e" }} />}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={t("studentDashboard.overview.upcomingDeadlines")}
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            {upcomingDeadlines.length ? (
              <Timeline
                items={upcomingDeadlines.map((item, index) => ({
                  key: index,
                  color:
                    moment(item.dueDate).diff(moment(), "days") <= 3
                      ? "#ef4444"
                      : "#6366f1",
                  children: (
                    <Space direction="vertical" size={2}>
                      <AntText strong style={{ fontSize: 13 }}>
                        {item.title}
                      </AntText>
                      <AntText type="secondary" style={{ fontSize: 12 }}>
                        {item.course ||
                          t("studentDashboard.quizzes.courseUnknown", "Course")}
                      </AntText>
                      <Space size={6}>
                        <Tag
                          color={item.type === "homework" ? "orange" : "blue"}
                          style={{ fontSize: 11, margin: 0 }}
                        >
                          {item.type.toUpperCase()}
                        </Tag>
                        <AntText type="secondary" style={{ fontSize: 12 }}>
                          <CalendarOutlined />{" "}
                          {moment(item.dueDate).format("MMM DD, YYYY")}
                        </AntText>
                      </Space>
                    </Space>
                  ),
                }))}
              />
            ) : (
              <Empty description={t("studentDashboard.overview.noDeadlines")} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={t("studentDashboard.overview.quickAccess.recentQuizzes")}
            extra={
              quizzes.length > 0 && (
                <Button type="link" onClick={() => setActiveTab("quizzes")}>
                  {t("studentDashboard.overview.quickAccess.viewAll")}
                </Button>
              )
            }
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            {quizzes.length ? (
              <List
                dataSource={quizzes.slice(0, 4)}
                size="small"
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <AntText strong style={{ fontSize: 14 }}>
                          {item.title}
                        </AntText>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            {item.course?.name || item.course?.title}
                          </AntText>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            <FieldTimeOutlined />{" "}
                            {item.timeLimit || item.duration || 0}{" "}
                            {t("studentDashboard.quizzes.minutes")} •{" "}
                            {item.questions?.length || 0}{" "}
                            {t("studentDashboard.quizzes.columns.questions")}
                          </AntText>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={t("studentDashboard.overview.noQuizzes")} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={t("studentDashboard.overview.quickAccess.homework")}
            extra={
              homework.length > 0 && (
                <Button type="link" onClick={() => setActiveTab("homework")}>
                  {t("studentDashboard.overview.quickAccess.viewAll")}
                </Button>
              )
            }
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            {homework.length ? (
              <List
                dataSource={homework.slice(0, 4)}
                size="small"
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <AntText strong style={{ fontSize: 14 }}>
                          {item.title}
                        </AntText>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            {item.course?.name}
                          </AntText>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            <CalendarOutlined />{" "}
                            {moment(item.dueDate).format("MMM DD, YYYY")}
                          </AntText>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={t("studentDashboard.overview.noHomework")} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={t("studentDashboard.overview.quickActions.title")}
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              <Button
                type="primary"
                size="middle"
                icon={<SoundOutlined />}
                block
                onClick={() => setActiveTab("listening")}
              >
                {t("studentDashboard.overview.quickActions.startListening")}
              </Button>
              <Button
                size="middle"
                icon={<QuestionCircleOutlined />}
                block
                onClick={() => setActiveTab("quizzes")}
              >
                {t("studentDashboard.overview.quickActions.takeQuiz")}
              </Button>
              <Button
                size="middle"
                icon={<FormOutlined />}
                block
                onClick={() => setActiveTab("homework")}
              >
                {t("studentDashboard.overview.quickActions.submitHomework")}
              </Button>
              <Button
                size="middle"
                icon={<TrophyOutlined />}
                block
                onClick={() => setActiveTab("progress")}
              >
                {t("studentDashboard.overview.quickActions.viewProgress")}
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={t("studentDashboard.overview.statistics.myGrades")}
            extra={
              <Button type="link" onClick={() => setActiveTab("progress")}>
                {t("studentDashboard.overview.quickAccess.viewAll", "View all")}
              </Button>
            }
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
          >
            {recentProgress.length ? (
              <List
                dataSource={recentProgress}
                size="small"
                renderItem={(record) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <AntText strong style={{ fontSize: 14 }}>{`${
                          record.subject || record.course || ""
                        } • ${record.assignment || ""}`}</AntText>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <AntText type="secondary" style={{ fontSize: 12 }}>
                            <CheckCircleOutlined style={{ color: "#22c55e" }} />{" "}
                            {record.grade || record.percentage || ""}%
                          </AntText>
                          {record.gradedDate && (
                            <AntText type="secondary" style={{ fontSize: 12 }}>
                              <ClockCircleOutlined />{" "}
                              {moment(record.gradedDate).format("MMM DD, YYYY")}
                            </AntText>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={t(
                  "studentDashboard.progress.noGrades",
                  "No grades recorded yet"
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 12, background: "#fff5eb", marginTop: 0 }}
        bodyStyle={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: 16,
        }}
      >
        <Space direction="vertical" size={4}>
          <Space size={8}>
            <FireOutlined style={{ color: "#ef4444", fontSize: 18 }} />
            <AntText strong style={{ fontSize: 14 }}>
              {t(
                "studentDashboard.overview.focusBanner",
                "Keep your study streak alive!"
              )}
            </AntText>
          </Space>
          <AntText type="secondary" style={{ fontSize: 13 }}>
            {t(
              "studentDashboard.overview.focusBannerDetail",
              "Complete a listening exercise and one homework today to maintain momentum."
            )}
          </AntText>
        </Space>
        <Button
          type="primary"
          icon={<SoundOutlined />}
          onClick={() => setActiveTab("listening")}
          style={{ alignSelf: "center" }}
          size="middle"
        >
          {t("studentDashboard.overview.quickActions.startListening")}
        </Button>
      </Card>
    </div>
  );
};

export default StudentDashboardOverview;

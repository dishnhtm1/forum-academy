import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Progress,
  Tag,
  Collapse,
  List,
  Space,
  Statistic,
  Badge,
  Tabs,
  Modal,
  Divider,
  Alert,
  Timeline,
  Tooltip,
  Radio,
} from "antd";
import {
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  StarOutlined,
  FireOutlined,
  ReadOutlined,
  CodeOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { ensureStudentCoursesTranslations } from "../../utils/studentCoursesTranslations";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// Add responsive styles
const styles = `
  @media (max-width: 768px) {
    .student-courses-container {
      padding: 16px !important;
    }
    .course-card-cover {
      height: 140px !important;
    }
    .course-card-icon {
      font-size: 40px !important;
    }
    .course-card .ant-card-body {
      padding: 16px !important;
    }
    .course-card-title {
      font-size: 16px !important;
    }
    .course-action-buttons {
      flex-direction: column !important;
    }
    .course-action-buttons button {
      width: 100% !important;
      min-width: auto !important;
    }
  }
  
  @media (max-width: 576px) {
    .stats-card .ant-statistic-title {
      font-size: 12px !important;
    }
    .stats-card .ant-statistic-content-value {
      font-size: 20px !important;
    }
  }

  .course-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }
  
  .course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
  }
`;

const StudentCourses = () => {
  const { t, i18n } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Quiz state management
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Load translations on mount
  useEffect(() => {
    ensureStudentCoursesTranslations(i18n);
  }, [i18n]);

  // Course configurations with icons and gradients
  const courses = [
    {
      id: "webDevelopment",
      icon: <CodeOutlined />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea",
      data: t("studentCourses.courses.webDevelopment", { returnObjects: true }),
    },
    {
      id: "pythonProgramming",
      icon: <ExperimentOutlined />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f093fb",
      data: t("studentCourses.courses.pythonProgramming", {
        returnObjects: true,
      }),
    },
    {
      id: "japanese",
      icon: <GlobalOutlined />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#4facfe",
      data: t("studentCourses.courses.japanese", { returnObjects: true }),
    },
    {
      id: "dataScience",
      icon: <LineChartOutlined />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      color: "#43e97b",
      data: t("studentCourses.courses.dataScience", { returnObjects: true }),
    },
  ];

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  const closeCourseDetails = () => {
    setShowCourseDetails(false);
    setSelectedCourse(null);
    // Reset quiz state when closing
    setQuizMode(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizScore(0);
  };

  // Quiz functions
  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizScore(0);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);

      const questions = t(
        `studentCourses.quiz.questions.${selectedCourse.id}`,
        { returnObjects: true }
      );

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || null);
      } else {
        // Calculate score and show results
        calculateScore(newAnswers, questions);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || null);
    }
  };

  const calculateScore = (answers, questions) => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    setQuizScore(correct);
    setShowResults(true);
  };

  const retryQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizScore(0);
  };

  const backToCourseFromQuiz = () => {
    setQuizMode(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizScore(0);
  };

  // Calculate overall statistics
  const stats = {
    totalCourses: courses.length,
    inProgress: courses.filter(
      (c) => parseInt(c.data.progress) > 0 && parseInt(c.data.progress) < 100
    ).length,
    completed: courses.filter((c) => parseInt(c.data.progress) === 100).length,
    totalHours: 156,
  };

  return (
    <>
      {/* Inject responsive styles */}
      <style>{styles}</style>

      <div
        className="student-courses-container"
        style={{
          padding: "24px",
          maxWidth: "1600px",
          margin: "0 auto",
          background: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Title level={2} style={{ marginBottom: "8px" }}>
            <BookOutlined style={{ marginRight: "12px", color: "#1890ff" }} />
            {t("studentCourses.title")}
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            {t("studentCourses.subtitle")}
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card
              className="stats-card"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Statistic
                title={t("studentCourses.stats.totalCourses")}
                value={stats.totalCourses}
                prefix={<BookOutlined />}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card
              className="stats-card"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Statistic
                title={t("studentCourses.stats.inProgress")}
                value={stats.inProgress}
                prefix={<RocketOutlined />}
                valueStyle={{
                  color: "#faad14",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card
              className="stats-card"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Statistic
                title={t("studentCourses.stats.completed")}
                value={stats.completed}
                prefix={<TrophyOutlined />}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card
              className="stats-card"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Statistic
                title={t("studentCourses.stats.totalHours")}
                value={stats.totalHours}
                prefix={<ClockCircleOutlined />}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Study Tips Alert */}
        <Alert
          message={
            <Text strong>
              <FireOutlined style={{ marginRight: "8px" }} />
              {t("studentCourses.studyTips.title")}
            </Text>
          }
          description={
            <Space direction="vertical" size="small">
              <Text>• {t("studentCourses.studyTips.tip1")}</Text>
              <Text>• {t("studentCourses.studyTips.tip2")}</Text>
              <Text>• {t("studentCourses.studyTips.tip3")}</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
          }}
        />

        {/* Filter Tabs */}
        <Card
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={t("studentCourses.filters.all")} key="all" />
            <TabPane
              tab={
                <Badge count={stats.inProgress} offset={[10, 0]}>
                  {t("studentCourses.filters.inProgress")}
                </Badge>
              }
              key="inProgress"
            />
            <TabPane
              tab={
                <Badge count={stats.completed} offset={[10, 0]}>
                  {t("studentCourses.filters.completed")}
                </Badge>
              }
              key="completed"
            />
          </Tabs>
        </Card>

        {/* Course Cards */}
        <Row gutter={[24, 24]}>
          {courses
            .filter((course) => {
              const progress = parseInt(course.data.progress);
              if (activeTab === "inProgress")
                return progress > 0 && progress < 100;
              if (activeTab === "completed") return progress === 100;
              return true;
            })
            .map((course) => (
              <Col xs={24} sm={24} md={12} lg={8} xl={6} key={course.id}>
                <Card
                  hoverable
                  className="course-card"
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: "20px" }}
                  cover={
                    <div
                      className="course-card-cover"
                      style={{
                        height: 180,
                        background: course.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "56px",
                        color: "white",
                        position: "relative",
                      }}
                    >
                      <span className="course-card-icon">{course.icon}</span>
                    </div>
                  }
                >
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="small"
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <Title
                        level={4}
                        className="course-card-title"
                        style={{
                          marginBottom: "8px",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}
                        ellipsis={{ rows: 2 }}
                      >
                        {course.data.title}
                      </Title>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{
                          marginBottom: "12px",
                          fontSize: "13px",
                          minHeight: "40px",
                        }}
                      >
                        {course.data.description}
                      </Paragraph>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong style={{ fontSize: "13px" }}>
                          Completion Rate
                        </Text>
                        <Text
                          strong
                          style={{
                            color: course.color,
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          {course.data.progress}%
                        </Text>
                      </div>
                      <Progress
                        percent={parseInt(course.data.progress)}
                        strokeColor={course.color}
                        strokeWidth={8}
                        showInfo={false}
                        status={
                          parseInt(course.data.progress) === 100
                            ? "success"
                            : "active"
                        }
                      />
                    </div>

                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        borderLeft: `3px solid ${course.color}`,
                        marginBottom: "12px",
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <StarOutlined
                          style={{ marginRight: "6px", color: course.color }}
                        />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {course.data.nextLesson}
                        </span>
                      </Text>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        👨‍🏫 {course.data.instructor}
                      </Text>
                    </div>

                    <div
                      className="course-action-buttons"
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        onClick={() => openCourseDetails(course)}
                        style={{
                          flex: 1,
                          minWidth: "120px",
                          background: course.color,
                          borderColor: course.color,
                          fontWeight: 500,
                        }}
                      >
                        {parseInt(course.data.progress) === 0
                          ? t("studentCourses.actions.start")
                          : t("studentCourses.actions.continue")}
                      </Button>
                      <Button
                        icon={<ReadOutlined />}
                        onClick={() => openCourseDetails(course)}
                        style={{
                          flex: 1,
                          minWidth: "120px",
                        }}
                      >
                        {t("studentCourses.actions.viewMaterials")}
                      </Button>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
        </Row>

        {/* Course Details Modal */}
        <Modal
          title={
            selectedCourse && (
              <Space align="center">
                <div
                  style={{
                    fontSize: "40px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background: selectedCourse.gradient,
                    color: "white",
                  }}
                >
                  {selectedCourse.icon}
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 600 }}>
                    {selectedCourse.data.title}
                  </div>
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", fontWeight: "normal" }}
                  >
                    {selectedCourse.data.instructor} •{" "}
                    {selectedCourse.data.duration}
                  </Text>
                </div>
              </Space>
            )
          }
          open={showCourseDetails}
          onCancel={closeCourseDetails}
          width={Math.min(
            1000,
            typeof window !== "undefined" ? window.innerWidth - 48 : 1000
          )}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          footer={
            <Row gutter={8}>
              <Col xs={24} sm={12}>
                <Button
                  key="close"
                  onClick={closeCourseDetails}
                  size="large"
                  block
                >
                  {t("studentCourses.quiz.backToCourse")}
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  key="continue"
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  block
                  style={{
                    background: selectedCourse?.color,
                    borderColor: selectedCourse?.color,
                  }}
                >
                  {t("studentCourses.actions.continue")}
                </Button>
              </Col>
            </Row>
          }
        >
          {selectedCourse && (
            <Tabs defaultActiveKey="overview">
              {/* Overview Tab */}
              <TabPane tab="📖 Overview" key="overview">
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={5}>Course Description</Title>
                    <Paragraph>{selectedCourse.data.overview}</Paragraph>
                  </div>

                  <div>
                    <Title level={5}>Skills You'll Learn</Title>
                    <Space wrap>
                      {selectedCourse.data.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          color={selectedCourse.color}
                          icon={<CheckCircleOutlined />}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <Text strong>Overall Progress</Text>
                      <Text strong style={{ color: selectedCourse.color }}>
                        {selectedCourse.data.progress}%
                      </Text>
                    </div>
                    <Progress
                      percent={parseInt(selectedCourse.data.progress)}
                      strokeColor={selectedCourse.color}
                      strokeWidth={12}
                    />
                  </div>
                </Space>
              </TabPane>
              {/* Curriculum Tab */}
              <TabPane tab="📚 Curriculum" key="curriculum">
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">
                    Track your progress through all course modules
                  </Text>
                </div>

                <Row gutter={[16, 16]}>
                  {selectedCourse.data.modules.map((module, index) => (
                    <Col xs={24} sm={12} md={8} key={module.id}>
                      <Card
                        hoverable
                        style={{
                          height: "100%",
                          borderLeft: `4px solid ${
                            module.completed
                              ? "#52c41a"
                              : module.current
                              ? selectedCourse.color
                              : "#d9d9d9"
                          }`,
                          background: module.current
                            ? `linear-gradient(135deg, ${selectedCourse.color}08 0%, ${selectedCourse.color}15 100%)`
                            : "white",
                        }}
                        bodyStyle={{ padding: "16px" }}
                      >
                        <Space
                          direction="vertical"
                          size="middle"
                          style={{ width: "100%" }}
                        >
                          {/* Module Header */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background: module.completed
                                    ? "#52c41a"
                                    : module.current
                                    ? selectedCourse.color
                                    : "#d9d9d9",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "12px",
                                  fontSize: "16px",
                                }}
                              >
                                {module.completed ? (
                                  <CheckCircleOutlined />
                                ) : module.current ? (
                                  <RocketOutlined />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <Text
                                  strong
                                  style={{
                                    fontSize: "15px",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {module.title}
                                </Text>
                                <Space size="small">
                                  {module.completed && (
                                    <Tag
                                      color="success"
                                      style={{ margin: 0, fontSize: "11px" }}
                                    >
                                      Completed
                                    </Tag>
                                  )}
                                  {module.current && (
                                    <Tag
                                      color="processing"
                                      style={{ margin: 0, fontSize: "11px" }}
                                    >
                                      Current
                                    </Tag>
                                  )}
                                  <Tag
                                    icon={<ClockCircleOutlined />}
                                    style={{ margin: 0, fontSize: "11px" }}
                                  >
                                    {module.duration}
                                  </Tag>
                                </Space>
                              </div>
                            </div>
                          </div>

                          {/* Lessons List */}
                          <div>
                            <Divider style={{ margin: "8px 0" }} />
                            <List
                              size="small"
                              dataSource={module.lessons}
                              renderItem={(lesson, idx) => (
                                <List.Item
                                  style={{
                                    padding: "6px 0",
                                    border: "none",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: "13px",
                                      color: module.completed
                                        ? "#8c8c8c"
                                        : "#262626",
                                    }}
                                  >
                                    {module.completed && (
                                      <CheckCircleOutlined
                                        style={{
                                          color: "#52c41a",
                                          marginRight: "8px",
                                          fontSize: "12px",
                                        }}
                                      />
                                    )}
                                    {!module.completed && (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          width: "20px",
                                          color: "#8c8c8c",
                                          marginRight: "8px",
                                        }}
                                      >
                                        {idx + 1}.
                                      </span>
                                    )}
                                    {lesson}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>{" "}
              {/* Recommended Books Tab */}
              <TabPane tab="📖 Books" key="books">
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Alert
                    message="Recommended Reading"
                    description="These books will help you deepen your understanding and master the course material."
                    type="info"
                    showIcon
                  />
                  <List
                    itemLayout="vertical"
                    dataSource={selectedCourse.data.books}
                    renderItem={(book, index) => (
                      <List.Item
                        key={index}
                        actions={[
                          <Button
                            type="link"
                            href={book.link}
                            target="_blank"
                            icon={<ReadOutlined />}
                          >
                            View Book
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                background: selectedCourse.gradient,
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "24px",
                              }}
                            >
                              <BookOutlined />
                            </div>
                          }
                          title={<Text strong>{book.title}</Text>}
                          description={
                            <Space direction="vertical" size="small">
                              <Text type="secondary">by {book.author}</Text>
                              <Text>{book.description}</Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Space>
              </TabPane>
              {/* Quiz Tab */}
            </Tabs>
          )}
        </Modal>
      </div>
    </>
  );
};

export default StudentCourses;

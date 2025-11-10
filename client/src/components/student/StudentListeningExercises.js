import React, { useState, useRef } from "react";
import {
  Space,
  Button,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Empty,
  Badge,
  Statistic,
  Modal,
  Radio,
  Form,
  message,
  Progress,
  Divider,
  Alert,
} from "antd";
import {
  SoundOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const StudentListeningExercises = ({
  t,
  listeningExercises,
  onStartExercise,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const audioRef = useRef(null);
  const [form] = Form.useForm();

  const stats = {
    total: listeningExercises?.length || 0,
    beginner:
      listeningExercises?.filter((ex) => ex.level === "beginner").length || 0,
    intermediate:
      listeningExercises?.filter((ex) => ex.level === "intermediate").length ||
      0,
    advanced:
      listeningExercises?.filter((ex) => ex.level === "advanced").length || 0,
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: { bg: "#f6ffed", border: "#b7eb8f", text: "#52c41a" },
      intermediate: { bg: "#fff7e6", border: "#ffd591", text: "#fa8c16" },
      advanced: { bg: "#fff1f0", border: "#ffccc7", text: "#f5222d" },
    };
    return colors[level] || colors.beginner;
  };

  const getDifficultyLabel = (level) => {
    if (level === "beginner")
      return t("studentDashboard.listening.difficulty.beginner");
    if (level === "intermediate")
      return t("studentDashboard.listening.difficulty.intermediate");
    return t("studentDashboard.listening.difficulty.advanced");
  };

  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalVisible(true);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setCurrentTime(0);
    setIsPlaying(false);
    form.resetFields();
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleDownloadAudio = () => {
    if (selectedExercise?.audioUrl) {
      const link = document.createElement("a");
      link.href = selectedExercise.audioUrl;
      link.download = `${selectedExercise.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(
        t(
          "studentDashboard.listening.audioDownloaded",
          "Audio downloaded successfully!"
        )
      );
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = async () => {
    const questions = selectedExercise?.questions || [];
    let correctCount = 0;

    questions.forEach((question) => {
      const userAnswer = answers[question._id || question.id];

      // Handle new format (options as objects with isCorrect)
      if (
        question.options &&
        question.options.length > 0 &&
        typeof question.options[0] === "object"
      ) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (userAnswer === correctOption?.text) {
          correctCount++;
        }
      }
      // Handle old format (options as strings with correctAnswer field)
      else if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    setScore({
      correct: correctCount,
      total: questions.length,
      percentage: percentage.toFixed(1),
    });
    setSubmitted(true);

    // Submit to server to save in database
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      // Convert answers from option text to option index for server validation
      const formattedAnswers = {};
      questions.forEach((question) => {
        const questionId = question._id || question.id;
        const userAnswer = answers[questionId];

        // Find the index of the selected option
        if (question.options && typeof question.options[0] === "object") {
          const selectedIndex = question.options.findIndex(
            (opt) => opt.text === userAnswer
          );
          // Server expects the index as the answer
          formattedAnswers[questionId] = selectedIndex;
        } else {
          // For old format, keep as-is
          formattedAnswers[questionId] = userAnswer;
        }
      });

      console.log("📤 Submitting answers to server:", formattedAnswers);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/listening-exercises/${
          selectedExercise._id || selectedExercise.id
        }/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: formattedAnswers }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Submission saved:", data);

        message.success(
          t(
            "studentDashboard.listening.submitted",
            "Exercise submitted successfully!"
          )
        );
      } else {
        const errorData = await response.json();
        console.error("❌ Submission failed:", errorData);
        message.warning(
          t(
            "studentDashboard.listening.submittedLocalOnly",
            "Answers graded, but submission could not be saved to server."
          )
        );
      }
    } catch (error) {
      console.error("Error submitting to server:", error);
      message.warning(
        t(
          "studentDashboard.listening.submittedLocalOnly",
          "Answers graded, but submission could not be saved to server."
        )
      );
    }

    if (onStartExercise) {
      onStartExercise(selectedExercise, {
        answers,
        score: percentage,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
      });
    }
  };

  const handleCloseModal = () => {
    setExerciseModalVisible(false);
    setSelectedExercise(null);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "#52c41a";
    if (percentage >= 80) return "#73d13d";
    if (percentage >= 70) return "#fadb14";
    if (percentage >= 60) return "#fa8c16";
    return "#f5222d";
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 24,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Space align="center">
            <SoundOutlined style={{ fontSize: 32, color: "#fff" }} />
            <Title level={2} style={{ margin: 0, color: "#fff" }}>
              {t("studentDashboard.listening.title")}
            </Title>
          </Space>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
            {t("studentDashboard.listening.subtitle")}
          </Text>
        </Space>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t(
                "studentDashboard.listening.stats.total",
                "Total Exercises"
              )}
              value={stats.total}
              prefix={<FireOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16", fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t("studentDashboard.listening.difficulty.beginner")}
              value={stats.beginner}
              valueStyle={{ color: "#52c41a", fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t("studentDashboard.listening.difficulty.intermediate")}
              value={stats.intermediate}
              valueStyle={{ color: "#fa8c16", fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t("studentDashboard.listening.difficulty.advanced")}
              value={stats.advanced}
              valueStyle={{ color: "#f5222d", fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {listeningExercises && listeningExercises.length > 0 ? (
        <Row gutter={[16, 16]}>
          {listeningExercises.map((exercise) => {
            const diffColors = getDifficultyColor(exercise.level);
            const isHovered = hoveredCard === (exercise._id || exercise.id);

            return (
              <Col xs={24} sm={12} lg={8} key={exercise._id || exercise.id}>
                <Card
                  hoverable
                  onMouseEnter={() =>
                    setHoveredCard(exercise._id || exercise.id)
                  }
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    borderRadius: 12,
                    height: "100%",
                    border:
                      "2px solid " +
                      (isHovered ? diffColors.border : "#f0f0f0"),
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                    boxShadow: isHovered
                      ? "0 8px 16px rgba(0,0,0,0.12)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  bodyStyle={{ padding: "20px" }}
                >
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Badge
                        count={
                          <Tag
                            color={diffColors.text}
                            style={{
                              fontSize: 11,
                              fontWeight: "bold",
                              borderRadius: 8,
                              padding: "2px 8px",
                            }}
                          >
                            {getDifficultyLabel(exercise.level).toUpperCase()}
                          </Tag>
                        }
                        style={{ width: "100%" }}
                      >
                        <Title
                          level={4}
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#1f2937",
                            lineHeight: 1.4,
                          }}
                        >
                          {exercise.title}
                        </Title>
                      </Badge>
                    </div>

                    <Text
                      type="secondary"
                      style={{
                        fontSize: 13,
                        display: "block",
                        color: "#64748b",
                      }}
                    >
                      {exercise.course?.title ||
                        exercise.course?.name ||
                        "General"}
                    </Text>

                    <div
                      style={{
                        background: diffColors.bg,
                        padding: "12px",
                        borderRadius: 8,
                        border: "1px solid " + diffColors.border,
                      }}
                    >
                      <Row gutter={[8, 8]}>
                        <Col span={12}>
                          <Space size={4}>
                            <ClockCircleOutlined
                              style={{ color: diffColors.text, fontSize: 14 }}
                            />
                            <Text
                              strong
                              style={{ fontSize: 13, color: "#1f2937" }}
                            >
                              {exercise.timeLimit || "30"} min
                            </Text>
                          </Space>
                        </Col>
                        <Col span={12}>
                          <Space size={4}>
                            <QuestionCircleOutlined
                              style={{ color: diffColors.text, fontSize: 14 }}
                            />
                            <Text
                              strong
                              style={{ fontSize: 13, color: "#1f2937" }}
                            >
                              {exercise.questions?.length || 0}{" "}
                              {t(
                                "studentDashboard.listening.columns.questions"
                              )}
                            </Text>
                          </Space>
                        </Col>
                      </Row>
                    </div>

                    {exercise.isPublished ? (
                      <Tag
                        color="success"
                        icon={<TrophyOutlined />}
                        style={{
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: "500",
                          padding: "4px 12px",
                        }}
                      >
                        {t("studentDashboard.listening.status.published")}
                      </Tag>
                    ) : (
                      <Tag
                        color="default"
                        style={{
                          borderRadius: 6,
                          fontSize: 12,
                          padding: "4px 12px",
                        }}
                      >
                        {t("studentDashboard.listening.status.draft")}
                      </Tag>
                    )}

                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleStartExercise(exercise)}
                      style={{
                        borderRadius: 8,
                        height: 44,
                        fontWeight: "600",
                        background: isHovered
                          ? "linear-gradient(135deg, " +
                            diffColors.text +
                            " 0%, " +
                            diffColors.text +
                            "dd 100%)"
                          : "#1890ff",
                        borderColor: isHovered ? diffColors.text : "#1890ff",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {t("studentDashboard.listening.startExercise")}
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={8}>
                <Text style={{ fontSize: 16, color: "#8c8c8c" }}>
                  {t(
                    "studentDashboard.listening.noExercises",
                    "No listening exercises available yet"
                  )}
                </Text>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {t(
                    "studentDashboard.listening.checkBack",
                    "Check back later for new exercises!"
                  )}
                </Text>
              </Space>
            }
          />
        </Card>
      )}

      {/* Exercise Modal */}
      <Modal
        open={exerciseModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {selectedExercise && (
          <div>
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "12px 12px 0 0",
                marginTop: -24,
                marginLeft: -24,
                marginRight: -24,
              }}
            >
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Title level={3} style={{ margin: 0, color: "#fff" }}>
                  {selectedExercise.title}
                </Title>
                <Space>
                  <Tag
                    color={getDifficultyColor(selectedExercise.level).text}
                    style={{ fontWeight: "bold" }}
                  >
                    {getDifficultyLabel(selectedExercise.level).toUpperCase()}
                  </Tag>
                  <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                    {selectedExercise.course?.title ||
                      selectedExercise.course?.name ||
                      "General"}
                  </Text>
                </Space>
              </Space>
            </div>

            <div style={{ padding: "24px 0" }}>
              {/* Audio Player */}
              <Card
                style={{
                  borderRadius: 12,
                  background: "#f5f7fa",
                  marginBottom: 24,
                }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Space
                    align="center"
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Space>
                      <SoundOutlined
                        style={{ fontSize: 24, color: "#667eea" }}
                      />
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          {t(
                            "studentDashboard.listening.audioFile",
                            "Listening Audio"
                          )}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                      </div>
                    </Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadAudio}
                      type="link"
                    >
                      {t("studentDashboard.listening.download", "Download")}
                    </Button>
                  </Space>

                  <Progress
                    percent={duration ? (currentTime / duration) * 100 : 0}
                    showInfo={false}
                    strokeColor={{
                      "0%": "#667eea",
                      "100%": "#764ba2",
                    }}
                  />

                  <Space style={{ width: "100%", justifyContent: "center" }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={
                        isPlaying ? (
                          <PauseCircleOutlined />
                        ) : (
                          <PlayCircleOutlined />
                        )
                      }
                      onClick={handlePlayPause}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        width: 120,
                      }}
                    >
                      {isPlaying
                        ? t("studentDashboard.listening.pause", "Pause")
                        : t("studentDashboard.listening.play", "Play")}
                    </Button>
                  </Space>

                  <audio
                    ref={audioRef}
                    src={selectedExercise.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: "none" }}
                  />
                </Space>
              </Card>

              {/* Description */}
              {selectedExercise.description && (
                <Alert
                  message={t(
                    "studentDashboard.listening.instructions",
                    "Instructions"
                  )}
                  description={selectedExercise.description}
                  type="info"
                  showIcon
                  style={{ marginBottom: 24, borderRadius: 8 }}
                />
              )}

              {/* Questions */}
              <Card
                title={
                  <Space>
                    <QuestionCircleOutlined />
                    {t("studentDashboard.listening.questions", "Questions")} (
                    {selectedExercise.questions?.length || 0})
                  </Space>
                }
                style={{ borderRadius: 12 }}
              >
                <Form form={form} layout="vertical">
                  {selectedExercise.questions?.map((question, index) => {
                    // Determine if answer is correct (handles both old and new format)
                    const userAnswer = answers[question._id || question.id];
                    let isCorrect = false;

                    if (submitted && userAnswer) {
                      if (typeof question.options?.[0] === "object") {
                        // New format: check if user's answer matches the option with isCorrect=true
                        isCorrect = question.options.some(
                          (opt) => opt.text === userAnswer && opt.isCorrect
                        );
                      } else {
                        // Old format: check against correctAnswer field
                        isCorrect = userAnswer === question.correctAnswer;
                      }
                    }

                    return (
                      <div
                        key={question._id || question.id}
                        style={{
                          marginBottom: 24,
                          padding: 16,
                          background: submitted
                            ? isCorrect
                              ? "#f6ffed"
                              : "#fff2f0"
                            : "#fafafa",
                          borderRadius: 8,
                          border: submitted
                            ? `2px solid ${isCorrect ? "#52c41a" : "#f5222d"}`
                            : "1px solid #d9d9d9",
                        }}
                      >
                        <Space
                          align="start"
                          style={{ width: "100%", marginBottom: 12 }}
                        >
                          <div
                            style={{
                              background: "#667eea",
                              color: "#fff",
                              borderRadius: "50%",
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </div>
                          <Text strong style={{ fontSize: 15, flex: 1 }}>
                            {question.question}
                          </Text>
                          {submitted &&
                            (isCorrect ? (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a", fontSize: 20 }}
                              />
                            ) : (
                              <CloseCircleOutlined
                                style={{ color: "#f5222d", fontSize: 20 }}
                              />
                            ))}
                        </Space>

                        <Radio.Group
                          value={answers[question._id || question.id]}
                          onChange={(e) =>
                            handleAnswerChange(
                              question._id || question.id,
                              e.target.value
                            )
                          }
                          disabled={submitted}
                          style={{ width: "100%" }}
                        >
                          <Space direction="vertical" style={{ width: "100%" }}>
                            {question.options?.map((option, optIndex) => {
                              // Handle both old format (string) and new format (object)
                              const optionText =
                                typeof option === "object"
                                  ? option.text
                                  : option;
                              const isCorrectOption =
                                typeof option === "object"
                                  ? option.isCorrect
                                  : option === question.correctAnswer;
                              const userAnswer =
                                answers[question._id || question.id];

                              return (
                                <Radio
                                  key={optIndex}
                                  value={optionText}
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    background:
                                      submitted && isCorrectOption
                                        ? "#f6ffed"
                                        : submitted &&
                                          optionText === userAnswer &&
                                          !isCorrectOption
                                        ? "#fff2f0"
                                        : "#fff",
                                    border:
                                      submitted && isCorrectOption
                                        ? "1px solid #52c41a"
                                        : submitted &&
                                          optionText === userAnswer &&
                                          !isCorrectOption
                                        ? "1px solid #f5222d"
                                        : "1px solid #d9d9d9",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color:
                                        submitted && isCorrectOption
                                          ? "#52c41a"
                                          : submitted &&
                                            optionText === userAnswer &&
                                            !isCorrectOption
                                          ? "#f5222d"
                                          : "#000",
                                      fontWeight:
                                        submitted && isCorrectOption
                                          ? "bold"
                                          : "normal",
                                    }}
                                  >
                                    {optionText}
                                  </Text>
                                </Radio>
                              );
                            })}
                          </Space>
                        </Radio.Group>

                        {submitted &&
                          (() => {
                            // Find correct answer text for display
                            const correctAnswerText = question.options?.find(
                              (opt) =>
                                typeof opt === "object"
                                  ? opt.isCorrect
                                  : opt === question.correctAnswer
                            );
                            const correctText =
                              typeof correctAnswerText === "object"
                                ? correctAnswerText.text
                                : correctAnswerText || question.correctAnswer;
                            const userAnswer =
                              answers[question._id || question.id];

                            // Check if user's answer is incorrect
                            const isIncorrect =
                              typeof question.options?.[0] === "object"
                                ? !question.options.find(
                                    (opt) => opt.text === userAnswer
                                  )?.isCorrect
                                : userAnswer !== question.correctAnswer;

                            return (
                              isIncorrect && (
                                <Alert
                                  message={
                                    t(
                                      "studentDashboard.listening.correctAnswer",
                                      "Correct Answer"
                                    ) +
                                    ": " +
                                    correctText
                                  }
                                  type="success"
                                  showIcon
                                  style={{ marginTop: 12 }}
                                />
                              )
                            );
                          })()}
                      </div>
                    );
                  })}
                </Form>
              </Card>

              {/* Score Display */}
              {submitted && score && (
                <Card
                  style={{
                    marginTop: 24,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    border: `2px solid ${getGradeColor(score.percentage)}`,
                  }}
                >
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: getGradeColor(score.percentage),
                      }}
                    >
                      {t("studentDashboard.listening.yourScore", "Your Score")}:{" "}
                      {score.percentage}%
                    </Title>
                    <Progress
                      type="circle"
                      percent={parseFloat(score.percentage)}
                      strokeColor={getGradeColor(score.percentage)}
                      width={120}
                    />
                    <Text style={{ fontSize: 16 }}>
                      {score.correct}{" "}
                      {t("studentDashboard.listening.outOf", "out of")}{" "}
                      {score.total}{" "}
                      {t("studentDashboard.listening.correct", "correct")}
                    </Text>
                  </Space>
                </Card>
              )}

              {/* Submit Button */}
              {!submitted && (
                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={
                      Object.keys(answers).length !==
                      (selectedExercise.questions?.length || 0)
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      width: 200,
                      height: 48,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {t(
                      "studentDashboard.listening.submitAnswers",
                      "Submit Answers"
                    )}
                  </Button>
                  {Object.keys(answers).length !==
                    (selectedExercise.questions?.length || 0) && (
                    <div style={{ marginTop: 12 }}>
                      <Text type="secondary">
                        {t(
                          "studentDashboard.listening.answerAll",
                          "Please answer all questions before submitting"
                        )}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentListeningExercises;

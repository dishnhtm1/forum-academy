import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Form,
  Select,
  Modal,
  Space,
  Row,
  Col,
  Typography,
  Tabs,
  Progress,
  Tag,
  Statistic,
  ConfigProvider,
} from "antd";
import {
  BookOutlined,
  AimOutlined,
  TrophyOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StudentAchievements = () => {
  const { t } = useTranslation();
  // Study Planner State
  const [studySessions, setStudySessions] = useState([]);
  const [studyForm] = Form.useForm();
  const [isStudyModalVisible, setIsStudyModalVisible] = useState(false);

  // Goal Tracker State
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete JavaScript Course",
      description: "Learn advanced JavaScript concepts",
      target: 100,
      current: 65,
      deadline: moment().add(30, "days"),
      priority: "high",
    },
    {
      id: 2,
      title: "Build 2 Projects",
      description: "Create portfolio projects",
      target: 2,
      current: 0,
      deadline: moment().add(60, "days"),
      priority: "medium",
    },
  ]);

  // Skill Assessment State
  const [skillAssessments, setSkillAssessments] = useState([
    { id: 1, name: "JavaScript", level: 7, lastAssessed: "2024-11-01" },
    { id: 2, name: "React", level: 6, lastAssessed: "2024-10-15" },
    { id: 3, name: "CSS", level: 8, lastAssessed: "2024-11-05" },
  ]);
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] =
    useState(false);
  const [selectedSkillForAssessment, setSelectedSkillForAssessment] =
    useState(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState("study");

  // ============ STUDY PLANNER FUNCTIONS ============

  const handleAddStudySession = (values) => {
    const newSession = {
      id: Date.now(),
      subject: values.subject,
      duration: values.duration,
      date: values.date,
      notes: values.notes,
      completed: false,
    };
    setStudySessions([...studySessions, newSession]);
    studyForm.resetFields();
    setIsStudyModalVisible(false);
  };

  const handleDeleteStudySession = (id) => {
    setStudySessions(studySessions.filter((session) => session.id !== id));
  };

  const handleCompleteStudySession = (id) => {
    setStudySessions(
      studySessions.map((session) =>
        session.id === id
          ? { ...session, completed: !session.completed }
          : session
      )
    );
  };

  const StudyPlannerContent = () => (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsStudyModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        {t("studentDashboard.achievements.studyPlanner.addSession")}
      </Button>

      <Modal
        title={t("studentDashboard.achievements.studyPlanner.addSessionModal")}
        visible={isStudyModalVisible}
        onOk={() => studyForm.submit()}
        onCancel={() => setIsStudyModalVisible(false)}
      >
        <Form
          form={studyForm}
          layout="vertical"
          onFinish={handleAddStudySession}
        >
          <Form.Item
            name="subject"
            label={t("studentDashboard.achievements.studyPlanner.subject")}
            rules={[
              {
                required: true,
                message: t(
                  "studentDashboard.achievements.studyPlanner.subjectPlaceholder"
                ),
              },
            ]}
          >
            <Input
              placeholder={t(
                "studentDashboard.achievements.studyPlanner.subjectPlaceholder"
              )}
            />
          </Form.Item>
          <Form.Item
            name="duration"
            label={t("studentDashboard.achievements.studyPlanner.duration")}
            rules={[
              {
                required: true,
                message: t(
                  "studentDashboard.achievements.studyPlanner.durationPlaceholder"
                ),
              },
            ]}
          >
            <Input
              type="number"
              placeholder={t(
                "studentDashboard.achievements.studyPlanner.durationPlaceholder"
              )}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label={t("studentDashboard.achievements.studyPlanner.date")}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="notes"
            label={t("studentDashboard.achievements.studyPlanner.notes")}
          >
            <TextArea
              rows={3}
              placeholder={t(
                "studentDashboard.achievements.studyPlanner.notesPlaceholder"
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      {studySessions.length === 0 ? (
        <Card>
          <Text type="secondary">
            {t("studentDashboard.achievements.studyPlanner.noSessions")}
          </Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {studySessions.map((session) => (
            <Col xs={24} md={12} key={session.id}>
              <Card
                style={{
                  opacity: session.completed ? 0.6 : 1,
                  textDecoration: session.completed ? "line-through" : "none",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Title level={5}>{session.subject}</Title>
                    <Text type="secondary">
                      {session.duration}{" "}
                      {t("studentDashboard.achievements.studyPlanner.duration")}
                    </Text>
                    <Paragraph>{session.notes}</Paragraph>
                  </div>
                  <Space direction="vertical">
                    <Button
                      type={session.completed ? "primary" : "default"}
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleCompleteStudySession(session.id)}
                    >
                      {session.completed
                        ? t(
                            "studentDashboard.achievements.studyPlanner.completed"
                          )
                        : t(
                            "studentDashboard.achievements.studyPlanner.markComplete"
                          )}
                    </Button>
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteStudySession(session.id)}
                    >
                      {t("studentDashboard.achievements.studyPlanner.delete")}
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  // ============ GOAL TRACKER FUNCTIONS ============

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const handleAddGoal = () => {
    Modal.confirm({
      title: t("studentDashboard.achievements.goalTracker.addGoal"),
      content: t("studentDashboard.achievements.goalTracker.addGoal"),
      onOk() {
        // Implementation for adding goals
      },
    });
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const handleUpdateGoal = (id, newCurrent) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, current: Math.min(newCurrent, goal.target) }
          : goal
      )
    );
  };

  const GoalTrackerContent = () => (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddGoal}
        style={{ marginBottom: 16 }}
      >
        {t("studentDashboard.achievements.goalTracker.addGoal")}
      </Button>

      <Row gutter={[16, 16]}>
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          const daysLeft = goal.deadline.diff(moment(), "days");

          return (
            <Col xs={24} md={12} key={goal.id}>
              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {goal.title}
                    </Title>
                    <Text type="secondary">{goal.description}</Text>
                  </div>
                  <Tag color={getPriorityColor(goal.priority)}>
                    {goal.priority.toUpperCase()}
                  </Tag>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text strong>
                      {t("studentDashboard.achievements.goalTracker.progress")}:{" "}
                      {goal.current} / {goal.target}
                    </Text>
                    <Text>{progress}%</Text>
                  </div>
                  <Progress
                    percent={progress}
                    status={progress === 100 ? "success" : "active"}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {daysLeft}{" "}
                    {t("studentDashboard.achievements.goalTracker.daysLeft")}
                  </Text>
                </div>

                <Space>
                  <Button
                    size="small"
                    onClick={() => handleUpdateGoal(goal.id, goal.current + 1)}
                  >
                    +1
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    {t("studentDashboard.achievements.goalTracker.deleteGoal")}
                  </Button>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );

  // ============ SKILL ASSESSMENT FUNCTIONS ============

  const handleAssessSkill = (skill) => {
    setSelectedSkillForAssessment(skill);
    setIsAssessmentModalVisible(true);
  };

  const handleCompleteAssessment = (skillId, score) => {
    setSkillAssessments(
      skillAssessments.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              level: score,
              lastAssessed: moment().format("YYYY-MM-DD"),
            }
          : skill
      )
    );
    setIsAssessmentModalVisible(false);
    setSelectedSkillForAssessment(null);
  };

  const SkillAssessmentContent = () => (
    <div>
      <Row gutter={[16, 16]}>
        {skillAssessments.map((skill) => (
          <Col xs={24} md={12} lg={8} key={skill.id}>
            <Card>
              <Title level={5}>{skill.name}</Title>
              <Statistic
                title={t("studentDashboard.achievements.skillAssessment.level")}
                value={skill.level}
                suffix="/10"
              />
              <Text type="secondary">
                {t(
                  "studentDashboard.achievements.skillAssessment.lastAssessed"
                )}
                : {skill.lastAssessed}
              </Text>
              <div style={{ marginTop: 12 }}>
                <Progress type="circle" percent={skill.level * 10} width={80} />
              </div>
              <Button
                type="primary"
                block
                style={{ marginTop: 12 }}
                onClick={() => handleAssessSkill(skill)}
              >
                {t(
                  "studentDashboard.achievements.skillAssessment.reassessSkill"
                )}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`${t("studentDashboard.achievements.skillAssessment.title")} ${
          selectedSkillForAssessment?.name
        }`}
        visible={isAssessmentModalVisible}
        onCancel={() => setIsAssessmentModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <Paragraph>
            {t("studentDashboard.achievements.skillAssessment.rateProficiency")}
          </Paragraph>
          <Row gutter={[8, 8]}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
              <Col span={4} key={score}>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    handleCompleteAssessment(
                      selectedSkillForAssessment.id,
                      score
                    )
                  }
                >
                  {score}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </div>
  );

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#1890ff", borderRadius: 8 } }}
    >
      <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: 32, color: "#2c3e50" }}
        >
          🚀 {t("studentDashboard.achievements.title")}
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          style={{ background: "white", borderRadius: 8, padding: "20px" }}
        >
          <TabPane
            tab={
              <span>
                <BookOutlined />
                {t("studentDashboard.achievements.studyPlanner.title")}
              </span>
            }
            key="study"
          >
            <StudyPlannerContent />
          </TabPane>
          <TabPane
            tab={
              <span>
                <AimOutlined />
                {t("studentDashboard.achievements.goalTracker.title")}
              </span>
            }
            key="goals"
          >
            <GoalTrackerContent />
          </TabPane>
          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                {t("studentDashboard.achievements.skillAssessment.title")}
              </span>
            }
            key="skills"
          >
            <SkillAssessmentContent />
          </TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  );
};

export default StudentAchievements;

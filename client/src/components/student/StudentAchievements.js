import React from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StudentAchievements = ({ t }) => (
  <div style={{ padding: "24px" }}>
    <Title level={2}>🏆 {t("studentDashboard.achievements.title")}</Title>
    <Text type="secondary">{t("studentDashboard.achievements.subtitle")}</Text>

    <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <TrophyOutlined style={{ fontSize: "48px", color: "#faad14" }} />
            <Title level={4}>
              {t("studentDashboard.achievements.quickLearner.title")}
            </Title>
            <Text type="secondary">
              {t("studentDashboard.achievements.quickLearner.description")}
            </Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <FireOutlined style={{ fontSize: "48px", color: "#f5222d" }} />
            <Title level={4}>
              {t("studentDashboard.achievements.sevenDayStreak.title")}
            </Title>
            <Text type="secondary">
              {t("studentDashboard.achievements.sevenDayStreak.description")}
            </Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <StarOutlined style={{ fontSize: "48px", color: "#722ed1" }} />
            <Title level={4}>
              {t("studentDashboard.achievements.perfectScore.title")}
            </Title>
            <Text type="secondary">
              {t("studentDashboard.achievements.perfectScore.description")}
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
);

export default StudentAchievements;


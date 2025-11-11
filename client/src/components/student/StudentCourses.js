import React from "react";
import { Row, Col, Card, Button, Typography } from "antd";

const { Title, Text } = Typography;

const StudentCourses = ({ t }) => (
  <div style={{ padding: "24px" }}>
    <Title level={2}>📚 {t("studentDashboard.courses.title")}</Title>
    <Text type="secondary">{t("studentDashboard.courses.subtitle")}</Text>

    <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          cover={
            <div
              style={{
                height: 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
          }
          actions={[
            <Button type="link" key="continue">
              Continue
            </Button>,
            <Button type="link" key="materials">
              View Materials
            </Button>,
          ]}
        >
          <Card.Meta
            title="Advanced English"
            description="Progress: 75% • Next: Grammar Lesson 5"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          cover={
            <div
              style={{
                height: 120,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            />
          }
          actions={[
            <Button type="link" key="continue">
              Continue
            </Button>,
            <Button type="link" key="materials">
              View Materials
            </Button>,
          ]}
        >
          <Card.Meta
            title="Japanese 101"
            description="Progress: 45% • Next: Hiragana Practice"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          cover={
            <div
              style={{
                height: 120,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            />
          }
          actions={[
            <Button type="link" key="continue">
              Continue
            </Button>,
            <Button type="link" key="materials">
              View Materials
            </Button>,
          ]}
        >
          <Card.Meta
            title="Spanish Basics"
            description="Progress: 90% • Next: Final Exam"
          />
        </Card>
      </Col>
    </Row>
  </div>
);

export default StudentCourses;


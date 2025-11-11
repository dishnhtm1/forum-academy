import React, { useState } from "react";
import {
  Typography,
  Spin,
  Card,
  Space,
  Row,
  Col,
  Statistic,
  Empty,
  Badge,
} from "antd";
import ZoomMeetingCard from "../ZoomMeetingCard";
import {
  VideoCameraOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text: AntText } = Typography;

const StudentLiveClasses = ({ t, zoomClasses, zoomLoading, onJoinClass }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Calculate statistics
  const stats = {
    total: zoomClasses?.length || 0,
    live:
      zoomClasses?.filter((c) => c.status === "active" || c.status === "live")
        .length || 0,
    upcoming: zoomClasses?.filter((c) => c.status === "scheduled").length || 0,
    today:
      zoomClasses?.filter((c) => moment(c.startTime).isSame(moment(), "day"))
        .length || 0,
  };

  const getLiveClasses = () =>
    zoomClasses?.filter((c) => c.status === "active" || c.status === "live") ||
    [];
  const getUpcomingClasses = () =>
    zoomClasses?.filter((c) => c.status === "scheduled") || [];

  return (
    <div
      style={{
        padding: "16px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Header Card */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 24,
          background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
          border: "none",
          boxShadow: "0 8px 24px rgba(220, 38, 38, 0.25)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Space align="center">
            <div
              style={{
                width: 48,
                height: 48,
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <VideoCameraOutlined style={{ color: "#fff", fontSize: 24 }} />
            </div>
            <Title level={2} style={{ margin: 0, color: "#fff" }}>
              {t("studentDashboard.liveClasses.title")}
            </Title>
          </Space>
          <AntText style={{ color: "rgba(255,255,255,0.95)", fontSize: 15 }}>
            {t("studentDashboard.liveClasses.subtitle")}
          </AntText>
        </Space>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t(
                "studentDashboard.liveClasses.metrics.total",
                "Total Classes"
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
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Badge dot={stats.live > 0} offset={[-5, 5]}>
              <Statistic
                title={t(
                  "studentDashboard.liveClasses.metrics.live",
                  "Live Now"
                )}
                value={stats.live}
                prefix={<PlayCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a", fontSize: 24 }}
              />
            </Badge>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t(
                "studentDashboard.liveClasses.metrics.upcoming",
                "Upcoming"
              )}
              value={stats.upcoming}
              prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: "center",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Statistic
              title={t("studentDashboard.liveClasses.metrics.today", "Today")}
              value={stats.today}
              prefix={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1", fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Loading State */}
      {zoomLoading ? (
        <Card
          style={{
            borderRadius: 16,
            textAlign: "center",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "60px 40px" }}
        >
          <Spin size="large" />
          <div style={{ marginTop: 24 }}>
            <AntText style={{ fontSize: 16, color: "#8c8c8c" }}>
              {t("studentDashboard.liveClasses.loading")}
            </AntText>
          </div>
        </Card>
      ) : zoomClasses.length === 0 ? (
        /* Empty State */
        <Card
          style={{
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "60px 40px" }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              height: 80,
            }}
            description={
              <Space
                direction="vertical"
                size={12}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 16px",
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(220, 38, 38, 0.25)",
                  }}
                >
                  <VideoCameraOutlined
                    style={{ color: "#fff", fontSize: 32 }}
                  />
                </div>
                <Title level={3} style={{ color: "#262626", margin: 0 }}>
                  {t("studentDashboard.liveClasses.noClasses")}
                </Title>
                <AntText style={{ fontSize: 14, color: "#8c8c8c" }}>
                  {t("studentDashboard.liveClasses.noClassesDesc1")}
                </AntText>
                <AntText style={{ fontSize: 14, color: "#8c8c8c" }}>
                  {t("studentDashboard.liveClasses.noClassesDesc2")}
                </AntText>
              </Space>
            }
          />
        </Card>
      ) : (
        /* Classes List */
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          {/* Live Classes Section */}
          {getLiveClasses().length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                  gap: 12,
                }}
              >
                <Badge dot status="processing">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background:
                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                    }}
                  >
                    <PlayCircleOutlined
                      style={{ color: "#fff", fontSize: 20 }}
                    />
                  </div>
                </Badge>
                <div>
                  <Title level={4} style={{ margin: 0, color: "#1a202c" }}>
                    Live Now
                  </Title>
                  <AntText style={{ fontSize: 13, color: "#8c8c8c" }}>
                    {getLiveClasses().length}{" "}
                    {getLiveClasses().length === 1 ? "class" : "classes"} in
                    session
                  </AntText>
                </div>
              </div>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {getLiveClasses().map((meeting) => (
                  <ZoomMeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onJoinMeeting={onJoinClass}
                  />
                ))}
              </Space>
            </div>
          )}

          {/* Upcoming Classes Section */}
          {getUpcomingClasses().length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background:
                      "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  <CalendarOutlined style={{ color: "#fff", fontSize: 20 }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: "#1a202c" }}>
                    {t(
                      "studentDashboard.liveClasses.metrics.upcoming",
                      "Upcoming Classes"
                    )}
                  </Title>
                  <AntText style={{ fontSize: 13, color: "#8c8c8c" }}>
                    {getUpcomingClasses().length} scheduled{" "}
                    {getUpcomingClasses().length === 1 ? "class" : "classes"}
                  </AntText>
                </div>
              </div>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {getUpcomingClasses().map((meeting) => (
                  <ZoomMeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onJoinMeeting={onJoinClass}
                  />
                ))}
              </Space>
            </div>
          )}
        </Space>
      )}
    </div>
  );
};

export default StudentLiveClasses;

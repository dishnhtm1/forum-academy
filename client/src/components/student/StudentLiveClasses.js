import React from "react";
import { Typography, Spin } from "antd";
import ZoomMeetingCard from "../ZoomMeetingCard";
import { VideoCameraOutlined } from "@ant-design/icons";

const { Title, Text: AntText } = Typography;

const StudentLiveClasses = ({ t, zoomClasses, zoomLoading, onJoinClass }) => {
  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 32,
          padding: "24px",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              background:
                "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.3)",
            }}
          >
            <VideoCameraOutlined style={{ color: "#fff", fontSize: "20px" }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
              {t("studentDashboard.liveClasses.title")}
            </Title>
            <AntText style={{ color: "#6b7280" }}>
              {t("studentDashboard.liveClasses.subtitle")}
            </AntText>
          </div>
        </div>
      </div>

      {zoomLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px", color: "#666" }}>
            Loading live classes...
          </div>
        </div>
      ) : zoomClasses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <VideoCameraOutlined
            style={{
              fontSize: "64px",
              color: "#d9d9d9",
              marginBottom: "16px",
            }}
          />
          <Title level={3} style={{ color: "#999" }}>
            No Active Live Classes
          </Title>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "16px" }}>
            <AntText strong style={{ fontSize: "16px" }}>
              {t("studentDashboard.liveClasses.yourClasses")} (
              {zoomClasses.length})
            </AntText>
          </div>
          {zoomClasses.map((meeting) => (
            <ZoomMeetingCard
              key={meeting.id}
              meeting={meeting}
              onJoinMeeting={onJoinClass}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLiveClasses;


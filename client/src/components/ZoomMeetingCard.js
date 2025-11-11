import React, { useState } from "react";
import {
  Card,
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Alert,
  Divider,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  VideoCameraOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LinkOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

const ZoomMeetingCard = ({ meeting, onJoinMeeting }) => {
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meeting.joinUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "live":
        return "success";
      case "scheduled":
        return "processing";
      case "ended":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
      case "live":
        return t("zoom.card.status.liveNow", "Live Now");
      case "scheduled":
        return t("zoom.card.status.scheduled", "Scheduled");
      case "ended":
        return t("zoom.card.status.ended", "Ended");
      default:
        return status;
    }
  };

  const isMeetingActive =
    meeting.status === "active" || meeting.status === "live";
  const isMeetingScheduled = meeting.status === "scheduled";

  return (
    <>
      <Card
        hoverable
        style={{
          marginBottom: 16,
          border: isMeetingActive ? "2px solid #52c41a" : "1px solid #d9d9d9",
          borderRadius: 12,
          background: isMeetingActive
            ? "linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Meeting Info */}
          <Col xs={24} sm={16}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <VideoCameraOutlined
                  style={{
                    fontSize: 20,
                    color: isMeetingActive ? "#52c41a" : "#1890ff",
                  }}
                />
                <Title level={4} style={{ margin: 0, color: "#262626" }}>
                  {meeting.title}
                </Title>
                <Tag color={getStatusColor(meeting.status)}>
                  {getStatusText(meeting.status)}
                </Tag>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Space>
                  <CalendarOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary">
                    {moment(meeting.startTime).format("MMM DD, YYYY")}
                  </Text>
                </Space>

                <Space>
                  <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary">
                    {moment(meeting.startTime).format("h:mm A")} (
                    {meeting.duration} min)
                  </Text>
                </Space>

                <Space>
                  <UserOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary">{meeting.teacherName}</Text>
                </Space>
              </div>

              {meeting.description && (
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ margin: 0, color: "#595959" }}
                >
                  {meeting.description}
                </Paragraph>
              )}

              {/* Meeting Details */}
              <div
                style={{
                  background: "#f8f9fa",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e9ecef",
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Text strong>
                      {t("zoom.card.meetingId", "Meeting ID")}:
                    </Text>
                    <br />
                    <Text code style={{ fontSize: 12 }}>
                      {meeting.meetingId}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("zoom.card.password", "Password")}:</Text>
                    <br />
                    <Text code style={{ fontSize: 12 }}>
                      {meeting.password}
                    </Text>
                  </Col>
                </Row>
              </div>
            </Space>
          </Col>

          {/* Action Buttons */}
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {isMeetingActive && (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => onJoinMeeting(meeting)}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a",
                    width: "100%",
                    height: 40,
                  }}
                >
                  {t("zoom.card.buttons.joinLiveClass", "Join Live Class")}
                </Button>
              )}

              {isMeetingScheduled && (
                <Button
                  type="default"
                  size="large"
                  icon={<CalendarOutlined />}
                  disabled
                  style={{ width: "100%", height: 40 }}
                >
                  {t("zoom.card.buttons.starts", "Starts")}{" "}
                  {moment(meeting.startTime).fromNow()}
                </Button>
              )}

              <Button
                icon={<LinkOutlined />}
                onClick={handleCopyLink}
                style={{ width: "100%" }}
              >
                {copySuccess ? (
                  <>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    {t("zoom.card.buttons.copied", "Copied!")}
                  </>
                ) : (
                  <>
                    <CopyOutlined />
                    {t("zoom.card.buttons.copyLink", "Copy Link")}
                  </>
                )}
              </Button>

              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => setInstructionsVisible(true)}
                style={{ width: "100%" }}
              >
                {t("zoom.card.buttons.instructions", "Instructions")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Instructions Modal */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined />
            {t("zoom.card.modal.title", "How to Join Your Live Class")}
          </Space>
        }
        open={instructionsVisible}
        onCancel={() => setInstructionsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInstructionsVisible(false)}>
            {t("zoom.card.modal.gotIt", "Got it!")}
          </Button>,
        ]}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            message={t("zoom.card.modal.alertTitle", "Live Class Instructions")}
            description={t(
              "zoom.card.modal.alertDesc",
              "Follow these steps to join your live class successfully."
            )}
            type="info"
            showIcon
          />

          <div>
            <Title level={5}>
              📋 {t("zoom.card.modal.beforeClass", "Before the Class")}:
            </Title>
            <ul>
              <li>
                {t(
                  "zoom.card.modal.tip1",
                  "Make sure you have a stable internet connection"
                )}
              </li>
              <li>
                {t("zoom.card.modal.tip2", "Test your camera and microphone")}
              </li>
              <li>
                {t(
                  "zoom.card.modal.tip3",
                  "Find a quiet place with good lighting"
                )}
              </li>
              <li>
                {t("zoom.card.modal.tip4", "Have your course materials ready")}
              </li>
            </ul>
          </div>

          <div>
            <Title level={5}>
              🚀 {t("zoom.card.modal.howToJoin", "How to Join")}:
            </Title>
            <ol>
              <li>
                <strong>
                  {t("zoom.card.modal.step1", 'Click "Join Live Class"')}
                </strong>{" "}
                {t("zoom.card.modal.step1b", "when the class is active")}
              </li>
              <li>
                <strong>
                  {t("zoom.card.modal.step2", "Or use the meeting details")}:
                </strong>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: 12,
                    borderRadius: 6,
                    marginTop: 8,
                  }}
                >
                  <Text strong>{t("zoom.card.meetingId", "Meeting ID")}:</Text>{" "}
                  <Text code>{meeting.meetingId}</Text>
                  <br />
                  <Text strong>
                    {t("zoom.card.password", "Password")}:
                  </Text>{" "}
                  <Text code>{meeting.password}</Text>
                </div>
              </li>
              <li>
                <strong>
                  {t("zoom.card.modal.step3", "Or click the direct link")}:
                </strong>
                <Button
                  type="link"
                  onClick={handleCopyLink}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  {t("zoom.card.modal.copyLink", "Copy Meeting Link")}
                </Button>
              </li>
            </ol>
          </div>

          <div>
            <Title level={5}>
              💡 {t("zoom.card.modal.tips", "Tips for Success")}:
            </Title>
            <ul>
              <li>
                {t(
                  "zoom.card.modal.tip5",
                  "Join 5 minutes early to test your connection"
                )}
              </li>
              <li>
                {t(
                  "zoom.card.modal.tip6",
                  "Mute your microphone when not speaking"
                )}
              </li>
              <li>
                {t(
                  "zoom.card.modal.tip7",
                  "Use the chat feature to ask questions"
                )}
              </li>
              <li>
                {t(
                  "zoom.card.modal.tip8",
                  "Participate actively in discussions"
                )}
              </li>
            </ul>
          </div>

          <div>
            <Title level={5}>
              🆘 {t("zoom.card.modal.needHelp", "Need Help")}?
            </Title>
            <Text>
              {t(
                "zoom.card.modal.helpText",
                "If you're having trouble joining, contact your instructor or check the"
              )}
              <Button type="link" style={{ padding: 0 }}>
                {t("zoom.card.modal.supportGuide", "technical support guide")}
              </Button>
              .
            </Text>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default ZoomMeetingCard;

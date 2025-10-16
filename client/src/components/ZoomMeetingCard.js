import React, { useState } from 'react';
import { Card, Button, Tag, Space, Typography, Modal, Alert, Divider, Row, Col, Tooltip } from 'antd';
import { 
  VideoCameraOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  LinkOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const ZoomMeetingCard = ({ meeting, onJoinMeeting }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meeting.joinUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'success';
      case 'scheduled':
        return 'processing';
      case 'ended':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'Live Now';
      case 'scheduled':
        return 'Scheduled';
      case 'ended':
        return 'Ended';
      default:
        return status;
    }
  };

  const isMeetingActive = meeting.status === 'active' || meeting.status === 'live';
  const isMeetingScheduled = meeting.status === 'scheduled';

  return (
    <>
      <Card
        hoverable
        style={{
          marginBottom: 16,
          border: isMeetingActive ? '2px solid #52c41a' : '1px solid #d9d9d9',
          borderRadius: 12,
          background: isMeetingActive 
            ? 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)'
            : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Meeting Info */}
          <Col xs={24} sm={16}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VideoCameraOutlined 
                  style={{ 
                    fontSize: 20, 
                    color: isMeetingActive ? '#52c41a' : '#1890ff' 
                  }} 
                />
                <Title level={4} style={{ margin: 0, color: '#262626' }}>
                  {meeting.title}
                </Title>
                <Tag color={getStatusColor(meeting.status)}>
                  {getStatusText(meeting.status)}
                </Tag>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Space>
                  <CalendarOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">
                    {moment(meeting.startTime).format('MMM DD, YYYY')}
                  </Text>
                </Space>
                
                <Space>
                  <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">
                    {moment(meeting.startTime).format('h:mm A')} ({meeting.duration} min)
                  </Text>
                </Space>
                
                <Space>
                  <UserOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">{meeting.teacherName}</Text>
                </Space>
              </div>

              {meeting.description && (
                <Paragraph 
                  ellipsis={{ rows: 2 }} 
                  style={{ margin: 0, color: '#595959' }}
                >
                  {meeting.description}
                </Paragraph>
              )}

              {/* Meeting Details */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 8,
                border: '1px solid #e9ecef'
              }}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Text strong>Meeting ID:</Text>
                    <br />
                    <Text code style={{ fontSize: 12 }}>
                      {meeting.meetingId}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Password:</Text>
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
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {isMeetingActive && (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => onJoinMeeting(meeting)}
                  style={{
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    width: '100%',
                    height: 40
                  }}
                >
                  Join Live Class
                </Button>
              )}

              {isMeetingScheduled && (
                <Button
                  type="default"
                  size="large"
                  icon={<CalendarOutlined />}
                  disabled
                  style={{ width: '100%', height: 40 }}
                >
                  Starts {moment(meeting.startTime).fromNow()}
                </Button>
              )}

              <Button
                icon={<LinkOutlined />}
                onClick={handleCopyLink}
                style={{ width: '100%' }}
              >
                {copySuccess ? (
                  <>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyOutlined />
                    Copy Link
                  </>
                )}
              </Button>

              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => setInstructionsVisible(true)}
                style={{ width: '100%' }}
              >
                Instructions
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
            How to Join Your Live Class
          </Space>
        }
        open={instructionsVisible}
        onCancel={() => setInstructionsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInstructionsVisible(false)}>
            Got it!
          </Button>
        ]}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Live Class Instructions"
            description="Follow these steps to join your live class successfully."
            type="info"
            showIcon
          />

          <div>
            <Title level={5}>📋 Before the Class:</Title>
            <ul>
              <li>Make sure you have a stable internet connection</li>
              <li>Test your camera and microphone</li>
              <li>Find a quiet place with good lighting</li>
              <li>Have your course materials ready</li>
            </ul>
          </div>

          <div>
            <Title level={5}>🚀 How to Join:</Title>
            <ol>
              <li>
                <strong>Click "Join Live Class"</strong> when the class is active
              </li>
              <li>
                <strong>Or use the meeting details:</strong>
                <div style={{ 
                  background: '#f5f5f5', 
                  padding: 12, 
                  borderRadius: 6, 
                  marginTop: 8 
                }}>
                  <Text strong>Meeting ID:</Text> <Text code>{meeting.meetingId}</Text><br />
                  <Text strong>Password:</Text> <Text code>{meeting.password}</Text>
                </div>
              </li>
              <li>
                <strong>Or click the direct link:</strong>
                <Button 
                  type="link" 
                  onClick={handleCopyLink}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  Copy Meeting Link
                </Button>
              </li>
            </ol>
          </div>

          <div>
            <Title level={5}>💡 Tips for Success:</Title>
            <ul>
              <li>Join 5 minutes early to test your connection</li>
              <li>Mute your microphone when not speaking</li>
              <li>Use the chat feature to ask questions</li>
              <li>Participate actively in discussions</li>
            </ul>
          </div>

          <div>
            <Title level={5}>🆘 Need Help?</Title>
            <Text>
              If you're having trouble joining, contact your instructor or check the 
              <Button type="link" style={{ padding: 0 }}>
                technical support guide
              </Button>.
            </Text>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default ZoomMeetingCard;

import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Statistic, Space, Tag, Typography,
  Row, Col, Timeline, Badge, Tooltip, message, Spin, Tabs,
  List, Avatar, Empty, Progress, Alert
} from 'antd';
import {
  BookOutlined, TrophyOutlined, CalendarOutlined, UserOutlined,
  CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  BellOutlined, EyeOutlined, StarOutlined, PercentageOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StudentProgress = ({ currentUser }) => {
  console.log('📊 StudentProgress component rendering, currentUser:', currentUser);

  const [loading, setLoading] = useState(true);
  const [progressRecords, setProgressRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);

  // Fetch student's progress records
  const fetchProgress = async () => {
    try {
      console.log('📊 Fetching student progress...');
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (response.ok) {
        const result = await response.json();
        console.log('✅ Progress fetched successfully:', result);
        setProgressRecords(result.progress || []);
      } else {
        console.error('❌ Failed to fetch progress:', response.status);
        message.error('Failed to fetch progress records');
      }
    } catch (error) {
      console.error('❌ Error fetching progress:', error);
      message.error('Error fetching progress records');
    }
  };

  // Fetch student's progress summary
  const fetchProgressSummary = async () => {
    try {
      console.log('📈 Fetching progress summary...');
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/progress/student/${currentUser.id}/summary`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );


      if (response.ok) {
        const result = await response.json();
        console.log('✅ Progress summary fetched successfully:', result);
        setProgressSummary(result.summary);
      } else {
        console.error('❌ Failed to fetch progress summary:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching progress summary:', error);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      console.log('📢 Fetching announcements...');
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Announcements fetched successfully:', result);
        setAnnouncements(result.announcements || []);
      } else {
        console.error('❌ Failed to fetch announcements:', response.status);
        message.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('❌ Error fetching announcements:', error);
      message.error('Error fetching announcements');
    }
  };

  // Mark announcement as read
  const markAnnouncementAsRead = async (announcementId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/announcements/${announcementId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        // Update local state
        setAnnouncements(prev => prev.map(ann => 
          ann._id === announcementId 
            ? { ...ann, isReadByCurrentUser: true }
            : ann
        ));
      }
    } catch (error) {
      console.error('❌ Error marking announcement as read:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProgress(),
        fetchProgressSummary(),
        fetchAnnouncements()
      ]);
      setLoading(false);
    };

    if (currentUser?.role === 'student') {
      loadData();
    }
  }, [currentUser]);

  // Progress table columns
  const progressColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Tag color="blue">{subject}</Tag>
    },
    {
      title: 'Assignment',
      dataIndex: 'assignment',
      key: 'assignment',
      render: (assignment) => <Text strong>{assignment}</Text>
    },
    {
      title: 'Type',
      dataIndex: 'assignmentType',
      key: 'assignmentType',
      render: (type) => {
        const colors = {
          homework: 'green',
          quiz: 'orange',
          exam: 'red',
          project: 'purple',
          participation: 'cyan'
        };
        return <Tag color={colors[type] || 'default'}>{type?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => (
        <Space>
          <Text strong>{score}/{record.maxScore}</Text>
          <Text type="secondary">({record.percentage}%)</Text>
        </Space>
      )
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade, record) => {
        const colors = {
          'A+': '#52c41a', 'A': '#52c41a', 'A-': '#52c41a',
          'B+': '#1890ff', 'B': '#1890ff', 'B-': '#1890ff',
          'C+': '#fa8c16', 'C': '#fa8c16', 'C-': '#fa8c16',
          'D+': '#f5222d', 'D': '#f5222d', 'F': '#f5222d'
        };
        return <Tag color={colors[grade]} style={{ fontWeight: 'bold' }}>{grade}</Tag>;
      }
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'
    },
    {
      title: 'Date Graded',
      dataIndex: 'gradedDate',
      key: 'gradedDate',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => {
            setSelectedProgress(record);
            setProgressModalVisible(true);
          }}
        >
          View Details
        </Button>
      )
    }
  ];

  // Get grade color for progress display
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#52c41a';
    if (percentage >= 80) return '#1890ff';
    if (percentage >= 70) return '#fa8c16';
    return '#f5222d';
  };

  // Get priority color for announcements
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'processing',
      high: 'warning',
      urgent: 'error'
    };
    return colors[priority] || 'default';
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading your progress...</Text>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'student') {
    return (
      <Alert
        message="Access Denied"
        description="This page is only available for students."
        type="warning"
        showIcon
      />
    );
  }

  const unreadAnnouncements = announcements.filter(ann => !ann.isReadByCurrentUser);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <TrophyOutlined style={{ marginRight: '8px' }} />
        My Progress
      </Title>

      {/* Summary Statistics */}
      {progressSummary && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Overall Average"
                value={progressSummary.averageScore}
                suffix="%"
                precision={1}
                valueStyle={{ color: getGradeColor(progressSummary.averageScore) }}
                prefix={<PercentageOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Assignments"
                value={progressSummary.totalRecords}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Subjects"
                value={Object.keys(progressSummary.subjectSummary || {}).length}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Unread Announcements"
                value={unreadAnnouncements.length}
                prefix={<BellOutlined />}
                valueStyle={{ color: unreadAnnouncements.length > 0 ? '#f5222d' : '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey="progress">
        <TabPane tab="Progress Records" key="progress">
          <Card
            title="My Grades"
            extra={
              <Space>
                <Text type="secondary">Total: {progressRecords.length}</Text>
              </Space>
            }
          >
            {progressRecords.length > 0 ? (
              <Table
                columns={progressColumns}
                dataSource={progressRecords}
                rowKey="_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 800 }}
              />
            ) : (
              <Empty description="No progress records found" />
            )}
          </Card>

          {/* Subject Progress Summary */}
          {progressSummary?.subjectSummary && (
            <Card title="Subject Performance" style={{ marginTop: '24px' }}>
              <Row gutter={[16, 16]}>
                {Object.entries(progressSummary.subjectSummary).map(([subject, data]) => (
                  <Col xs={24} sm={12} md={8} key={subject}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text strong>{subject}</Text>
                        <Progress
                          type="circle"
                          percent={Math.round(data.averageScore)}
                          width={80}
                          strokeColor={getGradeColor(data.averageScore)}
                          style={{ marginTop: '8px' }}
                        />
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary">{data.count} assignments</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </TabPane>

        <TabPane tab={
          <Badge count={unreadAnnouncements.length} offset={[10, 0]}>
            Announcements
          </Badge>
        } key="announcements">
          <Card title="Recent Announcements">
            {announcements.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={announcements}
                renderItem={(announcement) => (
                  <List.Item
                    key={announcement._id}
                    style={{
                      backgroundColor: announcement.isReadByCurrentUser ? '#fff' : '#f6ffed',
                      padding: '16px',
                      marginBottom: '8px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px'
                    }}
                    actions={[
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                          setAnnouncementModalVisible(true);
                          if (!announcement.isReadByCurrentUser) {
                            markAnnouncementAsRead(announcement._id);
                          }
                        }}
                      >
                        Read More
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<BellOutlined />} 
                          style={{ 
                            backgroundColor: getPriorityColor(announcement.priority) === 'error' ? '#ff4d4f' : '#1890ff'
                          }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{announcement.title}</Text>
                          <Tag color={getPriorityColor(announcement.priority)}>
                            {announcement.priority?.toUpperCase()}
                          </Tag>
                          {announcement.isSticky && <Tag color="gold">PINNED</Tag>}
                          {!announcement.isReadByCurrentUser && <Badge status="processing" text="New" />}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            By {announcement.author?.firstName} {announcement.author?.lastName}
                          </Text>
                          <Text type="secondary">
                            <CalendarOutlined /> {moment(announcement.publishDate).format('MMM DD, YYYY')}
                          </Text>
                        </Space>
                      }
                    />
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {announcement.content}
                    </Paragraph>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No announcements available" />
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Progress Detail Modal */}
      <Modal
        title="Progress Details"
        visible={progressModalVisible}
        onCancel={() => setProgressModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProgressModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedProgress && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Subject:</Text> <Tag color="blue">{selectedProgress.subject}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Assignment:</Text> <Text>{selectedProgress.assignment}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Type:</Text> <Tag>{selectedProgress.assignmentType}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Grade:</Text> <Tag color="green">{selectedProgress.grade}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Score:</Text> <Text>{selectedProgress.score}/{selectedProgress.maxScore} ({selectedProgress.percentage}%)</Text>
              </Col>
              <Col span={12}>
                <Text strong>Teacher:</Text> <Text>{selectedProgress.teacher?.firstName} {selectedProgress.teacher?.lastName}</Text>
              </Col>
            </Row>
            
            {selectedProgress.description && (
              <div>
                <Text strong>Description:</Text>
                <Paragraph>{selectedProgress.description}</Paragraph>
              </div>
            )}
            
            {selectedProgress.comments && (
              <div>
                <Text strong>Teacher Comments:</Text>
                <Paragraph style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '6px' }}>
                  {selectedProgress.comments}
                </Paragraph>
              </div>
            )}
            
            <Row gutter={[16, 16]}>
              {selectedProgress.submissionDate && (
                <Col span={12}>
                  <Text strong>Submitted:</Text> <Text>{moment(selectedProgress.submissionDate).format('MMM DD, YYYY')}</Text>
                </Col>
              )}
              <Col span={12}>
                <Text strong>Graded:</Text> <Text>{moment(selectedProgress.gradedDate).format('MMM DD, YYYY')}</Text>
              </Col>
            </Row>
          </Space>
        )}
      </Modal>

      {/* Announcement Detail Modal */}
      <Modal
        title={selectedAnnouncement?.title}
        visible={announcementModalVisible}
        onCancel={() => setAnnouncementModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAnnouncementModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedAnnouncement && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space>
              <Tag color={getPriorityColor(selectedAnnouncement.priority)}>
                {selectedAnnouncement.priority?.toUpperCase()}
              </Tag>
              <Tag>{selectedAnnouncement.type?.toUpperCase()}</Tag>
              {selectedAnnouncement.isSticky && <Tag color="gold">PINNED</Tag>}
            </Space>
            
            <div>
              <Text type="secondary">
                By {selectedAnnouncement.author?.firstName} {selectedAnnouncement.author?.lastName} • 
                Published {moment(selectedAnnouncement.publishDate).format('MMM DD, YYYY')}
              </Text>
            </div>
            
            <Paragraph>{selectedAnnouncement.content}</Paragraph>
            
            {selectedAnnouncement.subject && (
              <div>
                <Text strong>Subject:</Text> <Tag color="blue">{selectedAnnouncement.subject}</Tag>
              </div>
            )}
            
            {selectedAnnouncement.expiryDate && (
              <Alert
                message={`This announcement expires on ${moment(selectedAnnouncement.expiryDate).format('MMM DD, YYYY')}`}
                type="info"
                showIcon
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default StudentProgress;
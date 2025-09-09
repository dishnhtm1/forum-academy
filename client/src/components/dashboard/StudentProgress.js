import React, { useState, useEffect } from 'react';
import {
  Card, Table, Select, Space, Row, Col, Typography, Progress,
  Tag, Avatar, List, Badge, Statistic, Timeline, Alert, Button
} from 'antd';
import {
  UserOutlined, BookOutlined, TrophyOutlined, ClockCircleOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, BarChartOutlined
} from '@ant-design/icons';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

const { Title, Text } = Typography;
const { Option } = Select;

const StudentProgress = ({ currentUser }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedCourse || selectedStudent) {
      fetchProgressData();
    }
  }, [selectedCourse, selectedStudent]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users?role=student', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/progress/summary';
      const params = new URLSearchParams();
      
      if (selectedCourse) params.append('course', selectedCourse);
      if (selectedStudent) params.append('student', selectedStudent);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#52c41a';
    if (percentage >= 80) return '#1890ff';
    if (percentage >= 70) return '#faad14';
    if (percentage >= 60) return '#fa8c16';
    return '#f5222d';
  };

  const getPerformanceStatus = (percentage) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'success' };
    if (percentage >= 80) return { text: 'Good', color: 'processing' };
    if (percentage >= 70) return { text: 'Average', color: 'warning' };
    if (percentage >= 60) return { text: 'Below Average', color: 'error' };
    return { text: 'Needs Improvement', color: 'error' };
  };

  const studentColumns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.student.firstName} {record.student.lastName}</Text>
            <br />
            <Text type="secondary">{record.student.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Course',
      dataIndex: ['course', 'title'],
      key: 'course',
      render: (courseTitle, record) => (
        <div>
          <Text>{courseTitle}</Text>
          <br />
          <Tag color="blue" size="small">{record.course.code}</Tag>
        </div>
      )
    },
    {
      title: 'Overall Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.overallProgress} 
            strokeColor={getGradeColor(record.overallProgress)}
          />
          <Text type="secondary">{record.completedActivities}/{record.totalActivities} activities</Text>
        </div>
      )
    },
    {
      title: 'Average Grade',
      key: 'averageGrade',
      render: (_, record) => {
        const status = getPerformanceStatus(record.averageGrade);
        return (
          <div>
            <Text strong style={{ color: getGradeColor(record.averageGrade) }}>
              {record.averageGrade.toFixed(1)}%
            </Text>
            <br />
            <Tag color={status.color}>{status.text}</Tag>
          </div>
        );
      }
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.attendanceRate} 
            size="small"
            strokeColor="#52c41a"
          />
          <Text type="secondary">{record.attendedClasses}/{record.totalClasses} classes</Text>
        </div>
      )
    },
    {
      title: 'Last Activity',
      key: 'lastActivity',
      render: (_, record) => (
        <div>
          <Text>{record.lastActivity?.type || 'No activity'}</Text>
          <br />
          <Text type="secondary">
            {record.lastActivity?.date ? 
              new Date(record.lastActivity.date).toLocaleDateString() : 
              'Never'
            }
          </Text>
        </div>
      )
    }
  ];

  const recentActivitiesData = progressData.recentActivities || [];
  const performanceChartData = {
    labels: progressData.performanceChart?.labels || [],
    datasets: [{
      label: 'Average Score',
      data: progressData.performanceChart?.scores || [],
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.1)',
      tension: 0.4
    }]
  };

  const gradeDistributionData = {
    labels: ['A (90-100%)', 'B (80-89%)', 'C (70-79%)', 'D (60-69%)', 'F (0-59%)'],
    datasets: [{
      data: progressData.gradeDistribution || [0, 0, 0, 0, 0],
      backgroundColor: ['#52c41a', '#1890ff', '#faad14', '#fa8c16', '#f5222d']
    }]
  };

  return (
    <div>
      <Title level={2}>Student Progress Tracking</Title>
      
      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Filter by Course:</Text>
            <Select
              placeholder="Select course"
              style={{ width: '100%', marginTop: 8 }}
              value={selectedCourse}
              onChange={setSelectedCourse}
              allowClear
            >
              {courses.map(course => (
                <Option key={course._id} value={course._id}>
                  {course.title} ({course.code})
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>Filter by Student:</Text>
            <Select
              placeholder="Select student"
              style={{ width: '100%', marginTop: 8 }}
              value={selectedStudent}
              onChange={setSelectedStudent}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {students.map(student => (
                <Option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>Quick Stats:</Text>
            <div style={{ marginTop: 8 }}>
              <Badge count={progressData.totalStudents || 0} style={{ backgroundColor: '#52c41a' }}>
                <Text>Total Students</Text>
              </Badge>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Progress"
              value={progressData.averageProgress || 0}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Grade"
              value={progressData.averageGrade || 0}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getGradeColor(progressData.averageGrade || 0) }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Assignments"
              value={progressData.completedAssignments || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={progressData.pendingReviews || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card title="Performance Trend">
            {performanceChartData.labels.length > 0 ? (
              <Line 
                data={performanceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            ) : (
              <Alert message="No performance data available" type="info" />
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Grade Distribution">
            {gradeDistributionData.datasets[0].data.some(val => val > 0) ? (
              <Doughnut 
                data={gradeDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  }
                }}
              />
            ) : (
              <Alert message="No grade data available" type="info" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Student Progress Table */}
      <Card title="Student Progress Details" style={{ marginBottom: 24 }}>
        <Table
          columns={studentColumns}
          dataSource={progressData.students || []}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
        />
      </Card>

      {/* Recent Activities */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Recent Student Activities">
            {recentActivitiesData.length > 0 ? (
              <Timeline>
                {recentActivitiesData.slice(0, 10).map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    color={
                      activity.type === 'quiz' ? 'blue' :
                      activity.type === 'homework' ? 'green' :
                      activity.type === 'material' ? 'orange' : 'gray'
                    }
                  >
                    <div>
                      <Text strong>{activity.student.firstName} {activity.student.lastName}</Text>
                      <Text> {activity.action} </Text>
                      <Text type="secondary">{activity.item}</Text>
                      <br />
                      <Text type="secondary">{new Date(activity.timestamp).toLocaleString()}</Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Alert message="No recent activities" type="info" />
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Students Needing Attention">
            <List
              dataSource={progressData.studentsNeedingAttention || []}
              renderItem={student => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${student.firstName} ${student.lastName}`}
                    description={
                      <div>
                        <Text type="secondary">{student.course?.title}</Text>
                        <br />
                        <Space>
                          <Tag color="red">Progress: {student.progress}%</Tag>
                          <Tag color="orange">Grade: {student.grade}%</Tag>
                        </Space>
                      </div>
                    }
                  />
                  <Button size="small" type="primary">
                    Contact
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProgress;

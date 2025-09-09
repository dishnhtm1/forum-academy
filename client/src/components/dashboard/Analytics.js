import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Select, DatePicker, Space, Typography, Statistic,
  Table, Tag, Progress, Alert, Button, Tooltip
} from 'antd';
import {
  BarChartOutlined, LineChartOutlined, PieChartOutlined,
  TrophyOutlined, UserOutlined, BookOutlined, ClockCircleOutlined,
  DownloadOutlined, FileTextOutlined
} from '@ant-design/icons';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedCourse, selectedPeriod, dateRange]);

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

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (selectedCourse) params.append('course', selectedCourse);
      params.append('period', selectedPeriod);
      
      if (dateRange.length === 2) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }

      const response = await fetch(`/api/analytics/dashboard?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (selectedCourse) params.append('course', selectedCourse);
      params.append('period', selectedPeriod);
      
      if (dateRange.length === 2) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }

      const response = await fetch(`/api/analytics/export?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `analytics-report-${moment().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Chart configurations
  const engagementChartData = {
    labels: analyticsData.engagement?.labels || [],
    datasets: [{
      label: 'Daily Active Students',
      data: analyticsData.engagement?.data || [],
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.1)',
      tension: 0.4
    }]
  };

  const performanceChartData = {
    labels: analyticsData.performance?.courses || [],
    datasets: [{
      label: 'Average Score',
      data: analyticsData.performance?.scores || [],
      backgroundColor: [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', 
        '#722ed1', '#13c2c2', '#eb2f96', '#fa541c'
      ]
    }]
  };

  const completionRateData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: analyticsData.completionRates || [0, 0, 0],
      backgroundColor: ['#52c41a', '#faad14', '#f5222d']
    }]
  };

  const learningPathData = {
    labels: ['Quiz Performance', 'Homework Completion', 'Material Access', 'Participation', 'Attendance'],
    datasets: [{
      label: 'Class Average',
      data: analyticsData.learningPath?.classAverage || [0, 0, 0, 0, 0],
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.2)',
    }, {
      label: 'Top Performers',
      data: analyticsData.learningPath?.topPerformers || [0, 0, 0, 0, 0],
      borderColor: '#52c41a',
      backgroundColor: 'rgba(82, 196, 26, 0.2)',
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Top performers table
  const topPerformersColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank) => (
        <Tag color={rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'default'}>
          #{rank}
        </Tag>
      )
    },
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <Text strong>{record.student.firstName} {record.student.lastName}</Text>
      )
    },
    {
      title: 'Course',
      dataIndex: ['course', 'title'],
      key: 'course'
    },
    {
      title: 'Average Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score) => (
        <Progress 
          percent={score} 
          size="small"
          strokeColor={score >= 90 ? '#52c41a' : score >= 80 ? '#1890ff' : '#faad14'}
        />
      )
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate) => `${rate}%`
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Analytics & Reports</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportReport}
          >
            Export Report
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Text strong>Course:</Text>
            <Select
              placeholder="All Courses"
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
          <Col span={6}>
            <Text strong>Period:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            >
              <Option value="week">Last Week</Option>
              <Option value="month">Last Month</Option>
              <Option value="quarter">Last Quarter</Option>
              <Option value="year">Last Year</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Custom Range:</Text>
            <RangePicker 
              style={{ width: '100%', marginTop: 8 }}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
        </Row>
      </Card>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={analyticsData.totalStudents || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Courses"
              value={analyticsData.activeCourses || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Completion Rate"
              value={analyticsData.avgCompletionRate || 0}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Study Hours"
              value={analyticsData.totalStudyHours || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Student Engagement Trend" extra={<LineChartOutlined />}>
            {analyticsData.engagement?.labels?.length > 0 ? (
              <Line data={engagementChartData} options={chartOptions} />
            ) : (
              <Alert message="No engagement data available" type="info" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Course Performance" extra={<BarChartOutlined />}>
            {analyticsData.performance?.courses?.length > 0 ? (
              <Bar data={performanceChartData} options={chartOptions} />
            ) : (
              <Alert message="No performance data available" type="info" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Assignment Completion Rates" extra={<PieChartOutlined />}>
            {analyticsData.completionRates?.some(val => val > 0) ? (
              <Doughnut 
                data={completionRateData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  }
                }}
              />
            ) : (
              <Alert message="No completion data available" type="info" />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Learning Path Analysis">
            {analyticsData.learningPath?.classAverage?.length > 0 ? (
              <Radar data={learningPathData} options={radarOptions} />
            ) : (
              <Alert message="No learning path data available" type="info" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Detailed Tables */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Top Performers" extra={<TrophyOutlined />}>
            <Table
              columns={topPerformersColumns}
              dataSource={analyticsData.topPerformers || []}
              loading={loading}
              size="small"
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Course Statistics">
            <Table
              columns={[
                {
                  title: 'Course',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <Text strong>{text}</Text>
                      <br />
                      <Tag color="blue" size="small">{record.code}</Tag>
                    </div>
                  )
                },
                {
                  title: 'Students',
                  dataIndex: 'studentCount',
                  key: 'studentCount'
                },
                {
                  title: 'Avg. Score',
                  dataIndex: 'averageScore',
                  key: 'averageScore',
                  render: (score) => (
                    <Tag color={score >= 80 ? 'green' : score >= 70 ? 'orange' : 'red'}>
                      {score}%
                    </Tag>
                  )
                },
                {
                  title: 'Completion',
                  dataIndex: 'completionRate',
                  key: 'completionRate',
                  render: (rate) => (
                    <Progress percent={rate} size="small" />
                  )
                }
              ]}
              dataSource={analyticsData.courseStats || []}
              loading={loading}
              size="small"
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>

      {/* Activity Summary */}
      <Card title="Recent Activity Summary" extra={<FileTextOutlined />}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Quizzes Completed"
              value={analyticsData.activitySummary?.quizzesCompleted || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Homework Submitted"
              value={analyticsData.activitySummary?.homeworkSubmitted || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Materials Downloaded"
              value={analyticsData.activitySummary?.materialsDownloaded || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Listening Exercises"
              value={analyticsData.activitySummary?.listeningExercises || 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Insights and Recommendations */}
      {analyticsData.insights && analyticsData.insights.length > 0 && (
        <Card title="Insights & Recommendations" style={{ marginTop: 24 }}>
          {analyticsData.insights.map((insight, index) => (
            <Alert
              key={index}
              message={insight.title}
              description={insight.description}
              type={insight.type}
              style={{ marginBottom: 8 }}
              showIcon
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default Analytics;

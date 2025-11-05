import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Select,
  DatePicker,
  Statistic,
  Empty,
} from "antd";
import {
  BarChartOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { statsAPI, courseAPI, quizAPI, homeworkAPI, progressAPI } from "../../utils/apiClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

const { Title, Text } = Typography;
const { Option } = Select;

const TeacherAnalytics = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;

  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalSubmissions: 0,
    averageScore: 0,
  });
  const [performanceData, setPerformanceData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Average Score (%)",
      data: [0, 0, 0, 0],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    }],
  });
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [coursesRes, quizzesRes, homeworksRes, progressRes] = await Promise.all([
        courseAPI.getAll(),
        quizAPI.getAll(),
        homeworkAPI.getAll(),
        progressAPI.getAll(),
      ]);

      const courses = coursesRes.courses || coursesRes || [];
      const teacherCourses = courses.filter(
        (course) => course.teacher === currentUser?.id || course.teacherId === currentUser?.id
      );

      const quizzes = quizzesRes.quizzes || quizzesRes || [];
      const teacherQuizzes = quizzes.filter(
        (quiz) => quiz.teacher === currentUser?.id || quiz.teacherId === currentUser?.id
      );

      const homeworks = homeworksRes.homeworks || homeworksRes || [];
      const teacherHomeworks = homeworks.filter(
        (homework) => homework.teacher === currentUser?.id || homework.teacherId === currentUser?.id
      );

      const progress = progressRes.progress || progressRes || [];
      const teacherProgress = progress.filter(
        (p) => p.teacher === currentUser?.id || p.teacherId === currentUser?.id
      );

      // Calculate stats
      let totalStudents = 0;
      teacherCourses.forEach((course) => {
        if (course.students && Array.isArray(course.students)) {
          totalStudents += course.students.length;
        }
      });

      const totalSubmissions = teacherProgress.length;
      const totalScore = teacherProgress.reduce((sum, p) => sum + (p.score || 0), 0);
      const averageScore = totalSubmissions > 0 ? Math.round((totalScore / totalSubmissions) * 100) / 100 : 0;

      setAnalyticsData({
        totalStudents,
        totalCourses: teacherCourses.length,
        totalSubmissions,
        averageScore,
      });

      // Calculate performance trends (simplified)
      const weeklyData = [0, 0, 0, 0];
      teacherProgress.forEach((p) => {
        if (p.createdAt) {
          const weekAgo = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weekAgo >= 0 && weekAgo < 4) {
            weeklyData[weekAgo] = (weeklyData[weekAgo] || 0) + (p.score || 0);
          }
        }
      });

      setPerformanceData({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          label: "Average Score (%)",
          data: weeklyData.map(d => d > 0 ? Math.round((d / totalSubmissions) * 100) : 0),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        }],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <BarChartOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.analytics") || "Analytics"}
            </Title>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={analyticsData.totalStudents}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={analyticsData.totalCourses}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Submissions"
                value={analyticsData.totalSubmissions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Average Score"
                value={analyticsData.averageScore}
                prefix={<RiseOutlined />}
                suffix="%"
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Performance Trends">
              <Line data={performanceData} options={{ responsive: true }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Score Distribution">
              <Doughnut
                data={{
                  labels: ["A", "B", "C", "D", "F"],
                  datasets: [{
                    data: [20, 30, 25, 15, 10],
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(153, 102, 255, 0.6)",
                    ],
                  }],
                }}
                options={{ responsive: true }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TeacherAnalytics;

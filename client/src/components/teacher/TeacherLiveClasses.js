import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Input,
  InputNumber,
  Select,
  Button,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Form,
  Modal,
  DatePicker,
  Empty,
  List,
  Statistic,
  Divider,
} from "antd";
import {
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import zoomApiService from "../../services/zoomApiService";
import { courseAPI } from "../../utils/apiClient";
import ZoomMeeting from "../ZoomMeeting";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const categoryColors = {
  language: "#6366f1",
  business: "#06b6d4",
  technology: "#8b5cf6",
  arts: "#ec4899",
  science: "#3b82f6",
  other: "#22c55e",
};

const normalizeId = value => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value._id ||
      value.id ||
      value.userId ||
      value.value ||
      (typeof value.toString === "function" ? value.toString() : undefined)
    );
  }
  return undefined;
};

const TeacherLiveClasses = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [zoomForm] = Form.useForm();

  const [zoomClasses, setZoomClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [embeddedZoomVisible, setEmbeddedZoomVisible] = useState(false);
  const [currentLiveClass, setCurrentLiveClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [defaultCourseId, setDefaultCourseId] = useState(null);

  const teacherIdentifier = useMemo(() => {
    if (!currentUser) return undefined;

    const candidates = [
      currentUser._id,
      currentUser.id,
      currentUser.userId,
      currentUser.user?._id,
      currentUser.user?.id,
      currentUser.profile?._id,
      currentUser.profile?.id,
      currentUser.defaultUserId,
    ];

    for (const candidate of candidates) {
      const normalized = normalizeId(candidate);
      if (normalized) return normalized;
    }

    return undefined;
  }, [currentUser]);

  const teacherEmail = useMemo(() => {
    if (!currentUser) return undefined;
    return (
      currentUser.email ||
      currentUser.user?.email ||
      currentUser.profile?.email ||
      currentUser.username ||
      currentUser.user?.username ||
      undefined
    );
  }, [currentUser]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getAll();
      if (response?.success !== false) {
        const payload = Array.isArray(response)
          ? response
          : Array.isArray(response.courses)
          ? response.courses
          : Array.isArray(response.data)
          ? response.data
          : [];
        const teacherCourses = payload.filter(course => {
          const courseTeacherId =
            normalizeId(course.teacherId) ||
            normalizeId(course.teacher) ||
            normalizeId(course?.instructor) ||
            normalizeId(course?.owner);
          const courseTeacherEmail =
            course.teacherEmail ||
            course.teacher_email ||
            course.teacher?.email ||
            course.instructor?.email ||
            course.owner?.email;

          if (teacherIdentifier || teacherEmail) {
            const matchesId =
              teacherIdentifier &&
              (courseTeacherId === teacherIdentifier || courseTeacherEmail === teacherIdentifier);
            const matchesEmail =
              teacherEmail &&
              (courseTeacherEmail === teacherEmail || courseTeacherId === teacherEmail);
            return matchesId || matchesEmail;
          }
          return true;
        });
        setCourses(teacherCourses.length ? teacherCourses : payload);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [teacherIdentifier, teacherEmail]);

  const fetchZoomMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await zoomApiService.getMeetings();
      if (response.success) {
        const allMeetings = response.meetings || [];
        setZoomClasses(allMeetings);
      }
    } catch (error) {
      console.error("Error fetching Zoom meetings:", error);
      message.error("Failed to fetch Zoom meetings");
    } finally {
      setLoading(false);
    }
  }, [teacherIdentifier, teacherEmail]);

  useEffect(() => {
    fetchCourses();
    fetchZoomMeetings();
  }, [fetchCourses, fetchZoomMeetings]);

  useEffect(() => {
    if (!zoomModalVisible || editingClass || !defaultCourseId) return;
    zoomForm.setFieldsValue({ courseId: defaultCourseId });
  }, [zoomModalVisible, editingClass, defaultCourseId, zoomForm]);

  const handleCreateMeeting = async (values) => {
    try {
      const meetingData = {
        title: values.topic,
        topic: values.topic,
        course: values.courseId,
        courseId: values.courseId,
        startTime: values.dateTime ? values.dateTime.format() : new Date().toISOString(),
        duration: values.duration || 60,
        description: values.description || "",
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
        teacherName:
          currentUser?.name ||
          currentUser?.fullName ||
          (currentUser?.firstName && currentUser?.lastName
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : currentUser?.username || currentUser?.email || ""),
      };

      if (editingClass) {
        const meetingId = editingClass._id || editingClass.id || editingClass.meetingId;
        if (!meetingId) {
          throw new Error("Meeting identifier missing; please refresh and try again.");
        }
        await zoomApiService.updateMeeting(meetingId, meetingData);
        message.success("Meeting updated successfully");
      } else {
        await zoomApiService.createMeeting(meetingData);
        message.success("Meeting created successfully");
      }

      setZoomModalVisible(false);
      zoomForm.resetFields();
      setEditingClass(null);
      setDefaultCourseId(null);
      fetchZoomMeetings();
    } catch (error) {
      message.error(error.message || "Error saving meeting");
    }
  };

  const handleEditClass = (zoomClass) => {
    setEditingClass(zoomClass);
    zoomForm.setFieldsValue({
      topic: zoomClass.topic,
      courseId:
        zoomClass.course?._id ||
        zoomClass.courseId ||
        (typeof zoomClass.course === "string" ? zoomClass.course : zoomClass.course?.id),
      dateTime: zoomClass.startTime ? moment(zoomClass.startTime) : null,
      duration: zoomClass.duration || 60,
      description: zoomClass.description || "",
    });
    setZoomModalVisible(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await zoomApiService.deleteMeeting(meetingId);
      message.success("Meeting deleted successfully");
      fetchZoomMeetings();
    } catch (err) {
      message.error("Failed to delete meeting");
    }
  };

  const handleStartMeeting = zoomClass => {
    if (!zoomClass) return;

    const normalizedMeetingId =
      zoomClass.meetingId ||
      zoomClass.meetingNumber ||
      zoomClass._id ||
      zoomClass.id ||
      zoomClass?.meeting?.meetingId;

    const normalizedMeeting = {
      ...zoomClass,
      meetingId: normalizedMeetingId,
      title:
        zoomClass.title ||
        zoomClass.topic ||
        zoomClass.description ||
        zoomClass.courseName ||
        t("teacherDashboard.liveClasses.cards.untitled", { defaultValue: "Untitled session" }),
      meetingPassword: zoomClass.meetingPassword || zoomClass.password,
      userEmail: currentUser?.email,
      userId: currentUser?._id || currentUser?.id,
      userName:
        currentUser?.name ||
        currentUser?.fullName ||
        (currentUser?.firstName && currentUser?.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : currentUser?.username || currentUser?.email || "Teacher"),
    };

    if (!normalizedMeeting.meetingId) {
      message.error(t("teacherDashboard.liveClasses.errors.noMeetingId", { defaultValue: "Meeting ID missing. Please refresh the page." }));
      return;
    }

    setCurrentLiveClass(normalizedMeeting);
    setEmbeddedZoomVisible(true);
  };
  const openScheduleForCourse = courseId => {
    setEditingClass(null);
    setDefaultCourseId(courseId || null);
    zoomForm.resetFields();
    setZoomModalVisible(true);
  };

  const groupedLiveClasses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const meetingMatchesSearch = meeting => {
      if (!normalizedSearch) return true;
      return (
        meeting.topic?.toLowerCase().includes(normalizedSearch) ||
        meeting.description?.toLowerCase().includes(normalizedSearch)
      );
    };

    const courseMatchesSearch = course => {
      if (!normalizedSearch) return true;
      return (
        course.title?.toLowerCase().includes(normalizedSearch) ||
        course.code?.toLowerCase().includes(normalizedSearch) ||
        course.category?.toLowerCase().includes(normalizedSearch)
      );
    };

    const map = new Map();
    const groups = courses.map(course => {
      const courseKey = normalizeId(course._id || course.id) || course.code;
      const group = {
        course,
        courseId: courseKey,
        meetings: [],
        upcoming: [],
        past: [],
        nextMeeting: null,
        matchesCourse: courseMatchesSearch(course),
        visible: true,
      };
      if (courseKey) {
        map.set(courseKey, group);
      }
      return group;
    });

    const unassigned = [];
    const now = moment();

    zoomClasses.forEach(meeting => {
      const meetingCourseKey = normalizeId(
        meeting?.course?._id ||
          meeting?.courseId ||
          meeting?.course
      );
      const meetingClone = { ...meeting };
      meetingClone.startMoment = meeting.startTime ? moment(meeting.startTime) : null;
      meetingClone.matchesSearch = meetingMatchesSearch(meeting);
      if (meetingCourseKey && map.has(meetingCourseKey)) {
        map.get(meetingCourseKey).meetings.push(meetingClone);
      } else {
        unassigned.push(meetingClone);
      }
    });

    groups.forEach(group => {
      group.upcoming = group.meetings
        .filter(meeting => meeting.startMoment && meeting.startMoment.isSameOrAfter(now))
        .sort((a, b) => a.startMoment - b.startMoment);

      group.past = group.meetings
        .filter(meeting => !meeting.startMoment || meeting.startMoment.isBefore(now))
        .sort((a, b) => {
          if (!a.startMoment || !b.startMoment) return 0;
          return b.startMoment - a.startMoment;
        });

      group.nextMeeting = group.upcoming[0] || null;

      if (normalizedSearch) {
        const matchesMeeting = group.meetings.some(meeting => meeting.matchesSearch);
        group.visible = group.matchesCourse || matchesMeeting;
      } else {
        group.visible = true;
      }
    });

    const filteredGroups = groups.filter(group => group.visible);

    const filteredUnassigned = normalizedSearch
      ? unassigned.filter(meeting => meeting.matchesSearch)
      : unassigned;

    return { groups: filteredGroups, unassigned: filteredUnassigned };
  }, [courses, zoomClasses, searchTerm]);

  const { groups: groupedCourses, unassigned: unassignedMeetings } = groupedLiveClasses;

  const liveClassStats = useMemo(() => {
    const now = moment();
    const totalMeetings = zoomClasses.length;
    const upcomingCount = zoomClasses.filter(meeting => {
      const start = meeting.startTime ? moment(meeting.startTime) : null;
      return start && start.isSameOrAfter(now);
    }).length;
    const pastCount = totalMeetings - upcomingCount;
    const activeCourses = groupedCourses.filter(group => group.meetings.length > 0).length;

    return {
      totalMeetings,
      upcomingCount,
      pastCount,
      totalCourses: courses.length,
      activeCourses,
    };
  }, [zoomClasses, groupedCourses, courses.length]);

  const renderCourseCard = group => {
    const { course, courseId, nextMeeting, upcoming, past } = group;
    const courseColor = categoryColors[course.category] || "#2563eb";
    const remainingUpcoming = nextMeeting ? upcoming.slice(1) : upcoming;
    const nextStartMoment = nextMeeting?.startMoment;
    const nextStartFormatted = nextStartMoment
      ? nextStartMoment.format("MMM DD, YYYY HH:mm")
      : t("teacherDashboard.liveClasses.cards.noUpcoming", { defaultValue: "No upcoming sessions" });

    const renderMeetingActions = (meeting, includeStart) => {
      const meetingId = meeting.id || meeting._id;
      return (
        <Space>
          {includeStart && (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartMeeting(meeting)}
            >
              {t("teacherDashboard.liveClasses.cards.start", { defaultValue: "Start" })}
            </Button>
          )}
          <Tooltip title={t("teacherDashboard.liveClasses.cards.edit", { defaultValue: "Edit" })}>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEditClass(meeting)} />
          </Tooltip>
          <Popconfirm
            title={t("teacherDashboard.liveClasses.cards.confirmDelete", {
              defaultValue: "Delete this live class?",
            })}
            okText={t("common.confirm", { defaultValue: "Confirm" })}
            cancelText={t("common.cancel", { defaultValue: "Cancel" })}
            onConfirm={() => handleDeleteMeeting(meetingId)}
          >
            <Tooltip title={t("teacherDashboard.liveClasses.cards.delete", { defaultValue: "Delete" })}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      );
    };

    return (
      <Col key={courseId || course.code} xs={24} sm={12} lg={8} xl={6} style={{ display: "flex" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 22,
            width: "100%",
            background: "linear-gradient(140deg, rgba(255,255,255,0.95) 0%, #f8fafc 100%)",
            boxShadow: "0 24px 45px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
          }}
          bodyStyle={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}
        >
          <Space align="start" style={{ width: "100%", justifyContent: "space-between" }} wrap>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {course.code}
              </Text>
              <Title level={4} style={{ margin: 0 }}>
                {course.title}
              </Title>
            </Space>
            <Space direction="vertical" size={8} align="end">
              <Tag color={courseColor} style={{ color: "#ffffff", borderRadius: 999 }}>
                {course.category || t("teacherDashboard.myClasses.labels.other", { defaultValue: "Other" })}
              </Tag>
              <Tag color="#2563eb">
                {t("teacherDashboard.liveClasses.cards.sessionsCount", {
                  defaultValue: "{{count}} sessions",
                  count: group.meetings.length,
                })}
              </Tag>
            </Space>
          </Space>

          {nextMeeting ? (
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(37,99,235,0.16) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Space align="start" size={14}>
                <VideoCameraOutlined style={{ fontSize: 28, color: courseColor }} />
                <Space direction="vertical" size={2}>
                  <Text type="secondary" style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {t("teacherDashboard.liveClasses.cards.next", { defaultValue: "Next session" })}
                  </Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {nextMeeting.title ||
                      nextMeeting.topic ||
                      t("teacherDashboard.liveClasses.cards.untitled", { defaultValue: "Untitled session" })}
                  </Text>
                  <Text type="secondary">
                    {nextStartFormatted} · {(nextMeeting.duration || 60)} {t("teacherDashboard.liveClasses.cards.minutes", { defaultValue: "min" })}
                  </Text>
                </Space>
              </Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartMeeting(nextMeeting)}
              >
                {t("teacherDashboard.liveClasses.cards.start", { defaultValue: "Start" })}
              </Button>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                border: "1px dashed rgba(99,102,241,0.3)",
                background: "rgba(255,255,255,0.7)",
                textAlign: "center",
              }}
            >
              <Text type="secondary">
                {t("teacherDashboard.liveClasses.cards.noUpcoming", {
                  defaultValue: "No upcoming sessions scheduled.",
                })}
              </Text>
            </div>
          )}

          {remainingUpcoming.length > 0 && (
            <div>
              <Divider style={{ margin: "8px 0" }}>
                {t("teacherDashboard.liveClasses.cards.upcoming", { defaultValue: "Upcoming sessions" })}
              </Divider>
              <List
                dataSource={remainingUpcoming}
                split={false}
                renderItem={meeting => {
                  const startMoment = meeting.startMoment || (meeting.startTime ? moment(meeting.startTime) : null);
                  const formatted = startMoment
                    ? startMoment.format("MMM DD, YYYY HH:mm")
                    : t("teacherDashboard.liveClasses.cards.noDate", { defaultValue: "Schedule TBD" });
                  return (
                    <List.Item actions={[renderMeetingActions(meeting, true)]}>
                      <List.Item.Meta
                        title={meeting.title || meeting.topic || t("teacherDashboard.liveClasses.cards.untitled", { defaultValue: "Untitled session" })}
                        description={`${formatted} · ${(meeting.duration || 60)} ${t("teacherDashboard.liveClasses.cards.minutes", { defaultValue: "min" })}`}
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          )}

          {past.length > 0 && (
            <div>
              <Divider style={{ margin: "8px 0" }}>
                {t("teacherDashboard.liveClasses.cards.past", { defaultValue: "Recent sessions" })}
              </Divider>
              <List
                dataSource={past}
                split={false}
                renderItem={meeting => {
                  const startMoment = meeting.startMoment || (meeting.startTime ? moment(meeting.startTime) : null);
                  const formatted = startMoment
                    ? startMoment.format("MMM DD, YYYY HH:mm")
                    : t("teacherDashboard.liveClasses.cards.noDate", { defaultValue: "Schedule TBD" });
                  return (
                    <List.Item actions={[renderMeetingActions(meeting, false)]}>
                      <List.Item.Meta
                        title={meeting.title || meeting.topic || t("teacherDashboard.liveClasses.cards.untitled", { defaultValue: "Untitled session" })}
                        description={`${formatted} · ${(meeting.duration || 60)} ${t("teacherDashboard.liveClasses.cards.minutes", { defaultValue: "min" })}`}
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          )}

          <Button
            type="primary"
            icon={nextMeeting ? <PlayCircleOutlined /> : <PlusOutlined />}
            onClick={() => {
              if (nextMeeting) {
                handleStartMeeting(nextMeeting);
              } else {
                openScheduleForCourse(courseId);
              }
            }}
            style={{ marginTop: "auto" }}
          >
            {nextMeeting
              ? t("teacherDashboard.liveClasses.cards.startNext", { defaultValue: "Start live class" })
              : t("teacherDashboard.liveClasses.cards.schedule", { defaultValue: "Schedule live class" })}
          </Button>
        </Card>
      </Col>
    );
  };

  const renderUnassignedCard = () => (
    <Card
      bordered={false}
      style={{
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        background: "#ffffff",
      }}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space align="baseline" size={12}>
          <VideoCameraOutlined style={{ fontSize: 24, color: "#f97316" }} />
          <Title level={4} style={{ margin: 0 }}>
            {t("teacherDashboard.liveClasses.unassigned.title", { defaultValue: "Unassigned meetings" })}
          </Title>
        </Space>
        <Text type="secondary">
          {t("teacherDashboard.liveClasses.unassigned.description", {
            defaultValue: "These live classes aren't linked to any course yet. Edit them to assign a course.",
          })}
        </Text>
        <List
          dataSource={unassignedMeetings}
          split={false}
          renderItem={meeting => {
            const startMoment = meeting.startMoment || (meeting.startTime ? moment(meeting.startTime) : null);
            const formatted = startMoment
              ? startMoment.format("MMM DD, YYYY HH:mm")
              : t("teacherDashboard.liveClasses.cards.noDate", { defaultValue: "Schedule TBD" });
            return (
              <List.Item
                actions={[
                  <Tooltip key="edit" title={t("teacherDashboard.liveClasses.cards.edit", { defaultValue: "Edit" })}>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEditClass(meeting)} />
                  </Tooltip>,
                  <Popconfirm
                    key="delete"
                    title={t("teacherDashboard.liveClasses.cards.confirmDelete", {
                      defaultValue: "Delete this live class?",
                    })}
                    okText={t("common.confirm", { defaultValue: "Confirm" })}
                    cancelText={t("common.cancel", { defaultValue: "Cancel" })}
                    onConfirm={() => handleDeleteMeeting(meeting.id || meeting._id)}
                  >
                    <Tooltip title={t("teacherDashboard.liveClasses.cards.delete", { defaultValue: "Delete" })}>
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={meeting.title || meeting.topic || t("teacherDashboard.liveClasses.cards.untitled", { defaultValue: "Untitled session" })}
                  description={`${formatted} · ${(meeting.duration || 60)} ${t("teacherDashboard.liveClasses.cards.minutes", { defaultValue: "min" })}`}
                />
              </List.Item>
            );
          }}
        />
      </Space>
    </Card>
  );

  const handleModalClose = () => {
    setZoomModalVisible(false);
    setEditingClass(null);
    zoomForm.resetFields();
    setDefaultCourseId(null);
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <Space direction="vertical" size={isMobile ? 16 : 24} style={{ width: "100%" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.1)",
            background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
          }}
          bodyStyle={{ padding: isMobile ? 18 : 28 }}
        >
          <Space direction="vertical" size={isMobile ? 14 : 20} style={{ width: "100%" }}>
            <Space align="center" size={16} wrap>
              <VideoCameraOutlined style={{ fontSize: isMobile ? 28 : 32, color: "#2563eb" }} />
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ letterSpacing: 1, fontSize: 12, textTransform: "uppercase" }}>
                  {t("teacherDashboard.liveClasses.subtitle", { defaultValue: "Live Zoom sessions" })}
                </Text>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                  {t("teacherDashboard.liveClasses.title", { defaultValue: "Live Classes" })}
                </Title>
              </Space>
            </Space>

            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                  <Statistic
                    title={t("teacherDashboard.liveClasses.metrics.total", { defaultValue: "Total sessions" })}
                    value={liveClassStats.totalMeetings}
                    valueStyle={{ color: "#4338ca" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                  <Statistic
                    title={t("teacherDashboard.liveClasses.metrics.upcoming", { defaultValue: "Upcoming" })}
                    value={liveClassStats.upcomingCount}
                    valueStyle={{ color: "#0ea5e9" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                  <Statistic
                    title={t("teacherDashboard.liveClasses.metrics.past", { defaultValue: "Completed" })}
                    value={liveClassStats.pastCount}
                    valueStyle={{ color: "#f97316" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Card bordered={false} style={{ borderRadius: 18, height: "100%" }}>
                  <Statistic
                    title={t("teacherDashboard.liveClasses.metrics.courses", { defaultValue: "Courses with live classes" })}
                    value={liveClassStats.activeCourses}
                    valueStyle={{ color: "#0ea5e9" }}
                    suffix={`/${liveClassStats.totalCourses}`}
                  />
                </Card>
              </Col>
            </Row>

            <Space
              wrap
              size={12}
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Input
                allowClear
                size="large"
                placeholder={t("teacherDashboard.liveClasses.search", { defaultValue: "Search live classes" })}
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                style={{ width: isMobile ? "100%" : 320 }}
              />
              <Space wrap size={12}>
                <Button icon={<ReloadOutlined />} onClick={fetchZoomMeetings}>
                  {t("teacherDashboard.liveClasses.actions.refresh", { defaultValue: "Refresh" })}
                </Button>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openScheduleForCourse(null)}>
                  {t("teacherDashboard.liveClasses.cards.schedule", { defaultValue: "Schedule live class" })}
                </Button>
              </Space>
            </Space>
          </Space>
        </Card>

        <Row gutter={[18, 18]}>
          {groupedCourses.length ? (
            groupedCourses.map(renderCourseCard)
          ) : (
            <Col span={24}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 22,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                  background: "#ffffff",
                }}
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t("teacherDashboard.liveClasses.noClasses", { defaultValue: "No live classes yet" })}
                />
              </Card>
            </Col>
          )}
        </Row>

        {unassignedMeetings.length > 0 && renderUnassignedCard()}
      </Space>

      {/* Create/Edit Zoom Meeting Modal */}
      <Modal
        title={editingClass
          ? t("teacherDashboard.liveClasses.modal.editTitle", { defaultValue: "Edit meeting" })
          : t("teacherDashboard.liveClasses.modal.createTitle", { defaultValue: "Create meeting" })}
        open={zoomModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form form={zoomForm} layout="vertical" onFinish={handleCreateMeeting}>
          <Form.Item
            name="courseId"
            label={t("teacherDashboard.liveClasses.modal.course", { defaultValue: "Course" })}
            rules={[{ required: true, message: t("teacherDashboard.liveClasses.modal.courseRequired", { defaultValue: "Please select a course" }) }]}
          >
            <Select placeholder={t("teacherDashboard.liveClasses.modal.coursePlaceholder", { defaultValue: "Select course" })}>
              {courses.map((course) => (
                <Option key={course._id || course.id} value={course._id || course.id}>
                  {course.title} ({course.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="topic"
            label={t("teacherDashboard.liveClasses.modal.topic", { defaultValue: "Meeting topic" })}
            rules={[{ required: true, message: t("teacherDashboard.liveClasses.modal.topicRequired", { defaultValue: "Please enter meeting topic" }) }]}
          >
            <Input placeholder={t("teacherDashboard.liveClasses.modal.topicPlaceholder", { defaultValue: "Topic" })} />
          </Form.Item>
          <Form.Item name="description" label={t("teacherDashboard.liveClasses.modal.description", { defaultValue: "Description" })}>
            <TextArea rows={4} placeholder={t("teacherDashboard.liveClasses.modal.descriptionPlaceholder", { defaultValue: "Optional details" })} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label={t("teacherDashboard.liveClasses.modal.dateTime", { defaultValue: "Start date & time" })}
                rules={[{ required: true, message: t("teacherDashboard.liveClasses.modal.dateTimeRequired", { defaultValue: "Please select start time" }) }]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label={t("teacherDashboard.liveClasses.modal.duration", { defaultValue: "Duration (minutes)" })}
                initialValue={60}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingClass ? t("teacherDashboard.liveClasses.actions.update", { defaultValue: "Update" }) : t("teacherDashboard.liveClasses.actions.create", { defaultValue: "Create" })}
              </Button>
              <Button onClick={handleModalClose}>{t("common.cancel", { defaultValue: "Cancel" })}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Zoom Meeting Modal */}
      {embeddedZoomVisible && currentLiveClass && (
        <Modal
          title={t("teacherDashboard.liveClasses.modal.liveClassTitle", { defaultValue: "Live class" })}
          open={embeddedZoomVisible}
          onCancel={() => {
            setEmbeddedZoomVisible(false);
            setCurrentLiveClass(null);
          }}
          footer={null}
          width={1000}
          style={{ top: 20 }}
        >
          <ZoomMeeting
            meetingId={currentLiveClass.meetingId}
            meetingData={currentLiveClass}
            isHost
          />
        </Modal>
      )}
    </div>
  );
};

export default TeacherLiveClasses;

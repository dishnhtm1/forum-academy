import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  Space,
  Dropdown,
  message,
  Empty,
  Tooltip,
  Statistic,
  Alert,
  Table,
  Tabs,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ReadOutlined,
  TrophyOutlined,
  BulbOutlined,
  ExperimentOutlined,
  HistoryOutlined,
  GlobalOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Document,
  Packer,
  Paragraph as DocxParagraph,
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StudentCalendarView = () => {
  const { t } = useTranslation();
  // State management
  const [tasks, setTasks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf("week"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const scheduleRef = useRef(null);

  // School hours: 9:00 AM - 4:00 PM (9 hours total)
  const schoolHours = Array.from({ length: 8 }, (_, i) => 9 + i); // 9, 10, 11, 12, 13, 14, 15, 16
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Subject/Task type configurations
  const taskTypeConfig = {
    math: {
      color: "#1890ff",
      icon: <ExperimentOutlined />,
      label: "Mathematics",
    },
    science: { color: "#52c41a", icon: <BulbOutlined />, label: "Science" },
    english: { color: "#722ed1", icon: <ReadOutlined />, label: "English" },
    history: { color: "#fa8c16", icon: <HistoryOutlined />, label: "History" },
    language: { color: "#13c2c2", icon: <GlobalOutlined />, label: "Language" },
    study: { color: "#eb2f96", icon: <BookOutlined />, label: "Study Session" },
    homework: {
      color: "#f5222d",
      icon: <FileTextOutlined />,
      label: "Homework",
    },
    review: {
      color: "#2f54eb",
      icon: <CheckCircleOutlined />,
      label: "Review",
    },
  };

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("studyPlannerTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Sample data for demonstration
      const sampleTasks = [
        {
          id: 1,
          day: "Monday",
          hour: 9,
          type: "math",
          title: "Algebra Review",
          description: "Review chapters 5-7, focus on quadratic equations",
          completed: false,
        },
        {
          id: 2,
          day: "Monday",
          hour: 10,
          type: "science",
          title: "Biology Lab Report",
          description: "Complete lab report on cell structure",
          completed: false,
        },
        {
          id: 3,
          day: "Tuesday",
          hour: 13,
          type: "english",
          title: "Essay Writing",
          description: "Work on persuasive essay draft",
          completed: false,
        },
        {
          id: 4,
          day: "Wednesday",
          hour: 14,
          type: "study",
          title: "Group Study Session",
          description: "Meet with study group for history quiz prep",
          completed: false,
        },
        {
          id: 5,
          day: "Thursday",
          hour: 11,
          type: "homework",
          title: "Math Homework",
          description: "Complete problem set #12",
          completed: false,
        },
        {
          id: 6,
          day: "Friday",
          hour: 15,
          type: "review",
          title: "Weekly Review",
          description: "Review all subjects covered this week",
          completed: false,
        },
      ];
      setTasks(sampleTasks);
      localStorage.setItem("studyPlannerTasks", JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Get tasks for specific day and hour
  const getTaskForSlot = (day, hour) => {
    return tasks.find((task) => task.day === day && task.hour === hour);
  };

  // Show add task modal
  const showAddTaskModal = (day, hour) => {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ day, hour });
    setIsModalVisible(true);
  };

  // Show edit task modal
  const showEditTaskModal = (task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...values,
                id: editingTask.id,
                completed: editingTask.completed,
              }
            : t
        )
      );
      message.success(t("studentDashboard.calendarView.updateSuccess"));
    } else {
      const newTask = {
        ...values,
        id: Date.now(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      message.success(t("studentDashboard.calendarView.addSuccess"));
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    Modal.confirm({
      title: t("studentDashboard.calendarView.deleteConfirmTitle"),
      content: t("studentDashboard.calendarView.deleteConfirmContent"),
      okText: t("studentDashboard.calendarView.delete"),
      okType: "danger",
      onOk: () => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        message.success(t("studentDashboard.calendarView.deleteSuccess"));
      },
    });
  };

  // Toggle task completion
  const toggleTaskComplete = (taskId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, "week"));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(moment().startOf("week"));
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      message.loading({
        content: t("studentDashboard.calendarView.pdfGenerating"),
        key: "pdf",
      });

      const element = scheduleRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`Study-Planner-Week-${currentWeek.format("YYYY-MM-DD")}.pdf`);

      message.success({
        content: t("studentDashboard.calendarView.pdfSuccess"),
        key: "pdf",
      });
    } catch (error) {
      message.error({
        content: t("studentDashboard.calendarView.pdfError"),
        key: "pdf",
      });
      console.error("PDF generation error:", error);
    }
  };

  // Export to Word (DOCX)
  const exportToWord = async () => {
    try {
      message.loading({
        content: t("studentDashboard.calendarView.docxGenerating"),
        key: "word",
      });

      const tableRows = [];

      // Header row with days
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new DocxParagraph({
                  text: t("studentDashboard.calendarView.time"),
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 15, type: WidthType.PERCENTAGE },
            }),
            ...weekDays.map(
              (day) =>
                new TableCell({
                  children: [
                    new DocxParagraph({
                      text: day,
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  width: { size: 17, type: WidthType.PERCENTAGE },
                })
            ),
          ],
        })
      );

      // Time slot rows
      schoolHours.forEach((hour) => {
        const cells = [
          new TableCell({
            children: [
              new DocxParagraph({
                text: `${hour}:00 - ${hour + 1}:00`,
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ];

        weekDays.forEach((day) => {
          const task = getTaskForSlot(day, hour);
          const cellText = task
            ? `${task.title}\n${task.description || ""}\n[${
                taskTypeConfig[task.type]?.label
              }]`
            : "";

          cells.push(
            new TableCell({
              children: [
                new DocxParagraph({
                  text: cellText,
                  alignment: AlignmentType.LEFT,
                }),
              ],
            })
          );
        });

        tableRows.push(new TableRow({ children: cells }));
      });

      const doc = new Document({
        sections: [
          {
            children: [
              new DocxParagraph({
                text: `Study Planner - ${t(
                  "studentDashboard.calendarView.weekOf"
                )} ${currentWeek.format("MMMM DD, YYYY")}`,
                heading: "Heading1",
                alignment: AlignmentType.CENTER,
              }),
              new DocxParagraph({ text: "" }),
              new DocxTable({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(
        blob,
        `Study-Planner-Week-${currentWeek.format("YYYY-MM-DD")}.docx`
      );

      message.success({
        content: t("studentDashboard.calendarView.docxSuccess"),
        key: "word",
      });
    } catch (error) {
      message.error({
        content: t("studentDashboard.calendarView.docxError"),
        key: "word",
      });
      console.error("Word generation error:", error);
    }
  };

  // Get statistics
  const getStatistics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const thisWeekTasks = tasks.filter((t) => {
      const taskDate = currentWeek.clone().day(weekDays.indexOf(t.day) + 1);
      return taskDate.isSame(currentWeek, "week");
    }).length;
    const todayTasks = tasks.filter((t) => {
      const today = moment().format("dddd");
      return t.day === today;
    }).length;

    return { totalTasks, completedTasks, thisWeekTasks, todayTasks };
  };

  const stats = getStatistics();

  // Render time slot cell
  const renderTimeSlot = (day, hour) => {
    const task = getTaskForSlot(day, hour);

    if (!task) {
      return (
        <div
          style={{
            height: "80px",
            border: "1px solid #f0f0f0",
            borderRadius: "6px",
            padding: "8px",
            cursor: "pointer",
            transition: "all 0.3s",
            background: "#fafafa",
          }}
          onClick={() => showAddTaskModal(day, hour)}
          className="hover-slot"
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bfbfbf",
            }}
          >
            <PlusOutlined style={{ fontSize: "16px" }} />
          </div>
        </div>
      );
    }

    const config = taskTypeConfig[task.type] || taskTypeConfig.study;

    return (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: t("studentDashboard.calendarView.contextMenu.edit"),
              icon: <EditOutlined />,
              onClick: () => showEditTaskModal(task),
            },
            {
              key: "complete",
              label: task.completed
                ? t("studentDashboard.calendarView.contextMenu.incomplete")
                : t("studentDashboard.calendarView.contextMenu.complete"),
              icon: <CheckCircleOutlined />,
              onClick: () => toggleTaskComplete(task.id),
            },
            {
              key: "delete",
              label: t("studentDashboard.calendarView.contextMenu.delete"),
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDeleteTask(task.id),
            },
          ],
        }}
        trigger={["contextMenu"]}
      >
        <div
          style={{
            height: "80px",
            border: `2px solid ${config.color}`,
            borderRadius: "6px",
            padding: "8px",
            cursor: "pointer",
            background: task.completed ? "#f6ffed" : "#ffffff",
            opacity: task.completed ? 0.7 : 1,
            transition: "all 0.3s",
          }}
          onClick={() => showEditTaskModal(task)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <Tag
              color={config.color}
              icon={config.icon}
              style={{ margin: 0, fontSize: "11px" }}
            >
              {config.label}
            </Tag>
            {task.completed && (
              <CheckCircleOutlined
                style={{ color: "#52c41a", fontSize: "14px" }}
              />
            )}
          </div>
          <Text
            strong
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "4px",
              textDecoration: task.completed ? "line-through" : "none",
            }}
            ellipsis
          >
            {task.title}
          </Text>
          {task.description && (
            <Text
              type="secondary"
              style={{
                fontSize: "11px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </Text>
          )}
        </div>
      </Dropdown>
    );
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      <style>
        {`
          .hover-slot:hover {
            background: #e6f7ff !important;
            border-color: #1890ff !important;
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ marginBottom: "8px" }}>
              <CalendarOutlined
                style={{ marginRight: "12px", color: "#1890ff" }}
              />
              📚 {t("studentDashboard.calendarView.title")}
            </Title>
            <Text type="secondary">
              {t("studentDashboard.calendarView.subtitle")}
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<FilePdfOutlined />}
                onClick={exportToPDF}
                size="large"
              >
                {t("studentDashboard.calendarView.exportPDF")}
              </Button>
              <Button
                icon={<FileWordOutlined />}
                onClick={exportToWord}
                size="large"
              >
                {t("studentDashboard.calendarView.exportWord")}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("studentDashboard.calendarView.totalTasks")}
              value={stats.totalTasks}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("studentDashboard.calendarView.completed")}
              value={stats.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={`/ ${stats.totalTasks}`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("studentDashboard.calendarView.thisWeek")}
              value={stats.thisWeekTasks}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("studentDashboard.calendarView.todayTasks")}
              value={stats.todayTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Week Navigation */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Button onClick={goToPreviousWeek}>
              {t("studentDashboard.calendarView.previousWeek")}
            </Button>
          </Col>
          <Col>
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                {t("studentDashboard.calendarView.weekOf")}{" "}
                {currentWeek.format("MMMM DD, YYYY")}
              </Title>
              <Button type="primary" onClick={goToCurrentWeek}>
                {t("studentDashboard.calendarView.currentWeek")}
              </Button>
            </Space>
          </Col>
          <Col>
            <Button onClick={goToNextWeek}>
              {t("studentDashboard.calendarView.nextWeek")}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Weekly Schedule Table */}
      <Card
        ref={scheduleRef}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "24px",
        }}
        bodyStyle={{ padding: "24px", overflowX: "auto" }}
      >
        <div style={{ minWidth: "900px" }}>
          {/* Header Row - Days of Week */}
          <Row gutter={[8, 8]} style={{ marginBottom: "8px" }}>
            <Col span={3}>
              <div
                style={{
                  background: "#1890ff",
                  color: "white",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {t("studentDashboard.calendarView.time")}
              </div>
            </Col>
            {weekDays.map((day, index) => (
              <Col span={4.2} key={day}>
                <div
                  style={{
                    background: currentWeek
                      .clone()
                      .day(index + 1)
                      .isSame(moment(), "day")
                      ? "#52c41a"
                      : "#1890ff",
                    color: "white",
                    padding: "12px",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {day}
                  <br />
                  <Text style={{ color: "white", fontSize: "12px" }}>
                    {currentWeek
                      .clone()
                      .day(index + 1)
                      .format("MMM DD")}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>

          {/* Time Slots */}
          {schoolHours.map((hour) => (
            <Row gutter={[8, 8]} key={hour} style={{ marginBottom: "8px" }}>
              <Col span={3}>
                <div
                  style={{
                    height: "80px",
                    background: "#fafafa",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  <div>{hour}:00</div>
                  <div style={{ fontSize: "11px", color: "#8c8c8c" }}>to</div>
                  <div>{hour + 1}:00</div>
                </div>
              </Col>
              {weekDays.map((day) => (
                <Col span={4.2} key={`${day}-${hour}`}>
                  {renderTimeSlot(day, hour)}
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </Card>

      {/* Study Tips */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Alert
          message={t("studentDashboard.calendarView.studyTips")}
          description={
            <div style={{ marginTop: "12px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="small">
                    <Text>✓ {t("studentDashboard.calendarView.tip1")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip2")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip3")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip4")}</Text>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="small">
                    <Text>✓ {t("studentDashboard.calendarView.tip5")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip6")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip7")}</Text>
                    <Text>✓ {t("studentDashboard.calendarView.tip8")}</Text>
                  </Space>
                </Col>
              </Row>
            </div>
          }
          type="info"
          showIcon
          icon={<TrophyOutlined />}
        />
      </Card>

      {/* Add/Edit Task Modal */}
      <Modal
        title={
          editingTask
            ? t("studentDashboard.calendarView.editTask")
            : t("studentDashboard.calendarView.addNewTask")
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="day"
                label={t("studentDashboard.calendarView.dayOfWeek")}
                rules={[
                  {
                    required: true,
                    message: t("studentDashboard.calendarView.dayOfWeek"),
                  },
                ]}
              >
                <Select
                  placeholder={t("studentDashboard.calendarView.dayOfWeek")}
                  size="large"
                >
                  {weekDays.map((day) => (
                    <Option key={day} value={day}>
                      {day}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hour"
                label={t("studentDashboard.calendarView.timeSlot")}
                rules={[
                  {
                    required: true,
                    message: t("studentDashboard.calendarView.timeSlot"),
                  },
                ]}
              >
                <Select
                  placeholder={t("studentDashboard.calendarView.timeSlot")}
                  size="large"
                >
                  {schoolHours.map((hour) => (
                    <Option key={hour} value={hour}>
                      {hour}:00 - {hour + 1}:00
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="type"
            label={t("studentDashboard.calendarView.subjectType")}
            rules={[
              {
                required: true,
                message: t("studentDashboard.calendarView.subjectType"),
              },
            ]}
          >
            <Select
              placeholder={t("studentDashboard.calendarView.subjectType")}
              size="large"
            >
              {Object.entries(taskTypeConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    {config.icon}
                    {config.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label={t("studentDashboard.calendarView.taskTitle")}
            rules={[
              {
                required: true,
                message: t("studentDashboard.calendarView.taskTitle"),
              },
            ]}
          >
            <Input
              placeholder={t(
                "studentDashboard.calendarView.taskTitlePlaceholder"
              )}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("studentDashboard.calendarView.description")}
          >
            <TextArea
              rows={4}
              placeholder={t(
                "studentDashboard.calendarView.descriptionPlaceholder"
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                {t("studentDashboard.calendarView.cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
              >
                {editingTask
                  ? t("studentDashboard.calendarView.updateTask")
                  : t("studentDashboard.calendarView.addTask")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentCalendarView;

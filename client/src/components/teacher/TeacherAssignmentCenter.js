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
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Form,
  Modal,
  DatePicker,
  InputNumber,
  Switch,
  Descriptions,
  Empty,
  Grid,
} from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { homeworkAPI, courseAPI } from "../../utils/apiClient";
import { ensureTeacherMyClassesTranslations } from "../../utils/teacherMyClassesTranslations";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const ASSIGNMENTS_CACHE_KEY = "forumAcademy.teacherAssignments.cache";
const STUDENT_ASSIGNMENT_CACHE_KEY = "forumAcademy.teacherAssignments.studentCache";
const DATE_DISPLAY_FORMAT = "MMM DD, YYYY";
const DUE_SOON_HOURS = 48;

const normalizeId = (entity) => {
  if (!entity) {
    return undefined;
  }
  if (typeof entity === "string") {
    return entity;
  }
  return entity._id || entity.id || entity.value || undefined;
};

const TeacherAssignmentCenter = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const { t: i18nT, i18n } = useTranslation();
  const translationFn = useMemo(
    () => (typeof t === "function" ? t : i18nT),
    [t, i18nT]
  );
  const translateText = useCallback(
    (key, fallback) => {
      if (typeof translationFn !== "function") {
        return fallback ?? key;
      }
      const translated = translationFn(key);
      if (!translated || translated === key) {
        return fallback ?? key;
      }
      return translated;
    },
    [translationFn]
  );
  const screens = useBreakpoint();
  const computedIsMobile = typeof isMobile === "boolean" ? isMobile : !screens.md;
  const computedIsTablet = screens.md && !screens.lg;
  const hasWindow = typeof window !== "undefined";

  const [homeworkForm] = Form.useForm();

  const [homeworks, setHomeworks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [editingHomework, setEditingHomework] = useState(null);
  const [viewingHomework, setViewingHomework] = useState(null);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [viewHomeworkModalVisible, setViewHomeworkModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const openCreateModal = useCallback(() => {
    setEditingHomework(null);
    setHomeworkModalVisible(true);
    requestAnimationFrame(() => homeworkForm.resetFields());
  }, [homeworkForm]);

  const closeHomeworkModal = useCallback(() => {
    setHomeworkModalVisible(false);
    setEditingHomework(null);
    requestAnimationFrame(() => homeworkForm.resetFields());
  }, [homeworkForm]);

  useEffect(() => {
    ensureTeacherMyClassesTranslations(i18n);
  }, [i18n]);

  const loadCachedAssignments = useCallback(() => {
    if (!hasWindow) {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(ASSIGNMENTS_CACHE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.assignments)) {
        return parsed.assignments;
      }
      return [];
    } catch (error) {
      console.warn("Failed to load assignment cache:", error);
      return [];
    }
  }, [hasWindow]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getAll();
      const rawCourses = response?.courses || response?.data || response || [];
      const courseList = Array.isArray(rawCourses) ? rawCourses : [];
      const teacherId = normalizeId(currentUser);
      const teacherCourses = courseList.filter((course) => {
        const courseTeacherId =
          normalizeId(course.teacher) ||
          course.teacherId ||
          normalizeId(course.instructor) ||
          course.ownerId;
        return teacherId ? courseTeacherId === teacherId : true;
      });
      setCourses(teacherId ? teacherCourses : courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser]);

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach((course) => {
      const id = normalizeId(course);
      if (id) {
        map[id] = course;
      }
    });
    return map;
  }, [courses]);

  const normalizeAssignment = useCallback(
    (assignment) => {
      if (!assignment) {
        return null;
      }

      const courseId =
        assignment.courseId ||
        normalizeId(assignment.course) ||
        assignment.course_id;

      const maxPoints = assignment.maxPoints ?? assignment.maxScore ?? 100;

      return {
        ...assignment,
        courseId,
        maxPoints,
        maxScore: maxPoints,
        course:
          assignment.course ||
          courseMap[courseId] ||
          courses.find((course) => normalizeId(course) === courseId),
      };
    },
    [courseMap, courses]
  );

useEffect(() => {
  const cachedAssignments = loadCachedAssignments();
  if (cachedAssignments.length > 0) {
    setHomeworks(
      cachedAssignments
        .map((assignment) => normalizeAssignment(assignment))
        .filter(Boolean)
    );
  }
}, [loadCachedAssignments, normalizeAssignment]);

const fetchHomeworks = useCallback(async () => {
  try {
    setLoading(true);
    const response = await homeworkAPI.getAll();
    const rawHomeworks = response?.homeworks || response?.data || response || [];
    const homeworkList = Array.isArray(rawHomeworks) ? rawHomeworks : [];
    const teacherId = normalizeId(currentUser);
    const teacherHomeworks = homeworkList.filter((homework) => {
      const homeworkTeacherId =
        normalizeId(homework.teacher) ||
        homework.teacherId ||
        normalizeId(homework.createdBy);
      return teacherId ? homeworkTeacherId === teacherId : true;
    });
      const normalizedHomeworks = teacherHomeworks
        .map((homework) => normalizeAssignment(homework))
        .filter(Boolean);
      setHomeworks((previous) => {
        if (normalizedHomeworks.length === 0 && previous.length > 0) {
          return previous;
        }
        return normalizedHomeworks;
      });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    message.error(
      translateText(
        "teacherAssignmentCenter.feedback.fetchFailed",
        "Failed to fetch assignments"
      )
    );
  } finally {
    setLoading(false);
  }
}, [currentUser, normalizeAssignment, translateText]);

useEffect(() => {
  fetchCourses();
  fetchHomeworks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!hasWindow) {
      return;
    }
    try {
      window.localStorage.setItem(
        ASSIGNMENTS_CACHE_KEY,
        JSON.stringify(homeworks)
      );
      const sanitizedAssignments = homeworks.map((assignment) => {
        const assignmentId = normalizeId(assignment) || assignment._id || assignment.id;
        const courseId =
          assignment.courseId ||
          normalizeId(assignment.course) ||
          assignment.course_id;
        const courseData = courseMap[courseId];
        return {
          _id: assignmentId,
          id: assignmentId,
          title: assignment.title,
          description: assignment.description || "",
          courseId,
          course: courseData || assignment.course || null,
          courseTitle:
            courseData?.title ||
            courseData?.name ||
            courseData?.code ||
            assignment.course?.title ||
            translateText(
              "teacherAssignmentCenter.table.courseUnknown",
              "Unknown course"
            ),
          dueDate: assignment.dueDate || null,
          maxPoints: assignment.maxPoints ?? assignment.maxScore ?? 100,
          maxScore: assignment.maxPoints ?? assignment.maxScore ?? 100,
          isActive: assignment.isActive !== false,
          isPublished:
            assignment.isPublished === true || assignment.isActive !== false,
          updatedAt:
            assignment.updatedAt ||
            assignment.updated_at ||
            new Date().toISOString(),
        };
      });

      window.localStorage.setItem(
        STUDENT_ASSIGNMENT_CACHE_KEY,
        JSON.stringify({
          updatedAt: new Date().toISOString(),
          assignments: sanitizedAssignments,
        })
      );
    } catch (storageError) {
      console.warn("Unable to persist assignment cache:", storageError);
    }
  }, [homeworks, courseMap, hasWindow, translateText]);

  const courseOptions = useMemo(
    () =>
      courses.map((course) => {
        const id = normalizeId(course);
        return {
          value: id,
          label:
            course?.title ||
            course?.name ||
            course?.code ||
            translateText(
              "teacherAssignmentCenter.table.courseUnknown",
              "Unknown course"
            ),
        };
      }),
    [courses, translateText]
  );

  const statusOptions = useMemo(
    () => [
      {
        value: "all",
        label: translateText(
          "teacherAssignmentCenter.filters.status.all",
          "All statuses"
        ),
      },
      {
        value: "active",
        label: translateText(
          "teacherAssignmentCenter.filters.status.active",
          "Active"
        ),
      },
      {
        value: "inactive",
        label: translateText(
          "teacherAssignmentCenter.filters.status.inactive",
          "Inactive"
        ),
      },
    ],
    [translateText]
  );

  const filteredHomeworks = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    return homeworks.filter((homework) => {
      const matchesSearch =
        !searchValue ||
        homework.title?.toLowerCase().includes(searchValue) ||
        homework.description?.toLowerCase().includes(searchValue);

      const assignmentStatus = homework.isActive !== false ? "active" : "inactive";
      const matchesStatus =
        statusFilter === "all" || assignmentStatus === statusFilter;

      const homeworkCourseId =
        homework.courseId ||
        normalizeId(homework.course) ||
        homework.course_id;
      const matchesCourse =
        courseFilter === "all" || homeworkCourseId === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [homeworks, searchTerm, statusFilter, courseFilter]);

  const handleCreateHomework = async (values) => {
    try {
      if (!values.dueDate) {
        message.error(
          translateText(
            "teacherAssignmentCenter.validation.dueDateRequired",
            "Please select a due date"
          )
        );
        return;
      }

      const homeworkData = {
        title: values.title,
        description: values.description,
        course: values.courseId,
        courseId: values.courseId,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        maxPoints: values.maxPoints ?? values.maxScore ?? 100,
        maxScore: values.maxPoints ?? values.maxScore ?? 100,
        isActive: values.isActive !== false,
        teacher: normalizeId(currentUser),
        teacherId: normalizeId(currentUser),
      };

      if (editingHomework) {
        await homeworkAPI.update(editingHomework._id, homeworkData);
        message.success(
          translateText(
            "teacherAssignmentCenter.feedback.updateSuccess",
            "Assignment updated successfully"
          )
        );
        setHomeworks((previous) =>
          previous.map((assignment) => {
            if (
              (assignment._id || assignment.id) ===
              (editingHomework._id || editingHomework.id)
            ) {
              return (
                normalizeAssignment({
                  ...assignment,
                  ...homeworkData,
                  _id: editingHomework._id || editingHomework.id,
                }) || assignment
              );
            }
            return assignment;
          })
        );
      } else {
        const result = await homeworkAPI.create(homeworkData);
        message.success(
          translateText(
            "teacherAssignmentCenter.feedback.createSuccess",
            "Assignment created successfully"
          )
        );
        const createdAssignment =
          normalizeAssignment(
            result?.homework || result?.data || result?.assignment || result
          ) ||
          normalizeAssignment({
            ...homeworkData,
            _id: result?._id || result?.id,
            id: result?.id || result?._id,
          });

        if (createdAssignment) {
          setHomeworks((previous) => {
            const nextAssignments = [
              createdAssignment,
              ...previous.filter(
                (assignment) =>
                  (assignment._id || assignment.id) !==
                  (createdAssignment._id || createdAssignment.id)
              ),
            ];
            return nextAssignments;
          });
        } else {
          fetchHomeworks();
        }
      }

      closeHomeworkModal();
      fetchHomeworks();
    } catch (error) {
      message.error(
        error.message ||
          translateText(
            "teacherAssignmentCenter.feedback.saveFailed",
            "Error saving assignment"
          )
      );
    }
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    homeworkForm.setFieldsValue({
      title: homework.title,
      description: homework.description,
      courseId: normalizeId(homework.course) || homework.courseId,
      dueDate: homework.dueDate ? moment(homework.dueDate) : null,
      maxPoints: homework.maxPoints ?? homework.maxScore ?? 100,
      isActive: homework.isActive !== false,
    });
    setHomeworkModalVisible(true);
  };

  const handleViewHomework = (homework) => {
    setViewingHomework(homework);
    setViewHomeworkModalVisible(true);
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      await homeworkAPI.delete(homeworkId);
      message.success(
        translateText(
          "teacherAssignmentCenter.feedback.deleteSuccess",
          "Assignment deleted successfully"
        )
      );
      fetchHomeworks();
    } catch (error) {
      message.error(
        translateText(
          "teacherAssignmentCenter.feedback.deleteFailed",
          "Failed to delete assignment"
        )
      );
    }
  };

  const renderDueDateTag = (dueDate) => {
    if (!dueDate) {
      return (
        <Tag color="default">
          {translateText(
            "teacherAssignmentCenter.table.dueDate.none",
            "No due date"
          )}
        </Tag>
      );
    }

    const dueDateMoment = moment(dueDate);
    const now = moment();
    const isOverdue = dueDateMoment.isBefore(now, "day");
    const isDueSoon =
      !isOverdue && dueDateMoment.diff(now, "hours") <= DUE_SOON_HOURS;

    const color = isOverdue ? "red" : isDueSoon ? "orange" : "blue";
    const label = dueDateMoment.format(DATE_DISPLAY_FORMAT);
    const prefix = isOverdue
      ? translateText(
          "teacherAssignmentCenter.table.dueDate.overdue",
          "Overdue"
        )
      : isDueSoon
      ? translateText(
          "teacherAssignmentCenter.table.dueDate.soon",
          "Due soon"
        )
      : null;

    return (
      <Tag color={color}>
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        {prefix ? `${prefix}: ${label}` : label}
      </Tag>
    );
  };

  const homeworkColumns = [
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.title",
        "Assignment Title"
      ),
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description ||
              translateText(
                "teacherAssignmentCenter.table.noDescription",
                "No description"
              )}
          </Text>
        </div>
      ),
    },
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.course",
        "Course"
      ),
      dataIndex: "course",
      key: "course",
      render: (course) => {
        const courseId = normalizeId(course);
        const courseData =
          (courseId && courseMap[courseId]) ||
          (typeof course === "object" ? course : null);
        const label =
          courseData?.title ||
          courseData?.name ||
          courseData?.code ||
          translateText(
            "teacherAssignmentCenter.table.courseUnknown",
            "Unknown course"
          );
        return <Tag color="geekblue">{label}</Tag>;
      },
    },
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.dueDate",
        "Due date"
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => renderDueDateTag(dueDate),
    },
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.maxPoints",
        "Max points"
      ),
      dataIndex: "maxPoints",
      key: "maxPoints",
      render: (score, record) => (
        <Tag color="purple">{score ?? record.maxScore ?? 100}</Tag>
      ),
    },
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.status",
        "Status"
      ),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive
            ? translateText(
                "teacherAssignmentCenter.table.status.active",
                "Active"
              )
            : translateText(
                "teacherAssignmentCenter.table.status.inactive",
                "Inactive"
              )}
        </Tag>
      ),
    },
    {
      title: translateText(
        "teacherAssignmentCenter.table.columns.actions",
        "Actions"
      ),
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Tooltip
            title={translateText(
              "teacherAssignmentCenter.actions.view",
              "View"
            )}
          >
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewHomework(record)}
            />
          </Tooltip>
          <Tooltip
            title={translateText(
              "teacherAssignmentCenter.actions.edit",
              "Edit"
            )}
          >
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditHomework(record)}
            />
          </Tooltip>
          <Popconfirm
            title={translateText(
              "teacherAssignmentCenter.actions.deleteConfirm",
              "Are you sure you want to delete this assignment?"
            )}
            onConfirm={() => handleDeleteHomework(record._id)}
          >
            <Tooltip
              title={translateText(
                "teacherAssignmentCenter.actions.delete",
                "Delete"
              )}
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: computedIsMobile ? "16px" : "24px" }}>
      <Card bodyStyle={{ padding: computedIsMobile ? 16 : 24 }}>
        <Space
          direction="vertical"
          size={computedIsMobile ? 16 : 24}
          style={{ width: "100%" }}
        >
          <Space align="start" size={16} wrap>
            <FileTextOutlined style={{ fontSize: 28, color: "#1890ff" }} />
            <Space direction="vertical" size={4}>
              <Title level={2} style={{ margin: 0 }}>
                {translateText(
                  "teacherDashboard.sidebar.assignmentCenter",
                  "Assignment Center"
                )}
              </Title>
              <Text type="secondary">
                {translateText(
                  "teacherAssignmentCenter.subtitle",
                  "Create, assign, and track homework for your learners."
                )}
              </Text>
            </Space>
          </Space>

          <div
            style={{
              display: "flex",
              flexDirection: computedIsMobile ? "column" : "row",
              gap: computedIsMobile ? 12 : 16,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Input
              allowClear
              placeholder={translateText(
                "teacherAssignmentCenter.filters.searchPlaceholder",
                "Search assignments..."
              )}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: computedIsMobile ? "100%" : 260 }}
            />
            <Select
              value={courseFilter}
              onChange={(value) => setCourseFilter(value)}
              style={{ width: computedIsMobile ? "100%" : 220 }}
              placeholder={translateText(
                "teacherAssignmentCenter.filters.coursePlaceholder",
                "Filter by course"
              )}
            >
              <Option value="all">
                {translateText(
                  "teacherAssignmentCenter.filters.allCourses",
                  "All courses"
                )}
              </Option>
              {courseOptions
                .filter((option) => option.value)
                .map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: computedIsMobile ? "100%" : 200 }}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                width: computedIsMobile ? "100%" : "auto",
                marginLeft: computedIsMobile ? 0 : "auto",
              }}
              onClick={openCreateModal}
            >
              {translateText(
                "teacherAssignmentCenter.actions.createAssignment",
                "Create assignment"
              )}
            </Button>
          </div>

          <Table
            columns={homeworkColumns}
            dataSource={filteredHomeworks}
            rowKey={(record) => record._id || record.id}
            loading={loading}
            pagination={{
              pageSize: computedIsMobile ? 6 : 10,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: (
                <Empty
                  description={translateText(
                    "teacherAssignmentCenter.table.empty",
                    "No assignments yet. Create your first assignment to get started."
                  )}
                />
              ),
            }}
            scroll={computedIsMobile ? { x: 900 } : undefined}
          />
        </Space>
      </Card>

      <Modal
        title={translateText(
          editingHomework
            ? "teacherAssignmentCenter.modal.editTitle"
            : "teacherAssignmentCenter.modal.createTitle",
          editingHomework ? "Edit assignment" : "Create assignment"
        )}
        open={homeworkModalVisible}
        onCancel={closeHomeworkModal}
        footer={null}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
        maskClosable={false}
      >
        <Form form={homeworkForm} layout="vertical" onFinish={handleCreateHomework}>
          <Form.Item
            name="courseId"
            label={translateText(
              "teacherAssignmentCenter.form.course",
              "Course"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherAssignmentCenter.form.courseRequired",
                  "Please select a course"
                ),
              },
            ]}
          >
            <Select
              placeholder={translateText(
                "teacherAssignmentCenter.form.coursePlaceholder",
                "Select course"
              )}
              showSearch
              optionFilterProp="children"
            >
              {courses.map((course) => {
                const id = normalizeId(course);
                const label =
                  course?.title ||
                  course?.name ||
                  course?.code ||
                  translateText(
                    "teacherAssignmentCenter.table.courseUnknown",
                    "Unknown course"
                  );
                return (
                  <Option key={id} value={id}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label={translateText(
              "teacherAssignmentCenter.form.title",
              "Assignment title"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherAssignmentCenter.form.titleRequired",
                  "Please enter an assignment title"
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={translateText(
              "teacherAssignmentCenter.form.description",
              "Description"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherAssignmentCenter.form.descriptionRequired",
                  "Please provide a description"
                ),
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={translateText(
                "teacherAssignmentCenter.form.descriptionPlaceholder",
                "Share notes or expectations for your learners"
              )}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dueDate"
                label={translateText(
                  "teacherAssignmentCenter.form.dueDate",
                  "Due date"
                )}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherAssignmentCenter.validation.dueDateRequired",
                      "Please select a due date"
                    ),
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="maxPoints"
                label={translateText(
                  "teacherAssignmentCenter.form.maxPoints",
                  "Max points"
                )}
                initialValue={100}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherAssignmentCenter.validation.maxPointsRequired",
                      "Please provide max points"
                    ),
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="isActive"
            label={translateText(
              "teacherAssignmentCenter.form.status",
              "Status"
            )}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={translateText(
                "teacherAssignmentCenter.table.status.active",
                "Active"
              )}
              unCheckedChildren={translateText(
                "teacherAssignmentCenter.table.status.inactive",
                "Inactive"
              )}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHomework
                  ? translateText(
                      "teacherAssignmentCenter.actions.update",
                      "Update"
                    )
                  : translateText(
                      "teacherAssignmentCenter.actions.create",
                      "Create"
                    )}
              </Button>
              <Button onClick={() => setHomeworkModalVisible(false)}>
                {translateText("common.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={translateText(
          "teacherAssignmentCenter.modal.viewTitle",
          "Assignment details"
        )}
        open={viewHomeworkModalVisible}
        onCancel={() => {
          setViewHomeworkModalVisible(false);
          setViewingHomework(null);
        }}
        footer={[
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (viewingHomework) {
                handleEditHomework(viewingHomework);
                setViewHomeworkModalVisible(false);
              }
            }}
          >
            {translateText("teacherAssignmentCenter.actions.edit", "Edit")}
          </Button>,
          <Button
            key="close"
            onClick={() => setViewHomeworkModalVisible(false)}
          >
            {translateText("common.close", "Close")}
          </Button>,
        ]}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
      >
        {viewingHomework && (
          <Descriptions column={computedIsMobile ? 1 : 2} bordered size="small">
            <Descriptions.Item
              label={translateText(
                "teacherAssignmentCenter.view.title",
                "Title"
              )}
            >
              {viewingHomework.title}
            </Descriptions.Item>
            <Descriptions.Item
              label={translateText(
                "teacherAssignmentCenter.view.course",
                "Course"
              )}
            >
              {(() => {
                const courseId =
                  normalizeId(viewingHomework.course) || viewingHomework.courseId;
                const course =
                  courseId && courseMap[courseId]
                    ? courseMap[courseId]
                    : typeof viewingHomework.course === "object"
                    ? viewingHomework.course
                    : null;
                return (
                  course?.title ||
                  course?.name ||
                  course?.code ||
                  translateText(
                    "teacherAssignmentCenter.table.courseUnknown",
                    "Unknown course"
                  )
                );
              })()}
            </Descriptions.Item>
            <Descriptions.Item
              label={translateText(
                "teacherAssignmentCenter.view.dueDate",
                "Due date"
              )}
            >
              {viewingHomework.dueDate
                ? moment(viewingHomework.dueDate).format(DATE_DISPLAY_FORMAT)
                : translateText(
                    "teacherAssignmentCenter.table.dueDate.none",
                    "No due date"
                  )}
            </Descriptions.Item>
            <Descriptions.Item
              label={translateText(
                "teacherAssignmentCenter.view.maxPoints",
                "Max points"
              )}
            >
              {viewingHomework.maxPoints ?? viewingHomework.maxScore ?? 100}
            </Descriptions.Item>
            <Descriptions.Item
              label={translateText(
                "teacherAssignmentCenter.view.status",
                "Status"
              )}
            >
              <Tag color={viewingHomework.isActive ? "green" : "default"}>
                {viewingHomework.isActive
                  ? translateText(
                      "teacherAssignmentCenter.table.status.active",
                      "Active"
                    )
                  : translateText(
                      "teacherAssignmentCenter.table.status.inactive",
                      "Inactive"
                    )}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item
              span={2}
              label={translateText(
                "teacherAssignmentCenter.view.description",
                "Description"
              )}
            >
              {viewingHomework.description ||
                translateText(
                  "teacherAssignmentCenter.view.noDescription",
                  "No description"
                )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TeacherAssignmentCenter;

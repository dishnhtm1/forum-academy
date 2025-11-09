import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Form,
  Modal,
  Upload,
  Switch,
  Descriptions,
  Empty,
  Tabs,
  Statistic,
  Progress,
  Grid,
} from "antd";
import {
  AudioOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { listeningAPI, courseAPI } from "../../utils/apiClient";
import { ensureTeacherMyClassesTranslations } from "../../utils/teacherMyClassesTranslations";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;

const LISTENING_CACHE_KEY = "forumAcademy.listening.assignments";
const LISTENING_EVENT = "listeningAssignmentsUpdated";

const normalizeId = (value) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value._id || value.id || value.value || undefined;
};

const sanitizeExercisesForCache = (exercises) =>
  exercises.map((exercise) => ({
    id: normalizeId(exercise),
    _id: normalizeId(exercise),
    title: exercise.title,
    description: exercise.description || "",
    courseId: exercise.courseId || normalizeId(exercise.course),
    course: exercise.course
      ? {
          id: normalizeId(exercise.course),
          title:
            exercise.course.title ||
            exercise.course.name ||
            exercise.course.code ||
            "",
        }
      : null,
    isActive: exercise.isActive !== false,
    isPublished:
      typeof exercise.isPublished === "boolean"
        ? exercise.isPublished
        : exercise.isActive !== false,
    level: exercise.level || exercise.difficulty || "beginner",
    timeLimit: exercise.timeLimit || exercise.duration || null,
    questions: Array.isArray(exercise.questions)
      ? exercise.questions.map((question) => ({
          question: question.question,
          options: question.options || [],
          correctAnswer: question.correctAnswer,
          points: question.points || 1,
        }))
      : [],
    audioUrl: exercise.audioUrl || exercise.audio || null,
    updatedAt: exercise.updatedAt || new Date().toISOString(),
  }));

const TeacherListeningExercises = ({
  t,
  currentUser,
  isMobile,
  history: historyProp,
}) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const { t: i18nT, i18n } = useTranslation();
  const translationFn = useMemo(
    () => (typeof t === "function" ? t : i18nT),
    [t, i18nT]
  );
  ensureTeacherMyClassesTranslations(i18n);
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
  const computedIsMobile =
    typeof isMobile === "boolean" ? isMobile : !screens.md;
  const computedIsTablet = screens.md && !screens.lg;
  const hasWindow = typeof window !== "undefined";

  const [exerciseForm] = Form.useForm();
  const [questionForm] = Form.useForm();

  const [exercises, setExercises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("exercises");
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [editingExercise, setEditingExercise] = useState(null);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [viewExerciseModalVisible, setViewExerciseModalVisible] =
    useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const firstLoadRef = useRef(true);

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

  const normalizeExercise = useCallback(
    (exercise) => {
      if (!exercise) {
        return null;
      }
      const id = normalizeId(exercise);
      const courseId =
        exercise.courseId || normalizeId(exercise.course) || exercise.course_id;
      const base = {
        ...exercise,
        _id: id,
        id,
        courseId,
        questions: Array.isArray(exercise.questions)
          ? exercise.questions.map((question) => ({
              ...question,
              points: question.points || 1,
              options: question.options || [],
              _id: normalizeId(question) || undefined,
            }))
          : [],
      };
      if (!base.course && courseMap[courseId]) {
        base.course = courseMap[courseId];
      }
      return base;
    },
    [courseMap]
  );

  useEffect(() => {
    setExercises((previous) =>
      previous
        .map((exercise) => normalizeExercise(exercise))
        .filter(Boolean)
    );
  }, [normalizeExercise]);

  useEffect(() => {
    if (!hasWindow) {
      return;
    }
    try {
      const raw = window.localStorage.getItem(LISTENING_CACHE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      const assignments = Array.isArray(parsed)
        ? parsed
        : parsed?.assignments || [];
      if (assignments.length > 0) {
        setExercises(assignments.map((assignment) => normalizeExercise(assignment)).filter(Boolean));
      }
    } catch (error) {
      console.warn("Failed to load listening cache:", error);
    }
  }, [hasWindow, normalizeExercise]);

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

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await listeningAPI.getAll();
      const rawExercises =
        response?.exercises || response?.data || response || [];
      const exerciseList = Array.isArray(rawExercises) ? rawExercises : [];
      const teacherId = normalizeId(currentUser);
      const teacherExercises = exerciseList.filter((exercise) => {
        const exerciseTeacherId =
          normalizeId(exercise.teacher) ||
          exercise.teacherId ||
          normalizeId(exercise.createdBy);
        return teacherId ? exerciseTeacherId === teacherId : true;
      });
      const normalized = teacherExercises
        .map((exercise) => normalizeExercise(exercise))
        .filter(Boolean);
      setExercises(normalized);
    } catch (error) {
      console.error("Error fetching listening exercises:", error);
      message.error(
        translateText(
          "teacherListening.feedback.fetchFailed",
          "Failed to fetch listening exercises"
        )
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, normalizeExercise, translateText]);

  useEffect(() => {
    fetchCourses();
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasWindow || exercises.length === 0) {
      if (firstLoadRef.current) {
        firstLoadRef.current = false;
      }
      return;
    }
    try {
      const sanitized = sanitizeExercisesForCache(exercises);
      window.localStorage.setItem(
        LISTENING_CACHE_KEY,
        JSON.stringify({
          updatedAt: new Date().toISOString(),
          assignments: sanitized,
        })
      );
      window.dispatchEvent(new Event(LISTENING_EVENT));
    } catch (error) {
      console.warn("Unable to cache listening exercises:", error);
    }
  }, [exercises, hasWindow]);

  const openExerciseModal = useCallback(() => {
    setEditingExercise(null);
    setExerciseModalVisible(true);
    requestAnimationFrame(() => {
      exerciseForm.resetFields();
      setFileList([]);
    });
  }, [exerciseForm]);

  const closeExerciseModal = useCallback(() => {
    setExerciseModalVisible(false);
    setEditingExercise(null);
    requestAnimationFrame(() => {
      exerciseForm.resetFields();
      setFileList([]);
    });
  }, [exerciseForm]);

  const handleCreateExercise = async (values) => {
    if (fileList.length === 0 && !editingExercise) {
      message.error(
        translateText(
          "teacherListening.feedback.audioRequired",
          "Please upload an audio file"
        )
      );
      return;
    }

    try {
      const teacherId = normalizeId(currentUser);
      if (!teacherId) {
        message.error("Missing teacher information");
        return;
      }

      if (editingExercise) {
        const updatePayload = {
          title: values.title,
          description: values.description,
          course: values.courseId,
          courseId: values.courseId,
          isActive: values.isActive !== false,
        };
        await listeningAPI.update(editingExercise._id, updatePayload);
        message.success(
          translateText(
            "teacherListening.feedback.updateSuccess",
            "Exercise updated successfully"
          )
        );
        setExercises((previous) =>
          previous.map((exercise) => {
            if (
              (exercise._id || exercise.id) ===
              (editingExercise._id || editingExercise.id)
            ) {
              return (
                normalizeExercise({
                  ...exercise,
                  ...updatePayload,
                  updatedAt: new Date().toISOString(),
                }) || exercise
              );
            }
            return exercise;
          })
        );
      } else {
        const formData = new FormData();
        if (fileList.length > 0) {
          const file = fileList[0].originFileObj || fileList[0];
          formData.append("audioFile", file);
        }
        formData.append("title", values.title);
        formData.append("description", values.description || "");
        formData.append("course", values.courseId);
        formData.append("courseId", values.courseId);
        formData.append("isActive", values.isActive !== false ? "true" : "false");
        formData.append("teacher", teacherId);
        formData.append("teacherId", teacherId);

        const result = await listeningAPI.create(formData);
        message.success(
          translateText(
            "teacherListening.feedback.createSuccess",
            "Exercise created successfully"
          )
        );
        const rawResult =
          result?.exercise || result?.data || result?.listening || result;
        const fallbackId = `temp-${Date.now()}`;
        const normalized =
          normalizeExercise({
            ...(rawResult || {}),
            _id: rawResult?._id || rawResult?.id || fallbackId,
            id: rawResult?.id || rawResult?._id || fallbackId,
            courseId: rawResult?.courseId || values.courseId,
            course:
              rawResult?.course ||
              courseMap[values.courseId] ||
              (rawResult?.courseTitle
                ? { id: values.courseId, title: rawResult.courseTitle }
                : undefined),
          }) || null;

        if (normalized) {
          setExercises((previous) => [
            normalized,
            ...previous.filter(
              (exercise) =>
                (exercise._id || exercise.id) !== (normalized._id || normalized.id)
            ),
          ]);
        } else {
          fetchExercises();
        }
      }

      closeExerciseModal();
      fetchExercises();
    } catch (error) {
      console.error("Error saving exercise:", error);
      message.error(
        error.message ||
          translateText(
            "teacherListening.feedback.saveFailed",
            "Error saving exercise"
          )
      );
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setExerciseModalVisible(true);
    requestAnimationFrame(() => {
      exerciseForm.setFieldsValue({
        title: exercise.title,
        description: exercise.description,
        courseId: exercise.courseId || normalizeId(exercise.course),
        isActive: exercise.isActive !== false,
      });
      setFileList([]);
    });
  };

  const handleViewExercise = (exercise) => {
    setViewingExercise(exercise);
    setViewExerciseModalVisible(true);
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await listeningAPI.delete(exerciseId);
      message.success(
        translateText(
          "teacherListening.feedback.deleteSuccess",
          "Exercise deleted successfully"
        )
      );
      setExercises((previous) =>
        previous.filter(
          (exercise) => (exercise._id || exercise.id) !== exerciseId
        )
      );
      if (selectedExerciseId === exerciseId) {
        setSelectedExerciseId(null);
        setSubmissions([]);
      }
      fetchExercises();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      message.error(
        translateText(
          "teacherListening.feedback.deleteFailed",
          "Failed to delete exercise"
        )
      );
    }
  };

  const handleToggleExercise = async (exercise) => {
    try {
      const updatedExercise = {
        title: exercise.title,
        description: exercise.description,
        course: exercise.courseId || normalizeId(exercise.course),
        courseId: exercise.courseId || normalizeId(exercise.course),
        isActive: !exercise.isActive,
      };
      await listeningAPI.update(exercise._id, updatedExercise);
      message.success(
        translateText(
          "teacherListening.feedback.toggleSuccess",
          "Exercise status updated"
        )
      );
      setExercises((previous) =>
        previous.map((item) =>
          (item._id || item.id) === (exercise._id || exercise.id)
            ? normalizeExercise({
                ...item,
                ...updatedExercise,
              }) || item
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update exercise:", error);
      message.error(
        translateText(
          "teacherListening.feedback.toggleFailed",
          "Failed to update exercise status"
        )
      );
    }
  };

  const handlePlayAudio = async (exercise) => {
    try {
      const url = await listeningAPI.getAudioUrl(exercise._id);
      setAudioUrl(url);
      setCurrentPlayingId(exercise._id);
    } catch (error) {
      message.error(
        translateText(
          "teacherListening.feedback.audioFailed",
          "Failed to load audio"
        )
      );
    }
  };

  const handleAddQuestion = async (values) => {
    if (!viewingExercise) {
      return;
    }
    try {
      const existingQuestions = viewingExercise.questions || [];
      const questionData = {
        question: values.question,
        options: values.options
          ? values.options.split(",").map((option) => option.trim())
          : [],
        correctAnswer: values.correctAnswer,
        points: values.points || 1,
      };

      if (editingQuestion) {
        const updatedQuestions = existingQuestions.map((question) =>
          (normalizeId(question) || question.question) ===
          (normalizeId(editingQuestion) || editingQuestion.question)
            ? { ...questionData, _id: question._id || question.id }
            : question
        );
        await listeningAPI.update(viewingExercise._id, {
          questions: updatedQuestions,
        });
        message.success(
          translateText(
            "teacherListening.feedback.questionUpdated",
            "Question updated successfully"
          )
        );
      } else {
        await listeningAPI.update(viewingExercise._id, {
          questions: [...existingQuestions, questionData],
        });
        message.success(
          translateText(
            "teacherListening.feedback.questionAdded",
            "Question added successfully"
          )
        );
      }

      setQuestionModalVisible(false);
      questionForm.resetFields();
      setEditingQuestion(null);
      const updated = await listeningAPI.getById(viewingExercise._id);
      if (updated.success || updated._id) {
        const normalized = normalizeExercise(updated.exercise || updated);
        setViewingExercise(normalized);
        setExercises((previous) =>
          previous.map((exercise) =>
            (exercise._id || exercise.id) === viewingExercise._id
              ? normalized || exercise
              : exercise
          )
        );
      } else {
        fetchExercises();
      }
    } catch (error) {
      console.error("Error saving question:", error);
      message.error(
        error.message ||
          translateText(
            "teacherListening.feedback.questionFailed",
            "Error saving question"
          )
      );
    }
  };

  const handleDeleteQuestion = async (questionIndex) => {
    if (!viewingExercise) {
      return;
    }
    try {
      const existingQuestions = viewingExercise.questions || [];
      const updatedQuestions = existingQuestions.filter(
        (_, index) => index !== questionIndex
      );
      await listeningAPI.update(viewingExercise._id, {
        questions: updatedQuestions,
      });
      message.success(
        translateText(
          "teacherListening.feedback.questionDeleted",
          "Question deleted successfully"
        )
      );
      const updated = await listeningAPI.getById(viewingExercise._id);
      if (updated.success || updated._id) {
        const normalized = normalizeExercise(updated.exercise || updated);
        setViewingExercise(normalized);
        setExercises((previous) =>
          previous.map((exercise) =>
            (exercise._id || exercise.id) === viewingExercise._id
              ? normalized || exercise
              : exercise
          )
        );
      } else {
        fetchExercises();
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
      message.error(
        translateText(
          "teacherListening.feedback.questionFailed",
          "Failed to delete question"
        )
      );
    }
  };

  const filteredExercises = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesSearch =
        !value ||
        exercise.title?.toLowerCase().includes(value) ||
        exercise.description?.toLowerCase().includes(value);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && exercise.isActive !== false) ||
        (statusFilter === "inactive" && exercise.isActive === false);
      const exerciseCourseId =
        exercise.courseId || normalizeId(exercise.course) || null;
      const matchesCourse =
        courseFilter === "all" ||
        (exerciseCourseId && exerciseCourseId === courseFilter);
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [exercises, searchTerm, statusFilter, courseFilter]);

  const selectedExercise = useMemo(
    () =>
      filteredExercises.find(
        (exercise) =>
          (exercise._id || exercise.id) === selectedExerciseId
      ),
    [filteredExercises, selectedExerciseId]
  );

  useEffect(() => {
    if (
      activeTab === "submissions" &&
      filteredExercises.length > 0 &&
      !selectedExerciseId
    ) {
      setSelectedExerciseId(filteredExercises[0]._id || filteredExercises[0].id);
    }
  }, [activeTab, filteredExercises, selectedExerciseId]);

  const fetchSubmissions = useCallback(
    async (exerciseId) => {
      if (!exerciseId) {
        return;
      }
      try {
        setSubmissionsLoading(true);
        const token =
          localStorage.getItem("authToken") || localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/listening-exercises/${exerciseId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
        } else {
          message.error(
            translateText(
              "teacherListening.feedback.fetchFailed",
              "Failed to fetch listening exercises"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        message.error(
          translateText(
            "teacherListening.feedback.fetchFailed",
            "Failed to fetch listening exercises"
          )
        );
      } finally {
        setSubmissionsLoading(false);
      }
    },
    [translateText]
  );

  useEffect(() => {
    if (activeTab !== "submissions" || !selectedExerciseId) {
      return;
    }
    fetchSubmissions(selectedExerciseId);
  }, [activeTab, selectedExerciseId, fetchSubmissions]);

  const uploadProps = {
    beforeUpload: (file) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        message.error(
          translateText(
            "teacherListening.feedback.audioRequired",
            "Please upload an audio file"
          )
        );
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
    accept: "audio/*",
  };

  const exerciseColumns = [
    {
      title: translateText(
        "teacherListening.table.columns.title",
        "Exercise title"
      ),
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description ||
              translateText(
                "teacherListening.table.noDescription",
                "No description"
              )}
          </Text>
        </Space>
      ),
    },
    {
      title: translateText(
        "teacherListening.table.columns.course",
        "Course"
      ),
      dataIndex: "course",
      key: "course",
      render: (_, record) => {
        const courseId = record.courseId || normalizeId(record.course);
        const course =
          record.course ||
          courseMap[courseId] ||
          courses.find((item) => normalizeId(item) === courseId);
        const label =
          course?.title ||
          course?.name ||
          course?.code ||
          translateText(
            "teacherListening.table.courseUnknown",
            "Unknown course"
          );
        return <Tag color="geekblue">{label}</Tag>;
      },
    },
    {
      title: translateText(
        "teacherListening.table.columns.questions",
        "Questions"
      ),
      dataIndex: "questions",
      key: "questions",
      render: (questions) => <Tag>{questions?.length || 0}</Tag>,
    },
    {
      title: translateText(
        "teacherListening.table.columns.status",
        "Status"
      ),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleExercise(record)}
          checkedChildren={translateText("teacherListening.actions.pause", "Pause")}
          unCheckedChildren={translateText("teacherListening.actions.play", "Play")}
        />
      ),
    },
    {
      title: translateText(
        "teacherListening.table.columns.actions",
        "Actions"
      ),
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Tooltip
            title={
              currentPlayingId === record._id
                ? translateText("teacherListening.actions.pause", "Pause audio")
                : translateText("teacherListening.actions.play", "Play audio")
            }
          >
            <Button
              icon={
                currentPlayingId === record._id ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              size="small"
              onClick={() => handlePlayAudio(record)}
            />
          </Tooltip>
          <Tooltip title={translateText("teacherListening.actions.view", "View")}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewExercise(record)}
            />
          </Tooltip>
          <Tooltip title={translateText("teacherListening.actions.edit", "Edit")}>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditExercise(record)}
            />
          </Tooltip>
          <Tooltip
            title={translateText("teacherListening.actions.viewSubmissions", "View submissions")}
          >
            <Button
              icon={<TrophyOutlined />}
              size="small"
              onClick={() => {
                setSelectedExerciseId(record._id || record.id);
                setActiveTab("submissions");
              }}
            />
          </Tooltip>
          <Popconfirm
            title={translateText(
              "teacherListening.actions.deleteConfirm",
              "Are you sure you want to delete this exercise?"
            )}
            onConfirm={() => handleDeleteExercise(record._id || record.id)}
          >
            <Tooltip
              title={translateText("teacherListening.actions.delete", "Delete")}
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const submissionColumns = [
    {
      title: translateText(
        "teacherListening.submissions.table.student",
        "Student"
      ),
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <Space>
          <UserOutlined />
          <Text strong>
            {student?.firstName} {student?.lastName}
          </Text>
        </Space>
      ),
    },
    {
      title: translateText("teacherListening.submissions.table.email", "Email"),
      dataIndex: ["student", "email"],
      key: "email",
    },
    {
      title: translateText("teacherListening.submissions.table.score", "Score"),
      key: "score",
      render: (_, record) => (
        <Space>
          <TrophyOutlined style={{ color: "#faad14" }} />
          <Text strong>
            {record.score}/{record.answers?.length || 0}
          </Text>
        </Space>
      ),
    },
    {
      title: translateText(
        "teacherListening.submissions.table.percentage",
        "Percentage"
      ),
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage) => {
        const color =
          percentage >= 90
            ? "success"
            : percentage >= 80
            ? "processing"
            : percentage >= 70
            ? "warning"
            : "error";
        return <Tag color={color}>{percentage}%</Tag>;
      },
    },
    {
      title: translateText(
        "teacherListening.submissions.table.attempt",
        "Attempt"
      ),
      dataIndex: "attemptNumber",
      key: "attemptNumber",
      render: (attempt) => <Tag color="blue">#{attempt}</Tag>,
    },
    {
      title: translateText(
        "teacherListening.submissions.table.submitted",
        "Submitted"
      ),
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <Text type="secondary">
            {moment(date).format("MMM DD, YYYY HH:mm")}
          </Text>
        </Space>
      ),
    },
  ];

  const stats = useMemo(() => {
    if (submissions.length === 0) {
      return {
        total: 0,
        average: 0,
        passRate: 0,
      };
    }
    const total = submissions.length;
    const average =
      submissions.reduce((sum, submission) => sum + submission.percentage, 0) /
      total;
    const passCount = submissions.filter(
      (submission) => submission.percentage >= 70
    ).length;
    const passRate = (passCount / total) * 100;
    return {
      total,
      average: Number.isFinite(average) ? average.toFixed(1) : 0,
      passRate: Number.isFinite(passRate) ? passRate.toFixed(1) : 0,
    };
  }, [submissions]);

  const exerciseTabContent = (
    <Space direction="vertical" size={computedIsMobile ? 16 : 24} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: computedIsMobile ? "column" : "row",
          gap: computedIsMobile ? 12 : 16,
          flexWrap: "wrap",
        }}
      >
        <Input
          allowClear
          placeholder={translateText(
            "teacherListening.filters.searchPlaceholder",
            "Search exercises..."
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
            "teacherListening.filters.coursePlaceholder",
            "All courses"
          )}
        >
          <Option value="all">
            {translateText(
              "teacherListening.filters.allCourses",
              "All courses"
            )}
          </Option>
          {courses.map((course) => {
            const id = normalizeId(course);
            if (!id) {
              return null;
            }
            return (
              <Option key={id} value={id}>
                {course.title || course.name || course.code}
              </Option>
            );
          })}
        </Select>
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: computedIsMobile ? "100%" : 200 }}
        >
          <Option value="all">
            {translateText(
              "teacherListening.filters.status.all",
              "All statuses"
            )}
          </Option>
          <Option value="active">
            {translateText(
              "teacherListening.filters.status.active",
              "Active"
            )}
          </Option>
          <Option value="inactive">
            {translateText(
              "teacherListening.filters.status.inactive",
              "Inactive"
            )}
          </Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            width: computedIsMobile ? "100%" : "auto",
            marginLeft: computedIsMobile ? 0 : "auto",
          }}
          onClick={openExerciseModal}
        >
          {translateText(
            "teacherListening.actions.createExercise",
            "Create exercise"
          )}
        </Button>
      </div>

      {currentPlayingId && audioUrl && (
        <Card>
          <audio controls src={audioUrl} style={{ width: "100%" }} />
        </Card>
      )}

      <Table
        columns={exerciseColumns}
        dataSource={filteredExercises}
        rowKey={(record) => record._id || record.id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: translateText(
            "teacherListening.table.empty",
            "No listening exercises yet. Create your first exercise to get started."
          ),
        }}
      />
    </Space>
  );

  const submissionsTabContent =
    filteredExercises.length === 0 ? (
      <Empty
        description={translateText(
          "teacherListening.submissions.empty",
          "No submissions yet for this exercise."
        )}
      />
    ) : (
      <Space direction="vertical" size={computedIsMobile ? 16 : 24} style={{ width: "100%" }}>
        <Select
          value={selectedExerciseId || undefined}
          onChange={(value) => setSelectedExerciseId(value)}
          style={{ width: computedIsMobile ? "100%" : 320 }}
          placeholder={translateText(
            "teacherListening.submissions.selectPlaceholder",
            "Choose an exercise"
          )}
        >
          {filteredExercises.map((exercise) => (
            <Option key={exercise._id || exercise.id} value={exercise._id || exercise.id}>
              {exercise.title}
            </Option>
          ))}
        </Select>

        {selectedExercise ? (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title={translateText(
                      "teacherListening.submissions.stats.total",
                      "Total submissions"
                    )}
                    value={stats.total}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title={translateText(
                      "teacherListening.submissions.stats.average",
                      "Average score"
                    )}
                    value={stats.average}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title={translateText(
                      "teacherListening.submissions.stats.passRate",
                      "Pass rate (≥70%)"
                    )}
                    value={stats.passRate}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <Card>
              <Table
                columns={submissionColumns}
                dataSource={submissions}
                rowKey={(record) => record._id || record.id}
                loading={submissionsLoading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </>
        ) : (
          <Empty
            description={translateText(
              "teacherListening.submissions.selectPlaceholder",
              "Choose an exercise"
            )}
          />
        )}
      </Space>
    );

  return (
    <div style={{ padding: computedIsMobile ? "16px" : "24px" }}>
      <Card
        styles={{
          body: {
            padding: computedIsMobile ? 16 : 24,
          },
        }}
      >
        <Space direction="vertical" size={computedIsMobile ? 16 : 20} style={{ width: "100%" }}>
          <Space align="start" size={16}>
            <AudioOutlined style={{ fontSize: 28, color: "#1890ff" }} />
            <Space direction="vertical" size={4}>
              <Title level={2} style={{ margin: 0 }}>
                {translateText(
                  "teacherDashboard.sidebar.listeningExercises",
                  "Listening Exercises"
                )}
              </Title>
              <Text type="secondary">
                {translateText(
                  "teacherListening.subtitle",
                  "Create, curate, and review listening exercises for your learners."
                )}
              </Text>
            </Space>
          </Space>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "exercises",
                label: translateText(
                  "teacherListening.tabs.exercises",
                  "Exercises"
                ),
                children: exerciseTabContent,
              },
              {
                key: "submissions",
                label: translateText(
                  "teacherListening.tabs.submissions",
                  "Submissions"
                ),
                children: submissionsTabContent,
              },
            ]}
          />
        </Space>
      </Card>

      <Modal
        title={
          editingExercise
            ? translateText(
                "teacherListening.actions.update",
                "Update"
              )
            : translateText(
                "teacherListening.actions.create",
                "Create"
              )
        }
        open={exerciseModalVisible}
        onCancel={closeExerciseModal}
        footer={null}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
      >
        <Form form={exerciseForm} layout="vertical" onFinish={handleCreateExercise}>
          <Form.Item
            name="courseId"
            label={translateText("teacherListening.form.course", "Course")}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherListening.form.courseRequired",
                  "Please select a course"
                ),
              },
            ]}
          >
            <Select
              placeholder={translateText(
                "teacherListening.form.coursePlaceholder",
                "Select course"
              )}
            >
              {courses.map((course) => {
                const id = normalizeId(course);
                if (!id) {
                  return null;
                }
                return (
                  <Option key={id} value={id}>
                    {course.title || course.name || course.code}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label={translateText("teacherListening.form.title", "Exercise title")}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherListening.form.titleRequired",
                  "Please enter an exercise title"
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={translateText("teacherListening.form.description", "Description")}
          >
            <TextArea
              rows={4}
              placeholder={translateText(
                "teacherListening.form.descriptionPlaceholder",
                "Give instructions or context for this exercise"
              )}
            />
          </Form.Item>
          {!editingExercise && (
            <Form.Item
              label={translateText("teacherListening.form.audio", "Audio file")}
              required
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  {translateText(
                    "teacherListening.form.audioPlaceholder",
                    "Click or drag an audio file to upload"
                  )}
                </p>
              </Dragger>
            </Form.Item>
          )}
          <Form.Item
            name="isActive"
            label={translateText("teacherListening.form.status", "Status")}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={translateText(
                "teacherListening.table.columns.status",
                "Active"
              )}
              unCheckedChildren={translateText(
                "teacherListening.filters.status.inactive",
                "Inactive"
              )}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingExercise
                  ? translateText("teacherListening.actions.update", "Update")
                  : translateText("teacherListening.actions.create", "Create")}
              </Button>
              <Button onClick={closeExerciseModal}>
                {translateText("teacherListening.actions.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={translateText("teacherListening.view.title", "Exercise details")}
        open={viewExerciseModalVisible}
        onCancel={() => {
          setViewExerciseModalVisible(false);
          setViewingExercise(null);
        }}
        footer={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingQuestion(null);
              questionForm.resetFields();
              setQuestionModalVisible(true);
            }}
          >
            {translateText("teacherListening.actions.addQuestion", "Add question")}
          </Button>,
          <Button
            key="close"
            onClick={() => setViewExerciseModalVisible(false)}
          >
            {translateText("teacherListening.actions.cancel", "Cancel")}
          </Button>,
        ]}
        width={computedIsTablet ? 700 : 760}
        destroyOnHidden
      >
        {viewingExercise ? (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Descriptions bordered column={computedIsMobile ? 1 : 2} size="small">
              <Descriptions.Item label={translateText("teacherListening.form.title", "Exercise title")}>
                {viewingExercise.title}
              </Descriptions.Item>
              <Descriptions.Item label={translateText("teacherListening.form.course", "Course")}>
                {(() => {
                  const courseId =
                    viewingExercise.courseId || normalizeId(viewingExercise.course);
                  const course =
                    viewingExercise.course ||
                    courseMap[courseId] ||
                    courses.find((item) => normalizeId(item) === courseId);
                  return (
                    course?.title ||
                    course?.name ||
                    course?.code ||
                    translateText(
                      "teacherListening.table.courseUnknown",
                      "Unknown course"
                    )
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label={translateText("teacherListening.form.description", "Description")} span={2}>
                {viewingExercise.description ||
                  translateText("teacherListening.table.noDescription", "No description")}
              </Descriptions.Item>
              <Descriptions.Item label={translateText("teacherListening.table.columns.status", "Status")}>
                <Tag color={viewingExercise.isActive ? "green" : "default"}>
                  {viewingExercise.isActive
                    ? translateText(
                        "teacherListening.filters.status.active",
                        "Active"
                      )
                    : translateText(
                        "teacherListening.filters.status.inactive",
                        "Inactive"
                      )}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}>
                {translateText(
                  "teacherListening.view.questionsTitle",
                  "Questions"
                )}
              </Title>
              {viewingExercise.questions && viewingExercise.questions.length > 0 ? (
                viewingExercise.questions.map((question, index) => (
                  <Card key={index} style={{ marginBottom: 12 }} size="small">
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                      <Text strong>
                        {translateText("teacherListening.questions.question", "Question")}{" "}
                        {index + 1}: {question.question}
                      </Text>
                      <Text type="secondary">
                        {translateText(
                          "teacherListening.questions.options",
                          "Options"
                        )}
                        : {question.options?.join(", ") || "N/A"}
                      </Text>
                      <Text type="secondary">
                        {translateText(
                          "teacherListening.questions.correctAnswer",
                          "Correct answer"
                        )}
                        : {question.correctAnswer}
                      </Text>
                      <Space style={{ marginTop: 6 }}>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingQuestion(question);
                            questionForm.setFieldsValue({
                              question: question.question,
                              options: question.options?.join(", ") || "",
                              correctAnswer: question.correctAnswer,
                              points: question.points || 1,
                            });
                            setQuestionModalVisible(true);
                          }}
                        >
                          {translateText("teacherListening.actions.edit", "Edit")}
                        </Button>
                        <Popconfirm
                          title={translateText(
                            "teacherListening.questions.deleteConfirm",
                            "Delete this question?"
                          )}
                          onConfirm={() => handleDeleteQuestion(index)}
                        >
                          <Button size="small" danger icon={<DeleteOutlined />}>
                            {translateText("teacherListening.actions.delete", "Delete")}
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Space>
                  </Card>
                ))
              ) : (
                <Empty
                  description={translateText(
                    "teacherListening.questions.none",
                    "No questions yet"
                  )}
                />
              )}
            </div>
          </Space>
        ) : (
          <Empty />
        )}
      </Modal>

      <Modal
        title={translateText(
          editingQuestion
            ? "teacherListening.questions.modalTitle.edit"
            : "teacherListening.questions.modalTitle.add",
          editingQuestion ? "Edit question" : "Add question"
        )}
        open={questionModalVisible}
        onCancel={() => {
          setQuestionModalVisible(false);
          setEditingQuestion(null);
          questionForm.resetFields();
        }}
        footer={null}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
      >
        <Form form={questionForm} layout="vertical" onFinish={handleAddQuestion}>
          <Form.Item
            name="question"
            label={translateText(
              "teacherListening.questions.question",
              "Question"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherListening.questions.questionRequired",
                  "Please enter a question"
                ),
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="options"
            label={translateText(
              "teacherListening.questions.options",
              "Options (comma separated)"
            )}
          >
            <Input
              placeholder={translateText(
                "teacherListening.questions.options",
                "Option 1, Option 2, Option 3, Option 4"
              )}
            />
          </Form.Item>
          <Form.Item
            name="correctAnswer"
            label={translateText(
              "teacherListening.questions.correctAnswer",
              "Correct answer"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherListening.questions.correctAnswerRequired",
                  "Please enter the correct answer"
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="points"
            label={translateText("teacherListening.questions.points", "Points")}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuestion
                  ? translateText(
                      "teacherListening.questions.update",
                      "Update"
                    )
                  : translateText("teacherListening.questions.add", "Add")}
              </Button>
              <Button onClick={() => setQuestionModalVisible(false)}>
                {translateText("teacherListening.actions.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherListeningExercises;

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
  Divider,
  Grid,
  Radio,
  Spin,
  Statistic,
  List,
} from "antd";
import {
  QuestionCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  UserOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { quizAPI, courseAPI, userAPI } from "../../utils/apiClient";
import { ensureTeacherMyClassesTranslations } from "../../utils/teacherMyClassesTranslations";

const ASSIGNMENTS_STORAGE_KEY = "forumAcademy.quizAssignments";
const STUDENT_ASSIGNMENTS_STORAGE_KEY =
  "forumAcademy.quizAssignments.byStudent";

const normalizeId = (entity) => {
  if (!entity) {
    return undefined;
  }
  if (typeof entity === "string") {
    return entity;
  }
  return entity._id || entity.id || entity.value || undefined;
};

const getDisplayName = (user) => {
  if (!user) {
    return "";
  }
  if (typeof user === "string") {
    return user;
  }
  const { firstName, lastName, name, username, email } = user;
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ").trim();
  }
  return name || username || email || "";
};

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const TeacherQuizManagement = ({
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
  useEffect(() => {
    ensureTeacherMyClassesTranslations(i18n);
  }, [i18n]);
  const computedIsMobile =
    typeof isMobile === "boolean" ? isMobile : !screens.md;
  const computedIsTablet = screens.md && !screens.lg;

  const [quizForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [assignmentForm] = Form.useForm();
  const questionTypeWatch = Form.useWatch("type", questionForm);

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [viewQuizModalVisible, setViewQuizModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState(null);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedQuizForAssignment, setSelectedQuizForAssignment] =
    useState(null);
  const [assignmentCourses, setAssignmentCourses] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasWindow = typeof window !== "undefined";

  const loadStoredAssignments = useCallback(() => {
    if (!hasWindow) {
      return {};
    }
    try {
      const raw = window.localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
      return {};
    } catch (error) {
      console.warn("Failed to load quiz assignments from storage:", error);
      return {};
    }
  }, [hasWindow]);

  const persistAssignments = useCallback(
    (nextAssignments) => {
      setAssignments(nextAssignments);
      if (!hasWindow) {
        return;
      }
      try {
        window.localStorage.setItem(
          ASSIGNMENTS_STORAGE_KEY,
          JSON.stringify(nextAssignments)
        );
      } catch (error) {
        console.warn("Unable to persist quiz assignments:", error);
      }
    },
    [hasWindow]
  );

  const syncStudentAssignments = useCallback(
    (assignmentMap) => {
      if (!hasWindow) {
        return;
      }
      try {
        const studentAssignments = {};
        Object.values(assignmentMap || {}).forEach((assignment) => {
          if (!assignment || !assignment.studentIds) {
            return;
          }
          assignment.studentIds.forEach((studentId) => {
            if (!studentAssignments[studentId]) {
              studentAssignments[studentId] = {};
            }
            studentAssignments[studentId][assignment.quizId] = assignment;
          });
        });
        window.localStorage.setItem(
          STUDENT_ASSIGNMENTS_STORAGE_KEY,
          JSON.stringify(studentAssignments)
        );
      } catch (error) {
        console.warn("Unable to sync student assignments:", error);
      }
    },
    [hasWindow]
  );

  useEffect(() => {
    setAssignments(loadStoredAssignments());
  }, [loadStoredAssignments]);

  useEffect(() => {
    syncStudentAssignments(assignments);
  }, [assignments, syncStudentAssignments]);
  useEffect(() => {
    setViewingQuiz((previous) => {
      if (!previous) {
        return previous;
      }
      const quizId = normalizeId(previous);
      if (!quizId) {
        return previous;
      }
      const updatedAssignment = assignments[quizId];
      if (previous.assignment === updatedAssignment) {
        return previous;
      }
      return {
        ...previous,
        assignment: updatedAssignment,
      };
    });
  }, [assignments]);

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

  const studentMap = useMemo(() => {
    const map = {};
    students.forEach((student) => {
      const id = normalizeId(student);
      if (id) {
        map[id] = student;
      }
    });
    return map;
  }, [students]);

  const studentsByCourse = useMemo(() => {
    const map = {};
    courses.forEach((course) => {
      const id = normalizeId(course);
      if (!id) {
        return;
      }
      const rawStudents =
        course.students ||
        course.enrolledStudents ||
        course.participants ||
        course.learners ||
        course.studentIds ||
        [];
      const studentIds = Array.isArray(rawStudents)
        ? rawStudents.map((student) => normalizeId(student)).filter(Boolean)
        : [];
      map[id] = Array.from(new Set(studentIds));
    });
    return map;
  }, [courses]);

  const availableStudentsForAssignment = useMemo(() => {
    if (!assignmentCourses.length) {
      return students;
    }
    const allowedIds = new Set();
    assignmentCourses.forEach((courseId) => {
      (studentsByCourse[courseId] || []).forEach((studentId) =>
        allowedIds.add(studentId)
      );
    });
    if (!allowedIds.size) {
      return students;
    }
    return students.filter((student) => allowedIds.has(normalizeId(student)));
  }, [assignmentCourses, students, studentsByCourse]);

  const enrichedQuizzes = useMemo(
    () =>
      quizzes.map((quiz) => {
        const quizId = normalizeId(quiz);
        const assignment = quizId ? assignments[quizId] : undefined;
        return {
          ...quiz,
          assignment,
        };
      }),
    [quizzes, assignments]
  );

  const filteredQuizzes = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    return enrichedQuizzes.filter((quiz) => {
      const assignment = quiz.assignment;
      const matchesSearch =
        !searchValue ||
        quiz.title?.toLowerCase().includes(searchValue) ||
        quiz.description?.toLowerCase().includes(searchValue);

      const quizCourseId = normalizeId(quiz.course) || quiz.courseId;
      const matchesCourse =
        courseFilter === "all" ||
        (quizCourseId && quizCourseId === courseFilter);

      const isAssigned =
        assignment &&
        ((assignment.studentIds && assignment.studentIds.length > 0) ||
          (assignment.courseIds && assignment.courseIds.length > 0));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && quiz.isActive !== false) ||
        (statusFilter === "inactive" && quiz.isActive === false) ||
        (statusFilter === "assigned" && isAssigned) ||
        (statusFilter === "unassigned" && !isAssigned);

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [enrichedQuizzes, searchTerm, courseFilter, statusFilter]);

  const courseFilterOptions = useMemo(
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
              "teacherQuizManagement.filters.courseFallback",
              "Untitled course"
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
          "teacherQuizManagement.filters.status.all",
          "All statuses"
        ),
      },
      {
        value: "active",
        label: translateText(
          "teacherQuizManagement.filters.status.active",
          "Active"
        ),
      },
      {
        value: "inactive",
        label: translateText(
          "teacherQuizManagement.filters.status.inactive",
          "Inactive"
        ),
      },
      {
        value: "assigned",
        label: translateText(
          "teacherQuizManagement.filters.status.assigned",
          "Assigned"
        ),
      },
      {
        value: "unassigned",
        label: translateText(
          "teacherQuizManagement.filters.status.unassigned",
          "Unassigned"
        ),
      },
    ],
    [translateText]
  );

  const fetchCourses = useCallback(async () => {
    try {
      console.log("🔍 Fetching courses...");
      console.log("📋 Current user:", currentUser);
      const response = await courseAPI.getAll();
      console.log("✅ Courses API response:", response);

      const rawCourses = response?.courses || response?.data || response || [];
      console.log("📦 Raw courses:", rawCourses);

      const courseList = Array.isArray(rawCourses) ? rawCourses : [];
      console.log("📊 Course list (array):", courseList.length, "courses");

      // TEMPORARY FIX: Show ALL courses (remove teacher filtering)
      // const teacherId = normalizeId(currentUser);
      // console.log("👤 Teacher ID:", teacherId);

      // const teacherCourses = courseList.filter((course) => {
      //   const courseTeacherId =
      //     normalizeId(course.instructor) ||
      //     normalizeId(course.teacher) ||
      //     course.teacherId ||
      //     course.ownerId;
      //   console.log(`🔎 Course "${course.title}" instructor ID:`, courseTeacherId, "matches:", courseTeacherId === teacherId);
      //   return teacherId ? courseTeacherId === teacherId : true;
      // });

      // console.log("✅ Teacher's courses:", teacherCourses.length);
      // const finalCourses = teacherId ? teacherCourses : courseList;

      const finalCourses = courseList; // Show all courses
      console.log("📋 Final courses to display:", finalCourses.length);
      setCourses(finalCourses);

      if (finalCourses.length === 0) {
        message.warning(
          translateText(
            "teacherQuizManagement.noCourses",
            "No courses found. Please create a course first."
          )
        );
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      message.error(
        translateText(
          "teacherQuizManagement.fetchCoursesError",
          "Failed to load courses"
        )
      );
    }
  }, [currentUser, translateText]);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAll();
      const rawQuizzes = response?.quizzes || response?.data || response || [];
      const quizList = Array.isArray(rawQuizzes) ? rawQuizzes : [];
      const teacherId = normalizeId(currentUser);
      const teacherQuizzes = quizList.filter((quiz) => {
        const quizTeacherId =
          normalizeId(quiz.teacher) ||
          quiz.teacherId ||
          normalizeId(quiz.createdBy) ||
          quiz.ownerId;
        return teacherId ? quizTeacherId === teacherId : true;
      });
      setQuizzes(teacherId ? teacherQuizzes : quizList);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      message.error(
        translateText(
          "teacherQuizManagement.feedback.fetchQuizzesFailed",
          "Failed to fetch quizzes"
        )
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, translateText]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = (await userAPI.getByRole)
        ? await userAPI.getByRole("student")
        : await userAPI.getAll();
      const rawStudents = response?.users || response?.data || response || [];
      const studentList = Array.isArray(rawStudents) ? rawStudents : [];
      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
    fetchStudents();
  }, [fetchCourses, fetchQuizzes, fetchStudents]);

  const handleCreateQuiz = async (values) => {
    try {
      const quizData = {
        title: values.title,
        description: values.description,
        course: values.courseId,
        courseId: values.courseId,
        duration: values.duration || 60,
        passingScore: values.passingScore || 60,
        maxAttempts: values.maxAttempts || 1,
        isActive: values.isActive !== false,
        isPublished: values.isActive !== false, // ✅ Also set isPublished for student visibility
        teacher: currentUser?.id,
        teacherId: currentUser?.id,
        questions: [],
      };

      if (editingQuiz) {
        await quizAPI.update(editingQuiz._id, quizData);
        message.success(
          translateText(
            "teacherQuizManagement.feedback.quizUpdated",
            "Quiz updated successfully"
          )
        );
      } else {
        await quizAPI.create(quizData);
        message.success(
          translateText(
            "teacherQuizManagement.feedback.quizCreated",
            "Quiz created successfully"
          )
        );
      }

      setQuizModalVisible(false);
      quizForm.resetFields();
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (error) {
      message.error(
        error.message ||
          translateText(
            "teacherQuizManagement.feedback.quizSaveFailed",
            "Error saving quiz"
          )
      );
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    quizForm.setFieldsValue({
      title: quiz.title,
      description: quiz.description,
      courseId: normalizeId(quiz.course) || quiz.courseId,
      duration: quiz.duration || 60,
      passingScore: quiz.passingScore || 60,
      maxAttempts: quiz.maxAttempts || 1,
      isActive: quiz.isActive !== false,
    });
    setQuizModalVisible(true);
  };

  const handleViewQuiz = (quiz) => {
    const quizId = normalizeId(quiz);
    const assignment = quizId ? assignments[quizId] : undefined;
    setViewingQuiz({
      ...quiz,
      assignment,
    });
    setViewQuizModalVisible(true);
  };

  const openAssignmentModal = (quiz) => {
    const quizId = normalizeId(quiz);
    const existingAssignment = quizId ? assignments[quizId] : undefined;
    setSelectedQuizForAssignment(quiz);
    setAssignmentModalVisible(true);
    setAssignmentCourses(existingAssignment?.courseIds || []);
    assignmentForm.resetFields();
    assignmentForm.setFieldsValue({
      assignedCourses: existingAssignment?.courseIds || [],
      assignedStudents: existingAssignment?.studentIds || [],
      dueDate: existingAssignment?.dueDate
        ? moment(existingAssignment.dueDate)
        : null,
      instructions: existingAssignment?.notes,
      notifyStudents:
        typeof existingAssignment?.notifyStudents === "boolean"
          ? existingAssignment.notifyStudents
          : true,
    });
  };

  const closeAssignmentModal = () => {
    setAssignmentModalVisible(false);
    setSelectedQuizForAssignment(null);
    assignmentForm.resetFields();
    setAssignmentCourses([]);
    setAssigning(false);
  };

  const handleAssignQuiz = async (values) => {
    if (!selectedQuizForAssignment) {
      return;
    }
    const quizId = normalizeId(selectedQuizForAssignment);
    if (!quizId) {
      message.error(
        translateText(
          "teacherQuizManagement.feedback.assignmentNoQuiz",
          "Unable to identify the selected quiz"
        )
      );
      return;
    }

    setAssigning(true);
    try {
      const courseIds = values.assignedCourses || [];
      const manualStudentIds = values.assignedStudents || [];
      const studentIdsFromCourses = courseIds.flatMap(
        (courseId) => studentsByCourse[courseId] || []
      );
      const mergedStudentIds = Array.from(
        new Set([...manualStudentIds, ...studentIdsFromCourses])
      );

      if (!courseIds.length && !mergedStudentIds.length) {
        const nextAssignments = { ...assignments };
        delete nextAssignments[quizId];
        persistAssignments(nextAssignments);
        syncStudentAssignments(nextAssignments);
        message.success(
          translateText(
            "teacherQuizManagement.feedback.assignmentCleared",
            "Quiz assignment cleared"
          )
        );
        if (viewingQuiz && normalizeId(viewingQuiz) === quizId) {
          setViewingQuiz((prev) =>
            prev
              ? {
                  ...prev,
                  assignment: undefined,
                }
              : prev
          );
        }
        closeAssignmentModal();
        return;
      }

      const assignmentRecord = {
        quizId,
        quizTitle: selectedQuizForAssignment.title,
        courseIds,
        studentIds: mergedStudentIds,
        assignedAt: new Date().toISOString(),
        assignedBy: normalizeId(currentUser) || null,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        notes: values.instructions || "",
        notifyStudents:
          typeof values.notifyStudents === "boolean"
            ? values.notifyStudents
            : true,
        courseDetails: courseIds.map((id) => {
          const course = courseMap[id];
          return {
            id,
            title:
              course?.title ||
              course?.name ||
              course?.code ||
              translateText(
                "teacherQuizManagement.assignment.unknownCourse",
                "Course"
              ),
          };
        }),
        studentDetails: mergedStudentIds.map((id) => {
          const student = studentMap[id];
          return {
            id,
            name: getDisplayName(student),
            email: student?.email,
          };
        }),
      };

      const nextAssignments = {
        ...assignments,
        [quizId]: assignmentRecord,
      };
      persistAssignments(nextAssignments);
      syncStudentAssignments(nextAssignments);

      message.success(
        translateText(
          "teacherQuizManagement.feedback.assignmentSaved",
          "Quiz assigned successfully"
        )
      );

      if (viewingQuiz && normalizeId(viewingQuiz) === quizId) {
        setViewingQuiz((prev) =>
          prev
            ? {
                ...prev,
                assignment: assignmentRecord,
              }
            : prev
        );
      }

      closeAssignmentModal();
    } catch (error) {
      console.error("Error saving assignment:", error);
      message.error(
        translateText(
          "teacherQuizManagement.feedback.assignmentFailed",
          "Failed to assign quiz"
        )
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.delete(quizId);
      message.success(
        translateText(
          "teacherQuizManagement.feedback.quizDeleted",
          "Quiz deleted successfully"
        )
      );
      fetchQuizzes();
      const normalizedId = normalizeId(quizId);
      if (normalizedId && assignments[normalizedId]) {
        const nextAssignments = { ...assignments };
        delete nextAssignments[normalizedId];
        persistAssignments(nextAssignments);
        syncStudentAssignments(nextAssignments);
      }
    } catch (err) {
      message.error(
        translateText(
          "teacherQuizManagement.feedback.quizDeleteFailed",
          "Failed to delete quiz"
        )
      );
    }
  };

  const handleAddQuestion = async (values) => {
    try {
      if (!viewingQuiz) {
        message.error(
          translateText(
            "teacherQuizManagement.feedback.questionNoQuiz",
            "Please select a quiz before adding questions"
          )
        );
        return;
      }

      // Collect individual option fields
      const options = [
        values.option1,
        values.option2,
        values.option3,
        values.option4,
      ].filter(Boolean); // Remove any empty options

      // Map A/B/C/D to the actual option text
      const correctAnswerMap = {
        A: values.option1,
        B: values.option2,
        C: values.option3,
        D: values.option4,
      };

      const correctAnswerText =
        correctAnswerMap[values.correctAnswer] || values.correctAnswer;

      // Convert to the format expected by backend: array of {text, isCorrect}
      const formattedOptions = options.map((optionText) => ({
        text: optionText.trim(),
        isCorrect: optionText.trim() === correctAnswerText.trim(),
      }));

      const questionData = {
        question: values.question,
        type: "multiple_choice", // Always multiple choice
        options: formattedOptions,
        correctAnswer: correctAnswerText, // Use the actual text, not A/B/C/D
        points: values.points || 1,
      };

      if (editingQuestion) {
        await quizAPI.updateQuestion(
          viewingQuiz._id,
          editingQuestion._id || editingQuestion.id,
          questionData
        );
        message.success(
          translateText(
            "teacherQuizManagement.feedback.questionUpdated",
            "Question updated successfully"
          )
        );
      } else {
        await quizAPI.addQuestion(viewingQuiz._id, questionData);
        message.success(
          translateText(
            "teacherQuizManagement.feedback.questionAdded",
            "Question added successfully"
          )
        );
      }

      setQuestionModalVisible(false);
      questionForm.resetFields();
      setEditingQuestion(null);
      fetchQuizzes();
      if (viewingQuiz?._id || viewingQuiz?.id) {
        const updatedQuiz = await quizAPI.getById(
          viewingQuiz._id || viewingQuiz.id
        );
        if (updatedQuiz.success || updatedQuiz._id) {
          const quizData = updatedQuiz.quiz || updatedQuiz;
          const quizId = normalizeId(quizData);
          setViewingQuiz({
            ...quizData,
            assignment: quizId ? assignments[quizId] : undefined,
          });
        }
      }
    } catch (error) {
      message.error(
        error.message ||
          translateText(
            "teacherQuizManagement.feedback.questionSaveFailed",
            "Error saving question"
          )
      );
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);

    // Extract options from the question
    let option1 = "",
      option2 = "",
      option3 = "",
      option4 = "";

    if (Array.isArray(question.options)) {
      // Handle both string array and object array formats
      const optionTexts = question.options.map((opt) =>
        typeof opt === "string" ? opt : opt.text || opt.value || ""
      );

      option1 = optionTexts[0] || "";
      option2 = optionTexts[1] || "";
      option3 = optionTexts[2] || "";
      option4 = optionTexts[3] || "";
    }

    // Convert correct answer text to A/B/C/D
    let correctAnswerLetter = question.correctAnswer;
    if (question.correctAnswer === option1) correctAnswerLetter = "A";
    else if (question.correctAnswer === option2) correctAnswerLetter = "B";
    else if (question.correctAnswer === option3) correctAnswerLetter = "C";
    else if (question.correctAnswer === option4) correctAnswerLetter = "D";

    questionForm.setFieldsValue({
      question: question.question,
      type: "multiple_choice",
      option1,
      option2,
      option3,
      option4,
      correctAnswer: correctAnswerLetter,
      points: question.points || 1,
    });
    setQuestionModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      if (!viewingQuiz) {
        return;
      }
      await quizAPI.deleteQuestion(viewingQuiz._id, questionId);
      message.success(
        translateText(
          "teacherQuizManagement.feedback.questionDeleted",
          "Question deleted successfully"
        )
      );
      fetchQuizzes();
      const updatedQuiz = await quizAPI.getById(viewingQuiz._id);
      if (updatedQuiz.success || updatedQuiz._id) {
        const quizData = updatedQuiz.quiz || updatedQuiz;
        const quizIdentifier = normalizeId(quizData);
        setViewingQuiz({
          ...quizData,
          assignment: quizIdentifier ? assignments[quizIdentifier] : undefined,
        });
      }
    } catch (error) {
      message.error(
        translateText(
          "teacherQuizManagement.feedback.questionDeleteFailed",
          "Failed to delete question"
        )
      );
    }
  };

  const handleViewResults = async (quiz) => {
    try {
      setLoadingSubmissions(true);
      setSelectedQuizForResults(quiz);
      setResultsModalVisible(true);
      const submissions = await quizAPI.getSubmissions(quiz._id || quiz.id);
      setQuizSubmissions(submissions);
    } catch (error) {
      message.error(
        translateText(
          "teacherQuizManagement.feedback.loadResultsFailed",
          "Failed to load quiz results"
        )
      );
      console.error("Error loading quiz results:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const quizColumns = [
    {
      title: translateText(
        "teacherQuizManagement.table.columns.title",
        "Quiz Title"
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
                "teacherQuizManagement.table.noDescription",
                "No description"
              )}
          </Text>
        </div>
      ),
    },
    {
      title: translateText(
        "teacherQuizManagement.table.columns.course",
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
            "teacherQuizManagement.table.courseUnknown",
            "Unknown course"
          );
        return <Tag color="blue">{label}</Tag>;
      },
    },
    {
      title: translateText(
        "teacherQuizManagement.table.columns.questions",
        "Questions"
      ),
      dataIndex: "questions",
      key: "questions",
      render: (questions) => (
        <Tag color="geekblue">{questions?.length || 0}</Tag>
      ),
    },
    {
      title: translateText(
        "teacherQuizManagement.table.columns.assignment",
        "Assignment"
      ),
      key: "assignment",
      render: (_, record) => {
        const assignment = record.assignment;
        if (
          !assignment ||
          ((!assignment.studentIds || !assignment.studentIds.length) &&
            (!assignment.courseIds || !assignment.courseIds.length))
        ) {
          return (
            <Tag>
              {translateText(
                "teacherQuizManagement.table.assignment.none",
                "Not assigned"
              )}
            </Tag>
          );
        }

        const studentCount = assignment.studentIds?.length || 0;
        const courseCount = assignment.courseIds?.length || 0;
        const formattedDueDate = assignment.dueDate
          ? moment(assignment.dueDate)
          : null;

        return (
          <Space direction="vertical" size={2}>
            {courseCount > 0 && (
              <Tag color="gold">
                <TeamOutlined style={{ marginRight: 4 }} />
                {courseCount}{" "}
                {translateText(
                  "teacherQuizManagement.table.assignment.courses",
                  "classes"
                )}
              </Tag>
            )}
            {studentCount > 0 && (
              <Tag color="purple">
                <UserOutlined style={{ marginRight: 4 }} />
                {studentCount}{" "}
                {translateText(
                  "teacherQuizManagement.table.assignment.students",
                  "students"
                )}
              </Tag>
            )}
            {formattedDueDate && (
              <Text
                type={
                  formattedDueDate.isBefore(moment()) ? "danger" : "secondary"
                }
                style={{ fontSize: 12 }}
              >
                <FieldTimeOutlined style={{ marginRight: 4 }} />
                {formattedDueDate.format("MMM DD, YYYY HH:mm")}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: translateText(
        "teacherQuizManagement.table.columns.status",
        "Status"
      ),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive
            ? translateText(
                "teacherQuizManagement.table.status.active",
                "Active"
              )
            : translateText(
                "teacherQuizManagement.table.status.inactive",
                "Inactive"
              )}
        </Tag>
      ),
    },
    {
      title: translateText(
        "teacherQuizManagement.table.columns.actions",
        "Actions"
      ),
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Tooltip
            title={translateText("teacherQuizManagement.actions.view", "View")}
          >
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewQuiz(record)}
            />
          </Tooltip>
          <Tooltip
            title={translateText("teacherQuizManagement.actions.edit", "Edit")}
          >
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditQuiz(record)}
            />
          </Tooltip>
          <Tooltip
            title={translateText(
              "teacherQuizManagement.actions.results",
              "View Results"
            )}
          >
            <Button
              icon={<BarChartOutlined />}
              size="small"
              type="primary"
              onClick={() => handleViewResults(record)}
            />
          </Tooltip>
          <Tooltip
            title={translateText(
              "teacherQuizManagement.actions.assign",
              "Assign"
            )}
          >
            <Button
              icon={<TeamOutlined />}
              size="small"
              type="default"
              onClick={() => openAssignmentModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title={translateText(
              "teacherQuizManagement.actions.deleteConfirm",
              "Are you sure you want to delete this quiz?"
            )}
            onConfirm={() => handleDeleteQuiz(record._id || record.id)}
          >
            <Tooltip
              title={translateText(
                "teacherQuizManagement.actions.delete",
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
            <QuestionCircleOutlined
              style={{ fontSize: 28, color: "#1890ff" }}
            />
            <Space direction="vertical" size={4}>
              <Title level={2} style={{ margin: 0 }}>
                {translateText(
                  "teacherDashboard.sidebar.quizManagement",
                  "Quiz Management"
                )}
              </Title>
              <Text type="secondary">
                {translateText(
                  "teacherQuizManagement.subtitle",
                  "Create, organize, and assign quizzes to your learners."
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
                "teacherQuizManagement.filters.searchPlaceholder",
                "Search quizzes..."
              )}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: computedIsMobile ? "100%" : 260 }}
            />
            <Select
              value={courseFilter === "all" ? "all" : courseFilter}
              onChange={(value) => setCourseFilter(value)}
              style={{ width: computedIsMobile ? "100%" : 220 }}
              placeholder={translateText(
                "teacherQuizManagement.filters.coursePlaceholder",
                "Filter by course"
              )}
            >
              <Option value="all">
                {translateText(
                  "teacherQuizManagement.filters.allCourses",
                  "All courses"
                )}
              </Option>
              {courseFilterOptions
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
              onClick={() => {
                setEditingQuiz(null);
                quizForm.resetFields();
                setQuizModalVisible(true);
              }}
            >
              {translateText(
                "teacherQuizManagement.actions.createQuiz",
                "Create quiz"
              )}
            </Button>
          </div>

          <Table
            columns={quizColumns}
            dataSource={filteredQuizzes}
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
                    "teacherQuizManagement.table.empty",
                    "No quizzes yet. Create your first quiz to get started."
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
          editingQuiz
            ? "teacherQuizManagement.modal.editTitle"
            : "teacherQuizManagement.modal.createTitle",
          editingQuiz ? "Edit quiz" : "Create quiz"
        )}
        open={quizModalVisible}
        onCancel={() => {
          setQuizModalVisible(false);
          setEditingQuiz(null);
          quizForm.resetFields();
        }}
        footer={null}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
        maskClosable={false}
      >
        <Form form={quizForm} layout="vertical" onFinish={handleCreateQuiz}>
          <Form.Item
            name="courseId"
            label={translateText("teacherQuizManagement.form.course", "Course")}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherQuizManagement.form.courseRequired",
                  "Please select a course"
                ),
              },
            ]}
          >
            <Select
              placeholder={translateText(
                "teacherQuizManagement.form.coursePlaceholder",
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
                    "teacherQuizManagement.filters.courseFallback",
                    "Untitled course"
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
              "teacherQuizManagement.form.quizTitle",
              "Quiz title"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherQuizManagement.form.titleRequired",
                  "Please enter a quiz title"
                ),
              },
            ]}
          >
            <Input
              placeholder={translateText(
                "teacherQuizManagement.form.quizTitlePlaceholder",
                "e.g. Midterm Review Quiz"
              )}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={translateText(
              "teacherQuizManagement.form.description",
              "Description"
            )}
          >
            <TextArea
              rows={4}
              placeholder={translateText(
                "teacherQuizManagement.form.descriptionPlaceholder",
                "Add notes or instructions for your students"
              )}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="duration"
                label={translateText(
                  "teacherQuizManagement.form.duration",
                  "Duration (minutes)"
                )}
                initialValue={60}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="passingScore"
                label={translateText(
                  "teacherQuizManagement.form.passingScore",
                  "Passing score (%)"
                )}
                initialValue={60}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="maxAttempts"
                label={translateText(
                  "teacherQuizManagement.form.maxAttempts",
                  "Max attempts"
                )}
                initialValue={1}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="isActive"
            label={translateText("teacherQuizManagement.form.status", "Status")}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={translateText(
                "teacherQuizManagement.table.status.active",
                "Active"
              )}
              unCheckedChildren={translateText(
                "teacherQuizManagement.table.status.inactive",
                "Inactive"
              )}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuiz
                  ? translateText(
                      "teacherQuizManagement.actions.update",
                      "Update"
                    )
                  : translateText(
                      "teacherQuizManagement.actions.create",
                      "Create"
                    )}
              </Button>
              <Button onClick={() => setQuizModalVisible(false)}>
                {translateText("common.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={translateText(
          "teacherQuizManagement.modal.assignmentTitle",
          "Assign quiz"
        )}
        open={assignmentModalVisible}
        onCancel={closeAssignmentModal}
        footer={null}
        width={computedIsTablet ? 640 : 600}
        destroyOnHidden
      >
        <Form
          form={assignmentForm}
          layout="vertical"
          onFinish={handleAssignQuiz}
        >
          <Form.Item
            name="assignedCourses"
            label={translateText(
              "teacherQuizManagement.assignment.coursesLabel",
              "Assign to classes"
            )}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder={translateText(
                "teacherQuizManagement.assignment.coursesPlaceholder",
                "Select one or more classes"
              )}
              onChange={(value) => setAssignmentCourses(value || [])}
            >
              {courseFilterOptions
                .filter((option) => option.value)
                .map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="assignedStudents"
            label={translateText(
              "teacherQuizManagement.assignment.studentsLabel",
              "Assign to specific students"
            )}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder={translateText(
                "teacherQuizManagement.assignment.studentsPlaceholder",
                "Search and add students"
              )}
            >
              {availableStudentsForAssignment
                .map((student) => {
                  const id = normalizeId(student);
                  if (!id) {
                    return null;
                  }
                  const name = getDisplayName(student);
                  return (
                    <Option key={id} value={id}>
                      {name}
                      {student?.email ? ` (${student.email})` : ""}
                    </Option>
                  );
                })
                .filter(Boolean)}
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label={translateText(
              "teacherQuizManagement.assignment.dueDate",
              "Due date"
            )}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="MMM DD, YYYY HH:mm"
              placeholder={translateText(
                "teacherQuizManagement.assignment.dueDatePlaceholder",
                "Select due date (optional)"
              )}
            />
          </Form.Item>
          <Form.Item
            name="instructions"
            label={translateText(
              "teacherQuizManagement.assignment.instructions",
              "Additional instructions"
            )}
          >
            <TextArea
              rows={3}
              placeholder={translateText(
                "teacherQuizManagement.assignment.instructionsPlaceholder",
                "Share notes, resources, or expectations"
              )}
            />
          </Form.Item>
          <Form.Item
            name="notifyStudents"
            label={translateText(
              "teacherQuizManagement.assignment.notify",
              "Notify students"
            )}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={translateText("common.yes", "Yes")}
              unCheckedChildren={translateText("common.no", "No")}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={assigning}>
                {translateText(
                  "teacherQuizManagement.assignment.save",
                  "Save assignment"
                )}
              </Button>
              <Button onClick={closeAssignmentModal}>
                {translateText("common.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={translateText(
          "teacherQuizManagement.modal.viewTitle",
          "Quiz details"
        )}
        open={viewQuizModalVisible}
        onCancel={() => {
          setViewQuizModalVisible(false);
          setViewingQuiz(null);
        }}
        footer={[
          <Button
            key="assign"
            icon={<TeamOutlined />}
            onClick={() => viewingQuiz && openAssignmentModal(viewingQuiz)}
          >
            {translateText("teacherQuizManagement.actions.assign", "Assign")}
          </Button>,
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
            {translateText(
              "teacherQuizManagement.actions.addQuestion",
              "Add question"
            )}
          </Button>,
          <Button key="close" onClick={() => setViewQuizModalVisible(false)}>
            {translateText("common.close", "Close")}
          </Button>,
        ]}
        width={computedIsTablet ? 820 : 760}
        destroyOnHidden
      >
        {viewingQuiz && (
          <>
            <Descriptions
              column={computedIsMobile ? 1 : 2}
              bordered
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.title",
                  "Title"
                )}
              >
                {viewingQuiz.title}
              </Descriptions.Item>
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.course",
                  "Course"
                )}
              >
                {(() => {
                  const courseId =
                    normalizeId(viewingQuiz.course) || viewingQuiz.courseId;
                  const course =
                    courseId && courseMap[courseId]
                      ? courseMap[courseId]
                      : typeof viewingQuiz.course === "object"
                      ? viewingQuiz.course
                      : null;
                  return (
                    course?.title ||
                    course?.name ||
                    course?.code ||
                    translateText(
                      "teacherQuizManagement.table.courseUnknown",
                      "Unknown course"
                    )
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.duration",
                  "Duration"
                )}
              >
                {viewingQuiz.duration}{" "}
                {translateText("teacherQuizManagement.view.minutes", "minutes")}
              </Descriptions.Item>
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.passingScore",
                  "Passing score"
                )}
              >
                {viewingQuiz.passingScore}%
              </Descriptions.Item>
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.maxAttempts",
                  "Max attempts"
                )}
              >
                {viewingQuiz.maxAttempts}
              </Descriptions.Item>
              <Descriptions.Item
                label={translateText(
                  "teacherQuizManagement.view.status",
                  "Status"
                )}
              >
                <Tag color={viewingQuiz.isActive ? "green" : "default"}>
                  {viewingQuiz.isActive
                    ? translateText(
                        "teacherQuizManagement.table.status.active",
                        "Active"
                      )
                    : translateText(
                        "teacherQuizManagement.table.status.inactive",
                        "Inactive"
                      )}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                span={2}
                label={translateText(
                  "teacherQuizManagement.view.assignment",
                  "Assignment"
                )}
              >
                {viewingQuiz.assignment ? (
                  <Space direction="vertical" size={6}>
                    <Space wrap>
                      {(
                        viewingQuiz.assignment.courseDetails ||
                        viewingQuiz.assignment.courseIds ||
                        []
                      ).map((course) => {
                        const courseId = normalizeId(course);
                        const courseData =
                          (courseId && courseMap[courseId]) || course;
                        const label =
                          courseData?.title ||
                          courseData?.name ||
                          courseData?.code ||
                          translateText(
                            "teacherQuizManagement.table.courseUnknown",
                            "Unknown course"
                          );
                        return (
                          <Tag key={`course-${courseId || label}`} color="gold">
                            <TeamOutlined style={{ marginRight: 4 }} />
                            {label}
                          </Tag>
                        );
                      })}
                    </Space>
                    <Space wrap>
                      {(
                        viewingQuiz.assignment.studentDetails ||
                        viewingQuiz.assignment.studentIds ||
                        []
                      ).map((student) => {
                        const studentId = normalizeId(student);
                        const studentData =
                          (studentId && studentMap[studentId]) || student;
                        const name = getDisplayName(studentData);
                        return (
                          <Tag
                            key={`student-${studentId || name}`}
                            color="purple"
                          >
                            <UserOutlined style={{ marginRight: 4 }} />
                            {name}
                          </Tag>
                        );
                      })}
                    </Space>
                    {viewingQuiz.assignment.dueDate && (
                      <Text
                        type={
                          moment(viewingQuiz.assignment.dueDate).isBefore(
                            moment()
                          )
                            ? "danger"
                            : "secondary"
                        }
                      >
                        <FieldTimeOutlined style={{ marginRight: 4 }} />
                        {moment(viewingQuiz.assignment.dueDate).format(
                          "MMM DD, YYYY HH:mm"
                        )}
                      </Text>
                    )}
                  </Space>
                ) : (
                  <Text type="secondary">
                    {translateText(
                      "teacherQuizManagement.table.assignment.none",
                      "Not assigned"
                    )}
                  </Text>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider>
              {translateText(
                "teacherQuizManagement.view.questions",
                "Questions"
              )}
            </Divider>
            {viewingQuiz.questions && viewingQuiz.questions.length > 0 ? (
              <div>
                {viewingQuiz.questions.map((question, index) => (
                  <Card
                    key={question._id || question.id || index}
                    style={{ marginBottom: 16 }}
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditQuestion(question)}
                      >
                        {translateText(
                          "teacherQuizManagement.actions.edit",
                          "Edit"
                        )}
                      </Button>,
                      <Popconfirm
                        title={translateText(
                          "teacherQuizManagement.questions.deleteConfirm",
                          "Delete this question?"
                        )}
                        onConfirm={() =>
                          handleDeleteQuestion(question._id || question.id)
                        }
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          {translateText(
                            "teacherQuizManagement.actions.delete",
                            "Delete"
                          )}
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Space
                      direction="vertical"
                      size={6}
                      style={{ width: "100%" }}
                    >
                      <Text strong>
                        {translateText(
                          "teacherQuizManagement.questions.label",
                          "Question"
                        )}{" "}
                        {index + 1}: {question.question}
                      </Text>
                      <Text type="secondary">
                        {translateText(
                          "teacherQuizManagement.questions.type",
                          "Type"
                        )}
                        : {question.type}
                      </Text>
                      <Text type="secondary">
                        {translateText(
                          "teacherQuizManagement.questions.points",
                          "Points"
                        )}
                        : {question.points}
                      </Text>
                      {question.options && question.options.length > 0 && (
                        <Text type="secondary">
                          {translateText(
                            "teacherQuizManagement.questions.options",
                            "Options"
                          )}
                          : {question.options.join(", ")}
                        </Text>
                      )}
                    </Space>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description={translateText(
                  "teacherQuizManagement.questions.empty",
                  "No questions yet"
                )}
              />
            )}
          </>
        )}
      </Modal>

      <Modal
        title={translateText(
          editingQuestion
            ? "teacherQuizManagement.questions.editTitle"
            : "teacherQuizManagement.questions.addTitle",
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
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={handleAddQuestion}
        >
          <Form.Item
            name="question"
            label={translateText(
              "teacherQuizManagement.questions.questionLabel",
              "Question"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherQuizManagement.questions.questionRequired",
                  "Please enter the question"
                ),
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder={translateText(
                "teacherQuizManagement.questions.questionPlaceholder",
                "Type the question prompt"
              )}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={translateText(
              "teacherQuizManagement.questions.typeLabel",
              "Question type"
            )}
            initialValue="multiple_choice"
          >
            <Select disabled>
              <Option value="multiple_choice">
                {translateText(
                  "teacherQuizManagement.questions.types.multipleChoice",
                  "Multiple choice"
                )}
              </Option>
            </Select>
          </Form.Item>

          {/* Individual Option Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="option1"
                label={translateText(
                  "teacherQuizManagement.questions.option1",
                  "Option 1"
                )}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherQuizManagement.questions.optionRequired",
                      "Required"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={translateText(
                    "teacherQuizManagement.questions.optionPlaceholder",
                    "Enter option"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="option2"
                label={translateText(
                  "teacherQuizManagement.questions.option2",
                  "Option 2"
                )}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherQuizManagement.questions.optionRequired",
                      "Required"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={translateText(
                    "teacherQuizManagement.questions.optionPlaceholder",
                    "Enter option"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="option3"
                label={translateText(
                  "teacherQuizManagement.questions.option3",
                  "Option 3"
                )}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherQuizManagement.questions.optionRequired",
                      "Required"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={translateText(
                    "teacherQuizManagement.questions.optionPlaceholder",
                    "Enter option"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="option4"
                label={translateText(
                  "teacherQuizManagement.questions.option4",
                  "Option 4"
                )}
                rules={[
                  {
                    required: true,
                    message: translateText(
                      "teacherQuizManagement.questions.optionRequired",
                      "Required"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={translateText(
                    "teacherQuizManagement.questions.optionPlaceholder",
                    "Enter option"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="correctAnswer"
            label={translateText(
              "teacherQuizManagement.questions.correctAnswer",
              "Correct answer"
            )}
            rules={[
              {
                required: true,
                message: translateText(
                  "teacherQuizManagement.questions.correctAnswerRequired",
                  "Please select the correct answer"
                ),
              },
            ]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Space direction="horizontal" size="large" wrap>
                <Radio value="A" style={{ fontSize: "15px" }}>
                  <Text strong>A</Text> -{" "}
                  <Text type="secondary">
                    {translateText(
                      "teacherQuizManagement.questions.optionALabel",
                      "Option 1"
                    )}
                  </Text>
                </Radio>
                <Radio value="B" style={{ fontSize: "15px" }}>
                  <Text strong>B</Text> -{" "}
                  <Text type="secondary">
                    {translateText(
                      "teacherQuizManagement.questions.optionBLabel",
                      "Option 2"
                    )}
                  </Text>
                </Radio>
                <Radio value="C" style={{ fontSize: "15px" }}>
                  <Text strong>C</Text> -{" "}
                  <Text type="secondary">
                    {translateText(
                      "teacherQuizManagement.questions.optionCLabel",
                      "Option 3"
                    )}
                  </Text>
                </Radio>
                <Radio value="D" style={{ fontSize: "15px" }}>
                  <Text strong>D</Text> -{" "}
                  <Text type="secondary">
                    {translateText(
                      "teacherQuizManagement.questions.optionDLabel",
                      "Option 4"
                    )}
                  </Text>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="points"
            label={translateText(
              "teacherQuizManagement.questions.pointsLabel",
              "Points"
            )}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuestion
                  ? translateText(
                      "teacherQuizManagement.actions.update",
                      "Update"
                    )
                  : translateText("teacherQuizManagement.actions.add", "Add")}
              </Button>
              <Button onClick={() => setQuestionModalVisible(false)}>
                {translateText("common.cancel", "Cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Quiz Results Modal */}
      <Modal
        title={
          <Space>
            <BarChartOutlined />
            {translateText(
              "teacherQuizManagement.results.modalTitle",
              "Quiz Results"
            )}
            {selectedQuizForResults && ` - ${selectedQuizForResults.title}`}
          </Space>
        }
        open={resultsModalVisible}
        onCancel={() => {
          setResultsModalVisible(false);
          setSelectedQuizForResults(null);
          setQuizSubmissions([]);
        }}
        width={900}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setResultsModalVisible(false);
              setSelectedQuizForResults(null);
              setQuizSubmissions([]);
            }}
          >
            {translateText("teacherQuizManagement.results.close", "Close")}
          </Button>,
        ]}
      >
        {loadingSubmissions ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : quizSubmissions.length === 0 ? (
          <Empty
            description={translateText(
              "teacherQuizManagement.results.noSubmissions",
              "No submissions yet"
            )}
          />
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Space size="large">
                <Statistic
                  title={translateText(
                    "teacherQuizManagement.results.totalSubmissions",
                    "Total Submissions"
                  )}
                  value={quizSubmissions.length}
                  prefix={<FileTextOutlined />}
                />
                <Statistic
                  title={translateText(
                    "teacherQuizManagement.results.averageScore",
                    "Average Score"
                  )}
                  value={
                    quizSubmissions.length > 0
                      ? (
                          quizSubmissions.reduce(
                            (sum, sub) => sum + (sub.percentage || 0),
                            0
                          ) / quizSubmissions.length
                        ).toFixed(1)
                      : 0
                  }
                  suffix="%"
                  prefix={<TrophyOutlined />}
                />
                <Statistic
                  title={translateText(
                    "teacherQuizManagement.results.passRate",
                    "Pass Rate"
                  )}
                  value={
                    quizSubmissions.length > 0
                      ? (
                          (quizSubmissions.filter((sub) => sub.isPassing)
                            .length /
                            quizSubmissions.length) *
                          100
                        ).toFixed(1)
                      : 0
                  }
                  suffix="%"
                  valueStyle={{
                    color:
                      quizSubmissions.filter((sub) => sub.isPassing).length /
                        quizSubmissions.length >=
                      0.7
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                />
              </Space>
            </div>

            <Table
              dataSource={quizSubmissions}
              rowKey={(record) => record._id || record.id}
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    <Title level={5}>
                      {translateText(
                        "teacherQuizManagement.results.questionBreakdown",
                        "Question Breakdown"
                      )}
                    </Title>
                    <List
                      dataSource={record.answers || []}
                      renderItem={(answer, index) => (
                        <List.Item>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong>
                              {translateText(
                                "teacherQuizManagement.results.question",
                                "Question"
                              )}{" "}
                              {index + 1}
                            </Text>
                            <Text>
                              {translateText(
                                "teacherQuizManagement.results.studentAnswer",
                                "Student Answer"
                              )}
                              : {answer.answer || "No answer"}
                            </Text>
                            <Space>
                              <Tag
                                color={answer.isCorrect ? "green" : "red"}
                                icon={
                                  answer.isCorrect ? (
                                    <CheckCircleOutlined />
                                  ) : (
                                    <CloseCircleOutlined />
                                  )
                                }
                              >
                                {answer.isCorrect
                                  ? translateText(
                                      "teacherQuizManagement.results.correct",
                                      "Correct"
                                    )
                                  : translateText(
                                      "teacherQuizManagement.results.incorrect",
                                      "Incorrect"
                                    )}
                              </Tag>
                              <Text type="secondary">
                                {answer.pointsEarned || 0}{" "}
                                {translateText(
                                  "teacherQuizManagement.results.points",
                                  "points"
                                )}
                              </Text>
                            </Space>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                ),
                rowExpandable: (record) =>
                  record.answers && record.answers.length > 0,
              }}
            >
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.studentName",
                  "Student"
                )}
                key="student"
                render={(_, record) => (
                  <div>
                    <Text strong>
                      {record.student?.firstName} {record.student?.lastName}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {record.student?.email}
                    </Text>
                  </div>
                )}
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.score",
                  "Score"
                )}
                key="score"
                render={(_, record) => (
                  <Text strong>
                    {record.score} / {record.totalPoints}
                  </Text>
                )}
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.percentage",
                  "Percentage"
                )}
                key="percentage"
                render={(_, record) => (
                  <Tag
                    color={
                      record.percentage >= 80
                        ? "green"
                        : record.percentage >= 60
                        ? "orange"
                        : "red"
                    }
                  >
                    {record.percentage?.toFixed(1)}%
                  </Tag>
                )}
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.status",
                  "Status"
                )}
                key="status"
                render={(_, record) => (
                  <Tag
                    icon={
                      record.isPassing ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    color={record.isPassing ? "success" : "error"}
                  >
                    {record.isPassing
                      ? translateText(
                          "teacherQuizManagement.results.passed",
                          "Passed"
                        )
                      : translateText(
                          "teacherQuizManagement.results.failed",
                          "Failed"
                        )}
                  </Tag>
                )}
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.attempt",
                  "Attempt"
                )}
                dataIndex="attemptNumber"
                key="attemptNumber"
                render={(attemptNumber) => <Tag>{attemptNumber || 1}</Tag>}
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.submittedAt",
                  "Submitted"
                )}
                dataIndex="submittedAt"
                key="submittedAt"
                render={(submittedAt) =>
                  moment(submittedAt).format("MMM DD, YYYY HH:mm")
                }
              />
              <Table.Column
                title={translateText(
                  "teacherQuizManagement.results.timeSpent",
                  "Time Spent"
                )}
                dataIndex="timeSpent"
                key="timeSpent"
                render={(timeSpent) => {
                  const minutes = Math.floor(timeSpent / 60);
                  const seconds = timeSpent % 60;
                  return `${minutes}m ${seconds}s`;
                }}
              />
            </Table>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TeacherQuizManagement;

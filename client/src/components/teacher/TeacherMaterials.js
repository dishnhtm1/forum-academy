import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
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
  Upload,
  Modal,
  Empty,
  Spin,
  Grid,
  Statistic,
  Divider,
  List,
  Descriptions,
} from "antd";
import {
  FolderOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  SortAscendingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { materialAPI, courseAPI } from "../../utils/apiClient";
import { API_BASE_URL } from "../../utils/adminApiUtils";
import { ensureTeacherMaterialsTranslations } from "../../utils/teacherMaterialsTranslations";

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;
const CheckableTag = Tag.CheckableTag;

const TeacherMaterials = ({ t, currentUser, isMobile }) => {
  const [materialForm] = Form.useForm();
  const { i18n } = useTranslation();

  ensureTeacherMaterialsTranslations(i18n);

  const screens = useBreakpoint();
  const isCompactLayout = isMobile || !screens?.md;

  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [fileList, setFileList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    moment.locale(i18n.language === "ja" ? "ja" : "en");
  }, [i18n.language]);

  useEffect(() => {
    ensureTeacherMaterialsTranslations(i18n);
  }, [i18n]);

  const categoryFilters = useMemo(
    () => [
      { value: "lecture", label: t("teacherMaterials.category.lecture", "Lecture") },
      { value: "assignment", label: t("teacherMaterials.category.assignment", "Assignment") },
      { value: "reading", label: t("teacherMaterials.category.reading", "Reading") },
      { value: "supplementary", label: t("teacherMaterials.category.supplementary", "Supplementary") },
      { value: "other", label: t("teacherMaterials.category.other", "Other") },
    ],
    [t]
  );

  const getCategoryLabel = useCallback(
    (value) => categoryFilters.find((category) => category.value === value)?.label || value,
    [categoryFilters]
  );

  const normalizeId = useCallback((value) => {
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return String(value);
    } catch (error) {
      return null;
    }
  }, []);

  const getCourseIdFromMaterial = useCallback((material) => {
    if (!material) {
      return null;
    }
    if (material.course?._id || material.course?.id) {
      return normalizeId(material.course._id || material.course.id);
    }
    if (material.courseId?._id || material.courseId?.id) {
      return normalizeId(material.courseId._id || material.courseId.id);
    }
    if (typeof material.course === "string") {
      return normalizeId(material.course);
    }
    if (typeof material.courseId === "string") {
      return normalizeId(material.courseId);
    }
    return null;
  }, [normalizeId]);

  const getMaterialId = useCallback(
    (material) => normalizeId(material?._id || material?.id || material?.materialId),
    [normalizeId]
  );

  const findCourseById = useCallback(
    (courseId) =>
      courses.find((course) => normalizeId(course?._id || course?.id || course?.courseId || course?.code) === courseId),
    [courses, normalizeId]
  );

  const getCourseForMaterial = useCallback(
    (material) => {
      const courseId = getCourseIdFromMaterial(material);
      return findCourseById(courseId) || material.course;
    },
    [findCourseById, getCourseIdFromMaterial]
  );

  const formatFileSize = useCallback(
    (bytes) => {
      if (!bytes && bytes !== 0) {
        return t("teacherMaterials.fileSize.unknown", "Unknown");
      }
      const kiloBytes = bytes / 1024;
      if (kiloBytes < 1024) {
        return `${kiloBytes.toFixed(1)} KB`;
      }
      return `${(kiloBytes / 1024).toFixed(1)} MB`;
    },
    [t]
  );

  const formatDateTime = useCallback(
    (value) =>
      value
        ? moment(value).format(
            i18n.language === "ja" ? "YYYY年M月D日 HH:mm" : "MMM D, YYYY • HH:mm"
          )
        : t("teacherMaterials.dates.notAvailable", "Not available"),
    [i18n.language, t]
  );

  const teacherIdentifiers = useMemo(() => {
    const identifiers = [
      currentUser?._id,
      currentUser?.id,
      currentUser?.userId,
      currentUser?.teacherId,
      currentUser?.staffId,
    ]
      .filter(Boolean)
      .map((value) => String(value));
    return new Set(identifiers);
  }, [currentUser]);

  const materialStats = useMemo(() => {
    if (!materials || materials.length === 0) {
      return {
        total: 0,
        latestDate: null,
        categoryCounts: {},
      };
    }

    const categoryCounts = materials.reduce((accumulator, material) => {
      const key = material.category || "other";
      return {
        ...accumulator,
        [key]: (accumulator[key] || 0) + 1,
      };
    }, {});

    const latestMaterial = [...materials].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })[0];

    return {
      total: materials.length,
      latestDate: latestMaterial?.updatedAt || latestMaterial?.createdAt || null,
      categoryCounts,
    };
  }, [materials]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(materialStats.categoryCounts || {});
    if (entries.length === 0) {
      return null;
    }
    const [key, count] = entries.sort((a, b) => b[1] - a[1])[0];
    return { key, count };
  }, [materialStats]);

  const extractCourseList = useCallback((payload) => {
    if (!payload) {
      return [];
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    if (Array.isArray(payload.courses)) {
      return payload.courses;
    }
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.results)) {
      return payload.results;
    }
    return [];
  }, []);

  const extractMaterialList = useCallback((payload) => {
    if (!payload) {
      return [];
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    if (Array.isArray(payload.materials)) {
      return payload.materials;
    }
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.items)) {
      return payload.items;
    }
    return [];
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await materialAPI.getAll();
      const allMaterials = extractMaterialList(response);
      const courseIdSet = new Set(
        courses
          .map((course) => normalizeId(course && (course._id || course.id || course.courseId || course.code)))
          .filter(Boolean)
      );

      const teacherMaterials = allMaterials.filter((material) => {
        const materialCourseId = getCourseIdFromMaterial(material);
        const matchesCourse = materialCourseId ? courseIdSet.has(materialCourseId) : false;

        const materialTeacherCandidates = [
          material.teacherId,
          material.teacher,
          material.ownerId,
          material.createdBy,
          material.uploaderId,
        ]
          .filter(Boolean)
          .map((value) => normalizeId(value))
          .filter(Boolean);
        const matchesTeacher =
          materialTeacherCandidates.some((value) => value && teacherIdentifiers.has(value)) ||
          (typeof material.teacher === "object" &&
            [material.teacher?._id, material.teacher?.id]
              .filter(Boolean)
              .map((value) => normalizeId(value))
              .filter(Boolean)
              .some((value) => value && teacherIdentifiers.has(value)));

        return matchesCourse || matchesTeacher || courseIdSet.size === 0;
      });

      const effectiveMaterials = teacherMaterials.length > 0 ? teacherMaterials : allMaterials;
      setMaterials(effectiveMaterials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      message.error(t("teacherMaterials.messages.fetchError", "Failed to fetch materials"));
    } finally {
      setLoading(false);
    }
  }, [courses, extractMaterialList, getCourseIdFromMaterial, normalizeId, t, teacherIdentifiers]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getAll();
      const allCourses = extractCourseList(response);
      const teacherCourses = allCourses.filter((course) => {
        if (!course) return false;
        const directMatches = [
          course.teacher,
          course.teacherId,
          course.instructorId,
          course.ownerId,
          course.createdBy,
        ]
          .filter(Boolean)
          .map((value) => normalizeId(value))
          .filter(Boolean)
          .some((value) => teacherIdentifiers.has(value));

        if (directMatches) {
          return true;
        }

        if (course.teacher && typeof course.teacher === "object") {
          const nested = [course.teacher._id, course.teacher.id, course.teacher.userId]
            .filter(Boolean)
            .map((value) => normalizeId(value))
            .filter(Boolean)
            .some((value) => teacherIdentifiers.has(value));
          if (nested) {
            return true;
          }
        }

        return teacherIdentifiers.size === 0;
      });

      setCourses(teacherCourses.length > 0 ? teacherCourses : allCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [extractCourseList, normalizeId, teacherIdentifiers]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchMaterials();
  }, [courses, fetchMaterials]);

  useEffect(() => {
    if (!selectedCourseId && courses.length === 1) {
      const firstCourse = courses[0];
      const firstCourseId = normalizeId(
        firstCourse && (firstCourse._id || firstCourse.id || firstCourse.courseId || firstCourse.code)
      );
      if (firstCourseId) {
        setSelectedCourseId(firstCourseId);
      }
    }
  }, [courses, selectedCourseId, normalizeId]);

  useEffect(() => {
    if (
      selectedCourseId &&
      !courses.some(
        (course) =>
          normalizeId(course && (course._id || course.id || course.courseId || course.code)) === selectedCourseId
      )
    ) {
      setSelectedCourseId(null);
    }
  }, [courses, selectedCourseId, normalizeId]);

  const courseFilterOptions = useMemo(() => {
    const options = courses
      .map((course) => {
        if (!course) return null;
        const value = normalizeId(course._id || course.id || course.courseId || course.code);
        if (!value) {
          return null;
        }
        return {
          label:
            course.title ||
            course.name ||
            course.courseTitle ||
            course.code ||
            t("teacherMaterials.courses.untitled", "Untitled course"),
          value,
          code: course.code,
        };
      })
      .filter(Boolean);
    return options;
  }, [courses, normalizeId, t]);

  const filteredMaterials = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return materials.filter((material) => {
      const title = material.title?.toLowerCase() || "";
      const description = material.description?.toLowerCase() || "";
      const materialCategory = material.category || "other";
      const materialCourseId = getCourseIdFromMaterial(material);

      const matchesSearch = !term || title.includes(term) || description.includes(term);
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(materialCategory);
      const matchesCourse =
        !selectedCourseId ||
        (materialCourseId && selectedCourseId && materialCourseId === normalizeId(selectedCourseId));

      return matchesSearch && matchesCategory && matchesCourse;
    });
  }, [
    materials,
    searchTerm,
    activeCategories,
    selectedCourseId,
    getCourseIdFromMaterial,
    normalizeId,
  ]);

  const sortedMaterials = useMemo(() => {
    const next = [...filteredMaterials];
    switch (sortOrder) {
      case "oldest":
        return next.sort(
          (a, b) =>
            new Date(a.updatedAt || a.createdAt || 0).getTime() -
            new Date(b.updatedAt || b.createdAt || 0).getTime()
        );
      case "titleAsc":
        return next.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "titleDesc":
        return next.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      case "newest":
      default:
        return next.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        );
    }
  }, [filteredMaterials, sortOrder]);

  const topCategoryLabel = useMemo(() => {
    if (!topCategory) {
      return null;
    }
    const match = categoryFilters.find((item) => item.value === topCategory.key);
    return match?.label || topCategory.key;
  }, [categoryFilters, topCategory]);

  const activeCategorySet = useMemo(
    () => new Set(activeCategories),
    [activeCategories]
  );

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: t("teacherMaterials.sort.newest", "Newest first") },
      { value: "oldest", label: t("teacherMaterials.sort.oldest", "Oldest first") },
      { value: "titleAsc", label: t("teacherMaterials.sort.titleAsc", "Title A–Z") },
      { value: "titleDesc", label: t("teacherMaterials.sort.titleDesc", "Title Z–A") },
    ],
    [t]
  );

  const handleCategoryToggle = useCallback(
    (category) => {
      setActiveCategories((prev) => {
        if (prev.includes(category)) {
          return prev.filter((value) => value !== category);
        }
        return [...prev, category];
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setActiveCategories([]);
    setSelectedCourseId(null);
  }, []);

  const isEmptyState = !loading && sortedMaterials.length === 0;

  const emptyDescription = useMemo(
    () =>
      t(
        "teacherMaterials.emptyState.description",
        "No materials match your filters yet."
      ),
    [t]
  );

  const emptyHint = useMemo(
    () =>
      t(
        "teacherMaterials.emptyState.hint",
        "Try adjusting filters or upload a new resource."
      ),
    [t]
  );

  const handleUploadMaterial = async (values) => {
    if (fileList.length === 0) {
      message.error(t("teacherMaterials.upload.errors.fileMissing", "Please select a file to upload"));
      return;
    }

    const resolvedCourseId = normalizeId(values.courseId || selectedCourseId);
    if (!resolvedCourseId) {
      message.error(t("teacherMaterials.upload.errors.courseMissing", "Please select a course"));
      return;
    }

    try {
      const formData = new FormData();
      const file = fileList[0].originFileObj || fileList[0];
      formData.append("file", file);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("course", resolvedCourseId);

      const categoryMap = {
        video: "other",
        document: "reading",
        resource: "supplementary",
        assignment: "assignment",
        reading: "reading",
        lecture: "lecture",
      };
      const serverCategory = categoryMap[values.category] || "other";
      formData.append("category", serverCategory);

      message.loading({
        content: t("teacherMaterials.upload.status.uploading", "Uploading material..."),
        key: "upload",
        duration: 0,
      });

      await materialAPI.create(formData);
      message.success({
        content: t("teacherMaterials.upload.status.success", "Material uploaded successfully"),
        key: "upload",
      });
      setMaterialModalVisible(false);
      materialForm.resetFields();
      setFileList([]);
      fetchMaterials();
    } catch (error) {
      message.error({
        content:
          error.message ||
          t("teacherMaterials.upload.status.failure", "Failed to upload material"),
        key: "upload",
      });
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await materialAPI.delete(materialId);
      message.success(
        t("teacherMaterials.messages.deleteSuccess", "Material deleted successfully")
      );
      fetchMaterials();
    } catch (error) {
      message.error(t("teacherMaterials.messages.deleteError", "Failed to delete material"));
    }
  };

  const handlePreviewMaterial = async (material) => {
    const materialId = getMaterialId(material);
    if (!materialId) {
      message.error(
        t("teacherMaterials.preview.errors.missingId", "Unable to open preview for this file")
      );
      return;
    }
    const enrichedMaterial = {
      ...material,
      _id: material._id || materialId,
      course: getCourseForMaterial(material),
    };
    setSelectedMaterial(enrichedMaterial);
    setPreviewLoading(true);
    setPreviewModalVisible(true);
    
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        message.error(
          t("teacherMaterials.preview.errors.authMissing", "Authentication token not found")
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/download/${materialId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to load file");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewFileUrl(objectUrl);
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((item) => getMaterialId(item) !== materialId);
        return [enrichedMaterial, ...filtered].slice(0, 5);
      });
    } catch (error) {
      message.error(
        t("teacherMaterials.preview.errors.loadFailure", "Failed to load file for preview")
      );
      setPreviewFileUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadMaterial = async (material) => {
    try {
      const materialId = getMaterialId(material);
      if (!materialId) {
        message.error(
          t("teacherMaterials.messages.downloadError", "Failed to download material")
        );
        return;
      }
      const blob = await materialAPI.download(materialId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.originalName || material.title || "material";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(
        t("teacherMaterials.messages.downloadStarted", "Download started")
      );
    } catch (error) {
      message.error(
        t("teacherMaterials.messages.downloadError", "Failed to download material")
      );
    }
  };

  const materialColumns = [
    {
      title: t("teacherMaterials.table.material", "Material"),
      key: "material",
      render: (_, record) => {
        const isVideo =
          record.fileType === "video" ||
          record.mimeType?.startsWith("video/") ||
          record.category === "lecture";
        const courseDetail = getCourseForMaterial(record);
        return (
          <Space align="start">
            {isVideo ? (
              <VideoCameraOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
            ) : (
              <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
            )}
            <Space direction="vertical" size={4} style={{ maxWidth: 320 }}>
              <Text strong>{record.title}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description ||
                  t("teacherMaterials.table.noDescription", "No description")}
              </Text>
              <Space size={[6, 4]} wrap>
                <Tag color="blue">
                  {courseDetail?.title ||
                    t("teacherMaterials.table.unknownCourse", "Unknown course")}
                </Tag>
                <Tag color="purple">{record.category || "other"}</Tag>
              </Space>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {t("teacherMaterials.table.updatedLabel", "Updated")}{" "}
                {formatDateTime(record.updatedAt || record.createdAt)}
              </Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: t("teacherMaterials.table.size", "Size"),
      dataIndex: "fileSize",
      key: "fileSize",
      align: "center",
      responsive: ["lg"],
      render: (_, record) => formatFileSize(record.fileSize || record.size),
    },
    {
      title: t("teacherMaterials.table.actions", "Actions"),
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title={t("teacherMaterials.actions.preview", "Preview")}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreviewMaterial(record)}
            />
          </Tooltip>
          <Tooltip title={t("teacherMaterials.actions.download", "Download")}>
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownloadMaterial(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t(
              "teacherMaterials.actions.confirmDelete",
              "Are you sure you want to delete this material?"
            )}
            onConfirm={() => handleDeleteMaterial(getMaterialId(record))}
            okText={t("teacherMaterials.actions.deleteConfirm", "Delete")}
            cancelText={t("teacherMaterials.actions.cancel", "Cancel")}
          >
            <Tooltip title={t("teacherMaterials.actions.delete", "Delete")}>
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      const maxSizeMb = 200;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const isVideo = file.type?.startsWith("video/");
      const isImage = file.type?.startsWith("image/");
      const isAllowedType =
        isVideo ||
        isImage ||
        allowedTypes.includes(file.type) ||
        file.name?.toLowerCase().endsWith(".zip");

      if (!isAllowedType) {
        message.error(
          t("teacherMaterials.upload.errors.type", "Unsupported file type")
        );
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 > maxSizeMb) {
        message.error(
          t("teacherMaterials.upload.errors.size", {
            size: maxSizeMb,
            defaultValue: `File must be smaller than ${maxSizeMb}MB`,
          })
        );
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => setFileList([]),
    maxCount: 1,
    accept:
      ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mov,.png,.jpg,.jpeg,.zip",
  };

  return (
    <div style={{ padding: isCompactLayout ? "16px" : "24px" }}>
      <Space
        direction="vertical"
        size={isCompactLayout ? 16 : 24}
        style={{ width: "100%" }}
      >
        <Card bodyStyle={{ padding: isCompactLayout ? 16 : 24 }}>
          <Space
            direction="vertical"
            size={isCompactLayout ? 16 : 24}
            style={{ width: "100%" }}
          >
            <Space
              align={isCompactLayout ? "start" : "center"}
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <Space align="center" size={isCompactLayout ? 12 : 16}>
                <FolderOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <Space direction="vertical" size={2}>
                  <Title level={2} style={{ margin: 0 }}>
                    {t("teacherDashboard.sidebar.materials") || "Materials"}
                  </Title>
                  <Text type="secondary">
                    {t(
                      "teacherMaterials.header.subtitle",
                      "Centralize and share class resources with your students."
                    )}
                  </Text>
                </Space>
              </Space>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => {
                  materialForm.resetFields();
                  if (selectedCourseId) {
                    materialForm.setFieldsValue({ courseId: selectedCourseId });
                  }
                  setFileList([]);
                  setMaterialModalVisible(true);
                }}
                size={isCompactLayout ? "middle" : "large"}
                block={isCompactLayout}
              >
                {t("teacherMaterials.actions.uploadMaterial", "Upload Material")}
              </Button>
            </Space>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    background: "#f0f5ff",
                    borderRadius: 12,
                    height: "100%",
                  }}
                >
                  <Space align="start">
                    <BarChartOutlined style={{ fontSize: 24, color: "#2f54eb" }} />
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        {t("teacherMaterials.summary.total", "Total materials")}
                      </Text>
                      <Statistic value={materialStats.total} valueStyle={{ fontSize: 28 }} />
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    background: "#f9f0ff",
                    borderRadius: 12,
                    height: "100%",
                  }}
                >
                  <Space align="start">
                    <BookOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        {t("teacherMaterials.summary.topCategory", "Most shared category")}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: 600 }}>
                        {topCategoryLabel || t("teacherMaterials.summary.none", "No uploads yet")}
                      </Text>
                      {topCategory && (
                        <Text type="secondary">
                          {t("teacherMaterials.summary.resources", "{{count}} resources", {
                            count: topCategory.count,
                          })}
                        </Text>
                      )}
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    background: "#fff7e6",
                    borderRadius: 12,
                    height: "100%",
                  }}
                >
                  <Space align="start">
                    <ClockCircleOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        {t("teacherMaterials.summary.latest", "Last updated")}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: 600 }}>
                        {formatDateTime(materialStats.latestDate)}
                      </Text>
                    </Space>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>

        <Card bodyStyle={{ padding: isCompactLayout ? 16 : 24 }}>
          <Space direction="vertical" size={isCompactLayout ? 12 : 16} style={{ width: "100%" }}>
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12} lg={8}>
                <Input
                  allowClear
                  placeholder={t("teacherMaterials.search.placeholder", "Search materials...")}
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder={t(
                    "teacherMaterials.filters.coursePlaceholder",
                    "Filter by course"
                  )}
                  value={selectedCourseId || undefined}
                  onChange={(value) => setSelectedCourseId(value ? normalizeId(value) : null)}
                  style={{ width: "100%" }}
                  size="large"
                >
                  {courseFilterOptions.map((course) => (
                    <Option key={course.value} value={course.value}>
                      {course.label}
                      {course.code ? ` (${course.code})` : ""}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Select
                  value={sortOrder}
                  onChange={setSortOrder}
                  style={{ width: "100%" }}
                  size="large"
                  suffixIcon={<SortAscendingOutlined />}
                >
                  {sortOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={12} lg={8} style={{ textAlign: isCompactLayout ? "left" : "right" }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetFilters}
                  block={isCompactLayout}
                >
                  {t("teacherMaterials.filters.reset", "Reset filters")}
                </Button>
              </Col>
            </Row>
            <Divider style={{ margin: "8px 0" }} />
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>{t("teacherMaterials.filters.categoryLabel", "Focus on categories")}</Text>
              <Space size={[8, 8]} wrap>
                {categoryFilters.map((category) => (
                  <CheckableTag
                    key={category.value}
                    checked={activeCategorySet.has(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                    style={{
                      borderRadius: 16,
                      padding: "4px 12px",
                      border: `1px solid ${
                        activeCategorySet.has(category.value) ? "#2f54eb" : "#d9d9d9"
                      }`,
                      background: activeCategorySet.has(category.value) ? "#f0f5ff" : "#fff",
                    }}
                  >
                    {`${category.label} (${materialStats.categoryCounts?.[category.value] || 0})`}
                  </CheckableTag>
                ))}
                {activeCategories.length > 0 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setActiveCategories([])}
                  >
                    {t("teacherMaterials.filters.clearCategories", "Clear categories")}
                  </Button>
                )}
              </Space>
            </Space>
          </Space>
        </Card>

        {recentlyViewed.length > 0 && (
          <Card bodyStyle={{ padding: isCompactLayout ? 16 : 24 }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text strong>
                  {t("teacherMaterials.recentPreview.title", "Recently previewed")}
                </Text>
                <Button type="link" size="small" onClick={() => setRecentlyViewed([])}>
                  {t("teacherMaterials.recentPreview.clear", "Clear list")}
                </Button>
              </Space>
              <List
                grid={
                  isCompactLayout
                    ? { gutter: 12, column: 1 }
                    : { gutter: 16, column: Math.min(recentlyViewed.length, 3) }
                }
                dataSource={recentlyViewed}
                renderItem={(item) => (
                  <List.Item key={getMaterialId(item)}>
                    <Card size="small" bordered>
                      <Space direction="vertical" size={8} style={{ width: "100%" }}>
                        <Text strong>{item.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDateTime(item.updatedAt || item.createdAt)}
                        </Text>
                        <Space size={[6, 4]} wrap>
                          <Tag color="blue">
                            {getCourseForMaterial(item)?.title ||
                              t("teacherMaterials.table.unknownCourse", "Unknown course")}
                          </Tag>
                          <Tag color="purple">
                            {getCategoryLabel(item.category || "other")}
                          </Tag>
                        </Space>
                        <Space size={8} wrap>
                          <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handlePreviewMaterial(item)}
                          >
                            {t("teacherMaterials.actions.preview", "Preview")}
                          </Button>
                          <Button
                            icon={<DownloadOutlined />}
                            size="small"
                            onClick={() => handleDownloadMaterial(item)}
                          >
                            {t("teacherMaterials.actions.download", "Download")}
                          </Button>
                        </Space>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        )}

        <Card bodyStyle={{ padding: isCompactLayout ? 12 : 24 }}>
          {isCompactLayout ? (
            loading ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : sortedMaterials.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={sortedMaterials}
                renderItem={(item) => {
                  const isVideo =
                    item.fileType === "video" ||
                    item.mimeType?.startsWith("video/") ||
                    item.category === "lecture";
                  const courseDetail = getCourseForMaterial(item);
                  return (
                    <List.Item key={getMaterialId(item)}>
                      <Card size="small" bordered>
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                          <Space align="start" size={12}>
                            {isVideo ? (
                              <VideoCameraOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />
                            ) : (
                              <FileTextOutlined style={{ fontSize: 22, color: "#1890ff" }} />
                            )}
                            <Space direction="vertical" size={4} style={{ flex: 1 }}>
                              <Text strong>{item.title}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.description ||
                                  t("teacherMaterials.table.noDescription", "No description")}
                              </Text>
                            </Space>
                          </Space>
                          <Space size={[6, 4]} wrap>
                            <Tag color="blue">
                              {courseDetail?.title ||
                                t("teacherMaterials.table.unknownCourse", "Unknown course")}
                            </Tag>
                            <Tag color="purple">
                              {getCategoryLabel(item.category || "other")}
                            </Tag>
                            <Tag>{formatFileSize(item.fileSize || item.size)}</Tag>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {t("teacherMaterials.table.updatedLabel", "Updated")}{" "}
                            {formatDateTime(item.updatedAt || item.createdAt)}
                          </Text>
                          <Space size={8} wrap>
                            <Button
                              icon={<EyeOutlined />}
                              size="small"
                              onClick={() => handlePreviewMaterial(item)}
                            >
                              {t("teacherMaterials.actions.preview", "Preview")}
                            </Button>
                            <Button
                              icon={<DownloadOutlined />}
                              size="small"
                              onClick={() => handleDownloadMaterial(item)}
                            >
                              {t("teacherMaterials.actions.download", "Download")}
                            </Button>
                            <Popconfirm
                              title={t(
                                "teacherMaterials.actions.confirmDelete",
                                "Are you sure you want to delete this material?"
                              )}
                              onConfirm={() => handleDeleteMaterial(getMaterialId(item))}
                              okText={t("teacherMaterials.actions.deleteConfirm", "Delete")}
                              cancelText={t("teacherMaterials.actions.cancel", "Cancel")}
                            >
                              <Button icon={<DeleteOutlined />} size="small" danger>
                                {t("teacherMaterials.actions.delete", "Delete")}
                              </Button>
                            </Popconfirm>
                          </Space>
                        </Space>
                      </Card>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyDescription}
              >
                <Text type="secondary">{emptyHint}</Text>
              </Empty>
            )
          ) : (
            <Table
              columns={materialColumns}
              dataSource={sortedMaterials}
              rowKey={(record) => getMaterialId(record)}
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: false, responsive: true }}
              scroll={{ x: 768 }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDescription}>
                    <Text type="secondary">{emptyHint}</Text>
                  </Empty>
                ),
              }}
            />
          )}
        </Card>

        <Modal
          title={t("teacherMaterials.modal.uploadTitle", "Upload Material")}
          open={materialModalVisible}
          onCancel={() => {
            setMaterialModalVisible(false);
            materialForm.resetFields();
            setFileList([]);
          }}
          footer={null}
          width={isCompactLayout ? 520 : 640}
          destroyOnClose
        >
          <Form form={materialForm} layout="vertical" onFinish={handleUploadMaterial}>
            <Form.Item
              name="courseId"
              label={t("teacherMaterials.form.course", "Course")}
              rules={[
                {
                  required: true,
                  message: t("teacherMaterials.upload.errors.courseMissing", "Please select a course"),
                },
              ]}
            >
              <Select
                placeholder={t("teacherMaterials.form.coursePlaceholder", "Select course")}
                showSearch
                optionFilterProp="children"
              >
                {courseFilterOptions.map((course) => (
                  <Option key={course.value} value={course.value}>
                    {course.label}
                    {course.code ? ` (${course.code})` : ""}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="title"
              label={t("teacherMaterials.form.title", "Title")}
              rules={[
                { required: true, message: t("teacherMaterials.form.titleRequired", "Please enter title") },
              ]}
            >
              <Input placeholder={t("teacherMaterials.form.titlePlaceholder", "Enter material title")} />
            </Form.Item>
            <Form.Item name="description" label={t("teacherMaterials.form.description", "Description")}>
              <Input.TextArea
                rows={4}
                placeholder={t(
                  "teacherMaterials.form.descriptionPlaceholder",
                  "Add helpful notes or instructions for students"
                )}
              />
            </Form.Item>
            <Form.Item
              name="category"
              label={t("teacherMaterials.form.category", "Category")}
              rules={[{ required: true, message: t("teacherMaterials.form.categoryRequired", "Please choose a category") }]}
            >
              <Select>
                {categoryFilters.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("teacherMaterials.form.file", "File")}
              required
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  {t(
                    "teacherMaterials.form.uploadPrompt",
                    "Click or drag file to this area to upload"
                  )}
                </p>
                <p className="ant-upload-hint">
                  {t(
                    "teacherMaterials.form.uploadHint",
                    "Videos, documents, spreadsheets, and zipped resources up to 200MB."
                  )}
                </p>
              </Dragger>
            </Form.Item>
            <Form.Item>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={() => setMaterialModalVisible(false)}>
                  {t("teacherMaterials.actions.cancel", "Cancel")}
                </Button>
                <Button type="primary" htmlType="submit">
                  {t("teacherMaterials.actions.upload", "Upload")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={t("teacherMaterials.modal.previewTitle", "Material Preview")}
          open={previewModalVisible}
          onCancel={() => {
            if (previewFileUrl) URL.revokeObjectURL(previewFileUrl);
            setPreviewModalVisible(false);
            setPreviewFileUrl(null);
            setSelectedMaterial(null);
          }}
          footer={null}
          width={isCompactLayout ? 640 : 840}
          destroyOnClose
        >
          {selectedMaterial && (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Space align="start" size={12}>
                {(selectedMaterial.fileType === "video" ||
                  selectedMaterial.mimeType?.startsWith("video/")) ? (
                  <VideoCameraOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />
                ) : (
                  <FileTextOutlined style={{ fontSize: 22, color: "#1890ff" }} />
                )}
                <Space direction="vertical" size={4} style={{ flex: 1 }}>
                  <Text strong>{selectedMaterial.title}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedMaterial.description ||
                      t("teacherMaterials.table.noDescription", "No description")}
                  </Text>
                  <Space size={[6, 4]} wrap>
                    <Tag color="blue">
                      {selectedMaterial.course?.title ||
                        t("teacherMaterials.table.unknownCourse", "Unknown course")}
                    </Tag>
                    <Tag color="purple">
                      {getCategoryLabel(selectedMaterial.category || "other")}
                    </Tag>
                    <Tag>{formatFileSize(selectedMaterial.fileSize || selectedMaterial.size)}</Tag>
                  </Space>
                </Space>
              </Space>
              <Descriptions
                size="small"
                bordered
                column={isCompactLayout ? 1 : 2}
              >
                <Descriptions.Item label={t("teacherMaterials.preview.course", "Course")}>
                  {selectedMaterial.course?.title ||
                    t("teacherMaterials.table.unknownCourse", "Unknown course")}
                </Descriptions.Item>
                <Descriptions.Item label={t("teacherMaterials.preview.updated", "Last updated")}>
                  {formatDateTime(selectedMaterial.updatedAt || selectedMaterial.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label={t("teacherMaterials.preview.fileName", "File name")}>
                  {selectedMaterial.originalName || selectedMaterial.fileName || selectedMaterial.title}
                </Descriptions.Item>
                <Descriptions.Item label={t("teacherMaterials.preview.fileSize", "File size")}>
                  {formatFileSize(selectedMaterial.fileSize || selectedMaterial.size)}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          )}
          <Divider />
          {previewLoading ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Spin size="large" />
            </div>
          ) : previewFileUrl ? (
            <iframe
              src={previewFileUrl}
              style={{ width: "100%", height: "600px", border: "none" }}
              title={t("teacherMaterials.modal.previewTitle", "Material Preview")}
            />
          ) : (
            <Empty description={t("teacherMaterials.preview.unavailable", "Unable to preview this file")} />
          )}
          <Divider />
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              onClick={() => selectedMaterial && handleDownloadMaterial(selectedMaterial)}
            >
              {t("teacherMaterials.actions.download", "Download")}
            </Button>
          </Space>
        </Modal>
      </Space>
    </div>
  );
};

export default TeacherMaterials;

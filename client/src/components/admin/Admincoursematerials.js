import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ja";
import {
  Row,
  Col,
  Card,
  Statistic,
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
  Descriptions,
  Avatar,
  Empty,
  Divider,
  Spin,
} from "antd";
import {
  FolderOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  FileOutlined,
  CloudOutlined,
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../../context/AdminContext";
import {
  getAuthHeaders,
  API_BASE_URL,
  downloadFile,
} from "../../utils/adminApiUtils";
import { materialAPI } from "../../utils/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const Admincoursematerials = ({
  t,
  setMaterialModalVisible,
  setPreviewModalVisible,
}) => {
  const history = useHistory();
  const [materialForm] = Form.useForm();
  const { i18n } = useTranslation();

  // Context
  const context = useContext(AdminContext);

  // Local state
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialModalVisibleLocal, setMaterialModalVisibleLocal] = useState(false);
  const [previewModalVisibleLocal, setPreviewModalVisibleLocal] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Determine which state to use
  const isMaterialModalVisible = setMaterialModalVisible 
    ? (typeof setMaterialModalVisible === 'function' ? materialModalVisibleLocal : materialModalVisibleLocal)
    : materialModalVisibleLocal;
  const isPreviewModalVisible = setPreviewModalVisible 
    ? (typeof setPreviewModalVisible === 'function' ? previewModalVisibleLocal : previewModalVisibleLocal)
    : previewModalVisibleLocal;

  const handleSetMaterialModalVisible =
    setMaterialModalVisible || setMaterialModalVisibleLocal;
  const handleSetPreviewModalVisible =
    setPreviewModalVisible || setPreviewModalVisibleLocal;

  // Fetch materials
  const fetchMaterials = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course-materials`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMaterials(Array.isArray(data) ? data : data.materials || []);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      message.error(t("admin.materialManagement.messages.fetchError") || "Failed to fetch materials");
    }
  }, [history, t]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        history.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [history]);

  // Handle upload material
  const handleUploadMaterial = async (values) => {
    if (fileList.length === 0) {
      message.error(t("admin.materialManagement.upload.validation.fileRequired") || "Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      const file = fileList[0].originFileObj || fileList[0];

      formData.append("file", file);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      // Server expects "course" not "courseId" based on the route handler
      formData.append("course", values.courseId);
      
      // Map form category values to server-expected values
      // Server expects: lecture, assignment, reading, supplementary, exam, other
      // Form sends: video, document, resource, assignment, reading, lecture
      const categoryMap = {
        "video": "other", // Videos don't have a direct match, use "other"
        "document": "reading", // Documents map to "reading"
        "resource": "supplementary", // Resources map to "supplementary"
        "assignment": "assignment", // Direct match
        "reading": "reading", // Direct match
        "lecture": "lecture" // Direct match
      };
      const serverCategory = categoryMap[values.category] || "other";
      formData.append("category", serverCategory);

      message.loading({
        content: t("admin.materialManagement.messages.uploading") || "Uploading material...",
        key: "upload",
        duration: 0,
      });

      // Get token - check both authToken and token
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        message.destroy("upload");
        message.error("Authentication token not found. Please login again.");
        history.push("/login");
        return;
      }

      // Prepare headers - DO NOT set Content-Type for FormData, browser will set it with boundary
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Use materialAPI.create which handles FormData correctly
      try {
        await materialAPI.create(formData);
        message.success({
          content: t("admin.materialManagement.messages.uploadSuccess") || "Material uploaded successfully",
          key: "upload",
        });
        handleSetMaterialModalVisible(false);
        materialForm.resetFields();
        setFileList([]);
        fetchMaterials();
        return;
      } catch (apiError) {
        console.error("API error:", apiError);
        
        // Handle 401 - authentication error
        if (apiError.status === 401 || apiError.response?.status === 401 || apiError.message?.includes("401") || apiError.message?.includes("Unauthorized")) {
          message.destroy("upload");
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          message.error("Session expired. Please login again.");
          history.push("/login");
          return;
        }
        
        // Handle other errors
        let errorMessage = t("admin.materialManagement.messages.uploadError") || "Failed to upload material";
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
        
        message.destroy("upload");
        message.error(errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      // Only logout if it's an authentication error
      if (error.message?.includes("401") || error.response?.status === 401) {
        message.destroy("upload");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        message.error("Session expired. Please login again.");
        history.push("/login");
        return;
      }
      message.error({
        content: t("admin.materialManagement.messages.uploadError") || "Failed to upload material",
        key: "upload",
      });
    }
  };

  // Handle delete material
  const handleDeleteMaterial = async (materialId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/${materialId}`,
        { method: "DELETE", headers: getAuthHeaders() }
      );
      if (!response.ok) {
        throw new Error("Failed to delete material");
      }
      message.success(t("admin.materialManagement.messages.deleteSuccess") || "Material deleted successfully");
      fetchMaterials();
    } catch (error) {
      message.error(t("admin.materialManagement.messages.deleteError") || "Failed to delete material");
    }
  };

  // Handle preview material
  const handlePreviewMaterial = async (material) => {
    setSelectedMaterial(material);
    setPreviewLoading(true);
    handleSetPreviewModalVisible(true);
    
    try {
      // Get the file URL for preview
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      // Fetch file as blob for preview
      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/download/${material._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load file");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewFileUrl(objectUrl);
    } catch (error) {
      console.error("Error loading file for preview:", error);
      message.error("Failed to load file for preview");
      setPreviewFileUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Clean up object URL when modal closes
  const handleClosePreview = () => {
    if (previewFileUrl) {
      URL.revokeObjectURL(previewFileUrl);
      setPreviewFileUrl(null);
    }
    handleSetPreviewModalVisible(false);
    setSelectedMaterial(null);
    setPreviewLoading(false);
  };

  // Cleanup effect to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl);
      }
    };
  }, [previewFileUrl]);

  // Handle download material
  const handleDownloadMaterial = (record) => {
    const fileName = record.originalName || record.title || "material";
    let filePath = record.filePath;
    if (!filePath.startsWith("http") && !filePath.startsWith("uploads/")) {
      filePath = `uploads/${filePath}`;
    }
    downloadFile(filePath, fileName);
  };

  // Load initial data - ensure courses are loaded first
  useEffect(() => {
    // Fetch courses first, then materials
    const loadData = async () => {
      await fetchCourses();
      await fetchMaterials();
    };
    loadData();
  }, [fetchMaterials, fetchCourses]);

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      !searchTerm ||
      material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If no filter selected, show all materials
    if (!selectedFileType) {
      return matchesSearch;
    }
    
    // Check fileType, category, and type fields for filtering
    const materialFileType = (material.fileType || '').toLowerCase();
    const materialCategory = (material.category || '').toLowerCase();
    const materialType = (material.type || '').toLowerCase();
    const filterValue = selectedFileType.toLowerCase();
    
    // Match video files
    if (filterValue === 'video') {
      const isVideo = 
        materialFileType === 'video' ||
        materialCategory === 'video' ||
        materialType === 'video' ||
        (material.mimeType || '').toLowerCase().startsWith('video/');
      return matchesSearch && isVideo;
    }
    
    // Match document files
    if (filterValue === 'document') {
      const isDocument = 
        materialFileType === 'document' ||
        materialFileType === 'pdf' ||
        materialCategory === 'document' ||
        materialType === 'document' ||
        (material.mimeType || '').includes('pdf') ||
        (material.mimeType || '').includes('document') ||
        (material.mimeType || '').includes('msword') ||
        (material.mimeType || '').includes('wordprocessingml') ||
        (material.fileName || '').toLowerCase().match(/\.(pdf|doc|docx)$/);
      return matchesSearch && isDocument;
    }
    
    // Match resource files (everything else that's not video or document)
    if (filterValue === 'resource') {
      const isVideo = 
        materialFileType === 'video' ||
        materialCategory === 'video' ||
        materialType === 'video' ||
        (material.mimeType || '').toLowerCase().startsWith('video/');
      const isDocument = 
        materialFileType === 'document' ||
        materialFileType === 'pdf' ||
        materialCategory === 'document' ||
        materialType === 'document' ||
        (material.mimeType || '').includes('pdf') ||
        (material.mimeType || '').includes('document') ||
        (material.mimeType || '').includes('msword') ||
        (material.mimeType || '').includes('wordprocessingml') ||
        (material.fileName || '').toLowerCase().match(/\.(pdf|doc|docx)$/);
      const isResource = !isVideo && !isDocument;
      return matchesSearch && isResource;
    }
    
    // Fallback: check if any field matches
    return matchesSearch && (
      materialFileType === filterValue ||
      materialCategory === filterValue ||
      materialType === filterValue
    );
  });

  // Upload props
  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
  };

  const materialColumns = [
    {
      title: t("admin.materialManagement.table.columns.material"),
      key: "material",
      render: (_, record) => (
        <Space>
          {record.fileType === "video" ? (
            <VideoCameraOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
          ) : record.fileType === "pdf" ? (
            <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
          ) : (
            <FileOutlined style={{ fontSize: 20, color: "#52c41a" }} />
          )}
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description || t("admin.materialManagement.preview.noDescription")}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t("admin.materialManagement.table.columns.course"),
      dataIndex: "course",
      key: "course",
      render: (course, record) => {
        // Handle both populated course object and course ID string
        let courseData = null;
        
        // Check if course is already populated (object with title, code, etc.)
        if (course && typeof course === 'object' && (course.title || course.name)) {
          courseData = course;
        } 
        // If course is an ID string, find it in courses array
        else if (course) {
          const courseId = typeof course === 'string' ? course : course._id || course;
          courseData = courses.find((c) => {
            const cId = c._id || c.id;
            return cId === courseId || cId?.toString() === courseId?.toString();
          });
        }
        
        // If still not found, try to find by courseId field in record
        if (!courseData && record.courseId) {
          courseData = courses.find((c) => {
            const cId = c._id || c.id;
            const recordCourseId = record.courseId?._id || record.courseId;
            return cId === recordCourseId || cId?.toString() === recordCourseId?.toString();
          });
        }
        
        // Extract course title and code
        const courseTitle = courseData?.title || courseData?.name || null;
        const courseCode = courseData?.code || null;
        
        // Debug logging (can be removed in production)
        if (!courseData && course) {
          console.log('Course not found:', {
            course,
            courseId: record.courseId,
            coursesLength: courses.length,
            courseIds: courses.map(c => c._id),
          });
        }
        
        return (
          <Tag color="blue">
            {courseTitle 
              ? (courseCode ? `${courseTitle} (${courseCode})` : courseTitle)
              : t("admin.materialManagement.table.values.unknown")}
          </Tag>
        );
      },
    },
    {
      title: t("admin.materialManagement.table.columns.category"),
      dataIndex: "category",
      key: "category",
      render: (category) => {
        const colors = {
          video: "red",
          document: "blue",
          resource: "green",
          assignment: "orange",
          reading: "purple",
          lecture: "cyan",
        };
        return (
          <Tag color={colors[category] || "default"}>
            {t(`admin.materialManagement.upload.categories.${category}`) ||
              category}
          </Tag>
        );
      },
    },
    {
      title: t("admin.materialManagement.table.columns.size"),
      dataIndex: "fileSize",
      key: "fileSize",
      render: (size, record) => {
        const fileSize = size || record.size || 0;
        const sizeInBytes = typeof fileSize === 'number' ? fileSize : parseInt(fileSize) || 0;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return `${sizeInMB.toFixed(2)} MB`;
      },
    },
    {
      title: t("admin.materialManagement.table.columns.uploaded"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        i18n.language === "ja"
          ? moment(date).locale("ja").format("YYYY年MM月DD日")
          : moment(date).format("MMM DD, YYYY"),
    },
    {
      title: t("admin.materialManagement.table.columns.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title={t("admin.materialManagement.actions.download")}>
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownloadMaterial(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin.materialManagement.actions.preview")}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreviewMaterial(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("admin.materialManagement.actions.deleteConfirm")}
            onConfirm={() => handleDeleteMaterial(record._id)}
          >
            <Tooltip title={t("admin.materialManagement.actions.delete")}>
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", padding: "24px" }}>
      {/* Simplified Header */}
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <FolderOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            {t("admin.materialManagement.title")}
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: 14, marginLeft: 32 }}>
          {t("admin.materialManagement.subtitle")}
        </Text>
      </div>

      {/* Simplified Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#f0f5ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FolderOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.materialManagement.stats.totalMaterials")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {materials.length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#fff1f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideoCameraOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.materialManagement.stats.videos")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {materials.filter((m) => 
                    m.category === "video" || m.type === "video" || m.fileType === "video"
                  ).length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#fffbe6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileTextOutlined style={{ fontSize: 24, color: "#faad14" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.materialManagement.stats.documents")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {materials.filter((m) => 
                    m.category === "document" || 
                    m.type === "document" ||
                    (m.fileType === "pdf" || m.fileType === "doc" || m.fileType === "docx")
                  ).length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "#f6ffed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloudOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t("admin.materialManagement.stats.totalSize")}
                </Text>
                <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 24 }}>
                  {(() => {
                    // Calculate total size from ALL materials
                    const totalBytes = materials.reduce((sum, m) => {
                      // Handle different fileSize formats - ensure we get a number
                      const size = m.fileSize || m.size || 0;
                      let sizeInBytes = 0;
                      
                      if (typeof size === 'number') {
                        sizeInBytes = size;
                      } else if (typeof size === 'string') {
                        // Try to parse as number
                        const parsed = parseFloat(size);
                        sizeInBytes = isNaN(parsed) ? 0 : parsed;
                      }
                      
                      return sum + sizeInBytes;
                    }, 0);
                    
                    // Convert bytes to MB
                    const totalMB = totalBytes / (1024 * 1024);
                    
                    // Format: Show 2 decimal places for accuracy, remove trailing zeros
                    // This ensures accurate display especially for small values
                    if (totalMB === 0) {
                      return '0';
                    } else if (totalMB < 1) {
                      // For values < 1 MB, show 2 decimal places
                      const formatted = totalMB.toFixed(2);
                      // Remove trailing zeros but keep at least one decimal place
                      return formatted.replace(/0+$/, '').replace(/\.$/, '');
                    } else {
                      // For values >= 1 MB, show 1 decimal place
                      const formatted = totalMB.toFixed(1);
                      return formatted.replace(/\.0$/, '');
                    }
                  })()}
                  <span style={{ fontSize: 14, marginLeft: 4 }}>MB</span>
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters & Actions Bar */}
      <Card
        style={{
          borderRadius: 8,
          marginBottom: 24,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Input
              size="large"
              placeholder={t(
                "admin.materialManagement.filters.searchPlaceholder"
              )}
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: 6 }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              size="large"
              placeholder={t("admin.materialManagement.filters.filterByType")}
              style={{ width: "100%", borderRadius: 6 }}
              value={selectedFileType}
              onChange={(value) => {
                setSelectedFileType(value === 'all' ? null : (value || null));
              }}
              allowClear
            >
              <Option value="all">
                {t("admin.materialManagement.filters.types.all") || "All"}
              </Option>
              <Option value="video">
                {t("admin.materialManagement.filters.types.video")}
              </Option>
              <Option value="document">
                {t("admin.materialManagement.filters.types.document")}
              </Option>
              <Option value="resource">
                {t("admin.materialManagement.filters.types.resource")}
              </Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={10} style={{ textAlign: "right" }}>
            <Button
              size="large"
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                materialForm.resetFields();
                setFileList([]);
                handleSetMaterialModalVisible(true);
              }}
              style={{
                borderRadius: 6,
                width: "100%",
              }}
            >
              {t("admin.materialManagement.actions.uploadMaterial")}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Results count */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 15, color: "#262626" }}>
          {filteredMaterials.length === materials.length
            ? `${t("admin.materialManagement.table.title")} (${materials.length})`
            : `${t("admin.courseManagement.filters.searchResults") || "Showing"} ${filteredMaterials.length} ${t("admin.courseManagement.filters.of") || "of"} ${materials.length}`}
        </Text>
      </div>

      {/* Materials Table */}
      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Table
          columns={materialColumns}
          dataSource={filteredMaterials}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            style: { marginTop: 16 },
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <Text type="secondary">
                    {searchTerm || selectedFileType
                      ? t("admin.materialManagement.messages.noResults") ||
                        "No materials found"
                      : t("admin.materialManagement.messages.noMaterials") ||
                        "No materials available"}
                  </Text>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Upload Material Modal */}
      <Modal
        title={t("admin.materialManagement.upload.title")}
        open={materialModalVisibleLocal}
        onCancel={() => {
          handleSetMaterialModalVisible(false);
          materialForm.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={materialForm}
          layout="vertical"
          onFinish={handleUploadMaterial}
        >
          <Form.Item
            name="title"
            label={t("admin.materialManagement.upload.fields.title")}
            rules={[
              {
                required: true,
                message: t(
                  "admin.materialManagement.upload.validation.titleRequired"
                ),
              },
            ]}
          >
            <Input
              placeholder={t(
                "admin.materialManagement.upload.placeholders.title"
              )}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("admin.materialManagement.upload.fields.description")}
          >
            <Input.TextArea
              rows={4}
              placeholder={t(
                "admin.materialManagement.upload.placeholders.description"
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="courseId"
                label={t("admin.materialManagement.upload.fields.course")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.materialManagement.upload.validation.courseRequired"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "admin.materialManagement.upload.placeholders.selectCourse"
                  )}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {courses.map((course) => (
                    <Option key={course._id} value={course._id}>
                      {course.title} ({course.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label={t("admin.materialManagement.upload.fields.category")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "admin.materialManagement.upload.validation.categoryRequired"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "admin.materialManagement.upload.placeholders.selectCategory"
                  )}
                >
                  <Option value="video">
                    {t("admin.materialManagement.upload.categories.video")}
                  </Option>
                  <Option value="document">
                    {t("admin.materialManagement.upload.categories.document")}
                  </Option>
                  <Option value="resource">
                    {t("admin.materialManagement.upload.categories.resource")}
                  </Option>
                  <Option value="assignment">
                    {t("admin.materialManagement.upload.categories.assignment")}
                  </Option>
                  <Option value="reading">
                    {t("admin.materialManagement.upload.categories.reading")}
                  </Option>
                  <Option value="lecture">
                    {t("admin.materialManagement.upload.categories.lecture")}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={t("admin.materialManagement.upload.fields.file")}
            required
            rules={[
              {
                validator: () => {
                  if (fileList.length === 0) {
                    return Promise.reject(
                      new Error(
                        t(
                          "admin.materialManagement.upload.validation.fileRequired"
                        )
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Dragger {...uploadProps} style={{ padding: "20px" }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text">
                {t("admin.materialManagement.upload.uploadText")}
              </p>
              <p className="ant-upload-hint">
                {t("admin.materialManagement.upload.uploadHint")}
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  handleSetMaterialModalVisible(false);
                  materialForm.resetFields();
                  setFileList([]);
                }}
              >
                {t("admin.courseManagement.modals.cancel") ||
                  t("admin.modals.cancel") ||
                  "Cancel"}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("admin.materialManagement.actions.uploadMaterial")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Material Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <Text strong>
              {selectedMaterial?.title || t("admin.materialManagement.preview.title")}
            </Text>
          </Space>
        }
        open={previewModalVisibleLocal}
        onCancel={handleClosePreview}
        footer={[
          <Button
            key="close"
            onClick={handleClosePreview}
          >
            {(() => {
              const translated = t("admin.modals.close");
              // If translation returns the key itself, it means translation not found
              if (translated && translated !== "admin.modals.close") {
                return translated;
              }
              // Fallback to language-specific text
              return i18n.language === "ja" ? "閉じる" : "Close";
            })()}
          </Button>,
          selectedMaterial && (
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                handleDownloadMaterial(selectedMaterial);
              }}
            >
              {t("admin.materialManagement.actions.download")}
            </Button>
          ),
        ]}
        width={900}
        destroyOnClose
      >
        {selectedMaterial && (
          <div>
            {/* File Metadata */}
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item
                label={t("admin.materialManagement.upload.fields.description")}
                span={2}
              >
                {selectedMaterial.description || (
                  <Text type="secondary">
                    {t("admin.materialManagement.preview.noDescription")}
                  </Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("admin.materialManagement.table.columns.course")}
              >
                {(() => {
                  // Handle both populated course object and course ID string
                  let courseData = null;
                  
                  // Check if course is already populated (object with title, code, etc.)
                  if (selectedMaterial.course && typeof selectedMaterial.course === 'object' && (selectedMaterial.course.title || selectedMaterial.course.name)) {
                    courseData = selectedMaterial.course;
                  } 
                  // If course is an ID string, find it in courses array
                  else if (selectedMaterial.course) {
                    const courseId = typeof selectedMaterial.course === 'string' 
                      ? selectedMaterial.course 
                      : selectedMaterial.course._id || selectedMaterial.course;
                    courseData = courses.find((c) => {
                      const cId = c._id || c.id;
                      return cId === courseId || cId?.toString() === courseId?.toString();
                    });
                  }
                  
                  // If still not found, try to find by courseId field
                  if (!courseData && selectedMaterial.courseId) {
                    const recordCourseId = selectedMaterial.courseId?._id || selectedMaterial.courseId;
                    courseData = courses.find((c) => {
                      const cId = c._id || c.id;
                      return cId === recordCourseId || cId?.toString() === recordCourseId?.toString();
                    });
                  }
                  
                  const courseTitle = courseData?.title || courseData?.name || null;
                  const courseCode = courseData?.code || null;
                  
                  return (
                    <Tag color="blue">
                      {courseTitle 
                        ? (courseCode ? `${courseTitle} (${courseCode})` : courseTitle)
                        : t("admin.materialManagement.table.values.unknown")}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("admin.materialManagement.table.columns.category")}
              >
                <Tag color="blue">
                  {t(
                    `admin.materialManagement.upload.categories.${selectedMaterial.category}`
                  ) || selectedMaterial.category}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={t("admin.materialManagement.table.columns.size")}
              >
                {((selectedMaterial.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
              </Descriptions.Item>
              <Descriptions.Item label="File Type">
                <Tag>
                  {selectedMaterial.fileType?.toUpperCase() || "UNKNOWN"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* File Content Preview */}
            <div style={{ minHeight: 400, maxHeight: 600, overflow: 'auto', position: 'relative' }}>
              {previewLoading ? (
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  padding: '80px 20px',
                  gap: 16
                }}>
                  <Spin 
                    size="large"
                    tip={t("admin.materialManagement.preview.loading") || "Loading file preview..."}
                  />
                  <Text type="secondary" style={{ fontSize: 14, marginTop: 8 }}>
                    {t("admin.materialManagement.preview.loadingMessage") || "Preparing your file for preview..."}
                  </Text>
                </div>
              ) : previewFileUrl ? (
                (() => {
                  const fileType = selectedMaterial.fileType?.toLowerCase();
                  const mimeType = selectedMaterial.mimeType?.toLowerCase() || '';

                  // PDF Preview
                  if (fileType === 'pdf' || mimeType.includes('pdf')) {
                    return (
                      <iframe
                        src={previewFileUrl}
                        style={{
                          width: '100%',
                          height: '600px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                        }}
                        title="PDF Preview"
                      />
                    );
                  }

                  // Image Preview
                  if (fileType === 'image' || mimeType.startsWith('image/')) {
                    return (
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src={previewFileUrl}
                          alt={selectedMaterial.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '600px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    );
                  }

                  // Video Preview
                  if (fileType === 'video' || mimeType.startsWith('video/')) {
                    return (
                      <video
                        controls
                        src={previewFileUrl}
                        style={{
                          width: '100%',
                          maxHeight: '600px',
                          borderRadius: '4px',
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  }

                  // Audio Preview
                  if (fileType === 'audio' || mimeType.startsWith('audio/')) {
                    return (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <audio
                          controls
                          src={previewFileUrl}
                          style={{ width: '100%' }}
                        >
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    );
                  }

                  // Text/Document Preview (for text-based files)
                  if (mimeType.includes('text/') || mimeType.includes('application/json') || 
                      mimeType.includes('application/xml')) {
                    return (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadMaterial(selectedMaterial)}
                        >
                          {t("admin.materialManagement.actions.download")} {selectedMaterial.fileName || selectedMaterial.title}
                        </Button>
                        <div style={{ marginTop: 16 }}>
                          <Text type="secondary">
                            Preview not available for this file type. Please download to view.
                          </Text>
                        </div>
                      </div>
                    );
                  }

                  // Default: Download option for unsupported types
                  return (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                      <FileOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                      <div>
                        <Text strong>{selectedMaterial.fileName || selectedMaterial.title}</Text>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <Text type="secondary">
                          Preview not available for this file type. Please download to view.
                        </Text>
                      </div>
                      <div style={{ marginTop: 24 }}>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadMaterial(selectedMaterial)}
                        >
                          {t("admin.materialManagement.actions.download")}
                        </Button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <Text type="secondary">Unable to load file preview</Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Admincoursematerials;

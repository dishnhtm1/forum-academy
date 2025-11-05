import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
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
  Descriptions,
  Avatar,
  Empty,
  Spin,
} from "antd";
import {
  FolderOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  FileOutlined,
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { materialAPI, courseAPI } from "../../utils/apiClient";
import { API_BASE_URL, getAuthHeaders } from "../../utils/adminApiUtils";

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const TeacherMaterials = ({ t, currentUser, isMobile, history: historyProp }) => {
  const historyHook = useHistory();
  const history = historyProp || historyHook;
  const [materialForm] = Form.useForm();
  const { i18n } = useTranslation();

  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await materialAPI.getAll();
      if (response.success) {
        const allMaterials = response.materials || response || [];
        // Filter materials for teacher's courses
        const teacherCourses = courses.map(c => c._id || c.id);
        const teacherMaterials = allMaterials.filter(m => 
          teacherCourses.includes(m.course?._id || m.course || m.courseId?._id || m.courseId)
        );
        setMaterials(teacherMaterials);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      message.error("Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  }, [courses]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getAll();
      if (response.success) {
        const allCourses = response.courses || response || [];
        const teacherCourses = allCourses.filter(
          (course) => course.teacher === currentUser?.id || course.teacherId === currentUser?.id
        );
        setCourses(teacherCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      fetchMaterials();
    }
  }, [courses, fetchMaterials]);

  const handleUploadMaterial = async (values) => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      const file = fileList[0].originFileObj || fileList[0];
      formData.append("file", file);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("course", values.courseId);
      
      const categoryMap = {
        video: "other",
        document: "reading",
        resource: "supplementary",
        assignment: "assignment",
        reading: "reading",
        lecture: "lecture"
      };
      const serverCategory = categoryMap[values.category] || "other";
      formData.append("category", serverCategory);

      message.loading({ content: "Uploading material...", key: "upload", duration: 0 });

      await materialAPI.create(formData);
      message.success({ content: "Material uploaded successfully", key: "upload" });
      setMaterialModalVisible(false);
      materialForm.resetFields();
      setFileList([]);
      fetchMaterials();
    } catch (error) {
      message.error({ content: error.message || "Failed to upload material", key: "upload" });
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await materialAPI.delete(materialId);
      message.success("Material deleted successfully");
      fetchMaterials();
    } catch (error) {
      message.error("Failed to delete material");
    }
  };

  const handlePreviewMaterial = async (material) => {
    setSelectedMaterial(material);
    setPreviewLoading(true);
    setPreviewModalVisible(true);
    
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/download/${material._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to load file");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewFileUrl(objectUrl);
    } catch (error) {
      message.error("Failed to load file for preview");
      setPreviewFileUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadMaterial = async (material) => {
    try {
      const blob = await materialAPI.download(material._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.originalName || material.title || "material";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success("Download started");
    } catch (error) {
      message.error("Failed to download material");
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      !searchTerm ||
      material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (!selectedFileType || material.category === selectedFileType);
  });

  const materialColumns = [
    {
      title: "Material",
      key: "material",
      render: (_, record) => (
        <Space>
          {record.fileType === "video" ? (
            <VideoCameraOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
          ) : (
            <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
          )}
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description || "No description"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (course) => {
        const courseData = typeof course === 'object' ? course : courses.find(c => (c._id || c.id) === course);
        return <Tag color="blue">{courseData?.title || "Unknown"}</Tag>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category || "other"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Preview">
            <Button icon={<EyeOutlined />} size="small" onClick={() => handlePreviewMaterial(record)} />
          </Tooltip>
          <Tooltip title="Download">
            <Button icon={<DownloadOutlined />} size="small" onClick={() => handleDownloadMaterial(record)} />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this material?"
            onConfirm={() => handleDeleteMaterial(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => setFileList([]),
    maxCount: 1,
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <FolderOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {t("teacherDashboard.sidebar.materials") || "Materials"}
            </Title>
          </Space>
        </div>

        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input
            placeholder="Search materials..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by type"
            allowClear
            value={selectedFileType}
            onChange={setSelectedFileType}
            style={{ width: 200 }}
          >
            <Option value="lecture">Lecture</Option>
            <Option value="assignment">Assignment</Option>
            <Option value="reading">Reading</Option>
            <Option value="supplementary">Supplementary</Option>
            <Option value="other">Other</Option>
          </Select>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              materialForm.resetFields();
              setFileList([]);
              setMaterialModalVisible(true);
            }}
          >
            Upload Material
          </Button>
        </Space>

        <Table
          columns={materialColumns}
          dataSource={filteredMaterials}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Upload Material Modal */}
      <Modal
        title="Upload Material"
        open={materialModalVisible}
        onCancel={() => {
          setMaterialModalVisible(false);
          materialForm.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={materialForm} layout="vertical" onFinish={handleUploadMaterial}>
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select placeholder="Select course">
              {courses.map((course) => (
                <Option key={course._id || course.id} value={course._id || course.id}>
                  {course.title} ({course.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="lecture">Lecture</Option>
              <Option value="assignment">Assignment</Option>
              <Option value="reading">Reading</Option>
              <Option value="supplementary">Supplementary</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="File"
            rules={[{ required: true, message: "Please select a file" }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Upload
              </Button>
              <Button onClick={() => setMaterialModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Material Preview"
        open={previewModalVisible}
        onCancel={() => {
          if (previewFileUrl) URL.revokeObjectURL(previewFileUrl);
          setPreviewModalVisible(false);
          setPreviewFileUrl(null);
          setSelectedMaterial(null);
        }}
        footer={null}
        width={800}
      >
        {previewLoading ? (
          <Spin size="large" />
        ) : previewFileUrl ? (
          <iframe
            src={previewFileUrl}
            style={{ width: "100%", height: "600px", border: "none" }}
            title="Material Preview"
          />
        ) : (
          <Empty description="Unable to preview this file" />
        )}
      </Modal>
    </div>
  );
};

export default TeacherMaterials;

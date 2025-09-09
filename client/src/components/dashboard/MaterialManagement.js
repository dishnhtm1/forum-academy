import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Upload, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Progress,
  Descriptions, Avatar, List, Badge
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
  UploadOutlined, SearchOutlined, FilterOutlined
} from '@ant-design/icons';

// Import API client
import { materialAPI, courseAPI } from '../../utils/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const MaterialManagement = ({ currentUser }) => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form] = Form.useForm();

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await materialAPI.getAll();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to fetch course materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getAll();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    console.log('🔄 Starting file upload...', values);
    console.log('📎 File:', fileList[0]);

    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('course', values.course);
    formData.append('category', values.category);
    formData.append('week', values.week || 1);
    formData.append('lesson', values.lesson || 1);
    formData.append('tags', JSON.stringify(values.tags || []));
    formData.append('accessLevel', values.accessLevel || 'course_students');

    // Log FormData contents
    console.log('📋 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log('🚀 Calling API...');
      const result = await materialAPI.create(formData);
      console.log('✅ Upload successful:', result);
      message.success('Material uploaded and saved to database!');
      setUploadModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchMaterials();
    } catch (error) {
      console.error('❌ Upload error:', error);
      message.error(error.message || 'Failed to upload material');
    }
  };

  const handleDelete = async (materialId) => {
    try {
      await materialAPI.delete(materialId);
      message.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      message.error('Failed to delete material');
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'video':
        return <VideoCameraOutlined style={{ color: '#1890ff' }} />;
      case 'audio':
        return <AudioOutlined style={{ color: '#52c41a' }} />;
      case 'pdf':
        return <FileOutlined style={{ color: '#f5222d' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
    onRemove: () => {
      setFileList([]);
    }
  };

  const filteredMaterials = materials.filter(material => {
    return (
      (selectedCourse === '' || material.course._id === selectedCourse) &&
      (selectedCategory === '' || material.category === selectedCategory) &&
      (selectedFileType === '' || material.fileType === selectedFileType)
    );
  });

  const columns = [
    {
      title: 'File',
      key: 'file',
      render: (_, record) => (
        <Space>
          {getFileIcon(record.fileType)}
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.fileName} ({formatFileSize(record.fileSize)})
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Course',
      dataIndex: ['course', 'title'],
      key: 'course',
      render: (courseTitle, record) => (
        <div>
          <Text>{courseTitle}</Text>
          <br />
          <Tag color="blue" size="small">{record.course.code}</Tag>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={
          category === 'lecture' ? 'blue' :
          category === 'assignment' ? 'orange' :
          category === 'reading' ? 'green' :
          category === 'exam' ? 'red' : 'default'
        }>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Week/Lesson',
      key: 'weekLesson',
      render: (_, record) => `Week ${record.week}, Lesson ${record.lesson}`
    },
    {
      title: 'Access Level',
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      render: (accessLevel) => (
        <Tag color={
          accessLevel === 'public' ? 'green' :
          accessLevel === 'course_students' ? 'blue' : 'red'
        }>
          {accessLevel.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Downloads',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
    },
    {
      title: 'Upload Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => {
                setSelectedMaterial(record);
                setViewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button 
              icon={<DownloadOutlined />} 
              size="small"
              onClick={() => window.open(`/api/course-materials/download/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this material?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Course Materials Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setUploadModalVisible(true)}
          >
            Upload New Material
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              placeholder="Filter by Course"
              style={{ width: '100%' }}
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
            <Select
              placeholder="Filter by Category"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
            >
              <Option value="lecture">Lecture</Option>
              <Option value="assignment">Assignment</Option>
              <Option value="reading">Reading</Option>
              <Option value="supplementary">Supplementary</Option>
              <Option value="exam">Exam</Option>
              <Option value="other">Other</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filter by File Type"
              style={{ width: '100%' }}
              value={selectedFileType}
              onChange={setSelectedFileType}
              allowClear
            >
              <Option value="pdf">PDF</Option>
              <Option value="video">Video</Option>
              <Option value="audio">Audio</Option>
              <Option value="document">Document</Option>
              <Option value="image">Image</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredMaterials}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>

      {/* Upload Modal */}
      <Modal
        title="Upload Course Material"
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="e.g. Chapter 1: Introduction to Grammar" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief description of the material..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select placeholder="Select course">
                  {courses.map(course => (
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
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="lecture">Lecture</Option>
                  <Option value="assignment">Assignment</Option>
                  <Option value="reading">Reading</Option>
                  <Option value="supplementary">Supplementary</Option>
                  <Option value="exam">Exam</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="week" label="Week">
                <Select placeholder="Week">
                  {[...Array(20)].map((_, i) => (
                    <Option key={i + 1} value={i + 1}>Week {i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lesson" label="Lesson">
                <Select placeholder="Lesson">
                  {[...Array(10)].map((_, i) => (
                    <Option key={i + 1} value={i + 1}>Lesson {i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="accessLevel" label="Access Level">
                <Select placeholder="Who can access?" defaultValue="course_students">
                  <Option value="public">Public</Option>
                  <Option value="course_students">Course Students</Option>
                  <Option value="instructor_only">Instructor Only</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="File Upload" required>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, video, audio, and document files. Maximum file size: 100MB
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Material Modal */}
      <Modal
        title="Material Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="download" 
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => window.open(`/api/course-materials/download/${selectedMaterial?._id}`)}
          >
            Download
          </Button>
        ]}
        width={600}
      >
        {selectedMaterial && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Title">{selectedMaterial.title}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedMaterial.description}</Descriptions.Item>
            <Descriptions.Item label="Course">
              {selectedMaterial.course?.title} ({selectedMaterial.course?.code})
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag color="blue">{selectedMaterial.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="File Name">{selectedMaterial.fileName}</Descriptions.Item>
            <Descriptions.Item label="File Size">{formatFileSize(selectedMaterial.fileSize)}</Descriptions.Item>
            <Descriptions.Item label="File Type">
              {getFileIcon(selectedMaterial.fileType)} {selectedMaterial.fileType}
            </Descriptions.Item>
            <Descriptions.Item label="Downloads">{selectedMaterial.downloadCount}</Descriptions.Item>
            <Descriptions.Item label="Upload Date">
              {new Date(selectedMaterial.createdAt).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MaterialManagement;

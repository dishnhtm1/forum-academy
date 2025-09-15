import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Upload, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Progress,
  Descriptions, Avatar, List, Badge
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  DownloadOutlined, FileOutlined, VideoCameraOutlined, AudioOutlined,
  UploadOutlined, SearchOutlined, FilterOutlined, BookOutlined,
  TagOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined
} from '@ant-design/icons';

// Import API client
import { materialAPI, courseAPI } from '../../utils/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const MaterialManagement = ({ currentUser }) => {
  // Add custom styles for enhanced table appearance
  const tableStyles = `
    .table-row-light {
      background-color: #fafafa !important;
    }
    
    .table-row-dark {
      background-color: #ffffff !important;
    }
    
    .ant-table-thead > tr > th {
      background-color: #f8f9fa !important;
      border-bottom: 2px solid #e9ecef !important;
      font-weight: 600 !important;
      color: #495057 !important;
      text-align: center !important;
    }
    
    .ant-table-tbody > tr > td {
      padding: 12px !important;
      vertical-align: middle !important;
      border-bottom: 1px solid #f0f0f0 !important;
    }
    
    .ant-table-tbody > tr:hover > td {
      background-color: #f8f9fa !important;
    }
    
    .ant-pagination {
      margin-top: 20px !important;
      text-align: center !important;
    }
    
    .ant-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      border: none !important;
    }
  `;

  // Inject styles
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = tableStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      title: (
        <Space>
          <FileOutlined />
          <Text strong>Material Details</Text>
        </Space>
      ),
      key: 'file',
      width: 300,
      render: (_, record) => (
        <div style={{ padding: '8px 0' }}>
          <Space align="start">
            <div style={{ 
              fontSize: '24px', 
              marginRight: '8px',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getFileIcon(record.fileType)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '4px' }}>
                <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                  {record.title}
                </Text>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  📁 {record.fileName}
                </Text>
              </div>
              <div>
                <Tag size="small" color="geekblue">
                  {formatFileSize(record.fileSize)}
                </Tag>
                <Tag size="small" color="green">
                  {record.fileType.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Space>
        </div>
      )
    },
    {
      title: (
        <Space>
          <BookOutlined />
          <Text strong>Course</Text>
        </Space>
      ),
      key: 'course',
      width: 200,
      render: (_, record) => (
        <div style={{ padding: '4px 0' }}>
          <div style={{ marginBottom: '4px' }}>
            <Text strong style={{ color: '#1890ff' }}>
              {record.course?.title || 'No Course Assigned'}
            </Text>
          </div>
          <Tag color="blue" size="small">
            {record.course?.code || 'N/A'}
          </Tag>
        </div>
      )
    },
    {
      title: (
        <Space>
          <TagOutlined />
          <Text strong>Category</Text>
        </Space>
      ),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        const categoryConfig = {
          lecture: { color: 'blue', icon: '📚' },
          assignment: { color: 'orange', icon: '📝' },
          reading: { color: 'green', icon: '📖' },
          exam: { color: 'red', icon: '📋' },
          supplementary: { color: 'purple', icon: '📎' },
          other: { color: 'default', icon: '📄' }
        };
        const config = categoryConfig[category] || categoryConfig.other;
        
        return (
          <Tag 
            color={config.color} 
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {config.icon} {category.charAt(0).toUpperCase() + category.slice(1)}
          </Tag>
        );
      }
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <Text strong>Week/Lesson</Text>
        </Space>
      ),
      key: 'weekLesson',
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '4px 8px', 
            borderRadius: '4px',
            marginBottom: '2px'
          }}>
            <Text style={{ fontSize: '12px', fontWeight: '500' }}>
              📅 Week {record.week}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Lesson {record.lesson}
          </Text>
        </div>
      )
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <Text strong>Access Level</Text>
        </Space>
      ),
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      width: 130,
      render: (accessLevel) => {
        const accessConfig = {
          public: { color: 'green', icon: '🌍', text: 'Public' },
          course_students: { color: 'blue', icon: '👥', text: 'Course Students' },
          private: { color: 'red', icon: '🔒', text: 'Private' }
        };
        const config = accessConfig[accessLevel] || accessConfig.private;
        
        return (
          <Tag 
            color={config.color}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500'
            }}
          >
            {config.icon} {config.text}
          </Tag>
        );
      }
    },
    {
      title: (
        <Space>
          <DownloadOutlined />
          <Text strong>Downloads</Text>
        </Space>
      ),
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <div style={{ textAlign: 'center' }}>
          <Badge 
            count={count || 0} 
            style={{ 
              backgroundColor: '#52c41a',
              fontSize: '12px',
              fontWeight: '500'
            }} 
          />
          <div style={{ marginTop: '2px' }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              downloads
            </Text>
          </div>
        </div>
      )
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined />
          <Text strong>Upload Date</Text>
        </Space>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2px' }}>
            <Text style={{ fontSize: '12px', fontWeight: '500' }}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: '10px' }}>
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </div>
      )
    },
    {
      title: (
        <Text strong>Actions</Text>
      ),
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              style={{ 
                backgroundColor: '#1890ff', 
                borderColor: '#1890ff',
                color: 'white'
              }}
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
              style={{ 
                backgroundColor: '#52c41a', 
                borderColor: '#52c41a',
                color: 'white'
              }}
              onClick={() => window.open(`/api/course-materials/download/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              style={{ 
                backgroundColor: '#faad14', 
                borderColor: '#faad14',
                color: 'white'
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this material?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger 
                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
              />
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
                  {course.title} ({course.code || 'No Code'})
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

      <Card style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: 'none'
      }}>
        <Table
          columns={columns}
          dataSource={filteredMaterials}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} materials`,
            pageSizeOptions: ['5', '10', '20', '50'],
            style: { 
              marginTop: '20px',
              textAlign: 'center'
            }
          }}
          scroll={{ x: 1400 }}
          size="middle"
          bordered={false}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px'
          }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    ...props.style,
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e9ecef',
                    fontWeight: '600',
                    padding: '16px 12px',
                    fontSize: '13px',
                    color: '#495057',
                    textAlign: 'center'
                  }}
                />
              )
            },
            body: {
              row: (props) => (
                <tr
                  {...props}
                  style={{
                    ...props.style,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
              ),
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    ...props.style,
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    verticalAlign: 'middle'
                  }}
                />
              )
            }
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

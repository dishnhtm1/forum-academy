import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Upload, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Slider,
  Progress, List, Badge, Alert
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  AudioOutlined, PlayCircleOutlined, PauseCircleOutlined,
  UploadOutlined, ClockCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';

// Import API client
import { courseAPI } from '../../utils/apiClient';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth headers (consistent with apiClient.js)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  console.log('🔍 Token check:', token ? 'Token exists' : 'No token found');
  return {
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Listening Exercise API
const listeningExerciseAPI = {
  // Get all listening exercises
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/listening-exercises`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create new listening exercise
  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/listening-exercises`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
        // Don't set Content-Type for FormData
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Update listening exercise
  update: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/api/listening-exercises/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders()
        // Don't set Content-Type for FormData
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Delete listening exercise
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/listening-exercises/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ListeningExercises = ({ currentUser }) => {
  const [exercises, setExercises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playingExerciseId, setPlayingExerciseId] = useState(null);
  const audioRef = useRef(null);
  const tableAudioRef = useRef(null);
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();

  useEffect(() => {
    fetchExercises();
    fetchCourses();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await listeningExerciseAPI.getAll();
      setExercises(data);
      console.log('📚 Listening exercises fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      message.error('Failed to fetch listening exercises');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const data = await courseAPI.getAll();
      setCourses(data);
      console.log('📚 Courses fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Failed to fetch courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleCreateExercise = async (values) => {
    console.log('🎯 Creating exercise with values:', values);
    console.log('📁 Audio file:', audioFile);

    if (!audioFile) {
      message.error('Please upload an audio file');
      return;
    }

    // Validate file again before upload
    if (audioFile.size > 30 * 1024 * 1024) {
      message.error(`File too large: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB. Maximum is 30MB.`);
      return;
    }

    const formData = new FormData();
    
    // Add the audio file first
    console.log('📤 Appending audio file to FormData...');
    formData.append('audioFile', audioFile);
    
    // Add other form fields
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('course', values.course);
    formData.append('level', values.level);
    formData.append('instructions', values.instructions || '');
    formData.append('transcript', values.transcript || '');
    formData.append('timeLimit', values.timeLimit || 30);
    formData.append('playLimit', values.playLimit || 3);
    formData.append('questions', JSON.stringify(questions));
    formData.append('createdBy', currentUser.id);

    // Debug FormData contents
    console.log('📋 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'audioFile') {
        console.log(`  ${key}:`, value.name, value.size, value.type);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    try {
      console.log('🚀 Sending request...');
      if (editingExercise) {
        await listeningExerciseAPI.update(editingExercise._id, formData);
      } else {
        await listeningExerciseAPI.create(formData);
      }

      message.success(`Exercise ${editingExercise ? 'updated' : 'created'} successfully`);
      setExerciseModalVisible(false);
      form.resetFields();
      setEditingExercise(null);
      setAudioFile(null);
      setQuestions([]);
      fetchExercises();
    } catch (error) {
      console.error('❌ Error saving exercise:', error);
      console.error('❌ Error stack:', error.stack);
      
      // More detailed error messages
      if (error.message.includes('File too large')) {
        message.error('Audio file is too large. Please use a file smaller than 5MB.');
      } else if (error.message.includes('LIMIT_FILE_SIZE')) {
        message.error('File size limit exceeded. Maximum allowed size is 5MB.');
      } else {
        message.error(error.message || 'Error saving exercise. Please check your file and try again.');
      }
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await listeningExerciseAPI.delete(exerciseId);
      message.success('Exercise deleted successfully');
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      message.error(error.message || 'Error deleting exercise');
    }
  };

  const addQuestion = () => {
    questionForm.validateFields().then(values => {
      const newQuestion = {
        id: Date.now(),
        ...values,
        options: values.type === 'multiple_choice' ? values.options || [] : []
      };
      setQuestions([...questions, newQuestion]);
      questionForm.resetFields();
      message.success('Question added successfully');
    });
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleAudioUpload = {
    beforeUpload: (file) => {
      console.log('📁 File upload attempt:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      const isAudio = file.type.startsWith('audio/') || file.name.toLowerCase().match(/\.(mp3|wav|aac|m4a|ogg)$/);
      if (!isAudio) {
        console.error('❌ Invalid file type:', file.type, 'Name:', file.name);
        message.error('You can only upload audio files! Supported formats: MP3, WAV, AAC, M4A, OGG');
        return false;
      }
      
      const fileSizeMB = file.size / 1024 / 1024;
      const isLt30M = fileSizeMB < 30;
      if (!isLt30M) {
        console.error('❌ File too large:', fileSizeMB.toFixed(2) + 'MB');
        message.error(`Audio file must be smaller than 30MB! Your file is ${fileSizeMB.toFixed(2)}MB`);
        return false;
      }
      
      console.log('✅ File validation passed:', file.name, 'Size:', fileSizeMB.toFixed(2) + 'MB', 'Type:', file.type);
      setAudioFile(file);
      message.success(`File "${file.name}" ready to upload (${fileSizeMB.toFixed(2)}MB)`);
      return false; // Prevent automatic upload
    },
    onChange: (info) => {
      console.log('📝 Upload onChange:', info);
    },
    onRemove: () => {
      console.log('🗑️ File removed');
      setAudioFile(null);
      message.info('Audio file removed');
    }
  };

  const playAudio = async () => {
    try {
      if (audioRef.current && audioRef.current.src && !isPlaying) {
        // If audio source already set, just play
        audioRef.current.play();
        setIsPlaying(true);
      } else if (audioRef.current && isPlaying) {
        // Pause if currently playing
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (selectedExercise) {
        // Load audio with authentication
        const response = await fetch(`${API_BASE_URL}/api/listening-exercises/audio/${selectedExercise._id}`, {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);

        // Clean up blob URL when audio ends
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsPlaying(false);
        };
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      message.error('Failed to play audio. Please check if the file exists and you have permission.');
      setIsPlaying(false);
    }
  };

  const playTableAudio = async (exerciseId) => {
    try {
      console.log('🎵 Attempting to play audio for exercise:', exerciseId);
      
      // Stop any currently playing audio
      if (tableAudioRef.current && !tableAudioRef.current.paused) {
        tableAudioRef.current.pause();
        tableAudioRef.current.currentTime = 0;
      }

      if (playingExerciseId === exerciseId) {
        // If clicking the same exercise, toggle play/pause
        if (tableAudioRef.current.paused) {
          tableAudioRef.current.play();
          setPlayingExerciseId(exerciseId);
        } else {
          tableAudioRef.current.pause();
          setPlayingExerciseId(null);
        }
      } else {
        // Fetch audio with authentication headers
        console.log('🔐 Fetching audio with auth headers...');
        const headers = getAuthHeaders();
        console.log('🔑 Auth headers:', headers);
        
        const audioUrl = `${API_BASE_URL}/api/listening-exercises/audio/${exerciseId}`;
        console.log('📡 Fetching from URL:', audioUrl);
        
        const response = await fetch(audioUrl, {
          headers: headers
        });

        console.log('📥 Response status:', response.status, response.statusText);
        console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 404 && errorData.hint) {
            throw new Error(`${errorData.message} ${errorData.hint}`);
          }
          throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
        }

        // Create blob URL from response
        console.log('🔄 Creating blob from response...');
        const audioBlob = await response.blob();
        console.log('📦 Blob created:', audioBlob.type, audioBlob.size + ' bytes');
        
        const blobUrl = URL.createObjectURL(audioBlob);
        console.log('🔗 Blob URL created:', blobUrl);

        // Set audio source and play
        tableAudioRef.current.src = blobUrl;
        console.log('▶️ Starting audio playback...');
        
        await tableAudioRef.current.play();
        setPlayingExerciseId(exerciseId);

        // Clean up blob URL when audio ends
        tableAudioRef.current.onended = () => {
          console.log('🏁 Audio playback ended');
          URL.revokeObjectURL(blobUrl);
          handleTableAudioEnded();
        };
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        exerciseId
      });
      message.error('Failed to play audio. Please check if the file exists and you have permission.');
      setPlayingExerciseId(null);
    }
  };

  const handleTableAudioEnded = () => {
    setPlayingExerciseId(null);
  };

  const handleTableAudioError = (error) => {
    console.error('Audio playback error:', error);
    message.error('Failed to play audio. Please check if the file exists.');
    setPlayingExerciseId(null);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seekAudio = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Course',
      dataIndex: ['course', 'title'],
      key: 'course',
      render: (courseTitle, record) => (
        <div>
          <Text>{courseTitle || 'No Course'}</Text>
          <br />
          <Tag color="blue" size="small">{record.course?.code || 'N/A'}</Tag>
        </div>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={
          level === 'beginner' ? 'green' :
          level === 'intermediate' ? 'orange' : 'red'
        }>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => (
        <Badge count={questions?.length || 0} style={{ backgroundColor: '#52c41a' }} />
      )
    },
    {
      title: 'Duration',
      dataIndex: ['audioFile', 'duration'],
      key: 'duration',
      render: (duration) => (
        <Space>
          <AudioOutlined />
          {duration ? formatTime(duration) : 'Unknown'}
        </Space>
      )
    },
    {
      title: 'Time Limit',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time} min
        </Space>
      )
    },
    {
      title: 'Play Limit',
      dataIndex: 'playLimit',
      key: 'playLimit',
      render: (limit) => `${limit}x`
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'status',
      render: (published) => (
        <Tag color={published ? 'green' : 'gray'}>
          {published ? 'Published' : 'Draft'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title={playingExerciseId === record._id ? "Pause Audio" : "Play Audio"}>
            <Button 
              icon={playingExerciseId === record._id ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
              size="small"
              type={playingExerciseId === record._id ? "primary" : "default"}
              onClick={() => playTableAudio(record._id)}
            />
          </Tooltip>
          <Tooltip title="Preview Exercise">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => {
                setSelectedExercise(record);
                setPreviewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit Exercise">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => {
                setEditingExercise(record);
                setQuestions(record.questions || []);
                form.setFieldsValue(record);
                setExerciseModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this exercise?"
            onConfirm={() => handleDeleteExercise(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Exercise">
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
          <Title level={2}>Listening Comprehension Exercises</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setExerciseModalVisible(true)}
          >
            Create New Exercise
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={exercises}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
        />
      </Card>

      {/* Hidden audio element for table playback */}
      <audio
        ref={tableAudioRef}
        onEnded={handleTableAudioEnded}
        onError={handleTableAudioError}
        style={{ display: 'none' }}
      />

      {/* Exercise Creation/Edit Modal */}
      <Modal
        title={editingExercise ? 'Edit Listening Exercise' : 'Create New Listening Exercise'}
        open={exerciseModalVisible}
        onCancel={() => {
          setExerciseModalVisible(false);
          form.resetFields();
          setEditingExercise(null);
          setAudioFile(null);
          setQuestions([]);
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => {
            setExerciseModalVisible(false);
            form.resetFields();
            setEditingExercise(null);
            setAudioFile(null);
            setQuestions([]);
          }}>
            Cancel
          </Button>,
          <Button
            key="questions"
            onClick={() => setQuestionsModalVisible(true)}
          >
            Manage Questions ({questions.length})
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            {editingExercise ? 'Update Exercise' : 'Create Exercise'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateExercise}
          initialValues={{
            timeLimit: 30,
            playLimit: 3
          }}
        >
          <Form.Item
            name="title"
            label="Exercise Title"
            rules={[{ required: true, message: 'Please enter exercise title' }]}
          >
            <Input placeholder="e.g. Business Conversation - Part 1" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief description of the listening exercise..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="Course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select 
                  placeholder={coursesLoading ? "Loading courses..." : "Select course"}
                  showSearch
                  loading={coursesLoading}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  notFoundContent={coursesLoading ? "Loading..." : courses.length === 0 ? "No courses available" : "No matching courses"}
                >
                  {courses.map(course => (
                    <Option key={course._id} value={course._id}>
                      {course.title} {course.code ? `(${course.code})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select placeholder="Select level">
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="timeLimit" label="Time Limit (minutes)">
                <Select>
                  <Option value={15}>15 minutes</Option>
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>60 minutes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="playLimit" label="Audio Play Limit">
                <Select>
                  <Option value={1}>1 time</Option>
                  <Option value={2}>2 times</Option>
                  <Option value={3}>3 times</Option>
                  <Option value={5}>5 times</Option>
                  <Option value={-1}>Unlimited</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Audio File" required>
            <Dragger {...handleAudioUpload}>
              <p className="ant-upload-drag-icon">
                <AudioOutlined />
              </p>
              <p className="ant-upload-text">Click or drag audio file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for MP3, WAV, AAC files. Maximum file size: 30MB
              </p>
            </Dragger>
            {audioFile && (
              <Alert 
                message={`✅ Audio file ready: ${audioFile.name}`}
                description={`Size: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB | Type: ${audioFile.type || 'Unknown'}`}
                type="success" 
                style={{ marginTop: 8 }}
                showIcon 
                closable
                onClose={() => {
                  setAudioFile(null);
                  message.info('Audio file removed');
                }}
              />
            )}
            {!audioFile && (
              <Alert 
                message="No audio file selected"
                description="Please select an audio file to continue"
                type="warning" 
                style={{ marginTop: 8 }}
                showIcon 
              />
            )}
          </Form.Item>

          <Form.Item name="instructions" label="Instructions for Students">
            <TextArea rows={3} placeholder="Instructions for completing this exercise..." />
          </Form.Item>

          <Form.Item name="transcript" label="Audio Transcript (Optional)">
            <TextArea rows={4} placeholder="Full transcript of the audio for reference..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Questions Management Modal */}
      <Modal
        title="Manage Exercise Questions"
        open={questionsModalVisible}
        onCancel={() => setQuestionsModalVisible(false)}
        width={800}
        footer={null}
      >
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={addQuestion}
          initialValues={{
            points: 1
          }}
        >
          <Card title="Add New Question" style={{ marginBottom: 16 }}>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: 'Please enter the question' }]}
            >
              <TextArea rows={2} placeholder="Enter your question..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="type"
                  label="Question Type"
                  rules={[{ required: true, message: 'Please select question type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="multiple_choice">Multiple Choice</Option>
                    <Option value="fill_in_blank">Fill in the Blank</Option>
                    <Option value="short_answer">Short Answer</Option>
                    <Option value="true_false">True/False</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeStamp" label="Timestamp (seconds)">
                  <Input placeholder="e.g. 45" type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="points" label="Points">
                  <Input type="number" min={1} max={10} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            >
              {({ getFieldValue }) => {
                const questionType = getFieldValue('type');
                
                if (questionType === 'multiple_choice') {
                  return (
                    <Form.List name="options">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'text']}
                                rules={[{ required: true, message: 'Missing option text' }]}
                              >
                                <Input placeholder="Option text" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'isCorrect']}
                                valuePropName="checked"
                              >
                                <Button type={getFieldValue(['options', name, 'isCorrect']) ? 'primary' : 'default'}>
                                  Correct
                                </Button>
                              </Form.Item>
                              <Button onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Option
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  );
                }
                
                return (
                  <Form.Item name="correctAnswer" label="Correct Answer">
                    <Input placeholder="Enter the correct answer..." />
                  </Form.Item>
                );
              }}
            </Form.Item>

            <Form.Item name="explanation" label="Explanation (Optional)">
              <TextArea rows={2} placeholder="Explanation for the correct answer..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Add Question
              </Button>
            </Form.Item>
          </Card>
        </Form>

        {/* Questions List */}
        <Card title={`Questions (${questions.length})`}>
          {questions.length === 0 ? (
            <Alert message="No questions added yet" type="info" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={questions}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => removeQuestion(item.id)}
                      icon={<DeleteOutlined />}
                    >
                      Remove
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={`Question ${index + 1} ${item.timeStamp ? `(${item.timeStamp}s)` : ''}`}
                    description={
                      <div>
                        <Text>{item.question}</Text>
                        <br />
                        <Tag color="blue">{item.type?.replace('_', ' ')}</Tag>
                        {item.points && <Tag color="green">{item.points} points</Tag>}
                        {item.type === 'multiple_choice' && item.options && (
                          <div style={{ marginTop: 8 }}>
                            {item.options.map((option, i) => (
                              <div key={i}>
                                <Text type={option.isCorrect ? 'success' : 'secondary'}>
                                  {option.isCorrect ? '✓' : '○'} {option.text}
                                </Text>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Modal>

      {/* Exercise Preview Modal */}
      <Modal
        title={`Preview: ${selectedExercise?.title}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedExercise && (
          <div>
            {selectedExercise.audioFile && (
              <Card title="Audio Player" style={{ marginBottom: 16 }}>
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
                
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={playAudio}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                  </div>
                  
                  <div>
                    <Slider
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={seekAudio}
                      tipFormatter={(value) => formatTime(value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">{formatTime(currentTime)}</Text>
                      <Text type="secondary">{formatTime(duration)}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            )}
            
            <Card title="Exercise Information">
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Level: </Text>
                  <Tag color="blue">{selectedExercise.level}</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Time Limit: </Text>
                  <Text>{selectedExercise.timeLimit} minutes</Text>
                </Col>
              </Row>
              <br />
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Play Limit: </Text>
                  <Text>{selectedExercise.playLimit === -1 ? 'Unlimited' : `${selectedExercise.playLimit} times`}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Questions: </Text>
                  <Text>{selectedExercise.questions?.length || 0}</Text>
                </Col>
              </Row>
              {selectedExercise.instructions && (
                <>
                  <br />
                  <Text strong>Instructions:</Text>
                  <br />
                  <Text>{selectedExercise.instructions}</Text>
                </>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListeningExercises;

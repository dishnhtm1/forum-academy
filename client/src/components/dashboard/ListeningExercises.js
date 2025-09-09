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

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ListeningExercises = ({ currentUser }) => {
  const [exercises, setExercises] = useState([]);
  const [courses, setCourses] = useState([]);
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
  const audioRef = useRef(null);
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();

  useEffect(() => {
    fetchExercises();
    fetchCourses();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/listening-exercises', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      } else {
        message.error('Failed to fetch listening exercises');
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      message.error('Error fetching exercises');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateExercise = async (values) => {
    if (!audioFile) {
      message.error('Please upload an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', audioFile);
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

    try {
      const token = localStorage.getToken('token');
      const url = editingExercise ? `/api/listening-exercises/${editingExercise._id}` : '/api/listening-exercises';
      const method = editingExercise ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        message.success(`Exercise ${editingExercise ? 'updated' : 'created'} successfully`);
        setExerciseModalVisible(false);
        form.resetFields();
        setEditingExercise(null);
        setAudioFile(null);
        setQuestions([]);
        fetchExercises();
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to save exercise');
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
      message.error('Error saving exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listening-exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('Exercise deleted successfully');
        fetchExercises();
      } else {
        message.error('Failed to delete exercise');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      message.error('Error deleting exercise');
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
      const isAudio = file.type.startsWith('audio/');
      if (!isAudio) {
        message.error('You can only upload audio files!');
        return false;
      }
      
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('Audio file must be smaller than 50MB!');
        return false;
      }
      
      setAudioFile(file);
      return false;
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
          <Text>{courseTitle}</Text>
          <br />
          <Tag color="blue" size="small">{record.course.code}</Tag>
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
                <Select defaultValue={30}>
                  <Option value={15}>15 minutes</Option>
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>60 minutes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="playLimit" label="Audio Play Limit">
                <Select defaultValue={3}>
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
                Support for MP3, WAV, AAC files. Maximum file size: 50MB
              </p>
            </Dragger>
            {audioFile && (
              <Alert 
                message={`Selected: ${audioFile.name}`} 
                type="success" 
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
                  <Input type="number" min={1} max={10} defaultValue={1} />
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
                  src={`/api/listening-exercises/audio/${selectedExercise._id}`}
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

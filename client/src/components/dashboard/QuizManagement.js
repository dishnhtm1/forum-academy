import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Switch,
  InputNumber, List, Checkbox, Radio, Divider, Alert, Badge, Progress
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  PlayCircleOutlined, ClockCircleOutlined, BarChartOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuizManagement = ({ currentUser }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        message.error('Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      message.error('Error fetching quizzes');
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

  const fetchQuizSubmissions = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quiz-submissions/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleCreateQuiz = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const quizData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format() : null,
        availableFrom: values.availableFrom ? values.availableFrom.format() : new Date(),
        availableTo: values.availableTo ? values.availableTo.format() : null,
        createdBy: currentUser.id,
        questions: questions
      };

      const url = editingQuiz ? `/api/quizzes/${editingQuiz._id}` : '/api/quizzes';
      const method = editingQuiz ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
      });

      if (response.ok) {
        message.success(`Quiz ${editingQuiz ? 'updated' : 'created'} successfully`);
        setQuizModalVisible(false);
        form.resetFields();
        setEditingQuiz(null);
        setQuestions([]);
        fetchQuizzes();
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      message.error('Error saving quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('Quiz deleted successfully');
        fetchQuizzes();
      } else {
        message.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      message.error('Error deleting quiz');
    }
  };

  const addQuestion = () => {
    questionForm.validateFields().then(values => {
      const newQuestion = {
        id: Date.now(), // temporary ID
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

  const addOption = (form, fieldName) => {
    const options = form.getFieldValue(fieldName) || [];
    form.setFieldsValue({
      [fieldName]: [...options, { text: '', isCorrect: false }]
    });
  };

  const removeOption = (form, fieldName, index) => {
    const options = form.getFieldValue(fieldName) || [];
    form.setFieldsValue({
      [fieldName]: options.filter((_, i) => i !== index)
    });
  };

  const columns = [
    {
      title: 'Quiz Title',
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
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => (
        <Badge count={questions?.length || 0} style={{ backgroundColor: '#52c41a' }} />
      )
    },
    {
      title: 'Total Points',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (points) => <Text strong>{points}</Text>
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
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => date ? moment(date).format('MMM DD, YYYY HH:mm') : 'No due date'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const now = moment();
        const dueDate = record.dueDate ? moment(record.dueDate) : null;
        const availableFrom = moment(record.availableFrom);
        const availableTo = record.availableTo ? moment(record.availableTo) : null;
        
        if (!record.isPublished) {
          return <Tag color="gray">Draft</Tag>;
        }
        
        if (now.isBefore(availableFrom)) {
          return <Tag color="blue">Scheduled</Tag>;
        }
        
        if (availableTo && now.isAfter(availableTo)) {
          return <Tag color="red">Expired</Tag>;
        }
        
        if (dueDate && now.isAfter(dueDate)) {
          return <Tag color="orange">Past Due</Tag>;
        }
        
        return <Tag color="green">Active</Tag>;
      }
    },
    {
      title: 'Submissions',
      key: 'submissions',
      render: (_, record) => (
        <Button 
          size="small" 
          onClick={() => {
            setSelectedQuiz(record);
            fetchQuizSubmissions(record._id);
            setResultsModalVisible(true);
          }}
        >
          View Results
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Quiz">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => {
                setEditingQuiz(record);
                setQuestions(record.questions || []);
                form.setFieldsValue({
                  ...record,
                  dueDate: record.dueDate ? moment(record.dueDate) : null,
                  availableFrom: record.availableFrom ? moment(record.availableFrom) : null,
                  availableTo: record.availableTo ? moment(record.availableTo) : null
                });
                setQuizModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this quiz?"
            onConfirm={() => handleDeleteQuiz(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Quiz">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const submissionColumns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <Text>{record.student.firstName} {record.student.lastName}</Text>
          <br />
          <Text type="secondary">{record.student.email}</Text>
        </div>
      )
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.percentage} 
            format={() => `${record.score}/${selectedQuiz?.totalPoints}`}
            status={record.percentage >= (selectedQuiz?.passingScore || 70) ? 'success' : 'exception'}
          />
        </div>
      )
    },
    {
      title: 'Time Spent',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
      render: (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
    },
    {
      title: 'Attempt',
      dataIndex: 'attemptNumber',
      key: 'attemptNumber'
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => moment(date).format('MMM DD, YYYY HH:mm')
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const passed = record.percentage >= (selectedQuiz?.passingScore || 70);
        return (
          <Tag color={passed ? 'green' : 'red'}>
            {passed ? 'Passed' : 'Failed'}
          </Tag>
        );
      }
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Quiz Engine</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setQuizModalVisible(true)}
          >
            Create New Quiz
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={quizzes}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
        />
      </Card>

      {/* Quiz Creation/Edit Modal */}
      <Modal
        title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
        open={quizModalVisible}
        onCancel={() => {
          setQuizModalVisible(false);
          form.resetFields();
          setEditingQuiz(null);
          setQuestions([]);
        }}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => {
            setQuizModalVisible(false);
            form.resetFields();
            setEditingQuiz(null);
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
            {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuiz}
        >
          <Form.Item
            name="title"
            label="Quiz Title"
            rules={[{ required: true, message: 'Please enter quiz title' }]}
          >
            <Input placeholder="e.g. Chapter 1 Assessment" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Quiz description and instructions..." />
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
              <Form.Item name="timeLimit" label="Time Limit (minutes)">
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="attempts" label="Max Attempts">
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="passingScore" label="Passing Score (%)">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="showResults" label="Show Results">
                <Select>
                  <Option value="immediately">Immediately</Option>
                  <Option value="after_due_date">After Due Date</Option>
                  <Option value="never">Never</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="availableTo" label="Available Until">
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="shuffleQuestions" valuePropName="checked">
                <Switch /> Shuffle Questions
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="shuffleOptions" valuePropName="checked">
                <Switch /> Shuffle Options
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isPublished" valuePropName="checked">
                <Switch /> Published
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Questions Management Modal */}
      <Modal
        title="Manage Quiz Questions"
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
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Question Type"
                  rules={[{ required: true, message: 'Please select question type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="multiple_choice">Multiple Choice</Option>
                    <Option value="short_answer">Short Answer</Option>
                    <Option value="essay">Essay</Option>
                    <Option value="true_false">True/False</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="points" label="Points">
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
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
                                <Checkbox>Correct</Checkbox>
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
                
                if (questionType === 'true_false') {
                  return (
                    <Form.Item name="correctAnswer" label="Correct Answer">
                      <Radio.Group>
                        <Radio value="true">True</Radio>
                        <Radio value="false">False</Radio>
                      </Radio.Group>
                    </Form.Item>
                  );
                }
                
                if (questionType === 'short_answer' || questionType === 'essay') {
                  return (
                    <Form.Item name="correctAnswer" label="Sample Answer">
                      <TextArea rows={3} placeholder="Sample correct answer or keywords..." />
                    </Form.Item>
                  );
                }
                
                return null;
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
                    title={`Question ${index + 1} (${item.points || 1} points)`}
                    description={
                      <div>
                        <Text>{item.question}</Text>
                        <br />
                        <Tag color="blue">{item.type?.replace('_', ' ')}</Tag>
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

      {/* Quiz Results Modal */}
      <Modal
        title={`Quiz Results: ${selectedQuiz?.title}`}
        open={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setResultsModalVisible(false)}>
            Close
          </Button>,
          <Button key="export" type="primary" icon={<DownloadOutlined />}>
            Export Results
          </Button>
        ]}
      >
        <Table
          columns={submissionColumns}
          dataSource={submissions}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};

export default QuizManagement;

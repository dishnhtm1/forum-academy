import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space,
  Popconfirm, message, Tag, Tooltip, Row, Col, Typography, Switch,
  InputNumber, List, Checkbox, Radio, Divider, Alert, Badge, Progress
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  PlayCircleOutlined, ClockCircleOutlined, BarChartOutlined, DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { quizAPI, courseAPI } from '../../utils/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuizManagement = ({ currentUser }) => {
  console.log('🎯 QuizManagement component rendering, currentUser:', currentUser);
  
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
    console.log('🔄 QuizManagement component mounted');
    console.log('👤 Current user:', currentUser);
    console.log('📡 QuizAPI object:', quizAPI);
    
    if (currentUser) {
      console.log('✅ User exists, fetching quizzes...');
      fetchQuizzes();
      fetchCourses();
    } else {
      console.log('❌ No current user, waiting...');
    }
  }, [currentUser]);

  const fetchQuizzes = async () => {
    console.log('📝 Starting fetchQuizzes...');
    setLoading(true);
    try {
      console.log('🚀 Calling quizAPI.getAll()...');
      const data = await quizAPI.getAll();
      console.log('📝 Fetched quizzes:', data);
      console.log('📊 Quiz count:', data ? data.length : 'undefined');
      setQuizzes(data);
    } catch (error) {
      console.error('❌ Error fetching quizzes:', error);
      message.error('Error fetching quizzes: ' + error.message);
    } finally {
      setLoading(false);
      console.log('✅ fetchQuizzes completed');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getAll();
      console.log('📚 Fetched courses:', data);
      setCourses(data.courses || data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Error fetching courses: ' + error.message);
    }
  };

  const fetchQuizSubmissions = async (quizId) => {
    try {
      const data = await quizAPI.getSubmissions(quizId);
      console.log('📊 Fetched quiz submissions:', data);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      message.error('Error fetching submissions: ' + error.message);
    }
  };

  const handleCreateQuiz = async (values) => {
    try {
      console.log('🚀 Starting quiz creation process...');
      console.log('📝 Form values received:', values);
      console.log('❓ Questions to include:', questions);
      console.log('👤 Current user:', currentUser);

      const quizData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format() : null,
        availableFrom: values.availableFrom ? values.availableFrom.format() : new Date(),
        availableTo: values.availableTo ? values.availableTo.format() : null,
        createdBy: currentUser.id,
        questions: questions
      };

      console.log('📊 Final quiz data to send:', JSON.stringify(quizData, null, 2));

      let result;
      if (editingQuiz) {
        console.log('✏️ Updating existing quiz...');
        result = await quizAPI.update(editingQuiz._id, quizData);
      } else {
        console.log('🆕 Creating new quiz...');
        console.log('🌐 About to call quizAPI.create()...');
        result = await quizAPI.create(quizData);
        console.log('✅ API call completed, result:', result);
      }

      console.log('💾 Quiz saved successfully:', result);
      message.success(`Quiz ${editingQuiz ? 'updated' : 'created'} successfully`);
      
      // Close modal and reset form
      setQuizModalVisible(false);
      form.resetFields();
      setEditingQuiz(null);
      setQuestions([]);
      
      // Refresh the quiz list
      console.log('🔄 Refreshing quiz list...');
      await fetchQuizzes();
      console.log('✅ Quiz creation process completed');
      
    } catch (error) {
      console.error('❌ Error saving quiz:', error);
      console.error('❌ Error details:', error.stack);
      message.error('Error saving quiz: ' + error.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.delete(quizId);
      message.success('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      message.error('Error deleting quiz: ' + error.message);
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
          <Text>{courseTitle || 'No Course'}</Text>
          <br />
          <Tag color="blue" size="small">{record.course?.code || 'N/A'}</Tag>
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
          <Text>{record.student?.firstName || 'Unknown'} {record.student?.lastName || 'Student'}</Text>
          <br />
          <Text type="secondary">{record.student?.email || 'No email'}</Text>
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
      {/* Debug Info */}
      <div style={{ background: '#f0f2f5', padding: '8px', marginBottom: '16px', fontSize: '12px' }}>
        <strong>🔍 Debug Info:</strong> 
        Quizzes loaded: {quizzes?.length || 0} | 
        Loading: {loading ? 'Yes' : 'No'} | 
        Current User: {currentUser?.email || 'None'} |
        API Available: {typeof quizAPI !== 'undefined' ? 'Yes' : 'No'}
      </div>
      
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
                      {course.title} ({course.code || 'No Code'})
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

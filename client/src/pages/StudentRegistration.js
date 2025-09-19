import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Select, DatePicker, message, Row, Col, Typography, Steps
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, 
  BookOutlined, StarOutlined, CalendarOutlined, HomeOutlined,
  GlobalOutlined, FileTextOutlined, BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const StudentRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleRegistration = async (values) => {
    setLoading(true);
    try {
      const registrationData = {
        ...values,
        role: 'student',
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success('Student registration submitted successfully! Please wait for admin approval.');
        form.resetFields();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        message.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    form.validateFields(['firstName', 'lastName', 'email', 'password', 'confirmPassword'])
      .then(() => {
        setCurrentStep(1);
      })
      .catch((errorInfo) => {
        message.error('Please fill in all required fields correctly');
      });
  };

  const prevStep = () => {
    setCurrentStep(0);
  };

  const steps = [
    {
      title: 'Personal Information',
      description: 'Basic details and account setup'
    },
    {
      title: 'Academic Information',
      description: 'Study goals and current education level'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: '800px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderRadius: '15px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#2c3e50', marginBottom: '10px' }}>
            <StarOutlined style={{ marginRight: '10px', color: '#74b9ff' }} />
            Student Registration
          </Title>
          <Text type="secondary">Start your Japanese learning journey at Forum Academy</Text>
        </div>

        <Steps current={currentStep} style={{ marginBottom: '30px' }}>
          {steps.map((step, index) => (
            <Step 
              key={index}
              title={step.title} 
              description={step.description}
            />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegistration}
          scrollToFirstError
        >
          {currentStep === 0 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter first name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter last name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter email address"
                  size="large"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter your password' },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Enter password"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Confirm password"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter phone number"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select your date of birth' }]}
                  >
                    <DatePicker 
                      prefix={<CalendarOutlined />}
                      placeholder="Select date of birth"
                      size="large"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Button 
                  type="primary" 
                  onClick={nextStep}
                  size="large"
                  style={{ minWidth: '120px' }}
                >
                  Next Step
                </Button>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nationality"
                    label="Nationality"
                    rules={[{ required: true, message: 'Please enter your nationality' }]}
                  >
                    <Input 
                      prefix={<GlobalOutlined />} 
                      placeholder="Enter nationality"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="japaneseLevel"
                    label="Current Japanese Level"
                    rules={[{ required: true, message: 'Please select your Japanese level' }]}
                  >
                    <Select 
                      placeholder="Select your current level"
                      size="large"
                    >
                      <Option value="beginner">Beginner (No prior knowledge)</Option>
                      <Option value="elementary">Elementary (Basic phrases and vocabulary)</Option>
                      <Option value="intermediate">Intermediate (Can hold simple conversations)</Option>
                      <Option value="advanced">Advanced (Fluent in most situations)</Option>
                      <Option value="native">Native/Near Native</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="currentEducation"
                label="Current Education Level"
                rules={[{ required: true, message: 'Please enter your current education level' }]}
              >
                <Select 
                  placeholder="Select your current education level"
                  size="large"
                >
                  <Option value="high-school">High School Student</Option>
                  <Option value="high-school-graduate">High School Graduate</Option>
                  <Option value="university-student">University Student</Option>
                  <Option value="university-graduate">University Graduate</Option>
                  <Option value="masters">Master's Degree</Option>
                  <Option value="phd">PhD/Doctorate</Option>
                  <Option value="working-professional">Working Professional</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="studyGoals"
                label="Study Goals"
                rules={[{ required: true, message: 'Please describe your study goals' }]}
              >
                <TextArea 
                  placeholder="What do you hope to achieve by studying Japanese? (e.g., travel, work, JLPT exam, cultural interest...)"
                  rows={3}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <Input 
                  prefix={<HomeOutlined />} 
                  placeholder="Enter your current address"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="bio"
                label="Tell us about yourself"
              >
                <TextArea 
                  placeholder="Share anything else you'd like us to know about your background, interests, or motivation for learning Japanese..."
                  rows={4}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '30px' 
              }}>
                <Button 
                  onClick={prevStep}
                  size="large"
                  style={{ minWidth: '120px' }}
                >
                  Previous
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  style={{ minWidth: '120px' }}
                  icon={<BulbOutlined />}
                >
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Text type="secondary">
            Already have an account? <a href="/login">Login here</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default StudentRegistration;
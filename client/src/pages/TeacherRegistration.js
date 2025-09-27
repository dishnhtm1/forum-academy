import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Select, DatePicker, message, Row, Col, Typography, Steps
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, 
  BookOutlined, TrophyOutlined, CalendarOutlined, HomeOutlined,
  GlobalOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const TeacherRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleRegistration = async (values) => {
    setLoading(true);
    try {
      const registrationData = {
        ...values,
        role: 'teacher',
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
        message.success('Teacher registration submitted successfully! Please wait for admin approval.');
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
      title: 'Professional Information',
      description: 'Teaching qualifications and experience'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <TrophyOutlined style={{ marginRight: '10px', color: '#f39c12' }} />
            Teacher Registration
          </Title>
          <Text type="secondary">Join our teaching community at Forum Academy</Text>
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
                    name="specialization"
                    label="Teaching Specialization"
                    rules={[{ required: true, message: 'Please select your specialization' }]}
                  >
                    <Select 
                      placeholder="Select specialization"
                      size="large"
                    >
                      <Option value="japanese-language">Japanese Language</Option>
                      <Option value="japanese-culture">Japanese Culture</Option>
                      <Option value="business-japanese">Business Japanese</Option>
                      <Option value="jlpt-preparation">JLPT Preparation</Option>
                      <Option value="conversational-japanese">Conversational Japanese</Option>
                      <Option value="japanese-writing">Japanese Writing (Hiragana/Katakana/Kanji)</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="qualifications"
                label="Educational Qualifications"
                rules={[{ required: true, message: 'Please describe your qualifications' }]}
              >
                <TextArea 
                  placeholder="Please describe your educational background, degrees, certifications..."
                  rows={3}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Teaching Experience"
                rules={[{ required: true, message: 'Please describe your teaching experience' }]}
              >
                <TextArea 
                  placeholder="Please describe your teaching experience, years of experience, previous positions..."
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
                label="Personal Statement"
              >
                <TextArea 
                  placeholder="Tell us about yourself, your teaching philosophy, and why you want to join Forum Academy..."
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
                  icon={<BookOutlined />}
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

export default TeacherRegistration;
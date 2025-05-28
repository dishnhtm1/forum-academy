import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const history = useHistory();

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Handle animation timing for modal appearance
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Initialize animated background elements
  useEffect(() => {
    if (isVisible) {
      const createAnimatedElements = () => {
        const overlay = document.querySelector('.register-modal-overlay');
        if (!overlay) return;
        
        // Clear existing elements
        const existingElements = overlay.querySelectorAll('.animated-element');
        existingElements.forEach(el => el.remove());
        
        // Create floating shapes
        const shapes = ['circle', 'hexagon', 'triangle', 'diamond'];
        const count = window.innerWidth > 768 ? 8 : 5;
        
        for (let i = 0; i < count; i++) {
          const element = document.createElement('div');
          element.className = `animated-element ${shapes[i % shapes.length]}`;
          
          const size = Math.random() * 100 + 50;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const duration = Math.random() * 25 + 20;
          const delay = Math.random() * 8;
          
          element.style.width = `${size}px`;
          element.style.height = `${size}px`;
          element.style.left = `${posX}%`;
          element.style.top = `${posY}%`;
          element.style.animationDuration = `${duration}s`;
          element.style.animationDelay = `${delay}s`;
          
          overlay.appendChild(element);
        }
      };
      
      createAnimatedElements();
      window.addEventListener('resize', createAnimatedElements);
      
      return () => {
        window.removeEventListener('resize', createAnimatedElements);
      };
    }
  }, [isVisible]);

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
      });
      setError('');
      setSuccess(false);
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all fields to continue.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address to continue.');
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: 'student'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setSuccess(true);
      
      // After successful registration
      setTimeout(() => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', data.role || 'student');
          localStorage.setItem('userEmail', formData.email);
          history.push('/dashboard');
        } else {
          onClose();
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="material-icons input-icon">person</span>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input modern"
                  placeholder="First Name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="material-icons input-icon">person_outline</span>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input modern"
                  placeholder="Last Name"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="material-icons input-icon">email</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input modern"
                  placeholder="Email Address"
                />
              </div>
            </div>
            
            <div className="student-info-box">
              <div className="info-icon">
                <span className="material-icons">school</span>
              </div>
              <div className="info-content">
                <h4>Student Registration</h4>
                <p>You are registering as a <strong>Student</strong>. Teacher and Admin accounts must be created by system administrators.</p>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="material-icons input-icon">lock</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input modern"
                  placeholder="Password (min 6 characters)"
                  minLength="6"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="material-icons input-icon">lock_outline</span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input modern"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`register-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className="register-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-glass-effect"></div>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close registration modal">
          <span className="material-icons">close</span>
        </button>
        
        <div className="register-modal-content">
          <div className="register-form-container">
            {!success ? (
              <>
                <div className="register-header">
                  <div className="register-logo">
                    <div className="ring-container">
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="logo-text">FORUM ACADEMY</div>
                    </div>
                  </div>
                  <h2>Create Student Account</h2>
                  <p>Join our learning community today</p>
                </div>

                <div className="stepper">
                  <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-number">
                      {currentStep > 1 ? <span className="material-icons">check</span> : '1'}
                    </div>
                    <div className="step-label">Personal</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-number">
                      {currentStep > 2 ? <span className="material-icons">check</span> : '2'}
                    </div>
                    <div className="step-label">Account</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Security</div>
                  </div>
                </div>

                {error && (
                  <div className="form-error modern">
                    <span className="material-icons">error_outline</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="register-form" onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
                  <div className="form-steps-container">
                    {renderStep()}
                  </div>

                  <div className="form-navigation">
                    {currentStep > 1 && (
                      <button 
                        type="button"
                        className="btn-prev modern"
                        onClick={prevStep}
                      >
                        <span className="material-icons">arrow_back</span>
                        Back
                      </button>
                    )}
                    
                    {currentStep < 3 ? (
                      <button 
                        type="button"
                        className="btn-next modern"
                        onClick={nextStep}
                      >
                        Next
                        <span className="material-icons">arrow_forward</span>
                      </button>
                    ) : (
                      <button 
                        type="submit"
                        className={`btn-submit modern ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="button-loader"></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <span className="material-icons">person_add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">
                  <span className="material-icons">check_circle</span>
                </div>
                <h3>Registration Successful!</h3>
                <p>Your student account has been created successfully. Welcome to Forum Academy!</p>
                <div className="success-loader"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
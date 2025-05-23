import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/RegisterPage.css'; // We'll create this file

const RegisterPage = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
    // Animate form in after component mounts
    setTimeout(() => setFormVisible(true), 100);
    
    // Create animated background elements
    const createAnimatedShapes = () => {
      const container = document.querySelector('.register-background');
      if (!container) return;
      
      // Clear existing shapes
      const existingShapes = container.querySelectorAll('.animated-shape');
      existingShapes.forEach(shape => shape.remove());
      
      // Create more shapes for a dense 3D effect
      const shapeCount = window.innerWidth > 768 ? 12 : 6;
      
      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.className = 'animated-shape';
        
        // Randomize appearance and animation with more 3D variation
        const size = Math.random() * 180 + 40;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const posZ = Math.random() * 200 - 100; // Add Z-position for 3D effect
        const duration = Math.random() * 25 + 15;
        const delay = Math.random() * 8;
        const opacity = Math.random() * 0.5 + 0.1;
        const rotation = Math.random() * 360;
        
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${posX}%`;
        shape.style.top = `${posY}%`;
        shape.style.transform = `translateZ(${posZ}px) rotate(${rotation}deg)`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.opacity = opacity;
        
        // Add custom properties for different shape types
        const shapeType = Math.floor(Math.random() * 5);
        
        if (shapeType === 0) {
          // Circle
          shape.style.borderRadius = '50%';
        } else if (shapeType === 1) {
          // Rounded square
          shape.style.borderRadius = '30%';
        } else if (shapeType === 2) {
          // Pentagon - using clip-path
          shape.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
        } else if (shapeType === 3) {
          // Diamond
          shape.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        } else {
          // Triangle
          shape.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
        }
        
        // Add a subtle glow to some shapes
        if (Math.random() > 0.7) {
          shape.style.boxShadow = '0 0 20px 5px rgba(0, 123, 255, 0.2)';
        }
        
        container.appendChild(shape);
      }
    };
      
    // Create floating text elements
    const createFloatingText = () => {
      const container = document.querySelector('.register-background');
      if (!container) return;
      
      // Clear existing floating text
      const existingText = container.querySelectorAll('.floating-text');
      existingText.forEach(text => text.remove());
      
      // Tech-related words to float in the background
      const words = ['Innovation', 'Technology', 'Future', 'Code', 'Connect', 'Network', 'Digital', 'Learn', 'Create', 'Develop'];
      
      // Create floating text elements
      for (let i = 0; i < 6; i++) {
        const textElement = document.createElement('div');
        textElement.className = 'floating-text';
        textElement.textContent = words[i % words.length];
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const posZ = Math.random() * -300 - 100;
        const opacity = Math.random() * 0.08 + 0.02;
        const scale = Math.random() * 0.5 + 0.5;
        const rotation = Math.random() * 360;
        
        textElement.style.left = `${posX}%`;
        textElement.style.top = `${posY}%`;
        textElement.style.transform = `translateZ(${posZ}px) rotateX(${rotation}deg) rotateY(${rotation}deg) scale(${scale})`;
        textElement.style.opacity = opacity;
        
        container.appendChild(textElement);
      }
    };
    
    // Add 3D perspective effect on mouse movement
    const handleMouseMove = (e) => {
      const container = document.querySelector('.register-container');
      if (!container) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const tiltAmount = 3; // How much to tilt
      const tiltX = (y - 0.5) * tiltAmount;
      const tiltY = (x - 0.5) * -tiltAmount;
      
      container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    
    // Call all initialization functions
    createAnimatedShapes();
    createFloatingText();
    
    // Set up event listeners
    window.addEventListener('resize', createAnimatedShapes);
    window.addEventListener('resize', createFloatingText);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', createAnimatedShapes);
      window.removeEventListener('resize', createFloatingText);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.registerUser(formData);
      setSuccess(true);
      
      // After successful registration, redirect to home and show login modal after 2 seconds
      setTimeout(() => {
        if (onRegisterSuccess) {
          history.push('/');
          onRegisterSuccess();
        } else {
          history.push('/login');
        }
      }, 2500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <h3 className="step-title">Personal Details</h3>
            <div className="form-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-control"
                placeholder=" "
              />
              <label htmlFor="firstName">First Name</label>
              <div className="form-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="form-control"
                placeholder=" "
              />
              <label htmlFor="lastName">Last Name</label>
              <div className="form-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/>
                </svg>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="step-title">Account Details</h3>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder=" "
              />
              <label htmlFor="email">Email Address</label>
              <div className="form-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="step-title">Secure Your Account</h3>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
              <div className="form-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-control"
                placeholder=" "
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="form-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <div className="register-background">
        {/* Animated shapes will be added by useEffect */}
      </div>
      
      <div className={`register-container ${formVisible ? 'visible' : ''}`}>
        <div className="glass-effect"></div>
        
        <div className="register-content">
          <h2 className="register-title">Join Our Community</h2>
          
          {!success ? (
            <>
              <div className="stepper">
                <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Personal</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Contact</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Security</div>
                </div>
              </div>
              
              {error && (
                <div className="error-message">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
                <div className="form-steps-container">
                  <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                    {currentStep === 1 && renderStep()}
                  </div>
                  <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                    {currentStep === 2 && renderStep()}
                  </div>
                  <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                    {currentStep === 3 && renderStep()}
                  </div>
                </div>
                
                <div className="form-navigation">
                  {currentStep > 1 && (
                    <button 
                      type="button"
                      className="btn-prev"
                      onClick={prevStep}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                      Back
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button 
                      type="button"
                      className="btn-next"
                      onClick={nextStep}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className={`btn-submit ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner"></span>
                      ) : (
                        <>
                          Register
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                          </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3>Registration Successful!</h3>
              <p>Your account has been created. Redirecting to login...</p>
              <div className="loader"></div>
            </div>
          )}
          
          <div className="login-link">
            Already have an account? <a href="#" onClick={(e) => {
              e.preventDefault();
              history.push('/');
              if (onRegisterSuccess) onRegisterSuccess();
            }}>Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
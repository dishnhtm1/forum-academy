import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/RegisterPage.css';

const RegisterPage = ({ isOpen, onClose, onRegisterSuccess }) => {
  const { t } = useTranslation(); // Add this line only
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
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Keep ALL your existing useEffect code exactly as is
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

  // Keep ALL your existing animated background elements code exactly as is
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

  // Keep ALL your existing form handling exactly as is
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError(t('register.errors.fillAllFields'));
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(t('register.errors.validEmail'));
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
      setError(t('register.errors.passwordsNoMatch'));
      return;
    }
    
    if (formData.password.length < 6) {
      setError(t('register.errors.passwordLength'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
        throw new Error(data.message || t('register.errors.registrationFailed'));
      }
      
      setSuccess(true);
      
      // ✅ CHANGED: Don't auto-login anymore, just show success message
      setTimeout(() => {
        onClose(); // Close the modal
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || t('register.errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   // Validation
  //   if (formData.password !== formData.confirmPassword) {
  //     setError(t('register.errors.passwordsNoMatch'));
  //     return;
  //   }
    
  //   if (formData.password.length < 6) {
  //     setError(t('register.errors.passwordLength'));
  //     return;
  //   }
    
  //   setLoading(true);
  //   setError('');
    
  //   try {

  //     const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         email: formData.email,
  //         password: formData.password,
  //         role: 'student'
  //       })
  //     });

  //     const data = await response.json();
      
  //     if (!response.ok) {
  //       throw new Error(data.message || t('register.errors.registrationFailed'));
  //     }
      
  //     setSuccess(true);
      
  //     // After successful registration
  //     setTimeout(() => {
  //       if (data.token) {
  //         localStorage.setItem('authToken', data.token);
  //         localStorage.setItem('userRole', data.role || 'student');
  //         localStorage.setItem('userEmail', formData.email);
  //         history.push('/dashboard');
  //       } else {
  //         onClose();
  //         if (onRegisterSuccess) {
  //           onRegisterSuccess();
  //         }
  //       }
  //     }, 3000);
      
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     setError(error.message || t('register.errors.registrationFailed'));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Keep ALL your existing renderStep logic - only replace text
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
                  placeholder={t('register.form.firstName')}
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
                  placeholder={t('register.form.lastName')}
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
                  placeholder={t('register.form.email')}
                />
              </div>
            </div>
            
            <div className="student-info-box">
              <div className="info-icon">
                <span className="material-icons">school</span>
              </div>
              <div className="info-content">
                <h4>{t('register.studentInfo.title')}</h4>
                <p>{t('register.studentInfo.description')}</p>
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
                  placeholder={t('register.form.password')}
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
                  placeholder={t('register.form.confirmPassword')}
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
        
        <button className="modal-close-btn" onClick={onClose} aria-label={t('register.closeModal')}>
          <span className="material-icons">close</span>
        </button>
        
        <div className="register-modal-content">
          <div className="register-form-container">
            {!success ? (
              <>
                <div className="register-header">
                  <div className="register-logo">
                    {/* Keep ALL your animated rings design exactly as is */}
                    <div className="ring-container">
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="ring"></div>
                      <div className="logo-text">FORUM ACADEMY</div>
                    </div>
                  </div>
                  <h2>{t('register.header.title')}</h2>
                  <p>{t('register.header.subtitle')}</p>
                </div>

                {/* Keep ALL your stepper design exactly as is - only replace text */}
                <div className="stepper">
                  <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-number">
                      {currentStep > 1 ? <span className="material-icons">check</span> : '1'}
                    </div>
                    <div className="step-label">{t('register.steps.personal')}</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-number">
                      {currentStep > 2 ? <span className="material-icons">check</span> : '2'}
                    </div>
                    <div className="step-label">{t('register.steps.account')}</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">{t('register.steps.security')}</div>
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
                        {t('register.navigation.back')}
                      </button>
                    )}
                    
                    {currentStep < 3 ? (
                      <button 
                        type="button"
                        className="btn-next modern"
                        onClick={nextStep}
                      >
                        {t('register.navigation.next')}
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
                            {t('register.form.creatingAccount')}
                          </>
                        ) : (
                          <>
                            {t('register.form.createAccount')}
                            <span className="material-icons">person_add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              // <div className="success-message">
              //   <div className="success-icon">
              //     <span className="material-icons">check_circle</span>
              //   </div>
              //   <h3>{t('register.success.title')}</h3>
              //   <p>{t('register.success.message')}</p>
              //   <div className="success-loader"></div>
              // </div>
              <div className="success-message">
                <div className="success-icon">
                  <span className="material-icons">pending</span>
                </div>
                <h3>{t('register.success.pendingTitle')}</h3>
                <p>{t('register.success.pendingMessage')}</p>
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
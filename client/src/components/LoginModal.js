import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
        // Add these missing state variables for forgot password functionality
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState('')
    const history = useHistory();
    // Fixed API base URL - removed /api from here since we'll add it in the fetc mbingjuhvygtbfdzSXxqw XCVBJNKLM;,./'

    const API_BASE_URL = process.env.REACT_APP_API_URL ;
    const token = localStorage.getItem("token");

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
                const overlay = document.querySelector('.login-modal-overlay');
                if (!overlay) return;
                
                // Clear existing elements
                const existingElements = overlay.querySelectorAll('.animated-element');
                existingElements.forEach(el => el.remove());
                
                // Create floating shapes
                const shapes = ['circle', 'hexagon', 'triangle'];
                const count = window.innerWidth > 768 ? 6 : 4;
                
                for (let i = 0; i < count; i++) {
                    const element = document.createElement('div');
                    element.className = `animated-element ${shapes[i % shapes.length]}`;
                    
                    const size = Math.random() * 80 + 40;
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    const duration = Math.random() * 20 + 15;
                    const delay = Math.random() * 5;
                    
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

       // Add forgot password handler
    // const handleForgotPassword = async (e) => {
    //     e.preventDefault();
    //     setForgotError('');
    //     setForgotMessage('');
    //     setForgotLoading(true);

    //     try {
    //         const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ email: forgotEmail })
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             throw new Error(data.message || 'Failed to send reset email');
    //         }

    //         setForgotMessage('Password reset email sent successfully! Please check your inbox.');
    //         setTimeout(() => {
    //             setShowForgotPassword(false);
    //             setForgotEmail('');
    //             setForgotMessage('');
    //         }, 3000);

    //     } catch (error) {
    //         console.error('Forgot password error:', error);
    //         setForgotError(error.message || 'Failed to send reset email. Please try again.');
    //     } finally {
    //         setForgotLoading(false);
    //     }
    // };

    // // Clear forgot password form when modal closes
    // useEffect(() => {
    //     if (!isOpen) {
    //         setEmail('');
    //         setPassword('');
    //         setFormError('');
    //         setShowForgotPassword(false);
    //         setForgotEmail('');
    //         setForgotMessage('');
    //         setForgotError('');
    //     }
    // }, [isOpen]);
        // ...existing code...
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotMessage('');
        setForgotLoading(true);
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgotEmail })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }
    
            setForgotMessage('OTP sent successfully! Redirecting...');
            
            // Navigate to OTP verification page
            setTimeout(() => {
                history.push('/verify-otp', { 
                    email: forgotEmail 
                });
                onClose(); // Close the modal
            }, 1500);
    
        } catch (error) {
            console.error('Forgot password error:', error);
            setForgotError(error.message || 'Service temporarily unavailable. Please contact support.');
        } finally {
            setForgotLoading(false);
        }
    };
    // ...existing code...

    // Updated handleLogin function with proper API endpoint
    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsLoading(true);
        
        try {
            // Fixed: Add /api prefix to match your server routes
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response. Check if the API endpoint exists.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || t('login.errors.loginFailed'));
            }
            
            // Store authentication data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role || data.user?.role);
            localStorage.setItem('userEmail', data.user?.email || email);
            localStorage.setItem('userName', `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim());
            localStorage.setItem('userId', data.user?.id);
            
            // Close modal
            onClose();
            
            // Redirect to unified dashboard
            history.push('/dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Better error handling for different types of errors
            let errorMessage = t('login.errors.invalidCredentials');
            
            if (error.message.includes('non-JSON response')) {
                errorMessage = 'Server error. Please check if the backend is running properly.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to server. Please check your internet connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setFormError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setFormError('');
        }
    }, [isOpen]);

    return (
        <div className={`login-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-glass-effect"></div>
                
                <button className="modal-close-btn" onClick={onClose} aria-label={t('login.closeModal')}>
                    <span className="material-icons">close</span>
                </button>
                
                <div className="login-modal-content">
                    <div className="login-form-container">
                        {!showForgotPassword ? (
                            <>
                                {/* Existing login form */}
                                <div className="login-header">
                                    <div className="login-logo">
                                        <div className="ring-container">
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="logo-text">FORUM ACADEMY</div>
                                        </div>
                                    </div>
                                    <h2>{t('login.header.title')}</h2>
                                    <p>{t('login.header.subtitle')}</p>
                                </div>
                                
                                {formError && (
                                    <div className="form-error modern">
                                        <span className="material-icons">error_outline</span>
                                        <span>{formError}</span>
                                    </div>
                                )}
                                
                                <form className="login-form" onSubmit={handleLogin}>
                                    {/* Existing form fields */}
                                    <div className="form-group">
                                        <div className="input-wrapper">
                                            <span className="material-icons input-icon">email</span>
                                            <input
                                                type="email"
                                                id="login-modal-email"
                                                placeholder={t('login.form.emailPlaceholder')}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="form-input modern"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <div className="input-wrapper">
                                            <span className="material-icons input-icon">lock</span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="login-modal-password"
                                                placeholder={t('login.form.passwordPlaceholder')}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="form-input modern"
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex="-1"
                                                aria-label={showPassword ? t('login.form.hidePassword') : t('login.form.showPassword')}
                                            >
                                                <span className="material-icons">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="form-options modern">
                                        <label className="custom-checkbox modern">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                            />
                                            <span className="checkbox-mark"></span>
                                            <span className="checkbox-label">{t('login.form.rememberMe')}</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="forgot-link"
                                            onClick={() => setShowForgotPassword(true)}
                                        >
                                            {t('login.form.forgotPassword')}
                                        </button>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className={`login-button modern ${isLoading ? '' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="button-loader"></span>
                                                <span>{t('login.form.signingIn')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('login.form.signIn')}</span>
                                                <span className="material-icons button-icon">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {/* Register section */}
                                    <div className="register-section">
                                        <div className="divider">
                                            <span>{t('login.register.newToPlatform')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="register-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onRegisterClick();
                                            }}
                                        >
                                            <span className="material-icons">person_add</span>
                                            <span>{t('login.register.createAccount')}</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* Forgot Password Form */
                            <>
                                <div className="login-header">
                                    <div className="login-logo">
                                        <div className="ring-container">
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="logo-text">FORUM ACADEMY</div>
                                        </div>
                                    </div>
                                    <h2>Reset Password</h2>
                                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                                </div>

                                {forgotError && (
                                    <div className="form-error modern">
                                        <span className="material-icons">error_outline</span>
                                        <span>{forgotError}</span>
                                    </div>
                                )}

                                {forgotMessage && (
                                    <div className="form-success modern">
                                        <span className="material-icons">check_circle</span>
                                        <span>{forgotMessage}</span>
                                    </div>
                                )}

                                <form className="login-form" onSubmit={handleForgotPassword}>
                                    <div className="form-group">
                                        <div className="input-wrapper">
                                            <span className="material-icons input-icon">email</span>
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                required
                                                className="form-input modern"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={`login-button modern ${forgotLoading ? 'loading' : ''}`}
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <span className="button-loader"></span>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Reset Email</span>
                                                <span className="material-icons button-icon">send</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="back-to-login"
                                        onClick={() => setShowForgotPassword(false)}
                                    >
                                        <span className="material-icons">arrow_back</span>
                                        Back to Login
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default LoginModal;
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const { t } = useTranslation(); // Add this line only
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    // API base URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

    // Keep ALL your existing handleLogin function exactly as is
    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsLoading(true);
        
        try {
            // Single login endpoint without specifying role
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                    // Remove role from request - let backend determine user's role
                })
            });

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
            
            // Redirect to unified dashboard - role-based view will be handled there
            history.push('/dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            setFormError(error.message || t('login.errors.invalidCredentials'));
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
                        <div className="login-header">
                            <div className="login-logo">
                                {/* Keep ALL your animated rings design exactly as is */}
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
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <span className="material-icons input-icon">email</span>
                                    {/* <input
                                        type="email"
                                        id="email"
                                        placeholder={t('login.form.emailPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="form-input modern"
                                    /> */}
                                    <input
                                        type="email"
                                        id="login-email"  // CHANGE from "email" to "login-email"
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
                                        id="password"
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
                                <a href="#" className="forgot-link">{t('login.form.forgotPassword')}</a>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`login-button modern ${isLoading ? 'loading' : ''}`}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
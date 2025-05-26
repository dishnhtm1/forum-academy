// // // LoginModal.js
// // import React, { useState, useEffect } from 'react';
// // import { useHistory } from 'react-router-dom';
// // import '../styles/LoginModal.css';

// // const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
// //     const [activeRole, setActiveRole] = useState('student');
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [rememberMe, setRememberMe] = useState(false);
// //     const [isVisible, setIsVisible] = useState(false);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [formError, setFormError] = useState('');
// //     const [showPassword, setShowPassword] = useState(false);
// //     const history = useHistory();

// //     // API base URL
// //     const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// //     // Role configurations
// //     const roles = {
// //         student: {
// //             title: 'Student Portal',
// //             subtitle: 'Access your courses and assignments',
// //             icon: 'school',
// //             color: '#3b82f6',
// //             gradientFrom: '#3b82f6',
// //             gradientTo: '#2563eb'
// //         },
// //         teacher: {
// //             title: 'Teacher Portal',
// //             subtitle: 'Manage your classes and students',
// //             icon: 'person_outline',
// //             color: '#10b981',
// //             gradientFrom: '#10b981',
// //             gradientTo: '#059669'
// //         },
// //         admin: {
// //             title: 'Admin Portal',
// //             subtitle: 'System administration access',
// //             icon: 'admin_panel_settings',
// //             color: '#8b5cf6',
// //             gradientFrom: '#8b5cf6',
// //             gradientTo: '#7c3aed'
// //         }
// //     };

// //     const currentRole = roles[activeRole];
    
// //     // Handle animation timing for modal appearance
// //     useEffect(() => {
// //         if (isOpen) {
// //             document.body.style.overflow = 'hidden';
// //             requestAnimationFrame(() => {
// //                 setIsVisible(true);
// //             });
// //         } else {
// //             setIsVisible(false);
// //             document.body.style.overflow = 'auto';
// //         }
        
// //         return () => {
// //             document.body.style.overflow = 'auto';
// //         };
// //     }, [isOpen]);

// //     // Close modal on escape key
// //     useEffect(() => {
// //         const handleEsc = (event) => {
// //             if (event.keyCode === 27) onClose();
// //         };
// //         window.addEventListener('keydown', handleEsc);
        
// //         return () => {
// //             window.removeEventListener('keydown', handleEsc);
// //         };
// //     }, [onClose]);

// //     // Initialize animated background elements
// //     useEffect(() => {
// //         if (isVisible) {
// //             const createAnimatedElements = () => {
// //                 const overlay = document.querySelector('.login-modal-overlay');
// //                 if (!overlay) return;
                
// //                 // Clear existing elements
// //                 const existingElements = overlay.querySelectorAll('.animated-element');
// //                 existingElements.forEach(el => el.remove());
                
// //                 // Create floating shapes
// //                 const shapes = ['circle', 'hexagon', 'triangle'];
// //                 const count = window.innerWidth > 768 ? 6 : 4;
                
// //                 for (let i = 0; i < count; i++) {
// //                     const element = document.createElement('div');
// //                     element.className = `animated-element ${shapes[i % shapes.length]}`;
                    
// //                     const size = Math.random() * 80 + 40;
// //                     const posX = Math.random() * 100;
// //                     const posY = Math.random() * 100;
// //                     const duration = Math.random() * 20 + 15;
// //                     const delay = Math.random() * 5;
                    
// //                     element.style.width = `${size}px`;
// //                     element.style.height = `${size}px`;
// //                     element.style.left = `${posX}%`;
// //                     element.style.top = `${posY}%`;
// //                     element.style.animationDuration = `${duration}s`;
// //                     element.style.animationDelay = `${delay}s`;
                    
// //                     overlay.appendChild(element);
// //                 }
// //             };
            
// //             createAnimatedElements();
// //             window.addEventListener('resize', createAnimatedElements);
            
// //             return () => {
// //                 window.removeEventListener('resize', createAnimatedElements);
// //             };
// //         }
// //     }, [isVisible]);

// //     const handleLogin = async (e) => {
// //         e.preventDefault();
// //         setFormError('');
// //         setIsLoading(true);
        
// //         try {
// //             const response = await fetch(`${API_BASE_URL}/auth/login`, {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify({
// //                     email,
// //                     password,
// //                     role: activeRole
// //                 })
// //             });

// //             const data = await response.json();
            
// //             if (!response.ok) {
// //                 throw new Error(data.message || 'Login failed');
// //             }
            
// //             // Store authentication data
// //             localStorage.setItem('authToken', data.token);
// //             localStorage.setItem('userRole', data.role);
// //             localStorage.setItem('userEmail', email);
            
// //             // Close modal
// //             onClose();
            
// //             // Redirect to dashboard based on role
// //             const dashboardPath = `/${data.role}/dashboard`;
// //             history.push(dashboardPath);
            
// //         } catch (error) {
// //             console.error('Login error:', error);
// //             setFormError(error.message || 'Invalid credentials. Please try again.');
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const handleRoleChange = (role) => {
// //         setActiveRole(role);
// //         setFormError('');
// //         // Clear form when switching roles
// //         setEmail('');
// //         setPassword('');
// //     };

// //     // Clear form when modal closes
// //     useEffect(() => {
// //         if (!isOpen) {
// //             setEmail('');
// //             setPassword('');
// //             setFormError('');
// //             setActiveRole('student');
// //         }
// //     }, [isOpen]);

// //     return (
// //         <div className={`login-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
// //             <div className="login-modal" onClick={e => e.stopPropagation()}>
// //                 <div className="modal-glass-effect"></div>
                
// //                 <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
// //                     <span className="material-icons">close</span>
// //                 </button>
                
// //                 <div className="login-modal-content">
// //                     {/* Role Selector */}
// //                     <div className="role-selector">
// //                         {Object.entries(roles).map(([key, role]) => (
// //                             <button
// //                                 key={key}
// //                                 className={`role-tab ${activeRole === key ? 'active' : ''}`}
// //                                 onClick={() => handleRoleChange(key)}
// //                                 style={{
// //                                     '--role-color': role.color,
// //                                     '--role-gradient-from': role.gradientFrom,
// //                                     '--role-gradient-to': role.gradientTo
// //                                 }}
// //                             >
// //                                 <span className="material-icons">{role.icon}</span>
// //                                 <span className="role-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
// //                             </button>
// //                         ))}
// //                     </div>

// //                     <div className="login-form-container">
// //                         {/* Dynamic Header based on role */}
// //                         <div className="login-header" style={{
// //                             '--header-gradient-from': currentRole.gradientFrom,
// //                             '--header-gradient-to': currentRole.gradientTo
// //                         }}>
// //                             <div className="login-icon-wrapper">
// //                                 <div className="login-icon-bg"></div>
// //                                 <span className="material-icons login-icon">{currentRole.icon}</span>
// //                             </div>
// //                             <h2>{currentRole.title}</h2>
// //                             <p>{currentRole.subtitle}</p>
// //                         </div>
                        
// //                         {formError && (
// //                             <div className="form-error modern">
// //                                 <span className="material-icons">error_outline</span>
// //                                 <span>{formError}</span>
// //                             </div>
// //                         )}
                        
// //                         <form className="login-form" onSubmit={handleLogin}>
// //                             <div className="form-group">
// //                                 <div className="input-wrapper">
// //                                     <span className="material-icons input-icon">email</span>
// //                                     <input
// //                                         type="email"
// //                                         id="email"
// //                                         placeholder="Email Address"
// //                                         value={email}
// //                                         onChange={(e) => setEmail(e.target.value)}
// //                                         required
// //                                         className="form-input modern"
// //                                     />
// //                                     <label htmlFor="email" className="floating-label">Email Address</label>
// //                                 </div>
// //                             </div>
                            
// //                             <div className="form-group">
// //                                 <div className="input-wrapper">
// //                                     <span className="material-icons input-icon">lock</span>
// //                                     <input
// //                                         type={showPassword ? "text" : "password"}
// //                                         id="password"
// //                                         placeholder="Password"
// //                                         value={password}
// //                                         onChange={(e) => setPassword(e.target.value)}
// //                                         required
// //                                         className="form-input modern"
// //                                     />
// //                                     <label htmlFor="password" className="floating-label">Password</label>
// //                                     <button
// //                                         type="button"
// //                                         className="toggle-password"
// //                                         onClick={() => setShowPassword(!showPassword)}
// //                                         tabIndex="-1"
// //                                     >
// //                                         <span className="material-icons">
// //                                             {showPassword ? 'visibility_off' : 'visibility'}
// //                                         </span>
// //                                     </button>
// //                                 </div>
// //                             </div>
                            
// //                             <div className="form-options modern">
// //                                 <label className="custom-checkbox modern">
// //                                     <input
// //                                         type="checkbox"
// //                                         checked={rememberMe}
// //                                         onChange={() => setRememberMe(!rememberMe)}
// //                                     />
// //                                     <span className="checkbox-mark"></span>
// //                                     <span className="checkbox-label">Remember me</span>
// //                                 </label>
// //                                 <a href="#" className="forgot-link">Forgot password?</a>
// //                             </div>
                            
// //                             <button 
// //                                 type="submit" 
// //                                 className={`login-button modern ${isLoading ? 'loading' : ''}`}
// //                                 disabled={isLoading}
// //                                 style={{
// //                                     '--button-gradient-from': currentRole.gradientFrom,
// //                                     '--button-gradient-to': currentRole.gradientTo
// //                                 }}
// //                             >
// //                                 {isLoading ? (
// //                                     <>
// //                                         <span className="button-loader"></span>
// //                                         <span>Signing in...</span>
// //                                     </>
// //                                 ) : (
// //                                     <>
// //                                         <span>Sign In</span>
// //                                         <span className="material-icons button-icon">arrow_forward</span>
// //                                     </>
// //                                 )}
// //                             </button>
                            
// //                             {/* Only show register link for students */}
// //                             {activeRole === 'student' && (
// //                                 <div className="register-section">
// //                                     <div className="divider">
// //                                         <span>New to our platform?</span>
// //                                     </div>
// //                                     <button
// //                                         type="button"
// //                                         className="register-button"
// //                                         onClick={(e) => {
// //                                             e.preventDefault();
// //                                             onRegisterClick();
// //                                         }}
// //                                     >
// //                                         <span className="material-icons">person_add</span>
// //                                         <span>Create Student Account</span>
// //                                     </button>
// //                                 </div>
// //                             )}

// //                             {/* Info for non-student roles */}
// //                             {activeRole !== 'student' && (
// //                                 <div className="info-message">
// //                                     <span className="material-icons">info</span>
// //                                     <p>{activeRole === 'admin' ? 'Admin' : 'Teacher'} accounts must be created by system administrators.</p>
// //                                 </div>
// //                             )}
// //                         </form>
                        
// //                         {/* Demo Credentials */}
// //                         <div className="demo-credentials">
// //                             <h4>Test Credentials</h4>
// //                             <div className="credential-item">
// //                                 <span className="role-badge student">Student</span>
// //                                 <code>Use register to create account</code>
// //                             </div>
// //                             <div className="credential-item">
// //                                 <span className="role-badge teacher">Teacher</span>
// //                                 <code>Contact admin for access</code>
// //                             </div>
// //                             <div className="credential-item">
// //                                 <span className="role-badge admin">Admin</span>
// //                                 <code>Created during setup</code>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default LoginModal;

// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import '../styles/LoginPage.css'; // Create this file or adapt your RegisterPage styles

// const LoginPage = ({ onLoginSuccess }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const history = useHistory();

//     // API base URL
//     const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//     const handleChange = (e) => {
//         setFormData({
//         ...formData,
//         [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validate
//         if (!formData.email || !formData.password) {
//         setError('All fields are required');
//         return;
//         }
        
//         setLoading(true);
//         setError('');
        
//         try {
//         const response = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//             email: formData.email,
//             password: formData.password
//             })
//         });

//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.message || 'Login failed');
//         }
        
//         // Store auth data
//         localStorage.setItem('authToken', data.token);
//         localStorage.setItem('userRole', data.user.role);
//         localStorage.setItem('userEmail', data.user.email);
//         localStorage.setItem('userName', `${data.user.firstName || ''} ${data.user.lastName || ''}`);
//         localStorage.setItem('userId', data.user.id);
        
//         // Callback if provided
//         if (onLoginSuccess) {
//             onLoginSuccess(data.user);
//         }
        
//         // Redirect to appropriate dashboard based on role
//         const redirectPath = data.user.role === 'admin' 
//             ? '/admin/dashboard' 
//             : data.user.role === 'teacher'
//             ? '/teacher/dashboard'
//             : '/student/dashboard';
            
//         history.push(redirectPath);
        
//         } catch (error) {
//         console.error('Login error:', error);
        
//         // Handle specific errors
//         if (error.message === 'Account not approved yet') {
//             setError('Your account is pending approval by an administrator.');
//         } else {
//             setError(error.message || 'Login failed. Please check your credentials.');
//         }
//         } finally {
//         setLoading(false);
//         }
//     };

//     return (
//         <div className="login-page">
//         <div className="login-form-container">
//             <h2>Log In to Your Account</h2>
            
//             {error && (
//             <div className="error-message">
//                 <span className="material-icons">error_outline</span>
//                 <span>{error}</span>
//             </div>
//             )}
            
//             <form onSubmit={handleSubmit}>
//             <div className="form-group">
//                 <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//                 />
//                 <label htmlFor="email">Email Address</label>
//                 <div className="form-icon">
//                 <span className="material-icons">email</span>
//                 </div>
//             </div>
            
//             <div className="form-group">
//                 <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//                 />
//                 <label htmlFor="password">Password</label>
//                 <div className="form-icon">
//                 <span className="material-icons">lock</span>
//                 </div>
//             </div>
            
//             <div className="form-options">
//                 <div className="remember-me">
//                 <input type="checkbox" id="remember" name="remember" />
//                 <label htmlFor="remember">Remember me</label>
//                 </div>
//                 <a href="/forgot-password" className="forgot-link">Forgot password?</a>
//             </div>
            
//             <button 
//                 type="submit"
//                 className={`btn-login ${loading ? 'loading' : ''}`}
//                 disabled={loading}
//             >
//                 {loading ? (
//                 <>
//                     <span className="spinner"></span>
//                     <span>Logging in...</span>
//                 </>
//                 ) : (
//                 <>
//                     <span>Log In</span>
//                     <span className="material-icons">arrow_forward</span>
//                 </>
//                 )}
//             </button>
//             </form>
            
//             <div className="register-link">
//             <p>Don't have an account? <a href="/register">Register</a></p>
//             </div>
//         </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const [activeRole, setActiveRole] = useState('student');
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

    // Role configurations
    const roles = {
        student: {
            title: 'Student Portal',
            subtitle: 'Access your courses and assignments',
            icon: 'school',
            color: '#3b82f6',
            gradientFrom: '#3b82f6',
            gradientTo: '#2563eb'
        },
        teacher: {
            title: 'Teacher Portal',
            subtitle: 'Manage your classes and students',
            icon: 'person_outline',
            color: '#10b981',
            gradientFrom: '#10b981',
            gradientTo: '#059669'
        },
        admin: {
            title: 'Admin Portal',
            subtitle: 'System administration access',
            icon: 'admin_panel_settings',
            color: '#8b5cf6',
            gradientFrom: '#8b5cf6',
            gradientTo: '#7c3aed'
        }
    };

    const currentRole = roles[activeRole];
    
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: activeRole
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store authentication data - match what Dashboard expects
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role); // Dashboard expects 'userRole'
            localStorage.setItem('userEmail', email);
            
            // Close modal
            onClose();
            
            // Redirect to dashboard - unified dashboard for all roles
            history.push('/dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            setFormError(error.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = (role) => {
        setActiveRole(role);
        setFormError('');
        // Clear form when switching roles
        setEmail('');
        setPassword('');
    };

    // Clear form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setFormError('');
            setActiveRole('student');
        }
    }, [isOpen]);

    return (
        <div className={`login-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-glass-effect"></div>
                
                <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
                    <span className="material-icons">close</span>
                </button>
                
                <div className="login-modal-content">
                    {/* Role Selector */}
                    <div className="role-selector">
                        {Object.entries(roles).map(([key, role]) => (
                            <button
                                key={key}
                                className={`role-tab ${activeRole === key ? 'active' : ''}`}
                                onClick={() => handleRoleChange(key)}
                                style={{
                                    '--role-color': role.color,
                                    '--role-gradient-from': role.gradientFrom,
                                    '--role-gradient-to': role.gradientTo
                                }}
                            >
                                <span className="material-icons">{role.icon}</span>
                                <span className="role-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="login-form-container">
                        {/* Dynamic Header based on role */}
                        <div className="login-header" style={{
                            '--header-gradient-from': currentRole.gradientFrom,
                            '--header-gradient-to': currentRole.gradientTo
                        }}>
                            <div className="login-icon-wrapper">
                                <div className="login-icon-bg"></div>
                                <span className="material-icons login-icon">{currentRole.icon}</span>
                            </div>
                            <h2>{currentRole.title}</h2>
                            <p>{currentRole.subtitle}</p>
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
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="form-input modern"
                                    />
                                    <label htmlFor="email" className="floating-label">Email Address</label>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <span className="material-icons input-icon">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="form-input modern"
                                    />
                                    <label htmlFor="password" className="floating-label">Password</label>
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
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
                                    <span className="checkbox-label">Remember me</span>
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`login-button modern ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                                style={{
                                    '--button-gradient-from': currentRole.gradientFrom,
                                    '--button-gradient-to': currentRole.gradientTo
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="button-loader"></span>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <span className="material-icons button-icon">arrow_forward</span>
                                    </>
                                )}
                            </button>
                            
                            {/* Only show register link for students */}
                            {activeRole === 'student' && (
                                <div className="register-section">
                                    <div className="divider">
                                        <span>New to our platform?</span>
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
                                        <span>Create Student Account</span>
                                    </button>
                                </div>
                            )}

                            {/* Info for non-student roles */}
                            {activeRole !== 'student' && (
                                <div className="info-message">
                                    <span className="material-icons">info</span>
                                    <p>{activeRole === 'admin' ? 'Admin' : 'Teacher'} accounts must be created by system administrators.</p>
                                </div>
                            )}
                        </form>
                        
                        {/* Demo Credentials */}
                        <div className="demo-credentials">
                            <h4>Test Credentials</h4>
                            <div className="credential-item">
                                <span className="role-badge student">Student</span>
                                <code>Register new account or use existing</code>
                            </div>
                            <div className="credential-item">
                                <span className="role-badge teacher">Teacher</span>
                                <code>Contact admin for access</code>
                            </div>
                            <div className="credential-item">
                                <span className="role-badge admin">Admin</span>
                                <code>Created during setup</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
// import React, { useState, useEffect } from 'react';
// import '../styles/LoginModal.css';

// const LoginModal = ({ isOpen, onClose }) => {
//     const [isStudent, setIsStudent] = useState(true);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [rememberMe, setRememberMe] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [formError, setFormError] = useState('');
    
//     // Handle animation timing for modal appearance
//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//             requestAnimationFrame(() => {
//                 setIsVisible(true);
//             });
//         } else {
//             setIsVisible(false);
//             document.body.style.overflow = 'auto';
//         }
        
//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [isOpen]);

//     // Close modal on escape key
//     useEffect(() => {
//         const handleEsc = (event) => {
//             if (event.keyCode === 27) onClose();
//         };
//         window.addEventListener('keydown', handleEsc);
        
//         return () => {
//             window.removeEventListener('keydown', handleEsc);
//         };
//     }, [onClose]);

//     // Initialize animated background elements
//     useEffect(() => {
//         if (isVisible) {
//             const createAnimatedBlobs = () => {
//                 const overlay = document.querySelector('.login-modal-overlay');
//                 if (!overlay) return;
                
//                 // Clear existing blobs
//                 const existingBlobs = overlay.querySelectorAll('.animated-blob');
//                 existingBlobs.forEach(blob => blob.remove());
                
//                 // Create new blobs
//                 const blobCount = window.innerWidth > 768 ? 5 : 3;
                
//                 for (let i = 0; i < blobCount; i++) {
//                     const blob = document.createElement('div');
//                     blob.className = 'animated-blob';
                    
//                     // Randomize size, position and animation
//                     const size = Math.random() * 300 + 100;
//                     const posX = Math.random() * 100;
//                     const posY = Math.random() * 100;
//                     const duration = Math.random() * 20 + 10;
//                     const delay = Math.random() * 5;
                    
//                     blob.style.width = `${size}px`;
//                     blob.style.height = `${size}px`;
//                     blob.style.left = `${posX}%`;
//                     blob.style.top = `${posY}%`;
//                     blob.style.animationDuration = `${duration}s`;
//                     blob.style.animationDelay = `${delay}s`;
                    
//                     overlay.appendChild(blob);
//                 }
//             };
            
//             createAnimatedBlobs();
//             window.addEventListener('resize', createAnimatedBlobs);
            
//             return () => {
//                 window.removeEventListener('resize', createAnimatedBlobs);
//             };
//         }
//     }, [isVisible]);

//     const handleLogin = (e) => {
//         e.preventDefault();
//         setFormError('');
//         setIsLoading(true);
        
//         // Simulate login request
//         setTimeout(() => {
//             if (email.includes('@') && password.length >= 6) {
//                 // Success - would actually redirect in real app
//                 onClose();
//             } else {
//                 setFormError('Invalid email or password. Please try again.');
//             }
//             setIsLoading(false);
//         }, 1500);
//     };

//     return (
//         <div className={`login-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
//             {/* Animated background blobs will be added here by useEffect */}
            
//             <div className="login-modal" onClick={e => e.stopPropagation()}>
//                 <div className="modal-glass-effect"></div>
                
//                 <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//                     </svg>
//                 </button>
                
//                 <div className="login-modal-content">
//                     <div className="login-form-container">
//                         <div className="login-header">
//                             <div className="login-user-icon">
//                                 {isStudent ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                         <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                         <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
//                                     </svg>
//                                 )}
//                             </div>
//                             <h2>{isStudent ? 'Student Portal' : 'Faculty Portal'}</h2>
//                             <p>Sign in with your credentials</p>
//                         </div>
                        
//                         <div className="login-tabs">
//                             <button 
//                                 className={`login-tab ${isStudent ? 'active' : ''}`} 
//                                 onClick={() => setIsStudent(true)}
//                             >
//                                 Student
//                             </button>
//                             <button 
//                                 className={`login-tab ${!isStudent ? 'active' : ''}`} 
//                                 onClick={() => setIsStudent(false)}
//                             >
//                                 Faculty
//                             </button>
//                             <div className="tab-indicator" style={{ left: isStudent ? '0' : '50%' }}></div>
//                         </div>
                        
//                         {formError && (
//                             <div className="form-error">
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
//                                 </svg>
//                                 {formError}
//                             </div>
//                         )}
                        
//                         <form className="login-form" onSubmit={handleLogin}>
//                             <div className="form-floating">
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     placeholder=" "
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="form-input"
//                                 />
//                                 <label htmlFor="email" className="form-label">Email Address</label>
//                                 <div className="input-icon">
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                         <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                                     </svg>
//                                 </div>
//                             </div>
                            
//                             <div className="form-floating">
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     placeholder=" "
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="form-input"
//                                 />
//                                 <label htmlFor="password" className="form-label">Password</label>
//                                 <div className="input-icon">
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                         <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
//                                     </svg>
//                                 </div>
//                             </div>
                            
//                             <div className="form-options">
//                                 <div className="checkbox-wrapper">
//                                     <input
//                                         type="checkbox"
//                                         id="remember"
//                                         checked={rememberMe}
//                                         onChange={() => setRememberMe(!rememberMe)}
//                                         className="custom-checkbox"
//                                     />
//                                     <label htmlFor="remember" className="checkbox-label">
//                                         <span className="checkbox-custom"></span>
//                                         Remember me
//                                     </label>
//                                 </div>
//                                 <a href="#" className="forgot-password">Forgot password?</a>
//                             </div>
                            
//                             <button 
//                                 type="submit" 
//                                 className={`login-button ${isLoading ? 'loading' : ''}`}
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? (
//                                     <span className="button-loader"></span>
//                                 ) : (
//                                     <>
//                                         <span>Sign In</span>
//                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                             <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
//                                         </svg>
//                                     </>
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginModal;

import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const [isStudent, setIsStudent] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    
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
            const createAnimatedBlobs = () => {
                const overlay = document.querySelector('.login-modal-overlay');
                if (!overlay) return;
                
                // Clear existing blobs
                const existingBlobs = overlay.querySelectorAll('.animated-blob');
                existingBlobs.forEach(blob => blob.remove());
                
                // Create new blobs
                const blobCount = window.innerWidth > 768 ? 5 : 3;
                
                for (let i = 0; i < blobCount; i++) {
                    const blob = document.createElement('div');
                    blob.className = 'animated-blob';
                    
                    // Randomize size, position and animation
                    const size = Math.random() * 300 + 100;
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    const duration = Math.random() * 20 + 10;
                    const delay = Math.random() * 5;
                    
                    blob.style.width = `${size}px`;
                    blob.style.height = `${size}px`;
                    blob.style.left = `${posX}%`;
                    blob.style.top = `${posY}%`;
                    blob.style.animationDuration = `${duration}s`;
                    blob.style.animationDelay = `${delay}s`;
                    
                    overlay.appendChild(blob);
                }
            };
            
            createAnimatedBlobs();
            window.addEventListener('resize', createAnimatedBlobs);
            
            return () => {
                window.removeEventListener('resize', createAnimatedBlobs);
            };
        }
    }, [isVisible]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsLoading(true);
        
        try {
            await api.loginUser({ email, password });
            
            // Success - redirect to dashboard based on user type
            window.location.href = isStudent ? '/student/dashboard' : '/faculty/dashboard';
        } catch (error) {
            setFormError(error.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`login-modal-overlay ${isOpen ? 'active' : ''} ${isVisible ? 'visible' : ''}`} onClick={onClose}>
            {/* Animated background blobs will be added here by useEffect */}
            
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-glass-effect"></div>
                
                <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                
                <div className="login-modal-content">
                    <div className="login-form-container">
                        <div className="login-header">
                            <div className="login-user-icon">
                                {isStudent ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                                    </svg>
                                )}
                            </div>
                            <h2>{isStudent ? 'Student Portal' : 'Faculty Portal'}</h2>
                            <p>Sign in with your credentials</p>
                        </div>
                        
                        <div className="login-tabs">
                            <button 
                                className={`login-tab ${isStudent ? 'active' : ''}`} 
                                onClick={() => setIsStudent(true)}
                            >
                                Student
                            </button>
                            <button 
                                className={`login-tab ${!isStudent ? 'active' : ''}`} 
                                onClick={() => setIsStudent(false)}
                            >
                                Faculty
                            </button>
                            <div className="tab-indicator" style={{ left: isStudent ? '0' : '50%' }}></div>
                        </div>
                        
                        {formError && (
                            <div className="form-error">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                {formError}
                            </div>
                        )}
                        
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-floating">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="form-floating">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder=" "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="form-options">
                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor="remember" className="checkbox-label">
                                        <span className="checkbox-custom"></span>
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`login-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="button-loader"></span>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                            
                            <div className="register-link">
                                <p>Don't have an account? <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    onRegisterClick();
                                }}>Register now</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
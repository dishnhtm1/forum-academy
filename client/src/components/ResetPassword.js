// import React, { useState, useEffect } from 'react';
// import { useHistory, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// const ResetPassword = () => {
//     const { t } = useTranslation();
//     const history = useHistory();
//     const location = useLocation();
//     const [formData, setFormData] = useState({
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [showPassword, setShowPassword] = useState({
//         new: false,
//         confirm: false
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState({
//         score: 0,
//         text: '',
//         color: ''
//     });

//     const email = location.state?.email || '';
//     const resetToken = location.state?.token || '';
//     const API_BASE_URL = process.env.REACT_APP_API_URL;

//     // Password strength checker
//     const checkPasswordStrength = (password) => {
//         let score = 0;
//         let text = '';
//         let color = '';

//         if (password.length === 0) {
//             return { score: 0, text: '', color: '' };
//         }

//         // Length check
//         if (password.length >= 8) score += 1;
//         if (password.length >= 12) score += 1;

//         // Character variety checks
//         if (/[a-z]/.test(password)) score += 1;
//         if (/[A-Z]/.test(password)) score += 1;
//         if (/\d/.test(password)) score += 1;
//         if (/[^A-Za-z0-9]/.test(password)) score += 1;

//         // Determine strength
//         if (score < 3) {
//             text = 'Weak';
//             color = 'text-red-500';
//         } else if (score < 5) {
//             text = 'Medium';
//             color = 'text-yellow-500';
//         } else {
//             text = 'Strong';
//             color = 'text-green-500';
//         }

//         return { score, text, color };
//     };

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Check password strength for new password
//         if (name === 'newPassword') {
//             setPasswordStrength(checkPasswordStrength(value));
//         }

//         // Clear errors when user starts typing
//         if (error) setError('');
//     };

//     // Handle form submission
//     const handleResetPassword = async (e) => {
//         e.preventDefault();
//         setError('');

//         // Validation
//         if (formData.newPassword.length < 8) {
//             setError('Password must be at least 8 characters long');
//             return;
//         }

//         if (formData.newPassword !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         if (passwordStrength.score < 3) {
//             setError('Please choose a stronger password');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     email,
//                     token: resetToken,
//                     newPassword: formData.newPassword
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to reset password');
//             }

//             setSuccess('Password reset successfully! Redirecting to login...');
            
//             // Redirect to login after success
//             setTimeout(() => {
//                 history.push('/', { resetSuccess: true });
//             }, 2000);

//         } catch (error) {
//             console.error('Reset password error:', error);
//             setError(error.message || 'Failed to reset password. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Redirect if no email or token
//     useEffect(() => {
//         if (!email || !resetToken) {
//             history.push('/');
//         }
//     }, [email, resetToken, history]);

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
//             {/* Animated Background Elements */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute top-20 left-20 w-32 h-32 bg-gray-200/30 rounded-full animate-pulse"></div>
//                 <div className="absolute top-40 right-32 w-24 h-24 bg-gray-300/30 rounded-full animate-bounce delay-75"></div>
//                 <div className="absolute bottom-32 left-40 w-40 h-40 bg-gray-100/30 rounded-full animate-pulse delay-150"></div>
//                 <div className="absolute bottom-20 right-20 w-28 h-28 bg-gray-200/30 rounded-full animate-bounce delay-300"></div>
                
//                 {/* Geometric Shapes */}
//                 <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-gray-300/30 rotate-45 animate-spin-slow"></div>
//                 <div className="absolute top-3/4 right-1/4 w-12 h-12 border-2 border-gray-400/30 rotate-12 animate-pulse"></div>
//             </div>

//             {/* Main Container */}
//             <div className="relative w-full max-w-md mx-4">
//                 {/* White Glass Effect Card */}
//                 <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
//                     <div className="p-8">
//                         {/* Header with Ring Animation */}
//                         <div className="text-center mb-8">
//                             {/* Ring Container */}
//                             <div style={ringStyles.ringContainer}>
//                                 <div style={{...ringStyles.ring, ...ringStyles.ring1}}></div>
//                                 <div style={{...ringStyles.ring, ...ringStyles.ring2}}></div>
//                                 <div style={{...ringStyles.ring, ...ringStyles.ring3}}></div>
//                                 <div style={{...ringStyles.ring, ...ringStyles.ring4}}></div>
//                                 <div style={ringStyles.logoText}>FORUM ACADEMY</div>
//                             </div>
                            
//                             <h2 className="text-3xl font-bold text-gray-800 mb-2">
//                                 Reset Password
//                             </h2>
//                             <p className="text-gray-600 mb-2">
//                                 Create a new password for your account
//                             </p>
//                             <p className="text-blue-600 font-medium text-sm">
//                                 {email}
//                             </p>
//                         </div>

//                         {/* Error Message */}
//                         {error && (
//                             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700">
//                                 <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                                 <span className="text-sm">{error}</span>
//                             </div>
//                         )}

//                         {/* Success Message */}
//                         {success && (
//                             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 text-green-700">
//                                 <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                 </svg>
//                                 <span className="text-sm">{success}</span>
//                             </div>
//                         )}

//                         {/* Reset Password Form */}
//                         <form onSubmit={handleResetPassword} className="space-y-6">
//                             {/* New Password Field */}
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">
//                                     New Password
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                         <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                         </svg>
//                                     </div>
//                                     <input
//                                         type={showPassword.new ? "text" : "password"}
//                                         name="newPassword"
//                                         value={formData.newPassword}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
//                                         placeholder="Enter new password"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
//                                         className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             {showPassword.new ? (
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12l2.122-2.122m0 0l1.414-1.414M21 12c-1.274-4.057-5.064-7-9.543-7-.847 0-1.669.097-2.454.282" />
//                                             ) : (
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             )}
//                                         </svg>
//                                     </button>
//                                 </div>
                                
//                                 {/* Password Strength Indicator */}
//                                 {formData.newPassword && (
//                                     <div className="mt-2">
//                                         <div className="flex items-center justify-between mb-1">
//                                             <span className="text-xs text-gray-500">Password strength:</span>
//                                             <span className={`text-xs font-medium ${passwordStrength.color}`}>
//                                                 {passwordStrength.text}
//                                             </span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className={`h-2 rounded-full transition-all duration-300 ${
//                                                     passwordStrength.score < 3 ? 'bg-red-500' :
//                                                     passwordStrength.score < 5 ? 'bg-yellow-500' : 'bg-green-500'
//                                                 }`}
//                                                 style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Confirm Password Field */}
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">
//                                     Confirm Password
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                         <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                     <input
//                                         type={showPassword.confirm ? "text" : "password"}
//                                         name="confirmPassword"
//                                         value={formData.confirmPassword}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
//                                         placeholder="Confirm new password"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
//                                         className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             {showPassword.confirm ? (
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12l2.122-2.122m0 0l1.414-1.414M21 12c-1.274-4.057-5.064-7-9.543-7-.847 0-1.669.097-2.454.282" />
//                                             ) : (
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             )}
//                                         </svg>
//                                     </button>
//                                 </div>
                                
//                                 {/* Password Match Indicator */}
//                                 {formData.confirmPassword && (
//                                     <div className="mt-2 flex items-center space-x-2">
//                                         {formData.newPassword === formData.confirmPassword ? (
//                                             <>
//                                                 <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                 </svg>
//                                                 <span className="text-xs text-green-600">Passwords match</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                 </svg>
//                                                 <span className="text-xs text-red-600">Passwords don't match</span>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Password Requirements */}
//                             <div className="bg-gray-50 rounded-xl p-4">
//                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
//                                 <ul className="text-xs text-gray-600 space-y-1">
//                                     <li className="flex items-center space-x-2">
//                                         <span className={formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}>✓</span>
//                                         <span>At least 8 characters</span>
//                                     </li>
//                                     <li className="flex items-center space-x-2">
//                                         <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}>✓</span>
//                                         <span>One uppercase letter</span>
//                                     </li>
//                                     <li className="flex items-center space-x-2">
//                                         <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}>✓</span>
//                                         <span>One lowercase letter</span>
//                                     </li>
//                                     <li className="flex items-center space-x-2">
//                                         <span className={/\d/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}>✓</span>
//                                         <span>One number</span>
//                                     </li>
//                                     <li className="flex items-center space-x-2">
//                                         <span className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}>✓</span>
//                                         <span>One special character</span>
//                                     </li>
//                                 </ul>
//                             </div>

//                             {/* Reset Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
//                                 className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         <span>Resetting...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <span>Reset Password</span>
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </>
//                                 )}
//                             </button>

//                             {/* Back to Login */}
//                             <div className="text-center">
//                                 <button
//                                     type="button"
//                                     onClick={() => history.push('/')}
//                                     className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-1 mx-auto"
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                                     </svg>
//                                     <span>Back to Login</span>
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             {/* CSS Animations */}
//             <style>{`
//                 @keyframes rotate1 {
//                     from { transform: rotateX(50deg) rotateZ(110deg); }
//                     to { transform: rotateX(50deg) rotateZ(470deg); }
//                 }

//                 @keyframes rotate2 {
//                     from { transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg); }
//                     to { transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg); }
//                 }

//                 @keyframes rotate3 {
//                     from { transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg); }
//                     to { transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg); }
//                 }

//                 @keyframes rotate4 {
//                     from { transform: rotateX(70deg) rotateZ(270deg); }
//                     to { transform: rotateX(70deg) rotateZ(630deg); }
//                 }

//                 @keyframes spin-slow {
//                     from { transform: rotate(0deg); }
//                     to { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// // Ring styles - same as other components
// const ringStyles = {
//     ringContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         width: '120px',
//         height: '120px',
//         margin: '0 auto 20px auto',
//         perspective: '800px'
//     },
    
//     ring: {
//         width: '120px',
//         height: '120px',
//         border: '1px solid transparent',
//         borderRadius: '50%',
//         position: 'absolute'
//     },
    
//     ring1: {
//         borderBottom: '6px solid rgb(255, 141, 249)',
//         animation: 'rotate1 2s linear infinite'
//     },
    
//     ring2: {
//         borderBottom: '6px solid rgb(255, 65, 106)',
//         animation: 'rotate2 2s linear infinite'
//     },
    
//     ring3: {
//         borderBottom: '6px solid rgb(0, 255, 255)',
//         animation: 'rotate3 2s linear infinite'
//     },
    
//     ring4: {
//         borderBottom: '6px solid rgb(252, 183, 55)',
//         animation: 'rotate4 2s linear infinite'
//     },
    
//     logoText: {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         fontSize: '12px',
//         fontWeight: 700,
//         letterSpacing: '1px',
//         textAlign: 'center',
//         width: '100%',
//         color: '#334155',
//         textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
//         WebkitBackgroundClip: 'text',
//         backgroundClip: 'text',
//         WebkitTextFillColor: 'transparent',
//         margin: 0
//     }
// };

// export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const history = useHistory();
    const location = useLocation();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const email = location.state?.email || '';

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            history.push('/');
        }
    }, [email, history]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    // Handle form submission
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Add your API call here
            setSuccess('Password reset successfully! Redirecting to login...');
            
            setTimeout(() => {
                history.push('/');
            }, 2000);

        } catch (error) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Reset Password
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Create a new password for your account
                            </p>
                            <p className="text-blue-600 font-medium text-sm">
                                {email}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50"
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => history.push('/')}
                                    className="text-sm text-gray-500 hover:text-blue-600"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
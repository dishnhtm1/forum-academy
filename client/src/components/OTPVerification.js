// import React, { useState, useEffect, useRef } from 'react';
// import { useHistory, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// const OTPVerification = () => {
//     const { t } = useTranslation();
//     const history = useHistory();
//     const location = useLocation();
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
//     const [canResend, setCanResend] = useState(false);
//     const [resendLoading, setResendLoading] = useState(false);
//     const inputRefs = useRef([]);

//     const email = location.state?.email || '';
//     const API_BASE_URL = process.env.REACT_APP_API_URL;

//     // Timer countdown
//     useEffect(() => {
//         if (timeLeft > 0) {
//             const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//             return () => clearTimeout(timer);
//         } else {
//             setCanResend(true);
//         }
//     }, [timeLeft]);

//     // Handle OTP input change
//     const handleOtpChange = (index, value) => {
//         if (value.length > 1) return; // Prevent multiple characters
        
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         // Auto-focus next input
//         if (value && index < 5) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };

//     // Handle backspace
//     const handleKeyDown = (index, e) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         }
//     };

//     // Handle paste
//     const handlePaste = (e) => {
//         e.preventDefault();
//         const pastedData = e.clipboardData.getData('text').slice(0, 6);
//         const newOtp = [...otp];
        
//         for (let i = 0; i < pastedData.length && i < 6; i++) {
//             if (/^\d$/.test(pastedData[i])) {
//                 newOtp[i] = pastedData[i];
//             }
//         }
        
//         setOtp(newOtp);
        
//         // Focus the next empty input or the last one
//         const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
//         const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
//         inputRefs.current[focusIndex]?.focus();
//     };

//     // Verify OTP
//     const handleVerifyOTP = async (e) => {
//         e.preventDefault();
//         const otpString = otp.join('');
        
//         if (otpString.length !== 6) {
//             setError('Please enter all 6 digits');
//             return;
//         }

//         setIsLoading(true);
//         setError('');

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     email,
//                     otp: otpString
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Invalid OTP');
//             }

//             setSuccess('OTP verified successfully! Redirecting...');
            
//             // Redirect to reset password page
//             setTimeout(() => {
//                 history.push('/reset-password', { 
//                     email,
//                     token: data.resetToken 
//                 });
//             }, 1500);

//         } catch (error) {
//             console.error('OTP verification error:', error);
//             setError(error.message || 'Verification failed. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Resend OTP
//     const handleResendOTP = async () => {
//         setResendLoading(true);
//         setError('');

//         try {
//             const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to resend OTP');
//             }

//             setSuccess('OTP resent successfully!');
//             setTimeLeft(300); // Reset timer
//             setCanResend(false);
//             setOtp(['', '', '', '', '', '']); // Clear OTP inputs

//         } catch (error) {
//             console.error('Resend OTP error:', error);
//             setError(error.message || 'Failed to resend OTP');
//         } finally {
//             setResendLoading(false);
//         }
//     };

//     // Format time display
//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//     };

//     // Redirect if no email
//     useEffect(() => {
//         if (!email) {
//             history.push('/');
//         }
//     }, [email, history]);

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
//                                 Verify OTP
//                             </h2>
//                             <p className="text-gray-600 mb-2">
//                                 Enter the 6-digit code sent to
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

//                         {/* OTP Form */}
//                         <form onSubmit={handleVerifyOTP} className="space-y-6">
//                             {/* OTP Input Fields */}
//                             <div className="space-y-4">
//                                 <label className="text-sm font-medium text-gray-700 block text-center">
//                                     Enter Verification Code
//                                 </label>
//                                 <div className="flex justify-center space-x-3">
//                                     {otp.map((digit, index) => (
//                                         <input
//                                             key={index}
//                                             ref={el => inputRefs.current[index] = el}
//                                             type="text"
//                                             inputMode="numeric"
//                                             pattern="[0-9]"
//                                             maxLength="1"
//                                             value={digit}
//                                             onChange={(e) => handleOtpChange(index, e.target.value)}
//                                             onKeyDown={(e) => handleKeyDown(index, e)}
//                                             onPaste={handlePaste}
//                                             className="w-12 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
//                                         />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Timer */}
//                             <div className="text-center">
//                                 <p className="text-sm text-gray-500">
//                                     {timeLeft > 0 ? (
//                                         <>Time remaining: <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span></>
//                                     ) : (
//                                         <span className="text-red-500">Code expired</span>
//                                     )}
//                                 </p>
//                             </div>

//                             {/* Verify Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading || otp.join('').length !== 6}
//                                 className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         <span>Verifying...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <span>Verify Code</span>
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </>
//                                 )}
//                             </button>

//                             {/* Resend Section */}
//                             <div className="text-center space-y-4">
//                                 <p className="text-sm text-gray-500">
//                                     Didn't receive the code?
//                                 </p>
                                
//                                 <button
//                                     type="button"
//                                     onClick={handleResendOTP}
//                                     disabled={!canResend || resendLoading}
//                                     className="px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
//                                 >
//                                     {resendLoading ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             <span>Sending...</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                             </svg>
//                                             <span>Resend Code</span>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>

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

// // Ring styles - same as LoginModal
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

// export default OTPVerification;

import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const OTPVerification = () => {
    const history = useHistory();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputRefs = useRef([]);

    const email = location.state?.email || '';

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            history.push('/');
        }
    }, [email, history]);

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Add your API call here
            setSuccess('OTP verified successfully! Redirecting...');
            
            setTimeout(() => {
                history.push('/reset-password', { 
                    email,
                    token: 'dummy-token' 
                });
            }, 1500);

        } catch (error) {
            setError('Verification failed. Please try again.');
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
                                Verify OTP
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Enter the 6-digit code sent to
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

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.join('').length !== 6}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
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

export default OTPVerification;
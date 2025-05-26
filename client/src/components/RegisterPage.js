// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import '../styles/RegisterPage.css';

// const RegisterPage = ({ onRegisterSuccess }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'student' // Default role
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const history = useHistory();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formVisible, setFormVisible] = useState(false);

//   // API base URL
//   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//   useEffect(() => {
//     // Animate form in after component mounts
//     setTimeout(() => setFormVisible(true), 100);
    
//     // Create animated background elements
//     const createAnimatedShapes = () => {
//       const container = document.querySelector('.register-background');
//       if (!container) return;
      
//       // Clear existing shapes
//       const existingShapes = container.querySelectorAll('.animated-shape');
//       existingShapes.forEach(shape => shape.remove());
      
//       // Create more shapes for a dense 3D effect
//       const shapeCount = window.innerWidth > 768 ? 12 : 6;
      
//       for (let i = 0; i < shapeCount; i++) {
//         const shape = document.createElement('div');
//         shape.className = 'animated-shape';
        
//         // Randomize appearance and animation with more 3D variation
//         const size = Math.random() * 180 + 40;
//         const posX = Math.random() * 100;
//         const posY = Math.random() * 100;
//         const posZ = Math.random() * 200 - 100; // Add Z-position for 3D effect
//         const duration = Math.random() * 25 + 15;
//         const delay = Math.random() * 8;
//         const opacity = Math.random() * 0.5 + 0.1;
//         const rotation = Math.random() * 360;
        
//         shape.style.width = `${size}px`;
//         shape.style.height = `${size}px`;
//         shape.style.left = `${posX}%`;
//         shape.style.top = `${posY}%`;
//         shape.style.transform = `translateZ(${posZ}px) rotate(${rotation}deg)`;
//         shape.style.animationDuration = `${duration}s`;
//         shape.style.animationDelay = `${delay}s`;
//         shape.style.opacity = opacity;
        
//         // Add custom properties for different shape types
//         const shapeType = Math.floor(Math.random() * 5);
        
//         if (shapeType === 0) {
//           // Circle
//           shape.style.borderRadius = '50%';
//         } else if (shapeType === 1) {
//           // Rounded square
//           shape.style.borderRadius = '30%';
//         } else if (shapeType === 2) {
//           // Pentagon - using clip-path
//           shape.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
//         } else if (shapeType === 3) {
//           // Diamond
//           shape.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
//         } else {
//           // Triangle
//           shape.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
//         }
        
//         // Add a subtle glow to some shapes
//         if (Math.random() > 0.7) {
//           shape.style.boxShadow = '0 0 20px 5px rgba(0, 123, 255, 0.2)';
//         }
        
//         container.appendChild(shape);
//       }
//     };

//     // Create floating text elements
//     const createFloatingText = () => {
//       const container = document.querySelector('.register-background');
//       if (!container) return;
      
//       // Clear existing floating text
//       const existingText = container.querySelectorAll('.floating-text');
//       existingText.forEach(text => text.remove());
      
//       // Tech-related words to float in the background
//       const words = ['Innovation', 'Technology', 'Future', 'Code', 'Connect', 'Network', 'Digital', 'Learn', 'Create', 'Develop'];
      
//       // Create floating text elements
//       for (let i = 0; i < 6; i++) {
//         const textElement = document.createElement('div');
//         textElement.className = 'floating-text';
//         textElement.textContent = words[i % words.length];
        
//         const posX = Math.random() * 100;
//         const posY = Math.random() * 100;
//         const posZ = Math.random() * -300 - 100;
//         const opacity = Math.random() * 0.08 + 0.02;
//         const scale = Math.random() * 0.5 + 0.5;
//         const rotation = Math.random() * 360;
        
//         textElement.style.left = `${posX}%`;
//         textElement.style.top = `${posY}%`;
//         textElement.style.transform = `translateZ(${posZ}px) rotateX(${rotation}deg) rotateY(${rotation}deg) scale(${scale})`;
//         textElement.style.opacity = opacity;
        
//         container.appendChild(textElement);
//       }
//     };
    
//     // Add 3D perspective effect on mouse movement
//     const handleMouseMove = (e) => {
//       const container = document.querySelector('.register-container');
//       if (!container) return;
      
//       const x = e.clientX / window.innerWidth;
//       const y = e.clientY / window.innerHeight;
      
//       const tiltAmount = 3; // How much to tilt
//       const tiltX = (y - 0.5) * tiltAmount;
//       const tiltY = (x - 0.5) * -tiltAmount;
      
//       container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
//     };
    
//     // Call all initialization functions
//     createAnimatedShapes();
//     createFloatingText();
    
//     // Set up event listeners
//     window.addEventListener('resize', createAnimatedShapes);
//     window.addEventListener('resize', createFloatingText);
//     window.addEventListener('mousemove', handleMouseMove);
    
//     // Cleanup function
//     return () => {
//       window.removeEventListener('resize', createAnimatedShapes);
//       window.removeEventListener('resize', createFloatingText);
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const nextStep = () => {
//     if (currentStep === 1) {
//       if (!formData.firstName || !formData.lastName) {
//         setError('Please fill in all fields to continue.');
//         return;
//       }
//     } else if (currentStep === 2) {
//       if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         setError('Please enter a valid email address to continue.');
//         return;
//       }
//     }
//     setError('');
//     setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     setError('');
//     setCurrentStep(currentStep - 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
    
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           password: formData.password,
//           role: 'student' // Only students can register from frontend
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }
      
//       // If token is provided (for student auto-approval), store it
//       if (data.token) {
//         localStorage.setItem('authToken', data.token);
//         localStorage.setItem('userRole', 'student');
//         localStorage.setItem('userEmail', formData.email);
//       }
      
//       setSuccess(true);
      
//       // After successful registration, redirect to home and show login modal after 3 seconds
//       setTimeout(() => {
//         history.push('/');
//         if (onRegisterSuccess) {
//           onRegisterSuccess();
//         }
//       }, 3000);
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       setError(error.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStep = () => {
//     switch(currentStep) {
//       case 1:
//         return (
//           <>
//             <h3 className="step-title">Personal Details</h3>
//             <div className="form-group">
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//               />
//               <label htmlFor="firstName">First Name</label>
//               <div className="form-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/>
//                 </svg>
//               </div>
//             </div>
            
//             <div className="form-group">
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//               />
//               <label htmlFor="lastName">Last Name</label>
//               <div className="form-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/>
//                 </svg>
//               </div>
//             </div>
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <h3 className="step-title">Account Details</h3>
//             <div className="form-group">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//               />
//               <label htmlFor="email">Email Address</label>
//               <div className="form-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                 </svg>
//               </div>
//             </div>
            
//             <div className="info-box">
//               <span className="material-icons">info</span>
//               <p>You are registering as a <strong>Student</strong>. Teacher and Admin accounts must be created by system administrators.</p>
//             </div>
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <h3 className="step-title">Secure Your Account</h3>
//             <div className="form-group">
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//                 minLength="6"
//               />
//               <label htmlFor="password">Password (min 6 characters)</label>
//               <div className="form-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
//                 </svg>
//               </div>
//             </div>
            
//             <div className="form-group">
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 className="form-control"
//                 placeholder=" "
//               />
//               <label htmlFor="confirmPassword">Confirm Password</label>
//               <div className="form-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
//                 </svg>
//               </div>
//             </div>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="register-page">
//       <div className="register-background">
//         {/* Animated shapes will be added by useEffect */}
//       </div>
      
//       <div className={`register-container ${formVisible ? 'visible' : ''}`}>
//         <div className="glass-effect"></div>
        
//         <div className="register-content">
//           <h2 className="register-title">Create Student Account</h2>
          
//           {!success ? (
//             <>
//               <div className="stepper">
//                 <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
//                   <div className="step-number">1</div>
//                   <div className="step-label">Personal</div>
//                 </div>
//                 <div className="step-line"></div>
//                 <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
//                   <div className="step-number">2</div>
//                   <div className="step-label">Contact</div>
//                 </div>
//                 <div className="step-line"></div>
//                 <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
//                   <div className="step-number">3</div>
//                   <div className="step-label">Security</div>
//                 </div>
//               </div>
              
//               {error && (
//                 <div className="error-message">
//                   <span className="material-icons">error_outline</span>
//                   <span>{error}</span>
//                 </div>
//               )}
              
//               <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
//                 <div className="form-steps-container">
//                   <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
//                     {currentStep === 1 && renderStep()}
//                   </div>
//                   <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
//                     {currentStep === 2 && renderStep()}
//                   </div>
//                   <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
//                     {currentStep === 3 && renderStep()}
//                   </div>
//                 </div>
                
//                 <div className="form-navigation">
//                   {currentStep > 1 && (
//                     <button 
//                       type="button"
//                       className="btn-prev"
//                       onClick={prevStep}
//                     >
//                       <span className="material-icons">arrow_back</span>
//                       Back
//                     </button>
//                   )}
                  
//                   {currentStep < 3 ? (
//                     <button 
//                       type="button"
//                       className="btn-next"
//                       onClick={nextStep}
//                     >
//                       Next
//                       <span className="material-icons">arrow_forward</span>
//                     </button>
//                   ) : (
//                     <button 
//                       type="submit"
//                       className={`btn-submit ${loading ? 'loading' : ''}`}
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <span className="spinner"></span>
//                           <span>Registering...</span>
//                         </>
//                       ) : (
//                         <>
//                           Register
//                           <span className="material-icons">check</span>
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </>
//           ) : (
//             <div className="success-message">
//               <div className="success-icon">
//                 <span className="material-icons">check_circle</span>
//               </div>
//               <h3>Registration Successful!</h3>
//               <p>Your account has been created. Redirecting to login...</p>
//               <div className="loader"></div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [formVisible, setFormVisible] = useState(false);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
          role: 'student' // Only students can register from frontend
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // If token is provided (for student auto-approval), store it
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role || 'student');
        localStorage.setItem('userEmail', formData.email);
      }
      
      setSuccess(true);
      
      // After successful registration, redirect to dashboard if auto-approved or to home
      setTimeout(() => {
        if (data.token) {
          // Student is auto-approved, go to dashboard
          history.push('/dashboard');
        } else {
          // Account needs approval, go to home and show login modal
          history.push('/');
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
            
            <div className="info-box">
              <span className="material-icons">info</span>
              <p>You are registering as a <strong>Student</strong>. Teacher and Admin accounts must be created by system administrators.</p>
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
                minLength="6"
              />
              <label htmlFor="password">Password (min 6 characters)</label>
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
          <h2 className="register-title">Create Student Account</h2>
          
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
                  <span className="material-icons">error_outline</span>
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
                      <span className="material-icons">arrow_back</span>
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
                      <span className="material-icons">arrow_forward</span>
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className={`btn-submit ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          Register
                          <span className="material-icons">check</span>
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
              <p>Your student account has been created and is ready to use. Redirecting to dashboard...</p>
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
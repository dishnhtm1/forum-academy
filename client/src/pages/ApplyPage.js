import React, { useState, useEffect, useRef } from 'react';
import ApplicationForm from '../components/ApplicationForm';
import { createApplication } from '../utils/api'; // Optional: If you prefer using your API utility
import '../styles/ApplyPage.css';

const ApplyPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        personalInfo: {},
        educationInfo: {},
        courseSelection: {},
        additionalInfo: {}
    });
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    
    // Animate elements when the page loads
    useEffect(() => {
        setIsVisible(true);
        
        // Create 3D elements
        const createAnimatedElements = () => {
            // Create floating shapes
            const world = document.querySelector('.apply-world');
            if (!world) return;
            
            // Create geometric shapes with different designs
            for (let i = 0; i < 10; i++) {
                // Create shape container
                const shape = document.createElement('div');
                shape.className = 'apply-shape';
                
                // Randomize shape type
                const shapeTypes = ['cube', 'pyramid', 'circle'];
                const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                shape.classList.add(`apply-${shapeType}`);
                
                // Random position
                const x = (Math.random() - 0.5) * 1000;
                const y = (Math.random() - 0.5) * 1000;
                const z = (Math.random() - 0.5) * 1000;
                
                // Random size
                const size = Math.random() * 60 + 30;
                
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
                
                // For cubes, add faces
                if (shapeType === 'cube') {
                    ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
                        const el = document.createElement('div');
                        el.className = `apply-shape-face ${face}`;
                        shape.appendChild(el);
                    });
                }
                
                world.appendChild(shape);
            }
            
            // Create floating document icons
            for (let i = 0; i < 6; i++) {
                const doc = document.createElement('div');
                doc.className = 'apply-document';
                
                // Random position
                const x = (Math.random() - 0.5) * 800;
                const y = (Math.random() - 0.5) * 800;
                const z = (Math.random() - 0.5) * 500;
                
                // Random rotation
                const rotX = Math.random() * 360;
                const rotY = Math.random() * 360;
                const rotZ = Math.random() * 360;
                
                doc.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
                
                // Add document icon
                const icon = document.createElement('span');
                icon.className = 'material-icons';
                icon.textContent = ['description', 'article', 'assignment', 'note_alt'][Math.floor(Math.random() * 4)];
                doc.appendChild(icon);
                
                world.appendChild(doc);
            }
            
            // Create particles
            const particles = document.querySelector('.apply-particles');
            if (particles) {
                for (let i = 0; i < 30; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'apply-particle';
                    
                    // Random size and position
                    const size = Math.random() * 6 + 2;
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${x}%`;
                    particle.style.top = `${y}%`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
                    
                    particles.appendChild(particle);
                }
            }
        };
        
        createAnimatedElements();
        
        const heroContent = document.querySelector('.apply-hero-content');
        const processSteps = document.querySelectorAll('.process-step');
        
        if (heroContent) {
            heroContent.classList.add('visible');
        }
        
        processSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('visible');
            }, 300 * index);
        });
        
        // Clean up function
        return () => {
            const world = document.querySelector('.apply-world');
            if (world) {
                while (world.firstChild) {
                    world.removeChild(world.firstChild);
                }
            }
            
            const particles = document.querySelector('.apply-particles');
            if (particles) {
                while (particles.firstChild) {
                    particles.removeChild(particles.firstChild);
                }
            }
        };
    }, []);
    
    // // Handle step navigation
    // const handleNext = (stepData) => {
    //     // Store the current step's data
    //     const updatedFormData = { ...formData };
        
    //     switch (activeStep) {
    //         case 0:
    //             updatedFormData.personalInfo = stepData;
    //             break;
    //         case 1:
    //             updatedFormData.educationInfo = stepData;
    //             break;
    //         case 2:
    //             updatedFormData.courseSelection = stepData;
    //             break;
    //         case 3:
    //             updatedFormData.additionalInfo = stepData;
    //             break;
    //         default:
    //             break;
    //     }
        
    //     setFormData(updatedFormData);
    //     setActiveStep(activeStep + 1);
        
    //     // Scroll to top of form
    //     const formElement = document.querySelector('.application-form');
    //     if (formElement) {
    //         formElement.scrollIntoView({ behavior: 'smooth' });
    //     }
    // };

    // Handle step navigation
    const handleNext = async (stepData) => {
        // Store the current step's data
        const updatedFormData = { ...formData };
        
        switch (activeStep) {
            case 0:
                updatedFormData.personalInfo = stepData;
                break;
            case 1:
                updatedFormData.educationInfo = stepData;
                break;
            case 2:
                updatedFormData.courseSelection = stepData;
                break;
            case 3:
                updatedFormData.additionalInfo = stepData;
                // This is the final step - submit the form
                try {
                    await submitForm(updatedFormData);
                } catch (error) {
                    console.error('Error submitting application:', error);
                    alert('There was an error submitting your application. Please try again.');
                    return; // Don't proceed to next step if submission failed
                }
                break;
            default:
                break;
        }
        
        setFormData(updatedFormData);
        setActiveStep(activeStep + 1);
        
        // Scroll to top of form
        const formElement = document.querySelector('.application-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

        // Add the submitForm function
    const submitForm = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Format the data to match your API expectations
                    firstName: formData.personalInfo.fullName?.split(' ')[0] || '',
                    lastName: formData.personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
                    email: formData.personalInfo.email,
                    phone: formData.personalInfo.phone,
                    dateOfBirth: formData.personalInfo.dateOfBirth,
                    address: formData.personalInfo.address,
                    
                    // Education info
                    highestEducation: formData.educationInfo.highestEducation,
                    schoolName: formData.educationInfo.schoolName,
                    graduationYear: formData.educationInfo.graduationYear,
                    fieldOfStudy: formData.educationInfo.fieldOfStudy,
                    techExperience: formData.educationInfo.relevantExperience,
                    
                    // Course selection
                    program: formData.courseSelection.course,
                    startDate: formData.courseSelection.startDate,
                    format: formData.courseSelection.studyFormat,
                    heardAboutUs: formData.additionalInfo.howDidYouHear,
                    
                    // Additional info
                    goals: formData.additionalInfo.careerGoals,
                    whyThisProgram: formData.courseSelection.programInterest,
                    extraInfo: formData.additionalInfo.questions,
                    agreeToTerms: formData.additionalInfo.agreeToTerms
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success message or redirect
                console.log('Application submitted successfully!');
                // We don't need to redirect since handleNext will increment activeStep to 4
                // which will display the success message in the ApplyPage component
            } else {
                // Show error message
                console.error('Error submitting application:', data.message);
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    };
    
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    
    // Testimonials from successful applicants
    const testimonials = [
        {
            name: "Yuki Tanaka",
            program: "Web Development",
            quote: "The application process was straightforward, and the admissions team was incredibly helpful. Now I'm working as a front-end developer at a top tech company.",
            avatar: "/images/testimonial1.jpg"
        },
        {
            name: "Ken Watanabe",
            program: "Data Science",
            quote: "From application to graduation, Forum Academy provided support every step of the way. The career transition was smoother than I expected.",
            avatar: "/images/testimonial2.jpg"
        },
        {
            name: "Mika Suzuki",
            program: "Cybersecurity",
            quote: "I was nervous about changing careers, but the application process helped me confirm this was the right path. The pre-course guidance was exceptional.",
            avatar: "/images/testimonial3.jpg"
        }
    ];

    return (
        <div className="apply-page">
            {/* Enhanced 3D Hero Section */}
            <section ref={sectionRef} className={`apply-hero ${isVisible ? 'visible' : ''}`}>
                {/* 3D Scene */}
                <div className="apply-scene">
                    <div className="apply-world">
                        <div className="apply-floor"></div>
                        {/* Shapes and documents will be added by JavaScript */}
                    </div>
                    
                    {/* Particles */}
                    <div className="apply-particles"></div>
                    
                    {/* Glowing effects */}
                    <div className="apply-glow apply-glow-1"></div>
                    <div className="apply-glow apply-glow-2"></div>
                    <div className="apply-glow apply-glow-3"></div>
                </div>
                
                <div className="container">
                    <div className="apply-hero-content">
                        <div className="apply-hero-badge">
                            <span className="apply-badge-icon material-icons">school</span>
                            Application now open
                        </div>
                        <h1 className="apply-hero-title">Begin Your <span className="apply-highlight-text">Tech Journey</span></h1>
                        <p className="apply-hero-description">
                            Take the first step toward a rewarding career in information technology.
                            Our application process is designed to be straightforward and supportive.
                        </p>
                        
                        <div className="apply-badges">
                            <div className="badge">
                                <span className="material-icons">schedule</span>
                                <span>10-15 minute application</span>
                            </div>
                            <div className="badge">
                                <span className="material-icons">verified</span>
                                <span>No prior experience required</span>
                            </div>
                            <div className="badge">
                                <span className="material-icons">support_agent</span>
                                <span>Guidance available</span>
                            </div>
                        </div>
                        
                        <button
                            className="apply-btn apply-btn-primary"
                            onClick={() => {
                                const formElement = document.querySelector('.application-form-section');
                                formElement.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span className="material-icons">edit_note</span>
                            Start Application
                        </button>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="apply-scroll-indicator">
                    <a href="#application-process">
                        <span>How it works</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Application Process */}
            <section id="application-process" className="application-process">
                <div className="container">
                    <h2 className="section-title">Application Process</h2>
                    <p className="section-subtitle">Our simple four-step process to joining Forum Information Academy</p>
                    
                    <div className="process-steps">
                        <div className={`process-step ${activeStep === 0 ? 'active' : ''} ${activeStep > 0 ? 'completed' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Personal Information</h3>
                                <p>Basic contact details and background</p>
                            </div>
                        </div>
                        
                        <div className={`process-step ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Educational Background</h3>
                                <p>Your academic and professional experience</p>
                            </div>
                        </div>
                        
                        <div className={`process-step ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Program Selection</h3>
                                <p>Choose your preferred course and schedule</p>
                            </div>
                        </div>
                        
                        <div className={`process-step ${activeStep === 3 ? 'active' : ''} ${activeStep > 3 ? 'completed' : ''}`}>
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Additional Information</h3>
                                <p>Tell us about your goals and motivations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Application Form */}
            <section className="application-form-section">
                <div className="container">
                    <div className="form-container">
                        <div className="form-card">
                            {/* Show confirmation screen if application is complete */}
                            {activeStep === 4 ? (
                                <div className="application-confirmation">
                                    <div className="confirmation-icon">
                                        <span className="material-icons">check_circle</span>
                                    </div>
                                    <h2>Application Submitted!</h2>
                                    <p>Thank you for applying to Forum Information Academy. We've received your application and will review it shortly.</p>
                                    <p className="confirmation-info">A confirmation email has been sent to <strong>{formData.personalInfo.email}</strong> with additional details.</p>
                                    
                                    <div className="next-steps">
                                        <h3>What's Next?</h3>
                                        <ol>
                                            <li>Our admissions team will review your application (1-2 business days)</li>
                                            <li>You'll receive an invitation for a brief interview with our program counselor</li>
                                            <li>Upon acceptance, you'll receive enrollment instructions</li>
                                        </ol>
                                    </div>
                                    
                                    <div className="confirmation-actions">
                                        <a href="/courses" className="btn btn-outline">Explore Courses</a>
                                        <a href="/contact" className="btn btn-primary">Contact Admissions</a>
                                    </div>
                                </div>
                            ) : (
                                <ApplicationForm 
                                    step={activeStep} 
                                    onNext={handleNext} 
                                    onBack={handleBack} 
                                    formData={formData}
                                />
                            )}
                        </div>
                        
                        {/* Side panel with information */}
                        <div className="form-sidebar">
                            <div className="sidebar-widget need-help">
                                <h3>Need Help?</h3>
                                <p>Our admissions team is available to assist you with your application.</p>
                                <div className="contact-options">
                                    <a href="tel:+81123456789" className="contact-option">
                                        <span className="material-icons">phone</span>
                                        <span>+81-123-456-789</span>
                                    </a>
                                    <a href="mailto:admissions@forumacademy.jp" className="contact-option">
                                        <span className="material-icons">email</span>
                                        <span>admissions@forumacademy.jp</span>
                                    </a>
                                    <a href="/faq" className="contact-option">
                                        <span className="material-icons">help_outline</span>
                                        <span>FAQ</span>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="sidebar-widget">
                                <h3>Application Deadlines</h3>
                                <div className="deadlines">
                                    <div className="deadline-item">
                                        <span className="deadline-date">June 15, 2025</span>
                                        <span className="deadline-label">Summer Cohort</span>
                                    </div>
                                    <div className="deadline-item">
                                        <span className="deadline-date">September 10, 2025</span>
                                        <span className="deadline-label">Fall Cohort</span>
                                    </div>
                                    <div className="deadline-item">
                                        <span className="deadline-date">January 5, 2026</span>
                                        <span className="deadline-label">Winter Cohort</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title">From Applicants to Graduates</h2>
                    <p className="section-subtitle">Hear from students who were once in your position</p>
                    
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div className="testimonial-card" key={index}>
                                <div className="testimonial-avatar">
                                    <img src={testimonial.avatar} alt={testimonial.name} />
                                </div>
                                <div className="testimonial-content">
                                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                                    <div className="testimonial-author">
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.program} Graduate</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* FAQs Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>What are the admission requirements?</h3>
                            <p>Our programs are designed for students from all backgrounds. While no prior experience is required, we look for motivated individuals who can demonstrate problem-solving skills and a commitment to learning.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How long does the application process take?</h3>
                            <p>The online application takes approximately 10-15 minutes to complete. After submission, you'll typically hear back from us within 1-2 business days to schedule your interview.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Are there payment plans available?</h3>
                            <p>Yes, we offer flexible payment options including installment plans and income share agreements for qualified applicants. Financial details will be discussed after acceptance.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What if I need to defer my enrollment?</h3>
                            <p>We understand circumstances change. If you're accepted, you can defer your enrollment to the next cohort. Please contact the admissions team as early as possible.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApplyPage;
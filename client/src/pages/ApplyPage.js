import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import ApplicationForm from '../components/ApplicationForm';
import { createApplication } from '../utils/api'; // Optional: If you prefer using your API utility
import '../styles/ApplyPage.css';

import testimonialImage from '../assets/images/png4.jpg';
import testimonial1Image from '../assets/images/png18.jpg';
import testimonial2Image from '../assets/images/png16.jpg';

const ApplyPage = () => {
    const { t } = useTranslation(); // Add this line only
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        personalInfo: {},
        educationInfo: {},
        courseSelection: {},
        additionalInfo: {}
    });
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    
    // Keep ALL your existing 3D animation code exactly as is
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

    // Keep ALL your existing form handling code exactly as is
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
                    await handleSubmit(updatedFormData);
                    return; // Don't proceed to next step if submission failed
                } catch (error) {
                    console.error('Error submitting application:', error);
                    return;
                }
        }
        
        setFormData(updatedFormData);
        setActiveStep(activeStep + 1);
        
        // Scroll to top of form
        const formElement = document.querySelector('.application-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleSubmit = async (formData) => {
        try {
            setFormStatus({
                submitted: true,
                error: false,
                message: t('applyPage.submitting'),
                loading: true
            });

            // Map form field names to server expected format
            const applicationData = {
                // Personal Info
                firstName: formData.personalInfo.fullName?.split(' ')[0] || '',
                lastName: formData.personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
                email: formData.personalInfo.email,
                phone: formData.personalInfo.phone,
                dateOfBirth: formData.personalInfo.dateOfBirth,
                address: formData.personalInfo.address || '',
                
                // Education Info
                highestEducation: formData.educationInfo.highestEducation,
                schoolName: formData.educationInfo.schoolName || '',
                graduationYear: formData.educationInfo.graduationYear || '',
                fieldOfStudy: formData.educationInfo.fieldOfStudy || '',
                currentEmployment: formData.educationInfo.currentEmployment || '',
                techExperience: formData.educationInfo.relevantExperience || '',
                
                // Course Selection
                program: formData.courseSelection.course,
                startDate: formData.courseSelection.startDate,
                format: formData.courseSelection.studyFormat || '',
                heardAboutUs: formData.additionalInfo.howDidYouHear || '',
                
                // Additional Info
                goals: formData.additionalInfo.careerGoals || '',
                whyThisProgram: formData.courseSelection.programInterest || '',
                challenges: '',
                extraInfo: formData.additionalInfo.questions || '',
                agreeToTerms: formData.additionalInfo.agreeToTerms || false
            };

            console.log('Submitting application:', applicationData);

            // const response = await fetch('http://localhost:5000/api/application', {
//            const response = await fetch('http://localhost:5000/api/applications', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
 //               body: JSON.stringify(applicationData)
 //           });

            const API_URL = process.env.REACT_APP_API_URL;

            const response = await fetch(`${API_URL}/api/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
                });



            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t('applyPage.submitError'));
            }

            // Success case
            setFormStatus({
                submitted: true,
                error: false,
                message: t('applyPage.submitSuccess'),
                loading: false
            });

            // Move to success step
            setActiveStep(4);

        } catch (error) {
            console.error('Application submission error:', error);
            setFormStatus({
                submitted: true,
                error: true,
                message: error.message || t('applyPage.submitErrorMessage'),
                loading: false
            });
        }
    };

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false,
        message: '',
        loading: false
    });

    // Handle back navigation    
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    
    // Keep testimonials data structure - only replace text values
    const testimonials = [
        {
            name: t('applyPage.testimonials.0.name'),
            program: t('applyPage.testimonials.0.program'),
            quote: t('applyPage.testimonials.0.quote'),
            avatar: testimonialImage
        },
        {
            name: t('applyPage.testimonials.1.name'),
            program: t('applyPage.testimonials.1.program'),
            quote: t('applyPage.testimonials.1.quote'),
            avatar: testimonial1Image
        },
        {
            name: t('applyPage.testimonials.2.name'),
            program: t('applyPage.testimonials.2.program'),
            quote: t('applyPage.testimonials.2.quote'),
            avatar: testimonial2Image
        }
    ];

    return (
        <div className="apply-page">
            {/* Enhanced 3D Hero Section */}
            <section ref={sectionRef} className={`apply-hero ${isVisible ? 'visible' : ''}`}>
                {/* Keep ALL 3D Scene exactly as is */}
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
                            {t('applyPage.hero.badge')}
                        </div>
                        <h1 className="apply-hero-title">{t('applyPage.hero.title.part1')} <span className="apply-highlight-text">{t('applyPage.hero.title.highlight')}</span></h1>
                        <p className="apply-hero-description">
                            {t('applyPage.hero.description')}
                        </p>
                        
                        <div className="apply-badges">
                            <div className="badge">
                                <span className="material-icons">schedule</span>
                                <span>{t('applyPage.hero.badges.duration')}</span>
                            </div>
                            <div className="badge">
                                <span className="material-icons">verified</span>
                                <span>{t('applyPage.hero.badges.experience')}</span>
                            </div>
                            <div className="badge">
                                <span className="material-icons">support_agent</span>
                                <span>{t('applyPage.hero.badges.guidance')}</span>
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
                            {t('applyPage.hero.startButton')}
                        </button>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="apply-scroll-indicator">
                    <a href="#application-process">
                        <span>{t('applyPage.hero.scrollIndicator')}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            <div className="process-steps">
                {[0, 1, 2, 3].map((stepIndex) => (
                    <div 
                        key={stepIndex}
                        className={`process-step ${activeStep === stepIndex ? 'active' : ''} ${activeStep > stepIndex ? 'completed' : ''}`}
                    >
                        <div className="step-number">
                            {activeStep > stepIndex ? (
                                <span className="material-icons check-icon">check</span>
                            ) : (
                                stepIndex + 1
                            )}
                        </div>
                        <div className="step-content">
                            <h3>
                                {stepIndex === 0 && t('applyPage.processSteps.0.title')}
                                {stepIndex === 1 && t('applyPage.processSteps.1.title')}
                                {stepIndex === 2 && t('applyPage.processSteps.2.title')}
                                {stepIndex === 3 && t('applyPage.processSteps.3.title')}
                            </h3>
                            <p>
                                {stepIndex === 0 && t('applyPage.processSteps.0.description')}
                                {stepIndex === 1 && t('applyPage.processSteps.1.description')}
                                {stepIndex === 2 && t('applyPage.processSteps.2.description')}
                                {stepIndex === 3 && t('applyPage.processSteps.3.description')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
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
                                    <h2>{t('applyPage.confirmation.title')}</h2>
                                    <p>{t('applyPage.confirmation.message')}</p>
                                    <p className="confirmation-info">{t('applyPage.confirmation.emailSent')} <strong>{formData.personalInfo.email}</strong> {t('applyPage.confirmation.emailDetails')}</p>
                                    
                                    <div className="next-steps">
                                        <h3>{t('applyPage.confirmation.nextSteps.title')}</h3>
                                        <ol>
                                            <li>{t('applyPage.confirmation.nextSteps.step1')}</li>
                                            <li>{t('applyPage.confirmation.nextSteps.step2')}</li>
                                            <li>{t('applyPage.confirmation.nextSteps.step3')}</li>
                                        </ol>
                                    </div>
                                    
                                    <div className="confirmation-actions">
                                        <a href="/courses" className="btn btn-outline">{t('applyPage.confirmation.buttons.exploreCourses')}</a>
                                        <a href="/contact" className="btn btn-primary">{t('applyPage.confirmation.buttons.contactAdmissions')}</a>
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
                                <h3>{t('applyPage.sidebar.needHelp.title')}</h3>
                                <p>{t('applyPage.sidebar.needHelp.description')}</p>
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
                                        <span>{t('applyPage.sidebar.needHelp.faq')}</span>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="sidebar-widget">
                                <h3>{t('applyPage.sidebar.deadlines.title')}</h3>
                                <div className="deadlines">
                                    <div className="deadline-item">
                                        <span className="deadline-date">{t('applyPage.sidebar.deadlines.summer.date')}</span>
                                        <span className="deadline-label">{t('applyPage.sidebar.deadlines.summer.label')}</span>
                                    </div>
                                    <div className="deadline-item">
                                        <span className="deadline-date">{t('applyPage.sidebar.deadlines.fall.date')}</span>
                                        <span className="deadline-label">{t('applyPage.sidebar.deadlines.fall.label')}</span>
                                    </div>
                                    <div className="deadline-item">
                                        <span className="deadline-date">{t('applyPage.sidebar.deadlines.winter.date')}</span>
                                        <span className="deadline-label">{t('applyPage.sidebar.deadlines.winter.label')}</span>
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
                    <h2 className="section-title">{t('applyPage.testimonialsSection.title')}</h2>
                    <p className="section-subtitle">{t('applyPage.testimonialsSection.subtitle')}</p>
                    
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
                                        <p>{testimonial.program} {t('applyPage.testimonialsSection.graduateLabel')}</p>
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
                    <h2 className="section-title">{t('applyPage.faqSection.title')}</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>{t('applyPage.faqSection.items.requirements.question')}</h3>
                            <p>{t('applyPage.faqSection.items.requirements.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('applyPage.faqSection.items.duration.question')}</h3>
                            <p>{t('applyPage.faqSection.items.duration.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('applyPage.faqSection.items.payment.question')}</h3>
                            <p>{t('applyPage.faqSection.items.payment.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('applyPage.faqSection.items.defer.question')}</h3>
                            <p>{t('applyPage.faqSection.items.defer.answer')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApplyPage;
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ApplicationForm from '../components/ApplicationForm';
import '../styles/ApplyPage.css'; // Keep only for 3D hero effects

import testimonialImage from '../assets/images/png4.jpg';
import testimonial1Image from '../assets/images/png18.jpg';
import testimonial2Image from '../assets/images/png16.jpg';

const ApplyPage = () => {
    const { t } = useTranslation();
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
        
        const createAnimatedElements = () => {
            const world = document.querySelector('.apply-world');
            if (!world) return;
            
            for (let i = 0; i < 10; i++) {
                const shape = document.createElement('div');
                shape.className = 'apply-shape';
                
                const shapeTypes = ['cube', 'pyramid', 'circle'];
                const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                shape.classList.add(`apply-${shapeType}`);
                
                const x = (Math.random() - 0.5) * 1000;
                const y = (Math.random() - 0.5) * 1000;
                const z = (Math.random() - 0.5) * 1000;
                
                const size = Math.random() * 60 + 30;
                
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
                
                if (shapeType === 'cube') {
                    ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
                        const el = document.createElement('div');
                        el.className = `apply-shape-face ${face}`;
                        shape.appendChild(el);
                    });
                }
                
                world.appendChild(shape);
            }
            
            for (let i = 0; i < 6; i++) {
                const doc = document.createElement('div');
                doc.className = 'apply-document';
                
                const x = (Math.random() - 0.5) * 800;
                const y = (Math.random() - 0.5) * 800;
                const z = (Math.random() - 0.5) * 500;
                
                const rotX = Math.random() * 360;
                const rotY = Math.random() * 360;
                const rotZ = Math.random() * 360;
                
                doc.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
                
                const icon = document.createElement('span');
                icon.className = 'material-icons';
                icon.textContent = ['description', 'article', 'assignment', 'note_alt'][Math.floor(Math.random() * 4)];
                doc.appendChild(icon);
                
                world.appendChild(doc);
            }
            
            const particles = document.querySelector('.apply-particles');
            if (particles) {
                for (let i = 0; i < 30; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'apply-particle';
                    
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
        
        if (heroContent) {
            heroContent.classList.add('visible');
        }
        
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
                try {
                    await handleSubmit(updatedFormData);
                    return;
                } catch (error) {
                    console.error('Error submitting application:', error);
                    return;
                }
        }
        
        setFormData(updatedFormData);
        setActiveStep(activeStep + 1);
        
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

            const applicationData = {
                firstName: formData.personalInfo.fullName?.split(' ')[0] || '',
                lastName: formData.personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
                email: formData.personalInfo.email,
                phone: formData.personalInfo.phone,
                dateOfBirth: formData.personalInfo.dateOfBirth,
                address: formData.personalInfo.address || '',
                
                highestEducation: formData.educationInfo.highestEducation,
                schoolName: formData.educationInfo.schoolName || '',
                graduationYear: formData.educationInfo.graduationYear || '',
                fieldOfStudy: formData.educationInfo.fieldOfStudy || '',
                currentEmployment: formData.educationInfo.currentEmployment || '',
                techExperience: formData.educationInfo.relevantExperience || '',
                
                program: formData.courseSelection.course,
                startDate: formData.courseSelection.startDate,
                format: formData.courseSelection.studyFormat || '',
                heardAboutUs: formData.additionalInfo.howDidYouHear || '',
                
                goals: formData.additionalInfo.careerGoals || '',
                whyThisProgram: formData.courseSelection.programInterest || '',
                challenges: '',
                extraInfo: formData.additionalInfo.questions || '',
                agreeToTerms: formData.additionalInfo.agreeToTerms || false
            };

            console.log('Submitting application:', applicationData);

            const token = localStorage.getItem("token");
            const API_URL = process.env.REACT_APP_API_URL;

            const response = await fetch(`${API_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(applicationData)
             });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t('applyPage.submitError'));
            }

            setFormStatus({
                submitted: true,
                error: false,
                message: t('applyPage.submitSuccess'),
                loading: false
            });

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

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    
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
            {/* Keep 3D Hero Section with CSS */}
            <section ref={sectionRef} className={`apply-hero ${isVisible ? 'visible' : ''}`}>
                <div className="apply-scene">
                    <div className="apply-world">
                        <div className="apply-floor"></div>
                    </div>
                    <div className="apply-particles"></div>
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
            </section>
            
            {/* Application Form Section - Redesigned with Tailwind */}
            <section className="application-form-section py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Form Container */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                {activeStep === 4 ? (
                                    // Success Page with Tailwind
                                    <div className="p-12 text-center">
                                        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        
                                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                            {t('applyPage.confirmation.title')}
                                        </h2>
                                        
                                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                            {t('applyPage.confirmation.message')}
                                        </p>
                                        
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
                                            <p className="text-gray-700">
                                                {t('applyPage.confirmation.emailSent')} 
                                                <span className="font-semibold text-blue-600 mx-1">
                                                    {formData.personalInfo.email}
                                                </span> 
                                                {t('applyPage.confirmation.emailDetails')}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                                                {t('applyPage.confirmation.nextSteps.title')}
                                            </h3>
                                            <div className="space-y-4">
                                                {[
                                                    t('applyPage.confirmation.nextSteps.step1'),
                                                    t('applyPage.confirmation.nextSteps.step2'),
                                                    t('applyPage.confirmation.nextSteps.step3')
                                                ].map((step, index) => (
                                                    <div key={index} className="flex items-start space-x-4">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white font-semibold text-sm">{index + 1}</span>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <a 
                                                href="/courses" 
                                                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
                                            >
                                                {t('applyPage.confirmation.buttons.exploreCourses')}
                                            </a>
                                            <a 
                                                href="/contact" 
                                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 font-medium"
                                            >
                                                {t('applyPage.confirmation.buttons.contactAdmissions')}
                                            </a>
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
                        </div>
                        
                        {/* Sidebar with Tailwind */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Need Help Widget */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {t('applyPage.sidebar.needHelp.title')}
                                    </h3>
                                </div>
                                
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {t('applyPage.sidebar.needHelp.description')}
                                </p>
                                
                                <div className="space-y-3">
                                    <a 
                                        href="tel:+81123456789" 
                                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group"
                                    >
                                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-medium">+81-123-456-789</span>
                                    </a>
                                    
                                    <a 
                                        href="mailto:admissions@forumacademy.jp" 
                                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group"
                                    >
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-medium text-sm">forumacademy@jp.co</span>
                                    </a>
                                    
                                    <a 
                                        href="/faq" 
                                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                                    >
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-medium">{t('applyPage.sidebar.needHelp.faq')}</span>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Deadlines Widget */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {t('applyPage.sidebar.deadlines.title')}
                                    </h3>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { 
                                            date: t('applyPage.sidebar.deadlines.summer.date'), 
                                            label: t('applyPage.sidebar.deadlines.summer.label'),
                                            color: 'from-yellow-500 to-orange-500'
                                        },
                                        { 
                                            date: t('applyPage.sidebar.deadlines.fall.date'), 
                                            label: t('applyPage.sidebar.deadlines.fall.label'),
                                            color: 'from-red-500 to-pink-500'
                                        },
                                        { 
                                            date: t('applyPage.sidebar.deadlines.winter.date'), 
                                            label: t('applyPage.sidebar.deadlines.winter.label'),
                                            color: 'from-blue-500 to-cyan-500'
                                        }
                                    ].map((deadline, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                                            <div className={`inline-block px-3 py-1 bg-gradient-to-r ${deadline.color} text-white text-sm font-semibold rounded-lg mb-2`}>
                                                {deadline.date}
                                            </div>
                                            <p className="text-gray-700 font-medium">{deadline.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section - Redesigned with Tailwind */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {t('applyPage.testimonialsSection.title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t('applyPage.testimonialsSection.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-blue-600 font-medium">
                                            {testimonial.program} {t('applyPage.testimonialsSection.graduateLabel')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex text-yellow-400 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <blockquote className="text-gray-700 leading-relaxed italic">
                                        "{testimonial.quote}"
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* FAQ Section - Redesigned with Tailwind */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
                
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {t('applyPage.faqSection.title')}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { 
                                question: t('applyPage.faqSection.items.requirements.question'),
                                answer: t('applyPage.faqSection.items.requirements.answer'),
                                icon: '🎓'
                            },
                            { 
                                question: t('applyPage.faqSection.items.duration.question'),
                                answer: t('applyPage.faqSection.items.duration.answer'),
                                icon: '⏰'
                            },
                            { 
                                question: t('applyPage.faqSection.items.payment.question'),
                                answer: t('applyPage.faqSection.items.payment.answer'),
                                icon: '💳'
                            },
                            { 
                                question: t('applyPage.faqSection.items.defer.question'),
                                answer: t('applyPage.faqSection.items.defer.answer'),
                                icon: '📅'
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl">{faq.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApplyPage;
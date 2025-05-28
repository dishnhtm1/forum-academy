import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/CourseSection.css';
import webImage from '../assets/images/web.jpg';
import dataImage from '../assets/images/data.jpg';
import cyberImage from '../assets/images/cyber.jpg';
import cloudImage from '../assets/images/cloud.jpg';
import aiImage from '../assets/images/Ai.jpg';
import mobileImage from '../assets/images/mobile.png';

const CourseSection = ({ limit, showFilters = false, title = "Our Featured Courses" }) => {
    const { t } = useTranslation(); // Add this line only
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleCourses, setVisibleCourses] = useState(3);
    const sectionRef = useRef(null);
    
    // Keep ALL your existing courses data structure - only replace text values
    const courses = [
        {
            id: 'web-dev',
            title: t('courseSection.courses.webDev.title'),
            description: t('courseSection.courses.webDev.description'),
            image: webImage,
            duration: t('courseSection.courses.webDev.duration'),
            startDate: t('courseSection.courses.webDev.startDate'),
            price: '¥350,000',
            category: t('courseSection.courses.webDev.category'),
            badgeColor: 'primary',
            level: t('courseSection.courses.webDev.level'),
            features: [
                t('courseSection.courses.webDev.features.0'),
                t('courseSection.courses.webDev.features.1'),
                t('courseSection.courses.webDev.features.2')
            ]
        },
        {
            id: 'data-science',
            title: t('courseSection.courses.dataScience.title'),
            description: t('courseSection.courses.dataScience.description'),
            image: dataImage,
            duration: t('courseSection.courses.dataScience.duration'),
            startDate: t('courseSection.courses.dataScience.startDate'),
            price: '¥420,000',
            category: t('courseSection.courses.dataScience.category'),
            badgeColor: 'success',
            level: t('courseSection.courses.dataScience.level'),
            features: [
                t('courseSection.courses.dataScience.features.0'),
                t('courseSection.courses.dataScience.features.1'),
                t('courseSection.courses.dataScience.features.2')
            ]
        },
        {
            id: 'cybersecurity',
            title: t('courseSection.courses.cybersecurity.title'),
            description: t('courseSection.courses.cybersecurity.description'),
            image: cyberImage,
            duration: t('courseSection.courses.cybersecurity.duration'),
            startDate: t('courseSection.courses.cybersecurity.startDate'),
            price: '¥400,000',
            category: t('courseSection.courses.cybersecurity.category'),
            badgeColor: 'danger',
            level: t('courseSection.courses.cybersecurity.level'),
            features: [
                t('courseSection.courses.cybersecurity.features.0'),
                t('courseSection.courses.cybersecurity.features.1'),
                t('courseSection.courses.cybersecurity.features.2')
            ]
        },
        {
            id: 'cloud-computing',
            title: t('courseSection.courses.cloudComputing.title'),
            description: t('courseSection.courses.cloudComputing.description'),
            image: cloudImage,
            duration: t('courseSection.courses.cloudComputing.duration'),
            startDate: t('courseSection.courses.cloudComputing.startDate'),
            price: '¥380,000',
            category: t('courseSection.courses.cloudComputing.category'),
            badgeColor: 'info',
            level: t('courseSection.courses.cloudComputing.level'),
            features: [
                t('courseSection.courses.cloudComputing.features.0'),
                t('courseSection.courses.cloudComputing.features.1'),
                t('courseSection.courses.cloudComputing.features.2')
            ]
        },
        {
            id: 'ai-ml',
            title: t('courseSection.courses.aiMl.title'),
            description: t('courseSection.courses.aiMl.description'),
            image: aiImage,
            duration: t('courseSection.courses.aiMl.duration'),
            startDate: t('courseSection.courses.aiMl.startDate'),
            price: '¥450,000',
            category: t('courseSection.courses.aiMl.category'),
            badgeColor: 'secondary',
            level: t('courseSection.courses.aiMl.level'),
            features: [
                t('courseSection.courses.aiMl.features.0'),
                t('courseSection.courses.aiMl.features.1'),
                t('courseSection.courses.aiMl.features.2')
            ]
        },
        {
            id: 'mobile-dev',
            title: t('courseSection.courses.mobileDev.title'),
            description: t('courseSection.courses.mobileDev.description'),
            image: mobileImage,
            duration: t('courseSection.courses.mobileDev.duration'),
            startDate: t('courseSection.courses.mobileDev.startDate'),
            price: '¥370,000',
            category: t('courseSection.courses.mobileDev.category'),
            badgeColor: 'warning',
            level: t('courseSection.courses.mobileDev.level'),
            features: [
                t('courseSection.courses.mobileDev.features.0'),
                t('courseSection.courses.mobileDev.features.1'),
                t('courseSection.courses.mobileDev.features.2')
            ]
        }
    ];
    
    // Keep ALL your existing animation and logic code exactly as is
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
    useEffect(() => {
        if (limit) {
            setVisibleCourses(limit);
        } else if (window.location.pathname.includes('/courses')) {
            setVisibleCourses(courses.length);
        } else {
            setVisibleCourses(3);
        }
    }, [limit]);
    
    const filterCourses = (category) => {
        setActiveFilter(category);
    };
    
    const showMoreCourses = () => {
        setVisibleCourses(courses.length);
    };
    
    // Filter courses based on active filter
    const filteredCourses = activeFilter === 'all'
        ? courses
        : courses.filter(course => course.category.toLowerCase() === activeFilter.toLowerCase());
    
    // Get courses to display based on visibility setting
    const displayedCourses = filteredCourses.slice(0, visibleCourses);
    
    return (
        <section className="course-section" id="courses" ref={sectionRef}>
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">{t('courseSection.header.badge')}</span>
                    <h2>{title === "Our Featured Courses" ? t('courseSection.header.title') : title}</h2>
                    <p>{t('courseSection.header.subtitle')}</p>
                </div>
                
                {showFilters && (
                    <div className="course-filters">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => filterCourses('all')}
                        >
                            {t('courseSection.filters.all')}
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'web development' ? 'active' : ''}`}
                            onClick={() => filterCourses('web development')}
                        >
                            {t('courseSection.filters.webDevelopment')}
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'data science' ? 'active' : ''}`}
                            onClick={() => filterCourses('data science')}
                        >
                            {t('courseSection.filters.dataScience')}
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'cybersecurity' ? 'active' : ''}`}
                            onClick={() => filterCourses('cybersecurity')}
                        >
                            {t('courseSection.filters.cybersecurity')}
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'cloud computing' ? 'active' : ''}`}
                            onClick={() => filterCourses('cloud computing')}
                        >
                            {t('courseSection.filters.cloudComputing')}
                        </button>
                    </div>
                )}
                
                <div className="course-grid">
                    {displayedCourses.map((course, index) => (
                        <div className="course-card" key={course.id} style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="course-card-inner">
                                <div className="course-image">
                                    <img src={course.image} alt={course.title} />
                                    <span className={`course-badge badge-${course.badgeColor}`}>{course.category}</span>
                                    <div className="course-hover">
                                        <Link to={`/courses/${course.id}`} className="view-details">
                                            <span className="material-icons">visibility</span>
                                            {t('courseSection.buttons.viewDetails')}
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="course-meta">
                                        <div className="meta-item">
                                            <span className="material-icons">access_time</span>
                                            {course.duration}
                                        </div>
                                        <div className="meta-item">
                                            <span className="material-icons">event</span>
                                            {t('courseSection.meta.starts')} {course.startDate}
                                        </div>
                                        <div className="meta-item">
                                            <span className="material-icons">signal_cellular_alt</span>
                                            {course.level}
                                        </div>
                                    </div>
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-features">
                                        {course.features.map((feature, idx) => (
                                            <div className="feature-item" key={idx}>
                                                <span className="material-icons">check_circle</span>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="course-footer">
                                    <div className="course-price">
                                        <span className="price">{course.price}</span>
                                    </div>
                                    <Link to={`/courses/${course.id}`} className="btn-details">
                                        {t('courseSection.buttons.learnMore')}
                                        <span className="material-icons">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {visibleCourses < courses.length && (
                    <div className="view-more-container">
                        <button className="btn-view-more" onClick={showMoreCourses}>
                            {t('courseSection.buttons.viewAllCourses')}
                            <span className="material-icons">expand_more</span>
                        </button>
                    </div>
                )}
                
                {window.location.pathname !== '/courses' && (
                    <div className="courses-cta">
                        <Link to="/courses" className="btn-all-courses">
                            {t('courseSection.buttons.browseAllPrograms')}
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseSection;
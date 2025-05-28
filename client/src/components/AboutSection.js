import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/AboutSection.css';
import studentsImage from '../assets/images/png7.jpg'; 
import studentProfileImage from '../assets/images/png1.jpg'; // Placeholder for student profile image

const AboutSection = ({ showAllFeatures = false }) => {
    const { t } = useTranslation(); // Add this line only
    // Reference for section animation
    const sectionRef = useRef(null);
    const [activeFeature, setActiveFeature] = useState(null);
    
    // Keep ALL your existing animation code exactly as is
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
        
        // Cleanup observer
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
    // Core features to always show with improved content - only replace text
    const coreFeatures = [
        {
            icon: "handshake",
            title: t('aboutSection.features.partnerships.title'),
            description: t('aboutSection.features.partnerships.description'),
            highlight: t('aboutSection.features.partnerships.highlight'),
            color: "#3b82f6"
        },
        {
            icon: "psychology",
            title: t('aboutSection.features.instructors.title'),
            description: t('aboutSection.features.instructors.description'),
            highlight: t('aboutSection.features.instructors.highlight'),
            color: "#10b981"
        },
        {
            icon: "dashboard",
            title: t('aboutSection.features.facilities.title'),
            description: t('aboutSection.features.facilities.description'),
            highlight: t('aboutSection.features.facilities.highlight'),
            color: "#f59e0b"
        },
        {
            icon: "rocket_launch",
            title: t('aboutSection.features.career.title'),
            description: t('aboutSection.features.career.description'),
            highlight: t('aboutSection.features.career.highlight'),
            color: "#8b5cf6"
        }
    ];
    
    // Additional features with improved content - only replace text
    const additionalFeatures = [
        {
            icon: "verified",
            title: t('aboutSection.features.certifications.title'),
            description: t('aboutSection.features.certifications.description'),
            highlight: t('aboutSection.features.certifications.highlight'),
            color: "#ec4899"
        },
        {
            icon: "support_agent",
            title: t('aboutSection.features.support.title'),
            description: t('aboutSection.features.support.description'),
            highlight: t('aboutSection.features.support.highlight'),
            color: "#14b8a6"
        }
    ];
    
    // Determine which features to display - keep logic exactly as is
    const displayFeatures = showAllFeatures ? 
        [...coreFeatures, ...additionalFeatures] : 
        coreFeatures;
        
    return (
        <section className="about-section" id="about" ref={sectionRef}>
            {/* Keep ALL shape animations exactly as is */}
            <div className="about-shapes">
                <div className="about-shape shape-1"></div>
                <div className="about-shape shape-2"></div>
                <div className="about-shape shape-3"></div>
            </div>
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">{t('aboutSection.header.badge')}</span>
                    <h2>{t('aboutSection.header.title')}</h2>
                    <p className="section-subtitle">{t('aboutSection.header.subtitle')}</p>
                </div>
                
                {/* Keep ALL structure and animations exactly as is */}
                <div className="features-container">
                    <div className="features-grid">
                        {displayFeatures.map((feature, index) => (
                            <div 
                                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                                key={index} 
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onMouseEnter={() => setActiveFeature(index)}
                                onMouseLeave={() => setActiveFeature(null)}
                            >
                                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                                    <span className="material-icons">{feature.icon}</span>
                                </div>
                                <div className="feature-content">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                    <div className="feature-highlight" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                                        <span className="highlight-badge">{feature.highlight}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {!showAllFeatures && (
                    <div className="learn-more-cta">
                        <div className="cta-image">
                            <img src={studentsImage} alt={t('aboutSection.cta.imageAlt')} />
                        </div>
                        <div className="cta-content">
                            <span className="cta-badge">{t('aboutSection.cta.badge')}</span>
                            <h3>{t('aboutSection.cta.title')}</h3>
                            <p>{t('aboutSection.cta.description')}</p>
                            <div className="cta-stats">
                                <div className="cta-stat">
                                    <span className="stat-number">15+</span>
                                    <span className="stat-label">{t('aboutSection.cta.stats.years')}</span>
                                </div>
                                <div className="cta-stat">
                                    <span className="stat-number">5,000+</span>
                                    <span className="stat-label">{t('aboutSection.cta.stats.graduates')}</span>
                                </div>
                            </div>
                            <Link to="/about" className="btn-learn-more">
                                {t('aboutSection.cta.button')}
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                )}
                
                <div className="testimonial-preview">
                    <div className="testimonial-quote">
                        <span className="quote-icon material-icons">format_quote</span>
                        <blockquote>
                            {t('aboutSection.testimonial.quote')}
                        </blockquote>
                        <div className="quote-author">
                            <img src={studentProfileImage} alt={t('aboutSection.testimonial.author.name')} className="author-image" />
                            <div className="author-info">
                                <span className="author-name">{t('aboutSection.testimonial.author.name')}</span>
                                <span className="author-title">{t('aboutSection.testimonial.author.title')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
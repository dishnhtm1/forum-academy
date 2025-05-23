import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutSection.css';

const AboutSection = ({ showAllFeatures = false }) => {
    // Reference for section animation
    const sectionRef = useRef(null);
    const [activeFeature, setActiveFeature] = useState(null);
    
    // Add scroll animation effect
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
    
    // Core features to always show with improved content
    const coreFeatures = [
        {
            icon: "handshake",
            title: "Industry Partnerships",
            description: "Access exclusive opportunities through our network of tech leaders. Our curriculum is co-developed with industry experts, ensuring you learn the skills employers are actively seeking.",
            highlight: "200+ global partners",
            color: "#3b82f6"
        },
        {
            icon: "psychology",
            title: "Expert Instructors",
            description: "Learn from tech veterans who've built successful products and led engineering teams at top companies. Our instructors bring real-world challenges and solutions directly to the classroom.",
            highlight: "15+ years avg. experience",
            color: "#10b981"
        },
        {
            icon: "dashboard",
            title: "Cutting-Edge Facilities",
            description: "Immerse yourself in professional-grade environments with industry-standard tools and technologies. Our recently renovated campus features specialized labs for every technology track.",
            highlight: "¥200M facility investment",
            color: "#f59e0b"
        },
        {
            icon: "rocket_launch",
            title: "Career Acceleration",
            description: "Our dedicated career team works with you from day one to define your goals and open doors to opportunities. Benefit from exclusive hiring events, interview coaching, and portfolio development.",
            highlight: "93% employment success",
            color: "#8b5cf6"
        }
    ];
    
    // Additional features with improved content
    const additionalFeatures = [
        {
            icon: "verified",
            title: "Industry-Recognized Certifications",
            description: "Graduate with more than just a diploma. Our programs include preparation for top certifications that employers value, giving you multiple credentials to showcase your expertise.",
            highlight: "8 certification pathways",
            color: "#ec4899"
        },
        {
            icon: "support_agent",
            title: "Personalized Learning Support",
            description: "Never feel lost in your learning journey. Our mentors provide 1:1 guidance, while our comprehensive digital platform offers 24/7 access to resources, practice exercises, and community support.",
            highlight: "Unlimited mentor sessions",
            color: "#14b8a6"
        }
    ];
    
    // Determine which features to display
    const displayFeatures = showAllFeatures ? 
        [...coreFeatures, ...additionalFeatures] : 
        coreFeatures;
        
    return (
        <section className="about-section" id="about" ref={sectionRef}>
            <div className="about-shapes">
                <div className="about-shape shape-1"></div>
                <div className="about-shape shape-2"></div>
                <div className="about-shape shape-3"></div>
            </div>
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">Your Path to Success</span>
                    <h2>The FIA Advantage</h2>
                    <p className="section-subtitle">Discover why top employers seek out our graduates and what sets our education approach apart in the tech industry.</p>
                </div>
                
                {/* Added features-container div for better spacing control */}
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
                            <img src="/images/campus-learning.jpg" alt="Students at Forum Information Academy" />
                        </div>
                        <div className="cta-content">
                            <span className="cta-badge">Discover More</span>
                            <h3>Beyond the Classroom</h3>
                            <p>Explore our unique learning philosophy, state-of-the-art facilities, and hear from students who transformed their careers with FIA. We're more than just courses—we're a community dedicated to your success in tech.</p>
                            <div className="cta-stats">
                                <div className="cta-stat">
                                    <span className="stat-number">15+</span>
                                    <span className="stat-label">Years of Excellence</span>
                                </div>
                                <div className="cta-stat">
                                    <span className="stat-number">5,000+</span>
                                    <span className="stat-label">Successful Graduates</span>
                                </div>
                            </div>
                            <Link to="/about" className="btn-learn-more">
                                Explore Our Story
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                )}
                
                <div className="testimonial-preview">
                    <div className="testimonial-quote">
                        <span className="quote-icon material-icons">format_quote</span>
                        <blockquote>
                            The practical focus and industry connections at FIA completely changed my career trajectory. Within two months of graduating, I had multiple job offers from top tech companies.
                        </blockquote>
                        <div className="quote-author">
                            <img src="/images/student-profile.jpg" alt="Yuki Tanaka" className="author-image" />
                            <div className="author-info">
                                <span className="author-name">Yuki Tanaka</span>
                                <span className="author-title">Software Engineer at TechVision Inc., Class of 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
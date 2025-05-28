import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/AboutPage.css';
import AboutSection from '../components/AboutSection';
import storyImage from '../assets/images/logo1.png';

const AboutPage = () => {
    const { t } = useTranslation(); // Add this line only
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const heroRef = useRef(null);
    
    // Keep ALL your existing animation code exactly as is
    useEffect(() => {
        // Make hero visible with animation
        setIsHeroVisible(true);
        
        // Create animated elements for hero section
        createHeroAnimatedElements();
        
        const sections = document.querySelectorAll('.about-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
        
        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
            
            // Cleanup animated elements
            const elements = document.querySelector('.about-hero-elements');
            if (elements) {
                while (elements.firstChild) {
                    elements.removeChild(elements.firstChild);
                }
            }
        };
    }, []);
    
    // Keep ALL your existing createHeroAnimatedElements function exactly as is
    const createHeroAnimatedElements = () => {
        const container = document.querySelector('.about-hero-elements');
        if (!container) return;
        
        // Clear existing elements
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create animated shapes
        for (let i = 0; i < 20; i++) {
            const shape = document.createElement('div');
            shape.className = 'about-shape';
            
            // Random shape type
            const shapes = ['circle', 'triangle', 'square', 'plus'];
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            shape.classList.add(`shape-${shapeType}`);
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 30 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            const animationDelay = Math.random() * 5;
            const animationDuration = Math.random() * 20 + 10;
            
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.opacity = opacity;
            shape.style.animationDelay = `${animationDelay}s`;
            shape.style.animationDuration = `${animationDuration}s`;
            
            container.appendChild(shape);
        }
        
        // Create floating icons
        const icons = ['school', 'computer', 'people', 'lightbulb', 'code', 'psychology'];
        for (let i = 0; i < 6; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'about-hero-icon';
            
            const x = 10 + (Math.random() * 80);
            const y = 10 + (Math.random() * 80);
            const delay = Math.random() * 5;
            
            iconWrapper.style.left = `${x}%`;
            iconWrapper.style.top = `${y}%`;
            iconWrapper.style.animationDelay = `${delay}s`;
            
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = icons[i % icons.length];
            
            iconWrapper.appendChild(icon);
            container.appendChild(iconWrapper);
        }
    };
    
    return (
        <div className="about-page">
            {/* Keep ALL your hero structure - only replace text */}
            <section 
                ref={heroRef}
                className={`about-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                {/* Keep ALL background elements exactly as is */}
                <div className="about-hero-bg">
                    <div className="about-hero-elements"></div>
                    <div className="about-glow about-glow-1"></div>
                    <div className="about-glow about-glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="about-hero-content">
                        <div className="about-hero-badge">
                            <span className="material-icons">auto_awesome</span>
                            {t('about.hero.badge')}
                        </div>
                        
                        <h1 className="about-hero-title">
                            {t('about.hero.title')} <span className="highlight-text">{t('about.hero.highlight')}</span>
                        </h1>
                        
                        <p className="about-hero-description">
                            {t('about.hero.description')}
                        </p>
                        
                        <div className="about-hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">{t('about.stats.yearsExcellence')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">5,000+</div>
                                <div className="stat-label">{t('about.stats.graduates')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">200+</div>
                                <div className="stat-label">{t('about.stats.partners')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">{t('about.stats.employmentRate')}</div>
                            </div>
                        </div>
                        
                        <div className="about-hero-actions">
                            <a href="#our-story" className="btn btn-primary">{t('about.hero.ourJourney')}</a>
                            <a href="/contact" className="btn btn-outline">{t('about.hero.getInTouch')}</a>
                        </div>
                    </div>
                </div>
                
                <div className="scroll-indicator">
                    <a href="#our-story">
                        <span>{t('about.hero.discoverStory')}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Keep ALL your story section structure - only replace text */}
            <section id="our-story" className="about-section our-story">
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.story.title')}</h2>
                        <p>{t('about.story.subtitle')}</p>
                    </div>
                    <div className="story-content">
                        <div className="story-image">
                            <img src={storyImage} alt={t('about.story.imageAlt')} />
                        </div>
                        <div className="story-text">
                            <p>{t('about.story.paragraph1')}</p>
                            <p>{t('about.story.paragraph2')}</p>
                            <p>{t('about.story.paragraph3')}</p>
                            
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2010</h4>
                                        <p>{t('about.timeline.founded')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2013</h4>
                                        <p>{t('about.timeline.dataScience')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2016</h4>
                                        <p>{t('about.timeline.osaka')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2020</h4>
                                        <p>{t('about.timeline.celebration')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL structure - only replace text */}
            <section className="about-section why-choose-us" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.whyChoose.title')}</h2>
                        <p>{t('about.whyChoose.subtitle')}</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">business</span>
                            </div>
                            <h3>{t('about.features.partnerships.title')}</h3>
                            <p>{t('about.features.partnerships.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">people</span>
                            </div>
                            <h3>{t('about.features.instructors.title')}</h3>
                            <p>{t('about.features.instructors.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">laptop_mac</span>
                            </div>
                            <h3>{t('about.features.facilities.title')}</h3>
                            <p>{t('about.features.facilities.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">work</span>
                            </div>
                            <h3>{t('about.features.careerServices.title')}</h3>
                            <p>{t('about.features.careerServices.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">school</span>
                            </div>
                            <h3>{t('about.features.certifications.title')}</h3>
                            <p>{t('about.features.certifications.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">support</span>
                            </div>
                            <h3>{t('about.features.support.title')}</h3>
                            <p>{t('about.features.support.description')}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL structure - only replace text */}
            <section className="about-section mission-vision">
                <div className="container">
                    <div className="mission-vision-grid">
                        <div className="mission-box">
                            <h2>{t('about.mission.title')}</h2>
                            <p>{t('about.mission.description')}</p>
                            <div className="mission-icon">
                                <span className="material-icons">lightbulb</span>
                            </div>
                        </div>
                        <div className="vision-box">
                            <h2>{t('about.vision.title')}</h2>
                            <p>{t('about.vision.description')}</p>
                            <div className="vision-icon">
                                <span className="material-icons">visibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL team structure - only replace text */}
            <section className="about-section team-section" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.team.title')}</h2>
                        <p>{t('about.team.subtitle')}</p>
                    </div>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.shashini.name')}</h3>
                                <p className="member-role">{t('about.team.members.shashini.role')}</p>
                                <p className="member-bio">{t('about.team.members.shashini.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.thilini.name')}</h3>
                                <p className="member-role">{t('about.team.members.thilini.role')}</p>
                                <p className="member-bio">{t('about.team.members.thilini.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.diushan.name')}</h3>
                                <p className="member-role">{t('about.team.members.diushan.role')}</p>
                                <p className="member-bio">{t('about.team.members.diushan.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.john.name')}</h3>
                                <p className="member-role">{t('about.team.members.john.role')}</p>
                                <p className="member-bio">{t('about.team.members.john.bio')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
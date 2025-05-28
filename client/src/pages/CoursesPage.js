import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import CourseSection from '../components/CourseSection';
import StatsSection from '../components/StatsSection';
import NewsSection from '../components/NewsSection';
import '../styles/CoursesPage.css';

const CoursesPage = () => {
    const { t } = useTranslation(); // Add this line only
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Keep ALL your existing useEffect code exactly as is
    useEffect(() => {
        setIsVisible(true);
        
        // Optional: Add 3D animation for cubes
        const createCubes = () => {
            const world = document.querySelector('.world');
            if (!world) return;
            
            for (let i = 0; i < 15; i++) {
                const cube = document.createElement('div');
                cube.className = 'cube';
                
                // Random position
                const x = (Math.random() - 0.5) * 1000;
                const y = (Math.random() - 0.5) * 1000;
                const z = (Math.random() - 0.5) * 1000;
                
                // Random size
                const size = Math.random() * 50 + 20;
                
                cube.style.width = `${size}px`;
                cube.style.height = `${size}px`;
                cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
                
                // Add faces
                ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
                    const el = document.createElement('div');
                    el.className = `cube-face ${face}`;
                    cube.appendChild(el);
                });
                
                world.appendChild(cube);
            }
        };
        
        createCubes();
        
        // Clean up function
        return () => {
            const world = document.querySelector('.world');
            if (world) {
                while (world.firstChild) {
                    world.removeChild(world.firstChild);
                }
            }
        };
    }, []);

    return (
        <div className="courses-page">
            {/* Keep ALL your existing 3D hero structure - only replace text */}
            <section ref={sectionRef} className={`courses-hero ${isVisible ? 'visible' : ''}`}>
                {/* Keep ALL your 3D Scene code exactly as is */}
                <div className="scene">
                    <div className="world">
                        <div className="floor"></div>
                        {/* Cubes will be added by JavaScript */}
                    </div>
                    
                    {/* Glowing effects */}
                    <div className="glow glow-1"></div>
                    <div className="glow glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-badge">
                                <span className="badge-icon material-icons">school</span>
                                {t('courses.hero.badge')}
                            </div>
                            <h1 className="hero-title">{t('courses.hero.title')} <span className="highlight-text">{t('courses.hero.highlight')}</span></h1>
                            <p className="hero-description">{t('courses.hero.description')}</p>
                            
                            <div className="hero-cta-group">
                                <button className="btn btn-primary">
                                    <span className="material-icons">search</span>
                                    {t('courses.hero.findCourse')}
                                </button>
                                <button className="btn btn-outline">
                                    <span className="material-icons">info</span>
                                    {t('courses.hero.programGuide')}
                                </button>
                            </div>
                            
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">30+</div>
                                    <div className="stat-label">{t('courses.stats.courses')}</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">95%</div>
                                    <div className="stat-label">{t('courses.stats.jobPlacement')}</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">4.9</div>
                                    <div className="stat-label">{t('courses.stats.studentRating')}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hero-image-wrapper">
                            <div className="image-card">
                                <img 
                                    src={require('../assets/images/png5.jpg')} 
                                    alt={t('courses.hero.imageAlt')} 
                                    className="hero-image" 
                                />
                                <div className="image-overlay"></div>
                                <div className="tech-tag-group">
                                    <div className="tech-tag">{t('courses.webDevelopment')}</div>
                                    <div className="tech-tag">{t('courses.dataScience')}</div>
                                    <div className="tech-tag">{t('courses.cybersecurity')}</div>
                                    <div className="tech-tag">{t('courses.cloudComputing')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL your filter structure - only replace text */}
            <div id="courses" className="course-filters-container">
                <div className="container">
                    <div className="course-filters">
                        <button className="filter-btn active">
                            <span className="material-icons">school</span>
                            {t('courses.allCategories')}
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">code</span>
                            {t('courses.webDevelopment')}
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">analytics</span>
                            {t('courses.dataScience')}
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">security</span>
                            {t('courses.cybersecurity')}
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">cloud</span>
                            {t('courses.cloudComputing')}
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">smart_toy</span>
                            {t('courses.aiMl')}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Keep ALL your existing sections exactly as they are */}
            <section className="courses-section">
                <div className="container">
                    <CourseSection />
                    
                    {/* Pagination - keep exactly as is */}
                    <div className="pagination">
                        <button className="pagination-btn">
                            <span className="material-icons">chevron_left</span>
                        </button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <button className="pagination-btn">
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>
            
            <section className="stats-section">
                <div className="container">
                    <StatsSection />
                </div>
            </section>
            
            <section className="news-section">
                <div className="container">
                    <div className="section-header">
                        <h2>{t('courses.news.title')}</h2>
                        <p>{t('courses.news.description')}</p>
                    </div>
                    <NewsSection />
                </div>
            </section>
        </div>
    );
};

export default CoursesPage;
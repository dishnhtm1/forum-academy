import React, { useState, useEffect, useRef } from 'react';
import CourseSection from '../components/CourseSection';
import StatsSection from '../components/StatsSection';
import NewsSection from '../components/NewsSection';
import '../styles/CoursesPage.css';

const CoursesPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Effect for animation visibility
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
            {/* Enhanced 3D hero section for courses page */}
            <section ref={sectionRef} className={`courses-hero ${isVisible ? 'visible' : ''}`}>
                {/* 3D Scene */}
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
                                Future-ready education
                            </div>
                            <h1 className="hero-title">Explore Our <span className="highlight-text">IT Courses</span></h1>
                            <p className="hero-description">Discover industry-leading curriculum designed to prepare you for a successful career in technology. Learn from experts and gain practical skills that employers value.</p>
                            
                            <div className="hero-cta-group">
                                <button className="btn btn-primary">
                                    <span className="material-icons">search</span>
                                    Find Your Course
                                </button>
                                <button className="btn btn-outline">
                                    <span className="material-icons">info</span>
                                    Program Guide
                                </button>
                            </div>
                            
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">30+</div>
                                    <div className="stat-label">Courses</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">95%</div>
                                    <div className="stat-label">Job Placement</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">4.9</div>
                                    <div className="stat-label">Student Rating</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hero-image-wrapper">
                            <div className="image-card">
                                <img 
                                    src={require('../assets/images/AI1.png')} 
                                    alt="AI technology visualization" 
                                    className="hero-image" 
                                />
                                <div className="image-overlay"></div>
                                <div className="tech-tag-group">
                                    <div className="tech-tag">Web Development</div>
                                    <div className="tech-tag">Data Science</div>
                                    <div className="tech-tag">Cybersecurity</div>
                                    <div className="tech-tag">Cloud Computing</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Course filters */}
            <div id="courses" className="course-filters-container">
                <div className="container">
                    <div className="course-filters">
                        <button className="filter-btn active">
                            <span className="material-icons">school</span>
                            All Courses
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">code</span>
                            Web Development
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">analytics</span>
                            Data Science
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">security</span>
                            Cybersecurity
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">cloud</span>
                            Cloud Computing
                        </button>
                        <button className="filter-btn">
                            <span className="material-icons">smart_toy</span>
                            Artificial Intelligence
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Courses section */}
            <section className="courses-section">
                <div className="container">
                    <CourseSection />
                    
                    {/* Pagination */}
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
                        <h2>Latest News</h2>
                        <p>Stay updated with the latest developments in our academy and the IT industry.</p>
                    </div>
                    <NewsSection />
                </div>
            </section>
        </div>
    );
};

export default CoursesPage;
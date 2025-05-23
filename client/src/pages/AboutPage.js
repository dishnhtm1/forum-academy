import React, { useEffect, useState, useRef } from 'react';
import '../styles/AboutPage.css';
import AboutSection from '../components/AboutSection';
import storyImage from '../assets/images/logo1.png';

const AboutPage = () => {
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const heroRef = useRef(null);
    
    // Animation effect for sections when they come into view
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
    
    // Create animated elements for the hero section
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
            {/* Enhanced Hero Section */}
            <section 
                ref={heroRef}
                className={`about-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                {/* Background elements */}
                <div className="about-hero-bg">
                    <div className="about-hero-elements"></div>
                    <div className="about-glow about-glow-1"></div>
                    <div className="about-glow about-glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="about-hero-content">
                        <div className="about-hero-badge">
                            <span className="material-icons">auto_awesome</span>
                            Established in 2010
                        </div>
                        
                        <h1 className="about-hero-title">
                            Shaping the Future of <span className="highlight-text">IT Education</span>
                        </h1>
                        
                        <p className="about-hero-description">
                            We are committed to bridging the gap between traditional education and 
                            the rapidly evolving needs of the tech industry, creating pathways 
                            to success for the next generation of tech leaders.
                        </p>
                        
                        <div className="about-hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">Years of Excellence</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">5,000+</div>
                                <div className="stat-label">Successful Graduates</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">200+</div>
                                <div className="stat-label">Industry Partners</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">Employment Rate</div>
                            </div>
                        </div>
                        
                        <div className="about-hero-actions">
                            <a href="#our-story" className="btn btn-primary">Our Journey</a>
                            <a href="/contact" className="btn btn-outline">Get in Touch</a>
                        </div>
                    </div>
                </div>
                
                <div className="scroll-indicator">
                    <a href="#our-story">
                        <span>Discover Our Story</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Our Story Section - Kept intact as requested */}
            <section id="our-story" className="about-section our-story">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Story</h2>
                        <p>How we became Japan's leading IT education provider</p>
                    </div>
                    <div className="story-content">
                        <div className="story-image">
                            <img src={storyImage} alt="Forum Information Academy Campus" />
                        </div>
                        <div className="story-text">
                            <p>Forum Information Academy was founded in 2010 with a mission to bridge the gap between traditional education and the rapidly evolving needs of the tech industry.</p>
                            <p>Starting with just 15 students and 3 instructors in a small office in Shibuya, we have grown into one of Japan's most respected IT education institutions, with over 5,000 graduates who have gone on to successful careers in technology.</p>
                            <p>Our journey has been defined by a commitment to excellence, innovation, and student success. As technology evolves, so do we, continuously updating our curriculum to ensure our students are prepared for the challenges of tomorrow.</p>
                            
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2010</h4>
                                        <p>Founded in Shibuya, Tokyo</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2013</h4>
                                        <p>Expanded curriculum to include data science</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2016</h4>
                                        <p>Opened new campus in Osaka</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2020</h4>
                                        <p>Celebrated 10 years with 5,000+ graduates</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Us Section - Kept intact */}
            <section className="about-section why-choose-us" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Forum Information Academy</h2>
                        <p>We're dedicated to providing cutting-edge IT education that prepares students for the real world.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">business</span>
                            </div>
                            <h3>Industry Partnerships</h3>
                            <p>We collaborate with leading tech companies to ensure our curriculum meets industry standards and provides real-world experience.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">people</span>
                            </div>
                            <h3>Expert Instructors</h3>
                            <p>Learn from professionals with years of industry experience who bring practical knowledge and insights to the classroom.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">laptop_mac</span>
                            </div>
                            <h3>Modern Facilities</h3>
                            <p>Our campus features state-of-the-art computer labs, collaborative workspaces, and the latest technology tools.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">work</span>
                            </div>
                            <h3>Career Services</h3>
                            <p>We provide comprehensive job placement assistance, resume workshops, interview preparation, and networking opportunities.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">school</span>
                            </div>
                            <h3>Industry-Recognized Certifications</h3>
                            <p>Our courses prepare students for top industry certifications that enhance employability and career advancement.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">support</span>
                            </div>
                            <h3>Student Support</h3>
                            <p>Our dedicated support team ensures that students receive the guidance and resources they need throughout their learning journey.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Mission & Vision - Kept intact */}
            <section className="about-section mission-vision">
                <div className="container">
                    <div className="mission-vision-grid">
                        <div className="mission-box">
                            <h2>Our Mission</h2>
                            <p>To empower individuals with the skills, knowledge, and support they need to thrive in the digital economy and shape the future of technology.</p>
                            <div className="mission-icon">
                                <span className="material-icons">lightbulb</span>
                            </div>
                        </div>
                        <div className="vision-box">
                            <h2>Our Vision</h2>
                            <p>To be the premier technology education institution in Asia, known for innovative teaching methods and producing graduates who lead technological innovation globally.</p>
                            <div className="vision-icon">
                                <span className="material-icons">visibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Our Team */}
            <section className="about-section team-section" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Meet Our Leadership Team</h2>
                        <p>The experienced professionals guiding our academy</p>
                    </div>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-info">
                                <h3>Shashini Kavindya</h3>
                                <p className="member-role">Backend Developer Intern</p>
                                <p className="member-bio">Talented developer focusing on backend systems with expertise in database management and API development.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>Thilini Rajaguru</h3>
                                <p className="member-role">Frontend Developer</p>
                                <p className="member-bio">Creative UI/UX specialist with a passion for building responsive and user-friendly web applications.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>Diushan Meshaka</h3>
                                <p className="member-role">DevOps Engineer</p>
                                <p className="member-bio">Cloud specialist with excellent Git expertise who manages deployment pipelines and version control for all academy projects.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>John Gabriel Bagacina</h3>
                                <p className="member-role">Full Stack Developer</p>
                                <p className="member-bio">Versatile engineer with expertise in both frontend and backend technologies, creating complete web solutions from database to user interface.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
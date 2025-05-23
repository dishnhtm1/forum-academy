import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CourseSection.css';

const CourseSection = ({ limit, showFilters = false, title = "Our Featured Courses" }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleCourses, setVisibleCourses] = useState(3);
    const sectionRef = useRef(null);
    
    const courses = [
        {
            id: 'web-dev',
            title: 'Full-Stack Web Development',
            description: 'Master both front-end and back-end technologies to build complete web applications. Learn HTML, CSS, JavaScript, React, Node.js, and database integration.',
            image: '/images/web3.png',
            duration: '12 Weeks',
            startDate: 'Jun 1',
            price: '¥350,000',
            category: 'Web Development',
            badgeColor: 'primary',
            level: 'Beginner-Intermediate',
            features: ['24 Projects', 'Career Support', 'Industry Mentors']
        },
        {
            id: 'data-science',
            title: 'Data Science & Analytics',
            description: 'Learn to analyze and interpret complex data sets using Python, R, SQL, and visualization tools. Includes machine learning fundamentals and real-world projects.',
            image: '/images/data3.png',
            duration: '16 Weeks',
            startDate: 'May 15',
            price: '¥420,000',
            category: 'Data Science',
            badgeColor: 'success',
            level: 'Intermediate',
            features: ['Real-world Datasets', 'Portfolio Building', 'Industry Partnerships']
        },
        {
            id: 'cybersecurity',
            title: 'Cybersecurity Specialist',
            description: 'Develop skills to protect systems and networks from digital attacks. Learn threat detection, ethical hacking, security protocols, and incident response.',
            image: '/images/cyber1.png',
            duration: '14 Weeks',
            startDate: 'Jun 15',
            price: '¥400,000',
            category: 'Cybersecurity',
            badgeColor: 'danger',
            level: 'Intermediate-Advanced',
            features: ['Security Lab', 'Certification Prep', 'Live Simulations']
        },
        {
            id: 'cloud-computing',
            title: 'Cloud Computing & DevOps',
            description: 'Master cloud platforms like AWS, Azure, and Google Cloud. Learn infrastructure as code, containerization, CI/CD pipelines, and microservices architecture.',
            image: '/images/cloud1.png',
            duration: '10 Weeks',
            startDate: 'Jul 5',
            price: '¥380,000',
            category: 'Cloud Computing',
            badgeColor: 'info',
            level: 'Intermediate',
            features: ['AWS/Azure Credits', 'Industry Projects', 'Certification Prep']
        },
        {
            id: 'ai-ml',
            title: 'Artificial Intelligence & Machine Learning',
            description: 'Dive deep into AI algorithms, neural networks, deep learning, and natural language processing. Build intelligent systems that learn and adapt.',
            image: '/images/AI2.png',
            duration: '18 Weeks',
            startDate: 'Jun 10',
            price: '¥450,000',
            category: 'AI/ML',
            badgeColor: 'secondary',
            level: 'Advanced',
            features: ['GPU Lab Access', 'Research Projects', 'Industry Mentors']
        },
        {
            id: 'mobile-dev',
            title: 'Mobile App Development',
            description: 'Create native and cross-platform mobile applications. Master React Native, Flutter, iOS and Android development, and app deployment strategies.',
            image: '/images/mob1.png',
            duration: '12 Weeks',
            startDate: 'Jul 15',
            price: '¥370,000',
            category: 'Mobile Dev',
            badgeColor: 'warning',
            level: 'Intermediate',
            features: ['App Store Publishing', 'Portfolio Building', '1-on-1 Mentorship']
        }
    ];
    
    // Animation on scroll
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
    
    // Set initial visible courses based on the page
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
                    <span className="section-badge">Educational Programs</span>
                    <h2>{title}</h2>
                    <p>Accelerate your tech career with our industry-focused, practical programs</p>
                </div>
                
                {showFilters && (
                    <div className="course-filters">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => filterCourses('all')}
                        >
                            All Courses
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'web development' ? 'active' : ''}`}
                            onClick={() => filterCourses('web development')}
                        >
                            Web Development
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'data science' ? 'active' : ''}`}
                            onClick={() => filterCourses('data science')}
                        >
                            Data Science
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'cybersecurity' ? 'active' : ''}`}
                            onClick={() => filterCourses('cybersecurity')}
                        >
                            Cybersecurity
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'cloud computing' ? 'active' : ''}`}
                            onClick={() => filterCourses('cloud computing')}
                        >
                            Cloud Computing
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
                                            View Details
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
                                            Starts {course.startDate}
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
                                        Learn More
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
                            View All Courses
                            <span className="material-icons">expand_more</span>
                        </button>
                    </div>
                )}
                
                {window.location.pathname !== '/courses' && (
                    <div className="courses-cta">
                        <Link to="/courses" className="btn-all-courses">
                            Browse All Programs
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseSection;
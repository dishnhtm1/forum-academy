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
            
            
            <div id="courses" className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            
                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                            <span className="material-icons text-sm">tune</span>
                            {t('courses.categories.badge')}
                        </div>
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {t('courses.categories.title')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('courses.categories.highlight')}</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t('courses.categories.subtitle')}
                        </p>
                    </div>
            
                    {/* Enhanced Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        {/* All Categories Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            {/* Gradient background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            {/* Content */}
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-blue-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-blue-600 group-hover:text-white transition-colors duration-300">school</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.allCategories')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-blue-100 transition-colors duration-300">
                                        All Courses
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hover shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
            
                        {/* Web Development Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-green-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-green-600 group-hover:text-white transition-colors duration-300">code</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.webDevelopment')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-green-100 transition-colors duration-300">
                                        Frontend & Backend
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
            
                        {/* Data Science Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-orange-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-orange-600 group-hover:text-white transition-colors duration-300">analytics</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.dataScience')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-orange-100 transition-colors duration-300">
                                        AI & Machine Learning
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
            
                        {/* Cybersecurity Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-red-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-red-600 group-hover:text-white transition-colors duration-300">security</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.cybersecurity')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-red-100 transition-colors duration-300">
                                        Ethical Hacking
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
            
                        {/* Cloud Computing Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-cyan-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-cyan-600 group-hover:text-white transition-colors duration-300">cloud</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.cloudComputing')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-cyan-100 transition-colors duration-300">
                                        AWS & Azure
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
            
                        {/* AI & ML Button */}
                        <button className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-transparent">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="p-2 bg-purple-100 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                                    <span className="material-icons text-purple-600 group-hover:text-white transition-colors duration-300">smart_toy</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                                        {t('courses.aiMl')}
                                    </div>
                                    <div className="text-sm text-gray-500 group-hover:text-purple-100 transition-colors duration-300">
                                        Neural Networks
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>
                    </div>
            
                    {/* Statistics or Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
                            <div className="text-gray-600">Expert Courses</div>
                        </div>
                        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-green-600 mb-2">15k+</div>
                            <div className="text-gray-600">Happy Students</div>
                        </div>
                        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                            <div className="text-gray-600">Job Placement</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Keep ALL your existing sections exactly as they are */}
            <section className="courses-section">
                <div className="container">
                    <CourseSection />
                    
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

// import React, { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// // import { useNavigate } from 'react-router-dom';
// import '../styles/CoursesPage.css';

// const CoursesPage = () => {
//     const { t } = useTranslation();
//     // const navigate = useNavigate();
//     const [isVisible, setIsVisible] = useState(false);
//     const [activeFilter, setActiveFilter] = useState('all');
//     const sectionRef = useRef(null);

//     // Enhanced course data with more courses
//     const courses = [
//         {
//             id: 1,
//             title: "Full Stack Web Development",
//             category: "web-development",
//             level: "Beginner to Advanced",
//             duration: "12 weeks",
//             price: "¥35,000",
//             originalPrice: "¥45,000",
//             rating: 4.9,
//             students: 1250,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "John Smith",
//             description: "Master modern web development with React, Node.js, and MongoDB. Build real-world projects and deploy to production.",
//             highlights: ["Build 5 real projects", "24/7 mentorship", "Job placement support"],
//             badge: "Popular"
//         },
//         {
//             id: 2,
//             title: "Data Science & Analytics",
//             category: "data-science",
//             level: "Intermediate",
//             duration: "16 weeks",
//             price: "¥48,000",
//             originalPrice: "¥58,000",
//             rating: 4.8,
//             students: 980,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "Dr. Sarah Johnson",
//             description: "Learn Python, machine learning, and data visualization techniques with hands-on industry projects.",
//             highlights: ["Real datasets", "ML algorithms", "Portfolio projects"],
//             badge: "Best Value"
//         },
//         {
//             id: 3,
//             title: "Cybersecurity Fundamentals",
//             category: "cybersecurity",
//             level: "Beginner",
//             duration: "10 weeks",
//             price: "¥30,000",
//             originalPrice: "¥38,000",
//             rating: 4.7,
//             students: 750,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "Michael Chen",
//             description: "Protect digital assets and learn ethical hacking techniques through hands-on labs.",
//             highlights: ["Ethical hacking labs", "Security frameworks", "Industry certification prep"],
//             badge: "Hot"
//         },
//         {
//             id: 4,
//             title: "Cloud Computing with AWS",
//             category: "cloud-computing",
//             level: "Intermediate",
//             duration: "14 weeks",
//             price: "¥42,000",
//             originalPrice: "¥52,000",
//             rating: 4.8,
//             students: 890,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "Alex Rodriguez",
//             description: "Master AWS cloud services and modern cloud architecture. Prepare for AWS certification.",
//             highlights: ["AWS certification prep", "Real cloud projects", "Industry mentors"],
//             badge: "Trending"
//         },
//         {
//             id: 5,
//             title: "AI & Machine Learning",
//             category: "ai-ml",
//             level: "Advanced",
//             duration: "20 weeks",
//             price: "¥65,000",
//             originalPrice: "¥75,000",
//             rating: 4.9,
//             students: 650,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "Dr. Emily Watson",
//             description: "Deep dive into artificial intelligence and machine learning algorithms. Build AI applications.",
//             highlights: ["Neural networks", "Computer vision", "NLP projects"],
//             badge: "Premium"
//         },
//         {
//             id: 6,
//             title: "Mobile App Development",
//             category: "mobile-development",
//             level: "Intermediate",
//             duration: "12 weeks",
//             price: "¥38,000",
//             originalPrice: "¥48,000",
//             rating: 4.6,
//             students: 920,
//             image: require('../assets/images/png5.jpg'),
//             instructor: "James Park",
//             description: "Build native iOS and Android apps with React Native. Deploy to app stores.",
//             highlights: ["Cross-platform apps", "App store deployment", "UI/UX best practices"],
//             badge: "New"
//         }
//     ];

//     const filteredCourses = activeFilter === 'all' 
//         ? courses 
//         : courses.filter(course => course.category === activeFilter);

//     useEffect(() => {
//         setIsVisible(true);
        
//         const createCubes = () => {
//             const world = document.querySelector('.world');
//             if (!world) return;
            
//             for (let i = 0; i < 15; i++) {
//                 const cube = document.createElement('div');
//                 cube.className = 'cube';
                
//                 const x = (Math.random() - 0.5) * 1000;
//                 const y = (Math.random() - 0.5) * 1000;
//                 const z = (Math.random() - 0.5) * 1000;
//                 const size = Math.random() * 50 + 20;
                
//                 cube.style.width = `${size}px`;
//                 cube.style.height = `${size}px`;
//                 cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
                
//                 ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
//                     const el = document.createElement('div');
//                     el.className = `cube-face ${face}`;
//                     cube.appendChild(el);
//                 });
                
//                 world.appendChild(cube);
//             }
//         };
        
//         createCubes();
        
//         return () => {
//             const world = document.querySelector('.world');
//             if (world) {
//                 while (world.firstChild) {
//                     world.removeChild(world.firstChild);
//                 }
//             }
//         };
//     }, []);

//     const handleApply = (course) => {
//         // Navigate to application form with course data
//         navigate('/apply', { 
//             state: { 
//                 courseId: course.id,
//                 courseName: course.title,
//                 coursePrice: course.price,
//                 courseDuration: course.duration
//             } 
//         });
//     };

//     const getBadgeColor = (badge) => {
//         switch (badge) {
//             case 'Popular': return 'bg-red-500';
//             case 'Best Value': return 'bg-green-500';
//             case 'Hot': return 'bg-orange-500';
//             case 'Trending': return 'bg-purple-500';
//             case 'Premium': return 'bg-yellow-500';
//             case 'New': return 'bg-blue-500';
//             default: return 'bg-gray-500';
//         }
//     };

//     return (
//         <div className="courses-page">
//             {/* Hero Section */}
//             <section ref={sectionRef} className={`courses-hero ${isVisible ? 'visible' : ''}`}>
//                 <div className="scene">
//                     <div className="world">
//                         <div className="floor"></div>
//                     </div>
//                     <div className="glow glow-1"></div>
//                     <div className="glow glow-2"></div>
//                 </div>
                
//                 <div className="container">
//                     <div className="hero-content">
//                         <div className="hero-text">
//                             <div className="hero-badge">
//                                 <span className="badge-icon material-icons">school</span>
//                                 Transform Your Career
//                             </div>
//                             <h1 className="hero-title">Learn <span className="highlight-text">Future-Ready Skills</span></h1>
//                             <p className="hero-description">Join thousands of students mastering cutting-edge technologies with our industry-expert instructors and hands-on projects.</p>
                            
//                             <div className="hero-cta-group">
//                                 <button className="btn btn-primary">
//                                     <span className="material-icons">search</span>
//                                     Explore Courses
//                                 </button>
//                                 <button className="btn btn-outline">
//                                     <span className="material-icons">info</span>
//                                     Download Guide
//                                 </button>
//                             </div>
                            
//                             <div className="hero-stats">
//                                 <div className="stat-item">
//                                     <div className="stat-number">30+</div>
//                                     <div className="stat-label">Expert Courses</div>
//                                 </div>
//                                 <div className="stat-item">
//                                     <div className="stat-number">95%</div>
//                                     <div className="stat-label">Job Placement</div>
//                                 </div>
//                                 <div className="stat-item">
//                                     <div className="stat-number">4.9</div>
//                                     <div className="stat-label">Student Rating</div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="hero-image-wrapper">
//                             <div className="image-card">
//                                 <img 
//                                     src={require('../assets/images/png5.jpg')} 
//                                     alt="Students learning technology" 
//                                     className="hero-image" 
//                                 />
//                                 <div className="image-overlay"></div>
//                                 <div className="tech-tag-group">
//                                     <div className="tech-tag">Web Development</div>
//                                     <div className="tech-tag">Data Science</div>
//                                     <div className="tech-tag">Cybersecurity</div>
//                                     <div className="tech-tag">Cloud Computing</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* Course Filters */}
//             <div id="courses" className="py-16 bg-gray-50">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-12">
//                         <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
//                         <p className="text-xl text-gray-600 max-w-2xl mx-auto">Select from our comprehensive range of courses designed by industry experts</p>
//                     </div>
                    
//                     <div className="flex flex-wrap justify-center gap-4 mb-16">
//                         <button 
//                             onClick={() => setActiveFilter('all')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'all' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">school</span>
//                             All Categories
//                         </button>
//                         <button 
//                             onClick={() => setActiveFilter('web-development')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'web-development' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">code</span>
//                             Web Development
//                         </button>
//                         <button 
//                             onClick={() => setActiveFilter('data-science')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'data-science' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">analytics</span>
//                             Data Science
//                         </button>
//                         <button 
//                             onClick={() => setActiveFilter('cybersecurity')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'cybersecurity' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">security</span>
//                             Cybersecurity
//                         </button>
//                         <button 
//                             onClick={() => setActiveFilter('cloud-computing')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'cloud-computing' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">cloud</span>
//                             Cloud Computing
//                         </button>
//                         <button 
//                             onClick={() => setActiveFilter('ai-ml')}
//                             className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 ${
//                                 activeFilter === 'ai-ml' 
//                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
//                                     : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
//                             }`}
//                         >
//                             <span className="material-icons">smart_toy</span>
//                             AI & ML
//                         </button>
//                     </div>
                    
//                     {/* Courses Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//                         {filteredCourses.map((course) => (
//                             <div 
//                                 key={course.id} 
//                                 className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group overflow-hidden border border-gray-100"
//                             >
//                                 <div className="relative overflow-hidden">
//                                     <img 
//                                         src={course.image} 
//                                         alt={course.title}
//                                         className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
//                                     />
                                    
//                                     {/* Badge */}
//                                     <div className={`absolute top-4 left-4 ${getBadgeColor(course.badge)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
//                                         {course.badge}
//                                     </div>
                                    
//                                     {/* Rating */}
//                                     <div className="absolute top-4 right-4 bg-white bg-opacity-95 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
//                                         <span className="material-icons text-yellow-400 text-sm">star</span>
//                                         <span className="text-sm font-bold text-gray-800">{course.rating}</span>
//                                     </div>
                                    
//                                     {/* Price */}
//                                     <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
//                                         <div className="text-center">
//                                             <div className="text-lg font-bold">{course.price}</div>
//                                             <div className="text-xs line-through opacity-75">{course.originalPrice}</div>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="p-8">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm text-blue-600 font-semibold capitalize bg-blue-50 px-3 py-1 rounded-full">
//                                             {course.category.replace('-', ' ')}
//                                         </span>
//                                         <span className="text-sm text-gray-500 font-medium">{course.level}</span>
//                                     </div>
                                    
//                                     <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
//                                         {course.title}
//                                     </h3>
                                    
//                                     <p className="text-gray-600 mb-4 leading-relaxed">
//                                         {course.description}
//                                     </p>
                                    
//                                     {/* Highlights */}
//                                     <div className="mb-6">
//                                         <div className="space-y-2">
//                                             {course.highlights.map((highlight, index) => (
//                                                 <div key={index} className="flex items-center gap-2">
//                                                     <span className="material-icons text-green-500 text-sm">check_circle</span>
//                                                     <span className="text-sm text-gray-700">{highlight}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
                                    
//                                     {/* Course Info */}
//                                     <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
//                                         <div className="flex items-center gap-2">
//                                             <span className="material-icons text-sm">schedule</span>
//                                             <span>{course.duration}</span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className="material-icons text-sm">people</span>
//                                             <span>{course.students.toLocaleString()} students</span>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Instructor */}
//                                     <div className="flex items-center gap-3 mb-6">
//                                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                                             <span className="text-white font-bold text-sm">{course.instructor.split(' ').map(n => n[0]).join('')}</span>
//                                         </div>
//                                         <div>
//                                             <div className="text-sm font-semibold text-gray-900">{course.instructor}</div>
//                                             <div className="text-xs text-gray-500">Course Instructor</div>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Action Buttons */}
//                                     <div className="flex gap-3">
//                                         <button 
//                                             onClick={() => handleApply(course)}
//                                             className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
//                                         >
//                                             <span className="material-icons">school</span>
//                                             Apply Now
//                                         </button>
//                                         <button className="px-4 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
//                                             <span className="material-icons text-gray-500 group-hover:text-blue-500">favorite_border</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CoursesPage;
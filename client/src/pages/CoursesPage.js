import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CourseSection from '../components/CourseSection';
import StatsSection from '../components/StatsSection';
import NewsSection from '../components/NewsSection';
import CourseModal from '../components/CourseModal';
import TestModal from '../components/TestModal';
import '../styles/CoursesPage.css';

const CoursesPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedCardPosition, setClickedCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const sectionRef = useRef(null);
    
    // Handle enrollment - redirect to application form
    const handleEnroll = (courseId) => {
        // Store the selected course ID in localStorage for the application form
        localStorage.setItem('selectedCourseId', courseId);
        // Close modal first
        closeModal();
        // Navigate to application form
        history.push('/apply');
    };

    // Course data with detailed information - using useMemo to ensure translations are ready
    const coursesData = React.useMemo(() => [
        {
            id: 'web-dev',
            title: t('courses.courseData.webDev.title'),
            description: t('courses.courseData.webDev.description'),
            image: require('../assets/courses/web.jpg'),
            duration: t('courses.courseData.webDev.duration'),
            startDate: t('courses.courseData.webDev.startDate'),
            price: '¥350,000',
            originalPrice: '¥450,000',
            category: t('courses.courseData.webDev.category'),
            badgeColor: 'blue',
            level: t('courses.courseData.webDev.level'),
            rating: 4.9,
            students: 2847,
            instructor: 'Dr. Sarah Johnson',
            features: t('courses.courseData.webDev.features', { returnObjects: true }),
            curriculum: [
                'HTML5 & CSS3 Fundamentals (2 weeks)',
                'JavaScript ES6+ Advanced (3 weeks)',
                'React.js & Redux (4 weeks)',
                'Node.js & Express (3 weeks)',
                'MongoDB & Database Design (2 weeks)',
                'RESTful API Development (2 weeks)',
                'Authentication & Security (2 weeks)',
                'Deployment & DevOps (2 weeks)',
                'Capstone Project (4 weeks)'
            ],
            requirements: [
                'Basic computer literacy',
                'High school diploma or equivalent',
                'Commitment to 40+ hours per week',
                'Access to a computer with internet',
                'No prior programming experience required'
            ],
            whatYouWillLearn: [
                'Build responsive, mobile-first web applications',
                'Master modern JavaScript frameworks and libraries',
                'Create secure RESTful APIs and microservices',
                'Implement user authentication and authorization',
                'Deploy applications to cloud platforms (AWS, Vercel)',
                'Work with databases and data management systems',
                'Use version control with Git and GitHub',
                'Apply software engineering best practices'
            ],
            careerOutcomes: [
                'Frontend Developer (¥4.5M - ¥7M annually)',
                'Backend Developer (¥5M - ¥8M annually)',
                'Full-Stack Developer (¥6M - ¥10M annually)',
                'Web Application Developer (¥4M - ¥7M annually)',
                'Software Engineer (¥5M - ¥9M annually)'
            ],
            jobPlacement: '95%',
            averageSalary: '¥6.2M',
            companies: ['Google', 'Microsoft', 'Amazon', 'Rakuten', 'Mercari', 'CyberAgent']
        },
        {
            id: 'data-science',
            title: t('courses.courseData.dataScience.title'),
            description: t('courses.courseData.dataScience.description'),
            image: require('../assets/courses/data.jpg'),
            duration: t('courses.courseData.dataScience.duration'),
            startDate: t('courses.courseData.dataScience.startDate'),
            price: '¥420,000',
            originalPrice: '¥520,000',
            category: t('courses.courseData.dataScience.category'),
            badgeColor: 'green',
            level: t('courses.courseData.dataScience.level'),
            rating: 4.8,
            students: 1923,
            instructor: 'Prof. Michael Chen',
            features: t('courses.courseData.dataScience.features', { returnObjects: true }),
            curriculum: [
                'Python Programming for Data Science (3 weeks)',
                'Statistics & Probability (4 weeks)',
                'Data Visualization with Matplotlib/Seaborn (2 weeks)',
                'Machine Learning Algorithms (6 weeks)',
                'Deep Learning with TensorFlow/PyTorch (4 weeks)',
                'Big Data Processing with Spark (3 weeks)',
                'SQL & Database Management (2 weeks)',
                'Data Engineering & ETL (3 weeks)',
                'Capstone Project (6 weeks)'
            ],
            requirements: [
                'Bachelor\'s degree in STEM field preferred',
                'Basic programming knowledge (Python recommended)',
                'Strong mathematics background',
                'Commitment to 35+ hours per week',
                'Access to a computer with internet'
            ],
            whatYouWillLearn: [
                'Analyze large datasets using Python and R',
                'Build and deploy machine learning models',
                'Create compelling data visualizations and dashboards',
                'Implement deep learning algorithms for complex problems',
                'Work with big data technologies (Spark, Hadoop)',
                'Communicate data insights to business stakeholders',
                'Use cloud platforms for data science workflows',
                'Apply statistical methods to real-world problems'
            ],
            careerOutcomes: [
                'Data Scientist (¥6M - ¥12M annually)',
                'Machine Learning Engineer (¥7M - ¥15M annually)',
                'Data Analyst (¥4M - ¥8M annually)',
                'Business Intelligence Analyst (¥5M - ¥9M annually)',
                'Research Scientist (¥8M - ¥18M annually)'
            ],
            jobPlacement: '92%',
            averageSalary: '¥8.5M',
            companies: ['Sony', 'SoftBank', 'LINE', 'DeNA', 'Preferred Networks', 'ABEJA']
        },
        {
            id: 'cybersecurity',
            title: t('courses.courseData.cybersecurity.title'),
            description: t('courses.courseData.cybersecurity.description'),
            image: require('../assets/courses/cyber.jpg'),
            duration: t('courses.courseData.cybersecurity.duration'),
            startDate: t('courses.courseData.cybersecurity.startDate'),
            price: '¥400,000',
            originalPrice: '¥500,000',
            category: t('courses.courseData.cybersecurity.category'),
            badgeColor: 'red',
            level: t('courses.courseData.cybersecurity.level'),
            rating: 4.7,
            students: 1654,
            instructor: 'Alex Rodriguez',
            features: t('courses.courseData.cybersecurity.features', { returnObjects: true }),
            curriculum: [
                'Network Security Fundamentals (3 weeks)',
                'Ethical Hacking Techniques (4 weeks)',
                'Penetration Testing (4 weeks)',
                'Cryptography & Encryption (3 weeks)',
                'Incident Response & Forensics (3 weeks)',
                'Security Architecture Design (3 weeks)',
                'Risk Assessment & Management (2 weeks)',
                'Compliance & Governance (2 weeks)',
                'Capstone Security Project (4 weeks)'
            ],
            requirements: [
                'Basic networking knowledge (CCNA level)',
                'Understanding of operating systems',
                'Strong analytical and problem-solving skills',
                'Commitment to 30+ hours per week',
                'Access to a computer with internet'
            ],
            whatYouWillLearn: [
                'Identify and exploit security vulnerabilities',
                'Conduct comprehensive penetration tests',
                'Implement enterprise security solutions',
                'Respond to and investigate security incidents',
                'Design secure network and system architectures',
                'Ensure compliance with security regulations',
                'Use industry-standard security tools',
                'Develop security policies and procedures'
            ],
            careerOutcomes: [
                'Cybersecurity Analyst (¥5M - ¥9M annually)',
                'Penetration Tester (¥6M - ¥11M annually)',
                'Security Consultant (¥7M - ¥13M annually)',
                'Incident Response Specialist (¥6M - ¥10M annually)',
                'Security Architect (¥8M - ¥15M annually)'
            ],
            jobPlacement: '89%',
            averageSalary: '¥8.2M',
            companies: ['NTT Security', 'Trend Micro', 'Symantec', 'IBM Security', 'Accenture', 'Deloitte']
        },
        {
            id: 'cloud-computing',
            title: t('courses.courseData.cloudComputing.title'),
            description: t('courses.courseData.cloudComputing.description'),
            image: require('../assets/courses/cloud.jpg'),
            duration: t('courses.courseData.cloudComputing.duration'),
            startDate: t('courses.courseData.cloudComputing.startDate'),
            price: '¥380,000',
            originalPrice: '¥480,000',
            category: t('courses.courseData.cloudComputing.category'),
            badgeColor: 'cyan',
            level: t('courses.courseData.cloudComputing.level'),
            rating: 4.8,
            students: 2156,
            instructor: 'Emma Wilson',
            features: t('courses.courseData.cloudComputing.features', { returnObjects: true }),
            curriculum: [
                'Cloud Computing Fundamentals (2 weeks)',
                'AWS Services & Architecture (4 weeks)',
                'Microsoft Azure Platform (3 weeks)',
                'Google Cloud Platform (2 weeks)',
                'Containerization with Docker (2 weeks)',
                'Kubernetes Orchestration (3 weeks)',
                'Serverless Computing (2 weeks)',
                'Cloud Security & Compliance (2 weeks)',
                'DevOps & CI/CD (3 weeks)',
                'Capstone Project (4 weeks)'
            ],
            requirements: [
                'Basic understanding of networking',
                'Familiarity with Linux/Unix systems',
                'Some programming experience (Python/JavaScript)',
                'Commitment to 35+ hours per week',
                'Access to a computer with internet'
            ],
            whatYouWillLearn: [
                'Design and implement scalable cloud architectures',
                'Deploy and manage applications on AWS, Azure, and GCP',
                'Containerize applications with Docker and Kubernetes',
                'Implement CI/CD pipelines and DevOps practices',
                'Optimize cloud costs and performance',
                'Ensure cloud security and compliance',
                'Automate infrastructure with Infrastructure as Code',
                'Monitor and troubleshoot cloud applications'
            ],
            careerOutcomes: [
                'Cloud Solutions Architect (¥7M - ¥14M annually)',
                'DevOps Engineer (¥6M - ¥12M annually)',
                'Cloud Engineer (¥5M - ¥10M annually)',
                'Systems Administrator (¥4M - ¥8M annually)',
                'Cloud Consultant (¥6M - ¥13M annually)'
            ],
            jobPlacement: '94%',
            averageSalary: '¥8.8M',
            companies: ['AWS', 'Microsoft', 'Google Cloud', 'NTT Communications', 'Fujitsu', 'Hitachi']
        },
        {
            id: 'ai-ml',
            title: t('courses.courseData.aiMl.title'),
            description: t('courses.courseData.aiMl.description'),
            image: require('../assets/courses/ai.jpg'),
            duration: t('courses.courseData.aiMl.duration'),
            startDate: t('courses.courseData.aiMl.startDate'),
            price: '¥450,000',
            originalPrice: '¥550,000',
            category: t('courses.courseData.aiMl.category'),
            badgeColor: 'purple',
            level: t('courses.courseData.aiMl.level'),
            rating: 4.9,
            students: 987,
            instructor: 'Dr. David Kim',
            features: t('courses.courseData.aiMl.features', { returnObjects: true }),
            curriculum: [
                'Machine Learning Fundamentals (4 weeks)',
                'Deep Learning with Neural Networks (6 weeks)',
                'Natural Language Processing (4 weeks)',
                'Computer Vision (4 weeks)',
                'Reinforcement Learning (3 weeks)',
                'AI Ethics & Responsible AI (2 weeks)',
                'Model Deployment & MLOps (3 weeks)',
                'Advanced AI Applications (3 weeks)',
                'Research Project (6 weeks)'
            ],
            requirements: [
                'Bachelor\'s degree in Computer Science, Math, or related field',
                'Strong Python programming skills',
                'Advanced mathematics background (Linear Algebra, Calculus)',
                'Commitment to 40+ hours per week',
                'Access to a computer with internet'
            ],
            whatYouWillLearn: [
                'Build and train deep neural networks',
                'Implement state-of-the-art ML algorithms',
                'Process and analyze natural language with transformers',
                'Develop computer vision applications',
                'Deploy AI models in production environments',
                'Apply ethical AI principles and bias mitigation',
                'Use cloud AI services (AWS SageMaker, Google AI)',
                'Conduct AI research and publish findings'
            ],
            careerOutcomes: [
                'AI Research Scientist (¥10M - ¥20M annually)',
                'Machine Learning Engineer (¥8M - ¥16M annually)',
                'AI Product Manager (¥9M - ¥18M annually)',
                'Computer Vision Engineer (¥7M - ¥14M annually)',
                'NLP Engineer (¥8M - ¥15M annually)'
            ],
            jobPlacement: '91%',
            averageSalary: '¥12.5M',
            companies: ['Preferred Networks', 'ABEJA', 'Sony AI', 'SoftBank AI', 'LINE AI', 'CyberAgent AI']
        },
        {
            id: 'mobile-dev',
            title: t('courses.courseData.mobileDev.title'),
            description: t('courses.courseData.mobileDev.description'),
            image: require('../assets/courses/mobile.jpg'),
            duration: t('courses.courseData.mobileDev.duration'),
            startDate: t('courses.courseData.mobileDev.startDate'),
            price: '¥370,000',
            originalPrice: '¥470,000',
            category: t('courses.courseData.mobileDev.category'),
            badgeColor: 'orange',
            level: t('courses.courseData.mobileDev.level'),
            rating: 4.6,
            students: 1743,
            instructor: 'Lisa Thompson',
            features: t('courses.courseData.mobileDev.features', { returnObjects: true }),
            curriculum: [
                'React Native Development (4 weeks)',
                'Flutter & Dart Programming (3 weeks)',
                'iOS Development with Swift (4 weeks)',
                'Android Development with Kotlin (4 weeks)',
                'Mobile UI/UX Design (2 weeks)',
                'App Store Optimization (2 weeks)',
                'Mobile Testing & QA (2 weeks)',
                'Cross-Platform Deployment (2 weeks)',
                'Capstone App Project (4 weeks)'
            ],
            requirements: [
                'Basic programming knowledge (JavaScript/Java/Swift)',
                'Understanding of mobile app concepts',
                'Design thinking and creativity',
                'Commitment to 35+ hours per week',
                'Access to a computer with internet'
            ],
            whatYouWillLearn: [
                'Build native iOS and Android applications',
                'Create cross-platform apps with React Native and Flutter',
                'Design intuitive and responsive mobile interfaces',
                'Implement mobile-specific features (camera, GPS, notifications)',
                'Test and debug mobile applications effectively',
                'Publish apps to Apple App Store and Google Play Store',
                'Optimize app performance and user experience',
                'Monetize mobile applications'
            ],
            careerOutcomes: [
                'Mobile App Developer (¥5M - ¥10M annually)',
                'iOS Developer (¥6M - ¥12M annually)',
                'Android Developer (¥5M - ¥11M annually)',
                'Cross-Platform Developer (¥5M - ¥10M annually)',
                'Mobile UI/UX Designer (¥4M - ¥8M annually)'
            ],
            jobPlacement: '93%',
            averageSalary: '¥7.8M',
            companies: ['LINE', 'Mercari', 'CyberAgent', 'GREE', 'DeNA', 'Mixi']
        }
    ], [t]);

    // Modal handling functions
    const openModal = (courseId, event) => {
        const course = coursesData.find(c => c.id === courseId);
        
        // Get the position of the clicked course card
        if (event && event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            const cardPosition = {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
            setClickedCardPosition(cardPosition);
            
            // Scroll to the card position smoothly
            setTimeout(() => {
                window.scrollTo({
                    top: Math.max(0, cardPosition.top - 100),
                    behavior: 'smooth'
                });
            }, 100);
        }
        
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

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
                            <div className="relative group max-w-3xl mx-auto lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
                                
                                {/* Main Image Container - Clean, no shadows */}
                                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-transparent transition-all duration-500">
                                    
                                    {/* Image Container - Clean PNG display */}
                                    <div className="relative">
                                        <img 
                                            src={require('../assets/student/hero1.png')} 
                                            alt={t('courses.hero.imageAlt')} 
                                            className="w-full h-auto min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] object-contain transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
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
                    <CourseSection coursesData={coursesData} onViewCourse={openModal} />
                    
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

            {/* Course Information Modal */}
            {isModalOpen && selectedCourse && (
                <div className="fixed inset-0 z-[9999]">
                    <div className="fixed inset-0 bg-black bg-opacity-60" onClick={closeModal}></div>
                    <div 
                        className="fixed bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300"
                        style={{
                            top: window.innerWidth < 768 ? 
                                Math.max(20, Math.min(clickedCardPosition.top - 20, window.innerHeight - 400)) : 
                                Math.max(20, clickedCardPosition.top - 20),
                            left: window.innerWidth < 768 ? 
                                '20px' : 
                                Math.max(20, Math.min(clickedCardPosition.left, window.innerWidth - 420)),
                            width: window.innerWidth < 768 ? 
                                'calc(100vw - 40px)' : 
                                Math.min(400, window.innerWidth - 40),
                            maxWidth: window.innerWidth < 768 ? 'calc(100vw - 40px)' : '400px',
                            zIndex: 10000
                        }}
                    >
                        <div className="p-4">
                            {/* Header - Compact */}
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-lg font-bold text-gray-900 leading-tight pr-2">
                                    {selectedCourse.title}
                                </h2>
                                <button 
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-xl hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Description - Compact */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {selectedCourse.description}
                                </p>
                                
                                {/* Course Info - Compact */}
                                <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                            <span className="material-icons text-blue-600 text-sm">schedule</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-xs">{t('courses.courseDetails.duration')}</div>
                                                <div className="text-gray-600 text-xs">{selectedCourse.duration}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                            <span className="material-icons text-green-600 text-sm">attach_money</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-xs">{t('courses.courseDetails.price')}</div>
                                                <div className="text-gray-600 text-xs font-bold">{selectedCourse.price}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                            <span className="material-icons text-purple-600 text-sm">trending_up</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-xs">{t('courses.courseDetails.level')}</div>
                                                <div className="text-gray-600 text-xs">{selectedCourse.level}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                                            <span className="material-icons text-orange-600 text-sm">people</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-xs">{t('courses.courseDetails.students')}</div>
                                                <div className="text-gray-600 text-xs">{selectedCourse.students.toLocaleString()}</div>
                                            </div>
                                        </div>
                                </div>
                                
                                {/* Features - Compact */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h3 className="text-sm font-bold mb-2 text-gray-900">{t('courses.courseDetails.keyFeatures')}:</h3>
                                    <div className="space-y-1">
                                        {selectedCourse.features.slice(0, 4).map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="material-icons text-green-600 text-xs">check</span>
                                                </div>
                                                <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Start Date - Compact */}
                                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <span className="material-icons text-blue-600 text-sm">event</span>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-xs">{t('courses.courseDetails.nextStartDate')}</div>
                                        <div className="text-blue-600 font-medium text-xs">{selectedCourse.startDate}</div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons - Compact */}
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => handleEnroll(selectedCourse.id)}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-1"
                                    >
                                        <span className="material-icons text-xs">school</span>
                                        <span className="text-xs">{t('courses.courseDetails.enrollNow')}</span>
                                    </button>
                                    <button 
                                        onClick={closeModal}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-1"
                                    >
                                        <span className="material-icons text-xs">close</span>
                                        <span className="text-xs">{t('courses.courseDetails.close')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default CoursesPage;
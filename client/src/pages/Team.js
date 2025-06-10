import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Users, 
    Mail, 
    Phone, 
    MapPin, 
    Award, 
    BookOpen, 
    Calendar, 
    Linkedin, 
    Twitter, 
    Github,
    GraduationCap,
    Shield,
    Star,
    Clock,
    Building,
    User,
    X
} from 'lucide-react';
import '../styles/AboutPage.css'; // Import the same CSS for consistent styling

const Team = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('teachers');
    const [selectedMember, setSelectedMember] = useState(null);
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const heroRef = useRef(null);

    // Add the same hero animation effects from AboutPage
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

    // Same animation function from AboutPage
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
        
        // Create floating icons with team-related icons
        const icons = ['people', 'school', 'groups', 'emoji_people', 'psychology', 'supervisor_account'];
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

    // Sample team data - keep your existing data
    const teachersData = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            title: 'Senior Web Development Instructor',
            department: 'Computer Science',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b332c8ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
            email: 'sarah.johnson@forumacademy.edu',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            experience: '8 years',
            specializations: ['React.js', 'Node.js', 'Full-Stack Development', 'UI/UX Design'],
            bio: 'Dr. Johnson is a passionate educator with over 8 years of experience in web development. She specializes in modern JavaScript frameworks and has worked with top tech companies before joining Forum Academy.',
            education: ['Ph.D. Computer Science - MIT', 'M.S. Software Engineering - Stanford'],
            achievements: ['Best Instructor Award 2023', '50+ Students Placed in Top Companies'],
            social: {
                linkedin: 'https://linkedin.com/in/sarahjohnson',
                twitter: 'https://twitter.com/sarahjohnson',
                github: 'https://github.com/sarahjohnson'
            }
        },
        {
            id: 2,
            name: 'Prof. Michael Chen',
            title: 'Data Science Lead Instructor',
            department: 'Data Science',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
            email: 'michael.chen@forumacademy.edu',
            phone: '+1 (555) 234-5678',
            location: 'San Francisco, CA',
            experience: '12 years',
            specializations: ['Machine Learning', 'Python', 'Data Analytics', 'AI Research'],
            bio: 'Professor Chen brings extensive industry and academic experience to Forum Academy. He has published numerous papers in AI and machine learning journals.',
            education: ['Ph.D. Computer Science - UC Berkeley', 'M.S. Mathematics - Caltech'],
            achievements: ['Research Excellence Award', 'Published 25+ Research Papers'],
            social: {
                linkedin: 'https://linkedin.com/in/michaelchen',
                github: 'https://github.com/michaelchen'
            }
        },
        {
            id: 3,
            name: 'Jessica Rodriguez',
            title: 'Cybersecurity Instructor',
            department: 'Cybersecurity',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
            email: 'jessica.rodriguez@forumacademy.edu',
            phone: '+1 (555) 345-6789',
            location: 'Austin, TX',
            experience: '6 years',
            specializations: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Security Protocols'],
            bio: 'Jessica is a certified ethical hacker and security consultant who has helped secure systems for Fortune 500 companies.',
            education: ['M.S. Cybersecurity - Carnegie Mellon', 'B.S. Computer Science - UT Austin'],
            achievements: ['CISSP Certified', 'CEH Certified', 'Security Consultant of the Year 2022'],
            social: {
                linkedin: 'https://linkedin.com/in/jessicarodriguez',
                twitter: 'https://twitter.com/jessicarodriguez'
            }
        }
    ];

    const adminData = [
        {
            id: 1,
            name: 'David Thompson',
            title: 'Academic Director',
            department: 'Administration',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
            email: 'david.thompson@forumacademy.edu',
            phone: '+1 (555) 456-7890',
            location: 'Boston, MA',
            experience: '15 years',
            specializations: ['Educational Leadership', 'Curriculum Development', 'Strategic Planning'],
            bio: 'David oversees all academic programs at Forum Academy and ensures the highest quality of education for our students.',
            education: ['Ed.D. Educational Leadership - Harvard', 'M.B.A. - Wharton'],
            achievements: ['Excellence in Education Award', 'Led 300% Growth in Student Enrollment'],
            social: {
                linkedin: 'https://linkedin.com/in/davidthompson'
            }
        },
        {
            id: 2,
            name: 'Lisa Park',
            title: 'Student Success Manager',
            department: 'Student Services',
            image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
            email: 'lisa.park@forumacademy.edu',
            phone: '+1 (555) 567-8901',
            location: 'Seattle, WA',
            experience: '7 years',
            specializations: ['Student Support', 'Career Counseling', 'Academic Advising'],
            bio: 'Lisa is dedicated to ensuring every student achieves their academic and career goals through personalized support and guidance.',
            education: ['M.S. Student Affairs - University of Washington', 'B.A. Psychology - UCLA'],
            achievements: ['Student Advocate of the Year', '95% Student Satisfaction Rate'],
            social: {
                linkedin: 'https://linkedin.com/in/lisapark'
            }
        },
        {
            id: 3,
            name: 'Robert Kim',
            title: 'Technology Operations Manager',
            department: 'IT Operations',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1489&h=1489&q=80',
            email: 'robert.kim@forumacademy.edu',
            phone: '+1 (555) 678-9012',
            location: 'Denver, CO',
            experience: '10 years',
            specializations: ['Cloud Infrastructure', 'System Administration', 'EdTech Solutions'],
            bio: 'Robert manages all technology infrastructure and ensures our learning platforms run smoothly for optimal student experience.',
            education: ['M.S. Information Systems - Colorado State', 'B.S. Computer Engineering - CU Boulder'],
            achievements: ['99.9% System Uptime', 'Cloud Migration Excellence Award'],
            social: {
                linkedin: 'https://linkedin.com/in/robertkim',
                github: 'https://github.com/robertkim'
            }
        }
    ];

    const openModal = (member) => {
        setSelectedMember(member);
    };

    const closeModal = () => {
        setSelectedMember(null);
    };

    const tabs = [
        { id: 'teachers', label: t('team.teachers') || 'Our Teachers', icon: GraduationCap },
        { id: 'admin', label: t('team.administration') || 'Administration', icon: Shield }
    ];

    const TeamCard = ({ member, type }) => (
        <div className="team-card relative w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center overflow-hidden perspective-1000 shadow-lg border-4 border-white/50 transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:border-blue-200/50">
            <style jsx>{`
                .team-card {
                    perspective: 1000px;
                }
                
                .team-card img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid white;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .team-card:hover img {
                    transform: scale(0);
                    opacity: 0;
                }
                
                .card-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    padding: 24px;
                    box-sizing: border-box;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    transform: rotateX(-90deg);
                    transform-origin: bottom;
                    transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .team-card:hover .card-content {
                    transform: rotateX(0deg);
                }
                
                .card-title {
                    margin: 0;
                    font-size: 20px;
                    color: white;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 8px;
                }
                
                .card-subtitle {
                    margin: 0;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.9);
                    text-align: center;
                    margin-bottom: 16px;
                    font-weight: 500;
                }
                
                .card-description {
                    margin: 0;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.5;
                    text-align: center;
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                }
                
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                }
                
                .social-links {
                    display: flex;
                    gap: 8px;
                }
                
                .social-link {
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .social-link:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                
                .view-profile-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                }
                
                .view-profile-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                
                .specialization-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    justify-content: center;
                    margin: 12px 0;
                }
                
                .spec-tag {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                }
            `}</style>
            
            {/* Default state - showing image */}
            <div className="flex flex-col items-center">
                <img 
                    src={member.image} 
                    alt={member.name}
                />
                <h3 className="text-xl font-bold text-gray-800 mt-4 text-center">{member.name}</h3>
                <p className="text-blue-600 font-medium text-center">{member.title}</p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                    <Building className="w-4 h-4 mr-1" />
                    {member.department}
                </div>
            </div>
            
            {/* Hover state - showing details */}
            <div className="card-content">
                <div>
                    <h3 className="card-title">{member.name}</h3>
                    <p className="card-subtitle">{member.title}</p>
                    
                    <div className="specialization-tags">
                        {member.specializations.slice(0, 3).map((spec, index) => (
                            <span key={index} className="spec-tag">
                                {spec}
                            </span>
                        ))}
                        {member.specializations.length > 3 && (
                            <span className="spec-tag">
                                +{member.specializations.length - 3}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="card-description">
                    <div>
                        <div className="flex items-center justify-center text-white/90 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {member.location}
                        </div>
                        <div className="flex items-center justify-center text-white/90 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {member.experience} experience
                        </div>
                    </div>
                </div>
                
                <div className="card-footer">
                    <div className="social-links">
                        {member.social?.linkedin && (
                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" 
                               className="social-link">
                                <Linkedin className="w-4 h-4 text-white" />
                            </a>
                        )}
                        {member.social?.twitter && (
                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
                               className="social-link">
                                <Twitter className="w-4 h-4 text-white" />
                            </a>
                        )}
                        {member.social?.github && (
                            <a href={member.social.github} target="_blank" rel="noopener noreferrer"
                               className="social-link">
                                <Github className="w-4 h-4 text-white" />
                            </a>
                        )}
                        <a href={`mailto:${member.email}`} className="social-link">
                            <Mail className="w-4 h-4 text-white" />
                        </a>
                    </div>
                    
                    <button
                        onClick={() => openModal(member)}
                        className="view-profile-btn"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="about-page">
            {/* Hero Section - Updated to match AboutPage design */}
            <section 
                ref={heroRef}
                className={`about-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                {/* Keep ALL background elements exactly as AboutPage */}
                <div className="about-hero-bg">
                    <div className="about-hero-elements"></div>
                    <div className="about-glow about-glow-1"></div>
                    <div className="about-glow about-glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="about-hero-content">
                        <div className="about-hero-badge">
                            <span className="material-icons">people</span>
                            {t('team.hero.badge') || 'Meet Our Experts'}
                        </div>
                        
                        <h1 className="about-hero-title">
                            {t('team.hero.title') || 'Our Professional'} <span className="highlight-text">{t('team.hero.highlight') || 'Team'}</span>
                        </h1>
                        
                        <p className="about-hero-description">
                            {t('team.hero.description') || 'Meet the passionate educators and administrators who make Forum Academy a world-class institution for technology education and career development.'}
                        </p>
                        
                        <div className="about-hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">{t('team.stats.experts') || 'Expert Instructors'}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">{t('team.stats.experience') || 'Years Experience'}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">95%</div>
                                <div className="stat-label">{t('team.stats.satisfaction') || 'Student Satisfaction'}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">100+</div>
                                <div className="stat-label">{t('team.stats.certifications') || 'Certifications'}</div>
                            </div>
                        </div>
                        
                        <div className="about-hero-actions">
                            <a href="#team-members" className="btn btn-primary">{t('team.hero.meetTeam') || 'Meet Our Team'}</a>
                            <a href="/contact" className="btn btn-outline">{t('team.hero.joinUs') || 'Join Our Team'}</a>
                        </div>
                    </div>
                </div>
                
                <div className="scroll-indicator">
                    <a href="#team-members">
                        <span>{t('team.hero.exploreTeam') || 'Explore Our Team'}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>

            {/* Team Section */}
            <section id="team-members" className="about-section py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                            <div className="flex space-x-2">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTab === 'teachers' ? teachersData : adminData).map((member) => (
                            <TeamCard key={member.id} member={member} type={activeTab} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Modal - keep your existing modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-300 text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-end space-x-6">
                                        <img
                                            src={selectedMember.image}
                                            alt={selectedMember.name}
                                            className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                                        />
                                        <div className="text-white flex-1">
                                            <h2 className="text-3xl font-bold mb-1">{selectedMember.name}</h2>
                                            <p className="text-blue-100 text-lg">{selectedMember.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                                About
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">{selectedMember.bio}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                                Specializations
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMember.specializations.map((spec, index) => (
                                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                                                Education
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedMember.education.map((edu, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-600">{edu}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                <Award className="w-5 h-5 mr-2 text-blue-600" />
                                                Achievements
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedMember.achievements.map((achievement, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-600">{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <a href={`mailto:${selectedMember.email}`} className="text-blue-600 hover:text-blue-700">
                                                        {selectedMember.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{selectedMember.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{selectedMember.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{selectedMember.experience} experience</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        {selectedMember.social && (
                                            <div className="bg-gray-50 rounded-xl p-6">
                                                <h3 className="font-bold text-gray-900 mb-4">Connect</h3>
                                                <div className="flex space-x-3">
                                                    {selectedMember.social.linkedin && (
                                                        <a 
                                                            href={selectedMember.social.linkedin} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                                        >
                                                            <Linkedin className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {selectedMember.social.twitter && (
                                                        <a 
                                                            href={selectedMember.social.twitter} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
                                                        >
                                                            <Twitter className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {selectedMember.social.github && (
                                                        <a 
                                                            href={selectedMember.social.github} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                                                        >
                                                            <Github className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from './LoginModal';
import logoWhiteImage from '../assets/images/logo1.png';
import { Menu, X, ChevronDown, Globe, User, ArrowRight, Code, BarChart3, Shield, Cloud, Brain, List, Info, Users, Handshake, Star, Sparkles, Zap } from 'lucide-react';

const Header = ({ onLoginClick }) => {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    const location = useLocation();
    // const navigate = useNavigate();

    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen('');
    }, [location]);

    // Add scroll listener for header style change
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'ja' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const toggleDropdown = (menu) => {
        setDropdownOpen(dropdownOpen === menu ? '' : menu);
    };

    const handleMouseEnter = (item) => {
        setHoveredItem(item);
        if (item === 'courses' || item === 'about') {
            setDropdownOpen(item);
        }
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
        setDropdownOpen('');
    };

    const openModal = () => {
        console.log('Opening login modal');
        setIsLoginModalOpen(true);
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    const closeModal = () => {
        setIsLoginModalOpen(false);
    };

    const isActiveLink = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const getCurrentLanguage = () => {
        return i18n.language === 'en' ? 'EN' : 'JP';
    };

    // Update the handleAnchorClick function to work properly
    const handleAnchorClick = (path) => {
        if (path.includes('#')) {
            const [route, hash] = path.split('#');

            // If we're already on the target page, just scroll
            if (location.pathname === route) {
                const element = document.getElementById(hash);
                if (element) {
                    const headerHeight = 80; // Adjust based on your header height
                    const elementPosition = element.offsetTop - headerHeight;

                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Navigate to the page and then scroll after a brief delay
                navigate(path);
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        const headerHeight = 80;
                        const elementPosition = element.offsetTop - headerHeight;

                        window.scrollTo({
                            top: elementPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } else {
            navigate(path);
        }

        // Close mobile menu if open
        setMenuOpen(false);
        setDropdownOpen('');
    };

    const coursesData = [
        {
            icon: Code,
            title: t('courses.webDevelopment') || 'Web Development',
            path: '/courses/web-development',
            gradient: 'from-blue-500 to-purple-600',
            emoji: '💻'
        },
        {
            icon: BarChart3,
            title: t('courses.dataScience') || 'Data Science',
            path: '/courses/data-science',
            gradient: 'from-green-500 to-teal-600',
            emoji: '📊'
        },
        {
            icon: Shield,
            title: t('courses.cybersecurity') || 'Cybersecurity',
            path: '/courses/cybersecurity',
            gradient: 'from-red-500 to-pink-600',
            emoji: '🛡️'
        },
        {
            icon: Cloud,
            title: t('courses.cloudComputing') || 'Cloud Computing',
            path: '/courses/cloud-computing',
            gradient: 'from-indigo-500 to-blue-600',
            emoji: '☁️'
        },
        {
            icon: Brain,
            title: t('courses.aiMl') || 'AI & Machine Learning',
            path: '/courses/ai-ml',
            gradient: 'from-purple-500 to-pink-600',
            emoji: '🤖'
        }
    ];

    const aboutLinks = [
        {
            icon: Info,
            title: t('navigation.aboutUs') || 'About Us',
            path: '/about',
            emoji: '🏛️'
        },
        {
            icon: Users,
            title: t('navigation.ourTeam') || 'Our Team',
            path: '/team#team-members',
            emoji: '👥'
        },
        {
            icon: Handshake,
            title: t('navigation.industryPartners') || 'Industry Partners',
            path: '/team#industry-partners',
            emoji: '🤝'
        },
        {
            icon: Star,
            title: t('navigation.studentSuccess') || 'Student Success',
            path: '/team#student-testimonials',
            emoji: '⭐'
        }
    ];

    const navigationLinks = [
        {
            path: '/news',
            label: t('navigation.newsEvents') || 'News & Events',
            emoji: '📰'
        },
        {
            path: '/career-services',
            label: t('navigation.careerServices') || 'Career Services',
            emoji: '💼'
        },
        {
            path: '/contact',
            label: t('navigation.contact') || 'Contact',
            emoji: '📧'
        }
    ];

    return (
        <>
            {/* Compact Enhanced Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/30'
                    : 'bg-gradient-to-r from-slate-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-md'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">

                        {/* Compact Logo */}
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                    <img src={logoWhiteImage} alt="Forum Academy" className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300">
                                    <Sparkles className="w-2 h-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className={`font-bold text-lg transition-colors duration-300 ${
                                    scrolled
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                                        : 'text-white'
                                }`}>
                                    Forum Academy
                                </h1>
                            </div>
                        </Link>

                        
                        <nav className="hidden lg:flex items-center space-x-6">
                            
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('courses')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-500 group relative overflow-hidden ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink('/courses') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''} hover:scale-105 hover:shadow-lg`}
                                >
                                    {/* Button background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                                    
                                    <span className="font-semibold text-sm relative z-10">
                                        {t('navigation.programs') || 'Programs'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-all duration-500 relative z-10 ${
                                        dropdownOpen === 'courses' ? 'rotate-180 text-blue-500' : ''
                                    } group-hover:scale-110`} />
                                    
                                    {/* Animated underline */}
                                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
                                </button>
                            
                                {/* Rectangular Dropdown Box */}
                                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 transition-all duration-700 z-50 ${
                                    dropdownOpen === 'courses'
                                        ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                                        : 'opacity-0 -translate-y-6 pointer-events-none scale-95'
                                }`}>
                                    <div className="w-96 max-w-[85vw] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 mt-4 overflow-hidden relative">
                                        {/* Decorative top border */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                        
                                        {/* Enhanced Header */}
                                        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 px-6 py-4 border-b border-gray-200/50 relative">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                                        <Zap className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {t('Our Programs') || 'Our Programs'}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            Choose your path to success
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-2xl animate-bounce">🎓</div>
                                            </div>
                                        </div>
                            
                                        {/* Programs Grid */}
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                                                {coursesData.map((course, index) => {
                                                    const IconComponent = course.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            to={course.path}
                                                            className="group relative p-4 rounded-xl bg-gradient-to-r from-white/70 to-gray-50/70 border border-gray-200/50 hover:border-transparent hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] transform overflow-hidden"
                                                        >
                                                            {/* Background effects */}
                                                            <div className={`absolute inset-0 bg-gradient-to-r ${course.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-xl`}></div>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                                                            
                                                            {/* Shimmer effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                                            
                                                            <div className="relative z-10 flex items-center space-x-4">
                                                                {/* Icon container */}
                                                                <div className="relative flex-shrink-0">
                                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                                                        <IconComponent className="w-6 h-6 text-white" />
                                                                    </div>
                                                                    {/* Floating indicator */}
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                                                                </div>
                                                                
                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                                                                            {course.title}
                                                                        </h5>
                                                                        <span className="text-lg transform group-hover:scale-125 transition-transform duration-300">{course.emoji}</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                                                        Industry-certified • Professional track
                                                                    </p>
                                                                    
                                                                    {/* Progress indicator */}
                                                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                                                                        <div className={`h-full bg-gradient-to-r ${course.gradient} w-0 group-hover:w-full transition-all duration-700 delay-200`}></div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Arrow */}
                                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1 flex-shrink-0" />
                                                            </div>
                                                            
                                                            {/* Corner sparkle */}
                                                            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                            
                                            {/* Enhanced Bottom Action */}
                                            <div className="border-t border-gray-200/50 pt-4 mt-4">
                                                <Link
                                                    to="/courses"
                                                    className="group relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-500 hover:scale-105 hover:shadow-xl text-sm font-bold overflow-hidden transform hover:-translate-y-0.5"
                                                >
                                                    {/* Button effects */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    
                                                    {/* Shine effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                                    
                                                    <List className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                                                    <span className="relative z-10 group-hover:text-yellow-100 transition-colors duration-300">
                                                        {t('navigation.viewAllPrograms') || 'Explore All Programs'}
                                                    </span>
                                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 relative z-10" />
                                                    
                                                    {/* Floating particles */}
                                                    <div className="absolute top-1 left-4 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 delay-100"></div>
                                                    <div className="absolute bottom-2 right-6 w-1 h-1 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500 delay-200"></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compact About Dropdown */}
                            
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('about')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-500 group relative overflow-hidden ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink('/about') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''} hover:scale-105 hover:shadow-lg`}
                                >
                                    {/* Button background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                                    
                                    <span className="font-semibold text-sm relative z-10">
                                        {t('navigation.about') || 'About'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-all duration-500 relative z-10 ${
                                        dropdownOpen === 'about' ? 'rotate-180 text-blue-500' : ''
                                    } group-hover:scale-110`} />
                                    
                                    {/* Animated underline */}
                                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
                                </button>
                            
                                {/* Rectangular Dropdown Box - Same Style as Programs */}
                                <div className={`absolute top-full left-0 w-96 max-w-[85vw] transition-all duration-700 z-50 ${
                                    dropdownOpen === 'about'
                                        ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                                        : 'opacity-0 -translate-y-6 pointer-events-none scale-95'
                                }`}>
                                    <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 mt-4 overflow-hidden relative">
                                        {/* Decorative top border - Same as Programs */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                        
                                        {/* Enhanced Header - Same Style as Programs */}
                                        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 px-6 py-4 border-b border-gray-200/50 relative">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                                        <Info className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {t('About Us') || 'About Us'}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            Discover our story and mission
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-2xl animate-bounce">🏢</div>
                                            </div>
                                        </div>
                            
                                        {/* About Links Grid - Same Style as Programs */}
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                                                {aboutLinks.map((link, index) => {
                                                    const IconComponent = link.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            to={link.path}
                                                            className="group relative p-4 rounded-xl bg-gradient-to-r from-white/70 to-gray-50/70 border border-gray-200/50 hover:border-transparent hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] transform overflow-hidden"
                                                        >
                                                            {/* Background effects - Same as Programs */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-xl"></div>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                                                            
                                                            {/* Shimmer effect - Same as Programs */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                                            
                                                            <div className="relative z-10 flex items-center space-x-4">
                                                                {/* Icon container - Same style as Programs */}
                                                                <div className="relative flex-shrink-0">
                                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                                                                        <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                                                                    </div>
                                                                    {/* Floating indicator - Same as Programs */}
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                                                                </div>
                                                                
                                                                {/* Content - Same layout as Programs */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                                                                            {link.title}
                                                                        </h5>
                                                                        <span className="text-lg transform group-hover:scale-125 transition-transform duration-300">{link.emoji}</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                                                        Learn more about our story
                                                                    </p>
                                                                    
                                                                    {/* Progress indicator - Same as Programs */}
                                                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                                                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-0 group-hover:w-full transition-all duration-700 delay-200"></div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Arrow - Same as Programs */}
                                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1 flex-shrink-0" />
                                                            </div>
                                                            
                                                            {/* Corner sparkle - Same as Programs */}
                                                            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                            
                                            {/* Enhanced Bottom Action - Same Style as Programs */}
                                            <div className="border-t border-gray-200/50 pt-4 mt-4">
                                                <Link
                                                    to="/about"
                                                    className="group relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-500 hover:scale-105 hover:shadow-xl text-sm font-bold overflow-hidden transform hover:-translate-y-0.5"
                                                >
                                                    {/* Button effects - Same as Programs */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    
                                                    {/* Shine effect - Same as Programs */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                                    
                                                    <Info className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                                                    <span className="relative z-10 group-hover:text-yellow-100 transition-colors duration-300">
                                                        {t('Learn More About Us') || 'Learn More About Us'}
                                                    </span>
                                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 relative z-10" />
                                                    
                                                    {/* Floating particles - Same as Programs */}
                                                    <div className="absolute top-1 left-4 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 delay-100"></div>
                                                    <div className="absolute bottom-2 right-6 w-1 h-1 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500 delay-200"></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compact Navigation Links */}
                            {navigationLinks.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group text-sm ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink(item.path) ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''} transform hover:scale-105`}
                                >
                                    <span className="flex items-center space-x-1">
                                        <span>{item.label}</span>
                                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.emoji}</span>
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        {/* Compact Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Compact Language Selector */}
                            <button
                                onClick={toggleLanguage}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 group ${
                                    scrolled
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                }`}
                            >
                                <Globe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-bold text-sm">{getCurrentLanguage()}</span>
                                <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {i18n.language === 'en' ? '🇺🇸' : '🇯🇵'}
                                </div>
                            </button>

                            {/* Compact Login Button */}
                            <button
                                onClick={onLoginClick}
                                className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 group ${
                                    scrolled
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                }`}
                            >
                                <span className="font-medium text-sm whitespace-nowrap">
                                    {t('buttons.login') || 'Login'}
                                </span>
                                <User className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                            </button>

                            {/* Enhanced Apply Button with Magical Sparkle Effect */}
                            <Link
                                to="/apply"
                                className="hidden sm:flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-500 hover:scale-110 hover:shadow-2xl group text-sm font-bold relative overflow-hidden transform hover:-translate-y-0.5 mt-2 mb-2"
                            >
                                {/* Enhanced Sparkle Effects */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                    {/* Large Star Sparkles */}
                                    <div className="absolute top-2 left-4 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:animate-spin">
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-100 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    <div className="absolute top-1 right-5 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 group-hover:animate-pulse">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-200 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-200 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    <div className="absolute bottom-2 left-6 w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 group-hover:animate-bounce">
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-100 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    <div className="absolute bottom-1 right-3 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150 group-hover:animate-spin">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-100 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    <div className="absolute top-1/2 left-2 w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-250 group-hover:animate-pulse">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-100 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    <div className="absolute top-3 right-2 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-400 group-hover:animate-bounce">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-100 transform scale-y-50 rounded-sm"></div>
                                    </div>
                                    
                                    {/* Floating Dot Sparkles */}
                                    <div className="absolute top-2 left-8 w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-200"></div>
                                    <div className="absolute top-4 right-6 w-1 h-1 bg-gradient-to-r from-white to-cyan-200 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-300"></div>
                                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-pink-200 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-700 delay-100"></div>
                                    <div className="absolute bottom-4 right-7 w-1 h-1 bg-gradient-to-r from-green-400 to-green-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-400"></div>
                                    <div className="absolute top-1/2 right-1 w-1 h-1 bg-gradient-to-r from-orange-400 to-orange-200 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-150"></div>
                                    
                                    {/* Magic Dust Effect */}
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        <div className="absolute top-1 left-5 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-500"></div>
                                        <div className="absolute top-3 left-9 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-600"></div>
                                        <div className="absolute bottom-1 left-7 w-0.5 h-0.5 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-700 delay-700"></div>
                                        <div className="absolute bottom-3 right-4 w-0.5 h-0.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-550"></div>
                                        <div className="absolute top-2 right-8 w-0.5 h-0.5 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-650"></div>
                                    </div>
                                </div>
                                
                                {/* Enhanced Shimmer Wave */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                
                                {/* Glow Effect - Adjusted to stay within bounds */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 -z-10 group-hover:animate-pulse"></div>
                                
                                {/* Enhanced Background Shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                                
                                <span className="whitespace-nowrap relative z-10 group-hover:text-yellow-100 transition-colors duration-500">
                                    {t('buttons.applyNow') || 'Apply Now'}
                                </span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500 relative z-10 group-hover:text-yellow-100" />
                                
                                {/* Floating Sparkle Ring - Positioned to stay within button bounds */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 border-2 border-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700 delay-200"></div>
                            </Link>

                            {/* Compact Mobile Menu Toggle */}
                            <button
                                onClick={toggleMenu}
                                className={`lg:hidden p-2 rounded-lg transition-all duration-300 group ${
                                    scrolled
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                } hover:scale-110`}
                            >
                                {menuOpen ? (
                                    <X className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" />
                                ) : (
                                    <Menu className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compact Mobile Menu */}
                <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
                    menuOpen
                        ? 'max-h-screen opacity-100'
                        : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-xl">
                        <div className="px-4 py-6 space-y-4">
                            {/* Mobile Programs */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('courses')}
                                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-sm">
                                            {t('navigation.programs') || 'Programs'}
                                        </span>
                                        <span className="text-sm">🎓</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                        dropdownOpen === 'courses' ? 'rotate-180' : ''
                                    }`} />
                                </button>
                                <div className={`transition-all duration-300 overflow-hidden ${
                                    dropdownOpen === 'courses' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="mt-2 pl-4 space-y-2">
                                        {coursesData.map((course, index) => (
                                            <Link
                                                key={index}
                                                to={course.path}
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                                            >
                                                <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${course.gradient} flex items-center justify-center`}>
                                                    <course.icon className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-sm font-medium">{course.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile About */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('about')}
                                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-sm">
                                            {t('navigation.about') || 'About'}
                                        </span>
                                        <span className="text-sm">🏛️</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                        dropdownOpen === 'about' ? 'rotate-180' : ''
                                    }`} />
                                </button>

                                <div className={`transition-all duration-300 overflow-hidden ${
                                    dropdownOpen === 'about' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="mt-2 pl-4 space-y-2">
                                        {aboutLinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                to={link.path}
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <link.icon className="w-3 h-3 text-gray-600" />
                                                </div>
                                                <span className="text-sm font-medium">{link.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Other mobile links */}
                            {navigationLinks.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                    <span className="text-sm">{item.emoji}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            {/* Mobile Actions */}
                            <div className="pt-4 border-t border-gray-200/50 space-y-3">
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                    <User className="w-4 h-4" />
                                    <span>{t('buttons.login') || 'Login'}</span>
                                </button>

                                <Link
                                    to="/apply"
                                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-500 font-medium text-sm relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transform hover:-translate-y-0.5 my-2"
                                >
                                    {/* Enhanced Sparkle Effects for Mobile Apply */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                        {/* Large Star Sparkles - Adjusted for mobile */}
                                        <div className="absolute top-2 left-4 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:animate-spin">
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-100 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        <div className="absolute top-1 right-5 w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 group-hover:animate-pulse">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-200 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-200 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        <div className="absolute bottom-2 left-6 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 group-hover:animate-bounce">
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-100 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        <div className="absolute bottom-1 right-3 w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150 group-hover:animate-spin">
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-100 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        <div className="absolute top-1/2 left-2 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-250 group-hover:animate-pulse">
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-100 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        <div className="absolute top-3 right-2 w-1 h-1 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-400 group-hover:animate-bounce">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-100 rotate-45 transform scale-x-50 rounded-sm"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-100 transform scale-y-50 rounded-sm"></div>
                                        </div>
                                        
                                        {/* Floating Dot Sparkles - Reduced size for mobile */}
                                        <div className="absolute top-2 left-8 w-1 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-200"></div>
                                        <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-gradient-to-r from-white to-cyan-200 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-300"></div>
                                        <div className="absolute bottom-3 left-3 w-1 h-1 bg-gradient-to-r from-pink-400 to-pink-200 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-700 delay-100"></div>
                                        <div className="absolute bottom-4 right-7 w-0.5 h-0.5 bg-gradient-to-r from-green-400 to-green-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-400"></div>
                                        <div className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-gradient-to-r from-orange-400 to-orange-200 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-150"></div>
                                        
                                        {/* Magic Dust Effect - Simplified for mobile */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <div className="absolute top-1 left-5 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-500"></div>
                                            <div className="absolute top-3 left-9 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-600"></div>
                                            <div className="absolute bottom-1 left-7 w-0.5 h-0.5 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-700 delay-700"></div>
                                            <div className="absolute bottom-3 right-4 w-0.5 h-0.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700 delay-550"></div>
                                            <div className="absolute top-2 right-8 w-0.5 h-0.5 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 delay-650"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Enhanced Shimmer Wave */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>
                                    
                                    {/* Glow Effect - Reduced for mobile */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 -z-10 group-hover:animate-pulse"></div>
                                    
                                    {/* Enhanced Background Shimmer */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                                    
                                    <span className="whitespace-nowrap relative z-10 group-hover:text-yellow-100 transition-colors duration-500">
                                        {t('buttons.applyNow') || 'Apply Now'}
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-500 relative z-10 group-hover:text-yellow-100" />
                                    
                                    {/* Floating Sparkle Ring - Adjusted for mobile */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 border-2 border-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700 delay-200"></div>
                                    
                                    {/* Mobile Rocket Effect - Positioned better */}
                                    <div className="absolute bottom-0 left-0 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 group-hover:animate-bounce">
                                        🚀
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeModal}
            />
        </>
    );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from './LoginModal';
import logoWhiteImage from '../assets/images/logo1.png';

// Import Lucide React icons
import { 
    Menu, 
    X, 
    ChevronDown, 
    Globe, 
    User, 
    ArrowRight, 
    Code, 
    BarChart3, 
    Shield, 
    Cloud, 
    Brain, 
    List, 
    Info, 
    Users, 
    Handshake, 
    Star 
} from 'lucide-react';

const Header = ({ onLoginClick }) => {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    
    const location = useLocation();
    
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

    const coursesData = [
        {
            icon: Code,
            title: t('courses.webDevelopment') || 'Web Development',
            desc: t('courses.webDevelopmentDesc') || 'Full-stack engineering courses',
            path: '/courses/web-development',
            gradient: 'from-blue-500 to-purple-600'
        },
        {
            icon: BarChart3,
            title: t('courses.dataScience') || 'Data Science',
            desc: t('courses.dataScienceDesc') || 'Analytics and ML specialization',
            path: '/courses/data-science',
            gradient: 'from-green-500 to-teal-600'
        },
        {
            icon: Shield,
            title: t('courses.cybersecurity') || 'Cybersecurity',
            desc: t('courses.cybersecurityDesc') || 'Network and systems protection',
            path: '/courses/cybersecurity',
            gradient: 'from-red-500 to-pink-600'
        },
        {
            icon: Cloud,
            title: t('courses.cloudComputing') || 'Cloud Computing',
            desc: t('courses.cloudComputingDesc') || 'AWS, Azure, and GCP',
            path: '/courses/cloud-computing',
            gradient: 'from-indigo-500 to-blue-600'
        },
        {
            icon: Brain,
            title: t('courses.aiMl') || 'AI & Machine Learning',
            desc: t('courses.aiMlDesc') || 'Advanced AI technologies',
            path: '/courses/ai-ml',
            gradient: 'from-purple-500 to-pink-600'
        }
    ];

    const aboutLinks = [
        { 
            icon: Info, 
            title: t('navigation.aboutUs') || 'About Us', 
            path: '/about' 
        },
        { 
            icon: Users, 
            title: t('navigation.ourTeam') || 'Our Team', 
            path: '/team' 
        },
        { 
            icon: Handshake, 
            title: t('navigation.industryPartners') || 'Industry Partners', 
            path: '/partners' 
        },
        { 
            icon: Star, 
            title: t('navigation.studentSuccess') || 'Student Success', 
            path: '/testimonials' 
        }
    ];

    const navigationLinks = [
        { 
            path: '/news', 
            label: t('navigation.newsEvents') || 'News & Events' 
        },
        { 
            path: '/career-services', 
            label: t('navigation.careerServices') || 'Career Services' 
        },
        { 
            path: '/contact', 
            label: t('navigation.contact') || 'Contact' 
        }
    ];
    
    return (
        <>
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
                    : 'bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                    <img src={logoWhiteImage} alt="Forum Academy" className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className={`font-bold text-xl transition-colors duration-300 ${
                                    scrolled 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                                        : 'text-white'
                                }`}>
                                    Forum Academy
                                </h1>
                                <p className={`text-xs transition-colors duration-300 ${
                                    scrolled ? 'text-gray-500' : 'text-gray-300'
                                }`}>
                                    Excellence in Education
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            
                            {/* Programs Dropdown */}
                            <div 
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('courses')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button 
                                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                                        scrolled 
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink('/courses') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''}`}
                                    onClick={() => toggleDropdown('courses')}
                                >
                                    <span className="font-medium relative z-10">
                                        {t('navigation.programs') || 'Programs'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                                        dropdownOpen === 'courses' ? 'rotate-180' : ''
                                    }`} />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </button>
                                
                                {/* Mega Menu */}
                                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl transition-all duration-500 ${
                                    dropdownOpen === 'courses' 
                                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-4 pointer-events-none'
                                }`}>
                                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-2 overflow-hidden backdrop-blur-xl">
                                        <div className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {coursesData.map((course, index) => {
                                                    const IconComponent = course.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            to={course.path}
                                                            className="group p-4 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left w-full relative overflow-hidden"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            <div className="relative z-10">
                                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${course.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                                    <IconComponent className="w-6 h-6 text-white" />
                                                                </div>
                                                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                                    {course.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300 mb-3">
                                                                    {course.desc}
                                                                </p>
                                                                <div className="flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                                                    <span className="text-sm font-medium mr-1">Learn More</span>
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                                
                                                {/* View All Programs */}
                                                <Link
                                                    to="/courses"
                                                    className="group p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left w-full relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative z-10">
                                                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                                                            <List className="w-6 h-6" />
                                                        </div>
                                                        <h3 className="font-semibold mb-2">
                                                            {t('navigation.viewAllPrograms') || 'View All Programs'}
                                                        </h3>
                                                        <p className="text-sm text-blue-100 mb-3">
                                                            {t('navigation.browseCatalog') || 'Browse our complete catalog'}
                                                        </p>
                                                        <div className="flex items-center opacity-70 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                                            <span className="text-sm font-medium mr-1">Explore</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                            
                                            {/* Call to Action */}
                                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                                                            <span className="text-2xl mr-2">🎓</span>
                                                            {t('navigation.startJourney') || 'Start Your Journey'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {t('navigation.joinStudents') || 'Join thousands of students already learning with us'}
                                                        </p>
                                                    </div>
                                                    <Link 
                                                        to="/apply"
                                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                                                    >
                                                        {t('buttons.applyNow') || 'Apply Now'}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Dropdown */}
                            <div 
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('about')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button 
                                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                                        scrolled 
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink('/about') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''}`}
                                    onClick={() => toggleDropdown('about')}
                                >
                                    <span className="font-medium relative z-10">
                                        {t('navigation.about') || 'About'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                                        dropdownOpen === 'about' ? 'rotate-180' : ''
                                    }`} />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </button>
                                
                                <div className={`absolute top-full left-0 w-64 transition-all duration-300 ${
                                    dropdownOpen === 'about' 
                                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-4 pointer-events-none'
                                }`}>
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 mt-2 overflow-hidden backdrop-blur-xl">
                                        <div className="p-2">
                                            {aboutLinks.map((link, index) => {
                                                const IconComponent = link.icon;
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={link.path}
                                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group hover:translate-x-1 w-full text-left relative overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 relative z-10" />
                                                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium relative z-10">
                                                            {link.title}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto relative z-10" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Regular Navigation Links */}
                            {navigationLinks.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group overflow-hidden ${
                                        scrolled 
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                    } ${isActiveLink(item.path) ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''}`}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Language Selector */}
                            <button
                                onClick={toggleLanguage}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                                    scrolled 
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                }`}
                            >
                                <Globe className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="font-medium relative z-10">{getCurrentLanguage()}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            </button>

                            {/* Login Button */}
                            <button
                                onClick={onLoginClick}
                                className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                                    scrolled 
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                }`}
                            >
                                <span className="font-medium relative z-10 whitespace-nowrap">
                                    {t('buttons.login') || 'Login'}
                                </span>
                                <User className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            </button>


                            {/* Apply Button */}
                            <Link
                                to="/apply"
                                className="hidden sm:flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden transform hover:-translate-y-0.5"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="font-medium relative z-10">
                                    {t('buttons.applyNow') || 'Apply Now'}
                                </span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleMenu}
                                className={`lg:hidden p-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                                    scrolled 
                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                                }`}
                            >
                                <div className="relative z-10">
                                    {menuOpen ? (
                                        <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
                                    ) : (
                                        <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-500 ${
                    menuOpen 
                        ? 'max-h-screen opacity-100' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200">
                        <div className="px-4 py-6 space-y-4">
                            {/* Mobile Programs */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('courses')}
                                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 group"
                                >
                                    <span className="font-medium">
                                        {t('navigation.programs') || 'Programs'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                        dropdownOpen === 'courses' ? 'rotate-180' : ''
                                    }`} />
                                </button>
                                <div className={`transition-all duration-300 overflow-hidden ${
                                    dropdownOpen === 'courses' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="mt-2 pl-4 space-y-2">
                                        {coursesData.map((course, index) => (
                                            <Link
                                                key={index}
                                                to={course.path}
                                                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 w-full text-left group"
                                            >
                                                <course.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                <span className="group-hover:translate-x-1 transition-transform duration-300">{course.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile About */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('about')}
                                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300"
                                >
                                    <span className="font-medium">
                                        {t('navigation.about') || 'About'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                        dropdownOpen === 'about' ? 'rotate-180' : ''
                                    }`} />
                                </button>
                                
                                <div className={`transition-all duration-300 overflow-hidden ${
                                    dropdownOpen === 'about' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="mt-2 pl-4 space-y-2">
                                        {aboutLinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                to={link.path}
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 w-full text-left group"
                                            >
                                                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                <span className="group-hover:translate-x-1 transition-transform duration-300">{link.title}</span>
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
                                    className="block w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 font-medium group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                                        {item.label}
                                    </span>
                                </Link>
                            ))}

                            {/* Mobile Actions */}
                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 group"
                                >
                                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                                        {t('buttons.login') || 'Login'}
                                    </span>
                                </button>
                                <Link
                                    to="/apply"
                                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium group hover:shadow-lg transform hover:scale-105"
                                >
                                    <span>{t('buttons.applyNow') || 'Apply Now'}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
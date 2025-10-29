import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from './LoginModal';
import logoWhiteImage from '../assets/images/logo1.png';
import { Menu, X, ChevronDown, Globe, User, ArrowRight, GraduationCap, BookOpen, Shield, Cloud, Cpu, List, Info, Users, Handshake, Star, Sparkles, Zap, School, Award, BookMarked, Laptop, Database, Lock, Server, Bot, Target, Briefcase, MessageCircle, Phone } from 'lucide-react';

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
            icon: Laptop,
            title: t('courses.webDevelopment') || 'Web Development',
            path: '/courses/web-development',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Database,
            title: t('courses.dataScience') || 'Data Science',
            path: '/courses/data-science',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            icon: Lock,
            title: t('courses.cybersecurity') || 'Cybersecurity',
            path: '/courses/cybersecurity',
            gradient: 'from-red-500 to-orange-500'
        },
        {
            icon: Server,
            title: t('courses.cloudComputing') || 'Cloud Computing',
            path: '/courses/cloud-computing',
            gradient: 'from-indigo-500 to-blue-500'
        },
        {
            icon: Bot,
            title: t('courses.aiMl') || 'AI & Machine Learning',
            path: '/courses/ai-ml',
            gradient: 'from-purple-500 to-pink-500'
        }
    ];

    const aboutLinks = [
        {
            icon: School,
            title: t('navigation.aboutUs') || 'About Us',
            path: '/about'
        },
        {
            icon: Users,
            title: t('navigation.ourTeam') || 'Our Team',
            path: '/team#team-members'
        },
        {
            icon: Handshake,
            title: t('navigation.industryPartners') || 'Industry Partners',
            path: '/team#industry-partners'
        },
        {
            icon: Award,
            title: t('navigation.studentSuccess') || 'Student Success',
            path: '/team#student-testimonials'
        }
    ];

    const navigationLinks = [
        {
            path: '/news',
            label: t('navigation.newsEvents') || 'News & Events',
            icon: BookOpen
        },
        {
            path: '/career-services',
            label: t('navigation.careerServices') || 'Career Services',
            icon: Briefcase
        },
        {
            path: '/contact',
            label: t('navigation.contact') || 'Contact',
            icon: MessageCircle
        }
    ];

    return (
        <>
            {/* Clean School Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-blue-100'
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">

                                                 {/* FIA Logo with Forum and Information Academy */}
                         <Link
                             to="/"
                             className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105 flex-shrink-0"
                         >
                             <div className="relative flex-shrink-0">
                                 {/* FIA Badge with gradient like Apply Now button */}
                                 <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300 relative">
                                     {/* FIA Initials */}
                                     <span className="text-lg font-bold text-white">
                                         FIA
                                     </span>
                                 </div>
                                 {/* Graduation Cap Icon */}
                                 <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                     <GraduationCap className="w-3 h-3 text-white" />
                                 </div>
                             </div>
                             {/* Full Name - All text visible on desktop */}
                             <div className="hidden md:block flex-shrink-0 min-w-0">
                                 <h1 className={`font-bold text-sm md:text-base leading-tight transition-colors duration-300 whitespace-nowrap ${
                                     scrolled
                                         ? 'text-blue-700'
                                         : 'text-white'
                                 }`}>
                                     Forum Information Academy
                                 </h1>
                                 <p className={`text-xs transition-colors duration-300 mt-0.5 ${
                                     scrolled
                                         ? 'text-blue-500'
                                         : 'text-blue-100'
                                 }`}>
                                     Technology Education
                                 </p>
                             </div>
                            {/* Mobile: Show "Forum" and "Information Academy" */}
                            <div className="md:hidden">
                                <div className="flex flex-col">
                                    <span className={`font-bold text-sm transition-colors duration-300 ${
                                        scrolled
                                            ? 'text-blue-700'
                                            : 'text-white'
                                    }`}>
                                        Forum
                                    </span>
                                    <span className={`font-semibold text-xs transition-colors duration-300 ${
                                        scrolled
                                            ? 'text-blue-600'
                                            : 'text-blue-100'
                                    }`}>
                                        Information<br />Academy
                                    </span>
                                </div>
                            </div>
                        </Link>

                        
                        <nav className="hidden lg:flex items-center space-x-6">
                            {/* Show horizontal links when Japanese, dropdown when English */}
                            {i18n.language === 'ja' ? (
                                <>
                                    {/* Japanese Horizontal Navigation */}
                                    <Link
                                        to="/courses"
                                        className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-300 group min-w-[60px] ${
                                            scrolled
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                : 'text-white hover:text-blue-100 hover:bg-white/10'
                                        } ${isActiveLink('/courses') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-100 bg-white/10') : ''} hover:scale-105`}
                                    >
                                        <BookOpen className="w-4 h-4 mb-1" />
                                        <span className="font-medium text-xs leading-tight text-center">
                                            {t('header.programs.title')}
                                        </span>
                                    </Link>
                                    
                                    <Link
                                        to="/about"
                                        className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-300 group min-w-[60px] ${
                                            scrolled
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                : 'text-white hover:text-blue-100 hover:bg-white/10'
                                        } ${isActiveLink('/about') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-100 bg-white/10') : ''} hover:scale-105`}
                                    >
                                        <School className="w-4 h-4 mb-1" />
                                        <span className="font-medium text-xs leading-tight text-center">
                                            {t('navigation.about') || 'About'}
                                        </span>
                                    </Link>
                                    
                                    {navigationLinks.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-300 group min-w-[60px] ${
                                                    scrolled
                                                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                        : 'text-white hover:text-blue-100 hover:bg-white/10'
                                                } ${isActiveLink(item.path) ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-100 bg-white/10') : ''} hover:scale-105`}
                                            >
                                                <IconComponent className="w-4 h-4 mb-1" />
                                                <span className="font-medium text-xs leading-tight text-center">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {/* English Dropdown Navigation */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('courses')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                    : 'text-white hover:text-blue-100 hover:bg-white/10'
                                            } ${isActiveLink('/courses') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-100 bg-white/10') : ''} hover:scale-105`}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            <span className="font-medium text-sm">
                                        {t('header.programs.title')}
                                    </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                                dropdownOpen === 'courses' ? 'rotate-180' : ''
                                            }`} />
                                </button>
                            
                                {/* Clean Dropdown Box */}
                                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 transition-all duration-300 z-50 ${
                                    dropdownOpen === 'courses'
                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                    <div className="w-80 max-w-[85vw] bg-white rounded-xl shadow-xl border border-gray-200 mt-2 overflow-hidden">
                                        {/* Simple Header */}
                                        <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center">
                                                <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                                                <h3 className="font-semibold text-gray-900">
                                                            {t('header.programs.subtitle')}
                                                        </h3>
                                            </div>
                                        </div>
                            
                                        {/* Programs List */}
                                        <div className="p-4">
                                            <div className="space-y-2">
                                                {coursesData.map((course, index) => {
                                                    const IconComponent = course.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            to={course.path}
                                                            className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                                        >
                                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${course.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                                                                <IconComponent className="w-5 h-5 text-white" />
                                                                    </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                                            {course.title}
                                                                        </h5>
                                                                <p className="text-xs text-gray-500">
                                                                        {t('header.programs.certifiedTrack')}
                                                                    </p>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                            
                                            {/* Simple Bottom Action */}
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <Link
                                                    to="/courses"
                                                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <List className="w-4 h-4 mr-2" />
                                                    <span>{t('navigation.viewAllPrograms') || 'Explore All Programs'}</span>
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* English About Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('about')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            : 'text-white hover:text-blue-100 hover:bg-white/10'
                                    } ${isActiveLink('/about') ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-100 bg-white/10') : ''} hover:scale-105`}
                                >
                                    <School className="w-4 h-4" />
                                    <span className="font-medium text-sm">
                                        {t('navigation.about') || 'About'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                        dropdownOpen === 'about' ? 'rotate-180' : ''
                                    }`} />
                                </button>
                            
                                {/* Clean About Dropdown */}
                                <div className={`absolute top-full left-0 w-80 max-w-[85vw] transition-all duration-300 z-50 ${
                                    dropdownOpen === 'about'
                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 mt-2 overflow-hidden">
                                        {/* Simple Header */}
                                        <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center">
                                                <School className="w-5 h-5 text-blue-600 mr-2" />
                                                <h3 className="font-semibold text-gray-900">
                                                            {t('header.about.title')}
                                                        </h3>
                                            </div>
                                        </div>
                            
                                        {/* About Links List */}
                                        <div className="p-4">
                                            <div className="space-y-2">
                                                {aboutLinks.map((link, index) => {
                                                    const IconComponent = link.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            to={link.path}
                                                            className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                                                                <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                                                    </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                                            {link.title}
                                                                        </h5>
                                                                <p className="text-xs text-gray-500">
                                                                        {t('header.about.description')}
                                                                    </p>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                            
                                            {/* Simple Bottom Action */}
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <Link
                                                    to="/about"
                                                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Info className="w-4 h-4 mr-2" />
                                                    <span>{t('header.about.learnMore')}</span>
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* English Navigation Links */}
                            {navigationLinks.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 group text-sm ${
                                        scrolled
                                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            : 'text-white hover:text-blue-200 hover:bg-white/10'
                                        } ${isActiveLink(item.path) ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''} hover:scale-105`}
                                >
                                        <IconComponent className="w-4 h-4" />
                                        <span>{item.label}</span>
                                </Link>
                                );
                            })}
                                </>
                            )}
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

                            {/* Clean Apply Button */}
                            <Link
                                to="/apply"
                                className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-sm font-semibold"
                            >
                                <Target className="w-4 h-4" />
                                <span className="whitespace-nowrap">{t('buttons.applyNow') || 'Apply Now'}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
                                        <BookOpen className="w-4 h-4" />
                                        <span className="font-medium text-sm">
                                            {t('navigation.programs') || 'Programs'}
                                        </span>
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
                                        <School className="w-4 h-4" />
                                        <span className="font-medium text-sm">
                                            {t('navigation.about') || 'About'}
                                        </span>
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
                            {navigationLinks.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                        <IconComponent className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                                );
                            })}

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
                                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm group hover:scale-105 hover:shadow-lg my-2"
                                >
                                    <Target className="w-4 h-4" />
                                    <span className="whitespace-nowrap">{t('buttons.applyNow') || 'Apply Now'}</span>
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
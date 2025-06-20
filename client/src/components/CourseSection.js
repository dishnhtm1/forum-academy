import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import webImage from '../assets/courses/web.jpg';
import dataImage from '../assets/courses/data.jpg';
import cyberImage from '../assets/courses/cyber.jpg';
import cloudImage from '../assets/courses/cloud.jpg';
import aiImage from '../assets/courses/ai.jpg';
import mobileImage from '../assets/courses/mobile.jpg';

const CourseSection = ({ limit, showFilters = false, title = "Our Featured Courses" }) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleCourses, setVisibleCourses] = useState(3);
    const sectionRef = useRef(null);
    
    const courses = [
        {
            id: 'web-dev',
            title: t('courseSection.courses.webDev.title'),
            description: t('courseSection.courses.webDev.description'),
            image: webImage,
            duration: t('courseSection.courses.webDev.duration'),
            startDate: t('courseSection.courses.webDev.startDate'),
            price: '¥350,000',
            originalPrice: '¥450,000',
            category: t('courseSection.courses.webDev.category'),
            badgeColor: 'blue',
            level: t('courseSection.courses.webDev.level'),
            rating: 4.9,
            students: 2847,
            features: [
                t('courseSection.courses.webDev.features.0'),
                t('courseSection.courses.webDev.features.1'),
                t('courseSection.courses.webDev.features.2')
            ]
        },
        {
            id: 'data-science',
            title: t('courseSection.courses.dataScience.title'),
            description: t('courseSection.courses.dataScience.description'),
            image: dataImage,
            duration: t('courseSection.courses.dataScience.duration'),
            startDate: t('courseSection.courses.dataScience.startDate'),
            price: '¥420,000',
            originalPrice: '¥520,000',
            category: t('courseSection.courses.dataScience.category'),
            badgeColor: 'green',
            level: t('courseSection.courses.dataScience.level'),
            rating: 4.8,
            students: 1923,
            features: [
                t('courseSection.courses.dataScience.features.0'),
                t('courseSection.courses.dataScience.features.1'),
                t('courseSection.courses.dataScience.features.2')
            ]
        },
        {
            id: 'cybersecurity',
            title: t('courseSection.courses.cybersecurity.title'),
            description: t('courseSection.courses.cybersecurity.description'),
            image: cyberImage,
            duration: t('courseSection.courses.cybersecurity.duration'),
            startDate: t('courseSection.courses.cybersecurity.startDate'),
            price: '¥400,000',
            originalPrice: '¥500,000',
            category: t('courseSection.courses.cybersecurity.category'),
            badgeColor: 'red',
            level: t('courseSection.courses.cybersecurity.level'),
            rating: 4.7,
            students: 1654,
            features: [
                t('courseSection.courses.cybersecurity.features.0'),
                t('courseSection.courses.cybersecurity.features.1'),
                t('courseSection.courses.cybersecurity.features.2')
            ]
        },
        {
            id: 'cloud-computing',
            title: t('courseSection.courses.cloudComputing.title'),
            description: t('courseSection.courses.cloudComputing.description'),
            image: cloudImage,
            duration: t('courseSection.courses.cloudComputing.duration'),
            startDate: t('courseSection.courses.cloudComputing.startDate'),
            price: '¥380,000',
            originalPrice: '¥480,000',
            category: t('courseSection.courses.cloudComputing.category'),
            badgeColor: 'cyan',
            level: t('courseSection.courses.cloudComputing.level'),
            rating: 4.8,
            students: 2156,
            features: [
                t('courseSection.courses.cloudComputing.features.0'),
                t('courseSection.courses.cloudComputing.features.1'),
                t('courseSection.courses.cloudComputing.features.2')
            ]
        },
        {
            id: 'ai-ml',
            title: t('courseSection.courses.aiMl.title'),
            description: t('courseSection.courses.aiMl.description'),
            image: aiImage,
            duration: t('courseSection.courses.aiMl.duration'),
            startDate: t('courseSection.courses.aiMl.startDate'),
            price: '¥450,000',
            originalPrice: '¥550,000',
            category: t('courseSection.courses.aiMl.category'),
            badgeColor: 'purple',
            level: t('courseSection.courses.aiMl.level'),
            rating: 4.9,
            students: 987,
            features: [
                t('courseSection.courses.aiMl.features.0'),
                t('courseSection.courses.aiMl.features.1'),
                t('courseSection.courses.aiMl.features.2')
            ]
        },
        {
            id: 'mobile-dev',
            title: t('courseSection.courses.mobileDev.title'),
            description: t('courseSection.courses.mobileDev.description'),
            image: mobileImage,
            duration: t('courseSection.courses.mobileDev.duration'),
            startDate: t('courseSection.courses.mobileDev.startDate'),
            price: '¥370,000',
            originalPrice: '¥470,000',
            category: t('courseSection.courses.mobileDev.category'),
            badgeColor: 'orange',
            level: t('courseSection.courses.mobileDev.level'),
            rating: 4.6,
            students: 1743,
            features: [
                t('courseSection.courses.mobileDev.features.0'),
                t('courseSection.courses.mobileDev.features.1'),
                t('courseSection.courses.mobileDev.features.2')
            ]
        }
    ];
    
    // Keep existing useEffect and logic functions
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
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
    
    const filteredCourses = activeFilter === 'all'
        ? courses
        : courses.filter(course => course.category.toLowerCase() === activeFilter.toLowerCase());
    
    const displayedCourses = filteredCourses.slice(0, visibleCourses);
    
    const getBadgeStyles = (color) => {
        const styles = {
            blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
            green: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
            red: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
            cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white',
            purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
            orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
        };
        return styles[color] || styles.blue;
    };
    
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden" id="courses" ref={sectionRef}>
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
                <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                        <span className="material-icons text-sm">school</span>
                        {t('courseSection.header.badge')}
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {title === "Our Featured Courses" || title === t('courseSection.header.title') ? (
                            <>
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('courseSection.header.title')}
                                </span>
                            </>
                        ) : (
                            title
                        )}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t('courseSection.header.subtitle')}
                    </p>
                </div>

                {/* Enhanced Filters */}
                {showFilters && (
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {[
                            { key: 'all', label: t('courseSection.filters.all'), icon: 'apps' },
                            { key: 'web development', label: t('courseSection.filters.webDevelopment'), icon: 'code' },
                            { key: 'data science', label: t('courseSection.filters.dataScience'), icon: 'analytics' },
                            { key: 'cybersecurity', label: t('courseSection.filters.cybersecurity'), icon: 'security' },
                            { key: 'cloud computing', label: t('courseSection.filters.cloudComputing'), icon: 'cloud' }
                        ].map(filter => (
                            <button
                                key={filter.key}
                                className={`group px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    activeFilter === filter.key
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:scale-105'
                                }`}
                                onClick={() => filterCourses(filter.key)}
                            >
                                <span className="material-icons text-sm">{filter.icon}</span>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Enhanced Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {displayedCourses.map((course, index) => (
                        <div
                            key={course.id}
                            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 overflow-hidden border border-gray-100 relative"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Image Section with Overlay */}
                            <div className="relative overflow-hidden h-56">
                                <img 
                                    src={course.image} 
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Category Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${getBadgeStyles(course.badgeColor)}`}>
                                    {course.category}
                                </div>
                                
                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <span className="material-icons text-yellow-400 text-sm">star</span>
                                    <span className="text-sm font-bold text-gray-800">{course.rating}</span>
                                </div>
                                
                                {/* Price Badge */}
                                <div className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 rounded-xl shadow-lg">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{course.price}</div>
                                        <div className="text-xs text-gray-500 line-through">{course.originalPrice}</div>
                                    </div>
                                </div>
                                
                                {/* Hover Overlay with Quick Actions */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <Link 
                                        to={`/courses/${course.id}`}
                                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <span className="material-icons text-sm">visibility</span>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-8">
                                {/* Course Meta Info */}
                                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-sm">schedule</span>
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-sm">people</span>
                                        <span>{course.students.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-sm">signal_cellular_alt</span>
                                        <span>{course.level}</span>
                                    </div>
                                </div>
                                
                                {/* Course Title */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {course.title}
                                </h3>
                                
                                {/* Course Description */}
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {course.description}
                                </p>
                                
                                {/* Course Features */}
                                <div className="space-y-3 mb-6">
                                    {course.features.slice(0, 3).map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <span className="material-icons text-green-500 text-sm mt-1">check_circle</span>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Start Date */}
                                <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl">
                                    <span className="material-icons text-blue-600 text-sm">event</span>
                                    <span className="text-sm text-blue-700">
                                        <strong>Starts:</strong> {course.startDate}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action Footer */}
                            <div className="px-8 pb-8">
                                <div className="flex gap-3">
                                    <Link 
                                        to={`/courses/${course.id}`}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <span className="material-icons text-sm">school</span>
                                        {t('courseSection.buttons.enrollNow') || 'Enroll Now'}
                                    </Link>
                                    <button className="px-4 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                                        <span className="material-icons text-gray-500 group-hover:text-blue-500">favorite_border</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Floating Elements */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                        </div>
                    ))}
                </div>
                
                {/* View More Button */}
                {visibleCourses < courses.length && (
                    <div className="text-center mb-12">
                        <button 
                            onClick={showMoreCourses}
                            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-gray-900 hover:to-black transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                            <span className="material-icons">expand_more</span>
                            {t('courseSection.buttons.viewAllCourses')}
                        </button>
                    </div>
                )}
                
                {/* Call to Action */}
                {window.location.pathname !== '/courses' && (
                    <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                        <h3 className="text-3xl font-bold mb-4">{t('courseSection.cta.title')}</h3>
                        <p className="text-xl mb-8 opacity-90">{t('courseSection.cta.description')}</p>
                        <Link 
                            to="/courses"
                            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <span className="material-icons">arrow_forward</span>
                            {t('courseSection.buttons.browseAllPrograms')}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseSection;
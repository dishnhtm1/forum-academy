import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CourseSection from '../components/CourseSection';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import NewsSection from '../components/NewsSection';
import ContactSection from '../components/ContactSection';
import Hero from '../components/Hero';

const HomePage = () => {
    const { t } = useTranslation();

    // Add animation effects when components enter viewport
    useEffect(() => {
        // If anime.js is available, add entry animations for sections
        if (window.anime) {
            const sections = document.querySelectorAll('.home-page .section');
            sections.forEach((section) => {
                // Observe when section enters viewport
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Animate section when it comes into view
                            window.anime({
                                targets: entry.target,
                                opacity: [0, 1],
                                translateY: [20, 0],
                                easing: 'easeOutQuad',
                                duration: 600,
                                delay: 100
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(section);
            });
        }
    }, []);

    return (
        <div className="home-page bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
            {/* Hero Section - No gap, seamless with header */}
            <div className="pt-0">
                <Hero />
            </div>
                
            {/* Course Catalog Section - Key Feature 1 */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-8 sm:py-12 md:py-16 lg:py-20" id="courses">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Modern Gradient Header Design */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative overflow-hidden">
                        {/* Gradient Background with Animated Elements */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl opacity-90"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                        
                        {/* Animated Background Orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 p-8 sm:p-10 md:p-12 lg:p-16">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
                                {/* Title Section */}
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-white/90 text-sm font-medium">{t('home.courses.title')}</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                                        {t('home.courses.title')}
                                    </h2>
                                    {/* Decorative Line */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    </div>
                                </div>
                                
                                {/* Description Section */}
                                <div className="flex-1 lg:max-w-lg lg:pt-4">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-white/95 text-base sm:text-lg leading-relaxed pt-1">
                                                {t('home.courses.description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course filters - Enhanced Design with Mobile Responsiveness */}
                    <div className="course-filters relative mb-8 sm:mb-12 md:mb-16">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl opacity-50"></div>
                        <div className="absolute top-2 sm:top-4 left-4 sm:left-8 w-12 sm:w-20 h-12 sm:h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
                        <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-8 w-10 sm:w-16 h-10 sm:h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-300"></div>
                        
                        <div className="relative z-10 p-4 sm:p-6 md:p-8">
                    
                            {/* Filter buttons grid - Improved Mobile Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto">
                                {/* All Courses */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    {/* Animated background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-blue-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-blue-600 group-hover:text-white transition-colors duration-300">school</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('home.courses.allCourses')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-blue-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            All Programs
                                        </div>
                                    </div>
                    
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                    
                                {/* Web Development */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-green-500 hover:to-teal-500 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-green-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-green-600 group-hover:text-white transition-colors duration-300">code</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('courses.webDevelopment')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-green-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            Frontend & Backend
                                        </div>
                                    </div>
                    
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                    
                                {/* Data Science */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-orange-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-orange-600 group-hover:text-white transition-colors duration-300">analytics</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('courses.dataScience')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-orange-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            AI & Analytics
                                        </div>
                                    </div>
                    
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                    
                                {/* Cybersecurity */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-red-600 hover:to-pink-600 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-red-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-red-600 group-hover:text-white transition-colors duration-300">security</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('courses.cybersecurity')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-red-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            Ethical Hacking
                                        </div>
                                    </div>
                    
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                    
                                {/* Cloud Computing */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-500 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-cyan-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-cyan-600 group-hover:text-white transition-colors duration-300">cloud</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('courses.cloudComputing')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-cyan-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            AWS & Azure
                                        </div>
                                    </div>
                    
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                    
                                {/* AI & ML */}
                                <button className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-600 border-2 border-gray-200 hover:border-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-purple-100 group-hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                            <span className="material-icons text-lg sm:text-xl md:text-2xl text-purple-600 group-hover:text-white transition-colors duration-300">smart_toy</span>
                                        </div>
                                        <div className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                            {t('courses.aiMl')}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-purple-100 transition-colors duration-300 mt-0.5 sm:mt-1 hidden sm:block">
                                            Neural Networks
                                        </div>
                                    </div>
                    
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                                </button>
                            </div>
                    
                            {/* Bottom stats - Mobile Optimized */}
                            <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">6</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Categories</div>
                                </div>
                                <div className="w-px h-6 sm:h-8 bg-gray-300"></div>
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">50+</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Courses</div>
                                </div>
                                <div className="w-px h-6 sm:h-8 bg-gray-300"></div>
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">15k+</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Students</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <CourseSection />
                </div>
            </section>

            {/* About Section - Key Feature 2 */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-8 sm:py-12 md:py-16 lg:py-20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AboutSection />
                </div>
            </section>

            {/* Stats Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden" id="stats">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-300"></div>
                    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-700"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-cyan-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
                </div>
                
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Modern Gradient Header Design for Stats */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative overflow-hidden">
                        {/* Gradient Background with Animated Elements */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-90"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                        
                        {/* Animated Background Orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 p-8 sm:p-10 md:p-12 lg:p-16">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
                                {/* Title Section */}
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-white/90 text-sm font-medium">{t('home.stats.title')}</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                                        <span className="block">{t('home.stats.title').split(' ')[0]}</span>
                                        <span className="block">{t('home.stats.title').split(' ').slice(1).join(' ')}</span>
                                    </h2>
                                    {/* Decorative Line */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    </div>
                                </div>
                                
                                {/* Description Section */}
                                <div className="flex-1 lg:max-w-lg lg:pt-4">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <p className="text-white/95 text-base sm:text-lg leading-relaxed pt-1">
                                                {t('home.stats.description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <StatsSection />
                </div>
            </section>

            {/* News Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-8 sm:py-12 md:py-16 lg:py-20" id="news">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NewsSection 
                        title={t('home.news.title')}
                        subtitle={t('home.news.subtitle')}
                    />
                </div>
            </section>
            
            {/* Contact Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-8 sm:py-12 md:py-16 lg:py-20" id="contact">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ContactSection 
                        title={t('home.contact.title')}
                        subtitle={t('home.contact.subtitle')}
                    />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
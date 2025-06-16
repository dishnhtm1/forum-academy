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
            {/* Hero Section */}
            <Hero />
                
            {/* Course Catalog Section - Key Feature 1 */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-16 lg:py-20" id="courses">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="section-header text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 relative">
                            {t('home.courses.title')}
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full"></div>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mt-6 max-w-2xl mx-auto">
                            {t('home.courses.description')}
                        </p>
                    </div>
                    
                    {/* Course filters */}
                    <div className="course-filters relative overflow-x-auto py-4 mb-12">
                        <div className="flex gap-3 sm:gap-4 min-w-max px-4 sm:px-0">
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm bg-slate-50 border-slate-300 text-slate-700">
                                <span className="material-icons text-xl">school</span>
                                <span className="text-sm sm:text-base">{t('home.courses.allCourses')}</span>
                            </button>
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm">
                                <span className="material-icons text-xl">code</span>
                                <span className="text-sm sm:text-base">{t('courses.webDevelopment')}</span>
                            </button>
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm">
                                <span className="material-icons text-xl">analytics</span>
                                <span className="text-sm sm:text-base">{t('courses.dataScience')}</span>
                            </button>
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm">
                                <span className="material-icons text-xl">security</span>
                                <span className="text-sm sm:text-base">{t('courses.cybersecurity')}</span>
                            </button>
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm">
                                <span className="material-icons text-xl">cloud</span>
                                <span className="text-sm sm:text-base">{t('courses.cloudComputing')}</span>
                            </button>
                            <button className="filter-btn flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 sm:px-6 py-3 font-medium text-slate-600 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap shadow-sm">
                                <span className="material-icons text-xl">smart_toy</span>
                                <span className="text-sm sm:text-base">{t('courses.aiMl')}</span>
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none sm:hidden"></div>
                    </div>
                    
                    <CourseSection />
                </div>
            </section>

            {/* About Section - Key Feature 2 */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-16 lg:py-20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AboutSection />
                </div>
            </section>

            {/* Stats Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-16 lg:py-20" id="stats">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="section-header text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 relative">
                            {t('home.stats.title')}
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full"></div>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mt-6 max-w-2xl mx-auto">
                            {t('home.stats.description')}
                        </p>
                    </div>
                    <StatsSection />
                </div>
            </section>

            {/* News Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-16 lg:py-20" id="news">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NewsSection 
                        title={t('home.news.title')}
                        subtitle={t('home.news.subtitle')}
                    />
                </div>
            </section>
            
            {/* Contact Section */}
            <section className="section opacity-0 transform translate-y-5 transition-all duration-600 ease-out py-16 lg:py-20" id="contact">
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
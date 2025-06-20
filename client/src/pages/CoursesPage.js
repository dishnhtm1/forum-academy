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
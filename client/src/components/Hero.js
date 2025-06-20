import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImage from '../assets/student/hero3.jpg';

const Hero = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        // Mouse movement for parallax effect
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        // Create floating elements
        const createFloatingElements = () => {
            const heroSection = document.querySelector('.hero-container');
            if (!heroSection) return;
            
            // Create floating particles with lighter colors
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 6 + 3}px;
                    height: ${Math.random() * 6 + 3}px;
                    background: linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.6 + 0.3};
                    animation: float ${Math.random() * 4 + 3}s ease-in-out infinite alternate;
                    z-index: 1;
                    box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
                `;
                heroSection.appendChild(particle);
            }
            
            // Create geometric shapes with lighter colors
            for (let i = 0; i < 6; i++) {
                const shape = document.createElement('div');
                shape.className = 'floating-shape';
                const isCircle = Math.random() > 0.5;
                shape.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 50 + 30}px;
                    height: ${Math.random() * 50 + 30}px;
                    background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
                    border: 1px solid rgba(96, 165, 250, 0.4);
                    ${isCircle ? 'border-radius: 50%;' : 'border-radius: 8px; transform: rotate(45deg);'}
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 5 + 4}s ease-in-out infinite alternate;
                    z-index: 1;
                    box-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
                `;
                heroSection.appendChild(shape);
            }
        };
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                100% { transform: translateY(-15px) translateX(8px) rotate(8deg); }
            }
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.4); }
                50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.6); }
            }
            @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        createFloatingElements();
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);
    
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 overflow-hidden">
            {/* Background Elements */}
            <div className="hero-container absolute inset-0"></div>
            
            {/* Animated Background Gradient */}
            <div 
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(96, 165, 250, 0.3) 0%, rgba(167, 139, 250, 0.2) 30%, transparent 60%)`
                }}
            ></div>
            
            {/* Grid Pattern
            <div className="absolute inset-0 opacity-15">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div> */}

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-15">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px'  // Changed from '40px 40px' to '80px 80px' for bigger grid
                }}></div>
            </div>
            
            {/* Main Content Container with proper header spacing */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Content wrapper with header offset */}
                <div className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-12 sm:pb-16 md:pb-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-12rem)]">
                        
                        {/* Left Content */}
                        <div className={`w-full lg:w-1/2 space-y-6 sm:space-y-8 md:space-y-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            
                            {/* Main Title - Enhanced visibility */}
                            <div className="space-y-3 sm:space-y-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                                    <span className="block bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                                        {t('hero.title.line1') || 'Transform Your Future with'}
                                    </span>
                                    <span className="block relative mt-2">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse drop-shadow-md">
                                            {t('hero.title.highlight') || 'Technology'}
                                        </span>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-30 animate-pulse"></div>
                                    </span>
                                    <span className="block bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm mt-2">
                                        {t('hero.title.line2') || 'Education'}
                                    </span>
                                </h1>
                            </div>
                            
                            {/* Description - Improved readability */}
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium max-w-2xl">
                                {t('hero.description') || 'Join thousands of students mastering cutting-edge technologies. Start your journey to a successful tech career today.'}
                            </p>
                            
                            {/* CTA Buttons - Better spacing */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                                <Link 
                                    to="/courses" 
                                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-blue-400/40 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center space-x-2">
                                        <span>{t('hero.buttons.explorePrograms') || 'Explore Programs'}</span>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </Link>
                                
                                <Link 
                                    to="/apply" 
                                    className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-500 text-blue-700 bg-white/80 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg backdrop-blur-sm hover:bg-blue-50 hover:border-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span className="group-hover:text-blue-800 transition-colors duration-300">
                                        {t('hero.buttons.applyNow') || 'Apply Now'}
                                    </span>
                                </Link>
                            </div>
                            
                            {/* Stats - Improved visibility */}
                            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 border-t-2 border-blue-200/60">
                                <div className="text-center group">
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                        93%
                                    </div>
                                    <div className="text-gray-700 text-xs sm:text-sm md:text-base mt-1 font-semibold">
                                        {t('hero.stats.jobPlacement') || 'Job Placement'}
                                    </div>
                                </div>
                                
                                <div className="text-center group">
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                        50+
                                    </div>
                                    <div className="text-gray-700 text-xs sm:text-sm md:text-base mt-1 font-semibold">
                                        {t('hero.stats.industryPartners') || 'Partners'}
                                    </div>
                                </div>
                                
                                <div className="text-center group">
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                        15+
                                    </div>
                                    <div className="text-gray-700 text-xs sm:text-sm md:text-base mt-1 font-semibold">
                                        {t('hero.stats.yearsExcellence') || 'Years'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Content - Image */}
                        <div className={`w-full lg:w-1/2 mt-12 lg:mt-0 lg:pl-8 xl:pl-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="relative group max-w-lg mx-auto lg:max-w-none">
                                
                                {/* Main Image Container */}
                                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-200/40 to-purple-200/40 backdrop-blur-sm border border-white/60 shadow-2xl group-hover:shadow-blue-400/30 transition-all duration-500">
                                    
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                    
                                    {/* <div className="relative p-3 sm:p-4">
                                        <img 
                                            src={heroImage} 
                                            alt={t('hero.imageAlt') || 'Technology Education'}
                                            className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        
                                        Image Overlay
                                        <div className="absolute inset-3 sm:inset-4 bg-gradient-to-t from-blue-200/20 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
                                    </div> */}
                                    <div className="relative p-3 sm:p-4 max-w-2xl mx-auto"> {/* Constrains container width */}
                                        <img 
                                            src={heroImage} 
                                            alt={t('hero.imageAlt') || 'Technology Education'}
                                            className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        
                                        {/* Image Overlay */}
                                        <div className="absolute inset-3 sm:inset-4 bg-gradient-to-t from-blue-200/20 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
                                    </div>
                                </div>
                                
                                {/* Floating Tech Tags - Responsive positioning */}
                                <div className="absolute -right-4 sm:-right-6 lg:-right-8 top-6 sm:top-8 space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-md border border-blue-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-bounce">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-xs sm:text-sm">
                                            {t('hero.techTags.webDevelopment') || 'Web Dev'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="absolute -left-4 sm:-left-6 lg:-left-8 top-24 sm:top-32 space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-md border border-purple-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-xs sm:text-sm">
                                            {t('hero.techTags.cybersecurity') || 'Security'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="absolute -right-2 sm:-right-4 bottom-16 sm:bottom-20 space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-md border border-pink-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-xs sm:text-sm">
                                            {t('hero.techTags.dataScience') || 'Data Science'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="absolute -left-2 sm:-left-4 bottom-6 sm:bottom-8 space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-md border border-green-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-bounce" style={{animationDelay: '1.5s'}}>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-xs sm:text-sm">
                                            {t('hero.techTags.cloudComputing') || 'Cloud'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-blue-50 to-transparent"></div>
        </section>
    );
};

export default Hero;
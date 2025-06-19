import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Sparkles, 
    Users, 
    Building2, 
    Lightbulb, 
    Eye, 
    ArrowDown,
    School,
    Computer,
    Award,
    HeadphonesIcon,
    Briefcase,
    GraduationCap,
    Globe,
    Star,
    ChevronDown,
    Heart,
    Target,
    Zap
} from 'lucide-react';
import storyImage from '../assets/images/logo1.png';

const AboutPage = () => {
    const { t } = useTranslation();
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const heroRef = useRef(null);
    
    // Keep ALL your existing animation code exactly as is
    useEffect(() => {
        // Make hero visible with animation
        setIsHeroVisible(true);
        
        // Create animated elements for hero section
        createHeroAnimatedElements();
        
        const sections = document.querySelectorAll('.about-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
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
        };
    }, []);
    
    // Simplified animated elements for Tailwind design
    const createHeroAnimatedElements = () => {
        // Keep your existing animation logic but simplified for Tailwind
        const container = document.querySelector('.hero-animated-bg');
        if (!container) return;
        
        // Clear existing elements
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create floating shapes
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            const shapes = ['w-4 h-4 bg-blue-300/20 rounded-full', 'w-6 h-6 bg-purple-300/20 rounded-lg', 'w-3 h-3 bg-pink-300/20 rotate-45'];
            shape.className = `absolute animate-float ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;
            shape.style.animationDelay = `${delay}s`;
            
            container.appendChild(shape);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Enhanced Hero Section */}
            <section 
                ref={heroRef}
                className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Animated Background */}
                <div className="absolute inset-0">
                    {/* Gradient Orbs */}
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                    
                    {/* Floating Elements Container */}
                    <div className="hero-animated-bg absolute inset-0"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                            {t('about.hero.badge')}
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            {t('about.hero.title')}{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                                {t('about.hero.highlight')}
                            </span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                            {t('about.hero.description')}
                        </p>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                                        <div className="text-4xl font-black text-blue-600 mb-2">15+</div>
                                        <div className="text-gray-600 font-medium">{t('about.stats.yearsExcellence')}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300">
                                        <div className="text-4xl font-black text-purple-600 mb-2">5,000+</div>
                                        <div className="text-gray-600 font-medium">{t('about.stats.graduates')}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-pink-300 transition-all duration-300">
                                        <div className="text-4xl font-black text-pink-600 mb-2">200+</div>
                                        <div className="text-gray-600 font-medium">{t('about.stats.partners')}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300">
                                        <div className="text-4xl font-black text-green-600 mb-2">98%</div>
                                        <div className="text-gray-600 font-medium">{t('about.stats.employmentRate')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                            <a 
                                href="#our-story" 
                                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                <span className="relative z-10">{t('about.hero.ourJourney')}</span>
                            </a>
                            
                            <a 
                                href="/contact" 
                                className="group relative inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold text-lg rounded-full hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-xl transform hover:scale-105"
                            >
                                <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                <span>{t('about.hero.getInTouch')}</span>
                            </a>
                        </div>
                        
                        {/* Scroll Indicator */}
                        <div className="animate-bounce">
                            <a 
                                href="#our-story"
                                className="inline-flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                            >
                                <span className="text-sm font-medium mb-2 group-hover:text-blue-600">{t('about.hero.discoverStory')}</span>
                                <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Our Story Section */}
            <section id="our-story" className="about-section py-20 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] [background-size:20px_20px]"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {t('about.story.title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about.story.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Story Image */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                                <img 
                                    src={storyImage} 
                                    alt={t('about.story.imageAlt')} 
                                    className="w-full h-auto rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        
                        {/* Story Content */}
                        <div className="space-y-6">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {t('about.story.paragraph1')}
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {t('about.story.paragraph2')}
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {t('about.story.paragraph3')}
                                </p>
                            </div>
                            
                            {/* Timeline */}
                            <div className="space-y-6 mt-12">
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            2010
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-blue-50 rounded-lg p-4 group-hover:bg-blue-100 transition-colors duration-300">
                                        <p className="text-gray-700 font-medium">{t('about.timeline.founded')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            2013
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-purple-50 rounded-lg p-4 group-hover:bg-purple-100 transition-colors duration-300">
                                        <p className="text-gray-700 font-medium">{t('about.timeline.dataScience')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            2016
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors duration-300">
                                        <p className="text-gray-700 font-medium">{t('about.timeline.osaka')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            2020
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-green-50 rounded-lg p-4 group-hover:bg-green-100 transition-colors duration-300">
                                        <p className="text-gray-700 font-medium">{t('about.timeline.celebration')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Us Section */}
            <section className="about-section py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {t('about.whyChoose.title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about.whyChoose.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(0)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur transition duration-500 ${activeCard === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                    {t('about.features.partnerships.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.partnerships.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 2 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(1)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl blur transition duration-500 ${activeCard === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                                    {t('about.features.instructors.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.instructors.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 3 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(2)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl blur transition duration-500 ${activeCard === 2 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-pink-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Computer className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                                    {t('about.features.facilities.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.facilities.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 4 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(3)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur transition duration-500 ${activeCard === 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                                    {t('about.features.careerServices.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.careerServices.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 5 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(4)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl blur transition duration-500 ${activeCard === 4 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                    {t('about.features.certifications.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.certifications.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 6 */}
                        <div 
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setActiveCard(5)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur transition duration-500 ${activeCard === 5 ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-orange-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <HeadphonesIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                    {t('about.features.support.title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('about.features.support.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Mission & Vision Section */}
            <section className="about-section py-20 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="flex items-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        {t('about.mission.title')}
                                    </h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {t('about.mission.description')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Vision */}
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105">
                                <div className="flex items-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                        <Eye className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                        {t('about.vision.title')}
                                    </h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {t('about.vision.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Team Section */}
            <section className="about-section py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {t('about.team.title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about.team.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Team Member 1 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                                    S
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {t('about.team.members.shashini.name')}
                                </h3>
                                <p className="text-blue-600 font-semibold mb-4">
                                    {t('about.team.members.shashini.role')}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t('about.team.members.shashini.bio')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Team Member 2 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                                    T
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                    {t('about.team.members.thilini.name')}
                                </h3>
                                <p className="text-purple-600 font-semibold mb-4">
                                    {t('about.team.members.thilini.role')}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t('about.team.members.thilini.bio')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Team Member 3 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-pink-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                                    D
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                                    {t('about.team.members.diushan.name')}
                                </h3>
                                <p className="text-pink-600 font-semibold mb-4">
                                    {t('about.team.members.diushan.role')}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t('about.team.members.diushan.bio')}
                                </p>
                            </div>
                        </div>
                        
                        {/* Team Member 4 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                                    J
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                    {t('about.team.members.john.name')}
                                </h3>
                                <p className="text-green-600 font-semibold mb-4">
                                    {t('about.team.members.john.role')}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t('about.team.members.john.bio')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
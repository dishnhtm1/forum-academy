import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import studentsImage from '../assets/images/png7.jpg'; 
import studentProfileImage from '../assets/images/png1.jpg';

const AboutSection = ({ showAllFeatures = false }) => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [activeFeature, setActiveFeature] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
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
    
    const coreFeatures = [
        {
            icon: "handshake",
            title: t('aboutSection.features.partnerships.title'),
            description: t('aboutSection.features.partnerships.description'),
            highlight: t('aboutSection.features.partnerships.highlight'),
            gradient: "from-blue-500 via-indigo-500 to-purple-500",
            iconBg: "from-blue-400 to-indigo-500",
            glowColor: "blue-500/20"
        },
        {
            icon: "psychology",
            title: t('aboutSection.features.instructors.title'),
            description: t('aboutSection.features.instructors.description'),
            highlight: t('aboutSection.features.instructors.highlight'),
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            iconBg: "from-emerald-400 to-teal-500",
            glowColor: "emerald-500/20"
        },
        {
            icon: "dashboard",
            title: t('aboutSection.features.facilities.title'),
            description: t('aboutSection.features.facilities.description'),
            highlight: t('aboutSection.features.facilities.highlight'),
            gradient: "from-amber-500 via-orange-500 to-red-500",
            iconBg: "from-amber-400 to-orange-500",
            glowColor: "amber-500/20"
        },
        {
            icon: "rocket_launch",
            title: t('aboutSection.features.career.title'),
            description: t('aboutSection.features.career.description'),
            highlight: t('aboutSection.features.career.highlight'),
            gradient: "from-purple-500 via-pink-500 to-rose-500",
            iconBg: "from-purple-400 to-pink-500",
            glowColor: "purple-500/20"
        }
    ];
    
    const additionalFeatures = [
        {
            icon: "verified",
            title: t('aboutSection.features.certifications.title'),
            description: t('aboutSection.features.certifications.description'),
            highlight: t('aboutSection.features.certifications.highlight'),
            gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
            iconBg: "from-rose-400 to-pink-500",
            glowColor: "rose-500/20"
        },
        {
            icon: "support_agent",
            title: t('aboutSection.features.support.title'),
            description: t('aboutSection.features.support.description'),
            highlight: t('aboutSection.features.support.highlight'),
            gradient: "from-teal-500 via-cyan-500 to-sky-500",
            iconBg: "from-teal-400 to-cyan-500",
            glowColor: "teal-500/20"
        }
    ];
    
    const displayFeatures = showAllFeatures ? 
        [...coreFeatures, ...additionalFeatures] : 
        coreFeatures;
        
    return (
        <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-96 -left-96 w-[900px] h-[900px] bg-gradient-to-tr from-cyan-400/10 via-teal-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
                <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-bl from-pink-400/5 to-rose-400/5 rounded-full blur-xl animate-pulse delay-700"></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/20 rotate-45 animate-pulse delay-500"></div>
                <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cyan-400/20 rounded-full animate-bounce delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-pink-400/20 rotate-12 animate-pulse delay-1500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header Section */}
                <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full text-sm font-bold mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-30 animate-pulse"></div>
                        <span className="material-icons text-lg relative z-10">info</span>
                        <span className="relative z-10">{t('aboutSection.header.badge')}</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                            {t('aboutSection.header.title')}
                        </span>
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-medium">
                        {t('aboutSection.header.subtitle')}
                    </p>
                    
                    {/* Decorative Line */}
                    <div className="flex justify-center mt-8">
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    </div>
                </div>
                
                {/* Enhanced Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {displayFeatures.map((feature, index) => (
                        <div 
                            key={index}
                            className={`group relative transition-all duration-700 transform ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                            onMouseEnter={() => setActiveFeature(index)}
                            onMouseLeave={() => setActiveFeature(null)}
                        >
                            {/* Card */}
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer overflow-hidden border border-white/20">
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                                
                                {/* Animated Border */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
                                     style={{ padding: '2px', background: `linear-gradient(45deg, transparent, ${feature.glowColor}, transparent)` }}>
                                    <div className="w-full h-full bg-white rounded-3xl"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Enhanced Icon */}
                                    <div className="relative mb-8">
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                                            <span className="material-icons text-3xl text-white drop-shadow-sm">{feature.icon}</span>
                                        </div>
                                        {/* Icon Glow */}
                                        <div className={`absolute top-0 left-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.iconBg} opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500`}></div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                    
                                    <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                                        <span className="material-icons text-sm mr-1">star</span>
                                        {feature.highlight}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Enhanced CTA Section */}
                {!showAllFeatures && (
                    <div className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mb-20 transition-all duration-1000 border border-white/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
                        
                        <div className="relative grid lg:grid-cols-2 gap-0">
                            {/* Enhanced Image Side */}
                            <div className="relative h-80 lg:h-auto overflow-hidden group">
                                <img 
                                    src={studentsImage} 
                                    alt={t('aboutSection.cta.imageAlt')}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                                
                                {/* Floating Elements */}
                                <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="material-icons text-white text-lg">school</span>
                                </div>
                                <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="material-icons text-white text-xl">trending_up</span>
                                </div>
                            </div>
                            
                            {/* Enhanced Content Side */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold mb-8 w-fit shadow-lg">
                                    <span className="material-icons text-lg">trending_up</span>
                                    {t('aboutSection.cta.badge')}
                                </div>
                                
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                    {t('aboutSection.cta.title')}
                                </h3>
                                
                                <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">
                                    {t('aboutSection.cta.description')}
                                </p>
                                
                                {/* Enhanced Stats */}
                                <div className="flex gap-12 mb-10">
                                    <div className="text-center">
                                        <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">15+</div>
                                        <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">{t('aboutSection.cta.stats.years')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">5,000+</div>
                                        <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">{t('aboutSection.cta.stats.graduates')}</div>
                                    </div>
                                </div>
                                
                                <Link 
                                    to="/about" 
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 w-fit group"
                                >
                                    {t('aboutSection.cta.button')}
                                    <span className="material-icons group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Enhanced Testimonial Section */}
                <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white overflow-hidden shadow-2xl">
                        {/* Enhanced Background Pattern */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full transform translate-x-40 -translate-y-40 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full transform -translate-x-32 translate-y-32 blur-2xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/3 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        </div>
                        
                        {/* Floating Quote Decoration */}
                        <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="material-icons text-2xl text-white/60">format_quote</span>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="flex-shrink-0">
                                    <span className="material-icons text-5xl text-yellow-300 drop-shadow-lg">format_quote</span>
                                </div>
                                <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed italic text-white/95">
                                    {t('aboutSection.testimonial.quote')}
                                </blockquote>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img 
                                        src={studentProfileImage} 
                                        alt={t('aboutSection.testimonial.author.name')}
                                        className="w-20 h-20 rounded-full border-4 border-white/30 object-cover shadow-lg"
                                    />
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                                </div>
                                <div>
                                    <div className="font-bold text-xl text-white mb-1">{t('aboutSection.testimonial.author.name')}</div>
                                    <div className="text-blue-100 font-medium">{t('aboutSection.testimonial.author.title')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
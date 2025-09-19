import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import partner logos
import microsoftLogo from '../assets/partners/microsoft.png';
import googleLogo from '../assets/partners/gmail.png';
import amazonLogo from '../assets/partners/amazon.png';
import nttLogo from '../assets/partners/ntt.png';
import mercariLogo from '../assets/partners/mercari.png';
import doccomoLogo from '../assets/partners/doccomo.png';
import yahooLogo from '../assets/partners/yahoo.png';
import suzukiLogo from '../assets/partners/suzuki.png';
import hondaLogo from '../assets/partners/honda.png';

import png1Image from '../assets/images/png9.jpg';
import png2Image from '../assets/images/png20.jpg';
import png3Image from '../assets/images/png1.jpg';

function CareerServicesPage() {
    const { t } = useTranslation();
    
    // React state for FAQ management
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };
    
    // Keep ALL existing animation code exactly as is
    useEffect(() => {
    
        // Animate elements when they enter the viewport
        const animatedElements = document.querySelectorAll('.animate-entry');
        animatedElements.forEach((element) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(element);
        });

        // Counter animation
        const animateCounters = () => {
            const counters = document.querySelectorAll('.counter');
            
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const decimalPlaces = counter.textContent.includes('.') 
                    ? counter.textContent.split('.')[1].length 
                    : 0;
                    
                let count = 0;
                const increment = target / 40;
                
                const updateCounter = () => {
                    if (count < target) {
                        count += increment;
                        if (count > target) count = target;
                        
                        counter.textContent = count.toFixed(decimalPlaces);
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(counter);
            });
        };

        const animateDelayed = () => {
            const delayedElements = document.querySelectorAll('[data-delay]:not(.faq-item)');
            
            delayedElements.forEach(element => {
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    
                    observer.observe(element);
                }, delay);
            });
        };
        
        animateCounters();
        animateDelayed();
    }, []);

    return (
        <div className="career-services-page bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-blue-200/30 dark:bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-80 h-80 bg-purple-200/40 dark:bg-yellow-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-pink-200/30 dark:bg-pink-300/10 rounded-full blur-2xl animate-bounce-slow"></div>
                    
                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-blue-300/40 dark:bg-white/20 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${Math.random() * 2 + 2}s`
                            }}
                        ></div>
                    ))}
                </div>
                
                <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center text-slate-800 dark:text-white">
                        <div className="animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                            <div className="inline-flex items-center bg-white/80 dark:bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-blue-200/50 dark:border-white/30 shadow-xl">
                                <span className="material-icons text-2xl mr-3 animate-bounce text-blue-600 dark:text-white">rocket_launch</span>
                                <span className="font-semibold text-lg text-blue-700 dark:text-white">{t('careerServicesPage.hero.badge')}</span>
                            </div>
                        </div>
                        
                        <h1 className="animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 delay-200 text-5xl md:text-7xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                                {t('careerServicesPage.hero.title.part1')}
                            </span> 
                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent animate-pulse">
                                {t('careerServicesPage.hero.title.highlight')}
                            </span>
                        </h1>
                        
                        <p className="animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 delay-400 text-xl md:text-2xl mb-12 text-slate-600 dark:text-white/90 max-w-3xl mx-auto leading-relaxed">
                            {t('careerServicesPage.hero.subtitle')}
                        </p>
                        
                        <div className="animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 delay-600 flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <Link 
                                to="/apply" 
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:bg-white dark:text-indigo-600 dark:hover:bg-gray-50 text-white dark:text-indigo-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                                <span>{t('careerServicesPage.hero.buttons.applyNow')}</span>
                                <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                            
                            <Link 
                                to="/contact" 
                                className="group border-2 border-blue-600 dark:border-white text-blue-600 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-indigo-600 font-bold py-4 px-8 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                            >
                                {t('careerServicesPage.hero.buttons.talkToAdvisor')}
                            </Link>
                        </div>

                        <div className="animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 delay-800">
                            <p className="text-slate-600 dark:text-white/80 mb-6 text-lg">{t('careerServicesPage.hero.graduatesWorkAt')}:</p>
                            <div className="flex flex-wrap justify-center items-center gap-8">
                                {[microsoftLogo, googleLogo, amazonLogo, nttLogo, mercariLogo].map((logo, index) => (
                                    <div key={index} className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl border border-blue-100/50 dark:border-white/10">
                                        <img src={logo} alt="" className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity dark:filter dark:brightness-0 dark:invert" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Stats Section - Redesigned with Better Spacing and Smaller Size */}
                <div className="relative z-10 mt-16 lg:mt-20">
                    <div className="container mx-auto px-4 pb-16">
                        {/* Stats Container with improved design */}
                        <div className="max-w-5xl mx-auto bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl border border-blue-200/60 dark:border-white/20 shadow-2xl p-8 lg:p-10">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                {[
                                    { target: "93", suffix: "%", labelKey: 'careerServicesPage.stats.employmentRate', delay: 0, icon: 'trending_up', color: 'from-emerald-500 to-teal-500' },
                                    { prefix: "¥", target: "4.2", suffix: "M", labelKey: 'careerServicesPage.stats.averageSalary', delay: 100, icon: 'attach_money', color: 'from-amber-500 to-orange-500' },
                                    { target: "200", suffix: "+", labelKey: 'careerServicesPage.stats.hiringPartners', delay: 200, icon: 'business', color: 'from-blue-500 to-cyan-500' },
                                    { target: "14", suffix: "+", labelKey: 'careerServicesPage.stats.careerEvents', delay: 300, icon: 'event', color: 'from-purple-500 to-pink-500' }
                                ].map((stat, index) => (
                                    <div 
                                        key={index} 
                                        className="group text-center animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 hover:scale-105" 
                                        data-delay={stat.delay}
                                    >
                                        {/* Smaller Icon */}
                                        <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg shadow-md group-hover:shadow-lg mb-2 transform group-hover:rotate-6 transition-all duration-300`}>
                                            <span className="material-icons text-white text-base">{stat.icon}</span>
                                        </div>
                                        
                                        {/* Smaller Number */}
                                        <div className="text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500">
                                            {stat.prefix}<span className="counter" data-target={stat.target}>0</span>{stat.suffix}
                                        </div>
                                        
                                        {/* Smaller Label */}
                                        <div className="text-slate-600 dark:text-white/80 font-medium text-xs leading-relaxed group-hover:text-slate-800 dark:group-hover:text-white transition-colors duration-300">
                                            {t(stat.labelKey)}
                                        </div>
                                        
                                        {/* Smaller decorative line */}
                                        <div className={`w-6 h-0.5 bg-gradient-to-r ${stat.color} rounded-full mx-auto mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Support Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6">
                            {t('careerServicesPage.careerSupport.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            {t('careerServicesPage.careerSupport.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[
                            { icon: 'assignment_ind', titleKey: 'careerServicesPage.careerSupport.services.resumeBuilding.title', descKey: 'careerServicesPage.careerSupport.services.resumeBuilding.description', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: 'record_voice_over', titleKey: 'careerServicesPage.careerSupport.services.interviewPrep.title', descKey: 'careerServicesPage.careerSupport.services.interviewPrep.description', gradient: 'from-purple-500 to-pink-500' },
                            { icon: 'handshake', titleKey: 'careerServicesPage.careerSupport.services.networkingEvents.title', descKey: 'careerServicesPage.careerSupport.services.networkingEvents.description', gradient: 'from-green-500 to-emerald-500' },
                            { icon: 'work', titleKey: 'careerServicesPage.careerSupport.services.jobPlacement.title', descKey: 'careerServicesPage.careerSupport.services.jobPlacement.description', gradient: 'from-orange-500 to-red-500' },
                            { icon: 'public', titleKey: 'careerServicesPage.careerSupport.services.globalOpportunities.title', descKey: 'careerServicesPage.careerSupport.services.globalOpportunities.description', gradient: 'from-teal-500 to-blue-500' },
                            { icon: 'trending_up', titleKey: 'careerServicesPage.careerSupport.services.careerAdvancement.title', descKey: 'careerServicesPage.careerSupport.services.careerAdvancement.description', gradient: 'from-indigo-500 to-purple-500' }
                        ].map((service, index) => (
                            <div key={index} className="group animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                                    <span className="material-icons text-white text-2xl">{service.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {t(service.titleKey)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {t(service.descKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Journey Section - Light Design */}
            <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-slate-800 dark:text-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100/30 dark:bg-indigo-400/5 rounded-full blur-2xl animate-bounce-slow"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                            {t('careerServicesPage.careerJourney.title')}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-white/80 max-w-3xl mx-auto">
                            {t('careerServicesPage.careerJourney.subtitle')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-8">
                            {[
                                { step: 1, titleKey: 'careerServicesPage.careerJourney.steps.assessment.title', descKey: 'careerServicesPage.careerJourney.steps.assessment.description', color: 'from-blue-500 to-cyan-500' },
                                { step: 2, titleKey: 'careerServicesPage.careerJourney.steps.skillsDevelopment.title', descKey: 'careerServicesPage.careerJourney.steps.skillsDevelopment.description', color: 'from-purple-500 to-pink-500' },
                                { step: 3, titleKey: 'careerServicesPage.careerJourney.steps.portfolioReview.title', descKey: 'careerServicesPage.careerJourney.steps.portfolioReview.description', color: 'from-emerald-500 to-teal-500' },
                                { step: 4, titleKey: 'careerServicesPage.careerJourney.steps.interviewTraining.title', descKey: 'careerServicesPage.careerJourney.steps.interviewTraining.description', color: 'from-orange-500 to-red-500' },
                                { step: 5, titleKey: 'careerServicesPage.careerJourney.steps.jobMatching.title', descKey: 'careerServicesPage.careerJourney.steps.jobMatching.description', color: 'from-indigo-500 to-purple-500' },
                                { step: 6, titleKey: 'careerServicesPage.careerJourney.steps.ongoingSupport.title', descKey: 'careerServicesPage.careerJourney.steps.ongoingSupport.description', color: 'from-rose-500 to-pink-500' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-6 animate-entry opacity-0 transform translate-x-8 transition-all duration-1000 group" style={{ animationDelay: `${index * 150}ms` }}>
                                    <div className="flex-shrink-0">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/30 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            <span className="text-2xl font-black text-white">{item.step}</span>
                                        </div>
                                        {index < 5 && (
                                            <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent dark:from-white/50 dark:to-transparent mx-auto mt-4"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 dark:border-white/20 hover:bg-white/90 dark:hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:transform group-hover:-translate-y-1">
                                        <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {t(item.titleKey)}
                                        </h3>
                                        <p className="text-slate-600 dark:text-white/80 leading-relaxed">
                                            {t(item.descKey)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Hiring Partners Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6">
                            {t('careerServicesPage.hiringPartners.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            {t('careerServicesPage.hiringPartners.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 max-w-6xl mx-auto mb-12">
                        {[microsoftLogo, googleLogo, amazonLogo, suzukiLogo, yahooLogo, mercariLogo, nttLogo, hondaLogo].map((logo, index) => (
                            <div key={index} className="animate-entry opacity-0 transform scale-90 transition-all duration-1000 group" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-110">
                                    <img src={logo} alt="" className="w-full h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <Link 
                            to="/partners" 
                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 space-x-2"
                        >
                            <span>{t('careerServicesPage.hiringPartners.viewAllButton')}</span>
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6">
                            {t('careerServicesPage.successStories.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            {t('careerServicesPage.successStories.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                        {[
                            { image: png1Image, logo: googleLogo, nameKey: 'careerServicesPage.successStories.stories.taroYamada.name', roleKey: 'careerServicesPage.successStories.stories.taroYamada.role', quoteKey: 'careerServicesPage.successStories.stories.taroYamada.quote' },
                            { image: png2Image, logo: yahooLogo, nameKey: 'careerServicesPage.successStories.stories.hanakoSato.name', roleKey: 'careerServicesPage.successStories.stories.hanakoSato.role', quoteKey: 'careerServicesPage.successStories.stories.hanakoSato.quote' },
                            { image: png3Image, logo: amazonLogo, nameKey: 'careerServicesPage.successStories.stories.michaelChen.name', roleKey: 'careerServicesPage.successStories.stories.michaelChen.role', quoteKey: 'careerServicesPage.successStories.stories.michaelChen.quote' }
                        ].map((story, index) => (
                            <div key={index} className="group animate-entry opacity-0 transform translate-y-8 transition-all duration-1000 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="relative">
                                    <div className="aspect-square overflow-hidden">
                                        <img src={story.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                                        <img src={story.logo} alt="" className="h-6 w-auto" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t(story.nameKey)}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">{t(story.roleKey)}</p>
                                    <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{t(story.quoteKey)}"</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <Link 
                            to="/testimonials" 
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 space-x-2"
                        >
                            <span>{t('careerServicesPage.successStories.moreStoriesButton')}</span>
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Career FAQ Section - No Auto-Fade Animation */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-entry opacity-0 transform translate-y-8 transition-all duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6">
                            {t('careerServicesPage.faq.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            {t('careerServicesPage.faq.subtitle')}
                        </p>
                    </div>
            
                    <div className="max-w-4xl mx-auto space-y-4">
                        {[
                            { questionKey: 'careerServicesPage.faq.items.whenBegins.question', answerKey: 'careerServicesPage.faq.items.whenBegins.answer' },
                            { questionKey: 'careerServicesPage.faq.items.accessDuration.question', answerKey: 'careerServicesPage.faq.items.accessDuration.answer' },
                            { questionKey: 'careerServicesPage.faq.items.jobGuarantee.question', answerKey: 'careerServicesPage.faq.items.jobGuarantee.answer' },
                            { questionKey: 'careerServicesPage.faq.items.visaSponsorship.question', answerKey: 'careerServicesPage.faq.items.visaSponsorship.answer' },
                            { questionKey: 'careerServicesPage.faq.items.freelancing.question', answerKey: 'careerServicesPage.faq.items.freelancing.answer' }
                        ].map((faq, index) => (
                            <div 
                                key={index} 
                                className={`group bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 overflow-hidden transition-all duration-300 ${openFAQ === index ? 'ring-2 ring-blue-500/20' : ''}`}
                            >
                                <div 
                                    className="cursor-pointer p-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4">
                                        {t(faq.questionKey)}
                                    </h3>
                                    <span className={`material-icons text-2xl text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 transform group-hover:scale-110 ${openFAQ === index ? 'rotate-45' : ''}`}>
                                        {openFAQ === index ? 'close' : 'add'}
                                    </span>
                                </div>
                                <div 
                                    style={{
                                        maxHeight: openFAQ === index ? '1000px' : '0px',
                                        transition: 'max-height 0.5s ease-in-out'
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <p>{t(faq.answerKey)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CSS for Animations */}
            <style jsx>{`
                .animate-entry {
                    opacity: 0;
                    transform: translateY(2rem);
                    transition: opacity 1s ease-out, transform 1s ease-out;
                }
                
                .animate-entry.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                /* FAQ Specific Animations - Smooth Height Transition Only */
                .faq-answer-container {
                    transition: max-height 0.5s ease-in-out;
                    overflow: hidden;
                }
                
                .faq-content {
                    opacity: 1;
                    visibility: visible;
                    padding: 1.5rem;
                    padding-top: 0;
                }
                
                /* Enhanced hover effects */
                .faq-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                /* Icon rotation animation */
                .faq-toggle-icon {
                    transition: transform 0.3s ease-in-out;
                }
                
                .faq-toggle-icon.rotated {
                    transform: rotate(45deg);
                }
            `}</style>
        </div>
    );
}

export default CareerServicesPage;
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            });
        }, { threshold: 0.1 });
        
        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const contactItems = [
        {
            icon: "location_on",
            title: t('contactSection.contact.location.title'),
            content: t('contactSection.contact.location.address'),
            gradient: "from-blue-500 to-cyan-600",
            glowColor: "blue-500/30",
            type: "location"
        },
        {
            icon: "phone",
            title: t('contactSection.contact.phone.title'),
            content: (
                <>
                    <a href="tel:025-247-6300" className="hover:text-white transition-colors">025-247-6300</a> ({t('contactSection.contact.phone.tel')})<br />
                    <a href="tel:025-247-6305" className="hover:text-white transition-colors">025-247-6305</a> ({t('contactSection.contact.phone.fax')})
                </>
            ),
            gradient: "from-emerald-500 to-teal-600",
            glowColor: "emerald-500/30",
            type: "phone"
        },
        {
            icon: "email",
            title: t('contactSection.contact.website.title'),
            content: (
                <a href="https://www.forum.ac.jp/" className="hover:text-white transition-colors">
                    https://www.forum.ac.jp/
                </a>
            ),
            gradient: "from-purple-500 to-pink-600",
            glowColor: "purple-500/30",
            type: "email"
        },
        {
            icon: "schedule",
            title: t('contactSection.contact.hours.title'),
            content: t('contactSection.contact.hours.time'),
            gradient: "from-amber-500 to-orange-600",
            glowColor: "amber-500/30",
            type: "hours"
        }
    ];

    const socialLinks = [
        { icon: "alternate_email", url: "https://twitter.com/forumacademy", label: "Twitter", color: "from-blue-400 to-blue-600" },
        { icon: "facebook", url: "https://facebook.com/forumacademy", label: "Facebook", color: "from-blue-600 to-blue-800" },
        { icon: "photo_camera", url: "https://instagram.com/forumacademy", label: "Instagram", color: "from-pink-500 to-purple-600" },
        { icon: "work", url: "https://linkedin.com/company/forumacademy", label: "LinkedIn", color: "from-blue-700 to-indigo-700" }
    ];

    const faqItems = [
        {
            question: t('contactSection.faq.items.campusTour.question'),
            answer: t('contactSection.faq.items.campusTour.answer'),
            icon: "school"
        },
        {
            question: t('contactSection.faq.items.deadlines.question'),
            answer: t('contactSection.faq.items.deadlines.answer'),
            icon: "event"
        }
    ];

    return (
        <section 
            className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden" 
            id="contact" 
            ref={sectionRef}
        >
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-96 -left-96 w-[900px] h-[900px] bg-gradient-to-tr from-blue-400/10 via-cyan-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                {/* Floating Geometric Shapes */}
                <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                <div className="absolute top-40 right-32 w-6 h-6 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-32 right-1/3 w-4 h-4 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rotate-12 animate-bounce delay-1500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header Section */}
                <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-full text-sm font-bold mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-full blur opacity-30 animate-pulse"></div>
                        <span className="material-icons text-lg relative z-10">support_agent</span>
                        <span className="relative z-10">{t('contactSection.header.badge')}</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                            {t('contactSection.header.title')}
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        {t('contactSection.header.subtitle')}
                    </p>
                    
                    {/* Decorative Line */}
                    <div className="flex justify-center mt-8">
                        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    </div>
                </div>

                {/* Main Contact Card */}
                <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mb-16 border border-white/20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid lg:grid-cols-3 gap-0">
                        {/* Contact Information */}
                        <div className="lg:col-span-2 p-8 lg:p-12">
                            {/* Info Header */}
                            <div className="flex items-center gap-6 mb-10">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <span className="material-icons text-3xl text-white">support_agent</span>
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30 blur-md animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contactSection.info.title')}</h3>
                                    <p className="text-gray-600 font-medium">{t('contactSection.info.subtitle')}</p>
                                </div>
                            </div>

                            {/* Contact Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 mb-10">
                                {contactItems.map((item, index) => (
                                    <div 
                                        key={item.type}
                                        className={`group relative bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
                                        onMouseEnter={() => setHoveredItem(item.type)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                                        
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <span className="material-icons text-white text-lg">{item.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">{item.title}</h4>
                                                <div className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                                    {item.content}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {hoveredItem === item.type && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Social and Contact Button */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-200/50">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-700 font-medium">{t('contactSection.social.connect')}:</span>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={social.label}
                                                href={social.url}
                                                aria-label={social.label}
                                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                            >
                                                <span className="material-icons text-sm">{social.icon}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                
                                <Link 
                                    to="/contact" 
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {t('contactSection.buttons.contactUs')}
                                    <span className="material-icons group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                                </Link>
                            </div>
                        </div>

                        {/* Enhanced Map Section */}
                        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 lg:rounded-r-3xl overflow-hidden">
                            <div className="relative h-full min-h-[400px] lg:min-h-full">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.020979364653!2d139.05593607569955!3d37.912437971951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4c9908234a571%3A0xc204d9ebdf574ad4!2z44OV44Kq44O844Op44Og5oOF5aCx44Ki44Kr44OH44Of44O85bCC6ZaA5a2m5qCh!5e1!3m2!1sen!2sjp!4v1747807045557!5m2!1sen!2sjp" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t('contactSection.map.title')}
                                    className="w-full h-full"
                                />
                                
                                {/* Map Overlay Button */}
                                <a 
                                    href="https://goo.gl/maps/8F5HVCFgEZj4TPUR7" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
                                >
                                    <span className="material-icons text-lg">directions</span>
                                    <span>{t('contactSection.buttons.getDirections')}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced FAQ Section */}
                <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-12 border border-white/20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('contactSection.faq.title')}</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {faqItems.map((faq, index) => (
                            <div 
                                key={index}
                                className="group relative bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                                        <span className="material-icons text-white text-lg">{faq.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">{faq.question}</h4>
                                        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <a 
                            href="/faq" 
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {t('contactSection.buttons.viewAllFAQs')}
                            <span className="material-icons">help_outline</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
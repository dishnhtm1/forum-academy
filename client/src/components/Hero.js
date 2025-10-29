import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Award, ArrowRight, Target, Globe, MessageCircle, X } from 'lucide-react';
import heroImage from '../assets/student/hero2.jpg';
import schoolLineStep1 from '../assets/images/SchoolLinestep1.png';
import schoolLineStep2 from '../assets/images/SchoolLinestep2.png';

const Hero = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [showLinePopup, setShowLinePopup] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1 for step 1, 2 for step 2
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);



    const handleOpenPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Opening popup...');
        setCurrentStep(1); // Reset to step 1
        setShowLinePopup(true);
        console.log('Popup state set to true');
    };

    const handleClosePopup = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Closing popup...');
        setShowLinePopup(false);
        setCurrentStep(1); // Reset to step 1 when closing
    };

    const handleProceedToStep2 = () => {
        setCurrentStep(2);
    };

    const handleImageClick = () => {
        setCurrentStep(2);
    };

    // Create animated text component - jumping by word groups
    const AnimatedText = ({ text, className }) => {
        // Get translated text
        const translatedText = t(text);
        
        // For English: "Please feel free to contact us!" -> ["Please feel free", "to contact", "us!"]
        // For Japanese: "お気軽にお問い合わせください！" -> ["お気軽に", "お問い合わせ", "ください！"]
        const words = translatedText.split(' ');
        let currentGroup = [];
        const groups = [];
        
        // Determine language
        const isEnglish = !translatedText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
        
        if (isEnglish) {
            // English grouping
            words.forEach((word, index) => {
                if (index === 0 || index === 1 || index === 2) {
                    currentGroup.push(word);
                    if (index === 2) {
                        groups.push(currentGroup.join(' '));
                        currentGroup = [];
                    }
                } else if (index === 3 || index === 4) {
                    currentGroup.push(word);
                    if (index === 4) {
                        groups.push(currentGroup.join(' '));
                        currentGroup = [];
                    }
                } else {
                    currentGroup.push(word);
                }
            });
        } else {
            // Japanese grouping (more flexible, split by kanji/hiragana boundaries)
            // "お気軽にお問い合わせください！" -> 3 groups
            const totalChars = translatedText.length;
            const charsPerGroup = Math.ceil(totalChars / 3);
            
            for (let i = 0; i < translatedText.length; i += charsPerGroup) {
                groups.push(translatedText.substring(i, Math.min(i + charsPerGroup, translatedText.length)));
            }
        }
        
        if (currentGroup.length > 0) {
            groups.push(currentGroup.join(' '));
        }
        
        return (
            <>
                <style>
                    {`
                        @keyframes paragraph-jump {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                        }
                    `}
                </style>
                <span className={className}>
                    {groups.map((group, index) => (
                        <span
                            key={index}
                            className="inline-block"
                            style={{
                                animation: `paragraph-jump 1.2s ease-in-out infinite`,
                                animationDelay: `${index * 0.3}s`,
                            }}
                        >
                            {group}
                            {index < groups.length - 1 && '\u00A0'}
                        </span>
                    ))}
                </span>
            </>
        );
    };
    
    return (
        <section className="relative min-h-screen overflow-hidden">
                                {/* Background Image */}
                    <div className="absolute inset-0">
                        <img 
                            src={heroImage} 
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-teal-900/50"></div>
                    </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                }}></div>
            </div>
            
            {/* Inquiry Badge - Bottom Right */}
            <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-40">
                <button
                    onClick={handleOpenPopup}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-300 animate-bounce"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-bold text-base md:text-lg">Inquiry</span>
                </button>
            </div>

            {/* Hero Badge - Top Right */}
            <div className="fixed top-24 right-6 md:top-32 md:right-12 z-40">
                <button
                    onClick={handleOpenPopup}
                    className="inline-flex flex-col items-center gap-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                    <div className="inline-flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-white" />
                        <AnimatedText 
                            text="hero.badge.contactUs"
                            className="text-white text-base font-bold"
                        />
                    </div>
                    <span className="text-white/90 text-xs font-medium">{t('hero.badge.clickHere')}</span>
                </button>
            </div>

            {/* LINE Popup - Rendered via Portal with Two Steps */}
            {showLinePopup && createPortal(
                <div 
                    className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
                    onClick={handleClosePopup}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Step 1: LINE Account Info */}
                        {currentStep === 1 && (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-teal-600 mb-4">
                                    {t('hero.linePopup.step1Title')}
                                </p>
                                
                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-6 px-4">
                                    {t('hero.linePopup.step1Description')}
                                </p>
                                
                                {/* Step 1 Image - Clickable */}
                                <div 
                                    className="bg-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 mb-6"
                                    onClick={handleImageClick}
                                >
                                    <img 
                                        src={schoolLineStep1} 
                                        alt="LINE Official Account Information"
                                        className="w-full h-auto rounded-xl"
                                    />
                                </div>
                                
                                {/* Proceed Button */}
                                <button
                                    onClick={handleProceedToStep2}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span>{t('hero.linePopup.proceedButton')}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: QR Code */}
                        {currentStep === 2 && (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-teal-600 mb-4">
                                    {t('hero.linePopup.step2Title')}
                                </p>
                                
                                {/* Back Button */}
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowRight className="w-6 h-6 rotate-180" />
                                </button>
                                
                                {/* Step 2 Image */}
                                <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                                    <img 
                                        src={schoolLineStep2} 
                                        alt="School LINE QR Code"
                                        className="w-full h-auto rounded-xl"
                                    />
                                </div>
                                
                                {/* Instructions */}
                                <div className="space-y-2">
                                    <p className="text-gray-700 font-semibold text-base">
                                        {t('hero.linePopup.step2Instructions')}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {t('hero.linePopup.step2Additional')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Main Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pt-32 sm:pt-40 md:pt-48 pb-20 md:pb-32">
                    <div className="relative">
                        
                        {/* Centered Content */}
                        <div className="relative z-30 pt-32 sm:pt-40 md:pt-48">
                            
                            {/* Main Content - Centered */}
                            <div className="max-w-4xl mx-auto text-center">
                                <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    

                                    
                                    {/* Main Heading */}
                                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                                        <span className="block">
                                            {t('hero.title.line1') || 'Transform Your Future with'}
                                        </span>
                                        <span className="block mt-2">
                                            {t('hero.title.highlight') || 'Technology'}
                                        </span>
                                        <span className="block mt-2">
                                            {t('hero.title.line2') || 'Education'}
                                        </span>
                                    </h1>
                                    
                                    {/* Description */}
                                    <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                                        {t('hero.description') || 'Join thousands of students mastering cutting-edge technologies. Start your journey to a successful tech career today.'}
                                    </p>
                                    
                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center">
                                        <Link 
                                            to="/courses" 
                                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-cyan-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <BookOpen className="w-6 h-6" />
                                            <span>{t('hero.buttons.explorePrograms') || 'Explore Programs'}</span>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Link>
                                        
                                        <Link 
                                            to="/apply" 
                                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-3 border-white text-white rounded-lg font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <Target className="w-6 h-6" />
                                            <span>{t('hero.buttons.applyNow') || 'Apply Now'}</span>
                                            <ArrowRight className="w-6 h-6" />
                                        </Link>
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-4 pt-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-white">15k+</div>
                                            <div className="text-white/80 text-sm mt-1">Students</div>
                                        </div>
                                        <div className="text-center border-x-2 border-white/30">
                                            <div className="text-4xl font-black text-white">93%</div>
                                            <div className="text-white/80 text-sm mt-1">Job Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-white">15+</div>
                                            <div className="text-white/80 text-sm mt-1">Years</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C300,100 600,0 900,60 C1050,90 1150,60 1200,30 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/AboutPage.css';
import AboutSection from '../components/AboutSection';
import storyImage from '../assets/images/logo1.png';

const AboutPage = () => {
    const { t } = useTranslation(); // Add this line only
    const [isHeroVisible, setIsHeroVisible] = useState(false);
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
                    entry.target.classList.add('visible');
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
            
            // Cleanup animated elements
            const elements = document.querySelector('.about-hero-elements');
            if (elements) {
                while (elements.firstChild) {
                    elements.removeChild(elements.firstChild);
                }
            }
        };
    }, []);
    
    // Keep ALL your existing createHeroAnimatedElements function exactly as is
    const createHeroAnimatedElements = () => {
        const container = document.querySelector('.about-hero-elements');
        if (!container) return;
        
        // Clear existing elements
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create animated shapes
        for (let i = 0; i < 20; i++) {
            const shape = document.createElement('div');
            shape.className = 'about-shape';
            
            // Random shape type
            const shapes = ['circle', 'triangle', 'square', 'plus'];
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            shape.classList.add(`shape-${shapeType}`);
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 30 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            const animationDelay = Math.random() * 5;
            const animationDuration = Math.random() * 20 + 10;
            
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.opacity = opacity;
            shape.style.animationDelay = `${animationDelay}s`;
            shape.style.animationDuration = `${animationDuration}s`;
            
            container.appendChild(shape);
        }
        
        // Create floating icons
        const icons = ['school', 'computer', 'people', 'lightbulb', 'code', 'psychology'];
        for (let i = 0; i < 6; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'about-hero-icon';
            
            const x = 10 + (Math.random() * 80);
            const y = 10 + (Math.random() * 80);
            const delay = Math.random() * 5;
            
            iconWrapper.style.left = `${x}%`;
            iconWrapper.style.top = `${y}%`;
            iconWrapper.style.animationDelay = `${delay}s`;
            
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = icons[i % icons.length];
            
            iconWrapper.appendChild(icon);
            container.appendChild(iconWrapper);
        }
    };
    
    return (
        <div className="about-page">
            {/* Keep ALL your hero structure - only replace text */}
            <section 
                ref={heroRef}
                className={`about-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                {/* Keep ALL background elements exactly as is */}
                <div className="about-hero-bg">
                    <div className="about-hero-elements"></div>
                    <div className="about-glow about-glow-1"></div>
                    <div className="about-glow about-glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="about-hero-content">
                        <div className="about-hero-badge">
                            <span className="material-icons">auto_awesome</span>
                            {t('about.hero.badge')}
                        </div>
                        
                        <h1 className="about-hero-title">
                            {t('about.hero.title')} <span className="highlight-text">{t('about.hero.highlight')}</span>
                        </h1>
                        
                        <p className="about-hero-description">
                            {t('about.hero.description')}
                        </p>
                        
                        <div className="about-hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">{t('about.stats.yearsExcellence')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">5,000+</div>
                                <div className="stat-label">{t('about.stats.graduates')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">200+</div>
                                <div className="stat-label">{t('about.stats.partners')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">{t('about.stats.employmentRate')}</div>
                            </div>
                        </div>
                        
                        <div className="about-hero-actions">
                            <a href="#our-story" className="btn btn-primary">{t('about.hero.ourJourney')}</a>
                            <a href="/contact" className="btn btn-outline">{t('about.hero.getInTouch')}</a>
                        </div>
                    </div>
                </div>
                
                <div className="scroll-indicator">
                    <a href="#our-story">
                        <span>{t('about.hero.discoverStory')}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Keep ALL your story section structure - only replace text */}
            <section id="our-story" className="about-section our-story">
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.story.title')}</h2>
                        <p>{t('about.story.subtitle')}</p>
                    </div>
                    <div className="story-content">
                        <div className="story-image">
                            <img src={storyImage} alt={t('about.story.imageAlt')} />
                        </div>
                        <div className="story-text">
                            <p>{t('about.story.paragraph1')}</p>
                            <p>{t('about.story.paragraph2')}</p>
                            <p>{t('about.story.paragraph3')}</p>
                            
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2010</h4>
                                        <p>{t('about.timeline.founded')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2013</h4>
                                        <p>{t('about.timeline.dataScience')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2016</h4>
                                        <p>{t('about.timeline.osaka')}</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>2020</h4>
                                        <p>{t('about.timeline.celebration')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL structure - only replace text */}
            <section className="about-section why-choose-us" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.whyChoose.title')}</h2>
                        <p>{t('about.whyChoose.subtitle')}</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">business</span>
                            </div>
                            <h3>{t('about.features.partnerships.title')}</h3>
                            <p>{t('about.features.partnerships.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">people</span>
                            </div>
                            <h3>{t('about.features.instructors.title')}</h3>
                            <p>{t('about.features.instructors.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">laptop_mac</span>
                            </div>
                            <h3>{t('about.features.facilities.title')}</h3>
                            <p>{t('about.features.facilities.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">work</span>
                            </div>
                            <h3>{t('about.features.careerServices.title')}</h3>
                            <p>{t('about.features.careerServices.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">school</span>
                            </div>
                            <h3>{t('about.features.certifications.title')}</h3>
                            <p>{t('about.features.certifications.description')}</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <span className="material-icons">support</span>
                            </div>
                            <h3>{t('about.features.support.title')}</h3>
                            <p>{t('about.features.support.description')}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL structure - only replace text */}
            <section className="about-section mission-vision">
                <div className="container">
                    <div className="mission-vision-grid">
                        <div className="mission-box">
                            <h2>{t('about.mission.title')}</h2>
                            <p>{t('about.mission.description')}</p>
                            <div className="mission-icon">
                                <span className="material-icons">lightbulb</span>
                            </div>
                        </div>
                        <div className="vision-box">
                            <h2>{t('about.vision.title')}</h2>
                            <p>{t('about.vision.description')}</p>
                            <div className="vision-icon">
                                <span className="material-icons">visibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Keep ALL team structure - only replace text */}
            <section className="about-section team-section" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>{t('about.team.title')}</h2>
                        <p>{t('about.team.subtitle')}</p>
                    </div>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.shashini.name')}</h3>
                                <p className="member-role">{t('about.team.members.shashini.role')}</p>
                                <p className="member-bio">{t('about.team.members.shashini.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.thilini.name')}</h3>
                                <p className="member-role">{t('about.team.members.thilini.role')}</p>
                                <p className="member-bio">{t('about.team.members.thilini.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.diushan.name')}</h3>
                                <p className="member-role">{t('about.team.members.diushan.role')}</p>
                                <p className="member-bio">{t('about.team.members.diushan.bio')}</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-info">
                                <h3>{t('about.team.members.john.name')}</h3>
                                <p className="member-role">{t('about.team.members.john.role')}</p>
                                <p className="member-bio">{t('about.team.members.john.bio')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;

// import React, { useEffect, useState, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import AboutSection from '../components/AboutSection';
// import storyImage from '../assets/images/logo1.png';
// import '../styles/AboutPage.css';

// const AboutPage = () => {
//     const { t } = useTranslation();
//     const [isHeroVisible, setIsHeroVisible] = useState(false);
//     const heroRef = useRef(null);
    
//     // Keep ALL your existing animation code exactly as is
//     useEffect(() => {
//         setIsHeroVisible(true);
//         createHeroAnimatedElements();
        
//         const sections = document.querySelectorAll('.about-section');
        
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('visible');
//                 }
//             });
//         }, { threshold: 0.1 });
        
//         sections.forEach(section => {
//             observer.observe(section);
//         });
        
//         return () => {
//             sections.forEach(section => {
//                 observer.unobserve(section);
//             });
            
//             const elements = document.querySelector('.about-hero-elements');
//             if (elements) {
//                 while (elements.firstChild) {
//                     elements.removeChild(elements.firstChild);
//                 }
//             }
//         };
//     }, []);
    
//     // Keep ALL your existing createHeroAnimatedElements function exactly as is
//     const createHeroAnimatedElements = () => {
//         const container = document.querySelector('.about-hero-elements');
//         if (!container) return;
        
//         while (container.firstChild) {
//             container.removeChild(container.firstChild);
//         }
        
//         for (let i = 0; i < 20; i++) {
//             const shape = document.createElement('div');
//             shape.className = 'about-shape';
            
//             const shapes = ['circle', 'triangle', 'square', 'plus'];
//             const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
//             shape.classList.add(`shape-${shapeType}`);
            
//             const x = Math.random() * 100;
//             const y = Math.random() * 100;
//             const size = Math.random() * 30 + 10;
//             const opacity = Math.random() * 0.5 + 0.1;
//             const animationDelay = Math.random() * 5;
//             const animationDuration = Math.random() * 20 + 10;
            
//             shape.style.left = `${x}%`;
//             shape.style.top = `${y}%`;
//             shape.style.width = `${size}px`;
//             shape.style.height = `${size}px`;
//             shape.style.opacity = opacity;
//             shape.style.animationDelay = `${animationDelay}s`;
//             shape.style.animationDuration = `${animationDuration}s`;
            
//             container.appendChild(shape);
//         }
        
//         const icons = ['school', 'computer', 'people', 'lightbulb', 'code', 'psychology'];
//         for (let i = 0; i < 6; i++) {
//             const iconWrapper = document.createElement('div');
//             iconWrapper.className = 'about-hero-icon';
            
//             const x = 10 + (Math.random() * 80);
//             const y = 10 + (Math.random() * 80);
//             const delay = Math.random() * 5;
            
//             iconWrapper.style.left = `${x}%`;
//             iconWrapper.style.top = `${y}%`;
//             iconWrapper.style.animationDelay = `${delay}s`;
            
//             const icon = document.createElement('span');
//             icon.className = 'material-icons';
//             icon.textContent = icons[i % icons.length];
            
//             iconWrapper.appendChild(icon);
//             container.appendChild(iconWrapper);
//         }
//     };
    
//     return (
//         <div className="about-page bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
//             {/* Hero Section */}
//             <section 
//                 ref={heroRef}
//                 className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${isHeroVisible ? 'opacity-100' : 'opacity-0'}`}
//             >
//                 {/* Background Elements */}
//                 <div className="absolute inset-0">
//                     <div className="about-hero-elements absolute inset-0"></div>
//                     <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
//                     <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl animate-pulse delay-75"></div>
//                 </div>
                
//                 <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//                     <div className="text-center space-y-8">
//                         {/* Hero Badge */}
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-slate-700">
//                             <span className="material-icons text-amber-500">auto_awesome</span>
//                             <span className="font-medium">{t('about.hero.badge')}</span>
//                         </div>
                        
//                         {/* Hero Title */}
//                         <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-800 leading-tight">
//                             {t('about.hero.title')} 
//                             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {t('about.hero.highlight')}</span>
//                         </h1>
                        
//                         {/* Hero Description */}
//                         <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
//                             {t('about.hero.description')}
//                         </p>
                        
//                         {/* Hero Stats */}
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
//                             <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
//                                 <div className="text-3xl lg:text-4xl font-bold text-slate-800">15+</div>
//                                 <div className="text-slate-600 font-medium">{t('about.stats.yearsExcellence')}</div>
//                             </div>
//                             <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
//                                 <div className="text-3xl lg:text-4xl font-bold text-slate-800">5,000+</div>
//                                 <div className="text-slate-600 font-medium">{t('about.stats.graduates')}</div>
//                             </div>
//                             <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
//                                 <div className="text-3xl lg:text-4xl font-bold text-slate-800">200+</div>
//                                 <div className="text-slate-600 font-medium">{t('about.stats.partners')}</div>
//                             </div>
//                             <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
//                                 <div className="text-3xl lg:text-4xl font-bold text-slate-800">98%</div>
//                                 <div className="text-slate-600 font-medium">{t('about.stats.employmentRate')}</div>
//                             </div>
//                         </div>
                        
//                         {/* Hero Actions */}
//                         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
//                             <a 
//                                 href="#our-story" 
//                                 className="px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//                             >
//                                 {t('about.hero.ourJourney')}
//                             </a>
//                             <a 
//                                 href="/contact" 
//                                 className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-800 rounded-xl font-semibold border border-slate-200 hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//                             >
//                                 {t('about.hero.getInTouch')}
//                             </a>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Scroll Indicator */}
//                 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
//                     <a href="#our-story" className="flex flex-col items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
//                         <span className="text-sm font-medium">{t('about.hero.discoverStory')}</span>
//                         <span className="material-icons animate-bounce">keyboard_arrow_down</span>
//                     </a>
//                 </div>
//             </section>
            
//             {/* Our Story Section */}
//             <section id="our-story" className="about-section py-16 lg:py-24 bg-white">
//                 <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-16">
//                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//                             {t('about.story.title')}
//                         </h2>
//                         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                             {t('about.story.subtitle')}
//                         </p>
//                     </div>
                    
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//                         {/* Story Image */}
//                         <div className="order-2 lg:order-1">
//                             <div className="relative rounded-3xl overflow-hidden shadow-2xl">
//                                 <img 
//                                     src={storyImage} 
//                                     alt={t('about.story.imageAlt')}
//                                     className="w-full h-64 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Story Text */}
//                         <div className="order-1 lg:order-2 space-y-6">
//                             <p className="text-lg text-slate-600 leading-relaxed">
//                                 {t('about.story.paragraph1')}
//                             </p>
//                             <p className="text-lg text-slate-600 leading-relaxed">
//                                 {t('about.story.paragraph2')}
//                             </p>
//                             <p className="text-lg text-slate-600 leading-relaxed">
//                                 {t('about.story.paragraph3')}
//                             </p>
                            
//                             {/* Timeline */}
//                             <div className="space-y-6 mt-12">
//                                 <div className="flex gap-4">
//                                     <div className="flex flex-col items-center">
//                                         <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//                                         <div className="w-0.5 h-16 bg-slate-200"></div>
//                                     </div>
//                                     <div className="pb-8">
//                                         <h4 className="text-xl font-semibold text-slate-800 mb-2">2010</h4>
//                                         <p className="text-slate-600">{t('about.timeline.founded')}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex gap-4">
//                                     <div className="flex flex-col items-center">
//                                         <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//                                         <div className="w-0.5 h-16 bg-slate-200"></div>
//                                     </div>
//                                     <div className="pb-8">
//                                         <h4 className="text-xl font-semibold text-slate-800 mb-2">2013</h4>
//                                         <p className="text-slate-600">{t('about.timeline.dataScience')}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex gap-4">
//                                     <div className="flex flex-col items-center">
//                                         <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
//                                         <div className="w-0.5 h-16 bg-slate-200"></div>
//                                     </div>
//                                     <div className="pb-8">
//                                         <h4 className="text-xl font-semibold text-slate-800 mb-2">2016</h4>
//                                         <p className="text-slate-600">{t('about.timeline.osaka')}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex gap-4">
//                                     <div className="flex flex-col items-center">
//                                         <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
//                                     </div>
//                                     <div>
//                                         <h4 className="text-xl font-semibold text-slate-800 mb-2">2020</h4>
//                                         <p className="text-slate-600">{t('about.timeline.celebration')}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* Why Choose Us Section */}
//             <section className="about-section py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-white">
//                 <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-16">
//                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//                             {t('about.whyChoose.title')}
//                         </h2>
//                         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                             {t('about.whyChoose.subtitle')}
//                         </p>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">business</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.partnerships.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.partnerships.description')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">people</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.instructors.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.instructors.description')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">laptop_mac</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.facilities.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.facilities.description')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">work</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.careerServices.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.careerServices.description')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">school</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.certifications.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.certifications.description')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
//                                 <span className="material-icons text-2xl">support</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('about.features.support.title')}</h3>
//                             <p className="text-slate-600 leading-relaxed">{t('about.features.support.description')}</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* Mission & Vision Section */}
//             <section className="about-section py-16 lg:py-24 bg-white">
//                 <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//                         {/* Mission */}
//                         <div className="relative p-8 lg:p-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl overflow-hidden">
//                             <div className="absolute top-8 right-8 w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
//                                 <span className="material-icons text-blue-600 text-2xl">lightbulb</span>
//                             </div>
//                             <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
//                                 {t('about.mission.title')}
//                             </h2>
//                             <p className="text-lg text-slate-700 leading-relaxed">
//                                 {t('about.mission.description')}
//                             </p>
//                         </div>
                        
//                         {/* Vision */}
//                         <div className="relative p-8 lg:p-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl overflow-hidden">
//                             <div className="absolute top-8 right-8 w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
//                                 <span className="material-icons text-purple-600 text-2xl">visibility</span>
//                             </div>
//                             <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
//                                 {t('about.vision.title')}
//                             </h2>
//                             <p className="text-lg text-slate-700 leading-relaxed">
//                                 {t('about.vision.description')}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* Team Section */}
//             <section className="about-section py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-white">
//                 <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-16">
//                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//                             {t('about.team.title')}
//                         </h2>
//                         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                             {t('about.team.subtitle')}
//                         </p>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-blue-600">
//                                 S
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('about.team.members.shashini.name')}</h3>
//                             <p className="text-blue-600 font-medium mb-4">{t('about.team.members.shashini.role')}</p>
//                             <p className="text-slate-600 text-sm leading-relaxed">{t('about.team.members.shashini.bio')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-green-600">
//                                 T
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('about.team.members.thilini.name')}</h3>
//                             <p className="text-green-600 font-medium mb-4">{t('about.team.members.thilini.role')}</p>
//                             <p className="text-slate-600 text-sm leading-relaxed">{t('about.team.members.thilini.bio')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-purple-600">
//                                 D
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('about.team.members.diushan.name')}</h3>
//                             <p className="text-purple-600 font-medium mb-4">{t('about.team.members.diushan.role')}</p>
//                             <p className="text-slate-600 text-sm leading-relaxed">{t('about.team.members.diushan.bio')}</p>
//                         </div>
                        
//                         <div className="group text-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-amber-600">
//                                 J
//                             </div>
//                             <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('about.team.members.john.name')}</h3>
//                             <p className="text-amber-600 font-medium mb-4">{t('about.team.members.john.role')}</p>
//                             <p className="text-slate-600 text-sm leading-relaxed">{t('about.team.members.john.bio')}</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* About Section Component with Full Features */}
//             <AboutSection showAllFeatures={true} />
//         </div>
//     );
// };

// export default AboutPage;
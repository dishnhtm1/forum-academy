import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/AboutSection.css';
import studentsImage from '../assets/images/png7.jpg'; 
import studentProfileImage from '../assets/images/png1.jpg'; // Placeholder for student profile image

const AboutSection = ({ showAllFeatures = false }) => {
    const { t } = useTranslation(); // Add this line only
    // Reference for section animation
    const sectionRef = useRef(null);
    const [activeFeature, setActiveFeature] = useState(null);
    
    // Keep ALL your existing animation code exactly as is
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        // Cleanup observer
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
    // Core features to always show with improved content - only replace text
    const coreFeatures = [
        {
            icon: "handshake",
            title: t('aboutSection.features.partnerships.title'),
            description: t('aboutSection.features.partnerships.description'),
            highlight: t('aboutSection.features.partnerships.highlight'),
            color: "#3b82f6"
        },
        {
            icon: "psychology",
            title: t('aboutSection.features.instructors.title'),
            description: t('aboutSection.features.instructors.description'),
            highlight: t('aboutSection.features.instructors.highlight'),
            color: "#10b981"
        },
        {
            icon: "dashboard",
            title: t('aboutSection.features.facilities.title'),
            description: t('aboutSection.features.facilities.description'),
            highlight: t('aboutSection.features.facilities.highlight'),
            color: "#f59e0b"
        },
        {
            icon: "rocket_launch",
            title: t('aboutSection.features.career.title'),
            description: t('aboutSection.features.career.description'),
            highlight: t('aboutSection.features.career.highlight'),
            color: "#8b5cf6"
        }
    ];
    
    // Additional features with improved content - only replace text
    const additionalFeatures = [
        {
            icon: "verified",
            title: t('aboutSection.features.certifications.title'),
            description: t('aboutSection.features.certifications.description'),
            highlight: t('aboutSection.features.certifications.highlight'),
            color: "#ec4899"
        },
        {
            icon: "support_agent",
            title: t('aboutSection.features.support.title'),
            description: t('aboutSection.features.support.description'),
            highlight: t('aboutSection.features.support.highlight'),
            color: "#14b8a6"
        }
    ];
    
    // Determine which features to display - keep logic exactly as is
    const displayFeatures = showAllFeatures ? 
        [...coreFeatures, ...additionalFeatures] : 
        coreFeatures;
        
    return (
        <section className="about-section" id="about" ref={sectionRef}>
            {/* Keep ALL shape animations exactly as is */}
            <div className="about-shapes">
                <div className="about-shape shape-1"></div>
                <div className="about-shape shape-2"></div>
                <div className="about-shape shape-3"></div>
            </div>
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">{t('aboutSection.header.badge')}</span>
                    <h2>{t('aboutSection.header.title')}</h2>
                    <p className="section-subtitle">{t('aboutSection.header.subtitle')}</p>
                </div>
                
                {/* Keep ALL structure and animations exactly as is */}
                <div className="features-container">
                    <div className="features-grid">
                        {displayFeatures.map((feature, index) => (
                            <div 
                                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                                key={index} 
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onMouseEnter={() => setActiveFeature(index)}
                                onMouseLeave={() => setActiveFeature(null)}
                            >
                                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                                    <span className="material-icons">{feature.icon}</span>
                                </div>
                                <div className="feature-content">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                    <div className="feature-highlight" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                                        <span className="highlight-badge">{feature.highlight}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {!showAllFeatures && (
                    <div className="learn-more-cta">
                        <div className="cta-image">
                            <img src={studentsImage} alt={t('aboutSection.cta.imageAlt')} />
                        </div>
                        <div className="cta-content">
                            <span className="cta-badge">{t('aboutSection.cta.badge')}</span>
                            <h3>{t('aboutSection.cta.title')}</h3>
                            <p>{t('aboutSection.cta.description')}</p>
                            <div className="cta-stats">
                                <div className="cta-stat">
                                    <span className="stat-number">15+</span>
                                    <span className="stat-label">{t('aboutSection.cta.stats.years')}</span>
                                </div>
                                <div className="cta-stat">
                                    <span className="stat-number">5,000+</span>
                                    <span className="stat-label">{t('aboutSection.cta.stats.graduates')}</span>
                                </div>
                            </div>
                            <Link to="/about" className="btn-learn-more">
                                {t('aboutSection.cta.button')}
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                )}
                
                <div className="testimonial-preview">
                    <div className="testimonial-quote">
                        <span className="quote-icon material-icons">format_quote</span>
                        <blockquote>
                            {t('aboutSection.testimonial.quote')}
                        </blockquote>
                        <div className="quote-author">
                            <img src={studentProfileImage} alt={t('aboutSection.testimonial.author.name')} className="author-image" />
                            <div className="author-info">
                                <span className="author-name">{t('aboutSection.testimonial.author.name')}</span>
                                <span className="author-title">{t('aboutSection.testimonial.author.title')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

// import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import studentsImage from '../assets/images/png7.jpg'; 
// import studentProfileImage from '../assets/images/png1.jpg';

// const AboutSection = ({ showAllFeatures = false }) => {
//     const { t } = useTranslation();
//     const sectionRef = useRef(null);
//     const [activeFeature, setActiveFeature] = useState(null);
    
//     // Keep ALL your existing animation code exactly as is
//     useEffect(() => {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('visible');
//                 }
//             });
//         }, { threshold: 0.1 });
        
//         if (sectionRef.current) {
//             observer.observe(sectionRef.current);
//         }
        
//         return () => {
//             if (sectionRef.current) {
//                 observer.unobserve(sectionRef.current);
//             }
//         };
//     }, []);
    
//     // Core features - only replace text
//     const coreFeatures = [
//         {
//             icon: "handshake",
//             title: t('aboutSection.features.partnerships.title'),
//             description: t('aboutSection.features.partnerships.description'),
//             highlight: t('aboutSection.features.partnerships.highlight'),
//             color: "#3b82f6"
//         },
//         {
//             icon: "psychology",
//             title: t('aboutSection.features.instructors.title'),
//             description: t('aboutSection.features.instructors.description'),
//             highlight: t('aboutSection.features.instructors.highlight'),
//             color: "#10b981"
//         },
//         {
//             icon: "dashboard",
//             title: t('aboutSection.features.facilities.title'),
//             description: t('aboutSection.features.facilities.description'),
//             highlight: t('aboutSection.features.facilities.highlight'),
//             color: "#f59e0b"
//         },
//         {
//             icon: "rocket_launch",
//             title: t('aboutSection.features.career.title'),
//             description: t('aboutSection.features.career.description'),
//             highlight: t('aboutSection.features.career.highlight'),
//             color: "#8b5cf6"
//         }
//     ];
    
//     // Additional features - only replace text
//     const additionalFeatures = [
//         {
//             icon: "verified",
//             title: t('aboutSection.features.certifications.title'),
//             description: t('aboutSection.features.certifications.description'),
//             highlight: t('aboutSection.features.certifications.highlight'),
//             color: "#ec4899"
//         },
//         {
//             icon: "support_agent",
//             title: t('aboutSection.features.support.title'),
//             description: t('aboutSection.features.support.description'),
//             highlight: t('aboutSection.features.support.highlight'),
//             color: "#14b8a6"
//         }
//     ];
    
//     // Industry Partnership Companies
//     const partnershipCompanies = [
//         {
//             name: "Adam Innovations Co., Ltd.",
//             country: "Japan",
//             logo: "/api/placeholder/120/60",
//             description: "Adam Innovations (Adam-I) is headquartered in Tokyo with five offices across Asia and provides end-to-end digital, consulting and training support with expertise in emerging technologies including AI, IoT, blockchain and web development."
//         },
//         {
//             name: "Neuland Japan Co., Ltd.",
//             country: "Japan", 
//             logo: "/api/placeholder/120/60",
//             description: "Neuland Japan Co., Ltd. provides BPO services such as nearshore/offshore development, IoT, RFID, Electronic Shelf Label (ESL) solutions, data entry, and translation in Japan and China, and strives to be a company that can contribute to society in a lasting way while also striving for the happiness of its employees."
//         },
//         {
//             name: "Creannies Co., Ltd.",
//             country: "Japan",
//             logo: "/api/placeholder/120/60", 
//             description: "Creannies Co., Ltd. is a company that employs talented people from all over the world, focusing on our own solution services and system engineering services, and creates the future together with our employees who act as a 'bridge' to their home countries."
//         },
//         {
//             name: "Xpelize Solutions",
//             country: "India",
//             logo: "/api/placeholder/120/60",
//             description: "Leading technology solutions provider specializing in innovative software development and digital transformation services."
//         },
//         {
//             name: "ULTS Global",
//             country: "India", 
//             logo: "/api/placeholder/120/60",
//             description: "Advanced technology consulting firm focused on emerging technologies and digital innovation solutions."
//         },
//         {
//             name: "EPIC Technologies",
//             country: "Sri Lanka",
//             logo: "/api/placeholder/120/60",
//             description: "Premier technology company delivering cutting-edge solutions in software development and IT consulting."
//         }
//     ];
    
//     // Determine which features to display
//     const displayFeatures = showAllFeatures ? 
//         [...coreFeatures, ...additionalFeatures] : 
//         coreFeatures;
        
//     return (
//         <section className="relative py-16 lg:py-24 bg-gradient-to-br from-white to-slate-50 overflow-hidden" id="about" ref={sectionRef}>
//             {/* Animated background shapes - converted to Tailwind */}
//             <div className="absolute inset-0 pointer-events-none">
//                 <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-float"></div>
//                 <div className="absolute top-32 right-20 w-16 h-16 bg-purple-100 rounded-lg opacity-30 animate-float-delayed"></div>
//                 <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-100 rounded-full opacity-25 animate-bounce-slow"></div>
//             </div>
            
//             <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//                 {/* Section Header */}
//                 <div className="text-center mb-12 lg:mb-16">
//                     <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
//                         {t('aboutSection.header.badge')}
//                     </span>
//                     <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//                         {t('aboutSection.header.title')}
//                     </h2>
//                     <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
//                         {t('aboutSection.header.subtitle')}
//                     </p>
//                 </div>
                
//                 {/* Features Grid */}
//                 <div className="mb-16 lg:mb-20">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
//                         {displayFeatures.map((feature, index) => (
//                             <div 
//                                 className={`group relative bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${activeFeature === index ? 'shadow-lg -translate-y-1' : 'shadow-sm'}`}
//                                 key={index} 
//                                 style={{ animationDelay: `${index * 0.1}s` }}
//                                 onMouseEnter={() => setActiveFeature(index)}
//                                 onMouseLeave={() => setActiveFeature(null)}
//                             >
//                                 {/* Feature Icon */}
//                                 <div 
//                                     className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
//                                     style={{ 
//                                         backgroundColor: `${feature.color}15`, 
//                                         color: feature.color 
//                                     }}
//                                 >
//                                     <span className="material-icons text-2xl">{feature.icon}</span>
//                                 </div>
                                
//                                 {/* Feature Content */}
//                                 <div className="space-y-4">
//                                     <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
//                                         {feature.title}
//                                     </h3>
//                                     <p className="text-slate-600 leading-relaxed">
//                                         {feature.description}
//                                     </p>
//                                     <div 
//                                         className="inline-block px-3 py-1 rounded-lg text-sm font-medium"
//                                         style={{ 
//                                             backgroundColor: `${feature.color}15`, 
//                                             color: feature.color 
//                                         }}
//                                     >
//                                         {feature.highlight}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Industry Partnerships Section */}
//                 <div className="mb-16 lg:mb-20">
//                     <div className="text-center mb-12">
//                         <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
//                             Industry Partnership Companies
//                         </h3>
//                         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                             We collaborate with leading technology companies worldwide to provide our students with real-world experience and career opportunities.
//                         </p>
//                     </div>
                    
//                     {/* Partnership Companies Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {partnershipCompanies.map((company, index) => (
//                             <div 
//                                 key={index}
//                                 className="bg-white rounded-xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                             >
//                                 {/* Company Logo */}
//                                 <div className="flex items-center justify-center h-16 mb-4 bg-slate-50 rounded-lg">
//                                     <img 
//                                         src={company.logo} 
//                                         alt={company.name}
//                                         className="max-h-12 max-w-full object-contain"
//                                     />
//                                 </div>
                                
//                                 {/* Company Info */}
//                                 <div className="text-center mb-4">
//                                     <h4 className="font-semibold text-slate-800 mb-1">{company.name}</h4>
//                                     <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
//                                         {company.country}
//                                     </span>
//                                 </div>
                                
//                                 {/* Company Description */}
//                                 <p className="text-sm text-slate-600 leading-relaxed">
//                                     {company.description}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
                
//                 {/* CTA Section */}
//                 {!showAllFeatures && (
//                     <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm mb-16">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//                             {/* CTA Image */}
//                             <div className="order-2 lg:order-1">
//                                 <div className="relative rounded-2xl overflow-hidden shadow-lg">
//                                     <img 
//                                         src={studentsImage} 
//                                         alt={t('aboutSection.cta.imageAlt')}
//                                         className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
//                                     />
//                                 </div>
//                             </div>
                            
//                             {/* CTA Content */}
//                             <div className="order-1 lg:order-2 space-y-6">
//                                 <span className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium">
//                                     {t('aboutSection.cta.badge')}
//                                 </span>
                                
//                                 <h3 className="text-2xl lg:text-3xl font-bold text-slate-800">
//                                     {t('aboutSection.cta.title')}
//                                 </h3>
                                
//                                 <p className="text-slate-600 leading-relaxed">
//                                     {t('aboutSection.cta.description')}
//                                 </p>
                                
//                                 {/* CTA Stats */}
//                                 <div className="grid grid-cols-2 gap-6">
//                                     <div className="text-center p-4 bg-slate-50 rounded-xl">
//                                         <div className="text-2xl font-bold text-slate-800">15+</div>
//                                         <div className="text-sm text-slate-600">{t('aboutSection.cta.stats.years')}</div>
//                                     </div>
//                                     <div className="text-center p-4 bg-slate-50 rounded-xl">
//                                         <div className="text-2xl font-bold text-slate-800">5,000+</div>
//                                         <div className="text-sm text-slate-600">{t('aboutSection.cta.stats.graduates')}</div>
//                                     </div>
//                                 </div>
                                
//                                 <Link 
//                                     to="/about" 
//                                     className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//                                 >
//                                     {t('aboutSection.cta.button')}
//                                     <span className="material-icons text-lg">arrow_forward</span>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Testimonial Preview */}
//                 <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 lg:p-12 text-white">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="text-center mb-8">
//                             <span className="material-icons text-4xl text-slate-300 mb-4">format_quote</span>
//                             <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-8">
//                                 {t('aboutSection.testimonial.quote')}
//                             </blockquote>
//                         </div>
                        
//                         <div className="flex items-center justify-center gap-4">
//                             <img 
//                                 src={studentProfileImage} 
//                                 alt={t('aboutSection.testimonial.author.name')}
//                                 className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
//                             />
//                             <div className="text-center sm:text-left">
//                                 <div className="font-semibold text-lg">{t('aboutSection.testimonial.author.name')}</div>
//                                 <div className="text-slate-300">{t('aboutSection.testimonial.author.title')}</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default AboutSection;
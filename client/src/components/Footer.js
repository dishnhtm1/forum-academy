import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin, 
    Youtube,
    ChevronUp,
    MapPin,
    Phone,
    Fax,
    Globe,
    Clock,
    GraduationCap,
    ArrowRight
} from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { 
            icon: Facebook, 
            url: 'https://facebook.com/', 
            name: 'Facebook',
            color: 'hover:bg-blue-600 hover:text-white group-hover:scale-110',
            bgColor: 'bg-blue-50 hover:bg-blue-600'
        },
        { 
            icon: Twitter, 
            url: 'https://twitter.com/', 
            name: 'Twitter',
            color: 'hover:bg-sky-500 hover:text-white group-hover:scale-110',
            bgColor: 'bg-sky-50 hover:bg-sky-500'
        },
        { 
            icon: Instagram, 
            url: 'https://instagram.com/', 
            name: 'Instagram',
            color: 'hover:bg-pink-500 hover:text-white group-hover:scale-110',
            bgColor: 'bg-pink-50 hover:bg-pink-500'
        },
        { 
            icon: Linkedin, 
            url: 'https://linkedin.com/', 
            name: 'LinkedIn',
            color: 'hover:bg-blue-700 hover:text-white group-hover:scale-110',
            bgColor: 'bg-blue-50 hover:bg-blue-700'
        },
        { 
            icon: Youtube, 
            url: 'https://youtube.com/', 
            name: 'YouTube',
            color: 'hover:bg-red-600 hover:text-white group-hover:scale-110',
            bgColor: 'bg-red-50 hover:bg-red-600'
        }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-t border-slate-200">
            {/* Colorful Animated Wave - Same as before */}
            <div className="relative overflow-hidden">
                <svg 
                    className="w-full h-12 transform-gpu" 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="25%" stopColor="#6366f1" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            <stop offset="75%" stopColor="#a855f7" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                        </linearGradient>
                        
                        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                            <stop offset="33%" stopColor="#3b82f6" stopOpacity="0.7" />
                            <stop offset="66%" stopColor="#6366f1" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
                        </linearGradient>
                        
                        <radialGradient id="waveGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </radialGradient>
                    </defs>
                    
                    <path 
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                        fill="url(#waveGradient1)"
                        className="animate-wave origin-center drop-shadow-lg"
                    />
                    
                    <path 
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,133.3C960,128,1056,96,1152,85.3C1248,75,1344,85,1392,90.7L1440,96V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0V96Z"
                        fill="url(#waveGradient2)"
                        className="animate-wave-reverse origin-center"
                        style={{ animationDelay: '0.5s' }}
                    />
                    
                    <path 
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                        fill="url(#waveGlow)"
                        className="animate-shimmer origin-center"
                    />
                </svg>
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-pink-500/10 animate-pulse"></div>
                
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1.5 h-1.5 rounded-full animate-float ${
                                i % 4 === 0 ? 'bg-blue-400/60' :
                                i % 4 === 1 ? 'bg-purple-400/60' :
                                i % 4 === 2 ? 'bg-pink-400/60' :
                                'bg-cyan-400/60'
                            }`}
                            style={{
                                left: `${10 + i * 15}%`,
                                top: `${30 + Math.sin(i) * 20}%`,
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>
            
                <style>{`
                    @keyframes footer-wave {
                        0%, 100% { transform: translateX(0%) scale(1); }
                        25% { transform: translateX(-2%) scale(1.02); }
                        50% { transform: translateX(0%) scale(0.98); }
                        75% { transform: translateX(2%) scale(1.02); }
                    }
                    
                    @keyframes footer-wave-reverse {
                        0%, 100% { transform: translateX(0%) scale(1); }
                        25% { transform: translateX(2%) scale(0.98); }
                        50% { transform: translateX(0%) scale(1.02); }
                        75% { transform: translateX(-2%) scale(0.98); }
                    }
                    
                    @keyframes footer-shimmer {
                        0%, 100% { opacity: 0.3; transform: translateX(0%) scale(1); }
                        50% { opacity: 0.7; transform: translateX(1%) scale(1.01); }
                    }
                    
                    @keyframes footer-float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                        50% { transform: translateY(-12px) rotate(180deg); opacity: 1; }
                    }
                    
                    .footer-animate-wave {
                        animation: footer-wave 4s ease-in-out infinite;
                    }
                    
                    .footer-animate-wave-reverse {
                        animation: footer-wave-reverse 3s ease-in-out infinite;
                    }
                    
                    .footer-animate-shimmer {
                        animation: footer-shimmer 2s ease-in-out infinite;
                    }
                    
                    .footer-animate-float {
                        animation: footer-float 2s infinite ease-in-out;
                    }
                `}</style>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    
                    {/* About Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {t('footer.aboutAcademy') || 'Forum Information Academy'}
                                </h2>
                            </div>
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed">
                            {t('footer.aboutDescription') || 'Leading technology education institution dedicated to preparing students for successful careers in the digital economy.'}
                        </p>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                                {t('footer.followUs') || 'Follow Us'}
                            </h3>
                            <div className="flex space-x-3">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group w-12 h-12 ${social.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110 hover:-translate-y-1`}
                                            title={t(`social.${social.name.toLowerCase()}`) || social.name}
                                        >
                                            <IconComponent className={`w-5 h-5 text-slate-600 transition-all duration-300 ${social.color}`} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                            {t('footer.quickLinks') || 'Quick Links'}
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: t('navigation.home') || 'Home', path: '/' },
                                { name: t('navigation.programs') || 'Programs', path: '/courses' },
                                { name: t('navigation.aboutUs') || 'About Us', path: '/about' },
                                { name: t('navigation.newsEvents') || 'News & Events', path: '/news' },
                                { name: t('buttons.applyNow') || 'Apply Now', path: '/apply' }
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        to={link.path}
                                        className="group flex items-center py-2 px-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:translate-x-1"
                                    >
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-4 group-hover:bg-blue-500 group-hover:scale-125 transition-all duration-300"></div>
                                        <span className="text-slate-600 group-hover:text-blue-600 font-medium transition-colors duration-300 flex-1">
                                            {link.name}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">
                            {t('footer.contactUs') || 'Contact Us'}
                        </h3>
                        <div className="space-y-4">
                            {/* Address */}
                            <div className="flex items-start space-x-3 group">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {t('footer.address') || '3-1-19 Benten, Chuo-ku, Niigata City, Niigata Prefecture, Japan 950-0901'}
                                    </p>
                                </div>
                            </div>
                    
                            {/* Phone & Fax */}
                            <div className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm">{t('footer.phone') || 'TEL: 025-247-6300'}</p>
                                    <p className="text-slate-600 text-sm">{t('footer.fax') || 'FAX: 025-247-6305'}</p>
                                </div>
                            </div>
                    
                            {/* Website */}
                            <div className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <a 
                                    href="https://www.forum.ac.jp/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 hover:underline"
                                >
                                    {t('footer.websiteLabel') || 'https://www.forum.ac.jp/'}
                                </a>
                            </div>
                    
                            {/* Hours */}
                            <div className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <p className="text-slate-600 text-sm">
                                    {t('footer.hours') || 'Mon-Fri: 9:00 AM - 6:00 PM'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <p className="text-slate-600 text-sm">
                            {t('footer.copyright', { year: currentYear })}
                        </p>
                        
                        <div className="flex items-center space-x-6">
                            <Link 
                                to="/privacy-policy" 
                                className="text-slate-500 hover:text-blue-600 text-sm transition-colors duration-300 hover:underline"
                            >
                                {t('footer.privacyPolicy') || 'Privacy Policy'}
                            </Link>
                            <Link 
                                to="/terms" 
                                className="text-slate-500 hover:text-blue-600 text-sm transition-colors duration-300 hover:underline"
                            >
                                {t('footer.termsOfService') || 'Terms of Service'}
                            </Link>
                            
                            <button
                                onClick={scrollToTop}
                                className="group w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Scroll to top"
                            >
                                <ChevronUp className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
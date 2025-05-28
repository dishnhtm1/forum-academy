// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import LoginModal from './LoginModal';
// import '../styles/Header.css';
// import logoWhiteImage from '../assets/images/logo1.png';
// // import { useLanguage } from '../context/LanguageContext'; // Add this import

// const Header = ({ onLoginClick }) => {
//     const { t, i18n } = useTranslation();
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [language, setLanguage] = useState('EN');
//     const [scrolled, setScrolled] = useState(false);
//     const [dropdownOpen, setDropdownOpen] = useState('');
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [hoveredItem, setHoveredItem] = useState(null);
    
//     const location = useLocation();
    
//     // Close mobile menu when route changes
//     useEffect(() => {
//         setMenuOpen(false);
//         setDropdownOpen('');
//     }, [location]);
    
//     // Add scroll listener for header style change
//     useEffect(() => {
//         const handleScroll = () => {
//             const isScrolled = window.scrollY > 50;
//             if (isScrolled !== scrolled) {
//                 setScrolled(isScrolled);
//             }
//         };

//         window.addEventListener('scroll', handleScroll);
        
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [scrolled]);

//     const toggleMenu = () => {
//         setMenuOpen(!menuOpen);
//     };

//     const toggleLanguage = () => {
//         setLanguage(language === 'EN' ? 'JP' : 'EN');
//     };

//     const toggleDropdown = (menu) => {
//         setDropdownOpen(dropdownOpen === menu ? '' : menu);
//     };

//     const handleMouseEnter = (item) => {
//         setHoveredItem(item);
//         if (item === 'courses' || item === 'about') {
//             setDropdownOpen(item);
//         }
//     };

//     const handleMouseLeave = () => {
//         setHoveredItem(null);
//         setDropdownOpen('');
//     };

//     const openModal = () => {
//         console.log('Opening login modal');
//         setIsLoginModalOpen(true);
//         if (menuOpen) {
//             setMenuOpen(false);
//         }
//     };

//     const closeModal = () => {
//         setIsLoginModalOpen(false);
//     };

//     const isActiveLink = (path) => {
//         return location.pathname === path || location.pathname.startsWith(path + '/');
//     };
    
//     return (
//         <>
//             <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
//                 <div className="container header-container">
//                     <Link to="/" className="header-logo">
//                         <img src={logoWhiteImage} alt="Forum Information Academy" className="logo-image-white" />
//                         <span className="logo-text">Forum Academy</span>
//                     </Link>
                    
//                     <button 
//                         className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
//                         onClick={toggleMenu}
//                         aria-label="Toggle menu"
//                         aria-expanded={menuOpen}
//                     >
//                         <span className="menu-toggle-bar"></span>
//                         <span className="menu-toggle-bar"></span>
//                         <span className="menu-toggle-bar"></span>
//                     </button>
                    
//                     <div className={`header-nav-wrapper ${menuOpen ? 'open' : ''}`}>
//                         <nav className="header-nav">
//                             <ul className="nav-list">
//                                 <li 
//                                     className={`nav-item has-dropdown ${isActiveLink('/courses') ? 'active' : ''}`}
//                                     onMouseEnter={() => handleMouseEnter('courses')}
//                                     onMouseLeave={handleMouseLeave}
//                                 >
//                                     <button 
//                                         className="nav-link dropdown-trigger"
//                                         onClick={() => toggleDropdown('courses')}
//                                         aria-expanded={dropdownOpen === 'courses'}
//                                     >
//                                         <span className="nav-link-text">Programs</span>
//                                         <span className="nav-link-underline"></span>
//                                         <span className="material-icons dropdown-icon">expand_more</span>
//                                     </button>
//                                     <div className={`dropdown-menu mega-menu ${dropdownOpen === 'courses' ? 'open' : ''}`}>
//                                         <div className="dropdown-inner">
//                                             <div className="dropdown-column">
//                                                 <h4><span className="column-icon">🚀</span> Featured Programs</h4>
//                                                 <ul className="dropdown-list">
//                                                     <li>
//                                                         <Link to="/courses/web-development" className="dropdown-link">
//                                                             <span className="link-icon material-icons">web</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">Web Development</span>
//                                                                 <small>Full-stack engineering courses</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link to="/courses/data-science" className="dropdown-link">
//                                                             <span className="link-icon material-icons">analytics</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">Data Science</span>
//                                                                 <small>Analytics and ML specialization</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link to="/courses/cybersecurity" className="dropdown-link">
//                                                             <span className="link-icon material-icons">security</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">Cybersecurity</span>
//                                                                 <small>Network and systems protection</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                 </ul>
//                                             </div>
//                                             <div className="dropdown-column">
//                                                 <h4><span className="column-icon">💡</span> More Programs</h4>
//                                                 <ul className="dropdown-list">
//                                                     <li>
//                                                         <Link to="/courses/cloud-computing" className="dropdown-link">
//                                                             <span className="link-icon material-icons">cloud</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">Cloud Computing</span>
//                                                                 <small>AWS, Azure, and GCP</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link to="/courses/ai-ml" className="dropdown-link">
//                                                             <span className="link-icon material-icons">psychology</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">AI & Machine Learning</span>
//                                                                 <small>Advanced AI technologies</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link to="/courses" className="dropdown-link view-all">
//                                                             <span className="link-icon material-icons">view_list</span>
//                                                             <div className="link-content">
//                                                                 <span className="link-title">View All Programs</span>
//                                                                 <small>Browse our complete catalog</small>
//                                                             </div>
//                                                             <span className="link-arrow material-icons">arrow_forward</span>
//                                                         </Link>
//                                                     </li>
//                                                 </ul>
//                                             </div>
//                                             <div className="dropdown-promo">
//                                                 <h4>🎓 Start Your Journey</h4>
//                                                 <p>Join thousands of students already learning with us</p>
//                                                 <Link to="/apply" className="promo-button">Apply Now</Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </li>
//                                 <li 
//                                     className={`nav-item has-dropdown ${isActiveLink('/about') ? 'active' : ''}`}
//                                     onMouseEnter={() => handleMouseEnter('about')}
//                                     onMouseLeave={handleMouseLeave}
//                                 >
//                                     <button 
//                                         className="nav-link dropdown-trigger"
//                                         onClick={() => toggleDropdown('about')}
//                                         aria-expanded={dropdownOpen === 'about'}
//                                     >
//                                         <span className="nav-link-text">About</span>
//                                         <span className="nav-link-underline"></span>
//                                         <span className="material-icons dropdown-icon">expand_more</span>
//                                     </button>
//                                     <div className={`dropdown-menu ${dropdownOpen === 'about' ? 'open' : ''}`}>
//                                         <ul className="dropdown-list">
//                                             <li>
//                                                 <Link to="/about" className="dropdown-link">
//                                                     <span className="link-icon material-icons">info</span>
//                                                     <span className="link-title">About Us</span>
//                                                 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="/team" className="dropdown-link">
//                                                     <span className="link-icon material-icons">groups</span>
//                                                     <span className="link-title">Our Team</span>
//                                                 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="/partners" className="dropdown-link">
//                                                     <span className="link-icon material-icons">handshake</span>
//                                                     <span className="link-title">Industry Partners</span>
//                                                 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="/testimonials" className="dropdown-link">
//                                                     <span className="link-icon material-icons">star</span>
//                                                     <span className="link-title">Student Success</span>
//                                                 </Link>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </li>
//                                 <li className={`nav-item ${isActiveLink('/news') ? 'active' : ''}`}>
//                                     <Link to="/news" className="nav-link">
//                                         <span className="nav-link-text">News & Events</span>
//                                         <span className="nav-link-underline"></span>
//                                     </Link>
//                                 </li>
//                                 <li className={`nav-item ${isActiveLink('/career-services') ? 'active' : ''}`}>
//                                     <Link to="/career-services" className="nav-link">
//                                         <span className="nav-link-text">Career Services</span>
//                                         <span className="nav-link-underline"></span>
//                                     </Link>
//                                 </li>
//                                 <li className={`nav-item ${isActiveLink('/contact') ? 'active' : ''}`}>
//                                     <Link to="/contact" className="nav-link">
//                                         <span className="nav-link-text">Contact</span>
//                                         <span className="nav-link-underline"></span>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </nav>
                        
//                         <div className="header-actions">
//                             {/* <div className="language-selector" onClick={toggleLanguage}>
//                                 <span className="material-icons">language</span>
//                                 <span className="lang-text">{language}</span>
//                             </div> */}
//                             <div className="language-selector" onClick={toggleLanguage}>
//                                 <span className="material-icons">language</span>
//                                 <span className="lang-text">{language}</span>
//                             </div>
                            
//                             <button className="btn-login" onClick={onLoginClick}>
//                                 <span className="material-icons">person</span>
//                                 <span>Log In</span>
//                             </button>
                            
//                             <Link to="/apply" className="btn-apply">
//                                 <span>Apply Now</span>
//                                 <span className="btn-arrow material-icons">arrow_forward</span>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </header>
            
//             <LoginModal 
//                 isOpen={isLoginModalOpen} 
//                 onClose={closeModal} 
//             />
//         </>
//     );
// };

// export default Header;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from './LoginModal';
import '../styles/Header.css';
import logoWhiteImage from '../assets/images/logo1.png';

const Header = ({ onLoginClick }) => {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    
    const location = useLocation();
    
    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen('');
    }, [location]);
    
    // Add scroll listener for header style change
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleLanguage = () => {
        // Switch between English and Japanese
        const newLanguage = i18n.language === 'en' ? 'ja' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const toggleDropdown = (menu) => {
        setDropdownOpen(dropdownOpen === menu ? '' : menu);
    };

    const handleMouseEnter = (item) => {
        setHoveredItem(item);
        if (item === 'courses' || item === 'about') {
            setDropdownOpen(item);
        }
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
        setDropdownOpen('');
    };

    const openModal = () => {
        console.log('Opening login modal');
        setIsLoginModalOpen(true);
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    const closeModal = () => {
        setIsLoginModalOpen(false);
    };

    const isActiveLink = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Get current language display text
    const getCurrentLanguage = () => {
        return i18n.language === 'en' ? 'EN' : 'JP';
    };
    
    return (
        <>
            <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="header-logo">
                        <img src={logoWhiteImage} alt="Forum Information Academy" className="logo-image-white" />
                        <span className="logo-text">Forum Academy</span>
                    </Link>
                    
                    <button 
                        className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span className="menu-toggle-bar"></span>
                        <span className="menu-toggle-bar"></span>
                        <span className="menu-toggle-bar"></span>
                    </button>
                    
                    <div className={`header-nav-wrapper ${menuOpen ? 'open' : ''}`}>
                        <nav className="header-nav">
                            <ul className="nav-list">
                                <li 
                                    className={`nav-item has-dropdown ${isActiveLink('/courses') ? 'active' : ''}`}
                                    onMouseEnter={() => handleMouseEnter('courses')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button 
                                        className="nav-link dropdown-trigger"
                                        onClick={() => toggleDropdown('courses')}
                                        aria-expanded={dropdownOpen === 'courses'}
                                    >
                                        <span className="nav-link-text">{t('navigation.programs')}</span>
                                        <span className="nav-link-underline"></span>
                                        <span className="material-icons dropdown-icon">expand_more</span>
                                    </button>
                                    <div className={`dropdown-menu mega-menu ${dropdownOpen === 'courses' ? 'open' : ''}`}>
                                        <div className="dropdown-inner">
                                            <div className="dropdown-column">
                                                <h4><span className="column-icon">🚀</span> {t('navigation.featuredPrograms')}</h4>
                                                <ul className="dropdown-list">
                                                    <li>
                                                        <Link to="/courses/web-development" className="dropdown-link">
                                                            <span className="link-icon material-icons">web</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('courses.webDevelopment')}</span>
                                                                <small>{t('courses.webDevelopmentDesc')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/data-science" className="dropdown-link">
                                                            <span className="link-icon material-icons">analytics</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('courses.dataScience')}</span>
                                                                <small>{t('courses.dataScienceDesc')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/cybersecurity" className="dropdown-link">
                                                            <span className="link-icon material-icons">security</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('courses.cybersecurity')}</span>
                                                                <small>{t('courses.cybersecurityDesc')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-column">
                                                <h4><span className="column-icon">💡</span> {t('navigation.morePrograms')}</h4>
                                                <ul className="dropdown-list">
                                                    <li>
                                                        <Link to="/courses/cloud-computing" className="dropdown-link">
                                                            <span className="link-icon material-icons">cloud</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('courses.cloudComputing')}</span>
                                                                <small>{t('courses.cloudComputingDesc')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/ai-ml" className="dropdown-link">
                                                            <span className="link-icon material-icons">psychology</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('courses.aiMl')}</span>
                                                                <small>{t('courses.aiMlDesc')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses" className="dropdown-link view-all">
                                                            <span className="link-icon material-icons">view_list</span>
                                                            <div className="link-content">
                                                                <span className="link-title">{t('navigation.viewAllPrograms')}</span>
                                                                <small>{t('navigation.browseCatalog')}</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-promo">
                                                <h4>🎓 {t('navigation.startJourney')}</h4>
                                                <p>{t('navigation.joinStudents')}</p>
                                                <Link to="/apply" className="promo-button">{t('buttons.applyNow')}</Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li 
                                    className={`nav-item has-dropdown ${isActiveLink('/about') ? 'active' : ''}`}
                                    onMouseEnter={() => handleMouseEnter('about')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button 
                                        className="nav-link dropdown-trigger"
                                        onClick={() => toggleDropdown('about')}
                                        aria-expanded={dropdownOpen === 'about'}
                                    >
                                        <span className="nav-link-text">{t('navigation.about')}</span>
                                        <span className="nav-link-underline"></span>
                                        <span className="material-icons dropdown-icon">expand_more</span>
                                    </button>
                                    <div className={`dropdown-menu ${dropdownOpen === 'about' ? 'open' : ''}`}>
                                        <ul className="dropdown-list">
                                            <li>
                                                <Link to="/about" className="dropdown-link">
                                                    <span className="link-icon material-icons">info</span>
                                                    <span className="link-title">{t('navigation.aboutUs')}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/team" className="dropdown-link">
                                                    <span className="link-icon material-icons">groups</span>
                                                    <span className="link-title">{t('navigation.ourTeam')}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/partners" className="dropdown-link">
                                                    <span className="link-icon material-icons">handshake</span>
                                                    <span className="link-title">{t('navigation.industryPartners')}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/testimonials" className="dropdown-link">
                                                    <span className="link-icon material-icons">star</span>
                                                    <span className="link-title">{t('navigation.studentSuccess')}</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className={`nav-item ${isActiveLink('/news') ? 'active' : ''}`}>
                                    <Link to="/news" className="nav-link">
                                        <span className="nav-link-text">{t('navigation.newsEvents')}</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${isActiveLink('/career-services') ? 'active' : ''}`}>
                                    <Link to="/career-services" className="nav-link">
                                        <span className="nav-link-text">{t('navigation.careerServices')}</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${isActiveLink('/contact') ? 'active' : ''}`}>
                                    <Link to="/contact" className="nav-link">
                                        <span className="nav-link-text">{t('navigation.contact')}</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        
                        <div className="header-actions">
                            <div className="language-selector" onClick={toggleLanguage}>
                                <span className="material-icons">language</span>
                                <span className="lang-text">{getCurrentLanguage()}</span>
                            </div>
                            
                            <button className="btn-login" onClick={onLoginClick}>
                                <span className="material-icons">person</span>
                                <span>{t('buttons.login')}</span>
                            </button>
                            
                            <Link to="/apply" className="btn-apply">
                                <span>{t('buttons.applyNow')}</span>
                                <span className="btn-arrow material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={closeModal} 
            />
        </>
    );
};

export default Header;
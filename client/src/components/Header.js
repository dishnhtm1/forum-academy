// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import LoginModal from './LoginModal'; // Make sure to import the LoginModal
// import '../styles/Header.css';
// import logoWhiteImage from '../assets/images/logo1.png'; // Use the correct path for your logo

// const Header = ( { onLoginClick }) => {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [language, setLanguage] = useState('EN');
//     const [scrolled, setScrolled] = useState(false);
//     const [dropdownOpen, setDropdownOpen] = useState('');
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Add this state for the modal
    
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

//     // Update the openModal function to actually open the modal
//     const openModal = () => {
//         console.log('Opening login modal');
//         setIsLoginModalOpen(true);
//         // Close mobile menu if it's open
//         if (menuOpen) {
//             setMenuOpen(false);
//         }
//     };

//     // Function to close the modal
//     const closeModal = () => {
//         setIsLoginModalOpen(false);
//     };

//     return (
//         <>
//             <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
//                 <div className="container header-container">
//                     <Link to="/" className="header-logo">
//                         {/* <img src={logoImage} alt="Forum Information Academy" className="logo-image" /> */}
//                         <img src={logoWhiteImage} alt="Forum Information Academy" className="logo-image-white" />
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
//                                 <li className="nav-item has-dropdown">
//                                     <button 
//                                         className="nav-link dropdown-trigger"
//                                         onClick={() => toggleDropdown('courses')}
//                                         aria-expanded={dropdownOpen === 'courses'}
//                                     >
//                                         Programs
//                                         <span className="material-icons">expand_more</span>
//                                     </button>
//                                     <div className={`dropdown-menu ${dropdownOpen === 'courses' ? 'open' : ''}`}>
//                                         <div className="dropdown-column">
//                                             <h4>Featured Programs</h4>
//                                             <ul className="dropdown-list">
//                                                 <li>
//                                                     <Link to="/courses/web-development" className="dropdown-link">
//                                                         <span className="material-icons">web</span>
//                                                         <div>
//                                                             <span>Web Development</span>
//                                                             <small>Full-stack engineering courses</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link to="/courses/data-science" className="dropdown-link">
//                                                         <span className="material-icons">analytics</span>
//                                                         <div>
//                                                             <span>Data Science</span>
//                                                             <small>Analytics and ML specialization</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link to="/courses/cybersecurity" className="dropdown-link">
//                                                         <span className="material-icons">security</span>
//                                                         <div>
//                                                             <span>Cybersecurity</span>
//                                                             <small>Network and systems protection</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                         <div className="dropdown-column">
//                                             <h4>More Programs</h4>
//                                             <ul className="dropdown-list">
//                                                 <li>
//                                                     <Link to="/courses/cloud-computing" className="dropdown-link">
//                                                         <span className="material-icons">cloud</span>
//                                                         <div>
//                                                             <span>Cloud Computing</span>
//                                                             <small>AWS, Azure, and GCP</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link to="/courses/ai-ml" className="dropdown-link">
//                                                         <span className="material-icons">psychology</span>
//                                                         <div>
//                                                             <span>AI & Machine Learning</span>
//                                                             <small>Advanced AI technologies</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link to="/courses" className="dropdown-link view-all">
//                                                         <span className="material-icons">view_list</span>
//                                                         <div>
//                                                             <span>View All Programs</span>
//                                                             <small>Browse our complete catalog</small>
//                                                         </div>
//                                                     </Link>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 </li>
//                                 <li className="nav-item has-dropdown">
//                                     <button 
//                                         className="nav-link dropdown-trigger"
//                                         onClick={() => toggleDropdown('about')}
//                                         aria-expanded={dropdownOpen === 'about'}
//                                     >
//                                         About
//                                         <span className="material-icons">expand_more</span>
//                                     </button>
//                                     <div className={`dropdown-menu ${dropdownOpen === 'about' ? 'open' : ''}`}>
//                                         <ul className="dropdown-list">
//                                             <li><Link to="/about" className="dropdown-link">About Us</Link></li>
//                                             <li><Link to="/team" className="dropdown-link">Our Team</Link></li>
//                                             <li><Link to="/partners" className="dropdown-link">Industry Partners</Link></li>
//                                             <li><Link to="/testimonials" className="dropdown-link">Student Success</Link></li>
//                                         </ul>
//                                     </div>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link to="/news" className="nav-link">News & Events</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link to="/career-services" className="nav-link">Career Services</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link to="/contact" className="nav-link">Contact</Link>
//                                 </li>
//                             </ul>
//                         </nav>
                        
//                         <div className="header-actions">
//                             <div className="language-selector" onClick={toggleLanguage}>
//                                 <span className="material-icons">language</span>
//                                 <span>{language}</span>
//                             </div>
                            
//                             {/* Updated login button with proper event handler */}
//                             <button className="btn-login" onClick={onLoginClick}>
//                                 <span className="material-icons">person</span>
//                                 <span>Log In</span>
//                             </button>
//                             {/* <button onClick={onLoginClick} className="login-button">Login</button> */}
                            
//                             <Link to="/apply" className="btn-apply">
//                                 Apply Now
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </header>
            
//             {/* Add the LoginModal component here, outside the header */}
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
import LoginModal from './LoginModal';
import '../styles/Header.css';
import logoWhiteImage from '../assets/images/logo1.png';

const Header = ({ onLoginClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [language, setLanguage] = useState('EN');
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
        setLanguage(language === 'EN' ? 'JP' : 'EN');
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
                                        <span className="nav-link-text">Programs</span>
                                        <span className="nav-link-underline"></span>
                                        <span className="material-icons dropdown-icon">expand_more</span>
                                    </button>
                                    <div className={`dropdown-menu mega-menu ${dropdownOpen === 'courses' ? 'open' : ''}`}>
                                        <div className="dropdown-inner">
                                            <div className="dropdown-column">
                                                <h4><span className="column-icon">🚀</span> Featured Programs</h4>
                                                <ul className="dropdown-list">
                                                    <li>
                                                        <Link to="/courses/web-development" className="dropdown-link">
                                                            <span className="link-icon material-icons">web</span>
                                                            <div className="link-content">
                                                                <span className="link-title">Web Development</span>
                                                                <small>Full-stack engineering courses</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/data-science" className="dropdown-link">
                                                            <span className="link-icon material-icons">analytics</span>
                                                            <div className="link-content">
                                                                <span className="link-title">Data Science</span>
                                                                <small>Analytics and ML specialization</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/cybersecurity" className="dropdown-link">
                                                            <span className="link-icon material-icons">security</span>
                                                            <div className="link-content">
                                                                <span className="link-title">Cybersecurity</span>
                                                                <small>Network and systems protection</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-column">
                                                <h4><span className="column-icon">💡</span> More Programs</h4>
                                                <ul className="dropdown-list">
                                                    <li>
                                                        <Link to="/courses/cloud-computing" className="dropdown-link">
                                                            <span className="link-icon material-icons">cloud</span>
                                                            <div className="link-content">
                                                                <span className="link-title">Cloud Computing</span>
                                                                <small>AWS, Azure, and GCP</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses/ai-ml" className="dropdown-link">
                                                            <span className="link-icon material-icons">psychology</span>
                                                            <div className="link-content">
                                                                <span className="link-title">AI & Machine Learning</span>
                                                                <small>Advanced AI technologies</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/courses" className="dropdown-link view-all">
                                                            <span className="link-icon material-icons">view_list</span>
                                                            <div className="link-content">
                                                                <span className="link-title">View All Programs</span>
                                                                <small>Browse our complete catalog</small>
                                                            </div>
                                                            <span className="link-arrow material-icons">arrow_forward</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-promo">
                                                <h4>🎓 Start Your Journey</h4>
                                                <p>Join thousands of students already learning with us</p>
                                                <Link to="/apply" className="promo-button">Apply Now</Link>
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
                                        <span className="nav-link-text">About</span>
                                        <span className="nav-link-underline"></span>
                                        <span className="material-icons dropdown-icon">expand_more</span>
                                    </button>
                                    <div className={`dropdown-menu ${dropdownOpen === 'about' ? 'open' : ''}`}>
                                        <ul className="dropdown-list">
                                            <li>
                                                <Link to="/about" className="dropdown-link">
                                                    <span className="link-icon material-icons">info</span>
                                                    <span className="link-title">About Us</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/team" className="dropdown-link">
                                                    <span className="link-icon material-icons">groups</span>
                                                    <span className="link-title">Our Team</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/partners" className="dropdown-link">
                                                    <span className="link-icon material-icons">handshake</span>
                                                    <span className="link-title">Industry Partners</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/testimonials" className="dropdown-link">
                                                    <span className="link-icon material-icons">star</span>
                                                    <span className="link-title">Student Success</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className={`nav-item ${isActiveLink('/news') ? 'active' : ''}`}>
                                    <Link to="/news" className="nav-link">
                                        <span className="nav-link-text">News & Events</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${isActiveLink('/career-services') ? 'active' : ''}`}>
                                    <Link to="/career-services" className="nav-link">
                                        <span className="nav-link-text">Career Services</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${isActiveLink('/contact') ? 'active' : ''}`}>
                                    <Link to="/contact" className="nav-link">
                                        <span className="nav-link-text">Contact</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        
                        <div className="header-actions">
                            <div className="language-selector" onClick={toggleLanguage}>
                                <span className="material-icons">language</span>
                                <span className="lang-text">{language}</span>
                            </div>
                            
                            <button className="btn-login" onClick={onLoginClick}>
                                <span className="material-icons">person</span>
                                <span>Log In</span>
                            </button>
                            
                            <Link to="/apply" className="btn-apply">
                                <span>Apply Now</span>
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
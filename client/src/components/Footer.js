import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import
import '../styles/Footer.css';

const Footer = () => {
    const { t } = useTranslation(); // Add this line
    const currentYear = new Date().getFullYear();
    
    useEffect(() => {
        // Keep your original bubble animation code
        const createBubbles = () => {
            const bubblesContainer = document.getElementById('bubbles-container');
            if (!bubblesContainer) return;
            
            const bubbleCount = 20;
            
            for (let i = 0; i < bubbleCount; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                // Random size between 10px and 50px
                const size = Math.random() * 40 + 10;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // Random position
                bubble.style.left = `${Math.random() * 100}%`;
                bubble.style.top = `${Math.random() * 100}%`;
                
                // Random animation duration
                const duration = Math.random() * 15 + 5;
                bubble.style.animationDuration = `${duration}s`;
                
                // Random animation delay
                bubble.style.animationDelay = `${Math.random() * 5}s`;
                
                bubblesContainer.appendChild(bubble);
            }
        };

        createBubbles();
    }, []);

    return (
        <footer className="site-footer">
            {/* Keep your original wave animations */}
            <div className="waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
            </div>
            
            {/* Keep your original floating bubbles */}
            <div className="floating-bubbles" id="bubbles-container">
                {/* Bubbles will be added by JavaScript */}
            </div>
            
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-heading">{t('footer.aboutAcademy')}</h2>
                    <p>{t('footer.aboutDescription')}</p>
                    {/* Keep your original social icons structure */}
                    <div className="social-icons">
                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="social-icon" data-platform="facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-icon" data-platform="twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon" data-platform="instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon" data-platform="linkedin">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="social-icon" data-platform="youtube">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
                
                <div className="footer-section footer-links">
                    <h2 className="footer-heading">{t('footer.quickLinks')}</h2>
                    <ul>
                        <li><Link to="/" data-nav="home">{t('navigation.home')}</Link></li>
                        <li><Link to="/courses" data-nav="courses">{t('navigation.programs')}</Link></li>
                        <li><Link to="/about" data-nav="about">{t('navigation.aboutUs')}</Link></li>
                        <li><Link to="/news" data-nav="news">{t('navigation.newsEvents')}</Link></li>
                        <li><Link to="/apply" data-nav="apply">{t('buttons.applyNow')}</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section contact">
                    <h2 className="footer-heading">{t('footer.contactUs')}</h2>
                    <p><i className="fas fa-map-marker-alt"></i> {t('footer.address')}</p>
                    <p><i className="fas fa-phone"></i> {t('footer.phone')}</p>
                    <p><i className="fas fa-envelope"></i> <a href="https://www.forum.ac.jp/">https://www.forum.ac.jp/</a></p>
                    <p><i className="fas fa-clock"></i> {t('footer.hours')}</p>
                </div>
                
                {/* <div className="footer-section newsletter">
                    <h2 className="footer-heading">{t('footer.subscribe')}</h2>
                    <p>{t('footer.subscribeDescription')}</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder={t('footer.emailPlaceholder')} required />
                        <button type="submit">{t('footer.subscribeButton')}</button>
                    </form>
                </div> */}
            </div>
            
            <div className="copyright">
                <p>&copy; {currentYear} Forum Information Academy. {t('footer.allRightsReserved')}</p>
                <div className="footer-legal-links">
                    <a href="/privacy-policy">{t('footer.privacyPolicy')}</a>
                    <a href="/terms">{t('footer.termsOfService')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    useEffect(() => {
        // Create floating bubbles
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
            <div className="waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
            </div>
            
            <div className="floating-bubbles" id="bubbles-container">
                {/* Bubbles will be added by JavaScript */}
            </div>
            
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-heading">About Us</h2>
                    <p>Empowering careers through cutting-edge IT education with innovative solutions at Forum Information Academy.</p>
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
                    <h2 className="footer-heading">Quick Links</h2>
                    <ul>
                        <li><Link to="/" data-nav="home">Home</Link></li>
                        <li><Link to="/courses" data-nav="courses">Courses</Link></li>
                        <li><Link to="/about" data-nav="about">About Us</Link></li>
                        <li><Link to="/news" data-nav="news">News & Events</Link></li>
                        <li><Link to="/apply" data-nav="apply">Apply Now</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section contact">
                    <h2 className="footer-heading">Contact Us</h2>
                    <p><i className="fas fa-map-marker-alt"></i> 3-1-19 Benten, Chuo-ku, Niigata City <br/>Niigata Prefecture, Japan 950-0901</p>
                    <p><i className="fas fa-phone"></i> TEL: 025-247-6300 <br /> FAX: 025-247-6305</p>
                    <p><i className="fas fa-envelope"></i> <a href="https://www.forum.ac.jp/">https://www.forum.ac.jp/</a></p>
                    <p><i className="fas fa-clock"></i> Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
                
                <div className="footer-section newsletter">
                    <h2 className="footer-heading">Subscribe</h2>
                    <p>Subscribe to our newsletter to receive updates on our latest courses and special offers.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            
            <div className="copyright">
                <p>&copy; {currentYear} Forum Information Academy. All rights reserved.</p>
                <div className="footer-legal-links">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
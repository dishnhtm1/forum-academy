import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/ContactSection.css';

const ContactSection = () => {
    const { t } = useTranslation(); // Add this line only
    const sectionRef = useRef(null);

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
        
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section className="contact-section" id="contact" ref={sectionRef}>
            {/* Keep ALL shape animations exactly as is */}
            <div className="contact-shapes">
                <div className="contact-shape shape-1"></div>
                <div className="contact-shape shape-2"></div>
            </div>
            
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">{t('contactSection.header.badge')}</span>
                    <h2>{t('contactSection.header.title')}</h2>
                    <p className="section-subtitle">{t('contactSection.header.subtitle')}</p>
                </div>
                
                {/* Keep ALL structure and animations exactly as is */}
                <div className="contact-info-compact">
                    <div className="compact-card">
                        <div className="compact-info">
                            <div className="info-header-compact">
                                <div className="info-graphic-compact">
                                    <span className="material-icons">support_agent</span>
                                </div>
                                <div className="info-title">
                                    <h3>{t('contactSection.info.title')}</h3>
                                    <p>{t('contactSection.info.subtitle')}</p>
                                </div>
                            </div>
                            
                            <div className="info-contact-grid">
                                <div className="info-contact-item" data-type="location">
                                    <span className="material-icons">location_on</span>
                                    <div>
                                        <h4>{t('contactSection.contact.location.title')}</h4>
                                        <p>{t('contactSection.contact.location.address')}</p>
                                    </div>
                                </div>
                                
                                <div className="info-contact-item" data-type="phone">
                                    <span className="material-icons">phone</span>
                                    <div>
                                        <h4>{t('contactSection.contact.phone.title')}</h4>
                                        <p>
                                            <a href="tel:025-247-6300">025-247-6300</a> ({t('contactSection.contact.phone.tel')})<br />
                                            <a href="tel:025-247-6305">025-247-6305</a> ({t('contactSection.contact.phone.fax')})
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="info-contact-item" data-type="email">
                                    <span className="material-icons">email</span>
                                    <div>
                                        <h4>{t('contactSection.contact.website.title')}</h4>
                                        <p>
                                            <a href="https://www.forum.ac.jp/">https://www.forum.ac.jp/</a>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="info-contact-item" data-type="hours">
                                    <span className="material-icons">schedule</span>
                                    <div>
                                        <h4>{t('contactSection.contact.hours.title')}</h4>
                                        <p>{t('contactSection.contact.hours.time')}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="contact-social-row">
                                <div className="social-connect">
                                    <span>{t('contactSection.social.connect')}:</span>
                                    <div className="social-icons-compact">
                                        <a href="https://twitter.com/forumacademy" aria-label="Twitter">
                                            <span className="material-icons">alternate_email</span>
                                        </a>
                                        <a href="https://facebook.com/forumacademy" aria-label="Facebook">
                                            <span className="material-icons">facebook</span>
                                        </a>
                                        <a href="https://instagram.com/forumacademy" aria-label="Instagram">
                                            <span className="material-icons">photo_camera</span>
                                        </a>
                                        <a href="https://linkedin.com/company/forumacademy" aria-label="LinkedIn">
                                            <span className="material-icons">work</span>
                                        </a>
                                    </div>
                                </div>
                                <Link to="/contact" className="btn-contact-us">
                                    {t('contactSection.buttons.contactUs')}
                                    <span className="material-icons">arrow_forward</span>
                                </Link>
                            </div>
                        </div>

                        <div className="compact-map">
                            <div className="map-iframe-container">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.020979364653!2d139.05593607569955!3d37.912437971951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4c9908234a571%3A0xc204d9ebdf574ad4!2z44OV44Kq44O844Op44Og5oOF5aCx44Ki44Kr44OH44Of44O85bCC6ZaA5a2m5qCh!5e1!3m2!1sen!2sjp!4v1747807045557!5m2!1sen!2sjp" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t('contactSection.map.title')}
                                />
                            </div>
                            <a href="https://goo.gl/maps/8F5HVCFgEZj4TPUR7" className="btn-map-directions" target="_blank" rel="noopener noreferrer">
                                <span className="material-icons">directions</span>
                                <span>{t('contactSection.buttons.getDirections')}</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="faq-preview">
                    <h3>{t('contactSection.faq.title')}</h3>
                    <div className="faq-items">
                        <div className="faq-item">
                            <h4>{t('contactSection.faq.items.campusTour.question')}</h4>
                            <p>{t('contactSection.faq.items.campusTour.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h4>{t('contactSection.faq.items.deadlines.question')}</h4>
                            <p>{t('contactSection.faq.items.deadlines.answer')}</p>
                        </div>
                    </div>
                    <a href="/faq" className="btn-more-faq">{t('contactSection.buttons.viewAllFAQs')}</a>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
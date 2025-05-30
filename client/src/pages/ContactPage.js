import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/ContactPage.css';

const ContactPage = () => {
    const { t } = useTranslation(); // Add this line only
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // Keep ALL your existing state and form logic exactly as is
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false,
        message: '',
        loading: false
    });

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Keep ALL your existing useEffect and 3D animation code exactly as is
    useEffect(() => {
        setIsVisible(true);

        // Add 3D animation for cubes
        const createCubes = () => {
            const world = document.querySelector('.contact-world');
            if (!world) return;

            for (let i = 0; i < 12; i++) {
                const cube = document.createElement('div');
                cube.className = 'contact-cube';

                // Random position
                const x = (Math.random() - 0.5) * 1000;
                const y = (Math.random() - 0.5) * 1000;
                const z = (Math.random() - 0.5) * 1000;

                // Random size
                const size = Math.random() * 40 + 15;

                cube.style.width = `${size}px`;
                cube.style.height = `${size}px`;
                cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

                // Add faces
                ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
                    const el = document.createElement('div');
                    el.className = `contact-cube-face ${face}`;
                    cube.appendChild(el);
                });

                world.appendChild(cube);
            }

            // Create particles
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'contact-particle';

                // Random size and position
                const size = Math.random() * 6 + 2;
                const x = Math.random() * 100;
                const y = Math.random() * 100;

                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

                const particles = document.querySelector('.contact-particles');
                if (particles) {
                    particles.appendChild(particle);
                }
            }
        };

        createCubes();

        const heroContent = document.querySelector('.contact-hero-content');
        const contactItems = document.querySelectorAll('.contact-info-item');
        const formElement = document.querySelector('.contact-form-container');

        if (heroContent) {
            heroContent.classList.add('visible');
        }

        contactItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 200 * index);
        });

        if (formElement) {
            setTimeout(() => {
                formElement.classList.add('visible');
            }, 400);
        }

        // Clean up function
        return () => {
            const world = document.querySelector('.contact-world');
            if (world) {
                while (world.firstChild) {
                    world.removeChild(world.firstChild);
                }
            }

            const particles = document.querySelector('.contact-particles');
            if (particles) {
                while (particles.firstChild) {
                    particles.removeChild(particles.firstChild);
                }
            }
        };
    }, []);

    // Keep ALL your existing form handling exactly as is
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Set loading state
        setFormStatus({
            submitted: true,
            error: false,
            message: t('contact.form.messages.sending'),
            loading: true
        });
    
//        try {
//            const response = await fetch('http://localhost:5000/api/contact', {            
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json'
//                },
//                body: JSON.stringify(formData)
//            });
        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
         });
    
            const data = await response.json();
    
            if (response.ok) {
                setFormStatus({
                    submitted: true,
                    error: false,
                    message: t('contact.form.messages.success'),
                    loading: false
                });
                
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
    
                // Reset form status after 3 seconds
                setTimeout(() => {
                    setFormStatus({
                        submitted: false,
                        error: false,
                        message: '',
                        loading: false
                    });
                }, 3000);
            } else {
                throw new Error(data.message || t('contact.form.messages.error'));
            }
        } catch (error) {
            setFormStatus({
                submitted: true,
                error: true,
                message: error.message || t('contact.form.messages.error'),
                loading: false
            });
    
            // Clear error message after 3 seconds
            setTimeout(() => {
                setFormStatus({
                    submitted: false,
                    error: false,
                    message: '',
                    loading: false
                });
            }, 3000);
        }
    };

    return (
        <div className="contact-page">
            {/* Keep ALL your 3D hero structure - only replace text */}
            <section ref={sectionRef} className={`contact-hero ${isVisible ? 'visible' : ''}`}>
                {/* Keep ALL 3D Scene code exactly as is */}
                <div className="contact-scene">
                    <div className="contact-world">
                        <div className="contact-floor"></div>
                        {/* Cubes will be added by JavaScript */}
                    </div>

                    {/* Particles */}
                    <div className="contact-particles"></div>

                    {/* Glowing effects */}
                    <div className="contact-glow contact-glow-1"></div>
                    <div className="contact-glow contact-glow-2"></div>
                </div>

                <div className="container">
                    <div className="contact-hero-content">
                        <div className="contact-hero-badge">
                            <span className="contact-badge-icon material-icons">contact_mail</span>
                            {t('contact.hero.badge')}
                        </div>
                        <h1 className="contact-hero-title">{t('contact.hero.title')} <span className="contact-highlight-text">{t('contact.hero.highlight')}</span></h1>
                        <p className="contact-hero-description">
                            {t('contact.hero.description')}
                        </p>
                        <div className="contact-quick-links">
                            <a href="#form" className="contact-btn contact-btn-primary">
                                <span className="material-icons">edit</span>
                                {t('contact.hero.sendMessage')}
                            </a>
                            <a href="tel:0120-406-194" className="contact-btn contact-btn-outline">
                                <span className="material-icons">call</span>
                                {t('contact.hero.callUs')}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="contact-scroll-indicator">
                    <a href="#contact-main">
                        <span>{t('contact.hero.scrollToContact')}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>

            {/* Main Contact Section */}
            <section id="contact-main" className="contact-main">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>{t('contact.info.title')}</h2>
                            <p>{t('contact.info.description')}</p>

                            <div className="contact-info-items">
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">location_on</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>{t('contact.info.address.title')}</h3>
                                        <p>{t('contact.info.address.value')}</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">phone</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>{t('contact.info.phone.title')}</h3>
                                        <p>{t('contact.info.phone.general')}<br />{t('contact.info.phone.admissions')}</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">email</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>{t('contact.info.email.title')}</h3>
                                        <p>{t('contact.info.email.general')}<br />{t('contact.info.email.admissions')}</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">schedule</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>{t('contact.info.hours.title')}</h3>
                                        <p>{t('contact.info.hours.weekdays')}<br />{t('contact.info.hours.saturday')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links">
                                <h3>{t('contact.social.title')}</h3>
                                <div className="social-icons">
                                    <a href="https://twitter.com/forumacademy" className="social-icon" aria-label="Twitter">
                                        <span className="material-icons">alternate_email</span>
                                    </a>
                                    <a href="https://facebook.com/forumacademy" className="social-icon" aria-label="Facebook">
                                        <span className="material-icons">facebook</span>
                                    </a>
                                    <a href="https://instagram.com/forumacademy" className="social-icon" aria-label="Instagram">
                                        <span className="material-icons">photo_camera</span>
                                    </a>
                                    <a href="https://linkedin.com/company/forumacademy" className="social-icon" aria-label="LinkedIn">
                                        <span className="material-icons">work</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-container" id="form">
                            <div className="form-header">
                                <h2>{t('contact.form.title')}</h2>
                                <p>{t('contact.form.description')}</p>
                            </div>

                            {formStatus.submitted && (
                                <div className={`form-message ${formStatus.error ? 'error' : formStatus.loading ? 'loading' : 'success'}`}>
                                    <span className="material-icons">
                                        {formStatus.loading ? 'hourglass_empty' : formStatus.error ? 'error' : 'check_circle'}
                                    </span>
                                    <p>{formStatus.message}</p>
                                </div>
                            )}

                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder=" "
                                            style={{"--i": 1}}
                                        />
                                        <label htmlFor="name">{t('contact.form.fields.name')}</label>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder=" "
                                            style={{"--i": 2}}
                                        />
                                        <label htmlFor="email">{t('contact.form.fields.email')}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder=" "
                                            style={{"--i": 3}}
                                        />
                                        <label htmlFor="phone">{t('contact.form.fields.phone')}</label>
                                    </div>
                                    <div className="form-group">
                                        <select
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            style={{"--i": 4}}
                                        >
                                            <option value=""></option>
                                            <option value="general">{t('contact.form.subjects.general')}</option>
                                            <option value="admissions">{t('contact.form.subjects.admissions')}</option>
                                            <option value="courses">{t('contact.form.subjects.courses')}</option>
                                            <option value="careers">{t('contact.form.subjects.careers')}</option>
                                            <option value="other">{t('contact.form.subjects.other')}</option>
                                        </select>
                                        <label htmlFor="subject">{t('contact.form.fields.subject')}</label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <textarea
                                        id="message"
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        style={{"--i": 5}}
                                    ></textarea>
                                    <label htmlFor="message">{t('contact.form.fields.message')}</label>
                                </div>

                                <div className="form-group form-privacy">
                                    <input type="checkbox" id="privacy" required style={{"--i": 6}} />
                                    <label htmlFor="privacy">
                                        {t('contact.form.privacy.text')} <a href="/privacy" target="_blank" rel="noopener noreferrer">{t('contact.form.privacy.link')}</a> {t('contact.form.privacy.consent')}
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{"--i": 7}}>
                                    {t('contact.form.submit')}
                                    <span className="material-icons">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <div className="container">
                    <h2>{t('contact.map.title')}</h2>
                    <div className="map-container">
                        <iframe
                            title={t('contact.map.title')}
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5984.041958729306!2d139.05593607569955!3d37.912437971951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4c9908234a571%3A0xc204d9ebdf574ad4!2z44OV44Kq44O844Op44Og5oOF5aCx44Ki44Kr44OH44Of44O85bCC6ZaA5a2m5qCh!5e1!3m2!1sen!2sjp!4v1747801373059!5m2!1sen!2sjp"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2>{t('contact.faq.title')}</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>{t('contact.faq.items.response.question')}</h3>
                            <p>{t('contact.faq.items.response.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('contact.faq.items.tour.question')}</h3>
                            <p>{t('contact.faq.items.tour.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('contact.faq.items.virtual.question')}</h3>
                            <p>{t('contact.faq.items.virtual.answer')}</p>
                        </div>
                        <div className="faq-item">
                            <h3>{t('contact.faq.items.financial.question')}</h3>
                            <p>{t('contact.faq.items.financial.answer')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
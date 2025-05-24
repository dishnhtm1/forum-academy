import React, { useState, useEffect, useRef } from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // const [formStatus, setFormStatus] = useState({
    //     submitted: false,
    //     error: false,
    //     message: ''
    // });

    // Update the formStatus state to include more detailed status
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false,
        message: '',
        loading: false
    });

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Effect for animation visibility and 3D elements
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
            message: 'Sending your message...',
            loading: true
        });
    
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
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
                    message: 'Thank you! Your message has been sent successfully.',
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
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            setFormStatus({
                submitted: true,
                error: true,
                message: error.message || 'Failed to send message. Please try again.',
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
            {/* Enhanced 3D Hero Section */}
            <section ref={sectionRef} className={`contact-hero ${isVisible ? 'visible' : ''}`}>
                {/* 3D Scene */}
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
                            Connect with our team
                        </div>
                        <h1 className="contact-hero-title">Get In <span className="contact-highlight-text">Touch</span></h1>
                        <p className="contact-hero-description">
                            We're here to answer any questions about our programs, campus, or admissions process.
                            Reach out and let us help you start your journey in IT.
                        </p>
                        <div className="contact-quick-links">
                            <a href="#form" className="contact-btn contact-btn-primary">
                                <span className="material-icons">edit</span>
                                Send a Message
                            </a>
                            <a href="tel:0120-406-194" className="contact-btn contact-btn-outline">
                                <span className="material-icons">call</span>
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="contact-scroll-indicator">
                    <a href="#contact-main">
                        <span>Scroll to contact us</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>

            {/* Main Contact Section */}
            <section id="contact-main" className="contact-main">
                <div className="container">
                    <div className="contact-grid">
                        {/* Rest of your existing code... */}
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            <p>Reach out to us using any of the methods below or fill out the form. Our team is ready to assist you.</p>

                            <div className="contact-info-items">
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">location_on</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>Campus Address</h3>
                                        <p>3-1-19 Benten, Chuo-ku, Niigata City<br />Niigata Prefecture, Japan 950-0901</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">phone</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>Phone Numbers</h3>
                                        <p>General Inquiries: 0120-406-194<br />Admissions: TEL: 025-247-6300 / FAX: 025-247-6305</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">email</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>Email Addresses</h3>
                                        <p>General: shushoku@forum.ac.jp<br />Admissions: shushoku@forum.ac.jp</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <span className="material-icons">schedule</span>
                                    </div>
                                    <div className="contact-details">
                                        <h3>Office Hours</h3>
                                        <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 3:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links">
                                <h3>Connect With Us</h3>
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
                                <h2>Send Us a Message</h2>
                                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
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
                                        <label htmlFor="name">Full Name *</label>
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
                                        <label htmlFor="email">Email Address *</label>
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
                                        <label htmlFor="phone">Phone Number</label>
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
                                            <option value="general">General Inquiry</option>
                                            <option value="admissions">Admissions Question</option>
                                            <option value="courses">Course Information</option>
                                            <option value="careers">Career Services</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <label htmlFor="subject">Subject *</label>
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
                                    <label htmlFor="message">Message *</label>
                                </div>

                                <div className="form-group form-privacy">
                                    <input type="checkbox" id="privacy" required style={{"--i": 6}} />
                                    <label htmlFor="privacy">
                                        I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to Forum Information Academy processing my data.
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{"--i": 7}}>
                                    Send Message
                                    <span className="material-icons">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <div className="container">
                    <h2>Visit Our Campus</h2>
                    <div className="map-container">
                        <iframe
                            title="Forum Information Academy Campus Location"
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
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>How quickly will I receive a response?</h3>
                            <p>We strive to respond to all inquiries within 24-48 business hours. For urgent matters, please call our office directly.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I schedule a campus tour?</h3>
                            <p>Yes! We offer campus tours Monday through Friday. Please contact our admissions office to schedule a visit.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Do you have a virtual meeting option?</h3>
                            <p>Yes, we can arrange video calls for international students or those unable to visit in person.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How do I apply for financial assistance?</h3>
                            <p>Please contact our admissions team directly for information about scholarships, payment plans, and other financial options.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
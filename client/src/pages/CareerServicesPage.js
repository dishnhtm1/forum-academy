import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CareerServicesPage.css';

// Import partner logos
import microsoftLogo from '../assets/partners/microsoft.png';
import googleLogo from '../assets/partners/gmail.png';
import amazonLogo from '../assets/partners/amazon.png';
import nttLogo from '../assets/partners/ntt.png';
import mercariLogo from '../assets/partners/mercari.png';
import doccomoLogo from '../assets/partners/doccomo.png';
import yahooLogo from '../assets/partners/yahoo.png';
import suzukiLogo from '../assets/partners/suzuki.png';
import hondaLogo from '../assets/partners/honda.png';


function CareerServicesPage() {
    // Add animation when page loads
    useEffect(() => {
        // Handle FAQ toggles
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Toggle current item
                item.classList.toggle('active');
                const toggleIcon = item.querySelector('.toggle-icon');
                toggleIcon.textContent = item.classList.contains('active') ? 'close' : 'add';
            });
        });

        // Animate elements when they enter the viewport
        const animatedElements = document.querySelectorAll('.animate-entry');
        animatedElements.forEach((element) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(element);
        });

        // Counter animation
        const animateCounters = () => {
            const counters = document.querySelectorAll('.counter');
            
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const decimalPlaces = counter.textContent.includes('.') 
                    ? counter.textContent.split('.')[1].length 
                    : 0;
                    
                let count = 0;
                const increment = target / 40; // Divide by number of frames
                
                const updateCounter = () => {
                    if (count < target) {
                        count += increment;
                        if (count > target) count = target;
                        
                        counter.textContent = count.toFixed(decimalPlaces);
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                // Start animation when element is visible
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(counter);
            });
        };
        
        // Delayed animation for stats
        const animateDelayed = () => {
            const delayedElements = document.querySelectorAll('[data-delay]');
            
            delayedElements.forEach(element => {
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    
                    observer.observe(element);
                }, delay);
            });
        };
        
        animateCounters();
        animateDelayed();
    }, []);

    return (
        <div className="career-services-page">
            {/* Hero Section - Updated Design */}
            <section className="career-hero">
                <div className="hero-background">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-dots"></div>
                </div>
                
                <div className="container">
                    <div className="career-hero-content">
                        <div className="hero-badge animate-entry">
                            <span className="material-icons">rocket_launch</span>
                            <span>93% Employment Success Rate</span>
                        </div>
                        
                        <h1 className="animate-entry">Launch Your <span className="highlight-text">Tech Career</span></h1>
                        
                        <p className="subtitle animate-entry">
                            Our dedicated career services team helps you transition 
                            from student to industry professional with personalized support.
                        </p>
                        
                        <div className="hero-actions animate-entry">
                            <Link to="/apply" className="btn btn-primary">
                                Apply Now
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                            
                            <Link to="/contact" className="btn btn-outline">
                                Talk to an Advisor
                            </Link>
                        </div>

                        <div className="hero-companies animate-entry">
                            <p>Our graduates work at:</p>
                            <div className="company-logos">
                                <img src={microsoftLogo} alt="Microsoft" />
                                <img src={googleLogo} alt="Google" />
                                <img src={amazonLogo} alt="Amazon" />
                                <img src={nttLogo} alt="NTT" />
                                <img src={mercariLogo} alt="Mercari" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="career-stats">
                    <div className="container">
                        <div className="stats-grid">
                            <div className="stat-card animate-entry" data-delay="0">
                                <div className="stat-number"><span className="counter" data-target="93">0</span>%</div>
                                <div className="stat-label">Employment Rate</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="100">
                                <div className="stat-number">¥<span className="counter" data-target="4.2">0</span>M</div>
                                <div className="stat-label">Average Starting Salary</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="200">
                                <div className="stat-number"><span className="counter" data-target="200">0</span>+</div>
                                <div className="stat-label">Hiring Partners</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="300">
                                <div className="stat-number"><span className="counter" data-target="14">0</span>+</div>
                                <div className="stat-label">Career Events Annually</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Support Section */}
            <section className="career-support-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>Comprehensive Career Support</h2>
                        <p>We provide end-to-end career support to ensure your successful transition into the tech industry.</p>
                    </div>

                    <div className="support-grid">
                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">assignment_ind</span>
                            </div>
                            <h3>Resume Building</h3>
                            <p>Craft a tech-focused resume that highlights your skills and projects to catch recruiters' attention.</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">record_voice_over</span>
                            </div>
                            <h3>Interview Preparation</h3>
                            <p>Practice technical interviews, whiteboard challenges, and behavioral questions with industry experts.</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">handshake</span>
                            </div>
                            <h3>Networking Events</h3>
                            <p>Connect with hiring partners and industry professionals at exclusive networking events and job fairs.</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">work</span>
                            </div>
                            <h3>Job Placement</h3>
                            <p>Access our network of hiring partners and receive personalized job matching services.</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">public</span>
                            </div>
                            <h3>Global Opportunities</h3>
                            <p>Explore international career paths with our global network of tech companies and startups.</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">trending_up</span>
                            </div>
                            <h3>Career Advancement</h3>
                            <p>Receive ongoing support and resources for continued professional growth after placement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Journey Section */}
            <section className="career-journey-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>Your Career Journey</h2>
                        <p>Our structured approach ensures you're fully prepared for the tech job market.</p>
                    </div>

                    <div className="journey-timeline">
                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">1</div>
                            <div className="timeline-content">
                                <h3>Career Assessment</h3>
                                <p>We start by understanding your career goals, strengths, and preferences to create a personalized career plan.</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">2</div>
                            <div className="timeline-content">
                                <h3>Skills Development</h3>
                                <p>Alongside your technical training, we help develop essential soft skills valued by employers.</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">3</div>
                            <div className="timeline-content">
                                <h3>Portfolio Review</h3>
                                <p>Our industry experts review and help polish your project portfolio to showcase your best work.</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">4</div>
                            <div className="timeline-content">
                                <h3>Interview Training</h3>
                                <p>Practice technical and behavioral interviews with personalized feedback and improvement strategies.</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">5</div>
                            <div className="timeline-content">
                                <h3>Job Matching</h3>
                                <p>We connect you with opportunities that match your skills and career aspirations from our partner network.</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">6</div>
                            <div className="timeline-content">
                                <h3>Ongoing Support</h3>
                                <p>Our support doesn't end at placement—we provide continued guidance as you grow in your tech career.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hiring Partners Section */}
            <section className="hiring-partners-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>Our Hiring Partners</h2>
                        <p>We've built strong relationships with leading tech companies who regularly hire our graduates.</p>
                    </div>

                    <div className="partners-grid">
                        <div className="partner-logo animate-entry">
                            <img src={microsoftLogo} alt="Microsoft" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={googleLogo} alt="Google" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={amazonLogo} alt="Amazon" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={suzukiLogo} alt="Suzuki" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={yahooLogo} alt="Yahoo" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={mercariLogo} alt="Mercari" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={nttLogo} alt="NTT" />
                        </div>
                        <div className="partner-logo animate-entry">
                            <img src={hondaLogo} alt="Honda" />
                        </div>
                    </div>

                    <div className="partners-cta animate-entry">
                        <Link to="/partners" className="btn btn-secondary">View All Partners</Link>
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="success-stories-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>Graduate Success Stories</h2>
                        <p>Our alumni have secured positions at some of the world's most innovative companies.</p>
                    </div>

                    <div className="stories-grid">
                        <div className="story-card animate-entry">
                            <div className="story-image">
                                {/* <img src={graduate1Image} alt="Taro Yamada" /> */}
                                <div className="company-badge">
                                    <img src={googleLogo} alt="Google" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>Taro Yamada</h3>
                                <p className="story-role">Software Engineer at Google</p>
                                <p className="story-quote">"The career support at FIA was instrumental in helping me land my dream job at Google. Their interview preparation was spot-on."</p>
                            </div>
                        </div>

                        <div className="story-card animate-entry">
                            <div className="story-image">
                                <img src="/images/graduates/graduate2.jpg" alt="Hanako Sato" />
                                <div className="company-badge">
                                    <img src={yahooLogo} alt="Yahoo" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>Hanako Sato</h3>
                                <p className="story-role">Full-Stack Developer at Mercari</p>
                                <p className="story-quote">"FIA's networking events connected me directly with Mercari's recruiting team. Three weeks after graduation, I had multiple offers."</p>
                            </div>
                        </div>

                        <div className="story-card animate-entry">
                            <div className="story-image">
                                <img src="" alt="Michael Chen" />
                                <div className="company-badge">
                                    <img src={amazonLogo} alt="Amazon" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>Michael Chen</h3>
                                <p className="story-role">Data Scientist at Amazon</p>
                                <p className="story-quote">"The personalized career coaching helped me reframe my previous experience for tech roles. Forever grateful for FIA's support."</p>
                            </div>
                        </div>
                    </div>

                    <div className="stories-cta animate-entry">
                        <Link to="/testimonials" className="btn btn-secondary">More Success Stories</Link>
                    </div>
                </div>
            </section>

            {/* Career FAQ Section */}
            <section className="career-faq-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>Career Services FAQ</h2>
                        <p>Answers to commonly asked questions about our career support programs.</p>
                    </div>

                    <div className="faq-container">
                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>When does career support begin?</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>Career support begins from day one of your program. We integrate career readiness throughout the curriculum, with dedicated career service intensives in the later stages of your training.</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>How long do I have access to career services?</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>Graduates receive unlimited career support for 12 months after graduation. After that, you'll join our alumni network with access to exclusive events and opportunities.</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>Do you guarantee job placement?</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>While we don't guarantee placement, our 93% employment rate within 6 months of graduation speaks to the effectiveness of our career services. Our team works tirelessly to connect you with opportunities that match your skills.</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>Can I get help with visa sponsorship for international roles?</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>Yes, we have experience helping graduates secure roles with visa sponsorship. We maintain relationships with companies that are open to sponsoring qualified international candidates.</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>What if I'm interested in freelancing or entrepreneurship?</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>Our career services team also supports graduates interested in freelancing or launching startups. We offer specialized guidance on building a client base, setting rates, and establishing your business.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CareerServicesPage;
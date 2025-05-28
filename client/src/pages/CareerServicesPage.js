import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import only
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

import png1Image from '../assets/images/png9.jpg';
import png2Image from '../assets/images/png20.jpg';
import png3Image from '../assets/images/png1.jpg';
// ...existing imports...

function CareerServicesPage() {
    const { t } = useTranslation(); // Add this line only
    
    // Keep ALL your existing animation code exactly as is
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
                            <span>{t('careerServicesPage.hero.badge')}</span>
                        </div>
                        
                        <h1 className="animate-entry">
                            {t('careerServicesPage.hero.title.part1')} <span className="highlight-text">{t('careerServicesPage.hero.title.highlight')}</span>
                        </h1>
                        
                        <p className="subtitle animate-entry">
                            {t('careerServicesPage.hero.subtitle')}
                        </p>
                        
                        <div className="hero-actions animate-entry">
                            <Link to="/apply" className="btn btn-primary">
                                {t('careerServicesPage.hero.buttons.applyNow')}
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                            
                            <Link to="/contact" className="btn btn-outline">
                                {t('careerServicesPage.hero.buttons.talkToAdvisor')}
                            </Link>
                        </div>

                        <div className="hero-companies animate-entry">
                            <p>{t('careerServicesPage.hero.graduatesWorkAt')}:</p>
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
                                <div className="stat-label">{t('careerServicesPage.stats.employmentRate')}</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="100">
                                <div className="stat-number">¥<span className="counter" data-target="4.2">0</span>M</div>
                                <div className="stat-label">{t('careerServicesPage.stats.averageSalary')}</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="200">
                                <div className="stat-number"><span className="counter" data-target="200">0</span>+</div>
                                <div className="stat-label">{t('careerServicesPage.stats.hiringPartners')}</div>
                            </div>
                            
                            <div className="stat-card animate-entry" data-delay="300">
                                <div className="stat-number"><span className="counter" data-target="14">0</span>+</div>
                                <div className="stat-label">{t('careerServicesPage.stats.careerEvents')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Support Section */}
            <section className="career-support-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>{t('careerServicesPage.careerSupport.title')}</h2>
                        <p>{t('careerServicesPage.careerSupport.subtitle')}</p>
                    </div>

                    <div className="support-grid">
                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">assignment_ind</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.resumeBuilding.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.resumeBuilding.description')}</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">record_voice_over</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.interviewPrep.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.interviewPrep.description')}</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">handshake</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.networkingEvents.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.networkingEvents.description')}</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">work</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.jobPlacement.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.jobPlacement.description')}</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">public</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.globalOpportunities.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.globalOpportunities.description')}</p>
                        </div>

                        <div className="support-card animate-entry">
                            <div className="card-icon">
                                <span className="material-icons">trending_up</span>
                            </div>
                            <h3>{t('careerServicesPage.careerSupport.services.careerAdvancement.title')}</h3>
                            <p>{t('careerServicesPage.careerSupport.services.careerAdvancement.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Journey Section */}
            <section className="career-journey-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>{t('careerServicesPage.careerJourney.title')}</h2>
                        <p>{t('careerServicesPage.careerJourney.subtitle')}</p>
                    </div>

                    <div className="journey-timeline">
                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">1</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.assessment.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.assessment.description')}</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">2</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.skillsDevelopment.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.skillsDevelopment.description')}</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">3</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.portfolioReview.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.portfolioReview.description')}</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">4</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.interviewTraining.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.interviewTraining.description')}</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">5</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.jobMatching.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.jobMatching.description')}</p>
                            </div>
                        </div>

                        <div className="timeline-item animate-entry">
                            <div className="timeline-marker">6</div>
                            <div className="timeline-content">
                                <h3>{t('careerServicesPage.careerJourney.steps.ongoingSupport.title')}</h3>
                                <p>{t('careerServicesPage.careerJourney.steps.ongoingSupport.description')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hiring Partners Section */}
            <section className="hiring-partners-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>{t('careerServicesPage.hiringPartners.title')}</h2>
                        <p>{t('careerServicesPage.hiringPartners.subtitle')}</p>
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
                        <Link to="/partners" className="btn btn-secondary">{t('careerServicesPage.hiringPartners.viewAllButton')}</Link>
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="success-stories-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>{t('careerServicesPage.successStories.title')}</h2>
                        <p>{t('careerServicesPage.successStories.subtitle')}</p>
                    </div>

                    <div className="stories-grid">
                        <div className="story-card animate-entry">
                            <div className="story-image">
                                <img src={png1Image} alt="Taro Yamada" />
                                <div className="company-badge">
                                    <img src={googleLogo} alt="Google" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>{t('careerServicesPage.successStories.stories.taroYamada.name')}</h3>
                                <p className="story-role">{t('careerServicesPage.successStories.stories.taroYamada.role')}</p>
                                <p className="story-quote">"{t('careerServicesPage.successStories.stories.taroYamada.quote')}"</p>
                            </div>
                        </div>

                        <div className="story-card animate-entry">
                            <div className="story-image">
                                <img src={png2Image} alt="Hanako Sato" />
                                <div className="company-badge">
                                    <img src={yahooLogo} alt="Yahoo" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>{t('careerServicesPage.successStories.stories.hanakoSato.name')}</h3>
                                <p className="story-role">{t('careerServicesPage.successStories.stories.hanakoSato.role')}</p>
                                <p className="story-quote">"{t('careerServicesPage.successStories.stories.hanakoSato.quote')}"</p>
                            </div>
                        </div>

                        <div className="story-card animate-entry">
                            <div className="story-image">
                                <img src={png3Image} alt="Michael Chen" />
                                <div className="company-badge">
                                    <img src={amazonLogo} alt="Amazon" />
                                </div>
                            </div>
                            <div className="story-content">
                                <h3>{t('careerServicesPage.successStories.stories.michaelChen.name')}</h3>
                                <p className="story-role">{t('careerServicesPage.successStories.stories.michaelChen.role')}</p>
                                <p className="story-quote">"{t('careerServicesPage.successStories.stories.michaelChen.quote')}"</p>
                            </div>
                        </div>
                    </div>

                    <div className="stories-cta animate-entry">
                        <Link to="/testimonials" className="btn btn-secondary">{t('careerServicesPage.successStories.moreStoriesButton')}</Link>
                    </div>
                </div>
            </section>

            {/* Career FAQ Section */}
            <section className="career-faq-section">
                <div className="container">
                    <div className="section-header animate-entry">
                        <h2>{t('careerServicesPage.faq.title')}</h2>
                        <p>{t('careerServicesPage.faq.subtitle')}</p>
                    </div>

                    <div className="faq-container">
                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>{t('careerServicesPage.faq.items.whenBegins.question')}</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>{t('careerServicesPage.faq.items.whenBegins.answer')}</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>{t('careerServicesPage.faq.items.accessDuration.question')}</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>{t('careerServicesPage.faq.items.accessDuration.answer')}</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>{t('careerServicesPage.faq.items.jobGuarantee.question')}</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>{t('careerServicesPage.faq.items.jobGuarantee.answer')}</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>{t('careerServicesPage.faq.items.visaSponsorship.question')}</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>{t('careerServicesPage.faq.items.visaSponsorship.answer')}</p>
                            </div>
                        </div>

                        <div className="faq-item animate-entry">
                            <div className="faq-question">
                                <h3>{t('careerServicesPage.faq.items.freelancing.question')}</h3>
                                <span className="material-icons toggle-icon">add</span>
                            </div>
                            <div className="faq-answer">
                                <p>{t('careerServicesPage.faq.items.freelancing.answer')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CareerServicesPage;
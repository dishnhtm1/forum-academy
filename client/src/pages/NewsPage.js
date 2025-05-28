import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/NewsPage.css';

import data1Video from '../assets/videos/vid1.mp4';
import data2Video from '../assets/videos/vid2.mp4';
import data3Video from '../assets/videos/vid3.mp4';
import data4Video from '../assets/videos/vid4.mp4';
import data5Video from '../assets/videos/vid5.mp4';
import data6Video from '../assets/videos/vid6.mp4';

const NewsPage = () => {
    const { t } = useTranslation(); // Add this line only
    // State to track which category is active
    const [activeCategory, setActiveCategory] = useState('all');
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [loadedVideos, setLoadedVideos] = useState({});
    const heroRef = useRef(null);
    
    // Keep ALL your existing animation code exactly as is
    useEffect(() => {
        // Make hero visible with animation
        setIsHeroVisible(true);
        
        // Initialize the animated background elements
        createBackgroundElements();
        
        // Animate news items
        const newsItems = document.querySelectorAll('.news-item');
        newsItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 100 * index);
        });
        
        // Cleanup function to remove particles when component unmounts
        return () => {
            const particles = document.querySelector('.news-particles');
            if (particles) {
                while (particles.firstChild) {
                    particles.removeChild(particles.firstChild);
                }
            }
        };
    }, []);
    
    // Keep ALL your particle creation code exactly as is
    const createBackgroundElements = () => {
        const particles = document.querySelector('.news-particles');
        if (!particles) return;
        
        // Clear existing particles
        while (particles.firstChild) {
            particles.removeChild(particles.firstChild);
        }
        
        // Create floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'news-particle';
            
            // Random size and position
            const size = Math.random() * 8 + 4;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            
            particles.appendChild(particle);
        }
        
        // Create floating news icons
        const iconTypes = ['event_note', 'announcement', 'celebration', 'campaign'];
        
        for (let i = 0; i < 6; i++) {
            const newsIcon = document.createElement('div');
            newsIcon.className = 'floating-news-icon';
            
            // Random position on screen
            const x = (Math.random() * 80) + 10;
            const y = (Math.random() * 70) + 10;
            const delay = Math.random() * 3;
            
            newsIcon.style.left = `${x}%`;
            newsIcon.style.top = `${y}%`;
            newsIcon.style.animationDelay = `${delay}s`;
            
            // Add random icon
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = iconTypes[Math.floor(Math.random() * iconTypes.length)];
            newsIcon.appendChild(icon);
            
            particles.appendChild(newsIcon);
        }
    };

    // Keep ALL your video loading code exactly as is
    const handleVideoLoad = (id) => {
        setLoadedVideos(prev => ({...prev, [id]: true}));
    };

    // Keep your news data structure - only replace text values
    const newsItems = [
        {
            id: 1,
            date: t('newsPage.items.techSymposium.date'),
            title: t('newsPage.items.techSymposium.title'),
            excerpt: t('newsPage.items.techSymposium.excerpt'),
            videoSrc: data1Video,
            fullContent: "/news/tech-symposium",
            category: "events"
        },
        {
            id: 2,
            date: t('newsPage.items.industryPartnership.date'),
            title: t('newsPage.items.industryPartnership.title'),
            excerpt: t('newsPage.items.industryPartnership.excerpt'),
            videoSrc: data2Video,
            fullContent: "/news/industry-partnership",
            category: "announcements"
        },
        {
            id: 3,
            date: t('newsPage.items.springOpenHouse.date'),
            title: t('newsPage.items.springOpenHouse.title'),
            excerpt: t('newsPage.items.springOpenHouse.excerpt'),
            videoSrc: data3Video,
            fullContent: "/news/spring-open-house",
            category: "events"
        },
        {
            id: 4,
            date: t('newsPage.items.hackathonWinners.date'),
            title: t('newsPage.items.hackathonWinners.title'),
            excerpt: t('newsPage.items.hackathonWinners.excerpt'),
            videoSrc: data4Video,
            fullContent: "/news/hackathon-winners",
            category: "achievements"
        },
        {
            id: 5,
            date: t('newsPage.items.quantumCourse.date'),
            title: t('newsPage.items.quantumCourse.title'),
            excerpt: t('newsPage.items.quantumCourse.excerpt'),
            videoSrc: data5Video,
            fullContent: "/news/quantum-computing-course",
            category: "announcements"
        },
        {
            id: 6,
            date: t('newsPage.items.aiEthicsLecture.date'),
            title: t('newsPage.items.aiEthicsLecture.title'),
            excerpt: t('newsPage.items.aiEthicsLecture.excerpt'),
            videoSrc: data6Video,
            fullContent: "/news/ai-ethics-lecture",
            category: "events"
        }
    ];

    // Keep ALL your filtering logic exactly as is
    const filterNews = (category) => {
        setActiveCategory(category);
    };

    // Get filtered news items
    const filteredNews = activeCategory === 'all' 
        ? newsItems 
        : newsItems.filter(item => item.category === activeCategory);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Handle search functionality
        console.log("Search submitted");
    };

    // Get section title based on active category
    const getSectionTitle = () => {
        switch(activeCategory) {
            case 'events': return t('newsPage.sectionTitles.events');
            case 'announcements': return t('newsPage.sectionTitles.announcements');
            case 'achievements': return t('newsPage.sectionTitles.achievements');
            default: return t('newsPage.sectionTitles.all');
        }
    };

    // Get category label
    const getCategoryLabel = (category) => {
        switch(category) {
            case 'events': return t('newsPage.categoryLabels.event');
            case 'announcements': return t('newsPage.categoryLabels.announcement');
            case 'achievements': return t('newsPage.categoryLabels.achievement');
            default: return '';
        }
    };

    return (
        <div className="news-page">
            {/* Enhanced Hero section - Keep ALL animations exactly as is */}
            <section 
                ref={heroRef} 
                className={`news-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                {/* Animated background */}
                <div className="news-hero-bg">
                    <div className="news-particles"></div>
                    <div className="news-glow news-glow-1"></div>
                    <div className="news-glow news-glow-2"></div>
                </div>
                
                <div className="container">
                    <div className="news-hero-content">
                        <div className="news-hero-badge">
                            <span className="material-icons">campaign</span>
                            {t('newsPage.hero.badge')}
                        </div>
                        
                        <h1 className="animated-heading">
                            {t('newsPage.hero.title.part1')} <span className="highlight-text">{t('newsPage.hero.title.highlight')}</span>
                        </h1>
                        
                        <p className="news-hero-description">
                            {t('newsPage.hero.description')}
                        </p>
                        
                        {/* Search bar */}
                        <div className="news-search-container">
                            <form onSubmit={handleSearchSubmit} className="news-search-form">
                                <input 
                                    type="text" 
                                    placeholder={t('newsPage.hero.searchPlaceholder')}
                                    className="news-search-input"
                                />
                                <button type="submit" className="news-search-btn">
                                    <span className="material-icons">search</span>
                                </button>
                            </form>
                            
                            <div className="trending-topics">
                                <span className="trending-label">{t('newsPage.hero.trending.label')}:</span>
                                <div className="trending-tags">
                                    <a href="#tech-symposium" className="trending-tag">{t('newsPage.hero.trending.tags.techSymposium')}</a>
                                    <a href="#hackathon" className="trending-tag">{t('newsPage.hero.trending.tags.hackathon')}</a>
                                    <a href="#new-courses" className="trending-tag">{t('newsPage.hero.trending.tags.newCourses')}</a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick stats */}
                        <div className="news-stats">
                            <div className="news-stat">
                                <div className="news-stat-number">25+</div>
                                <div className="news-stat-label">{t('newsPage.hero.stats.upcomingEvents')}</div>
                            </div>
                            <div className="news-stat">
                                <div className="news-stat-number">12</div>
                                <div className="news-stat-label">{t('newsPage.hero.stats.recentAnnouncements')}</div>
                            </div>
                            <div className="news-stat">
                                <div className="news-stat-number">8</div>
                                <div className="news-stat-label">{t('newsPage.hero.stats.studentAchievements')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <a href="#news-filters">
                        <span>{t('newsPage.hero.scrollIndicator')}</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Filter categories */}
            <section id="news-filters" className="news-page-filters">
                <div className="container">
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => filterNews('all')}
                        >
                            <span className="material-icons">view_list</span>
                            {t('newsPage.filters.all')}
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'events' ? 'active' : ''}`}
                            onClick={() => filterNews('events')}
                        >
                            <span className="material-icons">event</span>
                            {t('newsPage.filters.events')}
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'announcements' ? 'active' : ''}`}
                            onClick={() => filterNews('announcements')}
                        >
                            <span className="material-icons">campaign</span>
                            {t('newsPage.filters.announcements')}
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'achievements' ? 'active' : ''}`}
                            onClick={() => filterNews('achievements')}
                        >
                            <span className="material-icons">emoji_events</span>
                            {t('newsPage.filters.achievements')}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Featured news */}
            <section className="featured-news">
                <div className="container">
                    <div className="featured-news-item">
                        <div className="featured-news-image">
                            <video autoPlay muted loop>
                                <source src={data2Video} type="video/mp4" />
                                {t('newsPage.videoNotSupported')}
                            </video>
                            <div className="featured-tag">
                                <span className="material-icons">star</span>
                                {t('newsPage.featured.tag')}
                            </div>
                        </div>
                        <div className="featured-news-content">
                            <div className="news-meta">
                                <span className="news-category events">
                                    <span className="material-icons">event</span>
                                    {t('newsPage.categoryLabels.event')}
                                </span>
                                <span className="news-date">{t('newsPage.items.techSymposium.date')}</span>
                            </div>
                            <h2 className="featured-news-title">{t('newsPage.featured.title')}</h2>
                            <p className="featured-news-excerpt">
                                {t('newsPage.featured.excerpt')}
                            </p>
                            <div className="news-cta">
                                <a href="/news/tech-symposium" className="btn btn-primary">
                                    <span className="material-icons">read_more</span>
                                    {t('newsPage.buttons.learnMore')}
                                </a>
                                <a href="/events/register" className="btn btn-outline">
                                    <span className="material-icons">how_to_reg</span>
                                    {t('newsPage.buttons.registerNow')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* News grid */}
            <section className="main-news-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {getSectionTitle()}
                        </h2>
                        <p className="section-subtitle">
                            {filteredNews.length} {filteredNews.length === 1 ? t('newsPage.itemCount.singular') : t('newsPage.itemCount.plural')}
                        </p>
                    </div>
                    
                    <div className="news-grid">
                        {filteredNews.map((item, index) => (
                            <div 
                                key={item.id}
                                className="news-item"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="news-img">
                                    {item.videoSrc ? (
                                        <>
                                            {!loadedVideos[item.id] && (
                                                <div className="news-placeholder">
                                                    <div className="loading-spinner"></div>
                                                    <span>{t('newsPage.loading')}</span>
                                                </div>
                                            )}
                                            <video 
                                                controls 
                                                autoPlay 
                                                muted 
                                                loop
                                                onLoadedData={() => handleVideoLoad(item.id)}
                                                style={{opacity: loadedVideos[item.id] ? 1 : 0}}
                                            >
                                                <source src={item.videoSrc} type="video/mp4" />
                                                {t('newsPage.videoNotSupported')}
                                            </video>
                                        </>
                                    ) : (
                                        <img src={item.imageSrc} alt={item.title} />
                                    )}
                                </div>
                                <div className="news-content">
                                    <div className="news-meta">
                                        <span className={`news-category ${item.category}`}>
                                            <span className="material-icons">
                                                {item.category === 'events' ? 'event' : 
                                                 item.category === 'announcements' ? 'campaign' : 
                                                 'emoji_events'}
                                            </span>
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        <span className="news-date">{item.date}</span>
                                    </div>
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-excerpt">{item.excerpt}</p>
                                    <a href={item.fullContent} className="btn btn-outline">
                                        <span className="material-icons">read_more</span>
                                        {t('newsPage.buttons.readMore')}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Show message if no items found */}
                    {filteredNews.length === 0 && (
                        <div className="no-results">
                            <span className="material-icons">search_off</span>
                            <h3>{t('newsPage.noResults.title')} {activeCategory === 'all' ? t('newsPage.noResults.items') : getCategoryLabel(activeCategory)}</h3>
                            <p>{t('newsPage.noResults.description')}</p>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {filteredNews.length > 0 && (
                        <div className="pagination">
                            <button className="pagination-btn">
                                <span className="material-icons">chevron_left</span>
                            </button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn">
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NewsPage;
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/NewsSection.css'; 
import data1Video from '../assets/videos/vid1.mp4';
import data2Video from '../assets/videos/vid2.mp4';
import data3Video from '../assets/videos/vid3.mp4';
import data4Video from '../assets/videos/vid4.mp4';
import data5Video from '../assets/videos/vid5.mp4';
import data6Video from '../assets/videos/vid6.mp4';

const NewsSection = () => {
    const { t } = useTranslation(); // Add this line only
    const [filter, setFilter] = useState('all');
    const [loadedVideos, setLoadedVideos] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Keep ALL your existing intersection observer animation code exactly as is
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleVideoLoad = (id) => {
        setLoadedVideos(prev => ({...prev, [id]: true}));
    };

    // Keep ALL your existing data structure - only replace text values
    const newsItems = [
        {
            id: 1,
            date: t('newsSection.items.techSymposium.date'),
            title: t('newsSection.items.techSymposium.title'),
            excerpt: t('newsSection.items.techSymposium.excerpt'),
            videoSrc: data1Video,
            fullContent: "/news/tech-symposium",
            category: "event"
        },
        {
            id: 2,
            date: t('newsSection.items.industryPartnership.date'),
            title: t('newsSection.items.industryPartnership.title'),
            excerpt: t('newsSection.items.industryPartnership.excerpt'),
            videoSrc: data2Video,
            fullContent: "/news/industry-partnership",
            category: "news"
        },
        {
            id: 3,
            date: t('newsSection.items.springOpenHouse.date'),
            title: t('newsSection.items.springOpenHouse.title'),
            excerpt: t('newsSection.items.springOpenHouse.excerpt'),
            videoSrc: data3Video,
            fullContent: "/news/spring-open-house",
            category: "event"
        },
        {
            id: 4,
            date: t('newsSection.items.studentAwards.date'),
            title: t('newsSection.items.studentAwards.title'),
            excerpt: t('newsSection.items.studentAwards.excerpt'),
            videoSrc: data4Video,
            fullContent: "/news/student-awards",
            category: "news"
        },
        {
            id: 5,
            date: t('newsSection.items.careerFair.date'),
            title: t('newsSection.items.careerFair.title'),
            excerpt: t('newsSection.items.careerFair.excerpt'),
            videoSrc: data5Video,
            fullContent: "/news/career-fair",
            category: "event"
        },
        {
            id: 6,
            date: t('newsSection.items.aiLab.date'),
            title: t('newsSection.items.aiLab.title'),
            excerpt: t('newsSection.items.aiLab.excerpt'),
            videoSrc: data6Video,
            fullContent: "/news/ai-lab",
            category: "news"
        }
    ];

    // Keep ALL your existing filtering logic exactly as is
    const filteredNews = filter === 'all' 
        ? newsItems 
        : newsItems.filter(item => item.category === filter);

    // Keep ALL your existing animation delay function exactly as is
    const getAnimationDelay = (index) => {
        return `${index * 0.1}s`;
    };

    return (
        <section className="news-events" id="news" ref={sectionRef}>
            <div className="container">
                <div className="section-header"> 
                    <h2>{t('newsSection.header.title')}</h2>
                    <p>{t('newsSection.header.subtitle')}</p>
                </div>
                
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                        onClick={() => setFilter('all')}
                    >
                        {t('newsSection.filters.all')}
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'news' ? 'active' : ''}`} 
                        onClick={() => setFilter('news')}
                    >
                        {t('newsSection.filters.news')}
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'event' ? 'active' : ''}`} 
                        onClick={() => setFilter('event')}
                    >
                        {t('newsSection.filters.events')}
                    </button>
                </div>
                
                <div className="news-grid">
                    {filteredNews.map((item, index) => (
                        <div 
                            className="news-item" 
                            key={item.id} 
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: `all 0.6s ease ${getAnimationDelay(index)}`
                            }}
                        >
                            <div className="news-img">
                                {!loadedVideos[item.id] && (
                                    <div className="video-placeholder">
                                        <div className="loading-spinner"></div>
                                        {t('newsSection.loading')}
                                    </div>
                                )}
                                <video 
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    className="news-video"
                                    onLoadedData={() => handleVideoLoad(item.id)}
                                    style={{opacity: loadedVideos[item.id] ? 1 : 0}}
                                >
                                    <source src={item.videoSrc} type="video/mp4" />
                                    {t('newsSection.videoNotSupported')}
                                </video>
                            </div>
                            <div className="news-content">
                                <div className="news-meta">
                                    <span className="news-date">{item.date}</span>
                                    <span className="news-category">
                                        {item.category === 'event' ? t('newsSection.categoryLabels.event') : t('newsSection.categoryLabels.news')}
                                    </span>
                                </div>
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-excerpt">{item.excerpt}</p>
                                <a href={item.fullContent} className="btn btn-outline">
                                    {t('newsSection.buttons.readMore')}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-4">
                    <a href="/news" className="btn btn-primary">{t('newsSection.buttons.viewAllNews')}</a>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
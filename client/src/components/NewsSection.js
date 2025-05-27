import React, { useState, useEffect, useRef } from 'react';
import '../styles/NewsSection.css'; 

const NewsSection = () => {
    const [filter, setFilter] = useState('all');
    const [loadedVideos, setLoadedVideos] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Intersection Observer for animations
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

    const newsItems = [
        {
            id: 1,
            date: "May 10, 2025",
            title: "Annual Tech Symposium",
            excerpt: "Join us for our annual technology symposium featuring industry speakers, workshop sessions, and networking opportunities.",
            videoSrc: "videos/data2.mp4",
            fullContent: "/news/tech-symposium",
            category: "event"
        },
        {
            id: 2,
            date: "April 28, 2025",
            title: "New Industry Partnership",
            excerpt: "We're excited to announce our new partnership with SoftTech Inc. to provide exclusive internship opportunities for our students.",
            videoSrc: "videos/data1.mp4",
            fullContent: "/news/industry-partnership",
            category: "news"
        },
        {
            id: 3,
            date: "May 22, 2025",
            title: "Spring Open House",
            excerpt: "Visit our campus to learn about our programs, meet instructors, and explore our facilities during our Spring Open House event.",
            videoSrc: "videos/web1.mp4",
            fullContent: "/news/spring-open-house",
            category: "event"
        },
        {
            id: 4,
            date: "May 5, 2025",
            title: "Student Achievement Awards",
            excerpt: "Celebrating our outstanding students who have excelled in academics, leadership, and community service throughout the year.",
            videoSrc: "videos/award1.mp4",
            fullContent: "/news/student-awards",
            category: "news"
        },
        {
            id: 5,
            date: "May 30, 2025",
            title: "Career Fair 2025",
            excerpt: "Connect with top employers and explore career opportunities at our annual career fair featuring over 50 companies.",
            videoSrc: "videos/career1.mp4",
            fullContent: "/news/career-fair",
            category: "event"
        },
        {
            id: 6,
            date: "April 15, 2025",
            title: "New AI Lab Opening",
            excerpt: "State-of-the-art AI research lab opens with cutting-edge equipment and resources for students and researchers.",
            videoSrc: "videos/ai-lab.mp4",
            fullContent: "/news/ai-lab",
            category: "news"
        }
    ];

    const filteredNews = filter === 'all' 
        ? newsItems 
        : newsItems.filter(item => item.category === filter);

    // Stagger animation delay for items
    const getAnimationDelay = (index) => {
        return `${index * 0.1}s`;
    };

    return (
        <section className="news-events" id="news" ref={sectionRef}>
            <div className="container">
                <div className="section-header"> 
                    <h2>News & Events</h2>
                    <p>Stay updated with the latest happenings at Forum Information Academy.</p>
                </div>
                
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'news' ? 'active' : ''}`} 
                        onClick={() => setFilter('news')}
                    >
                        News
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'event' ? 'active' : ''}`} 
                        onClick={() => setFilter('event')}
                    >
                        Events
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
                                        Loading...
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
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="news-content">
                                <div className="news-meta">
                                    <span className="news-date">{item.date}</span>
                                    <span className="news-category">{item.category}</span>
                                </div>
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-excerpt">{item.excerpt}</p>
                                <a href={item.fullContent} className="btn btn-outline">
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-4">
                    <a href="/news" className="btn btn-primary">View All News</a>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
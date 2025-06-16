import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import data1Video from '../assets/videos/vid1.mp4';
import data2Video from '../assets/videos/vid2.mp4';
import data3Video from '../assets/videos/vid3.mp4';
import data4Video from '../assets/videos/vid4.mp4';
import data5Video from '../assets/videos/vid5.mp4';
import data6Video from '../assets/videos/vid6.mp4';

const NewsSection = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [loadedVideos, setLoadedVideos] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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

    const filteredNews = filter === 'all' 
        ? newsItems 
        : newsItems.filter(item => item.category === filter);

    const getAnimationDelay = (index) => {
        return `${index * 0.1}s`;
    };

    return (
        <section className="py-16 bg-gray-50" id="news" ref={sectionRef}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12"> 
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('newsSection.header.title')}</h2>
                    <p className="text-lg text-gray-600">{t('newsSection.header.subtitle')}</p>
                </div>
                
                <div className="flex justify-center space-x-2 sm:space-x-4 mb-10">
                    <button 
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                    ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`} 
                        onClick={() => setFilter('all')}
                    >
                        {t('newsSection.filters.all')}
                    </button>
                    <button 
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                    ${filter === 'news' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`} 
                        onClick={() => setFilter('news')}
                    >
                        {t('newsSection.filters.news')}
                    </button>
                    <button 
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                    ${filter === 'event' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`} 
                        onClick={() => setFilter('event')}
                    >
                        {t('newsSection.filters.events')}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((item, index) => (
                        <div 
                            className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out" 
                            key={item.id} 
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: `opacity 0.6s ease ${getAnimationDelay(index)}, transform 0.6s ease ${getAnimationDelay(index)}, box-shadow 0.3s ease-out, transform 0.3s ease-out`
                            }}
                        >
                            <div className="relative h-56">
                                {!loadedVideos[item.id] && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <span className="text-gray-600">{t('newsSection.loading')}</span>
                                    </div>
                                )}
                                <video 
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    onLoadedData={() => handleVideoLoad(item.id)}
                                    style={{opacity: loadedVideos[item.id] ? 1 : 0}}
                                >
                                    <source src={item.videoSrc} type="video/mp4" />
                                    {t('newsSection.videoNotSupported')}
                                </video>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                                    <span className="news-date">{item.date}</span>
                                    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${item.category === 'event' ? 'bg-purple-500' : 'bg-green-500'}`}>
                                        {item.category === 'event' ? t('newsSection.categoryLabels.event') : t('newsSection.categoryLabels.news')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden line-clamp-4">{item.excerpt}</p>
                                <a 
                                    href={item.fullContent} 
                                    className="inline-block text-blue-600 font-medium border-2 border-blue-600 rounded-full px-5 py-2 text-sm
                                             hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform group-hover:translate-x-1"
                                >
                                    {t('newsSection.buttons.readMore')}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <a href="/news" className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
                        {t('newsSection.buttons.viewAllNews')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
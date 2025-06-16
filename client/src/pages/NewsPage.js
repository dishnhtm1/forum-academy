import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/NewsPage.css';

import data1Video from '../assets/videos/vid2.mp4';
import data2Video from '../assets/videos/vid2.mp4';
import data3Video from '../assets/videos/vid3.mp4';
import data4Video from '../assets/videos/vid4.mp4';
import data5Video from '../assets/videos/vid5.mp4';
import data6Video from '../assets/videos/vid6.mp4';

const NewsPage = () => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [loadedVideos, setLoadedVideos] = useState({});
    const heroRef = useRef(null);

    useEffect(() => {
        setIsHeroVisible(true);
        createBackgroundElements();
        const newsItems = document.querySelectorAll('.news-item-animate'); // Target animation class
        newsItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 100 * index);
        });
        return () => {
            const particles = document.querySelector('.news-particles');
            if (particles) {
                while (particles.firstChild) {
                    particles.removeChild(particles.firstChild);
                }
            }
        };
    }, []);

    const createBackgroundElements = () => {
        const particles = document.querySelector('.news-particles');
        if (!particles) return;
        while (particles.firstChild) {
            particles.removeChild(particles.firstChild);
        }
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'news-particle';
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
        const iconTypes = ['event_note', 'announcement', 'celebration', 'campaign'];
        for (let i = 0; i < 6; i++) {
            const newsIcon = document.createElement('div');
            newsIcon.className = 'floating-news-icon';
            const x = (Math.random() * 80) + 10;
            const y = (Math.random() * 70) + 10;
            const delay = Math.random() * 3;
            newsIcon.style.left = `${x}%`;
            newsIcon.style.top = `${y}%`;
            newsIcon.style.animationDelay = `${delay}s`;
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = iconTypes[Math.floor(Math.random() * iconTypes.length)];
            newsIcon.appendChild(icon);
            particles.appendChild(newsIcon);
        }
    };

    const handleVideoLoad = (id) => {
        setLoadedVideos(prev => ({ ...prev, [id]: true }));
    };

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

    const filterNews = (category) => {
        setActiveCategory(category);
    };

    const filteredNews = activeCategory === 'all'
        ? newsItems
        : newsItems.filter(item => item.category === activeCategory);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search submitted");
    };

    const getSectionTitle = () => {
        switch (activeCategory) {
            case 'events': return t('newsPage.sectionTitles.events');
            case 'announcements': return t('newsPage.sectionTitles.announcements');
            case 'achievements': return t('newsPage.sectionTitles.achievements');
            default: return t('newsPage.sectionTitles.all');
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'events': return t('newsPage.categoryLabels.event');
            case 'announcements': return t('newsPage.categoryLabels.announcement');
            case 'achievements': return t('newsPage.categoryLabels.achievement');
            default: return '';
        }
    };
    
    const getCategorySpecificClasses = (category) => {
        switch (category) {
            case 'events': return 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10';
            case 'announcements': return 'text-teal-600 dark:text-teal-400 border-teal-500/30 bg-teal-500/10';
            case 'achievements': return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10';
            default: return 'text-gray-600 dark:text-gray-400 border-gray-500/30 bg-gray-500/10';
        }
    };


    return (
        <div className="news-page bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            {/* Hero section - CSS for 3D effects, Tailwind for content styling */}
            <section
                ref={heroRef}
                className={`news-hero ${isHeroVisible ? 'visible' : ''}`} // Keep for existing JS animation
            >
                {/* Animated background (CSS controlled) */}
                <div className="news-hero-bg">
                    <div className="news-particles"></div>
                    <div className="news-glow news-glow-1"></div>
                    <div className="news-glow news-glow-2"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10"> {/* Tailwind container */}
                    <div className="max-w-3xl mx-auto text-center py-16 md:py-24">
                        <div className="inline-flex items-center bg-sky-500/10 dark:bg-sky-400/20 border border-sky-500/30 dark:border-sky-400/40 rounded-full px-4 py-2 mb-6 text-sm font-medium text-sky-600 dark:text-sky-300 animate-fade-in-up">
                            <span className="material-icons text-lg mr-2">campaign</span>
                            {t('newsPage.hero.badge')}
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up animation-delay-200">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-700 via-sky-500 to-violet-500 dark:from-slate-200 dark:via-sky-400 dark:to-violet-400">
                                {t('newsPage.hero.title.part1')}
                            </span>
                            <span className="text-sky-500 dark:text-sky-400"> {t('newsPage.hero.title.highlight')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                            {t('newsPage.hero.description')}
                        </p>

                        <div className="max-w-xl mx-auto mb-10 animate-fade-in-up animation-delay-600">
                            <form onSubmit={handleSearchSubmit} className="flex relative shadow-2xl rounded-full overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <input
                                    type="text"
                                    placeholder={t('newsPage.hero.searchPlaceholder')}
                                    className="flex-grow border-none py-4 px-6 text-base bg-transparent focus:ring-0 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                />
                                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white p-4 flex items-center justify-center transition-colors duration-300">
                                    <span className="material-icons">search</span>
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('newsPage.hero.trending.label')}:</span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'techSymposium', text: t('newsPage.hero.trending.tags.techSymposium') },
                                        { key: 'hackathon', text: t('newsPage.hero.trending.tags.hackathon') },
                                        { key: 'newCourses', text: t('newsPage.hero.trending.tags.newCourses') }
                                    ].map(tag => (
                                        <a key={tag.key} href={`#${tag.key}`} className="text-xs text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-700/50 rounded-full px-3 py-1.5 hover:bg-sky-200 dark:hover:bg-sky-600/60 transition-all duration-300 transform hover:scale-105">
                                            {tag.text}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 mt-12 animate-fade-in-up animation-delay-800">
                            {[
                                { number: "25+", labelKey: 'newsPage.hero.stats.upcomingEvents' },
                                { number: "12", labelKey: 'newsPage.hero.stats.recentAnnouncements' },
                                { number: "8", labelKey: 'newsPage.hero.stats.studentAchievements' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center relative group">
                                    <div className="text-4xl font-bold text-sky-500 dark:text-sky-400 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{t(stat.labelKey)}</div>
                                    {index < 2 && <div className="hidden sm:block absolute top-1/2 right-[-1.5rem] -translate-y-1/2 w-px h-3/4 bg-slate-300 dark:bg-slate-600 group-hover:bg-sky-500 transition-colors duration-300"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator"> {/* CSS controlled animation */}
                    <a href="#news-filters" className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300">
                        <span>{t('newsPage.hero.scrollIndicator')}</span>
                        <span className="material-icons text-2xl">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>

            {/* Filter categories - Pill Style Design */}
            <section id="news-filters" className="sticky top-0 z-[99] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center py-5">
                        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                            {[
                                { category: 'all', icon: 'view_list', labelKey: 'newsPage.filters.all' },
                                { category: 'events', icon: 'event', labelKey: 'newsPage.filters.events' },
                                { category: 'announcements', icon: 'campaign', labelKey: 'newsPage.filters.announcements' },
                                { category: 'achievements', icon: 'emoji_events', labelKey: 'newsPage.filters.achievements' }
                            ].map(btn => (
                                <button
                                    key={btn.category}
                                    className={`group flex items-center px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                                        activeCategory === btn.category
                                            ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30'
                                            : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-700'
                                    }`}
                                    onClick={() => filterNews(btn.category)}
                                >
                                    <span className={`material-icons text-lg mr-2 transition-transform duration-300 ${
                                        activeCategory === btn.category ? '' : 'group-hover:rotate-12'
                                    }`}>{btn.icon}</span>
                                    <span>{t(btn.labelKey)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured news - Tailwind */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-800 dark:to-sky-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-5 gap-8 lg:gap-12 bg-white dark:bg-slate-800/50 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.01] hover:shadow-sky-500/20">
                        <div className="md:col-span-3 relative min-h-[300px] md:min-h-[450px] overflow-hidden group">
                            <video autoPlay muted loop className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110">
                                <source src={data2Video} type="video/mp4" />
                                {t('newsPage.videoNotSupported')}
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5">
                                <span className="material-icons text-sm">star</span>
                                {t('newsPage.featured.tag')}
                            </div>
                        </div>
                        <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sky-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 py-1 px-2.5 bg-sky-500/10 rounded-md">
                                    <span className="material-icons text-base">event</span>
                                    {t('event')}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs">{t('newsPage.items.techSymposium.date')}</span>
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4 leading-tight group-hover:text-sky-600 transition-colors duration-300">
                                {t('newsPage.featured.title')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-sm md:text-base">
                                {t('newsPage.featured.excerpt')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                <a href="/news/tech-symposium" className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                                    <span className="material-icons text-lg">read_more</span>
                                    {t('newsPage.buttons.learnMore')}
                                </a>
                                <a href="/events/register" className="border border-sky-500 text-sky-500 hover:bg-sky-500/10 font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                                    <span className="material-icons text-lg">how_to_reg</span>
                                    {t('newsPage.buttons.registerNow')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News grid - Tailwind */}
            <section className="main-news-section py-16 md:py-24 bg-slate-50 dark:bg-slate-900/70">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-3">
                            {getSectionTitle()}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {filteredNews.length} {filteredNews.length === 1 ? t('newsPage.itemCount.singular') : t('newsPage.itemCount.plural')}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        {filteredNews.map((item, index) => (
                            <div
                                key={item.id}
                                className="news-item-animate bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group"
                                style={{ animationDelay: `${index * 0.05}s` }} // Keep for staggered animation if desired, or remove if handled by news-item-animate
                            >
                                <div className="h-52 relative overflow-hidden">
                                    {item.videoSrc ? (
                                        <>
                                            {!loadedVideos[item.id] && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mb-2"></div>
                                                    <span>{t('newsPage.loading')}</span>
                                                </div>
                                            )}
                                            <video
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                onLoadedData={() => handleVideoLoad(item.id)}
                                                className="w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105"
                                                style={{ opacity: loadedVideos[item.id] ? 1 : 0 }}
                                            >
                                                <source src={item.videoSrc} type="video/mp4" />
                                                {t('newsPage.videoNotSupported')}
                                            </video>
                                        </>
                                    ) : (
                                        <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    )}
                                </div>
                                <div className="p-5 md:p-6">
                                    <div className="flex items-center justify-between mb-3 text-xs">
                                        <span className={`font-semibold uppercase tracking-wider flex items-center gap-1.5 py-1 px-2 rounded-md ${getCategorySpecificClasses(item.category)}`}>
                                            <span className="material-icons text-sm">
                                                {item.category === 'events' ? 'event' :
                                                    item.category === 'announcements' ? 'campaign' :
                                                        'emoji_events'}
                                            </span>
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400">{item.date}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                    <a href={item.fullContent} className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm inline-flex items-center gap-1.5 group/link">
                                        {t('newsPage.buttons.readMore')}
                                        <span className="material-icons text-base transition-transform duration-300 group-hover/link:translate-x-1">arrow_forward</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredNews.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-icons text-7xl text-slate-400 dark:text-slate-500 mb-6">search_off</span>
                            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                {t('newsPage.noResults.title')} {activeCategory === 'all' ? t('newsPage.noResults.items') : getCategoryLabel(activeCategory)}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">{t('newsPage.noResults.description')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Campus Life Section - Updated titles */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/30 dark:via-slate-900 dark:to-purple-900/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full text-blue-800 dark:text-blue-300 text-sm font-medium mb-4 shadow">
                            <span className="material-icons text-lg mr-2">groups</span>
                            {t('campusLife.badge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                            {t('campusLife.title')}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {t('campusLife.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'groups', titleKey: 'campusLife.items.studentLife.title', descKey: 'campusLife.items.studentLife.description', gradient: 'from-blue-500 to-blue-600', hoverColor: 'blue' },
                            { icon: 'sports_esports', titleKey: 'campusLife.items.clubs.title', descKey: 'campusLife.items.clubs.description', gradient: 'from-purple-500 to-purple-600', hoverColor: 'purple' },
                            { icon: 'restaurant', titleKey: 'campusLife.items.dining.title', descKey: 'campusLife.items.dining.description', gradient: 'from-green-500 to-green-600', hoverColor: 'green' },
                            { icon: 'fitness_center', titleKey: 'campusLife.items.sports.title', descKey: 'campusLife.items.sports.description', gradient: 'from-orange-500 to-orange-600', hoverColor: 'orange' }
                        ].map(item => (
                            <div key={item.titleKey} className={`group bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl dark:hover:shadow-${item.hoverColor}-500/30 transition-all duration-500 hover:-translate-y-2 border border-white/20 dark:border-slate-700/50`}>
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300 shadow-lg`}>
                                    <span className="material-icons text-white text-3xl">{item.icon}</span>
                                </div>
                                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-${item.hoverColor}-600 dark:group-hover:text-${item.hoverColor}-400 transition-colors`}>
                                    {t(item.titleKey)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {t(item.descKey)}
                                </p>
                                <div className={`mt-6 w-full h-1 bg-gradient-to-r ${item.gradient} to-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Facility Introduction Section - Updated titles */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 shadow">
                            <span className="material-icons text-lg mr-2">apartment</span>
                            {t('facilities.badge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {t('facilities.title')}
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {t('facilities.subtitle')}
                        </p>
                    </div>
                    
                    <div className="space-y-20 md:space-y-24">
                        {[
                            { video: data1Video, icon: 'science', tag: 'facilities.items.labs.tag', titleKey: 'facilities.items.labs.title', descKey: 'facilities.items.labs.description', features: ['ai', 'robotics', 'networking'], featureKeyPrefix: 'facilities.items.labs.features', gradient: 'from-blue-500/20 to-purple-500/20', tagColor: 'blue' },
                            { video: data2Video, icon: 'local_library', tag: 'facilities.items.library.tag', titleKey: 'facilities.items.library.title', descKey: 'facilities.items.library.description', features: ['books', 'digitalResources', 'studySpaces'], featureKeyPrefix: 'facilities.items.library.features', gradient: 'from-purple-500/20 to-pink-500/20', tagColor: 'purple', reversed: true },
                            { video: data3Video, icon: 'home', tag: 'facilities.items.dormitories.tag', titleKey: 'facilities.items.dormitories.title', descKey: 'facilities.items.dormitories.description', features: ['furnished', 'wifi', 'communitySpaces'], featureKeyPrefix: 'facilities.items.dormitories.features', gradient: 'from-green-500/20 to-blue-500/20', tagColor: 'green' }
                        ].map((facility, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
                                <div className={`relative group ${facility.reversed ? 'lg:order-2' : ''}`}>
                                    <div className={`absolute -inset-3 md:-inset-4 bg-gradient-to-r ${facility.gradient} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70 group-hover:opacity-100`}></div>
                                    <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-video">
                                        <video autoPlay muted loop className="w-full h-full object-cover">
                                            <source src={facility.video} type="video/mp4" />
                                            {t('common.videoNotSupported')}
                                        </video>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                </div>
                                <div className={`space-y-5 md:space-y-6 ${facility.reversed ? 'lg:order-1' : ''}`}>
                                    <div className={`inline-flex items-center px-4 py-1.5 bg-${facility.tagColor}-500/20 rounded-full text-${facility.tagColor}-300 text-sm font-medium`}>
                                        <span className="material-icons text-lg mr-2">{facility.icon}</span>
                                        {t(facility.tag)}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                                        {t(facility.titleKey)}
                                    </h3>
                                    <p className="text-lg text-gray-300 leading-relaxed">
                                        {t(facility.descKey)}
                                    </p>
                                    <div className="space-y-2.5">
                                        {facility.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                                                <div className={`w-2.5 h-2.5 bg-${facility.tagColor}-500 rounded-full mr-3 shadow-sm`}></div>
                                                {t(`${facility.featureKeyPrefix}.${feature}`)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Campus Life in Niigata Section - Updated titles */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-slate-900 dark:to-cyan-900/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 dark:opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-800/30 dark:to-cyan-800/30 rounded-full text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4 shadow">
                            <span className="material-icons text-lg mr-2">location_city</span>
                            {t('niigataLife.badge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
                            {t('niigataLife.title')}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {t('niigataLife.subtitle')}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 md:mb-16">
                        {[
                            { icon: 'landscape', titleKey: 'niigataLife.items.nature.title', descKey: 'niigataLife.items.nature.description', gradient: 'from-emerald-500 to-teal-500', hoverColor: 'emerald', borderColor: 'border-emerald-100 dark:border-emerald-800/50' },
                            { icon: 'ramen_dining', titleKey: 'niigataLife.items.culture.title', descKey: 'niigataLife.items.culture.description', gradient: 'from-orange-500 to-red-500', hoverColor: 'orange', borderColor: 'border-orange-100 dark:border-orange-800/50' },
                            { icon: 'train', titleKey: 'niigataLife.items.transportation.title', descKey: 'niigataLife.items.transportation.description', gradient: 'from-blue-500 to-indigo-500', hoverColor: 'blue', borderColor: 'border-blue-100 dark:border-blue-800/50' },
                            { icon: 'ac_unit', titleKey: 'niigataLife.items.seasons.title', descKey: 'niigataLife.items.seasons.description', gradient: 'from-cyan-500 to-blue-500', hoverColor: 'cyan', borderColor: 'border-cyan-100 dark:border-cyan-800/50' }
                        ].map(item => (
                            <div key={item.titleKey} className={`group bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl dark:hover:shadow-${item.hoverColor}-500/20 transition-all duration-500 hover:-translate-y-2 ${item.borderColor} border`}>
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300 shadow-lg`}>
                                    <span className="material-icons text-white text-3xl">{item.icon}</span>
                                </div>
                                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-${item.hoverColor}-600 dark:group-hover:text-${item.hoverColor}-400 transition-colors`}>
                                    {t(item.titleKey)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {t(item.descKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
                        <div className="text-center mb-8 md:mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 dark:from-gray-100 dark:to-emerald-400 bg-clip-text text-transparent">
                                {t('niigataLife.gallery.title')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { video: data4Video, labelKey: 'niigataLife.gallery.items.cityView' },
                                { video: data5Video, labelKey: 'niigataLife.gallery.items.festivals' },
                                { video: data6Video, labelKey: 'niigataLife.gallery.items.winterScenes' }
                            ].map((galleryItem, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[4/3]">
                                    <video autoPlay muted loop className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                        <source src={galleryItem.video} type="video/mp4" />
                                        {t('common.videoNotSupported')}
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                                        <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 dark:border-white/20">
                                            <span className="text-white font-semibold text-sm md:text-lg">{t(galleryItem.labelKey)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsPage;
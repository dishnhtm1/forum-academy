import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/NewsPage.css';

import data1Video from '../assets/videos/vid2.mp4';
import data2Video from '../assets/videos/vid2.mp4';
import data3Video from '../assets/videos/vid3.mp4';
import data4Video from '../assets/videos/vid4.mp4';
import data5Video from '../assets/videos/vid5.mp4';
import data6Video from '../assets/videos/vid6.mp4';

import facilitiesImg from '../assets/facilities/facilities.jpg';
import niigataLifeImg from '../assets/facilities/niigatalife.jpg';
import facilitiesImg1 from '../assets/facilities/facilities.jpg';
import accessImg from '../assets/facilities/access.jpg';
import campusMap from '../assets/facilities/map.jpg';

import foodImg1 from '../assets/foods/mabomen.jpg'; 
import foodImg2 from '../assets/foods/rice.jpg'; 
import foodImg3 from '../assets/foods/peach.jpg'; 
import foodImg4 from '../assets/foods/sushi.jpg'; 
import foodImg5 from '../assets/foods/kane.jpg'; 
import foodImg6 from '../assets/foods/tare.jpg';
import foodImg7 from '../assets/foods/edamame.jpg';
import foodImg8 from '../assets/foods/dango.jpg';
import foodImg9 from '../assets/foods/kenchinjirusoysauce.jpg';
import foodImg10 from '../assets/foods/soba.jpg';
import foodImg11 from '../assets/foods/shasheme.jpg';
import foodImg12 from '../assets/foods/sushi2.jpg';

const NewsPage = () => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [loadedVideos, setLoadedVideos] = useState({});
    const heroRef = useRef(null);

    useEffect(() => {
        setIsHeroVisible(true);
        createBackgroundElements();
        const newsItems = document.querySelectorAll('.news-item-animate');
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
            {/* Hero section - Keep the same */}
            <section
                ref={heroRef}
                className={`news-hero ${isHeroVisible ? 'visible' : ''}`}
            >
                <div className="news-hero-bg">
                    <div className="news-particles"></div>
                    <div className="news-glow news-glow-1"></div>
                    <div className="news-glow news-glow-2"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
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
            </section>

            {/* Modern Filter Section - Redesigned */}
            <section id="news-filters" className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                {getSectionTitle()}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                {filteredNews.length} {filteredNews.length === 1 ? t('newsPage.itemCount.singular') : t('newsPage.itemCount.plural')}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl shadow-inner">
                            {[
                                { category: 'all', icon: 'view_list', labelKey: 'newsPage.filters.all', color: 'blue' },
                                { category: 'events', icon: 'event', labelKey: 'newsPage.filters.events', color: 'purple' },
                                { category: 'announcements', icon: 'campaign', labelKey: 'newsPage.filters.announcements', color: 'teal' },
                                { category: 'achievements', icon: 'emoji_events', labelKey: 'newsPage.filters.achievements', color: 'amber' }
                            ].map(btn => (
                                <button
                                    key={btn.category}
                                    className={`relative flex items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                                        activeCategory === btn.category
                                            ? `bg-white dark:bg-slate-700 text-${btn.color}-600 dark:text-${btn.color}-400 shadow-lg transform scale-105`
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                                    }`}
                                    onClick={() => filterNews(btn.category)}
                                >
                                    <span className={`material-icons text-lg mr-2 ${
                                        activeCategory === btn.category ? 'animate-bounce' : ''
                                    }`}>{btn.icon}</span>
                                    <span className="hidden sm:inline">{t(btn.labelKey)}</span>
                                    {activeCategory === btn.category && (
                                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-${btn.color}-500 rounded-full`}></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured News - Modern Card Design */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-slate-800">
                                    <div className="aspect-video relative">
                                        <video autoPlay muted loop className="w-full h-full object-cover">
                                            <source src={data2Video} type="video/mp4" />
                                            {t('newsPage.videoNotSupported')}
                                        </video>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                                                <span className="material-icons text-sm">star</span>
                                                {t('newsPage.featured.tag')}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                                <span className="text-white text-sm font-medium">{t('newsPage.items.techSymposium.date')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-white text-lg">auto_awesome</span>
                                    </div>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wider">
                                        {t('newsPage.featured.tag')}
                                    </span>
                                </div>
                                
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {t('newsPage.featured.title')}
                                </h2>
                                
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {t('newsPage.featured.excerpt')}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <a href="/news/tech-symposium" className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                                        <span className="material-icons">read_more</span>
                                        <span>{t('newsPage.buttons.learnMore')}</span>
                                        <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </a>
                                    <a href="/apply" className="group border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold py-4 px-8 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                                        <span className="material-icons">how_to_reg</span>
                                        <span>{t('newsPage.buttons.registerNow')}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Grid - Modern Masonry Layout */}
            <section className="py-20 bg-gray-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {filteredNews.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-full mb-6">
                                    <span className="material-icons text-4xl text-gray-400 dark:text-gray-500">search_off</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                    {t('newsPage.noResults.title')} {activeCategory === 'all' ? t('newsPage.noResults.items') : getCategoryLabel(activeCategory)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{t('newsPage.noResults.description')}</p>
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {filteredNews.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="break-inside-avoid news-item-animate bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 dark:border-slate-700"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="aspect-video relative">
                                                {!loadedVideos[item.id] && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                                                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                        <span className="text-sm">{t('newsPage.loading')}</span>
                                                    </div>
                                                )}
                                                <video
                                                    controls
                                                    autoPlay
                                                    muted
                                                    loop
                                                    onLoadedData={() => handleVideoLoad(item.id)}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                    style={{ opacity: loadedVideos[item.id] ? 1 : 0 }}
                                                >
                                                    <source src={item.videoSrc} type="video/mp4" />
                                                    {t('newsPage.videoNotSupported')}
                                                </video>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            
                                            <div className="absolute top-4 left-4">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-sm border ${getCategorySpecificClasses(item.category)} bg-white/90 dark:bg-slate-800/90`}>
                                                    {getCategoryLabel(item.category)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                                                    {item.date}
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-icons text-sm text-gray-400">schedule</span>
                                                    <span className="text-xs text-gray-400">5 min read</span>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                                <a 
                                                    href={item.fullContent} 
                                                    className="group/link inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm transition-colors duration-200"
                                                >
                                                    {t('newsPage.buttons.readMore')}
                                                    <span className="material-icons text-lg ml-1 transition-transform duration-300 group-hover/link:translate-x-1">arrow_forward</span>
                                                </a>
                                                <div className="flex items-center space-x-2 text-gray-400">
                                                    <button className="hover:text-red-500 transition-colors">
                                                        <span className="material-icons text-lg">favorite_border</span>
                                                    </button>
                                                    <button className="hover:text-blue-500 transition-colors">
                                                        <span className="material-icons text-lg">share</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full text-blue-800 dark:text-blue-300 text-sm font-medium mb-6 shadow-lg">
                                <span className="material-icons text-lg mr-2">groups</span>
                                {t('campusLife.badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                                {t('campusLife.title')}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                {t('campusLife.subtitle')}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { 
                                    icon: 'groups', 
                                    titleKey: 'campusLife.items.studentLife.title', 
                                    descKey: 'campusLife.items.studentLife.description', 
                                    gradient: 'from-blue-500 to-cyan-500', 
                                    shadowColor: 'blue',
                                    image: facilitiesImg1
                                },
                                { 
                                    icon: 'sports_esports', 
                                    titleKey: 'campusLife.items.clubs.title', 
                                    descKey: 'campusLife.items.clubs.description', 
                                    gradient: 'from-purple-500 to-pink-500', 
                                    shadowColor: 'purple',
                                    image: facilitiesImg1
                                },
                                { 
                                    icon: 'restaurant', 
                                    titleKey: 'campusLife.items.dining.title', 
                                    descKey: 'campusLife.items.dining.description', 
                                    gradient: 'from-green-500 to-emerald-500', 
                                    shadowColor: 'green',
                                    image: foodImg1
                                },
                                { 
                                    icon: 'fitness_center', 
                                    titleKey: 'campusLife.items.sports.title', 
                                    descKey: 'campusLife.items.sports.description', 
                                    gradient: 'from-orange-500 to-red-500', 
                                    shadowColor: 'orange',
                                    image: facilitiesImg1
                                }
                            ].map((item, index) => (
                                <div key={item.titleKey} className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-white/20 dark:border-slate-700/50`}>
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img 
                                            src={item.image} 
                                            alt={t(item.titleKey)}
                                            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                                    </div>
                                    
                                    <div className="relative z-10 p-8">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                                            <span className="material-icons text-white text-3xl">{item.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                            {t(item.titleKey)}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                            {t(item.descKey)}
                                        </p>
                                        <div className={`mt-6 w-full h-1 bg-gradient-to-r ${item.gradient} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Campus Map Section */}
                        <div className="mt-16">
                            <div className="relative">
                                {/* Enhanced Background with Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-indigo-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10 rounded-3xl"></div>
                                
                                <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
                                    {/* Floating Decorative Elements */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-blue-400/30 to-purple-500/20 rounded-full blur-2xl animate-float"></div>
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-indigo-400/25 to-cyan-500/20 rounded-full blur-xl animate-float-delay"></div>
                                    
                                    {/* Header Section with Enhanced Typography */}
                                    <div className="relative z-10 text-center pt-12 pb-8 px-8">
                                        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full text-blue-700 dark:text-blue-300 text-sm font-bold mb-8 shadow-xl">
                                            <span className="material-icons text-xl mr-3 animate-pulse">map</span>
                                            {t('newsPage.navigation.campusNavigationHub')}
                                        </div>
                                        <h3 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-slate-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6 leading-tight">
                                            {t('campusLife.map.title')}
                                        </h3>
                                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                                            {t('campusLife.map.description')}
                                        </p>
                                    </div>
                        
                                    {/* Access Image Section */}
                                    <div className="relative px-8 pb-6">
                                        <div className="relative overflow-hidden">
                                            <img 
                                                src={accessImg} 
                                                alt="Campus Access"
                                                className="w-full h-auto object-contain bg-gray-50 dark:bg-slate-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                                        </div>
                                    </div>
                        
                                    {/* Map Display Area */}
                                    <div className="relative px-8 pb-8">
                                        <div className="relative">
                                            {/* Premium Map Container */}
                                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-inner">
                                                {/* Map Header */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('newsPage.navigation.liveMap')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('newsPage.navigation.updatedToday')}</span>
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                    
                                                {/* Main Map Image */}
                                                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800">
                                                    <img 
                                                        src={campusMap} 
                                                        alt="Detailed Campus Map"
                                                        className="w-full h-auto object-contain"
                                                        style={{ minHeight: '600px', maxHeight: '800px' }}
                                                    />
                                                    
                                                    {/* Status Indicator */}
                                                    <div className="absolute top-4 left-4">
                                                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="material-icons text-green-500 text-sm">location_on</span>
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('newsPage.navigation.youAreHere')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Food Gallery Section - Already using translation keys correctly */}
                        <div className="mt-16">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/30 dark:to-emerald-800/30 rounded-full text-green-800 dark:text-green-300 text-sm font-semibold mb-4 shadow-lg">
                                    <span className="material-icons text-base mr-2">restaurant</span>
                                    {t('campusLife.dining.title')}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 dark:from-gray-100 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
                                    {t('campusLife.dining.gallery') || 'Dining Experience'}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                    {t('campusLife.dining.galleryDesc') || 'Delicious meals and dining options on campus'}
                                </p>
                            </div>
                            
                            {/* Smaller Food Box Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {/* Food Box 1 - Mabomen */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg1} 
                                            alt="Mabomen"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.mabomen')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 2 - Rice */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg2} 
                                            alt="Rice"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.rice')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 3 - Pear */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg3} 
                                            alt="Pear"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.pear')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 4 - Kiwami Sushi */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg4} 
                                            alt="Kiwami Sushi"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.kiwamiSushi')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 5 - Matsuba Crab */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg5} 
                                            alt="Matsuba Crab"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.matsubaCrab')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 6 - Tare Katsudon */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg6} 
                                            alt="Tare Katsudon"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.tareKatsudon')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 7 - Edamame */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg7} 
                                            alt="Edamame"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.edamame')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 8 - Sasa Dango */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg8} 
                                            alt="Sasa Dango"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.sasaDango')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 9 - Kenchin-jiru */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg9} 
                                            alt="Kenchin-jiru"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.kenchinJiru')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 10 - Hegi Soba */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg10} 
                                            alt="Hegi Soba"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.hegiSoba')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 11 - Kei Kaisendon */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg11} 
                                            alt="Kei Kaisendon"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.keiKaisendon')}</h4>
                                    </div>
                                </div>
                        
                                {/* Food Box 12 - Tomi Sushi */}
                                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={foodImg12} 
                                            alt="Tomi Sushi"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-3 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{t('campusLife.dining.foods.tomiSushi')}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 dark:from-indigo-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 dark:from-cyan-500/5 dark:to-blue-500/5 rounded-full blur-2xl animate-bounce-slow"></div>
                </div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float-random bg-gradient-to-r from-blue-300/20 to-purple-300/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 8 + 4}px`,
                                height: `${Math.random() * 8 + 4}px`,
                                animationDelay: `${Math.random() * 10}s`,
                                animationDuration: `${Math.random() * 20 + 15}s`
                            }}
                        ></div>
                    ))}
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section with Enhanced Animations */}
                        <div className="text-center mb-20 transform transition-all duration-1000 hover:scale-105">
                            <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-full text-blue-700 dark:text-white text-sm font-semibold mb-8 shadow-xl border border-blue-200/50 dark:border-white/20 hover:shadow-2xl hover:scale-110 transition-all duration-500 group">
                                <span className="material-icons text-xl mr-3 group-hover:rotate-12 transition-transform duration-300">apartment</span>
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                                    {t('facilities.badge')}
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-8 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-700 transform hover:scale-105">
                                {t('facilities.title')}
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                                {t('facilities.subtitle')}
                            </p>
                        </div>
                        
                        {/* Facilities Grid with Staggered Animations */}
                        <div className="space-y-32">
                            {[
                                { 
                                    image: facilitiesImg, 
                                    icon: 'apartment', 
                                    tag: 'facilities.items.campus.tag', 
                                    titleKey: 'facilities.items.campus.title', 
                                    descKey: 'facilities.items.campus.description', 
                                    features: ['modernBuildings', 'laboratories', 'library', 'sportsFacilities'], 
                                    featureKeyPrefix: 'facilities.items.campus.features', 
                                    gradient: 'from-blue-400/30 to-cyan-400/30 dark:from-blue-500/20 dark:to-purple-500/20', 
                                    tagColor: 'blue',
                                    cardBg: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20'
                                },
                                { 
                                    image: niigataLifeImg, 
                                    icon: 'location_city', 
                                    tag: 'facilities.items.niigataLife.tag', 
                                    titleKey: 'facilities.items.niigataLife.title', 
                                    descKey: 'facilities.items.niigataLife.description', 
                                    features: ['culturalSites', 'localCuisine', 'naturalBeauty', 'festivals'], 
                                    featureKeyPrefix: 'facilities.items.niigataLife.features', 
                                    gradient: 'from-emerald-400/30 to-teal-400/30 dark:from-green-500/20 dark:to-blue-500/20', 
                                    tagColor: 'emerald', 
                                    reversed: true,
                                    cardBg: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20'
                                }
                            ].map((facility, index) => (
                                <div 
                                    key={index} 
                                    className="group transform transition-all duration-1000 hover:scale-[1.02]"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    {/* Large Card with Background Image */}
                                    <div 
                                        className="relative rounded-3xl shadow-2xl hover:shadow-3xl border border-white/30 dark:border-white/20 transition-all duration-700 hover:border-white/50 dark:hover:border-white/30 overflow-hidden min-h-[800px]"
                                        style={{
                                            backgroundImage: `url(${facility.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        {/* Animated Glow Effect */}
                                        <div className={`absolute -inset-6 bg-gradient-to-r ${facility.gradient} rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-40 group-hover:opacity-70 animate-pulse-slow`}></div>
                                        
                                        {/* Decorative Corner Elements */}
                                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-white/60 to-blue-200/60 dark:from-white/20 dark:to-blue-400/20 rounded-full animate-ping z-10"></div>
                                        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-200/60 to-pink-200/60 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full animate-ping animation-delay-1000 z-10"></div>
                                        
                                        <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center p-8 md:p-12">
                                            {/* Tag Section - Visible on image */}
                                            <div className={`relative ${facility.reversed ? 'lg:order-2' : ''} flex items-start justify-start h-full`}>
                                                <div className="group-hover:scale-110 transition-all duration-300">
                                                    <div className={`inline-flex items-center px-6 py-3 bg-white/95 dark:bg-${facility.tagColor}-500/95 backdrop-blur-md rounded-full text-${facility.tagColor}-700 dark:text-white text-base font-bold shadow-xl border-2 border-${facility.tagColor}-200/60 dark:border-${facility.tagColor}-400/40 hover:shadow-2xl transition-all duration-300`}>
                                                        <span className="material-icons text-xl mr-3 animate-bounce-subtle">{facility.icon}</span>
                                                        {t(facility.tag)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Content Section - Blurred Background for Text */}
                                            <div className={`space-y-8 ${facility.reversed ? 'lg:order-1' : ''} bg-white/20 dark:bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/20 shadow-2xl`}>
                                                {/* Title with Gradient Animation */}
                                                <h3 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 dark:group-hover:from-blue-200 dark:group-hover:via-purple-200 dark:group-hover:to-pink-200 transition-all duration-700 leading-tight transform group-hover:scale-105">
                                                    {t(facility.titleKey)}
                                                </h3>
                                                
                                                {/* Description */}
                                                <p className="text-lg md:text-xl text-slate-800 dark:text-gray-100 leading-relaxed font-semibold group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-500 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/20 shadow-lg">
                                                    {t(facility.descKey)}
                                                </p>
                                                
                                                {/* Enhanced Features Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {facility.features.map((feature, fIndex) => (
                                                        <div 
                                                            key={fIndex} 
                                                            className="group/feature flex items-center text-slate-800 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white transition-all duration-300 bg-white/90 dark:bg-black/60 backdrop-blur-lg rounded-2xl p-5 border border-white/70 dark:border-white/30 hover:border-white/90 dark:hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                                                            style={{ animationDelay: `${fIndex * 100}ms` }}
                                                        >
                                                            <div className={`w-4 h-4 bg-gradient-to-r from-${facility.tagColor}-500 to-${facility.tagColor}-700 rounded-full mr-4 shadow-lg flex-shrink-0 group-hover/feature:scale-125 group-hover/feature:rotate-180 transition-all duration-500`}></div>
                                                            <span className="text-sm md:text-base font-bold group-hover/feature:font-black transition-all duration-300">
                                                                {t(`${facility.featureKeyPrefix}.${feature}`)}
                                                            </span>
                                                            <div className="ml-auto opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
                                                                <span className="material-icons text-lg text-blue-600 dark:text-blue-400">check_circle</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Call to Action Button */}
                                                <div className="pt-6">
                                                    <button className="group/btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-2 border-white/30">
                                                        <span className="material-icons mr-3 group-hover/btn:rotate-12 transition-transform duration-300">explore</span>
                                                        <span className="text-lg">Explore More</span>
                                                        <span className="material-icons ml-3 group-hover/btn:translate-x-2 transition-transform duration-300">arrow_forward</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Custom Styles for Additional Animations */}
                <style jsx>{`
                    @keyframes float-random {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        25% { transform: translateY(-20px) rotate(5deg); }
                        50% { transform: translateY(-10px) rotate(-5deg); }
                        75% { transform: translateY(-15px) rotate(3deg); }
                    }
                    
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.8; }
                    }
                    
                    @keyframes bounce-subtle {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-2px); }
                    }
                    
                    .animate-float-random {
                        animation: float-random linear infinite;
                    }
                    
                    .animate-bounce-slow {
                        animation: bounce-slow 4s ease-in-out infinite;
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse-slow 3s ease-in-out infinite;
                    }
                    
                    .animate-bounce-subtle {
                        animation: bounce-subtle 2s ease-in-out infinite;
                    }
                    
                    .animation-delay-1000 {
                        animation-delay: 1s;
                    }
                `}</style>
            </section>
        </div>
    );
};

export default NewsPage;
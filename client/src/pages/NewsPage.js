// import React, { useState, useEffect, useRef } from 'react';
// import NewsSection from '../components/NewsSection';
// import '../styles/NewsPage.css';

// const NewsPage = () => {
//     // State to track which category is active
//     const [activeCategory, setActiveCategory] = useState('all');
//     const [isHeroVisible, setIsHeroVisible] = useState(false);
//     const heroRef = useRef(null);
    
//     // Animation for news items and hero when they load
//     useEffect(() => {
//         // Make hero visible with animation
//         setIsHeroVisible(true);
        
//         // Initialize the animated background elements
//         createBackgroundElements();
        
//         // Animate news items
//         const newsItems = document.querySelectorAll('.news-item');
//         newsItems.forEach((item, index) => {
//             setTimeout(() => {
//                 item.classList.add('visible');
//             }, 100 * index);
//         });
        
//         // Cleanup function to remove particles when component unmounts
//         return () => {
//             const particles = document.querySelector('.news-particles');
//             if (particles) {
//                 while (particles.firstChild) {
//                     particles.removeChild(particles.firstChild);
//                 }
//             }
//         };
//     }, []);
    
//     // Create animated background elements for the hero
//     const createBackgroundElements = () => {
//         const particles = document.querySelector('.news-particles');
//         if (!particles) return;
        
//         // Clear existing particles
//         while (particles.firstChild) {
//             particles.removeChild(particles.firstChild);
//         }
        
//         // Create floating particles
//         for (let i = 0; i < 30; i++) {
//             const particle = document.createElement('div');
//             particle.className = 'news-particle';
            
//             // Random size and position
//             const size = Math.random() * 8 + 4;
//             const x = Math.random() * 100;
//             const y = Math.random() * 100;
            
//             particle.style.width = `${size}px`;
//             particle.style.height = `${size}px`;
//             particle.style.left = `${x}%`;
//             particle.style.top = `${y}%`;
//             particle.style.animationDelay = `${Math.random() * 5}s`;
//             particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            
//             particles.appendChild(particle);
//         }
        
//         // Create floating news icons
//         const iconTypes = ['event_note', 'announcement', 'celebration', 'campaign'];
        
//         for (let i = 0; i < 6; i++) {
//             const newsIcon = document.createElement('div');
//             newsIcon.className = 'floating-news-icon';
            
//             // Random position on screen
//             const x = (Math.random() * 80) + 10;
//             const y = (Math.random() * 70) + 10;
//             const delay = Math.random() * 3;
            
//             newsIcon.style.left = `${x}%`;
//             newsIcon.style.top = `${y}%`;
//             newsIcon.style.animationDelay = `${delay}s`;
            
//             // Add random icon
//             const icon = document.createElement('span');
//             icon.className = 'material-icons';
//             icon.textContent = iconTypes[Math.floor(Math.random() * iconTypes.length)];
//             newsIcon.appendChild(icon);
            
//             particles.appendChild(newsIcon);
//         }
//     };

//     // Filter news items by category
//     const filterNews = (category) => {
//         setActiveCategory(category);
        
//         // In a real application, you would filter the news items based on category
//         // For this demo, we'll just change the active state
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         // Handle search functionality
//         console.log("Search submitted");
//     };

//     return (
//         <div className="news-page">
//             {/* Enhanced Hero section */}
//             <section 
//                 ref={heroRef} 
//                 className={`news-hero ${isHeroVisible ? 'visible' : ''}`}
//             >
//                 {/* Animated background */}
//                 <div className="news-hero-bg">
//                     <div className="news-particles"></div>
//                     <div className="news-glow news-glow-1"></div>
//                     <div className="news-glow news-glow-2"></div>
//                 </div>
                
//                 <div className="container">
//                     <div className="news-hero-content">
//                         <div className="news-hero-badge">
//                             <span className="material-icons">campaign</span>
//                             Latest Updates
//                         </div>
                        
//                         <h1 className="animated-heading">
//                             News & <span className="highlight-text">Events</span>
//                         </h1>
                        
//                         <p className="news-hero-description">
//                             Stay informed about the latest happenings at Forum Information Academy, 
//                             from events and announcements to student achievements and tech news.
//                         </p>
                        
//                         {/* Search bar */}
//                         <div className="news-search-container">
//                             <form onSubmit={handleSearchSubmit} className="news-search-form">
//                                 <input 
//                                     type="text" 
//                                     placeholder="Search for news and events..." 
//                                     className="news-search-input"
//                                 />
//                                 <button type="submit" className="news-search-btn">
//                                     <span className="material-icons">search</span>
//                                 </button>
//                             </form>
                            
//                             <div className="trending-topics">
//                                 <span className="trending-label">Trending:</span>
//                                 <div className="trending-tags">
//                                     <a href="#tech-symposium" className="trending-tag">Tech Symposium</a>
//                                     <a href="#hackathon" className="trending-tag">Hackathon</a>
//                                     <a href="#new-courses" className="trending-tag">New Courses</a>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         {/* Quick stats */}
//                         <div className="news-stats">
//                             <div className="news-stat">
//                                 <div className="news-stat-number">25+</div>
//                                 <div className="news-stat-label">Upcoming Events</div>
//                             </div>
//                             <div className="news-stat">
//                                 <div className="news-stat-number">12</div>
//                                 <div className="news-stat-label">Recent Announcements</div>
//                             </div>
//                             <div className="news-stat">
//                                 <div className="news-stat-number">8</div>
//                                 <div className="news-stat-label">Student Achievements</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Scroll indicator */}
//                 <div className="scroll-indicator">
//                     <a href="#news-filters">
//                         <span>Browse News</span>
//                         <span className="material-icons">keyboard_arrow_down</span>
//                     </a>
//                 </div>
//             </section>
            
//             {/* Filter categories */}
//             <section id="news-filters" className="news-filters">
//                 <div className="container">
//                     <div className="filter-buttons">
//                         <button 
//                             className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
//                             onClick={() => filterNews('all')}
//                         >
//                             All News
//                         </button>
//                         <button 
//                             className={`filter-btn ${activeCategory === 'events' ? 'active' : ''}`}
//                             onClick={() => filterNews('events')}
//                         >
//                             Events
//                         </button>
//                         <button 
//                             className={`filter-btn ${activeCategory === 'announcements' ? 'active' : ''}`}
//                             onClick={() => filterNews('announcements')}
//                         >
//                             Announcements
//                         </button>
//                         <button 
//                             className={`filter-btn ${activeCategory === 'achievements' ? 'active' : ''}`}
//                             onClick={() => filterNews('achievements')}
//                         >
//                             Student Achievements
//                         </button>
//                     </div>
//                 </div>
//             </section>
            
//             {/* Featured news */}
//             <section className="featured-news">
//                 <div className="container">
//                     <div className="featured-news-item">
//                         <div className="featured-news-image">
//                             <video autoPlay muted loop>
//                                 <source src="/videos/data2.mp4" type="video/mp4" />
//                                 Your browser does not support the video tag.
//                             </video>
//                             <div className="featured-tag">Featured</div>
//                         </div>
//                         <div className="featured-news-content">
//                             <div className="news-meta">
//                                 <span className="news-category">Event</span>
//                                 <span className="news-date">May 10, 2025</span>
//                             </div>
//                             <h2 className="featured-news-title">Annual Tech Symposium 2025</h2>
//                             <p className="featured-news-excerpt">
//                                 Join us for our annual technology symposium featuring industry speakers, 
//                                 workshop sessions, and networking opportunities. The event will showcase 
//                                 the latest advancements in AI, cloud computing, and cybersecurity, with 
//                                 hands-on demonstrations and career opportunities from our partner companies.
//                             </p>
//                             <div className="news-cta">
//                                 <a href="/news/tech-symposium" className="btn btn-primary">Learn More</a>
//                                 <a href="/events/register" className="btn btn-outline">Register Now</a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
            
//             {/* News grid */}
//             <section className="news-section">
//                 <div className="container">
//                     <h2 className="section-title">Latest News & Updates</h2>
                    
//                     <div className="news-grid">
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <video controls autoPlay muted loop>
//                                     <source src="/videos/data2.mp4" type="video/mp4" />
//                                     Your browser does not support the video tag.
//                                 </video>
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Event</span>
//                                     <span className="news-date">May 10, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">Annual Tech Symposium</h3>
//                                 <p className="news-excerpt">Join us for our annual technology symposium featuring industry speakers, workshop sessions, and networking opportunities.</p>
//                                 <a href="/news/tech-symposium" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
                        
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <video controls autoPlay muted loop>
//                                     <source src="/videos/data1.mp4" type="video/mp4" />
//                                     Your browser does not support the video tag.
//                                 </video>
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Announcement</span>
//                                     <span className="news-date">April 28, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">New Industry Partnership</h3>
//                                 <p className="news-excerpt">We're excited to announce our new partnership with SoftTech Inc. to provide exclusive internship opportunities for our students.</p>
//                                 <a href="/news/industry-partnership" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
                        
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <video controls autoPlay muted loop>
//                                     <source src="/videos/web1.mp4" type="video/mp4" />
//                                     Your browser does not support the video tag.
//                                 </video>
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Event</span>
//                                     <span className="news-date">May 22, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">Spring Open House</h3>
//                                 <p className="news-excerpt">Visit our campus to learn about our programs, meet instructors, and explore our facilities during our Spring Open House event.</p>
//                                 <a href="/news/spring-open-house" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
                        
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <img src="/images/student-achievement.jpg" alt="Student Achievement" />
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Achievement</span>
//                                     <span className="news-date">April 15, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">Students Win National Hackathon</h3>
//                                 <p className="news-excerpt">A team of our students took first place at the National Coding Challenge with their innovative healthcare application.</p>
//                                 <a href="/news/hackathon-winners" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
                        
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <img src="/images/new-course.jpg" alt="New Course Announcement" />
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Announcement</span>
//                                     <span className="news-date">March 30, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">New Course: Quantum Computing Fundamentals</h3>
//                                 <p className="news-excerpt">We're launching a new specialized course on quantum computing basics and applications, starting next semester.</p>
//                                 <a href="/news/quantum-computing-course" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
                        
//                         <div className="news-item">
//                             <div className="news-img">
//                                 <img src="/images/guest-lecture.jpg" alt="Guest Lecture" />
//                             </div>
//                             <div className="news-content">
//                                 <div className="news-meta">
//                                     <span className="news-category">Event</span>
//                                     <span className="news-date">June 5, 2025</span>
//                                 </div>
//                                 <h3 className="news-title">Guest Lecture: AI Ethics in Modern Society</h3>
//                                 <p className="news-excerpt">Join us for a special lecture by Dr. Mika Tanaka on the ethical implications of AI in healthcare and finance.</p>
//                                 <a href="/news/ai-ethics-lecture" className="btn btn-outline">Read More</a>
//                             </div>
//                         </div>
//                     </div>
                    
//                     {/* Pagination */}
//                     <div className="pagination">
//                         <button className="pagination-btn active">1</button>
//                         <button className="pagination-btn">2</button>
//                         <button className="pagination-btn">3</button>
//                         <button className="pagination-btn">
//                             <span className="material-icons">chevron_right</span>
//                         </button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default NewsPage;

/* filepath: c:\MERN-FIA-PORTAL\client\src\pages\NewsPage.js */
import React, { useState, useEffect, useRef } from 'react';
import '../styles/NewsPage.css';

const NewsPage = () => {
    // State to track which category is active
    const [activeCategory, setActiveCategory] = useState('all');
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [loadedVideos, setLoadedVideos] = useState({});
    const heroRef = useRef(null);
    
    // Animation for news items and hero when they load
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
    
    // Create animated background elements for the hero
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

    // Handle video loading
    const handleVideoLoad = (id) => {
        setLoadedVideos(prev => ({...prev, [id]: true}));
    };

    // News data
    const newsItems = [
        {
            id: 1,
            date: "May 10, 2025",
            title: "Annual Tech Symposium",
            excerpt: "Join us for our annual technology symposium featuring industry speakers, workshop sessions, and networking opportunities.",
            videoSrc: "/videos/data2.mp4",
            fullContent: "/news/tech-symposium",
            category: "events"
        },
        {
            id: 2,
            date: "April 28, 2025",
            title: "New Industry Partnership",
            excerpt: "We're excited to announce our new partnership with SoftTech Inc. to provide exclusive internship opportunities for our students.",
            videoSrc: "/videos/data1.mp4",
            fullContent: "/news/industry-partnership",
            category: "announcements"
        },
        {
            id: 3,
            date: "May 22, 2025",
            title: "Spring Open House",
            excerpt: "Visit our campus to learn about our programs, meet instructors, and explore our facilities during our Spring Open House event.",
            videoSrc: "/videos/web1.mp4",
            fullContent: "/news/spring-open-house",
            category: "events"
        },
        {
            id: 4,
            date: "April 15, 2025",
            title: "Students Win National Hackathon",
            excerpt: "A team of our students took first place at the National Coding Challenge with their innovative healthcare application.",
            imageSrc: "/images/student-achievement.jpg",
            fullContent: "/news/hackathon-winners",
            category: "achievements"
        },
        {
            id: 5,
            date: "March 30, 2025",
            title: "New Course: Quantum Computing Fundamentals",
            excerpt: "We're launching a new specialized course on quantum computing basics and applications, starting next semester.",
            imageSrc: "/images/new-course.jpg",
            fullContent: "/news/quantum-computing-course",
            category: "announcements"
        },
        {
            id: 6,
            date: "June 5, 2025",
            title: "Guest Lecture: AI Ethics in Modern Society",
            excerpt: "Join us for a special lecture by Dr. Mika Tanaka on the ethical implications of AI in healthcare and finance.",
            imageSrc: "/images/guest-lecture.jpg",
            fullContent: "/news/ai-ethics-lecture",
            category: "events"
        }
    ];

    // Filter news items by category
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

    return (
        <div className="news-page">
            {/* Enhanced Hero section - UNCHANGED */}
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
                            Latest Updates
                        </div>
                        
                        <h1 className="animated-heading">
                            News & <span className="highlight-text">Events</span>
                        </h1>
                        
                        <p className="news-hero-description">
                            Stay informed about the latest happenings at Forum Information Academy, 
                            from events and announcements to student achievements and tech news.
                        </p>
                        
                        {/* Search bar */}
                        <div className="news-search-container">
                            <form onSubmit={handleSearchSubmit} className="news-search-form">
                                <input 
                                    type="text" 
                                    placeholder="Search for news and events..." 
                                    className="news-search-input"
                                />
                                <button type="submit" className="news-search-btn">
                                    <span className="material-icons">search</span>
                                </button>
                            </form>
                            
                            <div className="trending-topics">
                                <span className="trending-label">Trending:</span>
                                <div className="trending-tags">
                                    <a href="#tech-symposium" className="trending-tag">Tech Symposium</a>
                                    <a href="#hackathon" className="trending-tag">Hackathon</a>
                                    <a href="#new-courses" className="trending-tag">New Courses</a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick stats */}
                        <div className="news-stats">
                            <div className="news-stat">
                                <div className="news-stat-number">25+</div>
                                <div className="news-stat-label">Upcoming Events</div>
                            </div>
                            <div className="news-stat">
                                <div className="news-stat-number">12</div>
                                <div className="news-stat-label">Recent Announcements</div>
                            </div>
                            <div className="news-stat">
                                <div className="news-stat-number">8</div>
                                <div className="news-stat-label">Student Achievements</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <a href="#news-filters">
                        <span>Browse News</span>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </a>
                </div>
            </section>
            
            {/* Filter categories - UPDATED */}
            <section id="news-filters" className="news-page-filters">
                <div className="container">
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => filterNews('all')}
                        >
                            <span className="material-icons">view_list</span>
                            All News
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'events' ? 'active' : ''}`}
                            onClick={() => filterNews('events')}
                        >
                            <span className="material-icons">event</span>
                            Events
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'announcements' ? 'active' : ''}`}
                            onClick={() => filterNews('announcements')}
                        >
                            <span className="material-icons">campaign</span>
                            Announcements
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'achievements' ? 'active' : ''}`}
                            onClick={() => filterNews('achievements')}
                        >
                            <span className="material-icons">emoji_events</span>
                            Achievements
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Featured news - UPDATED */}
            <section className="featured-news">
                <div className="container">
                    <div className="featured-news-item">
                        <div className="featured-news-image">
                            <video autoPlay muted loop>
                                <source src="/videos/data2.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="featured-tag">
                                <span className="material-icons">star</span>
                                Featured
                            </div>
                        </div>
                        <div className="featured-news-content">
                            <div className="news-meta">
                                <span className="news-category events">
                                    <span className="material-icons">event</span>
                                    Event
                                </span>
                                <span className="news-date">May 10, 2025</span>
                            </div>
                            <h2 className="featured-news-title">Annual Tech Symposium 2025</h2>
                            <p className="featured-news-excerpt">
                                Join us for our annual technology symposium featuring industry speakers, 
                                workshop sessions, and networking opportunities. The event will showcase 
                                the latest advancements in AI, cloud computing, and cybersecurity, with 
                                hands-on demonstrations and career opportunities from our partner companies.
                            </p>
                            <div className="news-cta">
                                <a href="/news/tech-symposium" className="btn btn-primary">
                                    <span className="material-icons">read_more</span>
                                    Learn More
                                </a>
                                <a href="/events/register" className="btn btn-outline">
                                    <span className="material-icons">how_to_reg</span>
                                    Register Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* News grid - UPDATED */}
            <section className="main-news-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {activeCategory === 'all' ? 'Latest News & Updates' : 
                             activeCategory === 'events' ? 'Upcoming Events' :
                             activeCategory === 'announcements' ? 'Recent Announcements' :
                             'Student Achievements'}
                        </h2>
                        <p className="section-subtitle">
                            {filteredNews.length} {filteredNews.length === 1 ? 'item' : 'items'} found
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
                                                    <span>Loading...</span>
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
                                                Your browser does not support the video tag.
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
                                            {item.category === 'events' ? 'Event' : 
                                             item.category === 'announcements' ? 'Announcement' : 
                                             'Achievement'}
                                        </span>
                                        <span className="news-date">{item.date}</span>
                                    </div>
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-excerpt">{item.excerpt}</p>
                                    <a href={item.fullContent} className="btn btn-outline">
                                        <span className="material-icons">read_more</span>
                                        Read More
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Show message if no items found */}
                    {filteredNews.length === 0 && (
                        <div className="no-results">
                            <span className="material-icons">search_off</span>
                            <h3>No {activeCategory} found</h3>
                            <p>Try selecting a different category or check back later.</p>
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
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Phone, MapPin, Award, BookOpen, Calendar, Linkedin, Twitter, Github, GraduationCap, Shield, Star, Clock, Building, User, X, UserCheck, Briefcase, Settings } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/parallax';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules - Updated for Swiper v9
import { Parallax, Pagination, Navigation, Autoplay } from 'swiper';

// Import custom styles
import '../styles/Swiper-Customs.css';

// Import teacher images from assets
import teacher1 from '../assets/teachers/坂口先生.jpg';
import teacher2 from '../assets/teachers/樋山先生.jpg';
import teacher3 from '../assets/teachers/梅津先生.jpg';
import teacher4 from '../assets/teachers/櫻岡先生.jpg';
import teacher5 from '../assets/teachers/榎本先生.jpg';
import teacher6 from '../assets/teachers/松永先生.jpg';
import teacher7 from '../assets/teachers/京先生.jpg';
import teacher8 from '../assets/teachers/山崎先生.jpg';
import teacher9 from '../assets/teachers/浅野先生.jpg';
import teacher10 from '../assets/teachers/丸山先生.jpg';
import teacher11 from '../assets/teachers/関川先生.jpg';
import teacher12 from '../assets/teachers/池内先生.jpg';
import teacher13 from '../assets/teachers/亀山先生.jpg';
import teacher14 from '../assets/teachers/大瀧先生.jpg';
import teacher15 from '../assets/teachers/渡邊先生.jpg';
import teacher16 from '../assets/teachers/中野先生.jpg';
import teacher17 from '../assets/teachers/水野先生.jpg';
import teacher18 from '../assets/teachers/深見先生.jpg';

const Team = () => {
    const { t } = useTranslation();
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        setIsHeroVisible(true);
        createHeroAnimatedElements();
        
        const sections = document.querySelectorAll('.about-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
        
        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
            
            const elements = document.querySelector('.about-hero-elements');
            if (elements) {
                while (elements.firstChild) {
                    elements.removeChild(elements.firstChild);
                }
            }
        };
    }, []);

    const createHeroAnimatedElements = () => {
        const container = document.querySelector('.about-hero-elements');
        if (!container) return;
        
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        for (let i = 0; i < 20; i++) {
            const shape = document.createElement('div');
            shape.className = 'about-shape';
            
            const shapes = ['circle', 'triangle', 'square', 'plus'];
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            shape.classList.add(`shape-${shapeType}`);
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 30 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            const animationDelay = Math.random() * 5;
            const animationDuration = Math.random() * 20 + 10;
            
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.opacity = opacity;
            shape.style.animationDelay = `${animationDelay}s`;
            shape.style.animationDuration = `${animationDuration}s`;
            
            container.appendChild(shape);
        }
        
        const icons = ['people', 'school', 'groups', 'emoji_people', 'psychology', 'supervisor_account'];
        for (let i = 0; i < 6; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'about-hero-icon';
            
            const x = 10 + (Math.random() * 80);
            const y = 10 + (Math.random() * 80);
            const delay = Math.random() * 5;
            
            iconWrapper.style.left = `${x}%`;
            iconWrapper.style.top = `${y}%`;
            iconWrapper.style.animationDelay = `${delay}s`;
            
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = icons[i % icons.length];
            
            iconWrapper.appendChild(icon);
            container.appendChild(iconWrapper);
        }
    };

    // Combined all team members data
    const allTeamMembers = [
        // Teachers
        {
            id: 1,
            name: 'Sakaguchi Nobuaki Sensei',
            nameJapanese: '坂口 伸昭 先生',
            role: '学校長 (Principal)',
            interest: 'University entrance exam instruction, Cooking (大学受験指導・料理)',
            message: {
                japanese: 'FORUMで学び、夢を実現するために自分の力を発揮してみましょう！',
                english: 'Lets study at FORUM and demonstrate your abilities to achieve your dreams!',
            },
            image: teacher1
        },
        {
            id: 2,
            name: 'Hiyama Takehisa Sensei',
            nameJapanese: '樋山 岳寿 先生',
            role: '副校長 (Vice Principal)',
            interest: 'Campus tours, Community activities (キャンプラ集め・地域活動)',
            message: {
                japanese: '夢を実現するための環境がFORUMにはあります。共に学び、あなたの夢をサポートします。',
                english: 'There is an environment at FORUM to realize your dreams. Lets learn together and I will support your dreams',
            },
            image: teacher2
        },
        {
            id: 3,
            name: 'Umezu Rinsei Sensei',
            nameJapanese: '梅津 凛生 先生',
            role: '学生管理 (Student Management)',
            interest: 'Sports (スポーツ)',
            message: {
                japanese: '1年生サポートセンターでお待ちしています！ぜひたくさんお話しましょう！',
                english: 'I am supporting first-year students at the center! Lets have lots of fun together.',
            },
            image: teacher3
        },
        {
            id: 4,
            name: 'Sakuraoka Shiina Sensei',
            nameJapanese: '櫻岡 椎奈 先生',
            role: '学生管理 (Student Management)',
            interest: 'Cafe tours, Chatting with friends (カフェ巡り・愛想と遊ぶこと)',
            message: {
                japanese: '新緑の生活で心配なことがあればなんでも相談してください！',
                english: 'If you have any concerns about your new life, please feel free to talk to me anytime!',
            },
            image: teacher4
        },
        {
            id: 5,
            name: 'Enomoto Sayaka Sensei',
            nameJapanese: '榎本 さやか 先生',
            role: 'Academic Affairs, 1st year homeroom teacher (教務・1年生担任)',
            interest: 'Overseas travel, Snowboarding (海外旅行・スノーボード)',
            message: {
                japanese: '授業でわからないことがあればなんでも聞いてください！英語でもOKです！',
                english: 'Please feel free to ask about anything you don\'t understand in class! English is OK too!',
            },
            image: teacher5
        },
        {
            id: 6,
            name: 'Matsunaga Takao Sensei',
            nameJapanese: '松永 隆男 先生',
            role: 'Academic Affairs, 1st year homeroom teacher (教務・1年生担任)',
            interest: 'Hot spring tours, Cat appreciation (温泉巡り・ねこ鑑賞)',
            message: {
                japanese: '日本で学ぶこと、世界中でどう生かせばよいか一緒に考えましょう！',
                english: 'Let\'s think together about how to live well in Japan and around the world!',
            },
            image: teacher6
        },
        // Management Team
        {
            id: 7,
            name: 'Kyo Chiaki Sensei',
            nameJapanese: '京 千亜紀 先生',
            role: 'Academic Affairs, 1st year homeroom teacher (教務・1年生担任)',
            interest: 'Overseas travel, Jazz, Mountain climbing (海外旅行・ジャズ・登山)',
            message: {
                japanese: 'FORUMで皆さんに出会えたことに感謝しています。いつでも気軽に声をかけてください！',
                english: 'I\'m grateful to have met everyone at FORUM. Please feel free to talk to me anytime!',
            },
            image: teacher7
        },
        {
            id: 8,
            name: 'Yamazaki Sakie Sensei',
            nameJapanese: '山崎 咲希恵 先生',
            role: ' Academic Affairs, 2nd year homeroom teacher (教務・2年生担任)',
            interest: 'Drinking, Playing with children at parks (お酒・息子と公園で遊ぶこと)',
            message: {
                japanese: '授業や就職に関してて安なことがあればいつでも相談に乗ります！',
                english: 'Please consult me about anything related to classes or employment. I\'ll always be here to help!',
            },
            image: teacher8
        },
        {
            id: 9,
            name: 'Asano Umahiko Sensei',
            nameJapanese: '浅野 馬彦 先生',
            role: 'Career Services Directo Tokyo Office, School information sessions, Interviews (東京事務所・学校説明会・面談)',
            interest: ' Travel, Sports viewing (旅行・スポーツ観戦)',
            message: {
                japanese: 'もしうちで何かに悩んでいたら、ぜひ私に相談してください！',
                english: 'If you\'re worried about anything, please feel free to consult with me!',
            },
            image: teacher9
        },
        {
            id: 10,
            name: 'Maruyama Saki Sensei',
            nameJapanese: '丸山 紗希 先生',
            role: 'Student Recruitment, School information sessions, Entrance consultations (学生募集・学校説明会・入学前相談)',
            interest: 'Idol appreciation, Domestic travel (アイドル鑑賞・国内旅行)',
            message: {
                japanese: '何でも気軽に話しかけてくださいね♪',
                english: 'Please feel free to talk to me about anything - I\'m easygoing and cheerful',
            },
            image: teacher10
        },
        {
            id: 11,
            name: 'Sekikawa Saya Sensei',
            nameJapanese: '関川 沙耶 先生',
            role: 'Student Recruitment, Post-enrollment consultation, Pre-enrollment consultation (学生募集・合格後書類・入学前相談)',
            interest: 'Black tea collecting, Making sweets (紅茶集め・おやつ作り)',
            message: {
                japanese: '友達にFORUMの入学を考えている人がいたらぜひ、教えてください！',
                english: ' If you\'re thinking about FORUM enrollment, please feel free to ask!',
            },
            image: teacher11
        },
        {
            id: 12,
            name: 'Ikeuchi Mao Sensei',
            nameJapanese: '池内 真央 先生',
            role: 'Public Relations (広報)',
            interest: ' Dance, Illustration, Soccer viewing (ダンス・イラスト・サッカー観戦)',
            message: {
                japanese: '皆さんのお友達たくさん連れてください！一緒に思い出を作りましょう！',
                english: 'Please bring lots of your friends! Let\'s think about the future together!',
            },
            image: teacher12
        },
        // Additional Team Members
        {
            id: 13,
            name: 'Kameyama Hiroyuki Sensei',
            nameJapanese: '亀山 裕之 先生',
            role: 'Industry-Academia Collaboration, Industry liaison (産学連携・産学連携窓口)',
            interest: 'FUJIROCK, Jazz, Radio (FUJIROCK・ジャズ・ラジオ)',
            message: {
                japanese: '皆さんのパートナーシップ・インターンシップ活動をサポートいたします！',
                english: 'I will support everyone\'s partnerships and internship activities!',
            },
            image: teacher13
        },
        {
            id: 14,
            name: 'Otaki Seiichiro Sensei',
            nameJapanese: '大瀧 誠一郎 先生',
            role: 'Administrative Office, General affairs (事務局・事務局庶務)',
            interest: 'Motorcycle touring, PC repair (バイクツーリング・PC修理)',
            message: {
                japanese: '裏方の様々な業務を通して、みんなのために頑張ります！',
                english: 'I provide various support for everyone through my behind-the-scenes work. Please rely on me!',
            },
            image: teacher14
        },
        {
            id: 15,
            name: 'Watanabe Kumi Sensei',
            nameJapanese: '渡邉 久美 先生',
            role: ' Administrative Office, General affairs (事務局・事務局 庶務)',
            interest: 'Morning yoga, Stretching (朝ヨガ・ストレッチ)',
            message: {
                japanese: '日々の自分が向上して皆様に笑顔で応対していきます！',
                english: 'I hope to improve myself day by day and respond to everyone with a smile!',
            },
            image: teacher15
        },
        {
            id: 16,
            name: 'Nakano Hiromi Sensei',
            nameJapanese: '中野 ひろみ 先生',
            role: 'Administrative Office, General affairs (事務局・事務局 庶務)',
            interest: 'New store exploration, Reading, Ballpoint pen collecting (新店舗・読書・ペン習字)',
            message: {
                japanese: '学校での生活を十分に楽しんで、かつ勉強に励んでください！',
                english: 'Please feel free to talk to me about anything regarding school life, even if it seems like a small concern!',
            },
            image: teacher16
        },
        {
            id: 17,
            name: 'Fukami Ryunosuke Sensei',
            nameJapanese: '深見 竜之介 先生',
            role: 'Academic Affairs Administration (学務事務)',
            interest: 'Games, YouTube viewing (ゲーム・YouTube鑑賞)',
            message: {
                japanese: '専方として授業やイベントなど様々な準備に関わっています。直接お話しすることは少ないですが、よろしくお願いします！',
                english: 'As a specialist, I am involved in various preparations such as classes and events.',
            },
            image: teacher17
        },
        {
            id: 18,
            name: 'Mizuno Miki Sensei',
            nameJapanese: '水野 美希 先生',
            role: 'Administrative Office (事務局)',
            interest: 'Sports viewing, Karaoke (スポーツ観戦・カラオケ)',
            message: {
                japanese: 'I don\'t have many opportunities to speak directly with everyone, but please feel free to approach me! ',
                english: '皆さんと直接お話しする機会は少ないですが、よろしくお願いします。１日1日を大切に学校生活楽しんでください！',
            },
            image: teacher18
        }
    ];

        // ...existing code...
    const SwiperSlideCard = ({ member }) => (
        <div className="card-container relative group">
            <div className="card-blob">
                <div className="bg"></div>
                <div className="blob"></div>
                
                <div className="card-inner relative overflow-hidden">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:blur-md group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b332c8ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80';
                        }}
                    />
                    
                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                                {/* // ...existing code... */}
                {/* Content that appears on hover with smaller fonts */}
                <div className="card-content absolute inset-0 flex flex-col justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {/* Title with very small font */}
                    <h3 className="text-sm md:text-base font-bold text-white text-center mb-2 leading-tight z-10">
                        <span className="block text-xs md:text-sm">{member.nameJapanese}</span>
                        <span className="block text-xs font-medium opacity-90">{member.name}</span>
                    </h3>
                    
                    {/* Role with very small font */}
                    <div className="flex items-center justify-center mb-2 text-center z-10">
                        <GraduationCap className="w-3 h-3 mr-1 text-blue-400" />
                        <span className="text-xs font-semibold text-white line-clamp-2">{member.role}</span>
                    </div>
                    
                    {/* Interest/Sport with very small font */}
                    <div className="flex items-center justify-center mb-2 text-center z-10">
                        <Star className="w-2 h-2 mr-1 text-yellow-400" />
                        <span className="text-xs text-white opacity-90 line-clamp-1">{member.interest || member.sport}</span>
                    </div>
                    
                    {/* Messages with very small fonts */}
                    <div className="text-center space-y-1 max-w-full z-10">
                        <div className="text-xs font-medium text-blue-200 leading-tight line-clamp-2">
                            {member.message.japanese}
                        </div>
                        <div className="text-xs font-medium text-green-200 leading-tight line-clamp-2">
                            {member.message.english}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
 
    return (
        <div className="about-page">
            {/* Hero Section - Keep existing */}
            <section 
                ref={heroRef}
                className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center ${isHeroVisible ? 'visible' : ''}`}
            >
                <div className="about-hero-elements"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-8">
                            <span className="material-icons mr-2">people</span>
                            {t('Hello, Welcome to Our Faculty') || 'Hello, Welcome to Our Faculty'}
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
                            {t('Meet Our Amazing') || 'Meet Our Amazing'} <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block md:inline">
                                {t('Faculty Team') || 'Faculty Team'}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
                            {t('Hello! Welcome to our dedicated team of passionate educators and professionals who are committed to transforming your learning journey. Our faculty brings together industry expertise and academic excellence to provide you with world-class education.') || 'Hello! Welcome to our dedicated team of passionate educators and professionals who are committed to transforming your learning journey. Our faculty brings together industry expertise and academic excellence to provide you with world-class education.'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    50+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('Expert Faculty Members') || 'Expert Faculty Members'}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                    15+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('Years Combined Experience') || 'Years Combined Experience'}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                    95%
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('Student Satisfaction Rate') || 'Student Satisfaction Rate'}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                    100+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('Professional Certifications') || 'Professional Certifications'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="#team-members" 
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                            >
                                <span className="material-icons mr-2">groups</span>
                                {t('Explore Our Faculty') || 'Explore Our Faculty'}
                            </a>
                            <a 
                                href="/contact" 
                                className="inline-flex items-center px-8 py-4 border-2 border-gray-800 text-gray-800 font-semibold text-lg rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            >
                                <span className="material-icons mr-2">work</span>
                                {t('Join Our Team') || 'Join Our Team'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section with Swiper */}
            <section id="team-members" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our <span className="text-blue-600">Faculty Teams</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our dedicated team of professionals brings years of industry experience and passion for education to help you succeed in your learning journey.
                        </p>
                    </div>

                    {/* // Update the Swiper section */}
                    <div className="swiper-container">
                        <Swiper
                            speed={600}
                            parallax={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            navigation={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            modules={[Parallax, Pagination, Navigation, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 35,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                                1280: {
                                    slidesPerView: 4,
                                    spaceBetween: 45,
                                },
                            }}
                            className="team-swiper"
                        >
                            {/* Parallax background element */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-30"
                                data-swiper-parallax="-23%"
                            ></div>
                            
                            {allTeamMembers.map((member) => (
                                <SwiperSlide key={member.id} className="h-auto">
                                    <div className="h-full min-h-[400px] flex items-center justify-center">
                                        <SwiperSlideCard member={member} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Team;
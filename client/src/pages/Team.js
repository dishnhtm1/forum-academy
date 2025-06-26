import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {Users, Mail, Phone, MapPin, Award, BookOpen, Calendar, Linkedin, Twitter, Github, GraduationCap, Shield, Star, Clock, Building, User, X, UserCheck, Briefcase, Settings, Handshake, Heart, MessageCircle, Quote } from 'lucide-react';
import { useScrollToSection } from '../hooks/useScrollToSection';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/parallax';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Import required modules - Updated for Swiper v9
import { Parallax, Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper';

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
import teacher18 from '../assets/teachers/水野先生.jpg';
import teacher17 from '../assets/teachers/深見先生.jpg';

const Team = () => {
    const { t } = useTranslation();
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const heroRef = useRef(null);

    useScrollToSection();

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

    // Update your createHeroAnimatedElements function
    const createHeroAnimatedElements = () => {
        const container = document.querySelector('.about-hero-elements');
        if (!container) return;
        
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create animated shapes (keep as is)
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
        
        // Replace Material Icons with Lucide React icons
        const iconComponents = [
            { name: 'Users', color: '#3B82F6' },
            { name: 'GraduationCap', color: '#8B5CF6' },
            { name: 'Building2', color: '#10B981' },
            { name: 'Heart', color: '#F59E0B' },
            { name: 'Star', color: '#EF4444' },
            { name: 'Award', color: '#06B6D4' }
        ];
        
        for (let i = 0; i < 6; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'about-hero-icon';
            
            const x = 10 + (Math.random() * 80);
            const y = 10 + (Math.random() * 80);
            const delay = Math.random() * 5;
            
            iconWrapper.style.left = `${x}%`;
            iconWrapper.style.top = `${y}%`;
            iconWrapper.style.animationDelay = `${delay}s`;
            iconWrapper.style.position = 'absolute';
            iconWrapper.style.animation = 'float 6s ease-in-out infinite';
            
            // Create SVG icon instead of material icon
            const iconData = iconComponents[i % iconComponents.length];
            iconWrapper.innerHTML = `
                <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300" style="background-color: ${iconData.color}20; border: 2px solid ${iconData.color}40;">
                    <svg class="w-6 h-6" style="color: ${iconData.color};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${getSVGPath(iconData.name)}
                    </svg>
                </div>
            `;
            
            container.appendChild(iconWrapper);
        }
    };
    
    // Helper function to get SVG paths for icons
    const getSVGPath = (iconName) => {
        const paths = {
            'Users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"/>',
            'GraduationCap': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>',
            'Building2': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
            'Heart': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
            'Star': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>',
            'Award': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>'
        };
        return paths[iconName] || paths['Star'];
    };

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
            nameJapanese: '浅野 篤彦 先生',
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

    const EnhancedTeacherCard = ({ member, index }) => (
        <div className="relative h-full">
            {/* Main Card Container */}
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 h-full min-h-[500px] border border-gray-100">
                
                {/* Gradient Overlay Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <Heart className="w-4 h-4 text-white" />
                    </div>
                </div>
                
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b332c8ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80';
                        }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Available</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="relative p-6 z-10">
                    {/* Name Section */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                            {member.nameJapanese}
                        </h3>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            {member.name}
                        </p>
                        
                        {/* Role Badge */}
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{member.role}</span>
                        </div>
                    </div>
                    
                    {/* Interest Section */}
                    <div className="mb-4">
                        <div className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {member.interest}
                            </p>
                        </div>
                    </div>
                    
                    {/* Message Preview */}
                    <div className="space-y-3">
                        {/* Japanese Message */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100">
                            <div className="flex items-start space-x-2">
                                <Quote className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                                <p className="text-xs text-blue-700 line-clamp-2 leading-relaxed font-medium">
                                    {member.message.japanese}
                                </p>
                            </div>
                        </div>
                        
                        {/* English Message */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
                            <div className="flex items-start space-x-2">
                                <Quote className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-xs text-green-700 line-clamp-2 leading-relaxed font-medium">
                                    {member.message.english}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                            <MessageCircle className="w-4 h-4" />
                            <span>Connect</span>
                        </button>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-400/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                            {t('team.hero.badge')}
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
                            {t('team.hero.title')} <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block md:inline">
                                {t('team.hero.highlight')}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
                            {t('team.hero.description')}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    50+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('team.hero.stats.facultyMembers')}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                    15+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('team.hero.stats.experience')}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                    95%
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('team.hero.stats.satisfactionRate')}
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                    100+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                                    {t('team.hero.stats.certifications')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={() => document.getElementById('team-members').scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                            >
                                <span className="material-icons mr-2">groups</span>
                                {t('team.hero.buttons.exploreFaculty')}
                            </button>
                            <a 
                                href="/contact" 
                                className="inline-flex items-center px-8 py-4 border-2 border-gray-800 text-gray-800 font-semibold text-lg rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            >
                                <span className="material-icons mr-2">work</span>
                                {t('team.hero.buttons.joinTeam')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Team Section with Advanced Swiper */}
            <section id="team-members" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="relative">
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-lg">
                                    <Users className="w-5 h-5 mr-2" />
                                    {t('team.faculty.badge')}
                                </div>
                                
                                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                    {t('team.faculty.title')} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t('team.faculty.highlight')}</span>
                                    <br />
                                    <span className="text-3xl md:text-4xl font-light text-gray-600">{t('team.faculty.subtitle')}</span>
                                </h2>
                                
                                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                    {t('team.faculty.description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Swiper Container */}
                    <div className="relative">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 rounded-3xl opacity-30"></div>
                        
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            speed={800}
                            coverflowEffect={{
                                rotate: 15,
                                stretch: 0,
                                depth: 300,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                                dynamicMainBullets: 5,
                            }}
                            navigation={true}
                            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                            className="faculty-swiper pb-16"
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                    coverflowEffect: {
                                        rotate: 10,
                                        depth: 200,
                                    },
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                    coverflowEffect: {
                                        rotate: 15,
                                        depth: 250,
                                    },
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                    coverflowEffect: {
                                        rotate: 15,
                                        depth: 300,
                                    },
                                },
                            }}
                        >
                            {allTeamMembers.map((member, index) => (
                                <SwiperSlide key={member.id} className="!w-80 !h-auto">
                                    <div className="p-4 h-full">
                                        <EnhancedTeacherCard member={member} index={index} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Industry Partners Section - Keep existing */}
            <section id="industry-partners" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-8">
                            <Handshake className="w-4 h-4 mr-2" />
                            {t('team.industryPartners.badge')}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('team.industryPartners.title')}</span>
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t('team.industryPartners.description')}
                        </p>
                    </div>

                    {/* Partnership Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Briefcase className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                {t('team.industryPartners.benefits.internships.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('team.industryPartners.benefits.internships.description')}
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                {t('team.industryPartners.benefits.mentorship.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('team.industryPartners.benefits.mentorship.description')}
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                                {t('team.industryPartners.benefits.placement.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('team.industryPartners.benefits.placement.description')}
                            </p>
                        </div>
                    </div>

                    {/* Partner Companies Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-center">
                        {/* Industry-Academia Collaboration Partners */}
                        {[
                            { 
                                name: 'Adam Innovations', 
                                country: 'Japan', 
                                logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=60&fit=crop&auto=format', 
                                type: 'Digital Consulting',
                                fallbackEmoji: '🚀'
                            },
                            { 
                                name: 'Neuland Japan', 
                                country: 'Japan', 
                                logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=60&fit=crop&auto=format', 
                                type: 'BPO Services',
                                fallbackEmoji: '💼'
                            },
                            { 
                                name: 'Creanies Co.', 
                                country: 'Japan', 
                                logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=60&fit=crop&auto=format', 
                                type: 'System Engineering',
                                fallbackEmoji: '🌐'
                            },
                            { 
                                name: 'Xpelize', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=60&fit=crop&auto=format', 
                                type: 'IT Solutions',
                                fallbackEmoji: '⚡'
                            },
                            { 
                                name: 'Divama Technologies', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=60&fit=crop&auto=format', 
                                type: 'Software Development',
                                fallbackEmoji: '💻'
                            },
                            { 
                                name: 'ULTS Global', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=60&fit=crop&auto=format', 
                                type: 'Technology Services',
                                fallbackEmoji: '🏢'
                            },
                            { 
                                name: 'LBS', 
                                country: 'Poland', 
                                logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=60&fit=crop&auto=format', 
                                type: 'Business Solutions',
                                fallbackEmoji: '📊'
                            },
                            { 
                                name: 'LOOPS', 
                                country: 'Sri Lanka', 
                                logo: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=100&h=60&fit=crop&auto=format', 
                                type: 'Software Solutions',
                                fallbackEmoji: '🔄'
                            },
                            { 
                                name: 'Neovibe Technologies', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=100&h=60&fit=crop&auto=format', 
                                type: 'Tech Innovation',
                                fallbackEmoji: '🎯'
                            },
                            { 
                                name: 'Tech Mahindra', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=60&fit=crop&auto=format', 
                                type: 'IT Services',
                                fallbackEmoji: '🛠️'
                            },
                            { 
                                name: 'Germi Software', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=60&fit=crop&auto=format', 
                                type: 'Software Development',
                                fallbackEmoji: '💡'
                            },
                            { 
                                name: 'NetObjex', 
                                country: 'USA', 
                                logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=60&fit=crop&auto=format', 
                                type: 'IoT Solutions',
                                fallbackEmoji: '🌍'
                            },
                            { 
                                name: 'DESAQT', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1581093458791-9d42e1e36b7f?w=100&h=60&fit=crop&auto=format', 
                                type: 'Engineering Solutions',
                                fallbackEmoji: '🔧'
                            },
                            { 
                                name: 'Infogain Auto Technologies', 
                                country: 'India', 
                                logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=60&fit=crop&auto=format', 
                                type: 'Automotive IT',
                                fallbackEmoji: '🚗'
                            },
                            { 
                                name: 'X2 Holdings', 
                                country: 'Japan/Vietnam', 
                                logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=60&fit=crop&auto=format', 
                                type: 'Business Holdings',
                                fallbackEmoji: '✖️'
                            },
                            { 
                                name: 'Repo Inc.', 
                                country: 'Japan', 
                                logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=60&fit=crop&auto=format', 
                                type: 'Technology Services',
                                fallbackEmoji: '📁'
                            },
                            { 
                                name: 'Ras Asha Consulting', 
                                country: 'Japan', 
                                logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=60&fit=crop&auto=format', 
                                type: 'Business Consulting',
                                fallbackEmoji: '📈'
                            }
                        ].map((partner, index) => (
                            <div 
                                key={index}
                                className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 text-center"
                            >
                                <div className="mb-3 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="text-2xl hidden">
                                        {partner.fallbackEmoji}
                                    </div>
                                </div>
                                <div className="text-xs font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                                    {partner.name}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    {partner.country}
                                </div>
                                <div className="text-xs text-purple-600 font-medium">
                                    {partner.type}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {t('team.industryPartners.cta.title')}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                {t('team.industryPartners.cta.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/apply"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <UserCheck className="w-5 h-5 mr-2" />
                                    {t('team.industryPartners.cta.buttons.joinProgram')}
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold text-lg rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                >
                                    <Building className="w-5 h-5 mr-2" />
                                    {t('team.industryPartners.cta.buttons.partnerWithUs')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Student Testimonials Section - Light Theme */}
            <section id="student-testimonials" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>
            
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-green-100 text-green-600 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider mb-8">
                            <Star className="w-4 h-4 mr-2" />
                            {t('team.testimonials.badge')}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {t('team.testimonials.title')} <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{t('team.testimonials.highlight')}</span>
                            <br />
                            <span className="text-2xl md:text-3xl font-light text-gray-600">{t('team.testimonials.subtitle')}</span>
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            {t('team.testimonials.description')}
                        </p>
                    </div>
            
                    {/* Interactive Testimonials Grid - Light Theme */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {/* Testimonial 1 - Light Enhanced */}
                        <div className="group relative">
                            {/* Subtle glowing border effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-200 to-blue-300 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                                {/* Profile Section */}
                                <div className="flex items-center mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-white font-bold text-xl">YS</span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors duration-300">
                                            {t('team.testimonials.students.yuki.name')}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-medium">{t('team.testimonials.students.yuki.role')}</p>
                                        <p className="text-emerald-600 text-xs font-bold">@ {t('team.testimonials.students.yuki.company')}</p>
                                    </div>
                                </div>
            
                                {/* Rating with animation */}
                                <div className="flex items-center mb-4 space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className="w-5 h-5 text-yellow-400 fill-current transform transition-transform duration-200 hover:scale-125" 
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm font-medium">5.0</span>
                                </div>
            
                                {/* Quote */}
                                <div className="relative mb-6">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-200" />
                                    <p className="text-gray-700 leading-relaxed italic pl-6">
                                        "{t('team.testimonials.students.yuki.quote')}"
                                    </p>
                                </div>
            
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                                        {t('team.testimonials.students.yuki.year')}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                        {t('team.testimonials.students.yuki.program')}
                                    </span>
                                </div>
            
                                {/* Contact button */}
                                <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg">
                                    {t('team.testimonials.connectButton')}
                                </button>
                            </div>
                        </div>
            
                        {/* Testimonial 2 - Light Enhanced */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-200 to-teal-300 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-green-100 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
                                <div className="flex items-center mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-white font-bold text-xl">AK</span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-300">
                                            {t('team.testimonials.students.arjun.name')}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-medium">{t('team.testimonials.students.arjun.role')}</p>
                                        <p className="text-green-600 text-xs font-bold">@ {t('team.testimonials.students.arjun.company')}</p>
                                    </div>
                                </div>
            
                                <div className="flex items-center mb-4 space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className="w-5 h-5 text-yellow-400 fill-current transform transition-transform duration-200 hover:scale-125" 
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm font-medium">5.0</span>
                                </div>
            
                                <div className="relative mb-6">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-green-200" />
                                    <p className="text-gray-700 leading-relaxed italic pl-6">
                                        "{t('team.testimonials.students.arjun.quote')}"
                                    </p>
                                </div>
            
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                        {t('team.testimonials.students.arjun.year')}
                                    </span>
                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
                                        {t('team.testimonials.students.arjun.program')}
                                    </span>
                                </div>
            
                                <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg">
                                    {t('team.testimonials.connectButton')}
                                </button>
                            </div>
                        </div>
            
                        {/* Continue similar pattern for other testimonials... */}
                        {/* I'll show one more example and you can continue the pattern */}
                        
                        {/* Testimonial 3 - Light Enhanced */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-200 to-pink-300 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-red-100 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                                <div className="flex items-center mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-white font-bold text-xl">MT</span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors duration-300">
                                            {t('team.testimonials.students.maria.name')}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-medium">{t('team.testimonials.students.maria.role')}</p>
                                        <p className="text-red-600 text-xs font-bold">@ {t('team.testimonials.students.maria.company')}</p>
                                    </div>
                                </div>
            
                                <div className="flex items-center mb-4 space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm font-medium">5.0</span>
                                </div>
            
                                <div className="relative mb-6">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-red-200" />
                                    <p className="text-gray-700 leading-relaxed italic pl-6">
                                        "{t('team.testimonials.students.maria.quote')}"
                                    </p>
                                </div>
            
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                        {t('team.testimonials.students.maria.year')}
                                    </span>
                                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">
                                        {t('team.testimonials.students.maria.program')}
                                    </span>
                                </div>
            
                                <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg">
                                    {t('team.testimonials.connectButton')}
                                </button>
                            </div>
                        </div>
            
                        {/* Continue with testimonials 4, 5, 6 using similar pattern but with different colors:
                            - Testimonial 4: indigo/blue colors
                            - Testimonial 5: purple/pink colors  
                            - Testimonial 6: orange/red colors
                        */}
                    </div>
            
                    {/* Light-themed Success Statistics */}
                    <div className="relative mb-20">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-3xl blur opacity-50"></div>
                        
                        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] [background-size:20px_20px]"></div>
                            
                            <div className="relative z-10">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                                        <Award className="w-5 h-5 mr-2" />
                                        {t('team.testimonials.successStats.badge')}
                                    </div>
                                    
                                    <h3 className="text-4xl font-black text-gray-900 mb-4">
                                        {t('team.testimonials.successStats.title')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('team.testimonials.successStats.highlight')}</span>
                                    </h3>
                                    <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                                        {t('team.testimonials.successStats.description')}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="text-center group">
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-500">
                                                <GraduationCap className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-5xl font-black text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            {t('team.testimonials.successStats.employmentRate.value')}
                                        </div>
                                        <div className="text-gray-900 font-bold text-lg mb-2">{t('team.testimonials.successStats.employmentRate.title')}</div>
                                        <div className="text-gray-600 text-sm">{t('team.testimonials.successStats.employmentRate.description')}</div>
                                    </div>
                                    
                                    <div className="text-center group">
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-500">
                                                <span className="text-white font-bold text-2xl">¥</span>
                                            </div>
                                        </div>
                                        <div className="text-5xl font-black text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            {t('team.testimonials.successStats.averageSalary.value')}
                                        </div>
                                        <div className="text-gray-900 font-bold text-lg mb-2">{t('team.testimonials.successStats.averageSalary.title')}</div>
                                        <div className="text-gray-600 text-sm">{t('team.testimonials.successStats.averageSalary.description')}</div>
                                    </div>
                                    
                                    <div className="text-center group">
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-500">
                                                <Clock className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-5xl font-black text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            {t('team.testimonials.successStats.jobSearchTime.value')}
                                        </div>
                                        <div className="text-gray-900 font-bold text-lg mb-2">{t('team.testimonials.successStats.jobSearchTime.title')}</div>
                                        <div className="text-gray-600 text-sm">{t('team.testimonials.successStats.jobSearchTime.description')}</div>
                                    </div>
                                    
                                    <div className="text-center group">
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-500">
                                                <Building className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-5xl font-black text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            {t('team.testimonials.successStats.partnerCompanies.value')}
                                        </div>
                                        <div className="text-gray-900 font-bold text-lg mb-2">{t('team.testimonials.successStats.partnerCompanies.title')}</div>
                                        <div className="text-gray-600 text-sm">{t('team.testimonials.successStats.partnerCompanies.description')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    {/* Light-themed Call to Action */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-3xl blur opacity-50"></div>
                        
                        <div className="relative bg-gradient-to-br from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-2xl overflow-hidden">
                            <div className="absolute top-6 left-6 w-20 h-20 bg-blue-200/50 rounded-full blur-xl"></div>
                            <div className="absolute bottom-6 right-6 w-32 h-32 bg-purple-200/50 rounded-full blur-xl"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-200/50 rounded-full blur-xl"></div>
                            
                            <div className="relative z-10 text-center">
                                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-lg">
                                    <Star className="w-6 h-6 mr-3" />
                                    {t('team.testimonials.cta.badge')}
                                    <Star className="w-6 h-6 ml-3" />
                                </div>
                                
                                <h3 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                    {t('team.testimonials.cta.title')} <br />
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {t('team.testimonials.cta.highlight')}
                                    </span>
                                </h3>
                                
                                <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                                    {t('team.testimonials.cta.description')}
                                </p>
                                
                                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-12">
                                    <Link
                                        to="/apply"
                                        className="group relative inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
                                    >
                                        <GraduationCap className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform duration-300" />
                                        <span>{t('team.testimonials.cta.buttons.startJourney')}</span>
                                    </Link>
                                    
                                    <Link
                                        to="/testimonials"
                                        className="group relative inline-flex items-center px-12 py-6 border-3 border-blue-500 text-blue-600 font-bold text-xl rounded-full hover:bg-blue-500 hover:text-white transition-all duration-500 hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Star className="w-7 h-7 mr-4 group-hover:rotate-180 transition-transform duration-700" />
                                        <span>{t('team.testimonials.cta.buttons.readMoreStories')}</span>
                                    </Link>
                                </div>
                                
                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2 group">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="group-hover:text-blue-600 transition-colors">{t('team.testimonials.cta.trustIndicators.noFee')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 group">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span className="group-hover:text-purple-600 transition-colors">{t('team.testimonials.cta.trustIndicators.response')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 group">
                                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                        <span className="group-hover:text-pink-600 transition-colors">{t('team.testimonials.cta.trustIndicators.support')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 group">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="group-hover:text-green-600 transition-colors">{t('team.testimonials.cta.trustIndicators.certification')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Team;
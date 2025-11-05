import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import data1Video from "../assets/videos/vid1.mp4";
import data2Video from "../assets/videos/vid2.mp4";
import data3Video from "../assets/videos/vid3.mp4";
import data4Video from "../assets/videos/vid4.mp4";
import data5Video from "../assets/videos/vid5.mp4";
import data6Video from "../assets/videos/vid6.mp4";

const NewsSection = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [loadedVideos, setLoadedVideos] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleVideoLoad = (id) => {
    setLoadedVideos((prev) => ({ ...prev, [id]: true }));
  };

  const newsItems = [
    {
      id: 1,
      date: t("newsSection.items.techSymposium.date"),
      title: t("newsSection.items.techSymposium.title"),
      excerpt: t("newsSection.items.techSymposium.excerpt"),
      videoSrc: data1Video,
      fullContent: "/news/tech-symposium",
      category: "event",
      gradient: "from-blue-500 to-purple-600",
      iconBg: "from-blue-400 to-purple-500",
      glowColor: "blue-500/30",
    },
    {
      id: 2,
      date: t("newsSection.items.industryPartnership.date"),
      title: t("newsSection.items.industryPartnership.title"),
      excerpt: t("newsSection.items.industryPartnership.excerpt"),
      videoSrc: data2Video,
      fullContent: "/news/industry-partnership",
      category: "news",
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "from-emerald-400 to-teal-500",
      glowColor: "emerald-500/30",
    },
    {
      id: 3,
      date: t("newsSection.items.springOpenHouse.date"),
      title: t("newsSection.items.springOpenHouse.title"),
      excerpt: t("newsSection.items.springOpenHouse.excerpt"),
      videoSrc: data3Video,
      fullContent: "/news/spring-open-house",
      category: "event",
      gradient: "from-purple-500 to-pink-600",
      iconBg: "from-purple-400 to-pink-500",
      glowColor: "purple-500/30",
    },
    {
      id: 4,
      date: t("newsSection.items.studentAwards.date"),
      title: t("newsSection.items.studentAwards.title"),
      excerpt: t("newsSection.items.studentAwards.excerpt"),
      videoSrc: data4Video,
      fullContent: "/news/student-awards",
      category: "news",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "from-amber-400 to-orange-500",
      glowColor: "amber-500/30",
    },
    {
      id: 5,
      date: t("newsSection.items.careerFair.date"),
      title: t("newsSection.items.careerFair.title"),
      excerpt: t("newsSection.items.careerFair.excerpt"),
      videoSrc: data5Video,
      fullContent: "/news/career-fair",
      category: "event",
      gradient: "from-indigo-500 to-blue-600",
      iconBg: "from-indigo-400 to-blue-500",
      glowColor: "indigo-500/30",
    },
    {
      id: 6,
      date: t("newsSection.items.aiLab.date"),
      title: t("newsSection.items.aiLab.title"),
      excerpt: t("newsSection.items.aiLab.excerpt"),
      videoSrc: data6Video,
      fullContent: "/news/ai-lab",
      category: "news",
      gradient: "from-rose-500 to-pink-600",
      iconBg: "from-rose-400 to-pink-500",
      glowColor: "rose-500/30",
    },
  ];

  const filteredNews =
    filter === "all"
      ? newsItems
      : newsItems.filter((item) => item.category === filter);

  const getAnimationDelay = (index) => {
    return `${index * 150}ms`;
  };

  return (
    <section
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-slate-50 overflow-hidden"
      id="news"
      ref={sectionRef}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[900px] h-[900px] bg-gradient-to-tr from-emerald-400/10 via-teal-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-32 w-8 h-8 bg-purple-400/20 rotate-45 animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-emerald-400/20 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-32 right-1/3 w-10 h-10 bg-pink-400/20 rotate-12 animate-pulse delay-1500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full text-sm font-bold mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-30 animate-pulse"></div>
            <span className="material-icons text-lg relative z-10">
              article
            </span>
            <span className="relative z-10">
              {t("newsSection.header.badge")}
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
              {t("newsSection.header.title")}
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t("newsSection.header.subtitle")}
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Filter Buttons */}
        <div
          className={`flex justify-center items-center gap-4 mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              key: "all",
              label: t("newsSection.filters.all"),
              icon: "grid_view",
              gradient: "from-slate-600 to-gray-600",
            },
            {
              key: "news",
              label: t("newsSection.filters.news"),
              icon: "newspaper",
              gradient: "from-emerald-500 to-teal-600",
            },
            {
              key: "event",
              label: t("newsSection.filters.events"),
              icon: "event",
              gradient: "from-purple-500 to-indigo-600",
            },
          ].map((filterItem) => (
            <button
              key={filterItem.key}
              className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                filter === filterItem.key
                  ? `bg-gradient-to-r ${filterItem.gradient} text-white shadow-xl`
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:text-white shadow-lg border border-white/20"
              }`}
              onClick={() => setFilter(filterItem.key)}
            >
              {filter !== filterItem.key && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${filterItem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              )}
              <div className="relative z-10 flex items-center gap-2">
                <span className="material-icons text-lg">
                  {filterItem.icon}
                </span>
                {filterItem.label}
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredNews.map((item, index) => (
            <div
              key={item.id}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 cursor-pointer border border-white/20 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: getAnimationDelay(index) }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
              ></div>

              {/* Video Container */}
              <div className="relative h-64 overflow-hidden">
                {/* Loading State */}
                {!loadedVideos[item.id] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse delay-150"></div>
                    </div>
                    <span className="text-gray-600 font-medium mt-4">
                      {t("newsSection.loading")}
                    </span>
                  </div>
                )}

                {/* Video Element */}
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  onLoadedData={() => handleVideoLoad(item.id)}
                  style={{ opacity: loadedVideos[item.id] ? 1 : 0 }}
                >
                  <source src={item.videoSrc} type="video/mp4" />
                  {t("newsSection.videoNotSupported")}
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${item.gradient} text-white text-xs font-bold shadow-lg backdrop-blur-sm`}
                  >
                    <span className="material-icons text-sm mr-1">
                      {item.category === "event" ? "event" : "newspaper"}
                    </span>
                    {item.category === "event"
                      ? t("newsSection.categoryLabels.event")
                      : t("newsSection.categoryLabels.news")}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <span className="material-icons text-sm">schedule</span>
                  <span className="font-medium">{item.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                  {item.excerpt}
                </p>

                {/* Read More Button */}
                <a
                  href={item.fullContent}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:translate-x-1`}
                >
                  {t("newsSection.buttons.readMore")}
                  <span className="material-icons text-sm group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </a>

                {/* Floating Action Indicator */}
                {hoveredCard === item.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
                )}
              </div>

              {/* Animated Border */}
              <div
                className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <a
            href="/news"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">
              {t("newsSection.buttons.viewAllNews")}
            </span>
            <span className="material-icons relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              open_in_new
            </span>

            {/* Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

import React, { useState, useEffect, useRef } from "react";
import { Briefcase, Users, Award, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

// Easing function
const easeOutCubic = (x) => {
  return 1 - Math.pow(1 - x, 3);
};

// Custom hook for counter animation
const useCounter = (end, duration = 2000, start = 0, isVisible) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const frameRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const increment = Math.min(progress / duration, 1);
      const currentCount = Math.floor(
        start + (end - start) * easeOutCubic(increment)
      );

      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, start, isVisible]);

  return count;
};

// Separate component for each stat card
const StatCard = ({ stat, index, isVisible }) => {
  const animatedValue = useCounter(
    isVisible ? stat.value : 0,
    2000,
    0,
    isVisible
  );

  return (
    <div
      className={`group relative transition-all duration-700 transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-95"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Main Card */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-white/20 group-hover:border-white/40">
        {/* Gradient Background Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl`}
        ></div>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl blur-xl`}
        ></div>

        {/* Corner Accent */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-10 rounded-bl-3xl rounded-tr-3xl`}
        ></div>

        <div className="relative z-10">
          {/* Enhanced Icon Container */}
          <div className="relative mb-6">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
            >
              <div className="text-white drop-shadow-sm">{stat.icon}</div>
            </div>
            {/* Icon Glow */}
            <div
              className={`absolute top-0 left-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500`}
            ></div>

            {/* Floating Particles around Icon */}
            <div
              className={`absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r ${stat.color} rounded-full opacity-60 animate-pulse delay-300`}
            ></div>
            <div
              className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-r ${stat.color} rounded-full opacity-40 animate-pulse delay-700`}
            ></div>
          </div>

          {/* Enhanced Counter Display */}
          <div className="mb-4">
            <div className="flex items-end justify-center">
              <span
                className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
              >
                {animatedValue}
              </span>
              <span
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent ml-1 group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.suffix}
              </span>
            </div>
          </div>

          {/* Enhanced Label */}
          <p className="text-gray-700 font-semibold text-center text-sm md:text-base group-hover:text-gray-800 transition-colors duration-300 uppercase tracking-wider">
            {stat.label}
          </p>

          {/* Progress Bar Effect */}
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                stat.color
              } rounded-full transition-all duration-1000 ease-out ${
                isVisible ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Outer Glow on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10 rounded-3xl scale-95`}
      ></div>
    </div>
  );
};

function StatsSection() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Keep ALL your stats data structure - only replace text values
  const statsData = [
    {
      value: 95,
      suffix: "%",
      label: t("statsSection.stats.jobPlacement.label"),
      icon: <Briefcase size={32} />,
      color: "from-blue-500 to-blue-600",
      glowColor: "blue-500/20",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      value: 50,
      suffix: "+",
      label: t("statsSection.stats.industryPartners.label"),
      icon: <Users size={32} />,
      color: "from-emerald-500 to-emerald-600",
      glowColor: "emerald-500/20",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      value: 15,
      suffix: "+",
      label: t("statsSection.stats.programs.label"),
      icon: <Award size={32} />,
      color: "from-purple-500 to-purple-600",
      glowColor: "purple-500/20",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      value: 2000,
      suffix: "+",
      label: t("statsSection.stats.graduates.label"),
      icon: <GraduationCap size={32} />,
      color: "from-amber-500 to-amber-600",
      glowColor: "amber-500/20",
      bgGradient: "from-amber-50 to-amber-100",
    },
  ];

  // Keep ALL your particle animation code exactly as is
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 70;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(
          Math.random() * 100 + 155
        )}, ${Math.floor(Math.random() * 100 + 155)}, 0.${Math.floor(
          Math.random() * 5 + 2
        )})`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        maxConnections: 5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce on edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby particles
        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= p.maxConnections) break;

          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            connections++;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 130, 255, ${
              0.2 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Keep ALL your intersection observer code exactly as is
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 overflow-hidden"
    >
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -right-96 w-[900px] h-[900px] bg-gradient-to-tl from-cyan-400/10 via-emerald-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-32 right-32 w-8 h-8 bg-purple-400/20 rotate-45 animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-emerald-400/20 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-32 right-1/3 w-10 h-10 bg-amber-400/20 rotate-12 animate-pulse delay-1500"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full text-sm font-bold mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur opacity-30 animate-pulse"></div>
            <span className="material-icons text-lg relative z-10">
              analytics
            </span>
            <span className="relative z-10">
              {t("statsSection.header.badge")}
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              {t("statsSection.header.title")}
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t("statsSection.header.subtitle")}
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div
          className={`mt-20 flex justify-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

import React, { useState, useEffect, useRef } from "react";
import { Briefcase, Users, Award, GraduationCap } from "lucide-react";
import { useTranslation } from 'react-i18next'; // Add this import only
import "../styles/StatsSection.css"; // Assuming you have a CSS file for styling

function StatsSection() {
    const { t } = useTranslation(); // Add this line only
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Keep ALL your existing animated counter hook exactly as is
    const useCounter = (end, duration = 2000, start = 0) => {
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

    // Keep your easing function exactly as is
    const easeOutCubic = (x) => {
        return 1 - Math.pow(1 - x, 3);
    };

    // Keep ALL your stats data structure - only replace text values
    const statsData = [
        {
            value: 95,
            suffix: "%",
            label: t('statsSection.stats.jobPlacement.label'),
            icon: <Briefcase size={32} />,
            color: "#3b82f6",
        },
        {
            value: 50,
            suffix: "+",
            label: t('statsSection.stats.industryPartners.label'),
            icon: <Users size={32} />,
            color: "#10b981",
        },
        {
            value: 15,
            suffix: "+",
            label: t('statsSection.stats.programs.label'),
            icon: <Award size={32} />,
            color: "#8b5cf6",
        },
        {
            value: 2000,
            suffix: "+",
            label: t('statsSection.stats.graduates.label'),
            icon: <GraduationCap size={32} />,
            color: "#f59e0b",
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
                        ctx.strokeStyle = `rgba(100, 130, 255, ${0.2 * (1 - distance / 100)})`;
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

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="stats-section">
            <canvas ref={canvasRef} className="stats-canvas" />

            {/* Keep ALL decorative elements exactly as is */}
            <div className="stats-decoration stats-decoration-top-left"></div>
            <div className="stats-decoration stats-decoration-bottom-right"></div>

            <div className="stats-container">
                <div className="stats-header">
                    <h2 className="stats-title">
                        {t('statsSection.header.title')}
                        <span className="stats-title-underline"></span>
                    </h2>
                    <p className="stats-subtitle">
                        {t('statsSection.header.subtitle')}
                    </p>
                </div>

                <div className="stats-grid">
                    {statsData.map((stat, index) => {
                        const animatedValue = useCounter(
                            isVisible ? stat.value : 0,
                            2000,
                            0
                        );

                        return (
                            <div
                                key={index}
                                className={`stats-card ${isVisible ? "stats-card-visible" : ""}`}
                                style={{
                                    transitionDelay: `${index * 150}ms`,
                                    "--stat-color": stat.color,
                                }}
                            >
                                {/* Keep ALL background gradient accent exactly as is */}
                                <div className="stats-card-accent"></div>

                                <div className="stats-card-content">
                                    <div className="stats-icon-container">
                                        <div className="stats-icon">{stat.icon}</div>
                                    </div>

                                    <div className="stats-value">
                                        <span className="stats-counter">{animatedValue}</span>
                                        <span className="stats-suffix">{stat.suffix}</span>
                                    </div>

                                    <p className="stats-label">{stat.label}</p>
                                </div>

                                {/* Keep ALL decorative corner accent exactly as is */}
                                <div className="stats-card-corner"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default StatsSection;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';
import heroImage from '../assets/images/web3.png';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        // Create 3D elements when component mounts
        const createScene = () => {
            // Check if anime.js is available
            if (window.anime) {
                // Create world and particles
                const heroSection = document.querySelector('.hero-section');
                
                // Create scene container
                const scene = document.createElement('div');
                scene.classList.add('scene');
                
                // Create 3D world
                const world = document.createElement('div');
                world.classList.add('world');
                world.id = 'world';
                
                // Create floor
                const floor = document.createElement('div');
                floor.classList.add('floor');
                world.appendChild(floor);
                
                // Create cubes
                const numberOfCubes = 10;
                for (let i = 0; i < numberOfCubes; i++) {
                    const cube = document.createElement('div');
                    cube.classList.add('cube');
                    
                    // Random properties
                    const size = Math.random() * 60 + 40;
                    cube.style.width = `${size}px`;
                    cube.style.height = `${size}px`;
                    
                    // Position in 3D space
                    const x = (Math.random() - 0.5) * window.innerWidth;
                    const y = (Math.random() - 0.5) * window.innerHeight;
                    const z = Math.random() * -800;
                    
                    cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
                    
                    // Create cube faces
                    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
                    faces.forEach(face => {
                        const element = document.createElement('div');
                        element.classList.add('cube-face', face);
                        cube.appendChild(element);
                    });
                    
                    world.appendChild(cube);
                }
                
                scene.appendChild(world);
                
                // Create particles
                const particles = document.createElement('div');
                particles.classList.add('particles');
                particles.id = 'particles';
                
                // Add particles
                const numberOfParticles = 30;
                for (let i = 0; i < numberOfParticles; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    
                    // Random properties
                    const size = Math.random() * 6 + 2;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    
                    particle.style.left = `${x}%`;
                    particle.style.top = `${y}%`;
                    particle.style.opacity = Math.random() * 0.5 + 0.2;
                    
                    particles.appendChild(particle);
                }
                
                scene.appendChild(particles);
                
                // Add glow effects
                const glow1 = document.createElement('div');
                glow1.classList.add('glow', 'glow-1');
                const glow2 = document.createElement('div');
                glow2.classList.add('glow', 'glow-2');
                
                scene.appendChild(glow1);
                scene.appendChild(glow2);
                
                // Insert the scene as the first child of hero section
                heroSection.insertBefore(scene, heroSection.firstChild);
                
                // Animate elements
                // 3D world animation
                window.anime({
                    targets: '.world',
                    rotateZ: [0, 360],
                    easing: 'linear',
                    duration: 150000,
                    loop: true
                });
                
                // Floating animations for cubes
                window.anime({
                    targets: '.cube',
                    translateY: function() {
                        return window.anime.random(-50, 50);
                    },
                    translateZ: function() {
                        return window.anime.random(-200, 200);
                    },
                    rotateX: function() {
                        return window.anime.random(0, 360);
                    },
                    rotateY: function() {
                        return window.anime.random(0, 360);
                    },
                    easing: 'easeInOutQuad',
                    duration: function() {
                        return window.anime.random(8000, 15000);
                    },
                    delay: function() {
                        return window.anime.random(0, 2000);
                    },
                    loop: true,
                    direction: 'alternate'
                });
                
                // Particles animation
                window.anime({
                    targets: '.particle',
                    translateX: function() {
                        return window.anime.random(-100, 100);
                    },
                    translateY: function() {
                        return window.anime.random(-100, 100);
                    },
                    scale: function() {
                        return window.anime.random(0.5, 1.5);
                    },
                    opacity: function() {
                        return window.anime.random(0.1, 0.6);
                    },
                    easing: 'easeInOutQuad',
                    duration: function() {
                        return window.anime.random(3000, 8000);
                    },
                    delay: window.anime.stagger(50),
                    loop: true,
                    direction: 'alternate'
                });
                
                // Hero content animations
                window.anime({
                    targets: '.hero-title',
                    opacity: [0, 1],
                    translateY: [50, 0],
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: 300
                });
                
                window.anime({
                    targets: '.hero-description',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: 500
                });
                
                window.anime({
                    targets: '.hero-cta-group',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: 700
                });
                
                window.anime({
                    targets: '.hero-stats',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: 900
                });
                
                // Interactive mouse movement effect
                document.addEventListener('mousemove', function(e) {
                    const mouseX = e.clientX / window.innerWidth;
                    const mouseY = e.clientY / window.innerHeight;
                    
                    // Parallax effect on world
                    window.anime({
                        targets: '.world',
                        rotateX: 65 + (mouseY - 0.5) * 5,
                        rotateY: (mouseX - 0.5) * 10,
                        easing: 'easeOutExpo',
                        duration: 1000
                    });
                    
                    // Moving glow with cursor
                    window.anime({
                        targets: '.glow-1',
                        translateX: (mouseX - 0.5) * 100,
                        translateY: (mouseY - 0.5) * 100,
                        easing: 'easeOutExpo',
                        duration: 1000
                    });
                });
            }
        };
        
        createScene();
        
        return () => {
            clearTimeout(timer);
            // Clean up any event listeners if needed
            document.removeEventListener('mousemove', () => {});
        };
    }, []);
    
    return (
        <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
            {/* 3D background will be added via JavaScript */}
            
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">                        
                        <h1 className="hero-title">
                            Elevate Your Future with <br/>
                            <span className="highlight-text">Tech Education</span> That Works
                        </h1>
                        
                        <p className="hero-description">
                            Join Forum Information Academy for industry-driven tech training
                            that transforms beginners into professionals ready for today's
                            digital economy.
                        </p>
                        
                        <div className="hero-cta-group">
                            <Link to="/courses" className="btn btn-primary">
                                <span>Explore Programs</span>
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                            
                            <Link to="/apply" className="btn btn-outline">
                                <span>Apply Now</span>
                            </Link>
                        </div>
                        
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">93%</div>
                                <div className="stat-label">Job Placement</div>
                            </div>
                            
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Industry Partners</div>
                            </div>
                            
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">Years of Excellence</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-image-wrapper">
                        <div className="image-card">
                            <img 
                                src={heroImage} 
                                alt="Student at Forum Information Academy"
                                className="hero-image"
                            />
                            
                            <div className="image-overlay"></div>
                            
                            <div className="tech-tag-group">
                                <div className="tech-tag">
                                    <span className="material-icons">code</span>
                                    <span>Web Development</span>
                                </div>
                                <div className="tech-tag">
                                    <span className="material-icons">security</span>
                                    <span>Cybersecurity</span>
                                </div>
                                <div className="tech-tag">
                                    <span className="material-icons">analytics</span>
                                    <span>Data Science</span>
                                </div>
                                <div className="tech-tag">
                                    <span className="material-icons">cloud</span>
                                    <span>Cloud Computing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
import React, { useEffect, useState } from 'react';
import '../styles/PreLoader.css';

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    
    // Simulate loading progress
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + Math.random() * 10;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 200);
        
        return () => clearInterval(timer);
    }, []);
    
    // Add a script to load the dotlottie player if needed
    useEffect(() => {
        if (!document.querySelector('script[src*="dotlottie-player"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
            script.type = 'module';
            document.head.appendChild(script);
        }
    }, []);

    return (
        <div id="loader-wrapper">
            <div className="loader-content">
                <div className="loader-logo">
                    {/* Replacing the circle with animated rings design */}
                    <div className="ring-container">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="logo-text">FORUM ACADEMY</div>
                    </div>
                </div>
                <div className="loader-progress-container">
                    <div className="loader-progress-bar" style={{ width: `${progress}%` }}></div>
                    <div className="loader-percentage">{Math.round(progress)}%</div>
                </div>
                
                <div className="loader-message">
                    {progress < 30 && "Initializing educational resources..."}
                    {progress >= 30 && progress < 60 && "Preparing your learning journey..."}
                    {progress >= 60 && progress < 90 && "Loading interactive content..."}
                    {progress >= 90 && "Almost ready!"}
                </div>
                
                <div className="tech-icons-container">
                    <div className={`tech-icon ${progress > 20 ? 'active' : ''}`}>
                        <span className="material-icons">code</span>
                        <span className="icon-label">Development</span>
                    </div>
                    <div className={`tech-icon ${progress > 40 ? 'active' : ''}`}>
                        <span className="material-icons">cloud</span>
                        <span className="icon-label">Cloud</span>
                    </div>
                    <div className={`tech-icon ${progress > 60 ? 'active' : ''}`}>
                        <span className="material-icons">security</span>
                        <span className="icon-label">Security</span>
                    </div>
                    <div className={`tech-icon ${progress > 80 ? 'active' : ''}`}>
                        <span className="material-icons">analytics</span>
                        <span className="icon-label">Data</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
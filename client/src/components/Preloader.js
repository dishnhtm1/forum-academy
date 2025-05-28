import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/PreLoader.css';

const Preloader = () => {
    const { t } = useTranslation(); // Add this line only
    const [progress, setProgress] = useState(0);
    
    // Keep ALL your existing loading progress logic exactly as is
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + Math.random() * 10;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 200);
        
        return () => clearInterval(timer);
    }, []);
    
    // Keep ALL your existing dotlottie script loading exactly as is
    useEffect(() => {
        if (!document.querySelector('script[src*="dotlottie-player"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
            script.type = 'module';
            document.head.appendChild(script);
        }
    }, []);

    // Get loading message based on progress - only replace text
    const getLoadingMessage = () => {
        if (progress < 30) return t('preloader.messages.initializing');
        if (progress >= 30 && progress < 60) return t('preloader.messages.preparing');
        if (progress >= 60 && progress < 90) return t('preloader.messages.loading');
        if (progress >= 90) return t('preloader.messages.almostReady');
        return '';
    };

    return (
        <div id="loader-wrapper">
            <div className="loader-content">
                <div className="loader-logo">
                    {/* Keep ALL your animated rings design exactly as is */}
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
                    {getLoadingMessage()}
                </div>
                
                <div className="tech-icons-container">
                    <div className={`tech-icon ${progress > 20 ? 'active' : ''}`}>
                        <span className="material-icons">code</span>
                        <span className="icon-label">{t('preloader.techIcons.development')}</span>
                    </div>
                    <div className={`tech-icon ${progress > 40 ? 'active' : ''}`}>
                        <span className="material-icons">cloud</span>
                        <span className="icon-label">{t('preloader.techIcons.cloud')}</span>
                    </div>
                    <div className={`tech-icon ${progress > 60 ? 'active' : ''}`}>
                        <span className="material-icons">security</span>
                        <span className="icon-label">{t('preloader.techIcons.security')}</span>
                    </div>
                    <div className={`tech-icon ${progress > 80 ? 'active' : ''}`}>
                        <span className="material-icons">analytics</span>
                        <span className="icon-label">{t('preloader.techIcons.data')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
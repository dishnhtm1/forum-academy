import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Preloader = () => {
    const { t } = useTranslation();
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
        <>
            <div style={styles.loaderWrapper}>
                <div style={styles.loaderContent}>
                    <div style={styles.loaderLogo}>
                        <div style={styles.ringContainer}>
                            <div style={{...styles.ring, ...styles.ring1}}></div>
                            <div style={{...styles.ring, ...styles.ring2}}></div>
                            <div style={{...styles.ring, ...styles.ring3}}></div>
                            <div style={{...styles.ring, ...styles.ring4}}></div>
                            <div style={styles.logoText}>FORUM ACADEMY</div>
                        </div>
                    </div>
                    <div style={styles.loaderProgressContainer}>
                        <div style={{...styles.loaderProgressBar, width: `${progress}%`}}>
                            <div style={styles.shimmer}></div>
                        </div>
                        <div style={styles.loaderPercentage}>{Math.round(progress)}%</div>
                    </div>
                    
                    <div style={styles.loaderMessage}>
                        {getLoadingMessage()}
                    </div>
                    
                    <div style={styles.techIconsContainer}>
                        <div style={{
                            ...styles.techIcon,
                            ...(progress > 20 ? styles.techIconActive : {}),
                            ...(progress > 20 ? styles.techIcon1Active : {})
                        }}>
                            <span className="material-icons" style={{
                                ...styles.materialIcons,
                                ...(progress > 20 ? styles.materialIcon1Active : {})
                            }}>code</span>
                            <span style={{
                                ...styles.iconLabel,
                                ...(progress > 20 ? styles.iconLabelActive : {})
                            }}>{t('preloader.techIcons.development')}</span>
                        </div>
                        <div style={{
                            ...styles.techIcon,
                            ...(progress > 40 ? styles.techIconActive : {}),
                            ...(progress > 40 ? styles.techIcon2Active : {})
                        }}>
                            <span className="material-icons" style={{
                                ...styles.materialIcons,
                                ...(progress > 40 ? styles.materialIcon2Active : {})
                            }}>cloud</span>
                            <span style={{
                                ...styles.iconLabel,
                                ...(progress > 40 ? styles.iconLabelActive : {})
                            }}>{t('preloader.techIcons.cloud')}</span>
                        </div>
                        <div style={{
                            ...styles.techIcon,
                            ...(progress > 60 ? styles.techIconActive : {}),
                            ...(progress > 60 ? styles.techIcon3Active : {})
                        }}>
                            <span className="material-icons" style={{
                                ...styles.materialIcons,
                                ...(progress > 60 ? styles.materialIcon3Active : {})
                            }}>security</span>
                            <span style={{
                                ...styles.iconLabel,
                                ...(progress > 60 ? styles.iconLabelActive : {})
                            }}>{t('preloader.techIcons.security')}</span>
                        </div>
                        <div style={{
                            ...styles.techIcon,
                            ...(progress > 80 ? styles.techIconActive : {}),
                            ...(progress > 80 ? styles.techIcon4Active : {})
                        }}>
                            <span className="material-icons" style={{
                                ...styles.materialIcons,
                                ...(progress > 80 ? styles.materialIcon4Active : {})
                            }}>analytics</span>
                            <span style={{
                                ...styles.iconLabel,
                                ...(progress > 80 ? styles.iconLabelActive : {})
                            }}>{t('preloader.techIcons.data')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations in style tag */}
            <style>{`
                @keyframes rotate1 {
                    from { transform: rotateX(50deg) rotateZ(110deg); }
                    to { transform: rotateX(50deg) rotateZ(470deg); }
                }

                @keyframes rotate2 {
                    from { transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg); }
                    to { transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg); }
                }

                @keyframes rotate3 {
                    from { transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg); }
                    to { transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg); }
                }

                @keyframes rotate4 {
                    from { transform: rotateX(70deg) rotateZ(270deg); }
                    to { transform: rotateX(70deg) rotateZ(630deg); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(71, 85, 105, 0.3)); }
                    100% { transform: scale(1.03); filter: drop-shadow(0 0 15px rgba(71, 85, 105, 0.4)); }
                }
            `}</style>
        </>
    );
};

// Styles object
const styles = {
    loaderWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        perspective: '1000px'
    },
    
    loaderContent: {
        maxWidth: '600px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#334155',
        padding: '2rem'
    },
    
    loaderLogo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: '40px'
    },
    
    ringContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '240px',
        height: '240px',
        marginBottom: '40px',
        perspective: '800px'
    },
    
    ring: {
        width: '240px',
        height: '240px',
        border: '1px solid transparent',
        borderRadius: '50%',
        position: 'absolute'
    },
    
    ring1: {
        borderBottom: '10px solid rgb(255, 141, 249)',
        animation: 'rotate1 2s linear infinite'
    },
    
    ring2: {
        borderBottom: '10px solid rgb(255, 65, 106)',
        animation: 'rotate2 2s linear infinite'
    },
    
    ring3: {
        borderBottom: '10px solid rgb(0, 255, 255)',
        animation: 'rotate3 2s linear infinite'
    },
    
    ring4: {
        borderBottom: '10px solid rgb(252, 183, 55)',
        animation: 'rotate4 2s linear infinite'
    },
    
    logoText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '2px',
        textAlign: 'center',
        width: '100%',
        color: '#334155',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
    },
    
    loaderProgressContainer: {
        height: '10px',
        backgroundColor: 'rgba(100, 116, 139, 0.15)',
        borderRadius: '10px',
        margin: '40px 0 20px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '500px'
    },
    
    loaderProgressBar: {
        height: '100%',
        background: 'linear-gradient(90deg, #64748b, #475569)',
        borderRadius: '10px',
        transition: 'width 0.4s ease',
        position: 'relative',
        overflow: 'hidden'
    },
    
    shimmer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 100%)',
        animation: 'shimmer 1.5s infinite'
    },
    
    loaderPercentage: {
        position: 'absolute',
        right: 0,
        top: '-28px',
        fontSize: '16px',
        fontWeight: 600,
        color: '#334155'
    },
    
    loaderMessage: {
        fontSize: '18px',
        fontWeight: 300,
        color: 'rgba(51, 65, 85, 0.9)',
        minHeight: '28px',
        marginBottom: '40px',
        textAlign: 'center',
        width: '100%'
    },
    
    techIconsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '50px',
        width: '100%',
        maxWidth: '500px'
    },
    
    techIcon: {
        width: '80px',
        height: '80px',
        backgroundColor: 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
        transition: 'all 0.6s ease',
        transform: 'scale(0.95)',
        position: 'relative',
        padding: '15px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    },
    
    techIconActive: {
        opacity: 1,
        transform: 'scale(1.05)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
    },
    
    techIcon1Active: {
        backgroundColor: 'rgba(236, 72, 153, 0.08)'
    },
    
    techIcon2Active: {
        backgroundColor: 'rgba(14, 165, 233, 0.08)'
    },
    
    techIcon3Active: {
        backgroundColor: 'rgba(132, 204, 22, 0.08)'
    },
    
    techIcon4Active: {
        backgroundColor: 'rgba(249, 115, 22, 0.08)'
    },
    
    materialIcons: {
        fontSize: '36px',
        color: '#64748b',
        marginBottom: '8px',
        transition: 'all 0.4s ease'
    },
    
    materialIcon1Active: {
        color: 'rgb(219, 39, 119)'
    },
    
    materialIcon2Active: {
        color: 'rgb(2, 132, 199)'
    },
    
    materialIcon3Active: {
        color: 'rgb(101, 163, 13)'
    },
    
    materialIcon4Active: {
        color: 'rgb(234, 88, 12)'
    },
    
    iconLabel: {
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#334155',
        opacity: 0,
        transform: 'translateY(10px)',
        transition: 'all 0.4s ease'
    },
    
    iconLabelActive: {
        opacity: 0.9,
        transform: 'translateY(0)'
    }
};

export default Preloader;
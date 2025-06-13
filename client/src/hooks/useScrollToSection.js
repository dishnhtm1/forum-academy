import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToSection = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            // Small delay to ensure the page has rendered
            const timer = setTimeout(() => {
                const element = document.getElementById(location.hash.slice(1));
                if (element) {
                    const headerHeight = 80; // Adjust based on your header height
                    const elementPosition = element.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [location]);
};
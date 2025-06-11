import './i18n';
import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import LoginModal from './components/LoginModal';
import RegisterPage from './components/RegisterPage';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ApplyPage from './pages/ApplyPage';
import ContactPage from './pages/ContactPage';
import CareerServicesPage from './pages/CareerServicesPage';
import Team from './pages/Team';
import Dashboard from './components/Dashboard';
import { LanguageProvider } from './context/LanguageContext';
import 'material-icons/iconfont/material-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/Swiper-Customs.css';


function App() {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true
        });
    }, []);

    useEffect(() => {
        if (!loading && window.anime && mainRef.current) {
            window.anime({
                targets: mainRef.current,
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        }
    }, [loading]);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    const openRegisterModal = () => {
        closeLoginModal();
        setRegisterModalOpen(true);
    };

    const closeRegisterModal = () => setRegisterModalOpen(false);

    const handleRegisterSuccess = () => {
        closeRegisterModal();
        setTimeout(() => {
            openLoginModal();
        }, 500);
    };

    if (loading) {
        return <Preloader />;
    }

    return (
        <LanguageProvider>
            <Router>
                <Switch>
                    {/* Dashboard Routes - No Header/Footer */}
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/student/dashboard" component={Dashboard} />
                    <Route path="/faculty/dashboard" component={Dashboard} />
                    
                    {/* Password Reset Routes - No Header/Footer */}
                    {/* <Route path="/verify-otp" component={VerifyOTPPage} />
                    <Route path="/reset-password" component={ResetPasswordPage} /> */}
                    
                    {/* All other routes with Header/Footer */}
                    <Route>
                        <Header onLoginClick={openLoginModal} />
                        <main ref={mainRef}>
                            <Switch>
                                <Route path="/" exact component={HomePage} />
                                <Route path="/courses" component={CoursesPage} />
                                <Route path="/about" component={AboutPage} />
                                <Route path="/news" component={NewsPage} />
                                <Route path="/career-services" component={CareerServicesPage} />
                                <Route path="/apply" component={ApplyPage} />
                                <Route path="/contact" component={ContactPage} />
                                <Route path="/team" component={Team} />
                                
                                <Route path="/register" render={(props) => {
                                    if (!registerModalOpen) {
                                        openRegisterModal();
                                    }
                                    return <HomePage {...props} />;
                                }} />
                                
                                <Route path="/login" render={(props) => {
                                    if (!loginModalOpen) {
                                        openLoginModal();
                                    }
                                    return <HomePage {...props} />;
                                }} />
                            </Switch>
                        </main>
                        <Footer />
                        
                        <LoginModal 
                            isOpen={loginModalOpen} 
                            onClose={closeLoginModal} 
                            onRegisterClick={openRegisterModal}
                        />
                        
                        <RegisterPage 
                            isOpen={registerModalOpen}
                            onClose={closeRegisterModal}
                            onRegisterSuccess={handleRegisterSuccess}
                        />
                    </Route>
                </Switch>
            </Router>
        </LanguageProvider>
    );
}

export default App;
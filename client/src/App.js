import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ApplyPage from './pages/ApplyPage';
import ContactPage from './pages/ContactPage';
import CareerServicesPage from './pages/CareerServicesPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import 'material-icons/iconfont/material-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
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

    if (loading) {
        return <Preloader />;
    }

    return (
        <Router>
            <Switch>
                {/* Dashboard Route - No Header/Footer */}
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/student/dashboard" component={Dashboard} />
                <Route path="/faculty/dashboard" component={Dashboard} />
                
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
                            <Route path="/register" render={(props) => 
                                <RegisterPage {...props} onRegisterSuccess={openLoginModal} />} 
                            />
                            <Route path="/login" render={(props) => {
                                // Open modal and redirect to home
                                openLoginModal();
                                return <HomePage {...props} />;
                            }} />
                        </Switch>
                    </main>
                    <Footer />
                    <LoginModal 
                        isOpen={loginModalOpen} 
                        onClose={closeLoginModal} 
                        onRegisterClick={() => {
                            closeLoginModal();
                            window.location.href = '/register';
                        }}
                    />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
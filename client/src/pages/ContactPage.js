import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/ContactPage.css"; // Keep only for 3D hero effects
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Star,
  Shield,
  Heart,
  Sparkles,
  Globe,
} from "lucide-react";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacy: false,
  });

  // Keep ALL your existing state and form logic exactly as is
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
    loading: false,
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Create notification for admin when contact message is submitted
  const createContactNotification = (formData) => {
    try {
      const notificationData = {
        type: "contact",
        titleKey: "adminPortal.notifications.newContactMessage",
        messageKey: "adminPortal.notifications.contactFrom",
        messageParams: {
          name: formData.name,
          subject: formData.subject,
        },
        priority: "medium",
        sender: "system",
        targetAudience: "admin",
        actionUrl: "/admin/dashboard?tab=applications",
        icon: "message",
        color: "#52c41a",
      };

      // Store notification in localStorage
      const localNotifications = JSON.parse(
        localStorage.getItem("localNotifications") || "[]"
      );

      const localNotification = {
        id: `contact_${Date.now()}`,
        ...notificationData,
        timestamp: new Date().toISOString(),
        read: false,
        source: "local",
        contactId: `contact_${Date.now()}`,
        senderName: formData.name,
        subject: formData.subject,
        email: formData.email,
      };

      localNotifications.unshift(localNotification);

      // Keep only last 50 notifications
      if (localNotifications.length > 50) {
        localNotifications.splice(50);
      }

      localStorage.setItem(
        "localNotifications",
        JSON.stringify(localNotifications)
      );

      // Show browser notification if supported
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: "/favicon.ico",
          tag: "contact",
        });
      }

      console.log("✅ Contact notification created successfully");
    } catch (error) {
      console.error("Error creating contact notification:", error);
    }
  };

  // Keep ALL your existing useEffect and 3D animation code exactly as is
  useEffect(() => {
    setIsVisible(true);

    // Add 3D animation for cubes
    const createCubes = () => {
      const world = document.querySelector(".contact-world");
      if (!world) return;

      for (let i = 0; i < 12; i++) {
        const cube = document.createElement("div");
        cube.className = "contact-cube";

        // Random position
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;

        // Random size
        const size = Math.random() * 40 + 15;

        cube.style.width = `${size}px`;
        cube.style.height = `${size}px`;
        cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

        // Add faces
        ["front", "back", "right", "left", "top", "bottom"].forEach((face) => {
          const el = document.createElement("div");
          el.className = `contact-cube-face ${face}`;
          cube.appendChild(el);
        });

        world.appendChild(cube);
      }

      // Create particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.className = "contact-particle";

        // Random size and position
        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

        const particles = document.querySelector(".contact-particles");
        if (particles) {
          particles.appendChild(particle);
        }
      }
    };

    createCubes();

    const heroContent = document.querySelector(".contact-hero-content");

    if (heroContent) {
      heroContent.classList.add("visible");
    }

    // Clean up function
    return () => {
      const world = document.querySelector(".contact-world");
      if (world) {
        while (world.firstChild) {
          world.removeChild(world.firstChild);
        }
      }

      const particles = document.querySelector(".contact-particles");
      if (particles) {
        while (particles.firstChild) {
          particles.removeChild(particles.firstChild);
        }
      }
    };
  }, []);

  // Keep ALL your existing form handling exactly as is
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading state
    setFormStatus({
      submitted: true,
      error: false,
      message: t("contact.form.messages.sending"),
      loading: true,
    });

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    // Try multiple endpoints
    const possibleEndpoints = [
      `${API_URL}/api/contact`,
      `${API_URL}/contact`,
      // Add localhost fallback for development
      `http://localhost:5000/api/contact`,
    ];

    let success = false;
    let lastError = null;

    try {
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying contact endpoint: ${endpoint}`);

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            const data = await response.json();
            success = true;
            console.log(`✅ Contact message sent successfully via ${endpoint}`);
            break;
          } else {
            const data = await response.json().catch(() => ({}));
            lastError = data.message || `HTTP ${response.status}`;
            console.log(`❌ Endpoint ${endpoint} failed: ${lastError}`);
          }
        } catch (error) {
          lastError = error.message;
          console.log(`❌ Endpoint ${endpoint} error: ${lastError}`);
          continue;
        }
      }

      if (success) {
        // Create notification for admin
        createContactNotification(formData);

        setFormStatus({
          submitted: true,
          error: false,
          message: t("contact.form.messages.success"),
          loading: false,
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Reset form status after 3 seconds
        setTimeout(() => {
          setFormStatus({
            submitted: false,
            error: false,
            message: "",
            loading: false,
          });
        }, 3000);
      } else {
        throw new Error(lastError || t("contact.form.messages.error"));
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        error: true,
        message: error.message || t("contact.form.messages.error"),
        loading: false,
      });

      // Clear error message after 3 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          error: false,
          message: "",
          loading: false,
        });
      }, 3000);
    }
  };

  return (
    <div className="contact-page">
      {/* Keep 3D Hero Section with CSS */}
      <section
        ref={sectionRef}
        className={`contact-hero ${isVisible ? "visible" : ""}`}
      >
        {/* Keep ALL 3D Scene code exactly as is */}
        <div className="contact-scene">
          <div className="contact-world">
            <div className="contact-floor"></div>
            {/* Cubes will be added by JavaScript */}
          </div>

          {/* Particles */}
          <div className="contact-particles"></div>

          {/* Glowing effects */}
          <div className="contact-glow contact-glow-1"></div>
          <div className="contact-glow contact-glow-2"></div>
        </div>

        <div className="container">
          <div className="contact-hero-content">
            <div className="contact-hero-badge">
              <span className="contact-badge-icon material-icons">
                contact_mail
              </span>
              {t("contact.hero.badge")}
            </div>
            <h1 className="contact-hero-title">
              {t("contact.hero.title")}{" "}
              <span className="contact-highlight-text">
                {t("contact.hero.highlight")}
              </span>
            </h1>
            <p className="contact-hero-description">
              {t("contact.hero.description")}
            </p>
            <div className="contact-quick-links">
              <a href="#form" className="contact-btn contact-btn-primary">
                <span className="material-icons">edit</span>
                {t("contact.hero.sendMessage")}
              </a>
              <a
                href="tel:0120-406-194"
                className="contact-btn contact-btn-outline"
              >
                <span className="material-icons">call</span>
                {t("contact.hero.callUs")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section - Redesigned with Tailwind */}
      <section
        id="contact-main"
        className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info - Enhanced with Tailwind */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Info Header */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t("contact.info.title")}
                    </h2>
                    <p className="text-gray-600">
                      {t("contact.info.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Items */}
              <div className="space-y-6">
                {/* Address */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {t("contact.info.address.title")}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t("contact.info.address.value")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {t("contact.info.phone.title")}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          {t("contact.info.phone.general")}
                        </p>
                        <p className="text-gray-600">
                          {t("contact.info.phone.admissions")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {t("contact.info.email.title")}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          {t("contact.info.email.general")}
                        </p>
                        <p className="text-gray-600">
                          {t("contact.info.email.admissions")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {t("contact.info.hours.title")}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          {t("contact.info.hours.weekdays")}
                        </p>
                        <p className="text-gray-600">
                          {t("contact.info.hours.saturday")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("contact.social.title")}
                  </h3>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com/forumacademy"
                    className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <Twitter className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a
                    href="https://facebook.com/forumacademy"
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <Facebook className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a
                    href="https://instagram.com/forumacademy"
                    className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <Instagram className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a
                    href="https://linkedin.com/company/forumacademy"
                    className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <Linkedin className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form - Enhanced with Tailwind */}
            <div className="lg:col-span-3" id="form">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {t("contact.form.title")}
                      </h2>
                      <p className="text-blue-100">
                        {t("contact.form.description")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {/* Status Messages */}
                  {formStatus.submitted && (
                    <div
                      className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                        formStatus.loading
                          ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                          : formStatus.error
                          ? "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          formStatus.loading
                            ? "bg-blue-500"
                            : formStatus.error
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {formStatus.loading ? (
                          <Loader className="w-5 h-5 text-white animate-spin" />
                        ) : formStatus.error ? (
                          <AlertCircle className="w-5 h-5 text-white" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          formStatus.loading
                            ? "text-blue-700"
                            : formStatus.error
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {formStatus.message}
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="group relative">
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg focus-within:border-blue-400 focus-within:shadow-xl">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                              placeholder={t("contact.form.fields.name")}
                              required
                            />
                            <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm">
                              {t("contact.form.fields.name")}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="group relative">
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-purple-200 hover:shadow-lg focus-within:border-purple-400 focus-within:shadow-xl">
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                              placeholder={t("contact.form.fields.email")}
                              required
                            />
                            <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-sm">
                              {t("contact.form.fields.email")}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone Field */}
                      <div className="group relative">
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-green-200 hover:shadow-lg focus-within:border-green-400 focus-within:shadow-xl">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="tel"
                              id="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                              placeholder={t("contact.form.fields.phone")}
                            />
                            <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-green-600 peer-focus:text-sm">
                              {t("contact.form.fields.phone")}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div className="group relative">
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-orange-200 hover:shadow-lg focus-within:border-orange-400 focus-within:shadow-xl">
                          <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 relative">
                            <select
                              id="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-300 text-gray-800"
                              required
                            >
                              <option value="">
                                {t("contact.form.fields.subject")}
                              </option>
                              <option value="general">
                                {t("contact.form.subjects.general")}
                              </option>
                              <option value="admissions">
                                {t("contact.form.subjects.admissions")}
                              </option>
                              <option value="courses">
                                {t("contact.form.subjects.courses")}
                              </option>
                              <option value="careers">
                                {t("contact.form.subjects.careers")}
                              </option>
                              <option value="other">
                                {t("contact.form.subjects.other")}
                              </option>
                            </select>
                            <label className="absolute left-3 -top-2.5 text-orange-600 text-sm">
                              {t("contact.form.fields.subject")}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="group relative">
                      <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-indigo-200 hover:shadow-lg focus-within:border-indigo-400 focus-within:shadow-xl">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg mt-1">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 relative">
                          <textarea
                            id="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer resize-none"
                            placeholder={t("contact.form.fields.message")}
                            required
                          ></textarea>
                          <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-indigo-600 peer-focus:text-sm">
                            {t("contact.form.fields.message")}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Checkbox - Controlled by formData */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            id="privacy"
                            className="peer sr-only"
                            checked={formData.privacy} // Use formData.privacy
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                privacy: e.target.checked,
                              })
                            } // Update formData
                            required
                          />
                          <label
                            htmlFor="privacy"
                            className="block w-6 h-6 rounded-lg border-2 border-gray-300 bg-white hover:border-blue-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-300 cursor-pointer relative"
                          ></label>

                          <svg
                            className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <label
                          htmlFor="privacy"
                          className="text-gray-700 leading-relaxed cursor-pointer flex-1"
                        >
                          {t("contact.form.privacy.text")}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium ml-1"
                          >
                            {t("contact.form.privacy.link")}
                          </a>
                          {t("contact.form.privacy.consent")}
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={formStatus.loading}
                        className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Send className="w-5 h-5" />
                        <span className="font-medium">
                          {t("contact.form.submit")}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Enhanced with Tailwind */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">Location</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("contact.map.title")}
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <iframe
              title={t("contact.map.title")}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5984.041958729306!2d139.05593607569955!3d37.912437971951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4c9908234a571%3A0xc204d9ebdf574ad4!2z44OV44Kq44O844Op44Og5oOF5aCx44Ki44Kr44OH44Of44O85bCC6ZaA5a2m5qCh!5e1!3m2!1sen!2sjp!4v1747801373059!5m2!1sen!2sjp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced with Tailwind */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-semibold">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("contact.faq.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: t("contact.faq.items.response.question"),
                answer: t("contact.faq.items.response.answer"),
                icon: "⏰",
                color: "from-blue-500 to-cyan-500",
              },
              {
                question: t("contact.faq.items.tour.question"),
                answer: t("contact.faq.items.tour.answer"),
                icon: "🏢",
                color: "from-green-500 to-teal-500",
              },
              {
                question: t("contact.faq.items.virtual.question"),
                answer: t("contact.faq.items.virtual.answer"),
                icon: "💻",
                color: "from-purple-500 to-pink-500",
              },
              {
                question: t("contact.faq.items.financial.question"),
                answer: t("contact.faq.items.financial.answer"),
                icon: "💰",
                color: "from-orange-500 to-red-500",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${faq.color} rounded-2xl flex items-center justify-center shadow-lg text-2xl`}
                  >
                    {faq.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

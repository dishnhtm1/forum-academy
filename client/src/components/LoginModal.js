import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const history = useHistory();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Modal visibility effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(t("login.errors.serverError"));
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("login.errors.loginFailed"));
      }

      // Store authentication data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role || data.user?.role);
      localStorage.setItem("userEmail", data.user?.email || email);
      localStorage.setItem(
        "userName",
        `${data.user?.firstName || ""} ${data.user?.lastName || ""}`.trim()
      );
      localStorage.setItem("userId", data.user?.id);

      // Store complete user object for dashboard
      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }

      // Close modal and redirect
      onClose();
      history.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = t("login.errors.invalidCredentials");

      if (
        error.message.includes("non-JSON response") ||
        error.message.includes("Server error")
      ) {
        errorMessage = t("login.errors.serverError");
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = t("login.errors.connectionError");
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setForgotMessage("OTP sent successfully! Redirecting...");

      // Navigate to OTP verification page
      setTimeout(() => {
        history.push("/verify-otp", {
          email: forgotEmail,
        });
        onClose(); // Close the modal
      }, 1500);
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotError(
        error.message ||
          "Service temporarily unavailable. Please contact support."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // Clear forms when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setFormError("");
      setShowForgotPassword(false);
      setForgotEmail("");
      setForgotError("");
      setForgotMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop with blur effect - same as RegisterPage */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Animated Background Elements - same as RegisterPage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-200/30 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-purple-200/20 rounded-full animate-pulse delay-150"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200/30 rounded-full animate-bounce delay-300"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border-2 border-blue-300/30 rotate-12 animate-pulse"></div>
      </div>

      {/* Modal Container - same structure as RegisterPage */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          className={`w-full max-w-md transform transition-all duration-300 ${
            isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* White Glass Effect Card - same as RegisterPage */}
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label={t("login.closeModal")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {!showForgotPassword ? (
                <>
                  {/* Login Form Header */}
                  <div className="text-center mb-8">
                    {/* Preloader Ring Container */}
                    <div style={ringStyles.ringContainer}>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring1 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring2 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring3 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring4 }}
                      ></div>
                      <div style={ringStyles.logoText}>FORUM ACADEMY</div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {t("login.header.title")}
                    </h2>
                    <p className="text-gray-600">
                      {t("login.header.subtitle")}
                    </p>
                  </div>

                  {/* Error Message */}
                  {formError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{formError}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("login.labels.email")}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          placeholder={t("login.placeholders.enterEmail")}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("login.labels.password")}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          placeholder={t("login.placeholders.enterPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={
                            showPassword
                              ? t("login.form.hidePassword")
                              : t("login.form.showPassword")
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {showPassword ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12l2.122-2.122m0 0l1.414-1.414M21 12c-1.274-4.057-5.064-7-9.543-7-.847 0-1.669.097-2.454.282"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Form Options with Registration on same line */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                              rememberMe
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 group-hover:border-gray-400"
                            }`}
                          >
                            {rememberMe && (
                              <svg
                                className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                          {t("login.form.rememberMe")}
                        </span>
                      </label>

                      {/* Register Link - moved to same line */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onRegisterClick();
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center space-x-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        <span>{t("login.register.createAccount")}</span>
                      </button>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>{t("login.form.signingIn")}</span>
                        </>
                      ) : (
                        <>
                          <span>{t("login.form.signIn")}</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Forgot Password Form */
                <>
                  {/* Forgot Password Header */}
                  <div className="text-center mb-8">
                    {/* Preloader Ring Container */}
                    <div style={ringStyles.ringContainer}>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring1 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring2 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring3 }}
                      ></div>
                      <div
                        style={{ ...ringStyles.ring, ...ringStyles.ring4 }}
                      ></div>
                      <div style={ringStyles.logoText}>FORUM ACADEMY</div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Reset Password
                    </h2>
                    <p className="text-gray-600">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </p>
                  </div>

                  {/* Error Message */}
                  {forgotError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{forgotError}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {forgotMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 text-green-700">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{forgotMessage}</span>
                    </div>
                  )}

                  {/* Forgot Password Form */}
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    {/* Send Reset Email Button */}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {forgotLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Email</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Back to Login Button */}
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      <span>Back to Login</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - same as RegisterPage */}
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

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
    </div>
  );
};

// Ring styles - exactly like Preloader
const ringStyles = {
  ringContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 20px auto",
    perspective: "800px",
  },

  ring: {
    width: "120px",
    height: "120px",
    border: "1px solid transparent",
    borderRadius: "50%",
    position: "absolute",
  },

  ring1: {
    borderBottom: "6px solid rgb(255, 141, 249)",
    animation: "rotate1 2s linear infinite",
  },

  ring2: {
    borderBottom: "6px solid rgb(255, 65, 106)",
    animation: "rotate2 2s linear infinite",
  },

  ring3: {
    borderBottom: "6px solid rgb(0, 255, 255)",
    animation: "rotate3 2s linear infinite",
  },

  ring4: {
    borderBottom: "6px solid rgb(252, 183, 55)",
    animation: "rotate4 2s linear infinite",
  },

  logoText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    textAlign: "center",
    width: "100%",
    color: "#334155",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(90deg, #3a7bd5, #00d2ff)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
};

export default LoginModal;

import React, { useState, useEffect } from 'react';
import '../styles/ApplicationForm.css';

const ApplicationForm = ({ step, onNext, onBack, formData }) => {
    const [currentFormData, setCurrentFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Load existing data when step changes
    useEffect(() => {
        switch (step) {
            case 0:
                setCurrentFormData(formData.personalInfo || {});
                break;
            case 1:
                setCurrentFormData(formData.educationInfo || {});
                break;
            case 2:
                setCurrentFormData(formData.courseSelection || {});
                break;
            case 3:
                setCurrentFormData(formData.additionalInfo || {});
                break;
            default:
                setCurrentFormData({});
        }
    }, [step, formData]);

    
    const handleChange = (e) => {
        const { id, name, value, type, checked } = e.target;
        
        // Use name if provided (for checkboxes), otherwise use id
        const fieldName = name || id;
        
        setCurrentFormData({
            ...currentFormData,
            [fieldName]: type === 'checkbox' ? checked : value
        });
        
        // Clear error when user fixes a field
        if (errors[fieldName]) {
            setErrors({
                ...errors,
                [fieldName]: null
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = getRequiredFields();
        
        requiredFields.forEach(field => {
            if (!currentFormData[field]) {
                newErrors[field] = 'This field is required';
            }
        });
        
        if (step === 0 && currentFormData.email && !/\S+@\S+\.\S+/.test(currentFormData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getRequiredFields = () => {
        switch (step) {
            case 0: // Personal Information
                return ['fullName', 'email', 'phone', 'dateOfBirth'];
            case 1: // Education Background
                return ['highestEducation'];
            case 2: // Course Selection
                return ['course', 'startDate'];
            case 3: // Additional Information
                return ['howDidYouHear'];
            default:
                return [];
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validate()) {
            onNext(currentFormData);
        }
    };

    // Get step title and progress percentage
    const getStepInfo = () => {
        const titles = [
            "Personal Information",
            "Educational Background",
            "Program Selection",
            "Additional Information"
        ];
        
        return {
            title: titles[step] || "Application",
            progress: ((step + 1) / 4) * 100
        };
    };
    
    const stepInfo = getStepInfo();

    // Render different form fields based on the current step
    const renderFormFields = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <div className="form-group">
                            <input
                                type="text"
                                id="fullName"
                                value={currentFormData.fullName || ''}
                                onChange={handleChange}
                                className={errors.fullName ? 'error' : ''}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Full Name *</label>
                            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"  // This should be unique across all forms
                                value={currentFormData.email || ''}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Email Address *</label>
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="tel"
                                id="phone"
                                value={currentFormData.phone || ''}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Phone Number *</label>
                            {errors.phone && <div className="error-message">{errors.phone}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="date"
                                id="dateOfBirth"
                                value={currentFormData.dateOfBirth || ''}
                                onChange={handleChange}
                                className={errors.dateOfBirth ? 'error' : ''}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className="date-label">Date of Birth *</label>
                            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                id="address"
                                value={currentFormData.address || ''}
                                onChange={handleChange}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Address</label>
                        </div>
                    </>
                );
                
            case 1:
                return (
                    <>
                        <div className="form-group select-group">
                            <select
                                id="highestEducation"
                                value={currentFormData.highestEducation || ''}
                                onChange={handleChange}
                                className={errors.highestEducation ? 'error' : ''}
                                required
                            >
                                <option value=""></option>
                                <option value="highSchool">High School</option>
                                <option value="associates">Associate's Degree</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="masters">Master's Degree</option>
                                <option value="doctorate">Doctorate</option>
                                <option value="other">Other</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Highest Level of Education *</label>
                            {errors.highestEducation && <div className="error-message">{errors.highestEducation}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                id="schoolName"
                                value={currentFormData.schoolName || ''}
                                onChange={handleChange}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Institution Name</label>
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                id="fieldOfStudy"
                                value={currentFormData.fieldOfStudy || ''}
                                onChange={handleChange}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Field of Study</label>
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                id="graduationYear"
                                value={currentFormData.graduationYear || ''}
                                onChange={handleChange}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Graduation Year</label>
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                id="relevantExperience"
                                value={currentFormData.relevantExperience || ''}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Relevant Experience</label>
                        </div>
                    </>
                );
                
            case 2:
                return (
                    <>
                        <div className="form-group select-group">
                            <select
                                id="course"
                                value={currentFormData.course || ''}
                                onChange={handleChange}
                                className={errors.course ? 'error' : ''}
                                required
                            >
                                <option value=""></option>
                                <option value="webDevelopment">Web Development</option>
                                <option value="dataScience">Data Science & Analytics</option>
                                <option value="cybersecurity">Cybersecurity</option>
                                <option value="cloudComputing">Cloud Computing</option>
                                <option value="aiMachineLearning">AI & Machine Learning</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Desired Program *</label>
                            {errors.course && <div className="error-message">{errors.course}</div>}
                        </div>
                        
                        <div className="form-group select-group">
                            <select
                                id="studyFormat"
                                value={currentFormData.studyFormat || ''}
                                onChange={handleChange}
                            >
                                <option value=""></option>
                                <option value="fullTime">Full-Time</option>
                                <option value="partTime">Part-Time</option>
                                <option value="weekend">Weekend</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Study Format</label>
                        </div>
                        
                        <div className="form-group select-group">
                            <select
                                id="startDate"
                                value={currentFormData.startDate || ''}
                                onChange={handleChange}
                                className={errors.startDate ? 'error' : ''}
                                required
                            >
                                <option value=""></option>
                                <option value="summer2025">Summer 2025 (June)</option>
                                <option value="fall2025">Fall 2025 (September)</option>
                                <option value="winter2026">Winter 2026 (January)</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Desired Start Date *</label>
                            {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                id="programInterest"
                                value={currentFormData.programInterest || ''}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Why are you interested in this program?</label>
                        </div>
                    </>
                );
                
            case 3:
                return (
                    <>
                        <div className="form-group select-group">
                            <select
                                id="howDidYouHear"
                                value={currentFormData.howDidYouHear || ''}
                                onChange={handleChange}
                                className={errors.howDidYouHear ? 'error' : ''}
                                required
                            >
                                <option value=""></option>
                                <option value="searchEngine">Search Engine</option>
                                <option value="socialMedia">Social Media</option>
                                <option value="friend">Friend or Family</option>
                                <option value="advertisement">Advertisement</option>
                                <option value="event">Event or Career Fair</option>
                                <option value="other">Other</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>How did you hear about us? *</label>
                            {errors.howDidYouHear && <div className="error-message">{errors.howDidYouHear}</div>}
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                id="careerGoals"
                                value={currentFormData.careerGoals || ''}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>What are your career goals?</label>
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                id="questions"
                                value={currentFormData.questions || ''}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Questions or Comments</label>
                        </div>
                        
                        {/* <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="application-terms"  // Changed from agreeToTerms to be unique
                                name="agreeToTerms"    // Keep the name the same for handleChange
                                checked={currentFormData.agreeToTerms || false}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="application-terms">
                                I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and consent to Forum Information Academy processing my data.
                            </label>
                        </div> */}
                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="application-terms"  // Unique ID for the element
                                name="agreeToTerms"     // Name for the state property
                                checked={currentFormData.agreeToTerms || false}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="application-terms">
                                I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and consent to Forum Information Academy processing my data.
                            </label>
                            {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
                        </div>
                    </>
                );
                
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="application-wrapper">
            <div className="form-container">
                <div className="form-header">
                    <h2>{stepInfo.title}</h2>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${stepInfo.progress}%` }}></div>
                        <div className="step-indicator">Step {step + 1} of 4</div>
                    </div>
                    <p className="form-description">
                        {step === 0 && "Tell us about yourself so we can get to know you better."}
                        {step === 1 && "Tell us about your educational experience and qualifications."}
                        {step === 2 && "Select the program and schedule that best fits your needs."}
                        {step === 3 && "Help us understand your goals and how we can better assist you."}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="application-form">
                    {renderFormFields()}
                    
                    <div className="form-actions">
                        {step > 0 && (
                            <button 
                                type="button" 
                                className="btn btn-back" 
                                onClick={onBack}
                            >
                                <span className="material-icons">arrow_back</span>
                                Back
                            </button>
                        )}
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            {step === 3 ? 'Submit Application' : 'Continue'}
                            <span className="material-icons">
                                {step === 3 ? 'send' : 'arrow_forward'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
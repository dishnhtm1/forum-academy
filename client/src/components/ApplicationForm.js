import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import only
import '../styles/ApplicationForm.css';

const ApplicationForm = ({ step, onNext, onBack, formData }) => {
    const { t } = useTranslation(); // Add this line only
    const [currentFormData, setCurrentFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Keep ALL your existing useEffect and logic exactly as is
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

    // Keep ALL your existing form handling exactly as is
    const handleChange = (e) => {
        const { id, name, value, type, checked } = e.target;
        
        const fieldName = name || id;
        
        setCurrentFormData({
            ...currentFormData,
            [fieldName]: type === 'checkbox' ? checked : value
        });
        
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
                newErrors[field] = t('applicationForm.validation.required');
            }
        });
        
        if (step === 0 && currentFormData.email && !/\S+@\S+\.\S+/.test(currentFormData.email)) {
            newErrors.email = t('applicationForm.validation.emailInvalid');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const getRequiredFields = () => {
        switch (step) {
            case 0:
                return ['fullName', 'email', 'phone', 'dateOfBirth'];
            case 1:
                return ['highestEducation'];
            case 2:
                return ['course', 'startDate'];
            case 3:
                return ['howDidYouHear', 'agreeToTerms'];
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

    // Get step title and progress percentage - only replace text
    const getStepInfo = () => {
        const titles = [
            t('applicationForm.steps.personalInfo.title'),
            t('applicationForm.steps.education.title'),
            t('applicationForm.steps.programSelection.title'),
            t('applicationForm.steps.additionalInfo.title')
        ];
        
        return {
            title: titles[step] || t('applicationForm.steps.default'),
            progress: ((step + 1) / 4) * 100
        };
    };
    
    const stepInfo = getStepInfo();

    // Keep ALL your form structure exactly as is - only replace text
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
                            <label>{t('applicationForm.fields.fullName')}</label>
                            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                value={currentFormData.email || ''}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.email')}</label>
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
                            <label>{t('applicationForm.fields.phone')}</label>
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
                            <label className="date-label">{t('applicationForm.fields.dateOfBirth')}</label>
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
                            <label>{t('applicationForm.fields.address')}</label>
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
                                <option value="highSchool">{t('applicationForm.options.education.highSchool')}</option>
                                <option value="associates">{t('applicationForm.options.education.associates')}</option>
                                <option value="bachelors">{t('applicationForm.options.education.bachelors')}</option>
                                <option value="masters">{t('applicationForm.options.education.masters')}</option>
                                <option value="doctorate">{t('applicationForm.options.education.doctorate')}</option>
                                <option value="other">{t('applicationForm.options.education.other')}</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.highestEducation')}</label>
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
                            <label>{t('applicationForm.fields.schoolName')}</label>
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
                            <label>{t('applicationForm.fields.fieldOfStudy')}</label>
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
                            <label>{t('applicationForm.fields.graduationYear')}</label>
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
                            <label>{t('applicationForm.fields.relevantExperience')}</label>
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
                                <option value="webDevelopment">{t('applicationForm.options.courses.webDevelopment')}</option>
                                <option value="dataScience">{t('applicationForm.options.courses.dataScience')}</option>
                                <option value="cybersecurity">{t('applicationForm.options.courses.cybersecurity')}</option>
                                <option value="cloudComputing">{t('applicationForm.options.courses.cloudComputing')}</option>
                                <option value="aiMachineLearning">{t('applicationForm.options.courses.aiMachineLearning')}</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.course')}</label>
                            {errors.course && <div className="error-message">{errors.course}</div>}
                        </div>
                        
                        <div className="form-group select-group">
                            <select
                                id="studyFormat"
                                value={currentFormData.studyFormat || ''}
                                onChange={handleChange}
                            >
                                <option value=""></option>
                                <option value="fullTime">{t('applicationForm.options.studyFormat.fullTime')}</option>
                                <option value="partTime">{t('applicationForm.options.studyFormat.partTime')}</option>
                                <option value="weekend">{t('applicationForm.options.studyFormat.weekend')}</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.studyFormat')}</label>
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
                                <option value="summer2025">{t('applicationForm.options.startDate.summer2025')}</option>
                                <option value="fall2025">{t('applicationForm.options.startDate.fall2025')}</option>
                                <option value="winter2026">{t('applicationForm.options.startDate.winter2026')}</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.startDate')}</label>
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
                            <label>{t('applicationForm.fields.programInterest')}</label>
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
                                <option value="searchEngine">{t('applicationForm.options.howDidYouHear.searchEngine')}</option>
                                <option value="socialMedia">{t('applicationForm.options.howDidYouHear.socialMedia')}</option>
                                <option value="friend">{t('applicationForm.options.howDidYouHear.friend')}</option>
                                <option value="advertisement">{t('applicationForm.options.howDidYouHear.advertisement')}</option>
                                <option value="event">{t('applicationForm.options.howDidYouHear.event')}</option>
                                <option value="other">{t('applicationForm.options.howDidYouHear.other')}</option>
                            </select>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>{t('applicationForm.fields.howDidYouHear')}</label>
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
                            <label>{t('applicationForm.fields.careerGoals')}</label>
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
                            <label>{t('applicationForm.fields.questions')}</label>
                        </div>
                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="application-terms"
                                name="agreeToTerms"
                                checked={currentFormData.agreeToTerms || false}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="application-terms">
                                {t('applicationForm.fields.agreeToTerms')} <a href="/terms" target="_blank" rel="noopener noreferrer">{t('applicationForm.termsLink')}</a> {t('applicationForm.dataConsent')}
                            </label>
                            {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
                        </div>
                    </>
                );
                
            default:
                return <div>{t('applicationForm.unknownStep')}</div>;
        }
    };

    return (
        <div className="application-wrapper">
            <div className="form-container">
                <div className="form-header">
                    <h2>{stepInfo.title}</h2>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${stepInfo.progress}%` }}></div>
                        <div className="step-indicator">{t('applicationForm.stepIndicator', { current: step + 1, total: 4 })}</div>
                    </div>
                    <p className="form-description">
                        {step === 0 && t('applicationForm.steps.personalInfo.description')}
                        {step === 1 && t('applicationForm.steps.education.description')}
                        {step === 2 && t('applicationForm.steps.programSelection.description')}
                        {step === 3 && t('applicationForm.steps.additionalInfo.description')}
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
                                {t('applicationForm.buttons.back')}
                            </button>
                        )}
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            {step === 3 ? t('applicationForm.buttons.submit') : t('applicationForm.buttons.continue')}
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
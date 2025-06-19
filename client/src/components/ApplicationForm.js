import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    MapPin, 
    GraduationCap, 
    BookOpen, 
    Target, 
    Clock, 
    ArrowRight, 
    ArrowLeft, 
    Send,
    CheckCircle,
    Star,
    Sparkles,
    Globe,
    Heart
} from 'lucide-react';

const ApplicationForm = ({ step, onNext, onBack, formData }) => {
    const { t } = useTranslation();
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

    // Get step information
    const getStepInfo = () => {
        const stepData = [
            {
                title: t('applicationForm.steps.personalInfo.title'),
                description: t('applicationForm.steps.personalInfo.description'),
                icon: User,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50',
                iconBg: 'bg-blue-500'
            },
            {
                title: t('applicationForm.steps.education.title'),
                description: t('applicationForm.steps.education.description'),
                icon: GraduationCap,
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'bg-emerald-50',
                iconBg: 'bg-emerald-500'
            },
            {
                title: t('applicationForm.steps.programSelection.title'),
                description: t('applicationForm.steps.programSelection.description'),
                icon: BookOpen,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50',
                iconBg: 'bg-purple-500'
            },
            {
                title: t('applicationForm.steps.additionalInfo.title'),
                description: t('applicationForm.steps.additionalInfo.description'),
                icon: Target,
                color: 'from-orange-500 to-red-500',
                bgColor: 'bg-orange-50',
                iconBg: 'bg-orange-500'
            }
        ];
        
        return {
            ...stepData[step] || { 
                title: t('applicationForm.steps.default'), 
                description: '',
                icon: User, 
                color: 'from-gray-500 to-gray-600', 
                bgColor: 'bg-gray-50',
                iconBg: 'bg-gray-500'
            },
            progress: ((step + 1) / 4) * 100
        };
    };
    
    const stepInfo = getStepInfo();
    const StepIcon = stepInfo.icon;

    // Form fields renderer with Tailwind styling
    const renderFormFields = () => {
        switch (step) {
            case 0:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={currentFormData.fullName || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer`}
                                        placeholder={t('applicationForm.fields.fullName')}
                                        required
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.fullName')}
                                    </label>
                                </div>
                            </div>
                            {errors.fullName && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={currentFormData.email || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer`}
                                        placeholder={t('applicationForm.fields.email')}
                                        required
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.email')}
                                    </label>
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={currentFormData.phone || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer`}
                                        placeholder={t('applicationForm.fields.phone')}
                                        required
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.phone')}
                                    </label>
                                </div>
                            </div>
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        value={currentFormData.dateOfBirth || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800`}
                                        required
                                    />
                                    <label className="absolute left-3 -top-2.5 text-blue-600 text-sm">
                                        {t('applicationForm.fields.dateOfBirth')}
                                    </label>
                                </div>
                            </div>
                            {errors.dateOfBirth && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.dateOfBirth}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="group relative md:col-span-2">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="address"
                                        value={currentFormData.address || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                                        placeholder={t('applicationForm.fields.address')}
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.address')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Highest Education */}
                        <div className="group relative md:col-span-2">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        id="highestEducation"
                                        value={currentFormData.highestEducation || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.highestEducation ? 'border-red-500' : 'border-gray-300'} focus:border-emerald-500 focus:outline-none transition-colors duration-300 text-gray-800`}
                                        required
                                    >
                                        <option value="">{t('applicationForm.fields.highestEducation')}</option>
                                        <option value="highSchool">{t('applicationForm.options.education.highSchool')}</option>
                                        <option value="associates">{t('applicationForm.options.education.associates')}</option>
                                        <option value="bachelors">{t('applicationForm.options.education.bachelors')}</option>
                                        <option value="masters">{t('applicationForm.options.education.masters')}</option>
                                        <option value="doctorate">{t('applicationForm.options.education.doctorate')}</option>
                                        <option value="other">{t('applicationForm.options.education.other')}</option>
                                    </select>
                                    <label className="absolute left-3 -top-2.5 text-emerald-600 text-sm">
                                        {t('applicationForm.fields.highestEducation')}
                                    </label>
                                </div>
                            </div>
                            {errors.highestEducation && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.highestEducation}
                                </p>
                            )}
                        </div>

                        {/* School Name */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="schoolName"
                                        value={currentFormData.schoolName || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                                        placeholder={t('applicationForm.fields.schoolName')}
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-emerald-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.schoolName')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Field of Study */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="fieldOfStudy"
                                        value={currentFormData.fieldOfStudy || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                                        placeholder={t('applicationForm.fields.fieldOfStudy')}
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-emerald-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.fieldOfStudy')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Graduation Year */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="graduationYear"
                                        value={currentFormData.graduationYear || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer"
                                        placeholder={t('applicationForm.fields.graduationYear')}
                                    />
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-emerald-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.graduationYear')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Relevant Experience */}
                        <div className="group relative md:col-span-2">
                            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg mt-1">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        id="relevantExperience"
                                        value={currentFormData.relevantExperience || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer resize-none"
                                        placeholder={t('applicationForm.fields.relevantExperience')}
                                    ></textarea>
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-emerald-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.relevantExperience')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Selection */}
                        <div className="group relative md:col-span-2">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        id="course"
                                        value={currentFormData.course || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.course ? 'border-red-500' : 'border-gray-300'} focus:border-purple-500 focus:outline-none transition-colors duration-300 text-gray-800`}
                                        required
                                    >
                                        <option value="">{t('applicationForm.fields.course')}</option>
                                        <option value="webDevelopment">{t('applicationForm.options.courses.webDevelopment')}</option>
                                        <option value="dataScience">{t('applicationForm.options.courses.dataScience')}</option>
                                        <option value="cybersecurity">{t('applicationForm.options.courses.cybersecurity')}</option>
                                        <option value="cloudComputing">{t('applicationForm.options.courses.cloudComputing')}</option>
                                        <option value="aiMachineLearning">{t('applicationForm.options.courses.aiMachineLearning')}</option>
                                    </select>
                                    <label className="absolute left-3 -top-2.5 text-purple-600 text-sm">
                                        {t('applicationForm.fields.course')}
                                    </label>
                                </div>
                            </div>
                            {errors.course && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.course}
                                </p>
                            )}
                        </div>

                        {/* Study Format */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        id="studyFormat"
                                        value={currentFormData.studyFormat || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-300 text-gray-800"
                                    >
                                        <option value="">{t('applicationForm.fields.studyFormat')}</option>
                                        <option value="fullTime">{t('applicationForm.options.studyFormat.fullTime')}</option>
                                        <option value="partTime">{t('applicationForm.options.studyFormat.partTime')}</option>
                                        <option value="weekend">{t('applicationForm.options.studyFormat.weekend')}</option>
                                    </select>
                                    <label className="absolute left-3 -top-2.5 text-purple-600 text-sm">
                                        {t('applicationForm.fields.studyFormat')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        id="startDate"
                                        value={currentFormData.startDate || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.startDate ? 'border-red-500' : 'border-gray-300'} focus:border-purple-500 focus:outline-none transition-colors duration-300 text-gray-800`}
                                        required
                                    >
                                        <option value="">{t('applicationForm.fields.startDate')}</option>
                                        <option value="summer2025">{t('applicationForm.options.startDate.summer2025')}</option>
                                        <option value="fall2025">{t('applicationForm.options.startDate.fall2025')}</option>
                                        <option value="winter2026">{t('applicationForm.options.startDate.winter2026')}</option>
                                    </select>
                                    <label className="absolute left-3 -top-2.5 text-purple-600 text-sm">
                                        {t('applicationForm.fields.startDate')}
                                    </label>
                                </div>
                            </div>
                            {errors.startDate && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.startDate}
                                </p>
                            )}
                        </div>

                        {/* Program Interest */}
                        <div className="group relative md:col-span-2">
                            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg mt-1">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        id="programInterest"
                                        value={currentFormData.programInterest || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer resize-none"
                                        placeholder={t('applicationForm.fields.programInterest')}
                                    ></textarea>
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.programInterest')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 3:
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {/* How Did You Hear */}
                        <div className="group relative">
                            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-orange-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        id="howDidYouHear"
                                        value={currentFormData.howDidYouHear || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-transparent border-0 border-b-2 ${errors.howDidYouHear ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none transition-colors duration-300 text-gray-800`}
                                        required
                                    >
                                        <option value="">{t('applicationForm.fields.howDidYouHear')}</option>
                                        <option value="searchEngine">{t('applicationForm.options.howDidYouHear.searchEngine')}</option>
                                        <option value="socialMedia">{t('applicationForm.options.howDidYouHear.socialMedia')}</option>
                                        <option value="friend">{t('applicationForm.options.howDidYouHear.friend')}</option>
                                        <option value="advertisement">{t('applicationForm.options.howDidYouHear.advertisement')}</option>
                                        <option value="event">{t('applicationForm.options.howDidYouHear.event')}</option>
                                        <option value="other">{t('applicationForm.options.howDidYouHear.other')}</option>
                                    </select>
                                    <label className="absolute left-3 -top-2.5 text-orange-600 text-sm">
                                        {t('applicationForm.fields.howDidYouHear')}
                                    </label>
                                </div>
                            </div>
                            {errors.howDidYouHear && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.howDidYouHear}
                                </p>
                            )}
                        </div>

                        {/* Career Goals */}
                        <div className="group relative">
                            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-orange-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg mt-1">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        id="careerGoals"
                                        value={currentFormData.careerGoals || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer resize-none"
                                        placeholder={t('applicationForm.fields.careerGoals')}
                                    ></textarea>
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-orange-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.careerGoals')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="group relative">
                            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-orange-200 hover:shadow-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg mt-1">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        id="questions"
                                        value={currentFormData.questions || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-300 text-gray-800 placeholder-transparent peer resize-none"
                                        placeholder={t('applicationForm.fields.questions')}
                                    ></textarea>
                                    <label className="absolute left-3 -top-2.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-orange-600 peer-focus:text-sm">
                                        {t('applicationForm.fields.questions')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="application-terms"
                                        name="agreeToTerms"
                                        checked={currentFormData.agreeToTerms || false}
                                        onChange={handleChange}
                                        className="sr-only"
                                        required
                                    />
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                        currentFormData.agreeToTerms 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500' 
                                            : 'border-gray-300 bg-white hover:border-blue-400'
                                    }`} onClick={() => handleChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked: !currentFormData.agreeToTerms } })}>
                                        {currentFormData.agreeToTerms && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="application-terms" className="text-gray-700 leading-relaxed cursor-pointer">
                                    {t('applicationForm.fields.agreeToTerms')} 
                                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium ml-1">
                                        {t('applicationForm.termsLink')}
                                    </a> 
                                    {t('applicationForm.dataConsent')}
                                </label>
                            </div>
                            {errors.agreeToTerms && (
                                <p className="mt-3 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.agreeToTerms}
                                </p>
                            )}
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {t('applicationForm.unknownStep')}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Enhanced Header Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className={`w-20 h-20 ${stepInfo.bgColor} rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
                            <div className={`w-14 h-14 bg-gradient-to-r ${stepInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <StepIcon className="w-8 h-8 text-white" />
                            </div>
                            {/* Animated ring */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                        </div>
                        
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {stepInfo.title}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {stepInfo.description}
                            </p>
                        </div>
                        
                        {/* Step Indicator */}
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                                {step + 1}<span className="text-gray-400">/4</span>
                            </div>
                            <div className="text-sm text-gray-500">Steps</div>
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {[0, 1, 2, 3].map((stepIndex) => (
                            <div key={stepIndex} className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    stepIndex <= step 
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {stepIndex < step ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <span className="font-bold">{stepIndex + 1}</span>
                                    )}
                                </div>
                                {stepIndex < 3 && (
                                    <div className={`w-16 sm:w-24 h-2 mx-2 rounded-full transition-all duration-500 ${
                                        stepIndex < step 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                            : 'bg-gray-200'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('applicationForm.stepIndicator', { current: step + 1, total: 4 })}</span>
                        <span className="font-semibold text-blue-600">{Math.round(stepInfo.progress)}% Complete</span>
                    </div>
                </div>
                
                {/* Enhanced Form Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-8">
                            {renderFormFields()}
                        </div>
                        
                        {/* Enhanced Action Buttons */}
                        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                            {step > 0 ? (
                                <button 
                                    type="button" 
                                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300" 
                                    onClick={onBack}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="font-medium">{t('applicationForm.buttons.back')}</span>
                                </button>
                            ) : (
                                <div></div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <span className="font-medium">
                                    {step === 3 ? t('applicationForm.buttons.submit') : t('applicationForm.buttons.continue')}
                                </span>
                                {step === 3 ? (
                                    <Send className="w-5 h-5" />
                                ) : (
                                    <ArrowRight className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
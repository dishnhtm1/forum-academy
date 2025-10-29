import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CourseModal = ({ course, isOpen, onClose }) => {
    const { t } = useTranslation();
    
    if (!isOpen || !course) {
        return null;
    }

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !course) return null;

    const getBadgeStyles = (color) => {
        const styles = {
            blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
            green: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
            red: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
            cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white',
            purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
            orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
        };
        return styles[color] || styles.blue;
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl transform transition-all mx-auto animate-in fade-in-0 zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${getBadgeStyles(course.badgeColor)}`}>
                                    {course.category}
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 text-yellow-500">
                                    <span className="material-icons text-sm">star</span>
                                    <span className="font-bold text-sm sm:text-base">{course.rating}</span>
                                    <span className="text-gray-500 text-xs sm:text-sm">({course.students.toLocaleString()} students)</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                                <span className="material-icons text-gray-500">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
                            {/* Left Column - Course Image and Basic Info */}
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Course Image */}
                                    <div className="relative overflow-hidden rounded-xl mb-4 sm:mb-6">
                                        <img 
                                            src={course.image} 
                                            alt={course.title}
                                            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                                            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{course.price}</div>
                                            <div className="text-xs sm:text-sm line-through opacity-75">{course.originalPrice}</div>
                                        </div>
                                    </div>

                                    {/* Course Meta */}
                                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                            <span className="material-icons text-blue-600 text-sm sm:text-base">schedule</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">Duration</div>
                                                <div className="text-xs sm:text-sm text-gray-600">{course.duration}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                            <span className="material-icons text-green-600 text-sm sm:text-base">event</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">Start Date</div>
                                                <div className="text-xs sm:text-sm text-gray-600">{course.startDate}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg">
                                            <span className="material-icons text-purple-600 text-sm sm:text-base">signal_cellular_alt</span>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">Level</div>
                                                <div className="text-xs sm:text-sm text-gray-600">{course.level}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructor */}
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                                        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Instructor</h4>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                                {course.instructor.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">{course.instructor}</div>
                                                <div className="text-xs sm:text-sm text-gray-600">Lead Instructor</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                                            <span className="material-icons text-sm sm:text-base">school</span>
                                            Enroll Now
                                        </button>
                                        <button className="w-full border-2 border-gray-300 text-gray-700 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                                            <span className="material-icons text-sm sm:text-base">favorite_border</span>
                                            Add to Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Detailed Information */}
                            <div className="lg:col-span-2">
                                {/* Course Title and Description */}
                                <div className="mb-6 sm:mb-8">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{course.title}</h1>
                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{course.description}</p>
                                </div>

                                {/* What You'll Learn */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-blue-600 text-lg sm:text-xl">lightbulb</span>
                                        What You'll Learn
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                        {course.whatYouWillLearn.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                                <span className="material-icons text-green-500 text-sm mt-1">check_circle</span>
                                                <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Curriculum */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-purple-600 text-lg sm:text-xl">menu_book</span>
                                        Curriculum
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {course.curriculum.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-700 font-medium text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-orange-600 text-lg sm:text-xl">assignment</span>
                                        Requirements
                                    </h3>
                                    <div className="space-y-2">
                                        {course.requirements.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-50 rounded-lg">
                                                <span className="material-icons text-orange-500 text-sm mt-1">info</span>
                                                <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Career Outcomes */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-green-600 text-lg sm:text-xl">work</span>
                                        Career Outcomes
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                        {course.careerOutcomes.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                                <span className="material-icons text-green-500 text-sm">trending_up</span>
                                                <span className="text-gray-700 font-medium text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Job Placement & Salary Stats */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-blue-600 text-lg sm:text-xl">analytics</span>
                                        Career Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl text-center">
                                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{course.jobPlacement}</div>
                                            <div className="text-gray-700 font-medium text-sm sm:text-base">Job Placement Rate</div>
                                        </div>
                                        <div className="bg-green-50 p-4 sm:p-6 rounded-xl text-center">
                                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{course.averageSalary}</div>
                                            <div className="text-gray-700 font-medium text-sm sm:text-base">Average Starting Salary</div>
                                        </div>
                                        <div className="bg-purple-50 p-4 sm:p-6 rounded-xl text-center sm:col-span-2 lg:col-span-1">
                                            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{course.students.toLocaleString()}</div>
                                            <div className="text-gray-700 font-medium text-sm sm:text-base">Graduates</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hiring Companies */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-orange-600 text-lg sm:text-xl">business</span>
                                        Hiring Companies
                                    </h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {course.companies.map((company, index) => (
                                            <div key={index} className="px-3 sm:px-4 py-1 sm:py-2 bg-orange-100 text-orange-700 rounded-full font-medium text-xs sm:text-sm">
                                                {company}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Course Features */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="material-icons text-blue-600 text-lg sm:text-xl">star</span>
                                        Course Features
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {course.features.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                                <span className="material-icons text-blue-500 text-sm mt-1">check_circle</span>
                                                <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;

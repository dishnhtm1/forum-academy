import React from 'react';

const TestModal = ({ isOpen, onClose, course }) => {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {course.category}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {course.duration}
                    </span>
                </div>
                <button 
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TestModal;

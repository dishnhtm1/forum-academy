import React, { useState, useEffect } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Swal from 'sweetalert2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    // ✅ Translation and Theme States
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ✅ User and Authentication States
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Navigation and UI States
    const [activeTab, setActiveTab] = useState('overview');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // ✅ Data Collection States
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [applicationSubmissions, setApplicationSubmissions] = useState([]);
    const [contactSubmissions, setContactSubmissions] = useState([]);

    // ✅ Search and Filter States - Users
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // ✅ Search and Filter States - Applications
    const [searchTermApp, setSearchTermApp] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedAppStatus, setSelectedAppStatus] = useState('');

    // ✅ Search and Filter States - Contact Forms
    const [searchTermContact, setSearchTermContact] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedContactStatus, setSelectedContactStatus] = useState('');

    // ✅ Modal and Form States
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ✅ User Management States
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newUserData, setNewUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    });

    // ✅ Add these new state variables with your existing states
    const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDeleteApplicationConfirm, setShowDeleteApplicationConfirm] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [showSendMessageModal, setShowSendMessageModal] = useState(false);
    const [messageData, setMessageData] = useState({
        subject: '',
        message: '',
        recipient: null
    });

    // Add these state variables with your existing ones
    // const [contactSubmissions, setContactSubmissions] = useState([]);
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDeleteContactConfirm, setShowDeleteContactConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    // ✅ Application Management Functions
    const handleViewApplication = (application) => {
        console.log('👁️ View application clicked:', application);
        setSelectedApplication(application);
        setShowViewApplicationModal(true);
    };
    
    const handleDeleteApplication = (application) => {
        console.log('🗑️ Delete application clicked:', application);
        setApplicationToDelete(application);
        setShowDeleteApplicationConfirm(true);
    };

    // ✅ FIXED: Update the handleSendMessage function to use correct field name
    const handleSendMessage = (application) => {
        console.log('📧 Send message clicked:', application);
        setMessageData({
            subject: `Regarding your application for ${application.program}`, // ✅ Changed from programInterested to program
            message: '',
            recipient: application
        });
        setShowSendMessageModal(true);
    };

    const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
        try {
            console.log(`🔄 Updating application ${applicationId} status to: ${newStatus}`);
            
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
    
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
    
            console.log('Update status response:', response.status);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Status update successful:', result);
                
                if (result.success) {
                    // Update the application in local state
                    setApplicationSubmissions(prevApps => 
                        prevApps.map(app => 
                            app._id === applicationId 
                                ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
                                : app
                        )
                    );
                    
                    alert(`Application status updated to ${newStatus} successfully!`);
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const errorText = await response.text();
                console.error('Status update failed:', errorText);
                
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || 'Unknown error';
                } catch {
                    errorMessage = errorText || 'Unknown error';
                }
                
                alert(`Error updating status: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status. Please try again.');
        }
    };
    
    const confirmDeleteApplication = async () => {
        console.log('🔥 DELETE APPLICATION CONFIRMATION CLICKED!');
        console.log('Application to delete:', applicationToDelete);
        
        if (!applicationToDelete) {
            alert('No application selected for deletion');
            return;
        }
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            console.log('🗑️ Attempting to delete application:', applicationToDelete._id);
            
            // Use the correct API URL
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/applications/${applicationToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Delete application response status:', response.status);
            console.log('Response URL:', response.url);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Delete application successful:', result);
                
                if (result.success) {
                    // Remove application from local state
                    setApplicationSubmissions(prevApps => 
                        prevApps.filter(app => app._id !== applicationToDelete._id)
                    );
                    
                    // Reset modal state
                    setShowDeleteApplicationConfirm(false);
                    setApplicationToDelete(null);
                    
                    alert('Application deleted successfully!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const errorText = await response.text();
                console.error('Delete application failed:', errorText);
                
                // Try to parse as JSON, fallback to text
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || 'Unknown error';
                } catch {
                    errorMessage = errorText || 'Unknown error';
                }
                
                alert(`Error deleting application: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Error deleting application. Please try again.');
        }
    };
    
    const handleSendMessageSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            const messagePayload = {
                to: messageData.recipient.email,
                subject: messageData.subject,
                message: messageData.message,
                applicantName: `${messageData.recipient.firstName} ${messageData.recipient.lastName}`,
                applicationId: messageData.recipient._id
            };
            
            console.log('📧 Sending message:', messagePayload);
            
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/applications/send-message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messagePayload)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Message sent successfully:', result);
                
                // Reset form and close modal
                setShowSendMessageModal(false);
                setMessageData({
                    subject: '',
                    message: '',
                    recipient: null
                });
                
                alert('Message sent successfully!');
            } else {
                const error = await response.json();
                alert(`Error sending message: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Please try again.');
        }
    };

    const fetchContacts = async () => {
        try {
            const token = getToken();
            if (!token) {
                console.log('No token found for fetching contacts');
                return;
            }
    
            console.log('🔄 Fetching contacts...');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Contacts fetched successfully:', data);
                if (data.success && data.contacts) {
                    setContactSubmissions(data.contacts);
                }
            } else {
                console.error('❌ Failed to fetch contacts:', response.status);
            }
        } catch (error) {
            console.error('❌ Error fetching contacts:', error);
        }
    };
    
    // Handle contact status update
    const handleUpdateContactStatus = async (contactId, newStatus) => {
        try {
            console.log(`🔄 Updating contact ${contactId} status to: ${newStatus}`);
            
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
    
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contact/${contactId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
    
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Update local state
                    setContactSubmissions(prevContacts => 
                        prevContacts.map(contact => 
                            contact._id === contactId 
                                ? { ...contact, status: newStatus, updatedAt: new Date().toISOString() }
                                : contact
                        )
                    );
                    
                    alert(`Contact status updated to ${newStatus} successfully!`);
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const errorData = await response.json();
                alert(`Error updating status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating contact status:', error);
            alert('Error updating contact status. Please try again.');
        }
    };
    
    // View contact details
    const viewContactDetails = (contact) => {
        console.log('👁️ Viewing contact details:', contact);
        setSelectedContact(contact);
        setShowContactDetails(true);
    };
    
    // Close contact details modal
    const closeContactDetails = () => {
        setShowContactDetails(false);
        setSelectedContact(null);
    };
    
    // Delete contact functions
    const deleteContact = (contact) => {
        console.log('🗑️ DELETE CONTACT CLICKED!');
        console.log('Contact to delete:', contact);
        setContactToDelete(contact);
        setShowDeleteContactConfirm(true);
    };
    
    const confirmDeleteContact = async () => {
        console.log('🔥 DELETE CONTACT CONFIRMATION CLICKED!');
        console.log('Contact to delete:', contactToDelete);
        
        if (!contactToDelete) {
            alert('No contact selected for deletion');
            return;
        }
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            console.log('🗑️ Attempting to delete contact:', contactToDelete._id);
            
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contact/${contactToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Delete contact response status:', response.status);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Delete contact successful:', result);
                
                if (result.success) {
                    // Remove contact from local state
                    setContactSubmissions(prevContacts => 
                        prevContacts.filter(contact => contact._id !== contactToDelete._id)
                    );
                    
                    // Reset modal state
                    setShowDeleteContactConfirm(false);
                    setContactToDelete(null);
                    
                    alert('Contact deleted successfully!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const errorText = await response.text();
                console.error('Delete contact failed:', errorText);
                
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || 'Unknown error';
                } catch {
                    errorMessage = errorText || 'Unknown error';
                }
                
                alert(`Error deleting contact: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact. Please try again.');
        }
    };
    
    const cancelDeleteContact = () => {
        setShowDeleteContactConfirm(false);
        setContactToDelete(null);
    };

    // Update your existing useEffect to include contacts
    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchContacts(); // Add this line
        }
    }, [user]);

    // Update pagination helper functions
    const getTotalPages = () => {
        const filteredUsers = getFilteredUsers();
        return Math.ceil(filteredUsers.length / itemsPerPage);
    };

    const getCurrentPageItems = () => {
        const filteredUsers = getFilteredUsers();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
            setCurrentPage(pageNumber);
            // Smooth scroll to top of table when page changes
            document.querySelector('.overflow-x-auto')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < getTotalPages()) {
            handlePageChange(currentPage + 1);
        }
    };

    // Enhanced pagination component with better UX
    const renderPagination = () => {
        const totalPages = getTotalPages();
        const filteredUsers = getFilteredUsers();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
        
        if (totalPages <= 1) return null;

        // Generate page numbers to show
        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
                // Show all pages if total pages is small
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show smart pagination
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);
                
                // Always show first page
                if (startPage > 1) {
                    pages.push(1);
                    if (startPage > 2) pages.push('...');
                }
                
                // Show current range
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }
                
                // Always show last page
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                }
            }
            
            return pages;
        };

        return (
            <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Results Info */}
                <div className={`text-sm mb-4 sm:mb-0 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    <div className="flex items-center space-x-1">
                        <span>{t('userManagement.footer.showing')}</span>
                        <span className={`font-semibold px-2 py-1 rounded-lg transition-colors duration-300 ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {startIndex + 1} - {endIndex}
                        </span>
                        <span>{t('userManagement.footer.of')}</span>
                        <span className={`font-semibold px-2 py-1 rounded-lg transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                        }`}>
                            {filteredUsers.length}
                        </span>
                        <span>{t('userManagement.footer.users')}</span>
                        {(searchTerm || selectedRole || selectedStatus) && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                                isDarkMode ? 'bg-orange-900/50 text-orange-300 border border-orange-700/50' : 'bg-orange-100 text-orange-800'
                            }`}>
                                🔍 {t('userManagement.footer.filtered')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            currentPage === 1
                                ? isDarkMode 
                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                : isDarkMode 
                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                        }`}
                        title={t('userManagement.footer.previous')}
                    >
                        <span className="mr-1">←</span>
                        {t('userManagement.footer.previous')}
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <div key={index}>
                                {page === '...' ? (
                                    <span className={`px-3 py-2 text-sm transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            currentPage === page
                                                ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                                                : isDarkMode 
                                                    ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                        }`}
                                        title={`${t('userManagement.footer.goToPage')} ${page}`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            currentPage === totalPages
                                ? isDarkMode 
                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                : isDarkMode 
                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                        }`}
                        title={t('userManagement.footer.next')}
                    >
                        {t('userManagement.footer.next')}
                        <span className="ml-1">→</span>
                    </button>
                </div>

                {/* Quick Jump (for large datasets) */}
                {totalPages > 10 && (
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                        <span className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {t('userManagement.footer.page')}:
                        </span>
                        <select
                            value={currentPage}
                            onChange={(e) => handlePageChange(parseInt(e.target.value))}
                            className={`px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                isDarkMode 
                                    ? 'border-gray-600 bg-gray-800 text-gray-300' 
                                    : 'border-gray-300 bg-white text-gray-900'
                            }`}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <option key={page} value={page}>
                                    {page}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
    };

    // Add these helper functions for application pagination
    const getCurrentPageApplications = () => {
        const filteredApplications = getFilteredApplications();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredApplications.slice(startIndex, endIndex);
    };

    const getTotalApplicationPages = () => {
        const filteredApplications = getFilteredApplications();
        return Math.ceil(filteredApplications.length / itemsPerPage);
    };

    const handleApplicationPageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= getTotalApplicationPages()) {
            setCurrentPage(pageNumber);
            // Smooth scroll to top of table when page changes
            document.querySelector('.overflow-x-auto')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    const handleApplicationPreviousPage = () => {
        if (currentPage > 1) {
            handleApplicationPageChange(currentPage - 1);
        }
    };

    const handleApplicationNextPage = () => {
        if (currentPage < getTotalApplicationPages()) {
            handleApplicationPageChange(currentPage + 1);
        }
    };

    const renderApplicationPagination = () => {
        const totalPages = getTotalApplicationPages();
        const filteredApplications = getFilteredApplications();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredApplications.length);
        
        if (totalPages <= 1) return null;
    
        // Generate page numbers to show
        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);
                
                if (startPage > 1) {
                    pages.push(1);
                    if (startPage > 2) pages.push('...');
                }
                
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }
                
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                }
            }
            
            return pages;
        };
        return (
            <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Results Info */}
                {/* Results Info */}
                <div className={`text-sm mb-4 sm:mb-0 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    <div className="flex items-center space-x-2 flex-wrap">
                        <span>
                            {t('applicationManagement.pagination.showing') || 'Showing'}
                        </span>
                        <span className={`font-semibold px-2 py-1 rounded ${
                            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {filteredApplications.length > 0 ? startIndex + 1 : 0} - {endIndex}
                        </span>
                        <span>
                            {t('applicationManagement.pagination.of') || 'of'}
                        </span>
                        <span className={`font-semibold px-2 py-1 rounded ${
                            isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                        }`}>
                            {filteredApplications.length}
                        </span>
                        <span>
                            {t('applicationManagement.pagination.results') || 'applications'}
                        </span>
                        {(searchTermApp || selectedProgram || selectedAppStatus) && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800'
                            }`}>
                                🔍 {t('applicationManagement.pagination.filtered') || 'Filtered'}
                            </span>
                        )}
                    </div>
                </div>
    
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button 
                        onClick={handleApplicationPreviousPage}
                        disabled={currentPage === 1}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            currentPage === 1
                                ? isDarkMode 
                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                : isDarkMode 
                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                    >
                        <span className="mr-1">←</span>
                        <span className="hidden sm:inline">
                            {t('applicationManagement.pagination.previous') || 'Previous'}
                        </span>
                        <span className="sm:hidden">
                            {t('applicationManagement.pagination.prev') || 'Prev'}
                        </span>
                    </button>
    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <div key={index}>
                                {page === '...' ? (
                                    <span className={`px-3 py-2 text-sm ${
                                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleApplicationPageChange(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === page
                                                ? 'text-white bg-blue-600'
                                                : isDarkMode 
                                                    ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700' 
                                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
    
                    {/* Next Button */}
                    <button 
                        onClick={handleApplicationNextPage}
                        disabled={currentPage === getTotalApplicationPages()}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            currentPage === getTotalApplicationPages()
                                ? isDarkMode 
                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                : isDarkMode 
                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                    >
                        <span className="hidden sm:inline">
                            {t('applicationManagement.pagination.next') || 'Next'}
                        </span>
                        <span className="sm:hidden">
                            {t('applicationManagement.pagination.next') || 'Next'}
                        </span>
                        <span className="ml-1">→</span>
                    </button>
                </div>
    
                {/* Quick Jump for Large Datasets */}
                {totalPages > 10 && (
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                        <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {t('applicationManagement.pagination.page') || 'Page'}:
                        </span>
                        <select
                            value={currentPage}
                            onChange={(e) => handleApplicationPageChange(parseInt(e.target.value))}
                            className={`px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isDarkMode 
                                    ? 'border-gray-600 bg-gray-800 text-gray-300' 
                                    : 'border-gray-300 bg-white text-gray-900'
                            }`}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <option key={page} value={page}>
                                    {page}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
    };

    // Add useEffect to reset pagination when application filters change
    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTermApp, selectedProgram, selectedAppStatus]);

    // Update the useEffect to reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, selectedRole, selectedStatus]);

    const handleLanguageToggle = (language) => {
        setCurrentLanguage(language);
        
        // If using react-i18next or similar i18n library
        if (typeof i18n !== 'undefined' && i18n.changeLanguage) {
            i18n.changeLanguage(language);
        }
        
        // Store preference in localStorage
        localStorage.setItem('preferredLanguage', language);
        
        // Optional: Send to backend to save user preference
        try {
            // Example API call to save language preference
            fetch('/api/user/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ language: language })
            });
        } catch (error) {
            console.log('Could not save language preference:', error);
        }
    };

    const handleThemeToggle = (theme) => {
        const isDark = theme === 'dark';
        setIsDarkMode(isDark);
        localStorage.setItem('preferredTheme', theme);
        
        // Apply dark mode classes to body and document
        if (isDark) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            // Apply dark styles to the entire page
            document.body.style.backgroundColor = '#1f2937';
            document.body.style.color = '#f9fafb';
        } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            // Reset to light styles
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        }
        console.log(`Theme switched to: ${theme}`);
    };

    // Theme toggle handler (if you don't have this)
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('preferredTheme', !isDarkMode ? 'dark' : 'light');
    };

    // Update useEffect to load saved language preference
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        const savedTheme = localStorage.getItem('preferredTheme');
        
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
            setCurrentLanguage(savedLanguage);
        } else {
            setCurrentLanguage(i18n.language);
        }
        
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, [i18n]);

    // Add new state for course creation
    const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
    const [newCourseData, setNewCourseData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: '',
        maxStudents: '',
        price: '',
        tags: '',
        syllabus: ''
    });
    
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [dashboardData, setDashboardData] = useState({
        student: {
            journeyProgress: 68,
            completedMilestones: 12,
            totalMilestones: 18,
            streak: 7,
            upcomingDeadlines: [
                { id: 1, title: 'Data Analysis Project', dueDate: '2025-06-02', course: 'Data Science', urgent: true },
                { id: 2, title: 'JavaScript Quiz', dueDate: '2025-06-05', course: 'Web Development', urgent: false },
                { id: 3, title: 'ML Algorithm Report', dueDate: '2025-06-08', course: 'Machine Learning', urgent: false }
            ],
            studyGoals: { weekly: 20, completed: 14 },
            performanceData: {
                strengths: ['Data Visualization', 'Problem Solving'],
                improvements: ['Time Management', 'Code Optimization']
            }
        },
        teacher: {
            classEngagement: 84,
            studentSentiment: 'positive',
            activePolls: 2,
            pendingGrading: 15,
            recentActivity: [
                { type: 'quiz_completed', student: 'John Doe', course: 'Data Science 101', score: 95 },
                { type: 'question_asked', student: 'Jane Smith', course: 'Advanced Analytics', time: '2 mins ago' }
            ],
            engagementHeatmap: {
                'Data Visualization': 92,
                'Statistical Analysis': 78,
                'Python Programming': 85,
                'Machine Learning': 71
            }
        },
        admin: {
            systemHealth: 98.5,
            activeUsers: 1247,
            serverLoad: 34,
            storageUsed: 67,
            recentAlerts: [
                { type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
                { type: 'warning', message: 'High traffic detected on course enrollment', time: '3 hours ago' }
            ],
            userGrowth: { thisWeek: 23, lastWeek: 18 },
            contentApprovals: 5,
            pendingContacts: 0,
            pendingApplications: 0
        }
    });

    const history = useHistory();
    // Base API URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    // const getToken = localStorage.getItem("authToken");
    const getToken = () => localStorage.getItem("authToken");

    // const API_BASE_URL = process.env.REACT_APP_API_URL ;
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server

    // const API_BASE_URL = process.env.REACT_APP_API_URL ;
    // const token = localStorage.getItem("token");
    // const API_BASE_URL = 'http://localhost:5000'; // Test with local server

    const fetchPendingUsers = async (token) => {
        try {
            console.log('Fetching pending users...');
            const response = await fetch(`${API_BASE_URL}/api/auth/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Pending users response:', data);
                const users = data.users || data || [];
                setPendingUsers(users);
                console.log('Pending users set:', users);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingApplications: users.length
                    }
                }));
            } else {
                console.warn('Pending users endpoint returned error:', response.status);
                setPendingUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
            setPendingUsers([]);
        }
    };

    // Around line 102, update the fetchApplicationSubmissions function:
    const fetchApplicationSubmissions = async (token) => {
        try {
            console.log('Fetching application submissions...');
            console.log('API URL:', `${API_BASE_URL}/api/applications`); // Remove /all
            
            const response = await fetch(`${API_BASE_URL}/api/applications`, { // Remove /all
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Applications response status:', response.status);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Applications response:', data);
                const applications = data.applications || data || [];
                setApplicationSubmissions(applications);
                console.log('Applications set:', applications);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingApplications: applications.filter(app => app.status === 'pending').length
                    }
                }));
            } else {
                const errorText = await response.text();
                console.error('Applications endpoint returned error:', response.status, errorText);
                setApplicationSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            setApplicationSubmissions([]);
        }
    };
    
    // Around line 162, update the fetchContactSubmissions function:
    const fetchContactSubmissions = async (token) => {
        try {
            console.log('Fetching contact submissions...');
            const response = await fetch(`${API_BASE_URL}/api/contact`, { // Remove /all
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Contacts response:', data);
                const contacts = data.contacts || data || [];
                setContactSubmissions(contacts);
                console.log('Contacts set:', contacts);
                
                // Update dashboard data
                setDashboardData(prev => ({
                    ...prev,
                    admin: {
                        ...prev.admin,
                        pendingContacts: contacts.filter(contact => contact.status === 'pending').length
                    }
                }));
            } else {
                console.warn('Contacts endpoint returned error:', response.status);
                setContactSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch contact submissions:', error);
            setContactSubmissions([]);
        }
    };

    const fetchAllUsers = async (token) => {
        try {
            console.log('Fetching all users...');
            const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('All users response:', data);
                const users = data.users || data || [];
                setAllUsers(users);
                console.log('All users set:', users);
            } else {
                console.warn('Users endpoint returned error:', response.status);
                setAllUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch all users:', error);
            setAllUsers([]);
        }
    };

    const handleUserApproval = async (userId, approve) => {
        const token = getToken();
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/approval`, { // ✅ Use new user routes
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approved: approve })
            });

            if (response.ok) {
                await fetchPendingUsers(token);
                await fetchAllUsers(token);
                alert(`User ${approve ? 'approved' : 'rejected'} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${approve ? 'approve' : 'reject'} user: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${approve ? 'approve' : 'reject'} user:`, error);
            alert(`Error: Failed to ${approve ? 'approve' : 'reject'} user`);
        }
    };

    const handleContactAction = async (contactId, action) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/${contactId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: action })
            });

            if (response.ok) {
                await fetchContactSubmissions(token);
                alert(`Contact submission ${action} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${action} contact: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${action} contact submission:`, error);
            alert(`Error: Failed to ${action} contact submission`);
        }
    };

    const handleApplicationAction = async (applicationId, action) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: action })
            });

            if (response.ok) {
                await fetchApplicationSubmissions(token);
                alert(`Application ${action} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${action} application: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to ${action} application:`, error);
            alert(`Error: Failed to ${action} application`);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const token = getToken(); // Use helper function
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/create-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
            });

            if (response.ok) {
                alert('User created successfully!');
                setShowCreateUserForm(false);
                setNewUserData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'student'
                });
                await fetchAllUsers(token);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    // ✅ User Management Functions
    const handleEditUser = (user) => {
        console.log('✏️ Edit user clicked:', user);
        setEditingUser(user);
        setNewUserData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: '' // Don't populate password for security
        });
        setShowEditUserForm(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const updateData = {
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                role: newUserData.role
            };
            
            // Only include password if it was provided
            if (newUserData.password.trim()) {
                updateData.password = newUserData.password;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update response:', result);
                
                // ✅ Use the user object from the response
                const updatedUser = result.user;
                
                // Update the user in the local state
                setAllUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === editingUser._id ? updatedUser : user
                    )
                );
                
                // Reset form state
                setShowEditUserForm(false);
                setEditingUser(null);
                setNewUserData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'student'
                });
                
                alert('User updated successfully!');
            } else {
                const error = await response.json();
                alert(`Error updating user: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
        }
    };

    const confirmDeleteUser = async () => {
        console.log('🔥 DELETE CONFIRMATION CLICKED!');
        console.log('User to delete:', userToDelete);
        
        if (!userToDelete) {
            alert('No user selected for deletion');
            return;
        }
        
        try {
            const token = getToken();
            if (!token) {
                alert('No authentication token found');
                return;
            }
            
            console.log('🗑️ Attempting to delete user:', userToDelete._id);
            
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Delete successful:', result);
                
                if (result.success) {
                    // Remove user from local state
                    setAllUsers(prevUsers => 
                        prevUsers.filter(user => user._id !== userToDelete._id)
                    );
                    
                    // Reset modal state
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                    
                    alert('User deleted successfully!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } else {
                const error = await response.json();
                console.error('Delete failed:', error);
                alert(`Error deleting user: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    };

    const handleDeleteUser = (user) => {
        console.log('🎯 DELETE BUTTON CLICKED!');
        console.log('👤 User data:', user);
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const getFilteredUsers = () => {
        return allUsers.filter(user => {
            const matchesSearch = searchTerm === '' || 
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = selectedRole === '' || user.role === selectedRole;
            
            const matchesStatus = selectedStatus === '' || 
                (selectedStatus === 'approved' && user.isApproved) ||
                (selectedStatus === 'pending' && !user.isApproved);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    };

    // const getFilteredApplications = () => {
    //     // Debug: Show actual program values in the data
    //     const uniquePrograms = [...new Set(applicationSubmissions.map(app => app.program).filter(Boolean))];
    //     console.log('🔍 Unique program values in database:', uniquePrograms);
        
    //     const filtered = applicationSubmissions.filter(app => {
    //         const matchesSearch = !searchTermApp || 
    //             app.firstName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
    //             app.lastName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
    //             app.email?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
    //             app.program?.toLowerCase().includes(searchTermApp.toLowerCase());
            
    //         // FIX: Handle all possible "all programs" values properly
    //         const matchesProgram = !selectedProgram || 
    //             selectedProgram === '' || 
    //             selectedProgram === 'All Programs' || 
    //             selectedProgram === 'all' ||
    //             selectedProgram === 'All' ||
    //             app.program === selectedProgram; // ✅ This should match exactly with database values
                
    //         const matchesStatus = !selectedAppStatus || 
    //             selectedAppStatus === '' || 
    //             selectedAppStatus === 'All Statuses' || 
    //             selectedAppStatus === 'all' ||
    //             app.status === selectedAppStatus;
            
    //         return matchesSearch && matchesProgram && matchesStatus;
    //     });
        
    //     console.log('📊 Filtered applications:', filtered.length);
    //     return filtered;
    // };
        const getFilteredApplications = () => {
        return applicationSubmissions.filter(application => {
            const matchesSearch = !searchTermApp || 
                application.firstName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
                application.lastName?.toLowerCase().includes(searchTermApp.toLowerCase()) ||
                application.email?.toLowerCase().includes(searchTermApp.toLowerCase());
            
            const matchesProgram = !selectedProgram || application.program === selectedProgram;
            
            const matchesStatus = !selectedAppStatus || application.status === selectedAppStatus;
            
            return matchesSearch && matchesProgram && matchesStatus;
        });
    };
    
    const getFilteredContacts = () => {
        const uniqueSubjects = [...new Set(contactSubmissions.map(c => c.subject).filter(Boolean))];
        // console.log('🔍 Unique subject values in database:', uniqueSubjects);
        
        // Rest of your existing filtering logic...
        const filtered = contactSubmissions.filter(contact => {
            const matchesSearch = !searchTermContact || 
                contact.name?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.email?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.subject?.toLowerCase().includes(searchTermContact.toLowerCase()) ||
                contact.message?.toLowerCase().includes(searchTermContact.toLowerCase());
            
            const matchesCategory = !selectedCategory || 
                selectedCategory === '' || 
                selectedCategory === 'All Categories' || 
                selectedCategory === 'all' ||
                selectedCategory === 'All' ||
                contact.subject === selectedCategory;
                
            const matchesStatus = !selectedContactStatus || 
                selectedContactStatus === '' || 
                selectedContactStatus === 'All Statuses' || 
                selectedContactStatus === 'all' ||
                contact.status === selectedContactStatus;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
        
        // console.log('📊 Filtered results:', filtered.length);
        return filtered;
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const token = getToken();
        
        try {
            const coursePayload = {
                ...newCourseData,
                tags: newCourseData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                maxStudents: parseInt(newCourseData.maxStudents) || 0,
                price: parseFloat(newCourseData.price) || 0
            };

            const response = await fetch(`${API_BASE_URL}/api/courses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coursePayload)
            });

            if (response.ok) {
                const createdCourse = await response.json();
                alert('Course created successfully!');
                setShowCreateCourseForm(false);
                setNewCourseData({
                    title: '',
                    description: '',
                    category: '',
                    level: 'beginner',
                    duration: '',
                    maxStudents: '',
                    price: '',
                    tags: '',
                    syllabus: ''
                });
                // Optionally refresh course list here
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to create course'}`);
            }
        } catch (error) {
            console.error('Failed to create course:', error);
            alert('Failed to create course. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        history.push('/');
    };
    
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken(); // Use helper function
            
            console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'MISSING');
            console.log('🌐 API_BASE_URL:', API_BASE_URL);
            
            if (!token) {
                console.log('❌ No token found, redirecting to home');
                history.push('/');
                return;
            }

            try {
                console.log('🔍 Checking authentication...');
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('👤 Auth response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Authentication failed: ${response.status}`);
                }

                const data = await response.json();
                const userData = data.user;
                console.log('✅ User authenticated:', userData);

                setUser({
                    id: userData.id || userData._id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    name: `${userData.firstName} ${userData.lastName}`.trim() || userData.email?.split('@')[0] || 'User',
                    isApproved: userData.isApproved
                });

                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userEmail', userData.email);

                // Enhanced admin data fetching with better error handling
                if (userData.role === 'admin') {
                    console.log('👑 Admin user detected, fetching admin data...');
                    
                    try {
                        console.log('📋 Fetching applications...');
                        await fetchApplicationSubmissions(token);
                        console.log('✅ Applications fetch completed');
                    } catch (error) {
                        console.error('❌ Applications fetch failed:', error);
                    }

                    try {
                        console.log('📧 Fetching contacts...');
                        await fetchContactSubmissions(token);
                        console.log('✅ Contacts fetch completed');
                    } catch (error) {
                        console.error('❌ Contacts fetch failed:', error);
                    }

                    try {
                        console.log('👥 Fetching users...');
                        await fetchPendingUsers(token);
                        await fetchAllUsers(token);
                        console.log('✅ Users fetch completed');
                    } catch (error) {
                        console.error('❌ Users fetch failed:', error);
                    }
                }

            } catch (error) {
                console.error('❌ Authentication error:', error);
                localStorage.clear();
                history.push('/');
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [history, API_BASE_URL]);
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center max-w-md mx-4">
                    {/* Animated Spinner */}
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 border-r-blue-400 rounded-full animate-spin animation-delay-75"></div>
                        <div className="absolute inset-4 border-4 border-transparent border-t-blue-300 border-r-purple-300 rounded-full animate-spin animation-delay-150"></div>
                    </div>
    
                    {/* Loading Text */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                            <span className="mr-2">🚀</span>
                            Loading Your Dashboard
                        </h2>
                        <p className="text-gray-600 text-lg font-medium">
                            Preparing your personalized experience...
                        </p>
                        
                        {/* Progress Dots */}
                        <div className="flex justify-center space-x-2 mt-6">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
                        </div>
    
                        {/* Loading Steps */}
                        <div className="mt-8 space-y-2 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Authenticating user</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Loading dashboard data</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span>Customizing interface</span>
                            </div>
                        </div>
                    </div>
    
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Student Dashboard Components
    const renderStudentDashboard = () => {
        if (activeTab === 'overview') {
            return renderStudentOverview();
        } else if (activeTab === 'courses') {
            return renderStudentCourses();
        } else if (activeTab === 'analytics') {
            return renderStudentAnalytics();
        } else if (activeTab === 'messages') {
            return renderStudentMessages();
        } else if (activeTab === 'settings') {
            return renderStudentSettings();
        }
        return renderStudentOverview();
    };
    
    const renderStudentOverview = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Hero Section - Learning Journey */}
            <div className={`${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700' 
                    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-gray-200'
            } rounded-3xl p-8 shadow-xl overflow-hidden relative`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${
                    isDarkMode 
                        ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
                        : 'bg-gradient-to-br from-blue-200/30 to-purple-200/30'
                } rounded-full -translate-y-32 translate-x-32`}></div>
                <div className={`absolute bottom-0 left-0 w-48 h-48 ${
                    isDarkMode 
                        ? 'bg-gradient-to-tr from-indigo-900/30 to-pink-900/30' 
                        : 'bg-gradient-to-tr from-indigo-200/30 to-pink-200/30'
                } rounded-full translate-y-24 -translate-x-24`}></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Progress Circle */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-48 h-48">
                            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke={isDarkMode ? "rgba(75, 85, 99, 0.8)" : "rgba(229, 231, 235, 0.8)"} 
                                    strokeWidth="6" 
                                    fill="transparent"
                                />
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke="url(#progressGradient)" 
                                    strokeWidth="6" 
                                    fill="transparent"
                                    strokeDasharray={`${dashboardData.student.journeyProgress * 2.51} 251`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className={`text-4xl font-bold mb-1 ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>{dashboardData.student.journeyProgress}%</div>
                                    <div className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Journey Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>Your Learning Journey</h1>
                            <p className={`text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Keep up the amazing progress! You're doing great.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800/60 border-gray-600/50' 
                                    : 'bg-white/60 border-white/50'
                            } backdrop-blur-sm rounded-2xl p-6 border`}>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🎯</span>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{dashboardData.student.completedMilestones}</div>
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Milestones Achieved</div>
                                    </div>
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {dashboardData.student.totalMilestones - dashboardData.student.completedMilestones} more to go
                                </div>
                            </div>
    
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800/60 border-gray-600/50' 
                                    : 'bg-white/60 border-white/50'
                            } backdrop-blur-sm rounded-2xl p-6 border`}>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🔥</span>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{dashboardData.student.streak}</div>
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Day Streak</div>
                                    </div>
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Keep it up!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">4</div>
                                <div className="text-blue-100 text-sm font-medium">Active Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This month</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏰</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{dashboardData.student.upcomingDeadlines.length}</div>
                                <div className="text-green-100 text-sm font-medium">Deadlines</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Urgent</span>
                            <span className="font-semibold text-red-600">1 due soon</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{dashboardData.student.studyGoals.completed}h</div>
                                <div className="text-purple-100 text-sm font-medium">Study Hours</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Weekly goal</span>
                            <span className="font-semibold text-purple-600">{dashboardData.student.studyGoals.weekly}h</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                } rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">A-</div>
                                <div className="text-orange-100 text-sm font-medium">Avg Grade</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Improvement</span>
                            <span className="font-semibold text-green-600">+0.2</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Recommendations */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">🤖</span>
                                AI Study Recommendations
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Personalized suggestions to boost your learning</p>
                        </div>
                        <div className="p-6">
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700' 
                                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                            } rounded-2xl p-6 border`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">🔥</span>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                High Priority
                                            </span>
                                            <div className={`text-sm mt-1 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>Estimated: 45 minutes</div>
                                        </div>
                                    </div>
                                </div>
                                <h4 className={`text-lg font-semibold mb-2 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>Review Statistical Hypothesis Testing</h4>
                                <p className={`mb-4 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>Based on your recent quiz performance, focusing on this topic will boost your Data Science grade significantly.</p>
                                <div className="flex space-x-3">
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <span className="mr-2">🚀</span>
                                        Start Study Session
                                    </button>
                                    <button className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}>
                                        <span className="mr-2">📅</span>
                                        Schedule Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Upcoming Deadlines */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-orange-900/50 to-red-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-orange-50 to-red-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">📅</span>
                                Upcoming Deadlines
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Stay on top of your assignments</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {dashboardData.student.upcomingDeadlines.map(deadline => (
                                    <div key={deadline.id} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                                        deadline.urgent 
                                            ? isDarkMode 
                                                ? 'bg-red-900/20 border-red-700' 
                                                : 'bg-red-25 border-red-200'
                                            : isDarkMode 
                                                ? 'bg-gray-700 border-gray-600' 
                                                : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <div className="flex-shrink-0">
                                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-semibold ${
                                                deadline.urgent ? 'bg-red-500' : 'bg-blue-500'
                                            }`}>
                                                <span className="text-lg">{new Date(deadline.dueDate).getDate()}</span>
                                                <span className="text-xs">{new Date(deadline.dueDate).toLocaleDateString('en', { month: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-semibold truncate ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{deadline.title}</h4>
                                            <p className={`text-sm ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>{deadline.course}</p>
                                            <div className="flex items-center mt-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    deadline.urgent ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {deadline.urgent ? '⚠️ Due soon' : `${Math.ceil((new Date(deadline.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="flex-shrink-0 inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <span className="mr-1">📝</span>
                                            Work On It
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Sidebar Content */}
                <div className="space-y-8">
                    {/* Performance Insights */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">📈</span>
                                Performance Insights
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 flex items-center ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <span className="mr-2">💪</span>
                                    Your Strengths
                                </h4>
                                <div className="space-y-2">
                                    {dashboardData.student.performanceData.strengths.map((strength, index) => (
                                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2 mb-2">
                                            <span className="mr-1">✨</span>
                                            {strength}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 flex items-center ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <span className="mr-2">🎯</span>
                                    Areas for Growth
                                </h4>
                                <div className="space-y-2">
                                    {dashboardData.student.performanceData.improvements.map((improvement, index) => (
                                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mr-2 mb-2">
                                            <span className="mr-1">📈</span>
                                            {improvement}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-100'
                    } rounded-2xl shadow-xl overflow-hidden`}>
                        <div className={`p-6 border-b ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                                : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                        }`}>
                            <h3 className={`text-lg font-semibold flex items-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                <span className="mr-2">⚡</span>
                                Quick Actions
                            </h3>
                            <p className={`text-sm mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Get things done faster</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                    isDarkMode 
                                        ? 'bg-blue-900/20 border-blue-700 hover:bg-blue-800/30' 
                                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                }`}>
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Ask Question</span>
                                </button>
                                <button className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                    isDarkMode 
                                        ? 'bg-green-900/20 border-green-700 hover:bg-green-800/30' 
                                        : 'bg-green-50 border-green-200 hover:bg-green-100'
                                }`}>
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Take Quiz</span>
                                </button>
                                <button className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                    isDarkMode 
                                        ? 'bg-purple-900/20 border-purple-700 hover:bg-purple-800/30' 
                                        : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                                }`}>
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Set Goal</span>
                                </button>
                                <button className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${
                                    isDarkMode 
                                        ? 'bg-orange-900/20 border-orange-700 hover:bg-orange-800/30' 
                                        : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                                }`}>
                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📖</span>
                                    <span className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Study Notes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentCourses = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📚</span>
                        My Learning Path
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Track your progress across all enrolled courses
                    </p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <span className="mr-2">🔍</span>
                    Browse More Courses
                </button>
            </div>
    
            {/* Learning Progress Overview */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📊</span>
                        Overall Progress
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Your learning statistics at a glance
                    </p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Course Completion Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#3b82f6" 
                                        strokeWidth="2"
                                        strokeDasharray="75, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">75%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Course Completion
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                3 of 4 courses completed
                            </p>
                        </div>
    
                        {/* Assignment Score Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="2"
                                        strokeDasharray="88, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-green-600">88%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Assignment Score
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                Average across all courses
                            </p>
                        </div>
    
                        {/* Study Goal Card */}
                        <div className={`text-center p-6 ${isDarkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'} rounded-2xl border transition-colors duration-300`}>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                                        strokeWidth="2"
                                    />
                                    <circle 
                                        cx="18" 
                                        cy="18" 
                                        r="16" 
                                        fill="none" 
                                        stroke="#f59e0b" 
                                        strokeWidth="2"
                                        strokeDasharray="60, 100" 
                                        strokeLinecap="round" 
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-orange-600">60%</span>
                                </div>
                            </div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                Study Goal
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                12h of 20h weekly goal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Enrolled Courses */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📖</span>
                        Enrolled Courses
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Continue your learning journey
                    </p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Data Science Course Card */}
                        <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        📊
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Data Science
                                        </span>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                            Beginner Level
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                Introduction to Data Science
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                Learn the fundamentals of data analysis, visualization, and statistical thinking.
                            </p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                        Progress
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        85% Complete
                                    </span>
                                </div>
                                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 transition-colors duration-300`}>
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                    Next: Python Basics
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📁</span>
                                    Materials
                                </button>
                            </div>
                        </div>
    
                        {/* JavaScript Course Card */}
                        <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-lg">
                                        💻
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Web Development
                                        </span>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                            Intermediate Level
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                Full-Stack JavaScript
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                Master modern JavaScript development with React, Node.js, and MongoDB.
                            </p>
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                        Progress
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        62% Complete
                                    </span>
                                </div>
                                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 transition-colors duration-300`}>
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" style={{width: '62%'}}></div>
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>
                                    Next: React Hooks
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <span className="mr-2">🚀</span>
                                    Continue Learning
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📁</span>
                                    Materials
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderStudentAnalytics = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">📊</span>
                        Learning Analytics
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Track your progress and discover insights about your learning journey
                    </p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <select className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                        <option>Last 30 days</option>
                        <option>This semester</option>
                        <option>All time</option>
                    </select>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        <span className="mr-2">📄</span>
                        Export Report
                    </button>
                </div>
            </div>
    
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📈</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">7</div>
                                <div className="text-blue-100 text-sm font-medium">Day Streak</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Since last week</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +2 days
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">88.5%</div>
                                <div className="text-green-100 text-sm font-medium">Avg Score</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Improvement</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="mr-1">↗</span>
                                +5.2%
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">14.5h</div>
                                <div className="text-orange-100 text-sm font-medium">Study Time</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' 
                            : 'bg-gradient-to-r from-orange-50 to-red-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This week</span>
                            <span className="font-semibold text-orange-600">Goal: 20h</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">3/4</div>
                                <div className="text-purple-100 text-sm font-medium">Goals Met</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>This month</span>
                            <span className="font-semibold text-purple-600">75% rate</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Trends */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">📈</span>
                            Performance Trends
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Your weekly progress overview
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Chart */}
                            <div className={`relative h-48 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30' 
                                    : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                            } rounded-xl p-4 transition-colors duration-300`}>
                                <div className="flex items-end justify-between h-full space-x-2">
                                    {[
                                        { week: 'Week 1', height: '70%', value: '85%', color: 'bg-blue-500' },
                                        { week: 'Week 2', height: '80%', value: '88%', color: 'bg-green-500' },
                                        { week: 'Week 3', height: '75%', value: '82%', color: 'bg-yellow-500' },
                                        { week: 'Week 4', height: '90%', value: '92%', color: 'bg-purple-500' }
                                    ].map((bar, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="relative group">
                                                <div 
                                                    className={`w-full ${bar.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer`}
                                                    style={{ height: bar.height }}
                                                ></div>
                                                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${
                                                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                                                } text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    {bar.value}
                                                </div>
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 font-medium transition-colors duration-300`}>
                                                {bar.week}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Performance Insights */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${
                                    isDarkMode 
                                        ? 'bg-green-900/30 border-green-700' 
                                        : 'bg-green-50 border-green-200'
                                } rounded-xl p-4 border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-green-600 text-lg">📈</span>
                                        <span className={`text-sm font-semibold ${
                                            isDarkMode ? 'text-green-400' : 'text-green-800'
                                        } transition-colors duration-300`}>Best Week</span>
                                    </div>
                                    <div className={`text-2xl font-bold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Week 4</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-green-400' : 'text-green-600'
                                    } transition-colors duration-300`}>92% average score</div>
                                </div>
                                <div className={`${
                                    isDarkMode 
                                        ? 'bg-orange-900/30 border-orange-700' 
                                        : 'bg-orange-50 border-orange-200'
                                } rounded-xl p-4 border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-orange-600 text-lg">🎯</span>
                                        <span className={`text-sm font-semibold ${
                                            isDarkMode ? 'text-orange-400' : 'text-orange-800'
                                        } transition-colors duration-300`}>Focus Area</span>
                                    </div>
                                    <div className={`text-sm font-bold ${
                                        isDarkMode ? 'text-orange-300' : 'text-orange-900'
                                    } transition-colors duration-300`}>Time Management</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                                    } transition-colors duration-300`}>Needs improvement</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Subject Performance */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">📚</span>
                            Subject Performance
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Performance across different subjects
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {[
                                { name: 'Data Science', score: 92, trend: '+8%', color: 'blue', bg: 'bg-blue-500' },
                                { name: 'JavaScript', score: 87, trend: '+3%', color: 'green', bg: 'bg-green-500' },
                                { name: 'Machine Learning', score: 78, trend: '-2%', color: 'orange', bg: 'bg-orange-500' }
                            ].map((subject, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 ${subject.bg} rounded-xl flex items-center justify-center text-white font-semibold text-sm`}>
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                    {subject.name}
                                                </h4>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    Current progress
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                {subject.score}%
                                            </div>
                                            <div className={`text-sm font-medium ${
                                                subject.trend.startsWith('+') ? 'text-green-600' : 
                                                subject.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                                {subject.trend}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div 
                                            className={`${subject.bg} h-3 rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: `${subject.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    
                {/* Recent Achievements */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-yellow-900/50 to-orange-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🏆</span>
                            Recent Achievements
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Your latest milestones and badges
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { 
                                    icon: '🔥', 
                                    title: 'Week Warrior', 
                                    desc: 'Completed 7 days of continuous learning',
                                    date: '2 days ago',
                                    color: 'bg-red-500'
                                },
                                { 
                                    icon: '⭐', 
                                    title: 'Quiz Master', 
                                    desc: 'Scored 95% or higher on 5 quizzes',
                                    date: '1 week ago',
                                    color: 'bg-yellow-500'
                                },
                                { 
                                    icon: '🎯', 
                                    title: 'Goal Crusher', 
                                    desc: 'Met all weekly study goals for the month',
                                    date: '2 weeks ago',
                                    color: 'bg-purple-500'
                                }
                            ].map((achievement, index) => (
                                <div key={index} className={`flex items-start space-x-4 p-4 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                } rounded-xl border transition-colors`}>
                                    <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-colors duration-300`}>
                                            {achievement.title}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
                                            {achievement.desc}
                                        </p>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>
                                            {achievement.date}
                                        </span>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}>
                                        <span className="text-lg">🔗</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className={`mt-6 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Next Achievement</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>Study for 30 days straight</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>7/30</div>
                                    <div className={`text-xs ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    } transition-colors duration-300`}>Days completed</div>
                                </div>
                            </div>
                            <div className={`mt-3 w-full ${
                                isDarkMode ? 'bg-blue-800' : 'bg-blue-200'
                            } rounded-full h-2 transition-colors duration-300`}>
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '23%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Study Patterns */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">⏰</span>
                            Study Patterns
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            When you learn best
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { time: '9:00 AM', level: 'High', percentage: 95, color: 'bg-green-500' },
                                { time: '11:00 AM', level: 'Medium', percentage: 70, color: 'bg-yellow-500' },
                                { time: '2:00 PM', level: 'High', percentage: 90, color: 'bg-green-500' },
                                { time: '4:00 PM', level: 'Low', percentage: 45, color: 'bg-red-500' },
                                { time: '7:00 PM', level: 'Medium', percentage: 75, color: 'bg-yellow-500' }
                            ].map((pattern, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className={`w-20 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                        {pattern.time}
                                    </div>
                                    <div className={`flex-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div 
                                            className={`${pattern.color} h-3 rounded-full transition-all duration-1000`}
                                            style={{ width: `${pattern.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className={`w-16 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                        {pattern.level}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className={`mt-6 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-green-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Productivity Tip</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-green-400' : 'text-green-700'
                                    } transition-colors duration-300`}>
                                        You're most focused at 9 AM and 2 PM. Schedule your toughest topics during these times!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentMessages = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">💬</span>
                        Messages & Discussions
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Connect with instructors, join study groups, and get help
                    </p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <span className="mr-2">❓</span>
                    Ask Question
                </button>
            </div>
    
            {/* Message Tabs */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
                    {['All Messages', 'My Questions', 'Study Groups', 'Announcements'].map((tab, index) => (
                        <button 
                            key={index}
                            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                                index === 0 
                                    ? `text-blue-600 border-blue-600 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` 
                                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:border-gray-400' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} border-transparent`
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
    
                {/* Messages Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Discussion Threads */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Unread Message */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            } rounded-2xl p-6 border relative overflow-hidden transition-colors duration-300`}>
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        New
                                    </span>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        👨‍🏫
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Dr. Smith
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Data Science 101
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                2 hours ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Assignment 3 - Additional Resources
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            I've uploaded some additional practice problems for the statistical analysis assignment. These will help you prepare for the upcoming quiz. Please review them before our next class.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    3 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    📢 Announcement
                                                </span>
                                            </div>
                                            <button className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg ${
                                                isDarkMode 
                                                    ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-800/50' 
                                                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                            } transition-colors`}>
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Study Group Message */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                            } rounded-2xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        👥
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Study Group #3
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                JavaScript Fundamentals
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                5 hours ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Weekly Study Session - React Hooks
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            Hey everyone! This week we're covering React Hooks. Anyone wants to join our virtual session this Saturday at 2 PM? We'll be going through useState and useEffect with practical examples.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    8 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    👥 Study Group
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className={`inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-lg text-green-700 ${
                                                    isDarkMode 
                                                        ? 'bg-green-900/50 hover:bg-green-800/50' 
                                                        : 'bg-green-50 hover:bg-green-100'
                                                } transition-colors`}>
                                                    Join
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${
                                                    isDarkMode 
                                                        ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                } text-sm font-medium rounded-lg transition-colors`}>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Question Thread */}
                            <div className={`${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                            } rounded-2xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        ME
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                My Question
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Machine Learning
                                            </span>
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                1 day ago
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Understanding Gradient Descent
                                        </h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                                            I'm having trouble understanding how the learning rate affects the gradient descent algorithm. Could someone explain with a simple example?
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                    <span className="mr-1">💬</span>
                                                    2 replies
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    ❓ Question
                                                </span>
                                            </div>
                                            <button className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg ${
                                                isDarkMode 
                                                    ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-800/50' 
                                                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                            } transition-colors`}>
                                                View Answers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Help */}
                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                                <div className={`p-6 border-b ${
                                    isDarkMode 
                                        ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                                        : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                                } transition-colors duration-300`}>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                        <span className="mr-2">🚀</span>
                                        Quick Help
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: '💡', label: 'Study Tips', color: isDarkMode ? 'bg-yellow-900/50 border-yellow-700 hover:bg-yellow-800/50' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
                                            { icon: '🔧', label: 'Tech Support', color: isDarkMode ? 'bg-blue-900/50 border-blue-700 hover:bg-blue-800/50' : 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
                                            { icon: '📚', label: 'Materials', color: isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-800/50' : 'bg-green-50 border-green-200 hover:bg-green-100' },
                                            { icon: '⏰', label: 'Schedule', color: isDarkMode ? 'bg-purple-900/50 border-purple-700 hover:bg-purple-800/50' : 'bg-purple-50 border-purple-200 hover:bg-purple-100' }
                                        ].map((item, index) => (
                                            <button key={index} className={`flex flex-col items-center p-4 rounded-xl border transition-colors group ${item.color}`}>
                                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                                                <span className={`text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                } transition-colors duration-300`}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
    
                            {/* AI Chat Preview */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">AI Tutor</h4>
                                        <p className="text-blue-100 text-sm">Available 24/7</p>
                                    </div>
                                </div>
                                <p className="text-blue-100 mb-4">Get instant help with your questions! Our AI tutor can explain concepts, help with homework, and provide study guidance.</p>
                                <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                    Start Chat
                                </button>
                            </div>
    
                            {/* Active Study Groups */}
                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300`}>
                                <div className={`p-6 border-b ${
                                    isDarkMode 
                                        ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                                        : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                                } transition-colors duration-300`}>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                        <span className="mr-2">👥</span>
                                        Your Study Groups
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[
                                            { name: 'React Masters', members: 12, active: true, color: 'bg-blue-500' },
                                            { name: 'Data Science Club', members: 8, active: false, color: 'bg-green-500' },
                                            { name: 'ML Beginners', members: 15, active: true, color: 'bg-purple-500' }
                                        ].map((group, index) => (
                                            <div key={index} className={`flex items-center space-x-3 p-3 ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                            } rounded-xl transition-colors duration-300`}>
                                                <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                        {group.name}
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                        {group.members} members
                                                    </div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full ${group.active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        + Join More Groups
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudentSettings = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">⚙️</span>
                        Account Settings
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        Manage your account preferences and settings
                    </p>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    💾 Save Changes
                </button>
            </div>
    
            {/* User Account Information */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${
                    isDarkMode 
                        ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
                        : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                } transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-2">👤</span>
                        Account Information
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                        Your profile and account details
                    </p>
                </div>
                <div className="p-6">
                    <div className="flex items-start space-x-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
                                <span className="text-sm">📷</span>
                            </button>
                        </div>
                        
                        {/* User Details */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={user?.name || "John Doe"}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || "john.doe@example.com"}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={user?.studentId || "STU2024001"}
                                        disabled
                                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-600 border-gray-600 text-gray-400' 
                                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Join Date
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="September 15, 2024"
                                        disabled
                                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                                            isDarkMode 
                                                ? 'bg-gray-600 border-gray-600 text-gray-400' 
                                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                        }`}
                                    />
                                </div>
                            </div>
    
                            <div>
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Bio
                                </label>
                                <textarea
                                    rows="3"
                                    defaultValue="Passionate student learning data science and machine learning. Always eager to explore new technologies and solve complex problems."
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Language & Display Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Language Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🌐</span>
                            Language Settings
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Choose your preferred language
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div 
                                onClick={() => handleLanguageToggle('en')}
                                className={`cursor-pointer flex items-center justify-between p-4 ${
                                    currentLanguage === 'en' 
                                        ? isDarkMode 
                                            ? 'bg-blue-900/50 border-blue-600' 
                                            : 'bg-blue-50 border-blue-300'
                                        : isDarkMode 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-gray-50 border-gray-200'
                                } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🇺🇸</span>
                                    </div>
                                    <div>
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            English
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            Default language
                                        </div>
                                    </div>
                                </div>
                                <div className={`relative w-6 h-6 rounded-full border-2 ${
                                    currentLanguage === 'en' 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : isDarkMode 
                                            ? 'border-gray-500' 
                                            : 'border-gray-300'
                                } transition-all duration-300`}>
                                    {currentLanguage === 'en' && (
                                        <div className="absolute inset-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
    
                            <div 
                                onClick={() => handleLanguageToggle('ja')}
                                className={`cursor-pointer flex items-center justify-between p-4 ${
                                    currentLanguage === 'ja' 
                                        ? isDarkMode 
                                            ? 'bg-red-900/50 border-red-600' 
                                            : 'bg-red-50 border-red-300'
                                        : isDarkMode 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-gray-50 border-gray-200'
                                } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🇯🇵</span>
                                    </div>
                                    <div>
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                            Japanese
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            日本語
                                        </div>
                                    </div>
                                </div>
                                <div className={`relative w-6 h-6 rounded-full border-2 ${
                                    currentLanguage === 'ja' 
                                        ? 'border-red-500 bg-red-500' 
                                        : isDarkMode 
                                            ? 'border-gray-500' 
                                            : 'border-gray-300'
                                } transition-all duration-300`}>
                                    {currentLanguage === 'ja' && (
                                        <div className="absolute inset-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        </div>
    
                        {/* Language Change Feedback */}
                        {currentLanguage !== 'en' && (
                            <div className={`p-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                            } rounded-xl border transition-all duration-300`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-600 text-2xl">✅</span>
                                    <div>
                                        <h4 className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-900'
                                        } transition-colors duration-300`}>Language Changed</h4>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-700'
                                        } transition-colors duration-300`}>
                                            Interface language has been updated to {currentLanguage === 'ja' ? 'Japanese (日本語)' : 'English'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
    
                        <div className={`p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Language Note</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>
                                        Changing language will apply to the interface. Course content language may vary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Display Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${
                        isDarkMode 
                            ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
                            : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                    } transition-colors duration-300`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-2">🎨</span>
                            Display Settings
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            Customize your visual experience
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                Theme Preference
                            </label>
                            
                            <div className="space-y-3">
                                <div 
                                    onClick={() => handleThemeToggle('light')}
                                    className={`cursor-pointer flex items-center justify-between p-4 ${
                                        !isDarkMode 
                                            ? 'bg-blue-50 border-blue-300' 
                                            : 'bg-gray-700 border-gray-600'
                                    } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">☀️</span>
                                        </div>
                                        <div>
                                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Light Mode
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                Bright and clean interface
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`relative w-6 h-6 rounded-full border-2 ${
                                        !isDarkMode 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : isDarkMode 
                                                ? 'border-gray-500' 
                                                : 'border-gray-300'
                                    } transition-all duration-300`}>
                                        {!isDarkMode && (
                                            <div className="absolute inset-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
    
                                <div 
                                    onClick={() => handleThemeToggle('dark')}
                                    className={`cursor-pointer flex items-center justify-between p-4 ${
                                        isDarkMode 
                                            ? 'bg-blue-900/50 border-blue-600' 
                                            : 'bg-gray-50 border-gray-200'
                                    } rounded-xl border transition-all duration-300 hover:scale-[1.02]`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">🌙</span>
                                        </div>
                                        <div>
                                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                Dark Mode
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                Easy on the eyes, perfect for night study
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`relative w-6 h-6 rounded-full border-2 ${
                                        isDarkMode 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-gray-300'
                                    } transition-all duration-300`}>
                                        {isDarkMode && (
                                            <div className="absolute inset-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Theme Change Feedback */}
                        <div className={`p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-green-600 text-2xl">✨</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-green-300' : 'text-green-900'
                                    } transition-colors duration-300`}>Theme Tip</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-green-400' : 'text-green-700'
                                    } transition-colors duration-300`}>
                                        {isDarkMode 
                                            ? 'Dark mode is active! Perfect for studying in low-light environments.' 
                                            : 'Light mode provides a bright, clean interface perfect for daytime use.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Teacher Dashboard Components    
    const renderTeacherDashboard = () => {
        if (activeTab === 'overview') {
            return renderTeacherOverview();
        } else if (activeTab === 'courses') {
            return renderTeacherCourses();
        } else if (activeTab === 'analytics') {
            return renderTeacherAnalytics();
        } else if (activeTab === 'messages') {
            return renderTeacherMessages();
        } else if (activeTab === 'settings') {
            return renderTeacherSettings();
        }
        return renderTeacherOverview();
    };

    const renderTeacherOverview = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Classroom Pulse Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
                
                <div className="relative z-10 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Pulse Indicator */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-40 h-40 mb-6">
                                {/* Animated pulse rings */}
                                <div className={`absolute inset-0 rounded-full border-4 ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'border-green-400' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'border-yellow-400' : 'border-red-400'
                                } animate-ping`}></div>
                                <div className={`absolute inset-2 rounded-full border-2 ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'border-green-300' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'border-yellow-300' : 'border-red-300'
                                } animate-pulse`}></div>
                                <div className={`absolute inset-4 rounded-full ${
                                    dashboardData.teacher.studentSentiment === 'positive' ? 'bg-green-400' :
                                    dashboardData.teacher.studentSentiment === 'neutral' ? 'bg-yellow-400' : 'bg-red-400'
                                } flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                                    {dashboardData.teacher.studentSentiment === 'positive' ? '😊' : 
                                        dashboardData.teacher.studentSentiment === 'neutral' ? '😐' : '😟'}
                                </div>
                            </div>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">Classroom Pulse</h2>
                                <p className="text-white/80 text-lg">Real-time engagement monitoring</p>
                            </div>
                        </div>
    
                        {/* Engagement Stats */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-emerald-300 text-2xl">📊</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Overall Engagement</h3>
                                            <p className="text-white/60 text-sm">Class participation rate</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">{dashboardData.teacher.classEngagement}%</div>
                                        <div className="text-emerald-300 text-sm font-medium flex items-center">
                                            ↗ <span className="ml-1">+5% vs last week</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                                        style={{ width: `${dashboardData.teacher.classEngagement}%` }}
                                    ></div>
                                </div>
                            </div>
    
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-300 text-2xl">💭</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Student Sentiment</h3>
                                            <p className="text-white/60 text-sm">Overall class mood</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                                            dashboardData.teacher.studentSentiment === 'positive' ? 'bg-green-400 text-green-900' :
                                            dashboardData.teacher.studentSentiment === 'neutral' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-400 text-red-900'
                                        }`}>
                                            {dashboardData.teacher.studentSentiment.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {['😊', '😐', '😟'].map((emoji, index) => (
                                        <div key={index} className={`flex-1 h-3 rounded-full ${
                                            (index === 0 && dashboardData.teacher.studentSentiment === 'positive') ||
                                            (index === 1 && dashboardData.teacher.studentSentiment === 'neutral') ||
                                            (index === 2 && dashboardData.teacher.studentSentiment === 'negative')
                                            ? 'bg-white/60' : 'bg-white/20'
                                        } transition-all duration-500`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">156</div>
                                    <div className="text-blue-100 text-sm font-medium">Total Students</div>
                                </div>
                            </div>
                            <div className="flex items-center text-blue-100 text-sm">
                                <span className="w-2 h-2 bg-blue-200 rounded-full mr-2 animate-pulse"></span>
                                Across 3 active courses
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This semester</span>
                            <span className="font-semibold text-green-600 flex items-center">
                                <span className="text-green-400 mr-1">↗</span>
                                +12 new
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{dashboardData.teacher.activePolls}</div>
                                    <div className="text-emerald-100 text-sm font-medium">Active Polls</div>
                                </div>
                            </div>
                            <div className="flex items-center text-emerald-100 text-sm">
                                <div className="flex space-x-1 mr-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse delay-150"></div>
                                </div>
                                Live responses coming in
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Response rate</span>
                            <span className="font-semibold text-emerald-600">87%</span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📝</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{dashboardData.teacher.pendingGrading}</div>
                                    <div className="text-orange-100 text-sm font-medium">Pending Grading</div>
                                </div>
                            </div>
                            <div className="flex items-center text-orange-100 text-sm">
                                <span className="w-2 h-2 bg-orange-200 rounded-full mr-2 animate-bounce"></span>
                                Assignments & Quizzes
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Due soon</span>
                            <span className="font-semibold text-red-600 flex items-center">
                                <span className="text-red-400 mr-1">⚠</span>
                                2 overdue
                            </span>
                        </div>
                    </div>
                </div>
    
                <div className={`group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">📅</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">3</div>
                                    <div className="text-purple-100 text-sm font-medium">Classes Today</div>
                                </div>
                            </div>
                            <div className="flex items-center text-purple-100 text-sm">
                                <span className="w-2 h-2 bg-purple-200 rounded-full mr-2"></span>
                                Next: Data Science at 2:00 PM
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This week</span>
                            <span className="font-semibold text-purple-600">12 total</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Topic Engagement Heatmap */}
                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-orange-900/50' : 'from-red-50 to-orange-50'} transition-colors duration-300`}>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-2xl">🔥</span>
                            Topic Engagement Heatmap
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Student engagement levels across different topics</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {Object.entries(dashboardData.teacher.engagementHeatmap).map(([topic, engagement]) => (
                                <div key={topic} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{topic}</span>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                                            engagement > 80 ? 'text-green-700 bg-green-100' : 
                                            engagement > 60 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
                                        }`}>
                                            {engagement}%
                                        </span>
                                    </div>
                                    <div className={`relative h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                                        <div 
                                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-md ${
                                                engagement > 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                                                engagement > 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                                            }`}
                                            style={{ width: `${engagement}%` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Engagement Insights */}
                        <div className={`mt-6 p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} mb-1 transition-colors duration-300`}>Engagement Insight</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>
                                        Machine Learning shows lower engagement (71%). Consider adding more interactive examples 
                                        or breaking down complex concepts into smaller modules.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* AI Teaching Insights & Quick Tools */}
                <div className="space-y-8">
                    {/* AI Suggestions */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/50 to-purple-900/50' : 'from-indigo-50 to-purple-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🤖</span>
                                AI Teaching Insights
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 transition-colors duration-300`}>Smart recommendations for your classes</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className={`p-4 bg-gradient-to-br ${isDarkMode ? 'from-purple-900/50 to-pink-900/50 border-purple-700' : 'from-purple-50 to-pink-50 border-purple-200'} rounded-xl border transition-colors duration-300`}>
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">📊</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                                                Data-Driven Recommendation
                                            </span>
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                                                Consider Additional Practice for Machine Learning
                                            </h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 transition-colors duration-300`}>
                                                71% engagement suggests students may benefit from more interactive examples 
                                                and hands-on coding exercises.
                                            </p>
                                            <div className="flex space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">🚀</span>
                                                    Create Session
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1.5 border ${isDarkMode ? 'border-purple-600 text-purple-300 hover:bg-purple-900/50' : 'border-purple-300 text-purple-700 hover:bg-purple-50'} rounded-lg transition-colors text-sm font-medium`}>
                                                    <span className="mr-1">📅</span>
                                                    Schedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Teaching Tools */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-green-900/50 to-emerald-900/50' : 'from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🛠️</span>
                                Quick Teaching Tools
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 transition-colors duration-300`}>Instant access to common actions</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '📊', label: 'Create Poll', color: isDarkMode ? 'bg-blue-900/50 border-blue-700 hover:bg-blue-800/50 text-blue-300' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' },
                                    { icon: '📝', label: 'New Quiz', color: isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-800/50 text-green-300' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' },
                                    { icon: '📢', label: 'Announcement', color: isDarkMode ? 'bg-orange-900/50 border-orange-700 hover:bg-orange-800/50 text-orange-300' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700' },
                                    { icon: '📈', label: 'Grade Assignments', color: isDarkMode ? 'bg-purple-900/50 border-purple-700 hover:bg-purple-800/50 text-purple-300' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' }
                                ].map((tool, index) => (
                                    <button key={index} className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 group ${tool.color}`}>
                                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                                        <span className="text-sm font-medium">{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Real-time Activity Feed */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-gradient-to-r ${isDarkMode ? 'from-cyan-900/50 to-blue-900/50' : 'from-cyan-50 to-blue-50'} transition-colors duration-300`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">⚡</span>
                                Real-time Activity
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Live updates from your students</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>Live</span>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {dashboardData.teacher.recentActivity.map((activity, index) => (
                            <div key={index} className={`flex items-start space-x-4 p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-xl border transition-colors group`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                                    activity.type === 'quiz_completed' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                }`}>
                                    {activity.type === 'quiz_completed' ? '✅' : '❓'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {activity.type === 'quiz_completed' ? (
                                        <>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                <span className="text-blue-600">{activity.student}</span> completed a quiz
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{activity.course}</span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    activity.score >= 90 ? 'bg-green-100 text-green-800' :
                                                    activity.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    Score: {activity.score}%
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                                <span className="text-blue-600">{activity.student}</span> asked a question
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{activity.course}</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>{activity.time}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}>
                                    <span className="text-lg">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherCourses = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
    
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">📚</span>
                        My Courses
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Manage your courses and track student progress</p>
                </div>
                
                <button 
                    onClick={() => setShowCreateCourseForm(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <span className="mr-2 text-lg">➕</span>
                    Create New Course
                </button>
            </div>
    
            {/* Course Creation Modal */}
            {showCreateCourseForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                    <span className="mr-3 text-3xl">🎓</span>
                                    Create New Course
                                </h3>
                                <button 
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
                                >
                                    <span className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>✕</span>
                                </button>
                            </div>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 transition-colors duration-300`}>Fill in the details to create your new course</p>
                        </div>
    
                        <form onSubmit={handleCreateCourse} className="p-6 space-y-6">
                            {/* Course Title */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newCourseData.title}
                                    onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    placeholder="e.g., Introduction to Data Science"
                                />
                            </div>
    
                            {/* Course Description */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Description *
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newCourseData.description}
                                    onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                    placeholder="Describe what students will learn in this course..."
                                />
                            </div>
    
                            {/* Category and Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.category}
                                        onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="programming">Programming</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="machine-learning">Machine Learning</option>
                                        <option value="web-development">Web Development</option>
                                        <option value="mobile-development">Mobile Development</option>
                                        <option value="cybersecurity">Cybersecurity</option>
                                        <option value="cloud-computing">Cloud Computing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Difficulty Level *
                                    </label>
                                    <select
                                        required
                                        value={newCourseData.level}
                                        onChange={(e) => setNewCourseData({...newCourseData, level: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
    
                            {/* Duration and Max Students */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Duration (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.duration}
                                        onChange={(e) => setNewCourseData({...newCourseData, duration: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., 12"
                                    />
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Max Students
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCourseData.maxStudents}
                                        onChange={(e) => setNewCourseData({...newCourseData, maxStudents: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>
    
                            {/* Price and Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newCourseData.price}
                                        onChange={(e) => setNewCourseData({...newCourseData, price: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="0.00"
                                    />
                                </div>
    
                                <div>
                                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={newCourseData.tags}
                                        onChange={(e) => setNewCourseData({...newCourseData, tags: e.target.value})}
                                        className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="e.g., python, data, statistics (comma separated)"
                                    />
                                </div>
                            </div>
    
                            {/* Syllabus */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                                    Course Syllabus
                                </label>
                                <textarea
                                    rows="6"
                                    value={newCourseData.syllabus}
                                    onChange={(e) => setNewCourseData({...newCourseData, syllabus: e.target.value})}
                                    className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                    placeholder="Week 1: Introduction to concepts&#10;Week 2: Core fundamentals&#10;Week 3: Practical applications..."
                                />
                            </div>
    
                            {/* Action Buttons */}
                            <div className={`flex space-x-4 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCourseForm(false)}
                                    className={`flex-1 px-6 py-3 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl transition-colors font-medium`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                >
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    
            {/* Course Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📖</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">3</div>
                                <div className="text-blue-100 text-sm font-medium">Active Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-cyan-900/30' : 'from-blue-50 to-cyan-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This semester</span>
                            <span className="font-semibold text-green-600">+1 new</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">156</div>
                                <div className="text-emerald-100 text-sm font-medium">Total Students</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-emerald-900/30 to-teal-900/30' : 'from-emerald-50 to-teal-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Enrolled</span>
                            <span className="font-semibold text-emerald-600">+12 this week</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">23</div>
                                <div className="text-orange-100 text-sm font-medium">Pending Reviews</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Assignments</span>
                            <span className="font-semibold text-red-600">2 overdue</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">4.8</div>
                                <div className="text-purple-100 text-sm font-medium">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Student feedback</span>
                            <span className="font-semibold text-purple-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Active Courses Grid */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🎯</span>
                        Active Courses
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Manage and monitor your ongoing courses</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Data Science Course */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-blue-700/30 to-indigo-700/30' : 'from-blue-200/30 to-indigo-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            📊
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-700'} mb-2 transition-colors`}>
                                    Data Science 101
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Introduction to data analysis, visualization, and statistical thinking
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-blue-600">45</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-green-600">12</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-orange-600">89%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Course Progress</span>
                                        <span className="font-semibold text-blue-600">89%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000" style={{width: '89%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-blue-500 text-blue-400 hover:bg-blue-900/50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Machine Learning Course */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-green-700/30 to-emerald-700/30' : 'from-green-200/30 to-emerald-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            🤖
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Fall 2024</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-green-300' : 'text-gray-900 group-hover:text-green-700'} mb-2 transition-colors`}>
                                    Machine Learning Basics
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Fundamental concepts of ML algorithms and practical applications
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-green-600">38</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-blue-600">16</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-yellow-600">71%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Completion</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Course Progress</span>
                                        <span className="font-semibold text-green-600">71%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000" style={{width: '71%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">📋</span>
                                        Manage Course
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-green-500 text-green-400 hover:bg-green-900/50' : 'border-green-300 text-green-700 hover:bg-green-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">📈</span>
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Python Programming Course - Draft */}
                        <div className={`group bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-yellow-900/50 border-orange-700' : 'from-orange-50 to-yellow-50 border-orange-200'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isDarkMode ? 'from-orange-700/30 to-yellow-700/30' : 'from-orange-200/30 to-yellow-200/30'} rounded-full -translate-y-16 translate-x-16`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                            🐍
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                Draft
                                            </span>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>Spring 2025</div>
                                        </div>
                                    </div>
                                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-400 hover:text-orange-600'} transition-colors`}>
                                        <span className="text-xl">⚙️</span>
                                    </button>
                                </div>
    
                                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-orange-300' : 'text-gray-900 group-hover:text-orange-700'} mb-2 transition-colors`}>
                                    Advanced Python Programming
                                </h4>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 transition-colors duration-300`}>
                                    Deep dive into Python frameworks, libraries, and advanced concepts
                                </p>
    
                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Students</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-orange-600">8</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Lessons</div>
                                    </div>
                                    <div className={`text-center p-3 ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl transition-colors duration-300`}>
                                        <div className="text-2xl font-bold text-yellow-600">45%</div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium transition-colors duration-300`}>Complete</div>
                                    </div>
                                </div>
    
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Development Progress</span>
                                        <span className="font-semibold text-orange-600">45%</span>
                                    </div>
                                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 h-3 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
                                    </div>
                                </div>
    
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                        <span className="mr-2">🔨</span>
                                        Continue Building
                                    </button>
                                    <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-orange-500 text-orange-400 hover:bg-orange-900/50' : 'border-orange-300 text-orange-700 hover:bg-orange-50'} rounded-lg transition-colors text-sm font-medium`}>
                                        <span className="mr-1">👁️</span>
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Assignments Awaiting Review */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-red-900/50 to-orange-900/50' : 'border-gray-200 bg-gradient-to-r from-red-50 to-orange-50'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">📝</span>
                        Assignments Awaiting Review
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Grade pending assignments and provide feedback</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Urgent Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-pink-900/50 border-red-700' : 'from-red-50 to-pink-50 border-red-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                    📊
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Data Visualization Project</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        ⚠️ Overdue
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Data Science 101 • Due: 2 days ago</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        23 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 4.2 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                    <span className="mr-2">🚀</span>
                                    Start Grading
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">👁️</span>
                                    Preview
                                </button>
                            </div>
                        </div>
    
                        {/* Regular Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                🤖
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>ML Algorithm Quiz</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        📅 Due Tomorrow
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Machine Learning Basics • Due: Tomorrow</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        31 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 2.8 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    <span className="mr-2">📝</span>
                                    Review Answers
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">📊</span>
                                    Analytics
                                </button>
                            </div>
                        </div>
    
                        {/* Additional Assignment */}
                        <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-2xl border hover:shadow-lg transition-all duration-300 group`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                📈
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Statistical Analysis Report</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✅ On Time
                                    </span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Data Science 101 • Due: Next week</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">📄</span>
                                        18 submissions
                                    </span>
                                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                        <span className="mr-1">⏰</span>
                                        Average: 6.1 hours
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    <span className="mr-2">📝</span>
                                    Start Review
                                </button>
                                <button className={`inline-flex items-center px-3 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                                    <span className="mr-1">⚙️</span>
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`mt-8 p-6 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : 'from-gray-50 to-gray-100'} rounded-xl transition-colors duration-300`}>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                            <span className="mr-2">⚡</span>
                            Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500' : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'} rounded-xl border transition-all group`}>
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-700'} transition-colors`}>Create Assignment</span>
                            </button>
                            <button className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500' : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'} rounded-xl border transition-all group`}>
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-green-400' : 'text-gray-700 group-hover:text-green-700'} transition-colors`}>Grade Book</span>
                            </button>
                            <button className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500' : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300'} rounded-xl border transition-all group`}>
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📢</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-700 group-hover:text-purple-700'} transition-colors`}>Announcement</span>
                            </button>
                            <button className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500' : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'} rounded-xl border transition-all group`}>
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-orange-400' : 'text-gray-700 group-hover:text-orange-700'} transition-colors`}>Analytics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherAnalytics = () => {
        if (!Bar || !Line || !Doughnut) {
            return (
                <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-2xl text-center`}>
                        <h3 className="text-xl font-bold mb-4">📊 Analytics Dashboard</h3>
                        <p className="text-gray-500">Chart components are loading...</p>
                        <div className="mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    </div>
                </div>
            );
        }

        // Performance Trends Chart Data
        const performanceData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'Class Average (%)',
                    data: [78, 82, 85, 81, 87],
                    backgroundColor: isDarkMode 
                        ? 'rgba(59, 130, 246, 0.8)' 
                        : 'rgba(59, 130, 246, 0.6)',
                    borderColor: isDarkMode 
                        ? 'rgba(59, 130, 246, 1)' 
                        : 'rgba(59, 130, 246, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Engagement (%)',
                    data: [75, 80, 88, 79, 92],
                    backgroundColor: isDarkMode 
                        ? 'rgba(16, 185, 129, 0.8)' 
                        : 'rgba(16, 185, 129, 0.6)',
                    borderColor: isDarkMode 
                        ? 'rgba(16, 185, 129, 1)' 
                        : 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };

        // Engagement by Time Chart Data
        const engagementTimeData = {
            labels: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'],
            datasets: [
                {
                    label: 'Engagement Level (%)',
                    data: [95, 70, 90, 45, 75],
                    backgroundColor: [
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(245, 158, 11, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        };

        // Assignment Completion Doughnut Chart Data
        const assignmentCompletionData = {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [
                {
                    data: [86.5, 8.2, 5.3],
                    backgroundColor: [
                        isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.6)',
                        isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.6)',
                        isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.6)',
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                    ],
                    borderWidth: 2,
                }
            ]
        };

        // Chart Options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: isDarkMode ? '#E5E7EB' : '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    titleColor: isDarkMode ? '#F9FAFB' : '#111827',
                    bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                }
            },
            scales: {
                x: {
                    grid: {
                        color: isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    },
                    ticks: {
                        color: isDarkMode ? '#D1D5DB' : '#6B7280',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    },
                    ticks: {
                        color: isDarkMode ? '#D1D5DB' : '#6B7280',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        };

        const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#E5E7EB' : '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    titleColor: isDarkMode ? '#F9FAFB' : '#111827',
                    bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            cutout: '60%',
        };

        return (
            <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-4xl">📈</span>
                            Course Analytics
                        </h2>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Comprehensive insights into student performance and engagement</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <select className={`px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This semester</option>
                            <option>All time</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg">
                            <span className="mr-2">📄</span>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">85.4%</div>
                                    <div className="text-blue-100 text-sm font-medium">Avg Performance</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-cyan-900/30' : 'from-blue-50 to-cyan-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Improvement</span>
                                <span className="font-semibold text-green-600 flex items-center">
                                    <span className="mr-1">↗</span>
                                    +3.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">92%</div>
                                    <div className="text-emerald-100 text-sm font-medium">Engagement Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-emerald-900/30 to-teal-900/30' : 'from-emerald-50 to-teal-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Active learners</span>
                                <span className="font-semibold text-emerald-600">143/156</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">⏱️</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">4.2h</div>
                                    <div className="text-orange-100 text-sm font-medium">Avg Study Time</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Per week</span>
                                <span className="font-semibold text-orange-600">Goal: 6h</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">94%</div>
                                    <div className="text-purple-100 text-sm font-medium">Completion Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Assignments</span>
                                <span className="font-semibold text-purple-600">On track</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student Performance Trends */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">📈</span>
                                Performance Trends
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Weekly student performance overview</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Chart.js Chart */}
                                <div className="h-80">
                                    <Bar data={performanceData} options={chartOptions} />
                                </div>
                                
                                {/* Performance Insights */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-green-600 text-xl">🏆</span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Best Performing</span>
                                        </div>
                                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-900'} transition-colors duration-300`}>Week 5</div>
                                        <div className="text-xs text-green-600">87% class average</div>
                                    </div>
                                    <div className={`bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-red-900/50 border-orange-700' : 'from-orange-50 to-red-50 border-orange-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-orange-600 text-xl">🎯</span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-800'} transition-colors duration-300`}>Improvement Area</span>
                                        </div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-orange-200' : 'text-orange-900'} transition-colors duration-300`}>Consistency</div>
                                        <div className="text-xs text-orange-600">Week 4 dip noted</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Engagement by Time */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">⏰</span>
                                Engagement by Time
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Student activity patterns throughout the day</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Chart.js Chart */}
                                <div className="h-80">
                                    <Bar data={engagementTimeData} options={chartOptions} />
                                </div>
                                
                                <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border transition-colors duration-300`}>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-600 text-2xl">💡</span>
                                        <div>
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} transition-colors duration-300`}>Teaching Tip</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>Schedule important topics during 9 AM and 2 PM when engagement is highest!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Completion Rates */}
                    <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-3 text-2xl">📋</span>
                                Assignment Completion Analytics
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Detailed breakdown of assignment submission and completion rates</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Doughnut Chart */}
                                <div className="lg:col-span-1">
                                    <div className="h-80">
                                        <Doughnut data={assignmentCompletionData} options={doughnutOptions} />
                                    </div>
                                </div>

                                {/* Individual Assignment Progress */}
                                <div className="lg:col-span-2 space-y-4">
                                    {[
                                        { name: 'Data Visualization Project', completion: 95, submissions: 43, total: 45, color: 'bg-green-500', status: 'excellent' },
                                        { name: 'Python Quiz #3', completion: 87, submissions: 39, total: 45, color: 'bg-blue-500', status: 'good' },
                                        { name: 'ML Essay Assignment', completion: 73, submissions: 33, total: 45, color: 'bg-orange-500', status: 'needs attention' },
                                        { name: 'Statistical Analysis Lab', completion: 91, submissions: 41, total: 45, color: 'bg-purple-500', status: 'good' }
                                    ].map((assignment, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 ${assignment.color} rounded-xl flex items-center justify-center text-white font-semibold text-sm`}>
                                                        {assignment.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{assignment.name}</h4>
                                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{assignment.submissions}/{assignment.total} submitted</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{assignment.completion}%</div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        assignment.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                                        assignment.status === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {assignment.status === 'excellent' ? '🌟 Excellent' :
                                                            assignment.status === 'good' ? '👍 Good' : '⚠️ Needs Attention'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 transition-colors duration-300`}>
                                                <div 
                                                    className={`${assignment.color} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                                                    style={{ width: `${assignment.completion}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className={`mt-6 p-4 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : 'from-gray-50 to-gray-100'} rounded-xl transition-colors duration-300`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Overall Completion Rate</span>
                                            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>86.5%</span>
                                        </div>
                                        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                            Above institutional average of 82%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Summary */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                    <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-indigo-900/50 to-purple-900/50' : 'border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50'} transition-colors duration-300`}>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                            <span className="mr-3 text-2xl">📊</span>
                            Analytics Summary & Recommendations
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Key insights and actionable recommendations for your courses</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-green-600 text-3xl">🎯</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-900'} transition-colors duration-300`}>Strengths</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'} transition-colors duration-300`}>What's working well</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">✅</span>High engagement during morning sessions</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Excellent assignment completion rates</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Strong student performance trends</li>
                                    <li className="flex items-center"><span className="mr-2">✅</span>Above-average completion metrics</li>
                                </ul>
                            </div>

                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-orange-900/50 to-yellow-900/50 border-orange-700' : 'from-orange-50 to-yellow-50 border-orange-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-orange-600 text-3xl">⚠️</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'} transition-colors duration-300`}>Areas to Improve</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} transition-colors duration-300`}>Focus areas</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Afternoon engagement drops significantly</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Some students need extra support</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>ML topics require simplification</li>
                                    <li className="flex items-center"><span className="mr-2">📈</span>Week 4 performance consistency</li>
                                </ul>
                            </div>

                            <div className={`bg-gradient-to-br ${isDarkMode ? 'from-blue-900/50 to-indigo-900/50 border-blue-700' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl p-6 border transition-colors duration-300`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-blue-600 text-3xl">💡</span>
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} transition-colors duration-300`}>Recommendations</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition-colors duration-300`}>Action items</p>
                                    </div>
                                </div>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} transition-colors duration-300`}>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Schedule complex topics in AM</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Add interactive ML examples</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Offer additional office hours</li>
                                    <li className="flex items-center"><span className="mr-2">🚀</span>Implement peer learning sessions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTeacherMessages = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">💬</span>
                        Messages & Communications
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Connect with students and manage course communications</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className={`inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg transition-colors`}>
                        <span className="mr-2">📊</span>
                        Analytics
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">✍️</span>
                        Compose Message
                    </button>
                </div>
            </div>
    
            {/* Communication Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">23</div>
                                <div className="text-blue-100 text-sm font-medium">Unread Messages</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-indigo-900/30' : 'from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Today</span>
                            <span className="font-semibold text-red-600">5 urgent</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">❓</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">47</div>
                                <div className="text-green-100 text-sm font-medium">Student Questions</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-green-900/30 to-emerald-900/30' : 'from-green-50 to-emerald-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This week</span>
                            <span className="font-semibold text-green-600">92% answered</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📢</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">8</div>
                                <div className="text-purple-100 text-sm font-medium">Announcements</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>This month</span>
                            <span className="font-semibold text-purple-600">86% read</span>
                        </div>
                    </div>
                </div>
    
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">2.3h</div>
                                <div className="text-orange-100 text-sm font-medium">Avg Response</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/30 to-red-900/30' : 'from-orange-50 to-red-50'} transition-colors duration-300`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Response time</span>
                            <span className="font-semibold text-green-600">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Main Messages Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">🔍</span>
                                Message Filters
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { label: 'All Messages', count: 156, active: true, color: isDarkMode ? 'text-blue-400 bg-blue-900/50' : 'text-blue-600 bg-blue-50' },
                                    { label: 'Unread', count: 23, active: false, color: isDarkMode ? 'text-red-400 bg-red-900/50' : 'text-red-600 bg-red-50' },
                                    { label: 'Student Questions', count: 47, active: false, color: isDarkMode ? 'text-green-400 bg-green-900/50' : 'text-green-600 bg-green-50' },
                                    { label: 'Announcements', count: 8, active: false, color: isDarkMode ? 'text-purple-400 bg-purple-900/50' : 'text-purple-600 bg-purple-50' },
                                    { label: 'Urgent', count: 5, active: false, color: isDarkMode ? 'text-orange-400 bg-orange-900/50' : 'text-orange-600 bg-orange-50' }
                                ].map((filter, index) => (
                                    <button key={index} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${
                                        filter.active 
                                            ? (isDarkMode ? 'border-blue-600 bg-blue-900/30' : 'border-blue-300 bg-blue-50') 
                                            : (isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50')
                                    }`}>
                                        <span className={`font-medium ${filter.active ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')} transition-colors duration-300`}>
                                            {filter.label}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${filter.color} transition-colors duration-300`}>
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Actions */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">⚡</span>
                                Quick Actions
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { icon: '📢', label: 'Send Announcement', color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' },
                                    { icon: '📅', label: 'Schedule Reminder', color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500 text-green-400' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' },
                                    { icon: '🎯', label: 'Grade Notification', color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500 text-purple-400' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' },
                                    { icon: '📚', label: 'Share Resources', color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500 text-orange-400' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700' }
                                ].map((action, index) => (
                                    <button key={index} className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all group ${action.color}`}>
                                        <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                        <span className="font-medium">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Messages List */}
                <div className="lg:col-span-3">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'} transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Recent Messages</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium transition-colors duration-300`}>Live Updates</span>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <div className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'} transition-colors duration-300`}>
                                {/* Urgent Message */}
                                <div className={`p-6 bg-gradient-to-r ${isDarkMode ? 'from-red-900/50 to-pink-900/50' : 'from-red-50 to-pink-50'} border-l-4 border-red-500 ${isDarkMode ? 'hover:bg-red-900/60' : 'hover:bg-red-100'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            JS
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>John Smith</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    🚨 Urgent
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>2 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Data Science 101
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Question about regression analysis assignment</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>I'm having trouble understanding the difference between linear and logistic regression. Could you please provide some clarification before the deadline tomorrow?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">⚡</span>
                                                    Reply Now
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">📞</span>
                                                    Schedule Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Regular Message */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            MJ
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Mary Johnson</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>5 hours ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Machine Learning Basics
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Thank you for the detailed feedback</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Your comments on my neural network project were very helpful. I've implemented the suggested improvements and would love to get your thoughts...</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">💬</span>
                                                    Reply
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">👁️</span>
                                                    View Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* System Message */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            <span className="text-lg">🏫</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Admin Department</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    System
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>1 day ago</span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Grade submission deadline reminder</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Please remember that final grades for the current semester are due by Friday, June 15th at 11:59 PM...</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">📋</span>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* More messages... */}
                                <div className={`p-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer group`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                                            AL
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Alice Lee</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>2 days ago</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Python Programming
                                                </span>
                                            </div>
                                            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-1 transition-colors duration-300`}>Request for office hours</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>I would like to schedule some one-on-one time to discuss my final project proposal. When would be a good time for you?</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <button className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                    <span className="mr-1">📅</span>
                                                    Schedule Meeting
                                                </button>
                                                <button className={`inline-flex items-center px-3 py-1 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors text-sm`}>
                                                    <span className="mr-1">💬</span>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Quick Announcement Templates */}
                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-600 bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'} transition-colors duration-300`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2 text-xl">📢</span>
                                Quick Announcement Templates
                            </h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>Send common announcements with one click</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { 
                                        title: 'Assignment Reminder', 
                                        desc: 'Remind students about upcoming deadlines',
                                        icon: '⏰',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 hover:border-orange-500 text-orange-400' : 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700'
                                    },
                                    { 
                                        title: 'Study Resources', 
                                        desc: 'Share additional learning materials',
                                        icon: '📚',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-blue-900/50 hover:border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                                    },
                                    { 
                                        title: 'Class Schedule Change', 
                                        desc: 'Notify about schedule modifications',
                                        icon: '📅',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-purple-900/50 hover:border-purple-500 text-purple-400' : 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700'
                                    },
                                    { 
                                        title: 'Congratulate Top Performers', 
                                        desc: 'Celebrate student achievements',
                                        icon: '🏆',
                                        color: isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-green-900/50 hover:border-green-500 text-green-400' : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
                                    }
                                ].map((template, index) => (
                                    <button key={index} className={`flex items-start space-x-4 p-4 rounded-xl border transition-all group ${template.color}`}>
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                                        <div className="text-left">
                                            <h4 className="font-semibold mb-1">{template.title}</h4>
                                            <p className="text-sm opacity-80">{template.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTeacherSettings = () => (
        <div className={`space-y-8 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                        <span className="mr-3 text-4xl">⚙️</span>
                        Teacher Settings
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>Customize your teaching experience and preferences</p>
                </div>
                
                <div className="flex space-x-3">
                    <button className={`inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg transition-colors`}>
                        <span className="mr-2">🔄</span>
                        Reset to Defaults
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-lg">💾</span>
                        Save Settings
                    </button>
                </div>
            </div>
    
            {/* Settings Container */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Account Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">👤</span>
                        Account Information
                    </h3>
                    
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <span className="text-sm">📷</span>
                            </button>
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                {user?.name || "Dr. Sarah Wilson"}
                            </h4>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                {user?.email || "sarah.wilson@university.edu"}
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                👨‍🏫 Teacher
                            </span>
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue={user?.name || "Dr. Sarah Wilson"}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue={user?.email || "sarah.wilson@university.edu"}
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Employee ID
                            </label>
                            <input
                                type="text"
                                defaultValue="EMP-2024-001"
                                readOnly
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'} rounded-lg transition-all cursor-not-allowed`}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Department
                            </label>
                            <select className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                                <option>Computer Science</option>
                                <option>Mathematics</option>
                                <option>Data Science</option>
                                <option>Engineering</option>
                                <option>Business</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                Bio/Description
                            </label>
                            <textarea
                                rows="4"
                                defaultValue="Dr. Sarah Wilson is a Computer Science professor with over 10 years of experience in data science and machine learning education."
                                className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                placeholder="Tell students about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🌐</span>
                        Language Settings
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    🗣️
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Interface Language
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Choose your preferred language
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'en' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇺🇸 English
                                </span>
                                <button
                                    onClick={() => {
                                        const newLanguage = currentLanguage === 'en' ? 'ja' : 'en';
                                        handleLanguageToggle(newLanguage);
                                    }}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                        currentLanguage === 'ja' ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            currentLanguage === 'ja' ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    currentLanguage === 'ja' 
                                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    🇯🇵 Japanese
                                </span>
                            </div>
                        </div>
                        
                        {/* Language Change Feedback */}
                        {currentLanguage !== 'en' && (
                            <div className={`mt-4 p-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' 
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                            } rounded-xl border transition-all duration-300`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-600 text-2xl">✅</span>
                                    <div>
                                        <h4 className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-900'
                                        } transition-colors duration-300`}>Language Changed</h4>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-700'
                                        } transition-colors duration-300`}>
                                            Interface language has been updated to {currentLanguage === 'ja' ? 'Japanese (日本語)' : 'English'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                
                        <div className={`mt-4 p-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        } rounded-xl border transition-colors duration-300`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-600 text-2xl">💡</span>
                                <div>
                                    <h4 className={`font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                                    } transition-colors duration-300`}>Language Note</h4>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                    } transition-colors duration-300`}>
                                        Changing language will apply to the interface. Course content language may vary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Dark Mode Toggle Section */}
                <div className={`p-8 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🎨</span>
                        Display Settings
                    </h3>
                    
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    {isDarkMode ? '🌙' : '☀️'}
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                        Dark Mode
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                        Switch between light and dark themes
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    ☀️ Light
                                </span>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                            isDarkMode ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                                    🌙 Dark
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Additional Settings */}
                <div className="p-8">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center mb-6 transition-colors duration-300`}>
                        <span className="mr-3 text-2xl">🛠️</span>
                        Teaching Preferences
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Grading Preferences */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                Grading System
                            </h4>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                        Default Grading Scale
                                    </label>
                                    <select className={`w-full px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                                        <option>A-F Letter Grades</option>
                                        <option>0-100 Percentage</option>
                                        <option>1-10 Scale</option>
                                        <option>Pass/Fail</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>
                                        Late Penalty (% per day)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="10"
                                        className={`w-full px-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
    
                        {/* Notification Preferences */}
                        <div className={`p-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border transition-colors duration-300`}>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                                Notifications
                            </h4>
                            <div className="space-y-4">
                                {[
                                    'Student Messages',
                                    'Assignment Submissions',
                                    'Grading Deadlines',
                                    'System Updates'
                                ].map((notification, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {notification}
                                        </span>
                                        <button
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                                index % 2 === 0 ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                                    index % 2 === 0 ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Security Section */}
                    <div className={`mt-8 p-6 bg-gradient-to-r ${isDarkMode ? 'from-orange-900/50 to-red-900/50 border-orange-700' : 'from-orange-50 to-red-50 border-orange-200'} rounded-xl border transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-orange-600 text-2xl">🔐</span>
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'} transition-colors duration-300`}>
                                        Account Security
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} transition-colors duration-300`}>
                                        Password last changed 45 days ago
                                    </p>
                                </div>
                            </div>
                            <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                <span className="mr-2">🔑</span>
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Admin Dashboard Components
    const renderAdminOverview = () => (
        <div className="space-y-8">
            {/* System Health Header - Enhanced Dark Mode */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative p-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* System Health Score */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        stroke="rgba(255,255,255,0.2)" 
                                        strokeWidth="8" 
                                        fill="transparent"
                                    />
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        stroke="white" 
                                        strokeWidth="8" 
                                        fill="transparent"
                                        strokeDasharray={`${dashboardData.admin.systemHealth * 2.51} 251`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">{dashboardData.admin.systemHealth}%</div>
                                        <div className="text-xs text-white/80 font-medium">{t('admin.systemHealth.status')}</div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('admin.systemHealth.title')}</h2>
                            <p className="text-white/80 text-center lg:text-left">{t('admin.systemHealth.description')}</p>
                        </div>

                        {/* Real-time Metrics */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-green-400 text-xl">🖥️</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.serverLoad.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.serverLoad.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.serverLoad}%</div>
                                        <div className="text-green-400 text-sm font-medium">↗ {t('admin.status.optimal')}</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${dashboardData.admin.serverLoad}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-orange-400 text-xl">💾</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.storage.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.storage.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{dashboardData.admin.storageUsed}%</div>
                                        <div className="text-orange-400 text-sm font-medium">📈 {t('admin.status.growing')}</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-orange-400 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${dashboardData.admin.storageUsed}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-400 text-xl">⚡</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.response.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.response.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">142ms</div>
                                        <div className="text-blue-400 text-sm font-medium">⚡ {t('admin.status.fast')}</div>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(10)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-8 w-3 rounded-sm ${i < 7 ? 'bg-blue-400' : 'bg-white/20'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-purple-400 text-xl">🌐</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{t('admin.metrics.sessions.title')}</h3>
                                            <p className="text-white/60 text-sm">{t('admin.metrics.sessions.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">247</div>
                                        <div className="text-purple-400 text-sm font-medium">👥 {t('admin.status.active')}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                    <span className="text-white/60 text-sm">{t('admin.status.liveMonitoring')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{allUsers.length}</div>
                                <div className="text-blue-100 text-sm font-medium">{t('admin.metrics.totalUsers')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('admin.metrics.pendingApproval')}</span>
                            <span className="font-semibold text-orange-600">{pendingUsers.length}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${(allUsers.filter(u => u.isApproved).length / allUsers.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className={`mt-2 text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            {Math.round((allUsers.filter(u => u.isApproved).length / allUsers.length) * 100)}% {t('admin.status.approved')}
                        </div>
                    </div>
                </div>

                <div className={`rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{applicationSubmissions.length}</div>
                                <div className="text-green-100 text-sm font-medium">{t('admin.metrics.applications')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('admin.metrics.pendingReview')}</span>
                            <span className="font-semibold text-orange-600">{dashboardData.admin.pendingApplications || 0}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${applicationSubmissions.length > 0 ? ((applicationSubmissions.filter(app => app.status === 'approved').length / applicationSubmissions.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className={`mt-2 text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            {applicationSubmissions.filter(app => app.status === 'approved').length} {t('admin.status.approved')}
                        </div>
                    </div>
                </div>

                <div className={`rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📧</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{contactSubmissions.length}</div>
                                <div className="text-orange-100 text-sm font-medium">{t('admin.metrics.messages')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('admin.metrics.needsResponse')}</span>
                            <span className="font-semibold text-red-600">{dashboardData.admin.pendingContacts || 0}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${contactSubmissions.length > 0 ? ((contactSubmissions.filter(contact => contact.status === 'resolved').length / contactSubmissions.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className={`mt-2 text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            {contactSubmissions.filter(contact => contact.status === 'resolved').length} {t('admin.status.resolved')}
                        </div>
                    </div>
                </div>

                <div className={`rounded-2xl shadow-xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-purple-100 text-sm font-medium">{t('admin.metrics.uptime')}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('admin.metrics.last30Days')}</span>
                            <span className="font-semibold text-green-600">{t('admin.status.excellent')}</span>
                        </div>
                        <div className={`mt-4 rounded-full h-2 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: '99.9%' }}></div>
                        </div>
                        <div className={`mt-2 text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            43.2 {t('admin.metrics.downtime')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Role Distribution */}
                <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className={`p-6 border-b transition-colors duration-300 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <h3 className={`text-lg font-semibold flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <span className="mr-2">📊</span>
                            {t('admin.userDistribution.title')}
                        </h3>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>{t('admin.userDistribution.subtitle')}</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🎓</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{t('admin.roles.students')}</div>
                                        <div className={`text-sm transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>{t('admin.roles.studentsDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{allUsers.filter(u => u.role === 'student').length}</div>
                                    <div className="text-xs text-blue-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'student').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍🏫</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{t('admin.roles.teachers')}</div>
                                        <div className={`text-sm transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>{t('admin.roles.teachersDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{allUsers.filter(u => u.role === 'teacher').length}</div>
                                    <div className="text-xs text-green-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'teacher').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                isDarkMode ? 'bg-purple-900/20 border-purple-700/50' : 'bg-purple-50 border-purple-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">👨‍💼</span>
                                    </div>
                                    <div>
                                        <div className={`font-semibold transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{t('admin.roles.administrators')}</div>
                                        <div className={`text-sm transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>{t('admin.roles.administratorsDesc')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">{allUsers.filter(u => u.role === 'admin').length}</div>
                                    <div className="text-xs text-purple-500 font-medium">
                                        {Math.round((allUsers.filter(u => u.role === 'admin').length / allUsers.length) * 100)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-6 p-4 rounded-xl transition-colors ${
                            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>{t('admin.metrics.totalActiveUsers')}</span>
                                <span className={`text-lg font-bold transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>{allUsers.filter(u => u.isApproved).length}</span>
                            </div>
                            <div className={`mt-2 text-xs transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                {t('admin.metrics.growthRate')}: +{Math.floor(Math.random() * 15) + 5}% {t('admin.metrics.thisMonth')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className={`lg:col-span-2 rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className={`p-6 border-b transition-colors duration-300 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold flex items-center transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    <span className="mr-2">⚡</span>
                                    {t('admin.activity.title')}
                                </h3>
                                <p className={`text-sm mt-1 transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>{t('admin.activity.subtitle')}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className={`text-sm transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>{t('admin.status.live')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {/* Pending User Approvals */}
                            {pendingUsers.length > 0 && pendingUsers.slice(0, 3).map(user => (
                                <div key={user._id} className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                    isDarkMode 
                                        ? 'bg-orange-900/20 border-orange-700/50 hover:bg-orange-900/30' 
                                        : 'bg-orange-25 border-orange-200 hover:bg-orange-50'
                                }`}>
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">!</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                                {t('admin.activity.newRegistration', { role: user.role })}
                                            </h4>
                                            <span className={`text-xs transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {user.firstName} {user.lastName} ({user.email}) {t('admin.activity.awaitingApproval')}
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-green-300 bg-green-900/50 hover:bg-green-900/70 border border-green-700/50' 
                                                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                                onClick={() => handleUserApproval(user._id, true)}
                                            >
                                                ✅ {t('admin.actions.approve')}
                                            </button>
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-red-300 bg-red-900/50 hover:bg-red-900/70 border border-red-700/50' 
                                                        : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                }`}
                                                onClick={() => handleUserApproval(user._id, false)}
                                            >
                                                ❌ {t('admin.actions.reject')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Recent Contact Messages */}
                            {contactSubmissions.length > 0 && contactSubmissions.filter(c => c.status === 'pending').slice(0, 2).map(contact => (
                                <div key={contact._id} className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                    isDarkMode 
                                        ? 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30' 
                                        : 'bg-blue-25 border-blue-200 hover:bg-blue-50'
                                }`}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                        {contact.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>{t('admin.activity.newContactMessage')}</h4>
                                            <span className={`text-xs transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {contact.name} - {contact.subject}
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700/50' 
                                                        : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                }`}
                                                onClick={() => handleContactAction(contact._id, 'approved')}
                                            >
                                                🔥 {t('admin.actions.priority')}
                                            </button>
                                            <button 
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDarkMode 
                                                        ? 'text-green-300 bg-green-900/50 hover:bg-green-900/70 border border-green-700/50' 
                                                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                                onClick={() => handleContactAction(contact._id, 'resolved')}
                                            >
                                                ✅ {t('admin.actions.resolve')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* System Events */}
                            <div className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                isDarkMode 
                                    ? 'bg-green-900/20 border-green-700/50' 
                                    : 'bg-green-25 border-green-200'
                            }`}>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">🛡️</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{t('admin.activity.securityScan')}</h4>
                                        <span className={`text-xs transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{t('admin.time.fiveMinutesAgo')}</span>
                                    </div>
                                    <p className={`text-sm transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{t('admin.activity.noThreats')}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 transition-colors ${
                                        isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-green-100 text-green-800'
                                    }`}>
                                        ✅ {t('admin.status.allClear')}
                                    </span>
                                </div>
                            </div>

                            <div className={`flex items-start space-x-4 p-4 border rounded-xl transition-colors ${
                                isDarkMode 
                                    ? 'bg-purple-900/20 border-purple-700/50' 
                                    : 'bg-purple-25 border-purple-200'
                            }`}>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">💾</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{t('admin.activity.databaseBackup')}</h4>
                                        <span className={`text-xs transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{t('admin.time.oneHourAgo')}</span>
                                    </div>
                                    <p className={`text-sm transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{t('admin.activity.backupSuccess')}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 transition-colors ${
                                        isDarkMode ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        📊 {t('admin.status.automated')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={`mt-8 p-6 rounded-xl transition-colors ${
                            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                        }`}>
                            <h4 className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}>{t('admin.quickActions.title')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-600 hover:bg-blue-900/30 hover:border-blue-700/50' 
                                        : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                }`}>
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👥</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-blue-300' : 'text-gray-700 group-hover:text-blue-700'
                                    }`}>{t('admin.quickActions.manageUsers')}</span>
                                </button>
                                <button className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-600 hover:bg-green-900/30 hover:border-green-700/50' 
                                        : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                                }`}>
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📋</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-green-300' : 'text-gray-700 group-hover:text-green-700'
                                    }`}>{t('admin.quickActions.applications')}</span>
                                </button>
                                <button className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-600 hover:bg-orange-900/30 hover:border-orange-700/50' 
                                        : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'
                                }`}>
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📧</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-orange-300' : 'text-gray-700 group-hover:text-orange-700'
                                    }`}>{t('admin.quickActions.messages')}</span>
                                </button>
                                <button className={`flex flex-col items-center p-3 rounded-lg border transition-all group ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-600 hover:bg-purple-900/30 hover:border-purple-700/50' 
                                        : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                                }`}>
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</span>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isDarkMode ? 'text-gray-300 group-hover:text-purple-300' : 'text-gray-700 group-hover:text-purple-700'
                                    }`}>{t('admin.quickActions.settings')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Alerts & Notifications */}
            {dashboardData.admin.recentAlerts && dashboardData.admin.recentAlerts.length > 0 && (
                <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    <div className={`p-6 border-b transition-colors duration-300 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <h3 className={`text-lg font-semibold flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <span className="mr-2">🚨</span>
                            {t('admin.alerts.title')}
                        </h3>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>{t('admin.alerts.subtitle')}</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {dashboardData.admin.recentAlerts.map((alert, index) => (
                                <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl border transition-colors ${
                                    alert.type === 'warning' 
                                        ? (isDarkMode ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-yellow-25 border-yellow-200')
                                        : (isDarkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-25 border-blue-200')
                                }`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}>
                                        <span className="text-white text-sm">
                                            {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>{alert.message}</p>
                                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{alert.time}</p>
                                    </div>
                                    <button className={`transition-colors ${
                                        isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                    }`}>
                                        <span className="text-lg">✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderUserManagement = () => (
        <div className="space-y-8">
            {/* Header Section */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
                <div className={`p-6 border-b transition-colors duration-300 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className={`text-2xl font-bold flex items-center transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                                <span className="mr-3">👥</span>
                                {t('userManagement.title')}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm mt-2">
                                <span className={`transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    <span className={`font-semibold transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>{allUsers.length}</span> {t('userManagement.stats.totalUsers')}
                                </span>
                                <span className={`transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    <span className="font-semibold text-orange-600">{pendingUsers.length}</span> {t('userManagement.stats.pending')}
                                </span>
                                <span className={`transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    <span className="font-semibold text-green-600">{allUsers.filter(u => u.isApproved).length}</span> {t('userManagement.stats.approved')}
                                </span>
                            </div>
                        </div>
    
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="text" 
                                    placeholder={t('userManagement.search.placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                />
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('userManagement.search.allRoles')}</option>
                                    <option value="student">{t('userManagement.roles.students')}</option>
                                    <option value="teacher">{t('userManagement.roles.teachers')}</option>
                                    <option value="admin">{t('userManagement.roles.admins')}</option>
                                </select>
                                <select 
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('userManagement.search.allStatus')}</option>
                                    <option value="approved">{t('userManagement.status.approved')}</option>
                                    <option value="pending">{t('userManagement.status.pending')}</option>
                                </select>
                            </div>
                            <button 
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                onClick={() => setShowCreateUserForm(true)}
                            >
                                ➕ {t('userManagement.buttons.createNewUser')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* CREATE USER MODAL */}
            {showCreateUserForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-2xl mx-4 transition-colors duration-300`}>
                        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2">✨</span>
                                {t('userManagement.modals.createUser.title')}
                            </h3>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                onClick={() => setShowCreateUserForm(false)}
                            >
                                <span className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-xl transition-colors`}>✕</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.firstName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.form.placeholders.firstName')}
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.lastName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.form.placeholders.lastName')}
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.email')}
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t('userManagement.form.placeholders.email')}
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.password')}
                                        </label>
                                        <input
                                            type="password"
                                            placeholder={t('userManagement.form.placeholders.password')}
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.role')}
                                        </label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        >
                                            <option value="student">👨‍🎓 {t('userManagement.roles.student')}</option>
                                            <option value="teacher">👨‍🏫 {t('userManagement.roles.teacher')}</option>
                                            <option value="admin">👨‍💼 {t('userManagement.roles.admin')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => setShowCreateUserForm(false)}
                                    >
                                        {t('userManagement.buttons.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        ✨ {t('userManagement.buttons.createUser')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
    
            {/* EDIT USER MODAL */}
            {showEditUserForm && editingUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-2xl mx-4 transition-colors duration-300`}>
                        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center transition-colors duration-300`}>
                                <span className="mr-2">📝</span>
                                {t('userManagement.modals.editUser.title')}: {editingUser.firstName} {editingUser.lastName}
                            </h3>
                            <button 
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                onClick={() => {
                                    setShowEditUserForm(false);
                                    setEditingUser(null);
                                    setNewUserData({
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        password: '',
                                        role: 'student'
                                    });
                                }}
                            >
                                <span className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-xl transition-colors`}>✕</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.firstName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.form.placeholders.firstName')}
                                            value={newUserData.firstName}
                                            onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.lastName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('userManagement.form.placeholders.lastName')}
                                            value={newUserData.lastName}
                                            onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.email')}
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t('userManagement.form.placeholders.email')}
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.newPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            placeholder={t('userManagement.form.placeholders.newPassword')}
                                            value={newUserData.password}
                                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        />
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {t('userManagement.form.notes.passwordKeep')}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                                            {t('userManagement.form.role')}
                                        </label>
                                        <select
                                            value={newUserData.role}
                                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                isDarkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        >
                                            <option value="student">👨‍🎓 {t('userManagement.roles.student')}</option>
                                            <option value="teacher">👨‍🏫 {t('userManagement.roles.teacher')}</option>
                                            <option value="admin">👨‍💼 {t('userManagement.roles.admin')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`flex justify-end space-x-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setShowEditUserForm(false);
                                            setEditingUser(null);
                                            setNewUserData({
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                password: '',
                                                role: 'student'
                                            });
                                        }}
                                    >
                                        {t('userManagement.buttons.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        💾 {t('userManagement.buttons.updateUser')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
    
            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border w-full max-w-md mx-4 transition-colors duration-300`}>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <span className="text-red-600 text-2xl">⚠️</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                                    {t('userManagement.modals.deleteUser.title')}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
                                    {t('userManagement.modals.deleteUser.message')} <strong>"{userToDelete.firstName} {userToDelete.lastName}"</strong> ({userToDelete.email})?
                                    <br />
                                    <span className="text-red-500 font-medium">{t('userManagement.modals.deleteUser.warning')}</span>
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        console.log('❌ Cancel delete clicked');
                                        setShowDeleteConfirm(false);
                                        setUserToDelete(null);
                                    }}
                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {t('userManagement.buttons.cancel')}
                                </button>
                                <button
                                    onClick={confirmDeleteUser}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    🗑️ {t('userManagement.buttons.yesDelete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Users Table */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                        }`}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-1">
                                        <span>👤 {t('userManagement.table.headers.user')}</span>
                                        <span className={`transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>↕️</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-1">
                                        <span>📧 {t('userManagement.table.headers.contact')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-1">
                                        <span>🎭 {t('userManagement.table.headers.role')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-1">
                                        <span>📊 {t('userManagement.table.headers.status')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-1">
                                        <span>📅 {t('userManagement.table.headers.joined')}</span>
                                    </div>
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    ⚡ {t('userManagement.table.headers.actions')}
                                </th>
                            </tr>
                        </thead>
                        {/* // Update the table body to use getCurrentPageItems() instead of getFilteredUsers() */}
                        <tbody className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                        }`}>
                            {getCurrentPageItems().map((user, index) => (
                                <tr key={user._id} className={`transition-colors duration-200 ${
                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                } ${!user.isApproved ? (isDarkMode ? 'bg-orange-900/30 border-l-4 border-orange-500' : 'bg-orange-25 border-l-4 border-orange-400') : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                                                    user.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                                    user.role === 'teacher' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                                                    'bg-gradient-to-br from-blue-400 to-purple-500'
                                                }`}>
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 rounded-full transition-colors duration-300 ${
                                                    isDarkMode ? 'border-gray-800' : 'border-white'
                                                } ${user.isApproved ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className={`text-sm font-semibold transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className={`text-xs transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    ID: {user._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className={`text-sm transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>{user.email}</div>
                                            {user.phone && (
                                                <div className={`text-xs transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>📱 {user.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                                            user.role === 'admin' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' : 'bg-purple-100 text-purple-800') :
                                            user.role === 'teacher' ? (isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-green-100 text-green-800') :
                                            (isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800')
                                        }`}>
                                            <span className="mr-1">
                                                {user.role === 'admin' ? '👨‍💼' : 
                                                user.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                                            </span>
                                            {t(`userManagement.roles.${user.role}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                                                user.isApproved ? (isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-orange-900/50 text-orange-300 border border-orange-700/50' : 'bg-orange-100 text-orange-800')
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    user.isApproved ? 'bg-green-400' : 'bg-orange-400'
                                                }`}></span>
                                                {user.isApproved ? t('userManagement.status.approved') : t('userManagement.status.pending')}
                                            </span>
                                            {!user.isApproved && (
                                                <div className={`text-xs font-medium transition-colors duration-300 ${
                                                    isDarkMode ? 'text-orange-400' : 'text-orange-600'
                                                }`}>
                                                    ⚠️ {t('userManagement.status.needsReview')}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <div className="space-y-1">
                                            <div className={`font-medium transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs">
                                                {(() => {
                                                    const days = Math.floor((Date.now() - new Date(user.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                    return days === 0 ? t('userManagement.table.timeago.today') : `${days} ${t('userManagement.table.timeago.daysAgo')}`;
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {!user.isApproved ? (
                                                <>
                                                    <button 
                                                        className={`inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 transition-colors duration-200 ${
                                                            isDarkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-100'
                                                        }`}
                                                        onClick={() => handleUserApproval(user._id, true)}
                                                        title={t('userManagement.table.actions.approve')}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        className={`inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 transition-colors duration-200 ${
                                                            isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                                                        }`}
                                                        onClick={() => handleUserApproval(user._id, false)}
                                                        title={t('userManagement.table.actions.reject')}
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className={`inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 transition-colors duration-200 ${
                                                            isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'
                                                        }`}
                                                        onClick={() => handleEditUser(user)}
                                                        title={t('userManagement.table.actions.edit')}
                                                    >
                                                        📝
                                                    </button>
                                                    <button 
                                                        className={`inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 transition-colors duration-200 ${
                                                            isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                                                        }`}
                                                        onClick={() => handleDeleteUser(user)}
                                                        title={t('userManagement.table.actions.delete')}
                                                    >
                                                        🗑️
                                                    </button>
                                                </>
                                            )}
                                            
                                            {/* More Actions Dropdown */}
                                            <div className="relative group">
                                                <button className={`inline-flex items-center p-2 border border-transparent rounded-lg transition-colors duration-200 ${
                                                    isDarkMode ? 'text-gray-400 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-100'
                                                }`}>
                                                    ⋮
                                                </button>
                                                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                                                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                                }`}>
                                                    <div className="py-1">
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                                                                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <span className="mr-2">📝</span>
                                                            {t('userManagement.dropdown.editUser')}
                                                        </button>
                                                        <hr className={`my-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                                                        <button 
                                                            className={`flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors duration-200 ${
                                                                isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                                                            }`}
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
                                                            <span className="mr-2">🗑️</span>
                                                            {t('userManagement.dropdown.deleteUser')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Show empty state when no users found */}
                            {getCurrentPageItems().length === 0 && (
                                <tr>
                                    <td colSpan="6" className={`px-6 py-12 text-center transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                <span className="text-2xl">👥</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-medium transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                }`}>
                                                    {getFilteredUsers().length === 0 ? 'No users found' : 'No users on this page'}
                                                </h3>
                                                <p className={`text-sm transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-500' : 'text-gray-600'
                                                }`}>
                                                    {getFilteredUsers().length === 0 
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'Navigate to a different page to see more users'
                                                    }
                                                </p>
                                            </div>
                                            {(searchTerm || selectedRole || selectedStatus) && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setSelectedRole('');
                                                        setSelectedStatus('');
                                                        setCurrentPage(1);
                                                    }}
                                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-colors ${
                                                        isDarkMode 
                                                            ? 'text-blue-300 bg-blue-900/50 hover:bg-blue-800/50' 
                                                            : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                    }`}
                                                >
                                                    <span className="mr-2">🔄</span>
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
    
                {/* Table Footer */}
                {/* Enhanced Pagination Footer */}
                {(() => {
                    const filteredUsers = getFilteredUsers();
                    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
                    
                    // Generate smart page numbers
                    const getPageNumbers = () => {
                        const pages = [];
                        const maxVisiblePages = 5;
                        
                        if (totalPages <= maxVisiblePages) {
                            for (let i = 1; i <= totalPages; i++) {
                                pages.push(i);
                            }
                        } else {
                            const startPage = Math.max(1, currentPage - 2);
                            const endPage = Math.min(totalPages, currentPage + 2);
                            
                            if (startPage > 1) {
                                pages.push(1);
                                if (startPage > 2) pages.push('...');
                            }
                            
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                            }
                            
                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) pages.push('...');
                                pages.push(totalPages);
                            }
                        }
                        return pages;
                    };
                
                    const handlePageChange = (pageNumber) => {
                        if (pageNumber >= 1 && pageNumber <= totalPages) {
                            setCurrentPage(pageNumber);
                        }
                    };
                
                    const handlePreviousPage = () => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    };
                
                    const handleNextPage = () => {
                        if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                        }
                    };
                
                    return (
                        <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t transition-all duration-300 ${
                            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            {/* Results Info */}
                            <div className={`text-sm mb-4 sm:mb-0 transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <div className="flex items-center space-x-1 flex-wrap">
                                    <span>{t('userManagement.footer.showing')}</span>
                                    <span className={`font-semibold px-2 py-1 rounded-lg transition-colors duration-300 ${
                                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {filteredUsers.length > 0 ? startIndex + 1 : 0} - {endIndex}
                                    </span>
                                    <span>{t('userManagement.footer.of')}</span>
                                    <span className={`font-semibold px-2 py-1 rounded-lg transition-colors duration-300 ${
                                        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                                    }`}>
                                        {filteredUsers.length}
                                    </span>
                                    <span>{t('userManagement.footer.users')}</span>
                                    {(searchTerm || selectedRole || selectedStatus) && (
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                                            isDarkMode ? 'bg-orange-900/50 text-orange-300 border border-orange-700/50' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            🔍 {t('userManagement.footer.filtered')}
                                        </span>
                                    )}
                                </div>
                            </div>
                
                            {/* Pagination Controls - Only show if there are pages */}
                            {totalPages > 0 && (
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button 
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            currentPage === 1
                                                ? isDarkMode 
                                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                                : isDarkMode 
                                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                        }`}
                                        title={t('userManagement.footer.previous')}
                                    >
                                        <span className="mr-1">←</span>
                                        <span className="hidden sm:inline">{t('userManagement.footer.previous')}</span>
                                        <span className="sm:hidden">Prev</span>
                                    </button>
                
                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {getPageNumbers().map((page, index) => (
                                            <div key={index}>
                                                {page === '...' ? (
                                                    <span className={`px-3 py-2 text-sm transition-colors duration-300 ${
                                                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                                    }`}>
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                                            currentPage === page
                                                                ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                                                                : isDarkMode 
                                                                    ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                                        }`}
                                                        title={`Go to page ${page}`}
                                                    >
                                                        {page}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                
                                    {/* Next Button */}
                                    <button 
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            currentPage === totalPages
                                                ? isDarkMode 
                                                    ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed opacity-50' 
                                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                                                : isDarkMode 
                                                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-300' 
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                        }`}
                                        title={t('userManagement.footer.next')}
                                    >
                                        <span className="hidden sm:inline">{t('userManagement.footer.next')}</span>
                                        <span className="sm:hidden">Next</span>
                                        <span className="ml-1">→</span>
                                    </button>
                                </div>
                            )}
                
                            {/* Quick Page Jump for Large Datasets */}
                            {totalPages > 10 && (
                                <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                                    <span className={`text-sm transition-colors duration-300 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        Page:
                                    </span>
                                    <select
                                        value={currentPage}
                                        onChange={(e) => handlePageChange(parseInt(e.target.value))}
                                        className={`px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-800 text-gray-300' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                    >
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <option key={page} value={page}>
                                                {page}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
        </div>
    );

    const renderApplicationManagement = () => (
        <div className="space-y-6">
            {/* Header Section */}
            <div className={`rounded-2xl p-6 shadow-lg border ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Title and Stats */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <span className="text-white text-xl">📋</span>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {t('applicationManagement.title')}
                                </h2>
                                <p className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.subtitle')}
                                </p>
                            </div>
                        </div>
    
                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className={`p-3 rounded-lg border ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                <div className="text-lg font-bold text-blue-600">
                                    {applicationSubmissions.length}
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.stats.totalApplications')}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                <div className="text-lg font-bold text-orange-600">
                                    {applicationSubmissions.filter(app => app.status === 'pending').length}
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.stats.pending')}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                <div className="text-lg font-bold text-green-600">
                                    {applicationSubmissions.filter(app => app.status === 'approved').length}
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.stats.approved')}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                <div className="text-lg font-bold text-red-600">
                                    {applicationSubmissions.filter(app => app.status === 'rejected').length}
                                </div>
                                <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.stats.rejected')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>🔍</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={t('applicationManagement.search.placeholder')}
                                    value={searchTermApp}
                                    onChange={(e) => setSearchTermApp(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                    
                            {/* Program Filter */}
                            <div className="relative">
                                <select 
                                    value={selectedProgram}
                                    onChange={(e) => setSelectedProgram(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-white' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('applicationManagement.search.allPrograms')}</option>
                                    <option value="webDevelopment">{t('applicationManagement.programs.webDevelopment')}</option>
                                    <option value="dataScience">{t('applicationManagement.programs.dataScience')}</option>
                                    <option value="cybersecurity">{t('applicationManagement.programs.cybersecurity')}</option>
                                    <option value="cloudComputing">{t('applicationManagement.programs.cloudComputing')}</option>
                                    <option value="aiMachineLearning">{t('applicationManagement.programs.aiMachineLearning')}</option>
                                </select>
                            </div>
                    
                            {/* Status Filter */}
                            <div className="relative">
                                <select 
                                    value={selectedAppStatus}
                                    onChange={(e) => setSelectedAppStatus(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 bg-gray-700 text-white' 
                                            : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                >
                                    <option value="">{t('applicationManagement.search.allStatus')}</option>
                                    <option value="pending">{t('applicationManagement.status.pending')}</option>
                                    <option value="approved">{t('applicationManagement.status.approved')}</option>
                                    <option value="rejected">{t('applicationManagement.status.rejected')}</option>
                                    <option value="under-review">{t('applicationManagement.status.underReview')}</option>
                                </select>
                            </div>
                        </div>
                    
                        {/* Clear Filters Button (only shows when filters are active) */}
                        {(searchTermApp || selectedProgram || selectedAppStatus) && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setSearchTermApp('');
                                        setSelectedProgram('');
                                        setSelectedAppStatus('');
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 text-sm border rounded-lg transition-colors hover:bg-opacity-80 ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                            : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="mr-1">🔄</span>
                                    {t('applicationManagement.buttons.clearFilters')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    
            {/* Applications Table */}
            <div className={`rounded-2xl shadow-lg border overflow-hidden ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            }`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className={`${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <tr>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.applicant')}
                                </th>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.contact')}
                                </th>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.program')}
                                </th>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.status')}
                                </th>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.submitted')}
                                </th>
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t('applicationManagement.table.headers.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${
                            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                        }`}>
                            {getCurrentPageApplications().map((application) => (
                                <tr key={application._id} className={`hover:bg-opacity-50 ${
                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                }`}>
                                    {/* Applicant Cell */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold ${
                                                application.status === 'approved' 
                                                    ? 'bg-green-500' :
                                                application.status === 'rejected' 
                                                    ? 'bg-red-500' :
                                                'bg-blue-500'
                                            }`}>
                                                {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`font-medium ${
                                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {application.firstName} {application.lastName}
                                                </div>
                                                <div className={`text-xs ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    ID: {application._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
    
                                    {/* Contact Cell */}
                                    <td className="px-4 py-3">
                                        <div className={`text-sm ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {application.email}
                                        </div>
                                        {application.phone && (
                                            <div className={`text-xs ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                📱 {application.phone}
                                            </div>
                                        )}
                                    </td>
    
                                    {/* Program Cell */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                            application.program === 'data-science' 
                                                ? (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800') :
                                            application.program === 'web-development' 
                                                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') :
                                            application.program === 'machine-learning' 
                                                ? (isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800') :
                                            application.program === 'cybersecurity' 
                                                ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                                            (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800')
                                        }`}>
                                            {application.program === 'data-science' ? '📊' :
                                            application.program === 'web-development' ? '💻' :
                                            application.program === 'machine-learning' ? '🤖' :
                                            application.program === 'cybersecurity' ? '🔒' : '📱'}
                                            <span className="ml-1">
                                                {t(`applicationManagement.programs.${application.program?.replace('-', '')}`) || application.program}
                                            </span>
                                        </span>
                                    </td>
    
                                    {/* Status Cell */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                            application.status === 'approved' 
                                                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') :
                                            application.status === 'rejected' 
                                                ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                                            application.status === 'under-review' 
                                                ? (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800') :
                                            (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800')
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full mr-1 ${
                                                application.status === 'approved' ? 'bg-green-500' :
                                                application.status === 'rejected' ? 'bg-red-500' :
                                                application.status === 'under-review' ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}></div>
                                            {t(`applicationManagement.status.${application.status}`)}
                                        </span>
                                    </td>
    
                                    {/* Submitted Date Cell */}
                                    <td className={`px-4 py-3 text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <div className={`font-medium ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs">
                                            {(() => {
                                                const days = Math.floor((new Date() - new Date(application.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
                                                return `${days} ${t('applicationManagement.table.daysAgo', { count: days })}`;
                                            })()}
                                        </div>
                                    </td>
    
                                    {/* Actions Cell */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            {/* View Button */}
                                            <button 
                                                className={`p-2 rounded hover:bg-opacity-20 ${
                                                    isDarkMode 
                                                        ? 'text-blue-400 hover:bg-blue-500' 
                                                        : 'text-blue-600 hover:bg-blue-500'
                                                }`}
                                                onClick={() => handleViewApplication(application)}
                                                title={t('applicationManagement.table.actions.view')}
                                            >
                                                👁️
                                            </button>
    
                                            {application.status === 'pending' && (
                                                <>
                                                    {/* Approve Button */}
                                                    <button 
                                                        className={`p-2 rounded hover:bg-opacity-20 ${
                                                            isDarkMode 
                                                                ? 'text-green-400 hover:bg-green-500' 
                                                                : 'text-green-600 hover:bg-green-500'
                                                        }`}
                                                        onClick={() => handleUpdateApplicationStatus(application._id, 'approved')}
                                                        title={t('applicationManagement.table.actions.approve')}
                                                    >
                                                        ✅
                                                    </button>
    
                                                    {/* Reject Button */}
                                                    <button 
                                                        className={`p-2 rounded hover:bg-opacity-20 ${
                                                            isDarkMode 
                                                                ? 'text-red-400 hover:bg-red-500' 
                                                                : 'text-red-600 hover:bg-red-500'
                                                        }`}
                                                        onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                                                        title={t('applicationManagement.table.actions.reject')}
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            )}
    
                                            {/* Send Message Button */}
                                            <button 
                                                className={`p-2 rounded hover:bg-opacity-20 ${
                                                    isDarkMode 
                                                        ? 'text-purple-400 hover:bg-purple-500' 
                                                        : 'text-purple-600 hover:bg-purple-500'
                                                }`}
                                                onClick={() => handleSendMessage(application)}
                                                title={t('applicationManagement.table.actions.sendMessage')}
                                            >
                                                💬
                                            </button>
    
                                            {/* Delete Button */}
                                            <button 
                                                className={`p-2 rounded hover:bg-opacity-20 ${
                                                    isDarkMode 
                                                        ? 'text-red-400 hover:bg-red-500' 
                                                        : 'text-red-600 hover:bg-red-500'
                                                }`}
                                                onClick={() => handleDeleteApplication(application)}
                                                title={t('applicationManagement.table.actions.delete')}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
    
                            {/* Empty State */}
                            {getCurrentPageApplications().length === 0 && (
                                <tr>
                                    <td colSpan="6" className={`px-4 py-12 text-center ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                <span className="text-2xl">📋</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                }`}>
                                                    {getFilteredApplications().length === 0 
                                                        ? t('applicationManagement.emptyState.noApplicationsFound') 
                                                        : t('applicationManagement.emptyState.noApplicationsOnPage')}
                                                </h3>
                                                <p className="mt-1">
                                                    {getFilteredApplications().length === 0 
                                                        ? t('applicationManagement.emptyState.adjustFilters')
                                                        : t('applicationManagement.emptyState.navigateToOtherPage')}
                                                </p>
                                            </div>
                                            {(searchTermApp || selectedProgram || selectedAppStatus) && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTermApp('');
                                                        setSelectedProgram('');
                                                        setSelectedAppStatus('');
                                                        setCurrentPage(1);
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    🔄 {t('applicationManagement.buttons.clearFilters')}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
    
                {/* Pagination */}
                {renderApplicationPagination()}
            </div>
            
            {/* View Application Modal */}
            {showViewApplicationModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-4xl max-h-screen overflow-y-auto rounded-lg shadow-xl ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <span className="text-white text-xl">👁️</span>
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {t('applicationManagement.modals.viewApplication.title')}
                                    </h3>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {selectedApplication.firstName} {selectedApplication.lastName}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`p-2 rounded-lg hover:bg-opacity-20 ${
                                    isDarkMode 
                                        ? 'text-gray-400 hover:bg-gray-500' 
                                        : 'text-gray-400 hover:bg-gray-500'
                                }`}
                                onClick={() => {
                                    setShowViewApplicationModal(false);
                                    setSelectedApplication(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
    
                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-lg border-l-4 ${
                                selectedApplication.status === 'approved' 
                                    ? (isDarkMode ? 'bg-green-900 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-800') :
                                selectedApplication.status === 'rejected' 
                                    ? (isDarkMode ? 'bg-red-900 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-800') :
                                selectedApplication.status === 'under-review' 
                                    ? (isDarkMode ? 'bg-blue-900 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-800') :
                                (isDarkMode ? 'bg-orange-900 border-orange-500 text-orange-300' : 'bg-orange-50 border-orange-500 text-orange-800')
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">
                                            {t(`applicationManagement.status.${selectedApplication.status || 'pending'}`)}
                                        </p>
                                        <p className="text-sm opacity-75">
                                            {t('applicationManagement.modals.viewApplication.applicationId')}: {selectedApplication._id?.slice(-12)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-75">
                                            {t('applicationManagement.modals.viewApplication.fields.submittedOn')}
                                        </p>
                                        <p className="font-semibold">
                                            {new Date(selectedApplication.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
    
                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <span className="mr-2">👤</span>
                                        {t('applicationManagement.modals.viewApplication.personalInfo')}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`text-sm font-medium ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {t('applicationManagement.modals.viewApplication.fields.fullName')}
                                            </label>
                                            <p className={`mt-1 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {selectedApplication.firstName} {selectedApplication.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {t('applicationManagement.modals.viewApplication.fields.email')}
                                            </label>
                                            <p className={`mt-1 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {selectedApplication.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`text-sm font-medium ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {t('applicationManagement.modals.viewApplication.fields.phone')}
                                            </label>
                                            <p className={`mt-1 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {selectedApplication.phone || (
                                                    <span className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {t('applicationManagement.modals.viewApplication.notProvided')}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Academic Information */}
                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <span className="mr-2">🎓</span>
                                        {t('applicationManagement.modals.viewApplication.academicInfo')}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`text-sm font-medium ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {t('applicationManagement.modals.viewApplication.fields.programInterested')}
                                            </label>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                                                    selectedApplication.program === 'data-science' 
                                                        ? (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800') :
                                                    selectedApplication.program === 'web-development' 
                                                        ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') :
                                                    selectedApplication.program === 'machine-learning' 
                                                        ? (isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800') :
                                                    selectedApplication.program === 'cybersecurity' 
                                                        ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                                                    (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800')
                                                }`}>
                                                    {selectedApplication.program === 'data-science' ? '📊' :
                                                    selectedApplication.program === 'web-development' ? '💻' :
                                                    selectedApplication.program === 'machine-learning' ? '🤖' :
                                                    selectedApplication.program === 'cybersecurity' ? '🔒' : '📱'}
                                                    <span className="ml-1">
                                                        {t(`applicationManagement.programs.${selectedApplication.program?.replace('-', '')}`)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* Personal Statement */}
                            {selectedApplication.personalStatement && (
                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <span className="mr-2">📝</span>
                                        {t('applicationManagement.modals.viewApplication.personalStatement')}
                                    </h4>
                                    <p className={`whitespace-pre-wrap ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {selectedApplication.personalStatement}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Modal Footer */}
                        <div className={`flex justify-end space-x-3 p-6 border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            {selectedApplication.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleUpdateApplicationStatus(selectedApplication._id, 'approved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        ✅ {t('applicationManagement.buttons.approve')}
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateApplicationStatus(selectedApplication._id, 'rejected')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        ❌ {t('applicationManagement.buttons.reject')}
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => handleSendMessage(selectedApplication)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                📧 {t('applicationManagement.buttons.sendMessage')}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowViewApplicationModal(false);
                                    setSelectedApplication(null);
                                }}
                                className={`px-4 py-2 border rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {t('applicationManagement.buttons.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Delete Confirmation Modal */}
            {showDeleteApplicationConfirm && applicationToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <span className="text-red-600 text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-medium ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {t('applicationManagement.modals.deleteApplication.title')}
                                    </h3>
                                </div>
                            </div>
                            <div className={`text-sm mb-6 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                <p>
                                    {t('applicationManagement.modals.deleteApplication.message')} 
                                    <strong>"{applicationToDelete.firstName} {applicationToDelete.lastName}"</strong>?
                                </p>
                                <p className="mt-2 text-red-600 font-medium">
                                    {t('applicationManagement.modals.deleteApplication.warning')}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteApplicationConfirm(false);
                                        setApplicationToDelete(null);
                                    }}
                                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {t('applicationManagement.buttons.cancel')}
                                </button>
                                <button
                                    onClick={confirmDeleteApplication}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {t('applicationManagement.buttons.yesDelete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Send Message Modal */}
            {showSendMessageModal && messageData.recipient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-2xl rounded-lg shadow-xl ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <span className="text-white text-xl">📧</span>
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {t('applicationManagement.modals.sendMessage.title')}
                                    </h3>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {messageData.recipient.firstName} {messageData.recipient.lastName}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`p-2 rounded-lg hover:bg-opacity-20 ${
                                    isDarkMode 
                                        ? 'text-gray-400 hover:bg-gray-500' 
                                        : 'text-gray-400 hover:bg-gray-500'
                                }`}
                                onClick={() => {
                                    setShowSendMessageModal(false);
                                    setMessageData({
                                        subject: '',
                                        message: '',
                                        recipient: null
                                    });
                                }}
                            >
                                ✕
                            </button>
                        </div>
    
                        {/* Modal Content */}
                        <div className="p-6">
                            <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                                {/* Recipient Info */}
                                <div>
                                    <label className={`text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {t('applicationManagement.modals.sendMessage.fields.to')}
                                    </label>
                                    <div className={`mt-1 p-3 rounded-lg border ${
                                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                {messageData.recipient.firstName?.charAt(0)}{messageData.recipient.lastName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`font-medium ${
                                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {messageData.recipient.firstName} {messageData.recipient.lastName}
                                                </p>
                                                <p className={`text-sm ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    {messageData.recipient.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Subject */}
                                <div>
                                    <label className={`block text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {t('applicationManagement.modals.sendMessage.fields.subject')}
                                    </label>
                                    <input
                                        type="text"
                                        value={messageData.subject}
                                        onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                                        className={`mt-1 w-full px-3 py-2 border rounded-lg ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder={t('applicationManagement.modals.sendMessage.subjectPlaceholder')}
                                        required
                                    />
                                </div>
                                
                                {/* Message */}
                                <div>
                                    <label className={`block text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {t('applicationManagement.modals.sendMessage.fields.message')}
                                    </label>
                                    <textarea
                                        rows="6"
                                        value={messageData.message}
                                        onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                                        placeholder={t('applicationManagement.modals.sendMessage.placeholder')}
                                        className={`mt-1 w-full px-3 py-2 border rounded-lg resize-none ${
                                            isDarkMode 
                                                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setShowSendMessageModal(false);
                                            setMessageData({
                                                subject: '',
                                                message: '',
                                                recipient: null
                                            });
                                        }}
                                    >
                                        {t('applicationManagement.buttons.cancel')}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        📤 {t('applicationManagement.buttons.sendMessage')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
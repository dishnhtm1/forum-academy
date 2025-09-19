// Format date to readable string
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date with time
export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
};

// Truncate text if longer than maxLength
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Generate initials from name
export const getInitials = (name) => {
    if (!name) return 'NA';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

// Return status color class based on status value
export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'new':
        return 'status-new';
        case 'processing':
        return 'status-processing';
        case 'accepted':
        return 'status-accepted';
        case 'rejected':
        return 'status-rejected';
        case 'replied':
        return 'status-replied';
        case 'read':
        return 'status-read';
        case 'active':
        return 'status-active';
        case 'inactive':
        return 'status-inactive';
        default:
        return 'status-default';
    }
};

// Format phone number
export const formatPhoneNumber = (phoneNumberString) => {
    if (!phoneNumberString) return 'N/A';
    
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    return phoneNumberString;
};
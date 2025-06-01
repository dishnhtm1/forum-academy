// const express = require('express');
// const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
// const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/', submitContact);

// // Admin routes for contact management (ADD THESE TWO NEW ROUTES)
// router.get('/all', authenticate, authorizeRoles('admin'), getAllContacts);
// router.put('/:id/status', authenticate, authorizeRoles('admin'), updateContactStatus);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// GET all contacts (admin only) - This is what your dashboard calls
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        console.log('📧 Fetching all contact submissions...');
        const contacts = await Contact.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${contacts.length} contact submissions`);
        
        res.json({
            success: true,
            contacts: contacts,
            count: contacts.length
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact submissions',
            error: error.message
        });
    }
});

// POST new contact (public) - For contact form submissions
router.post('/', async (req, res) => {
    try {
        console.log('📧 Creating new contact submission:', req.body);
        const contact = new Contact(req.body);
        await contact.save();
        
        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            contact
        });
    } catch (error) {
        console.error('❌ Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending contact message',
            error: error.message
        });
    }
});

// PUT update contact status (admin only)
router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const contactId = req.params.id;
        
        console.log(`📧 Updating contact ${contactId} status to: ${status}`);
        
        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }
        
        console.log(`✅ Contact status updated successfully`);
        res.json({
            success: true,
            message: 'Contact status updated successfully',
            contact
        });
    } catch (error) {
        console.error('❌ Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status',
            error: error.message
        });
    }
});

module.exports = router;
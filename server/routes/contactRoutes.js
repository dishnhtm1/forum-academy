// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');
// const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// // GET all contacts (admin only) - This is what your dashboard calls
// router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
//     try {
//         console.log('📧 Fetching all contact submissions...');
//         const contacts = await Contact.find().sort({ createdAt: -1 });
//         console.log(`✅ Found ${contacts.length} contact submissions`);
        
//         res.json({
//             success: true,
//             contacts: contacts,
//             count: contacts.length
//         });
//     } catch (error) {
//         console.error('❌ Error fetching contacts:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching contact submissions',
//             error: error.message
//         });
//     }
// });

// // POST new contact (public) - For contact form submissions
// router.post('/', async (req, res) => {
//     try {
//         console.log('📧 Creating new contact submission:', req.body);
//         const contact = new Contact(req.body);
//         await contact.save();
        
//         res.status(201).json({
//             success: true,
//             message: 'Contact message sent successfully',
//             contact
//         });
//     } catch (error) {
//         console.error('❌ Error creating contact:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error sending contact message',
//             error: error.message
//         });
//     }
// });

// // PUT update contact status (admin only)
// router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
//     try {
//         const { status } = req.body;
//         const contactId = req.params.id;
        
//         console.log(`📧 Updating contact ${contactId} status to: ${status}`);
        
//         const contact = await Contact.findByIdAndUpdate(
//             contactId,
//             { status, updatedAt: new Date() },
//             { new: true }
//         );
        
//         if (!contact) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Contact submission not found'
//             });
//         }
        
//         console.log(`✅ Contact status updated successfully`);
//         res.json({
//             success: true,
//             message: 'Contact status updated successfully',
//             contact
//         });
//     } catch (error) {
//         console.error('❌ Error updating contact status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating contact status',
//             error: error.message
//         });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

console.log('🔧 Loading contactRoutes.js...');

// Debug route
router.get('/debug', (req, res) => {
    res.json({
        message: 'Contact route is working!',
        timestamp: new Date().toISOString()
    });
});

// GET all contacts (admin only)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        console.log('📧 Admin fetching all contacts...');
        const contacts = await Contact.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${contacts.length} contacts`);
        
        res.json({
            success: true,
            contacts: contacts,
            count: contacts.length
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
});

// POST new contact (public)
router.post('/', async (req, res) => {
    try {
        console.log('📧 Creating new contact:', req.body);
        const contact = new Contact(req.body);
        await contact.save();
        
        res.status(201).json({
            success: true,
            message: 'Contact submitted successfully',
            contact
        });
    } catch (error) {
        console.error('❌ Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contact',
            error: error.message
        });
    }
});

// PUT update contact status (admin only) - FIXED ROUTE
router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Contact status updated',
            contact
        });
    } catch (error) {
        console.error('❌ Error updating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
            error: error.message
        });
    }
});

// Add this DELETE route with your existing routes
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const contactId = req.params.id;
        console.log(`🗑️ DELETE request for contact ID: ${contactId}`);
        
        // Validate MongoDB ObjectId format
        if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('❌ Invalid contact ID format');
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID format'
            });
        }
        
        const contact = await Contact.findById(contactId);
        
        if (!contact) {
            console.log('❌ Contact not found in database');
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        console.log(`👤 Found contact: ${contact.name} (${contact.email})`);
        
        await Contact.findByIdAndDelete(contactId);
        
        console.log(`✅ Contact deleted successfully`);
        
        res.json({
            success: true,
            message: 'Contact deleted successfully',
            deletedContact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject
            }
        });
    } catch (error) {
        console.error('❌ Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
});

// Add reply endpoint
router.post('/reply', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { contactId, subject, message, recipientEmail } = req.body;
        console.log(`📧 Sending reply to contact ${contactId}`);
        
        // Validate required fields
        if (!contactId || !subject || !message || !recipientEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: contactId, subject, message, recipientEmail'
            });
        }
        
        // Find the original contact
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        // For now, we'll just log the reply and return success
        // In a real application, you would integrate with an email service like:
        // - NodeMailer with SMTP
        // - SendGrid
        // - AWS SES
        // - Mailgun
        
        console.log(`📧 Reply Details:
        To: ${recipientEmail}
        Subject: ${subject}
        Message: ${message}
        Original Contact: ${contact.name} (${contact.email})`);
        
        // You can add email sending logic here
        // Example with nodemailer (commented out):
        /*
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: recipientEmail,
            subject: subject,
            text: message,
            html: `<div style="font-family: Arial, sans-serif;">
                <h3>${subject}</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <small>This is a reply to your inquiry: "${contact.subject}"</small>
            </div>`
        });
        */
        
        // Update contact status to indicate reply was sent
        await Contact.findByIdAndUpdate(contactId, {
            status: 'resolved',
            repliedAt: new Date(),
            replySubject: subject,
            replyMessage: message
        });
        
        res.json({
            success: true,
            message: 'Reply sent successfully',
            contact: contact
        });
        
    } catch (error) {
        console.error('❌ Error sending reply:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reply',
            error: error.message
        });
    }
});

console.log('✅ contactRoutes.js loaded successfully');
module.exports = router;
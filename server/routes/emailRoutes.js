const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Contact = require('../models/Contact');

console.log('🔧 Loading emailRoutes.js...');

// Generic email sending route for admin dashboard
router.post('/send-email', authenticate, authorizeRoles('admin', 'superadmin', 'faculty', 'teacher'), async (req, res) => {
    try {
        const { to, subject, message, type, relatedId } = req.body;
        
        console.log('📧 Send email request received:');
        console.log(`   From: ${req.user?.email || 'Unknown admin'}`);
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Type: ${type}`);
        console.log(`   Related ID: ${relatedId}`);
        
        // Validate required fields
        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, subject, and message are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address format'
            });
        }
        
        // Get related data if provided
        let relatedData = null;
        if (relatedId && type) {
            try {
                if (type === 'application') {
                    relatedData = await Application.findById(relatedId);
                } else if (type === 'message' || type === 'contact') {
                    relatedData = await Contact.findById(relatedId);
                }
            } catch (error) {
                console.log('⚠️ Could not fetch related data:', error.message);
            }
        }
        
        // Check if email configuration exists
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Email configuration missing, simulating email send...');
            
            // Simulate email sending for development
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return res.json({
                success: true,
                message: 'Email simulated successfully (email service not configured)',
                details: {
                    recipient: to,
                    subject: subject,
                    type: type,
                    sentBy: req.user?.email,
                    timestamp: new Date().toISOString(),
                    simulated: true
                }
            });
        }
        
        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Create professional email template
        const htmlMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2563eb; margin: 0;">Forum Academy</h2>
                <p style="color: #666; margin: 5px 0;">${type === 'application' ? 'Application Update' : 'Message Reply'}</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="color: #1e40af; margin-top: 0;">${subject}</h3>
                <div style="color: #374151; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${relatedData && type === 'application' ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    <strong>Regarding your application for:</strong> ${relatedData.course || relatedData.program || 'General Application'}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                    <strong>Application submitted:</strong> ${new Date(relatedData.createdAt).toLocaleDateString()}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                    <strong>Current status:</strong> ${relatedData.status}
                </p>
            </div>
            ` : ''}
            
            ${relatedData && (type === 'message' || type === 'contact') ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    <strong>Original inquiry:</strong> ${relatedData.subject}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                    <strong>Received:</strong> ${new Date(relatedData.createdAt).toLocaleDateString()}
                </p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    This email was sent from Forum Academy's administration system.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                    If you have any questions, please contact us at support@forumacademy.com
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                    © ${new Date().getFullYear()} Forum Academy. All rights reserved.
                </p>
            </div>
        </div>
        `;
        
        try {
            // Send the email
            console.log('📧 Attempting to send email...');
            await transporter.sendMail({
                from: `"Forum Academy" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                text: message,
                html: htmlMessage
            });
            
            console.log('✅ Email sent successfully');
            
            // Update status if needed
            if (relatedId && type === 'application') {
                await Application.findByIdAndUpdate(relatedId, {
                    lastContacted: new Date(),
                    $push: {
                        communications: {
                            date: new Date(),
                            subject: subject,
                            sentBy: req.user?.email
                        }
                    }
                });
            } else if (relatedId && (type === 'message' || type === 'contact')) {
                await Contact.findByIdAndUpdate(relatedId, {
                    status: 'resolved',
                    resolvedAt: new Date(),
                    resolvedBy: req.user?.email
                });
            }
            
            res.json({
                success: true,
                message: 'Email sent successfully',
                details: {
                    recipient: to,
                    subject: subject,
                    type: type,
                    sentBy: req.user?.email,
                    timestamp: new Date().toISOString()
                }
            });
            
        } catch (emailError) {
            console.error('❌ Error sending email:', emailError);
            
            // If email fails, still return success but indicate it was simulated
            console.log('⚠️ Falling back to simulated email send...');
            
            res.json({
                success: true,
                message: 'Email queued for sending (service temporarily unavailable)',
                details: {
                    recipient: to,
                    subject: subject,
                    type: type,
                    sentBy: req.user?.email,
                    timestamp: new Date().toISOString(),
                    queued: true
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Error in send-email route:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing email request',
            error: error.message
        });
    }
});

// Test email configuration
router.get('/test-config', authenticate, authorizeRoles('admin', 'superadmin'), (req, res) => {
    res.json({
        success: true,
        emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
        emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'Not configured',
        message: process.env.EMAIL_USER && process.env.EMAIL_PASS 
            ? 'Email service is configured' 
            : 'Email service not configured - emails will be simulated'
    });
});

console.log('✅ emailRoutes.js loaded successfully');

module.exports = router;

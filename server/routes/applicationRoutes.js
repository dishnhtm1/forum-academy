// const express = require('express');
// const { submitApplication, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
// const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/', submitApplication);

// // Admin routes (ADD THESE TWO NEW ROUTES)
// router.get('/all', authenticate, authorizeRoles('admin'), getAllApplications);
// router.put('/:id/status', authenticate, authorizeRoles('admin'), updateApplicationStatus);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// GET all applications (admin only) - This is what your dashboard calls
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        console.log('📋 Fetching all applications...');
        const applications = await Application.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${applications.length} applications`);
        
        res.json({
            success: true,
            applications: applications,
            count: applications.length
        });
    } catch (error) {
        console.error('❌ Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// POST new application (public) - For application form submissions
router.post('/', async (req, res) => {
    try {
        console.log('📋 Creating new application:', req.body);
        const application = new Application(req.body);
        await application.save();
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        console.error('❌ Error creating application:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// PUT update application status (admin only)
router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        
        console.log(`📋 Updating application ${applicationId} status to: ${status}`);
        
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        console.log(`✅ Application status updated successfully`);
        res.json({
            success: true,
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        console.error('❌ Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
});

module.exports = router;
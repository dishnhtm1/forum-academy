// const Application = require('../models/Application');

// exports.submitApplication = async (req, res) => {
//   try {
//     const application = new Application(req.body);
//     await application.save();
//     res.status(201).json({ message: 'Application submitted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const Application = require('../models/Application');

exports.submitApplication = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'firstName', 
            'lastName', 
            'email', 
            'phone',
            'program',
            'agreeToTerms'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Create new application
        const application = new Application(req.body);
        await application.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: application._id
        });

    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application. Please try again.'
        });
    }
};
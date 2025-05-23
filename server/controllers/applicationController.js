// // const Application = require('../models/Application');

// // exports.submitApplication = async (req, res) => {
// //   try {
// //     const application = new Application(req.body);
// //     await application.save();
// //     res.status(201).json({ message: 'Application submitted successfully' });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// const Application = require('../models/Application');

// // Create a new application
// exports.createApplication = async (req, res) => {
//   try {
//     // Create and save the application
//     const application = new Application({
//       // Map form data to your schema
//       firstName: req.body.fullName ? req.body.fullName.split(' ')[0] : '',
//       lastName: req.body.fullName ? req.body.fullName.split(' ').slice(1).join(' ') : '',
//       email: req.body.email,
//       phone: req.body.phone,
//       dateOfBirth: req.body.dateOfBirth,
//       address: req.body.address,
      
//       // Education info
//       highestEducation: req.body.highestEducation,
//       schoolName: req.body.schoolName,
//       graduationYear: req.body.graduationYear,
//       fieldOfStudy: req.body.fieldOfStudy,
//       techExperience: req.body.relevantExperience,
      
//       // Course selection
//       program: req.body.course,
//       startDate: req.body.startDate,
//       format: req.body.studyFormat,
//       heardAboutUs: req.body.howDidYouHear,
      
//       // Additional info
//       goals: req.body.careerGoals,
//       whyThisProgram: req.body.programInterest,
//       extraInfo: req.body.questions,
//       agreeToTerms: req.body.agreeToTerms
//     });

//     await application.save();
    
//     res.status(201).json({ 
//       success: true, 
//       message: 'Application submitted successfully',
//       applicationId: application._id
//     });
//   } catch (error) {
//     console.error('Application submission error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error submitting application',
//       error: error.message
//     });
//   }
// };

// // Get all applications (admin only)
// exports.getApplications = async (req, res) => {
//   try {
//     const applications = await Application.find().sort({ createdAt: -1 });
//     res.status(200).json({ applications });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching applications', error: error.message });
//   }
// };

// // Get application by ID
// exports.getApplicationById = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }
//     res.status(200).json({ application });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching application', error: error.message });
//   }
// };

const Application = require('../models/Application');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    console.log('Received application data:', req.body);
    
    // Create new application
    const application = new Application(req.body);
    await application.save();
    
    console.log('Application saved successfully:', application);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};
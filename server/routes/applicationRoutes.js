// const express = require('express');
// const { submitApplication } = require('../controllers/applicationController');
// const router = express.Router();

// router.post('/', submitApplication);

// module.exports = router;

const express = require('express');
const { submitApplication, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', submitApplication);

// Admin routes (ADD THESE TWO NEW ROUTES)
router.get('/all', authenticate, authorizeRoles('admin'), getAllApplications);
router.put('/:id/status', authenticate, authorizeRoles('admin'), updateApplicationStatus);

module.exports = router;
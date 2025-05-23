const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/applicationController');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Submit application (public route)
router.post('/', applicationController.createApplication);

// Admin routes (protected)
router.get('/', authMiddleware, isAdmin, applicationController.getApplications);
router.get('/:id', authMiddleware, isAdmin, applicationController.getApplicationById);

module.exports = router;
const express = require('express');
const router = express.Router();

// Import API routes
const authRoutes = require('./api/auth');
const courseRoutes = require('./api/courses');
const studentRoutes = require('./api/students');
const applicationRoutes = require('./api/applications');

// Mount API routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;
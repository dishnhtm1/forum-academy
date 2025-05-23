// const express = require('express');
// const router = express.Router();
// const contactController = require('../controllers/contactController');
// const { authMiddleware, isAdmin } = require('../middleware/auth');

// // // Public route to submit contact form
// // router.post('/', contactController.submitContactForm);
// router.post('/', contactController.submitContactForm);


// // Admin routes
// router.get('/', authMiddleware, isAdmin, contactController.getAllContacts);
// router.get('/:id', authMiddleware, isAdmin, contactController.getContactById);
// router.patch('/:id/status', authMiddleware, isAdmin, contactController.updateContactStatus);

// module.exports = router;

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to submit contact form
router.post('/', contactController.submitContactForm);

// Export router
module.exports = router;
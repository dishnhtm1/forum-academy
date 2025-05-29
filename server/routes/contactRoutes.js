// const express = require('express');
// const { submitContact } = require('../controllers/contactController');
// const router = express.Router();

// router.post('/', submitContact);

// module.exports = router;

const express = require('express');
const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', submitContact);

// Admin routes for contact management (ADD THESE TWO NEW ROUTES)
router.get('/all', authenticate, authorizeRoles('admin'), getAllContacts);
router.put('/:id/status', authenticate, authorizeRoles('admin'), updateContactStatus);

module.exports = router;
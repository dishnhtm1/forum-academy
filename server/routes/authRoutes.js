const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Registration and Login Routes
router.post('/register', register);
router.post('/login', login);

// ✅ Admin route to approve a user by ID
router.put('/approve/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.email} approved` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Approval failed' });
  }
});

// ✅ Admin route to fetch all pending users
router.get('/pending', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending users' });
  }
});

module.exports = router;

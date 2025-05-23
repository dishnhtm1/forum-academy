const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register Controller
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Only admin is auto-approved
    const user = new User({
      email,
      password,
      role,
      isApproved: role === 'admin' ? true : false
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully. Waiting for approval.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found or role mismatch' });
    }

    // Check if admin approved the user
    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account not approved yet' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      role: user.role,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();

    res.status(201).json({ message: 'Thank you for your message! We will get back to you shortly.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

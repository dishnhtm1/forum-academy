// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String },
//   subject: { type: String, required: true },
//   message: { type: String, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Contact', contactSchema);

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  // ADD THIS NEW FIELD:
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'approved', 'ignored'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
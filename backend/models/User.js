const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /.+\@university\.edu$/, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'Admin'], 
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  universityCode: {
    type: String,
    required: true,
  },
  // --- NEW FIELDS ADDED ---
  contactNumber: { type: String, default: 'Not provided' },
  address: { type: String, default: 'Not provided' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


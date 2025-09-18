// models/StudentMessRequest.js
const mongoose = require('mongoose');

const StudentMessRequestSchema = new mongoose.Schema({
    // Link the request to the student who made it
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    // The student's choice of mess plan
    subscriptionType: { 
        type: String, 
        enum: ['Full-Board', 'Breakfast-Only', 'None'], 
        required: true 
    },
    // The month the plan should start (from the HTML input)
    effectiveMonth: { 
        type: String, 
        required: true,
        // Enforce YYYY-MM format, e.g., "2025-10"
        match: /^\d{4}-\d{2}$/ 
    }, 
    requestDate: { 
        type: Date, 
        default: Date.now 
    },
    // Status for admin/warden review
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('StudentMessRequest', StudentMessRequestSchema);
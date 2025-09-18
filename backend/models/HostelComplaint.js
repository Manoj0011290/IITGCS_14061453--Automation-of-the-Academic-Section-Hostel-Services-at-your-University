// models/HostelComplaint.js
const mongoose = require('mongoose');

const HostelComplaintSchema = new mongoose.Schema({
    // Link to the student who registered the complaint
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Referencing the User model
        required: true 
    },
    // The category of the complaint
    type: { 
        type: String, 
        enum: ['Infrastructure', 'Gym', 'Sports', 'Other'], 
        required: true 
    },
    // Detailed description of the issue
    description: { 
        type: String, 
        required: true 
    },
    submissionDate: { 
        type: Date, 
        default: Date.now 
    },
    // Status tracking for resolution
    status: { 
        type: String, 
        enum: ['New', 'In Progress', 'Resolved', 'Closed'], 
        default: 'New' 
    },
    // Notes added by the warden/maintenance staff
    resolutionNotes: { 
        type: String 
    },
}, { timestamps: true });

module.exports = mongoose.model('HostelComplaint', HostelComplaintSchema);
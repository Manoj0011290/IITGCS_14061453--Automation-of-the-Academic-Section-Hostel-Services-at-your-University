const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileUrl: {
        type: String,
        required: true // Link to the submitted file (e.g., on a cloud storage)
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    grade: {
        type: String,
        default: 'Not Graded'
    },
    feedback: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Submitted', 'Graded'],
        default: 'Submitted'
    }
});

// Prevent a student from submitting the same assignment twice
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);

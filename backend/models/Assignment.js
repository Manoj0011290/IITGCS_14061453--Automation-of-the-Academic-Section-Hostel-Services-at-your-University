const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Graded'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
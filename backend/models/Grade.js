const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true
    },
    internalMarks: { type: String, required: true },
    externalMarks: { type: String, required: true },
    grade: { type: String, required: true },
    remarks: { type: String }
});

module.exports = mongoose.model('Grade', gradeSchema);
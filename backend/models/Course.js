const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description available.'
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // This links to a specific faculty member from your User collection
    }
});

module.exports = mongoose.model('Course', courseSchema);

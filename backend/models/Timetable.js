const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        enum: [
            'Computer Science', 'Electrical and Electronics', 'Chemical', 'Mechanical',
            'Aeronautical', 'Manufacturing', 'Design', 'Humanities and Social Science',
            'Physics', 'Chemistry', 'Mathematics', 'Civil', 'Biotechnology'
        ]
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    section: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    imageUrl: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to prevent duplicate timetables for the same class
timetableSchema.index({ department: 1, year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);

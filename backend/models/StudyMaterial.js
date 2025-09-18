const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    faculty: {
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
    fileUrl: { // In a real app, this would link to a file storage service like AWS S3
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
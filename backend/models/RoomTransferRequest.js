// models/RoomTransferRequest.js
const mongoose = require('mongoose');

const RoomTransferRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed ref to 'User' to match common practice
    reason: { type: String, required: true },
    preferredRoomType: { 
        type: String, 
        enum: ['Single', 'Double', 'Triple'], 
        required: true 
    },
    requestDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed'], 
        default: 'Pending' 
    },
    newRoomNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RoomTransferRequest', RoomTransferRequestSchema);
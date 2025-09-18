const express = require('express');
const router = express.Router();
const { protect, isFaculty } = require('../middleware/authMiddleware');

const {
    getAttendanceSheet,
    submitAttendance
} = require('../controllers/attendanceController');

// Apply faculty security to all attendance management routes
router.use(protect, isFaculty);

// Route for getting the attendance sheet for a specific class and date
// e.g., /api/faculty/attendance?courseId=...&date=...
router.get('/attendance', getAttendanceSheet);

// Route for submitting the attendance data
router.post('/attendance', submitAttendance);

module.exports = router;

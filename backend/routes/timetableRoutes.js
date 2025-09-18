const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');

const {
    uploadTimetable,
    findTimetable
} = require('../controllers/timetableController');

// Apply admin security to all timetable management routes
router.use(protect, isAdmin);

// Route for finding a timetable based on query parameters
// e.g., /api/admin/timetables/find?department=Computer%20Science&year=1&section=1
router.get('/timetables/find', findTimetable);

// Route for uploading a new timetable
router.post('/timetables', uploadTimetable);

module.exports = router;

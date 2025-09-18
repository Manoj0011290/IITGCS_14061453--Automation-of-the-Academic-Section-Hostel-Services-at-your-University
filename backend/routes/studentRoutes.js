const express = require('express');
const router = express.Router();
const { protect, isStudent } = require('../middleware/authMiddleware');

const {
    getProfile,
    getAssignments,
    getGrades,
    getLeaveHistory,
    applyForLeave,
    getTimetable,
    getNotices,
    getAvailableCourses,
    enrollInCourse,
    getMyCourses,
    getAttendanceSummary,
    updateMessSubscription,
    requestRoomTransfer,
    registerComplaint
} = require('../controllers/studentController');

// Apply security to all routes in this file
router.use(protect, isStudent);

// --- NEW ROUTE ADDED ---
// This route gets the courses the student is currently enrolled in
router.get('/my-courses', getMyCourses);


// --- Existing Course Registration Routes ---
router.get('/courses/available', getAvailableCourses);
router.post('/courses/enroll', enrollInCourse);

// --- Other Existing Routes ---
router.get('/profile', getProfile);
router.get('/assignments', getAssignments);
router.get('/grades', getGrades);
router.get('/leave-history', getLeaveHistory);
router.post('/apply-leave', applyForLeave);
router.get('/timetable', getTimetable);
router.get('/notices', getNotices);
router.get('/attendance-summary', getAttendanceSummary);
router.post('/hostel/mess', updateMessSubscription);
router.post('/hostel/transfer', requestRoomTransfer);
router.post('/hostel/complaint', registerComplaint);

module.exports = router;


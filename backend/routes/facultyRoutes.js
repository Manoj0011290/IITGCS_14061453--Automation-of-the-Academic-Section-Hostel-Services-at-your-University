const express = require('express');
const router = express.Router();
const { protect, isFaculty } = require('../middleware/authMiddleware');

const {
    getProfile,
    updateProfile,
    getAssignedCourses,
    getStudents,
    getLeaveRequests,
    updateLeaveRequest,
    postNotice,
    // --- Import new assignment functions ---
    getFacultyAssignments,
    createAssignment,
    getSubmissionsForAssignment,
    gradeSubmission
} = require('../controllers/facultyController');

// Apply security to all routes in this file
router.use(protect, isFaculty);

// Profile routes
router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

// Course route
router.get('/courses', getAssignedCourses);

// --- NEW ASSIGNMENT ROUTES ---
router.get('/assignments', getFacultyAssignments);
router.post('/assignments', createAssignment);
router.get('/assignments/:id/submissions', getSubmissionsForAssignment);
router.put('/submissions/:id', gradeSubmission);

// Other existing routes
router.get('/students', getStudents);
router.get('/leave-requests', getLeaveRequests);
router.put('/leave-requests/:id', updateLeaveRequest);
router.post('/notices', postNotice);


module.exports = router;


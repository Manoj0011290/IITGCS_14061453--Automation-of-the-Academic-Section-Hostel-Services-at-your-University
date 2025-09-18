const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');

const {
    getAllCourses,
    getCourseById, // Import the new function
    createCourse,
    updateCourse,
    deleteCourse,
    getFacultyList
} = require('../controllers/courseController');

// Apply admin security to all course management routes
router.use(protect, isAdmin);

// Route to get the list of faculty members for the dropdown
router.get('/faculty-list', getFacultyList);

// Routes for creating and getting all courses
router.route('/courses')
    .get(getAllCourses)
    .post(createCourse);

// Routes for getting, updating, and deleting a specific course by its ID
router.route('/courses/:id')
    .get(getCourseById) // <-- ADD THIS NEW ROUTE
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
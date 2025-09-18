const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');

const {
    getDashboardStats,
    getAllUsers,
    getUser, // Import new function
    createUser,
    updateUser, // Import new function
    deleteUser
} = require('../controllers/adminController');

// Apply security middleware to all routes in this file.
router.use(protect, isAdmin);

// Define the routes for admin actions
router.get('/stats', getDashboardStats);

// Chained routes for /api/admin/users
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

// Chained routes for /api/admin/users/:id
router.route('/users/:id')
    .get(getUser) // NEW: Get a single user
    .put(updateUser) // NEW: Update a user
    .delete(deleteUser);

module.exports = router;
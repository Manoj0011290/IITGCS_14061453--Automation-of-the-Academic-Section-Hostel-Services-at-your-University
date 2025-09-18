const express = require('express');
const router = express.Router();

// We will create these controller functions in the next step
const { signupUser, loginUser } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signupUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

module.exports = router;
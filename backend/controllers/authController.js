const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A secret key for JWT. In a real app, this should be in a private .env file
const JWT_SECRET = 'your-super-secret-key-12345';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, role, universityCode } = req.body;

    // --- Validation ---
    if (!fullName || !email || !password || !role || !universityCode) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (universityCode !== 'UNI2024') {
        return res.status(400).json({ message: 'Invalid University Code.' });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // --- Hash Password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Create and Save User ---
    const newUser = new User({ 
        fullName, 
        email, 
        password: hashedPassword, 
        role, 
        universityCode 
    });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully! Please log in.' });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Authenticate a user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // --- Find User ---
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // --- Validate Password ---
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        
        // --- Validate Role ---
        if (user.role !== role) {
            return res.status(400).json({ message: `You are not registered as a ${role}.` });
        }

        // --- Create JWT ---
        const payload = {
            user: { id: user.id, role: user.role }
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            token, 
            userRole: user.role, 
            message: 'Login successful!' 
        });

    } catch (error) {
         console.error(error.message);
         res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  signupUser,
  loginUser
};
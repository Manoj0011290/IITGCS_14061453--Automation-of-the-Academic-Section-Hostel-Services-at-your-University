const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard analytics (counts of users)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'Student' });
        const facultyCount = await User.countDocuments({ role: 'Faculty' });
        // In a real app, you'd count courses and requests from other models
        res.status(200).json({
            totalStudents: studentCount,
            totalFaculty: facultyCount,
            coursesOffered: 45, // Placeholder
            pendingRequests: 12  // Placeholder
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users in the system
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Get all users, exclude passwords
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ---
// @desc    Get a single user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private (Admin)
const createUser = async (req, res) => {
    try {
        const { fullName, email, password, role, department } = req.body;

        // Basic validation
        if (!fullName || !email || !password || !role || !department) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // In this simplified version, we'll manually set a university code.
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            department,
            universityCode: 'ADMIN_CREATED'
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ---
// @desc    Update an existing user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
        const { fullName, email, role, department, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for email conflict
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.role = role || user.role;
        user.department = department || user.department;

        // If a new password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'User removed successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};


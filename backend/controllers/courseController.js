const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate('faculty', 'fullName');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ---
// @desc    Get a single course by its ID
// @route   GET /api/admin/courses/:id
// @access  Private (Admin)
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Create a new course
const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, department, description, credits, faculty } = req.body;
        const courseExists = await Course.findOne({ courseCode });
        if (courseExists) {
            return res.status(400).json({ message: 'Course with this code already exists.' });
        }
        const newCourse = new Course({ courseCode, courseName, department, description, credits, faculty });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an existing course
const updateCourse = async (req, res) => {
    try {
        const { courseCode, courseName, department, description, credits, faculty } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        course.courseCode = courseCode || course.courseCode;
        course.courseName = courseName || course.courseName;
        course.department = department || course.department;
        course.description = description || course.description;
        course.credits = credits || course.credits;
        course.faculty = faculty; // Allow un-assigning by passing null/empty

        await course.save();
        res.status(200).json({ message: 'Course updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await Course.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a list of all faculty members
const getFacultyList = async (req, res) => {
    try {
        const faculty = await User.find({ role: 'Faculty' }).select('fullName');
        res.status(200).json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllCourses,
    getCourseById, // <-- Make sure to export the new function
    createCourse,
    updateCourse,
    deleteCourse,
    getFacultyList
};


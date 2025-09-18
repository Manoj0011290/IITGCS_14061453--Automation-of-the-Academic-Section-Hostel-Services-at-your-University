const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Notice = require('../models/Notice');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const bcrypt = require('bcryptjs');

// --- Profile Functions ---
const getProfile = async (req, res) => { res.status(200).json(req.user); };

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.contactNumber = req.body.contactNumber || user.contactNumber;
            user.address = req.body.address || user.address;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            await user.save();
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Course Functions ---
const getAssignedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ faculty: req.user.id });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Assignment Functions ---
const getFacultyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ faculty: req.user.id })
            .populate('course', 'courseName'); // Get course name
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course || course.faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add assignments to this course.' });
        }
        const newAssignment = new Assignment({
            title, description, dueDate,
            course: courseId,
            faculty: req.user.id,
            subject: course.courseName
        });
        await newAssignment.save();
        res.status(201).json({ message: 'Assignment created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getSubmissionsForAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment || assignment.faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view these submissions.' });
        }
        const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'fullName email');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findById(req.params.id).populate('assignment');
        if (!submission || submission.assignment.faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to grade this submission.' });
        }
        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'Graded';
        await submission.save();
        res.status(200).json({ message: 'Submission graded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Student & Leave Request Functions (Restored from older version) ---
const getStudents = async (req, res) => {
    try {
        const students = await User.find({ 
            role: 'Student', 
            department: req.user.department
        }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getLeaveRequests = async (req, res) => {
    try {
        const departmentStudents = await User.find({ department: req.user.department, role: 'Student' }).select('_id');
        const studentIds = departmentStudents.map(student => student._id);
        const requests = await LeaveRequest.find({ 
            status: 'Pending', 
            user: { $in: studentIds } 
        }).populate('user', 'fullName email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateLeaveRequest = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update.' });
        }
        const request = await LeaveRequest.findById(req.params.id).populate('user');
        if (!request) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }
        if (request.user.department !== req.user.department) {
            return res.status(403).json({ message: 'Not authorized to manage this request.' });
        }
        request.status = status;
        await request.save();
        res.status(200).json({ message: `Request has been ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Notice Functions (Restored from older version) ---
const postNotice = async (req, res) => {
    try {
        const { title, body } = req.body;
        const newNotice = new Notice({
            title,
            body,
            author: req.user.id,
            authorName: req.user.fullName
        });
        await newNotice.save();
        res.status(201).json({ message: 'Notice posted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getAssignedCourses,
    getFacultyAssignments,
    createAssignment,
    getSubmissionsForAssignment,
    gradeSubmission,
    getStudents,
    getLeaveRequests,
    updateLeaveRequest,
    postNotice
};


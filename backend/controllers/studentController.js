const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const LeaveRequest = require('../models/LeaveRequest');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance'); 
const StudentMessRequest = require('../models/StudentMessRequest');
const RoomTransferRequest = require('../models/RoomTransferRequest'); 
const HostelComplaint = require('../models/HostelComplaint'); 

// @desc    Get student profile data
const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all assignments for a student
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ user: req.user.id });
        res.status(200).json(assignments);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all grades for a student
const getGrades = async (req, res) => {
    try {
        const grades = await Grade.find({ user: req.user.id });
        res.status(200).json(grades);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get leave history for a student
const getLeaveHistory = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ user: req.user.id });
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Apply for leave
const applyForLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const newLeaveRequest = new LeaveRequest({
            user: req.user.id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await newLeaveRequest.save();
        res.status(201).json({ message: 'Leave request submitted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- MOCK DATA FUNCTIONS ---
const getTimetable = (req, res) => {
    const timetable = [
        { time: "09:00 - 10:00", mon: "Data Structures", tue: "Algorithms", wed: "Data Structures", thu: "Algorithms", fri: "Database Systems" },
        { time: "10:00 - 11:00", mon: "Operating Systems", tue: "Web Technologies", wed: "Operating Systems", thu: "Web Technologies", fri: "Project Work" },
        { time: "11:00 - 12:00", mon: "Lunch Break", tue: "Lunch Break", wed: "Lunch Break", thu: "Lunch Break", fri: "Lunch Break" },
        { time: "12:00 - 01:00", mon: "AI Lab", tue: "Networking", wed: "AI Lab", thu: "Networking", fri: "Seminar" },
    ];
    res.status(200).json(timetable);
};

const getNotices = (req, res) => {
    const notices = [
        { title: "Final Exam Schedule Published", body: "The schedule for the final semester examinations has been published...", author: "Admin", date: "20 Nov 2023" },
        { title: "Guest Lecture on AI", body: "A guest lecture on 'The Future of Artificial Intelligence' will be held on 28th Nov 2023...", author: "Dr. Sharma (CS Dept)", date: "18 Nov 2023" }
    ];
    res.status(200).json(notices);
};


// --- COURSE REGISTRATION FUNCTIONS ---
const getAvailableCourses = async (req, res) => {
    try {
        const userEnrollments = await Enrollment.find({ student: req.user.id });
        const enrolledCourseIds = userEnrollments.map(e => e.course);
        const availableCourses = await Course.find({
            department: req.user.department,
            _id: { $nin: enrolledCourseIds }
        }).populate('faculty', 'fullName');
        res.status(200).json(availableCourses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required.' });
        }
        const newEnrollment = new Enrollment({
            student: req.user.id,
            course: courseId
        });
        await newEnrollment.save();
        res.status(201).json({ message: 'Successfully enrolled in course.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already enrolled in this course.' });
        }
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id });
        const courseIds = enrollments.map(e => e.course);
        const courses = await Course.find({ '_id': { $in: courseIds } }).populate('faculty', 'fullName');
        res.status(200).json(courses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW ATTENDANCE SUMMARY FUNCTION ---
const getAttendanceSummary = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
        if (enrollments.length === 0) {
            return res.json([]);
        }

        const summary = [];
        for (const enrollment of enrollments) {
            const courseId = enrollment.course._id;
            const totalClasses = await Attendance.distinct('date', { course: courseId });
            const attendedClasses = await Attendance.countDocuments({
                student: req.user.id,
                course: courseId,
                status: { $in: ['Present', 'Late'] }
            });
            const percentage = totalClasses.length > 0 ? Math.round((attendedClasses / totalClasses.length) * 100) : 0;
            summary.push({
                subject: enrollment.course.courseName,
                percentage: percentage
            });
        }
        res.status(200).json(summary);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateMessSubscription = async (req, res) => {
    try {
        const studentId = req.user.id; // ID comes from the authenticated token
        const { subscriptionType, effectiveMonth } = req.body;

        // Basic validation
        if (!subscriptionType || !effectiveMonth) {
            return res.status(400).json({ 
                message: "Subscription type and effective month are required." 
            });
        }
        
        // Check if the requested month is in the future
        const requestDate = new Date(`${effectiveMonth}-01`); 
        const currentDate = new Date();
        
        if (requestDate <= currentDate) {
             return res.status(400).json({ 
                 message: "Mess updates must be requested for a future month." 
             });
        }

        // Check for an existing request for the same effective month
        let existingRequest = await StudentMessRequest.findOne({
            student: studentId,
            effectiveMonth: effectiveMonth,
        });

        if (existingRequest) {
            // Update the existing request instead of creating a duplicate
            existingRequest.subscriptionType = subscriptionType;
            existingRequest.status = 'Pending'; // Reset status on update
            await existingRequest.save();
            return res.status(200).json({ 
                message: `Updated mess subscription for ${effectiveMonth} to ${subscriptionType}. Your request is pending review.`,
                status: 'Updated'
            });
        }

        // Create a new request
        const newRequest = new StudentMessRequest({
            student: studentId,
            subscriptionType,
            effectiveMonth,
            status: 'Pending',
        });

        await newRequest.save();

        res.status(201).json({ 
            message: `Mess subscription request for ${effectiveMonth} submitted. Your request is pending review.`,
            status: 'Submitted'
        });

    } catch (error) {
        console.error('Error in updateMessSubscription:', error);
        res.status(500).json({ 
            message: 'Server error. Could not process mess update request.' 
        });
    }
};


// --- PLACEHOLDER FUNCTIONS FOR NEXT STEPS ---
const requestRoomTransfer = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { reason, preferredRoomType } = req.body;

        if (!reason || !preferredRoomType) {
            return res.status(400).json({ 
                message: "Reason and preferred room type are required for a transfer request." 
            });
        }
        
        // Check to see if the student already has a pending or processing request
        const activeRequest = await RoomTransferRequest.findOne({
            student: studentId,
            status: { $in: ['Pending', 'Processing'] }
        });

        if (activeRequest) {
            return res.status(400).json({ 
                message: "You have an active transfer request that is currently being reviewed. Please wait for a resolution." 
            });
        }
        
        // Create a new request
        const newRequest = new RoomTransferRequest({
            student: studentId,
            reason,
            preferredRoomType,
            status: 'Pending',
        });

        await newRequest.save();

        res.status(201).json({ 
            message: "Room transfer request submitted. The Hostel Warden has been notified for review." 
        });

    } catch (error) {
        console.error('Error in requestRoomTransfer:', error);
        res.status(500).json({ 
            message: "Server error. Could not process room transfer request." 
        });
    }
};

const registerComplaint = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { type, description } = req.body;

        if (!type || !description) {
            return res.status(400).json({ 
                message: "Complaint type and a detailed description are required." 
            });
        }

        const newComplaint = new HostelComplaint({
            student: studentId,
            type,
            description,
            status: 'New',
        });

        await newComplaint.save();

        res.status(201).json({ 
            message: "Complaint registered successfully. A ticket has been created.",
            ticketId: newComplaint._id // Return the ID for student reference
        });

    } catch (error) {
        console.error('Error in registerComplaint:', error);
        res.status(500).json({ 
            message: "Server error. Could not register complaint." 
        });
    }
};

// ------------------------------------------


module.exports = {
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
    registerComplaint,
    registerComplaint
}


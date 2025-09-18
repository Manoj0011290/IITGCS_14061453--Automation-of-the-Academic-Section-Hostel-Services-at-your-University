const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get students and their attendance status for a specific course and date
// @route   GET /api/faculty/attendance?courseId=...&date=...
// @access  Private (Faculty)
const getAttendanceSheet = async (req, res) => {
    try {
        const { courseId, date } = req.query;
        if (!courseId || !date) {
            return res.status(400).json({ message: 'Course ID and date are required.' });
        }

        const course = await Course.findById(courseId);
        if (!course || course.faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to manage this course.' });
        }

        // 1. Find all students in the same department as the course
        const students = await User.find({ role: 'Student', department: course.department }).select('fullName');

        // 2. Find existing attendance records for that day
        const records = await Attendance.find({ course: courseId, date: new Date(date) });

        // 3. Map records to student IDs for easy lookup
        const attendanceMap = new Map(records.map(r => [r.student.toString(), r.status]));

        // 4. Combine student list with their attendance status
        const attendanceSheet = students.map(student => ({
            _id: student._id,
            fullName: student.fullName,
            status: attendanceMap.get(student._id.toString()) || 'Present' // Default to 'Present'
        }));

        res.status(200).json(attendanceSheet);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit or update attendance for a class
// @route   POST /api/faculty/attendance
// @access  Private (Faculty)
const submitAttendance = async (req, res) => {
    try {
        const { courseId, date, attendanceData } = req.body; // attendanceData is an array of { studentId, status }

        if (!courseId || !date || !attendanceData) {
            return res.status(400).json({ message: 'Course ID, date, and attendance data are required.' });
        }

        const course = await Course.findById(courseId);
        if (!course || course.faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to manage this course.' });
        }

        const bulkOps = attendanceData.map(record => ({
            updateOne: {
                filter: { course: courseId, student: record.studentId, date: new Date(date) },
                update: { 
                    $set: { 
                        status: record.status,
                        faculty: req.user.id 
                    } 
                },
                upsert: true // This creates a new document if one doesn't exist
            }
        }));

        if (bulkOps.length > 0) {
            await Attendance.bulkWrite(bulkOps);
        }

        res.status(200).json({ message: 'Attendance submitted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAttendanceSheet,
    submitAttendance
};

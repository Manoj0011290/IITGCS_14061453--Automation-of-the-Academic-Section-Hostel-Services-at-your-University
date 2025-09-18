const Timetable = require('../models/Timetable');

// @desc    Upload a new timetable
// @route   POST /api/admin/timetables
// @access  Private (Admin)
const uploadTimetable = async (req, res) => {
    try {
        const { department, year, section, imageUrl } = req.body;

        if (!department || !year || !section || !imageUrl) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // The unique index in the model will automatically prevent duplicates
        const newTimetable = new Timetable({
            department,
            year,
            section,
            imageUrl
        });

        await newTimetable.save();
        res.status(201).json({ message: 'Timetable uploaded successfully.' });
    } catch (error) {
        // Handle the duplicate key error specifically
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A timetable for this class already exists.' });
        }
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Find a timetable based on search criteria
// @route   GET /api/admin/timetables/find
// @access  Private (Admin)
const findTimetable = async (req, res) => {
    try {
        const { department, year, section } = req.query; // Data comes from query params: ?department=...&year=...

        if (!department || !year || !section) {
            return res.status(400).json({ message: 'Please provide department, year, and section to search.' });
        }

        const timetable = await Timetable.findOne({ department, year, section });

        if (!timetable) {
            return res.status(404).json({ message: 'No timetable found for the selected criteria.' });
        }

        res.status(200).json(timetable);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    uploadTimetable,
    findTimetable
};

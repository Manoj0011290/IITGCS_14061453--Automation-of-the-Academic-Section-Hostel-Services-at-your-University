àconst express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all route handlers
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <-- Add this line
const courseRoutes = require('./routes/courseRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Ensure your MongoDB connection string is correctly pasted here
const MONGO_URI = "YOUR_DATABASE_CONNECTION_STRING"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

// Tell the application to use all the imported routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes); // <-- This line makes the admin routes live
app.use('/api/admin', courseRoutes);
app.use('/api/admin', timetableRoutes);
app.use('/api/faculty', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



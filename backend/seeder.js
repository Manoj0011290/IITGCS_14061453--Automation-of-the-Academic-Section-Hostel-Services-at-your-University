const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed

// --- IMPORTANT: Paste your MongoDB connection string here ---
const MONGO_URI = "YOUR_DATABASE_CONNECTION_STRING";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // Check if an admin user already exists
        const adminExists = await User.findOne({ role: 'Admin' });
        if (adminExists) {
            console.log('Admin user already exists. No action taken.');
            process.exit();
        }

        // --- Create the Admin User ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword', salt); // Set a secure password

        const adminUser = new User({
            fullName: 'University Admin',
            email: 'admin@university.edu',
            password: hashedPassword,
            role: 'Admin',
            department: 'Administration',
            universityCode: 'SUPER_ADMIN'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@university.edu');
        console.log('Password: adminpassword');
        
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        
        await User.deleteMany({ role: 'Admin' });
        console.log('All admin users destroyed!');
        
        process.exit();
    } catch (error) {
        console.error('Error with data destruction:', error);
        process.exit(1);
    }
};

// This allows you to run different modes from the command line
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();

}

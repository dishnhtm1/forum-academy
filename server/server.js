// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorMiddleware');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // // Routes
// // app.use('/api/contact', require('./routes/contactRoutes'));
// // app.use('/api/application', require('./routes/applicationRoutes'));
// // app.use('/api/auth', require('./routes/authRoutes'));

// // CHANGE these lines (around line 13-15):
// app.use('/api/contact', require('./routes/contactRoutes'));
// app.use('/api/applications', require('./routes/applicationRoutes')); // CHANGE from '/api/application' to '/api/applications'
// app.use('/api/auth', require('./routes/authRoutes'));

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({ message: 'Server is running', status: 'OK' });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('✅ Backend is running.');
// });

// app.use(errorHandler);

// // Port
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes with error handling
try {
    app.use('/api/contact', require('./routes/contactRoutes'));
    console.log('✅ Contact routes loaded');
} catch (error) {
    console.error('❌ Error loading contact routes:', error.message);
}

try {
    // Use both routes for compatibility
    app.use('/api/application', require('./routes/applicationRoutes'));
    app.use('/api/applications', require('./routes/applicationRoutes')); // For admin dashboard
    console.log('✅ Application routes loaded (both /api/application and /api/applications)');
} catch (error) {
    console.error('❌ Error loading application routes:', error.message);
}

try {
    app.use('/api/auth', require('./routes/authRoutes'));
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
}

// Test route directly in server.js as backup
app.post('/api/application-direct', async (req, res) => {
    try {
        const Application = require('./models/Application');
        console.log('📝 Direct route - Received application data:', req.body);
        
        const application = new Application(req.body);
        const savedApplication = await application.save();
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully (direct route)',
            applicationId: savedApplication._id
        });
    } catch (error) {
        console.error('❌ Direct route error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running', status: 'OK' });
});

// Root route
app.get('/', (req, res) => {
    res.send('✅ Backend is running.');
});

// List all routes for debugging
app.get('/api/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            routes.push({
                method: Object.keys(r.route.methods)[0].toUpperCase(),
                path: r.route.path
            });
        }
    });
    res.json({ routes });
});

app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Available endpoints:`);
    // console.log(`   GET  http://localhost:${PORT}/`);
    // console.log(`   GET  http://localhost:${PORT}/api/health`);
    // console.log(`   GET  http://localhost:${PORT}/api/routes`);
    // console.log(`   POST http://localhost:${PORT}/api/application`);
    // console.log(`   GET  http://localhost:${PORT}/api/applications`);
    // console.log(`   POST http://localhost:${PORT}/api/application-direct`);
});
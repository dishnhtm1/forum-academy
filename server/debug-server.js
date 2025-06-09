const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🔍 Debug Server - Testing routes one by one...');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Test mounting routes one by one
const testRoute = (routePath, mountPath, routeName) => {
    try {
        console.log(`\n🧪 Testing ${routeName} at ${mountPath}...`);
        const routes = require(routePath);
        app.use(mountPath, routes);
        console.log(`✅ ${routeName} mounted successfully`);
        
        // Try to start server after each route
        const testServer = app.listen(3002, () => {
            console.log(`✅ Server started successfully with ${routeName}`);
            testServer.close();
        });
        
        return true;
    } catch (error) {
        console.error(`❌ Error with ${routeName}:`, error.message);
        return false;
    }
};

// Test each route individually
console.log('\n=== Testing Auth Routes ===');
if (!testRoute('./routes/authRoutes', '/api/auth', 'authRoutes')) process.exit(1);

console.log('\n=== Testing User Routes ===');
if (!testRoute('./routes/userRoutes', '/api/users', 'userRoutes')) process.exit(1);

console.log('\n=== Testing Application Routes ===');
if (!testRoute('./routes/applicationRoutes', '/api/applications', 'applicationRoutes')) process.exit(1);

console.log('\n=== Testing Contact Routes ===');
if (!testRoute('./routes/contactRoutes', '/api/contact', 'contactRoutes')) process.exit(1);

console.log('\n=== Testing Admin Routes ===');
if (!testRoute('./routes/adminRoutes', '/api/admin', 'adminRoutes')) process.exit(1);

console.log('\n🎉 All routes passed individual tests!');
console.log('🔍 Now testing final server start...');

// Final test
app.listen(3003, () => {
    console.log('✅ Final server test successful!');
    process.exit(0);
}).on('error', (error) => {
    console.error('❌ Final server test failed:', error);
    process.exit(1);
});
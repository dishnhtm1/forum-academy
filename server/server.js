const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// // Routes
// app.use('/api/contact', require('./routes/contactRoutes'));
// app.use('/api/application', require('./routes/applicationRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));

// CHANGE these lines (around line 13-15):
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes')); // CHANGE from '/api/application' to '/api/applications'
app.use('/api/auth', require('./routes/authRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running.');
});

app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

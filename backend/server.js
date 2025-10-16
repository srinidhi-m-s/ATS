require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/bot', require('./routes/botRoutes'));

// Serve frontend build in production
const frontendBuildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(frontendBuildPath));

// Catch-all route to serve React frontend
app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), err => {
    if (err) {
      console.error('Error sending frontend index.html:', err);
      res.status(500).send('Something went wrong.');
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

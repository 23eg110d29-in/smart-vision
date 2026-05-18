require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically (use /tmp in serverless production)
const uploadDir = process.env.NODE_ENV === 'production' ? require('os').tmpdir() : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/images', imageRoutes);
app.get('/', (req, res) => {
  res.json({ message: "Smart Vision Analyzer API is active and running!" });
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;



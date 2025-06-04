require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cron = require('node-cron');
const { syncDeletedImages } = require('./scripts/syncS3andMongo');

cron.schedule('0 1 * * *', async () => {
  console.log('🕐 Running daily S3-Mongo sync job...');
  await syncDeletedImages();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err); 
});
// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', require('./routes/mainRoutes'));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});
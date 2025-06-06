require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cron = require('node-cron');

// Note: S3-Mongo sync disabled as we're now using DynamoDB
// const { syncDeletedImages } = require('./scripts/syncS3andMongo');
// cron.schedule('0 1 * * *', async () => {
//   console.log('🕐 Running daily S3-Mongo sync job...');
//   await syncDeletedImages();
// });

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
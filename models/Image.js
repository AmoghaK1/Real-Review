const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  uploadTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
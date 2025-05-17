const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  reviewerName: String,
  reviewText: String,
  reviewTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  imageFilename: String,
  imageName: String,
  uploadedBy: String,
  location: String,
  dateUploaded: { type: Date, default: Date.now }
}, {collection: 'metadata'});

module.exports = mongoose.model('Metadata', metadataSchema);
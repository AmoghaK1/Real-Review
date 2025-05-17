const Image = require('../models/Image');
const Metadata = require('../models/Metadata');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Image and Metadata Controllers

const loadHomePage = (req, res) => {
    res.render('home', { title: 'Home page' });
    }

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const { imageName, uploadedBy, location } = req.body;

    // Save image entry
    const image = new Image({ filename: req.file.filename });
    await image.save();

    // Save metadata entry
    const metadata = new Metadata({
      imageId: image._id,
      imageFilename: req.file.filename,
      imageName,
      uploadedBy,
      location
    });
    await metadata.save();

    res.status(201).json({message: 'Image uploaded successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const metadataList = await Metadata.find().sort({ dateUploaded: -1 });
    res.json(metadataList);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Review Controllers
const addReview = async (req, res) => {
  const { imageId, reviewerName, reviewText } = req.body;

  if (!imageId || !reviewerName || !reviewText) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const review = new Review({ imageId, reviewerName, reviewText });
    await review.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ imageId: req.params.imageId }).sort({ reviewTime: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = {
  loadHomePage,
  upload,
  uploadImage,
  getAllImages,
  addReview,
  getReviews
};
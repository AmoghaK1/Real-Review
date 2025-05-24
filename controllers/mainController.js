const mainService = require('../services/mainService');
const multer = require('multer');
const fs = require('fs');

// Multer setup
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
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValidType = allowedTypes.test(file.mimetype);
    if (isValidType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
});

// Load home page
const loadHomePage = (req, res) => {
  res.render('home', { title: 'Home page' });
};

// Upload image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mainService.uploadImage(req.file, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Upload Image Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all images
const getAllImages = async (req, res) => {
  try {
    const result = await mainService.getAllImages();
    res.status(200).json(result);
  } catch (error) {
    console.error('Get Images Error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Add review
const addReview = async (req, res) => {
  try {
    const { imageId, reviewerName, reviewText } = req.body;

    if (!imageId || !reviewerName || !reviewText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await mainService.addReview(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Add Review Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get reviews
const getReviews = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    const result = await mainService.getReviews(imageId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Get Reviews Error:', err);
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

const mainService = require('../services/mainService');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// AWS SDK v3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ✅ Multer S3 Storage Setup with AWS SDK v3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  })
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

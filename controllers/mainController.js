const mainService = require('../services/mainService');
const multer = require('multer');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multerS3 = require('multer-s3');
const path = require('path');

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
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, Date.now().toString() + ext);
    },
    contentType: function (req, file, cb) {
      // Set proper content type based on file extension
      let contentType = 'application/octet-stream';
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (['.jpg', '.jpeg'].includes(ext)) {
        contentType = 'image/jpeg';
      } else if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.gif') {
        contentType = 'image/gif';
      } else if (ext === '.webp') {
        contentType = 'image/webp';
      } else if (ext === '.heic' || ext === '.heif') {
        // Common mobile formats
        contentType = 'image/heif';
      }
      
      cb(null, contentType);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|heic|heif/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname && filetypes.test(extname)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
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

// Get presigned URL for image download
const getPresignedUrl = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    // Get the image data from the database or any other source
    const image = await mainService.getImageById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: image.key // Assuming 'key' is the field that stores the S3 object key
    });

    // Get presigned URL for the S3 object
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour

    res.status(200).json({ url });
  } catch (error) {
    console.error('Get Presigned URL Error:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
};

// Get image with pre-signed URL
const getImage = async (req, res) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res.status(400).json({ error: 'Image key required' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    res.redirect(url);
  } catch (error) {
    console.error('Get Image Error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

module.exports = {
  loadHomePage,
  upload,
  uploadImage,
  getAllImages,
  addReview,
  getReviews,
  getPresignedUrl,
  getImage
};

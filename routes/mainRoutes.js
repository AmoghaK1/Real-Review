const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

//load Home page
router.get('/', controller.loadHomePage);

// Image routes
router.post('/upload', (req, res, next) => {
  controller.upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(422).json({ 
        error: err.message || 'File upload failed' 
      });
    }
    next();
  });
}, controller.uploadImage);

router.get('/images', controller.getAllImages);

// Review routes
router.post('/add-review', controller.addReview);
router.get('/reviews/:imageId', controller.getReviews);

module.exports = router;
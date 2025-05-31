const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');
const multer = require('multer');

//load Home page
router.get('/', controller.loadHomePage);

// Image routes
router.post('/upload', (req, res) => {
  controller.upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific error (e.g., file too large)
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors (e.g., invalid file type)
      return res.status(400).json({ error: err.message });
    }

    // Proceed to the actual controller function
    controller.uploadImage(req, res);
  });
});



router.get('/images', controller.getAllImages);

// Review routes
router.post('/add-review', controller.addReview);
router.get('/reviews/:imageId', controller.getReviews);

module.exports = router;
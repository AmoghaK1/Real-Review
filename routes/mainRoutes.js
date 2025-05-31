const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

//load Home page
router.get('/', controller.loadHomePage);

// Image routes
router.post('/upload', controller.upload.single('image'), async (req, res) => {
  try {
    const result = await controller.uploadImage(req.file, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(400).json({ error: err.message || 'Something went wrong during upload.' });
  }
});

router.get('/images', controller.getAllImages);

// Review routes
router.post('/add-review', controller.addReview);
router.get('/reviews/:imageId', controller.getReviews);

module.exports = router;
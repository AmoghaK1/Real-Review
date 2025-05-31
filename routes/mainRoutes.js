const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

//load Home page
router.get('/', controller.loadHomePage);

// Image routes
router.post('/upload', controller.upload.single('image'), controller.uploadImage);


router.get('/images', controller.getAllImages);

// Review routes
router.post('/add-review', controller.addReview);
router.get('/reviews/:imageId', controller.getReviews);

module.exports = router;
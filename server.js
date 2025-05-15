// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/RealReview');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define image schema
const imageSchema = new mongoose.Schema({
  filename: String,
  uploadTime: { type: Date, default: Date.now }
});
const Image = mongoose.model('Image', imageSchema);

// Define metadata schema
const metadataSchema = new mongoose.Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  imageFilename: String,
  imageName: String,
  uploadedBy: String,
  location: String,
  dateUploaded: { type: Date, default: Date.now }
});
const Metadata = mongoose.model('Metadata', metadataSchema);

//reviews schema 
// Define review schema
const reviewSchema = new mongoose.Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  reviewerName: String,
  reviewText: String,
  reviewTime: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);


// Static public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// API to upload image + metadata
app.post('/upload', upload.single('image'), async (req, res) => {
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

  res.status(201).send('Image and metadata uploaded successfully');
});

// API to get all images with metadata
app.get('/images', async (req, res) => {
  try {
    const metadataList = await Metadata.find().sort({ dateUploaded: -1 });
    res.json(metadataList);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.post('/add-review', async (req, res) => {
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
});


app.get('/reviews/:imageId', async (req, res) => {
  try {
    const reviews = await Review.find({ imageId: req.params.imageId }).sort({ reviewTime: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

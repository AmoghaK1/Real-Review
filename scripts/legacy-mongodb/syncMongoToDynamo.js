require('dotenv').config();
const mongoose = require('mongoose');
const { createMetadata } = require('../models/Metadata');
const { createReview } = require('../models/Review');
const Metadata = require('../models/Metadata');
const Review = require('../models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const migrateMetadata = async () => {
  const metadataRecords = await Metadata.find();

  for (const record of metadataRecords) {
    const metadata = {
      imageId: record.imageId,
      imageFilename: record.imageFilename,
      imageName: record.imageName,
      uploadedBy: record.uploadedBy,
      location: record.location,
      dateUploaded: record.dateUploaded
    };

    await createMetadata(metadata);
    console.log(`Migrated metadata for imageId: ${record.imageId}`);
  }
};

const migrateReviews = async () => {
  const reviewRecords = await Review.find();

  for (const record of reviewRecords) {
    const review = {
      imageId: record.imageId,
      reviewerName: record.reviewerName,
      reviewText: record.reviewText,
      reviewTime: record.reviewTime
    };

    await createReview(review);
    console.log(`Migrated review for imageId: ${record.imageId}, reviewerName: ${record.reviewerName}`);
  }
};

const migrateData = async () => {
  try {
    console.log('Starting migration...');
    await migrateMetadata();
    await migrateReviews();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
  }
};

migrateData();

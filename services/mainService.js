const { createMetadata } = require('../models/Metadata');
const { createReview } = require('../models/Review');
const ImageDTO = require('../dtos/ImageDTO');
const ReviewDTO = require('../dtos/ReviewDTO');
const { queryItems, scanItems } = require('../utils/dynamoClient');


// Image Operations
const uploadImage = async (file, body) => {
  try {
    if (!file) throw new Error('No file uploaded.');
    const { imageName, uploadedBy, location } = body;

    // Save metadata directly to DynamoDB
    const metadata = {
      imageId: file.key, // Use file key as unique identifier
      imageFilename: file.key,
      imageName: imageName || 'Untitled',
      uploadedBy: uploadedBy || 'Anonymous',
      location: location || 'Unknown',
      dateUploaded: new Date().toISOString()
    };

    await createMetadata(metadata);

    return {
      message: 'Image uploaded successfully',
      imageId: file.key,
      filename: file.key,
      metadata: metadata
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};


const getAllImages = async () => {
  try {
    // Use scan to get all metadata items across all partitions
    const allItems = await scanItems('begins_with(SK, :sk)', { ':sk': 'METADATA#' });
    return allItems.map(ImageDTO.fromMetadata);
  } catch (error) {
    console.error('Error in getAllImages:', error);
    throw error;
  }
};


// Review Operations
const addReview = async ({ imageId, reviewerName, reviewText }) => {
  try {
    if (!imageId || !reviewerName || !reviewText) {
      throw new Error('Missing fields');
    }

    await createReview({ imageId, reviewerName, reviewText });

    return { message: 'Review added successfully' };
  } catch (error) {
    console.error('Error in addReview:', error);
    throw error;
  }
};

const getReviews = async (imageId) => {
  try {
    // Use DynamoDB query to get reviews for a specific imageId
    const reviews = await queryItems(`IMAGE#${imageId}`, { skBeginsWith: 'REVIEW#' });
    return reviews.map(ReviewDTO.fromReview);
  } catch (error) {
    console.error('Error in getReviews:', error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  addReview,
  getReviews
};

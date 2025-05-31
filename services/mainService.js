const Image = require('../models/Image');
const Metadata = require('../models/Metadata');
const Review = require('../models/Review');
const ImageDTO = require('../dtos/ImageDTO');
const ReviewDTO = require('../dtos/ReviewDTO');

// Image Operations
const uploadImage = async (file, body) => {
  try {
    if (!file) throw new Error('No file uploaded.');
    const { imageName, uploadedBy, location } = body;
    // With multer-s3 v3, use the ETag as the key if key is not available
    const fileKey = file.key || file.originalname;
    // Save basic image info
    const image = new Image({
      filename: file.key
    });
    await image.save();

    // In multer-s3 v3, the URL is accessed differently
    // Getting S3 URL from file object
    const fileUrl = file.location || `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    
    // Save metadata including full S3 URL
    const metadata = new Metadata({
      imageId: image._id,
      imageFilename: file.key,
      imageUrl: fileUrl,
      imageName: imageName || 'Untitled',
      uploadedBy: uploadedBy || 'Anonymous',
      location: location || 'Unknown'
    });await metadata.save();

    return { 
      message: 'Image uploaded successfully', 
      imageUrl: metadata.imageUrl,
      imageId: image._id,
      metadata: metadata 
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
   
    throw error;
  }
};


const getAllImages = async () => {
  try {
    const metadataList = await Metadata.find().sort({ dateUploaded: -1 });
    return metadataList.map(ImageDTO.fromMetadata);
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

    const review = new Review({ imageId, reviewerName, reviewText });
    await review.save();

    return { message: 'Review added successfully' };
  } catch (error) {
    console.error('Error in addReview:', error);
    throw error;
  }
};

const getReviews = async (imageId) => {
  try {
    const reviews = await Review.find({ imageId }).sort({ reviewTime: -1 });
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

const { putItem, getItem, queryItems, deleteItem } = require('../utils/dynamoClient');

// Create review
const createReview = async (review) => {
  const timestamp = new Date().toISOString();
  const item = {
    PK: `IMAGE#${review.imageId}`,
    SK: `REVIEW#${timestamp}`, // Use timestamp to make it unique
    reviewerName: review.reviewerName, // Add this field to store the reviewer name
    reviewText: review.reviewText,
    reviewTime: timestamp
  };

  await putItem(item);
  return item;
};

// Get review by imageId and timestamp (SK)
const getReview = async (imageId, sk) => {
  return await getItem(`IMAGE#${imageId}`, sk);
};

// Delete review by imageId and timestamp (SK)
const deleteReview = async (imageId, sk) => {
  return await deleteItem(`IMAGE#${imageId}`, sk);
};

module.exports = {
  createReview,
  getReview,
  deleteReview
};
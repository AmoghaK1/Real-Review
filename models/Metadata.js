const { putItem, getItem, deleteItem } = require('../utils/dynamoClient');

// Create metadata
const createMetadata = async (metadata) => {
  const item = {
    PK: `IMAGE#${metadata.imageId}`,
    SK: `METADATA#${metadata.imageFilename}`,
    imageName: metadata.imageName,
    uploadedBy: metadata.uploadedBy,
    location: metadata.location,
    dateUploaded: new Date().toISOString()
  };

  await putItem(item);
  return item;
};

// Get metadata by imageId and filename
const getMetadata = async (imageId, imageFilename) => {
  return await getItem(`IMAGE#${imageId}`, `METADATA#${imageFilename}`);
};

// Delete metadata
const deleteMetadata = async (imageId, imageFilename) => {
  return await deleteItem(`IMAGE#${imageId}`, `METADATA#${imageFilename}`);
};

module.exports = {
  createMetadata,
  getMetadata,
  deleteMetadata
};
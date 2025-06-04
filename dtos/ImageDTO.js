class ImageDTO {  static fromMetadata(metadata) {
    return {
      id: metadata._id,
      filename: metadata.imageFilename,
      name: metadata.imageName,
      uploadedBy: metadata.uploadedBy,
      location: metadata.location,
      dateUploaded: metadata.dateUploaded
    };
  }
}

module.exports = ImageDTO;

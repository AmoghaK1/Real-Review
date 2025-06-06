class ImageDTO {
  static fromMetadata(metadata) {
    // Extract imageId from PK (format: "IMAGE#imageId")
    const imageId = metadata.PK.replace('IMAGE#', '');
    // Extract filename from SK (format: "METADATA#filename")
    const filename = metadata.SK.replace('METADATA#', '');
    
    return {
      id: imageId,
      filename: filename,
      name: metadata.imageName,
      uploadedBy: metadata.uploadedBy,
      location: metadata.location,
      dateUploaded: metadata.dateUploaded
    };
  }
}
module.exports = ImageDTO;
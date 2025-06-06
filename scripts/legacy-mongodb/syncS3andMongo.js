const mongoose = require('mongoose');
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');
const Image = require('../models/Image');
const Metadata = require('../models/Metadata');
const Review = require('../models/Review');

require('dotenv').config(); // Load environment variables

const s3 = new S3Client({ region: process.env.AWS_REGION });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
};

const checkIfS3ObjectExists = async (key) => {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    }));
    return true;
  } catch (err) {
    if (err.name === 'NotFound') return false;
    console.error('S3 check error:', err);
    return false;
  }
};

const syncDeletedImages = async () => {
  await connectDB();
  const allMetadata = await Metadata.find();

  for (const meta of allMetadata) {
    const exists = await checkIfS3ObjectExists(meta.imageFilename);
    if (!exists) {
      console.log(`🧹 Cleaning up deleted image: ${meta.imageFilename}`);
      await Image.deleteOne({ _id: meta.imageId });
      await Metadata.deleteOne({ _id: meta._id });
      await Review.deleteMany({ imageId: meta.imageId });
    }
  }

  console.log('✅ Sync complete');
  mongoose.disconnect();
};

if (require.main === module) {
  syncDeletedImages();
}

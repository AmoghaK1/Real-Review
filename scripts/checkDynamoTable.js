require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB v3 client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create DocumentClient for easier interaction
const docClient = DynamoDBDocumentClient.from(client);

// 🚀 INSERT IMAGE
const insertImage = async () => {
  const params = {
    TableName: 'RealReview',
    Item: {
      PK: 'IMAGE#123',
      SK: 'IMAGE#123',
      entityType: 'Image',
      filename: 'photo.jpg',
      uploadTime: new Date().toISOString(),
    },
  };
  try {
    await docClient.send(new PutCommand(params));
    console.log('✅ Image inserted');
  } catch (err) {
    console.error('Image insert error:', err);
  }
};

// 🚀 INSERT METADATA
const insertMetadata = async () => {
  const params = {
    TableName: 'RealReview',
    Item: {
      PK: 'IMAGE#123',
      SK: 'METADATA',
      entityType: 'Metadata',
      imageName: 'Sunset View',
      uploadedBy: 'Amogha',
      location: 'Goa',
      dateUploaded: new Date().toISOString(),
    },
  };
  try {
    await docClient.send(new PutCommand(params));
    console.log('✅ Metadata inserted');
  } catch (err) {
    console.error('Metadata insert error:', err);
  }
};

// 🚀 INSERT REVIEW
const insertReview = async () => {
  const params = {
    TableName: 'RealReview',
    Item: {
      PK: 'IMAGE#123',
      SK: `REVIEW#${new Date().toISOString()}`,
      entityType: 'Review',
      reviewerName: 'John',
      reviewText: 'Beautiful shot!',
      reviewTime: new Date().toISOString(),
    },
  };
  try {
    await docClient.send(new PutCommand(params));
    console.log('✅ Review inserted');
  } catch (err) {
    console.error('Review insert error:', err);
  }
};

// 🔁 Run all inserts sequentially
(async () => {
  await insertImage();
  await insertMetadata();
  await insertReview();
})();

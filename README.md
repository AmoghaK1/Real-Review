# Real-Review

A modern image review platform built with Node.js, Express, and AWS services.

## Architecture

- **Backend**: Node.js with Express.js
- **Database**: Amazon DynamoDB
- **File Storage**: Amazon S3
- **Frontend**: Vanilla JavaScript with EJS templating

## Features

- Image upload to S3 with automatic resizing
- Image metadata management
- Review system for uploaded images
- Real-time image gallery
- Responsive web design

## Tech Stack

- **Database**: DynamoDB (NoSQL)
- **Storage**: AWS S3
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Authentication**: AWS SDK v3
- **File Upload**: Multer with S3 integration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   AWS_REGION=your-region
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_BUCKET_NAME=your-s3-bucket
   PORT=3000
   ```

3. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

- `GET /` - Home page
- `POST /upload` - Upload image
- `GET /images` - Get all images
- `GET /image/:key` - Get image by key
- `POST /add-review` - Add review
- `GET /reviews/:imageId` - Get reviews for image

## Migration Notes

This application has been migrated from MongoDB to DynamoDB for better scalability and AWS integration. Legacy MongoDB scripts can be found in `scripts/legacy-mongodb/`.
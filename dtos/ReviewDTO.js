class ReviewDTO {
  static fromReview(review) {
    return {
      id: review.SK, // Use SK as unique identifier for the review
      reviewer: review.reviewerName,
      text: review.reviewText,
      time: review.reviewTime
    };
  }
}

module.exports = ReviewDTO;

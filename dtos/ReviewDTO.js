class ReviewDTO {
  static fromReview(review) {
    return {
      id: review._id,
      reviewer: review.reviewerName,
      text: review.reviewText,
      time: review.reviewTime
    };
  }
}

module.exports = ReviewDTO;

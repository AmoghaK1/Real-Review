// Handle file selection
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        fileNameDisplay.textContent = this.files[0].name;
      } else {
        fileNameDisplay.textContent = 'No file selected';
      }
    });
    
    // Handle drag and drop
    const fileLabel = document.querySelector('.file-input-label');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      fileLabel.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      fileLabel.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      fileLabel.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      fileLabel.style.backgroundColor = 'rgba(77, 182, 172, 0.2)';
      fileLabel.style.borderColor = 'var(--primary)';
    }
    
    function unhighlight() {
      fileLabel.style.backgroundColor = 'rgba(77, 182, 172, 0.05)';
      fileLabel.style.borderColor = 'var(--primary-light)';
    }
    
    fileLabel.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files && files[0]) {
        fileInput.files = files;
        fileNameDisplay.textContent = files[0].name;
      }
    }

    // Handle image upload form submission
document.getElementById('upload-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(async response => {
    const data = await response.json(); // parse error message if any

    if (!response.ok) {
      // Show backend-sent error if exists
      throw new Error(data.error || 'Upload failed');
    }

    // Show success message
    alert(data.message || 'Image uploaded successfully!');

    // Reset form
    this.reset();
    document.getElementById('file-name').textContent = 'No file selected';

    // Refresh gallery
    fetch('/images')
      .then(res => res.json())
      .then(updateGallery)
      .catch(error => console.error('Error refreshing gallery:', error));
  })
  .catch(error => {
    console.error('Upload error:', error);
    alert('Error uploading image: ' + error.message); // shows the actual reason
  });
});

    // Function to update gallery with images
    function updateGallery(data) {
      const imagesContainer = document.getElementById('images');
      imagesContainer.innerHTML = '';

      if (data.length === 0) {
        imagesContainer.innerHTML = `
          <div class="empty-gallery">
            <p>No images uploaded yet. Be the first to share!</p>
          </div>
        `;
        return;
      }

      data.forEach(img => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';

        const formattedDate = new Date(img.dateUploaded).toLocaleString();
          imageCard.innerHTML = `
          <div class="image-wrapper">
            <img src="/image/${img.filename}" alt="${img.name}" />
          </div>
          <div class="image-info">
            <div class="image-title">${img.name}</div>
            <div class="image-meta">Uploaded by: ${img.uploadedBy}, Location: ${img.location}</div>
            <div class="image-date">Uploaded at: ${formattedDate}</div>

            <div class="review-section">
              <h4>Reviews:</h4>
              <div class="review-list" id="reviews-${img.id}">Loading reviews...</div>

              <form class="review-form" data-imageid="${img.id}">
                <input type="text" name="reviewerName" placeholder="Your Name" required />
                <textarea name="reviewText" placeholder="Write a review..." required></textarea>
                <button type="submit">Submit Review</button>
              </form>
            </div>
          </div>
        `;

        imagesContainer.appendChild(imageCard);

        // Fetch and display reviews for this image
        fetch(`/reviews/${img.id}`)
          .then(res => res.json())
          .then(reviews => {
            const reviewList = document.getElementById(`reviews-${img.id}`);
            if (reviews.length === 0) {
              reviewList.innerHTML = '<p>No reviews yet.</p>';
            } else {
              reviewList.innerHTML = reviews.map(r => `
                <div class="review">
                  <strong>${r.reviewer}</strong> <em>${new Date(r.time).toLocaleString()}</em>
                  <p>${r.text}</p>
                </div>
              `).join('');
            }
          })
          .catch(err => {
            console.error(`Error loading reviews for ${img.id}:`, err);
            const reviewList = document.getElementById(`reviews-${img.id}`);
            reviewList.innerHTML = '<p>Error loading reviews.</p>';
          });
      });
    }

    // Load images when page loads
    window.addEventListener('DOMContentLoaded', () => {
      fetch('/images')
        .then(res => res.json())
        .then(updateGallery)
        .catch(error => {
          console.error('Error loading images:', error);
          const imagesContainer = document.getElementById('images');
          imagesContainer.innerHTML = `
            <div class="empty-gallery">
              <p>Error loading images. Please try again later.</p>
            </div>
          `;
        });
    });

    // Handle review form submission
    document.addEventListener('submit', function (e) {
      if (e.target.classList.contains('review-form')) {
        e.preventDefault();

        const form = e.target;
        const imageId = form.dataset.imageid;
        const reviewerName = form.reviewerName.value;
        const reviewText = form.reviewText.value;

        fetch('/add-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId, reviewerName, reviewText })
        })
        .then(res => res.json())
        .then(result => {
          alert(result.message || 'Review submitted!');
          form.reset();
          return fetch(`/reviews/${imageId}`);
        })
        .then(res => res.json())
        .then(reviews => {
          const reviewList = document.getElementById(`reviews-${imageId}`);
          if (reviews.length === 0) {
            reviewList.innerHTML = '<p>No reviews yet.</p>';
          } else {
            reviewList.innerHTML = reviews.map(r => `
              <div class="review">
                <strong>${r.reviewer}</strong> <em>${new Date(r.time).toLocaleString()}</em>
                <p>${r.text}</p>
              </div>
            `).join('');
          }
        })
        .catch(err => {
          console.error('Review error:', err);
          alert('Failed to submit review');
        });
      }
    });
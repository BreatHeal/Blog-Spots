import React, { useState } from 'react';
import axios from 'axios';
import '../css/style.css';

const AddBlogs = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const isConfirmed = window.confirm('Are you sure you want to add this blog?');
  
    if (isConfirmed) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('summary', summary); 
      if (image) {
        formData.append('image', image);
      }
  
      axios.post('https://blog-spots-service.onrender.com/api/blogs', formData)
        .then(response => {
          console.log('Blog added successfully:', response.data);
          alert('Blog added successfully');
        })
        .catch(error => {
          console.error('Error adding blog:', error);
          alert('Error adding blog. Please try again later.');
        });
    }
  };

  return (
    <div className="blog-container">
      <div className="admin-content">
        <h3>Add Blog</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <br />
          <label>
            Summary:
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </label>
          <br />
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <br />
          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          <br />
          <button type="submit">Add Blog</button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;

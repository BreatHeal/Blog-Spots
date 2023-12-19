import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../css/style.css';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get('http://localhost:3001/api/blogs')
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setError('Error fetching blogs. Please try again later.');
        setLoading(false);
      });
  }, []);

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer.data);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  
  const updateBlogsAfterDeletion = (blogId) => {
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.blog_id !== blogId));
  };

  //Editng
  const handleEditClick = (blogId) => {
    navigate(`/edit/${blogId}`);
  };

  //Deleting 
  const handleDeleteClick = (blogId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this blog?');

    if (isConfirmed) {
      axios.delete(`http://localhost:3001/api/blogs/${blogId}`)
        .then(response => {
          console.log('Blog deleted successfully:', response.data);
          alert('Blog deleted successfully');
          updateBlogsAfterDeletion(blogId);
        })
        .catch(error => {
          console.error('Error deleting blog:', error);
          alert('Error deleting blog. Please try again later.');
        });
    }
  };

  return (
    <div className="blog-container">
      <h2>Recent Blogs</h2>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="blogs">
        {!loading && !error && blogs.map(blog => (
          <div key={blog.blog_id} className="blog-item">
            <Link to={`/blog/${blog.blog_id}`}>
              <h3>{blog.title}</h3>
              {blog.image && (
                <img
                  className="blog-image"
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(blog.image)}`}
                  alt={`Image for ${blog.title}`}
                />
              )}
            </Link>
            <p>{blog.summary}</p>
            <div className="blog-actions">
              <button
                className="action-button"
                onClick={() => handleEditClick(blog.blog_id)}
              >
                Edit
              </button>
              <button
                className="action-button"
                onClick={() => handleDeleteClick(blog.blog_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlogs;

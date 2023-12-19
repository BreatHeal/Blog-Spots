// RecentBlogs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/style.css';

const RecentBlogs = () => {
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/blogs') // Adjust the endpoint as needed
            .then(response => {
                setRecentBlogs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching recent blogs:', error);
                setError('Error fetching recent blogs. Please try again later.');
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

    return (
        <div className="home-container">
          <div className="recent-blogs-content">
            <h3>Recent Blogs</h3>
            {loading && <p>Loading...</p>}
      
            {error && <p style={{ color: 'red' }}>{error}</p>}
      
            <div className="home-recent-blogs">
              {!loading && !error && recentBlogs.map(blog => (
                <div key={blog.blog_id} className="home-blog-item">
                  <Link to={`/blog/${blog.blog_id}`}>
                    <h3>{blog.title}</h3>
                    {blog.image && (
                      <img className="home-blog-image"
                        src={`data:image/jpeg;base64,${arrayBufferToBase64(blog.image)}`}
                        alt={`Image for ${blog.title}`}
                      />
                    )}
                  </Link>
                  <p>{blog.summary}</p>
                  <Link to={`/blog/${blog.blog_id}`}>
                    <button className="-home-view-more-button">View More</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      
};

export default RecentBlogs;

// ManageComments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/comments')
      .then(response => {
        setComments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        setError('Error fetching comments. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (commentId) => {
    // Handle delete action, you can show a confirmation modal and make a delete request
    console.log('Delete comment:', commentId);
  };

  return (
    <div className="admin-content">
      <h3>Manage Comments</h3>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {!loading && !error && comments.map(comment => (
          <li key={comment.comment_id}>
            {comment.text}
            <button
              className="action-button"
              onClick={() => handleDeleteClick(comment.comment_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageComments;

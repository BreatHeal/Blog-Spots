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
    if (window.confirm('Are you sure you want to delete this comment?')) {
      axios.delete(`http://localhost:3001/api/comments/${commentId}`)
        .then(response => {
          setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
          console.log('Comment deleted successfully:', response.data.message);
        })
        .catch(error => {
          console.error('Error deleting comment:', error);
        });
    }
  };

  return (
    <div className="blog-container">
      <div className="admin-content">
        <h3>Manage Comments</h3>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {comments.length > 0 ? (
          <table className="comment-table">
            <thead>
              <tr>
                <th>Comment Text</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && comments.map(comment => (
                <tr key={comment.comment_id}>
                  <td>{comment.text}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDeleteClick(comment.comment_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageComments;

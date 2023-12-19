// RecentComments.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext.jsx';
import '../css/style.css';

const RecentComments = () => {
  const { user } = useUserContext();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/users/${user.user_id}/comments`)
      .then(response => {
        console.log(response.data);
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching recent comments:', error);
      });
  }, [user.user_id]);

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/api/comments/${commentId}`);
      console.log('Comment deleted successfully');
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="recent-comments-container">
        <h1>Recent Comments</h1>
        {comments.length > 0 ? (
          <table className="comment-table">
            <thead>
              <tr>
                <th>Blog Title</th>
                <th>Comment Text</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment.comment_id}>
                  <td>{comment.blog.title}</td>
                  <td>{comment.text}</td>
                  <td>
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent comments.</p>
        )}
      </div>
    </div>
  );
};

export default RecentComments;

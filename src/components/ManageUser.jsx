// ManageUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:3001/api/users/${userId}`)
        .then(response => {
  
          setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
          console.log('User deleted successfully:', response.data.message);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  return (
    <div className="blog-container">
      <div className="admin-content">
        <h3>Manage Users</h3>
  
        {loading && <p>Loading...</p>}
  
        {error && <p style={{ color: 'red' }}>{error}</p>}
  
        {users.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.username}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDeleteClick(user.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

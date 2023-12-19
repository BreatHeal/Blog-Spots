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
    // Handle delete action, you can show a confirmation modal and make a delete request
    console.log('Delete user:', userId);
  };

  return (
    <div className="admin-content">
      <h3>Manage Users</h3>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {!loading && !error && users.map(user => (
          <li key={user.user_id}>
            {user.username}
            <button
              className="action-button"
              onClick={() => handleDeleteClick(user.user_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;

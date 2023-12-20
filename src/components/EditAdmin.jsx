import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAdmin = () => {
  const [adminDetails, setAdminDetails] = useState({});
  const [updatedAdmin, setUpdatedAdmin] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admins/');
        setAdminDetails(response.data);
        // Set initial state of updatedAdmin with current admin details
        setUpdatedAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error.response?.data || error.message);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAdmin = async () => {
    try {
      if (updatedAdmin.newPassword !== updatedAdmin.confirmNewPassword) {
        setAlertMessage('New password and confirm password do not match');
        return;
      }
      const { username, email, newPassword } = updatedAdmin;
      
      const updatedAdminData = newPassword
        ? { username, email, password: newPassword }
        : { username, email };
  
      await axios.put(`http://localhost:3001/api/users/${adminDetails.user_id}`, updatedAdminData);
  
      setAlertMessage('Admin updated successfully');
      setUpdatedAdmin({ username: '', email: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      console.error('Error updating admin details:', error.response?.data || error.message);
      setAlertMessage('Error updating admin details');
    }
  };

  return (
    <div className="blog-container">
      <h2>Admin Account Details</h2>
      <div>
        <p>Username: {adminDetails.username || ''}</p>
        <p>Email: {adminDetails.email || ''}</p>

        {alertMessage && <div className={alertMessage.includes('Error') ? 'error' : 'success'}>{alertMessage}</div>}

        <h3>Update Admin Details</h3>
        <div>
          <label htmlFor="username">New Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={updatedAdmin.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">New Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={updatedAdmin.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={updatedAdmin.newPassword}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={updatedAdmin.confirmNewPassword}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleUpdateAdmin}>Update Admin</button>
      </div>
    </div>
  );
};

export default ViewAdmin;

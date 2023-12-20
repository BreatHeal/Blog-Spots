import React, { useState } from 'react';
import axios from 'axios';

const EditAccount = ({ user }) => {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match. Please try again.');
      return;
    }

    try {
      const updatedUser = { ...editedUser };

      if (newPassword !== '') {
        updatedUser.password = newPassword;
      }

      const response = await axios.put(`http://localhost:3001/api/users/${user.user_id}`, updatedUser);

      alert('User updated successfully');
      console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user. Server responded with:', error.response?.data || error.message);
      alert('Error updating user. Please try again.');
    }
  };

  return (
    <div className="home-container">
      <h2>Edit Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="first_name" value={editedUser.first_name} onChange={handleInputChange} />
        </label>
        <label>
          Middle Name:
          <input type="text" name="middle_name" value={editedUser.middle_name} onChange={handleInputChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="last_name" value={editedUser.last_name} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} />
        </label>

        <label>
          New Password:
          <input type="password" name="newPassword" value={newPassword} onChange={handlePasswordChange} />
        </label>
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" value={confirmPassword} onChange={handlePasswordChange} />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditAccount;

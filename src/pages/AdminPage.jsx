import React, { useState } from 'react';
import ManageBlogs from '../components/ManageBlog';
import ManageComments from '../components/ManageComment';
import ManageUsers from '../components/ManageUser';
import AddBlogs from '../components/AddBlog';
import EditAdmin from '../components/EditAdmin';
import '../css/style.css';

const AdminPage = () => {
  const [activeContent, setActiveContent] = useState('manageBlogs');

  const handleNavItemClick = (content) => {
    setActiveContent(content);
  };

  const handleGoBack = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      window.history.back();
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>BlogSpots</h1>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('manageBlogs')}>Manage Blogs</button>
        </div>
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('addBlogs')}>Add Blog</button>
        </div>
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('manageComments')}>Manage Comments</button>
        </div>
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('manageUsers')}>Manage Users</button>
        </div>
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('editAdmin')}>Edit Admin</button>
        </div>
        <div className="nav-item">
          <button onClick={handleGoBack}>Log Out</button>
        </div>
      </div>

      {activeContent === 'addBlogs' && <AddBlogs />}
      {activeContent === 'manageBlogs' && <ManageBlogs />}
      {activeContent === 'manageComments' && <ManageComments />}
      {activeContent === 'manageUsers' && <ManageUsers />}
      {activeContent === 'editAdmin' && <EditAdmin />}
    </div>
  );
};

export default AdminPage;

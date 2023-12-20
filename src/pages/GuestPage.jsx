import React, { useState } from 'react';
import RecentBlogs from '../components/RecentBlog';
import { useNavigate } from 'react-router-dom';

const GuestHome = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState('recentBlogs');

  const handleNavItemClick = (content) => {
    setActiveContent(content);
  };

  const handleGoBack = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>MingleMingle</h1>
          <p>Welcome, Guest!</p>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('recentBlogs')}>Home</button>
        </div>
        <div className="nav-item">
          <button onClick={handleGoBack}>Log Out</button>
        </div>
      </div>

      {activeContent === 'recentBlogs' && <RecentBlogs />}
    </div>
  );
};

export default GuestHome;
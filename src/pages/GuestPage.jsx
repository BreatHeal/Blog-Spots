import React, { useState } from 'react';
import RecentBlogs from '../components/RecentBlog';

const GuestHome = () => {
  const [activeContent, setActiveContent] = useState('recentBlogs');

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
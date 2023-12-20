import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentBlogs from '../components/RecentBlog';

const StartPage = () => {
  const [activeContent, setActiveContent] = useState('recentBlogs');
  const navigate = useNavigate();

  const handleNavItemClick = (content) => {
    setActiveContent(content);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>MingleMingle</h1>
          <p>Welcome!</p>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('recentBlogs')}>Home</button>
        </div>
        <div className="nav-item">
          <button onClick={handleGoToLogin}>Log In</button>
        </div>
      </div>

      {activeContent === 'recentBlogs' && <RecentBlogs />}
    </div>
  );
};

export default StartPage;

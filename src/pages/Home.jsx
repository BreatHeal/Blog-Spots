import RecentBlogs from '../components/RecentBlog';
import EditAccount from '../components/EditAccount';
import RecentComments from '../components/RecentComment';

import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';

const Home = () => {
  const { user } = useUserContext();
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

  const isGuest = user && user.role === 'Guest';

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>BlogSpots</h1>
          <p>
            {user ? `Welcome, ${user.first_name} ${user.middle_name} ${user.last_name}!` : 'Welcome, Guest!'}
          </p>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-item">
          <button onClick={() => handleNavItemClick('recentBlogs')}>Home</button>
        </div>
        {user && (
          <div className="nav-item">
            <button onClick={() => handleNavItemClick('recentComments')}>Your Recent Comments</button>
          </div>
        )}
        {user && (
          <div className="nav-item">
            <button onClick={() => handleNavItemClick('editAccount')}>Edit Account</button>
          </div>
        )}
        <div className="nav-item">
          <button onClick={handleGoBack}>Log Out</button>
        </div>
      </div>

      {activeContent === 'recentBlogs' && <RecentBlogs />}
      {activeContent === 'recentComments' && user && <RecentComments />}
      {activeContent === 'editAccount' && user && <EditAccount user={user} />}
    </div>
  );
};

export default Home;

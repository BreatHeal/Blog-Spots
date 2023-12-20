import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext, UserProvider } from '../context/UserContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { setUserContext } = useUserContext();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const setUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUserContext(userData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (guest = false) => {
    try {
      let response;
      if (guest) {
        // Simulate guest login
        response = await axios.post('http://localhost:3001/api/login', {
          username: 'Guest',
          password: 'Guest',
        });
      } else {
        // Regular login
        response = await axios.post('http://localhost:3001/api/login', formData);
      }

      console.log('Login response:', response.data);

      const userRole = response.data.role;

      switch (userRole) {
        case 'User':
          setUser(response.data);
          navigate('/home');
          break;
        case 'Admin':
          setUser(response.data);
          navigate('/admin');
          break;
        case 'Guest':
          setUser(response.data);
          navigate('/guest');
          break;
        default:
          console.error('Unknown role:', userRole);
      }
    } catch (error) {
      console.error('Error submitting login form:', error);
      alert('Error logging in. Check Credentials. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', formData);
      console.log('Login response:', response.data);

      const userRole = response.data.role;

      switch (userRole) {
        case 'User':
          setUser(response.data);
          navigate('/home');
          break;
        case 'Admin':
          setUser(response.data);
          navigate('/admin');
          break;
        case 'Guest':
          setUser(response.data);
          navigate('/guest');
          break;
        default:
          console.error('Unknown role:', userRole);
      }
    } catch (error) {
      console.error('Error submitting login form:', error);
      alert('Error logging in. Check Credentials. Please try again.');
    }
  };

  const handleGoToStart = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>BlogSpots</h1>
        </div>
      </div>

      <div className="login-container">
        <button className="start-button" type="button" onClick={handleGoToStart}>
          View Blogs Now
        </button>
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          <p>Log in as guest</p>
          <button className="login-button" type="button" onClick={() => handleLogin(true)}>
            Login as Guest
          </button>
        </form>
        <p className="link-register">
          Haven't registered? <Link to="/register">Register here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;

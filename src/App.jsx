import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogViewMore from './components/BlogViewMore';
import EditBlog from './components/EditBlog';
import React, { useState } from 'react';
import GuestHome from './pages/GuestPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login user={user}/>} />
        <Route path="/home" element={<Home  />} />
        <Route path="/guest" element={<GuestHome />} />

        <Route path="/blog/:id" element={<BlogViewMore />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/edit/:id" element={<EditBlog />} />
      </Routes>
    </Router>
  );
}

export default App;

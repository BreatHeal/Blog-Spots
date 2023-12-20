const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Registering a User
app.post('/api/register', (req, res) => {
  const { firstName, middleName, lastName, email, username, password } = req.body;

  const query = 'INSERT INTO users (first_name, middle_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [firstName, middleName, lastName, email, username, password], (error, results) => {
    if (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'User registered successfully' });
    }
  });
});

//login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (results.length > 0) {
        const user = results[0];
        res.json({
          user_id: user.user_id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          username: user.username,
          role: user.role,
          email: user.email
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  );
});

// Add a new blog
app.post('/api/blogs', upload.single('image'), (req, res) => {
  const { title, summary, content } = req.body;
  let image = null;

  if (req.file) {
    const imageBuffer = req.file.buffer.toString('base64');
    image = Buffer.from(imageBuffer, 'base64');
  }

  const query = 'INSERT INTO blogs (title, summary, content, image) VALUES (?, ?, ?, ?)';

  db.query(query, [title, summary, content, image], (error, results) => {
    if (error) {
      console.error('Error adding blog:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Blog added successfully', blogId: results.insertId });
    }
  });
});

//Deleting a blog
app.delete('/api/blogs/:id', (req, res) => {
  const blogId = req.params.id;

  const checkBlogQuery = 'SELECT * FROM blogs WHERE blog_id = ?';
  db.query(checkBlogQuery, [blogId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking blog:', checkError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (checkResults.length === 0) {
        res.status(404).json({ error: 'Blog not found' });
      } else {

        const deleteBlogQuery = 'DELETE FROM blogs WHERE blog_id = ?';
        db.query(deleteBlogQuery, [blogId], (deleteError) => {
          if (deleteError) {
            console.error('Error deleting blog:', deleteError);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Blog deleted successfully' });
          }
        });
      }
    }
  });
});

// Update a blog by ID
app.put('/api/blogs/content/:id', (req, res) => {
  const blogId = req.params.id;
  const { title, summary, content } = req.body;

  const updateQuery = 'UPDATE blogs SET title = ?, summary = ?, content = ? WHERE blog_id = ?';

  db.query(updateQuery, [title, summary, content, blogId], (error, results) => {
    if (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Blog updated successfully' });
    }
  });
});

// Updating blog image
app.put('/api/blogs/image/:id', upload.single('image'), (req, res) => {
  const blogId = req.params.id;
  let image = null;

  if (req.file) {
    const imageBuffer = req.file.buffer.toString('base64');
    image = Buffer.from(imageBuffer, 'base64');
  }

  const updateImageQuery = 'UPDATE blogs SET image = ? WHERE blog_id = ?';

  db.query(updateImageQuery, [image, blogId], (error, results) => {
    if (error) {
      console.error('Error updating blog image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Blog image updated successfully' });
    }
  });
});

// Fetch all blogs
app.get('/api/blogs', (req, res) => {
  const query = 'SELECT * FROM blogs';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific blog by ID
app.get('/api/blogs/:id', (req, res) => {
  const blogId = req.params.id;
  const query = 'SELECT * FROM blogs WHERE blog_id = ?';

  db.query(query, [blogId], (error, results) => {
    if (error) {
      console.error('Error fetching blog by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Blog not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});

// Fetch comments for a specific blog by ID
app.get('/api/blogs/:id/comments', (req, res) => {
  const blogId = req.params.id;

  const query = 'SELECT comments.*, users.user_id, users.first_name, users.middle_name, users.last_name, users.email, users.username, users.password, users.role' +
    ' FROM comments' +
    ' JOIN users ON comments.user_id = users.user_id' +
    ' WHERE blog_id = ?';

  db.query(query, [blogId], (error, results) => {
    if (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const commentsWithUser = results.map(comment => ({
        id: comment.id,
        text: comment.text,
        user: {
          id: comment.user_id,
          first_name: comment.first_name,
          middle_name: comment.middle_name,
          last_name: comment.last_name,
          email: comment.email,
          username: comment.username,
          role: comment.role,
        },
      }));

      res.json(commentsWithUser);
    }
  });
});

// Add a new comment to a specific blog by ID
app.post('/api/blogs/:id/comments', (req, res) => {
  const blogId = req.params.id;
  const { text, userId } = req.body;

  if (!text || !userId) {
    res.status(400).json({ error: 'Comment text and user ID are required' });
    return;
  }

  const query = 'INSERT INTO comments (blog_id, user_id, text) VALUES (?, ?, ?)';

  db.query(query, [blogId, userId, text], (error, results) => {
    if (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Comment added successfully', commentId: results.insertId });
    }
  });
});

// Fetch all comments
app.get('/api/comments', (req, res) => {
  const query = 'SELECT * FROM comments';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Fetch recent comments for a user
app.get('/api/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT comments.comment_id, comments.text, blogs.title AS blog_title
    FROM comments
    JOIN blogs ON comments.blog_id = blogs.blog_id
    WHERE user_id = ?`;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching recent comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const commentsWithBlog = results.map(comment => ({
        id: comment.comment_id,
        text: comment.text,
        blog: {
          title: comment.blog_title,
        },
      }));

      res.json(commentsWithBlog);
    }
  });
});

// Delete a comment by ID
app.delete('/api/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;

  const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';

  db.query(deleteQuery, [commentId], (error) => {
    if (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Comment deleted successfully' });
    }
  });
});

//fetch all users
app.get('/api/users', (req, res) => {
  const query = "SELECT * FROM users WHERE role = 'User'";

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// update user information by id
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;

  const updateQuery = 'UPDATE users SET ? WHERE user_id = ?';

  db.query(updateQuery, [updatedUser, userId], (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  });
});

// delete a user by ID
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const deleteQuery = 'DELETE FROM users WHERE user_id = ?';

  db.query(deleteQuery, [userId], (error) => {
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

// Update user or admin information by id
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;

  const updateQuery = 'UPDATE users SET ? WHERE user_id = ? AND role = ?';

  db.query(updateQuery, [updatedUser, userId, 'Admin'], (error, results) => {
    if (error) {
      console.error('Error updating admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Admin not found' });
      } else {
        res.json({ message: 'Admin updated successfully' });
      }
    }
  });
});

// Fetch admin details
app.get('/api/admins', (req, res) => {
  const query = "SELECT * FROM users WHERE role = 'Admin'";

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching admin details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Admin not found' });
      } else {
        res.json(results[0]); // Assuming there's only one admin
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

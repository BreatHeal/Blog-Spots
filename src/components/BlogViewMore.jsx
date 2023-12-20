import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../context/UserContext.jsx';
import '../css/style.css';

const BlogViewMore = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
            })
            .catch(error => {
                console.error('Error fetching blog details:', error);
                setError('Error fetching blog details. Please try again later.');
            });

        axios.get(`http://localhost:3001/api/blogs/${id}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
                setError('Error fetching comments. Please try again later.');
            });
    }, [id]);

    const arrayBufferToBase64 = buffer => {
        let binary = '';
        let bytes = new Uint8Array(buffer.data);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleCommentSubmit = async () => {
        
        if (!user || !user.user_id) {
            const shouldLogin = window.confirm('You need to log in to add a comment. Do you want to log in now?');

            if (shouldLogin) {
                navigate('/login');
            }

            return;
        }

        try {
            const response = await axios.post(`http://localhost:3001/api/blogs/${id}/comments`, {
                text: newComment,
                userId: user.user_id,
            });

            const newCommentData = response.data;

            const updatedComment = {
                id: newCommentData.commentId,
                text: newCommentData.text,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
            };

            const updatedCommentsResponse = await axios.get(`http://localhost:3001/api/blogs/${id}/comments`);
            const updatedComments = updatedCommentsResponse.data;

            setComments(updatedComments);
            setNewComment('');
            alert('Comment added successfully!');
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Error adding comment. Please try again later.');
        }
    };


    return (
        <div>
            <div className="top-bar">
                <div className="top-bar-content">
                    <h1>BlogSpots</h1>
                </div>
            </div>
            <div className="blog-details-container">
                {blog ? (
                    <>
                        <h1>{blog.title}</h1>
                        {blog.image && (
                            <img
                                className="blog-image"
                                src={`data:image/jpeg;base64,${arrayBufferToBase64(blog.image)}`}
                                alt={`Image for ${blog.title}`}
                            />
                        )}

                        <p>{blog.content}</p>

                        <h2>Comments</h2>
                        <ul className="comment-list">
                            {comments.map(comment => (
                                <li key={comment.id} className="comment-item">
                                    <p>User: {comment.user.first_name} {comment.user.last_name}</p>
                                    <p></p>
                                    <p>Comment: {comment.text}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="comment-form">
                            <textarea
                                rows="4"
                                cols="50"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="comment-input"
                            />
                            <br />
                            <button onClick={handleCommentSubmit} className="comment-submit-btn">Add Comment</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default BlogViewMore;

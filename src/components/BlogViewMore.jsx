import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../context/UserContext.jsx';
import '../css/style.css';

const BlogViewMore = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Fetch blog details by ID
        axios.get(`http://localhost:3001/api/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
            })
            .catch(error => {
                console.error('Error fetching blog details:', error);
            });

        // Fetch comments for the blog
        axios.get(`http://localhost:3001/api/blogs/${id}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
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
        try {
            const response = await axios.post(`http://localhost:3001/api/blogs/${id}/comments`, {
                text: newComment,
                userId: user.user_id,
            });

            const newCommentData = response.data;

            setComments(prevComments => [
                ...prevComments,
                {
                    id: newCommentData.commentId,
                    text: newCommentData.text,
                    user: {
                        user_id: newCommentData.userId,
                    },
                },
            ]);

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
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
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default BlogViewMore;

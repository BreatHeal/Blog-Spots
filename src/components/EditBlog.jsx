import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';

const EditBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedSummary, setEditedSummary] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedImage, setEditedImage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
                setEditedTitle(response.data.title);
                setEditedSummary(response.data.summary);
                setEditedContent(response.data.content);
            })
            .catch(error => {
                console.error('Error fetching blog details:', error);
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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editedTitle);
            formData.append('summary', editedSummary);
            formData.append('content', editedContent);
            if (editedImage) {
                formData.append('image', editedImage);
            }

            await axios.put(`http://localhost:3001/api/blogs/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setBlog(prevBlog => ({
                ...prevBlog,
                title: editedTitle,
                summary: editedSummary,
                content: editedContent,
                image: editedImage ? URL.createObjectURL(editedImage) : prevBlog.image,
            }));

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating blog content:', error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTitle(blog.title);
        setEditedSummary(blog.summary);
        setEditedContent(blog.content);
        setEditedImage(null);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setEditedImage(selectedImage);
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
                        <h1>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                            ) : (
                                blog.title
                            )}
                        </h1>
                        {blog.image && (
                            <img
                                className="blog-image"
                                src={`data:image/jpeg;base64,${arrayBufferToBase64(blog.image)}`}
                                alt={`Image for ${blog.title}`}
                            />
                        )}
    
                        <p>
                            {isEditing ? (
                                <textarea
                                    rows="4"
                                    cols="50"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                            ) : (
                                blog.content
                            )}
                        </p>

                        <p>
                            Summary: 
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                />
                            ) : (
                                blog.summary
                            )}
                        </p>

                        {isEditing && (
                            <div>
                                <label htmlFor="imageInput">Select New Image:</label>
                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        )}

                        {isEditing ? (
                            <>
                                <button onClick={handleSaveClick}>Save</button>
                                <button onClick={handleCancelClick}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={handleEditClick}>Edit</button>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default EditBlog;

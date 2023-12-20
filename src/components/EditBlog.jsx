import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';

const EditBlog = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://blog-spots-service.onrender.com/api/blogs/${id}`)
            .then(response => {
                setTitle(response.data.title);
                setSummary(response.data.summary);
                setContent(response.data.content);
            })
            .catch(error => {
                console.error('Error fetching blog details:', error);
                setError('Oops! Something went wrong. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm('Are you sure you want to update this blog?');

        if (isConfirmed) {
            console.log('Title:', title);
            console.log('Summary:', summary);
            console.log('Content:', content);

            axios.put(`https://blog-spots-service.onrender.com/api/blogs/content/${id}`, {
                title,
                summary,
                content,
            })
                .then(response => {
                    console.log('Blog updated successfully:', response.data);
                    alert('Blog updated successfully');
                    window.history.back();
                })
                .catch(error => {
                    console.error('Error updating blog:', error);
                    alert('Error updating blog. Please try again later.');
                });
        }
    };

    const handleSaveImage = () => {
        const imageFormData = new FormData();
        imageFormData.append('image', image);

        axios.put(`https://blog-spots-service.onrender.com/api/blogs/image/${id}`, imageFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Image saved successfully:', response.data);
                alert('Image updated successfully');
                window.history.back();
            })
            .catch(error => {
                console.error('Error saving image:', error);
                setError('Error saving image. Please try again later.');
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="top-bar">
                <div className="top-bar-content">
                    <h1>MingleMingle</h1>
                </div>
            </div>

            <div className="blog-container">
                <div className="admin-content">
                    <h3>Edit Blog</h3>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Summary:
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Image:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                        <br />
                        <button type="submit">Save Changes</button>
                        {image && (
                            <button type="button" onClick={handleSaveImage}>
                                Save Image
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;
